# Slow the F down

An online resource to help you manage a renovation like a general contractor.

1. [General](#general)
2. [OSX Installation](#osx-installation)
3. [Windows Installation](#windows-installation)
4. [File Structure](#file-structure)
5. [Build Process: Development](#build-process-development)
6. [Build Process: Production](#build-process-production)
7. [Application Logic](#application-logic--routing)
8. [Flux Data Flow: An Overview](#flux-data-flow-an-introduction)
9. [Code Structure](#code-structure)
10. [Additional Resources](#additional-resources)

## General
This application uses the following tools:

* [Node](http://nodejs.org) 4.2.0
* [NPM](http://npmjs.org) 2.14.7
* [Ruby](http://rubyinstaller.org/downloads) 2.5.1
* [Compas](http://compass-style.org/install) Compass 1.0.3 (Polaris)
* [Gulp](http://github.com/gulpjs/gulp) and various Gulp plugins (gulp-imagemin, gulp-autoprefixer, etc.)
* [React](http://github.com/facebook/react) 0.14.6
* [Alt](http://github.com/goatslacker/alt) 
* [Flux-style data management](http://facebook.github.io/flux/) 
* [Webpack](http://github.com/webpack/webpack) JavaScript compiler
* [react-hot-loader](http://github.com/gaearon/react-hot-loader) Automatically Reloads browser
* [NVM](https://github.com/creationix/nvm) (OSX only, helper program)
* [Homebrew](http://brew.sh/) (OSX only, helper program)

## OSX Installation

Inside a command-line tool

### Prequisites: [Node](http://nodejs.org) using [NVM](https://github.com/creationix/nvm), [Ruby](http://rubyinstaller.org/downloads), [Compass](http://compass-style.org/install)
```bash
# installing NVM
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.30.1/install.sh | bash

# installing Node and NPM
$ nvm install v4.2.0

# Set Node default
$ nvm alias default v4.2.0

# Test Node installation
$ node -v

# Test NPM installation
$ npm -v

# Test Ruby installation
$ gem -v

# Test Compass installation
$ compass -v

```

### Using Localhost

Inside a command-line tool

```bash
# Test Node installation
$ node -v

# Test NPM installation
$ npm -v

# Test Ruby installation
$ gem -v

# Test Compass installation
$ compass -v

# clone the Git repository
$ git clone git@github.com:adriaanbalt/slowthefdown.git

# change directory to the project folder
$ cd slowthefdown

# install the node modules
$ npm install

# build the code
$ gulp

In browser navigate to `localhost:3000`
```

## Windows Installation

### Prequisites: [Node](http://nodejs.org), [Ruby](http://rubyinstaller.org/downloads), [Compass](http://compass-style.org/install), [Gulp](https://www.npmjs.com/package/gulp)

1. Download [Node](https://nodejs.org)
2. Run Node `.msi` install file. This will simultaneously install `NPM`.
3. Once installation is complete, restart your computer
4. Download [Ruby](http://rubyinstaller.org/downloads)
5. Run Ruby `.msi` install file
6. Once installation is complete, restart your computer
7. Install [Compass](http://compass-style.org/install/) inside your command-line tool: `$ gem update --system` and then `$ gem install compass`
8. Install [Gulp](https://www.npmjs.com/package/gulp) inside your command-line tool: `$ npm install gulp -g`
9. To update Node and NPM download newer versions from nodejs.org and install again.

Inside a command-line tool

```bash
# Test Node installation
$ node -v

# Test NPM installation
$ npm -v

# Test Ruby installation
$ gem -v

# Test Compass installation
$ compass -v

# clone the Git repository
$ git clone git@github.com:adriaanbalt/slowthefdown.git

# change directory to the project folder
$ cd slowthefdown

# install the node modules
$ npm install

# build the code
$ gulp

In browser navigate to `localhost:3000`
```

### Troubleshooting

#### `node-sass` error
  **Compiling versions 0.9.4 and above on Windows machines requires Visual Studio 2013 WD. 
  If you have multiple Visual Studio versions: type `$ npm install node-sass --msvs_version=2013` in your command-line tool.  Also, use this flag when rebuilding the module with node-gyp or nw-gyp.**

  Source: [https://www.npmjs.com/package/node-sass](https://www.npmjs.com/package/node-sass)

#### other possible build error(s)
  Inside a command-prompt tool try typing: `npm rebuild node-sass`

  You can also try to re-run `gulp`.


## File Structure

Once the application is installed, you'll find everything in the `app` folder:

```
app/
├── assets/
│   ├── fonts/
│   ├── icons/
│   ├── images/
│   ├── javascripts/
│   │   ├── App.js
│   │   ├── index.js
│   │   ├── __tests__/
│   │   ├── actions/
│   │   │   └── AppActions.js
│   │   ├── components/
│   │   ├── lib/
│   │   │   ├── alt.js
│   │   │   ├── Localization.js
│   │   │   ├── Config.js
│   │   │   └── API.js
│   │   ├── pages/
│   │   └── stores/
│   │       └── AppStore.js
│   ├── stylesheets/
│   │   ├── base/
│   │   ├── generated/
│   │   ├── components/
│   │   ├── mixins/
│   │   ├── pages/
│   │   ├── _components.scss
│   │   ├── _mixins.scss
│   │   ├── _pages.scss
│   │   ├── _base.scss
│   │   └── global.scss
│   └── localization/
│       └── en.json
└── views
    └── index.html

public/
├── assets/
│   ├── fonts/
│   ├── localization/
│   └── stylesheets/
└── index.html
```

## Build Process: Development
```shell
$ gulp
```
You may need to alias `gulp` to `node_modules/.bin/gulp`, or `npm install -g gulp`.

Start editing assets and views from the `gulp/assets` folder. Files compile to `public`.

## Build Process: Production
```shell
$ npm run build
```

This will run karma, build your files to the public folder, revision and compress them.

## Application Logic & Routing
If you need to add a new route, add it to `index.js`. Application bootstrapping described below:

> boot·strap:
> /ˈbo͞otˌstrap/
> a technique of loading a program into a computer by means of a few initial instructions that enable the introduction of the > rest of the program.

Once React loads and bundle.js is loaded into the browser, routing is handled client-side by the rules defined in React.render().

Add a 'page' and its route in the `React.render()` method. Nest routes and add query parameters (e.g., `:module` param in the URI `/page/:sub-page`). Query parameters are passed into the rendered component as `this.props.routeParams`.

## Flux Data Flow: An Introduction
We're using [Alt.js](http://github.com/goatslacker/alt), an implementation of Facebook's [Flux](https://facebook.github.io/flux/) architecture.

From app/assets/javascripts/lib/alt.js:

                              .__   __
                       _____  |  |_/  |_
                       \__  \ |  |\   __\
                        / __ \|  |_|  |
                       (____ /____/\__|
                            \/

[Alt: Isomorphic Flux Implementation](http://github.com/goatslacker/alt)

`app/assets/javascripts/lib/alt.js`: creates an Alt/Flux instance to manage application data flow, from view to Action Creator to the store.

Example Data Flow via alt:

view --> action --> dispatcher --> store --> view

## Code Structure

#### 1. Actions
```js
'use strict';
class AppActions {
  constructor () {
    this.generateActions(
        'updateContent',
        'toggleEditMode'
    )
  }
}

export default alt.createActions(AppActions)
```
---
#### 2. Store
```js
'use strict';
class AppStore {
  constructor () {
    this.bindListeners({
      updateContent: ActionCreator.UPDATE_CONTENT,
      toggleEditMode: ActionCreator.TOGGLE_EDIT_MODE
    })
  }
  ...
  updateContent(o) {
    this.data[o.field] = o.value
  }
}

export default alt.createStore(AppStore, 'AppStore');
```
---
#### 3. View
```js
'use strict';
import React, { Component }  from 'react';
import AppStore from '../stores/AppStore';
import ActionCreator from '../actions/AppActions';
import UI from './UI';
export default class Widget extends UI {
  constructor (props) {
    super(props);
    this.state = AppStore.getState();
    this._onChange = () => {
      this.setState( AppStore.getState() );
    }
  }
  componentWillMount () {
    AppStore.listen(this._onChange);
  }
  componentWillUnmount () {
    AppStore.unlisten(this._onChange);
  }
};
```
---
#### 4. Implement View
```js
'use strict';
import ActionCreator from '../actions/AppActions';
import Widget from '../components/Widget';
...
this.updateContent (object) {
  ActionCreator.updateContent(object)
},
...
...
<Widget onClick={ this.updateContent } />
```

## Creating/Adding Icons
Inside this file: `/app/assets/stylesheets/_icons.scss`

You will see all of the icons' names that exist within the `/app/assets/images/icons` folder.  Each name has the following syntax: `icon-whatever-image-name`

I add the precursor `icon-` to associate icons that have short names, like `Bookmarks` or `Home`.

When we create new icons, we add them to the same icons folder.  After adding them, you must create the classes and reference their corresponding mixin as follows:

```css
.icon-icon-slideshow-left-2x {
  @include get-sprite( icon-slideshow-left-2x );
}
```
... or ... 
```css
.icon-Home {
  @include get-sprite( Home );
}
```

This dynamically creates the icon, in retina, for the specified icon.

To use the icon within our DOM, I've created a JS Directive  `/app/assets/javascripts/components/Icon.js`.  When you want to use an Icon, simply write <Icon name="whatever-image-name"/> within your JSX markup.

This will dynamically create the following syntax: `<span className="icon icon-whatever-image-name"/>`  I do this because if we want to change all Icons across the entire site, all we need to do is change this Icon.js file rather than going everywhere searching for all the instances.


## Additional Resources
More information on the following:
* [JSX: HTML in your JavaScript](https://facebook.github.io/react/docs/jsx-in-depth.html)
* [react-router](http://rackt.github.io/react-router)
* [Facebook's Flux overview](https://facebook.github.io/flux/)
* [Alt.js (Flux implementation): a user guide](http://alt.js.org/guide/)
* [Creating actions (events) with Alt/Flux](http://alt.js.org/guide/actions/)
* [Stores: your data warehouse](http://alt.js.org/guide/store/)
* [How to use Alt with React's lifecycle hooks](http://alt.js.org/guide/view/)
* [CSS Bliss](http://github.com/gilbox/css-bliss): an OOCSS pattern
