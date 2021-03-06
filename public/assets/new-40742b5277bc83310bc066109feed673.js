var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var pos = "berkeley, ca";
var tempEnd = "san francisco, ca";
var markersArray = [];
var bounds = new google.maps.LatLngBounds();
var geocoder;
var map;

var destinationIcon = 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=O|FFFF00|000000';
var originIcon = 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=O|FFFF00|000000';

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
    map.setCenter(pos);
    }, function() {
    handleNoGeoLocation(true);
    });
  }
  else {
    handleNoGeoLocation(false);
  }
  directionsDisplay.setMap(map);
  // Uncomment the line below to use step-by-step directions
  //directionsDisplay.setPanel(document.getElementById());
  calcRoute();
  calcDistance();
}

function changeTargetOne() {
  tempEnd = "san francisco, ca";
}

function changeTargetTwo() {
  tempEnd = "richmond, ca";
}

function calcRoute() {
  var start = pos;
  var end = tempEnd;
  var request = {
    origin: start,
    destination: end,
    travelMode: google.maps.TravelMode.WALKING,
    avoidHighways: true,
    avoidTolls: false
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
  });
}

function calcDistance() {
  var service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
      {
        origins: [pos],
        destinations: [tempEnd],
        travelMode: google.maps.TravelMode.WALKING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: true,
        avoidTolls: false
      }, callback);
}

function callback(response, status) {
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
      //addMarker(origins[i], false);
      for (var j = 0; j < results.length; j++) {
        //addMarker(destinations[j], true);
        outputDiv.innerHTML += origins[i] + ' to ' + destinations[j]
            + ': ' + results[j].distance.text + ' in '
            + results[j].duration.text + '<br>';
      }
    }
  }
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
      var marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location,
        icon: icon
      });
      markersArray.push(marker);
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

google.maps.event.addDomListener(window, 'load', initialize);
