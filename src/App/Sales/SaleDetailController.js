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
    var SaleDetailController = /** @class */ (function (_super) {
        __extends(SaleDetailController, _super);
        function SaleDetailController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.sale, url.saleQuery, excel) || this;
            _this.purchaseTotal = 0;
            if (_this.stateParams["id"]) {
                if (authService.accountInfo.role !== 'Deliveryman') {
                    _this.loadDeliverymans();
                }
                _this.loadDetail();
            }
            else {
                _this.back();
            }
            return _this;
        }
        SaleDetailController.prototype.loadDetail = function () {
            console.log(this.stateParams);
            var self = this;
            var successCallback = function (response) {
                self.model = response.data;
                self.showNextState = self.model.nextState != null;
                if (self.showNextState) {
                    self.userNotes = self.model.remarks;
                    self.model.remarks = '';
                }
                if (self.model.installmentId) {
                    self.loadInstallments(self.model.installmentId);
                }
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            var searchRequest = new App.SearchRequest();
            searchRequest.id = this.stateParams["id"];
            searchRequest.page = -1;
            var id = this.stateParams["id"];
            var httpUrl = self.url.saleQuery + "/Detail?id=" + id;
            self.searchService
                .search(searchRequest, httpUrl)
                .then(successCallback, errorCallback);
        };
        SaleDetailController.prototype.loadDeliverymans = function () {
            var self = this;
            var successCallback = function (response) {
                self.deliverymans = response.Models;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            var searchRequest = new App.SearchRequest();
            searchRequest["role"] = "DeliveryMan";
            var httpUrl = self.url.employee + "Query" + "/Search";
            self.searchService
                .search(searchRequest, httpUrl)
                .then(successCallback, errorCallback);
        };
        SaleDetailController.prototype.deliverymanChanged = function (d) {
            var self = this;
            self.model.deliverymanName = d.userName;
            self.model.deliverymanId = d.id;
        };
        SaleDetailController.prototype.nextState = function () {
            var self = this;
            var successCallback = function (response) {
                self.loadDetail();
            };
            var errorCallback = function (error) {
                console.log(error);
                if (error.status === 500) {
                    alert(error.data.exceptionMessage);
                }
                else {
                    alert("Error Occurred. Please contact with Administrator");
                }
            };
            self.model.customer = null;
            self.model.transactions = null;
            self.saveService.update(self.model, self.url.sale + "/NextState").then(successCallback, errorCallback);
        };
        SaleDetailController.prototype.receiptView = function () {
            var self = this;
            self.stateService.go("root.receipt", { receipt: self.model });
        };
        SaleDetailController.prototype.loadInstallments = function (installmentId) {
            var self = this;
            var searchRequest = new App.SearchRequest();
            var success = function (response) {
                self.model.installment = response.data;
                console.log(self.model.installment);
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            searchRequest.id = installmentId;
            searchRequest.page = -1;
            var url = self.url.installmentQuery + '/SearchDetail';
            self.searchService.search(searchRequest, url).then(success, errorCallback);
        };
        SaleDetailController.prototype.installmentPay = function (p) {
            console.log(p);
        };
        SaleDetailController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "$uibModal", 'Excel'
        ];
        return SaleDetailController;
    }(App.BaseController));
    App.SaleDetailController = SaleDetailController;
    angular.module("app").controller("SaleDetailController", SaleDetailController);
    var ReceiptController = /** @class */ (function (_super) {
        __extends(ReceiptController, _super);
        function ReceiptController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.sale, url.saleQuery, excel) || this;
            _this.totalQuantity = 0;
            _this.discountTotal = 0;
            _this.salePricePerUnitTotal = 0;
            if (_this.stateParams["id"]) {
                _this.loadDetail();
                _this.today = new Date();
            }
            else {
                _this.back();
            }
            _this.url = url;
            _this.isDivShow = false;
            return _this;
        }
        ReceiptController.prototype.loadDetail = function () {
            var _this = this;
            console.log(this.stateParams);
            var self = this;
            var successCallback = function (response) {
                self.model = response.data;
                console.log(self.model);
                for (var i = 0; i < self.model.saleDetails.length; i++) {
                    self.totalQuantity += self.model.saleDetails[i].quantity;
                    self.discountTotal += self.model.saleDetails[i].discountTotal;
                    self.salePricePerUnitTotal += self.model.saleDetails[i].salePricePerUnit;
                }
                if (_this.discountTotal > 0) {
                    _this.isDivShow = true;
                }
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            var searchRequest = new App.SearchRequest();
            searchRequest.id = this.stateParams["id"];
            searchRequest.page = -1;
            var id = this.stateParams["id"].toString();
            var httpUrl = self.url.saleQuery + "/Receipt?id=" + id;
            self.searchService.search(null, httpUrl).then(successCallback, errorCallback);
        };
        ReceiptController.prototype.ok = function () {
            window.print();
        };
        ReceiptController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "$uibModal", 'Excel'
        ];
        return ReceiptController;
    }(App.BaseController));
    App.ReceiptController = ReceiptController;
    angular.module("app").controller("ReceiptController", ReceiptController);
    var Receipt2Controller = /** @class */ (function (_super) {
        __extends(Receipt2Controller, _super);
        function Receipt2Controller(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.sale, url.saleQuery, excel) || this;
            _this.totalQuantity = 0;
            if (_this.stateParams["id"]) {
                _this.loadDetail();
                _this.today = new Date();
            }
            else {
                _this.back();
            }
            _this.url = url;
            return _this;
        }
        Receipt2Controller.prototype.loadDetail = function () {
            console.log(this.stateParams);
            var self = this;
            var successCallback = function (response) {
                self.model = response.data;
                for (var i = 0; i < self.model.saleDetails.length; i++) {
                    self.totalQuantity += self.model.saleDetails[i].quantity;
                }
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            var searchRequest = new App.SearchRequest();
            searchRequest.id = this.stateParams["id"];
            searchRequest.page = -1;
            var id = this.stateParams["id"].toString();
            var httpUrl = self.url.saleQuery + "/Receipt?id=" + id;
            self.searchService.search(null, httpUrl).then(successCallback, errorCallback);
        };
        Receipt2Controller.prototype.ok = function () {
            window.print();
        };
        Receipt2Controller.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "$uibModal", 'Excel'
        ];
        return Receipt2Controller;
    }(App.BaseController));
    App.Receipt2Controller = Receipt2Controller;
    angular.module("app").controller("Receipt2Controller", Receipt2Controller);
    var Receipt3Controller = /** @class */ (function (_super) {
        __extends(Receipt3Controller, _super);
        function Receipt3Controller(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.sale, url.saleQuery, excel) || this;
            _this.totalQuantity = 0;
            if (_this.stateParams["id"]) {
                _this.loadDetail();
                _this.today = new Date();
            }
            else {
                _this.back();
            }
            _this.url = url;
            return _this;
        }
        Receipt3Controller.prototype.loadDetail = function () {
            console.log(this.stateParams);
            var self = this;
            var successCallback = function (response) {
                console.log(response);
                self.model = response.data;
                for (var i = 0; i < self.model.saleDetails.length; i++) {
                    self.totalQuantity += self.model.saleDetails[i].quantity;
                }
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            var searchRequest = new App.SearchRequest();
            searchRequest.id = this.stateParams["id"];
            searchRequest.page = -1;
            var id = this.stateParams["id"].toString();
            var httpUrl = self.url.saleQuery + "/Receipt?id=" + id;
            self.searchService.search(null, httpUrl).then(successCallback, errorCallback);
        };
        Receipt3Controller.prototype.ok = function () {
            window.print();
        };
        Receipt3Controller.prototype.print = function (id) {
            if (id == null) {
                id = "receipt";
            }
            var printContents = document.getElementById(id).innerHTML;
            var popupWin;
            var baseUrl = 'http://' + document.location.host + this.url.clientSubFolder;
            console.log(baseUrl);
            var cssUrl = '';
            cssUrl = baseUrl + '/dist/css/all.css?t=074002082011';
            popupWin = window.open('', '_blank', 'scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
            popupWin.window.focus();
            popupWin.document.write('<!DOCTYPE html><html><head>' +
                '<link rel="stylesheet" ' +
                'href="' + cssUrl + '">' +
                '</head><body style="font-size:10px !important; line-height: 1.0 !important;">' +
                printContents +
                '</body></html>');
            popupWin.onbeforeunload = function (event) {
                popupWin.close();
            };
            popupWin.onabort = function (event) {
                popupWin.document.close();
                popupWin.close();
            };
            setTimeout(function () {
                popupWin.print();
            }, 1000);
        };
        Receipt3Controller.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "$uibModal", 'Excel'
        ];
        return Receipt3Controller;
    }(App.BaseController));
    App.Receipt3Controller = Receipt3Controller;
    angular.module("app").controller("Receipt3Controller", Receipt3Controller);
    var SaleReturnController = /** @class */ (function (_super) {
        __extends(SaleReturnController, _super);
        function SaleReturnController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.sale, url.saleQuery, excel) || this;
            _this.saleDetailTypes = ["Sale", "Damage", "Gift", "Return"];
            if (_this.stateParams["id"]) {
                _this.saleDetail = new App.SaleDetailViewModel();
                _this.productDetailSearchRequest = new App.SearchRequest();
                _this.loadDetail();
            }
            else {
                _this.back();
            }
            _this.loadWarehouses().then(function (warehouses) {
                //this.model.warehouseId = warehouses[0].id;
            });
            return _this;
        }
        SaleReturnController.prototype.loadDetail = function () {
            var _this = this;
            console.log(this.stateParams);
            var self = this;
            var successCallback = function (response) {
                self.model = response.data;
                console.log(_this.model);
                self.due = self.model.dueAmount;
                self.model.transactions = [];
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            var searchRequest = new App.SearchRequest();
            searchRequest.id = this.stateParams["id"];
            searchRequest.page = -1;
            var id = this.stateParams["id"];
            var httpUrl = self.url.saleQuery + "/Detail?id=" + id;
            self.searchService
                .search(searchRequest, httpUrl)
                .then(successCallback, errorCallback);
            self.due = 0;
        };
        SaleReturnController.prototype.loadProductDetails = function () {
            var self = this;
            if (self.productDetailSearchRequest.keyword.length < 3) {
                return;
            }
            var successCallback = function (response) {
                console.log('products ', response);
                self.productDetails = response.Models;
                self.productDetailsCount = response.Count;
                // self.productDetailSearchRequest.keyword = "";
                if (self.productDetailsCount === 1) {
                    //    this.addToCart2(self.productDetails[0]);
                }
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.productDetailSearchRequest["isProductActive"] = true;
            // self.productDetailSearchRequest.page = -1;
            self.searchService
                .search(self.productDetailSearchRequest, self.url.productDetailQuery + "/Search")
                .then(successCallback, errorCallback);
        };
        SaleReturnController.prototype.getPriceAndName = function () {
            this.saleDetail.total = this.saleDetail.quantity * this.saleDetail.salePricePerUnit;
        };
        SaleReturnController.prototype.setProductDetail = function (detail) {
            this.saleDetail.salePricePerUnit = detail.salePrice;
            this.saleDetail.productDetailId = detail.id;
            this.saleDetail.name = detail.name;
            this.saleDetail.productDetail = detail;
            this.saleDetail.productDetailName = detail.name;
            this.saleDetail.quantity = 1;
            this.getPriceAndName();
        };
        SaleReturnController.prototype.addToCart = function () {
            this.model.saleDetails.push(this.saleDetail);
            this.updateCartTotal();
            this.saleDetail = new App.SaleDetailViewModel();
        };
        SaleReturnController.prototype.addToCart2 = function (detail) {
            var exists = this.model.saleDetails.some(function (x) { return x.productDetailId === detail.id; });
            if (exists) {
                alert('Item : ' + detail.name + " is already added in cart.");
                return;
            }
            this.setProductDetail(detail);
            this.addToCart();
        };
        SaleReturnController.prototype.decreaseFromCart = function (index) {
            //this.model.saleDetails.splice(index, 1);
            var salePrice = this.model.saleDetails[index].salePricePerUnit;
            var quantity = this.model.saleDetails[index].quantity - 1;
            this.model.saleDetails[index].quantity = quantity;
            this.model.saleDetails[index].total = salePrice * quantity;
            this.updateCartTotal();
        };
        //updateQuantity(index): void {
        //    let salePrice = this.model.saleDetails[index].salePricePerUnit;
        //    let quantity = this.model.saleDetails[index].quantity;
        //    this.model.saleDetails[index].quantity = quantity;
        //    this.model.saleDetails[index].total = salePrice * quantity;
        //    this.updateCartTotal();
        //}
        SaleReturnController.prototype.updateQuantity = function (index) {
            var salePrice = this.model.saleDetails[index].salePricePerUnit;
            var quantity = this.model.saleDetails[index].quantity;
            this.model.saleDetails[index].quantity = quantity;
            this.model.saleDetails[index].total = salePrice * quantity;
            this.updateCartTotal();
        };
        SaleReturnController.prototype.updateQuantityAll = function () {
            for (var i = 0; i < this.model.saleDetails.length; i++) {
                this.updateQuantity(i);
            }
        };
        SaleReturnController.prototype.updateRemarks = function (index) {
            var salePrice = this.model.saleDetails[index].salePricePerUnit;
            var remarks = this.model.saleDetails[index].remarks;
            this.model.saleDetails[index].remarks = remarks;
            this.updateCartTotal();
        };
        SaleReturnController.prototype.updateRemarksAll = function () {
            for (var i = 0; i < this.model.saleDetails.length; i++) {
                this.updateRemarks(i);
            }
        };
        SaleReturnController.prototype.increaseToCart = function (index) {
            var salePrice = this.model.saleDetails[index].salePricePerUnit;
            var quantity = this.model.saleDetails[index].quantity + 1;
            this.model.saleDetails[index].quantity = quantity;
            this.model.saleDetails[index].total = salePrice * quantity;
            this.updateCartTotal();
        };
        SaleReturnController.prototype.removeFromCart = function (index) {
            this.model.saleDetails.splice(index, 1);
            this.updateCartTotal();
        };
        SaleReturnController.prototype.updateCartTotal = function () {
            var _this = this;
            var self = this;
            self.due = 0;
            //self.transaction.amount = 0;
            self.model.productAmount = 0;
            self.model.saleDetails.forEach(function (p) { return _this.model.productAmount += p.total; });
            self.model.totalAmount = self.model.productAmount + self.model.otherAmount +
                self.model.deliveryChargeAmount +
                self.model.paymentServiceChargeAmount;
            self.model.payableTotalAmount = self.model.totalAmount - self.model.discountAmount;
            self.updateTransactions();
        };
        SaleReturnController.prototype.applyShippingAmount = function () {
            var self = this;
            self.updateCartTotal();
            //self.model.totalAmount = self.model.productAmount + self.model.deliveryChargeAmount;
            //self.model.payableTotalAmount = self.model.totalAmount;
            //self.updateTransactions();
        };
        SaleReturnController.prototype.updateTransactions = function () {
            var self = this;
            self.model.dueAmount = self.model.payableTotalAmount - self.model.paidAmount;
            self.updateDue();
        };
        SaleReturnController.prototype.updateDue = function () {
            var self = this;
            self.due = self.model.dueAmount;
        };
        SaleReturnController.prototype.save = function () {
            var self = this;
            self.model.customer = null;
            self.model.transactions = [];
            // self.model.transactions.push(self.transaction);
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
            for (var i = 0; i < self.model.saleDetails.length; i++) {
                self.model.saleDetails[i].productDetail = null;
            }
            self.model.transactions = [];
            self.model.address = null;
            this.saveService.update(self.model, self.commandUrl + "/Return")
                .then(successCallback, errorCallback);
        };
        SaleReturnController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "$uibModal", 'Excel'
        ];
        return SaleReturnController;
    }(App.BaseController));
    App.SaleReturnController = SaleReturnController;
    angular.module("app").controller("SaleReturnController", SaleReturnController);
    var SaleReturn2Controller = /** @class */ (function (_super) {
        __extends(SaleReturn2Controller, _super);
        function SaleReturn2Controller(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.sale, url.saleQuery, excel) || this;
            if (_this.stateParams["id"]) {
                _this.saleDetail = new App.SaleDetailViewModel();
                _this.loadDetail();
            }
            else {
                _this.back();
            }
            _this.loadWarehouses().then(function (warehouses) {
                //this.model.warehouseId = warehouses[0].id;
            });
            return _this;
        }
        // saleDetailTypes: string[] = ["Damage", "Return"];
        SaleReturn2Controller.prototype.loadDetail = function () {
            console.log(this.stateParams);
            var self = this;
            var successCallback = function (response) {
                self.model = response.data;
                self.model.productAmount = 0;
                for (var i = 0; i < self.model.saleDetails.length; i++) {
                    self.model.saleDetails[i].quantity = 0;
                    self.model.saleDetails[i].total = 0;
                }
                self.due = self.model.dueAmount;
                self.model.transactions = [];
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            var searchRequest = new App.SearchRequest();
            searchRequest.id = this.stateParams["id"];
            searchRequest.page = -1;
            var id = this.stateParams["id"];
            var httpUrl = self.url.saleQuery + "/Detail?id=" + id;
            self.searchService
                .search(searchRequest, httpUrl)
                .then(successCallback, errorCallback);
            self.due = 0;
        };
        SaleReturn2Controller.prototype.decreaseFromCart = function (index) {
            //this.model.saleDetails.splice(index, 1);
            var salePrice = this.model.saleDetails[index].salePricePerUnit;
            var quantity = this.model.saleDetails[index].quantity - 1;
            this.model.saleDetails[index].quantity = quantity;
            this.model.saleDetails[index].total = salePrice * quantity;
            this.updateCartTotal();
        };
        SaleReturn2Controller.prototype.updateQuantity = function (index) {
            var salePrice = this.model.saleDetails[index].salePricePerUnit;
            var quantity = this.model.saleDetails[index].quantity;
            this.model.saleDetails[index].quantity = quantity;
            this.model.saleDetails[index].total = salePrice * quantity;
            this.updateCartTotal();
        };
        SaleReturn2Controller.prototype.updateQuantityAll = function () {
            for (var i = 0; i < this.model.saleDetails.length; i++) {
                this.updateQuantity(i);
            }
        };
        SaleReturn2Controller.prototype.updateRemarks = function (index) {
            var salePrice = this.model.saleDetails[index].salePricePerUnit;
            var remarks = this.model.saleDetails[index].remarks;
            this.model.saleDetails[index].remarks = remarks;
            this.updateCartTotal();
        };
        SaleReturn2Controller.prototype.updateRemarksAll = function () {
            for (var i = 0; i < this.model.saleDetails.length; i++) {
                this.updateRemarks(i);
            }
        };
        SaleReturn2Controller.prototype.increaseToCart = function (index) {
            var salePrice = this.model.saleDetails[index].salePricePerUnit;
            var quantity = this.model.saleDetails[index].quantity + 1;
            this.model.saleDetails[index].quantity = quantity;
            this.model.saleDetails[index].total = salePrice * quantity;
            this.updateCartTotal();
        };
        SaleReturn2Controller.prototype.updateCartTotal = function () {
            var _this = this;
            var self = this;
            self.model.productAmount = 0;
            self.model.saleDetails.forEach(function (p) { return _this.model.productAmount += p.total; });
        };
        SaleReturn2Controller.prototype.save = function () {
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
            for (var i = 0; i < self.model.saleDetails.length; i++) {
                self.model.saleDetails[i].productDetail = null;
                self.model.saleDetails[i].quantity = 0 - self.model.saleDetails[i].quantity;
                self.model.saleDetails[i].total = 0 - self.model.saleDetails[i].total;
            }
            this.saveService.update(self.model, self.commandUrl + "/Return2")
                .then(successCallback, errorCallback);
        };
        SaleReturn2Controller.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "$uibModal", 'Excel'
        ];
        return SaleReturn2Controller;
    }(App.BaseController));
    App.SaleReturn2Controller = SaleReturn2Controller;
    angular.module("app").controller("SaleReturn2Controller", SaleReturn2Controller);
    var SaleTransactionController = /** @class */ (function (_super) {
        __extends(SaleTransactionController, _super);
        function SaleTransactionController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.sale, url.saleQuery, excel) || this;
            if (_this.stateParams["id"]) {
                _this.transaction = new App.Transaction();
                _this.loadDetail();
                _this.setupDropdowns();
                _this.selectedAccountInfo = new App.AccountInfo();
                _this.loadAccountInfos();
            }
            else {
                _this.back();
            }
            return _this;
        }
        SaleTransactionController.prototype.loadDetail = function () {
            var _this = this;
            console.log(this.stateParams);
            var self = this;
            var successCallback = function (response) {
                self.model = response.data;
                self.showNextState = self.model.nextState != null;
                if (self.showNextState) {
                    self.userNotes = self.model.remarks;
                    self.model.remarks = '';
                }
                console.log(_this.model);
                self.transaction.amount = self.model.dueAmount;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            var searchRequest = new App.SearchRequest();
            searchRequest.id = this.stateParams["id"];
            searchRequest.page = -1;
            var id = this.stateParams["id"];
            var httpUrl = self.url.saleQuery + "/Detail?id=" + id;
            // var httpUrl = self.url.saleQuery + "/SearchDetail";
            self.searchService
                .search(searchRequest, httpUrl)
                .then(successCallback, errorCallback);
            //self.searchService.search(searchRequest, httpUrl).then(successCallback, errorCallback);
        };
        SaleTransactionController.prototype.setupDropdowns = function () {
            var self = this;
            var success = function (response) {
                console.log(response);
                self.transactionMediums = response.transactionMediums;
                //self.paymentGatewayServices = response.paymentGatewayServices;
                //self.accountInfoTypes = response.accountInfoTypes;
                //self.transactionFors = response.transactionFors;
                //self.transactionWiths = response.transactionWiths;
                //self.transactionFlowTypes = response.transactionFlowTypes;
                //self.transaction = new Transaction();
                self.transaction.transactionMedium = "Cash";
                //self.transaction.paymentGatewayService = "Cash";
                self.transaction.paymentGatewayServiceName = "Cash";
                //self.transaction.accountInfoType = "Cash";
                //self.accountInfoType = "Cash";
                //self.paymentGatewayService = "Cash";
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
                    self.transaction.accountHeadId = sale.id;
                    self.transaction.accountHeadName = sale.text;
                }
            };
            var accountRequest = new App.SearchRequest();
            self.searchService.search(accountRequest, self.url.accountHeadQuery + "/Dropdown")
                .then(accountSuccess, error);
        };
        SaleTransactionController.prototype.save = function () {
            var self = this;
            console.log(self.transaction);
            self.transaction.orderId = self.model.id;
            self.transaction.orderNumber = self.model.orderNumber;
            self.transaction.paymentGatewayServiceName = self.transaction.accountInfoTitle;
            self.transaction.transactionMediumName = self.transaction.transactionMedium;
            if (self.model.isDealerSale) {
                self.transaction.parentId = self.model.dealerId;
            }
            else {
                self.transaction.parentId = self.model.customerId;
            }
            self.transaction.transactionWith = "Customer";
            self.transaction.transactionFor = "Sale";
            self.transaction.transactionFlowType = "Income";
            self.transaction.transactionDate = self.transactionDate.toDateString();
            self.saveService.save(self.transaction, self.url.transaction + "/Add")
                .then(function (s) {
                //self.stateService.go('root.sales');
                self.back();
            }, function (e) {
                alert('error occurred');
                console.log(e);
            });
        };
        SaleTransactionController.prototype.loadAccountInfos = function () {
            var self = this;
            var success = function (response) {
                self.accountInfos = response.Models;
                if (self.accountInfos.length > 0) {
                    for (var i = 0; i < self.accountInfos.length; i++) {
                        if (self.accountInfos[i].text === "Cash") {
                            self.selectedAccountInfo = self.accountInfos[i];
                            self.transaction.accountInfoId = self.selectedAccountInfo.id;
                            self.transaction.accountInfoTitle = self.selectedAccountInfo.text;
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
        SaleTransactionController.prototype.accountInfoChanged = function () {
            this.transaction.accountInfoTitle = this.selectedAccountInfo["text"];
            this.transaction.accountInfoId = this.selectedAccountInfo.id;
        };
        SaleTransactionController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "$uibModal", 'Excel'
        ];
        return SaleTransactionController;
    }(App.BaseController));
    App.SaleTransactionController = SaleTransactionController;
    angular.module("app").controller("SaleTransactionController", SaleTransactionController);
    var SaleInstallmentTransactionController = /** @class */ (function (_super) {
        __extends(SaleInstallmentTransactionController, _super);
        function SaleInstallmentTransactionController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.sale, url.saleQuery, excel) || this;
            if (_this.stateParams["id"]) {
                _this.transaction = new App.Transaction();
                console.log('i m in SaleInstallmentTransactionController and id is ' + _this.stateParams['id']);
                _this.loadDetail();
                _this.setupDropdowns();
                _this.selectedAccountInfo = new App.AccountInfo();
                _this.loadAccountInfos();
            }
            else {
                _this.back();
            }
            return _this;
        }
        SaleInstallmentTransactionController.prototype.loadDetail = function () {
            console.log(this.stateParams);
            var self = this;
            var successCallback = function (response) {
                self.model = response.data;
                console.log(self.model);
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            var searchRequest = new App.SearchRequest();
            searchRequest.id = this.stateParams["id"];
            searchRequest.page = -1;
            var id = this.stateParams["id"];
            var httpUrl = self.url.saleQuery + "/Detail?id=" + id;
            // var httpUrl = self.url.saleQuery + "/SearchDetail";
            self.searchService
                .search(searchRequest, httpUrl)
                .then(successCallback, errorCallback);
            //self.searchService.search(searchRequest, httpUrl).then(successCallback, errorCallback);
        };
        SaleInstallmentTransactionController.prototype.setupDropdowns = function () {
            var self = this;
            var success = function (response) {
                console.log(response);
                self.transactionMediums = response.transactionMediums;
                self.transaction.transactionMedium = "Cash";
                self.transaction.transactionMediumName = "Cash";
                self.transaction.paymentGatewayServiceName = "Cash";
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
                    self.transaction.accountHeadId = sale.id;
                    self.transaction.accountHeadName = sale.text;
                }
            };
            var accountRequest = new App.SearchRequest();
            self.searchService.search(accountRequest, self.url.accountHeadQuery + "/Dropdown")
                .then(accountSuccess, error);
        };
        SaleInstallmentTransactionController.prototype.save = function () {
            var self = this;
            console.log(self.transaction);
            self.transaction.orderId = self.model.id;
            self.transaction.transactionFor = "Sale";
            self.transaction.transactionFlowType = "Income";
            self.transaction.transactionDate = self.transactionDate.toDateString();
            self.saveService.save(self.transaction, self.url.transaction + "/Add")
                .then(function (s) {
                //self.stateService.go('root.sales');
                self.back();
            }, function (e) {
                alert('error occurred');
                console.log(e);
            });
        };
        SaleInstallmentTransactionController.prototype.loadAccountInfos = function () {
            var self = this;
            var success = function (response) {
                self.accountInfos = response.Models;
                if (self.accountInfos.length > 0) {
                    for (var i = 0; i < self.accountInfos.length; i++) {
                        if (self.accountInfos[i].text === "Cash") {
                            self.selectedAccountInfo = self.accountInfos[i];
                            self.transaction.accountInfoId = self.selectedAccountInfo.id;
                            self.transaction.accountInfoTitle = self.selectedAccountInfo.text;
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
        SaleInstallmentTransactionController.prototype.accountInfoChanged = function () {
            this.transaction.accountInfoTitle = this.selectedAccountInfo["text"];
            this.transaction.accountInfoId = this.selectedAccountInfo.id;
        };
        SaleInstallmentTransactionController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "$uibModal", 'Excel'
        ];
        return SaleInstallmentTransactionController;
    }(App.BaseController));
    App.SaleInstallmentTransactionController = SaleInstallmentTransactionController;
    angular.module('app').controller('SaleInstallmentTransactionController', SaleInstallmentTransactionController);
    var SaleInstallmentDetailController = /** @class */ (function (_super) {
        __extends(SaleInstallmentDetailController, _super);
        function SaleInstallmentDetailController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, "", url.installmentDetailQuery, excel) || this;
            _this.search();
            return _this;
        }
        SaleInstallmentDetailController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return SaleInstallmentDetailController;
    }(App.BaseController));
    App.SaleInstallmentDetailController = SaleInstallmentDetailController;
    angular.module("app").controller("SaleInstallmentDetailController", SaleInstallmentDetailController);
    var SaleTransactionEditController = /** @class */ (function (_super) {
        __extends(SaleTransactionEditController, _super);
        function SaleTransactionEditController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.transaction, url.transactionQuery, excel) || this;
            if (_this.stateParams["id"]) {
                _this.editWithCallBack(_this.stateParams["id"], _this.callBack);
            }
            else {
                _this.back();
            }
            return _this;
        }
        SaleTransactionEditController.prototype.setupDropdowns = function () {
            var self = this;
            var success = function (response) {
                console.log(response);
                self.transactionMediums = response.transactionMediums;
                self.paymentGatewayServices = response.paymentGatewayServices;
                //self.transaction.transactionMedium = self.transaction.transactionMediumName;
                //self.transaction.paymentGatewayService = "Cash";
                //self.transaction.paymentGatewayServiceName = "Cash";
            };
            var error = function (error) {
                console.log(error);
            };
            self.searchService.get(self.url.transactionQuery + "/Dropdowns").then(success, error);
        };
        SaleTransactionEditController.prototype.callBack = function (data, self) {
            self.setupDropdowns();
            self.selectedAccountInfo = new App.AccountInfo();
            self.loadAccountInfos(self);
        };
        SaleTransactionEditController.prototype.loadAccountInfos = function (self) {
            //var self = this;
            var success = function (response) {
                App.Display.log(response);
                self.accountInfos = response.Models;
                for (var i = 0; i < self.accountInfos.length; i++) {
                    if (self.accountInfos[i].id === self.model.accountInfoId) {
                        self.selectedAccountInfo = self.accountInfos[i];
                    }
                }
            };
            var error = function (error) {
                App.Display.log(error);
            };
            self.searchService.search(self.searchRequest, self.url.accountInfoQuery + "/Dropdown")
                .then(success, error);
        };
        SaleTransactionEditController.prototype.accountInfoChanged = function () {
            var self = this;
            self.model.accountInfoTitle = self.selectedAccountInfo["text"];
            self.model.accountInfoId = self.selectedAccountInfo.id;
        };
        SaleTransactionEditController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "$uibModal", 'Excel'
        ];
        return SaleTransactionEditController;
    }(App.BaseController));
    App.SaleTransactionEditController = SaleTransactionEditController;
    angular.module("app").controller("SaleTransactionEditController", SaleTransactionEditController);
    var DealerSaleTransactionController = /** @class */ (function (_super) {
        __extends(DealerSaleTransactionController, _super);
        function DealerSaleTransactionController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.sale, url.saleQuery, excel) || this;
            if (_this.stateParams["id"]) {
                _this.transaction = new App.Transaction();
                _this.loadDetail();
                _this.setupDropdowns();
                _this.selectedAccountInfo = new App.AccountInfo();
                _this.loadAccountInfos();
            }
            else {
                _this.back();
            }
            return _this;
        }
        DealerSaleTransactionController.prototype.loadDetail = function () {
            var _this = this;
            console.log(this.stateParams);
            var self = this;
            var successCallback = function (response) {
                self.model = response.data;
                self.showNextState = self.model.nextState != null;
                if (self.showNextState) {
                    self.userNotes = self.model.remarks;
                    self.model.remarks = '';
                }
                console.log(_this.model);
                self.transaction.amount = self.model.dueAmount;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            var searchRequest = new App.SearchRequest();
            searchRequest.id = this.stateParams["id"];
            searchRequest.page = -1;
            searchRequest["IsDealerSale"] = true;
            var id = this.stateParams["id"];
            var httpUrl = self.url.saleQuery + "/Detail?id=" + id;
            self.searchService
                .search(searchRequest, httpUrl)
                .then(successCallback, errorCallback);
        };
        DealerSaleTransactionController.prototype.activateDealerSale = function () {
            var self = this;
            self.model.isDealerSale = true;
        };
        DealerSaleTransactionController.prototype.setupDropdowns = function () {
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
        DealerSaleTransactionController.prototype.save = function () {
            console.log(this.transaction);
            var self = this;
            self.transaction.orderId = self.model.id;
            self.transaction.orderNumber = self.model.orderNumber;
            self.transaction.paymentGatewayServiceName = self.transaction.paymentGatewayServiceName;
            self.transaction.transactionMediumName = self.transaction.transactionMedium;
            if (self.model.isDealerSale) {
                self.transaction.parentId = self.model.dealerId;
            }
            else {
                self.transaction.parentId = self.model.customerId;
            }
            self.transaction.transactionFor = "Sale";
            self.transaction.transactionFlowType = "Income";
            self.transaction.transactionDate = self.transactionDate.toDateString();
            self.saveService.save(self.transaction, self.url.transaction + "/Add")
                .then(function (s) {
                self.back();
            }, function (e) {
                alert('error occurred');
                console.log(e);
            });
        };
        DealerSaleTransactionController.prototype.loadAccountInfos = function () {
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
        DealerSaleTransactionController.prototype.accountInfoChanged = function () {
            var self = this;
            self.transaction.accountInfoTitle = self.selectedAccountInfo["text"];
            self.transaction.accountInfoId = self.selectedAccountInfo.id;
            self.transaction.paymentGatewayServiceName = self.transaction.accountInfoTitle;
        };
        DealerSaleTransactionController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "$uibModal", 'Excel'
        ];
        return DealerSaleTransactionController;
    }(App.BaseController));
    App.DealerSaleTransactionController = DealerSaleTransactionController;
    angular.module("app").controller("DealerSaleTransactionController", DealerSaleTransactionController);
    var DealerSaleTransactionEditController = /** @class */ (function (_super) {
        __extends(DealerSaleTransactionEditController, _super);
        function DealerSaleTransactionEditController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.transaction, url.transactionQuery, excel) || this;
            if (_this.stateParams["id"]) {
                _this.transaction = new App.Transaction();
                _this.editWithCallBack(_this.stateParams["id"], _this.callBack);
                _this.setupDropdowns();
                _this.selectedAccountInfo = new App.AccountInfo();
                _this.loadAccountInfos();
            }
            else {
                _this.back();
            }
            return _this;
        }
        DealerSaleTransactionEditController.prototype.setupDropdowns = function () {
            var self = this;
            var success = function (response) {
                console.log(response);
                self.transactionMediums = response.transactionMediums;
                self.paymentGatewayServices = response.paymentGatewayServices;
                self.accountInfoTypes = response.accountInfoTypes;
                self.accountInfoType = "Cash";
                self.transaction.transactionFlowType = "Income";
            };
            var error = function (error) {
                console.log(error);
            };
            self.searchService.get(self.url.transactionQuery + "/Dropdowns").then(success, error);
        };
        DealerSaleTransactionEditController.prototype.callBack = function (data) {
            console.log(data);
        };
        DealerSaleTransactionEditController.prototype.loadAccountInfos = function () {
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
        DealerSaleTransactionEditController.prototype.accountInfoChanged = function () {
            var self = this;
            self.transaction.accountInfoTitle = self.selectedAccountInfo["text"];
            self.transaction.accountInfoId = self.selectedAccountInfo.id;
            //self.transaction.paymentGatewayServiceName = self.transaction.accountInfoTitle;
        };
        DealerSaleTransactionEditController.prototype.update = function () {
            var self = this;
            self.model.transactionFlowType = "Income";
            self.model.transactionFor = "Sale";
            _super.prototype.update.call(this);
        };
        DealerSaleTransactionEditController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "$uibModal", 'Excel'
        ];
        return DealerSaleTransactionEditController;
    }(App.BaseController));
    App.DealerSaleTransactionEditController = DealerSaleTransactionEditController;
    angular.module("app").controller("DealerSaleTransactionEditController", DealerSaleTransactionEditController);
})(App || (App = {}));
