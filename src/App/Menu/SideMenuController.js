// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
var App;
(function (App) {
    "use strict";
    var SideMenuController = /** @class */ (function () {
        function SideMenuController($location, $rootScope, authService, $state) {
            this.$location = $location;
            this.isSignedIn = false;
            var self = this;
            self.authService = authService;
            self.stateService = $state;
            self.rootScopeService = $rootScope;
            self.$location = $location;
            self.rootScopeService.$on("SignedIn", function (event, args) {
                self.activate();
                console.log('i m in sidemenucontroller');
            });
            self.rootScopeService.$on("SignedOut", function (event, args) {
                self.activate();
                self.loadUser();
            });
            self.activate();
        }
        SideMenuController.prototype.$onInit = function () { };
        SideMenuController.prototype.activate = function () {
            var self = this;
            var acc = self.authService.accountInfo;
            if (acc && acc.isAuth) {
                self.loadUser();
                self.routes = self.user.routes;
            }
            else {
                self.isSignedIn = false;
                self.routes = [];
            }
            this.selectedMenu = null;
        };
        SideMenuController.prototype.loadSideMenu = function (s) {
            var self = this;
            if (self.routes) {
                for (var i = 0; i < self.routes.length; i++) {
                    if (self.routes[i] === s) {
                        return true;
                    }
                }
            }
            return false;
        };
        SideMenuController.prototype.loadUser = function () {
            var self = this;
            self.user = this.authService.accountInfo;
            self.isSignedIn = this.authService.isSignedIn();
        };
        SideMenuController.$inject = ["$location", "$rootScope", "AuthService", "$state"];
        return SideMenuController;
    }());
    App.SideMenuController = SideMenuController;
    angular.module("app").controller("SideMenuController", SideMenuController);
})(App || (App = {}));
