import { Store, Utils } from '../main.js';

export function render() {
    return `
        <main class="ai-page">
            <section class="ai-header">
                <div class="ai-icon">✨</div>
                <h1>AI Bouquet Recommendation</h1>
                <p>Tell us your preferences and we'll suggest suitable bouquets.</p>
            </section>

            <section class="recommendation-box">
                <h2>Find Your Perfect Bouquet</h2>
                <div class="form-grid">
                    <div class="form-group">
                        <label for="occasion">Occasion</label>
                        <select id="occasion">
                            <option value="">Select Occasion</option>
                            <option value="birthday">Birthday</option>
                            <option value="anniversary">Anniversary</option>
                            <option value="wedding">Wedding</option>
                            <option value="love">Love / Romance</option>
                            <option value="friendship">Friendship</option>
                            <option value="congratulations">Congratulations</option>
                            <option value="general">General / Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="budget">Budget</label>
                        <select id="budget">
                            <option value="">Select Budget</option>
                            <option value="500">Up to ₹500</option>
                            <option value="700">Up to ₹700</option>
                            <option value="1000">Up to ₹1000</option>
                            <option value="1500">Up to ₹1500</option>
                            <option value="any">Any Budget</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="flower">Preferred Flower</label>
                        <select id="flower">
                            <option value="">Any Flower</option>
                            <option value="rose">Rose</option>
                            <option value="tulip">Tulip</option>
                            <option value="sunflower">Sunflower</option>
                            <option value="lily">Lily</option>
                            <option value="mixed">Mixed Flowers</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="color">Preferred Color</label>
                        <select id="color">
                            <option value="">Any Color</option>
                            <option value="red">Red</option>
                            <option value="pink">Pink</option>
                            <option value="yellow">Yellow</option>
                            <option value="purple">Purple</option>
                            <option value="white">White</option>
                            <option value="mixed">Mixed Colors</option>
                        </select>
                    </div>
                </div>
                <div class="form-group" style="margin-top: 20px;">
                    <label for="aiPrompt">Describe your ideal bouquet in your own words (Optional)</label>
                    <textarea id="aiPrompt" placeholder="e.g. I need something for my mom who loves purple and lilies..." style="width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; font-family: inherit; resize: vertical; min-height: 80px;"></textarea>
                </div>
                <button type="button" class="recommend-btn" id="recommendBtn" style="margin-top: 20px;">✨ Get AI Recommendations</button>
            </section>

            <div id="aiCardSection" style="display:none; background: var(--primary-faint); padding: 25px; border-radius: 12px; margin: 20px 0; border: 1px solid var(--primary-light);">
                <h3 style="margin-top:0; color: var(--primary); font-size: 18px;">✍️ AI Generated Greeting Card</h3>
                <p id="aiCardMessage" style="font-size: 16px; font-style: italic; color: var(--text-dark); margin: 0; line-height: 1.6;"></p>
            </div>

            <p id="recommendationMessage"></p>

            <section>
                <h2 class="results-title">Recommended Bouquets</h2>
                <div id="recommendations" class="recommendations"></div>
            </section>

            <div class="bottom-links">
                <a href="#/">Home</a>
                <a href="#/shop">Browse All Bouquets</a>
            </div>
        </main>
    `;
}

export function init() {
    const inventory = Store.getInventory(); 
    
    document.getElementById('recommendBtn').addEventListener('click', async (e) => {
        const occasion = document.getElementById('occasion').value;
        const budget = document.getElementById('budget').value;
        const flower = document.getElementById('flower').value;
        const color = document.getElementById('color').value;
        const prompt = document.getElementById('aiPrompt').value.trim();
        
        const msgEl = document.getElementById('recommendationMessage');
        const resultsEl = document.getElementById('recommendations');
        const aiCardSection = document.getElementById('aiCardSection');
        const aiCardMessage = document.getElementById('aiCardMessage');
        const btn = e.target;

        if (!occasion && !budget && !flower && !color && !prompt) {
            msgEl.textContent = "Please select at least one preference or describe what you need.";
            msgEl.style.color = "red";
            resultsEl.innerHTML = "";
            aiCardSection.style.display = "none";
            return;
        }

        btn.textContent = "🧠 AI is thinking...";
        btn.disabled = true;
        msgEl.textContent = "";
        resultsEl.innerHTML = "";
        aiCardSection.style.display = "none";

        try {
            const res = await fetch('http://127.0.0.1:5000/api/ai-picks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ occasion, budget, flower, color, prompt })
            });
            const data = await res.json();
            
            if (!data.success) throw new Error(data.error || "AI failed to respond.");

            const recommendedIds = data.recommended_ids || [];
            let filtered = inventory.filter(b => recommendedIds.includes(b.id));

            // Fallback if AI returned bad IDs
            if (filtered.length === 0) {
                filtered = inventory.filter(b => {
                    if (budget && budget !== "any" && b.price > Number(budget)) return false;
                    return true;
                }).slice(0, 3);
                msgEl.textContent = "AI couldn't find an exact match. Here are some great alternatives within budget.";
                msgEl.style.color = "#a8325d";
            } else {
                msgEl.textContent = "✨ Here are the top matches curated by our AI!";
                msgEl.style.color = "#008000";
            }

            if (data.greeting_message) {
                aiCardMessage.textContent = '"' + data.greeting_message + '"';
                aiCardSection.style.display = "block";
            }

            resultsEl.innerHTML = filtered.map(bouquet => {
                const imgPath = Utils.getImagePath(bouquet.image);
                return `
                <div class="bouquet-card">
                    <div class="bouquet-image">
                        <img src="${Utils.escapeHtml(imgPath)}" alt="${Utils.escapeHtml(bouquet.name)}" onerror="this.onerror=null; this.src='assets/images/bouquets/hero-bouquet.jpeg';">
                    </div>
                    <div class="bouquet-content">
                        <h3>${Utils.escapeHtml(bouquet.name)}</h3>
                        <div class="bouquet-price">₹${bouquet.price}</div>
                        <div class="bouquet-details" style="font-size:14px; margin-bottom:15px; color:#806d73;">
                            <strong>Flower:</strong> ${Utils.escapeHtml(bouquet.flower || 'Mixed')}<br>
                            <strong>Color:</strong> ${Utils.escapeHtml(bouquet.color || 'Mixed')}<br>
                            <strong>Category:</strong> ${Utils.escapeHtml(bouquet.category || 'General')}
                        </div>
                        <a href="#/shop?search=${encodeURIComponent(bouquet.name)}" class="select-bouquet-btn btn">
                            View in Shop
                        </a>
                    </div>
                </div>
                `;
            }).join('');
        } catch (err) {
            console.error(err);
            msgEl.textContent = "Server error. Please check if the backend is running.";
            msgEl.style.color = "red";
        } finally {
            btn.textContent = "✨ Get AI Recommendations";
            btn.disabled = false;
        }
    });
}