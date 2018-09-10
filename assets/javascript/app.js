$(".dropdown-disp").hide();

$(document).ready(function () {

    var locations =[];          //index 0: venue, index:1, restaurant
    var dropdownArray = [];     //array to populate dropdown menu of concert cities
    var userRadius = 5;

    var venues = [];
    function searchBandsInTown(artist) {
        dropdownArray = []; 
        venues = [];
        $("#content-display").empty();
        console.log(artist) // replace " " with a "+", look into string methods
        artist = artist.replace(" ", "+");

        // Querying the bandsintown api for the selected artist, the ?app_id parameter is required, but can equal anything
        var queryURL = `https://rest.bandsintown.com/artists/${artist}/events?app_id=trilogy`;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            // Printing the entire object to console
            // console.log(response);
            if(response.length === 0) {
                var newP = $("<p>").text("No events found for this artist.")
                $("#content-display").append(newP);
            }
            else{
                for (var i = 0; i < response.length; i++) {
                    var venueName = response[i].venue.name;
                    var venueDateTime = response[i].datetime;
                    var venueLatitude = response[i].venue.latitude;
                    var venueLongitude = response[i].venue.longitude;
                    var venueCity = response[i].venue.city;
                    var venueCountry = response[i].venue.country;
                    var tickets = response[i].offers[0].url;
                    var str = venueDateTime.split("T");
                    var venueDate = str[0];
                    var venueTime = str[1];

                    var dropDown = {
                        city: venueCity,
                        country: venueCountry
                    }
                    var dropDownString = dropDown.city + ", " + dropDown.country;


                    var venueInfo = {
                        name: venueName,
                        date: venueDate,
                        time: venueTime,
                        city: venueCity,
                        latitude: venueLatitude,
                        longitude: venueLongitude,
                        ticket: tickets,
                        CityCountry: dropDownString


                    }; venues.push(venueInfo);                

                    if(!(dropdownArray.includes(dropDownString))) {
                        dropdownArray.push(dropDownString);
                    }
                    venueDisplay(i); 
                }
            };
            console.log(dropdownArray);
            addToDropdown();
            $(".dropdown-disp").show();
            $("#search-title").hide();
        });

    };


    function addToDropdown() {
        for (var i = 0; i < dropdownArray.length; i++) {
            var newOption = $("<option>").text(dropdownArray[i]);
            $("#dropdown1").append(newOption);  
        }
        return;
    }

    
    function venueDisplay(i) {
        var cleanDate = venues[i].date.split("-");
        // console.log(venueDate);
        // console.log(venueTime);
        var newDiv = $("<div>");
        var dateDiv = $("<div>");
        var dateP = $("<p>");
        dateP.append(cleanDate[0] + " ");
        dateP.append(cleanDate[1] + " ");
        dateP.append(cleanDate[2] + " ");
        dateDiv.append(dateP);

        var timeDiv = $("<div>").text(venues[i].time.slice(0, 5));
        var venueNameDiv = $("<div>").text(venues[i].name);
        var cityDiv = $("<div>").text(venues[i].city);
        var ticketA = $("<a>").attr("href", venues[i].ticket).attr("target", "_blank");
        var ticketBtn = $("<button class='ticket-btn'>");
        ticketBtn.text("Ticket");
        var selectBtn = $("<button class='select-btn'>").attr("data-index", i);
        selectBtn.text("Select");
        ticketA.append(ticketBtn);
        newDiv.append(selectBtn, ticketA, dateDiv, timeDiv, venueNameDiv, cityDiv);
        $("#content-display").append(newDiv);
        // console.log(tickets);
        return;
    };
 

    var foodArray = [];
    function findRestaurant() {
        radius = userRadius * 1600;
        var lat = locations[0].latitude;               //retrieving venue's latitude from array
        var long = locations[0].longitude;
        
        // $("#chosenRest-div").remove();
        $("#radius-input").remove();
        $.ajax({
            url: `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?latitude=${lat}&longitude=${long}&radius=${radius}`,
            method: "GET",
            headers: { "Authorization": "Bearer LVshEEi8tr08eqDISgxUHY71RQeHWd8dcC6bMGLUxlYjFCOpDOZGQC_tIwv6XV3bGqHY3FUrU5_vE2qEAUh3eAJo6OOAApjxYRczIUFwSn28cfIAh11oCC4s0tWQW3Yx" }

        }).then(function (response) {
            console.log(response);

            var data = response.businesses;
            var newContentDiv = $("<div>").attr("id", "restaurant-div");
            $("#content-display").append(newContentDiv);

            console.log(data);

            for (var i = 0; i < data.length; i++) {
                if (data[i].price) {                                    //using price to determine if its a restaurant or not
                    var n = data[i].name;
                    var lg = data[i].coordinates.longitude;
                    var lt = data[i].coordinates.latitude;
                    var p = data[i].price;
                    var u = data[i].url;
                    var img = data[i].image_url;

                    var obj = {
                        name: n,
                        longitude: lg,
                        latitude: lt,
                        price: p,
                        url: u,
                        image: img
                    }
                    foodArray.push(obj);

                    RestaurantDisplay(i);

                    // var newDiv = $("<div>");
                    // var newTitle = $("<a>").attr("href", u).attr("target", "_blank").text(n);
                    // // var newImg = $("<img>").attr("src", img);
                    // var newP = $("<p>").text(p);
                    // var newBtn = $("<button>").attr("data-index", i).text("Select").addClass("rest-btn");

                    // newDiv.append(newTitle, newP, newBtn);
                    // $("#restaurant-div").append(newDiv);
                };

            };

        });
    }

    function RestaurantDisplay(index) {
        var newDiv = $("<div>");
        var newTitle = $("<a>").attr("href", foodArray[index].url).attr("target", "_blank").text(foodArray[index].name);
        // var newImg = $("<img>").attr("src", foodArray[index].img);
        var newP = $("<p>").text(foodArray[index].price);
        var newBtn = $("<button>").attr("data-index", index).text("Select").addClass("rest-btn");

        newDiv.append(newTitle, newP, newBtn);
        $("#restaurant-div").append(newDiv);
        return;
    }


    function getRadius() {

        var newDiv = $("<div>").addClass("input-field").attr("id", "radius-input");
        var lblDiv = $("<label>").attr("for", "radius").text("Restaurant Distance:").attr("id", "restaurant-distance")
        var inDiv = $("<input>").attr("id", "radius")
        .attr("type", "number").addClass("validate");
        var btnDiv = $("<button>").attr("id", "select-radius").text("Show Results");
        
        newDiv.append(inDiv, lblDiv, btnDiv);
        $("#content-display").append(newDiv);
    }


    function bandFilter(userChoice) {
        $("#content-display").empty();
        for (var i = 0; i < venues.length; i++) {
            if (venues[i].CityCountry === userChoice) {
                venueDisplay(i);
            }
        }
    }

    //--------------------------------------------------------------
    //---------------------LISTENER EVENTS--------------------------
    //--------------------------------------------------------------

    $(document).on("click", "#select-radius", function() {          //click event when radius is selected
        console.log("radius selected");
        userRadius = $("#radius").val().trim();
        findRestaurant();
    })

    $(document).on("click", ".rest-btn", function() {               //user selects restaurant
        var index = $(this).attr("data-index");
        locations[1] = foodArray[index];

        $("#restaurant-div").remove();
        
        var newDiv = $("<div>").attr("id","chosenRest-div");
        var newTitle = $("<a>").attr("href", foodArray[index].url).attr("target", "_blank")
        .text(foodArray[index].name);
        var newP = $("<p>").text(foodArray[index].price);
        var newBtn1 = $("<button>").text("Get Directions");
        var newA1 = $("<a>").attr("href", "directions.html");
        var newBtn2 = $("<button>").text("Go Back").attr("id", "goBack-btn");
        newA1.append(newBtn1);
        newDiv.append(newTitle, newP, newA1, newBtn2);
        $("#content-display").append(newDiv);
    });



    // Event handler for user clicking the select-artist button
    $("#search-btn").on("click", function (event) {
        // Preventing the button from trying to submit the form
        event.preventDefault();
        // Storing the artist name
        var inputArtist = $("#artist-input").val().trim();
        // Running the searchBandsInTown function(passing in the artist as an argument)
        searchBandsInTown(inputArtist);
        
    });

    $(document).on("click", ".select-btn", function () {
        var index = $(this).attr("data-index");
        locations = [];
        locations[0] = venues[index];
        // var latitude = venues[index].latitude;
        // var longitude = venues[index].longitude;

        $("#content-display").empty();

        var date = venues[index].date;
        var time = venues[index].time;
        var city = venues[index].city;
        var name = venues[index].name;
        var dateDiv = $("<div>");
        var dateP = $("<p>");
        var cleanDate = date.split("-");
        dateP.append(cleanDate[0] + " ");
        dateP.append(cleanDate[1] + " ");
        dateP.append(cleanDate[2] + " ");
        dateDiv.append(dateP);
        var cityP = $("<p>").text(city);
        var countryP = $("<p>").text(name);
        var timeDiv = $("<div>").text(time.slice(0, 5));

        var newDiv = $("<div>");

        newDiv.append(dateDiv, timeDiv, cityP, countryP);
        $("#content-display").append(newDiv);

        getRadius();
    });


    $("#dropdown1").change(function(){
        var citySelected = $("#dropdown1 :selected").text();
        // console.log(citySelected);
        bandFilter(citySelected);
    });


    $(document).on("click", "#goBack-btn", function() {
        $("#chosenRest-div").remove();
        var newContentDiv = $("<div>").attr("id", "restaurant-div");
        $("#content-display").append(newContentDiv);
        
        for(var i = 0; i < foodArray.length; i++) {
            RestaurantDisplay(i);
        }
    });


