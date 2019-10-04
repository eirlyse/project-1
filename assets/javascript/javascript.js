$(document).ready(function () {

//====================================================================================================================================
// openbrewery API call

//this array is empty and gets filled on API call
//DON'T DELETE POR FAVOR!!!
let brewery = [];

$("#searchButton").on("click", function() {

    let searchCityInput = $("#searchCity").val(); // get value of string of city search 
    let searchStateInput = $("#searchState").val(); //get value of string for state search 

    let searchCity = searchCityInput.replace(/ /g, "_");
    let searchState = searchStateInput.replace(/ /g, "_");

    console.log(searchCity, searchState);
    

        let queryURL = `https://api.openbrewerydb.org/breweries?by_city=${searchCity}&by_state=${searchState}&per_page=10`
        // to set number of results, add &per_page=10
        // strings must have spaces replaced with "_"
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then
            (function (response) {
                console.log(response);
                for (let i = 0; i < response.length; i++) {
                    let name = response[i].name;
                    let street = response[i].street;
                    let city = response[i].city;
                    let state = response[i].state;
                    let phone = response[i].phone;
                    brewery[i] = new Brewery(name, street, city, state, phone);
                }
                console.log(brewery);

                //need to send address of each location to google geocoding API to convert to lat/long
                //send each lat/long to google map API and set map and markers
                

            },
            function (error) {
                console.log(error);
            })
});

//====================================================================================================================================

class Brewery {
    constructor(name, street, city, state, phone, latitude, longitude) {
        this.name = name;
        this.street = street;
        this.city = city;
        this.state = state;
        this.phone = phone
        this.address = `${street},${city},${state}`;
    };
};





});