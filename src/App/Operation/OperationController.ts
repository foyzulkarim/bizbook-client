module App {
    "use strict";

    export class OperationLogsController extends BaseController<any> {
        static $inject: string[] =
            [
                "$location", "$state", "$stateParams",
                "UrlService", "SearchService", "AuthService", 'Excel'
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
            super(location, state, stateParams, url, search, save, authService, url.operationLog, url.operationLogsQuery, excel);
            this.searchRequest.perPageCount = 50;
            this.searchRequest.isIncludeParents = true;

            this.search();
        }

    }

    angular.module('app').controller('OperationLogsController', OperationLogsController);

    export class OperationLogDetailController extends BaseController<any> {
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
            super(location, state, stateParams, url, search, save, authService, url.operationLog, url.operationLogsQuery, excel);

            if (this.stateParams["id"]) {
                this.loadDetail();
            } else {
                this.back();
            }
        }


        loadDetail(): void {
            console.log(this.stateParams);
            var self = this;
            var successCallback = (response: SearchResponse): void => {
                self.model = response.data;
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            var searchRequest = new SearchRequest();
            searchRequest.id = this.stateParams["id"];
            searchRequest.page = -1;

            var id = this.stateParams["id"];

            var httpUrl = self.url.operationLogsQuery + "/SearchDetail?id=" + id;

            self.searchService
                .search(searchRequest, httpUrl)
                .then(<any>successCallback, errorCallback);
        }
    }

    angular.module('app').controller("OperationLogDetailController", OperationLogDetailController);

    export class OperationLogDetailHistoryController extends BaseController<any> {
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
            super(location, state, stateParams, url, search, save, authService, url.operationLogDetail, url.operationLogDetailQuery, excel);
           
        }

        search(): void {
            var self = this;

            if (self.searchRequest.keyword.length < 3) {
                return;
            }
            var successCallback = (response: SearchResponse): void => {

                self.models = <any>response.Models;

                if (self.models.length === 0) {
                    console.log('No search result found');
                }
                
                else {
                    for (let i = 0; i < self.models.length; i++) {
                        let m = self.models[i];
                    }
                }

                self.totalCount = response.Count;
                self.searchRequest.totalPage = Math.ceil(response.Count / 10);
            };

            var errorCallback = (error: any): void => {
                console.log(error);
            };
            
            self.searchService.search(self.searchRequest, self.url.operationLogDetailQuery + "/Search")
                .then(successCallback, errorCallback);
        }
        
    }

    angular.module('app').controller("OperationLogDetailHistoryController", OperationLogDetailHistoryController);
}