// API Health section functionality
function initializeHealthSection() {
  document.getElementById('checkHealthBtn').addEventListener('click', async () => {
    const resultElement = document.getElementById('healthResult');
    try {
      resultElement.textContent = 'Loading...';
      
      const response = await fetch('/api/health');
      const data = await response.json();
      
      resultElement.textContent = JSON.stringify(data, null, 2);
      showNotification('API health check completed successfully!', 'success');
    } catch (error) {
      resultElement.textContent = `Error: ${error.message}`;
      showNotification(`API health check failed: ${error.message}`, 'error');
    }
  });
}
