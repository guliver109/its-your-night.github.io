$(document).ready(function () {
  //variable declaration
  var directionsService = new google.maps.DirectionsService();
  var geocoder = new google.maps.Geocoder();
  // var APIKey = "AIzaSyCVg7w_mohqdu3aS4yQWvgQELczpbIsXmw";
  var APIKey = "AIzaSyBgYZmc-9EC6bHQmRI--_R6oSnPF1V4KtE";
  //retrieving coordinates from localStorage
  var coord = localStorage.getItem("coordinates");
  //console.log(coord);
  var userStart = [];
  var userEnd = []; 
  
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
    route:[],
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
    placesObject.endPositionLatitude = coordArray[0].latitude;
    placesObject.endPositionLongitude = coordArray[0].longitude;
    
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
    placesObject.googleEnd = function () {//method
      return new google.maps.Marker({
        position: new google.maps.LatLng(this.endPositionLatitude, this.endPositionLongitude),
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

    var proxy = "https://cors-anywhere.herokuapp.com/"
    
    var directionsURL = `${proxy}https://maps.googleapis.com/maps/api/directions/json?origin=${this.currentPositionLatitude},${this.currentPositionLongitude}&destination=${this.endPositionLatitude},${this.endPositionLongitude}&waypoints=${this.restLat},${this.restLong}|${this.venueLat},${this.venueLong}&key=${APIKey}`;
        $.ajax({
          url: directionsURL,
          method: "GET"
      }).then(function(response) {
        console.log(response);
        
        for (var i = 0; i < response.routes[0].legs.length; i++) {
          placesObject.route[i] = response.routes[0].legs[i];
        }

        for (var j = 0; j < response.routes[0].legs.length; j++) {
          var newDiv = $("<div>");
          for (var i = 0; i <response.routes[0].legs[j].steps.length; i++) {
            // var newP = $("<p>").text(response.routes[0].legs[j].steps[i].html_instructions);
            newDiv.append(response.routes[0].legs[j].steps[i].html_instructions);
          }
          $("#routing-instructions").append(newDiv);
        }



        var directionsDisplay = new google.maps.DirectionsRenderer();
        directionsDisplay.setMap(placesObject.map);
        var directionsService = new google.maps.DirectionsService();
        
        var request = {
          origin: response.routes[0].legs[0].start_address,
          destination: response.routes[0].legs[2].end_address,
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

//---------------------------------------------------------------------------
//display all directions to html
    // placesObject.displayDirections = function() {
    //   console.log("displaying route object");
    //   // console.log(this.route);
    //   // console.log(this.route.length);
    //   for (var j = 0; j < 3; j++) {
    //     var newDiv = $("<div>");
    //     for (var i = 0; i <this.route[j].steps.length; i++) {
    //       var newP = $("<p>").text(`${this.route[j].steps[i].html_instructions}`);
    //       newDiv.append(newP);
    //       console.log(this.route[j].steps[i].html_instructions);
    //     }
    //     $("#routing-instructions").append(newDiv);
    //   }
    // }   


//getting coordinates from user input address
    function codeAddress(address, userInput) {
      console.log("address function");
      var cArray = [];

      $.ajax({
        url: `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${APIKey}`,
        method: "GET"
    }).then(function(response) {
      // console.log(response);
      if(userInput === "start") {
        placesObject.currentPositionLatitude = response.results[0].geometry.location.lat;
        placesObject.currentPositionLongitude = response.results[0].geometry.location.lng;
      }
      else if (userInput === "end") {
        placesObject.endPositionLatitude = response.results[0].geometry.location.lat;
        placesObject.endPositionLongitude = response.results[0].geometry.location.lng;
      }
      
    });

    console.log(placesObject.currentPositionLatitude);
    }

    placesObject.rerouting = function () {
      this.googleCurrentPosition();
      this.googleEnd();
      this.getDirection();

    }


    //----------------fill rest/venue div------------------------
    $("#restaurant-name").text("Restaurant: " + venueRestArray[1].name);
    $("#venue-name").text("Venue: " + venueRestArray[0].name);

    $("#calc-route").on("click", function(event) {
      event.preventDefault();
      uStart = $("#route-start").val().trim();
      uEnd = $("#route-end").val().trim(); 

      // placesObject.getCoordinates(uStart,uEnd);
      if(uStart !== "") {
        // console.log("populating array")
        userStart = codeAddress(uStart, "start");
      }
      if (uEnd !== "") {
        userEnd = codeAddress(uEnd, "end");
      }
      placesObject.rerouting();
    })
    //  console.log(placesObject);

  
 });
