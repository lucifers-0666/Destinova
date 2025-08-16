// js/booking.js
(function(){
  const p = new URLSearchParams(location.search);
  document.getElementById('chosen').textContent =
    `${p.get('flight') || 'Flight TBD'} • Class: ${p.get('class') || 'Economy'}`;

  document.getElementById('bookingForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    location.href = 'payment.html';
  });
})();
