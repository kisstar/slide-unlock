# slide-unlock

![Demo](https://github.com/kisstar/slide-unlock/blob/main/public/images/demo.png?raw=true)

A JavaScript library that provides sliding unlocking.

## Usage

Provide an HTML element as the mount point:

```html
<div id="slider-container"></div>
```

Introduce scripts and styles, and then create slider applications:

```js
import SlideUnlock from '@kisstar/slide-unlock';
// You can also directly import SCSS files to create different themes
// The example here imports CSS files directly
import '@kisstar/slide-unlock/dist/slide-unlock.css';

const slideUnlock = new SlideUnlock({
  // Options
});

slideUnlock.init();
slideUnlock.mount('#slider-container');
```

### Options

| Configuration item | Type     | Explain                           | Default                               |
| :----------------- | :------- | :-------------------------------- | ------------------------------------- |
| width              | string   | Slider width.                     | '100%'                                |
| height             | string   | Slider height.                    | '100%'                                |
| placeholder        | string   | Placeholder for slider.           | 'Please drag the slider to the right' |
| message            | string   | Text displayed after unlocking.   | 'Unlock succeeded'                    |
| success            | Function | Callback after unlocking.         |                                       |
| prefix             | string   | Prefix for all styles.            | 'ks'                                  |
| duration           | number   | Transition time for slider reset. | 500ms                                 |

## Development scripts

```bash
# runs the app in the development mode
npm start

# verify the code format and syntax in the project
npm run lint

# write a more friendly commit message
npm run commit
```

## License

MIT
