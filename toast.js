
function sendToast(content) {
    const toast_container = document.getElementById('toast_container');
    let opacity = 1;
    let toast = document.createElement('toast');

    toast.id = 'toast';
    toast.innerText = content;
    
    toast_container.appendChild(toast);
    
    (function animateToast() {
        opacity -= 0.002;
        toast.style.opacity = `${opacity}`;

        if (opacity > 0) setTimeout(animateToast, 1);
        else toast_container.removeChild(toast);
    })();
}

module.exports = sendToast;