import React from 'react'
import { Route, Redirect, Switch, withRouter } from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
// swap versions of the swiper below
import Swiper from './screens/swiper'
// import Swiper from './screens/swiper/swiper-iframe'
import Recommendations from './screens/recommendations'
import Vibes from './screens/vibes'
import SiteTitle from './screens/site-title'
import ContentSwap from './screens/ContentSwap'
import Categories from './screens/categories'
import MustHaves from './screens/MustHaves'
import Design from './screens/Design'
import Splash from './screens/Splash'
import CreateAccount from './screens/CreateAccount'

const App = ({ location }) => {
  return (
    <TransitionGroup>
      <CSSTransition
        key={location.key}
        timeout={350}
        classNames="route-transition"
      >
        <div key="animation-div">
          <Switch location={location}>
            <Route exact
              path="/wizard"
              render={() => (
                <Redirect to="/wizard/splash" />
              )}
            />
            <Route exact
              path="/contentswap"
              render={() => (
                <Redirect to="/contentswap/splash" />
              )}
            />
            {/* Onboard wizard */}
            <Route exact
              path="/wizard/splash"
              component={Splash}
            />
            <Route exact
              path="/wizard/vibes"
              component={Vibes}
            />
            <Route exact
              path="/wizard/title"
              component={SiteTitle}
            />
            <Route exact
              path="/wizard/layouts"
              component={Swiper}
            />
            <Route exact
              path="/wizard/features"
              component={MustHaves}
            />
            <Route exact
              path="/wizard/recommendations"
              component={Recommendations}
            />
            {/* Content swap app */}
            <Route exact
              path="/contentswap/splash"
              component={Splash}
            />
            <Route exact
              path="/contentswap/categories"
              component={Categories}
            />
            <Route exact
              path="/contentswap/design"
              component={Design}
            />
            <Route exact
              path="/contentswap/features"
              component={MustHaves}
            />
            <Route exact
              path="/contentswap/recommendations"
              component={ContentSwap}
            />
            <Route exact
              path="/contentswap/create"
              component={CreateAccount}
            />
            <Route render={() => (
              <Redirect to="/wizard/splash" />
            )}
            />
          </Switch>
        </div>
      </CSSTransition>
    </TransitionGroup>
  )
}

export default withRouter( App )