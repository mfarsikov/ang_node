"use strict";
angular
    .module("myApp", [])
    .controller("divController", function ($scope, $http, $interval, $log) {

        $scope.timer = 0;

        $scope.requestMessage = function () {
            $http
                .get("/greeting", {params: {name: $scope.name}})
                .then($scope.setMessage);
        };

        $scope.setMessage = function (res) {
            $scope.message = res.data;
        };

        $scope.updateTimerFromResponse = function (res) {
            $scope.timer = res.data;
        };

        $scope.logError = function (res) {
            $log.log(res);
        };

        $scope.pingTimer = function () {
            $http.get('/timer')
                .then($scope.updateTimerFromResponse, $scope.logError);
        };

        $interval(function () {
            $scope.pingTimer();
        }, 1000);
    });

angular.module("notesApp", [])
    .controller("notesController", function ($scope, $http, $log) {
        $scope.notes = [];

        var update = function () {
            console.log("update");
            $http.get("/notes")
                .then(function (res) {
                    $scope.notes = res.data;
                    $log.log($scope.notes)

                    $scope.notes = $scope.notes
                        .sort(function (note1, note2) {
                            return (note1.order || 0) - (note2.order || 0);
                        });
                });
        };
        update();
        $scope.add = function () {
            var note = {text: $scope.text};
            $http.post("/notes", note)
                .success(function (res) {
                    $scope.text = '';
                    update();
                    $log.log("post successed");
                });
        };

        $scope.remove = function (id) {
            console.log("remove " + id);
            $http.delete("/notes", {params: {id: id}})
                .success(function (res) {
                    console.log("done " + res);
                    update();
                })
                .error(function (res) {
                    console.log("error " + res);
                });
        };
        $scope.up = function (id) {
            $log.log("up: " + id);
            $http.put('/notes', {id: id})
                .success(function (res) {
                    $log.log("changed");
                    update();
                })
                .error(function (res) {
                    $log.log("error " + res);
                });
        };

        $scope.removeAll = function () {

        };
        //  $scope.update();
    });

angular
    .module("sectionsApp",[])
    .controller("sectionController", function ($scope, $http, $log) {
        $scope.notes = [];
        var readSections = function () {
            $http.get("/sections")
                .success(function (res) {
                    $scope.sections = res;
                    if (!$scope.activeSection) {
                        $scope.activeSection = $scope.sections[0].text;
                    }
                    update();
                })
                .error(function (err) {
                    $log.log("get sections error: " + err);
                })
        };
        readSections();
        $scope.showSection = function (section) {
            $scope.activeSection = section.text;
            update();
        };
        var update = function () {
            var params = {params: {section: $scope.activeSection}};
            $http.get("/notes", params)
                .success(function (res) {
                    $log.log("loaded " + res.length + " notes");
                    $scope.notes = res;
                })
                .error(function (err) {
                    $log.log("error on get notes: " + err);
                })
        };
        $scope.addSection = function () {
            if ($scope.newSection) {
                $http.post("/sections", {text: $scope.newSection})
                    .success(function (res) {
                        $log.log("section created");
                        readSections();
                    })
                    .error(function (err) {
                        $log.log("error during session creation" + err);
                    });

                $scope.newSection = null;
            }
        };

        $scope.addNote = function () {
            $http.post("/notes", {section: $scope.activeSection, text: $scope.text})
                .success(function (res) {
                    $log.log("note added");
                    update();
                })
                .error(function (err) {
                    $log.logError("error during note add " + err);
                });

        };
});