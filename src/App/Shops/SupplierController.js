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
    var SuppliersController = /** @class */ (function (_super) {
        __extends(SuppliersController, _super);
        function SuppliersController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.supplier, url.supplierQuery, excel) || this;
            _this.headers = ["id", "name", "phone", "modified"];
            _this.search();
            return _this;
        }
        SuppliersController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return SuppliersController;
    }(App.BaseController));
    App.SuppliersController = SuppliersController;
    angular.module('app').controller('SuppliersController', SuppliersController);
    var SupplierController = /** @class */ (function (_super) {
        __extends(SupplierController, _super);
        function SupplierController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.supplier, url.supplierQuery, excel) || this;
            _this.isUpdateMode = false;
            if (_this.stateParams["id"]) {
                _this.isUpdateMode = true;
                _this.edit(_this.stateParams["id"]);
            }
            return _this;
        }
        SupplierController.$inject = ["$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'];
        return SupplierController;
    }(App.BaseController));
    App.SupplierController = SupplierController;
    angular.module("app").controller("SupplierController", SupplierController);
    var SupplierHistoryController = /** @class */ (function (_super) {
        __extends(SupplierHistoryController, _super);
        function SupplierHistoryController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.supplier, url.supplierQuery, excel) || this;
            _this.headers = ["id", "type", "total", "paid", "date"];
            _this.isUpdateMode = false;
            if (_this.stateParams["id"]) {
                _this.isUpdateMode = true;
                _this.loadSupplierHistory(_this.stateParams["id"]);
            }
            return _this;
        }
        SupplierHistoryController.prototype.loadSupplierHistory = function (id) {
            var self = this;
            var onSuccess = function (response) {
                self.response = response.data;
                App.Display.log(response.data);
                self.csvModels = [];
                for (var i = 0; i < self.response.histories.length; i++) {
                    self.csvModels.push(self.generateCsvModel(self.response.histories[i]));
                }
            };
            var onError = function (error) {
                console.log(error);
                alert('Error occurred');
            };
            var searchRequest = new App.SearchRequest();
            searchRequest.parentId = id;
            var url = self.queryUrl + '/History';
            self.searchService.search(searchRequest, url).then(onSuccess, onError);
        };
        SupplierHistoryController.$inject = ["$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'];
        return SupplierHistoryController;
    }(App.BaseController));
    App.SupplierHistoryController = SupplierHistoryController;
    angular.module("app").controller("SupplierHistoryController", SupplierHistoryController);
    var SupplierProductHistoryController = /** @class */ (function (_super) {
        __extends(SupplierProductHistoryController, _super);
        function SupplierProductHistoryController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.supplier, url.supplierQuery, excel) || this;
            _this.totalQuantity = 0;
            _this.totalUnitPrice = 0;
            _this.totalPrice = 0;
            if (_this.stateParams["id"]) {
                _this.loadSupplierProductHistory();
            }
            return _this;
        }
        SupplierProductHistoryController.prototype.loadSupplierProductHistory = function () {
            var self = this;
            var successCallback = function (response) {
                self.response = response.data;
                console.log("response" + self.response);
                self.csvModels = [];
                for (var i = 0; i < self.response.histories.length; i++) {
                    self.totalUnitPrice += self.response.histories[i].unitPrice;
                    self.totalQuantity += self.response.histories[i].quantity;
                    self.totalPrice += self.response.histories[i].total;
                    self.csvModels.push(self.generateCsvModel(self.response.histories[i]));
                }
            };
            var errorCallback = function (error) {
                console.log(error);
                alert("Error");
            };
            var searchRequest = new App.SearchRequest();
            searchRequest.parentId = this.stateParams["id"];
            searchRequest.page = -1;
            self.
                searchService.
                search(searchRequest, self.url.purchaseQuery + "/ProductHistory").
                then(successCallback, errorCallback);
        };
        SupplierProductHistoryController.$inject = ["$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'];
        return SupplierProductHistoryController;
    }(App.BaseController));
    App.SupplierProductHistoryController = SupplierProductHistoryController;
    angular.module("app").controller("SupplierProductHistoryController", SupplierProductHistoryController);
    var SupplierProductDueController = /** @class */ (function (_super) {
        __extends(SupplierProductDueController, _super);
        function SupplierProductDueController(location, $state, $stateParams, url, searchService, saveService, auth, excel) {
            var _this = _super.call(this, location, $state, $stateParams, url, searchService, saveService, auth, url.supplierProduct, url.supplierProductQuery, excel) || this;
            if (_this.stateParams["id"]) {
                _this.supplierId = _this.stateParams["id"];
                _this.searchRequest.isIncludeParents = true;
                _this.searchRequest.parentId = _this.supplierId;
                _this.search();
                _this.transaction = new App.Transaction();
                _this.setupDropdowns();
                _this.selectedAccountInfo = new App.AccountInfo();
                _this.loadAccountInfos();
            }
            return _this;
        }
        SupplierProductDueController.prototype.setupDropdowns = function () {
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
                var purchase = accountHeads.filter(function (x) { return x.text === "Purchase"; })[0];
                if (purchase != null) {
                    _this.transaction.accountHeadId = purchase.id;
                    _this.transaction.accountHeadName = purchase.text;
                }
            };
            var accountRequest = new App.SearchRequest();
            self.searchService.search(accountRequest, self.url.accountHeadQuery + "/Dropdown")
                .then(accountSuccess, error);
        };
        SupplierProductDueController.prototype.loadAccountInfos = function () {
            var self = this;
            var success = function (response) {
                console.log(response);
                self.accountInfos = response.Models;
            };
            var error = function (error) {
                console.log(error);
            };
            self.searchService.search(self.searchRequest, self.url.accountInfoQuery + "/Dropdown")
                .then(success, error);
        };
        SupplierProductDueController.prototype.accountInfoChanged = function () {
            var self = this;
            self.transaction.accountInfoTitle = self.selectedAccountInfo["text"];
            self.transaction.accountInfoId = self.selectedAccountInfo.id;
            self.transaction.paymentGatewayServiceName = self.transaction.accountInfoTitle;
            self.transaction.transactionMediumName = self.transaction.transactionMedium;
        };
        SupplierProductDueController.prototype.save = function () {
            var self = this;
            console.log("update model-" + self.models);
            var successCallback = function (response) {
                console.log(response);
                self.back();
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            var supplierProductTransactions = [];
            var val = 0;
            for (var i = 0; i < self.models.length; i++) {
                var m = new App.SupplierProductTransaction();
                m.amount = self.models[i].newlyPaid;
                m.supplierProductId = self.models[i].id;
                supplierProductTransactions.push(m);
                val += supplierProductTransactions[i].amount;
            }
            if (val !== self.transaction.amount) {
                alert('Transaction amount and product breakdown amount is not equal. returning');
                return;
            }
            var updateModel = new App.SupplierProductDetailUpdateModel();
            updateModel.supplierId = self.supplierId;
            updateModel.supplierProductTransactions = supplierProductTransactions;
            updateModel.transaction = self.transaction;
            self.saveService.update(updateModel, self.commandUrl + "/UpdateDues")
                .then(successCallback, errorCallback);
        };
        SupplierProductDueController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return SupplierProductDueController;
    }(App.BaseController));
    App.SupplierProductDueController = SupplierProductDueController;
    angular.module("app").controller("SupplierProductDueController", SupplierProductDueController);
})(App || (App = {}));
