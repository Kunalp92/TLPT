document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('excelFile');
    const fileStatus = document.getElementById('fileStatus');
    const uploadBtn = document.getElementById('uploadBtn');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const uploadStatus = document.getElementById('uploadStatus');
    const successCountEl = document.getElementById('successCount');
    const errorCountEl = document.getElementById('errorCount');
  
    // File input handling
    fileInput.addEventListener('change', function(e) {
      const fileName = e.target.files[0]?.name || 'No file selected';
      fileStatus.textContent = `Selected: ${fileName}`;
    });
  
    // Drag and drop functionality
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, preventDefaults, false);
    });
  
    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }
  
    ['dragenter', 'dragover'].forEach(eventName => {
      dropZone.addEventListener(eventName, highlight, false);
    });
  
    ['dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, unhighlight, false);
    });
  
    function highlight() {
      dropZone.style.borderColor = 'var(--primary-color)';
      dropZone.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';
    }
  
    function unhighlight() {
      dropZone.style.borderColor = '#cbd5e1';
      dropZone.style.backgroundColor = '';
    }
  
    dropZone.addEventListener('drop', handleDrop, false);
  
    function handleDrop(e) {
      const dt = e.dataTransfer;
      const files = dt.files;
      
      if (files.length) {
        fileInput.files = files;
        fileStatus.textContent = `Selected: ${files[0].name}`;
      }
    }
  
    // Upload function with progress tracking
    uploadBtn.addEventListener('click', async function() {
      const file = fileInput.files[0];
      
      if (!file) {
        showAlert('error', 'Please select an Excel file first!');
        return;
      }
  
      // Check file extension
      if (!file.name.endsWith('.xlsx')) {
        showAlert('error', 'Please select an Excel file with .xlsx extension');
        return;
      }
  
      const reader = new FileReader();
  
      reader.onload = async function(e) {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const json = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
          
          // Initialize counters
          let processed = 0;
          const totalRows = json.length;
          let successCount = 0;
          let errorCount = 0;
  
          // Disable upload button
          uploadBtn.disabled = true;
          uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
  
          // Reset progress
          updateProgress(0, totalRows);
          uploadStatus.textContent = `Processing 0 of ${totalRows} rows...`;
          successCountEl.textContent = '0';
          errorCountEl.textContent = '0';
  
          // Process rows sequentially with delay to show progress
          for (let index = 0; index < totalRows; index++) {
            try {
              await database.ref(`tower_data/row_${index}`).set(json[index]);
              successCount++;
            } catch (error) {
              errorCount++;
              console.error(`Error in row ${index}:`, error);
            }
            
            processed++;
            updateProgress(processed, totalRows);
            
            uploadStatus.textContent = `Processed ${processed} of ${totalRows} rows`;
            successCountEl.textContent = successCount;
            errorCountEl.textContent = errorCount;
            
            // Small delay to allow UI to update
            await new Promise(resolve => setTimeout(resolve, 50));
          }
  
          showAlert('success', 
            `Upload completed! 
             ${successCount} rows uploaded successfully, 
             ${errorCount} rows failed`);
          
        } catch (error) {
          showAlert('error', 'Error processing file: ' + error.message);
        } finally {
          // Reset UI
          uploadBtn.disabled = false;
          uploadBtn.innerHTML = '<i class="fas fa-upload"></i> Upload Selected File';
        }
      };
  
      reader.onerror = function() {
        showAlert('error', 'Error reading the file');
      };
  
      reader.readAsArrayBuffer(file);
    });
  
    function updateProgress(processed, total) {
      const progress = Math.round((processed / total) * 100);
      progressBar.style.width = `${progress}%`;
      progressText.textContent = `${progress}%`;
    }
  });