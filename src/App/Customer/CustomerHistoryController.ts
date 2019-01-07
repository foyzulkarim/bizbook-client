
module App {
    "use strict";

    export class CustomerHistoryController extends BaseController<Sale> {

        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService",'Excel'
        ];
        headers = ["date", "invoiceNumber", "transactionNumber", "type", "total","paid"];

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
            super(location, $state, $stateParams, url, searchService, saveService, auth, url.customer, url.customerQuery, excel);
            if (this.stateParams["id"]) {
                this.loadCustomerHistory();
            }
        }

        response: any;


        loadCustomerHistory(): void {
            var self = this;
            var successCallback = (response: SearchResponse): void => {
                self.response = response.data;
                Display.log('i am in customer history', self.response);
                self.csvModels = [];
                for (let i = 0; i < self.response.histories.length; i++) {
                    // do your stuff for csv model generation
                    self.csvModels.push(self.generateCsvModel(self.response.histories[i]));
                }
            };
            var errorCallback = (error: any): void => {
                console.log(error);
                alert('Error occurred');
            };
            var searchRequest = new SearchRequest();
            searchRequest.parentId = this.stateParams["id"];
            searchRequest.page = -1;
            self.searchService
                .search(searchRequest, self.url.saleQuery + "/BuyerHistory")
                .then(<any>successCallback, errorCallback);
        }

    }

    angular.module("app").controller("CustomerHistoryController", CustomerHistoryController);

    export class CustomerProductHistoryController extends BaseController<Sale>{
        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        totalQuantity = 0;
        totalUnitPrice = 0;
        totalPrice = 0;
      
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
            super(location, $state, $stateParams, url, searchService, saveService, auth, url.customer, url.customerQuery, excel);
            if (this.stateParams["id"]) {
                this.loadCustomerProductHistory();
            }
        }
        response: any;
        loadCustomerProductHistory(): void {
            var self = this;
            self.totalUnitPrice = 0;
            self.totalQuantity = 0;
            self.totalPrice = 0;
            var successCallback = (response: SearchResponse): void => {
                self.response = response.data;
                Display.log('i am in customer history', self.response);
                self.csvModels = [];
                for (let i = 0; i < self.response.histories.length; i++) {
                    self.totalUnitPrice += self.response.histories[i].unitPrice;
                    self.totalQuantity += self.response.histories[i].quantity;
                    self.totalPrice += self.response.histories[i].total;
                    // do your stuff for csv model generation
                    self.csvModels.push(self.generateCsvModel(self.response.histories[i]));

                }
            };
            var errorCallback = (error: any): void => {
                console.log(error);
                alert('Error occurred');
            };
            var searchRequest = new SearchRequest();
            searchRequest.parentId = this.stateParams["id"];
            searchRequest.page = -1;            
            self.searchService
                .search(searchRequest, self.url.saleQuery + "/ProductHistory")
                .then(<any>successCallback, errorCallback);            
        }
    }
    angular.module("app").controller("CustomerProductHistoryController", CustomerProductHistoryController);

    export class CustomerProductViewController extends BaseController<Sale>{
        static $inject: string[] =
            [
                "$location", "$state", "$stateParams",
                "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
            ];
        totalQuantity = 0;
        totalUnitPrice = 0;
        totalPrice = 0;

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
            super(location, $state, $stateParams, url, searchService, saveService, auth, url.customer, url.customerQuery, excel);
            if (this.stateParams["id"]) {
                this.loadCustomerProductView();
            }
        }
        response: any;
        loadCustomerProductView(): void {
            var self = this;
            self.totalUnitPrice = 0;
            self.totalQuantity = 0;
            self.totalPrice = 0;
            var successCallback = (response: SearchResponse): void => {
                self.response = response.data;
                Display.log('i am in customer history', self.response);
                self.csvModels = [];
                for (let i = 0; i < self.response.histories.length; i++) {
                    self.totalUnitPrice += self.response.histories[i].price;
                    self.totalQuantity += self.response.histories[i].quantity;
                    self.totalPrice += self.response.histories[i].total;
                    // do your stuff for csv model generation
                    self.csvModels.push(self.generateCsvModel(self.response.histories[i]));

                }
            };
            var errorCallback = (error: any): void => {
                console.log(error);
                alert('Error occurred');
            };
            var searchRequest = new SearchRequest();
            searchRequest.parentId = this.stateParams["id"];
            // searchRequest.customerId = this.stateParams["id"]
            searchRequest.page = -1;
            self.searchService
                .search(searchRequest, self.url.customerQuery + "/CustomerProductView")
                .then(<any>successCallback, errorCallback);
        }
    }
    angular.module("app").controller("CustomerProductViewController", CustomerProductViewController);

}


