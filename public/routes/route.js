/**
 * Created by luxuser on 9/24/2015.
 */
'use strict';

var module = angular.module("sectionsApp", ['ngRoute','dndLists']);
var controllers = {};
module.config(['$routeProvider',
    function ($routeProvider) {
        console.log("redirecting");
        $routeProvider
            .when('/section/:name', {
                templateUrl:'routes/viewSection/viewSection.html',
                controller:'ViewSectionController'
            })
            .when("/register", {
                templateUrl: 'routes/userForm/userForm.html',
                controller: "UserFormController"
            })
            .when('/:section?', {
                templateUrl: 'routes/notes/notes.html',
                controller: 'NotesController'
            })
            .otherwise({redirectTo: '/'});
    }]);
module.controller(controllers);