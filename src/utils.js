module.exports = {
    createFromHtmlString,
    addElement,
    removeElement,
    dispatchEvent,
    getHtml
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

function addElement (html) {
    const element = createFromHtmlString(html);

    document.body.appendChild(element);
}

function removeElement (selector) {
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
