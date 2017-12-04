const sinon = require('sinon');
const { expect } = require('chai');
const {
    createFromHtmlString,
    addDOMElement,
    removeDOMElement,
    dispatchEvent,
    getHtml,
    getStyle
} = require('./utils');
const {
    MODAL_CLASS,
    MODAL_CLOSE_CLASS,
    MODAL_IMAGE_CLASS,
    MODAL_IMAGES_CLASS,
    MODAL_IMAGE_ACTIVE_CLASS,
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
} = require('./lightningbox');

const CLASS = 'gallery';
const SELECTOR = `.${ CLASS }`;
const LINK_SELECTOR = `${ SELECTOR } > a`;
const SAMPLE_HTML = `
<div class="${ CLASS }">
    <a href="/images/1.jpg"><img src="/images/1-small.jpg" style="width: 200px;" /></a>
    <a href="/images/2.jpg"><img src="/images/2-small.jpg" style="width: 200px;" /></a>
    <a href="/images/3.jpg"><img src="/images/3-small.jpg" style="width: 200px;" /></a>
    <a href="/images/4.jpg"><img src="/images/4-small.jpg" style="width: 200px;" /></a>
</div>
`;

describe('LightningBox', () => {
    beforeEach(() => {
        removeDOMElement(SELECTOR);
        removeDOMElement(`.${ MODAL_CLASS }`);
        addDOMElement(SAMPLE_HTML);
        resetState();
    });

    describe('lightningbox()', () => {
        beforeEach(() => lightningbox(LINK_SELECTOR));

        it('should open a modal when clicking on an image', () => {
            dispatchEvent(`${ LINK_SELECTOR }:first-child`, 'click');

            shouldHaveModalOpen();
        });

        it('should not open the modal more than once', () => {
            dispatchEvent(`${ LINK_SELECTOR }:first-child`, 'click');
            dispatchEvent(`${ LINK_SELECTOR }:first-child`, 'click');

            shouldHaveModalOpen(); // checks for 1 modal
        });

        it('should show the first image', () => {
            dispatchEvent(`${ LINK_SELECTOR }:first-child`, 'click');

            shouldHaveActiveUrl('/images/1.jpg');
        });

        it('should show the next image when clicking on next', () => {
            dispatchEvent(`${ LINK_SELECTOR }:first-child`, 'click');
            dispatchEvent(`.${ MODAL_NEXT_CLASS }`, 'click');

            shouldHaveActiveUrl('/images/2.jpg');
        });

        it('should show the previous image when clicking on prev', () => {
            dispatchEvent(`${ LINK_SELECTOR }:first-child`, 'click');
            dispatchEvent(`.${ MODAL_PREV_CLASS }`, 'click');

            shouldHaveActiveUrl('/images/4.jpg');
        });

        it('should close the modal when clicking on close', () => {
            dispatchEvent(`${ LINK_SELECTOR }:first-child`, 'click');
            dispatchEvent(`.${ MODAL_CLOSE_CLASS }`, 'click');

            shouldNotHaveModalOpen();
        });
    });

    describe('getElements()', () => {
        it('should find all elements', () => {
            const elements = getElements('.gallery a');

            expect(elements).to.have.lengthOf(4);
        });
    });

    describe('registerCallbackOnElements()', () => {
        it('should register a click callback on the elements', () => {
            const callback = sinon.stub();

            registerCallbackOnElements('.gallery a', callback);
            dispatchEvent('.gallery a:first-child', 'click');
            dispatchEvent('.gallery a:first-child', 'click');

            expect(callback).to.have.been.calledTwice;
        });

        it('should pass the clicked element to the callback', () => {
            const callback = sinon.stub();
            const element = getElements('.gallery a')[0];

            registerCallbackOnElements('.gallery a', callback);
            dispatchEvent('.gallery a:first-child', 'click');

            expect(callback).to.have.been.calledWith(element);
        });

        it('should pass the array of coherent elements to the callback', () => {
            const callback = sinon.stub();
            const elements = getElements('.gallery a');
            const [element] = elements;

            registerCallbackOnElements('.gallery a', callback);
            dispatchEvent('.gallery a:first-child', 'click');

            expect(callback).to.have.been.calledWith(element, elements);
        });
    });

    describe('openModal()', () => {
        it('should add a modal div to the body', () => {
            const elements = getElements('.gallery a');
            const [element] = elements;

            openModal(element, elements);

            shouldHaveModalOpen();
            expect(getElements(`.${ MODAL_CLOSE_CLASS }`)).to.have.lengthOf(1);
            expect(getElements(`.${ MODAL_NEXT_CLASS }`)).to.have.lengthOf(1);
            expect(getElements(`.${ MODAL_PREV_CLASS }`)).to.have.lengthOf(1);
        });

        it('should display the clicked image', () => {
            const elements = getElements('.gallery a');
            const [element] = elements;
            const href = element.getAttribute('href');
            const selector = `.${ MODAL_IMAGE_ACTIVE_CLASS }`;

            openModal(element, elements);

            expect(getStyle(selector)).to.contain(`background-image: url('${ href }')`);
        });

        it('should have all the images loaded in the dom', () => {
            const elements = getElements('.gallery a');
            const [element] = elements;
            const href = element.getAttribute('href');
            const selector = `.${ MODAL_IMAGES_CLASS }`;

            openModal(element, elements);

            const html = getHtml(selector);
            elements.forEach(element => expect(html).to.contain(element.getAttribute('href')));
        });
    });

    describe('closeModal()', () => {
        it('should remove the modal from the dom', () => {
            const elements = getElements('.gallery a');
            const [element] = elements;

            openModal(element, elements);
            closeModal();

            shouldNotHaveModalOpen();
        });
    });

    describe('next()', () => {
        it('should show the next image', () => {
            const images = getElements('.gallery a');
            const [image, secondImage, thirdImage] = images;
            const url = image.getAttribute('href');
            const secondUrl = secondImage.getAttribute('href');
            const thirdUrl = thirdImage.getAttribute('href');
            const selector = `.${ MODAL_IMAGE_ACTIVE_CLASS }`;

            openModal(image, images);
            shouldHaveActiveUrl(url);
            next();
            shouldHaveActiveUrl(secondUrl);
            next();
            shouldHaveActiveUrl(thirdImage);
        });
    });

    describe('prev()', () => {
        it('should show the previous image', () => {
            const images = getElements('.gallery a');
            const [firstImage, secondImage, thirdImage] = images;
            const firstUrl = firstImage.getAttribute('href');
            const secondUrl = secondImage.getAttribute('href');
            const thirdUrl = thirdImage.getAttribute('href');
            const selector = `.${ MODAL_IMAGE_ACTIVE_CLASS }`;

            openModal(thirdImage, images);
            shouldHaveActiveUrl(thirdUrl);
            prev();
            shouldHaveActiveUrl(secondUrl);
            prev();
            shouldHaveActiveUrl(firstUrl);
        });
    });
});

function shouldHaveModalOpen (params) {
    expect(getElements(`.${ MODAL_CLASS }`)).to.have.lengthOf(1);
}

function shouldNotHaveModalOpen (params) {
    expect(getElements(`.${ MODAL_CLASS }`)).to.have.lengthOf(0);
}

function shouldHaveActiveUrl (url) {
    const selector = `.${ MODAL_IMAGE_ACTIVE_CLASS }`;

    expect(getStyle(selector)).to.contain(`background-image: url('${ url }')`);
}
