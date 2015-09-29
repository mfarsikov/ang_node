controllers.LoginController = function ($scope, UserService, $location, $http) {
    $scope.loggedIn = UserService.loggedIn;

    $scope.login = function () {
        UserService.login($scope.userName, $scope.password)
            .then(function () {
                $scope.loggedId = true;
                $location.path("/out");
            });
    };
    $scope.logout = function () {
        $http.post("/logout");
        $scope.loggedId = false;
        $scope.userName = "";
        $scope.password = "";
        $location.path("/");
    };

    $scope.login();
};