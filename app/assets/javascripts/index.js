'use strict';
/**
 **    Wecome to React
 **
 ** boot·strap:
 ** /ˈbo͞otˌstrap/
 ** a technique of loading a program into a computer ...
 ** by means of a few initial instructions that enable the introduction of the rest of the program.
 **
 ** Once React loads and bundle.js is loaded into the browser ...
 ** routing is handled client-side by the rules defined below in React.render().
 **
 ** Add a 'page' and its route below in the React.render() method.
 ** Nest routes and add query parameters (e.g., `:module` param in the URI /ui-modules/:module).
 ** Query parameters are passed into the rendered component as `this.props.routeParams`
 **
 ** http://rackt.github.io/react-router
 **/

import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from './redux/Store';
import { DevTools } from './redux/DevTools';

// React's library for handling direct DOM interaction (vs. Virual DOM interaction),
// render alows us to place our React app into the DOM
import { render } from 'react-dom';

// React's front end routing handler
import { Router, Route, browserHistory } from 'react-router';
// import { IntlProvider } from 'react-intl';

import App from './App';
import Config from './lib/Config';
import pathJoin from './lib/utils/pathJoin';

// PUBLIC
import Home from './pages/HomePage';
import Login from './pages/LoginPage';
import Signup from './pages/SignupPage';
import Terms from './pages/TermsPage';

// If we ever wanted to do server-side rendering, the intial state would get passed to the front end by passing
// the server-side store to the "__INITIAL_STATE__" client-side global variable via a script tag and "hydrating"
// our client-side state with it here
// const store = configureStore(window.__INITIAL_STATE__ || { user: null, posts: []});
const store = configureStore();

render((
    <Provider store={store}>
        <div>
            <Router history={browserHistory}>
          		<Route component={ App }>
          			<Route name="home" path={`${ Config.constants.ROOT_PATH }`} component={ Home } />
                    <Route name="login" path={`${ pathJoin( Config.constants.ROOT_PATH, `/login` )}`} component={ Login } />
                    <Route name="signup" path={`${ pathJoin( Config.constants.ROOT_PATH, `/signup` )}`} component={ Signup } />
                    <Route name="termsandconditions" path={`${ pathJoin( Config.constants.ROOT_PATH, `/terms-and-conditions` )}`} component={ Terms } />
        		</Route>
            </Router>
            <DevTools />
        </div>
    </Provider>
), document.getElementById('App') );
