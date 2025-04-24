// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC0VRcAZgS7Jzd2MKj5rWXVgOXvs92LmM0",
    authDomain: "gwcet-3b7e0.firebaseapp.com",
    databaseURL: "https://gwcet-3b7e0-default-rtdb.firebaseio.com",
    projectId: "gwcet-3b7e0",
    storageBucket: "gwcet-3b7e0.appspot.com",
    messagingSenderId: "655005135966",
    appId: "1:655005135966:web:16a133fb2d488856fd30cf"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const database = firebase.database();
  
  // Common functions
  function showAlert(type, message, duration = 5000) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    alertDiv.style.cssText = `
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 20px;
      background: rgba(${type === 'success' ? '16, 185, 129' : '239, 68, 68'}, 0.1);
      border-left: 4px solid var(--${type === 'success' ? 'success' : 'error'}-color);
      color: var(--${type === 'success' ? 'success' : 'error'}-color);
    `;
    
    document.querySelector('.main-content').prepend(alertDiv);
    
    setTimeout(() => {
      alertDiv.remove();
    }, duration);
  }
  
  function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
  }
  
  // Initialize mobile menu buttons
  document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtns = document.querySelectorAll('.mobile-menu-btn');
    mobileMenuBtns.forEach(btn => {
      btn.addEventListener('click', toggleSidebar);
    });
  });