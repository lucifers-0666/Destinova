document.addEventListener('DOMContentLoaded', function () {
    // --- Global State ---
    let currentStep = 1;
    const totalSteps = 5;
    let notificationDraft = {
        type: null,
        audience: { type: 'all', segments: [] },
        content: { subject: '', message: '' },
        schedule: { type: 'now', datetime: null }
    };

    // --- DOM Elements ---
    const tabs = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const createPanelOverlay = document.getElementById('create-notification-overlay');
    const showCreatePanelBtn = document.getElementById('show-create-panel-btn');
    const closePanelBtn = document.querySelector('#create-notification-panel .modal-close-btn');
    const wizardSteps = document.querySelectorAll('.wizard-step');
    const stepIndicators = document.querySelectorAll('.step-indicator .step');
    const prevStepBtn = document.getElementById('prev-step-btn');
    const nextStepBtn = document.getElementById('next-step-btn');
    const notificationForm = document.getElementById('notification-form');

    // --- Tab Management ---
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            tabContents.forEach(content => {
                content.classList.toggle('active', content.id === `tab-content-${targetTab}`);
            });

            if (targetTab === 'analytics') {
                // Load charts when analytics tab is active
                loadAnalyticsCharts();
            }
        });
    });

    // --- Modal/Panel Management ---
    function openCreatePanel() {
        createPanelOverlay.classList.add('visible');
    }

    function closeCreatePanel() {
        createPanelOverlay.classList.remove('visible');
        resetWizard();
    }

    showCreatePanelBtn.addEventListener('click', openCreatePanel);
    closePanelBtn.addEventListener('click', closeCreatePanel);
    createPanelOverlay.addEventListener('click', (e) => {
        if (e.target === createPanelOverlay) {
            closeCreatePanel();
        }
    });

    // --- Wizard Navigation ---
    function goToStep(stepNumber) {
        currentStep = stepNumber;

        // Update content
        wizardSteps.forEach(step => {
            step.classList.toggle('active', parseInt(step.dataset.stepContent) === currentStep);
        });

        // Update indicators
        stepIndicators.forEach(indicator => {
            const step = parseInt(indicator.dataset.step);
            indicator.classList.remove('active', 'completed');
            if (step < currentStep) {
                indicator.classList.add('completed');
            } else if (step === currentStep) {
                indicator.classList.add('active');
            }
        });

        // Update buttons
        prevStepBtn.disabled = currentStep === 1;
        nextStepBtn.textContent = currentStep === totalSteps ? 'Finish' : 'Next';
        document.getElementById('confirm-send-btn').style.display = currentStep === totalSteps ? 'inline-block' : 'none';
        nextStepBtn.style.display = currentStep === totalSteps ? 'none' : 'inline-block';
    }

    function resetWizard() {
        goToStep(1);
        notificationForm.reset();
        document.querySelectorAll('.type-card.selected').forEach(c => c.classList.remove('selected'));
    }

    function validateStep(step) {
        if (step === 1) {
            return document.querySelector('.type-card.selected') !== null;
        }
        // Add more validation logic for other steps
        return true;
    }

    nextStepBtn.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            if (currentStep < totalSteps) {
                goToStep(currentStep + 1);
            }
        } else {
            alert('Please complete the current step before proceeding.');
        }
    });

    prevStepBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            goToStep(currentStep - 1);
        }
    });

    // --- Step-specific Logic ---

    // Step 1: Type selection
    document.querySelectorAll('.type-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.type-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            notificationDraft.type = card.dataset.type;
            console.log('Selected type:', notificationDraft.type);
        });
    });

    // Step 3: Content editor
    const messageTextarea = document.getElementById('notification-message');
    const charCounter = document.getElementById('char-counter');
    const previewContent = document.getElementById('preview-content');

    messageTextarea.addEventListener('input', () => {
        const maxLength = 160; // Example for SMS
        const currentLength = messageTextarea.value.length;
        const remaining = maxLength - currentLength;
        charCounter.textContent = `${remaining} characters remaining`;
        previewContent.textContent = messageTextarea.value || 'Your message preview will appear here.';
    });

    // --- Form Submission ---
    notificationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (currentStep === totalSteps) {
            console.log('Submitting notification draft:', notificationDraft);
            alert('Notification sent! (Demo)');
            closeCreatePanel();
        }
    });

    // --- Analytics Charts (Demo) ---
    function loadAnalyticsCharts() {
        const sentCtx = document.getElementById('sent-over-time-chart');
        const typeCtx = document.getElementById('by-type-chart');

        if (sentCtx && typeCtx) {
            // Destroy existing charts if they exist to prevent duplicates
            if (window.sentChart) window.sentChart.destroy();
            if (window.typeChart) window.typeChart.destroy();

            window.sentChart = new Chart(sentCtx, {
                type: 'line',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                        label: 'Notifications Sent',
                        data: [120, 190, 300, 500, 200, 350, 400],
                        borderColor: 'var(--primary-emerald)',
                        tension: 0.1
                    }]
                }
            });

            window.typeChart = new Chart(typeCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Email', 'SMS', 'Push'],
                    datasets: [{
                        data: [300, 50, 100],
                        backgroundColor: ['var(--type-email)', 'var(--type-sms)', 'var(--type-push)'],
                    }]
                }
            });
        }
    }

    // --- Initial Load ---
    goToStep(1); // Initialize wizard
});