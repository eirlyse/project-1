$(document).ready(function () {

//====================================================================================================================================
// openbrewery API call


    let searchCityInput = "Phoenix"; // get value of string of city search 
    let searchStateInput = "Arizona"; //get value of string for state search 

    let searchCity = searchCityInput.replace(" ", "_");
    let searchState = searchStateInput.replace(" ", "_");

    console.log(searchCity)
    console.log(searchState)
//================================================================================================
    let queryURL = `https://api.openbrewerydb.org/breweries?by_city${searchCity}&by_state=${searchState}`
    // to set number of results, add &per_page=10
    // strings must have spaces replaced with "_"
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then
        (function (response) {
            console.log(response);
        },
        function (error) {
            console.log(error);
        })

//====================================================================================================================================


});
