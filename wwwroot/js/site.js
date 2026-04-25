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




$(document).on('init.dt', function (e, settings) {
    var table = new $.fn.dataTable.Api(settings);

    setTimeout(() => {
        table.columns.adjust();
    }, 50);
});



// Function to apply the minimized state
const applySidebarState = (isMinimized) => {
    if (isMinimized === 'true') {
        sidebar.classList.add('minimized');
        header.classList.add('minimized');
        content.classList.add('minimized');
    } else {
        sidebar.classList.remove('minimized');
        header.classList.remove('minimized');
        content.classList.remove('minimized');
    }
};

// On page load: Check localStorage for saved state
const savedSidebarState = localStorage.getItem('sidebarMinimized');
if (savedSidebarState !== null) {
    applySidebarState(savedSidebarState);
}

// Toggle Event Listener
if (toggleSidebar) {
    toggleSidebar.addEventListener('click', () => {
        const isCurrentlyMinimized = sidebar.classList.contains('minimized');
        const newState = !isCurrentlyMinimized;

        applySidebarState(newState.toString());

        // Save state to localStorage
        localStorage.setItem('sidebarMinimized', newState);

        // Adjust DataTables if they exist to prevent header misalignment
        if ($.fn.DataTable) {
            setTimeout(() => {
                $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
            }, 300); // Wait for CSS transition to finish
        }
    });
}