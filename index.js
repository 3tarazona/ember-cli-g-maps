/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-cli-g-maps',

  // Include Gmaps code in consuming app
  included: function() {
    this._super.included(...arguments);

    var app;

    // If the addon has the _findHost() method (in ember-cli >= 2.7.0), we'll just
    // use that.
    if (typeof this._findHost === 'function') {
      app = this._findHost();
    } else {
      // Otherwise, we'll use this implementation borrowed from the _findHost()
      // method in ember-cli.
      var current = this;
      do {
        app = current.app || app;
      } while (current.parent.parent && (current = current.parent));
    }

    app.import(app.bowerDirectory + '/gmaps-for-apps/gmaps.js');
  },

  // Request Google Maps script in consuming app
  contentFor: function(type, config) {
    var googleMapConfig = config.googleMap || {};

    var params = [];
    var content = '';
    var googleMapSrc, isClient;

    if (type === 'head') {
      googleMapSrc = 'maps.googleapis.com/maps/api/js';
      // let googleMapsScript = 'http://maps.google.com/maps/api/js?sensor=true'

      //Protocol setup
      googleMapConfig.protocol = googleMapConfig.protocol || '//';

      // default to Google Maps V3
      googleMapConfig.version = googleMapConfig.version || '3';
      params.push('v='+ encodeURIComponent(googleMapConfig.version));

      // grab either API key or client ID
      if (googleMapConfig.apiKey) {
        isClient = googleMapConfig.apiKey.substr(0, 4) === 'gme-';
        params.push((isClient ? 'client' : 'key') +'='+ encodeURIComponent( googleMapConfig.apiKey ));
      }

      // add any optional libraries
      if (googleMapConfig.libraries && googleMapConfig.libraries.length) {
        params.push('libraries='+ encodeURIComponent( googleMapConfig.libraries.join(',') ));
      }

      // add optional localization
      if (googleMapConfig.language) {
        params.push('language='+ encodeURIComponent( googleMapConfig.language ));
      }
      if (googleMapConfig.region) {
        params.push('region='+ encodeURIComponent( googleMapConfig.region ));
      }

      googleMapSrc = googleMapConfig.protocol + googleMapSrc;
      googleMapSrc += '?'+ params.join('&');

      if(googleMapConfig.lazyLoad) {
        content = '<meta name="ember-cli-g-maps-url" content="'+ googleMapSrc +'">';
      } else {
        content = '<script src="'+ googleMapSrc +'"></script>';
      }
    }

    return content;
  }
};
