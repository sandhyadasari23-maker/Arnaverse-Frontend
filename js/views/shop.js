import { Store, Utils } from '../main.js';

export function render() {
    return `
        <section class="shop-header">
            <h1>Our Bouquets</h1>
            <p>Beautiful bouquets for every special moment.</p>
        </section>

        <div class="filters">
            <input type="text" id="shopSearch" placeholder="Search bouquets...">
            <select id="categoryFilter">
                <option value="all">All Categories</option>
                <option value="Love & Romance">Love & Romance</option>
                <option value="Birthday">Birthday</option>
                <option value="Friendship">Friendship</option>
                <option value="Anniversary">Anniversary</option>
                <option value="Wedding">Wedding</option>
            </select>
        </div>

        <div class="bouquet-grid" id="bouquetGrid"></div>
    `;
}

export function init(params) {
    const grid = document.getElementById('bouquetGrid');
    const searchInput = document.getElementById('shopSearch');
    const categorySelect = document.getElementById('categoryFilter');
    
    const initialSearch = params.get('search') || '';
    if (initialSearch) searchInput.value = initialSearch;

    const inventory = Store.getInventory();

    const renderGrid = () => {
        const query = searchInput.value.toLowerCase().trim();
        const category = categorySelect.value;

        const filtered = inventory.filter(b => {
            const matchesSearch = b.name.toLowerCase().includes(query) || (b.flower && b.flower.toLowerCase().includes(query));
            const matchesCategory = category === 'all' || b.category === category;
            return matchesSearch && matchesCategory;
        });

        if (filtered.length === 0) {
            grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:60px; color:#777;">No bouquets found.</div>`;
            return;
        }

        grid.innerHTML = filtered.map(bouquet => {
            const imgPath = Utils.getImagePath(bouquet.image);
            return `
            <div class="bouquet-card">
                <div class="bouquet-image">
                    <img src="${Utils.escapeHtml(imgPath)}" alt="${Utils.escapeHtml(bouquet.name)}" onerror="this.onerror=null; this.src='assets/images/bouquets/hero-bouquet.jpeg';">
                </div>
                <div class="bouquet-content">
                    <div class="category">${Utils.escapeHtml(bouquet.category)}</div>
                    <h2>${Utils.escapeHtml(bouquet.name)}</h2>
                    <div class="price">₹${bouquet.price}</div>
                    <div class="stock">${bouquet.stock > 0 ? `${bouquet.stock} available` : '<span style="color:red">Out of stock</span>'}</div>
                    <button class="add-cart" data-id="${bouquet.id}" ${bouquet.stock <= 0 ? 'disabled style="background:#ccc;cursor:not-allowed;"' : ''}>
                        <i class="fa-solid fa-cart-plus"></i> ${bouquet.stock > 0 ? 'Add to Cart' : 'Sold Out'}
                    </button>
                </div>
            </div>
            `;
        }).join('');

        document.querySelectorAll('.add-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.closest('.add-cart').dataset.id;
                addToCart(id);
            });
        });
    };

    const addToCart = (id) => {
        const bouquet = inventory.find(item => String(item.id) === String(id));
        if (!bouquet) return;

        let cart = Store.getCart();
        const existing = cart.find(item => String(item.id) === String(bouquet.id));

        if (existing) {
            if (existing.quantity >= bouquet.stock) {
                alert(`Cannot add more. Only ${bouquet.stock} in stock.`);
                return;
            }
            existing.quantity = Number(existing.quantity || 0) + 1;
        } else {
            cart.push({
                id: bouquet.id,
                name: bouquet.name,
                category: bouquet.category,
                price: bouquet.price,
                image: bouquet.image,
                quantity: 1
            });
        }

        Store.setCart(cart);
        alert(`${bouquet.name} added to cart!`);
    };

    searchInput.addEventListener('input', renderGrid);
    categorySelect.addEventListener('change', renderGrid);
    renderGrid();
}