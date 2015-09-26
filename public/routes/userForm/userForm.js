controllers.UserFormController = function ($scope, $location, $http) {
    $scope.user = {};
    $scope.createUser = function () {
        $http.post("/user", $scope.user)
            .success(function (res) {
                console.log("user saved");
                $location.path('/');
            });

    }

};
module.directive("matchTo", function () {
    return {
        require: "ngModel",
        scope: {
            otherValue: "=matchTo"
        },
        link: function (scope, element, attributes, ngModel) {
            ngModel.$validators.matchTo = function (value) {
                return toStr(value) == toStr(scope.otherValue);
            };
            scope.$watch("otherValue", function () {
                ngModel.$validate();
            });
        }
    }
});

function toStr(value) {
    return (value == undefined || value == null) ? '' : value;
}

module.directive('uniqueUser', function ($http, $timeout) {
    var timer;
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attributes, ctrl) {
            scope.$watch(attributes.ngModel, function (value) {
                console.log("name chanaged");
                if (timer) $timeout.cancel(timer);
                timer = $timeout(function () {
                    console.log("send user check");
                    $http.get("/isUserUnique", {params: {name: value}})
                        .success(function (res) {
                            console.log("user name unique: " + JSON.stringify(res));
                            ctrl.$setValidity('unique', res);
                        });
                }, 500);
            })
        }
    }
});

module.directive("allowedAge", function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            allowedAge: "="
        },
        link: function (scope, element, attributes, model) {
            console.log("allowed age: " + scope.allowedAge);
            console.log("watched: " + JSON.stringify(attributes.ngModel) + " " );

            scope.$watch("$parent." + attributes.ngModel, function (value) {
                console.log("adult check");
                if (value) {
                    console.log(JSON.stringify(value));
                    var millis = new Date().getTime() - value.getTime();

                    var age = new Date(millis).getFullYear() - 1970;
                    var adult = age > scope.allowedAge;
                    console.log("adult: " + adult +", age " +age);
                    model.$setValidity('adult', adult);
                }
            });
        }
    }
});
