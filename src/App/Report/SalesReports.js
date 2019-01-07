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
})(App || (App = {}));
//# sourceMappingURL=SalesReports.js.map