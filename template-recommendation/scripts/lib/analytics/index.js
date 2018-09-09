import axios from  'axios'
import qs from  'querystring'
import platform from 'platform'
import cookie from '@sqs/cookie-cutter'

const hasBeacon = 'sendBeacon' in navigator

const searchParams = new URLSearchParams( window.location.search )
const showEvents = searchParams.get( 'show_events' )
const DEBUG = ( showEvents && showEvents === 'true' ) ? true : false

const API_ENDPOINT =  '/api/events/RecordEvent'

const Analytics = {
  data: null,


  /**
   * Track an internal action for analytics.
   *
   * @param  {String}  event    Name of event
   * @param  {Object}  [data={}] Event data to pass back
   * @return {Promise}
   */
  trackInternal( eventName, data = {}, apiEndpoint = API_ENDPOINT, useBeacon = false ) {
    const debug = DEBUG || window.show_events

    if ( this.data === null ) {
      this.data = {}
      // TODO: confirm this is needed
      try {
        this.data.resolved_locale = document.documentElement.lang || 'en-US'
      }
      catch ( e ) {
        this.data.resolved_locale = 'en-US'
      }
      // TODO: add source (an enum of strings--web, ios, android, server) using platform
      this.data.marketingId = cookie.get( 'SS_MID' )
    }


    // for this endpoint, formdata must be stringifed (can't take json):
    //   a=1&b=2
    const payload = {
      event: eventName,
      data: JSON.stringify( Object.assign({}, this.data, data )),
    }

    if ( debug ) {
      // remove data we don't care about
      const debugData = Object.assign({ eventType: eventName }, data )
      console.table([ debugData ])
    }

    // use beacon instead of xhr to keep things snappy
    if ( useBeacon ) {
      const headers = {
        'type': 'application/x-www-form-urlencoded',
      }
      const payloadBlob = new Blob([ qs.stringify( payload ) ], headers )
      navigator.sendBeacon( apiEndpoint, payloadBlob )
      // keep the promise at the end for consistency
      return Promise.resolve()
    }

    // async to avoid bogging down other code
    return axios.post( apiEndpoint, qs.stringify( payload ), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).catch( console.error )

  }

}

export default Analytics
