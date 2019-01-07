module App {
    export class HomeController implements angular.IController {
        isSignedIn: boolean = false;
        private rootScopeService: angular.IRootScopeService;
        private authService: AuthService;
        user: UserInfo;
        searchService: SearchService;
        private stateService: angular.ui.IStateService;
        url: UrlService;
        profile: any;
        myHub: any;
        $scope: angular.IScope;

        labels: string[];
        data : number[];

        static $inject: string[] = ["$state", "$rootScope", "AuthService", "SearchService", "UrlService", "$scope"];

        $onInit(): void { }

        constructor($state: angular.ui.IStateService,
            $rootScope: angular.IRootScopeService,
            authService: AuthService,
            search: SearchService,
            urlService: UrlService,
            scope: angular.IScope) {

            var self = this;

            self.url = urlService;
            self.searchService = <any>(search);
            self.authService = <any>(authService);
            self.stateService = $state;
            self.rootScopeService = $rootScope;
            self.$scope = scope;

            self.rootScopeService.$on("SignedIn",
                (event, args) => {
                    // self.activate();
                    //self.loadUser();
                });
            self.rootScopeService.$on("SignedOut",
                (event, args) => {
                    self.activate();
                    //self.loadUser();
                });

            console.log('constructor', self.rootScopeService["isPulling"], self.isPulling);
            if (!self.rootScopeService["isPulling"]) {
                self.rootScopeService["isPulling"] = self.isPulling;
            } else {
                self.isPulling = self.rootScopeService["isPulling"];
            }

            self.activate();
        }

        activate() {
            var self = this;

            var acc = self.authService.accountInfo;
            if (acc && acc.isAuth) {
                self.loadUser();
                console.log('in activate', self.rootScopeService["isPulling"], self.isPulling);
                self.loadDashboard();
            } else {
                self.isSignedIn = false;
            }
        }

        getUserInfo(): void {
            var self = this;
            var successCallback = (response: SearchResponse): void => {
                console.log(response);
                self.profile = <any>response;
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            self.searchService.get(self.url.profileUrl).then(<any>successCallback, errorCallback);
        }

        private loadUser(): void {
            var self = this;
            self.user = this.authService.accountInfo;
            self.isSignedIn = this.authService.isSignedIn();

            let connection: any = $['connection'];

            self.myHub = connection.notificationHub;
            self.myHub.client.added = r => {
                console.log('connection response : ' + r);
            };
            self.myHub.client.connected = connectionId => {
                console.log('connection id : ' + connectionId);
                self.user.connectionId = connectionId;
                self.authService.updateUserInfo();
                //self.myHub.server.add(this.user.shopId);
            }

            self.myHub.client.orderCreated = data => {
                console.log('new order created from website');
                alert('new order created from website. please check in pending list page');
                self.rootScopeService.$broadcast("orderCreated");
            }

            self.myHub.client.disconnected = parameters => {
                console.log('disconnected', parameters);
            };

            self.myHub.client.chat = function(fromShopId, message) {
                self.rootScopeService.$broadcast("chatReceived", fromShopId, message);
            }

            connection.hub.url = this.url.signalrUrl;
            document.cookie = "BearerToken=" + this.authService.accountInfo.accessToken + "; path=/";

            connection.hub.start().done(() => {
                console.log('connection established');
            });

            connection.hub.logging = true;
            connection.hub.error = (error) => {
                console.error(error);
            };

        }

        isPulling: boolean = false;

        pull(): void {
            var self = this;
            var success = function(response) {
                console.log(response);
                alert("Done");
                self.isPulling = false;
                self.rootScopeService["isPulling"] = self.isPulling;
                console.log('after pull', self.rootScopeService["isPulling"], self.isPulling);
                self.loadDashboard();
            }

            var error = function(error) {
                console.error(error);
                alert("Error occurred");
                self.isPulling = false;
                self.rootScopeService["isPulling"] = self.isPulling;
            }

            console.log('before pull', self.rootScopeService["isPulling"], self.isPulling);
            if (self.rootScopeService["isPulling"] === false) {
                //self.isPulling = true;
                //self.rootScopeService["isPulling"] = self.isPulling;
                //self.searchService.get(this.url.woo + "/Pull/Order").then(success, error);
            }
        }

        getRelative(p: string): string {
            var now: Date = new Date();
            now = new Date(now.toDateString());
            var orderDate = new Date(new Date(p).toDateString());
            var diff: number = orderDate.getTime() - now.getTime();
            var sec = diff / 1000;
            var hours = sec / 3600;
            var days = hours / 24;
            console.log(days);
            let int = parseInt(days.toString());
            var s = "";
            if (int < 0) {
                s = -1 * int + " day(s) over";
            } else {
                s = int + " day(s) left";
            }

            return s;
        }

        pullEverything(): void {
            var self = this;
            var success = function(response) {
                console.log(response);
                alert("Done");
                self.isPulling = false;
                self.rootScopeService["isPulling"] = self.isPulling;
                console.log('after pullEverything', self.rootScopeService["isPulling"], self.isPulling);
                self.loadDashboard();
            }

            var error = function(error) {
                console.error(error);
                alert("Error occurred");
                self.isPulling = false;
                self.rootScopeService["isPulling"] = self.isPulling;

            }

            console.log('before pullEverything', self.rootScopeService["isPulling"], self.isPulling);
            if (self.rootScopeService["isPulling"] === false) {
                // self.isPulling = true;
                //self.rootScopeService["isPulling"] = self.isPulling;
                //self.searchService.get(this.url.woo + "/Pull/Everything").then(success, error);
            }
        }

        response: any;

        loadDashboard(): void {
            var self = this;
            var success = function(response) {
                console.log(response);
                self.isPulling = false;
                self.rootScopeService["isPulling"] = self.isPulling;
                console.log('after loadDashboard', self.rootScopeService["isPulling"], self.isPulling);
                self.response = response;
                self.labels = ["bizbook365", "facebook", "website"];
                self.data = [response.sales.bizbook365, response.sales.facebook, response.sales.website];
            }

            var error = function(error) {
                console.error(error);
                if (error.status == 401) {
                    self.authService.signout();
                    self.authService.accountInfo = null;                    
                }
                alert("Error occurred");
                self.isPulling = false;
                self.rootScopeService["isPulling"] = self.isPulling;
            }

            console.log('before loadDashboard', self.rootScopeService["isPulling"], self.isPulling);
            if (self.rootScopeService["isPulling"] === false) {
                self.isPulling = true;
                self.rootScopeService["isPulling"] = self.isPulling;
                self.searchService.get(this.url.dashboard + "/Data").then(success, error);
            }
        }
    }

    angular.module('app').controller('HomeController', HomeController);
}