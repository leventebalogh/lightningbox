const extend = require('lodash/extend');
const {
    addDOMElement,
    removeDOMElement,
    addClass,
    removeClass
} = require('./utils');

const MODAL_CLASS = 'lb-modal';
const MODAL_IMAGE_CLASS = 'lb-modal-image';
const MODAL_IMAGES_CLASS = 'lb-modal-images';
const MODAL_IMAGE_ACTIVE_CLASS = 'lb-modal-image-active';
const MODAL_CLOSE_CLASS = 'lb-modal-close';
const MODAL_NEXT_CLASS = 'lb-modal-next';
const MODAL_PREV_CLASS = 'lb-modal-prev';
const DEFAULT_STATE = {
    isModalOpen: false,
    activeIndex: 0,
    activeElementsNumber: 0
};

let state = DEFAULT_STATE;

module.exports = {
    MODAL_CLASS,
    MODAL_IMAGE_CLASS,
    MODAL_IMAGES_CLASS,
    MODAL_IMAGE_ACTIVE_CLASS,
    MODAL_CLOSE_CLASS,
    MODAL_NEXT_CLASS,
    MODAL_PREV_CLASS,

    lightningbox,
    getElements,
    registerCallbackOnElements,
    openModal,
    closeModal,
    next,
    prev,
    resetState
};

function lightningbox (selector) {
    registerCallbackOnElements(selector, openModal);
}

function getElements (selector) {
    return [...document.querySelectorAll(selector)];
}

function registerCallbackOnElements (selector, callback, event='click') {
    const elements = getElements(selector);

    if (elements.length) {
        [...elements].forEach(element => element.addEventListener(
            event,
            () => callback(element, elements)
        ));
    }
}

function openModal (element, elements=[]) {
    updateStateFromElements(element, elements);
    setModalHTML(element, elements);

    setState({ isModalOpen: true });
}

function closeModal () {
    removeDOMElement(`.${ MODAL_CLASS }`);

    setState({ isModalOpen: false });
}

function next () {
    removeClass(getActiveElement(), MODAL_IMAGE_ACTIVE_CLASS);
    addClass(getNextElement(), MODAL_IMAGE_ACTIVE_CLASS);

    setState({ activeIndex: getNextIndex() });
}

function prev () {
    removeClass(getActiveElement(), MODAL_IMAGE_ACTIVE_CLASS);
    addClass(getPrevElement(), MODAL_IMAGE_ACTIVE_CLASS);

    setState({ activeIndex: getPrevIndex() });
}

function resetState () {
    state = extend({}, DEFAULT_STATE);
}

function setState (newState) {
    state = extend({}, state, newState);
}

function setModalHTML (element, elements) {
    if (state.isModalOpen) {
        const modalImages = document.querySelector(`.${ MODAL_IMAGES_CLASS }`);
        const newImagesHTML = getImagesHtml(element, elements);

        modalImages.innerHTML = newImagesHTML;
    } else {
        addDOMElement(getModalHtml(element, elements));
    }
}

function updateStateFromElements (element, elements) {
    if (elements.length) {
        setState({
            activeIndex: elements.indexOf(element),
            activeElementsNumber: elements.length
        });
    }
}

function getActiveElement () {
    return document.querySelector(`.${ MODAL_IMAGE_ACTIVE_CLASS }`);
}

function getNextElement () {
    const index = getNextIndex();
    const childNumber = index + 1;
    const nextElement = document.querySelector(`.${ MODAL_IMAGE_CLASS }:nth-child(${ childNumber })`);

    return nextElement;
}

function getPrevElement () {
    const index = getPrevIndex();
    const childNumber = index + 1;
    const prevElement = document.querySelector(`.${ MODAL_IMAGE_CLASS }:nth-child(${ childNumber })`);

    return prevElement;
}

function getNextIndex () {
    const index = state.activeIndex + 1;
    const wasLastElement = index === state.activeElementsNumber;
    const firstIndex = 0;

    if (wasLastElement) {
        return firstIndex;
    }

    return index;
}

function getPrevIndex () {
    const index = state.activeIndex - 1;
    const wasFirstElement = index < 0;
    const lastIndex = state.activeElementsNumber - 1;

    if (wasFirstElement) {
        return lastIndex;
    }

    return index;
}

function getModalHtml (element, elements) {
    return `
    <div class="${ MODAL_CLASS }">
        <div class="${ MODAL_CLOSE_CLASS }">&times;</div>
        <div class="${ MODAL_IMAGES_CLASS }">
            ${ getImagesHtml(element, elements) }
        </div>
        <div class="${ MODAL_NEXT_CLASS }"></div>
        <div class="${ MODAL_PREV_CLASS }"></div>
    </div>
    `;
}

function getImagesHtml (element, elements) {
    return [...elements].reduce((html, el) => {
        const newHtml = getImageHtml(el, element === el);

        return `${ html }\n${ newHtml }`;
    }, '');
}

function getImageHtml (element, isActive=false) {
    const imageUrl = element.getAttribute('href');
    const activeClass = isActive ? MODAL_IMAGE_ACTIVE_CLASS : '';

    return `<div class="${ MODAL_IMAGE_CLASS } ${ activeClass }" style="background-image: url('${ imageUrl }');"></div>`;
}
