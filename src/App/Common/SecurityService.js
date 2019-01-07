var App;
(function (App) {
    var AuthService = /** @class */ (function () {
        function AuthService($q, localStorageService, urlService, webService) {
            this.q = $q;
            this.url = urlService;
            this.web = webService;
            this.localStorageService = localStorageService;
        }
        AuthService.prototype.signin = function (request) {
            var self = this;
            self.signout();
            var deffered = self.q.defer();
            var data = "username=" + request.email + "&password=" + request.password + "&grant_type=password";
            self.web.postUrlencodedForm(self.url.signinUrl, data).then(function (result) {
                self.accountInfo = new App.UserInfo();
                self.accountInfo.userName = result.data.userName;
                self.accountInfo.id = result.data.id;
                self.accountInfo.role = result.data.role;
                self.accountInfo.authToken = result.data.AuthToken;
                self.accountInfo.accessToken = result.data.access_token;
                self.accountInfo.isAuth = true;
                self.accountInfo.connectionId = "";
                self.accountInfo.shopId = result.data.shopId;
                self.accountInfo.warehouseId = result.data.warehouseId;
                self.accountInfo.resources = JSON.parse(result.data.resources);
                self.accountInfo.defaultRoute = result.data.defaultRoute;
                self.localStorageService.set("authorizationData", self.accountInfo);
                self.localStorageService.set("ChalanName", result.data.ChalanName);
                self.localStorageService.set("ReceiptName", result.data.ReceiptName);
                self.localStorageService.set("ShowOrderNumberAfterSave", (result.data.ShowOrderNumberAfterSave === 'True') ? true : false);
                self.localStorageService.set("AddToCartIfResultIsOne", (result.data.AddToCartIfResultIsOne === 'True') ? true : false);
                self.localStorageService.set("DeliveryChargeAmount", parseInt(result.data.DeliveryChargeAmount));
                deffered.resolve(self.accountInfo);
                //self.web.get(self.url.sideMenuUrl).then(result => {
                //    console.log(result);
                //    self.accountInfo.routes = result.data;
                //    deffered.resolve(self.accountInfo);
                //}, error => {
                //    console.log(error);
                //});               
            }, function (error) {
                deffered.reject(error);
            });
            return deffered.promise;
        };
        AuthService.prototype.signinCore = function (request) {
            var self = this;
            self.signout();
            var deffered = self.q.defer();
            var data = {
                'username': request.email,
                'password': request.password
            };
            self.web.post(self.url.signinUrl, data).then(function (result) {
                console.log(result);
                self.accountInfo = new App.UserInfo();
                self.accountInfo.userName = result.data.userName;
                self.accountInfo.id = result.data.id;
                self.accountInfo.role = result.data.role;
                self.accountInfo.authToken = result.data.AuthToken;
                self.accountInfo.accessToken = result.data.access_token;
                self.accountInfo.isAuth = true;
                self.accountInfo.connectionId = "";
                self.accountInfo.shopId = result.data.shopId;
                self.accountInfo.warehouseId = result.data.warehouseId;
                self.accountInfo.resources = JSON.parse(result.data.resources);
                self.accountInfo.defaultRoute = result.data.defaultRoute;
                self.localStorageService.set("authorizationData", self.accountInfo);
                deffered.resolve(self.accountInfo);
            }, function (error) {
                deffered.reject(error);
            });
            return deffered.promise;
        };
        AuthService.prototype.signout = function () {
            this.localStorageService.remove("authorizationData");
            this.accountInfo = null;
        };
        AuthService.prototype.updateUserInfo = function () {
            this.localStorageService.set("authorizationData", this.accountInfo);
            this.fillAuthData();
        };
        AuthService.prototype.fillAuthData = function () {
            var authData = this.localStorageService.get("authorizationData");
            if (authData) {
                this.accountInfo = (authData);
            }
        };
        AuthService.prototype.isSignedIn = function () {
            if (this.accountInfo == null) {
                return false;
            }
            return this.accountInfo.isAuth;
        };
        //loadMenu(): void {
        //    var self = this;
        //    //self.UserInfo.Routes = result.data.Routes;
        //    self.web.get(self.url.sideMenuUrl).then(result => {
        //        console.log(result);
        //        self.accountInfo.routes = result.data;
        //    }, error => {
        //        console.log(error);
        //    });
        //}
        AuthService.prototype.register = function (request) {
            var self = this;
            self.signout();
            var deffered = self.q.defer();
            self.web.post(self.url.registerUrl, request).then(function (result) {
                var response = new App.RegisterResponse(true, result.data, "Success");
                response.userName = result.data.userName;
                response.isRegistered = true;
                deffered.resolve(response);
            }, function (error) {
                deffered.reject(error);
            });
            return deffered.promise;
        };
        AuthService.prototype.setDefaultPassword = function (data) {
            var self = this;
            var deffered = self.q.defer();
            self.web.post(self.url.setDefaultPasswordUrl, data).then(function (result) {
                deffered.resolve(result);
            }, function (error) {
                deffered.reject(error);
            });
            return deffered.promise;
        };
        AuthService.$inject = ["$q", "localStorageService", "UrlService", "WebService"];
        return AuthService;
    }());
    App.AuthService = AuthService;
    angular.module("app").service("AuthService", AuthService);
    var PermissionService = /** @class */ (function () {
        function PermissionService($q, securityUrlService, webService) {
            this.q = $q;
            this.securityUrlService = securityUrlService;
            this.web = webService;
        }
        PermissionService.$inject = ["$q", "UrlService", "WebService"];
        return PermissionService;
    }());
    App.PermissionService = PermissionService;
    angular.module("app").service("permissionService", PermissionService);
})(App || (App = {}));
