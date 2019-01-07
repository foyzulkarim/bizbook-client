var App;
(function (App) {
    "use strict";
    var ApplicationUsersController = /** @class */ (function () {
        function ApplicationUsersController($location, $state, $stateParams, url, search, save) {
            this.$location = $location;
            this.url = url;
            this.searchService = search;
            this.saveService = save;
            this.stateService = $state;
            this.stateParams = $stateParams;
            this.isUpdateMode = false;
            this.activate();
        }
        ApplicationUsersController.prototype.$onInit = function () { };
        ApplicationUsersController.prototype.activate = function () {
            console.log('i m in ApplicationUsersController');
            this.models = [];
            this.searchRequest = new App.SearchRequest("", "Modified", "False", "");
            this.search();
        };
        ApplicationUsersController.prototype.search = function () {
            var self = this;
            var successCallback = function (response) {
                console.log(response);
                self.models = response;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService.get(self.url.applicationUserQueryData).then(successCallback, errorCallback);
        };
        ApplicationUsersController.$inject = ["$location", "$state", "$stateParams", "UrlService", "SearchService", "SaveService"];
        return ApplicationUsersController;
    }());
    App.ApplicationUsersController = ApplicationUsersController;
    angular.module("app").controller("ApplicationUsersController", ApplicationUsersController);
    var ApplicationUserController = /** @class */ (function () {
        function ApplicationUserController($location, $state, $stateParams, url, search, save) {
            this.$location = $location;
            this.url = url;
            this.searchService = search;
            this.saveService = save;
            this.stateService = $state;
            this.stateParams = $stateParams;
            this.isUpdateMode = false;
            this.activate();
            if (this.stateParams["id"]) {
                this.isUpdateMode = true;
                this.edit(this.stateParams["id"]);
            }
        }
        ApplicationUserController.prototype.$onInit = function () { };
        ApplicationUserController.prototype.activate = function () {
            console.log('i m in ApplicationUsersController');
            this.models = [];
            this.model = new App.ApplicationUser();
            this.roles = [];
            this.shops = [];
            this.role = new App.ApplicationRole();
            this.searchRequest = new App.SearchRequest("", "Modified", "False", "");
            // this.search();
            this.setupDropdowns();
            this.loadShopDropdown();
        };
        //loadApplicationRoleDropDown(): void {
        //    var self = this;
        //    var successCallback = (response: SearchResponse): void => {
        //        console.log(response);
        //        self.roles = <any>response;
        //    };
        //    var errorCallback = (error: any): void => {
        //        console.log(error);
        //    };
        //    self.searchService.get(self.url.roleDropdown +"/GetApplicationRoleDropdown").then(<any>successCallback, errorCallback);
        //}
        ApplicationUserController.prototype.setupDropdowns = function () {
            var _this = this;
            var self = this;
            var success = function (response) {
                _this.roles = response;
                console.log(response);
            };
            var error = function (error) {
                console.log(error);
                alert('Error occurred');
            };
            self.searchService.get(self.url.roleDropdown).then(success, error);
        };
        ApplicationUserController.prototype.loadShopDropdown = function () {
            var self = this;
            var successCallback = function (response) {
                console.log('shops ', response);
                self.shops = response.Models;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            var shopRequest = new App.SearchRequest("", "Modified", "False", "");
            self.searchService
                .search(shopRequest, self.url.shopQuery + "/Dropdown")
                .then(successCallback, errorCallback);
        };
        ApplicationUserController.prototype.goto = function (page) {
            this.searchRequest.page = page;
            //this.search();
        };
        ApplicationUserController.prototype.save = function () {
            var self = this;
            var successCallback = function (response) {
                console.log(response);
                self.model = new App.ApplicationUser();
                //this.search();
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.saveService.save(self.model, self.url.applicationUsers + "/PostApplicationUser").then(successCallback, errorCallback);
        };
        ApplicationUserController.prototype.update = function () {
            var self = this;
            var successCallback = function (response) {
                console.log(response);
                self.isUpdateMode = false;
                self.model = new App.ApplicationUser();
                //this.search();
            };
            var errorCallback = function (error) {
                console.log(error);
                // this.search();
            };
            self.saveService.update(self.model, self.url.applicationUsers + "/PutApplicationUser").then(successCallback, errorCallback);
        };
        //edit(p: ApplicationUser): void {
        //    this.model = p;
        //    this.isUpdateMode = true;
        //}
        ApplicationUserController.prototype.edit = function (id) {
            ;
            var self = this;
            var url = self.url.applicationUsers + '/GetApplicationUser/' + id;
            var onSuccess = function (data) {
                self.model = data;
                self.model.roleId = self.model["roles"][0]["roleId"];
            };
            var onError = function (err) {
                alert('Error occurred');
            };
            self.searchService.get(url).then(onSuccess, onError);
        };
        ApplicationUserController.prototype.delete = function (id) {
            var self = this;
            var successCallback = function (response) {
                console.log(response);
                self.isUpdateMode = false;
                self.model = new App.ApplicationUser();
                // this.search();
            };
            var errorCallback = function (error) {
                console.log(error);
                // this.search();
            };
            self.saveService.delete(id, self.url.applicationUsers + "/DeleteApplicationUser").then(successCallback, errorCallback);
        };
        ApplicationUserController.$inject = ["$location", "$state", "$stateParams", "UrlService", "SearchService", "SaveService"];
        return ApplicationUserController;
    }());
    App.ApplicationUserController = ApplicationUserController;
    angular.module("app").controller("ApplicationUserController", ApplicationUserController);
})(App || (App = {}));
