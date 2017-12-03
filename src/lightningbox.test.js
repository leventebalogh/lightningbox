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
    getElements,
    registerCallbackOnElements,
    openModal,
    closeModal,
    next,
    prev
} = require('./lightningbox');

const CLASS = 'gallery';
const SELECTOR = `.${ CLASS }`;
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

            expect(getElements(`.${ MODAL_CLASS }`)).to.have.lengthOf(1);
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

            expect(getElements(`.${ MODAL_CLASS }`)).to.have.lengthOf(0);
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

function shouldHaveActiveUrl (url) {
    const selector = `.${ MODAL_IMAGE_ACTIVE_CLASS }`;

    expect(getStyle(selector)).to.contain(`background-image: url('${ url }')`);
}
