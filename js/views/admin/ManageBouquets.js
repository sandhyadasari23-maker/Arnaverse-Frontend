import { Store, Utils } from '../../main.js';



export function render() {

    return `

        <header class="admin-header">

            <div>

                <h2 style="margin: 0; color: var(--primary);">Manage Bouquets</h2>

                <p style="margin: 5px 0 0; color: var(--text-muted);">Add, edit, or delete bouquets in your store.</p>

            </div>

        </header>

        <main class="admin-container">

            <!-- ADD BOUQUET FORM -->

            <section class="card" style="padding: 30px; margin-bottom: 40px;">

                <h3 style="margin-top:0; color:var(--primary); margin-bottom:20px; border-bottom:1px solid var(--border-color); padding-bottom:10px;">Add New Bouquet</h3>

                <form id="addBouquetForm">

                    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">

                        <div class="form-group">

                            <label for="bId">Bouquet ID</label>

                            <input type="text" id="bId" placeholder="e.g. B010" required>

                        </div>

                        <div class="form-group">

                            <label for="bName">Name</label>

                            <input type="text" id="bName" placeholder="e.g. Premium Roses" required>

                        </div>

                        <div class="form-group">

                            <label for="bCategory">Category</label>

                            <select id="bCategory" required>

                                <option value="Birthday">Birthday</option>

                                <option value="Love & Romance">Love & Romance</option>

                                <option value="Anniversary">Anniversary</option>

                                <option value="Friendship">Friendship</option>

                                <option value="Wedding">Wedding</option>

                                <option value="Other">Other</option>

                            </select>

                        </div>

                        <div class="form-group">

                            <label for="bPrice">Price (₹)</label>

                            <input type="number" id="bPrice" placeholder="e.g. 500" required>

                        </div>

                        <div class="form-group">

                            <label for="bStock">Stock Quantity</label>

                            <input type="number" id="bStock" placeholder="e.g. 15" required>

                        </div>

                        <div class="form-group" style="grid-column: 1 / -1;">

                            <label for="bImageFile">Upload Image (Optional)</label>

                            <input type="file" id="bImageFile" accept="image/*" style="padding:8px 0;">

                        </div>

                    </div>

                    <button type="submit" class="btn" style="margin-top: 20px;">Add Bouquet</button>

                    <span id="bMsg" style="margin-left:15px; font-weight:bold;"></span>

                </form>

            </section>

            

            <!-- BOUQUETS LIST -->

            <section class="card" style="padding: 30px;">

                <h3 style="margin-top:0; color:var(--primary); margin-bottom:20px; border-bottom:1px solid var(--border-color); padding-bottom:10px;">Current Inventory</h3>

                <div id="bouquetsListContainer"></div>

            </section>

        </main>

        

        <!-- EDIT MODAL -->

        <div id="editModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:1000; justify-content:center; align-items:center;">

            <div style="background:white; padding:30px; border-radius:15px; width:90%; max-width:500px; max-height:90vh; overflow-y:auto; box-shadow:0 10px 30px rgba(0,0,0,0.3);">

                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:1px solid var(--border-color); padding-bottom:10px;">

                    <h2 style="margin:0; color:var(--primary);">Edit Bouquet</h2>

                    <button id="closeEditModal" style="background:none; border:none; font-size:24px; cursor:pointer; color:var(--text-muted);">&times;</button>

                </div>

                <form id="editBouquetForm">

                    <input type="hidden" id="editId">

                    <input type="hidden" id="editExistingImage">

                    <div class="form-group">

                        <label>Name</label>

                        <input type="text" id="editName" required>

                    </div>

                    <div class="form-group">

                        <label>Category</label>

                        <select id="editCategory" required>

                            <option value="Birthday">Birthday</option>

                            <option value="Love & Romance">Love & Romance</option>

                            <option value="Anniversary">Anniversary</option>

                            <option value="Friendship">Friendship</option>

                            <option value="Wedding">Wedding</option>

                            <option value="Other">Other</option>

                        </select>

                    </div>

                    <div class="form-group">

                        <label>Price (₹)</label>

                        <input type="number" id="editPrice" required>

                    </div>

                    <div class="form-group">

                        <label>Stock Quantity</label>

                        <input type="number" id="editStock" required>

                    </div>

                    <div class="form-group">

                        <label>Upload New Image (Leave empty to keep current)</label>

                        <input type="file" id="editImageFile" accept="image/*" style="padding:8px 0;">

                    </div>

                    <button type="submit" class="btn" style="width: 100%;">Save Changes</button>

                    <p id="editMsg" style="text-align: center; margin-top: 10px; font-weight: bold;"></p>

                </form>

            </div>

        </div>

    `;

}



