"use strict";
// glitch effect
document.addEventListener("DOMContentLoaded", function () {
    const glitchTransition = document.getElementById('glitch-transition');
    setTimeout(() => {
        glitchTransition.style.opacity = '0';
        setTimeout(() => {
            glitchTransition.style.display = 'none';
            document.body.style.overflow = 'auto';
            glitchTransition.classList.remove("d-flex");
            glitchTransition.classList.add("d-none");
        }, 1000);
    }, 2000);
});
// static body only
document.addEventListener('DOMContentLoaded', function () {
    const staticNoise = document.querySelector('.static-noise');
    function changeOpacity() {
        const randomOpacity = Math.random() * 0.5;
        staticNoise.style.opacity = randomOpacity.toString();
    }
    setInterval(changeOpacity, 1000);
});
// crazy text
document.addEventListener('DOMContentLoaded', function () {
    const paragraph = document.getElementById('crazy-paragraph');
    function startCrazyEffect() {
        paragraph.classList.add('crazy');
        setTimeout(() => {
            paragraph.classList.remove('crazy');
        }, 3000);
    }
    startCrazyEffect();
});
