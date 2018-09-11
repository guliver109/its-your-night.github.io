$(document).ready(function () {
  //variable declaration
  var directionsService = new google.maps.DirectionsService();
  var geocoder = new google.maps.Geocoder();
  //retrieving coordinates from localStorage
  var coord = localStorage.getItem("coordinates");
  //console.log(coord);
  var venueRestArray = JSON.parse(coord);
  var coordArray = [ //array of objects
    // current location coords
    {
    },
    // restaurant coords
    {
      latitude: venueRestArray[1].latitude, //find the real one
      longitude: venueRestArray[1].longitude
    },
    // venue coords
    {
      latitude: venueRestArray[0].latitude, //find the real one
      longitude: venueRestArray[0].longitude
    }
  ];
  // --------------------- places object ---------------------------------
  var placesObject = {
    route:[]
  };
  placesObject.found = function (position) {
  //should be start-restaurant-venue-home
    //venue
    coordArray[0].latitude = position.coords.latitude;
    coordArray[0].longitude = position.coords.longitude;
    placesObject.currentPositionLatitude = coordArray[0].latitude;
    placesObject.currentPositionLongitude = coordArray[0].longitude;
    placesObject.restLat = coordArray[1].latitude;
    placesObject.restLong = coordArray[1].longitude;
    placesObject.venueLat = parseFloat(coordArray[2].latitude);
    placesObject.venueLong = parseFloat(coordArray[2].longitude);
    
  }
  placesObject.getCurrentPosition = function () {
    if (navigator.geolocation) {
      // 'this" changes within nested functions in methods, use arrow functions to keep this as parent object
      navigator.geolocation.getCurrentPosition(position => {
        if (position){
            this.found(position);
            this.googleCurrentPosition();
            this.googleRestaurant();
            this.googleVenue();
            this.getDirection();
        }
      });
    }
  }
    placesObject.googleCurrentPosition = function () {
        return new google.maps.Marker({
          position: new google.maps.LatLng(this.currentPositionLatitude, this.currentPositionLongitude),
          map: this.map
        });
   }
    placesObject.googleRestaurant = function () {
      console.log(this.restLat, this.restLong);
      return new google.maps.Marker({
        position: new google.maps.LatLng(this.restLat, this.restLong),
        map: this.map
      });
    }
    placesObject.googleVenue = function () {//method
      return new google.maps.Marker({
        position: new google.maps.LatLng(this.venueLat, this.venueLong),
        map: this.map
      });
    }
    placesObject.createMap = function () {//method
      this.initialize();
      this.getCurrentPosition();
      //console.log(this.googleRestaurant());
    };
    placesObject.initialize = function() {
      this.myOptions = {
        zoom: 10,
        center: new google.maps.LatLng(34.052235,-118.243683),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false
      };
      this.map = new google.maps.Map(document.getElementById("map_canvas"),
              this.myOptions);
  }
  placesObject.createMap();
  
  //directions for routes
  
  placesObject.getDirection = function () {
    var APIKey = "AIzaSyCVg7w_mohqdu3aS4yQWvgQELczpbIsXmw";
    var proxy = "https://cors-anywhere.herokuapp.com/"
    
    var directionsURL = `${proxy}https://maps.googleapis.com/maps/api/directions/json?origin=${this.currentPositionLatitude},${this.currentPositionLongitude}&destination=${this.currentPositionLatitude},${this.currentPositionLongitude}&waypoints=${this.restLat},${this.restLong}|${this.venueLat},${this.venueLong}&key=${APIKey}`;
        $.ajax({
          url: directionsURL,
          method: "GET"
      }).then(function(response) {
        console.log(response);
        
        for (var i = 0; i < response.routes[0].legs.length; i++) {
          placesObject.route[i] = response.routes[0].legs[i];
        }
        var directionsDisplay = new google.maps.DirectionsRenderer();
        directionsDisplay.setMap(placesObject.map);
        var directionsService = new google.maps.DirectionsService();
        
        var request = {
          origin: response.routes[0].legs[0].start_address,
          destination: response.routes[0].legs[0].start_address,
          waypoints: [
                  {location: response.routes[0].legs[0].end_address,    
                  stopover: true
                  },{
                    location: response.routes[0].legs[1].end_address,
                    stopover: true
                  }],
          travelMode: "DRIVING"
        }
        directionsService.route(request, function (response, status) { 
          //console.log(`${placesObject.restLat},${placesObject.restLong}`);
          if (status == google.maps.DirectionsStatus.OK){
            directionsDisplay.setDirections(response);
          }
        });
      });
    }
  
 });
