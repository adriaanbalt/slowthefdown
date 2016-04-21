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
import Home from './home/Home';
import Login from './login/LoginPage';
import Signup from './signup/Signup';
import TermsAndConditions from './tac/TermsAndConditions';

// CONTRACTOR
import ContractorLanding from './contractor/landing/Landing';
import ContractorSchedule from './contractor/schedule/Schedule';
import ContractorBilling from './contractor/billing/Billing';
import ContractorProjects from './contractor/projects/Projects';
import ContractorProjectsDetails from './contractor/projects/Details';
import ContractorProjectsCreate from './contractor/projects/Create';
import ContractorSubs from './contractor/subs/Subs';
import ContractorChecklist from './contractor/checklist/Checklist';
import ContractorSettings from './contractor/settings/Settings';

// CLIENT
import ClientLanding from './client/landing/Landing';
import ClientSchedule from './client/schedule/Schedule';
import ClientBudget from './client/budget/Budget';
import ClientPackages from './client/packages/Packages';
import ClientProjects from './client/projects/Projects';
import ClientProjectsDetails from './client/projects/Details';
import ClientProjectsCreate from './client/projects/Create';
import ClientChecklist from './client/checklist/Checklist';
import ClientSettings from './client/settings/Settings';

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
                    <Route name="termsandconditions" path={`${ pathJoin( Config.constants.ROOT_PATH, `/terms-and-conditions` )}`} component={ TermsAndConditions } />
                    
                    <Route name="contractor-landing" path={`${ pathJoin( Config.constants.ROOT_PATH, `/contractor` )}`} component={ ContractorLanding } />
                    <Route name="contractor-schedule" path={`${ pathJoin( Config.constants.ROOT_PATH, `/contractor/schedule` )}`} component={ ContractorSchedule } />
                    <Route name="contractor-checklist" path={`${ pathJoin( Config.constants.ROOT_PATH, `/contractor/checklist` )}`} component={ ContractorSchedule } />
                    <Route name="contractor-billing" path={`${ pathJoin( Config.constants.ROOT_PATH, `/contractor/billing` )}`} component={ ContractorBilling } />
                    <Route name="contractor-projects-details" path={`${ pathJoin( Config.constants.ROOT_PATH, `/contractor/details/:project_id` )}`} component={ ContractorProjectsDetails } />
                    <Route name="contractor-projects-create" path={`${ pathJoin( Config.constants.ROOT_PATH, `/contractor/create` )}`} component={ ContractorProjectsCreate } />
                    <Route name="contractor-projects-create-step" path={`${ pathJoin( Config.constants.ROOT_PATH, `/contractor/create/:step` )}`} component={ ContractorProjectsCreate }/>
                    <Route name="contractor-settings" path={`${ pathJoin( Config.constants.ROOT_PATH, `/contractor/settings` )}`} component={ ContractorSettings } />
                    <Route name="contractor-checklist" path={`${ pathJoin( Config.constants.ROOT_PATH, `/contractor/checklist` )}`} component={ ContractorChecklist } />
                    <Route name="contractor-subs" path={`${ pathJoin( Config.constants.ROOT_PATH, `/contractor/subs` )}`} component={ ContractorSubs } />

                    <Route name="client-landing" path={`${ pathJoin( Config.constants.ROOT_PATH, `/client` )}`} component={ ClientLanding } />
                    <Route name="client-schedule" path={`${ pathJoin( Config.constants.ROOT_PATH, `/client/schedule` )}`} component={ ClientSchedule } />
                    <Route name="client-projects-details" path={`${ pathJoin( Config.constants.ROOT_PATH, `/client/details/:project_id` )}`} component={ ClientProjectsDetails } />
                    <Route name="client-projects-create" path={`${ pathJoin( Config.constants.ROOT_PATH, `/client/create` )}`} component={ ClientProjectsCreate } />
                    <Route name="client-projects-create-step" path={`${ pathJoin( Config.constants.ROOT_PATH, `/client/create/:step` )}`} component={ ClientProjectsCreate }/>
                    <Route name="client-checklist" path={`${ pathJoin( Config.constants.ROOT_PATH, `/client/checklist` )}`} component={ ClientChecklist } />
                    <Route name="client-settings" path={`${ pathJoin( Config.constants.ROOT_PATH, `/client/settings` )}`} component={ ClientSettings } />
        		</Route>
            </Router>
            <DevTools />
        </div>
    </Provider>
), document.getElementById('App') );
