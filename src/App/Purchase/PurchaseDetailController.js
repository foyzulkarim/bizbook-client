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
    var PurchaseDetailController = /** @class */ (function (_super) {
        __extends(PurchaseDetailController, _super);
        function PurchaseDetailController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.sale, url.purchaseQuery, excel) || this;
            _this.purchaseTotal = 0;
            if (_this.stateParams["id"]) {
                _this.edit(_this.stateParams["id"]);
            }
            else {
                _this.back();
            }
            return _this;
        }
        PurchaseDetailController.prototype.loadDetail = function () {
            var _this = this;
            var self = this;
            var successCallback = function (response) {
                _this.model = response.data;
                console.log(_this.model);
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            var searchRequest = new App.SearchRequest();
            searchRequest.id = this.stateParams["id"];
            searchRequest.page = -1;
            var purchaseId = this.stateParams["id"];
            self.searchService
                .search(searchRequest, self.url.purchaseQuery + "/Detail?id=" + purchaseId)
                .then(successCallback, errorCallback);
        };
        PurchaseDetailController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "$uibModal", 'Excel'
        ];
        return PurchaseDetailController;
    }(App.BaseController));
    App.PurchaseDetailController = PurchaseDetailController;
    angular.module("app").controller("PurchaseDetailController", PurchaseDetailController);
    var PurchaseReturnController = /** @class */ (function (_super) {
        __extends(PurchaseReturnController, _super);
        function PurchaseReturnController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.purchase, url.purchaseQuery, excel) || this;
            if (_this.stateParams["id"]) {
                _this.purchaseDetail = new App.PurchaseDetailViewModel();
                _this.productDetailSearchRequest = new App.SearchRequest();
                _this.loadDetail();
                _this.loadProductDetails();
            }
            else {
                _this.back();
            }
            return _this;
        }
        PurchaseReturnController.prototype.loadDetail = function () {
            var _this = this;
            console.log(this.stateParams);
            var self = this;
            var successCallback = function (response) {
                self.model = response.data;
                console.log(_this.model);
                self.due = self.model.dueAmount;
                self.transaction.orderId = self.model.id;
                self.transaction.orderNumber = self.model.orderNumber;
                self.transaction.accountHeadId = "a";
                self.transaction.parentId = "a";
                self.transaction.paymentGatewayService = "Cash";
                self.transaction.accountHeadName = "Purchase";
                self.transaction.paymentGatewayServiceName = "Cash";
                self.transaction.transactionMediumName = "Cash";
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            var searchRequest = new App.SearchRequest();
            searchRequest.id = this.stateParams["id"];
            searchRequest.page = -1;
            var id = this.stateParams["id"];
            var httpUrl = self.url.purchaseQuery + "/Detail?id=" + id;
            self.searchService
                .search(searchRequest, httpUrl)
                .then(successCallback, errorCallback);
            self.transaction = new App.Transaction();
            self.transaction.amount = 0;
            self.transaction.transactionFlowType = "Expense";
            self.transaction.created = new Date().toDateString();
            self.transaction.modified = new Date().toDateString();
            self.transaction.shopId = "1";
            self.transaction.createdFrom = "Bizbook365";
            self.transaction.createdBy = "1";
            self.transaction.modifiedBy = "1";
            self.transaction.accountHeadId = "a";
            self.transaction.parentId = "a";
            self.transaction.paymentGatewayService = "Cash";
            self.transaction.accountHeadName = "Purchase";
            self.transaction.paymentGatewayServiceName = "Cash";
            self.transaction.transactionMediumName = "Cash";
            self.due = 0;
        };
        PurchaseReturnController.prototype.loadProductDetails = function () {
            var self = this;
            if (self.productDetailSearchRequest.keyword.length < 3) {
                return;
            }
            var successCallback = function (response) {
                console.log('products--- ', response);
                self.productDetails = response.Models;
                self.productDetailsCount = response.Count;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService
                .search(self.productDetailSearchRequest, self.url.productDetailQuery + "/Search")
                .then(successCallback, errorCallback);
        };
        PurchaseReturnController.prototype.addToCart2 = function (detail) {
            this.setProductDetail(detail);
            this.addToCart();
        };
        PurchaseReturnController.prototype.addToCart = function () {
            this.model.purchaseDetails.push(this.purchaseDetail);
            console.log('purchaseDetails result--', this.model.purchaseDetails);
            this.updateCartTotal();
            this.purchaseDetail = new App.PurchaseDetailViewModel();
        };
        PurchaseReturnController.prototype.updateCartTotal = function () {
            var _this = this;
            var self = this;
            self.due = 0;
            self.transaction.amount = 0;
            self.model.productAmount = 0;
            self.model.purchaseDetails.forEach(function (p) { return _this.model.productAmount += p.costTotal; });
            self.model.totalAmount = self.model.productAmount - self.model.discountAmount;
            self.updateTransactions();
        };
        PurchaseReturnController.prototype.updateTransactions = function () {
            var self = this;
            self.model.dueAmount = self.model.totalAmount - self.model.paidAmount;
            self.updateDue();
        };
        PurchaseReturnController.prototype.updateDue = function () {
            var self = this;
            //self.due = self.model.dueAmount + self.transaction.amount;
            self.due = self.model.dueAmount;
        };
        PurchaseReturnController.prototype.getPriceAndName = function () {
            this.purchaseDetail.costTotal = this.purchaseDetail.quantity * this.purchaseDetail.costPrice;
        };
        PurchaseReturnController.prototype.setProductDetail = function (detail) {
            this.purchaseDetail.costPricePerUnit = detail.costPrice;
            this.purchaseDetail.costPrice = detail.costPrice;
            this.purchaseDetail.productDetailId = detail.id;
            this.purchaseDetail.productDetailName = detail.name;
            this.purchaseDetail.productDetail = detail;
            this.purchaseDetail.quantity = 1;
            this.getPriceAndName();
        };
        PurchaseReturnController.prototype.updateQuantityAll = function () {
            for (var i = 0; i < this.model.purchaseDetails.length; i++) {
                this.updateQuantity(i);
            }
        };
        PurchaseReturnController.prototype.updateQuantity = function (index) {
            var costPrice = this.model.purchaseDetails[index].costPricePerUnit;
            var quantity = this.model.purchaseDetails[index].quantity;
            this.model.purchaseDetails[index].quantity = quantity;
            this.model.purchaseDetails[index].costPricePerUnit = costPrice;
            this.model.purchaseDetails[index].costTotal = costPrice * quantity;
            this.updateCartTotal();
        };
        PurchaseReturnController.prototype.increaseToCart = function (index) {
            var costPrice = this.model.purchaseDetails[index].costPricePerUnit;
            var quantity = this.model.purchaseDetails[index].quantity + 1;
            this.model.purchaseDetails[index].quantity = quantity;
            this.model.purchaseDetails[index].costTotal = costPrice * quantity;
            this.updateCartTotal();
        };
        PurchaseReturnController.prototype.decreaseFromCart = function (index) {
            var costPrice = this.model.purchaseDetails[index].costPricePerUnit;
            var quantity = this.model.purchaseDetails[index].quantity - 1;
            this.model.purchaseDetails[index].quantity = quantity;
            this.model.purchaseDetails[index].costTotal = costPrice * quantity;
            this.updateCartTotal();
        };
        PurchaseReturnController.prototype.save = function () {
            var self = this;
            console.log(this.model);
            var successCallback = function (response) {
                console.log(response);
                self.back();
            };
            var errorCallback = function (error) {
                console.log(error);
                if (error.status === 500) {
                    alert(error.data.exceptionMessage);
                }
                else {
                    alert("Error occurred");
                }
            };
            for (var i = 0; i < self.model.purchaseDetails.length; i++) {
                self.model.purchaseDetails[i].productDetail = null;
            }
            this.saveService.update(self.model, self.commandUrl + "/Return")
                .then(successCallback, errorCallback);
        };
        PurchaseReturnController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "$uibModal", 'Excel'
        ];
        return PurchaseReturnController;
    }(App.BaseController));
    App.PurchaseReturnController = PurchaseReturnController;
    angular.module("app").controller("PurchaseReturnController", PurchaseReturnController);
    var PurchaseTransactionController = /** @class */ (function (_super) {
        __extends(PurchaseTransactionController, _super);
        function PurchaseTransactionController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.purchase, url.purchaseQuery, excel) || this;
            if (_this.stateParams["id"]) {
                _this.transaction = new App.Transaction();
                _this.setupDropdowns();
                _this.loadDetail();
                _this.selectedAccountInfo = new App.AccountInfo();
                _this.loadAccountInfos();
            }
            else {
                _this.back();
            }
            return _this;
        }
        PurchaseTransactionController.prototype.loadDetail = function () {
            var _this = this;
            console.log(this.stateParams);
            var self = this;
            var successCallback = function (response) {
                self.model = response.data;
                console.log(_this.model);
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            var searchRequest = new App.SearchRequest();
            searchRequest.id = this.stateParams["id"];
            searchRequest.page = -1;
            var id = this.stateParams["id"];
            var httpUrl = self.url.purchaseQuery + "/Detail?id=" + id;
            self.searchService
                .search(searchRequest, httpUrl)
                .then(successCallback, errorCallback);
        };
        PurchaseTransactionController.prototype.setupDropdowns = function () {
            var self = this;
            var success = function (response) {
                console.log(response);
                self.transactionMediums = response.transactionMediums;
                self.paymentGatewayServices = response.paymentGatewayServices;
                self.accountInfoTypes = response.accountInfoTypes;
                self.transaction.transactionMedium = "Cash";
                self.transaction.paymentGatewayService = "Cash";
                self.accountInfoType = "Cash";
            };
            var error = function (error) {
                console.log(error);
            };
            self.searchService.get(self.url.transactionQuery + "/Dropdowns").then(success, error);
            var accountSuccess = function (response) {
                console.log('account - ', response);
                var accountHeads = response.Models;
                var sale = accountHeads.filter(function (x) { return x.text === "Purchase"; })[0];
                if (sale != null) {
                    self.transaction.accountHeadId = sale.id;
                    self.transaction.accountHeadName = sale.text;
                }
            };
            var accountRequest = new App.SearchRequest();
            self.searchService.search(accountRequest, self.url.accountHeadQuery + "/Dropdown")
                .then(accountSuccess, error);
        };
        PurchaseTransactionController.prototype.save = function () {
            console.log(this.transaction);
            var self = this;
            self.transaction.orderId = self.model.id;
            self.transaction.orderNumber = self.model.orderNumber;
            self.transaction.paymentGatewayServiceName = self.transaction.paymentGatewayService;
            self.transaction.transactionMediumName = self.transaction.transactionMedium;
            self.transaction.parentId = self.model.supplierId;
            self.transaction.transactionFor = "Purchase";
            self.transaction.transactionDate = self.transactionDate.toDateString();
            self.saveService.save(self.transaction, self.url.transaction + "/Add")
                .then(function (s) { self.stateService.go('root.purchases'); }, function (e) {
                alert('error occurred');
                console.log(e);
            });
        };
        PurchaseTransactionController.prototype.loadAccountInfos = function () {
            var self = this;
            var success = function (response) {
                App.Display.log('loadAccountInfos result : ', response);
                self.accountInfos = response.Models;
                if (self.accountInfos.length > 0) {
                    for (var i = 0; i < self.accountInfos.length; i++) {
                        if (self.accountInfos[i].text == "Cash") {
                            self.selectedAccountInfo = self.accountInfos[i];
                            console.log(self.selectedAccountInfo);
                            self.transaction.accountInfoId = self.selectedAccountInfo.id;
                            break;
                        }
                    }
                }
            };
            var error = function (error) {
                App.Display.log(error);
            };
            self.searchService.search(self.searchRequest, self.url.accountInfoQuery + "/Dropdown")
                .then(success, error);
        };
        PurchaseTransactionController.prototype.accountInfoChanged = function () {
            this.transaction.accountInfoTitle = this.selectedAccountInfo["text"];
            this.transaction.accountInfoId = this.selectedAccountInfo.id;
            this.transaction.paymentGatewayServiceName = this.transaction.accountInfoTitle;
        };
        PurchaseTransactionController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "$uibModal", 'Excel'
        ];
        return PurchaseTransactionController;
    }(App.BaseController));
    App.PurchaseTransactionController = PurchaseTransactionController;
    angular.module("app").controller("PurchaseTransactionController", PurchaseTransactionController);
})(App || (App = {}));
