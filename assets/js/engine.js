const toggleTheme = document.getElementById('toggleTheme');
function changetheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    toggleTheme.classList.toggle('bi-brightness-alt-high');
    toggleTheme.classList.toggle('bi-moon-stars');
}
toggleTheme.addEventListener('click', changetheme);