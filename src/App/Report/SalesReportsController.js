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
    var SalesReportController = /** @class */ (function (_super) {
        __extends(SalesReportController, _super);
        function SalesReportController(scope, url, search) {
            var _this = _super.call(this, scope, url, search, "SalesReport-") || this;
            var self = _this;
            self.loadData();
            return _this;
        }
        SalesReportController.prototype.$onInit = function () { };
        SalesReportController.prototype.loadData = function () {
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
            request.endDate = this.endDate.toJSON();
            request["SaleReportType"] = "SaleByAmount";
            this.searchService.search(request, this.urlService.saleQueryReport).then(successCallback, errorCallback);
        };
        SalesReportController.$inject = ["$scope", "UrlService", "SearchService"];
        return SalesReportController;
    }(App.BaseReportController));
    App.SalesReportController = SalesReportController;
    angular.module('app').controller("SalesReportController", SalesReportController);
    var SaleByChannelReportController = /** @class */ (function (_super) {
        __extends(SaleByChannelReportController, _super);
        function SaleByChannelReportController(scope, url, search) {
            var _this = _super.call(this, scope, url, search, 'SaleByChannelReport-report-') || this;
            var self = _this;
            self.title = "SaleByChannelReport";
            self.loadData();
            return _this;
        }
        SaleByChannelReportController.prototype.$onInit = function () { };
        SaleByChannelReportController.prototype.loadData = function () {
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
            request["SaleReportType"] = "SaleByChannel";
            this.searchService.search(request, this.urlService.saleQueryReport).then(successCallback, errorCallback);
        };
        SaleByChannelReportController.prototype.loadDropdown = function () {
            //todo later
        };
        SaleByChannelReportController.$inject = ["$scope", "UrlService", "SearchService"];
        return SaleByChannelReportController;
    }(App.BaseReportController));
    App.SaleByChannelReportController = SaleByChannelReportController;
    angular.module('app').controller("SaleByChannelReportController", SaleByChannelReportController);
    var SaleByOrderFromController = /** @class */ (function (_super) {
        __extends(SaleByOrderFromController, _super);
        function SaleByOrderFromController(scope, url, search) {
            var _this = _super.call(this, scope, url, search, 'SaleByOrderFrom-report-') || this;
            var self = _this;
            self.title = "SaleByOrderFrom";
            self.loadData();
            return _this;
        }
        SaleByOrderFromController.prototype.$onInit = function () { };
        SaleByOrderFromController.prototype.loadData = function () {
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
            request["SaleReportType"] = "SaleByOrderFrom";
            this.searchService.search(request, this.urlService.saleQueryReport).then(successCallback, errorCallback);
        };
        SaleByOrderFromController.$inject = ["$scope", "UrlService", "SearchService"];
        return SaleByOrderFromController;
    }(App.BaseReportController));
    App.SaleByOrderFromController = SaleByOrderFromController;
    angular.module('app').controller("SaleByOrderFromController", SaleByOrderFromController);
    var SaleDetailsHistoryReportController = /** @class */ (function (_super) {
        __extends(SaleDetailsHistoryReportController, _super);
        function SaleDetailsHistoryReportController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.saleDetailQuery, url.saleQueryReport, excel) || this;
            _this.selectedItem = "";
            _this.headers = ["date", "amountProduct", "amountTotal", "amountDiscount", "amountPayable", "amountPaid", "amountDue"];
            _this.totalProductAmount = 0;
            _this.totalAmount = 0;
            _this.totalAmountDiscount = 0;
            _this.totalAmountPayable = 0;
            _this.totalAmountPaid = 0;
            _this.totalAmountDue = 0;
            _this.totalCost = 0;
            _this.totalProfit = 0;
            var self = _this;
            self.configureHeaderAndFooter();
            self.loadDropdown();
            self.loadData();
            return _this;
        }
        SaleDetailsHistoryReportController.prototype.$onInit = function () { };
        SaleDetailsHistoryReportController.prototype.configureHeaderAndFooter = function () {
            var self = this;
            self.showManageColumnsButton = false;
        };
        SaleDetailsHistoryReportController.prototype.loadData = function () {
            var self = this;
            self.totalProductAmount = 0;
            self.totalAmount = 0;
            self.totalAmountDiscount = 0;
            self.totalAmountPayable = 0;
            self.totalAmountPaid = 0;
            self.totalAmountDue = 0;
            self.totalCost = 0;
            self.totalProfit = 0;
            var successCallback = function (response) {
                console.log(response.data);
                self.models = response.data;
                self.csvModels = [];
                self.chartLabels = [];
                self.chartData = [];
                for (var i = 0; i < self.models.length; i++) {
                    self.csvModels.push(self.generateCsvModel(self.models[i]));
                }
                for (var i = 0; i < response.data.length; i++) {
                    self.totalProductAmount += response.data[i].amountProduct;
                    self.totalAmount += response.data[i].amountTotal;
                    self.totalAmountDiscount += response.data[i].amountDiscount;
                    self.totalAmountPayable += response.data[i].amountPayable;
                    self.totalAmountPaid += response.data[i].amountPaid;
                    self.totalAmountDue += response.data[i].amountDue;
                    self.totalCost += response.data[i].amountCost;
                    self.totalProfit += response.data[i].amountProfit;
                    self.chartLabels.push(self.models[i].modified);
                    self.chartData.push(self.models[i].amountProduct);
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
            request['SaleType'] = self.selectedItem;
            this.searchService.search(request, self.url.saleQueryReport).then(successCallback, errorCallback);
        };
        SaleDetailsHistoryReportController.prototype.loadDropdown = function () {
            var self = this;
            self.saleTypes = ["All", "DealerSale", "CustomerSale"];
            self.selectedItem = "All";
        };
        //loadDropdown(): void {
        //    var self = this;
        //    var successCallback = (response: SearchResponse): void => {
        //        self.saleTypes = <any>response.Models;
        //        self.selectedItem = self.saleTypes[0];
        //        self.loadData();
        //    };
        //    var errorCallback = (error: any): void => {
        //        console.log(error);
        //    };
        //    var request = new SearchRequest();
        //    self.searchService
        //        .search(request, self.url.saleQuery + "/Dropdown")
        //        .then(<any>successCallback, errorCallback);
        //}
        SaleDetailsHistoryReportController.prototype.dropdownChanged = function () {
            var self = this;
            self.loadData();
        };
        SaleDetailsHistoryReportController.prototype.selectedTypeAhead = function (a, b, c, d) {
            App.Display.log(this.selectedItem);
        };
        SaleDetailsHistoryReportController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return SaleDetailsHistoryReportController;
    }(App.BaseController));
    App.SaleDetailsHistoryReportController = SaleDetailsHistoryReportController;
    angular.module("app").controller("SaleDetailsHistoryReportController", SaleDetailsHistoryReportController);
})(App || (App = {}));
