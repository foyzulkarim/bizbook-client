module App {

    export class ProductDetailsAmountReportController extends BaseReportController implements angular.IController {

        $onInit(): void { }
        static $inject: string[] = ["$scope", "UrlService", "SearchService"];
        constructor(scope: angular.IScope, url: UrlService, search: SearchService) {
            super(scope, url, search, 'ProductDetail-report-');
            this.title = "Product Detail By Amount";
            this.loadData();
        }

        loadData() {
            var successCallback = (response: SearchResponse): void => {
                console.log(response.data);
                this.gridOptions["data"] = response.data;
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };

            var request = new SearchRequest("", "Date", "False");
            request["ReportType"] = "Daily";
            request.shopId = "1";
            request.page = -1;
            request.startDate = this.startDate.toJSON();
            request["ProductReportType"] = "ProductDetailByAmount";
            this.searchService.search(request, this.urlService.productDetailQueryReport).then(<any>successCallback, errorCallback);
        }
    }

    angular.module('app').controller("ProductDetailsAmountReportController", ProductDetailsAmountReportController);


    export class ProductDetailsHistoryReportController extends BaseReportController implements angular.IController {

        $onInit(): void { }
        static $inject: string[] = ["$scope", "UrlService", "SearchService"];
        constructor(scope: angular.IScope, url: UrlService, search: SearchService) {
            super(scope, url, search, 'ProductDetail-report-');

            var self = this;
            self.hideDropdown = false;
            self.hideStartDate = true;
            self.title = "Product Detail History";
            self.loadDropdown();
        }

        loadData() {
            var successCallback = (response: SearchResponse): void => {
                console.log(response.data);
                this.gridOptions["data"] = response.data;
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };

            var request = new SearchRequest("", "Date", "False");
            request["ReportType"] = "Daily";
            request.shopId = "1";
            request.page = -1;
            request["ProductReportType"] = "ProductDetailByAmount";
            request['ProductDetailId'] = this.selectedItem.id;
            this.searchService.search(request, this.urlService.productDetailQueryReport).then(<any>successCallback, errorCallback);
        }

        loadDropdown(): void {
            var self = this;
            var successCallback = (response: SearchResponse): void => {
                console.log('items ', response);
                self.items = <any>response.Models;
                self.selectedItem = self.items[0];
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            var request = new SearchRequest("", "Name", "True", "");
            self.searchService
                .search(request, self.urlService.productDetailQuery + "/Dropdown")
                .then(<any>successCallback, errorCallback);
        }

        dropdownChanged(): void {
            this.loadData();
        }

    }

    angular.module('app').controller("ProductDetailsHistoryReportController", ProductDetailsHistoryReportController);


    export class ProductDetailsHistoryReport2Controller extends BaseController<ProductReport> implements angular.IController {

        $onInit(): void { }
        selectedItem: any = "";
        productDetails: any[];
        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'localStorageService', 'Excel'

        ];

        totalQuantityStartToday = 0;
        totalQuantityEndingToday = 0;
        totalQuantityPurchaseToday = 0;
        totalQuantitySalePendingToday = 0;
        totalQuantitySaleProcessingToday = 0;
        totalQuantitySaleDoneToday = 0;
        totalAmountSaleToday = 0;
        totalAmountCostForSaleToday = 0;

        chartLabels: string[];
        chartData: number[];

        productDropdownRequest: SearchRequest;

        //headers = ["amountAveragePurchasePricePerUnitToday", "amountAverageSalePriceToday", "amountCostForSaleToday", "amountPaidToday", "amountPayableToday", "amountProfitPercentInAllProductsToday", "amountProfitPercentToday", "amountProfitToday", "amountPurchasePercentInAllProductsToday", "amountPurchaseToday", "amountReceivableToday", "amountReceivedToday", "amountSalePercentInAllProductsToday", "amountSaleToCustomerToday", "amountSaleToDealerToday","amountSaleToday",];
        headers = ["date", "productDetailName", "quantityStartingToday", "quantityEndingToday", "quantityPurchaseToday", "quantitySaleToday", "amountSaleToday", "amountCostForSaleToday"];

        constructor(location: angular.ILocationService,
            state: angular.ui.IStateService,
            stateParams: angular.ui.IStateParamsService,
            url: UrlService,
            search: SearchService,
            save: SaveService,
            authService: AuthService,
            localStorageService: LocalStorageService,
            excel: any
        ) {
            super(location, state, stateParams, url, search, save, authService, url.productDetailQueryReport, url.productDetailQueryReport, excel);
            var self = this;
            self.localStorageService = localStorageService;
            self.productDropdownRequest = new SearchRequest();
            self.productDropdownRequest["isProductActive"] = true;           
            self.loadDropdown();   
            self.searchRequest = new SearchRequest();

            self.loadWarehouses().then(result => {                
                if (self.warehouses.length === 1) {
                    self.searchRequest.warehouseId = self.warehouses[0].id;
                }
                else {
                    self.searchRequest.warehouseId = self.warehouses[0].id;
                    let whId = self.localStorageService.get(LocalStorageKeys.WarehouseId);
                    if (whId != null) {
                        self.searchRequest.warehouseId = whId;
                    }
                }

                self.loadData();
            });      
        }

        loadData(): void {
            var self = this;

            self.totalQuantityStartToday = 0;
            self.totalQuantityEndingToday = 0;
            self.totalQuantityPurchaseToday = 0;
            self.totalQuantitySalePendingToday = 0;
            self.totalQuantitySaleProcessingToday = 0;
            self.totalQuantitySaleDoneToday = 0;
            self.totalAmountSaleToday = 0;
            self.totalAmountCostForSaleToday = 0;

            var successCallback = (response: SearchResponse): void => {
                self.models = response.data.item2;
                self.csvModels = [];

                self.chartLabels = [];
                self.chartData = [];
                for (var i = 0; i < self.models.length; i++) {
                    self.csvModels.push(self.generateCsvModel(self.models[i]));
                }

                for (let i = 0; i < response.data.item2.length; i++) {
                    self.totalQuantityStartToday += response.data.item2[i].quantityStartingToday;
                    self.totalQuantityEndingToday += response.data.item2[i].quantityEndingToday;
                    self.totalQuantityPurchaseToday += response.data.item2[i].quantityPurchaseToday;
                    self.totalQuantitySalePendingToday += response.data.item2[i].quantitySalePendingToday;
                    self.totalQuantitySaleProcessingToday += response.data.item2[i].quantitySaleProcessingToday;
                    self.totalQuantitySaleDoneToday += response.data.item2[i].quantitySaleDoneToday;
                    self.totalAmountSaleToday += response.data.item2[i].amountSaleToday;
                    self.totalAmountCostForSaleToday += response.data.item2[i].amountCostForSaleToday;

                    self.chartLabels.push(self.models[i].modified);
                    self.chartData.push(self.models[i].amountPaidToday);
                }


            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };

            var request = new SearchRequest();
            request["startDate"] = self.startDate.toLocaleString();
            request["endDate"] = self.endDate.toLocaleString();
            request.shopId = "1";
            request.page = -1;
            request["productReportType"] = "ProductDetailHistory";
            request['parentId'] = self.selectedItem.id;
            request['warehouseId'] = self.searchRequest.warehouseId;
            this.searchService.search(request, self.url.productDetailQuery+'/HistoryByDate').then(<any>successCallback, errorCallback);
        }

        loadDropdown(): void {
            var self = this;
            var successCallback = (response: SearchResponse): void => {
                self.productDetails = <any>response.Models;
                self.selectedItem = self.productDetails[0];                
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            
            self.productDropdownRequest.page = -1;
            self.searchService
                .search(self.productDropdownRequest, self.url.productDetailQuery + "/Dropdown")
                .then(<any>successCallback, errorCallback);
        }

        dropdownChanged(): void {
            var self = this;
            self.loadData();
        }

        selectedTypeAhead(a: any, b: any, c: any, d: any): void {
            Display.log(this.selectedItem);

        }

    }

    angular.module('app').controller("ProductDetailsHistoryReport2Controller", ProductDetailsHistoryReport2Controller);


    export class ProductDetailsStockReportController extends BaseController<ProductReport> implements angular.IController {
        $onInit(): void { }

        selectedItem: any = "";
        productDetails: any[];
        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
                "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService",
        ];
        totalQuantityStartToday = 0;
        totalQuantityEndingToday = 0;
        totalQuantityPurchaseToday = 0;
        totalQuantitySaleToday = 0;
        totalAmountSaleToday = 0;
        totalAmountCostForSaleToday = 0;

        chartLabels: string[];
        chartData: number[];

        headers = ["date", "productDetailName", "quantityStartingToday", "quantityEndingToday", "quantityPurchaseToday", "quantitySaleToday", "amountSaleToday", "amountCostForSaleToday", 'Excel'];


        constructor(location: angular.ILocationService,
            state: angular.ui.IStateService,
            stateParams: angular.ui.IStateParamsService,
            url: UrlService,
            search: SearchService,
            save: SaveService,
            authService: AuthService,
            localStorageService: LocalStorageService,
            excel: any) {
            super(location,
                state,
                stateParams,
                url,
                search,
                save,
                authService,
                url.productDetailQuery,
                url.productDetailQueryReport, excel);
            var self = this;
            self.hideEndDate = false;
            self.searchRequest["isProductActive"] =  true;
            self.localStorageService = localStorageService;
            
            this.searchRequest.startDate = this.startDate.toJSON();
            this.searchRequest.endDate = this.endDate.toJSON();

            this.loadWarehouses().then(result => {
                if (self.warehouses.length === 1) {
                    self.searchRequest.warehouseId = self.warehouses[0].id;
                }
                else {
                    let whId = self.localStorageService.get(LocalStorageKeys.WarehouseId);
                    if (whId != null) {
                        self.searchRequest.warehouseId = whId;
                    }
                }

                //return self.search();
                self.loadData();

            });
        }

         
        loadData(): void {
            var self = this;
            self.totalQuantityPurchaseToday = 0;
            self.totalQuantitySaleToday = 0;
            self.totalAmountSaleToday = 0;

            var successCallback = (response: SearchResponse): void => {
                console.log(response.data);
                self.models = response.data.item1;
                self.chartLabels = [];
                self.chartData = [];
                self.csvModels = [];
                for (var i = 0; i < self.models.length; i++) {
                    self.csvModels.push(self.generateCsvModel(self.models[i]));
                }

                for (let i = 0; i < response.data.item1.length; i++) {
                    self.totalQuantityStartToday += response.data.item1[i].quantityStartingToday;
                    self.totalQuantityEndingToday += response.data.item1[i].quantityEndingToday;
                    self.totalQuantityPurchaseToday += response.data.item1[i].quantityPurchaseToday;
                    self.totalQuantitySaleToday += response.data.item1[i].quantitySaleToday;
                    self.totalAmountSaleToday += response.data.item1[i].amountSaleToday;
                    self.totalAmountCostForSaleToday += response.data.item1[i].amountCostForSaleToday;

                    self.chartLabels.push(self.models[i].modified);
                    self.chartData.push(self.models[i].amountProfitToday);
                }

            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };

            var request = new SearchRequest();
            request["startDate"] = self.startDate.toLocaleString();
            request["endDate"] = self.endDate.toLocaleString();
            request.shopId = "1";
            request.page = -1;
            request["isProductActive"] = self.searchRequest["isProductActive"];
            request["productReportType"] = "ProductDetailStockReport";
            request["warehouseId"] = self.searchRequest.warehouseId;
            console.log('Product stock'+ request);
            this.searchService.search(request, self.url.productDetailQueryReport).then(<any>successCallback, errorCallback);
        }
    }

    angular.module('app').controller("ProductDetailsStockReportController", ProductDetailsStockReportController);
}