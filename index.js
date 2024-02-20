document.querySelectorAll('.social-links a').forEach(link => {
    link.addEventListener('mouseover', () => {
        console.log('Mouse over');
        link.querySelector('.social-logo').classList.add('hovered');
    });
    link.addEventListener('mouseout', () => {
        console.log('Mouse out');
        link.querySelector('.social-logo').classList.remove('hovered');
    });
});
