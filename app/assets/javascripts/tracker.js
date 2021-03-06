var directionsDisplay;
var directionsService;
var DIST_THRESH = 2000;
var pos = "berkeley, ca"; // Default in case geolocation doesn't work
var goal = "san francisco, ca";
var dist = 1000;
var markersArray = [];
var bounds;
var geocoder;
var map;
var user_id = '';
var target_id;
var destinationIcon = 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=O|FFFF00|000000';
var originIcon = 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=O|FFFF00|000000';
function initialize() {
  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsService = new google.maps.DirectionsService();
  bounds = new google.maps.LatLngBounds();
  //challenge/recipient_id    [id]
  //users/setLocation         [userid, location]
  //users/getLocation         [userid]
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
      /*var infowindow = new google.maps.InfoWindow({
        map: map,
        position: pos,
        content: 'You are here'
      });*/
      directionsDisplay.setMap(map);
      directionsDisplay.setPanel(document.getElementById('directions-panel'));
      //calcRoute();
      setInterval(calcAll(), 10000);
      map.setCenter(pos);
    }, function() {
      handleNoGeoLocation(true);
    });
  }
  else {
    handleNoGeoLocation(false);
  }

  //parsing the javascript cookie for the recipient id.
  console.log(document.cookie);
  if (document.cookie.match("user_id=") != null) {
    for (i = document.cookie.search(" user_id=") + 9; i < document.cookie.length; i ++){
      if(document.cookie.charAt(i) == ';'){
        break;
      }
      user_id += document.cookie.charAt(i);
      console.log(user_id);
    }
    setTimeout(function() {
      console.log("getting recipient");
      $.post( "challenge/recipient_id", {id: user_id}, function success(data) {
        console.log(data);
        target_id = data.id;
      });
    }, 20);
  }
  console.log("init")
  jQuery.getJSON( "challenge/getCurrentChallenge", {id: user_id}, function success(data){
    if (data.errCode == -112){
      $("body").append("<div id='heyyy' style='width: 200%; z-index: 99999;position:fixed;  margin: 0 auto; top: 50%; color:red;font-size:6vw;'>YOU DON'T HAVE A CHALLENGE</div>")
    }
  });
}

function calcAll() {
  jQuery.getJSON( "users/getLocation", {user_id: target_id}, function success(data){
    console.log('target is ' + data.location);
    goal = data.location;
    setTimeout(calcRoute(), 100);
  });
}

function calcRoute() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      console.log(position);
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
      /*var outputDiv = document.getElementById('output');
      outputDiv.innerHTML = '';*/
      deleteOverlays();
      for (var i = 0; i < origins.length; i++) {
        var results = response.rows[i].elements;
        for (var j = 0; j < results.length; j++) {
          /*outputDiv.innerHTML += origins[i] + ' to ' + destinations[j]
              + ': ' + results[j].distance.text + ' in '
              + results[j].duration.text + '<br>';*/
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
    document.getElementById('deliver').style.display = 'none';
  } else {
    document.getElementById('map-canvas').style.display = 'block';
    document.getElementById('directions-panel').style.width = '40%';
    document.getElementById('deliver').style.display = 'inline-block';
  }
}

function deliverGift() {
  console.log("Yay a gift was delivered");
  jQuery.getJSON( "challenge/complete", {user_id: user_id}, function success(data){
    console.log(data)
  });
  console.log("calling")
  window.location.href="../#/profile/" + user_id;
  console.log("Redirecting...");

}

google.maps.event.addDomListener(window, 'load', initialize);
