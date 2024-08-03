function initializeBlurEffect(): void {
    if (!CSS.supports('backdrop-filter', 'blur(10px)')) {
        applySvgBlur('#termsfeed-com---preferences-center, #termsfeed-com---nb .cc-nb-main-container, .cc-pc-container');
    }
}

function applySvgBlur(selector: string): void {
    const elements = document.querySelectorAll(selector);
    const svgNS = "http://www.w3.org/2000/svg";
    let svg = document.createElementNS(svgNS, "svg");
    let filter = document.createElementNS(svgNS, "filter");
    let feGaussianBlur = document.createElementNS(svgNS, "feGaussianBlur");

    const filterId = 'blur-effect';
    filter.setAttribute('id', filterId);
    feGaussianBlur.setAttribute('stdDeviation', '10');

    filter.appendChild(feGaussianBlur);
    svg.appendChild(filter);
    svg.style.height = "0";

    document.body.appendChild(svg);

    elements.forEach(element => {
        (element as HTMLElement).style.filter = `url(#${filterId})`;
    });
}

initializeBlurEffect();
