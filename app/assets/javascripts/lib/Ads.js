
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import API from '../redux/API';
import ActionCreator from '../redux/ActionCreator';

let instance = 0;

export default class Ads extends Component {

  componentDidMount() {
    if (window.googletag && googletag.apiReady) {
      console.log ( 'googletag', googletag, this.props )
    }

    // googletag.cmd.push(function() {
    //   googletag
    //     .defineSlot('/22986605/slowthefdown-ad', [300, 100], 'div-gpt-ad-1464203173988-0')
    //     .addService(googletag.pubads());
    // });

    googletag.cmd.push(() => {

      // Define the ad slot
      let slot = googletag.defineSlot(
        this.props.adUnit, 
        [this.props.width, this.props.height], 
        this.props.id
      ).addService(googletag.pubads());

      // Start ad fetching
      googletag.pubads().enableSingleRequest();
      googletag.pubads().enableSyncRendering();
      googletag.enableServices();

      // display ad
      googletag.display(this.props.id);
      console.log ( 'slot', this.props, slot );
    });
  }

  render() {
    console.log ( 'rendered')
    return (
      <div style={{width:this.props.width, height:this.props.height}}>
        <div id={this.props.id}></div>
      </div>
    );
  }
  // displayAd(id) {
  //   googletag.cmd.push(function() {
  //     googletag.display(id);
  //   });
  // }
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
