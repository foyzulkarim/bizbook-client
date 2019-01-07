var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var App;
(function (App) {
    var ProductDetailsAmountReportController = /** @class */ (function (_super) {
        __extends(ProductDetailsAmountReportController, _super);
        function ProductDetailsAmountReportController(scope, url, search) {
            var _this = _super.call(this, scope, url, search, 'ProductDetail-report-') || this;
            _this.title = "Product Detail By Amount";
            _this.loadData();
            return _this;
        }
        ProductDetailsAmountReportController.prototype.$onInit = function () { };
        ProductDetailsAmountReportController.prototype.loadData = function () {
            var _this = this;
            var successCallback = function (response) {
                console.log(response.data);
                _this.gridOptions["data"] = response.data;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            var request = new App.SearchRequest("", "Date", "False");
            request["ReportType"] = "Daily";
            request.shopId = "1";
            request.page = -1;
            request.startDate = this.startDate.toJSON();
            request["ProductReportType"] = "ProductDetailByAmount";
            this.searchService.search(request, this.urlService.productDetailQueryReport).then(successCallback, errorCallback);
        };
        ProductDetailsAmountReportController.$inject = ["$scope", "UrlService", "SearchService"];
        return ProductDetailsAmountReportController;
    }(App.BaseReportController));
    App.ProductDetailsAmountReportController = ProductDetailsAmountReportController;
    angular.module('app').controller("ProductDetailsAmountReportController", ProductDetailsAmountReportController);
    var ProductDetailsHistoryReportController = /** @class */ (function (_super) {
        __extends(ProductDetailsHistoryReportController, _super);
        function ProductDetailsHistoryReportController(scope, url, search) {
            var _this = _super.call(this, scope, url, search, 'ProductDetail-report-') || this;
            var self = _this;
            self.hideDropdown = false;
            self.hideStartDate = true;
            self.title = "Product Detail History";
            self.loadDropdown();
            return _this;
        }
        ProductDetailsHistoryReportController.prototype.$onInit = function () { };
        ProductDetailsHistoryReportController.prototype.loadData = function () {
            var _this = this;
            var successCallback = function (response) {
                console.log(response.data);
                _this.gridOptions["data"] = response.data;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            var request = new App.SearchRequest("", "Date", "False");
            request["ReportType"] = "Daily";
            request.shopId = "1";
            request.page = -1;
            request["ProductReportType"] = "ProductDetailByAmount";
            request['ProductDetailId'] = this.selectedItem.id;
            this.searchService.search(request, this.urlService.productDetailQueryReport).then(successCallback, errorCallback);
        };
        ProductDetailsHistoryReportController.prototype.loadDropdown = function () {
            var self = this;
            var successCallback = function (response) {
                console.log('items ', response);
                self.items = response.Models;
                self.selectedItem = self.items[0];
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            var request = new App.SearchRequest("", "Name", "True", "");
            self.searchService
                .search(request, self.urlService.productDetailQuery + "/Dropdown")
                .then(successCallback, errorCallback);
        };
        ProductDetailsHistoryReportController.prototype.dropdownChanged = function () {
            this.loadData();
        };
        ProductDetailsHistoryReportController.$inject = ["$scope", "UrlService", "SearchService"];
        return ProductDetailsHistoryReportController;
    }(App.BaseReportController));
    App.ProductDetailsHistoryReportController = ProductDetailsHistoryReportController;
    angular.module('app').controller("ProductDetailsHistoryReportController", ProductDetailsHistoryReportController);
    var ProductDetailsHistoryReport2Controller = /** @class */ (function (_super) {
        __extends(ProductDetailsHistoryReport2Controller, _super);
        function ProductDetailsHistoryReport2Controller(location, state, stateParams, url, search, save, authService, localStorageService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.productDetailQueryReport, url.productDetailQueryReport, excel) || this;
            _this.selectedItem = "";
            _this.totalQuantityStartToday = 0;
            _this.totalQuantityEndingToday = 0;
            _this.totalQuantityPurchaseToday = 0;
            _this.totalQuantitySalePendingToday = 0;
            _this.totalQuantitySaleProcessingToday = 0;
            _this.totalQuantitySaleDoneToday = 0;
            _this.totalAmountSaleToday = 0;
            _this.totalAmountCostForSaleToday = 0;
            //headers = ["amountAveragePurchasePricePerUnitToday", "amountAverageSalePriceToday", "amountCostForSaleToday", "amountPaidToday", "amountPayableToday", "amountProfitPercentInAllProductsToday", "amountProfitPercentToday", "amountProfitToday", "amountPurchasePercentInAllProductsToday", "amountPurchaseToday", "amountReceivableToday", "amountReceivedToday", "amountSalePercentInAllProductsToday", "amountSaleToCustomerToday", "amountSaleToDealerToday","amountSaleToday",];
            _this.headers = ["date", "productDetailName", "quantityStartingToday", "quantityEndingToday", "quantityPurchaseToday", "quantitySaleToday", "amountSaleToday", "amountCostForSaleToday"];
            var self = _this;
            self.localStorageService = localStorageService;
            self.productDropdownRequest = new App.SearchRequest();
            self.productDropdownRequest["isProductActive"] = true;
            self.loadDropdown();
            self.searchRequest = new App.SearchRequest();
            self.loadWarehouses().then(function (result) {
                if (self.warehouses.length === 1) {
                    self.searchRequest.warehouseId = self.warehouses[0].id;
                }
                else {
                    self.searchRequest.warehouseId = self.warehouses[0].id;
                    var whId = self.localStorageService.get(App.LocalStorageKeys.WarehouseId);
                    if (whId != null) {
                        self.searchRequest.warehouseId = whId;
                    }
                }
                self.loadData();
            });
            return _this;
        }
        ProductDetailsHistoryReport2Controller.prototype.$onInit = function () { };
        ProductDetailsHistoryReport2Controller.prototype.loadData = function () {
            var self = this;
            self.totalQuantityStartToday = 0;
            self.totalQuantityEndingToday = 0;
            self.totalQuantityPurchaseToday = 0;
            self.totalQuantitySalePendingToday = 0;
            self.totalQuantitySaleProcessingToday = 0;
            self.totalQuantitySaleDoneToday = 0;
            self.totalAmountSaleToday = 0;
            self.totalAmountCostForSaleToday = 0;
            var successCallback = function (response) {
                self.models = response.data.item2;
                self.csvModels = [];
                self.chartLabels = [];
                self.chartData = [];
                for (var i = 0; i < self.models.length; i++) {
                    self.csvModels.push(self.generateCsvModel(self.models[i]));
                }
                for (var i_1 = 0; i_1 < response.data.item2.length; i_1++) {
                    self.totalQuantityStartToday += response.data.item2[i_1].quantityStartingToday;
                    self.totalQuantityEndingToday += response.data.item2[i_1].quantityEndingToday;
                    self.totalQuantityPurchaseToday += response.data.item2[i_1].quantityPurchaseToday;
                    self.totalQuantitySalePendingToday += response.data.item2[i_1].quantitySalePendingToday;
                    self.totalQuantitySaleProcessingToday += response.data.item2[i_1].quantitySaleProcessingToday;
                    self.totalQuantitySaleDoneToday += response.data.item2[i_1].quantitySaleDoneToday;
                    self.totalAmountSaleToday += response.data.item2[i_1].amountSaleToday;
                    self.totalAmountCostForSaleToday += response.data.item2[i_1].amountCostForSaleToday;
                    self.chartLabels.push(self.models[i_1].modified);
                    self.chartData.push(self.models[i_1].amountPaidToday);
                }
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            var request = new App.SearchRequest();
            request["startDate"] = self.startDate.toLocaleString();
            request["endDate"] = self.endDate.toLocaleString();
            request.shopId = "1";
            request.page = -1;
            request["productReportType"] = "ProductDetailHistory";
            request['parentId'] = self.selectedItem.id;
            request['warehouseId'] = self.searchRequest.warehouseId;
            this.searchService.search(request, self.url.productDetailQuery + '/HistoryByDate').then(successCallback, errorCallback);
        };
        ProductDetailsHistoryReport2Controller.prototype.loadDropdown = function () {
            var self = this;
            var successCallback = function (response) {
                self.productDetails = response.Models;
                self.selectedItem = self.productDetails[0];
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.productDropdownRequest.page = -1;
            self.searchService
                .search(self.productDropdownRequest, self.url.productDetailQuery + "/Dropdown")
                .then(successCallback, errorCallback);
        };
        ProductDetailsHistoryReport2Controller.prototype.dropdownChanged = function () {
            var self = this;
            self.loadData();
        };
        ProductDetailsHistoryReport2Controller.prototype.selectedTypeAhead = function (a, b, c, d) {
            App.Display.log(this.selectedItem);
        };
        ProductDetailsHistoryReport2Controller.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'localStorageService', 'Excel'
        ];
        return ProductDetailsHistoryReport2Controller;
    }(App.BaseController));
    App.ProductDetailsHistoryReport2Controller = ProductDetailsHistoryReport2Controller;
    angular.module('app').controller("ProductDetailsHistoryReport2Controller", ProductDetailsHistoryReport2Controller);
    var ProductDetailsStockReportController = /** @class */ (function (_super) {
        __extends(ProductDetailsStockReportController, _super);
        function ProductDetailsStockReportController(location, state, stateParams, url, search, save, authService, localStorageService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.productDetailQuery, url.productDetailQueryReport, excel) || this;
            _this.selectedItem = "";
            _this.totalQuantityStartToday = 0;
            _this.totalQuantityEndingToday = 0;
            _this.totalQuantityPurchaseToday = 0;
            _this.totalQuantitySaleToday = 0;
            _this.totalAmountSaleToday = 0;
            _this.totalAmountCostForSaleToday = 0;
            _this.headers = ["date", "productDetailName", "quantityStartingToday", "quantityEndingToday", "quantityPurchaseToday", "quantitySaleToday", "amountSaleToday", "amountCostForSaleToday", 'Excel'];
            var self = _this;
            self.hideEndDate = false;
            self.searchRequest["isProductActive"] = true;
            self.localStorageService = localStorageService;
            _this.searchRequest.startDate = _this.startDate.toJSON();
            _this.searchRequest.endDate = _this.endDate.toJSON();
            _this.loadWarehouses().then(function (result) {
                if (self.warehouses.length === 1) {
                    self.searchRequest.warehouseId = self.warehouses[0].id;
                }
                else {
                    var whId = self.localStorageService.get(App.LocalStorageKeys.WarehouseId);
                    if (whId != null) {
                        self.searchRequest.warehouseId = whId;
                    }
                }
                //return self.search();
                self.loadData();
            });
            return _this;
        }
        ProductDetailsStockReportController.prototype.$onInit = function () { };
        ProductDetailsStockReportController.prototype.loadData = function () {
            var self = this;
            self.totalQuantityPurchaseToday = 0;
            self.totalQuantitySaleToday = 0;
            self.totalAmountSaleToday = 0;
            var successCallback = function (response) {
                console.log(response.data);
                self.models = response.data.item1;
                self.chartLabels = [];
                self.chartData = [];
                self.csvModels = [];
                for (var i = 0; i < self.models.length; i++) {
                    self.csvModels.push(self.generateCsvModel(self.models[i]));
                }
                for (var i_2 = 0; i_2 < response.data.item1.length; i_2++) {
                    self.totalQuantityStartToday += response.data.item1[i_2].quantityStartingToday;
                    self.totalQuantityEndingToday += response.data.item1[i_2].quantityEndingToday;
                    self.totalQuantityPurchaseToday += response.data.item1[i_2].quantityPurchaseToday;
                    self.totalQuantitySaleToday += response.data.item1[i_2].quantitySaleToday;
                    self.totalAmountSaleToday += response.data.item1[i_2].amountSaleToday;
                    self.totalAmountCostForSaleToday += response.data.item1[i_2].amountCostForSaleToday;
                    self.chartLabels.push(self.models[i_2].modified);
                    self.chartData.push(self.models[i_2].amountProfitToday);
                }
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            var request = new App.SearchRequest();
            request["startDate"] = self.startDate.toLocaleString();
            request["endDate"] = self.endDate.toLocaleString();
            request.shopId = "1";
            request.page = -1;
            request["isProductActive"] = self.searchRequest["isProductActive"];
            request["productReportType"] = "ProductDetailStockReport";
            request["warehouseId"] = self.searchRequest.warehouseId;
            console.log('Product stock' + request);
            this.searchService.search(request, self.url.productDetailQueryReport).then(successCallback, errorCallback);
        };
        ProductDetailsStockReportController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService",
        ];
        return ProductDetailsStockReportController;
    }(App.BaseController));
    App.ProductDetailsStockReportController = ProductDetailsStockReportController;
    angular.module('app').controller("ProductDetailsStockReportController", ProductDetailsStockReportController);
})(App || (App = {}));
