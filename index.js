var map, recentPin, infobox;

function GetMap() {
    //generate map
    map = new Microsoft.Maps.Map(document.getElementById('map'), {showLocateMeButton: false, zoom: 13});
    //generating the auto-suggest box
    Microsoft.Maps.loadModule('Microsoft.Maps.AutoSuggest', function () {
        var manager = new Microsoft.Maps.AutosuggestManager({ map: map });
        manager.attachAutosuggest(document.getElementById('searchBox'), document.getElementById('searchBoxContainer'), selectedSuggestion);
    });
}

function selectedSuggestion(result) {
    //remove previously selected suggestion from the map
    if(typeof recentPin !== 'undefined'){
        map.entities.remove(recentPin);
    }
    infobox = new Microsoft.Maps.Infobox(map.getCenter(), {visible: false});
    infobox.setMap(map);
    var pin = new Microsoft.Maps.Pushpin(result.location);
    //set new pin as the recent suggestion to remove if a new suggestion is inputted
    recentPin=pin;
    //show pin and center map over it
    map.entities.push(pin);
    map.setView({center: result.location, zoom: 13});
}

function getUserLocation() {
    //get location of user
    navigator.geolocation.getCurrentPosition(function (position) {
        if(typeof recentPin !== 'undefined'){
            map.entities.remove(recentPin);
        }
        infobox = new Microsoft.Maps.Infobox(map.getCenter(), {visible: false});
        infobox.setMap(map);
        //grab location from the position of user
        var loc = new Microsoft.Maps.Location(position.coords.latitude, position.coords.longitude);
        var pin = new Microsoft.Maps.Pushpin(loc);
        recentPin=pin;
        map.entities.push(pin);
        map.setView({center: loc, zoom: 13})
    });
}