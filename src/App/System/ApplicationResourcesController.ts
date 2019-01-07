module App {
    "use strict";

    export class ApplicationResourcesController implements angular.IController {
        $onInit(): void { }

        // angular ui params
        stateService: angular.ui.IStateService;
        stateParams: angular.ui.IStateParamsService;

        searchService: SearchService;
        saveService: SaveService;
        url: UrlService;
        searchRequest: SearchRequest;
        isUpdateMode: boolean;
        models: ApplicationResource[];
        

        static $inject: string[] = ["$location", "$state", "$stateParams", "UrlService", "SearchService", "SaveService"];

        constructor(private $location: angular.ILocationService, $state: angular.ui.IStateService,
            $stateParams: angular.ui.IStateParamsService, url: UrlService, search: SearchService, save: SaveService, ) {
            this.url = url;
            this.searchService = search;
            this.saveService = save;
            this.stateService = $state;
            this.stateParams = $stateParams;
            this.isUpdateMode = false;
            this.activate();

        }

        activate() {
            console.log('i m in ApplicationResourcesController');
            this.models = [];
            this.searchRequest = new SearchRequest("", "Modified", "False", "");
            this.search();

        }

        search(): void {
            var self = this;
            var successCallback = (response: SearchResponse): void => {
                console.log(response);
                self.models = <any>response;
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            self.searchService.get(self.url.applicationResourceQueryData).then(<any>successCallback, errorCallback);
        }
    }

    angular.module("app").controller("ApplicationResourcesController", ApplicationResourcesController); 



    export class ApplicationResourceController implements angular.IController {
        $onInit(): void { }

        // angular ui params
        stateService: angular.ui.IStateService;
        stateParams: angular.ui.IStateParamsService;

        searchService: SearchService;
        saveService: SaveService;
        url: UrlService;
        searchRequest: SearchRequest;
        isUpdateMode: boolean;
        model: ApplicationResource;
        

        static $inject: string[] = ["$location", "$state", "$stateParams", "UrlService", "SearchService", "SaveService"];

        constructor(private $location: angular.ILocationService, $state: angular.ui.IStateService,
            $stateParams: angular.ui.IStateParamsService, url: UrlService, search: SearchService, save: SaveService, ) {
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

        activate() {
            console.log('i m in ApplicationUsersController');
            this.model = new ApplicationResource();
            this.searchRequest = new SearchRequest("", "Modified", "False", "");

        }

     

     
        save(): void {
            var self = this;
            var successCallback = (response: BaseResponse): void => {
                console.log(response);
                self.model = new ApplicationResource();
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            self.saveService.save(<any>self.model, self.url.applicationResources + "/PostApplicationResource").then(<any>successCallback, errorCallback);
        }

        update(): void {
            var self = this;

            var successCallback = (response: BaseResponse): void => {
                console.log(response);
                self.isUpdateMode = false;
                self.model = new ApplicationResource();
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };

            self.saveService.update(<any>self.model, self.url.applicationResources + "/PutApplicationResource").then(<any>successCallback, errorCallback);
        }

        //edit(p: ApplicationUser): void {
        //    this.model = p;
        //    this.isUpdateMode = true;
        //}

        edit(id: string): void {
            ;
            var self = this;

            var url = self.url.applicationResources + '/GetApplicationResource/' + id;

            var onSuccess = (data: any) => {
                self.model = data;

            }

            var onError = (err: any) => {
                alert('Error occurred');
            }

            self.searchService.get(url).then(onSuccess, onError);
        }

        delete(id: string): void {
            var self = this;
            var successCallback = (response: BaseResponse): void => {
                console.log(response);
                self.isUpdateMode = false;
                self.model = new ApplicationResource();
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            self.saveService.delete(id, self.url.applicationResources).then(successCallback, errorCallback);
        }
    
    }

    angular.module("app").controller("ApplicationResourceController", ApplicationResourceController);
}
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