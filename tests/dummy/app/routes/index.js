import Ember from 'ember';

const { bind } = Ember.run;
const pathToAlabama = [[35.0041, -88.1955], [34.9918, -85.6068], [32.8404, -85.1756], [32.2593, -84.8927], [32.1535, -85.0342], [31.7947, -85.1358], [31.52,   -85.0438], [31.3384, -85.0836], [31.2093, -85.107], [31.0023, -84.9944], [30.9953, -87.6009], [30.9423, -87.5926], [30.8539, -87.6256], [30.6745, -87.4072], [30.4404, -87.3688], [30.1463, -87.524], [30.1546, -88.3864], [31.8939, -88.4743], [34.8938, -88.1021], [34.9479, -88.1721], [34.9107, -88.1461]];

export default Ember.Route.extend({
  gMap: Ember.inject.service(),

  setupController: function(controller) {
    Ember.run.scheduleOnce('afterRender', this, function() {
      const mapHelper = this.get('gMap').maps.select('main-map');
      if( !mapHelper ) { return; }
      mapHelper.onLoad.then(function() {
        console.info('Google map has finished loading!');
      });
    });

    controller.setProperties({
      lat: 32.75494243654723,
      lng: -86.8359375,
      zoom: 4,
      markers: Ember.A([
        {
          id: 'jdlkfajs22',
          lat: 33.516674497188255,
          lng: -86.80091857910156,
          infoWindow: { content: '<p>Birmingham</p>',
          visible: true },
          click: function() {console.log('Boo Boo Boo'); }
        },
        {
          id: 'jdlkfajs23',
          lat: 34.516674497188255,
          lng: -85.80091857910156,
        }
      ]),
      polygons: Ember.A([
        {
          id: 'lka234klafj23', 
          paths: pathToAlabama,
          zIndex: 10
        }
      ]),
      circles: Ember.A([
        {
          id: 'lfkjasd23faj2f31',
          lat: 32.75494243654723,
          lng: -86.8359375,
          radius: 500000,
          fillOpacity: '0.1',
          fillColor: 'red',
          zIndex: 9,
          click: bind(this, function(e, circle) { 
            console.log('I miss \'ole\' \'bamy once again and I think it\'s a sin'); 
            console.log('Route context:', this);
            console.log('Event data:', e);
            console.log('Circle data:', circle);
          })
        }
      ])
    });

    // window.setInterval(() => {
    //   let lat = controller.get('lat')+ 0.5;
    //   controller.set('lat', lat);
    //   console.log(lat, 'upward');
    // }, 1000);
  },

  actions: {
    onClickPolygons: function() {
      const controller = this.controller;

      controller.set('polygons', Ember.A());

      Ember.run.later(() => {
        controller.get('polygons').pushObject({
          id: 'ldfa3fadkafa32234klafj23', 
          paths: [
            [-0.19226038138120835, -120.498046875],
            [1.0381511983133254, -104.0625],
            [-9.725300127953915, -95.185546875],
            [-14.365512629178598, -112.060546875],
            [-7.204450551811732, -126.03515625]
          ]
        });
      }, 1000);
    },

    onCircleClick: function() {
      const controller = this.controller;
      let circles      = controller.get('circles');

      circles.removeAt(0);

      Ember.run.later(() => {
        controller.get('circles').pushObject({
          id: 'zfkj234d23faj2f31',
          lat: 32.75494243654723,
          lng: -86.8359375,
          radius: 500000,
          fillOpacity: '0.1',
          fillColor: 'blue',
          zIndex: 9
        });
      });
    },

    onClickMarkers: function(e) {
      const controller = this.controller;
      let markers      = controller.markers;
      const id         = Ember.uuid()+'-ember-g-map-id';

      e.mapTilesLoaded.then(function() {
        console.log(e.latLng.A, e.latLng.F);
      });

      // Mix up Markers
      // controller.set('markers', Ember.A(markers.map((m, i) => {
      //   const mid = Ember.uuid()+'-ember-g-map-id';
      //   return {
      //     id: mid,
      //     lat: e.latLng.A + (i * 0.5),
      //     lng: e.latLng.F + (i * 0.5)
      //   }
      // })));

      // Add One Marker
      markers.pushObject({
        id,
        lat:  e.latLng.A,
        lng:  e.latLng.F,
        title: 'The title is -'+ id,
        click: function(e) {
          const m_id = e.details.id;
          // Remove marker
          for(let i = 0, l = markers.length; i < l; i++) {
            if(markers[i].id !== m_id) { continue; }

            markers.removeAt(i, 1);
            break;
          }
        },
        infoWindow: {
          content: '<p>Here I come, Alabama!</p>',
          visible: true
        }
      });
    },

    removeAllMarkers: function() {
      this.controller.set('markers', Ember.A([]));
    }
  }
});