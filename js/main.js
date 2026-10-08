// ==========================================
// ARNAVERSE - STATE MANAGER & ROUTER (SPA)
// ==========================================

export const Store = {
    getUser: () => JSON.parse(localStorage.getItem("arnaverseUser")) || JSON.parse(localStorage.getItem("arnaverseCurrentUser")),
    getAdmin: () => JSON.parse(localStorage.getItem("arnaverseAdmin")),
    isAdminLoggedIn: () => localStorage.getItem("arnaverseAdminLoggedIn") === "true",
    isUserLoggedIn: () => localStorage.getItem("arnaverseLoggedIn") === "true",
    getToken: () => localStorage.getItem("arnaverseToken"),

    logoutUser: () => {
        localStorage.removeItem("arnaverseLoggedIn");
        localStorage.removeItem("arnaverseCurrentUser");
        localStorage.removeItem("arnaverseUser");
        localStorage.removeItem("arnaverseToken");
        window.location.hash = "#/login";
    },

    logoutAdmin: () => {
        localStorage.removeItem("arnaverseAdminLoggedIn");
        localStorage.removeItem("arnaverseAdmin");
        localStorage.removeItem("arnaverseToken");
        window.location.hash = "#/login";
    },


    getCart: () => JSON.parse(localStorage.getItem("arnaverseCart")) || [],
    setCart: (cart) => {
        localStorage.setItem("arnaverseCart", JSON.stringify(cart));
        window.dispatchEvent(new Event("cartUpdated"));
    },
    getCartCount: () => {
        return Store.getCart().reduce((total, item) => total + (Number(item.quantity) || 1), 0);
    },

    getInventory: () => {
        let inv = JSON.parse(localStorage.getItem("arnaverseBouquets"));
        if (!inv || inv.length === 0) {
            inv = [
                { id: "B001", name: "Red Rose Bouquet", description: "Beautiful red roses arranged in an elegant bouquet.", flower: "Rose", color: "Red", size: "Medium", price: 450, stock: 10, category: "Love & Romance", image: "assets/images/bouquets/red-rose-bouquet.jpeg", occasions: ["birthday", "anniversary", "love", "congratulations"] },
                { id: "B002", name: "Pink Tulip Bouquet", description: "Soft pink tulips perfect for special occasions.", flower: "Tulip", color: "Pink", size: "Medium", price: 550, stock: 8, category: "Birthday", image: "assets/images/bouquets/pink-tulip-bouquet.jpeg", occasions: ["birthday", "friendship", "love", "general"] },
                { id: "B003", name: "Sunflower Bouquet", description: "Bright sunflower bouquet to make every moment cheerful.", flower: "Sunflower", color: "Yellow", size: "Large", price: 500, stock: 12, category: "Friendship", image: "assets/images/bouquets/hero-bouquet.jpeg", occasions: ["birthday", "friendship", "congratulations", "general"] },
                { id: "B004", name: "Mixed Flower Bouquet", description: "A colourful combination of beautiful fresh flowers.", flower: "Mixed", color: "Mixed", size: "Large", price: 650, stock: 6, category: "Birthday", image: "assets/images/bouquets/purple-mixed-bouquet.jpeg", occasions: ["birthday", "wedding", "congratulations", "general"] },
                { id: "B005", name: "Purple Lily Bouquet", description: "Elegant purple lilies arranged beautifully.", flower: "Lily", color: "Purple", size: "Medium", price: 700, stock: 7, category: "Anniversary", image: "assets/images/bouquets/purple-lily-bouquet.jpeg", occasions: ["anniversary", "wedding", "love", "general"] },
                { id: "B006", name: "Red & White Bouquet", description: "A beautiful red and white mixed flower bouquet.", flower: "Mixed", color: "Red & White", size: "Large", price: 750, stock: 5, category: "Anniversary", image: "assets/images/bouquets/mixed-red-white-bouquet.jpeg", occasions: ["wedding", "anniversary", "congratulations"] },
                { id: "B007", name: "Wedding Bouquet", description: "Elegant bouquet specially designed for weddings.", flower: "Mixed", color: "White", size: "Large", price: 900, stock: 4, category: "Wedding", image: "assets/images/bouquets/wedding-bouquet.jpeg", occasions: ["wedding"] },
                { id: "B008", name: "Red Twin Rose Bouquet", description: "Romantic twin rose arrangement for your special person.", flower: "Rose", color: "Red", size: "Medium", price: 600, stock: 8, category: "Love & Romance", image: "assets/images/bouquets/red-twin-rose-bouquet.jpeg", occasions: ["love", "anniversary"] }
            ];
            localStorage.setItem("arnaverseBouquets", JSON.stringify(inv));
        }
        return inv;
    },
    saveInventory: (inv) => localStorage.setItem("arnaverseBouquets", JSON.stringify(inv)),

    getOrders: () => JSON.parse(localStorage.getItem("arnaverseOrders")) || [],
    saveOrder: (order) => {
        const orders = Store.getOrders();
        orders.push(order);
        localStorage.setItem("arnaverseOrders", JSON.stringify(orders));
        localStorage.setItem("arnaverseOrder", JSON.stringify(order));
    }
};

