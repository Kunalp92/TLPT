document.addEventListener('DOMContentLoaded', () => {
    const userList = document.getElementById('userList');
    const userSearch = document.getElementById('userSearch');
    const refreshBtn = document.getElementById('refreshBtn');
  
    // Load users initially
    loadUsers();
  
    // Refresh button
    refreshBtn.addEventListener('click', loadUsers);
  
    // Search functionality
    userSearch.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      const rows = userList.querySelectorAll('tr');
      
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
      });
    });
  
    // Load users function
    async function loadUsers() {
      try {
        userList.innerHTML = '<tr><td colspan="5" style="text-align: center;">Loading users...</td></tr>';
        refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        
        const snapshot = await database.ref("Users").once("value");
        const users = snapshot.val();
        
        if (!users) {
          userList.innerHTML = '<tr><td colspan="5" style="text-align: center;">No users found</td></tr>';
          return;
        }
  
        let html = '';
        Object.entries(users).forEach(([uid, user]) => {
          html += `
            <tr>
              <td>${user.name || 'N/A'}</td>
              <td>${user.email || 'N/A'}</td>
              <td>${user.mobile || 'N/A'}</td>
              <td><code title="${uid}">${uid.substring(0, 8)}...</code></td>
              <td><span class="status-badge status-active">Active</span></td>
            </tr>
          `;
        });
  
        userList.innerHTML = html;
        showAlert('success', 'Users loaded successfully');
      } catch (error) {
        userList.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--error-color);">Error loading users</td></tr>';
        showAlert('error', 'Error loading users: ' + error.message);
      } finally {
        refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh';
      }
    }
  });