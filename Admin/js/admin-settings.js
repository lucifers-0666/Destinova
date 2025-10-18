/* Admin Settings JavaScript - Destinova */

// Global Variables
let currentTab = 'general';
let settingsData = {};
let unsavedChanges = false;
let autoSaveInterval = null;
let currentEmailTemplate = 'booking';
let currentSMSTemplate = 'booking';

// Initialize Settings
document.addEventListener('DOMContentLoaded', function() {
    initializeSettings();
    setupEventListeners();
    loadSettingsData();
    startAutoSave();
    setupKeyboardShortcuts();
});

// Initialize Settings Module
function initializeSettings() {
    console.log('Initializing Admin Settings...');
    
    // Set default tab from localStorage or use 'general'
    const savedTab = localStorage.getItem('adminSettingsTab');
    if (savedTab) {
        switchTab(savedTab);
    } else {
        switchTab('general');
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.dataset.tab;
            switchTab(tab);
        });
    });
    
    // Form inputs change tracking
    document.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('change', handleFormInput);
        input.addEventListener('input', handleFormInput);
    });
    
    // Save All button
    const saveAllBtn = document.querySelector('.btn-save-all');
    if (saveAllBtn) {
        saveAllBtn.addEventListener('click', saveAllSettings);
    }
    
    // Reset button
    const resetBtn = document.querySelector('.btn-reset');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetToDefaults);
    }
    
    // Test SMTP Connection
    const testSMTPBtn = document.getElementById('testSMTPBtn');
    if (testSMTPBtn) {
        testSMTPBtn.addEventListener('click', testSMTPConnection);
    }
    
    // Test SMS Connection
    const testSMSBtn = document.getElementById('testSMSBtn');
    if (testSMSBtn) {
        testSMSBtn.addEventListener('click', testSMSConnection);
    }
    
    // Template Selectors
    document.querySelectorAll('.template-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.closest('.email-templates')) {
                selectEmailTemplate(this.dataset.template);
            } else if (this.closest('.sms-templates')) {
                selectSMSTemplate(this.dataset.template);
            }
        });
    });
    
    // Logo Upload
    const siteLogo = document.getElementById('siteLogo');
    const favicon = document.getElementById('favicon');
    
    if (siteLogo) {
        siteLogo.addEventListener('change', function() {
            uploadLogo(this, 'site-logo');
        });
    }
    
    if (favicon) {
        favicon.addEventListener('change', function() {
            uploadLogo(this, 'favicon');
        });
    }
    
    // Color Pickers
    document.querySelectorAll('input[type="color"]').forEach(picker => {
        picker.addEventListener('change', handleColorChange);
        picker.addEventListener('input', handleColorChange);
    });
    
    // File Upload Drag & Drop
    setupFileUploadAreas();
    
    // Airline Management
    const addAirlineBtn = document.getElementById('addAirlineBtn');
    if (addAirlineBtn) {
        addAirlineBtn.addEventListener('click', addAirline);
    }
    
    // Airport Management
    const addAirportBtn = document.getElementById('addAirportBtn');
    if (addAirportBtn) {
        addAirportBtn.addEventListener('click', addAirport);
    }
    
    // API Key Generation
    const generateAPIKeyBtn = document.getElementById('generateAPIKeyBtn');
    if (generateAPIKeyBtn) {
        generateAPIKeyBtn.addEventListener('click', generateAPIKey);
    }
    
    // Webhook Testing
    setupWebhookTests();
    
    // Backup Actions
    const manualBackupBtn = document.getElementById('manualBackupBtn');
    const optimizeDBBtn = document.getElementById('optimizeDBBtn');
    const clearLogsBtn = document.getElementById('clearLogsBtn');
    const archiveDataBtn = document.getElementById('archiveDataBtn');
    
    if (manualBackupBtn) manualBackupBtn.addEventListener('click', performManualBackup);
    if (optimizeDBBtn) optimizeDBBtn.addEventListener('click', optimizeDatabase);
    if (clearLogsBtn) clearLogsBtn.addEventListener('click', clearSystemLogs);
    if (archiveDataBtn) archiveDataBtn.addEventListener('click', archiveOldData);
    
    // Maintenance Mode Toggle
    const maintenanceModeToggle = document.getElementById('maintenanceMode');
    if (maintenanceModeToggle) {
        maintenanceModeToggle.addEventListener('change', toggleMaintenanceMode);
    }
    
    // Character Counter for SMS
    document.querySelectorAll('.sms-template textarea').forEach(textarea => {
        textarea.addEventListener('input', updateCharCount);
    });
    
    // Import/Export Settings
    const importSettingsBtn = document.getElementById('importSettingsBtn');
    const exportSettingsBtn = document.getElementById('exportSettingsBtn');
    
    if (importSettingsBtn) importSettingsBtn.addEventListener('click', importSettings);
    if (exportSettingsBtn) exportSettingsBtn.addEventListener('click', exportSettings);
}