export const Utils = {
    formatDate: (isoString) => {
        if (!isoString) return "Date not recorded";
        const date = new Date(isoString);
        if (isNaN(date.getTime())) return "Invalid Date";
        return date.toLocaleString("en-IN", {
            day: "2-digit", month: "short", year: "numeric", 
            hour: "2-digit", minute: "2-digit"
        });
    },
    escapeHtml: (str) => {
        return String(str ?? "").replace(/[&<>"']/g, match => {
            const escape = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
            return escape[match];
        });
    },
    // Bulletproof function to fix legacy/broken image paths automatically
    getImagePath: (imageStr) => {
        if (!imageStr) return "assets/images/bouquets/hero-bouquet.jpeg";
        
        // Return immediately if it is an uploaded Base64 string or external URL
        if (imageStr.startsWith("data:image/") || /^https?:\/\//i.test(imageStr)) {
            return imageStr;
        }
        
        // Extract strictly the filename, ignoring whatever legacy path was saved
        let filename = imageStr.split('/').pop().split('\\').pop();
        
        // Force the correct extension
        filename = filename.replace(/\.jpg$/i, ".jpeg");
        
        return `assets/images/bouquets/${filename}`;
    }
};

import { renderNavbar, renderFooter, renderAdminSidebar } from './components/Layout.js?v=12';

const routes = {
    '/': () => import('./views/Home.js?v=12'),
    '/shop': () => import('./views/Shop.js?v=12'),
    '/cart': () => import('./views/cart.js?v=27'),
    '/checkout': () => import('./views/Checkout.js?v=16'),
    '/customize': () => import('./views/Customize.js?v=12'),
    '/ai-recommendation': () => import('./views/AIPicks.js?v=12'),
    '/login': () => import('./views/Login.js?v=32'),
    '/register': () => import('./views/Register.js?v=12'),
    '/profile': () => import('./views/Profile.js?v=29'),
    '/orders': () => import('./views/Orders.js?v=12'),
    '/order-confirmation': () => import('./views/OrderConfirmation.js?v=12'),
    '/order-tracking': () => import('./views/OrderTracking.js?v=18'),
    '/admin-dashboard': () => import('./views/admin/Dashboard.js?v=14'),
    '/admin-orders': () => import('./views/admin/ManageOrders.js?v=28'),
    '/admin-bouquets': () => import('./views/admin/ManageBouquets.js?v=23'),
    '/admin-inventory': () => import('./views/admin/Inventory.js?v=23'),
    '/admin-customers': () => import('./views/admin/Customers.js?v=32')
};

const router = async () => {
    const app = document.getElementById('app');
    let hash = window.location.hash.slice(1) || '/';
    const [path, queryString] = hash.split('?');
    const params = new URLSearchParams(queryString || '');

    if (path.startsWith('/admin-') && path !== '/login') {
        if (!Store.isAdminLoggedIn() || !Store.getToken()) {
            Store.logoutAdmin(); // Force cleanup
            window.location.hash = '#/login';
            return;
        }
    }
    if (['/profile', '/checkout', '/orders'].includes(path) && !Store.isUserLoggedIn()) {
        window.location.hash = '#/login';
        return;
    }

        const isAdminRoute = path.startsWith('/admin-') && path !== '/login';

    try {
        const routeLoader = routes[path] || routes['/'];
        const viewModule = await routeLoader();
        
        app.innerHTML = '';
        if (isAdminRoute) {
            app.innerHTML = `
                <div class="admin-layout">
                    ${renderAdminSidebar()}
                    <div class="admin-main">
                        <div id="view-container"></div>
                    </div>
                </div>
            `;
        } else if (path === '/admin-login' || path === '/login' || path === '/register') {
            app.innerHTML = `
                ${renderNavbar()}
                <div id="view-container"></div>
            `;
        } else {
            app.innerHTML = `
                ${renderNavbar()}
                <div id="view-container"></div>
                ${renderFooter()}
            `;
        }
        
        const viewContainer = document.getElementById('view-container');
        viewContainer.innerHTML = viewModule.render();
        if (viewModule.init) viewModule.init(params);
    } catch (err) {
        console.error("Routing error:", err);
        const app_el = document.getElementById('app');
        if (app_el) app_el.innerHTML = `<div style="padding: 100px; text-align: center;"><h2>404 - Page Not Found</h2></div>`;
    }
};
window.addEventListener('hashchange', router);
window.addEventListener('load', router);


// Sync Inventory with Cloud Backend on Load
fetch('http://127.0.0.1:5000/api/bouquets')
    .then(res => res.json())
    .then(data => {
        if (data.success && data.bouquets) {
            localStorage.setItem("arnaverseBouquets", JSON.stringify(data.bouquets));
            // Trigger a quick re-render if we are on a page that relies on it
            if (window.location.hash === '#/shop' || window.location.hash === '' || window.location.hash === '#/') {
                const event = new Event('inventorySynced');
                window.dispatchEvent(event);
            }
        }
    })
    .catch(err => console.log("Silent cloud sync failed:", err));


































