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
    var WarehouseController = /** @class */ (function (_super) {
        __extends(WarehouseController, _super);
        function WarehouseController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.warehouse, url.warehouseQuery, excel) || this;
            _this.selectedRow = null;
            _this.isUpdateMode = false;
            if (_this.stateParams["id"]) {
                _this.isUpdateMode = true;
                _this.edit(_this.stateParams["id"]);
            }
            return _this;
        }
        WarehouseController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return WarehouseController;
    }(App.BaseController));
    App.WarehouseController = WarehouseController;
    angular.module("app").controller("WarehouseController", WarehouseController);
    var WarehousesController = /** @class */ (function (_super) {
        __extends(WarehousesController, _super);
        function WarehousesController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.warehouse, url.warehouseQuery, excel) || this;
            if (_this.stateParams["myId"]) {
                _this.searchRequest["warehouseId"] = _this.user.warehouseId;
            }
            _this.search();
            return _this;
        }
        WarehousesController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return WarehousesController;
    }(App.BaseController));
    App.WarehousesController = WarehousesController;
    angular.module("app").controller("WarehousesController", WarehousesController);
    var WarehouseHistoryController = /** @class */ (function (_super) {
        __extends(WarehouseHistoryController, _super);
        function WarehouseHistoryController(location, $state, $stateParams, url, searchService, saveService, auth, excel) {
            var _this = _super.call(this, location, $state, $stateParams, url, searchService, saveService, auth, url.warehouse, url.warehouseQuery, excel) || this;
            if (_this.stateParams["id"]) {
                _this.loadWarehouseHistory();
            }
            else {
                _this.back();
            }
            return _this;
        }
        WarehouseHistoryController.prototype.loadWarehouseHistory = function () {
            var self = this;
            var successCallback = function (response) {
                console.log(response);
                //self.warehouseViewModel = response.data["result"];
                self.models = response.data;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            var searchRequest = new App.SearchRequest();
            searchRequest.parentId = this.stateParams["id"];
            //            searchRequest.page = 1;
            self.searchService
                .search(searchRequest, self.url.warehouseQuery + "/History")
                .then(successCallback, errorCallback);
        };
        WarehouseHistoryController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return WarehouseHistoryController;
    }(App.BaseController));
    App.WarehouseHistoryController = WarehouseHistoryController;
    angular.module("app").controller("WarehouseHistoryController", WarehouseHistoryController);
    var WarehouseProductHistoryController = /** @class */ (function (_super) {
        __extends(WarehouseProductHistoryController, _super);
        function WarehouseProductHistoryController(http, location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.warehouse, url.warehouseQuery, excel) || this;
            _this.isProductActive = true;
            _this.http = http;
            _this.getWarehouseHistory();
            return _this;
        }
        WarehouseProductHistoryController.prototype.getWarehouseHistory = function () {
            var self = this;
            var data = {
                warehouseId: self.stateParams['warehouseId'],
                isProductActive: self.isProductActive
            };
            self.http.post(self.url.warehouseQuery + '/ProductHistory', data).then(function (res) {
                self.models = res['data'];
            });
        };
        WarehouseProductHistoryController.$inject = [
            "$http", "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return WarehouseProductHistoryController;
    }(App.BaseController));
    App.WarehouseProductHistoryController = WarehouseProductHistoryController;
    angular.module("app").controller("WarehouseProductHistoryController", WarehouseProductHistoryController);
    var StockTransferController = /** @class */ (function (_super) {
        __extends(StockTransferController, _super);
        function StockTransferController(scope, filter, location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.stocktransfer, url.stocktransferQuery, excel) || this;
            _this.estimatedDeliveyDate = new Date();
            _this.estimatedDeliveyDate.setDate(_this.estimatedDeliveyDate.getDate());
            var self = _this;
            scope.$watch('vm.estimatedDeliveyDate', function (newValue) {
                var dateValue = filter('date')((newValue), 'dd-MMMM-yyyy');
                self.model.estimatedDeliveryDate = dateValue;
                console.log(dateValue);
            });
            return _this;
        }
        StockTransferController.prototype.activate = function () {
            this.searchRequest = new App.SearchRequest("", "Modified", "False", "");
            this.productDetailSearchRequest = new App.SearchRequest("", "Modified", "False", "");
            this.model = new App.StockTransferViewModel();
            this.model.orderNumber = "ST-" + this.generateOrderNumber();
            this.stockTransferDetail = new App.StockTransferDetailViewModel();
            this.selectedRow = null;
            this.models = [];
            this.isUpdateMode = false;
            this.totalCount = 0;
            var self = this;
            this.loadWarehouses().then(function (warehouses) {
                self.model.sourceWarehouseId = warehouses[0].id;
                self.loadOtherWarehouses();
            });
            this.loadProductDetails();
        };
        StockTransferController.prototype.loadProductDetails = function () {
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
            self.productDetailSearchRequest["isProductActive"] = true;
            self.productDetailSearchRequest.warehouseId = self.model.sourceWarehouseId;
            self.searchService
                .search(self.productDetailSearchRequest, self.url.productDetailQuery + "/SearchByWarehouse")
                .then(successCallback, errorCallback);
        };
        StockTransferController.prototype.getPriceAndName = function () {
            this.stockTransferDetail.priceTotal = this.stockTransferDetail.quantity * this.stockTransferDetail.salePricePerUnit;
        };
        StockTransferController.prototype.decreaseFromCart = function (index) {
            var quantity = this.model.stockTransferDetails[index].quantity - 1;
            if (quantity === 0) {
                this.removeFromCart(index);
            }
            else {
                var salePrice = this.model.stockTransferDetails[index].salePricePerUnit;
                this.model.stockTransferDetails[index].quantity = quantity;
                this.model.stockTransferDetails[index].priceTotal = salePrice * quantity;
            }
            this.updateCartTotal();
        };
        StockTransferController.prototype.removeFromCart = function (index) {
            this.model.stockTransferDetails.splice(index, 1);
            this.updateCartTotal();
        };
        StockTransferController.prototype.increaseToCart = function (index) {
            var quantity = this.model.stockTransferDetails[index].quantity + 1;
            var salePrice = this.model.stockTransferDetails[index].salePricePerUnit;
            this.model.stockTransferDetails[index].quantity = quantity;
            this.model.stockTransferDetails[index].priceTotal = salePrice * quantity;
            this.updateCartTotal();
        };
        StockTransferController.prototype.updateCartTotal = function () {
            var _this = this;
            var self = this;
            self.model.productAmount = 0;
            self.model.stockTransferDetails.forEach(function (p) { return _this.model.productAmount += p.priceTotal; });
            self.model.totalAmount = self.model.productAmount;
        };
        StockTransferController.prototype.addToCart2 = function (detail) {
            this.setProductDetail(detail);
            this.addToCart();
        };
        StockTransferController.prototype.setProductDetail = function (detail) {
            this.stockTransferDetail.salePricePerUnit = detail.salePrice;
            this.stockTransferDetail.productDetailId = detail.id;
            this.stockTransferDetail.productDetailName = detail.name;
            this.stockTransferDetail.productDetail = detail;
            this.stockTransferDetail.quantity = 1;
            this.getPriceAndName();
        };
        StockTransferController.prototype.addToCart = function () {
            this.model.stockTransferDetails.push(this.stockTransferDetail);
            this.updateCartTotal();
            this.stockTransferDetail = new App.StockTransferDetailViewModel();
        };
        StockTransferController.prototype.editCart = function (p) {
            this.stockTransferDetail = p;
            this.removeByAttr(this.model.stockTransferDetails, 'productDetailId', p.productDetailId);
        };
        StockTransferController.prototype.removeByAttr = function (arr, attr, value) {
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
        StockTransferController.prototype.updateQuantityAll = function () {
            for (var i = 0; i < this.model.stockTransferDetails.length; i++) {
                this.updateQuantity(i);
            }
        };
        StockTransferController.prototype.updateQuantity = function (index) {
            var salePrice = this.model.stockTransferDetails[index].salePricePerUnit;
            var quantity = this.model.stockTransferDetails[index].quantity;
            this.model.stockTransferDetails[index].quantity = quantity;
            this.model.stockTransferDetails[index].priceTotal = salePrice * quantity;
            this.updateCartTotal();
        };
        StockTransferController.prototype.save = function () {
            var self = this;
            var successCallback = function (response) {
                self.activate();
            };
            var errorCallback = function (error) {
                console.log(error);
                alert("Error occurred during save. Check your data or please contact with administrator.");
            };
            if (self.model.destinationWarehouseId == null || self.model.destinationWarehouseId == "") {
                alert('Destination warehouse can not be empty');
                return;
            }
            for (var i = 0; i < self.model.stockTransferDetails.length; i++) {
                self.model.stockTransferDetails[i].productDetail = null;
                self.model.stockTransferDetails[i].created = new Date().toDateString();
                self.model.stockTransferDetails[i].modified = new Date().toDateString();
                self.model.stockTransferDetails[i].createdBy = self.authService.accountInfo.userName;
                self.model.stockTransferDetails[i].createdFrom = "Browser";
                self.model.stockTransferDetails[i].modifiedBy = self.authService.accountInfo.userName;
                self.model.stockTransferDetails[i].id = "1";
                self.model.stockTransferDetails[i].shopId = self.model.stockTransferDetails[i].shopId != null ? self.model.stockTransferDetails[i].shopId : "1";
            }
            self.saveService.save(self.model, self.commandUrl + "/Add").then(successCallback, errorCallback);
        };
        StockTransferController.prototype.loadOtherWarehouses = function () {
            var self = this;
            var successCallback = function (response) {
                self.destinationWarehouses = response.Models;
                if (self.destinationWarehouses.length > 0) {
                    var warehouseId_1 = self.user.warehouseId;
                    if (warehouseId_1 && self.user.role.indexOf("Warehouse") !== -1) {
                        self.destinationWarehouses = self.destinationWarehouses.filter(function (x) { return x.id !== warehouseId_1; });
                    }
                }
                return self.destinationWarehouses;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            var reqeust = new App.SearchRequest();
            return self.searchService
                .search(reqeust, self.url.warehouseQuery + "/Dropdown")
                .then(successCallback, errorCallback);
        };
        StockTransferController.$inject = [
            "$scope", "$filter", "$location", "$state", "$stateParams", "UrlService", "SearchService",
            "SaveService", "AuthService", 'Excel'
        ];
        return StockTransferController;
    }(App.BaseController));
    App.StockTransferController = StockTransferController;
    angular.module("app").controller("StockTransferController", StockTransferController);
    var StockTransfersController = /** @class */ (function (_super) {
        __extends(StockTransfersController, _super);
        function StockTransfersController(scope, filter, location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.stocktransfer, url.stocktransferQuery, excel) || this;
            _this.searchRequest.isIncludeParents = true;
            _this.search();
            return _this;
        }
        StockTransfersController.$inject = [
            "$scope", "$filter", "$location", "$state", "$stateParams", "UrlService", "SearchService",
            "SaveService", "AuthService", 'Excel'
        ];
        return StockTransfersController;
    }(App.BaseController));
    App.StockTransfersController = StockTransfersController;
    angular.module("app").controller("StockTransfersController", StockTransfersController);
    var StockTransferDetailController = /** @class */ (function (_super) {
        __extends(StockTransferDetailController, _super);
        function StockTransferDetailController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.stocktransfer, url.stocktransferQuery, excel) || this;
            console.log('StockTransferDetailController');
            if (_this.stateParams["id"]) {
                _this.loadDetail();
            }
            else {
                _this.back();
            }
            return _this;
        }
        StockTransferDetailController.prototype.loadDetail = function () {
            console.log(this.stateParams);
            var self = this;
            var successCallback = function (response) {
                self.model = response.data;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            var searchRequest = new App.SearchRequest();
            searchRequest.id = this.stateParams["id"];
            searchRequest.page = -1;
            var id = this.stateParams["id"];
            var httpUrl = self.url.stocktransferQuery + "/SearchDetail?id=" + id;
            self.searchService
                .search(searchRequest, httpUrl)
                .then(successCallback, errorCallback);
        };
        StockTransferDetailController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return StockTransferDetailController;
    }(App.BaseController));
    App.StockTransferDetailController = StockTransferDetailController;
    angular.module('app').controller("StockTransferDetailController", StockTransferDetailController);
    var DamageController = /** @class */ (function (_super) {
        __extends(DamageController, _super);
        function DamageController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.damage, url.damageQuery, excel) || this;
            _this.loadProductDetails();
            _this.selectedRow = null;
            _this.isUpdateMode = false;
            _this.loadWarehouses().then(function (warehouses) {
                _this.model.warehouseId = warehouses[0].id;
            });
            if (_this.stateParams["id"]) {
                _this.isUpdateMode = true;
                _this.edit2(_this.stateParams["id"]);
            }
            return _this;
        }
        DamageController.prototype.loadProductDetails = function () {
            var self = this;
            var successCallback = function (response) {
                console.log(response);
                self.productDteails = response.Models;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService
                .search(self.searchRequest, self.url.productDetailQuery + "/Dropdown")
                .then(successCallback, errorCallback);
        };
        DamageController.prototype.groupChanged = function () {
            console.log(this.model.productDetailId);
        };
        DamageController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return DamageController;
    }(App.BaseController));
    App.DamageController = DamageController;
    angular.module("app").controller("DamageController", DamageController);
    var DamagesController = /** @class */ (function (_super) {
        __extends(DamagesController, _super);
        function DamagesController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.damage, url.damageQuery, excel) || this;
            _this.loadProductDetails();
            _this.selectedRow = null;
            _this.isUpdateMode = false;
            _this.loadWarehouses().then(function (warehouses) {
                _this.model.warehouseId = warehouses[0].id;
            });
            _this.searchRequest.isIncludeParents = true;
            _this.search();
            return _this;
        }
        DamagesController.prototype.loadProductDetails = function () {
            var self = this;
            var successCallback = function (response) {
                console.log(response);
                self.productDteails = response.Models;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService
                .search(self.searchRequest, self.url.productDetailQuery + "/Dropdown")
                .then(successCallback, errorCallback);
        };
        DamagesController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return DamagesController;
    }(App.BaseController));
    App.DamagesController = DamagesController;
    angular.module("app").controller("DamagesController", DamagesController);
    var StockTransferReturnController = /** @class */ (function (_super) {
        __extends(StockTransferReturnController, _super);
        function StockTransferReturnController(location, state, stateParams, url, search, save, authService, localStorageService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.stocktransfer, url.stocktransferQuery, excel) || this;
            var self = _this;
            self.localStorageService = localStorageService;
            _this.loadWarehouses().then(function (warehouses) {
                self.model.sourceWarehouseId = warehouses[0].id;
                self.loadOtherWarehouses();
            });
            if (_this.stateParams["id"]) {
                _this.stockTransferDetail = new App.StockTransferDetailViewModel();
                _this.productDetailSearchRequest = new App.SearchRequest();
                _this.loadDetail();
                _this.loadProductDetails();
            }
            else {
                _this.back();
            }
            var acc = _this.authService.accountInfo;
            self.isApproveProduct = false;
            if (acc.role == 'ShopAdmin' || acc.role == 'WarehouseAdmin') {
                self.isApproveProduct = true;
                console.log(acc.role);
            }
            return _this;
        }
        StockTransferReturnController.prototype.loadDetail = function () {
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
            var httpUrl = self.url.stocktransferQuery + "/SearchDetail?id=" + id;
            self.searchService
                .search(searchRequest, httpUrl)
                .then(successCallback, errorCallback);
        };
        StockTransferReturnController.prototype.loadProductDetails = function () {
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
            self.productDetailSearchRequest["isProductActive"] = true;
            self.productDetailSearchRequest.warehouseId = self.model.sourceWarehouseId;
            self.searchService
                .search(self.productDetailSearchRequest, self.url.productDetailQuery + "/SearchByWarehouse")
                .then(successCallback, errorCallback);
        };
        StockTransferReturnController.prototype.getPriceAndName = function () {
            this.stockTransferDetail.priceTotal = this.stockTransferDetail.quantity * this.stockTransferDetail.salePricePerUnit;
        };
        StockTransferReturnController.prototype.decreaseFromCart = function (index) {
            var quantity = this.model.stockTransferDetails[index].quantity - 1;
            if (quantity === 0) {
                this.removeFromCart(index);
            }
            else {
                var salePrice = this.model.stockTransferDetails[index].salePricePerUnit;
                this.model.stockTransferDetails[index].quantity = quantity;
                this.model.stockTransferDetails[index].priceTotal = salePrice * quantity;
            }
            this.updateCartTotal();
        };
        StockTransferReturnController.prototype.removeFromCart = function (index) {
            this.model.stockTransferDetails.splice(index, 1);
            this.updateCartTotal();
        };
        StockTransferReturnController.prototype.increaseToCart = function (index) {
            var quantity = this.model.stockTransferDetails[index].quantity + 1;
            var salePrice = this.model.stockTransferDetails[index].salePricePerUnit;
            this.model.stockTransferDetails[index].quantity = quantity;
            this.model.stockTransferDetails[index].priceTotal = salePrice * quantity;
            this.updateCartTotal();
        };
        StockTransferReturnController.prototype.removeByAttr = function (arr, attr, value) {
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
        StockTransferReturnController.prototype.addToCart = function () {
            this.model.stockTransferDetails.push(this.stockTransferDetail);
            console.log('stockTransferDetails result--', this.model.stockTransferDetails);
            this.updateCartTotal();
            this.stockTransferDetail = new App.StockTransferDetailViewModel();
        };
        StockTransferReturnController.prototype.addToCart2 = function (detail) {
            this.setProductDetail(detail);
            this.addToCart();
        };
        StockTransferReturnController.prototype.editCart = function (p) {
            this.stockTransferDetail = p;
            this.removeByAttr(this.model.stockTransferDetails, 'productDetailId', p.productDetailId);
        };
        StockTransferReturnController.prototype.updateCartTotal = function () {
            var _this = this;
            var self = this;
            self.model.productAmount = 0;
            self.model.stockTransferDetails.forEach(function (p) { return _this.model.productAmount += p.priceTotal; });
            self.model.totalAmount = self.model.productAmount;
        };
        StockTransferReturnController.prototype.setProductDetail = function (detail) {
            this.stockTransferDetail.salePricePerUnit = detail.salePrice;
            this.stockTransferDetail.productDetailId = detail.id;
            this.stockTransferDetail.productDetailName = detail.name;
            this.stockTransferDetail.productDetail = detail;
            this.stockTransferDetail.quantity = 1;
            this.getPriceAndName();
        };
        StockTransferReturnController.prototype.updateQuantityAll = function () {
            for (var i = 0; i < this.model.stockTransferDetails.length; i++) {
                this.updateQuantity(i);
            }
        };
        StockTransferReturnController.prototype.updateQuantity = function (index) {
            var salePrice = this.model.stockTransferDetails[index].salePricePerUnit;
            var quantity = this.model.stockTransferDetails[index].quantity;
            this.model.stockTransferDetails[index].quantity = quantity;
            this.model.stockTransferDetails[index].priceTotal = salePrice * quantity;
            this.updateCartTotal();
        };
        StockTransferReturnController.prototype.save = function () {
            var self = this;
            var successCallback = function (response) {
                self.back();
            };
            var errorCallback = function (error) {
                console.log(error);
                alert("Error occurred during save. Check your data or please contact with administrator.");
            };
            for (var i = 0; i < self.model.stockTransferDetails.length; i++) {
                self.model.stockTransferDetails[i].productDetail = null;
                // self.model.stockTransferDetails[i].created = new Date().toDateString();
                self.model.stockTransferDetails[i].modified = new Date().toDateString();
                self.model.stockTransferDetails[i].createdBy = self.authService.accountInfo.userName;
                self.model.stockTransferDetails[i].createdFrom = "Browser";
                self.model.stockTransferDetails[i].modifiedBy = self.authService.accountInfo.userName;
                self.model.stockTransferDetails[i].destinationWarehouseId = self.model.destinationWarehouseId;
                self.model.stockTransferDetails[i].sourceWarehouseId = self.model.sourceWarehouseId;
                if (self.model.stockTransferDetails[i].id == null) {
                    self.model.stockTransferDetails[i].id = "1";
                }
                self.model.stockTransferDetails[i].shopId = self.model.stockTransferDetails[i].shopId != null ? self.model.stockTransferDetails[i].shopId : "1";
            }
            self.saveService.update(self.model, self.commandUrl + "/Edit").then(successCallback, errorCallback);
        };
        StockTransferReturnController.prototype.loadOtherWarehouses = function () {
            var self = this;
            var successCallback = function (response) {
                self.destinationWarehouses = response.Models;
                if (self.destinationWarehouses.length > 0) {
                    var warehouseId_2 = self.user.warehouseId;
                    if (warehouseId_2 && self.user.role.indexOf("Warehouse") !== -1) {
                        self.destinationWarehouses = self.destinationWarehouses.filter(function (x) { return x.id !== warehouseId_2; });
                    }
                }
                return self.destinationWarehouses;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            var reqeust = new App.SearchRequest();
            return self.searchService
                .search(reqeust, self.url.warehouseQuery + "/Dropdown")
                .then(successCallback, errorCallback);
        };
        StockTransferReturnController.prototype.updateState = function () {
            var self = this;
            var successCallback = function (params) {
                self.back();
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.saveService.update(self.model, self.commandUrl + "/UpdateState").then(successCallback, errorCallback);
        };
        StockTransferReturnController.$inject = [
            "$location", "$state", "$stateParams", "UrlService", "SearchService",
            "SaveService", "AuthService", 'Excel'
        ];
        return StockTransferReturnController;
    }(App.BaseController));
    App.StockTransferReturnController = StockTransferReturnController;
    angular.module('app').controller("StockTransferReturnController", StockTransferReturnController);
})(App || (App = {}));
