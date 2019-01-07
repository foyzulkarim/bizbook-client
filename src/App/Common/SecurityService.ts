module App {
   
    export class AuthService {
        q: angular.IQService;
        url: UrlService;
        web: WebService;
        
        private localStorageService: angular.local.storage.ILocalStorageService;
        accountInfo: UserInfo;

        static $inject = ["$q", "localStorageService", "UrlService", "WebService"];

        constructor($q: angular.IQService, localStorageService: angular.local.storage.ILocalStorageService, urlService: UrlService, webService: WebService) {
            this.q = $q;
            this.url = urlService;
            this.web = webService;
            this.localStorageService = localStorageService;
        }

        signin(request: SigninRequest): angular.IPromise<UserInfo> {
            var self = this;
            self.signout();
            var deffered: angular.IDeferred<UserInfo> = self.q.defer();
            var data = `username=${request.email}&password=${request.password}&grant_type=password`;
            self.web.postUrlencodedForm(self.url.signinUrl, data).then((result: any): any => {
                self.accountInfo = new UserInfo();
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
            }, error => {
                deffered.reject(error);
            });
            return deffered.promise;
        }

        signinCore(request: SigninRequest):angular.IPromise<UserInfo>{
            var self = this;
            self.signout();
            var deffered: angular.IDeferred<UserInfo> = self.q.defer();
            var data = {
                'username' : request.email,
                'password' : request.password
                };
            
            self.web.post(self.url.signinUrl, data).then((result: any): any => {
                console.log(result);
                self.accountInfo = new UserInfo();
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
            }, error => {
                deffered.reject(error);
            });
            return deffered.promise;
        }

        signout(): void {
            this.localStorageService.remove("authorizationData");
            this.accountInfo = null;
        }

        updateUserInfo(): void {
            this.localStorageService.set("authorizationData", this.accountInfo);
            this.fillAuthData();
        }

        fillAuthData(): void {
            var authData = this.localStorageService.get("authorizationData");
            if (authData) {
                this.accountInfo = ((authData) as UserInfo);
            }

        }

        isSignedIn(): boolean {
            if (this.accountInfo == null) {
                return false;
            }
            return this.accountInfo.isAuth;
        }

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

        register(request: RegisterRequest): angular.IPromise<RegisterResponse> {
            var self = this;
            self.signout();
            var deffered: angular.IDeferred<RegisterResponse> = self.q.defer();
            
            self.web.post(self.url.registerUrl, request).then((result: any): any => {
                var response = new RegisterResponse(true, result.data, "Success");
                response.userName = result.data.userName;
                response.isRegistered = true;
                deffered.resolve(response);
            }, error => {
                deffered.reject(error);
            });
            return deffered.promise;
        }

        setDefaultPassword(data: any) : angular.IPromise<any>{
            var self = this;
            var deffered: angular.IDeferred<RegisterResponse> = self.q.defer();
            self.web.post(self.url.setDefaultPasswordUrl,data).then((result: any): any =>{
                deffered.resolve(result);
            }, error=>{
                deffered.reject(error);
            });

            return deffered.promise;
        }
    }
    angular.module("app").service("AuthService", AuthService);

    export class PermissionService {
        private q: ng.IQService;
        private securityUrlService: UrlService;
        private web: WebService;

        static $inject = ["$q", "UrlService", "WebService"];

        constructor($q: ng.IQService, securityUrlService: UrlService, webService: WebService) {
            this.q = $q;
            this.securityUrlService = securityUrlService;
            this.web = webService;
        }

        //isAllowed(request: string): angular.IPromise<PermissionResponse> {
        //    var self = this;
        //    var deffered = self.q.defer();
        //    self.web.post(self.securityUrlService.permissionUrl, new PermissionRequest(request))
        //        .then((result: any): any => {
        //            var response = new PermissionResponse(true, result.data, "Success");
        //            response.isAllowed = true;
        //            deffered.resolve(response);
        //        }, error => {
        //            deffered.reject(error);
        //        });
        //    return deffered.promise;
        //}
    }

    angular.module("app").service("permissionService", PermissionService);     
}