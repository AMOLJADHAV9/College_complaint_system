// Profile Page JavaScript for Student Complaint System

// Profile initialization
document.addEventListener('DOMContentLoaded', function() {
    initializeProfile();
});

// Initialize Profile
function initializeProfile() {
    checkAuthentication();
    loadProfileData();
    loadProfileStats();
    loadRecentActivity();
    initializeProfileForms();
    initializeSettings();
}

// Check if user is authenticated
function checkAuthentication() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
        window.location.href = '/';
        return;
    }
}

// Load profile data
function loadProfileData() {
    const user = localStorage.getItem('user');
    if (user) {
        const userData = JSON.parse(user);
        updateProfileDisplay(userData);
    }
    
    // Load additional profile data from API
    loadExtendedProfileData();
}

// Update profile display
function updateProfileDisplay(userData) {
    // Update profile header
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const avatarInitials = document.getElementById('avatarInitials');
    
    if (profileName) {
        profileName.textContent = userData.username || 'Student';
    }
    
    if (profileEmail) {
        profileEmail.textContent = userData.email || 'No email provided';
    }
    
    if (avatarInitials) {
        avatarInitials.textContent = (userData.username || 'S').charAt(0).toUpperCase();
    }
    
    // Update personal information section
    updatePersonalInfo(userData);
}

// Update personal information section
function updatePersonalInfo(userData) {
    const elements = {
        infoFullName: userData.username || 'Not provided',
        infoEmail: userData.email || 'Not provided',
        infoStudentId: userData.studentId || 'Not provided',
        infoPhone: userData.phone || 'Not provided',
        infoDepartment: userData.department || 'Not specified',
        infoYear: userData.year || 'Not specified'
    };
    
    for (const [id, value] of Object.entries(elements)) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
}

// Load extended profile data from API
async function loadExtendedProfileData() {
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch('/api/user/profile', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const profileData = await response.json();
            updatePersonalInfo(profileData);
        }
    } catch (error) {
        console.error('Error loading extended profile data:', error);
    }
}

// Load profile statistics
async function loadProfileStats() {
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch('/api/complaints/stats', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const stats = await response.json();
            updateProfileStats(stats);
        } else {
            // Use mock data
            const mockStats = {
                total: 0,
                resolved: 0,
                memberSince: new Date().getFullYear()
            };
            updateProfileStats(mockStats);
        }
    } catch (error) {
        console.error('Error loading profile stats:', error);
        // Use mock data on error
        const mockStats = {
            total: 0,
            resolved: 0,
            memberSince: new Date().getFullYear()
        };
        updateProfileStats(mockStats);
    }
}

// Update profile statistics display
function updateProfileStats(stats) {
    const totalElement = document.getElementById('profileTotalComplaints');
    const resolvedElement = document.getElementById('profileResolvedComplaints');
    const memberSinceElement = document.getElementById('profileMemberSince');
    
    if (totalElement) {
        totalElement.textContent = stats.total || 0;
    }
    
    if (resolvedElement) {
        resolvedElement.textContent = stats.resolved || 0;
    }
    
    if (memberSinceElement) {
        memberSinceElement.textContent = stats.memberSince || new Date().getFullYear();
    }
}

// Load recent activity
async function loadRecentActivity() {
    const token = localStorage.getItem('token');
    const activityContainer = document.getElementById('recentActivity');
    
    if (!activityContainer) return;
    
    try {
        const response = await fetch('/api/user/activity', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const activities = await response.json();
            displayRecentActivity(activities);
        } else {
            // Show mock activity
            displayRecentActivity(getMockActivity());
        }
    } catch (error) {
        console.error('Error loading recent activity:', error);
        displayRecentActivity(getMockActivity());
    }
}

