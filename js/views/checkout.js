import { Store, Utils } from '../main.js';

export function render() {
    return `
        <main class="checkout-page">
            <div class="checkout-container">
                <div class="checkout-heading">
                    <span class="checkout-tag" style="display:inline-block; padding:8px 18px; background:var(--primary-light); color:var(--primary); border-radius:30px; font-size:13px; font-weight:700; letter-spacing:1.5px;">COMPLETE YOUR ORDER</span>
                    <h1>Check<span>out</span></h1>
                    <p>Enter your delivery details and place your order.</p>
                </div>
                
                <div id="checkoutContent">
                    <div class="checkout-grid">
                        <div>
                            <div class="checkout-card">
                                <h2><i class="fa-solid fa-location-dot"></i> Delivery Details</h2>
                                <form id="checkoutForm">
                                    <div class="form-group">
                                        <label for="fullName">Full Name</label>
                                        <input type="text" id="fullName" placeholder="Enter your full name" required>
                                    </div>
                                    <div class="form-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">
                                        <div class="form-group">
                                            <label for="phone">Phone Number</label>
                                            <input type="tel" id="phone" maxlength="10" placeholder="10-digit mobile number" required>
                                        </div>
                                        <div class="form-group">
                                            <label for="pincode">Pincode</label>
                                            <input type="text" id="pincode" maxlength="6" placeholder="6-digit pincode" required>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="address">Complete Address</label>
                                        <textarea id="address" placeholder="House no., street, area..." required></textarea>
                                    </div>
                                    <div class="form-group">
                                        <label for="city">City</label>
                                        <input type="text" id="city" placeholder="Enter your city" required>
                                    </div>
                                </form>
                            </div>

                            <div class="checkout-card" style="margin-top: 25px;">
                                <h2><i class="fa-solid fa-wallet"></i> Payment Method</h2>
                                <div class="payment-options">
                                    <label class="payment-option">
                                        <input type="radio" name="payment" value="COD" checked>
                                        <div>
                                            <strong>Cash on Delivery</strong><br>
                                            <span style="font-size:13px; color:var(--text-muted);">Pay when your bouquet is delivered.</span>
                                        </div>
                                    </label>
                                    </div>
                                <div id="upiBox" style="display:none; margin-top:15px; padding:15px; background:var(--bg-main); border-radius:12px;">
                                    <div class="form-group">
                                        <label for="upiId">UPI ID</label>
                                        <input type="text" id="upiId" placeholder="example@upi">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="checkout-card">
                            <h2><i class="fa-solid fa-bag-shopping"></i> Order Summary</h2>
                            <div class="summary-items" id="summaryItems"></div>
                            <div class="summary-row">
                                <span>Subtotal</span>
                                <strong id="subtotal">₹0</strong>
                            </div>
                            <div class="summary-row">
                                <span>Delivery</span>
                                <strong>₹50</strong>
                            </div>
                            <div class="summary-total">
                                <span>Total</span>
                                <strong id="total">₹0</strong>
                            </div>
                            <button type="button" id="placeOrderBtn" class="place-order-btn" style="width:100%; margin-top:20px;">
                                Place Order <i class="fa-solid fa-arrow-right"></i>
                            </button>
                            <div id="checkoutMessage" style="margin-top:15px; text-align:center; font-weight:bold;"></div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    `;
}

