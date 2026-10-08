export function render() {
    return `
        <!-- HERO SECTION -->
        <section class="hero">
            <div class="hero-container">
                <div class="hero-content">
                    <p class="eyebrow">WELCOME TO ARNAVERSE</p>
                    <h1>Beautiful Flowers,<br><em>Beautiful Moments</em></h1>
                    <p class="hero-text">Discover beautiful bouquets for every special occasion.</p>
                    <div class="hero-buttons">
                        <a href="#/shop" class="btn btn-primary">
                            <i class="fa-solid fa-bag-shopping"></i> Shop Bouquets
                        </a>
                        <button class="btn btn-secondary" id="toggleSearchBtn" style="margin-left: 10px; padding: 15px 25px; border-radius: 30px; border: 1px solid #a8325d; color: #a8325d; background: transparent; cursor: pointer; font-weight: bold;">
                            <i class="fa-solid fa-magnifying-glass"></i> Search
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- SEARCH BOX (Hidden by default) -->
        <div class="search-wrapper" id="homeSearchBox" style="display: none; text-align: center; padding: 20px; background: white; border-bottom: 1px solid #f1dce5;">
            <div class="search-container" style="display: inline-flex; gap: 10px;">
                <input type="text" id="homeSearchInput" placeholder="Search bouquets..." style="padding: 12px 20px; border: 1px solid #ddd; border-radius: 30px; width: 300px; outline: none;">
                <button id="homeSearchGo" style="background: #a8325d; color: white; border: none; padding: 12px 25px; border-radius: 30px; cursor: pointer; font-weight: bold;">Search</button>
            </div>
        </div>

        <!-- HOW IT WORKS -->
        <section class="how-it-works" id="how-it-works">
            <div class="section-header">
                <p class="eyebrow">SIMPLE & EASY</p>
                <h2>How It <em>Works</em></h2>
            </div>
            <div class="steps-grid">
                <div class="step-card">
                    <div class="step-number">01</div>
                    <div class="step-icon"><i class="fa-solid fa-magnifying-glass"></i></div>
                    <h3>Browse</h3>
                    <p>Explore beautiful bouquets from our collection.</p>
                </div>
                <div class="step-card">
                    <div class="step-number">02</div>
                    <div class="step-icon"><i class="fa-solid fa-heart"></i></div>
                    <h3>Choose</h3>
                    <p>Choose the bouquet you like the most.</p>
                </div>
                <div class="step-card">
                    <div class="step-number">03</div>
                    <div class="step-icon"><i class="fa-solid fa-cart-shopping"></i></div>
                    <h3>Order</h3>
                    <p>Add your bouquet to cart and place your order.</p>
                </div>
                <div class="step-card">
                    <div class="step-number">04</div>
                    <div class="step-icon"><i class="fa-solid fa-truck"></i></div>
                    <h3>Delivered</h3>
                    <p>Receive your bouquet at your doorstep.</p>
                </div>
            </div>
        </section>

        <!-- ABOUT -->
        <section class="about" id="about">
            <div class="about-container">
                <div class="about-content">
                    <p class="eyebrow">ABOUT ARNAVERSE</p>
                    <h2>Smart Online Bouquet <em>Ordering System</em></h2>
                    <p>Arnaverse is a smart online bouquet ordering and management system that makes ordering beautiful bouquets simple and convenient.</p>
                    <p>Customers can browse bouquets, add products to their cart, place orders and manage their bouquet shopping easily.</p>
                </div>
            </div>
        </section>

        <!-- SMART RECOMMENDATION -->
        <section class="ai-section">
            <div class="ai-box">
                <div class="ai-icon"><i class="fa-solid fa-wand-magic-sparkles"></i></div>
                <p class="eyebrow">SMART RECOMMENDATION</p>
                <h2>Find Your Perfect <em>Bouquet</em></h2>
                <p>Get smart bouquet recommendations based on your preferences and occasion.</p>
                <a href="#/ai-recommendation" class="btn btn-primary">
                    <i class="fa-solid fa-wand-magic-sparkles"></i> Try AI Recommendations
                </a>
            </div>
        </section>
    `;
}

export function init() {
    const searchBtn = document.getElementById('toggleSearchBtn');
    const searchBox = document.getElementById('homeSearchBox');
    const searchInput = document.getElementById('homeSearchInput');
    const searchGo = document.getElementById('homeSearchGo');

    const executeSearch = () => {
        const query = searchInput.value.trim();
        if (query) {
            window.location.hash = `#/shop?search=${encodeURIComponent(query)}`;
        } else {
            window.location.hash = `#/shop`;
        }
    };

    searchBtn.addEventListener('click', () => {
        if (searchBox.style.display === 'none') {
            searchBox.style.display = 'block';
            searchInput.focus();
        } else {
            searchBox.style.display = 'none';
        }
    });

    searchGo.addEventListener('click', executeSearch);
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') executeSearch();
    });
}