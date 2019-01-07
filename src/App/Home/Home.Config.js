var App;
(function (App) {
    "use strict";
    var HomeConfig = /** @class */ (function () {
        function HomeConfig($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state("root.home", {
                url: "/",
                views: {
                    "": {
                        templateUrl: "partials/home/home.tpl.html?t=095712282018",
                        controller: "HomeController",
                        controllerAs: "vm"
                    }
                }
            });
        }
        HomeConfig.$inject = ["$stateProvider", "$urlRouterProvider"];
        return HomeConfig;
    }());
    App.HomeConfig = HomeConfig;
    angular.module("app").config(HomeConfig);
})(App || (App = {}));
