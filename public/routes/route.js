/**
 * Created by luxuser on 9/24/2015.
 */
var module = angular.module("sectionsApp",['ngRoute']);
module.config(['$routeProvider',
function($routeProvider){
  //  $log.log("redirecting");
    $routeProvider
        .when('/', {
            templateUrl:'routes/notes/notes.html',
            controller:'SectionController'
        })
        .otherwise({redirectTo:'/'});
}]);
