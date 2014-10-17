angular.module('generosity', [])
	.controller('UsersController', ['$scope', function($scope) {
		var self = this;

		self.username;
		self.realName;
		self.password;
		// self.availableHours; //How should this be styled?
		self.currentCity;
		self.currentLocation;
		// self.recipient; //Should probably be renamed

		self.createDummyUser = function() {
			self.username = "AlanChristopher";
			self.realName = "Alan Christopher";
			self.password = "Team 61C";
			self.availableHours = "6 to 11 pm";
			self.currentCity = "Berkeley";
			self.currentLocation = "Nowhere";
			self.recipient = "He whose name shall not be spoken";
		};

		// self.login = function(name, pw) {

		// };

		// self.logout = function() {

		// };
	}])
	
	// .directive('directiveE', function() {
	// 	return {
	// 		restrict: 'E',
	// 		scope: {
	// 			name: '@',
	// 			hobby: '@'
	// 		},
	// 		templateUrl: "example-module.html"
	// 	};
	// })
	
	// .directive('directiveA', function() {
	// 	return {
	// 		restrict: 'A',
	// 		scope: {
	// 			name: '@',
	// 			hobby: '@'
	// 		},
	// 		templateUrl: "example-module.html"
	// 	};
	// }) //Only put a semi-colon on the last directory of the module
	
	.directive('css1', function() {
		return {
			restrict: 'C',
			link: function(scope, element, attrs) {
      			element.css("width", 400),
      			element.css("font-style", "oblique");
      			element.css("color", "green");
      			element.css("font-size", "30px");
			}
		};
	});