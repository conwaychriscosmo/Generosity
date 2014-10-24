angular.module('UserTestModule', ['ngRoute', 'templates', 'generosity'])
	.controller('UserTestController', ['$scope', '$http', function($scope, $http) {
		var self = this;

		self.totalTests = 0;
		self.passedTests = 0;

	}]);