module App {
    "use strict";

    export class SmsHooksController extends BaseController<SmsHook> {
        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        constructor(
            location: angular.ILocationService,
            state: angular.ui.IStateService,
            stateParams: angular.ui.IStateParamsService,
            url: UrlService,
            search: SearchService,
            save: SaveService,
            authService: AuthService,
            excel: any

        ) {
            super(location, state, stateParams, url, search, save, authService, url.smsHook, url.smsHookQuery, excel);
            this.search();
        }


        search(): void {
            var self = this;
            var successCallback = (response: SearchResponse): void => {
                console.log(response);
              self.models = <any>response.Models;
                if (self.models.length === 0) {
                    console.log('No search result found');
                    alert('No search result found');
                } else {
                    self.csvModels = [];
                    for (let i = 0; i < self.models.length; i++) {
                        self.csvModels.push(self.generateCsvModel(self.models[i]));
                    }
                }

                self.searchRequest.totalPage = Math.ceil(response.Count / 10);
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            self.searchService
                .search(self.searchRequest, self.queryUrl + "/SearchHooks")
                .then(<any>successCallback, errorCallback);
        }

    }

    angular.module("app").controller("SmsHooksController", SmsHooksController);


    export class SmsHookController extends BaseController<SmsHook>{

        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        selectedRow: number;
        constructor(
            location: angular.ILocationService,
            state: angular.ui.IStateService,
            stateParams: angular.ui.IStateParamsService,
            url: UrlService,
            search: SearchService,
            save: SaveService,
            authService: AuthService,
            excel: any

        ) {
            super(location, state, stateParams, url, search, save, authService, url.smsHook, url.smsHookQuery, excel);
            this.selectedRow = null;
            this.isUpdateMode = false;
            if (this.stateParams["id"]) {
                this.isUpdateMode = true;
                this.edit2(this.stateParams["id"]);
            }
        }
    }

    angular.module("app").controller("SmsHookController", SmsHookController);


    export class HookDetailsController extends BaseController<HookDetail>{

        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        constructor(
            location: angular.ILocationService,
            state: angular.ui.IStateService,
            stateParams: angular.ui.IStateParamsService,
            url: UrlService,
            search: SearchService,
            save: SaveService,
            authService: AuthService,
            excel: any
        ) {
            super(location, state, stateParams, url, search, save, authService, url.hookDetail, url.hookDetailQuery, excel);
            this.search();
        }
    }

    angular.module("app").controller("HookDetailsController", HookDetailsController);

    export class HookDetailController extends BaseController<HookDetail>{
        
        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        selectedRow: number;
        constructor(
            location: angular.ILocationService,
            state: angular.ui.IStateService,
            stateParams: angular.ui.IStateParamsService,
            url: UrlService,
            search: SearchService,
            save: SaveService,
            authService: AuthService,
            excel: any
        ) {
            super(location, state, stateParams, url, search, save, authService, url.hookDetail, url.hookDetailQuery, excel);
            this.loadSmsHooks();
            this.selectedRow = null;
            this.isUpdateMode = false;
            if (this.stateParams["id"]) {
                this.isUpdateMode = true;
                this.edit2(this.stateParams["id"]);
            }
        }

        smsHooks: SmsHook[];
        loadSmsHooks(): void {
            var self = this;
            var successCallback = (response: any): void => {
                console.log(response);
                self.smsHooks = response.Models;
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            self.searchService
                .search(self.searchRequest, self.url.smsHookQuery + "/Dropdown")
                .then(<any>successCallback, errorCallback);
        }

        groupChanged(): void {
            console.log(this.model.smsHookId);
        }
    }

    angular.module("app").controller("HookDetailController", HookDetailController);

}