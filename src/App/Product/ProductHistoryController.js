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
    "use strict";
    var ProductHistoryController = /** @class */ (function (_super) {
        __extends(ProductHistoryController, _super);
        function ProductHistoryController(location, $state, $stateParams, url, searchService, saveService, auth, localStorageService, excel) {
            var _this = _super.call(this, location, $state, $stateParams, url, searchService, saveService, auth, url.productDetail, url.productDetailQuery, excel) || this;
            _this.headers = ["invoiceNumber", "date", "type", "unitPrice", "total"];
            _this.totalPendingQuantity = 0;
            _this.totalProcessingQuantity = 0;
            _this.totalDoneQuantity = 0;
            _this.totalPurchaseQuantity = 0;
            _this.totalUnitPrice = 0;
            _this.totalAmount = 0;
            if (_this.stateParams["id"]) {
                _this.loadProductHistory();
                _this.loadWarehouses();
            }
            else {
                _this.back();
            }
            _this.localStorageService = localStorageService;
            _this.searchRequest.startDate = _this.startDate.toJSON();
            _this.searchRequest.endDate = _this.endDate.toJSON();
            return _this;
        }
        ProductHistoryController.prototype.detail = function (p, index) {
            this.selectedRow = index;
        };
        ProductHistoryController.prototype.selectWarehouse = function () {
            var self = this;
            var successCallback = function (response) {
                self.productDetailViewModel = response.data["item1"];
                self.models = response.data["item2"];
                self.csvModels = [];
                for (var i = 0; i < self.models.length; i++) {
                    // do your stuff for csv model generation
                    self.csvModels.push(self.generateCsvModel(self.models[i]));
                }
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            var searchRequest = new App.ProductHistorySearchRequest('', 'Modified', 'false');
            searchRequest.warehouseId = self.selectedWarehouseId; //'1ec5b7ae-ef89-4ae1-b8c3-c89863a35a2e'
            searchRequest.parentId = this.stateParams["id"];
            searchRequest.page = 1;
            searchRequest.perPageCount = 100;
            self.searchService
                .search(searchRequest, self.url.productDetailQuery + "/History")
                .then(successCallback, errorCallback);
        };
        ProductHistoryController.prototype.loadProductHistory = function () {
            var self = this;
            self.totalPendingQuantity = 0;
            self.totalProcessingQuantity = 0;
            self.totalDoneQuantity = 0;
            self.totalPurchaseQuantity = 0;
            self.totalUnitPrice = 0;
            self.totalAmount = 0;
            var successCallback = function (response) {
                self.productDetailViewModel = response.data["item1"];
                self.models = response.data["item2"];
                self.csvModels = [];
                for (var i = 0; i < self.models.length; i++) {
                    var m = self.models[i];
                    if (m.type === 'Sale' && m.orderState == 1) {
                        self.totalPendingQuantity += m.quantity;
                    }
                    if (m.type === 'Sale' && m.orderState > 1 && m.orderState < 5) {
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
            var errorCallback = function (error) {
                console.log(error);
            };
            //var searchRequest = new SearchRequest();
            var searchRequest = new App.ProductHistorySearchRequest('', 'Modified', 'false');
            //searchRequest.warehouseId = '1ec5b7ae-ef89-4ae1-b8c3-c89863a35a2e';
            searchRequest.startDate = this.startDate.toJSON();
            searchRequest.endDate = this.endDate.toJSON();
            searchRequest.parentId = this.stateParams["id"];
            searchRequest.page = 1;
            searchRequest.perPageCount = 100;
            self.searchService
                .search(searchRequest, self.url.productDetailQuery + "/History")
                .then(successCallback, errorCallback);
        };
        ProductHistoryController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return ProductHistoryController;
    }(App.BaseController));
    App.ProductHistoryController = ProductHistoryController;
    angular.module("app").controller("ProductHistoryController", ProductHistoryController);
})(App || (App = {}));
