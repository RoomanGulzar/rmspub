const toggleBtn = document.getElementById('theme-toggle');
const themeText = document.getElementById('themeText');
const htmlElement = document.documentElement;

toggleBtn.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    // Update attributes
    htmlElement.setAttribute('data-theme', newTheme);
    htmlElement.setAttribute('data-bs-theme', newTheme);

    // Update button text + icon
    if (newTheme === 'dark') {
        toggleBtn.querySelector('i').className = 'fas fa-moon';
        //themeText.innerText = 'Dark';
    } else {
        toggleBtn.querySelector('i').className = 'fas fa-sun';
        //themeText.innerText = 'Light';
    }

    // Save preference
    localStorage.setItem('theme', newTheme);
});
// On page load, check for saved preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
    htmlElement.setAttribute('data-bs-theme', savedTheme);
    if (savedTheme === 'dark') {
        toggleBtn.querySelector('i').className = 'fas fa-moon';
        //themeText.innerText = 'Dark';
    } else {
        toggleBtn.querySelector('i').className = 'fas fa-sun';
        //themeText.innerText = 'Light';
    }
}



const sidebar = document.getElementById('sidebar');
const header = document.getElementById('header');
const content = document.getElementById('content');
const toggleSidebar = document.getElementById('toggleSidebar');
if (toggleSidebar) {

    toggleSidebar.addEventListener('click', () => {
        sidebar.classList.toggle('minimized');
        header.classList.toggle('minimized');
        content.classList.toggle('minimized');
    });

}