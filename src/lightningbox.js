const extend = require('lodash/extend');
const { addElement, removeElement } = require('./utils');

const MODAL_CLASS = 'lb-modal';
const MODAL_IMAGE_CLASS = 'lb-modal-image';
const MODAL_CLOSE_CLASS = 'lb-modal-close';
const MODAL_NEXT_CLASS = 'lb-modal-next';
const MODAL_PREV_CLASS = 'lb-modal-prev';

module.exports = {
    MODAL_CLASS,
    MODAL_IMAGE_CLASS,
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
    const imageUrl = element.getAttribute('href');

    return `
        <div class="${ MODAL_CLASS }">
            <div class="${ MODAL_CLOSE_CLASS }">&times;</div>
            <div class="${ MODAL_IMAGE_CLASS }" style="background-image: url('${ imageUrl }');"></div>
            <div class="${ MODAL_NEXT_CLASS }"></div>
            <div class="${ MODAL_PREV_CLASS }"></div>
        </div>
    `;
}
