document.addEventListener('DOMContentLoaded', function () {
    const steps = document.querySelectorAll('.step-content');
    const progressSteps = document.querySelectorAll('.progress-step');
    const progressLines = document.querySelectorAll('.progress-line');

    const toStep2Btn = document.getElementById('to-step-2');
    const toStep3Btn = document.getElementById('to-step-3');
    const backToStep1Btn = document.getElementById('back-to-step-1');
    const backToStep2Btn = document.getElementById('back-to-step-2');

    let currentStep = 1;

    function updateProgress() {
        progressSteps.forEach((step, index) => {
            const stepNum = index + 1;
            if (stepNum < currentStep) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (stepNum === currentStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });

        progressLines.forEach((line, index) => {
            if (index < currentStep - 1) {
                line.style.backgroundColor = '#1d5e33'; // primary-emerald
            } else {
                line.style.backgroundColor = '#a0aec0'; // gray-500
            }
        });
    }

    function showStep(stepNumber) {
        steps.forEach(step => step.classList.add('hidden'));
        document.getElementById(`step-${stepNumber}`).classList.remove('hidden');
        currentStep = stepNumber;
        updateProgress();
        window.scrollTo(0, 0);
    }

    if (toStep2Btn) {
        toStep2Btn.addEventListener('click', () => showStep(2));
    }
    if (toStep3Btn) {
        toStep3Btn.addEventListener('click', () => showStep(3));
    }
    if (backToStep1Btn) {
        backToStep1Btn.addEventListener('click', () => showStep(1));
    }
    if (backToStep2Btn) {
        backToStep2Btn.addEventListener('click', () => showStep(2));
    }

    // --- Seat Selection Logic ---
    const seatMapContainer = document.querySelector('.seat-map-container');
    if (seatMapContainer) {
        const rows = 15;
        const seatsPerRow = 6;
        const aisleColumn = 3;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < seatsPerRow + 1; j++) {
                const seat = document.createElement('div');
                if (j === aisleColumn) {
                    seat.className = 'seat-aisle';
                    seat.textContent = i + 1;
                } else {
                    seat.className = 'seat';
                    const seatChar = String.fromCharCode(65 + (j > aisleColumn ? j - 1 : j));
                    seat.textContent = `${i + 1}${seatChar}`;

                    // Mock seat status
                    const random = Math.random();
                    if (random < 0.2) {
                        seat.classList.add('taken');
                    } else if (random < 0.4) {
                        seat.classList.add('premium');
                    } else {
                        seat.classList.add('available');
                    }

                    seat.addEventListener('click', () => {
                        if (seat.classList.contains('available') || seat.classList.contains('premium')) {
                            document.querySelectorAll('.seat.selected').forEach(s => s.classList.remove('selected'));
                            seat.classList.add('selected');
                        }
                    });
                }
                seatMapContainer.appendChild(seat);
            }
        }
    }

    // Initialize
    showStep(1);
});