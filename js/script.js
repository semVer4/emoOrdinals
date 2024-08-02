function showTab(tabId) {
    const contents = document.querySelectorAll('.tab-content .content');
    contents.forEach(content => {
        content.style.display = 'none';
    });

    const activeTab = document.getElementById(tabId);
    activeTab.style.display = 'block';
}