document.addEventListener('DOMContentLoaded', function () {
    // --- HEADER LOGIC (from index.js for consistency) ---
    const header = document.getElementById('header-main');
    if (header) {
        header.classList.add('header-scrolled'); // Make header solid from the start
    }

    // --- CELEBRATION CONFETTI ---
    function fireConfetti() {
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    }

    // --- LOAD BOOKING DETAILS ---
    function loadBookingDetails() {
        const urlParams = new URLSearchParams(window.location.search);
        const bookingRef = urlParams.get('ref') || 'DEST789A'; // Fallback for demo
        const status = urlParams.get('status');

        if (status === 'success') {
            fireConfetti();
        }

        // Populate data (in a real app, fetch from API using bookingRef)
        document.getElementById('booking-ref').textContent = bookingRef;

        // Generate QR Code
        const qrContainer = document.getElementById('qr-code-container');
        qrContainer.innerHTML = ''; // Clear previous QR
        new QRCode(qrContainer, {
            text: `Booking Reference: ${bookingRef}`,
            width: 128,
            height: 128,
            colorDark: "#1d4028",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    }

    // --- ACTION BUTTONS ---

    // 1. Copy Booking Reference
    const copyBtn = document.getElementById('copy-ref-btn');
    const tooltip = document.getElementById('copy-tooltip');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const refText = document.getElementById('booking-ref').textContent;
            navigator.clipboard.writeText(refText).then(() => {
                tooltip.classList.add('visible');
                setTimeout(() => tooltip.classList.remove('visible'), 2000);
            });
        });
    }

    // 2. Download Ticket as PDF
    const downloadBtn = document.getElementById('download-ticket-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            const { jsPDF } = window.jspdf;
            const ticketElement = document.getElementById('ticket-card');
            const bookingRef = document.getElementById('booking-ref').textContent;

            html2canvas(ticketElement, { scale: 2 }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'pt',
                    format: [canvas.width, canvas.height]
                });
                pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
                pdf.save(`Destinova-Ticket-${bookingRef}.pdf`);
            });
        });
    }

    // 3. Email Ticket
    const emailBtn = document.getElementById('email-ticket-btn');
    if (emailBtn) {
        emailBtn.addEventListener('click', () => {
            const email = prompt("Please enter your email address to send the ticket:");
            if (email) {
                alert(`Ticket will be sent to ${email}. (This is a demo)`);
                // In a real app, you would make an API call here.
            }
        });
    }

    // 4. Add to Calendar
    const calendarBtn = document.getElementById('add-to-calendar-btn');
    if (calendarBtn) {
        calendarBtn.addEventListener('click', () => {
            // Simplified .ics file generation
            const event = {
                title: 'Flight: Delhi to Mumbai (DN 789)',
                startDate: '20250315T080000', // YYYYMMDDTHHMMSS
                endDate: '20250315T101000',
                location: 'Indira Gandhi Int\'l Airport (DEL), New Delhi',
                description: 'Booking Reference: DEST789A. Please arrive at the airport 2 hours early.'
            };
            const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${event.startDate}\nDTEND:${event.endDate}\nSUMMARY:${event.title}\nLOCATION:${event.location}\nDESCRIPTION:${event.description}\nEND:VEVENT\nEND:VCALENDAR`;
            const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'flight-DN789.ics';
            link.click();
        });
    }

    // 5. Print Ticket
    const printBtn = document.getElementById('print-btn');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // --- INITIALIZE PAGE ---
    loadBookingDetails();
});