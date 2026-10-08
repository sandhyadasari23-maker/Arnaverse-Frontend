import { Store } from '../main.js';

export function render() {
    return `
        <main class="register-section">
            <div class="decor one"></div>
            <div class="decor two"></div>
            <div class="decor three"></div>
            <div class="register-card">
                <div class="card-header">
                    <div class="flower-icon">🌸</div>
                    <div class="card-brand">ARNAVERSE</div>
                    <div class="card-tagline">Smart Online Bouquet Ordering</div>
                    <h2 class="card-title">Create Account</h2>
                    <p class="card-subtitle">Register with Arnaverse</p>
                </div>
                
                <div id="message" class="message" style="display:none; padding:12px 15px; border-radius:9px; margin-bottom:18px; font-size:14px; text-align:center; font-weight:600;"></div>
                
                <form id="registerForm">
                    <div class="form-group">
                        <label for="name">Full Name</label>
                        <div class="input-wrapper">
                            <i class="fa-regular fa-user"></i>
                            <input type="text" id="name" placeholder="Enter your full name" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <div class="input-wrapper">
                            <i class="fa-regular fa-envelope"></i>
                            <input type="email" id="email" placeholder="Enter your email address" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <div class="input-wrapper">
                            <i class="fa-solid fa-lock"></i>
                            <input type="password" id="password" placeholder="Enter your password" required>
                            <button type="button" class="password-toggle" data-target="password"><i class="fa-regular fa-eye"></i></button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="confirmPassword">Confirm Password</label>
                        <div class="input-wrapper">
                            <i class="fa-solid fa-lock"></i>
                            <input type="password" id="confirmPassword" placeholder="Confirm your password" required>
                            <button type="button" class="password-toggle" data-target="confirmPassword"><i class="fa-regular fa-eye"></i></button>
                        </div>
                    </div>
                    <button type="submit" class="register-btn">
                        Register <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </form>
                
                <div class="login-text">
                    Already have an account? <a href="#/login">Login here</a>
                </div>
            </div>
        </main>
    `;
}

export function init() {
    document.querySelectorAll('.password-toggle').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const input = document.getElementById(e.currentTarget.dataset.target);
            const icon = e.currentTarget.querySelector('i');
            if (input.type === "password") {
                input.type = "text";
                icon.classList.replace("fa-eye", "fa-eye-slash");
            } else {
                input.type = "password";
                icon.classList.replace("fa-eye-slash", "fa-eye");
            }
        });
    });

    const showMessage = (text, type) => {
        const msg = document.getElementById("message");
        msg.textContent = text;
        msg.style.display = 'block';
        if (type === 'error') {
            msg.style.background = '#fff0f2'; msg.style.color = '#b32645'; msg.style.border = '1px solid #f0bcc7';
        } else {
            msg.style.background = '#eaf8ef'; msg.style.color = '#217542'; msg.style.border = '1px solid #bce4c9';
        }
    };

    document.getElementById("registerForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            showMessage("Passwords do not match.", "error");
            return;
        }
        if (password.length < 6) {
            showMessage("Password must be at least 6 characters.", "error");
            return;
        }

        const user = { name, email, password, phone: "", city: "", address: "" };
        
        showMessage("Registering...", "");
        
        fetch('http://127.0.0.1:5000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showMessage("Registration successful! Redirecting to login...", "success");
                setTimeout(() => window.location.hash = "#/login", 1000);
            } else {
                showMessage(data.message || "Registration failed.", "error");
            }
        })
        .catch(err => {
            showMessage("Cannot connect to server. Please make sure the backend server is running.", "error");
            
        });
    });
}