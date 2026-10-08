import { Store, Utils } from '../../main.js';





export function render() {


    return `


        <header class="admin-header" style="background: white; padding: 18px 30px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 10px rgba(0,0,0,0.06);">


            <div>


                <h2 style="margin: 0; color: #a8325d;">Admin Dashboard</h2>


                <p style="margin: 5px 0 0; color: #777;">Smart Online Bouquet Ordering and Management System</p>


            </div>


        </header>


        <main class="admin-container" style="padding: 35px 30px; max-width: 1200px; margin: auto;">


            <section class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 35px;">


                <div class="stat-card" style="background: white; padding: 25px; border-radius: 14px; box-shadow: 0 5px 18px rgba(168, 50, 93, 0.10); text-align: center;">


                    <h3 id="totalOrders" style="margin: 5px 0; font-size: 28px; color: #a8325d;">0</h3>


                    <p style="margin: 0; color: #777;">Total Orders</p>


                </div>


                <div class="stat-card" style="background: white; padding: 25px; border-radius: 14px; box-shadow: 0 5px 18px rgba(168, 50, 93, 0.10); text-align: center;">


                    <h3 id="totalSales" style="margin: 5px 0; font-size: 28px; color: #a8325d;">₹0</h3>


                    <p style="margin: 0; color: #777;">Total Sales</p>


                </div>


                <div class="stat-card" style="background: white; padding: 25px; border-radius: 14px; box-shadow: 0 5px 18px rgba(168, 50, 93, 0.10); text-align: center;">


                    <h3 id="pendingOrders" style="margin: 5px 0; font-size: 28px; color: #a8325d;">0</h3>


                    <p style="margin: 0; color: #777;">Pending Orders</p>


                </div>


                <div class="stat-card" style="background: white; padding: 25px; border-radius: 14px; box-shadow: 0 5px 18px rgba(168, 50, 93, 0.10); text-align: center;">


                    <h3 id="deliveredOrders" style="margin: 5px 0; font-size: 28px; color: #a8325d;">0</h3>


                    <p style="margin: 0; color: #777;">Delivered Orders</p>


                </div>


            </section>


            


            <!-- NEW ANALYTICS CHARTS SECTION -->


            <section style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 30px; margin-bottom: 35px;">


                <div style="background: white; padding: 25px; border-radius: 14px; box-shadow: 0 5px 18px rgba(168, 50, 93, 0.10);">


                    <h3 style="margin-top: 0; color: #a8325d; margin-bottom: 20px;">Revenue Overview</h3>


                    <div style="position: relative; height: 300px; width: 100%;">


                        <canvas id="revenueChart"></canvas>


                    </div>


                </div>


                <div style="background: white; padding: 25px; border-radius: 14px; box-shadow: 0 5px 18px rgba(168, 50, 93, 0.10);">


                    <h3 style="margin-top: 0; color: #a8325d; margin-bottom: 20px;">Order Status Distribution</h3>


                    <div style="position: relative; height: 300px; width: 100%;">


                        <canvas id="statusChart"></canvas>


                    </div>


                </div>


            </section>


            


            <section class="admin-menu" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 35px;">


                <a href="#/admin-orders" class="menu-card" style="background: white; padding: 25px; border-radius: 14px; text-decoration: none; color: #333; box-shadow: 0 5px 18px rgba(168, 50, 93, 0.10);">


                    <h3 style="margin: 12px 0 5px; color: #a8325d;">Manage Orders</h3>


                    <p style="margin: 0; color: #777;">View and update customer orders.</p>


                </a>


                <a href="#/admin-inventory" class="menu-card" style="background: white; padding: 25px; border-radius: 14px; text-decoration: none; color: #333; box-shadow: 0 5px 18px rgba(168, 50, 93, 0.10);">


                    <h3 style="margin: 12px 0 5px; color: #a8325d;">Inventory</h3>


                    <p style="margin: 0; color: #777;">Manage flowers and stock.</p>


                </a>


                <a href="#/" class="menu-card" style="background: white; padding: 25px; border-radius: 14px; text-decoration: none; color: #333; box-shadow: 0 5px 18px rgba(168, 50, 93, 0.10);">


                    <h3 style="margin: 12px 0 5px; color: #a8325d;">View Website</h3>


                    <p style="margin: 0; color: #777;">Go back to Arnaverse storefront.</p>


                </a>


            </section>





            <section class="recent-orders" style="background: white; border-radius: 14px; padding: 25px; box-shadow: 0 5px 18px rgba(168, 50, 93, 0.10);">


                <h2 style="color: #a8325d; margin-top: 0;">Recent Orders</h2>


                <div style="overflow-x: auto;">


                    <table style="width: 100%; border-collapse: collapse; min-width: 650px;">


                        <thead>


                            <tr>


                                <th style="padding: 13px 10px; border-bottom: 1px solid #eee; text-align: left; background: #fff0f5; color: #a8325d;">Order ID</th>


                                <th style="padding: 13px 10px; border-bottom: 1px solid #eee; text-align: left; background: #fff0f5; color: #a8325d;">Customer</th>


                                <th style="padding: 13px 10px; border-bottom: 1px solid #eee; text-align: left; background: #fff0f5; color: #a8325d;">City</th>


                                <th style="padding: 13px 10px; border-bottom: 1px solid #eee; text-align: left; background: #fff0f5; color: #a8325d;">Total</th>


                                <th style="padding: 13px 10px; border-bottom: 1px solid #eee; text-align: left; background: #fff0f5; color: #a8325d;">Status</th>


                            </tr>


                        </thead>


                        <tbody id="recentOrdersBody"></tbody>


                    </table>


                </div>


            </section>


        </main>


    `;


}