// Switch Tab
function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab content
    const selectedContent = document.getElementById(`${tabName}-tab`);
    if (selectedContent) {
        selectedContent.classList.add('active');
    }
    
    // Add active to selected button
    const selectedBtn = document.querySelector(`[data-tab="${tabName}"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('active');
    }
    
    // Save current tab to localStorage
    currentTab = tabName;
    localStorage.setItem('adminSettingsTab', tabName);
    
    console.log(`Switched to ${tabName} tab`);
}

// Handle Form Input Changes
function handleFormInput(e) {
    unsavedChanges = true;
    showUnsavedIndicator();
    
    // Real-time validation
    validateField(e.target);
}

// Show Unsaved Changes Indicator
function showUnsavedIndicator() {
    const indicator = document.querySelector('.unsaved-indicator');
    if (indicator) {
        indicator.style.display = 'flex';
    }
}

// Hide Unsaved Changes Indicator
function hideUnsavedIndicator() {
    const indicator = document.querySelector('.unsaved-indicator');
    if (indicator) {
        indicator.style.display = 'none';
    }
}

// Validate Field
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // URL validation
    if (field.type === 'url' && value) {
        const urlRegex = /^https?:\/\/.+/;
        if (!urlRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid URL (http:// or https://)';
        }
    }
    
    // Number validation
    if (field.type === 'number' && value) {
        const min = field.getAttribute('min');
        const max = field.getAttribute('max');
        
        if (min && parseFloat(value) < parseFloat(min)) {
            isValid = false;
            errorMessage = `Value must be at least ${min}`;
        }
        
        if (max && parseFloat(value) > parseFloat(max)) {
            isValid = false;
            errorMessage = `Value must be at most ${max}`;
        }
    }
    
    // Show/hide error
    if (!isValid) {
        field.classList.add('error');
        showFieldError(field, errorMessage);
    } else {
        field.classList.remove('error');
        hideFieldError(field);
    }
    
    return isValid;
}

// Show Field Error
function showFieldError(field, message) {
    let errorDiv = field.parentElement.querySelector('.error-message');
    
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        field.parentElement.appendChild(errorDiv);
    }
    
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
}

// Hide Field Error
function hideFieldError(field) {
    const errorDiv = field.parentElement.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Validate All Settings
function validateSettings() {
    let isValid = true;
    
    // Validate all required fields in active tab
    const activeTab = document.querySelector('.tab-content.active');
    const requiredFields = activeTab.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Load Settings Data
async function loadSettingsData() {
    try {
        console.log('Loading settings data...');
        
        // Mock data - Replace with actual API call
        settingsData = {
            general: {
                companyName: 'Destinova Airways',
                companyEmail: 'info@destinova.com',
                companyPhone: '+1-234-567-8900',
                timezone: 'America/New_York',
                currency: 'USD',
                language: 'en',
                maintenanceMode: false,
                comingSoonMode: false
            },
            payment: {
                paypal: { clientId: '', secret: '', testMode: true },
                stripe: { publicKey: '', secretKey: '', testMode: true },
                razorpay: { keyId: '', keySecret: '', testMode: true }
            },
            email: {
                smtpServer: 'smtp.gmail.com',
                smtpPort: '587',
                smtpEncryption: 'tls'
            }
        };
        
        // Populate form fields
        populateFormFields(settingsData);
        
    } catch (error) {
        console.error('Error loading settings:', error);
        showNotification('Failed to load settings', 'error');
    }
}

// Populate Form Fields
function populateFormFields(data) {
    // General Settings
    if (data.general) {
        setFieldValue('companyName', data.general.companyName);
        setFieldValue('companyEmail', data.general.companyEmail);
        setFieldValue('companyPhone', data.general.companyPhone);
        setFieldValue('timezone', data.general.timezone);
        setFieldValue('currency', data.general.currency);
        setFieldValue('language', data.general.language);
        setFieldValue('maintenanceMode', data.general.maintenanceMode, 'checkbox');
        setFieldValue('comingSoonMode', data.general.comingSoonMode, 'checkbox');
    }
    
    // Email Settings
    if (data.email) {
        setFieldValue('smtpServer', data.email.smtpServer);
        setFieldValue('smtpPort', data.email.smtpPort);
        setFieldValue('smtpEncryption', data.email.smtpEncryption);
    }
}

// Set Field Value
function setFieldValue(fieldId, value, type = 'text') {
    const field = document.getElementById(fieldId);
    if (field) {
        if (type === 'checkbox') {
            field.checked = value;
        } else {
            field.value = value;
        }
    }
}

// Get Form Data
function getFormData() {
    const data = {};
    
    // Get all form fields
    document.querySelectorAll('input, select, textarea').forEach(field => {
        const id = field.id;
        if (id) {
            if (field.type === 'checkbox') {
                data[id] = field.checked;
            } else if (field.type === 'file') {
                // Handle file uploads separately
            } else {
                data[id] = field.value;
            }
        }
    });
    
    return data;
}

// Save All Settings
async function saveAllSettings() {
    if (!validateSettings()) {
        showNotification('Please fix validation errors before saving', 'error');
        return;
    }
    
    const saveBtn = document.querySelector('.btn-save-all');
    saveBtn.classList.add('loading');
    
    try {
        const data = getFormData();
        
        console.log('Saving settings:', data);
        
        // Mock API call - Replace with actual endpoint
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Update local storage
        localStorage.setItem('adminSettings', JSON.stringify(data));
        
        unsavedChanges = false;
        hideUnsavedIndicator();
        
        showNotification('Settings saved successfully!', 'success');
        
    } catch (error) {
        console.error('Error saving settings:', error);
        showNotification('Failed to save settings', 'error');
    } finally {
        saveBtn.classList.remove('loading');
    }
}

// Reset to Defaults
function resetToDefaults() {
    if (confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
        // Clear form fields
        document.querySelectorAll('input, select, textarea').forEach(field => {
            if (field.type === 'checkbox') {
                field.checked = false;
            } else if (field.type !== 'file') {
                field.value = '';
            }
        });
        
        unsavedChanges = true;
        showUnsavedIndicator();
        showNotification('Settings reset to defaults. Click Save to apply.', 'info');
    }
}

// Test SMTP Connection
async function testSMTPConnection() {
    const server = document.getElementById('smtpServer').value;
    const port = document.getElementById('smtpPort').value;
    const username = document.getElementById('smtpUsername').value;
    const password = document.getElementById('smtpPassword').value;
    
    if (!server || !port || !username || !password) {
        showNotification('Please fill in all SMTP credentials', 'error');
        return;
    }
    
    const btn = document.getElementById('testSMTPBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing...';
    
    try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        showNotification('SMTP connection successful!', 'success');
    } catch (error) {
        showNotification('SMTP connection failed. Please check your credentials.', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-vial"></i> Test Connection';
    }
}

// Test SMS Connection
async function testSMSConnection() {
    const provider = document.getElementById('smsProvider').value;
    const accountSID = document.getElementById('smsAccountSID').value;
    const authToken = document.getElementById('smsAuthToken').value;
    
    if (!provider || !accountSID || !authToken) {
        showNotification('Please fill in all SMS credentials', 'error');
        return;
    }
    
    const btn = document.getElementById('testSMSBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing...';
    
    try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        showNotification('SMS connection successful!', 'success');
    } catch (error) {
        showNotification('SMS connection failed. Please check your credentials.', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-vial"></i> Test Connection';
    }
}

// Select Email Template
function selectEmailTemplate(template) {
    currentEmailTemplate = template;
    
    // Update button states
    document.querySelectorAll('.email-templates .template-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelector(`.email-templates [data-template="${template}"]`).classList.add('active');
    
    // Load template content (mock data)
    const editor = document.getElementById('emailTemplateEditor');
    if (editor) {
        editor.value = `<!-- ${template} Email Template -->\n<h1>Welcome to Destinova</h1>\n<p>Template content goes here...</p>`;
    }
}

// Select SMS Template
function selectSMSTemplate(template) {
    currentSMSTemplate = template;
    
    // Update button states
    document.querySelectorAll('.sms-templates .template-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelector(`.sms-templates [data-template="${template}"]`).classList.add('active');
}

// Update Character Count
function updateCharCount(e) {
    const textarea = e.target;
    const counter = textarea.nextElementSibling;
    
    if (counter && counter.classList.contains('char-count')) {
        const currentLength = textarea.value.length;
        const maxLength = 160;
        counter.textContent = `${currentLength}/${maxLength} characters`;
        
        if (currentLength > maxLength) {
            counter.style.color = 'var(--admin-danger)';
        } else {
            counter.style.color = '#6c757d';
        }
    }
}

// Upload Logo
function uploadLogo(input, type) {
    const file = input.files[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        showNotification('Please upload a valid image file (JPG, PNG, GIF, WEBP)', 'error');
        return;
    }
    
    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
        showNotification('File size must be less than 2MB', 'error');
        return;
    }
    
    // Preview image
    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = input.closest('.logo-upload-item').querySelector('.logo-preview img');
        if (preview) {
            preview.src = e.target.result;
        }
        
        showNotification(`${type === 'site-logo' ? 'Logo' : 'Favicon'} uploaded successfully!`, 'success');
        unsavedChanges = true;
        showUnsavedIndicator();
    };
    reader.readAsDataURL(file);
}

// Setup File Upload Areas
function setupFileUploadAreas() {
    document.querySelectorAll('.file-upload-area').forEach(area => {
        area.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('drag-over');
        });
        
        area.addEventListener('dragleave', function() {
            this.classList.remove('drag-over');
        });
        
        area.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            
            const input = this.querySelector('input[type="file"]');
            if (input) {
                input.files = e.dataTransfer.files;
                input.dispatchEvent(new Event('change'));
            }
        });
    });
}

// Handle Color Change
function handleColorChange(e) {
    const colorValue = e.target.value;
    const valueDisplay = e.target.nextElementSibling;
    
    if (valueDisplay && valueDisplay.classList.contains('color-value')) {
        valueDisplay.textContent = colorValue;
    }
    
    // Update live preview
    updateAppearancePreview();
}

// Update Appearance Preview
function updateAppearancePreview() {
    const primaryColor = document.getElementById('primaryColor').value;
    const secondaryColor = document.getElementById('secondaryColor').value;
    const accentColor = document.getElementById('accentColor').value;
    
    const previewHeader = document.querySelector('.preview-header');
    const previewBtn = document.querySelector('.preview-btn');
    
    if (previewHeader) {
        previewHeader.style.background = `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`;
    }
    
    if (previewBtn) {
        previewBtn.style.backgroundColor = secondaryColor;
    }
}

// Add Airline
function addAirline() {
    const table = document.getElementById('airlinesTable').querySelector('tbody');
    
    const row = table.insertRow(0);
    row.innerHTML = `
        <td><input type="file" accept="image/*" style="width:100px"></td>
        <td><input type="text" placeholder="Airline Name" style="padding:8px"></td>
        <td><input type="text" placeholder="Code" style="padding:8px;width:80px"></td>
        <td><input type="text" placeholder="Country" style="padding:8px"></td>
        <td>
            <span class="status-badge active">Active</span>
        </td>
        <td>
            <button class="btn-icon" onclick="saveAirline(this)"><i class="fas fa-check"></i></button>
            <button class="btn-icon" onclick="deleteRow(this)"><i class="fas fa-times"></i></button>
        </td>
    `;
    
    showNotification('Add airline details and click save', 'info');
}

// Save Airline
function saveAirline(btn) {
    const row = btn.closest('tr');
    const inputs = row.querySelectorAll('input[type="text"]');
    
    let isValid = true;
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = 'var(--admin-danger)';
        }
    });
    
    if (!isValid) {
        showNotification('Please fill in all airline details', 'error');
        return;
    }
    
    showNotification('Airline saved successfully!', 'success');
    unsavedChanges = true;
    showUnsavedIndicator();
}

// Add Airport
function addAirport() {
    const table = document.getElementById('airportsTable').querySelector('tbody');
    
    const row = table.insertRow(0);
    row.innerHTML = `
        <td><input type="text" placeholder="Airport Name" style="padding:8px"></td>
        <td><input type="text" placeholder="Code" style="padding:8px;width:80px"></td>
        <td><input type="text" placeholder="City" style="padding:8px"></td>
        <td><input type="text" placeholder="Country" style="padding:8px"></td>
        <td>
            <span class="status-badge active">Active</span>
        </td>
        <td>
            <button class="btn-icon" onclick="saveAirport(this)"><i class="fas fa-check"></i></button>
            <button class="btn-icon" onclick="deleteRow(this)"><i class="fas fa-times"></i></button>
        </td>
    `;
    
    showNotification('Add airport details and click save', 'info');
}

// Save Airport
function saveAirport(btn) {
    const row = btn.closest('tr');
    const inputs = row.querySelectorAll('input[type="text"]');
    
    let isValid = true;
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = 'var(--admin-danger)';
        }
    });
    
    if (!isValid) {
        showNotification('Please fill in all airport details', 'error');
        return;
    }
    
    showNotification('Airport saved successfully!', 'success');
    unsavedChanges = true;
    showUnsavedIndicator();
}

// Delete Row
function deleteRow(btn) {
    if (confirm('Are you sure you want to delete this entry?')) {
        btn.closest('tr').remove();
        showNotification('Entry deleted successfully', 'success');
        unsavedChanges = true;
        showUnsavedIndicator();
    }
}

// Generate API Key
function generateAPIKey() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let apiKey = '';
    
    for (let i = 0; i < 32; i++) {
        apiKey += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    // Add to table
    const table = document.getElementById('apiKeysTable').querySelector('tbody');
    const row = table.insertRow(0);
    row.innerHTML = `
        <td>New API Key</td>
        <td class="api-key-cell">
            <code>${apiKey}</code>
            <button class="btn-copy" onclick="copyAPIKey('${apiKey}')">
                <i class="fas fa-copy"></i>
            </button>
        </td>
        <td>${new Date().toLocaleDateString()}</td>
        <td><span class="status-badge active">Active</span></td>
        <td>
            <button class="btn-icon" onclick="deleteRow(this)"><i class="fas fa-trash"></i></button>
        </td>
    `;
    
    showNotification('API Key generated successfully! Copy it now.', 'success');
}

// Copy API Key
function copyAPIKey(key) {
    navigator.clipboard.writeText(key).then(() => {
        showNotification('API Key copied to clipboard!', 'success');
    });
}

// Setup Webhook Tests
function setupWebhookTests() {
    document.querySelectorAll('.btn-test').forEach(btn => {
        if (btn.textContent.includes('Test')) {
            btn.addEventListener('click', function() {
                const webhookType = this.closest('.form-group').querySelector('label').textContent;
                testWebhook(webhookType);
            });
        }
    });
}

// Test Webhook
async function testWebhook(type) {
    showNotification(`Testing ${type}...`, 'info');
    
    try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        showNotification(`${type} webhook test successful!`, 'success');
    } catch (error) {
        showNotification(`${type} webhook test failed`, 'error');
    }
}

// Toggle Maintenance Mode
async function toggleMaintenanceMode(e) {
    const isEnabled = e.target.checked;
    
    if (isEnabled) {
        if (confirm('Are you sure you want to enable maintenance mode? Users will not be able to access the website.')) {
            showNotification('Maintenance mode enabled', 'success');
        } else {
            e.target.checked = false;
        }
    } else {
        showNotification('Maintenance mode disabled', 'success');
    }
}

// Perform Manual Backup
async function performManualBackup() {
    const btn = document.getElementById('manualBackupBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Backup...';
    
    try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Update backup status
        const statusDiv = document.querySelector('.backup-status');
        if (statusDiv) {
            statusDiv.querySelector('p:nth-child(2)').textContent = `Last Backup: ${new Date().toLocaleString()}`;
            statusDiv.querySelector('p:nth-child(3)').innerHTML = '<strong>Status:</strong> <span class="status-badge success">Success</span>';
        }
        
        showNotification('Backup created successfully!', 'success');
    } catch (error) {
        showNotification('Backup failed. Please try again.', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-download"></i> Create Backup Now';
    }
}

// Optimize Database
async function optimizeDatabase() {
    if (confirm('This will optimize database tables. Continue?')) {
        const btn = document.getElementById('optimizeDBBtn');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Optimizing...';
        
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            showNotification('Database optimized successfully!', 'success');
        } catch (error) {
            showNotification('Database optimization failed', 'error');
        } finally {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-database"></i> Optimize Database';
        }
    }
}

// Clear System Logs
async function clearSystemLogs() {
    if (confirm('Are you sure you want to clear all system logs? This action cannot be undone.')) {
        const btn = document.getElementById('clearLogsBtn');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Clearing...';
        
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            showNotification('System logs cleared successfully!', 'success');
        } catch (error) {
            showNotification('Failed to clear system logs', 'error');
        } finally {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-trash-alt"></i> Clear System Logs';
        }
    }
}

// Archive Old Data
async function archiveOldData() {
    if (confirm('This will archive data older than 1 year. Continue?')) {
        const btn = document.getElementById('archiveDataBtn');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Archiving...';
        
        try {
            await new Promise(resolve => setTimeout(resolve, 3000));
            showNotification('Old data archived successfully!', 'success');
        } catch (error) {
            showNotification('Data archiving failed', 'error');
        } finally {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-archive"></i> Archive Old Data';
        }
    }
}

// Import Settings
function importSettings() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const settings = JSON.parse(event.target.result);
                populateFormFields(settings);
                showNotification('Settings imported successfully!', 'success');
                unsavedChanges = true;
                showUnsavedIndicator();
            } catch (error) {
                showNotification('Invalid settings file', 'error');
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

// Export Settings
function exportSettings() {
    const data = getFormData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `destinova-settings-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    showNotification('Settings exported successfully!', 'success');
}

