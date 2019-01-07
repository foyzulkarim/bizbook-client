//module App {
//    "use strict";
//    export class ApplicationPermissionsController {
//        // angular ui params
//        stateService: angular.ui.IStateService;
//        stateParams: angular.ui.IStateParamsService;
//        searchService: SearchService;
//        saveService: SaveService;
//        url: UrlService;
//        searchRequest: SearchRequest;
//        isUpdateMode: boolean;
//        models: ApplicationPermission[];
//        
//        static $inject: string[] = ["$location", "$state", "$stateParams", "UrlService", "SearchService", "SaveService"];
//        constructor(private $location: angular.ILocationService, $state: angular.ui.IStateService,
//            $stateParams: angular.ui.IStateParamsService, url: UrlService, search: SearchService, save: SaveService, ) {
//            this.url = url;
//            this.searchService = search;
//            this.saveService = save;
//            this.stateService = $state;
//            this.stateParams = $stateParams;
//            this.isUpdateMode = false;
//            this.activate();
//        }
//        activate() {
//            console.log('i m in ApplicationPermissionsController');
//            this.models = [];
//            this.searchRequest = new SearchRequest("", "Modified", "False", "");
//            this.search();
//        }
//        search(): void {
//            var self = this;
//            var successCallback = (response: SearchResponse): void => {
//                console.log(response);
//                self.models = <any>response;
//            };
//            var errorCallback = (error: any): void => {
//                console.log(error);
//            };
//            self.searchService.get(self.url.applicationPermissionQueryData).then(<any>successCallback, errorCallback);
//        }
//    }
//    angular.module("app").controller("ApplicationPermissionsController", ApplicationPermissionsController);
//    export class ApplicationPermissionController {
//        // angular ui params
//        stateService: angular.ui.IStateService;
//        stateParams: angular.ui.IStateParamsService;
//        searchService: SearchService;
//        saveService: SaveService;
//        url: UrlService;
//        searchRequest: SearchRequest;
//        isUpdateMode: boolean;
//        model: ApplicationPermission;
//        
//        static $inject: string[] = ["$location", "$state", "$stateParams", "UrlService", "SearchService", "SaveService"];
//        constructor(private $location: angular.ILocationService, $state: angular.ui.IStateService,
//            $stateParams: angular.ui.IStateParamsService, url: UrlService, search: SearchService, save: SaveService, ) {
//            this.url = url;
//            this.searchService = search;
//            this.saveService = save;
//            this.stateService = $state;
//            this.stateParams = $stateParams;
//            this.isUpdateMode = false;
//            this.activate();
//            if (this.stateParams["id"]) {
//                this.isUpdateMode = true;
//                this.edit(this.stateParams["id"]);
//            }
//        }
//        activate() {
//            console.log('i m in ApplicationPermissionController');
//            this.model = new ApplicationPermission();
//            this.searchRequest = new SearchRequest("", "Modified", "False", "");
//        }
//        save(): void {
//            var self = this;
//            var successCallback = (response: BaseResponse): void => {
//                console.log(response);
//                self.model = new ApplicationPermission();
//            };
//            var errorCallback = (error: any): void => {
//                console.log(error);
//            };
//            self.saveService.save(<any>self.model, self.url.applicationPermissions + "/PostApplicationResource").then(<any>successCallback, errorCallback);
//        }
//        update(): void {
//            var self = this;
//            var successCallback = (response: BaseResponse): void => {
//                console.log(response);
//                self.isUpdateMode = false;
//                self.model = new ApplicationPermission();
//            };
//            var errorCallback = (error: any): void => {
//                console.log(error);
//            };
//            self.saveService.update(<any>self.model, self.url.applicationPermissions + "/PutApplicationResource").then(<any>successCallback, errorCallback);
//        }
//        //edit(p: ApplicationUser): void {
//        //    this.model = p;
//        //    this.isUpdateMode = true;
//        //}
//        edit(id: string): void {
//            ;
//            var self = this;
//            var url = self.url.applicationPermissions + '/GetApplicationResource/' + id;
//            var onSuccess = (data: any) => {
//                self.model = data;
//            }
//            var onError = (err: any) => {
//                alert('Error occurred');
//            }
//            self.searchService.get(url).then(onSuccess, onError);
//        }
//        delete(id: string): void {
//            var self = this;
//            var successCallback = (response: BaseResponse): void => {
//                console.log(response);
//                self.isUpdateMode = false;
//                self.model = new ApplicationPermission();
//            };
//            var errorCallback = (error: any): void => {
//                console.log(error);
//            };
//            self.saveService.delete(id, self.url.applicationPermissions).then(successCallback, errorCallback);
//        }
//    }
//    angular.module("app").controller("ApplicationPermissionController", ApplicationPermissionController);
//}
var App;
(function (App) {
    "use strict";
    var ApplicationPermissionsController = /** @class */ (function () {
        function ApplicationPermissionsController($location, url, search, save) {
            this.$location = $location;
            this.selectedResourcePermissionToUpdate = {};
            this.url = url;
            this.searchService = search;
            this.saveService = save;
            this.isUpdateMode = false;
            this.activate();
        }
        ApplicationPermissionsController.prototype.$onInit = function () { };
        ApplicationPermissionsController.prototype.activate = function () {
            console.log('i m in ApplicationPermissionsController');
            this.models = [];
            this.model = new App.ApplicationPermission();
            this.resources = [];
            this.resource = new App.ApplicationResource();
            this.roles = [];
            this.role = new App.ApplicationRole();
            this.searchRequest = new App.SearchRequest("", "Modified", "False", "");
            this.keyword = "";
            //this.search();
            //this.loadApplicationResourceDropDown();
            this.loadApplicationRoleDropDown();
            this.loadApplicationResources();
        };
        ApplicationPermissionsController.prototype.loadApplicationResourceDropDown = function () {
            var self = this;
            self.models = [];
            //var successCallback = (response: SearchResponse): void => {
            //    console.log(response);
            //    self.resources = <any>response;
            //    for (var i = 0; i < self.resources.length; i++) {
            //        var permissionModel = new ApplicationPermission();
            //        permissionModel.resource = self.resources[i].name;                    
            //        permissionModel.isAllowed = false;
            //        permissionModel.resourceId = self.resources[i].id;
            //        self.models.push(permissionModel);
            //    }
            //    console.log(self.models);
            //};
            //var errorCallback = (error: any): void => {
            //    console.log(error);
            //};
            //self.searchService.get(self.url.resourceDropdown).then(<any>successCallback, errorCallback);
            var successCallback = function (response) {
                self.resources = response;
                for (var i = 0; i < self.resources.length; i++) {
                    var permissionModel = new App.ApplicationPermission();
                    permissionModel.resource = self.resources[i].name;
                    permissionModel.isAllowed = false;
                    permissionModel.resourceId = self.resources[i].id;
                    self.models.push(permissionModel);
                }
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService.get(self.url.applicationResourceQuery + '/Data').then(successCallback, errorCallback);
        };
        ApplicationPermissionsController.prototype.loadApplicationRoleDropDown = function () {
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
        ApplicationPermissionsController.prototype.search = function () {
            var self = this;
            var successCallback = function (response) {
                console.log(response);
                self.models = response;
                console.log(self.models);
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService.get(self.url.applicationPermissionQueryData + "?keyword=" + self.keyword).then(successCallback, errorCallback);
        };
        ApplicationPermissionsController.prototype.goto = function (page) {
            this.searchRequest.page = page;
            // this.Search();
        };
        ApplicationPermissionsController.prototype.save = function () {
            var _this = this;
            var self = this;
            var successCallback = function (response) {
                console.log(response);
                self.model = new App.ApplicationPermission();
                self.resources = [];
                self.roles = [];
                _this.loadApplicationResourceDropDown();
                _this.loadApplicationRoleDropDown();
                _this.search();
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            //self.Model.ResourceId = self.Resource.Id;
            //self.Model.RoleId = self.Role.Id;
            self.saveService.save(self.model, self.url.applicationPermissions + "/Post").then(successCallback, errorCallback);
        };
        ApplicationPermissionsController.prototype.update = function () {
            var _this = this;
            var self = this;
            var successCallback = function (response) {
                console.log(response);
                self.isUpdateMode = false;
                self.model = new App.ApplicationPermission();
                _this.search();
            };
            var errorCallback = function (error) {
                console.log(error);
                _this.search();
            };
            //self.Model.ResourceId = self.Resource.Id;
            //self.Model.RoleId = self.Role.Id;
            self.saveService.update(self.model, self.url.applicationPermissions).then(successCallback, errorCallback);
        };
        ApplicationPermissionsController.prototype.edit = function (p) {
            this.model = p;
            this.isUpdateMode = true;
        };
        ApplicationPermissionsController.prototype.delete = function (id) {
            var _this = this;
            var self = this;
            var successCallback = function (response) {
                console.log(response);
                self.isUpdateMode = false;
                self.model = new App.ApplicationPermission();
                _this.search();
            };
            var errorCallback = function (error) {
                console.log(error);
                _this.search();
            };
            self.saveService.delete(id, self.url.applicationPermissions).then(successCallback, errorCallback);
        };
        ApplicationPermissionsController.prototype.loadApplicationResources = function () {
            var self = this;
            self.models = [];
            var successCallback = function (response) {
                self.resources = response;
                for (var i = 0; i < self.resources.length; i++) {
                    var permissionModel = new App.ApplicationPermission();
                    permissionModel.resource = self.resources[i].name;
                    permissionModel.isAllowed = false;
                    permissionModel.resourceId = self.resources[i].id;
                    self.models.push(permissionModel);
                }
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService.get(self.url.applicationResourceQuery + '/Data').then(successCallback, errorCallback);
        };
        ApplicationPermissionsController.prototype.updateResourcePermissionsForRole = function () {
            var _this = this;
            var self = this;
            var latestPermissionViewModels = [];
            console.log(self.selectedResourcePermissionToUpdate);
            for (var key in self.selectedResourcePermissionToUpdate) {
                if (self.selectedResourcePermissionToUpdate.hasOwnProperty(key)) {
                    var permissionEntity = new App.ApplicationPermission();
                    permissionEntity.resourceId = self.selectedResourcePermissionToUpdate[key]["resourceId"];
                    permissionEntity.roleId = self.selectedRoleId;
                    permissionEntity.isAllowed = self.selectedResourcePermissionToUpdate[key]["isAllowed"];
                    console.log(permissionEntity);
                    latestPermissionViewModels.push(permissionEntity);
                }
            }
            var successCallback = function (response) {
                console.log(response);
                if (response.isSuccess) {
                    alert("Permission updated");
                    _this.activate();
                }
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            //self.Model.ResourceId = self.Resource.Id;
            //self.Model.RoleId = self.Role.Id;
            if (self.selectedRoleId && latestPermissionViewModels.length > 0) {
                self.saveService.save(latestPermissionViewModels, self.url.applicationPermissions + "/UpdatePermissionsForRole").then(successCallback, errorCallback);
            }
            else {
                console.log("No Update Call To Server");
            }
        };
        ApplicationPermissionsController.prototype.selectRole = function (roleId) {
            var self = this;
            console.log(roleId);
            self.isRoleSelected = true;
            self.selectedRoleId = roleId;
            var url = self.url.applicationPermissionQuery + '/GetPermissions/' + roleId;
            var alreadySelectedResources = {};
            var onSuccess = function (data) {
                if (data.length === 0) {
                    self.loadApplicationResources();
                }
                else {
                    alreadySelectedResources = {};
                    for (var i = 0; i < data.length; i++) {
                        alreadySelectedResources[data[i].resourceId] = data[i];
                    }
                    for (var j = 0; j < self.models.length; j++) {
                        if (alreadySelectedResources[self.models[j].resourceId] !== undefined) {
                            self.models[j].isAllowed = alreadySelectedResources[self.models[j].resourceId].isAllowed;
                        }
                        else {
                            self.models[j].isAllowed = false;
                        }
                    }
                }
            };
            var onError = function (err) {
            };
            self.searchService.get(url).then(onSuccess, onError);
        };
        ApplicationPermissionsController.prototype.selectResourcePermission = function (selectedResourcePermission) {
            var self = this;
            self.selectedResourcePermissionToUpdate[selectedResourcePermission.resourceId] = selectedResourcePermission;
        };
        ApplicationPermissionsController.$inject = ["$location", "UrlService", "SearchService", "SaveService"];
        return ApplicationPermissionsController;
    }());
    App.ApplicationPermissionsController = ApplicationPermissionsController;
    angular.module("app").controller("ApplicationPermissionsController", ApplicationPermissionsController);
})(App || (App = {}));
