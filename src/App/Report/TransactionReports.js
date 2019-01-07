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
    var TransactionByAmountReportController = /** @class */ (function (_super) {
        __extends(TransactionByAmountReportController, _super);
        function TransactionByAmountReportController(scope, url, search) {
            var _this = _super.call(this, scope, url, search, 'Transaction-By-Amount-Report-') || this;
            var self = _this;
            self.title = "Transaction By Amount";
            self.loadData();
            return _this;
        }
        TransactionByAmountReportController.prototype.$onInit = function () { };
        TransactionByAmountReportController.prototype.loadData = function () {
            var _this = this;
            var successCallback = function (response) {
                console.log(response.data);
                _this.gridOptions["data"] = response.data;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            var request = new App.SearchRequest("", "Date", "True");
            request["ReportType"] = "Daily";
            request.shopId = "1";
            request.page = -1;
            request.startDate = this.startDate.toJSON();
            request["TransactionReportType"] = "TransactionByAmount";
            this.searchService.search(request, this.urlService.transactionQueryReport).then(successCallback, errorCallback);
        };
        TransactionByAmountReportController.$inject = ["$scope", "UrlService", "SearchService"];
        return TransactionByAmountReportController;
    }(App.BaseReportController));
    App.TransactionByAmountReportController = TransactionByAmountReportController;
    angular.module('app').controller("TransactionByAmountReportController", TransactionByAmountReportController);
    var TransactionByAccountHeadReportController = /** @class */ (function (_super) {
        __extends(TransactionByAccountHeadReportController, _super);
        function TransactionByAccountHeadReportController(scope, url, search) {
            var _this = _super.call(this, scope, url, search, 'Transaction-By-Account-Report-') || this;
            var self = _this;
            self.hideDropdown = false;
            self.title = "Transaction By Account Head";
            self.loadDropdown();
            return _this;
        }
        TransactionByAccountHeadReportController.prototype.$onInit = function () { };
        TransactionByAccountHeadReportController.prototype.loadData = function () {
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
            request.parentId = this.selectedItem.id;
            request["TransactionReportType"] = "TransactionByAccountHead";
            this.searchService.search(request, this.urlService.transactionQueryReport).then(successCallback, errorCallback);
        };
        TransactionByAccountHeadReportController.prototype.loadDropdown = function () {
            var self = this;
            var successCallback = function (response) {
                console.log('items ', response);
                self.items = response.Models;
                var all = { id: '00000000-0000-0000-0000-000000000000', text: 'All' };
                self.items.splice(0, 0, all);
                self.selectedItem = self.items[0];
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            var request = new App.SearchRequest("", "Name", "True", "");
            self.searchService
                .search(request, self.urlService.accountHeadQuery + "/Dropdown")
                .then(successCallback, errorCallback);
        };
        TransactionByAccountHeadReportController.prototype.dropdownChanged = function () {
            this.loadData();
        };
        TransactionByAccountHeadReportController.$inject = ["$scope", "UrlService", "SearchService"];
        return TransactionByAccountHeadReportController;
    }(App.BaseReportController));
    App.TransactionByAccountHeadReportController = TransactionByAccountHeadReportController;
    angular.module('app').controller("TransactionByAccountHeadReportController", TransactionByAccountHeadReportController);
})(App || (App = {}));
//# sourceMappingURL=TransactionReports.js.map