import { Store, Utils } from '../main.js';

export function render() {
    return `
        <main class="customize-section">
            <div class="customize-container">
                <div class="customize-heading">
                    <h1>CUSTOMIZE YOUR BOUQUET</h1>
                    <p>Create a bouquet made just for you.</p>
                </div>

                <div class="customize-card">
                    <div class="customize-layout">
                        <!-- LEFT SIDE PREVIEW -->
                        <div class="bouquet-preview">
                            <h2>Bouquet Preview</h2>
                            <div id="previewContainer">
                                <div class="preview-placeholder">ðŸŒ¸</div>
                            </div>
                            <div class="preview-name" id="previewName" style="margin-top:15px; font-size:18px; font-weight:700; color:var(--primary);">Your Custom Bouquet</div>
                        </div>

                        <!-- RIGHT SIDE OPTIONS -->
                        <div>
                            <div class="customize-group" style="margin-bottom:30px;">
                                <h2 style="font-size:18px; margin-bottom:15px;">CHOOSE FLOWERS</h2>
                                <div class="options">
                                    <label class="option-label"><input type="radio" name="flower" value="Roses" data-price="450" checked><span class="option-box">Roses</span></label>
                                    <label class="option-label"><input type="radio" name="flower" value="Tulips" data-price="500"><span class="option-box">Tulips</span></label>
                                    <label class="option-label"><input type="radio" name="flower" value="Lilies" data-price="550"><span class="option-box">Lilies</span></label>
                                    <label class="option-label"><input type="radio" name="flower" value="Mixed Flowers" data-price="600"><span class="option-box">Mixed Flowers</span></label>
                                </div>
                            </div>

                            <div class="customize-group" style="margin-bottom:30px;">
                                <h2 style="font-size:18px; margin-bottom:15px;">BOUQUET SIZE</h2>
                                <div class="options">
                                    <label class="option-label"><input type="radio" name="size" value="Small" data-price="0" checked><span class="option-box">Small</span></label>
                                    <label class="option-label"><input type="radio" name="size" value="Medium" data-price="50"><span class="option-box">Medium +₹50</span></label>
                                    <label class="option-label"><input type="radio" name="size" value="Large" data-price="100"><span class="option-box">Large +₹100</span></label>
                                </div>
                            </div>

                            <div class="customize-group" style="margin-bottom:30px;">
                                <h2 style="font-size:18px; margin-bottom:15px;">RIBBON</h2>
                                <div class="options">
                                    <label class="option-label"><input type="radio" name="ribbon" value="Pink" data-price="0" checked><span class="option-box">Pink</span></label>
                                    <label class="option-label"><input type="radio" name="ribbon" value="Red" data-price="25"><span class="option-box">Red +₹25</span></label>
                                    <label class="option-label"><input type="radio" name="ribbon" value="Purple" data-price="25"><span class="option-box">Purple +₹25</span></label>
                                </div>
                            </div>

                            <div class="customize-group" style="margin-bottom:30px;">
                                <h2 style="font-size:18px; margin-bottom:15px;">ADD CARD</h2>
                                <div class="options">
                                    <label class="option-label"><input type="radio" name="card" value="Yes" data-price="50"><span class="option-box">Yes +₹50</span></label>
                                    <label class="option-label"><input type="radio" name="card" value="No" data-price="0" checked><span class="option-box">No</span></label>
                                </div>
                            </div>

                            <div class="price-box">
                                <span class="price-label" style="font-weight:600;">PRICE:</span>
                                <span class="price-value" id="totalPrice">₹0</span>
                            </div>

                            <button type="button" class="add-cart-btn" id="addToCartBtn" style="width:100%; margin-top:20px;">
                                ADD TO CART
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    `;
}

export function init() {
    const bouquetImages = {
        "Roses": "assets/images/bouquets/red-rose-bouquet.jpeg",
        "Tulips": "assets/images/bouquets/pink-tulip-bouquet.jpeg",
        "Lilies": "assets/images/bouquets/purple-lily-bouquet.jpeg",
        "Mixed Flowers": "assets/images/bouquets/purple-mixed-bouquet.jpeg"
    };

    const allOptions = document.querySelectorAll('.option-label input');
    const totalPriceElement = document.getElementById('totalPrice');
    const previewContainer = document.getElementById('previewContainer');
    const previewName = document.getElementById('previewName');

    const calculatePrice = () => {
        const flower = document.querySelector('input[name="flower"]:checked');
        const size = document.querySelector('input[name="size"]:checked');
        const ribbon = document.querySelector('input[name="ribbon"]:checked');
        const card = document.querySelector('input[name="card"]:checked');

        const total = Number(flower?.dataset.price || 0) + 
                      Number(size?.dataset.price || 0) + 
                      Number(ribbon?.dataset.price || 0) + 
                      Number(card?.dataset.price || 0);

        totalPriceElement.textContent = `₹${total}`;
        return total;
    };

    const updatePreview = () => {
        const flower = document.querySelector('input[name="flower"]:checked')?.value;
        if (!flower) return;

        const imagePath = bouquetImages[flower];
        previewContainer.innerHTML = `<img src="${imagePath}" alt="${flower} Bouquet" class="preview-image" onerror="this.onerror=null; this.src='assets/images/bouquets/hero-bouquet.jpeg';">`;
        previewName.textContent = `${flower} Bouquet`;
    };

    allOptions.forEach(option => {
        option.addEventListener('change', () => {
            calculatePrice();
            updatePreview();
        });
    });

    document.getElementById('addToCartBtn').addEventListener('click', () => {
        const flower = document.querySelector('input[name="flower"]:checked')?.value;
        const size = document.querySelector('input[name="size"]:checked')?.value;
        const ribbon = document.querySelector('input[name="ribbon"]:checked')?.value;
        const card = document.querySelector('input[name="card"]:checked')?.value;

        if (!flower || !size || !ribbon || !card) {
            alert("Please select all bouquet options."); return;
        }

        const total = calculatePrice();
        const bouquetImage = bouquetImages[flower];
        const customId = `custom-${flower}-${size}-${ribbon}-${card}`.toLowerCase().replace(/\s+/g, '-');

        let cart = Store.getCart();
        const existingItem = cart.find(item => item.id === customId);

        if (existingItem) {
            existingItem.quantity = Number(existingItem.quantity || 1) + 1;
        } else {
            cart.push({
                id: customId,
                name: `Custom ${flower} Bouquet`,
                category: 'Customized Bouquet',
                price: total,
                image: bouquetImage,
                quantity: 1,
                customization: { flower, size, ribbon, card }
            });
        }

        Store.setCart(cart);
        alert(`Custom ${flower} Bouquet added to cart successfully!`);
        window.location.hash = '#/cart';
    });

    calculatePrice();
    updatePreview();
}