import { Store, Utils } from '../main.js';

export function render() {
    return `
        <div class="orders-container">
            <h1 class="page-title" style="text-align:center; color:var(--primary); margin-bottom:30px;">My Orders</h1>
            <div id="ordersContainer"></div>
        </div>
    `;
}

// Module-level cache for instant navigation (Stale-While-Revalidate)
let cachedOrders = null;
let cachedUserEmail = null;

export function init() {
    const container = document.getElementById('ordersContainer');
    
    const getStatusClass = (status) => {
        const s = (status || "").toLowerCase();
        if (s.includes("cancel")) return "status-cancelled";
        if (s.includes("deliver")) return "status-delivered";
        if (s.includes("prepar")) return "status-preparing";
        return "status-placed";
    };

    const renderOrders = (orders) => {
        if (!orders || orders.length === 0) {
            container.innerHTML = `
                <div class="no-orders card" style="text-align:center; padding:40px;">
                    <h2 style="color:var(--text-dark);">No Orders Yet</h2>
                    <p style="color:var(--text-muted);">You haven't placed any orders yet.</p>
                    <a href="#/shop" class="btn" style="margin-top:15px;">Shop Bouquets</a>
                </div>
            `;
            return;
        }

        container.innerHTML = orders.map(order => {
            const status = order.status || "Order Placed";
            const statusClass = getStatusClass(status);
            const items = Array.isArray(order.items) ? order.items : [];
            
            const itemsHTML = items.map(item => {
                const itemName = item.name || "Bouquet";
                const imgPath = Utils.getImagePath(item.image);
                const quantity = Number(item.quantity) || 1;
                const price = Number(item.price) || 0;
                
                return `
                    <div class="order-item" style="display:flex; align-items:center; gap:20px; padding:15px 0; border-bottom:1px solid var(--border-color);">
                        <img src="${Utils.escapeHtml(imgPath)}" alt="${Utils.escapeHtml(itemName)}" style="width:90px; height:90px; object-fit:cover; border-radius:12px; background:var(--primary-faint);" onerror="this.onerror=null; this.src='assets/images/bouquets/hero-bouquet.jpeg';">
                        <div style="flex:1;">
                            <div style="font-weight:bold; font-size:17px; color:var(--text-dark); margin-bottom:5px;">${Utils.escapeHtml(itemName)}</div>
                            <div style="color:var(--text-muted); font-size:14px; margin-bottom:5px;">Quantity: ${quantity}</div>
                            <div style="color:var(--primary); font-weight:bold;">₹${price}</div>
                        </div>
                    </div>
                `;
            }).join("");

            const isCancelled = status.toLowerCase().includes("cancel");
            const dateStr = Utils.formatDate(order.created_at);

            return `
                <div class="order-card">
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; border-bottom:1px solid var(--border-color); padding-bottom:15px;">
                        <div style="font-weight:bold; color:var(--text-dark);">Order ID: ${order.order_id || "N/A"}</div>
                        <div style="color:var(--text-muted); font-size:14px;">${dateStr}</div>
                    </div>
                    <div><span class="status ${statusClass}" style="margin-top:10px;">${status}</span></div>
                    
                    <div style="margin-top:25px; color:var(--primary); font-size:18px; font-weight:bold;">Ordered Bouquets</div>
                    ${itemsHTML}
                    
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px; flex-wrap:wrap; gap:15px;">
                        <div style="color:var(--text-muted);">Payment: <strong>${order.payment_method === 'UPI' ? 'UPI Payment' : 'Cash on Delivery'}</strong></div>
                        <div style="font-size:20px; font-weight:bold; color:var(--primary);">Total: ₹${Number(order.total) || 0}</div>
                    </div>
                    <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:20px;">
                        <a href="#/order-tracking?orderId=${encodeURIComponent(order.order_id || "")}" class="btn">Track Order</a>
                        ${isCancelled ? `<span style="color:var(--danger); font-weight:bold; padding:11px 0;">Order Cancelled</span>` 
                                      : `<button class="cancel-order-btn btn-secondary" data-id="${order.order_id}">Cancel Order</button>`}
                    </div>
                </div>
            `;
        }).join("");

        // Add event listeners for cancel buttons AFTER rendering
        document.querySelectorAll('.cancel-order-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if(confirm("Are you sure you want to cancel this order?")) {
                    cancelOrder(e.target.dataset.id);
                }
            });
        });
    };

    const loadOrders = () => {
        const user = Store.getUser();
        if (!user || !user.email) {
            container.innerHTML = `<div class="no-orders card" style="text-align:center; padding:40px;"><h2>Please login to view orders.</h2></div>`;
            return;
        }

        // Render from cache instantly if available for this exact user
        if (cachedOrders && cachedUserEmail === user.email) {
            renderOrders(cachedOrders);
        } else {
            container.innerHTML = `<div style="text-align:center; padding:40px; color:var(--text-muted);">Loading your orders...</div>`;
        }

        // Fetch fresh data in the background (Stale-While-Revalidate)
        fetch(`http://127.0.0.1:5000/api/orders?email=${encodeURIComponent(user.email)}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    cachedOrders = data.orders || [];
                    cachedUserEmail = user.email;
                    renderOrders(cachedOrders);
                } else if (!cachedOrders) {
                    container.innerHTML = `
                        <div class="no-orders card" style="text-align:center; padding:40px;">
                            <h2 style="color:var(--text-dark);">No Orders Yet</h2>
                            <p style="color:var(--text-muted);">You haven't placed any orders yet.</p>
                            <a href="#/shop" class="btn" style="margin-top:15px;">Shop Bouquets</a>
                        </div>
                    `;
                }
            })
            .catch(err => {
                if (!cachedOrders) {
                    container.innerHTML = `<div style="text-align:center; padding:40px; color:#d9534f;">Cannot connect to server. Please make sure the backend server is running.</div>`;
                }
                
            });
    };

    const cancelOrder = (orderId) => {
        fetch('http://127.0.0.1:5000/api/orders', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order_id: orderId, status: "Cancelled" })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("Your order has been cancelled.");
                // Update cache directly to avoid fetching again just for a status update
                if (cachedOrders) {
                    const idx = cachedOrders.findIndex(o => o.order_id === orderId);
                    if (idx !== -1) cachedOrders[idx].status = "Cancelled";
                }
                loadOrders(); // Re-render instantly
            } else {
                alert("Failed to cancel order.");
            }
        })
        .catch(err => {
            alert("Error cancelling order.");
            
        });
    };

    loadOrders();
}