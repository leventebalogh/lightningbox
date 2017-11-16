const { JSDOM } = require('jsdom');
const sinonChai = require('sinon-chai');
const chai = require('chai');
const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;

chai.should();
chai.use(sinonChai);

global.window = window;
global.document = window.document;
global.navigator = {
    userAgent: 'node.js'
};

copyProps(window, global);

function copyProps(src, target) {
    const props = Object.getOwnPropertyNames(src)
        .filter(prop => typeof target[prop] === 'undefined')
        .map(prop => Object.getOwnPropertyDescriptor(src, prop));

    Object.defineProperties(target, props);
}
