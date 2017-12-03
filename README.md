# Lightningbox

![Desktop](screenshots/desktop-1.png "On desktop")

## Usage
```html
<!-- Your view -->
<div class="gallery">
    <a href="/images/1.jpg" title="Foo"><img src="/images/1-small.jpg" alt="Foo" /></a>
    <a href="/images/2.jpg" title="Bar"><img src="/images/2-small.jpg" alt="Bar" /></a>
</div>
```

```javascript
// Controller javascript
import { lightningbox } from 'lightningbox';

lightningbox('.gallery > a');
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