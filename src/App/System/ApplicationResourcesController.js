var App;
(function (App) {
    "use strict";
    var ApplicationResourcesController = /** @class */ (function () {
        function ApplicationResourcesController($location, $state, $stateParams, url, search, save) {
            this.$location = $location;
            this.url = url;
            this.searchService = search;
            this.saveService = save;
            this.stateService = $state;
            this.stateParams = $stateParams;
            this.isUpdateMode = false;
            this.activate();
        }
        ApplicationResourcesController.prototype.$onInit = function () { };
        ApplicationResourcesController.prototype.activate = function () {
            console.log('i m in ApplicationResourcesController');
            this.models = [];
            this.searchRequest = new App.SearchRequest("", "Modified", "False", "");
            this.search();
        };
        ApplicationResourcesController.prototype.search = function () {
            var self = this;
            var successCallback = function (response) {
                console.log(response);
                self.models = response;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService.get(self.url.applicationResourceQueryData).then(successCallback, errorCallback);
        };
        ApplicationResourcesController.$inject = ["$location", "$state", "$stateParams", "UrlService", "SearchService", "SaveService"];
        return ApplicationResourcesController;
    }());
    App.ApplicationResourcesController = ApplicationResourcesController;
    angular.module("app").controller("ApplicationResourcesController", ApplicationResourcesController);
    var ApplicationResourceController = /** @class */ (function () {
        function ApplicationResourceController($location, $state, $stateParams, url, search, save) {
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
        ApplicationResourceController.prototype.$onInit = function () { };
        ApplicationResourceController.prototype.activate = function () {
            console.log('i m in ApplicationUsersController');
            this.model = new App.ApplicationResource();
            this.searchRequest = new App.SearchRequest("", "Modified", "False", "");
        };
        ApplicationResourceController.prototype.save = function () {
            var self = this;
            var successCallback = function (response) {
                console.log(response);
                self.model = new App.ApplicationResource();
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.saveService.save(self.model, self.url.applicationResources + "/PostApplicationResource").then(successCallback, errorCallback);
        };
        ApplicationResourceController.prototype.update = function () {
            var self = this;
            var successCallback = function (response) {
                console.log(response);
                self.isUpdateMode = false;
                self.model = new App.ApplicationResource();
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.saveService.update(self.model, self.url.applicationResources + "/PutApplicationResource").then(successCallback, errorCallback);
        };
        //edit(p: ApplicationUser): void {
        //    this.model = p;
        //    this.isUpdateMode = true;
        //}
        ApplicationResourceController.prototype.edit = function (id) {
            ;
            var self = this;
            var url = self.url.applicationResources + '/GetApplicationResource/' + id;
            var onSuccess = function (data) {
                self.model = data;
            };
            var onError = function (err) {
                alert('Error occurred');
            };
            self.searchService.get(url).then(onSuccess, onError);
        };
        ApplicationResourceController.prototype.delete = function (id) {
            var self = this;
            var successCallback = function (response) {
                console.log(response);
                self.isUpdateMode = false;
                self.model = new App.ApplicationResource();
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.saveService.delete(id, self.url.applicationResources).then(successCallback, errorCallback);
        };
        ApplicationResourceController.$inject = ["$location", "$state", "$stateParams", "UrlService", "SearchService", "SaveService"];
        return ApplicationResourceController;
    }());
    App.ApplicationResourceController = ApplicationResourceController;
    angular.module("app").controller("ApplicationResourceController", ApplicationResourceController);
})(App || (App = {}));
//module App {
//    "use strict";
//    export class ApplicationResourcesController {
//        searchService: SearchService;
//        saveService: SaveService;
//        url: UrlService;
//        searchRequest: SearchRequest;
//        isUpdateMode: boolean;
//        models: ApplicationResource[];
//        model: ApplicationResource;
//        static $inject: string[] = ["$location", "UrlService", "SearchService", "SaveService"];
//        constructor(private $location: angular.ILocationService, url: UrlService, search: SearchService, save: SaveService, ) {
//            this.url = url;
//            this.searchService = search;
//            this.saveService = save;
//            this.isUpdateMode = false;
//            this.activate();
//        }
//        activate() {
//            console.log('i m in ApplicationResourcesController');
//            this.models = [];
//            this.model = new ApplicationResource();
//            this.searchRequest = new SearchRequest("", "Modified", "False", "");
//            this.search();
//        }
//        search(): void {
//            var self = this;
//            var successCallback = (response: SearchResponse): void => {
//                console.log(response);
//                self.models = <any>response;
//                console.log(self.models);
//            };
//            var errorCallback = (error: any): void => {
//                console.log(error);
//            };
//            self.searchService.get(self.url.applicationResourceQueryData).then(<any>successCallback, errorCallback);
//        }
//        goto(page: number): void {
//            this.searchRequest.page = page;
//            this.search();
//        }
//        save(): void {
//            var self = this;
//            var successCallback = (response: BaseResponse): void => {
//                console.log(response);
//                self.model = new ApplicationResource();
//                this.search();
//            };
//            var errorCallback = (error: any): void => {
//                console.log(error);
//            };
//            // self.Model.Id = "4d524ba7-e4b4-485b-931b-6a298542a530";
//            self.saveService.save(<any>self.model, self.url.applicationResources + "/PostApplicationResource").then(<any>successCallback, errorCallback);
//        }
//        update(): void {
//            var self = this;
//            var successCallback = (response: BaseResponse): void => {
//                console.log(response);
//                self.isUpdateMode = false;
//                self.model = new ApplicationResource();
//                this.search();
//            };
//            var errorCallback = (error: any): void => {
//                console.log(error);
//                this.search();
//            };
//            self.saveService.update(<any>self.model, self.url.applicationResources).then(<any>successCallback, errorCallback);
//        }
//        edit(p: ApplicationResource): void {
//            this.model = p;
//            this.isUpdateMode = true;
//        }
//        delete(id: string): void {
//            var self = this;
//            var successCallback = (response: BaseResponse): void => {
//                console.log(response);
//                self.isUpdateMode = false;
//                self.model = new ApplicationResource();
//                this.search();
//            };
//            var errorCallback = (error: any): void => {
//                console.log(error);
//                this.search();
//            };
//            self.saveService.delete(id, self.url.applicationResources).then(successCallback, errorCallback);
//        }
//    }
//    angular.module("app").controller("ApplicationResourcesController", ApplicationResourcesController);
//}