// Module-level cache for instant navigation


let cachedOrders = JSON.parse(localStorage.getItem("arnaverse_admin_dashboard_orders")) || null;





export function init() {


    const tbody = document.getElementById("recentOrdersBody");





    const renderDashboard = (orders) => {
        const totalOrdersEl = document.getElementById("totalOrders");
        if (!totalOrdersEl) return;



        const totalSales = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);


        const pending = orders.filter(o => ["Order Placed", "Preparing", "Out for Delivery"].includes(o.status || "Order Placed")).length;


        const delivered = orders.filter(o => o.status === "Delivered").length;


        const cancelled = orders.filter(o => o.status === "Cancelled").length;





        totalOrdersEl.textContent = orders.length;


        document.getElementById("totalSales").textContent = `₹${totalSales}`;


        document.getElementById("pendingOrders").textContent = pending;


        document.getElementById("deliveredOrders").textContent = delivered;





        if (orders.length === 0) {


            tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 30px; color: #777;">No orders found.</td></tr>`;


        } else {


            const recentOrders = [...orders].slice(0, 5); 


            tbody.innerHTML = recentOrders.map(order => {


                let statusColor = "#856404", statusBg = "#fff3cd"; 


                if (order.status === "Preparing") { statusColor = "#1d4ed8"; statusBg = "#dbeafe"; }


                else if (order.status === "Out for Delivery") { statusColor = "#4338ca"; statusBg = "#e0e7ff"; }


                else if (order.status === "Delivered") { statusColor = "#166534"; statusBg = "#dcfce7"; }


                else if (order.status === "Cancelled") { statusColor = "#991b1b"; statusBg = "#fee2e2"; }





                const custName = Utils.escapeHtml(order.customer_email || order.name || "-");


                const orderId = Utils.escapeHtml(order.order_id || order.orderId || "-");


                const city = Utils.escapeHtml(order.city || "Not Provided");





                return `


                    <tr>


                        <td style="padding: 13px 10px; border-bottom: 1px solid #eee;">${orderId}</td>


                        <td style="padding: 13px 10px; border-bottom: 1px solid #eee;">${custName}</td>


                        <td style="padding: 13px 10px; border-bottom: 1px solid #eee;">${city}</td>


                        <td style="padding: 13px 10px; border-bottom: 1px solid #eee;">₹${Number(order.total || 0)}</td>


                        <td style="padding: 13px 10px; border-bottom: 1px solid #eee;">


                            <span style="background: ${statusBg}; color: ${statusColor}; padding: 6px 10px; border-radius: 20px; font-size: 13px; font-weight: 600;">


                                ${Utils.escapeHtml(order.status || "Order Placed")}


                            </span>


                        </td>


                    </tr>


                `;


            }).join('');


        }





        if (window.Chart) {


            drawCharts(orders, pending, delivered, cancelled);


        } else {


            const script = document.createElement('script');


            script.src = "https://cdn.jsdelivr.net/npm/chart.js";


            script.onload = () => drawCharts(orders, pending, delivered, cancelled);


            document.head.appendChild(script);


        }


    };





    const drawCharts = (orders, pending, delivered, cancelled) => {


        const revenueMap = {};


        orders.forEach(o => {


            const dateStr = o.created_at || new Date().toISOString();


            const date = new Date(dateStr).toLocaleDateString();


            revenueMap[date] = (revenueMap[date] || 0) + Number(o.total || 0);


        });





        const dates = Object.keys(revenueMap).sort((a,b) => {


            const da = a.split('/').reverse().join('-');


            const db = b.split('/').reverse().join('-');


            return new Date(da) - new Date(db);


        }).slice(-7); 


        const revenues = dates.map(d => revenueMap[d]);





        // Destroy existing charts to prevent hover glitching on re-render


        if(window.revChartInst) window.revChartInst.destroy();


        if(window.statChartInst) window.statChartInst.destroy();





        const ctxRev = document.getElementById('revenueChart').getContext('2d');


        window.revChartInst = new Chart(ctxRev, {


            type: 'bar', 


            data: {


                labels: dates.length ? dates : ['No Data'],


                datasets: [{


                    label: 'Daily Revenue (₹)',


                    data: revenues.length ? revenues : [0],


                    backgroundColor: '#a8325d',


                    borderRadius: 4


                }]


            },


            options: { responsive: true, maintainAspectRatio: false, animation: { duration: 0 } }


        });





        const ctxStat = document.getElementById('statusChart').getContext('2d');


        window.statChartInst = new Chart(ctxStat, {


            type: 'doughnut',


            data: {


                labels: ['Pending', 'Delivered', 'Cancelled'],


                datasets: [{


                    data: [pending, delivered, cancelled],


                    backgroundColor: ['#f59e0b', '#10b981', '#ef4444'],


                    borderWidth: 0


                }]


            },


            options: { responsive: true, maintainAspectRatio: false, cutout: '70%', animation: { duration: 0 } }


        });


    };





    // INSTANT RENDER FROM CACHE


    if (cachedOrders) {


        renderDashboard(cachedOrders);


    }





    // BACKGROUND SYNC


    fetch('http://127.0.0.1:5000/api/admin/orders', { headers: { 'Authorization': 'Bearer ' + (Store.getToken ? Store.getToken() : localStorage.getItem('arnaverseToken')) } })


        .then(res => res.json())


        .then(data => {


            if (data.success) {


                cachedOrders = data.orders || [];
                localStorage.setItem("arnaverse_admin_dashboard_orders", JSON.stringify(cachedOrders));


                renderDashboard(cachedOrders);


            } else if (!cachedOrders) {


                tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:30px; color:#a8325d;">Failed to load analytics.</td></tr>`;


            }


        })


        .catch(err => {


            


            if (!cachedOrders) tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:30px; color:#a8325d;">Cannot connect to server. Please make sure the backend server is running.</td></tr>`;


        });


}


