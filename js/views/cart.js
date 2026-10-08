

import { Store, Utils } from '../main.js';



export function render() {

    return `

        <main class="cart-page">

            <div class="cart-container">

                <div class="page-heading">

                    <p class="eyebrow">YOUR SHOPPING BAG</p>

                    <h1>My <em>Cart</em></h1>

                    <p>Review your selected bouquets before checkout.</p>

                </div>

                

                <div class="cart-layout">

                    <section class="cart-items-box">

                        <div class="cart-box-title" style="display:flex; justify-content:space-between; border-bottom:1px solid var(--border-color); padding-bottom:15px; margin-bottom:15px;">

                            <h2>Your Bouquets</h2>

                            <span class="items-count" id="itemsCount">0 items</span>

                        </div>

                        <div id="cartContainer"></div>

                    </section>



                    <aside class="cart-summary">

                        <h2 class="summary-title">Order Summary</h2>

                        <div class="summary-row">

                            <span>Subtotal</span>

                            <strong id="cartSubtotal">₹0</strong>

                        </div>

                        <div class="summary-row">

                            <span>Delivery</span>

                            <strong id="deliveryCharge">₹50</strong>

                        </div>

                        <div class="summary-total">

                            <span>Total</span>

                            <strong id="cartTotal">₹0</strong>

                        </div>

                        <button type="button" class="checkout-btn" id="checkoutBtn" style="width:100%; margin-top:20px;">

                            Proceed to Checkout

                        </button>

                        <a href="#/shop" class="continue-shopping" style="display:block; text-align:center; margin-top:15px; color:var(--primary); font-weight:bold;">

                            Continue Shopping

                        </a>

                    </aside>

                </div>

            </div>

        </main>

    `;

}



export function init() {

    const DELIVERY_CHARGE = 50;

    const container = document.getElementById('cartContainer');

    const itemsCountEl = document.getElementById('itemsCount');

    const subtotalEl = document.getElementById('cartSubtotal');

    const totalEl = document.getElementById('cartTotal');

    

    const renderCart = () => {

        const cart = Store.getCart();

        

        if (cart.length === 0) {

            itemsCountEl.textContent = "0 items";

            container.innerHTML = `

                <div class="empty-cart" style="text-align:center; padding:40px 20px;">

                    <div class="empty-icon" style="font-size:45px; margin-bottom:15px;">🛒</div>

                    <h2>Your Cart is Empty</h2>

                    <p>You haven't added any bouquets yet.</p>

                    <a href="#/shop" class="btn" style="margin-top:20px;">Shop Bouquets</a>

                </div>

            `;

            subtotalEl.textContent = "₹0";

            totalEl.textContent = "₹0";

            return;

        }



        let totalItems = 0;

        let subtotal = 0;



        container.innerHTML = cart.map((item, index) => {

            const quantity = Number(item.quantity || 1);

            const price = Number(item.price || 0);

            const itemTotal = price * quantity;

            const imgPath = Utils.getImagePath(item.image);

            

            totalItems += quantity;

            subtotal += itemTotal;



            return `

                <div class="cart-item">

                    <div class="cart-item-image">

                        <img src="${Utils.escapeHtml(imgPath)}" alt="${Utils.escapeHtml(item.name)}" onerror="this.onerror=null; this.src='assets/images/bouquets/hero-bouquet.jpeg';">

                    </div>

                    <div class="cart-item-info">

                        <div class="cart-item-category" style="font-size:12px; color:var(--primary); font-weight:bold; text-transform:uppercase;">${Utils.escapeHtml(item.category || "Bouquet")}</div>

                        <h3 class="cart-item-name">${Utils.escapeHtml(item.name)}</h3>
                        ${item.customization ? `
                        <div style="font-size: 13px; color: var(--text-muted); margin: 6px 0;">
                            <div><strong>Flower:</strong> ${Utils.escapeHtml(item.customization.flower || '')}</div>
                            <div><strong>Size:</strong> ${Utils.escapeHtml(item.customization.size || '')}</div>
                            <div><strong>Ribbon:</strong> ${Utils.escapeHtml(item.customization.ribbon || '')}</div>
                            <div><strong>Add Card:</strong> ${Utils.escapeHtml(item.customization.card || '')}</div>
                        </div>
                        ` : ''}
                        <div class="cart-item-price" style="font-weight:bold; color:var(--text-dark);">₹${price}</div>

                        

                        <div class="quantity-control">

                            <button type="button" class="qty-btn" data-index="${index}" data-change="-1">-</button>

                            <span class="quantity-value">${quantity}</span>

                            <button type="button" class="qty-btn" data-index="${index}" data-change="1">+</button>

                        </div>

                    </div>

                    <div class="cart-item-right">

                        <div class="item-total" style="font-weight:bold; font-size:18px;">₹${itemTotal}</div>

                        <button type="button" class="remove-btn" data-index="${index}">Remove</button>

                    </div>

                </div>

            `;

        }).join('');



        itemsCountEl.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''}`;

        subtotalEl.textContent = `₹${subtotal}`;

        totalEl.textContent = `₹${subtotal + DELIVERY_CHARGE}`;



        document.querySelectorAll('.qty-btn').forEach(btn => {

            btn.addEventListener('click', (e) => {

                const index = e.target.dataset.index;

                const change = Number(e.target.dataset.change);

                changeQuantity(index, change);

            });

        });



        document.querySelectorAll('.remove-btn').forEach(btn => {

            btn.addEventListener('click', (e) => {

                removeItem(e.target.dataset.index);

            });

        });

    };



    const changeQuantity = (index, change) => {

        let cart = Store.getCart();

        if (!cart[index]) return;

        cart[index].quantity += change;

        if (cart[index].quantity <= 0) cart.splice(index, 1);

        Store.setCart(cart);

        renderCart();

    };



    const removeItem = (index) => {

        let cart = Store.getCart();

        if (!cart[index]) return;

        cart.splice(index, 1);

        Store.setCart(cart);

        renderCart();

    };



    document.getElementById('checkoutBtn').addEventListener('click', () => {

        if (Store.getCart().length === 0) {

            alert("Your cart is empty. Please add a bouquet first.");

            return;

        }

        window.location.hash = '#/checkout';

    });



    renderCart();

}