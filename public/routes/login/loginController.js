controllers.LoginController = function ($scope, UserService) {
    $scope.loggedIn = UserService.loggedIn;
    $scope.login = function () {
        UserService.login($scope.userName, $scope.password)
            .then(function () {
                $scope.loggedId = true;
            });
    };
};