export function init() {
    const cart = Store.getCart();
    const contentBox = document.getElementById('checkoutContent');

    if (cart.length === 0) {
        contentBox.innerHTML = `
            <div class="empty-checkout" style="max-width:650px; margin:20px auto; background:white; padding:60px 30px; text-align:center; border-radius:20px;">
                <div style="font-size:55px; margin-bottom:15px;">🛍️</div>
                <h2>Your Cart is Empty</h2>
                <p>Please add a bouquet before checkout.</p>
                <a href="#/shop" class="btn" style="margin-top:25px;">Browse Bouquets</a>
            </div>
        `;
        return;
    }

    const user = Store.getUser();
    if (user) {
        document.getElementById('fullName').value = user.name || "";
        document.getElementById('phone').value = user.phone || "";
        document.getElementById('address').value = user.address || "";
        document.getElementById('city').value = user.city || "";
    }



    let subtotal = 0;
    const summaryEl = document.getElementById('summaryItems');
    
    summaryEl.innerHTML = cart.map(item => {
        const qty = Number(item.quantity || 1);
        const price = Number(item.price || 0);
        subtotal += (price * qty);
        const imgPath = Utils.getImagePath(item.image);
        return `
            <div class="summary-item" style="display:flex; align-items:center; gap:12px; padding:13px 0; border-bottom:1px solid var(--border-color);">
                <img src="${Utils.escapeHtml(imgPath)}" alt="${Utils.escapeHtml(item.name)}" style="width:65px; height:65px; border-radius:10px; object-fit:cover; background:var(--primary-faint);" onerror="this.onerror=null; this.src='assets/images/bouquets/hero-bouquet.jpeg';">
                <div style="flex:1;">
                    <div style="color:var(--text-dark); font-weight:700;">${Utils.escapeHtml(item.name)}</div>
                    <div style="color:var(--text-muted); font-size:13px;">Qty: ${qty}</div>
                </div>
                <div style="color:var(--primary); font-weight:700;">₹${price * qty}</div>
            </div>
        `;
    }).join('');

    const delivery = 50;
    const total = subtotal + delivery;
    document.getElementById('subtotal').textContent = `₹${subtotal}`;
    document.getElementById('total').textContent = `₹${total}`;

    document.getElementById('placeOrderBtn').addEventListener('click', () => {
        const fullName = document.getElementById('fullName').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const address = document.getElementById('address').value.trim();
        const city = document.getElementById('city').value.trim();
        const pincode = document.getElementById('pincode').value.trim();
        const payment = document.querySelector('input[name="payment"]:checked').value;
        const upiId = document.getElementById('upiId').value.trim();
        const msg = document.getElementById('checkoutMessage');

        if (!fullName || !phone || !address || !city || !pincode) {
            msg.textContent = "Please fill all delivery details."; msg.style.color = "#d9534f"; return;
        }
        if (!/^[0-9]{10}$/.test(phone)) {
            msg.textContent = "Enter a valid 10-digit phone number."; msg.style.color = "#d9534f"; return;
        }


        let inventory = Store.getInventory();
        let stockError = false;

        cart.forEach(cartItem => {
            const bouquet = inventory.find(b => String(b.id) === String(cartItem.id));
            if (bouquet && Number(bouquet.stock) < Number(cartItem.quantity)) {
                stockError = true;
                msg.textContent = `${cartItem.name} has only ${bouquet.stock} item(s) available.`;
                msg.style.color = "#d9534f";
            }
        });

        if (stockError) return;

        cart.forEach(cartItem => {
            const index = inventory.findIndex(b => String(b.id) === String(cartItem.id));
            if (index !== -1) {
                inventory[index].stock = Math.max(0, inventory[index].stock - Number(cartItem.quantity));
            }
        });
        
        Store.saveInventory(inventory);

        const newOrder = {
            order_id: "ARN" + Date.now(),
            customer_email: user ? user.email : "",
            total: total,
            status: "Order Placed",
            payment_method: payment,
            items: cart
        };
        
        // Update user profile with latest checkout details
        if (user && user.email) {
            fetch('http://127.0.0.1:5000/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: user.email,
                    name: fullName,
                    phone: phone,
                    address: address,
                    city: city
                })
            }).catch(e => console.error("Profile update failed:", e));
        }

        fetch('http://127.0.0.1:5000/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newOrder)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                Store.setCart([]);
                const orderDataToSave = {
                    orderId: newOrder.order_id,
                    name: fullName,
                    phone: phone,
                    address: address,
                    city: city,
                    paymentMethod: payment,
                    total: total,
                    items: cart
                };
                localStorage.setItem("arnaverseOrder", JSON.stringify(orderDataToSave));
                window.location.hash = '#/order-confirmation';
            } else {
                msg.textContent = data.message || "Failed to place order.";
                msg.style.color = "#d9534f";
            }
        })
        .catch(err => {
            console.error(err);
            msg.textContent = "Error placing order. Try again later.";
            msg.style.color = "#d9534f";
        });
    });
};
