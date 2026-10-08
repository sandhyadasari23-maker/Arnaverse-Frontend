import { Utils } from '../main.js';



export function render() {

    return `

        <main class="confirmation-page">

            <div class="confirmation-container" id="confirmationContent">

                <!-- Content injected here -->

            </div>

        </main>

    `;

}



export function init() {

    const container = document.getElementById('confirmationContent');

    let order = null;

    try { order = JSON.parse(localStorage.getItem("arnaverseOrder")); } catch (err) {}



    if (!order) {

        container.innerHTML = `

            <div class="no-order card" style="text-align:center; padding:50px 30px;">

                <h2>No Order Found</h2>

                <p style="color:var(--text-muted); margin-bottom:20px;">Please place an order first.</p>

                <a href="#/shop" class="btn">Browse Bouquets</a>

            </div>

        `;

        return;

    }



    const itemsHTML = (order.items || []).map(item => {

        const qty = Number(item.quantity) || 1;

        const price = Number(item.price) || 0;

        const imgPath = Utils.getImagePath(item.image);

        

        return `

            <div class="order-item" style="display:flex; align-items:center; gap:15px; padding:15px 0; border-bottom:1px solid var(--border-color);">

                <div class="item-image" style="width:75px; height:75px; border-radius:12px; overflow:hidden; background:var(--primary-faint); flex-shrink:0;">

                    <img src="${Utils.escapeHtml(imgPath)}" alt="${Utils.escapeHtml(item.name || 'Bouquet')}" style="width:100%; height:100%; object-fit:cover;" onerror="this.onerror=null; this.src='assets/images/bouquets/hero-bouquet.jpeg';">

                </div>

                <div class="item-info" style="flex:1;">

                    <h3 style="margin:0 0 5px; color:var(--text-dark); font-size:17px;">${Utils.escapeHtml(item.name || 'Bouquet')}</h3>

                    <p style="margin:0; color:var(--text-muted); font-size:14px;">Quantity: ${qty}</p>

                </div>

                <div class="item-price" style="color:var(--primary); font-weight:bold;">₹${price * qty}</div>

            </div>

        `;

    }).join('');



    const paymentText = order.paymentMethod === 'UPI' ? 'UPI Payment' : 'Cash on Delivery';



    container.innerHTML = `

        <section class="success-box card" style="text-align:center; padding:45px 30px; margin-bottom:30px;">

            <div class="success-icon" style="width:80px; height:80px; margin:0 auto 20px; display:flex; align-items:center; justify-content:center; border-radius:50%; background:var(--success-bg); color:var(--success); font-size:38px;"><i class="fa-solid fa-check"></i></div>

            <h1 style="margin:10px 0; font-family:Georgia, serif; font-size:42px; color:var(--text-dark);">Order Placed Successfully!</h1>

            <p style="color:var(--text-muted); font-size:17px;">Thank you for ordering from Arnaverse.</p>

            <div class="order-id" style="margin-top:18px; color:var(--primary); font-weight:bold; font-size:18px;">Order ID: ${Utils.escapeHtml(order.orderId)}</div>

        </section>



        <section class="order-card card" style="padding:30px; margin-bottom:25px;">

            <h2 style="margin-top:0; margin-bottom:22px; font-size:24px;">Delivery Details</h2>

            <div class="details-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">

                <div style="background:var(--bg-main); border:1px solid var(--border-color); border-radius:12px; padding:15px;">

                    <span style="display:block; color:var(--text-muted); font-size:13px; margin-bottom:5px;">Full Name</span>

                    <strong style="color:var(--text-dark); font-size:15px;">${Utils.escapeHtml(order.name || "-")}</strong>

                </div>

                <div style="background:var(--bg-main); border:1px solid var(--border-color); border-radius:12px; padding:15px;">

                    <span style="display:block; color:var(--text-muted); font-size:13px; margin-bottom:5px;">Phone Number</span>

                    <strong style="color:var(--text-dark); font-size:15px;">${Utils.escapeHtml(order.phone || "-")}</strong>

                </div>

                <div style="background:var(--bg-main); border:1px solid var(--border-color); border-radius:12px; padding:15px;">

                    <span style="display:block; color:var(--text-muted); font-size:13px; margin-bottom:5px;">Address</span>

                    <strong style="color:var(--text-dark); font-size:15px;">${Utils.escapeHtml(order.address || "-")}</strong>

                </div>

                <div style="background:var(--bg-main); border:1px solid var(--border-color); border-radius:12px; padding:15px;">

                    <span style="display:block; color:var(--text-muted); font-size:13px; margin-bottom:5px;">Payment Method</span>

                    <strong style="color:var(--text-dark); font-size:15px;">${paymentText}</strong>

                </div>

            </div>

        </section>



        <section class="order-card card" style="padding:30px; margin-bottom:25px;">

            <h2 style="margin-top:0; margin-bottom:22px; font-size:24px;">Ordered Bouquets</h2>

            ${itemsHTML}

            <div class="price-total" style="display:flex; justify-content:space-between; margin-top:12px; padding-top:18px; border-top:1px solid var(--border-color); font-size:22px; font-weight:bold;">

                <span>Total</span>

                <strong style="color:var(--primary);">₹${order.total || 0}</strong>

            </div>

        </section>



        <div class="confirmation-buttons" style="display:flex; justify-content:center; gap:15px; flex-wrap:wrap; margin-top:30px;">

            <a href="#/orders" class="btn"><i class="fa-solid fa-box"></i> My Orders</a>

            <a href="#/order-tracking?orderId=${order.orderId}" class="btn"><i class="fa-solid fa-location-dot"></i> Track Order</a>

            <a href="#/shop" class="btn btn-secondary"><i class="fa-solid fa-bag-shopping"></i> Continue Shopping</a>

        </div>

    `;

}