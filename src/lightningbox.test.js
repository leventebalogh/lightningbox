const sinon = require('sinon');
const { expect } = require('chai');
const { createFromHtmlString, addElement, removeElement, dispatchEvent } = require('./utils');
const {
    MODAL_CLASS,
    getElements,
    registerCallbackOnElements,
    openModal
} = require('./lightningbox');

const CLASS = 'gallery';
const SELECTOR = `.${ CLASS }`;
const HTML = `
<div class="${ CLASS }">
    <a href="/images/1.jpg"><img src="/images/1-small.jpg" style="width: 200px;" /></a>
    <a href="/images/2.jpg"><img src="/images/2-small.jpg" style="width: 200px;" /></a>
    <a href="/images/3.jpg"><img src="/images/3-small.jpg" style="width: 200px;" /></a>
    <a href="/images/4.jpg"><img src="/images/4-small.jpg" style="width: 200px;" /></a>
</div>
`;

describe('LightningBox', () => {
    beforeEach(() => {
        removeElement(SELECTOR);
        removeElement(`.${ MODAL_CLASS }`);
        addElement(HTML);
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

    describe('openModal', () => {
        it('should add a modal div to the body', () => {
            const elements = getElements('.gallery a');
            const [element] = elements;

            openModal(element, elements);

            expect(getElements(`.${ MODAL_CLASS }`)).to.have.lengthOf(1);
        });
    });
});
