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
    var TransactionDetailsHistoryReportController = /** @class */ (function (_super) {
        __extends(TransactionDetailsHistoryReportController, _super);
        function TransactionDetailsHistoryReportController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.transactionQuery, url.transactionQueryReport, excel) || this;
            _this.selectedItem = "";
            _this.totaAmountStating = 0;
            _this.totalAmountIn = 0;
            _this.totalAmountOut = 0;
            _this.totalCountTrx = 0;
            _this.totaAmountEndIn = 0;
            _this.headers = ["date", "accountHeadName", "amountTotalStarting", "amountTotalIn", "amountTotalOut", "amountTotalEnding", "countTotalTrx"];
            var self = _this;
            self.loadDropdown();
            return _this;
        }
        TransactionDetailsHistoryReportController.prototype.$onInit = function () { };
        TransactionDetailsHistoryReportController.prototype.loadData = function () {
            var self = this;
            self.totalAmountIn = 0;
            self.totalAmountOut = 0;
            self.totalCountTrx = 0;
            var successCallback = function (response) {
                console.log(response.data);
                self.models = response.data;
                self.chartLabels = [];
                self.chartData = [];
                self.csvModels = [];
                for (var i = 0; i < self.models.length; i++) {
                    self.csvModels.push(self.generateCsvModel(self.models[i]));
                }
                for (var i_1 = 0; i_1 < response.data.length; i_1++) {
                    self.totaAmountStating += response.data[i_1].amountTotalStarting;
                    self.totalAmountIn += response.data[i_1].amountTotalIn;
                    self.totalAmountOut += response.data[i_1].amountTotalOut;
                    self.totaAmountEndIn += response.data[i_1].amountTotalEnding;
                    self.totalCountTrx += response.data[i_1].countTotalTrx;
                    self.chartLabels.push(self.models[i_1].modified);
                    self.chartData.push(self.models[i_1].amount);
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
            request["AccountReportType"] = "TransactionHistory";
            request['accountHeadId'] = self.selectedItem.id;
            this.searchService.search(request, self.url.accountHeadQueryReport).then(successCallback, errorCallback);
        };
        TransactionDetailsHistoryReportController.prototype.loadDropdown = function () {
            var self = this;
            var successCallback = function (response) {
                self.accountHeads = response.Models;
                self.selectedItem = self.accountHeads[0];
                self.loadData();
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            var request = new App.SearchRequest();
            self.searchService
                .search(request, self.url.accountHeadQuery + "/Dropdown")
                .then(successCallback, errorCallback);
        };
        TransactionDetailsHistoryReportController.prototype.dropdownChanged = function () {
            var self = this;
            self.loadData();
        };
        TransactionDetailsHistoryReportController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return TransactionDetailsHistoryReportController;
    }(App.BaseController));
    App.TransactionDetailsHistoryReportController = TransactionDetailsHistoryReportController;
    angular.module('app').controller("TransactionDetailsHistoryReportController", TransactionDetailsHistoryReportController);
    var TransactionDetailsReportController = /** @class */ (function (_super) {
        __extends(TransactionDetailsReportController, _super);
        function TransactionDetailsReportController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.transactionQuery, url.transactionQueryReport, excel) || this;
            _this.selectedItem = "";
            _this.totalAmountStating = 0;
            _this.totalAmountIn = 0;
            _this.totalAmountOut = 0;
            _this.totalAmountEnding = 0;
            _this.totalCountTrx = 0;
            _this.headers = ["date", "accountHeadName", "amountTotalStarting", "amountTotalIn", "amountTotalOut", "amountTotalEnding", "countTotalTrx"];
            var self = _this;
            self.hideEndDate = true;
            self.loadData();
            return _this;
        }
        TransactionDetailsReportController.prototype.$onInit = function () { };
        TransactionDetailsReportController.prototype.loadData = function () {
            var self = this;
            self.totalAmountIn = 0;
            self.totalAmountOut = 0;
            self.totalCountTrx = 0;
            var successCallback = function (response) {
                console.log(response.data);
                self.models = response.data;
                self.csvModels = [];
                self.chartLabels = [];
                self.chartData = [];
                for (var i = 0; i < self.models.length; i++) {
                    self.csvModels.push(self.generateCsvModel(self.models[i]));
                }
                for (var i_2 = 0; i_2 < response.data.length; i_2++) {
                    self.totalAmountStating += response.data[i_2].amountTotalStarting;
                    self.totalAmountIn += response.data[i_2].amountTotalIn;
                    self.totalAmountOut += response.data[i_2].amountTotalOut;
                    self.totalAmountEnding += response.data[i_2].amountTotalEnding;
                    self.totalCountTrx += response.data[i_2].countTotalTrx;
                    self.chartLabels.push(self.models[i_2].modified);
                    self.chartData.push(self.models[i_2].amount);
                }
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            var request = new App.SearchRequest();
            request["startDate"] = self.startDate.toLocaleString();
            // request["endDate"] = self.endDate.toLocaleString();
            request.shopId = "1";
            request.page = -1;
            request["AccountReportType"] = "TransactionDeatil";
            this.searchService.search(request, self.url.accountHeadQueryReport).then(successCallback, errorCallback);
        };
        TransactionDetailsReportController.prototype.loadDropdown = function () {
            var self = this;
            var successCallback = function (response) {
                self.transactionDetails = response.Models;
                self.selectedItem = self.transactionDetails[0];
                self.loadData();
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            var request = new App.SearchRequest();
            self.searchService
                .search(request, self.url.transactionQuery + "/Dropdown")
                .then(successCallback, errorCallback);
        };
        //accountHeads: any[];
        TransactionDetailsReportController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return TransactionDetailsReportController;
    }(App.BaseController));
    App.TransactionDetailsReportController = TransactionDetailsReportController;
    angular.module('app').controller("TransactionDetailsReportController", TransactionDetailsReportController);
})(App || (App = {}));
