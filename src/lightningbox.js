const extend = require('lodash/extend');
const { addElement, removeElement } = require('./utils');

const MODAL_CLASS = 'lb-modal';
const MODAL_IMAGE_CLASS = 'lb-modal-image';
const MODAL_IMAGES_CLASS = 'lb-modal-images';
const MODAL_IMAGE_ACTIVE_CLASS = 'lb-modal-image-active';
const MODAL_CLOSE_CLASS = 'lb-modal-close';
const MODAL_NEXT_CLASS = 'lb-modal-next';
const MODAL_PREV_CLASS = 'lb-modal-prev';

module.exports = {
    MODAL_CLASS,
    MODAL_IMAGE_CLASS,
    MODAL_IMAGES_CLASS,
    MODAL_IMAGE_ACTIVE_CLASS,
    MODAL_CLOSE_CLASS,
    MODAL_NEXT_CLASS,
    MODAL_PREV_CLASS,
    getElements,
    registerCallbackOnElements,
    openModal,
    closeModal
};

function registerCallbackOnElements (selector, callback, event='click') {
    const elements = getElements(selector);

    if (elements.length) {
        [...elements].forEach(element => element.addEventListener(
            event,
            () => callback(element, elements)
        ));
    }
}

function getElements (selector) {
    return document.querySelectorAll(selector);
}

function openModal (element, elements=[]) {
    const html = getModalHtml(element, elements);

    addElement(html);
}

function closeModal () {
    removeElement(`.${ MODAL_CLASS }`)
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
