import { Store, Utils } from '../../main.js';

export function render() {
    return `
        <header class="admin-header">
            <div>
                <h2 style="margin: 0; color: var(--primary);">Customers</h2>
                <p style="margin: 5px 0 0; color: var(--text-muted);">Manage registered users.</p>
            </div>
        </header>
        <main class="admin-container">
            <div class="card" style="padding: 18px; margin-bottom: 25px; display:flex; align-items:center;">
                Total Customers: <strong id="customerCount" style="color: var(--primary); font-size: 22px; margin-left:10px;">0</strong>
                <span id="customerUpdateMsg" style="margin-left: 20px; font-weight: bold; flex:1; text-align:right;"></span>
            </div>
            <div id="customersContainer" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;"></div>
        </main>
    `;
}

// Module-level cache
let cachedCustomers = JSON.parse(localStorage.getItem("arnaverse_admin_customers")) || null;

export function init() {
    const container = document.getElementById("customersContainer");
    const msgEl = document.getElementById("customerUpdateMsg");
    
    const showMessage = (msg, isError=false) => {
        msgEl.textContent = msg;
        msgEl.style.color = isError ? "#d9534f" : "#2e8b57";
        setTimeout(() => msgEl.textContent = "", 3000);
    };
    
    const renderData = (customers) => {
        // Safety check: ensure user hasn't navigated away during fetch
        const customerCountEl = document.getElementById("customerCount");
        if (!customerCountEl) return;

        customerCountEl.textContent = customers.length;
        
        if (customers.length === 0) {
            container.innerHTML = `<p>No customers found.</p>`;
            return;
        }
        
        container.innerHTML = customers.map((c, index) => `
            <div class="card customer-card" data-index="${index}" style="padding: 25px; border-top: 4px solid var(--primary); position: relative;">
                <h3 style="margin: 0 0 8px; color: var(--text-dark);">${Utils.escapeHtml(c.name)}</h3>
                <p style="margin: 3px 0; color: var(--text-muted);"><i class="fa-solid fa-envelope" style="width:20px; color:var(--primary);"></i> ${Utils.escapeHtml(c.email)}</p>
                <p style="margin: 3px 0; color: var(--text-muted);"><i class="fa-solid fa-phone" style="width:20px; color:var(--primary);"></i> ${Utils.escapeHtml(c.phone || "N/A")}</p>
                <p style="margin: 3px 0; color: var(--text-muted);"><i class="fa-solid fa-location-dot" style="width:20px; color:var(--primary);"></i> ${Utils.escapeHtml(c.city || "N/A")}</p>
                <p style="margin: 15px 0 0; font-size: 12px; color: var(--text-muted);">Joined: ${Utils.formatDate(c.created_at)}</p>
            </div>
        `).join('');
    };

    const loadCustomers = async () => {
        try {
            const res = await fetch('http://127.0.0.1:5000/api/users', {
                headers: { 'Authorization': 'Bearer ' + Store.getToken() }
            });
            const data = await res.json();
            if (data.success) {
                cachedCustomers = data.users || [];
                localStorage.setItem("arnaverse_admin_customers", JSON.stringify(cachedCustomers));
                renderData(cachedCustomers);
            } else {
                if (!cachedCustomers) {
                    container.innerHTML = `<p style="color:red">Failed to load customers: ${data.message || 'Unknown error'}</p>`;
                } else {
                    console.error("Failed to refresh customers:", data.message);
                }
            }
        } catch (err) {
            
            if (!cachedCustomers) {
                container.innerHTML = `<p style="color:red">Cannot connect to server. Please make sure the backend server is running.</p>`;
            }
        }
    };

    if (cachedCustomers) {
        renderData(cachedCustomers);
    } else {
        container.innerHTML = `<p>Loading customers...</p>`;
    }
    
    loadCustomers();
}
