module App {
    "use strict";

    export class HomeConfig {

        static $inject = ["$stateProvider", "$urlRouterProvider"];

        constructor($stateProvider: angular.ui.IStateProvider, $urlRouterProvider: angular.ui.IUrlRouterProvider) {

            $stateProvider
                .state("root.home", {
                    url: "/",
                    views: {
                        "":
                        {
                            templateUrl: "partials/home/home.tpl.html?t=095712282018",
                            controller: "HomeController",
                            controllerAs: "vm"
                        }
                    }
                });
        }
    }

    angular.module("app").config(HomeConfig);
    
}