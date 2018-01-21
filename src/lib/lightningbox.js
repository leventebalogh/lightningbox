const { addDOMElement, removeDOMElement, addClass, removeClass, getAnimationEndEventName } = require('./utils');
const { arrowLeftSVG, arrowRightSVG, closeSVG } = require('./svgs');

const MODAL_CLASS = 'lb-modal';
const MODAL_BODY_CLASS = 'lb-modal-is-open';
const MODAL_FIT_CLASS = 'lb-absolute-fit';
const MODAL_ANIMATION_IN_CLASS = 'lb-anim-in';
const MODAL_ANIMATION_OUT_CLASS = 'lb-anim-out';
const MODAL_IMAGE_CLASS = 'lb-modal-image';
const MODAL_IMAGES_CLASS = 'lb-modal-images';
const MODAL_IMAGE_ACTIVE_CLASS = 'lb-modal-image-active';
const MODAL_PAGINATION_CLASS = 'lb-modal-pagination';
const MODAL_CLOSE_CLASS = 'lb-modal-close';
const MODAL_NEXT_CLASS = 'lb-modal-next';
const MODAL_PREV_CLASS = 'lb-modal-prev';

const DEFAULT_STATE = {
    isModalOpen: false,
    activeIndex: 0,
    activeElementsNumber: 0,
    animationEndEventName: getAnimationEndEventName()
};

let state = DEFAULT_STATE;

module.exports = {
    MODAL_CLASS,
    MODAL_BODY_CLASS,
    MODAL_FIT_CLASS,
    MODAL_ANIMATION_IN_CLASS,
    MODAL_ANIMATION_OUT_CLASS,
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
        [...elements].forEach(element => {
            element.addEventListener(event, e => {
                e.preventDefault();
                e.stopPropagation();

                callback(element, elements);
            });
        });
    }
}

function openModal (element, elements=[]) {
    if (state.isModalOpen) {
        return;
    }

    addClass(document.body, MODAL_BODY_CLASS);
    setState({ isModalOpen: true });
    setStateFromElements(element, elements);
    addDOMElement(getModalHtml(element, elements));
    addEventListeners();
}

function closeModal () {
    const modalElem = document.querySelector(`.${ MODAL_CLASS }`);
    modalElem.addEventListener(state.animationEndEventName, function animationEnd() {
        removeDOMElement(`.${ MODAL_CLASS }`);
        removeEventListeners();
        setState({ isModalOpen: false });
    });
    removeClass(document.body, MODAL_BODY_CLASS);
    addClass(modalElem, MODAL_ANIMATION_OUT_CLASS);
}

function next () {
    removeClass(getActiveElement(), MODAL_IMAGE_ACTIVE_CLASS);
    addClass(getNextElement(), MODAL_IMAGE_ACTIVE_CLASS);
    setState({ activeIndex: getNextIndex() });
    updatePagination();
}

function prev () {
    removeClass(getActiveElement(), MODAL_IMAGE_ACTIVE_CLASS);
    addClass(getPrevElement(), MODAL_IMAGE_ACTIVE_CLASS);
    setState({ activeIndex: getPrevIndex() });
    updatePagination();
}

function resetState () {
    state = { ...DEFAULT_STATE };
}

function setState (newState) {
    state = { ...state, ...newState };
}

function addEventListeners () {
    registerCallbackOnElements(`.${ MODAL_CLOSE_CLASS }`, closeModal, 'click');
    registerCallbackOnElements(`.${ MODAL_NEXT_CLASS }`, next, 'click');
    registerCallbackOnElements(`.${ MODAL_PREV_CLASS }`, prev, 'click');
    addKeyEventListeners();
}

function removeEventListeners () {
    removeKeyEventListeners();
}

function addKeyEventListeners () {
    document.addEventListener('keyup', onKeyup);
}

function removeKeyEventListeners () {
    document.removeEventListener('keyup', onKeyup);
}

function onKeyup (e) {
    const isRightArrow = e.keyCode == 39;
    const isLeftArrow = e.keyCode == 37;
    const isEsc = e.keyCode == 27;

    if (isRightArrow) {
        next();
    }

    if (isLeftArrow) {
        prev();
    }

    if (isEsc) {
        closeModal();
    }
}

function setStateFromElements (element, elements) {
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
    <div class="${ MODAL_ANIMATION_IN_CLASS } ${ MODAL_CLASS }">
        <div class="${ MODAL_CLOSE_CLASS }">${ closeSVG }</div>
        <div class="${ MODAL_FIT_CLASS } ${ MODAL_IMAGES_CLASS }">
            ${ getImagesHtml(element, elements) }
        </div>
        ${ getNavHtml(elements) }
        <div class="${ MODAL_PAGINATION_CLASS }">${ getPagination() }</div>
    </div>
    `;
}

function getNavHtml (elements) {
    if (elements && elements.length > 1) {
        return `
            <div class="${ MODAL_NEXT_CLASS }">${ arrowLeftSVG }</div>
            <div class="${ MODAL_PREV_CLASS }">${ arrowRightSVG }</div>
        `;
    }

    return '';
}

function updatePagination () {
    const pagination = document.querySelector(`.${ MODAL_PAGINATION_CLASS }`);

    pagination.innerHTML = getPagination();
}

function getPagination () {
    return `${ state.activeIndex + 1 }<span>/</span>${ state.activeElementsNumber }`;
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

    return `<div class="${ MODAL_FIT_CLASS } ${ MODAL_IMAGE_CLASS } ${ activeClass }" style="background-image: url('${ imageUrl }');"></div>`;
}
