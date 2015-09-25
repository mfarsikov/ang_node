"use strict";

controllers.NotesController = function ($scope, $http, $log, $routeParams, $location) {
    $scope.notes = [];
    $scope.activeSection = $routeParams.section;
    function readSections() {
        $http.get("/sections")
            .success(function (res) {
                if (res) {
                    $scope.sections = res;
                } else {
                    $scope.sections = [];
                }

                if (!$scope.activeSection && $scope.sections[0]) {
                    $scope.activeSection = $scope.sections[0].text;
                }
                update();
            })
            .error(function (err) {
                $log.log("get sections error: " + err);
            })
    }
    if (!$scope.sections) {
        readSections();
    }


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

    $scope.showSection = function (section) {
        $scope.activeSection = section.text;
        $location.path(section.text);
        update();
    };

    function update() {
        var params = {params: {section: $scope.activeSection}};
        $http.get("/notes", params)
            .success(function (res) {
                $log.log("loaded " + res.length + " notes");
                $scope.notes = res;
            })
            .error(function (err) {
                $log.log("error on get notes: " + err);
            })
    }

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
};