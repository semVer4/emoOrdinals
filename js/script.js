function showTab(tabId) {
    const contents = document.querySelectorAll('.tab-content .content');
    contents.forEach(content => {
        content.style.display = 'none';
    });

    const activeTab = document.getElementById(tabId);
    activeTab.style.display = 'block';
}

document.getElementById('openBtn').addEventListener('click', function() {
    document.getElementById('fullscreenOverlay').style.display = 'flex';
});

document.getElementById('closeBtn').addEventListener('click', function() {
    document.getElementById('fullscreenOverlay').style.display = 'none';
});

document.getElementById('fullscreenOverlay').addEventListener('click', function(event) {
    if (event.target === this) {
        this.style.display = 'none';
    }
});