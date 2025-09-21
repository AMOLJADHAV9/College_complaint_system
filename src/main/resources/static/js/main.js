// Main JavaScript for Student Complaint System

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    initializeModals();
    initializeAnimations();
    initializeForms();
    initializeNavigation();
}

// Modal Management
function initializeModals() {
    const modals = document.querySelectorAll('.modal');
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const closeBtns = document.querySelectorAll('.close');

    // Open modal
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close modal
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });

    // Close modal on outside click
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });
}

// Form Management
function initializeForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}

// Handle Login
async function handleLogin(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('.form-submit');
    
    // Show loading state
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<span class="loading"></span>Signing In...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: formData.get('username'),
                password: formData.get('password')
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Store JWT token
            localStorage.setItem('jwtToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('username', data.user.username);
            
            showAlert('Login successful! Redirecting...', 'success');
            
            // Redirect to student dashboard
            setTimeout(() => {
                window.location.href = '/student/dashboard';
            }, 1500);
            
        } else {
            showAlert(data.message || 'Login failed. Please check your credentials.', 'error');
        }
        
    } catch (error) {
        console.error('Login error:', error);
        showAlert('Network error. Please try again.', 'error');
    } finally {
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Handle Registration
async function handleRegister(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('.form-submit');
    
    // Validate passwords match
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    
    if (password !== confirmPassword) {
        showAlert('Passwords do not match!', 'error');
        return;
    }
    
    // Show loading state
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<span class="loading"></span>Creating Account...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: formData.get('username'),
                email: formData.get('email'),
                password: password
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showAlert('Account created successfully! Please login.', 'success');
            
            // Switch to login form
            setTimeout(() => {
                document.getElementById('registerModal').style.display = 'none';
                document.getElementById('loginModal').style.display = 'block';
            }, 2000);
            
        } else {
            showAlert(data.message || 'Registration failed. Please try again.', 'error');
        }
        
    } catch (error) {
        console.error('Registration error:', error);
        showAlert('Network error. Please try again.', 'error');
    } finally {
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Show Alert Messages
function showAlert(message, type = 'info') {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Create new alert
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    // Insert at the beginning of modal body or page
    const modalBody = document.querySelector('.modal:not([style*="display: none"]) .modal-body');
    if (modalBody) {
        modalBody.insertBefore(alert, modalBody.firstChild);
    } else {
        document.body.insertBefore(alert, document.body.firstChild);
    }
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}

// Navigation Management
function initializeNavigation() {
    // Smooth scrolling for anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(102, 126, 234, 0.95)';
        } else {
            header.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }
    });
}

// Animation on Scroll
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .stat-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Toggle between login and register forms
function toggleAuthForm(targetForm) {
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    
    if (targetForm === 'register') {
        loginModal.style.display = 'none';
        registerModal.style.display = 'block';
    } else {
        registerModal.style.display = 'none';
        loginModal.style.display = 'block';
    }
}

// Check Authentication Status
function checkAuth() {
    const token = localStorage.getItem('jwtToken');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        // User is logged in
        const userData = JSON.parse(user);
        updateHeaderForLoggedInUser(userData);
        return true;
    }
    return false;
}

// Update Header for Logged In User
function updateHeaderForLoggedInUser(user) {
    const loginBtn = document.querySelector('.btn-login');
    if (loginBtn) {
        loginBtn.innerHTML = `👤 ${user.username}`;
        loginBtn.onclick = function() {
            window.location.href = '/student/student_dashboard';
        };
    }
}

// Logout Function
function logout() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    localStorage.removeItem('username');
    window.location.href = '/';
}

// Utility Functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Check auth status on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
});