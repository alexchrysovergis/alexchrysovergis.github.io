"use strict";
// marquee
document.addEventListener('DOMContentLoaded', () => {
    const marqueeInner = document.querySelector('.marquee__inner');
    const marqueeInnerText = "";
    if (marqueeInner) {
        const repeatedText = Array(50).fill(marqueeInnerText + "<span>Welcome to my website :3</span>").join("");
        marqueeInner.innerHTML = repeatedText;
        const secondInstance = document.createElement('span');
        secondInstance.innerHTML = repeatedText;
        marqueeInner.appendChild(secondInstance);
    }
});
