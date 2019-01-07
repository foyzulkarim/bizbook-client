var App;
(function (App) {
    var SigninController = /** @class */ (function () {
        function SigninController(authService, $state, $rootScope) {
            console.log('i m in signincontroller');
            this.user = new App.SigninRequest("admin@demo1.com", "123456");
            this.authService = authService;
            this.stateService = $state;
            this.rootScopeService = $rootScope;
            var acc = this.authService.accountInfo;
            if (acc && acc.isAuth) {
                if (acc.defaultRoute) {
                    this.stateService.go(acc.defaultRoute);
                }
                else {
                    this.stateService.go("root.home");
                }
            }
        }
        SigninController.prototype.$onInit = function () { console.log('on init signin controller'); };
        SigninController.prototype.signin = function () {
            var _this = this;
            var self = this;
            var signinSuccess = function (response) {
                self.authService.accountInfo = response;
                var acc = response;
                if (acc && acc.isAuth) {
                    if (acc.defaultRoute) {
                        _this.stateService.go(acc.defaultRoute);
                    }
                    else {
                        _this.stateService.go("root.home");
                    }
                }
                self.rootScopeService.$broadcast("SignedIn");
            };
            var signinError = function (error) {
                console.log(error);
                if (error.data.error_description) {
                    alert(error.data.error_description);
                }
                else {
                    alert('Unknown error occurred. Please contact support. Thanks.');
                }
                self.showErrorMessage = true;
            };
            self.authService.signin(new App.SigninRequest(self.user.email, self.user.password)).then(signinSuccess, signinError);
        };
        SigninController.$inject = ["AuthService", "$state", "$rootScope"];
        return SigninController;
    }());
    App.SigninController = SigninController;
    angular.module("app").controller("SigninController", SigninController);
    var NavController = /** @class */ (function () {
        function NavController(authService, $state, $rootScope, url) {
            var self = this;
            self.authService = authService;
            self.stateService = $state;
            self.rootScopeService = $rootScope;
            self.urlService = url;
            var acc = self.authService.accountInfo;
            if (acc && acc.isAuth) {
                self.loadUser();
            }
            else {
                self.isSignedIn = false;
            }
            self.rootScopeService.$on("SignedIn", function (event, args) {
                self.loadUser();
            });
        }
        NavController.prototype.$onInit = function () { };
        NavController.prototype.loadUser = function () {
            var self = this;
            self.user = this.authService.accountInfo;
            self.isSignedIn = this.authService.isSignedIn();
        };
        NavController.prototype.signout = function () {
            var self = this;
            self.authService.signout();
            self.loadUser();
            self.stateService.go("root.signin");
            self.rootScopeService.$broadcast("SignedOut");
        };
        NavController.$inject = ["AuthService", "$state", "$rootScope", "UrlService"];
        return NavController;
    }());
    App.NavController = NavController;
    angular.module("app").controller("NavController", NavController);
    //export class RegisterController {
    //    private authService: AuthService;
    //    user: RegisterRequest;
    //    private stateService: angular.ui.IStateService;
    //    notification: Notification;
    //    isDisabled: boolean;
    //    static $inject = ["AuthService", "$state"];
    //    constructor(
    //        authService: AuthService, $state: angular.ui.IStateService) {
    //        this.authService = authService;
    //        this.stateService = $state;
    //        var acc = this.authService.accountInfo;
    //        if (acc && acc.isAuth) {
    //            this.stateService.go("root.home");
    //        }
    //        this.notification = new Notification();
    //        this.notification.isError = false;
    //        this.notification.isInfo = false;
    //        this.isDisabled = false;
    //    }
    //    register(): void {
    //        var self = this;
    //        self.isDisabled = true;
    //        var successCallback = (response: RegisterResponse): any => {
    //            self.stateService.go("root.signin");
    //            // console.log(response);
    //            self.isDisabled = false;
    //            return response;
    //        };
    //        var errorCallback = (errorResponse: any): any => {
    //            self.isDisabled = false;
    //            console.log(errorResponse);
    //            self.notification.isError = true;
    //            if (errorResponse.status === 500) {
    //                self.notification.message = errorResponse.data.ExceptionMessage;
    //            } else {
    //                if (errorResponse.status === 400 && errorResponse.data.ModelState["model.Password"]) {
    //                    self.notification.message = errorResponse.data.ModelState["model.Password"][0];
    //                } else {
    //                    if (errorResponse.status === 400 && errorResponse.data.ModelState["model.Phone"]) {
    //                        self.notification.message = errorResponse.data.ModelState["model.Phone"][0];
    //                    } else {
    //                        if (errorResponse.status === 400 && errorResponse.data.ModelState[""]) {
    //                            if (errorResponse.data.ModelState[""].length > 1) {
    //                                self.notification.message = errorResponse.data.ModelState[""][1];
    //                            } else
    //                                self.notification.message = errorResponse.data.ModelState[""][0];
    //                        }
    //                        else self.notification.message = errorResponse.data.Message;
    //                    }
    //                }
    //            }
    //        };
    //        self.authService.register(self.user).then(successCallback, errorCallback);
    //    }
    //}
    //angular.module("app").controller("RegisterController", RegisterController);
})(App || (App = {}));
