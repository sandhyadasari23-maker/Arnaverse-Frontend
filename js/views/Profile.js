import { Store } from '../main.js';

export function render() {
    return `
        <main class="profile-page">
            <h1 class="profile-title">My Profile</h1>
            <div class="profile-card">
                <div class="profile-avatar">🌸</div>
                <h2 class="profile-name" id="profileName">My Profile</h2>
                <form id="profileForm" class="profile-form">
                    <div class="profile-group">
                        <label for="profileFullName">Full Name</label>
                        <input type="text" id="profileFullName" required>
                    </div>
                    <div class="profile-group">
                        <label for="profileEmail">Email Address</label>
                        <input type="email" id="profileEmail" required>
                    </div>
                    <div class="profile-group">
                        <label for="profilePhone">Phone Number</label>
                        <input type="tel" id="profilePhone" placeholder="Enter phone number">
                    </div>
                    <div class="profile-group">
                        <label for="profileCity">City</label>
                        <input type="text" id="profileCity" placeholder="Enter city">
                    </div>
                    <div class="profile-group full-width">
                        <label for="profileAddress">Address</label>
                        <textarea id="profileAddress" placeholder="Enter your complete address"></textarea>
                    </div>
                    <button type="submit" class="save-profile-btn">Save Profile</button>
                </form>
                
                <p id="profileMessage" style="text-align: center; margin-top: 15px; font-weight: bold;"></p>
                
                <div class="profile-actions" style="margin-top: 25px; display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
                    <a href="#/orders" style="padding: 11px 20px; border-radius: 8px; background: #a8325d; color: white; text-decoration: none; font-weight: bold;">Previous Orders</a>
                    <button id="logoutBtn" style="padding: 11px 20px; border-radius: 8px; background: #f3d5e1; color: #a8325d; font-weight: bold; border: none; cursor: pointer;">Logout</button>
                </div>
            </div>
        </main>
    `;
}

export function init() {
    const user = Store.getUser();
    
    // Auth Guard - Redirect to login if not authenticated
    if (!user) {
        window.location.hash = '#/register';
        return;
    }

    // Populate Fields
    document.getElementById('profileFullName').value = user.name || "";
    document.getElementById('profileEmail').value = user.email || "";
    document.getElementById('profilePhone').value = user.phone || "";
    document.getElementById('profileCity').value = user.city || "";
    document.getElementById('profileAddress').value = user.address || "";
    document.getElementById('profileName').textContent = user.name || "My Profile";

    // Handle Save
    document.getElementById('profileForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const updatedUser = {
            email: document.getElementById('profileEmail').value.trim(),
            name: document.getElementById('profileFullName').value.trim(),
            phone: document.getElementById('profilePhone').value.trim(),
            city: document.getElementById('profileCity').value.trim(),
            address: document.getElementById('profileAddress').value.trim()
        };

        const msg = document.getElementById('profileMessage');
        msg.textContent = "Saving profile...";
        msg.style.color = "#333";
        
        fetch('http://127.0.0.1:5000/api/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedUser)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                // Keep frontend auth state in sync
                const completeUser = { ...user, ...data.user };
                localStorage.setItem("arnaverseUser", JSON.stringify(completeUser));
                localStorage.setItem("arnaverseCurrentUser", JSON.stringify(completeUser));
                
                document.getElementById('profileName').textContent = completeUser.name || "My Profile";
                
                msg.textContent = "Profile updated successfully!";
                msg.style.color = "green";
                setTimeout(() => msg.textContent = "", 2500);
            } else {
                msg.textContent = data.message || "Failed to update profile.";
                msg.style.color = "red";
                if (data.message && data.message.includes("User not found")) {
                    setTimeout(() => Store.logoutUser(), 2000);
                }
            }
        })
        .catch(err => {
            msg.textContent = "Cannot connect to server. Please make sure the backend server is running.";
            msg.style.color = "red";
            
        });
    });

    // Handle Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        Store.logoutUser(); // Dispatches navigation and clears storage
    });
}