// Auto Save
function startAutoSave() {
    autoSaveInterval = setInterval(() => {
        if (unsavedChanges) {
            console.log('Auto-saving settings...');
            const data = getFormData();
            localStorage.setItem('adminSettingsAutoSave', JSON.stringify(data));
            console.log('Settings auto-saved to localStorage');
        }
    }, 120000); // Auto-save every 2 minutes
}

// Stop Auto Save
function stopAutoSave() {
    if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
    }
}

// Setup Keyboard Shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl+S - Save settings
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            saveAllSettings();
        }
        
        // Ctrl+Tab - Next tab
        if (e.ctrlKey && e.key === 'Tab') {
            e.preventDefault();
            const tabs = ['general', 'payment', 'email', 'sms', 'flight', 'user-management', 'security', 'backup', 'api', 'appearance'];
            const currentIndex = tabs.indexOf(currentTab);
            const nextIndex = (currentIndex + 1) % tabs.length;
            switchTab(tabs[nextIndex]);
        }
    });
}



// Show Notification
function showNotification(message, type = 'info') {
    const notification = document.querySelector('.notification-toast') || createNotificationToast();
    
    notification.className = `notification-toast ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}

// Create Notification Toast
function createNotificationToast() {
    const notification = document.createElement('div');
    notification.className = 'notification-toast';
    document.body.appendChild(notification);
    return notification;
}

// Warn on page leave with unsaved changes
window.addEventListener('beforeunload', function(e) {
    if (unsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
    }
});

// Cleanup on unload
window.addEventListener('unload', function() {
    stopAutoSave();
});

console.log('Admin Settings JS Loaded Successfully');
