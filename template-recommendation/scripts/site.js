import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Switch } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'
import store, { history } from './Store'
import App from './App'
import { onBrowserPopstate } from './shared/Queue/actions'

class Welcome extends React.Component {
  constructor( props ) {
    super( props )
    this.onPopState = this.onPopState.bind( this )
  }

  componentWillMount() {
    window.addEventListener( 'popstate', this.onPopState )
  }

  componentWillUnmount() {
    window.removeEventListener( 'popstate', this.onPopState )
  }

  onPopState() {
    store.dispatch( onBrowserPopstate())
  }

  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <App />
        </ConnectedRouter>
      </Provider>
    )
  }
}

export function mount( $domElement ) {
  ReactDOM.render( <Welcome />, $domElement )
}