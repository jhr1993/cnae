// This example adds a search box to a map, using the Google Place Autocomplete
      // feature. People can enter geographical searches. The search box will return a
      // pick list containing a mix of places and predicted search terms.

      // This example requires the Places library. Include the libraries=places
      // parameter when you first load the API. For example:
      // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

      function initAutocomplete() {
        var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -33.8688, lng: 151.2195},
          zoom: 13,
          mapTypeId: 'roadmap'
        });

        // Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });

        
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();

          if (places.length == 0) {
            return;
          }

          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          map.fitBounds(bounds);
        });
        var clickHandler = new ClickEventHandler(map, {lat: -33.8688, lng: 151.2195});
      }
      var ClickEventHandler = function(map, origin) {
        this.origin = origin;
        this.map = map;
        this.placesService = new google.maps.places.PlacesService(map);
        this.infowindow = new google.maps.InfoWindow();
        // Listen for clicks on the map.
        this.map.addListener('click', this.handleClick.bind(this));
      }; 

      ClickEventHandler.prototype.getPlaceInformation = function(placeId) {
        var me = this;     
        this.placesService.getDetails({placeId: placeId}, function(place, status) {
          me.infowindow.close();
          if (status === 'OK') {
            var inputNames = [ 'name', 'formatted_address', 'url',  'website' ];
            for ( var val in inputNames ) {
               document.getElementById(inputNames[val]).value = place[inputNames[val]];
            }
            document.getElementById('lat').value = place.geometry.location.lat();
            document.getElementById('lng').value = place.geometry.location.lng();
            var template = '<div id="infoContent">';
            template += '<ul>';
            template += '<li><span>Name: </span>'+place.name+'</li>';
            template += '<li><span>Formatted address: </span>'+place.name+'</li>';
            template += '<li><span>Google Maps URL: </span><a href="'+place.url+'" target="_blank">'+place.url+'</a></li>';
            template += '<li><span>Latitude: </span>'+place.geometry.location.lat()+'</li>';
            template += '<li><span>Longitude: </span>'+place.geometry.location.lng()+'</li>';
            template += '<li><span>Website: </span><a href="'+place.website+'" target="_blank">'+place.website+'</a></li>';
            template += '</ul>';
            me.infowindow.setContent(template);
            me.infowindow.setPosition(place.geometry.location);           
            me.infowindow.open(me.map);            
          }
        });
      };  

      ClickEventHandler.prototype.handleClick = function(event) {
        //console.log('You clicked on: ' + event.latLng);
        // If the event has a placeId, use it.
        if (event.placeId) {
            //console.log('You clicked on place:' + event.placeId);
          // Calling e.stop() on the event prevents the default info window from
          // showing.
          // If you call stop here when there is no placeId you will prevent some
          // other map click event handlers from receiving the event.
          event.stop();
          this.getPlaceInformation(event.placeId);
        }
      };      