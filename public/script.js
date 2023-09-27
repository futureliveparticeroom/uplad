document.getElementById('body').addEventListener('click', function() {
    const fileInput = document.getElementById('fileInput');
    fileInput.click();
});

document.getElementById('fileInput').addEventListener('change', function() {
    if (this.files && this.files[0]) {
        document.getElementById('uploadForm').submit();
    }
});
