import { Store, Utils } from '../../main.js';





export function render() {


    return `


        <header class="admin-header">


            <div>


                <h2 style="margin: 0; color: var(--primary);">Manage Orders</h2>


                <p style="margin: 5px 0 0; color: var(--text-muted);">Update customer order statuses.</p>


            </div>


        </header>


        <main class="admin-container">


            <section class="orders-card card" style="padding: 25px;">


                <div id="adminOrdersContainer"></div>


            </section>


        </main>


    `;


}





// Module-level cache for instant navigation


let cachedManageOrders = JSON.parse(localStorage.getItem("arnaverse_admin_orders")) || null;





export function init() {


    const container = document.getElementById('adminOrdersContainer');


    


    const getStatusBadge = (status) => {


        let bg = "var(--warning-bg)", color = "var(--warning)";


        if (status === "Preparing") { bg = "var(--info-bg)"; color = "var(--info)"; }


        if (status === "Out for Delivery") { bg = "var(--info-bg)"; color = "var(--info)"; }


        if (status === "Delivered") { bg = "var(--success-bg)"; color = "var(--success)"; }


        if (status === "Cancelled") { bg = "var(--danger-bg)"; color = "var(--danger)"; }


        return `<span style="background: ${bg}; color: ${color}; padding: 7px 12px; border-radius: 20px; font-size: 13px; font-weight: 600;">${status}</span>`;


    };





    const loadAdminOrders = () => {


        const renderData = (orders) => {


            if (orders.length === 0) {


                container.innerHTML = `<div style="text-align: center; padding: 50px; color: var(--text-muted);"><h2>No Orders Found</h2></div>`;


                return;


            }





            container.innerHTML = orders.map(order => {


                    const itemsHTML = (order.items || []).map(item => {


                        const imgPath = Utils.getImagePath(item.image);


                        return `


                        <div style="display: flex; align-items: center; gap: 15px; padding: 12px 0; border-bottom: 1px solid var(--border-color);">


                            <img src="${Utils.escapeHtml(imgPath)}" alt="${Utils.escapeHtml(item.name)}" style="width: 75px; height: 75px; object-fit: cover; border-radius: 10px; flex-shrink: 0;" onerror="this.onerror=null; this.src='assets/images/bouquets/hero-bouquet.jpeg';">


                            <div style="flex: 1;">


                                <div style="font-weight: 700; color: var(--text-dark);">${Utils.escapeHtml(item.name || 'Bouquet')}</div>
                                ${item.customization ? `
                                <div style="font-size: 13px; color: var(--text-muted); margin: 6px 0;">
                                    <div><strong>Flower:</strong> ${Utils.escapeHtml(item.customization.flower || '')}</div>
                                    <div><strong>Size:</strong> ${Utils.escapeHtml(item.customization.size || '')}</div>
                                    <div><strong>Ribbon:</strong> ${Utils.escapeHtml(item.customization.ribbon || '')}</div>
                                    <div><strong>Add Card:</strong> ${Utils.escapeHtml(item.customization.card || '')}</div>
                                </div>
                                ` : ''}
                                <div style="color: var(--text-muted); font-size: 14px;">Qty: ${item.quantity || 1}</div>


                            </div>


                            <div style="color: var(--primary); font-weight: 700;">₹${Number(item.price || 0) * Number(item.quantity || 1)}</div>


                        </div>


                        `;


                    }).join('');





                    const currentStatus = order.status || "Order Placed";





                    return `


                        <div style="border: 1px solid var(--border-color); border-radius: 12px; margin-bottom: 20px; overflow: hidden; background: white;">


                            <div style="background: var(--primary-faint); padding: 18px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">


                                <div>


                                    <div style="color: var(--primary); font-weight: 700; font-size: 17px;">Order ID: ${order.order_id}</div>


                                    <div style="color: var(--text-muted); font-size: 14px; margin-top: 5px;">${Utils.formatDate(order.created_at)}</div>


                                </div>


                                ${getStatusBadge(currentStatus)}


                            </div>


                            <div style="padding: 20px;">


                                <h3 style="color: var(--primary); margin-top: 0; margin-bottom: 10px; font-size:18px;">Customer Details</h3>


                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-bottom: 20px;">


                                    <div style="background: var(--bg-main); padding: 12px; border-radius: 8px;"><strong>Name:</strong> ${Utils.escapeHtml(order.name || order.customer_name || "Unknown")}</div>


                                    <div style="background: var(--bg-main); padding: 12px; border-radius: 8px;"><strong>Email:</strong> ${Utils.escapeHtml(order.customer_email)}</div>


                                    <div style="background: var(--bg-main); padding: 12px; border-radius: 8px;"><strong>Payment:</strong> ${Utils.escapeHtml(order.payment_method || "Online/COD")}</div>


                                    <div style="background: var(--bg-main); padding: 12px; border-radius: 8px;"><strong>Delivery Date:</strong> ${


                                        order.delivery_date ? Utils.formatDate(order.delivery_date) : 


                                        new Date(new Date(order.created_at || Date.now()).getTime() + 3*24*60*60*1000).toLocaleDateString("en-IN", {day: "2-digit", month: "short", year: "numeric"})


                                    }</div>


                                </div>


                                


                                <h3 style="color: var(--primary); margin-top: 0; margin-bottom: 10px; font-size:18px;">Order Items</h3>


                                ${itemsHTML}


                                


                                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 25px; flex-wrap: wrap; gap: 20px;">


                                    <div style="font-size: 20px; font-weight: 700; color: var(--primary);">Total: ₹${Number(order.total) || 0}</div>


                                    <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">


                                        <select class="status-select" data-id="${order.order_id}" style="padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); font-family: inherit; font-size: 15px; outline: none; cursor: pointer;">


                                            <option value="Order Placed" ${currentStatus === 'Order Placed' ? 'selected' : ''}>Order Placed</option>


                                            <option value="Preparing" ${currentStatus === 'Preparing' ? 'selected' : ''}>Preparing</option>


                                            <option value="Out for Delivery" ${currentStatus === 'Out for Delivery' ? 'selected' : ''}>Out for Delivery</option>


                                            <option value="Delivered" ${currentStatus === 'Delivered' ? 'selected' : ''}>Delivered</option>


                                            <option value="Cancelled" ${currentStatus === 'Cancelled' ? 'selected' : ''}>Cancelled</option>


                                        </select>


                                        <button class="update-status-btn btn" data-id="${order.order_id}" style="padding: 11px 25px;">Update Status</button>


                                    </div>


                                </div>


                            </div>


                        </div>


                    `;


                }).join('');





                document.querySelectorAll('.update-status-btn').forEach(btn => {


                    btn.addEventListener('click', (e) => {


                        const orderId = e.target.getAttribute('data-id');


                        const select = document.querySelector(`.status-select[data-id="${orderId}"]`);


                        const newStatus = select.value;





                        if (newStatus === "Cancelled") {


                            if (!confirm(`Are you sure you want to CANCEL order ${orderId}? This action cannot be undone.`)) {


                                return;


                            }


                        }


                        


                        e.target.textContent = "Updating...";


                        e.target.disabled = true;





                        fetch('http://127.0.0.1:5000/api/orders', {


                            method: 'PUT',


                            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + (Store.getToken ? Store.getToken() : localStorage.getItem('arnaverseToken')) },


                            body: JSON.stringify({ order_id: orderId, status: newStatus })


                        })


                        .then(res => res.json())


                        .then(updateData => {


                            if (updateData.success) {


                                loadAdminOrders();


                            } else {


                                alert("Failed to update status.");


                                e.target.textContent = "Update Status";


                                e.target.disabled = false;


                            }


                        })


                        .catch(err => {


                            


                            alert("Cannot connect to server. Please make sure the backend server is running.");


                            e.target.textContent = "Update Status";


                            e.target.disabled = false;


                        });


                    });


                });


        };





        if (cachedManageOrders) {


            renderData(cachedManageOrders);


        } else {


            container.innerHTML = `<div style="text-align: center; padding: 50px;">Loading orders...</div>`;


        }





        fetch('http://127.0.0.1:5000/api/admin/orders', { headers: { 'Authorization': 'Bearer ' + (Store.getToken ? Store.getToken() : localStorage.getItem('arnaverseToken')) } })


            .then(res => res.json())


            .then(data => {


                if (data.success) {


                    cachedManageOrders = data.orders || [];
                    localStorage.setItem("arnaverse_admin_orders", JSON.stringify(cachedManageOrders));


                    renderData(cachedManageOrders);


                } else if (!cachedManageOrders) {


                    container.innerHTML = `<div style="text-align: center; padding: 50px; color: red;">Failed to load orders.</div>`;


                }


            })


            .catch(err => {


                


                if (!cachedManageOrders) {


                    container.innerHTML = `<div style="text-align: center; padding: 50px; color: red;">Cannot connect to server. Please make sure the backend server is running.</div>`;


                }


            });


    };





    loadAdminOrders();


}





