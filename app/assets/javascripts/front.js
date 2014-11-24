angular.module('generosity', ['ngRoute', 'ngCookies', 'templates', 'uiGmapgoogle-maps'])
	.config(['$routeProvider', '$locationProvider',
	  	function($routeProvider, $locationProvider) {
	    	$routeProvider.
	      		when('/', {
	      			templateUrl: "index.html"
	      		}).
	      		when('/profile/:id', {
	        		templateUrl: "profile.html",
	        		controller: 'UsersController as profiledUser'
	      		}).
	      		when('/gift/:id', {
	        		templateUrl: "gift.html",
	        		controller: 'GiftsController as profiledGift'
	      		}).
	      		when('/challenge', {
	      			templateUrl: "challenge.html"
	      		}).
	      		when('/map', {
	      			/*redirectTo: function() {
        				window.location = "/tracker";
    					}*/
              templateUrl: "tracker.html",
              controller: "TrackerController"
	      		}).	      		
	      		when('/shop', {
	      			templateUrl: "shop.html"
	      		}).
	      		when('/users-form', {
	        		templateUrl: "users-form.html",
	        		controller: 'UsersController as newUser'
	      		}).
	      		when('/login-form', {
	        		templateUrl: "login-form.html",
	        		controller: 'UsersController as loginUser'
	      		}).
	      		when('/gifts-form', {
	        		templateUrl: "gift-form.html",
	        		controller: 'GiftsController as newGift'
	      		}).
	      		when('/about', {
	      			templateUrl: "about.html"
	      		}).
	      		otherwise({
	        		redirectTo: '/'
	      		});
	  }])

  .config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
      key: AIzaSyDZJutoonZK2nW2NP65j6A-_JNvop8ndco,
      v: '3.17',
      libraries: 'weather, geometry, visualization'
    });
  })

  .controller('TrackerController', ['$scope', '$http', '$rootScope', '$routeParams', function($scope, $http, $rootScope, $routeParams, uiGmapGoogleMapApi) {
    uiGmapGoogleMapApi.then(function(maps) {
      var directionsDisplay;
      var directionsService = new google.maps.DirectionsService();
      var DIST_THRESH = 2835000;
      var pos = "berkeley, ca"; // Default in case geolocation doesn't work
      var goal = "san francisco, ca";
      var dist = 1000;
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
      }
      
      function changeTargetOne() {
        goal = "san francisco, ca";
      }
      
      function changeTargetTwo() {
        goal = "uc berkeley";
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
        console.log("dist is:" + dist + ", thresh is: " + DIST_THRESH);
        if (dist > DIST_THRESH) {
          document.getElementById('map-canvas').style.display = 'none';
          document.getElementById('directions-panel').style.width = '100%';
        } else {
          document.getElementById('map-canvas').style.display = 'block';
          document.getElementById('directions-panel').style.width = '40%';
        }
      }
      
      google.maps.event.addDomListener(window, 'load', initialize);
    });
  }])

	.controller('UsersController', ['$scope', '$http', '$rootScope', '$location', '$routeParams', '$cookieStore', function($scope, $http, $rootScope, $location, $routeParams, $cookieStore) {
		var self = this;

		$scope.id;			//Top secret! Don't use these variables without the dictator's permission!
		$scope.username;

		self.id;
		self.username;
		self.realName;
		self.password;
		self.availableHours; //How should this be styled?
		self.currentCity;
		self.currentLocation;
		self.recipient; //Should probably be renamed
		self.description;
		self.reputation;
		self.profileUrl;

		self.errCode = 0;

		self.getUserFromCookie = function() {
			var sessionCookie = $cookieStore.get('session');
			console.log("YOLO");
			if(!sessionCookie) {
				return;
			}
			// console.log(self.sessionCookie);
			$rootScope.id = sessionCookie["id"];
			$rootScope.username = sessionCookie["username"];
		}

		self.getUserFromUrlParams = function() {
			self.id = $routeParams.id;
			// console.log(self.id);
			self.getUserById(self.id);
		}

		self.getUserById = function(targetId) {
			// console.log(targetId);
			if(targetId == -13) { //Use a user spoof
				self.createDummyUser();
				return;
			}
			$http.post('users/search', {id: targetId}).
				success(function(data, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
					// self.errCode = data.errCode;
					var usersList = data["users"];
					console.log(usersList);
					if(usersList.length != 1) {
						// alert("Error: User not found.");
						console.log("Error: User not found.");
						$location.path('/');
						return;
					}
					var foundUser = usersList[0];
					console.log(foundUser["username"]);
					self.username = foundUser["username"];
					self.realName = foundUser["real_name"];
					self.availableHours = foundUser["available_hours"];
					self.currentCity = foundUser["current_city"];
					self.currentLocation = foundUser["current_location"];
					self.reputation = foundUser["score"];
					// self.description = foundUser["description"];
					self.profileUrl = foundUser["profile_url"];
				}).
				error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					self.errCode = -99;
					// alert("Error.");
					console.log("Error.");
				}).
				then(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					// alert("Done.");
					console.log("Done.");
					return;
				});
		}

		self.makeCookie = function(uId, uName) {
			var myCookie = {};
			myCookie["id"] = self.id;
			myCookie["username"] = self.username;
			$cookieStore.put('session', myCookie);
		}

		self.loadUserData = function(targetUsername, purpose) {
			// console.log(targetUsername);
			$http.post('users/search', {username: targetUsername}).
				success(function(data, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
					// self.errCode = data.errCode;
					var usersList = data["users"];
					console.log(usersList);
					if(usersList.length != 1) {
						// alert("Error: User not found.");
						console.log("Error: User not found.");
						$location.path('/');
						return;
					}
					var foundUser = usersList[0];
					self.id = foundUser["id"];
					self.username = foundUser["username"]; //Technically redundant
					self.makeCookie(self.id, self.name);
					console.log(self.id);

					sessionCookie = $cookieStore.get('session');
					// $rootScope.getUserFromCookie();
					$rootScope.id = sessionCookie["id"];
					$rootScope.username = sessionCookie["username"];
					console.log(sessionCookie);
					if(purpose === 'login') {
						rUrl = '/profile/' + $rootScope.id;
						console.log(rUrl);
						console.log($rootScope.id);
						$location.path(rUrl);
					}
				}).
				error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					self.errCode = -99;
					// alert("Error.");
					console.log("Error.");
				}).
				then(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					// alert("Done.");
					console.log("Done.");
					return;
				});
		}

		self.addUser = function() {
			// alert("YO DAWG"); //Only called once even when things go awry
			$scope.message = "";
			$http.post('users/add', {username: self.username, password: self.password, real_name: self.realName, 
				available_hours: self.availableHours, current_city: self.currentCity, current_location: self.currentLocation, 
				profile_url: self.profileUrl}).
				success(function(data, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
					self.errCode = data.errCode;
					if(self.errCode == -2) {
						// alert("Error: This username already exists.");
						console.log("Error: This username already exists.");
						$scope.message = "Error: This username already exists.";
					}
					else if(self.errCode == -3) {
						// alert("Error: The username is empty, too long, or has invalid characters.");
						console.log("Error: The username is empty, too long, or has invalid characters.");
						$scope.message = "Error: The username is empty, too long, or has invalid characters.";
					}
					else if(self.errCode == -4) {
						// alert("Error: The password is empty, too long, or has invalid characters.");
						console.log("Error: The password is empty, too long/too short, or has invalid characters.");
						$scope.message = "Error: The password is empty, too long, or has invalid characters.";
					}
					else if(self.errCode == -6) {
						// alert("Error: The real name is empty, too long, or has invalid characters.");
						console.log("Error: The real name is empty, too long, or has invalid characters.");
						$scope.message = "As real names are no longer required, this branch should never execute.";
					}
					else {
						// alert("User created.");
						console.log("User created.");	
						self.loadUserData(self.username, 'login');
					}
					console.log(self.errCode);
				}).
				error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					self.errCode = -99;
					$scope.message = "The server appears to be having issues. Please try again later.";
					// alert("Error.");
					console.log("Error.");
				}).
				then(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					// alert("Done.");
					console.log("Done.");
					return;
				});
		}

		self.createDummyUser = function() {
			self.username = "LordChristopher";
			self.realName = "Lord Christopher";
			self.password = "Team 61C";
			self.availableHours = "6 to 11 pm";
			self.currentCity = "Berkeley";
			self.currentLocation = "Nowhere";
			self.recipient = "He whose name shall not be spoken";
			self.reputation = 13;
			self.description = "Paul is the biggest troll.";
			self.profileUrl = "http://static.tumblr.com/isuwdsr/EBVlzsy8r/chris_redfield_avatar_by_ryann1220-d36hj2c.jpg";
		};

		self.makeIter = function(l) {
			var f = [];
			var i;
			for(i = 0; i < l; i++) {
				f[i] = i;
			}
			self.iter = f;
		};

		self.makeIter(5);

		self.login = function(name, pw) {
			$scope.message = "";
			$http.post('login', {username: name, password: pw}).
				success(function(data, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
					// self.errCode = data.errCode;
					self.errCode = data.errCode;
					if(self.errCode == -1) {
						// alert("Login failed.");
						console.log("Login failed.");
						$scope.message = "The username and password do not match.";
					}
					else {
						// alert("Login succeeded.");
						console.log("Login succeeded.");
						self.password = "";
						self.loadUserData(self.username, 'login');
					}
				}).
				error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					self.errCode = -99;
					$scope.message = "The server appears to be having issues. Please try again later.";
					console.log("Error.");
				}).
				then(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					// alert("Done.");
					console.log("Done.");
					return;
				});
		};

		self.logout = function() {
			$cookieStore.remove('session');
			$rootScope.id = 0;
			$rootScope.username = 0;
			console.log("Logged out.");
		};

		self.deleteAll = function() {

		};
	}])

	.controller('GiftsController', ['$scope', '$http', '$rootScope', '$routeParams', function($scope, $http, $rootScope, $routeParams) {
		var self = this;

		self.name;
		self.giver;
		self.recipient;
		self.description;
		self.rating;
		self.imageUrl;

		self.addGift = function() {
			var errCode;
			$scope.message = "";
			$http.post('gifts/create', {name: self.name, url: self.url}).
				success(function(data, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
					var errCode = data.errCode;
					/*We need actual error codes for this.*/
					if(errCode == -1) {
						$scope.message = "Error: Invalid gift.";
					}
					else {
						console.log("Gift created.");						
					}
					console.log(errCode);
					// $rootScope.errCode = data.errCode;
				}).
				error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					$scope.message = "Error: There appears to be an issue with the server. Please try again later.";
				});
		};

		self.getGiftFromUrlParams = function() {
			self.id = $routeParams.id;
			// console.log(self.id);
			self.getGiftById(self.id);
		}

		self.getGiftById = function(targetId) {
			// console.log(targetId);
			if(targetId == 0) { //Use a user spoof
				self.createDummyGift();
				return;
			}
			// $http.post('users/search', {id: targetId}).
			// 	success(function(data, status, headers, config) {
			// 	// this callback will be called asynchronously
			// 	// when the response is available
			// 		// self.errCode = data.errCode;
			// 		var usersList = data["users"];
			// 		console.log(usersList);
			// 		if(usersList.length != 1) {
			// 			// alert("Error: User not found.");
			// 			console.log("Error: User not found.");
			// 			$location.path('/');
			// 			return;
			// 		}
			// 		var foundUser = usersList[0];
			// 		console.log(foundUser["username"]);
			// 		self.username = foundUser["username"];
			// 		self.realName = foundUser["real_name"];
			// 		self.availableHours = foundUser["available_hours"];
			// 		self.currentCity = foundUser["current_city"];
			// 		self.currentLocation = foundUser["current_location"];
			// 		self.reputation = foundUser["score"];
			// 		// self.description = foundUser["description"];
			// 		self.profileUrl = foundUser["profile_url"];
			// 	}).
			// 	error(function(data, status, headers, config) {
			// 	// called asynchronously if an error occurs
			// 	// or server returns response with an error status.
			// 		self.errCode = -99;
			// 		// alert("Error.");
			// 		console.log("Error.");
			// 	}).
			// 	then(function(data, status, headers, config) {
			// 	// called asynchronously if an error occurs
			// 	// or server returns response with an error status.
			// 		// alert("Done.");
			// 		console.log("Done.");
			// 		return;
			// 	});
		}

		self.createDummyGift = function() {
			self.name = "Shin Megami Tensei x Fire Emblem";
			self.giver = "Atlus and Intelligent Systems";
			self.recipient = "LordChristopher";
			self.description = "Such hype. Must play. Wow.";
			self.rating = 5.0;
			self.imageUrl="http://i1290.photobucket.com/albums/b531/orangepikmin333/shittypaintjob_zpscbf470a8.jpg";
		};
	}])
	
	.directive('navbar', function() {
		return {
			restrict: 'E',
			templateUrl: "navbar.html"
		};
	})

	.directive('footbar', function() {
		return {
			restrict: 'E',
			templateUrl: "footbar.html"
		};
	})

	.directive('usersTests', function() {
		return {
			restrict: 'E',
			scope: {

			},
			templateUrl: "users-tests.html"
		};
	})

	.directive('giftsTests', function() {
		return {
			restrict: 'E',
			scope: {

			},
			templateUrl: "gifts-tests.html"
		};
	})
	
	.directive('testStatus', function() {
		return {
			restrict: 'C',
			scope: {
			  message: '@'
			},
			link: function(scope, element, attrs) { 
				if(scope.message.search("PASS") > 0) {
					element.css("color", "green");
				}
				else if(scope.message.search("FAIL") > 0) {
					element.css("color", "red");
				}
				else {
					element.css("color", "blue");
				}
			}
		};
	})

	/*function loadScript() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp';
    document.body.appendChild(script);
  }

  window.onload = loadScript;*/
