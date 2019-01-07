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
})(App || (App = {}));
//# sourceMappingURL=ProductReports.js.map