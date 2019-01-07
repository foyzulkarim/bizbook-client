
module App {
    "use strict";

    export class ApplicationUsersController implements angular.IController {
        $onInit(): void { }

        // angular ui params
        stateService: angular.ui.IStateService;
        stateParams: angular.ui.IStateParamsService;

        searchService: SearchService;
        saveService: SaveService;
        url: UrlService;
        searchRequest: SearchRequest;
        isUpdateMode: boolean;
        models: ApplicationUser[];
        

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
            console.log('i m in ApplicationUsersController');
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
            self.searchService.get(self.url.applicationUserQueryData).then(<any>successCallback, errorCallback);
        }
    }

    angular.module("app").controller("ApplicationUsersController", ApplicationUsersController); 

    export class ApplicationUserController implements angular.IController {
        $onInit(): void { }

        // angular ui params
        stateService: angular.ui.IStateService;
        stateParams: angular.ui.IStateParamsService;

        searchService: SearchService;
        saveService: SaveService;
        url: UrlService;
        searchRequest: SearchRequest;
        isUpdateMode: boolean;
        models: ApplicationUser[];
        model: ApplicationUser;
        role: ApplicationRole;
        roles: ApplicationRole[];
        
        shops: Shop[];

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
            this.models = [];
            this.model = new ApplicationUser();
            this.roles = [];
            this.shops = [];
            this.role = new ApplicationRole();
            this.searchRequest = new SearchRequest("", "Modified", "False", "");
           // this.search();
            this.setupDropdowns();
            this.loadShopDropdown();

        }

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

        setupDropdowns(): void {
            var self = this;

            var success = (response: any) => {
                this.roles = response;
                console.log(response);
            };

            var error = error => {
                console.log(error);
                alert('Error occurred');
            };

            self.searchService.get(self.url.roleDropdown).then(success, error);
        }

        loadShopDropdown(): void {
            var self = this;
            var successCallback = (response: SearchResponse): void => {
                console.log('shops ', response);
                self.shops = <any>response.Models;
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            var shopRequest = new SearchRequest("", "Modified", "False","");
            self.searchService
                .search(shopRequest, self.url.shopQuery + "/Dropdown")
                .then(<any>successCallback, errorCallback);            
        }


      

        goto(page: number): void {
            this.searchRequest.page = page;
            //this.search();
        }

        save(): void {
            var self = this;
            var successCallback = (response: BaseResponse): void => {
                console.log(response);
                self.model = new ApplicationUser();
                //this.search();
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            self.saveService.save(<any>self.model, self.url.applicationUsers +"/PostApplicationUser").then(<any>successCallback, errorCallback);
        }

        update(): void {
            var self = this;

            var successCallback = (response: BaseResponse): void => {
                console.log(response);
                self.isUpdateMode = false;
                self.model = new ApplicationUser();
                //this.search();
            };
            var errorCallback = (error: any): void => {
                console.log(error);
               // this.search();
            };

            self.saveService.update(<any>self.model, self.url.applicationUsers + "/PutApplicationUser").then(<any>successCallback, errorCallback);
        }

        //edit(p: ApplicationUser): void {
        //    this.model = p;
        //    this.isUpdateMode = true;
        //}

        edit(id: string): void {
            ;
            var self = this;

            var url = self.url.applicationUsers + '/GetApplicationUser/' + id;

            var onSuccess = (data: any) => {
                self.model = data;
                self.model.roleId = self.model["roles"][0]["roleId"];

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
                self.model = new ApplicationUser();
               // this.search();
            };
            var errorCallback = (error: any): void => {
                console.log(error);
               // this.search();
            };
            self.saveService.delete(id, self.url.applicationUsers + "/DeleteApplicationUser").then(successCallback, errorCallback);
        }
    }

    angular.module("app").controller("ApplicationUserController", ApplicationUserController);
}