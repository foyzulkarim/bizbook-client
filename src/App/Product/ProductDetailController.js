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
    var ProductDetailsController = /** @class */ (function (_super) {
        __extends(ProductDetailsController, _super);
        function ProductDetailsController(location, state, stateParams, url, search, save, authService, localStorageService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.productDetail, url.productDetailQuery, excel) || this;
            _this.headers = ["id", "barCode", "name", "type", "costPrice", "dealerPrice", "salePrice", "sold", "onHand", "modified"];
            _this.localStorageService = localStorageService;
            var page = _this.localStorageService.get(App.LocalStorageKeys.ProductDetailsListPageNo);
            if (!page) {
                _this.localStorageService.save(App.LocalStorageKeys.ProductDetailsListPageNo, 1);
                page = 1;
            }
            _this.searchRequest.page = page;
            _this.search();
            return _this;
        }
        ProductDetailsController.prototype.goto = function (page) {
            var self = this;
            self.localStorageService.save(App.LocalStorageKeys.ProductDetailsListPageNo, page);
            _super.prototype.goto.call(this, page);
        };
        ProductDetailsController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", 'Excel'
        ];
        return ProductDetailsController;
    }(App.BaseController));
    App.ProductDetailsController = ProductDetailsController;
    angular.module('app').controller('ProductDetailsController', ProductDetailsController);
    var ProductDetailController = /** @class */ (function (_super) {
        __extends(ProductDetailController, _super);
        function ProductDetailController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.productDetail, url.productDetailQuery, excel) || this;
            _this.productSearchRequest = new App.SearchRequest("", "Modified", "False", "");
            _this.brandSearchRequest = new App.SearchRequest("", "Modified", "False", "");
            _this.loadProductCategories();
            _this.loadBrands();
            _this.selectedRow = null;
            _this.isUpdateMode = false;
            if (_this.stateParams["id"]) {
                _this.isUpdateMode = true;
                _this.edit(_this.stateParams["id"]);
            }
            return _this;
        }
        ProductDetailController.prototype.loadProductCategories = function () {
            var self = this;
            var successCallback = function (response) {
                console.log('product Categories ', response);
                self.productCategories = response.Models;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.productSearchRequest["isProductCategoryActive"] = true;
            self.searchService
                .search(self.productSearchRequest, self.url.productQuery + "/Dropdown")
                .then(successCallback, errorCallback);
        };
        ProductDetailController.prototype.categoryChanged = function () {
            console.log(this.model.productCategoryId);
        };
        ProductDetailController.prototype.loadBrands = function () {
            var self = this;
            var successCallback = function (response) {
                console.log('brands ', response);
                self.brands = response.Models;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService
                .search(self.brandSearchRequest, self.url.brandQuery + "/Dropdown")
                .then(successCallback, errorCallback);
        };
        ProductDetailController.prototype.productChanged = function () {
            console.log(this.model.productCategoryId);
        };
        ProductDetailController.prototype.brandChanged = function () {
            console.log(this.model.brandId);
        };
        ProductDetailController.prototype.getBarcode = function () {
            var self = this;
            var successCallback = function (response) {
                self.model.barCode = response.toString();
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService.get(self.url.productDetailQueryBarcode).then(successCallback, errorCallback);
        };
        ProductDetailController.prototype.downloadBarcode = function () {
            var self = this;
            var url = self.url.barcodeImage + "/Download?id=" + self.model.id;
            window.open(url, "_blank");
        };
        ProductDetailController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return ProductDetailController;
    }(App.BaseController));
    App.ProductDetailController = ProductDetailController;
    angular.module("app").controller("ProductDetailController", ProductDetailController);
})(App || (App = {}));
