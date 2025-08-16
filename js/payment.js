// js/payment.js
(function(){
  document.getElementById('payForm')?.addEventListener('submit',(e)=>{
    e.preventDefault();
    alert('Payment simulated. Receipt sent to your email.');
    location.href = 'my-bookings.html';
  });
})();
