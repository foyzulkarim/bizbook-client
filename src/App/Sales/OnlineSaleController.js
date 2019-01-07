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
    // for deliveryman
    var OnlineSalesDeliverymanController = /** @class */ (function (_super) {
        __extends(OnlineSalesDeliverymanController, _super);
        function OnlineSalesDeliverymanController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.sale, url.saleQuery, excel) || this;
            _this.total = 0;
            _this.due = 0;
            _this.search();
            return _this;
        }
        OnlineSalesDeliverymanController.prototype.search = function () {
            var self = this;
            this.due = 0;
            this.total = 0;
            var successCallback = function (response) {
                console.log(response);
                self.models = response.Models;
                if (self.models.length === 0) {
                    console.log('No search result found');
                }
                else {
                    for (var i = 0; i < self.models.length; i++) {
                        self.total += self.models[i].totalAmount;
                        self.due += self.models[i].dueAmount;
                    }
                }
                self.totalCount = response.Count;
                self.searchRequest.totalPage = Math.ceil(response.Count / 10);
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            //self.searchRequest
            self.searchService
                .search(self.searchRequest, self.queryUrl + "/SearchDelivery")
                .then(successCallback, errorCallback);
        };
        OnlineSalesDeliverymanController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return OnlineSalesDeliverymanController;
    }(App.BaseController));
    App.OnlineSalesDeliverymanController = OnlineSalesDeliverymanController;
    angular.module("app").controller("OnlineSalesDeliverymanController", OnlineSalesDeliverymanController);
    var OnlineSalesController = /** @class */ (function (_super) {
        __extends(OnlineSalesController, _super);
        function OnlineSalesController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.sale, url.saleQuery, excel) || this;
            _this.search();
            return _this;
        }
        OnlineSalesController.prototype.searchOrders = function () {
            if (this.startDate != null) {
                this.searchRequest.startDate = this.startDate.toDateString();
            }
            if (this.endDate != null) {
                this.searchRequest.endDate = this.endDate.toDateString();
            }
            this.search();
        };
        OnlineSalesController.prototype.search = function () {
            var self = this;
            var successCallback = function (response) {
                console.log(response);
                self.models = response.Models;
                if (self.models.length === 0) {
                    console.log('No search result found');
                }
                self.searchRequest.totalPage = Math.ceil(response.Count / 10);
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService
                .search(self.searchRequest, self.queryUrl + "/Search")
                .then(successCallback, errorCallback);
        };
        OnlineSalesController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return OnlineSalesController;
    }(App.BaseController));
    App.OnlineSalesController = OnlineSalesController;
    angular.module("app").controller("OnlineSalesController", OnlineSalesController);
    var OnlineSaleController = /** @class */ (function (_super) {
        __extends(OnlineSaleController, _super);
        function OnlineSaleController(location, state, stateParams, url, search, save, authService, customerService, $uibModal, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.sale, url.saleQuery, excel) || this;
            _this.orderTypes = ["CashOnDelivery", "Courier", "Condition"];
            _this.transactionTypes = ["Cash", "Online", "Cheque", "Card", "Mobile", "Other"];
            _this.paymentMethods = ["Cash", "Cash (Sundarban)", "Cash (SA Paribahan)", "Rocket", "Bkash", "Ucash", "Mycash", "Easycash", "Mcash", "Other"];
            _this.orderFroms = ["Facebook", "Website", "PhoneCall", "MobileApp", "BizBook365", "Referral", "Other"];
            _this.modal = $uibModal;
            _this.selectedRow = null;
            _this.customerService = customerService;
            return _this;
        }
        OnlineSaleController.prototype.loadCustomers = function () {
            var self = this;
            var successCallback = function (response) {
                console.log('customers ', response);
                self.customers = response.Models;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService
                .search(self.customerSearchRequest, self.url.customerQuery + "/Search")
                .then(successCallback, errorCallback);
        };
        OnlineSaleController.prototype.loadCustomer = function () {
            var self = this;
            if (self.model.customerPhone.length < 11) {
                alert("Please enter valid phone number");
            }
            var successCallback = function (customer) {
                if (customer != null) {
                    console.log('customer is ', customer);
                    self.customer = customer;
                    self.model.customerName = self.customer.name;
                }
                else {
                    alert('Could not find any customer by phone number ' + self.model.customerPhone);
                }
            };
            var errorCallback = function (error) {
                console.log(error);
                alert('Error occurred');
            };
            self.customerService.loadCustomer(self.model.customerPhone).then(successCallback, errorCallback);
        };
        OnlineSaleController.prototype.selectCustomer = function (selecterCustomer) {
            this.customer = selecterCustomer;
        };
        OnlineSaleController.prototype.loadProductDetails = function () {
            var self = this;
            var successCallback = function (response) {
                console.log('products ', response);
                self.productDetails = response.Models;
                self.productDetailsCount = response.Count;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            // self.productDetailSearchRequest.page = -1;
            self.searchService
                .search(self.productDetailSearchRequest, self.url.productDetailQuery + "/Search")
                .then(successCallback, errorCallback);
        };
        OnlineSaleController.prototype.getPriceAndName = function () {
            //this.setProductDetail(this.saleDetail.productDetail);
            this.saleDetail.total = this.saleDetail.quantity * this.saleDetail.salePricePerUnit;
        };
        OnlineSaleController.prototype.getReturn = function () {
            this.model.dueAmount = this.model.totalAmount - this.model.paidAmount;
        };
        OnlineSaleController.prototype.setProductDetail = function (detail) {
            this.saleDetail.salePricePerUnit = detail.salePrice;
            this.saleDetail.productDetailId = detail.id;
            this.saleDetail.name = detail.name;
            this.saleDetail.productDetail = detail;
        };
        OnlineSaleController.prototype.addToCart = function () {
            this.model.saleDetails.push(this.saleDetail);
            this.updateCartTotal();
            this.saleDetail = new App.SaleDetailViewModel();
        };
        OnlineSaleController.prototype.editCart = function (p) {
            this.saleDetail = p;
            this.removeByAttr(this.model.saleDetails, 'productDetailId', p.productDetailId);
        };
        OnlineSaleController.prototype.removeByAttr = function (arr, attr, value) {
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
        OnlineSaleController.prototype.removeFromCart = function (p) {
            this.removeByAttr(this.model.saleDetails, 'productDetailId', p.productDetailId);
        };
        OnlineSaleController.prototype.updateCartTotal = function () {
            var _this = this;
            var self = this;
            self.model.productAmount = 0;
            self.model.saleDetails.forEach(function (p) { return _this.model.productAmount += p.total; });
            self.model.totalAmount = self.model.productAmount;
        };
        OnlineSaleController.prototype.calculateServiceCharge = function () {
            var self = this;
            self.model.otherAmount = self.serviceChargePercent * self.model.productAmount / 100;
        };
        OnlineSaleController.prototype.calculateTotal = function () {
            var self = this;
            self.model.totalAmount = self.model.productAmount + self.model.deliveryChargeAmount + self.model.otherAmount - self.model.discountAmount;
        };
        OnlineSaleController.prototype.save = function () {
            var self = this;
            var successCallback = function (response) {
                //this.print();
                self.activate();
            };
            var errorCallback = function (error) {
                console.log(error);
                if (error.status === 500) {
                    alert(error.data.exceptionMessage);
                }
            };
            for (var i = 0; i < self.model.saleDetails.length; i++) {
                self.model.saleDetails[i].productDetail = null;
                self.model.saleDetails[i].created = new Date().toDateString();
                self.model.saleDetails[i].modified = new Date().toDateString();
                self.model.saleDetails[i].createdBy = self.authService.accountInfo.userName;
                self.model.saleDetails[i].createdFrom = "Browser";
                self.model.saleDetails[i].modifiedBy = self.authService.accountInfo.userName;
                self.model.saleDetails[i].id = "1";
                self.model.saleDetails[i].shopId = self.model.saleDetails[i].shopId != null ? self.model.saleDetails[i].shopId : "1";
            }
            self.model.orderState = App.OrderState.Pending;
            //self.model.requiredDeliveryDateByCustomer = self.requ;
            this.saveService.save(self.model, self.commandUrl + "/Add")
                .then(successCallback, errorCallback);
        };
        OnlineSaleController.prototype.activate = function () {
            console.log('im in child activate. ');
            _super.prototype.activate.call(this);
            this.customerSearchRequest = new App.SearchRequest("", "Modified", "False", "");
            this.productDetailSearchRequest = new App.SearchRequest("", "Modified", "False", "");
            this.model = new App.SaleViewModel();
            this.model.orderNumber = "S-" + this.generateOrderNumber();
            //  this.model.requiredDeliveryDateByCustomer = new Date();
            this.saleDetail = new App.SaleDetailViewModel();
            this.serviceChargePercent = 0;
        };
        OnlineSaleController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "CustomerService", "$uibModal", 'Excel'
        ];
        return OnlineSaleController;
    }(App.BaseController));
    App.OnlineSaleController = OnlineSaleController;
    angular.module("app").controller("OnlineSaleController", OnlineSaleController);
})(App || (App = {}));
