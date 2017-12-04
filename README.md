![Travis Build](https://travis-ci.org/leventebalogh/lightningbox.svg?branch=master "Travis Build")

# Lightningbox

A small and blazing fast vanilla javascript image viewer. [View Demo](https://lightningbox.leventebalogh.com)

![Lightningbox - A small and blazing fast vanilla javascript image viewer.](screenshots/screenshot.png "Lightningbox - A small and blazing fast vanilla javascript image viewer.")

## Install
```bash
$ npm install --save lightningbox
```

## Usage
**API**

The `lightningbox()` function only takes a single selector which has to point on a single or multiple `<a>` elements.
If there are multiple elements matching the selector the gallery view will be used automatically.

**Usage with NPM**
```javascript
import lightningbox from 'lightningbox';

lightningbox('.gallery > a');
```

```html
<div class="gallery">
    <a href="/images/1.jpg" title="Foo"><img src="/images/1-small.jpg" alt="Foo" /></a>
    <a href="/images/2.jpg" title="Bar"><img src="/images/2-small.jpg" alt="Bar" /></a>
</div>
```

## CDN
Just use the following code to make `window.lightningbox` available on your site.
```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/lightningbox@1.0.0/dist/lightningbox.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lightningbox@1.0.0/dist/lightningbox.min.css" />
```


## Development
```bash
# Run Webpack
$ yarn dev

# Create production build
$ yarn build

# Run the tests
$ yarn test

# Play TDD
$ yarn tdd
```