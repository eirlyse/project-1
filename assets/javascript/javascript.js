let brewery = [];

let map;
let service;
let infowindow;
let city = {
    query: 'Gilbert Arizona',
    fields: ['name', 'geometry'],
};

var icon = '/assets/images/hop-icon.png'
function createMark(place) {
    let marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        icon: icon,
    });
    google.maps.event.addListener(marker, 'click', function () {
        infowindow = new google.maps.InfoWindow();
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}

function addressMark(address) {
    let request = {
        query: address,
        fields: ['name', 'geometry'],
    };
    // console.log(address);
    service = new google.maps.places.PlacesService(map);
    service.findPlaceFromQuery(request, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            createMark(results[0]);
        }
    });
}

function myMap() {
    let tmpCenter = new google.maps.LatLng(0, 0);
    map = new google.maps.Map(document.getElementById('map'), { 
        center: tmpCenter,
        zoom: 12,
        styles: mapStyle,
    });
    service = new google.maps.places.PlacesService(map);
    service.findPlaceFromQuery(city, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            map.setCenter(results[0].geometry.location);
        }
    });
    
}
var breweryNames = []
var breweryAddress = []
var breweryWebsites = []


$("#searchButton").on("click", function () {

    let searchCityInput = $("#searchCity").val(); // get value of string of city search 
    let searchStateInput = $("#searchState").val(); //get value of string for state search 

    let searchCity = searchCityInput.replace(/ /g, "_");
    let searchStateUpper = searchStateInput.toUpperCase();
    let searchState;
    //if state input is 2 letters, parse to the full name
    if (searchStateInput.length === 2) {
        searchState = parseStateName(searchStateUpper).replace(/ /g, "_");
    } else {
        searchState = searchStateInput.replace(/ /g, "_");
    };
   
    console.log(searchCity, searchState);


    let queryURL = `https://api.openbrewerydb.org/breweries?by_city=${searchCity}&by_state=${searchState}&per_page=10`
    // to set number of results, add &per_page=10
    // strings must have spaces replaced with "_"
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        for (let i = 0; i < response.length; i++) {
            let name = response[i].name;
            let street = response[i].street;
            let city = response[i].city;
            let state = response[i].state;
            let phone = response[i].phone;
            var website = response[i].website_url;
            
            console.log(website);
            brewery[i] = new Brewery(name, street, city, state, phone, website);
        };
        console.log("brewery", brewery);
        for (let i = 0; i < brewery.length; i++) {
            const element = brewery[i];
            breweryNames.push(element.name);
            breweryAddress.push(element.street);
            breweryWebsites.push(response.website_url);
            console.log(breweryWebsites[i])
            // console.log(element.website_url)
            // console.log(element.street)
            addressMark(element.street);
        };
        // console.log(breweryNames,breweryAddress,breweryWebsites)
        //need to send address of each location to google geocoding API to convert to lat/long
        $(".searchResults").empty();
        for (let i = 0; i < breweryAddress.length; i++) {
            let element = breweryAddress[i];
            console.log(response[i].name);
            var card = $("<div>");
            card.attr("class", "card");
            var cardBody = $("<div>");
            cardBody.attr("class","card-title");

            cardBody.css("padding", "20px");
            card.append(cardBody);
            var h = $("<h5>").text(response[i].name);
            h.addClass("pb-3");
            cardBody.append(h);
            var cardText = $("<p>").html(element + "<br><b> Phone Number: </b>" + response[i].phone + "<br><b>Type:</b> " + response[i].brewery_type)
            cardBody.append(cardText)
            cardText.css("margin-left", "60px")
            
            var a =$("<a>")
            var links = $("<button>");
            a.append(links);
            links.attr("class","btn btn-warning hvr-sweep-to-right");
            
            if (response[i].website_url === "") {
              searchName = breweryNames[i].replace(/ /g, "+");
              console.log(searchName);
              a.attr("href", `https://www.google.com/search?q=${searchName}`)
            } else {
              a.attr("href", response[i].website_url);
            };

            a.attr("target", "_blank");
            a.css("float", "right");
            a.css("margin-right", "165px");
            links.html("View Website");
            cardBody.append(a);
            
            var img = $('<img src="../assets/images/hop-icon.png" id="resultIcon">');
            cardBody.prepend(img);
            $(".searchResults").append(card);
        };
       
    }).catch(function (error) {
        console.log(error);
    })
});


class Brewery {
    constructor(name, street, city, state, phone, address, website) {
        this.name = name;
        this.street = street;
        this.city = city;
        this.state = state;
        this.phone = phone
        this.address = `${street},${city},${state}`;
        this.website = website;
    };
};


function parseStateName (searchStateUpper) { 
    let statesShort = [ "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", 
                        "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", 
                        "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", 
                        "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", 
                        "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY" ];
    let statesLong = [ "Alabama", "Alaska", "Arizona", "Arkansas", "California",
                        "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
                        "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
                        "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
                        "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri",
                        "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
                        "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
                        "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
                        "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
                        "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming" ];
    let fullStateName;

    for (let i = 0; i < statesShort.length; i++) {
        if (statesShort[i] === searchStateUpper) {
            fullStateName = statesLong[i];
        };
    };       
    return fullStateName; 
};


const mapStyle = [
    {
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#ffffff"
          },
          {
            "weight": 0.5
          }
        ]
      },
      {
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#616161"
          }
        ]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#f5f5f5"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#bdbdbd"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#ffffff"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#e5e5e5"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9e9e9e"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#ffdb0f"
          },
          {
            "saturation": -15
          },
          {
            "lightness": 60
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#ffdb0f"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#616161"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9e9e9e"
          }
        ]
      },
      {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#e5e5e5"
          }
        ]
      },
      {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#eeeeee"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#e5e5e5"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9e9e9e"
          }
        ]
      }
]