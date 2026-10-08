import { Store } from '../main.js';

export function render() {
    return `
        <main class="login-page">
            <div class="login-wrapper">
                <!-- LEFT INTRO -->
                <section class="login-intro">
                    <div class="intro-flower">🌸</div>
                    <h1>Welcome Back<br><em>to Arnaverse</em></h1>
                    <p>Login to your Arnaverse account and continue your beautiful bouquet shopping experience.</p>
                    <div class="intro-features">
                        <div class="intro-feature"><i class="fa-solid fa-flower"></i><span>Explore beautiful bouquets</span></div>
                        <div class="intro-feature"><i class="fa-solid fa-wand-magic-sparkles"></i><span>Customize your bouquet</span></div>
                        <div class="intro-feature"><i class="fa-solid fa-truck"></i><span>Track your orders easily</span></div>
                    </div>
                </section>
                
                <!-- LOGIN CARD -->
                <section class="login-card">
                    <div class="login-heading">
                        <p class="eyebrow">ARNAVERSE ACCOUNT</p>
                        <h2>Sign In</h2>
                        <p>Login to continue to your account.</p>
                    </div>
                    
                    <p class="login-type-title">Login As</p>
                    <div class="login-type">
                        <div class="type-option">
                            <input type="radio" id="userLogin" name="loginType" value="user" checked>
                            <label for="userLogin" class="type-label"><i class="fa-solid fa-user"></i> User</label>
                        </div>
                        <div class="type-option">
                            <input type="radio" id="adminLogin" name="loginType" value="admin">
                            <label for="adminLogin" class="type-label"><i class="fa-solid fa-user-shield"></i> Admin</label>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <div class="input-wrapper">
                            <i class="fa-solid fa-envelope"></i>
                            <input type="email" id="email" placeholder="Enter your email" autocomplete="off">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="password">Password</label>
                        <div class="password-wrapper">
                            <div class="input-wrapper">
                                <i class="fa-solid fa-lock"></i>
                                <input type="password" id="password" placeholder="Enter your password" autocomplete="new-password">
                            </div>
                            <button type="button" class="show-password" id="showPassword" aria-label="Show password"><i class="fa-solid fa-eye"></i></button>
                        </div>
                    </div>
                    
                    <button type="button" class="login-submit" id="loginBtn">
                        Login <i class="fa-solid fa-arrow-right"></i>
                    </button>
                    
                    <p id="loginMessage" style="min-height:22px; text-align:center; margin-top:15px; font-size:14px; font-weight:600;"></p>
                    
                    <p class="register-text">Don't have an account? <a href="#/register">Register here</a></p>
                </section>
            </div>
        </main>
    `;
}

export function init() {
    // Clear browser autofill if any
    setTimeout(() => {
        const emailEl = document.getElementById("email");
        const passEl = document.getElementById("password");
        if (emailEl) emailEl.value = '';
        if (passEl) passEl.value = '';
    }, 50);

    const showPassword = document.getElementById("showPassword");
    const password = document.getElementById("password");
    
    showPassword.addEventListener("click", () => {
        if (password.type === "password") {
            password.type = "text";
            showPassword.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
        } else {
            password.type = "password";
            showPassword.innerHTML = '<i class="fa-solid fa-eye"></i>';
        }
    });

    const handleLogin = () => {
        const email = document.getElementById("email").value.trim().toLowerCase();
        const passwordValue = password.value;
        const loginType = document.querySelector('input[name="loginType"]:checked').value;
        const message = document.getElementById("loginMessage");

        if (!email || !passwordValue) {
            message.textContent = "Please enter email and password.";
            message.style.color = "#c62828";
            return;
        }

        // Connect to Python Backend
        message.textContent = "Logging in...";
        message.style.color = "#333";
        
        fetch('http://127.0.0.1:5000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: passwordValue })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                if (loginType === "admin") {
                    if (data.user.is_admin) {
                        localStorage.setItem("arnaverseToken", data.token);
                        localStorage.setItem("arnaverseAdminLoggedIn", "true");
                        localStorage.setItem("arnaverseAdmin", JSON.stringify(data.user));
                        
                        // Also set user login so normal app works if they navigate there
                        localStorage.setItem("arnaverseLoggedIn", "true");
                        localStorage.setItem("arnaverseUser", JSON.stringify(data.user));
                        localStorage.setItem("arnaverseCurrentUser", JSON.stringify(data.user));
                        
                        message.textContent = "Admin login successful!";
                        message.style.color = "#198754";
                        setTimeout(() => window.location.hash = "#/admin-dashboard", 600);
                    } else {
                        message.textContent = "Unauthorized. You are not an admin.";
                        message.style.color = "#c62828";
                    }
                } else {
                    // User Login
                    if (data.token) localStorage.setItem("arnaverseToken", data.token);
                    localStorage.setItem("arnaverseLoggedIn", "true");
                    // Clear admin state so they don't have conflicting roles
                    localStorage.removeItem("arnaverseAdminLoggedIn");
                    localStorage.removeItem("arnaverseAdmin");
                    localStorage.setItem("arnaverseCurrentUser", JSON.stringify(data.user));
                    localStorage.setItem("arnaverseUser", JSON.stringify(data.user));
                    
                    message.textContent = "Login successful!";
                    message.style.color = "#198754";
                    setTimeout(() => window.location.hash = "#/", 600);
                }
            } else {
                message.textContent = data.message || "Invalid email or password.";
                message.style.color = "#c62828";
            }
        })
        .catch(err => {
            message.textContent = "Cannot connect to server. Please make sure the backend server is running.";
            message.style.color = "#c62828";
            
        });
    };

    document.getElementById("loginBtn").addEventListener("click", handleLogin);
    password.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleLogin();
    });
}