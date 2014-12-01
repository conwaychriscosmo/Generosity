var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var DIST_THRESH = 2000;
var pos = "berkeley, ca"; // Default in case geolocation doesn't work
var goal = "san francisco, ca";
var dist = 1000;
var markersArray = [];
var bounds = new google.maps.LatLngBounds();
var geocoder;
var map;
var destinationIcon = 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=O|FFFF00|000000';
var originIcon = 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=O|FFFF00|000000';
var recipientId;
function initialize() {
  directionsDisplay = new google.maps.DirectionsRenderer();
  var mapOptions = {
    zoom: 13
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
  geocoder = new google.maps.Geocoder();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      pos = new google.maps.LatLng(position.coords.latitude,
                                   position.coords.longitude);
      var infowindow = new google.maps.InfoWindow({
        map: map,
        position: pos,
        content: 'You are here'
      });
      directionsDisplay.setMap(map);
      directionsDisplay.setPanel(document.getElementById('directions-panel'));
      calcRoute();
      map.setCenter(pos);
    }, function() {
      handleNoGeoLocation(true);
    });
  }
  else {
    handleNoGeoLocation(false);
  }

  //parsing the javascript cookie for the recipient id.
  if (document.cookie.match("user_id=") != null) {
    var holder = ""
    for (i = document.cookie.search("user_id=") + 8; i < document.cookie.length; i ++){
      if(document.cookie.charAt(i) == ';'){
        break;
      }
      holder += document.cookie.charAt(i);
    }
    recipientId = holder
    console.log(recipientId)
  }
}

function changeTargetOne() {
  jQuery.getJSON( "users/getLocation", {user_id: recipientId}, function success(data){
    goal = data.location
  })
}

function changeTargetTwo() {
  goal = "37.9651675 -122.0805453";
}

function calcAll() {
  calcRoute();
  calcDistance();
  checkDist();
}

function calcRoute() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      pos = new google.maps.LatLng(position.coords.latitude,
                                   position.coords.longitude);
    }, function() {
      handleNoGeoLocation(true);
    });
  }
  var request = {
    origin: pos,
    destination: goal,
    travelMode: google.maps.TravelMode.WALKING,
    avoidHighways: true,
    avoidTolls: false
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
    calcDistance();
  });
}

function calcDistance() {
  var service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix({
    origins: [pos],
    destinations: [goal],
    travelMode: google.maps.TravelMode.WALKING,
    unitSystem: google.maps.UnitSystem.METRIC,
    avoidHighways: true,
    avoidTolls: false
  }, function(response, status) {
    if (status != google.maps.DistanceMatrixStatus.OK) {
      alert('Error was: ' + status);
    } else {
      var origins = response.originAddresses;
      var destinations = response.destinationAddresses;
      var outputDiv = document.getElementById('output');
      outputDiv.innerHTML = '';
      deleteOverlays();
      for (var i = 0; i < origins.length; i++) {
        var results = response.rows[i].elements;
        for (var j = 0; j < results.length; j++) {
          outputDiv.innerHTML += origins[i] + ' to ' + destinations[j]
              + ': ' + results[j].distance.text + ' in '
              + results[j].duration.text + '<br>';
          dist = results[j].distance.value;
          console.log(results[j]);
          checkDist();
        }
      }
    }
  });
}

function addMarker(location, isDestination) {
  var icon;
  if (isDestination) {
    icon = destinationIcon;
  } else {
    icon = originIcon;
  }
  geocoder.geocode({'address': location}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      bounds.extend(results[0].geometry.location);
      map.fitBounds(bounds);
      /*var marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location,
        icon: icon
      });
      markersArray.push(marker);*/
    } else {
      alert('Geocode was not successful for the following reason: '
        + status);
    }
  });
}

function deleteOverlays() {
  for (var i = 0; i < markersArray.length; i++) {
    markersArray[i].setMap(null);
  }
  markersArray = [];
}

function checkDist() {
  console.log(dist);
  if (dist > DIST_THRESH) {
    document.getElementById('map-canvas').style.display = 'none';
    document.getElementById('directions-panel').style.width = '100%';
  } else {
    document.getElementById('map-canvas').style.display = 'block';
    document.getElementById('directions-panel').style.width = '40%';
  }
}

google.maps.event.addDomListener(window, 'load', initialize);
