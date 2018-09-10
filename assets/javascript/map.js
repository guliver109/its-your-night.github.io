$(document).ready(function() {

  var placesObject = {}
  placesObject.latlng;
  placesObject.myOptions = {
    zoom: 10,
    center: this.latlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false
  };
// adding the map to the map placeholder
  placesObject.map = new google.maps.Map(document.getElementById("map_canvas"),placesObject.myOptions);

  initialize();
    //retrieving coordinates from localStorage
    // var coord = localStorage.getItem("coordinates");
    // console.log(coord);
    // var coordArray = JSON.parse(coord);
   
    var coordArray = [ //array of objects
      // current location coords
      {
        
      },
      // restaurant coords
    {
      latitude: 118.623,//find the real one
      longitude: 101.23
    },
    // venue coords
    {
      latitude: 145.623,
      longitude: 154.23
    }
  ]
     //variable declaration
        var directionDisplay, map;
        var directionsService = new google.maps.DirectionsService();
        var geocoder = new google.maps.Geocoder()
        
        //initializing function
        function initialize() {
            // set the default center of the map
              var latlng = new google.maps.LatLng(34.052235,-118.243683);
              // set route options
              var rendererOptions = { draggable: true };//draggable means you can alter/drag the route in the map
              directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
              //display options for the map
              var myOptions = {
                    zoom: 10,
                    center: placesObject.latlng,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    mapTypeControl: false
              };
              // adding the map to the map placeholder
              map = new google.maps.Map(document.getElementById("map_canvas"),myOptions);
              // sticking the map to the directions
              directionsDisplay.setMap(map);
              //directions to the container for the direction details
              directionsDisplay.setPanel(document.getElementById("directionsPanel"));
              //geolocation API
              if (navigator.geolocation) {
                    // when geolocation is available on your device, run this function
                    navigator.geolocation.getCurrentPosition(found, notFound);
              } else {
                    // when no geolocation is available, alert this message
                    alert("Geolocation not supported or not enabled.");
              }
        }
        function notFound(msg) {  
            alert("Could not find your location")
        }
        function found(position) {


          //should be start-restaurant-venue-home
          //venue
          coordArray[0].latitude = position.coords.latitude;
          coordArray[0].longitude = position.coords.longitude;


          placesObject.currentPositionLatitude = coordArray[0].latitude;
          placesObject.currentPositionLongitude = coordArray[0].longitude;
          placesObject.restLat = coordArray[1].latitude;
          placesObject.restLong = coordArray[1].longitude;
          placesObject.venueLat = coordArray[2].latitude;//
          placesObject.venueLong = coordArray[2].longitude;
          placesObject.googleCurrentPosition = function(){
            placesObject.latlng = new google.maps.LatLng(this.currentPositionLatitude, this.currentPositionLongitude);
            return new google.maps.Marker({
              position: placesObject.latlng,
              map
            });
          }
          placesObject.googleVenue = function(){
            placesObject.latlng = new google.maps.LatLng(this.venueLat, this.venueLong);
            return new google.maps.Marker({
              position: placesObject.latlng,
              map
            });
          }
          placesObject.googleRestaurant = function(){
            placesObject.latlng = new google.maps.LatLng(this.restLat, this.restLong);
            return new google.maps.Marker({
              position: placesObject.latlng,
              map
            });
          }
          placesObject.googleCurrentPosition();
          placesObject.googleVenue();
          placesObject.googleRestaurant();

          console.log(placesObject);
        // convert the position returned by the geolocation API to a google coordinate object
        var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        // then try to reverse geocode the location to return a human-readable address
        geocoder.geocode({"latLng": latlng}, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
            // if the geolocation was recognized and an address was found
            if (results[0]) {
            // add a marker to the map on the geolocated point
              marker = new google.maps.Marker({
              position: latlng,
              map: placesObject.map
            });
        //string with the address parts
        var address = 
        results[0].address_components[1].long_name+' '
        +results[0].address_components[0].long_name+', '+results[0].address_components[3].long_name
        // set the located address to the link, show the link and add a click event handler
        $(".autoLink span").html(address).parent().show().click(function(){
        // onclick, set the geocoded address to the start-point formfield
        $("#routeStart").val(address);
        // call the calcRoute function to start calculating the route
        calcRoute();
        });
      }
        } else {
        // if the address couldn't be determined, alert and error with the status message
        alert("Geocoder failed due to: " + status);
    }
  });
}
function calcRoute() {
      // get the travelmode, startpoint and via point   
      var travelMode = $('input[name="travelMode"]:checked').val();
      var start = $("#routeStart").val();
      var end = $("#routeEnd").val();
      //array with options for the directions/route request
      var request = {
        origin: start,
        destination: end,
        unitSystem: google.maps.UnitSystem.IMPERIAL,
        travelMode: google.maps.DirectionsTravelMode[travelMode]
  };
  // restaurants adresses and marker creating
  $(".button").on("click",function() {
    var locations = [];//array for latLng for restaurants
    console.log(locations)
    var marker, i;
    //loop for taking location and printing them into map
    for (i = 0; i < locations.length; i++) { 
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
        map: placesObject.map
      });
    //creating marker for every restaurant in array
      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infowindow.setContent(locations[i][0]);
          infowindow.open(placesObject.map, marker);
        }
      })(marker, i));
    }
  });

    //the directions
      directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
        // directions returned by the API, clear the directions panel before adding new directions
        $("#directionsPanel").empty();
        // display the direction details in the container
        directionsDisplay.setDirections(response);
        } else {
        // when the route could not be calculated./alert is a must
        if (status == 'ZERO_RESULTS') {
          alert('No route could be found between the origin and destination.');
        } else if (status == 'UNKNOWN_ERROR') {
          alert('A directions request could not be processed due to a server error. The request may succeed if you try again.');
        } else if (status == 'REQUEST_DENIED') {
          alert('This webpage is not allowed to use the directions service.');
        } else if (status == 'OVER_QUERY_LIMIT') {
          alert('The webpage has gone over the requests limit in too short a period of time.');
        } else if (status == 'NOT_FOUND') {
          alert('At least one of the origin, destination, or waypoints could not be geocoded.');
        } else if (status == 'INVALID_REQUEST') {
          alert('The DirectionsRequest provided was invalid.');         
        } else {
          alert("There was an unknown error in your request. Requeststatus: nn"+status);
      }
    }
  });
}
})