//----------------------Google maps--------------------------//

// //  variable declaration
//  var directionDisplay, map;
//  var directionsService = new google.maps.DirectionsService();
//  var geocoder = new google.maps.Geocoder()
 
// //  initializing function
//  function initialize() {
//      // set the default center of the map
//        var latlng = new google.maps.LatLng(34.052235,-118.243683);
//        // set route options
//        var rendererOptions = { draggable: true };//draggable means you can alter/drag the route in the map
//        directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
//        //display options for the map
//        var myOptions = {
//              zoom: 10,
//              center: latlng,
//              mapTypeId: google.maps.MapTypeId.ROADMAP,
//              mapTypeControl: false
//        };
//        // adding the map to the map placeholder
//        map = new google.maps.Map(document.getElementById("map_canvas"),myOptions);
//        // sticking the map to the directions
//        directionsDisplay.setMap(map);
//        //directions to the container for the direction details
//        directionsDisplay.setPanel(document.getElementById("directionsPanel"));
//        //geolocation API
//        if (navigator.geolocation) {
//              // when geolocation is available on your device, run this function
//              navigator.geolocation.getCurrentPosition(found, notFound);
//        } else {
//              // when no geolocation is available, alert this message
//              alert("Geolocation not supported or not enabled.");
//        }
//  }
//  function notFound(msg) {  
//      alert("Could not find your location")
//  }
//  function found(position) {
//  // convert the position returned by the geolocation API to a google coordinate object
//  var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
//  // then try to reverse geocode the location to return a human-readable address
//  geocoder.geocode({"latLng": latlng}, function(results, status) {
//      if (status == google.maps.GeocoderStatus.OK) {
//      // if the geolocation was recognized and an address was found
//      if (results[0]) {
//      // add a marker to the map on the geolocated point
//        marker = new google.maps.Marker({
//        position: latlng,
//        map: map
//      });
//  //string with the address parts
//  var address = 
//  results[0].address_components[1].long_name+' '
//  +results[0].address_components[0].long_name+', '+results[0].address_components[3].long_name
//  // set the located address to the link, show the link and add a click event handler
//  $(".autoLink span").html(address).parent().show().click(function(){
//  // onclick, set the geocoded address to the start-point formfield
//  $("#routeStart").val(address);
//  // call the calcRoute function to start calculating the route
//  calcRoute();
//  });
// }
//  } else {
//  // if the address couldn't be determined, alert and error with the status message
//  alert("Geocoder failed due to: " + status);
// }
// });
// }
// function calcRoute() {
// // get the travelmode, startpoint and via point   
// var travelMode = $('input[name="travelMode"]:checked').val();
// var start = $("#routeStart").val();
// var end = $("#routeEnd").val();
// //array with options for the directions/route request
// var request = {
//  origin: start,
//  destination: end,
//  unitSystem: google.maps.UnitSystem.IMPERIAL,
//  travelMode: google.maps.DirectionsTravelMode[travelMode]
// };
// //the directions
// directionsService.route(request, function(response, status) {
//  if (status == google.maps.DirectionsStatus.OK) {
//  // directions returned by the API, clear the directions panel before adding new directions
//  $("#directionsPanel").empty();
//  // display the direction details in the container
//  directionsDisplay.setDirections(response);
//  } else {
//  // when the route could not be calculated./alert is a must
//  if (status == 'ZERO_RESULTS') {
//    alert('No route could be found between the origin and destination.');
//  } else if (status == 'UNKNOWN_ERROR') {
//    alert('A directions request could not be processed due to a server error. The request may succeed if you try again.');
//  } else if (status == 'REQUEST_DENIED') {
//    alert('This webpage is not allowed to use the directions service.');
//  } else if (status == 'OVER_QUERY_LIMIT') {
//    alert('The webpage has gone over the requests limit in too short a period of time.');
//  } else if (status == 'NOT_FOUND') {
//    alert('At least one of the origin, destination, or waypoints could not be geocoded.');
//  } else if (status == 'INVALID_REQUEST') {
//    alert('The DirectionsRequest provided was invalid.');         
//  } else {
//    alert("There was an unknown error in your request. Requeststatus: nn"+status);
// }
// }
// });
// }


});

