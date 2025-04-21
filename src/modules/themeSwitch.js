const themeSwitch = () => {
    const body = document.querySelector('body');
    const btn = document.getElementById('theme-switcher');

    btn.addEventListener('click', () => {
        body.classList.toggle('dark')
    })
}
export default themeSwitch