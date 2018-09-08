$(document).ready(function () {

    var venues = [];
    function searchBandsInTown(artist) {
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
                

                // console.log(dropDownString);



            };
            // console.log(venues);
            

        });

        console.log(venues);
        
        for (var i = 0; i < venues.length; i++) {
            console.log("venue for-loop");
           venueInfo(i); 
        }
        

    };
    

 

    
    var foodArray = [];
    function findRestaurant(longitude, latitude) {
        var radius = 5 * 1600;
        $.ajax({
            url: `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?latitude=${latitude}&longitude=${longitude}&radius=${radius}`,
            method: "GET",
            headers: { "Authorization": "Bearer LVshEEi8tr08eqDISgxUHY71RQeHWd8dcC6bMGLUxlYjFCOpDOZGQC_tIwv6XV3bGqHY3FUrU5_vE2qEAUh3eAJo6OOAApjxYRczIUFwSn28cfIAh11oCC4s0tWQW3Yx" }

        }).then(function (response) {
            console.log(response);

            var data = response.businesses;

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
                        long: lg,
                        lat: lt,
                        price: p,
                        url: u
                    }

                    var newDiv = $("<div>");
                    var newTitle = $("<a>").attr("href", u).attr("target", "_blank").text(n);
                    // var newImg = $("<img>").attr("src", img);
                    var newP = $("<p>").text(p);
                    var newBtn = $("<button>").attr("data-index", i).text("Select").addClass("rest-btn");

                    newDiv.append(newTitle, newP, newBtn);
                    $("#content-display").append(newDiv);
                };

            };
        });
    }

    $(document).on("click", ".rest-btn", function () {
        // $("#content-display").empty();

        // var index = $(this).attr("data-index");

        // var newDiv = $("<div>");
        // var newp1 = $("<p>").text(foodArray[index].name);
        // var newp2 = $("<p>").text(foodArray[index].long);
        // var newp3 = $("<p>").text(foodArray[index].lat);

        // newDiv.append(newp1, newp2, newp3);
        // $("#content-display").append(newDiv);
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
        var latitude = venues[index].latitude;
        var longitude = venues[index].longitude;

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
        var timeDiv = $("<div>").text(time.slice(0, 5));

        var newDiv = $("<div>");

        newDiv.append(dateDiv, timeDiv, city, name);
        $("#content-display").append(newDiv);


        findRestaurant(longitude, latitude);
    });



    function bandFilter(userIndex) {
        var userChoice = venues[userIndex].CityCountry;

        // for (var i = 0; i < venues.length; i++) {
        //     if (venues[i].CityCountry === userChoice)
        // }


    }
    $(document).on("click", ".country-btn", function () {

        var index = $(this).attr("data-index");
        bandFilter(index);

    });
    function venueInfo(i) {
        var cleanDate = venues[i].date.split("-");
            console.log("function accessed");
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
});


//add data-index to drop down options