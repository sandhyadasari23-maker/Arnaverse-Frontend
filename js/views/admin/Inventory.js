import { Store, Utils } from '../../main.js';
export function render() {
    return `
        <header class="admin-header">
            <div style="display:flex; justify-content:space-between; align-items:center; width: 100%;">
                <div>
                    <h2 style="margin: 0; color: var(--primary);">Inventory Management</h2>
                    <p style="margin: 5px 0 0; color: var(--text-muted);">Manage flowers, bouquets and available stock centrally.</p>
                </div>
                
            </div>
        </header>
        <main class="admin-container">
            <section class="inventory-summary" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">
                <div class="card" style="text-align: center; padding: 25px;">
                    <h2 id="totalItems" style="margin: 5px 0; color: var(--primary); font-size: 28px;">0</h2>
                    <p style="margin: 0; color: var(--text-muted);">Total Items</p>
                </div>
                <div class="card" style="text-align: center; padding: 25px;">
                    <h2 id="inStockItems" style="margin: 5px 0; color: var(--primary); font-size: 28px;">0</h2>
                    <p style="margin: 0; color: var(--text-muted);">In Stock</p>
                </div>
                <div class="card" style="text-align: center; padding: 25px;">
                    <h2 id="lowStockItems" style="margin: 5px 0; color: #f59e0b; font-size: 28px;">0</h2>
                    <p style="margin: 0; color: var(--text-muted);">Low Stock</p>
                </div>
                <div class="card" style="text-align: center; padding: 25px;">
                    <h2 id="outStockItems" style="margin: 5px 0; color: var(--danger); font-size: 28px;">0</h2>
                    <p style="margin: 0; color: var(--text-muted);">Out of Stock</p>
                </div>
            </section>
            <section style="background: white; border-radius: 14px; padding: 20px; border: 1px solid #eadfe2; overflow-x: auto;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; gap: 15px; flex-wrap: wrap;">
                    <div style="flex:1; min-width: 250px;">
                        <input type="text" id="inventorySearch" placeholder="Search by ID or Name..." style="padding:12px 15px; width:100%; border-radius:8px; border:1px solid #ccc; font-size: 14px;">
                    </div>
                    <select id="inventoryFilter" style="padding:12px 15px; border-radius:8px; border:1px solid #ccc; font-size: 14px; cursor:pointer; min-width: 200px;">
                        <option value="all">All Items</option>
                        <option value="in_stock">In Stock</option>
                        <option value="low_stock">Low Stock</option>
                        <option value="out_stock">Out of Stock</option>
                    </select>
                </div>
                <h2 style="margin: 0 0 20px 0; color: #9b335a; font-size: 24px;">Inventory Items</h2>
                <table style="width: 100%; border-collapse: collapse; text-align: left;">
                    <thead>
                        <tr style="border-bottom: 2px solid #f9eef2; background: #fdf5f7;">
                            <th style="padding: 15px; color: #9b335a; font-weight: bold;">Product</th>
                            <th style="padding: 15px; color: #9b335a; font-weight: bold;">Type</th>
                            <th style="padding: 15px; color: #9b335a; font-weight: bold;">Price</th>
                            <th style="padding: 15px; color: #9b335a; font-weight: bold;">Stock</th>
                            <th style="padding: 15px; color: #9b335a; font-weight: bold;">Status</th>
                            <th style="padding: 15px; color: #9b335a; font-weight: bold;">Action</th>
                        </tr>
                    </thead>
                    <tbody id="inventoryTableBody">
                        <tr><td colspan="7" style="text-align:center; padding:30px;">Loading inventory...</td></tr>
                    </tbody>
                </table>
            </section>
        </main>
    `;
}
// Module-level cache for instant navigation
let cachedInventory = JSON.parse(localStorage.getItem("arnaverse_admin_inventory")) || null;
export function init() {
    const tableBody = document.getElementById("inventoryTableBody");
    
    const getHeaders = (isJson = false) => {
        const headers = { 'Authorization': 'Bearer ' + (Store.getToken ? Store.getToken() : localStorage.getItem('arnaverseToken')) };
        if (isJson) headers['Content-Type'] = 'application/json';
        return headers;
    };
    
    const renderData = (bouquets) => {
        // Safety check: ensure user hasn\'t navigated away during fetch
        const tableBodyEl = document.getElementById("inventoryTableBody");
        if (!tableBodyEl) return;

        // Calculate counts
        const countAll = bouquets.length;
        const countInStock = bouquets.filter(b => b.stock > 5).length;
        const countLowStock = bouquets.filter(b => b.stock > 0 && b.stock <= 5).length;
        const countOutStock = bouquets.filter(b => b.stock <= 0).length;

        // Update top cards
        document.getElementById('totalItems').textContent = countAll;
        document.getElementById('inStockItems').textContent = countInStock;
        document.getElementById('lowStockItems').textContent = countLowStock;
        document.getElementById('outStockItems').textContent = countOutStock;

        // Update dropdown text with counts
        const filterSelect = document.getElementById('inventoryFilter');
        if (filterSelect) {
            filterSelect.options[0].text = `All Items (${countAll})`;
            filterSelect.options[1].text = `In Stock (${countInStock})`;
            filterSelect.options[2].text = `Low Stock (${countLowStock})`;
            filterSelect.options[3].text = `Out of Stock (${countOutStock})`;
        }

        // Apply filters
        const searchVal = (document.getElementById('inventorySearch')?.value || '').toLowerCase();
        const filterVal = document.getElementById('inventoryFilter')?.value || 'all';

        let filteredBouquets = bouquets.filter(b => {
            const matchesSearch = b.id.toLowerCase().includes(searchVal) || b.name.toLowerCase().includes(searchVal);
            if (!matchesSearch) return false;

            if (filterVal === 'in_stock') return b.stock > 5;
            if (filterVal === 'low_stock') return b.stock > 0 && b.stock <= 5;
            if (filterVal === 'out_stock') return b.stock <= 0;
            return true;
        });

        bouquets = filteredBouquets;

        bouquets.sort((a, b) => {
            const numA = parseInt(a.id.replace(/\D/g, '')) || 0;
            const numB = parseInt(b.id.replace(/\D/g, '')) || 0;
            return numA - numB;
        });

        if (bouquets.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px;">No bouquets found.</td></tr>`;
            return;
        }
        tableBody.innerHTML = bouquets.map(b => {
            let statusBadge = "";
            if (b.stock > 5) {
                statusBadge = `<span style="background: #e0f8e9; color: #1e7e34; padding: 6px 15px; border-radius: 20px; font-size: 13px; font-weight: bold; display: inline-flex; align-items: center; gap: 8px;"><span style="width: 10px; height: 10px; background: linear-gradient(135deg, #4ade80, #166534); border-radius: 50%; box-shadow: 0 0 5px rgba(74, 222, 128, 0.5);"></span> In Stock</span>`;
            } else if (b.stock > 0) {
                statusBadge = `<span style="background: #fdf2d0; color: #d39e00; padding: 6px 15px; border-radius: 20px; font-size: 13px; font-weight: bold; display: inline-flex; align-items: center; gap: 8px;"><span style="width: 10px; height: 10px; background: linear-gradient(135deg, #fbbf24, #b45309); border-radius: 50%; box-shadow: 0 0 5px rgba(251, 191, 36, 0.5);"></span> Low Stock</span>`;
            } else {
                statusBadge = `<span style="background: #fce4e4; color: #c82333; padding: 6px 15px; border-radius: 20px; font-size: 13px; font-weight: bold; display: inline-flex; align-items: center; gap: 8px;"><span style="width: 10px; height: 10px; background: linear-gradient(135deg, #f87171, #991b1b); border-radius: 50%; box-shadow: 0 0 5px rgba(248, 113, 113, 0.5);"></span> Out of Stock</span>`;
            }
            
            let typeVal = b.flower || b.category || "Bouquet";
            if (typeVal.length > 15) typeVal = typeVal.split(' ')[0];
            
            return `
            <tr style="border-bottom: 1px solid #f3e8eb;">
                <td style="padding: 18px 15px; font-weight: bold; color: #333;">${Utils.escapeHtml(b.name)}</td>
                <td style="padding: 18px 15px; color: #999;">${Utils.escapeHtml(typeVal)}</td>
                <td style="padding: 18px 15px; color: #333;">₹${b.price}</td>
                <td style="padding: 18px 15px; font-weight: bold; color: #333;">${b.stock}</td>
                <td style="padding: 18px 15px;">
                    ${statusBadge}
                </td>
                <td style="padding: 18px 15px;">
                    <button class="update-stock-btn" data-id="${Utils.escapeHtml(b.id)}" data-stock="${b.stock}" data-name="${Utils.escapeHtml(b.name)}" style="background: #9b335a; color: white; border: none; padding: 10px 18px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 14px; display:inline-flex; align-items:center; gap:8px;"><i class="fas fa-pencil-alt" style="font-size:12px; color: #fba9c4;"></i> Update Stock</button>
                </td>
            </tr>
            `;
        }).join('');
        // Stock Update Listeners
        document.querySelectorAll('.update-stock-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const btnEl = e.currentTarget;
                const id = btnEl.getAttribute('data-id');
                const name = btnEl.getAttribute('data-name');
                const currentStock = btnEl.getAttribute('data-stock');
                
                const newStockStr = prompt(`Enter new stock quantity for ${name}:`, currentStock);
                if (newStockStr === null) return;
                
                const newStock = parseInt(newStockStr, 10);
                if (isNaN(newStock) || newStock < 0) {
                    alert("Please enter a valid positive number.");
                    return;
                }
                
                const originalHTML = btnEl.innerHTML;
                btnEl.innerHTML = 'Saving...';
                btnEl.style.opacity = '0.7';

                fetch('http://127.0.0.1:5000/api/bouquets', { 
                    method: 'PUT', 
                    headers: getHeaders(true),
                    body: JSON.stringify({ id: id, stock: newStock })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        btnEl.innerHTML = 'Saved!';
                        btnEl.style.background = '#2e8b57';
                        btnEl.style.opacity = '1';
                        
                        const bouquet = cachedInventory.find(b => b.id === id);
                        if (bouquet) bouquet.stock = newStock;
                        
                        setTimeout(() => loadInventory(true), 800);
                    } else {
                        alert(data.message || "Failed to update stock.");
                        btnEl.innerHTML = originalHTML;
                        btnEl.style.opacity = '1';
                    }
                })
                .catch(err => {
                    console.error(err);
                    alert("Error updating stock.");
                    btnEl.innerHTML = originalHTML;
                    btnEl.style.opacity = '1';
                });
            });
        });
    };
    const loadInventory = (forceRender = false) => {
        const searchInput = document.getElementById('inventorySearch');
        const filterSelect = document.getElementById('inventoryFilter');
        
        if (searchInput && !searchInput.dataset.bound) {
            searchInput.dataset.bound = "true";
            searchInput.addEventListener('input', () => { if(cachedInventory) renderData(cachedInventory); });
        }
        if (filterSelect && !filterSelect.dataset.bound) {
            filterSelect.dataset.bound = "true";
            filterSelect.addEventListener('change', () => { if(cachedInventory) renderData(cachedInventory); });
        }

        if (cachedInventory && !forceRender) {
            renderData(cachedInventory);
        } else if (!cachedInventory) {
            const tBody = document.getElementById("inventoryTableBody");
            if (tBody) tBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px;">Loading inventory...</td></tr>`;
        }
        fetch('http://127.0.0.1:5000/api/bouquets', { headers: getHeaders(false) })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    cachedInventory = data.bouquets || [];
                    localStorage.setItem("arnaverse_admin_inventory", JSON.stringify(cachedInventory));
                    renderData(cachedInventory);
                } else if (!cachedInventory) {
                    const tBody = document.getElementById("inventoryTableBody");
                    if (tBody) tBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px; color:red;">Failed to load inventory.</td></tr>`;
                }
            })
            .catch(err => {
                console.error(err);
                if (!cachedInventory) {
                    const tBody = document.getElementById("inventoryTableBody");
                    if (tBody) tBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px; color:red;">Error connecting to server.</td></tr>`;
                }
            });
    };
    loadInventory();
}
