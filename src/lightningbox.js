import extend from 'lodash/extend';
import {
    addDOMElement,
    removeDOMElement,
    addClass,
    removeClass
} from './utils';
import './style.scss';

const MODAL_CLASS = 'lb-modal';
const MODAL_IMAGE_CLASS = 'lb-modal-image';
const MODAL_IMAGES_CLASS = 'lb-modal-images';
const MODAL_IMAGE_ACTIVE_CLASS = 'lb-modal-image-active';
const MODAL_CLOSE_CLASS = 'lb-modal-close';
const MODAL_NEXT_CLASS = 'lb-modal-next';
const MODAL_PREV_CLASS = 'lb-modal-prev';
const ICON_SIZE = 64;
const ICON_COLOR = '#ffffff';
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

    setState({ isModalOpen: true });
    setStateFromElements(element, elements);
    addDOMElement(getModalHtml(element, elements));
    addEventListeners();
}

function closeModal () {
    removeDOMElement(`.${ MODAL_CLASS }`);
    setState({ isModalOpen: false });
}

function next () {
    console.log('NEXT');
    removeClass(getActiveElement(), MODAL_IMAGE_ACTIVE_CLASS);
    addClass(getNextElement(), MODAL_IMAGE_ACTIVE_CLASS);
    console.log('NEXT LOADED');

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

function addEventListeners () {
    registerCallbackOnElements(`.${ MODAL_CLOSE_CLASS }`, closeModal, 'click');
    registerCallbackOnElements(`.${ MODAL_NEXT_CLASS }`, next, 'click');
    registerCallbackOnElements(`.${ MODAL_PREV_CLASS }`, prev, 'click');
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
    <div class="${ MODAL_CLASS }">
        <div class="${ MODAL_CLOSE_CLASS }">${ getCloseSVG() }</div>
        <div class="${ MODAL_IMAGES_CLASS }">
            ${ getImagesHtml(element, elements) }
        </div>
        <div class="${ MODAL_NEXT_CLASS }">${ getArrowLeftSVG() }</div>
        <div class="${ MODAL_PREV_CLASS }">${ getArrowRightSVG() }</div>
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

function getArrowLeftSVG () {
    return `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="${ ICON_SIZE }px" height="${ ICON_SIZE }px" viewBox="0 0 ${ ICON_SIZE } ${ ICON_SIZE }" enable-background="new 0 0 ${ ICON_SIZE } ${ ICON_SIZE }" xml:space="preserve">
            <g><polyline fill="none" stroke="${ ICON_COLOR }" stroke-width="2" stroke-linejoin="bevel" stroke-miterlimit="10" points="27,15 44,32 27,49"/></g>
            <g><circle fill="none" stroke="${ ICON_COLOR }" stroke-width="2" stroke-miterlimit="10" cx="${ ICON_SIZE / 2 }" cy="${ ICON_SIZE / 2 }" r="30.999"/></g>
            </svg>`;
}

function getArrowRightSVG () {
    return `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="${ ICON_SIZE}px" height="${ ICON_SIZE}px" viewBox="0 0 ${ ICON_SIZE } ${ ICON_SIZE }" enable-background="new 0 0 ${ ICON_SIZE } ${ ICON_SIZE }" xml:space="preserve">
            <g><polyline fill="none" stroke="${ ICON_COLOR }" stroke-width="2" stroke-linejoin="bevel" stroke-miterlimit="10" points="37,15 20,32 37,49 "/></g>
            <g><circle fill="none" stroke="${ ICON_COLOR }" stroke-width="2" stroke-miterlimit="10" cx="${ ICON_SIZE / 2 }" cy="${ ICON_SIZE / 2 }" r="30.999"/></g>
            </svg>`;
}

function getCloseSVG () {
    return `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="${ ICON_SIZE }" height="${ ICON_SIZE }" viewBox="0 0 ${ ICON_SIZE } ${ ICON_SIZE }" enable-background="new 0 0 ${ ICON_SIZE } ${ ICON_SIZE }" xml:space="preserve">
            <g><line fill="none" stroke="${ ICON_COLOR }" stroke-width="2" stroke-miterlimit="10" x1="18.947" y1="17.153" x2="45.045" y2="43.056"/></g>
            <g><line fill="none" stroke="${ ICON_COLOR }" stroke-width="2" stroke-miterlimit="10" x1="19.045" y1="43.153" x2="44.947" y2="17.056"/></g>
            </svg>`;
}