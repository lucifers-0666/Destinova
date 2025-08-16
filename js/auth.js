// js/auth.js
(function(){
  const form = document.querySelector('form');
  form?.addEventListener('submit',(e)=>{
    e.preventDefault();
    alert('Signed in (demo).');
    location.href = 'index.html';
  });
})();
