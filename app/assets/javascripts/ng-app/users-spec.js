angular.module('generosity').controller('UserTestController', ['$scope', '$http', '$controller', function($scope, $http, $controller) {
		var self = this;
		// var expect = chai.expect;
		// var expect = require('expect.js');

		self.totalTests = 0;
		self.passedTests = 0;
		self.sectionTests = 0;
		self.messages = [];

		self.assert = function(condition, statement) {
			testMessage = "Test #" + (self.totalTests+1);
			if(condition) {
				self.passedTests += 1;
				testMessage = testMessage + " PASSED: " + statement;
			}
			else {
				testMessage = testMessage + " FAILED: " + statement;
				console.log(testMessage);
			}
			self.totalTests += 1;
			self.sectionTests += 1;
			self.messages.push(testMessage);
		}

		self.runTests = function() {
			self.testAttributes();
			// self.testAPICalls();
		}

		/*testAttributes() tests the UsersController's variables and variable-related methods.*/
		self.testAttributes = function() {
			var $scope = {};
			self.sectionTests = 0;
			self.messages.push("Running UsersController attribute tests...");
			var userTestController = $controller('UsersController', { $scope: $scope });
			userTestController.username = "CountNecula";
			self.assert(userTestController.username === "CountNecula", "Username is " + userTestController.username + ", and should be equal to 'CountNecula'.");
			userTestController.createDummyUser();
			self.assert(userTestController.username === "LordChristopher", "Username is " + userTestController.username + ", and should be equal to 'LordChristopher'.");
			self.assert(userTestController.realName === "Lord Christopher", "Real name is " + userTestController.realName + ", and should be equal to 'Lord Christopher'.");
			self.assert(userTestController.password === "Team 61C", "Password is " + userTestController.password + ", and should be equal to 'Team 61C'.");
			self.assert(userTestController.availableHours === "6 to 11 pm", "Available hours are " + userTestController.availableHours + ", and should be equal to '6 to 11 pm'.");
			self.assert(userTestController.currentCity === "Berkeley", "Current location is " + userTestController.currentCity + ", and should be equal to 'Berkeley'.");
			self.assert(userTestController.currentLocation === "Nowhere", "Current location is " + userTestController.currentLocation + ", and should be not equal to 'Nowhere'.");
			self.assert(userTestController.recipient === "He whose name shall not be spoken", "Recipient is " + userTestController.recipient + ", and should be equal to 'He whose name shall not be spoken'.");
		}

		self.testAPICalls = function() {
			var $scope = {};
			self.sectionTests = 0;
			self.messages.push("Running UsersController API call tests...");
			var userTestController = $controller('UsersController', { $scope: $scope });
			userTestController.createDummyUser();
			var errCode = userTestController.addUser();
			// console.log("yolo");
			// console.log(errCode);
			/*Add code to delete this user beforehand.*/
			errCode = $scope.err;
			self.assert(errCode === 1, "Error code is " + errCode + ", but it should have been 1 (successful creation).");
			errCode = userTestController.addUser();
			self.assert(errCode === -2, "Error code is " + errCode + ", but it should have been -2 (username already exists). Username is " + userTestController.username + ", but it should have been LordChristopher.");
			userTestController.username = "";
			errCode = userTestController.addUser();
			self.assert(errCode === -3, "Error code is " + errCode + ", but it should have been -3 (bad username). Username is " + userTestController.username + ", but it should have been blank.");
			userTestController.username = "Anaconda";
			userTestController.password = null;
			errCode = userTestController.addUser();
			self.assert(errCode === -4, "Error code is " + errCode + ", but it should have been -4 (bad password). Password is " + userTestController.password + ", but it should have been blank.");
		}
	}]);