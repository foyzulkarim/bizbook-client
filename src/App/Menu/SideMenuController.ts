// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
module App {
    "use strict";

    export class SideMenuController implements angular.IController {
        user: UserInfo;
        private stateService: angular.ui.IStateService;
        isSignedIn: boolean = false;
        private rootScopeService: angular.IRootScopeService;
        private authService: AuthService;
        routes: string[];
        selectedMenu: string;

        static $inject: string[] = ["$location", "$rootScope", "AuthService", "$state"];
        $onInit(): void { }

        constructor(private $location: angular.ILocationService, $rootScope: angular.IRootScopeService, authService: AuthService, $state: angular.ui.IStateService) {
            var self = this;
            self.authService = authService;
            self.stateService = $state;
            self.rootScopeService = $rootScope;
            self.$location = $location;
            self.rootScopeService.$on("SignedIn", (event, args) => {
                self.activate();
                console.log('i m in sidemenucontroller');
            });
            self.rootScopeService.$on("SignedOut", (event, args) => {
                self.activate();
                self.loadUser();
            });
            self.activate();
        }

        activate() {
            var self = this;
            var acc = self.authService.accountInfo;
            if (acc && acc.isAuth) {
                self.loadUser();
                self.routes = self.user.routes;
            } else {
                self.isSignedIn = false;
                self.routes = [];
            }
            this.selectedMenu = null;
        }

        loadSideMenu(s: string): boolean {
            var self = this;
            if (self.routes) {
                for (var i = 0; i < self.routes.length; i++) {
                    if (self.routes[i] === s) {
                        return true;
                    }
                }
            }

            return false;
        }

        private loadUser(): void {
            var self = this;
            self.user = this.authService.accountInfo;
            self.isSignedIn = this.authService.isSignedIn();
        }


    }

    angular.module("app").controller("SideMenuController", SideMenuController);
}