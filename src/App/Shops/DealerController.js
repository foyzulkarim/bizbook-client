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
    var DealerController = /** @class */ (function (_super) {
        __extends(DealerController, _super);
        function DealerController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.dealer, url.dealerQuery, excel) || this;
            _this.isUpdateMode = false;
            if (_this.stateParams["id"]) {
                _this.isUpdateMode = true;
                _this.model = new App.Dealer();
                _this.model.isVerified = true;
                _this.edit(_this.stateParams["id"]);
            }
            return _this;
        }
        DealerController.$inject = ["$location", "$state", "$stateParams", "UrlService", "SearchService",
            "SaveService", "AuthService", 'Excel'];
        return DealerController;
    }(App.BaseController));
    App.DealerController = DealerController;
    angular.module("app").controller("DealerController", DealerController);
    var DealersController = /** @class */ (function (_super) {
        __extends(DealersController, _super);
        function DealersController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.dealer, url.dealerQuery, excel) || this;
            _this.headers = ["id", "name", "phone", "postCode", "modified"];
            _this.search();
            return _this;
        }
        DealersController.$inject = ["$location", "$state", "$stateParams", "UrlService",
            "SearchService", "SaveService", "AuthService", 'Excel'];
        return DealersController;
    }(App.BaseController));
    App.DealersController = DealersController;
    angular.module("app").controller("DealersController", DealersController);
    var DealerHistoryController = /** @class */ (function (_super) {
        __extends(DealerHistoryController, _super);
        function DealerHistoryController(location, $state, $stateParams, url, searchService, saveService, auth, excel) {
            var _this = _super.call(this, location, $state, $stateParams, url, searchService, saveService, auth, url.dealer, url.dealerQuery, excel) || this;
            _this.headers = ["date", "invoiceNumber", "transactionNumber", "type", "total", "paid"];
            if (_this.stateParams["id"]) {
                _this.loadDealerHistory();
            }
            return _this;
        }
        DealerHistoryController.prototype.loadDealerHistory = function () {
            var self = this;
            var successCallback = function (response) {
                self.response = response.data;
                App.Display.log('dealer history', self.response);
                self.csvModels = [];
                for (var i = 0; i < self.response.histories.length; i++) {
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
            searchRequest["isDealerSale"] = true;
            self.searchService
                .search(searchRequest, self.url.saleQuery + "/BuyerHistory")
                .then(successCallback, errorCallback);
        };
        DealerHistoryController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return DealerHistoryController;
    }(App.BaseController));
    App.DealerHistoryController = DealerHistoryController;
    angular.module("app").controller("DealerHistoryController", DealerHistoryController);
    var DealerProductHistoryController = /** @class */ (function (_super) {
        __extends(DealerProductHistoryController, _super);
        function DealerProductHistoryController(location, $state, $stateParams, url, searchService, saveService, auth, excel) {
            var _this = _super.call(this, location, $state, $stateParams, url, searchService, saveService, auth, url.dealer, url.dealerQuery, excel) || this;
            _this.totalQuantity = 0;
            _this.totalUnitPrice = 0;
            _this.totalPrice = 0;
            if (_this.stateParams["id"]) {
                _this.loadDealerProductHistory();
            }
            return _this;
        }
        DealerProductHistoryController.prototype.loadDealerProductHistory = function () {
            var self = this;
            self.totalUnitPrice = 0;
            self.totalQuantity = 0;
            self.totalPrice = 0;
            var successCallback = function (response) {
                self.response = response.data;
                App.Display.log('i am in history', self.response);
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
            searchRequest["isDealerSale"] = true;
            self.searchService
                .search(searchRequest, self.url.saleQuery + "/ProductHistory")
                .then(successCallback, errorCallback);
        };
        DealerProductHistoryController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return DealerProductHistoryController;
    }(App.BaseController));
    App.DealerProductHistoryController = DealerProductHistoryController;
    angular.module("app").controller("DealerProductHistoryController", DealerProductHistoryController);
    var DealerProductDueController = /** @class */ (function (_super) {
        __extends(DealerProductDueController, _super);
        function DealerProductDueController(location, $state, $stateParams, url, searchService, saveService, auth, excel) {
            var _this = _super.call(this, location, $state, $stateParams, url, searchService, saveService, auth, url.dealerProduct, url.dealerProductQuery, excel) || this;
            if (_this.stateParams["id"]) {
                _this.dealerId = _this.stateParams["id"];
                //this.searchRequest["dealerId"] = this.stateParams["id"];
                _this.searchRequest.isIncludeParents = true;
                _this.search();
                _this.transaction = new App.Transaction();
                _this.setupDropdowns();
                _this.selectedAccountInfo = new App.AccountInfo();
                _this.loadAccountInfos();
            }
            return _this;
        }
        DealerProductDueController.prototype.setupDropdowns = function () {
            var _this = this;
            var self = this;
            var success = function (response) {
                console.log(response);
                self.transactionMediums = response.transactionMediums;
                self.paymentGatewayServices = response.paymentGatewayServices;
                self.accountInfoTypes = response.accountInfoTypes;
                self.accountInfoType = "Cash";
                self.transaction.transactionMedium = "Cash";
                self.transaction.paymentGatewayService = "Cash";
            };
            var error = function (error) {
                console.log(error);
            };
            self.searchService.get(self.url.transactionQuery + "/Dropdowns").then(success, error);
            var accountSuccess = function (response) {
                console.log('account - ', response);
                var accountHeads = response.Models;
                var sale = accountHeads.filter(function (x) { return x.text === "Sale"; })[0];
                if (sale != null) {
                    _this.transaction.accountHeadId = sale.id;
                    _this.transaction.accountHeadName = sale.text;
                }
            };
            var accountRequest = new App.SearchRequest();
            self.searchService.search(accountRequest, self.url.accountHeadQuery + "/Dropdown")
                .then(accountSuccess, error);
        };
        DealerProductDueController.prototype.save = function () {
            var self = this;
            App.Display.log(self.models);
            var successCallback = function (response) {
                App.Display.log(response);
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.transaction.transactionDate = self.transactionDate.toDateString();
            var dealerProductTransactions = [];
            var l = 0;
            // process and prepare data
            for (var i = 0; i < self.models.length; i++) {
                var m = new App.DealerProductTransaction();
                m.amount = self.models[i].newlyPaid;
                m.dealerProductId = self.models[i].id;
                dealerProductTransactions.push(m);
                l += dealerProductTransactions[i].amount;
            }
            if (l !== self.transaction.amount) {
                alert('Transaction amount and product breakdown amount is not equal. returning');
                return;
            }
            var updateModel = new App.DealerProductDetailUpdateModel();
            updateModel.dealerId = self.dealerId;
            updateModel.dealerProductTransactions = dealerProductTransactions;
            updateModel.transaction = self.transaction;
            self.saveService.update(updateModel, self.commandUrl + "/UpdateDues").then(successCallback, errorCallback);
        };
        DealerProductDueController.prototype.loadAccountInfos = function () {
            var self = this;
            var success = function (response) {
                App.Display.log(response);
                self.accountInfos = response.Models;
            };
            var error = function (error) {
                App.Display.log(error);
            };
            self.searchService.search(self.searchRequest, self.url.accountInfoQuery + "/Dropdown")
                .then(success, error);
        };
        DealerProductDueController.prototype.accountInfoChanged = function () {
            var self = this;
            self.transaction.accountInfoTitle = self.selectedAccountInfo["text"];
            self.transaction.accountInfoId = self.selectedAccountInfo.id;
            self.transaction.paymentGatewayServiceName = self.transaction.accountInfoTitle;
            self.transaction.transactionMediumName = self.transaction.transactionMedium;
        };
        DealerProductDueController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return DealerProductDueController;
    }(App.BaseController));
    App.DealerProductDueController = DealerProductDueController;
    angular.module("app").controller("DealerProductDueController", DealerProductDueController);
})(App || (App = {}));
