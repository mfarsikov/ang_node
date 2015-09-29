module.factory("UserService", function ($http, $q) {
    var service = {};
    service.userName = "";
    service.loggedIn = false;

    service.login = function (login, password) {
        return $q(function (resolve, reject) {
            $http.post("/login", {
                login: login,
                password: password
            })
                .success(function (res) {
                    if (res) {
                        service.loggedIn = true;
                        service.userName = login;
                        console.log("logged in");
                        resolve();
                    } else {
                        console.log("wrong user/password");
                        reject();
                    }
                })
        })
    };
    return service;
});