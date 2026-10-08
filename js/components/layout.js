import { Store } from '../main.js';

export function renderNavbar() {
    const isLoggedIn = Store.isUserLoggedIn();
    const cartCount = Store.getCartCount();

    // Attach a global listener (only once) to update the cart badge dynamically 
    // when items are added without reloading the page.
    if (!window.cartListenerAttached) {
        window.addEventListener('cartUpdated', () => {
            const badge = document.getElementById('navCartCount');
            if (badge) badge.textContent = Store.getCartCount();
        });
        window.cartListenerAttached = true;
    }

    // Notice all hrefs now use the Hash Router format (e.g., "#/shop")
    return `
    <header class="navbar">
        <div class="nav-container">
            <a href="#/" class="logo">
                <span class="logo-icon">🌸</span>
                <span>Arna<span>verse</span></span>
            </a>
            
            <nav class="nav-links">
                <a href="#/">Home</a>
                <a href="#/shop">Shop</a>
                <a href="#/customize">Customize</a>
                <a href="#/ai-recommendation">AI Picks</a>
                ${isLoggedIn ? `<a href="#/orders">My Orders</a>` : ''}
            </nav>
            
            <div class="nav-actions">
                <a href="#/cart" class="cart-button" aria-label="Shopping Cart">
                    <i class="fa-solid fa-cart-shopping"></i>
                    <span class="cart-count" id="navCartCount">${cartCount}</span>
                </a>
                ${isLoggedIn 
                    ? `<a href="#/profile" class="login-button">Profile</a>` 
                    : `<a href="#/login" class="login-button">Login</a>`
                }
            </div>
        </div>
    </header>
    `;
}

export function renderFooter() {
    return `
    <footer class="footer">
        <div class="footer-container">
            <div class="footer-brand">
                <h2>Arnaverse</h2>
                <p>Smart Online Bouquet Ordering</p>
            </div>
            <div class="footer-copy">
                &copy; 2026 Arnaverse. All Rights Reserved.
            </div>
        </div>
    </footer>
    `;
}

export function renderAdminSidebar() {
    // Determine the current path to highlight the active link in the sidebar
    const path = window.location.hash.slice(1).split('?')[0] || '/';

    return `
    <aside class="admin-sidebar">
        <div class="admin-brand">
            <div class="brand-icon">🌸</div>
            <h2>ARNAVERSE</h2>
            <p>Admin Panel</p>
        </div>
        <nav class="admin-nav">
            <a href="#/admin-dashboard" class="${path === '/admin-dashboard' ? 'active' : ''}">
                <span class="nav-icon"><i class="fa-solid fa-chart-line"></i></span>
                <span>Dashboard</span>
            </a>
            <a href="#/admin-orders" class="${path === '/admin-orders' ? 'active' : ''}">
                <span class="nav-icon"><i class="fa-solid fa-box"></i></span>
                <span>Manage Orders</span>
            </a>
            <a href="#/admin-bouquets" class="${path === '/admin-bouquets' ? 'active' : ''}">
                <span class="nav-icon"><i class="fa-solid fa-seedling"></i></span>
                <span>Manage Bouquets</span>
            </a>
            <a href="#/admin-inventory" class="${path === '/admin-inventory' ? 'active' : ''}">
                <span class="nav-icon"><i class="fa-solid fa-clipboard-list"></i></span>
                <span>Inventory</span>
            </a>
            <a href="#/admin-customers" class="${path === '/admin-customers' ? 'active' : ''}">
                <span class="nav-icon"><i class="fa-solid fa-users"></i></span>
                <span>Customers</span>
            </a>
            
            <a href="#" class="logout-link" onclick="localStorage.removeItem('arnaverseAdminLoggedIn'); localStorage.removeItem('arnaverseAdmin'); localStorage.removeItem('arnaverseToken'); window.location.hash='#/admin-login'; return false;">
                <span class="nav-icon"><i class="fa-solid fa-right-from-bracket"></i></span>
                <span>Logout</span>
            </a>
        </nav>
    </aside>
    `;
}
