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
    var PurchasesController = /** @class */ (function (_super) {
        __extends(PurchasesController, _super);
        function PurchasesController(location, state, stateParams, url, search, save, authService, localStorageService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.purchase, url.purchaseQuery, excel) || this;
            _this.totalPaid = 0;
            _this.totalDue = 0;
            _this.headers = ["id", "totalAmount", "paidAmount", "modified"];
            _this.localStorageService = localStorageService;
            _this.supplierSearchRequest = new App.SearchRequest("", "Modified", "False", "");
            _this.loadSuppliers();
            _this.searchRequest.isIncludeParents = true;
            var page = _this.localStorageService.get(App.LocalStorageKeys.SaleListPageNo);
            if (!page) {
                _this.localStorageService.save(App.LocalStorageKeys.SaleListPageNo, 1);
                page = 1;
            }
            _this.searchRequest.page = page;
            _this.searchByWarehouse().then(function (result) { console.log('purchases searched by warehouse'); });
            return _this;
        }
        PurchasesController.prototype.search = function () {
            var self = this;
            self.totalPaid = 0;
            self.totalDue = 0;
            var successCallback = function (response) {
                console.log(response);
                self.models = response.Models;
                if (self.models.length === 0) {
                    console.log('No search result found');
                }
                else {
                    self.generateCsvModels();
                    for (var i = 0; i < self.models.length; i++) {
                        self.totalPaid += self.models[i].totalAmount;
                        self.totalDue += self.models[i].dueAmount;
                    }
                }
                self.totalCount = response.Count;
                self.searchRequest.totalPage = Math.ceil(response.Count / 10);
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService
                .search(self.searchRequest, self.queryUrl + "/Search")
                .then(successCallback, errorCallback);
        };
        PurchasesController.prototype.loadSuppliers = function () {
            var self = this;
            var successCallback = function (response) {
                console.log('suppliers ', response);
                self.suppliers = response.Models;
                var supplier = new App.Supplier();
                supplier.id = App.Guid.defaultGuid();
                supplier["text"] = "All";
                self.suppliers.splice(0, 0, supplier);
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService
                .search(self.supplierSearchRequest, self.url.supplierQuery + "/Dropdown")
                .then(successCallback, errorCallback);
        };
        PurchasesController.prototype.goto = function (page) {
            var self = this;
            self.localStorageService.save(App.LocalStorageKeys.SaleListPageNo, page);
            _super.prototype.goto.call(this, page);
        };
        PurchasesController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", 'Excel'
        ];
        return PurchasesController;
    }(App.BaseController));
    App.PurchasesController = PurchasesController;
    angular.module("app").controller("PurchasesController", PurchasesController);
    var PurchaseController = /** @class */ (function (_super) {
        __extends(PurchaseController, _super);
        function PurchaseController(location, state, stateParams, url, search, save, authService, excel, localStorageService) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.purchase, url.purchaseQuery, excel) || this;
            _this.purchaseOrderDate = new Date();
            return _this;
        }
        PurchaseController.prototype.activate = function () {
            var _this = this;
            this.supplierSearchRequest = new App.SearchRequest("", "Modified", "False", "");
            this.searchRequest = new App.SearchRequest("", "Modified", "False", "");
            this.productDetailSearchRequest = new App.SearchRequest("", "Modified", "False", "");
            this.productDetailSearchRequest["isProductActive"] = true;
            this.model = new App.PurchaseViewModel();
            this.model.orderNumber = "P-" + this.generateOrderNumber();
            this.model.paidAmount = 0;
            this.purchaseDetail = new App.PurchaseDetailViewModel();
            this.selectedRow = null;
            this.models = [];
            this.isUpdateMode = false;
            this.totalCount = 0;
            this.loadSuppliers();
            this.loadProductDetails();
            this.loadWarehouses().then(function (warehouses) {
                _this.model.warehouseId = warehouses[0].id;
            });
        };
        PurchaseController.prototype.loadSuppliers = function () {
            var self = this;
            var successCallback = function (response) {
                console.log('suppliers ', response);
                self.suppliers = response.Models;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService
                .search(self.supplierSearchRequest, self.url.supplierQuery + "/Dropdown")
                .then(successCallback, errorCallback);
        };
        PurchaseController.prototype.loadProductDetails = function () {
            var self = this;
            if (self.productDetailSearchRequest.keyword.length < 3) {
                return;
            }
            var successCallback = function (response) {
                console.log('products ', response);
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
        PurchaseController.prototype.getPriceAndName = function () {
            // this.setProductDetail(this.purchaseDetail.productDetail);
            //this.purchaseDetail.totalAmount = this.purchaseDetail.quantity * this.purchaseDetail.pricePerUnit;
            this.purchaseDetail.costTotal = this.purchaseDetail.quantity * this.purchaseDetail.productDetail.costPrice;
            //this.productDetail.productName =
            this.purchaseDetail.costPricePerUnit = this.purchaseDetail.costPricePerUnit;
        };
        PurchaseController.prototype.decreaseFromCart = function (index) {
            var quantity = this.model.purchaseDetails[index].quantity - 1;
            if (quantity === 0) {
                this.removeFromCart(index);
            }
            else {
                var costPricePerUnit = this.model.purchaseDetails[index].costPricePerUnit;
                this.model.purchaseDetails[index].quantity = quantity;
                this.model.purchaseDetails[index].costTotal = costPricePerUnit * quantity;
            }
            this.updateCartTotal();
        };
        PurchaseController.prototype.addToCart2 = function (detail) {
            var exists = this.model.purchaseDetails.some(function (x) { return x.productDetailId === detail.id; });
            if (exists) {
                alert('Item : ' + detail.name + " is already added in cart.");
                return;
            }
            this.setProductDetail(detail);
            this.addToCart();
        };
        PurchaseController.prototype.setProductDetail = function (detail) {
            this.purchaseDetail.costPricePerUnit = detail.costPrice;
            this.purchaseDetail.productDetailId = detail.id;
            this.purchaseDetail.name = detail.name;
            this.purchaseDetail.productDetail = detail;
            this.purchaseDetail.quantity = 1;
            this.getPriceAndName();
        };
        PurchaseController.prototype.addToCart = function () {
            this.model.purchaseDetails.push(this.purchaseDetail);
            this.updateCartTotal();
            this.purchaseDetail = new App.PurchaseDetailViewModel();
        };
        PurchaseController.prototype.editCart = function (p) {
            this.purchaseDetail = p;
            this.removeByAttr(this.model.purchaseDetails, 'productDetailId', p.productDetailId);
        };
        PurchaseController.prototype.removeByAttr = function (arr, attr, value) {
            var i = arr.length;
            while (i--) {
                if (arr[i]
                    && arr[i].hasOwnProperty(attr)
                    && (arguments.length > 2 && arr[i][attr] === value)) {
                    arr.splice(i, 1);
                }
            }
            return arr;
        };
        PurchaseController.prototype.removeFromCart = function (index) {
            // this.removeByAttr(this.model.purchaseDetails, 'productDetailId', p.productDetailId);
            this.model.purchaseDetails.splice(index, 1);
            this.updateCartTotal();
        };
        //private updateTransactions(): void {
        //    var self = this;
        //    self.model.paidAmount = 0;
        //    $.each(self.model.transactions,
        //        function (x) {
        //            let temp = this as Transaction;
        //            self.model.paidAmount += temp.amount;
        //        });
        //    self.model.dueAmount = self.model.payableTotalAmount - self.model.paidAmount;
        //    self.transaction = new Transaction();
        //    self.transaction.transactionMedium = "Cash";
        //    self.transaction.paymentGatewayService = "Cash";
        //}
        PurchaseController.prototype.updateCartTotal = function () {
            var _this = this;
            var self = this;
            // self.model.otherAmount = 0;
            self.model.productAmount = 0;
            self.model.purchaseDetails.forEach(function (p) { return _this.model.productAmount += p.costTotal; });
            self.model.totalAmount = self.model.productAmount;
            self.updateTotal();
        };
        PurchaseController.prototype.updateTotal = function () {
            var self = this;
            self.model.totalAmount = self.model.productAmount + self.model.shippingAmount;
            self.model.totalAmount = self.model.totalAmount - self.model.discountAmount;
            self.model.totalAmount = self.model.totalAmount + self.model.otherAmount;
            self.model.dueAmount = self.model.totalAmount - self.model.paidAmount;
        };
        PurchaseController.prototype.updateQuantityAll = function () {
            for (var i = 0; i < this.model.purchaseDetails.length; i++) {
                this.updateQuantity(i);
            }
        };
        PurchaseController.prototype.increaseToCart = function (index) {
            var quantity = this.model.purchaseDetails[index].quantity + 1;
            var costPricePerUnit = this.model.purchaseDetails[index].costPricePerUnit;
            this.model.purchaseDetails[index].quantity = quantity;
            this.model.purchaseDetails[index].costTotal = costPricePerUnit * quantity;
            this.updateCartTotal();
        };
        PurchaseController.prototype.updateQuantity = function (index) {
            var costPricePerUnit = this.model.purchaseDetails[index].costPricePerUnit;
            var quantity = this.model.purchaseDetails[index].quantity;
            this.model.purchaseDetails[index].quantity = quantity;
            this.model.purchaseDetails[index].costTotal = costPricePerUnit * quantity;
            this.updateCartTotal();
        };
        //updateTotal(): void {
        //    var self = this;
        //    self.model.totalAmount = self.model.productAmount + self.model.deliveryChargeAmount + self.model.paymentServiceChargeAmount;
        //    self.model.payableTotalAmount = self.model.totalAmount - self.model.discountAmount;
        //    self.model.dueAmount = self.model.payableTotalAmount - self.model.paidAmount;
        //}
        PurchaseController.prototype.save = function () {
            var self = this;
            var successCallback = function (response) {
                self.activate();
            };
            var errorCallback = function (error) {
                console.log(error);
                alert("Error occurred during save. Check your data or please contact with administrator.");
            };
            for (var i = 0; i < self.model.purchaseDetails.length; i++) {
                self.model.purchaseDetails[i].productDetail = null;
                self.model.purchaseDetails[i].created = new Date().toDateString();
                self.model.purchaseDetails[i].modified = new Date().toDateString();
                self.model.purchaseDetails[i].createdBy = self.authService.accountInfo.userName;
                self.model.purchaseDetails[i].createdFrom = "Browser";
                self.model.purchaseDetails[i].modifiedBy = self.authService.accountInfo.userName;
                self.model.purchaseDetails[i].id = "1";
                self.model.purchaseDetails[i].shopId = self.model.purchaseDetails[i].shopId != null ? self.model.purchaseDetails[i].shopId : "1";
            }
            self.saveService.save(self.model, self.commandUrl + "/Add").then(successCallback, errorCallback);
        };
        PurchaseController.prototype.dateChanged = function () {
            var self = this;
            console.log(self.purchaseOrderDate);
            self.model.purchaseOrderDate = self.purchaseOrderDate.toDateString();
        };
        PurchaseController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel', 'localStorageService'
        ];
        return PurchaseController;
    }(App.BaseController));
    App.PurchaseController = PurchaseController;
    angular.module("app").controller("PurchaseController", PurchaseController);
})(App || (App = {}));
