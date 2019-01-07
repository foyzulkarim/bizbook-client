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
    var CustomerHistoryController = /** @class */ (function (_super) {
        __extends(CustomerHistoryController, _super);
        function CustomerHistoryController(location, $state, $stateParams, url, searchService, saveService, auth, excel) {
            var _this = _super.call(this, location, $state, $stateParams, url, searchService, saveService, auth, url.customer, url.customerQuery, excel) || this;
            _this.headers = ["date", "invoiceNumber", "transactionNumber", "type", "total", "paid"];
            if (_this.stateParams["id"]) {
                _this.loadCustomerHistory();
            }
            return _this;
        }
        CustomerHistoryController.prototype.loadCustomerHistory = function () {
            var self = this;
            var successCallback = function (response) {
                self.response = response.data;
                App.Display.log('i am in customer history', self.response);
                self.csvModels = [];
                for (var i = 0; i < self.response.histories.length; i++) {
                    // do your stuff for csv model generation
                    self.csvModels.push(self.generateCsvModel(self.response.histories[i]));
                }
            };
            var errorCallback = function (error) {
                console.log(error);
                alert('Error occurred');
            };
            var searchRequest = new App.SearchRequest();
            searchRequest.parentId = this.stateParams["id"];
            searchRequest.page = -1;
            self.searchService
                .search(searchRequest, self.url.saleQuery + "/BuyerHistory")
                .then(successCallback, errorCallback);
        };
        CustomerHistoryController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return CustomerHistoryController;
    }(App.BaseController));
    App.CustomerHistoryController = CustomerHistoryController;
    angular.module("app").controller("CustomerHistoryController", CustomerHistoryController);
    var CustomerProductHistoryController = /** @class */ (function (_super) {
        __extends(CustomerProductHistoryController, _super);
        function CustomerProductHistoryController(location, $state, $stateParams, url, searchService, saveService, auth, excel) {
            var _this = _super.call(this, location, $state, $stateParams, url, searchService, saveService, auth, url.customer, url.customerQuery, excel) || this;
            _this.totalQuantity = 0;
            _this.totalUnitPrice = 0;
            _this.totalPrice = 0;
            if (_this.stateParams["id"]) {
                _this.loadCustomerProductHistory();
            }
            return _this;
        }
        CustomerProductHistoryController.prototype.loadCustomerProductHistory = function () {
            var self = this;
            self.totalUnitPrice = 0;
            self.totalQuantity = 0;
            self.totalPrice = 0;
            var successCallback = function (response) {
                self.response = response.data;
                App.Display.log('i am in customer history', self.response);
                self.csvModels = [];
                for (var i = 0; i < self.response.histories.length; i++) {
                    self.totalUnitPrice += self.response.histories[i].unitPrice;
                    self.totalQuantity += self.response.histories[i].quantity;
                    self.totalPrice += self.response.histories[i].total;
                    // do your stuff for csv model generation
                    self.csvModels.push(self.generateCsvModel(self.response.histories[i]));
                }
            };
            var errorCallback = function (error) {
                console.log(error);
                alert('Error occurred');
            };
            var searchRequest = new App.SearchRequest();
            searchRequest.parentId = this.stateParams["id"];
            searchRequest.page = -1;
            self.searchService
                .search(searchRequest, self.url.saleQuery + "/ProductHistory")
                .then(successCallback, errorCallback);
        };
        CustomerProductHistoryController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return CustomerProductHistoryController;
    }(App.BaseController));
    App.CustomerProductHistoryController = CustomerProductHistoryController;
    angular.module("app").controller("CustomerProductHistoryController", CustomerProductHistoryController);
    var CustomerProductViewController = /** @class */ (function (_super) {
        __extends(CustomerProductViewController, _super);
        function CustomerProductViewController(location, $state, $stateParams, url, searchService, saveService, auth, excel) {
            var _this = _super.call(this, location, $state, $stateParams, url, searchService, saveService, auth, url.customer, url.customerQuery, excel) || this;
            _this.totalQuantity = 0;
            _this.totalUnitPrice = 0;
            _this.totalPrice = 0;
            if (_this.stateParams["id"]) {
                _this.loadCustomerProductView();
            }
            return _this;
        }
        CustomerProductViewController.prototype.loadCustomerProductView = function () {
            var self = this;
            self.totalUnitPrice = 0;
            self.totalQuantity = 0;
            self.totalPrice = 0;
            var successCallback = function (response) {
                self.response = response.data;
                App.Display.log('i am in customer history', self.response);
                self.csvModels = [];
                for (var i = 0; i < self.response.histories.length; i++) {
                    self.totalUnitPrice += self.response.histories[i].price;
                    self.totalQuantity += self.response.histories[i].quantity;
                    self.totalPrice += self.response.histories[i].total;
                    // do your stuff for csv model generation
                    self.csvModels.push(self.generateCsvModel(self.response.histories[i]));
                }
            };
            var errorCallback = function (error) {
                console.log(error);
                alert('Error occurred');
            };
            var searchRequest = new App.SearchRequest();
            searchRequest.parentId = this.stateParams["id"];
            // searchRequest.customerId = this.stateParams["id"]
            searchRequest.page = -1;
            self.searchService
                .search(searchRequest, self.url.customerQuery + "/CustomerProductView")
                .then(successCallback, errorCallback);
        };
        CustomerProductViewController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return CustomerProductViewController;
    }(App.BaseController));
    App.CustomerProductViewController = CustomerProductViewController;
    angular.module("app").controller("CustomerProductViewController", CustomerProductViewController);
})(App || (App = {}));
