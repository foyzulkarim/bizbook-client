var App;
(function (App) {
    "use strict";
    var ApplicationUserRolesController = /** @class */ (function () {
        function ApplicationUserRolesController($location, url, search, save) {
            this.$location = $location;
            this.url = url;
            this.searchService = search;
            this.saveService = save;
            this.isUpdateMode = false;
            this.activate();
        }
        ApplicationUserRolesController.prototype.$onInit = function () { };
        ApplicationUserRolesController.prototype.activate = function () {
            console.log('i m in ApplicationUserRolesController');
            this.models = [];
            this.model = new App.ApplicationUserRole();
            this.users = [];
            this.user = new App.ApplicationUser();
            this.roles = [];
            this.role = new App.ApplicationRole();
            this.searchRequest = new App.SearchRequest("", "Modified", "False", "");
            this.search();
            this.loadApplicationUserDropDown();
            this.loadApplicationRoleDropDown();
        };
        ApplicationUserRolesController.prototype.loadApplicationUserDropDown = function () {
            var self = this;
            var successCallback = function (response) {
                console.log(response);
                self.users = response;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService.get(self.url.applicationUserQueryData).then(successCallback, errorCallback);
        };
        ApplicationUserRolesController.prototype.loadApplicationRoleDropDown = function () {
            var self = this;
            var successCallback = function (response) {
                console.log(response);
                self.roles = response;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService.get(self.url.roleDropdown).then(successCallback, errorCallback);
        };
        ApplicationUserRolesController.prototype.search = function () {
            var self = this;
            var successCallback = function (response) {
                console.log(response);
                self.models = response;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService.get(self.url.applicationUserRoleQueryData).then(successCallback, errorCallback);
        };
        ApplicationUserRolesController.prototype.goto = function (page) {
            this.searchRequest.page = page;
            this.search();
        };
        ApplicationUserRolesController.prototype.save = function () {
            var _this = this;
            var self = this;
            var successCallback = function (response) {
                console.log(response);
                self.model = new App.ApplicationUserRole();
                _this.search();
                _this.loadApplicationUserDropDown();
                _this.loadApplicationRoleDropDown();
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            //self.Model.UserId = self.User.Id;
            //self.Model.RoleId = self.Role.Id;
            self.saveService.save(self.model, self.url.applicationUserRoles).then(successCallback, errorCallback);
        };
        ApplicationUserRolesController.prototype.update = function () {
            var _this = this;
            var self = this;
            var successCallback = function (response) {
                console.log(response);
                self.isUpdateMode = false;
                self.model = new App.ApplicationUserRole();
                _this.search();
            };
            var errorCallback = function (error) {
                console.log(error);
                _this.search();
            };
            //self.Model.UserId = self.User.Id;
            //self.Model.RoleId = self.Role.Id;
            self.saveService.update(self.model, self.url.applicationUserRoles).then(successCallback, errorCallback);
        };
        ApplicationUserRolesController.prototype.edit = function (p) {
            //this.User.Id = p.UserId;
            //this.User.UserName = p.UserName;
            //this.Role.Id = p.RoleId;
            //this.Role.Name = p.RoleName;
            this.model = p;
            this.isUpdateMode = true;
        };
        ApplicationUserRolesController.prototype.delete = function (id) {
            var _this = this;
            var self = this;
            var successCallback = function (response) {
                console.log(response);
                self.isUpdateMode = false;
                self.model = new App.ApplicationUserRole();
                _this.search();
            };
            var errorCallback = function (error) {
                console.log(error);
                _this.search();
            };
            self.saveService.delete(id, self.url.applicationUserRoles).then(successCallback, errorCallback);
        };
        ApplicationUserRolesController.$inject = ["$location", "UrlService", "SearchService", "SaveService"];
        return ApplicationUserRolesController;
    }());
    App.ApplicationUserRolesController = ApplicationUserRolesController;
    angular.module("app").controller("ApplicationUserRolesController", ApplicationUserRolesController);
})(App || (App = {}));
