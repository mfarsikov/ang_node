controllers.ViewSectionController = function ($scope, $http, $routeParams, $log) {
    $scope.section = $routeParams.name;
    var params = {params: {section: $scope.section}};
    $log.log("view controller.get(" + params + ")");
    $http.get("/notes", params)
        .success(function (res) {
            $scope.notes = res;
        })
        .error(function (err) {
            $log.log("viewcontroller error " + err);
        })
};
