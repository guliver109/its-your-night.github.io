$(".dropdown-disp").hide();
$("#restaurant-card").hide();
$("#search-field").hide();

$(document).ready(function () {

    var locations =[];          //locations chosen by user. (index 0: venue, index:1, restaurant)
    var dropdownArray = [];     //array to populate dropdown menu of concert cities
    var userRadius = 5;

    var venues = [];
    function searchBandsInTown(artist) {
        dropdownArray = []; 
        venues = [];
        var artistFound = true;

        $(".dropdown1-options").remove();       //remove previous dropdown city options
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
                $(".dropdown-disp").hide();
                var newP = $("<p>").text("Artist currently not touring.")
                $("#content-display").append(newP);
                artistFound = false;
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

                    if(!(dropdownArray.includes(dropDownString))) {     //if city,country not yet in the array then add
                        dropdownArray.push(dropDownString);
                    }
                    venueDisplay(i); 
                }
            };
            if (artistFound) {                          //only show city dropdown if artist is currently touring
                console.log(dropdownArray);
                addToDropdown();
                $(".dropdown-disp").show();
                $("#search-title").hide();
            }
        });

    };

    function convertTime(inTime) {                  //converts military time to am/pm
        var hourVar = parseInt(inTime.slice(0, 3));

        if(hourVar > 12) {
            hourVar = hourVar -12;
            var hourStr = hourVar + ":00pm";
        }
        else if (hourVar === 12) {
            var hourStr = hourVar + ":00pm";
        }
        else {
            var hourStr = hourVar + ":00am";
        }

        return hourStr;
    }

    //populates city,coutry dropdown filter
    function addToDropdown() {                          
        for (var i = 0; i < dropdownArray.length; i++) {
            var newOption = $("<option>").text(dropdownArray[i]).addClass("dropdown1-options");
            $("#dropdown1").append(newOption);  
        }
        return;
    }

    
    function venueDisplay(i) {
        var cleanDate = venues[i].date.split("-");
        // console.log(venueDate);
        // console.log(venueTime);
        //This div represents the venue box
        var newDiv = $("<div class='venue-box'>");
        var dateDiv = $("<div>");
        var dateP = $("<p>");
        dateP.append(cleanDate[0] + "/");
        dateP.append(cleanDate[1] + "/");
        dateP.append(cleanDate[2] + " ");
        dateDiv.append(dateP);

        var timeDiv = $("<div>").text(convertTime(venues[i].time));
        var venueNameDiv = $("<div>").text(venues[i].name);
        var cityDiv = $("<div>").text(venues[i].city);
        var ticketA = $("<a>").attr("href", venues[i].ticket).attr("target", "_blank");
        var ticketBtn = $("<button class='ticket-btn'>");
        ticketBtn.text("Ticket");
        var selectBtn = $("<button class='select-btn'>").attr("data-index", i);
        selectBtn.text("Select");
        ticketA.append(ticketBtn);
        newDiv.append(venueNameDiv, cityDiv, timeDiv, dateDiv, selectBtn, ticketA);
        $("#content-display").append(newDiv);
        $("#left-card").css("opacity", "0.3");
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
                    var cat = data[i].categories[0].title;

                    var obj = {
                        name: n,
                        longitude: lg,
                        latitude: lt,
                        price: p,
                        url: u,
                        image: img,
                        category: cat
                    }
                    foodArray.push(obj);

                    RestaurantDisplay(i);
                };

            };

        });
    }

    function RestaurantDisplay(index) {
        // console.log(foodArray[index].img);
        var newDiv = $("<div>").addClass("row rest-div");
        var newTitle = $("<a>").attr("href", foodArray[index].url).attr("target", "_blank").text(foodArray[index].name).addClass("rest-name");
        var imgDiv = $("<div>").addClass("col s3 img-cont");
        var newImg = $("<img>").attr("src", foodArray[index].image).addClass("responsive-img circle rest-img");
        var newP = $("<p>").text(foodArray[index].price).addClass("p-style");
        var newP2 = $("<p>").text(foodArray[index].category).addClass("p-style");
        var textDiv = $("<div>").addClass("col s6 titleDiv-style");
        var btnDiv = $("<div>").addClass("col s3 btnDiv-style");
        var newBtn = $("<button>").attr("data-index", index).text("Select").addClass("rest-btn");

        textDiv.append(newTitle, newP, newP2);
        imgDiv.append(newImg);
        btnDiv.append(newBtn);
        newDiv.append(imgDiv,textDiv,btnDiv);
        $("#restaurant-div").append(newDiv);
        return;
    }


    function getRadius() {
        $("#restaurant-card").show();
        var newOption2 = $("<option>").addClass("dropdown-disp").text("1");
        var newOption3 = $("<option>").addClass("dropdown-disp").text("5");
        var newOption4 = $("<option>").addClass("dropdown-disp").text("10");

        $("#dropdown2").append(newOption2, newOption3, newOption4);  
    }


    function bandFilter(userChoice) {                   //filters concert venue by city,country selected by user on dropdown
        $("#content-display").empty();
        for (var i = 0; i < venues.length; i++) {
            if (venues[i].CityCountry === userChoice) {
                venueDisplay(i);
            }
            else if (userChoice === "Select city") {
                venueDisplay(i);
            }
        }
    }

    //--------------------------------------------------------------
    //---------------------EVENTS LISTENER--------------------------
    //--------------------------------------------------------------

    $("#artist-input").on("click", function() {   //changes artist search box opacity 1 when user clicks on input box
        $("#artist-input").val("");
        $("#left-card").css("opacity", "1.0");
    })

    $("#neon-button").on("click", function() {      //hides neon title when user clicks on it, search box appears
        $("#left-card").css("background-color", "#e42971");
        $("#search-field").show();
        $("#neon-button").hide();
    })

    $("#dropdown2").change(function(){        //click event when radius is selected
        console.log("radius selected");
        userRadius = $("#dropdown2 :selected").text();
        userRadius = parseInt(userRadius);
        $("#restaurant-card").hide();
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
        var newA1 = $("<a>").attr("href", "directions.html").attr("id", "go-to-map");
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

    $(document).on("click", ".select-btn", function () {        //when user selects venue, the selection is dipslayed
        var index = $(this).attr("data-index");
        locations = [];
        locations[0] = venues[index];

        $(".dropdown-disp").hide();
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
        var venueyP = $("<p>").text(name);
        var msgP = $("<p>").text("Venue chosen:");
        var timeDiv = $("<div>").text(time.slice(0, 5));

        var newDiv = $("<div>").addClass("venue-box");

        newDiv.append(msgP, venueyP, cityP, dateDiv, timeDiv);
        $("#content-display").append(newDiv);

        getRadius();
    });


    $("#dropdown1").change(function(){
        var citySelected = $("#dropdown1 :selected").text();
        // console.log(citySelected);
        bandFilter(citySelected);
    });


    $(document).on("click", "#goBack-btn", function() {                 //goes back to restaurant list
        $("#chosenRest-div").remove();
        var newContentDiv = $("<div>").attr("id", "restaurant-div");
        $("#content-display").append(newContentDiv);
        
        for(var i = 0; i < foodArray.length; i++) {
            RestaurantDisplay(i);
        }
    });

    $(document).on("click", "#go-to-map", function() {                  //goes to direction html
        localStorage.setItem("coordinates", JSON.stringify(locations));
        console.log(JSON.stringify(locations));
    });

});