// Display recent activity
function displayRecentActivity(activities) {
    const activityContainer = document.getElementById('recentActivity');
    
    if (!activityContainer) return;
    
    if (activities.length === 0) {
        activityContainer.innerHTML = `
            <div class="activity-loading">
                📭 No recent activity
            </div>
        `;
        return;
    }
    
    const activitiesHtml = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">${getActivityIcon(activity.type)}</div>
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-description">${activity.description}</div>
                <div class="activity-time">${formatDate(activity.timestamp)}</div>
            </div>
        </div>
    `).join('');
    
    activityContainer.innerHTML = activitiesHtml;
}

// Get activity icon based on type
function getActivityIcon(type) {
    const icons = {
        complaint: '📝',
        update: '🔄',
        resolution: '✅',
        login: '🔐',
        profile: '👤',
        default: '📋'
    };
    
    return icons[type] || icons.default;
}

// Get mock activity data
function getMockActivity() {
    return [
        {
            type: 'complaint',
            title: 'Complaint Submitted',
            description: 'You submitted a new complaint about library facilities',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            type: 'update',
            title: 'Complaint Update',
            description: 'Your complaint #123 status was updated to "In Progress"',
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            type: 'login',
            title: 'Account Access',
            description: 'You logged into your account',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
        }
    ];
}

// Initialize profile forms
function initializeProfileForms() {
    const editInfoForm = document.getElementById('editInfoForm');
    const changePasswordForm = document.getElementById('changePasswordForm');
    
    if (editInfoForm) {
        editInfoForm.addEventListener('submit', handleEditInfo);
    }
    
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', handleChangePassword);
    }
}

// Handle edit personal info
async function handleEditInfo(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const token = localStorage.getItem('token');
    
    // Show loading state
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<span class="loading"></span>Saving...';
    submitBtn.disabled = true;
    
    try {
        const profileData = {
            fullName: formData.get('fullName'),
            studentId: formData.get('studentId'),
            phone: formData.get('phone'),
            department: formData.get('department'),
            year: formData.get('year')
        };
        
        const response = await fetch('/api/user/profile', {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(profileData)
        });
        
        if (response.ok) {
            showAlert('Profile updated successfully!', 'success');
            closeModal('editInfoModal');
            loadProfileData(); // Reload profile data
        } else {
            const error = await response.json();
            showAlert(error.message || 'Failed to update profile.', 'error');
        }
        
    } catch (error) {
        console.error('Error updating profile:', error);
        showAlert('Network error. Please try again.', 'error');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Handle change password
async function handleChangePassword(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const token = localStorage.getItem('token');
    
    // Validate passwords match
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmNewPassword');
    
    if (newPassword !== confirmPassword) {
        showAlert('New passwords do not match!', 'error');
        return;
    }
    
    // Show loading state
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<span class="loading"></span>Updating...';
    submitBtn.disabled = true;
    
    try {
        const passwordData = {
            currentPassword: formData.get('currentPassword'),
            newPassword: newPassword
        };
        
        const response = await fetch('/api/user/change-password', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(passwordData)
        });
        
        if (response.ok) {
            showAlert('Password updated successfully!', 'success');
            closeModal('changePasswordModal');
            form.reset();
        } else {
            const error = await response.json();
            showAlert(error.message || 'Failed to update password.', 'error');
        }
        
    } catch (error) {
        console.error('Error updating password:', error);
        showAlert('Network error. Please try again.', 'error');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Initialize settings
function initializeSettings() {
    const settingsInputs = document.querySelectorAll('.toggle-switch input');
    
    settingsInputs.forEach(input => {
        input.addEventListener('change', handleSettingChange);
    });
    
    // Load current settings
    loadUserSettings();
}

// Load user settings
async function loadUserSettings() {
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch('/api/user/settings', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const settings = await response.json();
            updateSettingsDisplay(settings);
        }
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

// Update settings display
function updateSettingsDisplay(settings) {
    const emailNotifications = document.getElementById('emailNotifications');
    const smsNotifications = document.getElementById('smsNotifications');
    const privacyMode = document.getElementById('privacyMode');
    
    if (emailNotifications && settings.emailNotifications !== undefined) {
        emailNotifications.checked = settings.emailNotifications;
    }
    
    if (smsNotifications && settings.smsNotifications !== undefined) {
        smsNotifications.checked = settings.smsNotifications;
    }
    
    if (privacyMode && settings.privacyMode !== undefined) {
        privacyMode.checked = settings.privacyMode;
    }
}

// Handle setting change
async function handleSettingChange(e) {
    const settingName = e.target.id;
    const settingValue = e.target.checked;
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch('/api/user/settings', {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                [settingName]: settingValue
            })
        });
        
        if (response.ok) {
            showAlert('Setting updated successfully!', 'success');
        } else {
            // Revert the change
            e.target.checked = !settingValue;
            showAlert('Failed to update setting.', 'error');
        }
        
    } catch (error) {
        console.error('Error updating setting:', error);
        // Revert the change
        e.target.checked = !settingValue;
        showAlert('Network error. Please try again.', 'error');
    }
}

// Profile action functions
function editPersonalInfo() {
    // Populate form with current data
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    const form = document.getElementById('editInfoForm');
    if (form) {
        form.fullName.value = user.fullName || user.username || '';
        form.studentId.value = user.studentId || '';
        form.phone.value = user.phone || '';
        form.department.value = user.department || '';
        form.year.value = user.year || '';
    }
    
    openModal('editInfoModal');
}

function changePassword() {
    openModal('changePasswordModal');
}

function changeAvatar() {
    showAlert('Avatar change functionality will be available soon!', 'info');
}

function downloadData() {
    if (confirm('This will download all your data including complaints and personal information. Continue?')) {
        showAlert('Data download functionality will be available soon!', 'info');
    }
}

function deleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        if (confirm('This will permanently delete all your data. Are you absolutely sure?')) {
            showAlert('Account deletion functionality will be available soon!', 'warning');
        }
    }
}

function refreshActivity() {
    loadRecentActivity();
    showAlert('Activity refreshed!', 'success');
}

// Modal functions (inherited from main.js but enhanced for profile)
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Show alert messages
function showAlert(message, type = 'info') {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Create new alert
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alert.style.position = 'fixed';
    alert.style.top = '100px';
    alert.style.right = '20px';
    alert.style.zIndex = '9999';
    alert.style.maxWidth = '400px';
    alert.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
    
    document.body.appendChild(alert);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}

// Format date for display
function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    }
}