//tab
function showTab(tabId) {
    const contents = document.querySelectorAll('.tab-content .content');
    contents.forEach(content => {
        content.style.display = 'none';
    });

    const activeTab = document.getElementById(tabId);
    activeTab.style.display = 'block';
}

//fullscreen
document.getElementById('openImageBtn').addEventListener('click', function() {
    document.getElementById('fullscreenImage').classList.remove('hidden');
    document.getElementById('fullscreenImage').classList.add('visible');
});

document.getElementById('closeBtn').addEventListener('click', function() {
    document.getElementById('fullscreenImage').classList.remove('visible');
    document.getElementById('fullscreenImage').classList.add('hidden');
});

//preloader
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    const content = document.querySelector('.site-container');
    
    preloader.style.display = 'none';
    content.style.display = 'block';
});
