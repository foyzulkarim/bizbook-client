
module App {
    "use strict";

    export class PurchaseHistoryController extends BaseController<Purchase> {

        searchRequest: PurchaseHistorySearchRequest;


        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService",'Excel'
        ];
        selectedRow: number;
        constructor(
            location: angular.ILocationService,
            $state: angular.ui.IStateService,
            $stateParams: angular.ui.IStateParamsService,
            url: UrlService,
            searchService: SearchService,
            saveService: SaveService,
            auth: AuthService,
            excel: any
        ) {
            super(location, $state, $stateParams, url, searchService, saveService, auth, url.purchase, url.purchaseQuery, excel);
            this.selectedRow = null;
        }

        activate(): void {

            console.log(this.stateParams);
            console.log('Activated');
            this.loadSupplierHistory();
        }

        detail(p: ProductCategory, index: number): void {
            this.selectedRow = index;
        }

        loadSupplierHistory(): void {
            var self = this;
            var successCallback = (response: SearchResponse): void => {
                this.models = response.data["item1"];

            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            var searchRequest = new SearchRequest();
            searchRequest.parentId = this.stateParams["purchase"];
            searchRequest.page = -1;
            self.searchService
                .search(searchRequest, self.url.supplierQuery + "/History")
                .then(<any>successCallback, errorCallback);
        }

    }

    angular.module("app").controller("PurchaseHistoryController", PurchaseHistoryController);

}


