var App;
(function (App) {
    "use strict";
    var ApplicationRoleController = /** @class */ (function () {
        function ApplicationRoleController($location, $state, $stateParams, url, search, save) {
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
        ApplicationRoleController.prototype.$onInit = function () { };
        ApplicationRoleController.prototype.activate = function () {
            console.log('i m in ApplicationRoleController');
            this.models = [];
            this.model = new App.ApplicationRole();
            this.searchRequest = new App.SearchRequest("", "Modified", "False", "");
            this.search();
        };
        ApplicationRoleController.prototype.search = function () {
            var self = this;
            var successCallback = function (response) {
                console.log(response);
                self.models = response;
                console.log(self.models);
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService.get(self.url.applicationRoleQueryData).then(successCallback, errorCallback);
        };
        ApplicationRoleController.prototype.goto = function (page) {
            this.searchRequest.page = page;
            this.search();
        };
        ApplicationRoleController.prototype.save = function () {
            var _this = this;
            var self = this;
            var successCallback = function (response) {
                console.log(response);
                self.model = new App.ApplicationRole();
                _this.search();
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            // self.Model.Id = "4d524ba7-e4b4-485b-931b-6a298542a530";
            self.saveService.save(self.model, self.url.applicationRoles + "/PostApplicationRole")
                .then(successCallback, errorCallback);
        };
        ApplicationRoleController.prototype.update = function () {
            var _this = this;
            var self = this;
            var successCallback = function (response) {
                console.log(response);
                self.isUpdateMode = false;
                self.model = new App.ApplicationRole();
                _this.search();
            };
            var errorCallback = function (error) {
                console.log(error);
                _this.search();
            };
            self.saveService.update(self.model, self.url.applicationRoles + "/PutApplicationRole").then(successCallback, errorCallback);
        };
        //edit(p: ApplicationRole): void {
        //    this.model = p;
        //    this.isUpdateMode = true;
        //}
        ApplicationRoleController.prototype.edit = function (id) {
            ;
            var self = this;
            var url = self.url.applicationRoles + '/GetApplicationRole/' + id;
            var onSuccess = function (data) {
                self.model = data;
            };
            var onError = function (err) {
                alert('Error occurred');
            };
            self.searchService.get(url).then(onSuccess, onError);
        };
        ApplicationRoleController.prototype.delete = function (id) {
            var _this = this;
            var self = this;
            var successCallback = function (response) {
                console.log(response);
                self.isUpdateMode = false;
                self.model = new App.ApplicationRole();
                _this.search();
            };
            var errorCallback = function (error) {
                console.log(error);
                _this.search();
            };
            self.saveService.delete(id, self.url.applicationRoles).then(successCallback, errorCallback);
        };
        ApplicationRoleController.$inject = ["$location", "$state", "$stateParams", "UrlService", "SearchService", "SaveService"];
        return ApplicationRoleController;
    }());
    App.ApplicationRoleController = ApplicationRoleController;
    angular.module("app").controller("ApplicationRoleController", ApplicationRoleController);
})(App || (App = {}));
