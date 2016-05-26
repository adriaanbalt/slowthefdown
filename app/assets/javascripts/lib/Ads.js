
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import API from '../redux/API';
import ActionCreator from '../redux/ActionCreator';

let instance = 0;

export default class Ads extends Component {

  componentWillMount() {
    // if (window.googletag && googletag.apiReady) {
    //   console.log ( 'googletag', googletag, this.props )

    //   // googletag.cmd.push(function() {
    //   //   googletag
    //   //     .defineSlot('/22986605/slowthefdown-ad', [300, 100], 'div-gpt-ad-1464203173988-0')
    //   //     .addService(googletag.pubads());
    //   // });

    //   googletag.cmd.push(() => {

    //     // Define the ad slot
    //     let slot = googletag.defineSlot(
    //       this.props.adUnit, 
    //       [this.props.width, this.props.height], 
    //       this.props.id
    //     ).addService(googletag.pubads());

    //     googletag.pubads().addEventListener('slotRenderEnded', (event) => {
    //       console.log('Slot has been rendered:', event);
    //     });
    //     // Start ad fetching
    //     googletag.enableServices();

    //     console.log ( 'slot', this.props.id, slot );
    //   });
    // }
  }

  componentDidMount() {
    // googletag.pubads().refresh()
  }

  refreshAd() {
    console.log ( "REFRESH ");
    // googletag.pubads().refresh();
  }
  
  displayAd() {
    // googletag.cmd.push(() => {
    // console.log ( 'displayAd', this.props.id);
    //   // display ad
    //   googletag.display( this.props.id );
    // });
  }

  render() {
    console.log ( 'rendered', this.props.open)
    if ( this.props.open ){
      this.displayAd();
    }
    return (
      <div>
        <div onClick={ this.refreshAd.bind(this) }>REFRESH</div>
        <div style={{width:this.props.width, height:this.props.height}}>
          <div id={this.props.id}></div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
  };
}

Ads.propTypes = {
  dispatch: PropTypes.func.isRequired,
  slot: PropTypes.string,
};

export default connect(mapStateToProps)(Ads);
