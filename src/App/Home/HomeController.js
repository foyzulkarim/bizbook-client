var App;
(function (App) {
    var HomeController = /** @class */ (function () {
        function HomeController($state, $rootScope, authService, search, urlService, scope) {
            this.isSignedIn = false;
            this.isPulling = false;
            var self = this;
            self.url = urlService;
            self.searchService = (search);
            self.authService = (authService);
            self.stateService = $state;
            self.rootScopeService = $rootScope;
            self.$scope = scope;
            self.rootScopeService.$on("SignedIn", function (event, args) {
                // self.activate();
                //self.loadUser();
            });
            self.rootScopeService.$on("SignedOut", function (event, args) {
                self.activate();
                //self.loadUser();
            });
            console.log('constructor', self.rootScopeService["isPulling"], self.isPulling);
            if (!self.rootScopeService["isPulling"]) {
                self.rootScopeService["isPulling"] = self.isPulling;
            }
            else {
                self.isPulling = self.rootScopeService["isPulling"];
            }
            self.activate();
        }
        HomeController.prototype.$onInit = function () { };
        HomeController.prototype.activate = function () {
            var self = this;
            var acc = self.authService.accountInfo;
            if (acc && acc.isAuth) {
                self.loadUser();
                console.log('in activate', self.rootScopeService["isPulling"], self.isPulling);
                self.loadDashboard();
            }
            else {
                self.isSignedIn = false;
            }
        };
        HomeController.prototype.getUserInfo = function () {
            var self = this;
            var successCallback = function (response) {
                console.log(response);
                self.profile = response;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService.get(self.url.profileUrl).then(successCallback, errorCallback);
        };
        HomeController.prototype.loadUser = function () {
            var self = this;
            self.user = this.authService.accountInfo;
            self.isSignedIn = this.authService.isSignedIn();
            var connection = $['connection'];
            self.myHub = connection.notificationHub;
            self.myHub.client.added = function (r) {
                console.log('connection response : ' + r);
            };
            self.myHub.client.connected = function (connectionId) {
                console.log('connection id : ' + connectionId);
                self.user.connectionId = connectionId;
                self.authService.updateUserInfo();
                //self.myHub.server.add(this.user.shopId);
            };
            self.myHub.client.orderCreated = function (data) {
                console.log('new order created from website');
                alert('new order created from website. please check in pending list page');
                self.rootScopeService.$broadcast("orderCreated");
            };
            self.myHub.client.disconnected = function (parameters) {
                console.log('disconnected', parameters);
            };
            self.myHub.client.chat = function (fromShopId, message) {
                self.rootScopeService.$broadcast("chatReceived", fromShopId, message);
            };
            connection.hub.url = this.url.signalrUrl;
            document.cookie = "BearerToken=" + this.authService.accountInfo.accessToken + "; path=/";
            connection.hub.start().done(function () {
                console.log('connection established');
            });
            connection.hub.logging = true;
            connection.hub.error = function (error) {
                console.error(error);
            };
        };
        HomeController.prototype.pull = function () {
            var self = this;
            var success = function (response) {
                console.log(response);
                alert("Done");
                self.isPulling = false;
                self.rootScopeService["isPulling"] = self.isPulling;
                console.log('after pull', self.rootScopeService["isPulling"], self.isPulling);
                self.loadDashboard();
            };
            var error = function (error) {
                console.error(error);
                alert("Error occurred");
                self.isPulling = false;
                self.rootScopeService["isPulling"] = self.isPulling;
            };
            console.log('before pull', self.rootScopeService["isPulling"], self.isPulling);
            if (self.rootScopeService["isPulling"] === false) {
                //self.isPulling = true;
                //self.rootScopeService["isPulling"] = self.isPulling;
                //self.searchService.get(this.url.woo + "/Pull/Order").then(success, error);
            }
        };
        HomeController.prototype.getRelative = function (p) {
            var now = new Date();
            now = new Date(now.toDateString());
            var orderDate = new Date(new Date(p).toDateString());
            var diff = orderDate.getTime() - now.getTime();
            var sec = diff / 1000;
            var hours = sec / 3600;
            var days = hours / 24;
            console.log(days);
            var int = parseInt(days.toString());
            var s = "";
            if (int < 0) {
                s = -1 * int + " day(s) over";
            }
            else {
                s = int + " day(s) left";
            }
            return s;
        };
        HomeController.prototype.pullEverything = function () {
            var self = this;
            var success = function (response) {
                console.log(response);
                alert("Done");
                self.isPulling = false;
                self.rootScopeService["isPulling"] = self.isPulling;
                console.log('after pullEverything', self.rootScopeService["isPulling"], self.isPulling);
                self.loadDashboard();
            };
            var error = function (error) {
                console.error(error);
                alert("Error occurred");
                self.isPulling = false;
                self.rootScopeService["isPulling"] = self.isPulling;
            };
            console.log('before pullEverything', self.rootScopeService["isPulling"], self.isPulling);
            if (self.rootScopeService["isPulling"] === false) {
                // self.isPulling = true;
                //self.rootScopeService["isPulling"] = self.isPulling;
                //self.searchService.get(this.url.woo + "/Pull/Everything").then(success, error);
            }
        };
        HomeController.prototype.loadDashboard = function () {
            var self = this;
            var success = function (response) {
                console.log(response);
                self.isPulling = false;
                self.rootScopeService["isPulling"] = self.isPulling;
                console.log('after loadDashboard', self.rootScopeService["isPulling"], self.isPulling);
                self.response = response;
                self.labels = ["bizbook365", "facebook", "website"];
                self.data = [response.sales.bizbook365, response.sales.facebook, response.sales.website];
            };
            var error = function (error) {
                console.error(error);
                if (error.status == 401) {
                    self.authService.signout();
                    self.authService.accountInfo = null;
                }
                alert("Error occurred");
                self.isPulling = false;
                self.rootScopeService["isPulling"] = self.isPulling;
            };
            console.log('before loadDashboard', self.rootScopeService["isPulling"], self.isPulling);
            if (self.rootScopeService["isPulling"] === false) {
                self.isPulling = true;
                self.rootScopeService["isPulling"] = self.isPulling;
                self.searchService.get(this.url.dashboard + "/Data").then(success, error);
            }
        };
        HomeController.$inject = ["$state", "$rootScope", "AuthService", "SearchService", "UrlService", "$scope"];
        return HomeController;
    }());
    App.HomeController = HomeController;
    angular.module('app').controller('HomeController', HomeController);
})(App || (App = {}));
