module.exports = {
    createFromHtmlString,
    addDOMElement,
    removeDOMElement,
    dispatchEvent,
    getHtml,
    getStyle,
    getAnimationEndEventName,
    addClass,
    removeClass
};

function createFromHtmlString (html) {
    const fragment = document.createDocumentFragment();
    const tmp = document.createElement('div');

    tmp.innerHTML = html;

    while (tmp.firstChild) {
        fragment.appendChild(tmp.firstChild);
    }

    return fragment;
}

function addDOMElement (html) {
    const element = createFromHtmlString(html);

    document.body.appendChild(element);
}

function removeDOMElement (selector) {
    const element = document.querySelector(selector);

    if (element) {
        element.parentNode.removeChild(element);
    }
}

function dispatchEvent (selector, eventType='click') {
    const event = document.createEvent('HTMLEvents');
    const element = document.querySelector(selector);

    if (!element) {
        return;
    }

    event.initEvent(eventType, false, true);
    element.dispatchEvent(event);
}

function getHtml (selector) {
    const element = document.querySelector(selector);

    if (element) {
        return element.innerHTML;
    }

    return null;
}

function getStyle (selector) {
    const element = document.querySelector(selector);

    if (element) {
        return element.getAttribute('style');
    }

    return null;
}

function getAnimationEndEventName() {
    const fakeElement = document.createElement('fakeelement');
    const animations = {
        'animation': 'animationend',
        'OAnimation': 'oAnimationEnd',
        'MozAnimation': 'animationend',
        'WebkitAnimation': 'webkitAnimationEnd'
    };

    for (let animation in animations) {
        if (fakeElement.style[animation] !== undefined) {
            return animations[animation];
        }
    }
}

function addClass (element, className) {
    if (element.classList) {
        element.classList.add(className);
    } else {
        element.className = `${ element.className } ${ className }`;
    }
}

function removeClass (element, className) {
    if (element.classList) {
        element.classList.remove(className);
    } else {
        element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
}