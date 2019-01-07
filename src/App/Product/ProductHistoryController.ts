
module App {
    "use strict";

    export class ProductHistoryController extends BaseController<any> {

        searchRequest: PurchaseHistorySearchRequest;
        productDetailViewModel: ProductDetailViewModel;

        headers = ["invoiceNumber", "date", "type", "unitPrice","total"];

        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];

        totalPendingQuantity = 0;
        totalProcessingQuantity = 0;
        totalDoneQuantity = 0;
        totalPurchaseQuantity = 0;
        totalUnitPrice = 0;
        totalAmount = 0;
        selectedRow: number;
        selectedWarehouseId: string;

        constructor(
            location: angular.ILocationService,
            $state: angular.ui.IStateService,
            $stateParams: angular.ui.IStateParamsService,
            url: UrlService,
            searchService: SearchService,
            saveService: SaveService,
            auth: AuthService,
            localStorageService: LocalStorageService,
            excel: any
            ) {
            super(location, $state, $stateParams, url, searchService, saveService, auth, url.productDetail, url.productDetailQuery, excel);
            if (this.stateParams["id"]) {
                this.loadProductHistory();
                this.loadWarehouses();
                
            } else {
                this.back();
            }

            this.localStorageService = localStorageService;
            this.searchRequest.startDate = this.startDate.toJSON();
            this.searchRequest.endDate = this.endDate.toJSON();

        }

        detail(p: ProductCategory, index: number): void {
            this.selectedRow = index;
        }

        selectWarehouse(): void {
            var self = this;

            var successCallback = (response: SearchResponse): void => {
                self.productDetailViewModel = response.data["item1"];
                self.models = response.data["item2"];
                self.csvModels = [];
                for (let i = 0; i < self.models.length; i++) {
                    // do your stuff for csv model generation
                    self.csvModels.push(self.generateCsvModel(self.models[i]));
                }

            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };

            var searchRequest = new ProductHistorySearchRequest('', 'Modified', 'false');
            searchRequest.warehouseId = self.selectedWarehouseId;//'1ec5b7ae-ef89-4ae1-b8c3-c89863a35a2e'
            searchRequest.parentId = this.stateParams["id"];
            searchRequest.page = 1;
            searchRequest.perPageCount = 100;

            self.searchService
                .search(searchRequest, self.url.productDetailQuery + "/History")
                .then(<any>successCallback, errorCallback);

        }

        loadProductHistory(): void {
            var self = this;
            self.totalPendingQuantity = 0;
            self.totalProcessingQuantity = 0;
            self.totalDoneQuantity = 0;
            self.totalPurchaseQuantity = 0;
            self.totalUnitPrice = 0;
            self.totalAmount = 0;
            var successCallback = (response: SearchResponse): void => {
                self.productDetailViewModel = response.data["item1"];
                self.models = response.data["item2"];
                self.csvModels = [];
                for (let i = 0; i < self.models.length; i++) {
                    
                    let m = self.models[i];

                    if (m.type === 'Sale' && m.orderState == 1){
                        self.totalPendingQuantity += m.quantity;
                    }
                    if (m.type === 'Sale' &&  m.orderState > 1 && m.orderState < 5) {
                        self.totalProcessingQuantity += m.quantity;
                    }
                    if (m.type === 'Sale' && m.orderState > 4 && m.orderState < 7) {
                        self.totalDoneQuantity += m.quantity;
                    }
                    if (m.type === 'Purchase') {
                        self.totalPurchaseQuantity += m.quantity;
                    }

                    self.totalUnitPrice += m.unitPrice;
                    self.totalAmount += m.total;

                    // do your stuff for csv model generation
                    self.csvModels.push(self.generateCsvModel(self.models[i]));
                }

            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };

            //var searchRequest = new SearchRequest();

            var searchRequest = new ProductHistorySearchRequest('', 'Modified', 'false');
            //searchRequest.warehouseId = '1ec5b7ae-ef89-4ae1-b8c3-c89863a35a2e';
            searchRequest.startDate = this.startDate.toJSON();
            searchRequest.endDate = this.endDate.toJSON();
            searchRequest.parentId = this.stateParams["id"];
            searchRequest.page = 1;
            searchRequest.perPageCount = 100;
            self.searchService
                .search(searchRequest, self.url.productDetailQuery + "/History")
                .then(<any>successCallback, errorCallback);
        }

    }

    angular.module("app").controller("ProductHistoryController", ProductHistoryController);

}



