import { Store } from '../main.js';

export function render() {
    return `
        <main class="tracking-page">
            <div class="tracking-container">
                <div class="tracking-heading">
                    <span class="tag" style="display:inline-block; background:#3f6edb; color:white; padding:8px 14px; font-size:13px; font-weight:bold; letter-spacing:2px;">ORDER STATUS</span>
                    <h1 style="font-family:Georgia, serif; font-size:48px; color:#2d1d25; margin:18px 0 10px;">Track Your Order</h1>
                    <p style="color:#806d73;">Follow your bouquet from preparation to delivery.</p>
                </div>
                <div id="trackingContainer"></div>
            </div>
        </main>
    `;
}

// Module-level cache for instant navigation (Stale-While-Revalidate)
let cachedOrders = null;
let cachedUserEmail = null;

export function init(params) {
    const container = document.getElementById('trackingContainer');
    const selectedOrderId = params.get('orderId');
    const user = Store.getUser();
    
    if (!user || !user.email) {
        container.innerHTML = `<div class="tracking-box no-order" style="text-align:center; padding:50px;"><h2>Please login to track orders.</h2></div>`;
        return;
    }

    const renderTracking = (orders) => {
        let order = null;
        if (selectedOrderId) {
            order = orders.find(item => item.order_id === selectedOrderId);
        }
        if (!order && orders.length > 0) {
            order = orders[0]; // Fallback to latest
        }

        if (!order) {
            container.innerHTML = `
                <div class="tracking-box no-order" style="background:white; border:1px solid #eadfe2; border-radius:20px; padding:50px 20px; text-align:center;">
                    <h2 style="color:#2d1d25;">Order Not Found</h2>
                    <p style="color:#806d73;">The selected order could not be found.</p>
                    <a href="#/orders" style="display:inline-block; margin-top:20px; padding:13px 25px; border-radius:30px; background:#b52f62; color:white; font-weight:bold; text-decoration:none;">View My Orders</a>
                </div>
            `;
            return;
        }

        const status = order.status || "Order Placed";
        
        const getOrderItemsHTML = () => {
            if (!Array.isArray(order.items) || order.items.length === 0) return '';
            return order.items.map(item => `
                <div class="order-item" style="display:flex; justify-content:space-between; gap:15px; padding:8px 0; color:#806d73;">
                    <span>${item.name || "Bouquet"} x ${item.quantity || 1}</span>
                    <strong>₹${Number(item.price || 0) * Number(item.quantity || 1)}</strong>
                </div>
            `).join('');
        };

        if (status.includes("Cancel")) {
            container.innerHTML = `
                <div class="tracking-box" style="background:white; border:1px solid #eadfe2; border-radius:20px; padding:35px; box-shadow: 0 10px 30px rgba(80,35,55,0.08);">
                    <div class="order-info" style="text-align:center; padding-bottom:25px; border-bottom:1px solid #eee;">
                        <h2 style="color:#a8325d; margin-bottom:8px;">Order #${order.order_id}</h2>
                        <p style="color:#806d73;">Current Status: <strong style="color:#d9534f;">Cancelled</strong></p>
                    </div>
                    <div class="cancelled-message" style="margin-top:25px; padding:15px; border-radius:10px; background:#fde8e8; color:#d9534f; text-align:center; font-weight:bold;">
                        Your order has been cancelled successfully.
                    </div>
                    <a href="#/orders" class="orders-button" style="display:block; width:100%; margin-top:25px; padding:14px; border-radius:30px; background:#b52f62; color:white; font-weight:bold; text-align:center; text-decoration:none;">View My Orders</a>
                </div>
            `;
            return;
        }

        const statuses = ["Order Placed", "Preparing", "Out for Delivery", "Delivered"];
        let currentIndex = statuses.indexOf(status);
        if (currentIndex === -1) currentIndex = 0;

        let stepsHTML = statuses.map((item, index) => {
            let className = "";
            if (index < currentIndex) className = "completed";
            if (index === currentIndex) className = "current";
            
            const icon = index <= currentIndex ? "✔" : (index + 1);
            let desc = "";
            if (item === "Order Placed") desc = "Your order has been successfully placed.";
            else if (item === "Preparing") desc = "Your beautiful bouquet is being prepared.";
            else if (item === "Out for Delivery") desc = "Your bouquet is on the way.";
            else desc = "Your bouquet has been delivered.";

            const circleStyle = className === 'completed' ? 'background:#b52f62; color:white;' : 
                                className === 'current' ? 'background:#3f6edb; color:white;' : 
                                'background:#eadfe2; color:#806d73;';

            return `
                <div class="tracking-step ${className}" style="display:flex; gap:20px; margin-bottom:30px; position:relative;">
                    <div class="step-circle" style="width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold; z-index:2; flex-shrink:0; ${circleStyle}">${icon}</div>
                    <div class="step-content">
                        <h3 style="margin:0 0 5px; color:${className === 'completed' || className === 'current' ? '#2d1d25' : '#806d73'}; font-size:18px;">${item}</h3>
                        <p style="margin:0; color:#806d73; font-size:14px; line-height:1.5;">${desc}</p>
                    </div>
                </div>
            `;
        }).join("");

        container.innerHTML = `
            <div class="tracking-box" style="background:white; border:1px solid #eadfe2; border-radius:20px; padding:35px; box-shadow: 0 10px 30px rgba(80,35,55,0.08);">
                <div class="order-info" style="text-align:center; padding-bottom:25px; border-bottom:1px solid #eee;">
                    <h2 style="color:#a8325d; margin-bottom:8px;">Order #${order.order_id}</h2>
                    <p style="color:#806d73;">Payment: <strong style="color:#2d1d25;">${order.payment_method === 'UPI' ? 'UPI' : 'Cash on Delivery'}</strong></p>
                </div>
                
                <div class="order-summary" style="margin-top:20px; padding:20px; background:#faf7f8; border-radius:12px;">
                    <h3 style="margin-top:0; color:#2d1d25; font-size:16px;">Items Ordered</h3>
                    <div style="margin-top:15px;">
                        ${getOrderItemsHTML()}
                    </div>
                    <div class="order-total" style="display:flex; justify-content:space-between; margin-top:12px; padding-top:12px; border-top:1px solid #eadfe2; font-weight:bold; color:#a8325d;">
                        <span>Total</span>
                        <span>₹${Number(order.total || 0)}</span>
                    </div>
                </div>

                <div class="tracking-list" style="margin-top:35px;">
                    ${stepsHTML}
                </div>
                
                <a href="#/orders" class="orders-button" style="display:block; width:100%; margin-top:35px; padding:14px; border:none; border-radius:30px; background:#b52f62; color:white; font-size:16px; font-weight:bold; text-align:center; text-decoration:none; box-sizing:border-box;">View My Orders</a>
            </div>
        `;
    };

    // 1. Render instantly from cache if available
    if (cachedOrders && cachedUserEmail === user.email) {
        renderTracking(cachedOrders);
    }

    // 2. Fetch fresh data in the background and re-render quietly (Stale-While-Revalidate)
    fetch(`http://127.0.0.1:5000/api/orders?email=${encodeURIComponent(user.email)}`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                cachedOrders = data.orders || [];
                cachedUserEmail = user.email;
                renderTracking(cachedOrders);
            }
        })
        .catch(err => {
            if (!cachedOrders) {
                container.innerHTML = `<div style="text-align:center; padding:50px; color:red;">Cannot connect to server. Please make sure the backend server is running.</div>`;
            }
            
        });
}