export function init() {

    const listContainer = document.getElementById('bouquetsListContainer');

    const msg = document.getElementById('bMsg');

    const editModal = document.getElementById('editModal');

    

    // Auth Headers Helper

    const getHeaders = (isJson = false) => {

        const headers = { 'Authorization': 'Bearer ' + Store.getToken() };

        if (isJson) headers['Content-Type'] = 'application/json';

        return headers;

    };

    

    // Function to handle image uploads

    async function uploadImage(fileInputId) {

        const fileInput = document.getElementById(fileInputId);

        if (!fileInput.files || fileInput.files.length === 0) return null;

        

        const formData = new FormData();

        formData.append('file', fileInput.files[0]);

        

        const res = await fetch('http://127.0.0.1:5000/api/upload', {

            method: 'POST',

            headers: getHeaders(false),

            body: formData

        });

        const data = await res.json();

        if (data.success) return data.url;

        throw new Error(data.message || 'Image upload failed');

    }

    

    // Load Bouquets

    const loadBouquets = () => {

        listContainer.innerHTML = `<div style="text-align:center; padding:20px;">Loading bouquets...</div>`;

        fetch('http://127.0.0.1:5000/api/bouquets', { headers: getHeaders(false) })

            .then(res => res.json())

            .then(data => {

                if (!data.success) {

                    listContainer.innerHTML = `<div style="color:var(--danger); text-align:center;">Failed to load bouquets.</div>`;

                    return;

                }

                const bouquets = data.bouquets || [];

                if (bouquets.length === 0) {

                    listContainer.innerHTML = `<div style="text-align:center; color:var(--text-muted);">No bouquets in inventory.</div>`;

                    return;

                }

                

                listContainer.innerHTML = bouquets.map(b => `

                    <div style="display:flex; align-items:center; gap:20px; padding:15px; border-bottom:1px solid var(--border-color); flex-wrap:wrap;">

                        <img src="${Utils.escapeHtml(b.image)}" alt="${Utils.escapeHtml(b.name)}" style="width:80px; height:80px; object-fit:cover; border-radius:10px; flex-shrink:0;" onerror="this.onerror=null; this.src='assets/images/bouquets/hero-bouquet.jpeg';">

                        <div style="flex:1; min-width:200px;">

                            <div style="font-weight:700; color:var(--text-dark); font-size:16px;">${Utils.escapeHtml(b.name)} <span style="font-weight:normal; color:var(--text-muted); font-size:13px;">(#${Utils.escapeHtml(b.id)})</span></div>

                            <div style="color:var(--text-muted); font-size:14px; margin:4px 0;">Category: ${Utils.escapeHtml(b.category)}</div>

                            <div style="color:var(--primary); font-weight:700;">₹${b.price} <span style="margin-left:15px; color:${b.stock > 0 ? 'var(--success)' : 'var(--danger)'};">Stock: ${b.stock}</span></div>

                        </div>

                        <div style="display:flex; gap:10px;">

                            <button class="edit-btn btn-secondary" data-id="${Utils.escapeHtml(b.id)}" style="padding:8px 15px;">Edit</button>

                            <button class="delete-btn btn-secondary" data-id="${Utils.escapeHtml(b.id)}" style="padding:8px 15px; background:var(--danger-bg); color:var(--danger); border-color:var(--danger-bg);">Delete</button>

                        </div>

                    </div>

                `).join('');

                

                // Add Edit Listeners

                document.querySelectorAll('.edit-btn').forEach(btn => {

                    btn.addEventListener('click', (e) => {

                        const id = e.target.getAttribute('data-id');

                        const bouquet = bouquets.find(bq => bq.id === id);

                        if(bouquet) {

                            document.getElementById('editId').value = bouquet.id;

                            document.getElementById('editName').value = bouquet.name;

                            const catOptions = Array.from(document.getElementById('editCategory').options).map(o => o.value);

                            document.getElementById('editCategory').value = catOptions.includes(bouquet.category) ? bouquet.category : 'Other';

                            document.getElementById('editPrice').value = bouquet.price;

                            document.getElementById('editStock').value = bouquet.stock;

                            document.getElementById('editExistingImage').value = bouquet.image || '';

                            document.getElementById('editImageFile').value = ""; // Reset file input

                            editModal.style.display = 'flex';

                        }

                    });

                });

                

                // Add Delete Listeners

                document.querySelectorAll('.delete-btn').forEach(btn => {

                    btn.addEventListener('click', (e) => {

                        if (confirm('Are you sure you want to delete this bouquet?')) {

                            const id = e.target.getAttribute('data-id');

                            e.target.textContent = '...';

                            fetch(`http://127.0.0.1:5000/api/bouquets?id=${encodeURIComponent(id)}`, { 

                                method: 'DELETE', 

                                headers: getHeaders(false) 

                            })

                            .then(res => res.json())

                            .then(delData => {

                                if(delData.success) loadBouquets();

                                else alert("Failed to delete.");

                            })

                            .catch(err => console.error(err));

                        }

                    });

                });

            })

            .catch(err => {

                listContainer.innerHTML = `<div style="color:var(--danger); text-align:center;">Error loading bouquets.</div>`;

                console.error(err);

            });

    };

    

    // Setup Add Form

    document.getElementById('addBouquetForm').addEventListener('submit', async (e) => {

        e.preventDefault();

        msg.textContent = "Processing...";

        msg.style.color = "#333";

        

        try {

            let imageUrl = 'assets/images/bouquets/hero-bouquet.jpeg'; // default

            try {

                const uploadedUrl = await uploadImage('bImageFile');

                if (uploadedUrl) imageUrl = uploadedUrl;

            } catch (imgErr) {

                console.error("Image upload skipped/failed:", imgErr);

            }

            

            const newBouquet = {

                id: document.getElementById('bId').value,

                name: document.getElementById('bName').value,

                category: document.getElementById('bCategory').value,

                price: Number(document.getElementById('bPrice').value),

                stock: Number(document.getElementById('bStock').value),

                image: imageUrl

            };

            

            const res = await fetch('http://127.0.0.1:5000/api/bouquets', {

                method: 'POST',

                headers: getHeaders(true),

                body: JSON.stringify(newBouquet)

            });

            const data = await res.json();

            

            if (data.success) {

                msg.textContent = "Bouquet added successfully!";

                msg.style.color = "var(--success)";

                document.getElementById('addBouquetForm').reset();

                loadBouquets();

            } else {

                msg.textContent = data.message || "Failed to add bouquet.";

                msg.style.color = "var(--danger)";

            }

        } catch (err) {

            msg.textContent = "Server error.";

            msg.style.color = "var(--danger)";

            console.error(err);

        }

    });



    // Setup Edit Form

    document.getElementById('closeEditModal').addEventListener('click', () => {

        editModal.style.display = 'none';

    });



    document.getElementById('editBouquetForm').addEventListener('submit', async (e) => {

        e.preventDefault();

        const editMsg = document.getElementById('editMsg');

        editMsg.textContent = "Processing...";

        editMsg.style.color = "#333";

        

        try {

            let imageUrl = document.getElementById('editExistingImage').value;

            try {

                const uploadedUrl = await uploadImage('editImageFile');

                if (uploadedUrl) imageUrl = uploadedUrl;

            } catch (imgErr) {

                console.error("Image upload skipped/failed:", imgErr);

            }

            

            const updatedData = {

                id: document.getElementById('editId').value,

                name: document.getElementById('editName').value,

                category: document.getElementById('editCategory').value,

                price: Number(document.getElementById('editPrice').value),

                stock: Number(document.getElementById('editStock').value),

                image: imageUrl

            };

            

            const res = await fetch('http://127.0.0.1:5000/api/bouquets', {

                method: 'PUT',

                headers: getHeaders(true),

                body: JSON.stringify(updatedData)

            });

            const data = await res.json();

            

            if (data.success) {

                editMsg.textContent = "Changes saved!";

                editMsg.style.color = "var(--success)";

                setTimeout(() => {

                    editModal.style.display = 'none';

                    loadBouquets();

                    editMsg.textContent = "";

                }, 1000);

            } else {

                editMsg.textContent = data.message || "Failed to save.";

                editMsg.style.color = "var(--danger)";

            }

        } catch (err) {

            editMsg.textContent = "Server error.";

            editMsg.style.color = "var(--danger)";

            console.error(err);

        }

    });



    // Initial Load

    loadBouquets();

}

