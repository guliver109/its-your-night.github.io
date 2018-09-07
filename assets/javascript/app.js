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
            console.log(response);


            for (var i = 0; i < response.length; i++) {
                var venueName = response[i].venue.name;
                var venueDateTime = response[i].datetime;
                var venueLatitude = response[i].venue.latitude;
                var venueLongitude = response[i].venue.longitude;
                var venueCity = response[i].venue.city;
                var tickets = response[i].offers[0].url;
                var str = venueDateTime.split("T");
                var venueDate = str[0];
                var venueTime = str[1];

                var venueInfo = {
                    name: venueName,
                    date: venueDate,
                    time: venueTime,
                    country: venueCity,
                    latitude: venueLatitude,
                    longitude: venueLongitude,
                    ticket: tickets
                }; venues.push(venueInfo);
                var cleanDate = venueDate.split("-");

                console.log(venueDate);
                console.log(venueTime);
                var newDiv = $("<div>");
                var dateDiv = $("<div>");
                var dateP = $("<p>");
                dateP.append(cleanDate[0] + " ");
                dateP.append(cleanDate[1] + " ");
                dateP.append(cleanDate[2] + " ");
                dateDiv.append(dateP);
                
                var timeDiv = $("<div>").text(venueTime.slice(0,5));
                var venueNameDiv = $("<div>").text(venueName);
                var cityDiv = $("<div>").text(venueCity);
                var ticketA = $("<a>").attr("href", tickets).attr("target", "_blank");
                var ticketBtn = $("<button class='ticket-btn'>");
                ticketBtn.text("Ticket");
                var selectBtn = $("<button class='select-btn'>").attr("data-index", i);
                selectBtn.text("Select");
                ticketA.append(ticketBtn);
                newDiv.append(selectBtn, ticketA, dateDiv, timeDiv, venueNameDiv, cityDiv);
                $("#content-display").append(newDiv);
                console.log(tickets);
                

            };
            console.log(venues);
        });
    };
    // Event handler for user clicking the select-artist button
    $("#search-btn").on("click", function (event) {
        // Preventing the button from trying to submit the form
        event.preventDefault();
        // Storing the artist name
        var inputArtist = $("#artist-input").val().trim();
        // Running the searchBandsInTown function(passing in the artist as an argument)
        searchBandsInTown(inputArtist);
    });

    $(document).on("click", ".select-btn", function(){
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
        var timeDiv = $("<div>").text(time.slice(0,5));
        
        var newDiv = $("<div>");
      
        newDiv.append(dateDiv, timeDiv, city, name);
        $("#content-display").append(newDiv);
        

        findRestaurant(longitude, latitude);
    });
});