function initialize(){directionsDisplay=new google.maps.DirectionsRenderer;var e={zoom:13};map=new google.maps.Map(document.getElementById("map-canvas"),e),geocoder=new google.maps.Geocoder,navigator.geolocation?navigator.geolocation.getCurrentPosition(function(e){pos=new google.maps.LatLng(e.coords.latitude,e.coords.longitude);new google.maps.InfoWindow({map:map,position:pos,content:"You are here"});map.setCenter(pos)},function(){handleNoGeoLocation(!0)}):handleNoGeoLocation(!1),directionsDisplay.setMap(map),calcRoute(),calcDistance()}function changeTargetOne(){tempEnd="san francisco, ca"}function changeTargetTwo(){tempEnd="richmond, ca"}function calcRoute(){var e=pos,o=tempEnd,a={origin:e,destination:o,travelMode:google.maps.TravelMode.WALKING,avoidHighways:!0,avoidTolls:!1};directionsService.route(a,function(e,o){o==google.maps.DirectionsStatus.OK&&directionsDisplay.setDirections(e)})}function calcDistance(){var e=new google.maps.DistanceMatrixService;e.getDistanceMatrix({origins:[pos],destinations:[tempEnd],travelMode:google.maps.TravelMode.WALKING,unitSystem:google.maps.UnitSystem.METRIC,avoidHighways:!0,avoidTolls:!1},callback)}function callback(e,o){if(o!=google.maps.DistanceMatrixStatus.OK)alert("Error was: "+o);else{var a=e.originAddresses,n=e.destinationAddresses,t=document.getElementById("output");t.innerHTML="",deleteOverlays();for(var i=0;i<a.length;i++)for(var r=e.rows[i].elements,s=0;s<r.length;s++)t.innerHTML+=a[i]+" to "+n[s]+": "+r[s].distance.text+" in "+r[s].duration.text+"<br>"}}function addMarker(e,o){var a;a=o?destinationIcon:originIcon,geocoder.geocode({address:e},function(e,o){if(o==google.maps.GeocoderStatus.OK){bounds.extend(e[0].geometry.location),map.fitBounds(bounds);var n=new google.maps.Marker({map:map,position:e[0].geometry.location,icon:a});markersArray.push(n)}else alert("Geocode was not successful for the following reason: "+o)})}function deleteOverlays(){for(var e=0;e<markersArray.length;e++)markersArray[e].setMap(null);markersArray=[]}var directionsDisplay,directionsService=new google.maps.DirectionsService,pos="berkeley, ca",tempEnd="san francisco, ca",markersArray=[],bounds=new google.maps.LatLngBounds,geocoder,map,destinationIcon="https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=O|FFFF00|000000",originIcon="https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=O|FFFF00|000000";google.maps.event.addDomListener(window,"load",initialize);