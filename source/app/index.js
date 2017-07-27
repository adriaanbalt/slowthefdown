import React from 'react';
import { Route, Link } from 'react-router-dom'
import Nav from 'components/nav'
import Footer from 'components/footer'
import Home from '../home'
import About from '../about'

const App = () => (
  <div className="wrapper">
    <Nav />
    <Footer />
    <main>
      <Route exact path="/" component={Home} />
      <Route exact path="/about-us" component={About} />
    </main>
  </div>
)

export default App