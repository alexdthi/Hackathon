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
        map.setView({center: loc, zoom: 13});
        coords=String(position.coords.latitude)+", "+String(position.coords.longitude);
        var url="https://dev.virtualearth.net/REST/v1/Locations/"+coords+"?includeEntityTypes=&o=json&key=Am8ryQPYHCOfmbeh9Uk6tulI8N1xFN-Ab9DRLdmRbDtaJ8SFj1U00pU5LW9xzzac";
        var name;
        fetch(url)
        .then(res => res.json())
        .then((out) => {
            for(const tempList of out["resourceSets"][0]["resources"]){
                if((typeof name)=="undefined"){
                    if("confidence" in tempList){
                        if(tempList["confidence"]!="Low"){
                            if("name" in tempList){
                                name=tempList["name"];
                            }
                        }
                    }
                }
            }
            if((typeof name)=="undefined"){
                document.getElementById("searchBox").value=coords;
            }
            else{
                document.getElementById("searchBox").value=name;
            }
        })
        .catch(err => { 
            par.innerHTML="Please enter in a valid address";
            throw err 
        });
    });
}

function findRoute() {
    var par = document.getElementById("routeResult");
    var distance = document.getElementById("distance").value;
    var loc = document.getElementById("searchBox").value;
    if(document.getElementById("unit").value==="mi"){
        distance=distance*1.60934;
    }
    var url="https://dev.virtualearth.net/REST/v1/Locations/"+loc+"?includeEntityTypes=&o=json&key=Am8ryQPYHCOfmbeh9Uk6tulI8N1xFN-Ab9DRLdmRbDtaJ8SFj1U00pU5LW9xzzac";
    var lat, long, coords;
    fetch(url)
    .then(res => res.json())
    .then((out) => {
        for(const tempList of out["resourceSets"][0]["resources"]){
            if((typeof lat)=="undefined"){
                if("confidence" in tempList){
                    if(tempList["confidence"]!="Low"){
                        if("point" in tempList){
                            if("coordinates" in tempList["point"]){
                                lat=tempList["point"]["coordinates"][0];
                                long=tempList["point"]["coordinates"][1];
                            }
                        }
                    }
                }
            }
        }
        coords=lat+", "+long;
        if((typeof lat)=="undefined"){
            par.innerHTML="Please enter in a valid address"
        }
        else{
            par.innerHTML=coords;
        }
    })
    .catch(err => { 
        par.innerHTML="Please enter in a valid address";
        throw err 
    });
}