(function () {

  'use strict';

  require('angular');
  require('angular-route');
  require('angular-animate');

  var mainCtrl = require('./controllers/main_ctrl');
  
  angular.module('app', ['ngRoute', 'ngAnimate'])
  .config([
    '$locationProvider',
    '$routeProvider',
    function($locationProvider, $routeProvider) {
      //$locationProvider.hashPrefix('!');
      // routes
      $routeProvider
        .when("/", {
          templateUrl: "./partials/partial1.html",
          controller: "MainController"
        })
        .otherwise({
           redirectTo: '/'
        });
    }
  ]);

  //Load controller(s)
  angular.module('app')
  .controller('MainController', ['$scope', mainCtrl]);

}());