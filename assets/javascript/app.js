$(document).ready(function() {

    // var longitude = -118.339;
    // var latitude = 34.1127;
    // var radius = 8000;   //miles * 1.60934
    var foodArray = [];
    function findRestaurant(longitude, latitude, radius) {
        $.ajax({
            url: `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?latitude=${latitude}&longitude=${longitude}&radius=${radius}`,
            method: "GET",
            headers: {"Authorization": "Bearer LVshEEi8tr08eqDISgxUHY71RQeHWd8dcC6bMGLUxlYjFCOpDOZGQC_tIwv6XV3bGqHY3FUrU5_vE2qEAUh3eAJo6OOAApjxYRczIUFwSn28cfIAh11oCC4s0tWQW3Yx"}

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

                    foodArray.push(obj);

                    var newDiv = $("<div>");
                    var newTitle = $("<a>").attr("href", u).attr("target", "_blank").text(n);
                    // var newImg = $("<img>").attr("src", img);
                    var newP = $("<p>").text(p);
                    var newBtn = $("<button>").attr("data-index", i).text("Select");

                    newDiv.append(newTitle, newP,newBtn);
                    $("#restaurant-display").append(newDiv);
                }
            }

        });
    }

    $(document).on("click", "button", function() {
        $("#content-display").empty();

        var index = $(this).attr("data-index");
        
        var newDiv = $("<div>");
        var newp1 = $("<p>").text(foodArray[index].name);
        var newp2 = $("<p>").text(foodArray[index].long);
        var newp3 = $("<p>").text(foodArray[index].lat);

        newDiv.append(newp1, newp2, newp3);
        $("#content-display").append(newDiv);
    });

    // $(document).on("click", "select-venue", function() {

    // })

});