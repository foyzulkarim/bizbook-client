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
    var ProductCategoryController = /** @class */ (function (_super) {
        __extends(ProductCategoryController, _super);
        function ProductCategoryController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.product, url.productQuery, excel) || this;
            _this.loadProductGroups();
            _this.selectedRow = null;
            _this.isUpdateMode = false;
            if (_this.stateParams["id"]) {
                _this.isUpdateMode = true;
                _this.edit2(_this.stateParams["id"]);
            }
            return _this;
        }
        ProductCategoryController.prototype.loadProductGroups = function () {
            var self = this;
            var successCallback = function (response) {
                console.log(response);
                self.productGroups = response.Models;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchRequest["isProductGroupActive"] = true;
            self.searchService
                .search(self.searchRequest, self.url.productGroupQuery + "/Dropdown")
                .then(successCallback, errorCallback);
        };
        ProductCategoryController.prototype.groupChanged = function () {
            console.log(this.model.productGroupId);
        };
        ProductCategoryController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return ProductCategoryController;
    }(App.BaseController));
    App.ProductCategoryController = ProductCategoryController;
    angular.module("app").controller("ProductCategoryController", ProductCategoryController);
    var ProductCategoriesController = /** @class */ (function (_super) {
        __extends(ProductCategoriesController, _super);
        function ProductCategoriesController(location, state, stateParams, url, search, save, authService, localStorageService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.product, url.productQuery, excel) || this;
            _this.headers = ["id", "name", "productGroupName", "modified"];
            _this.searchRequest.isIncludeParents = true;
            _this.localStorageService = localStorageService;
            var page = _this.localStorageService.get(App.LocalStorageKeys.ProductCategoryListPageNo);
            if (!page) {
                _this.localStorageService.save(App.LocalStorageKeys.ProductCategoryListPageNo, 1);
                page = 1;
            }
            _this.searchRequest.page = page;
            _this.search();
            return _this;
        }
        ProductCategoriesController.prototype.loadProductGroups = function () {
            var self = this;
            var successCallback = function (response) {
                console.log(response);
                self.productGroups = response.Models;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService
                .search(self.searchRequest, self.url.productGroupQuery + "/Dropdown")
                .then(successCallback, errorCallback);
        };
        ProductCategoriesController.prototype.goto = function (page) {
            var self = this;
            self.localStorageService.save(App.LocalStorageKeys.ProductCategoryListPageNo, page);
            _super.prototype.goto.call(this, page);
        };
        ProductCategoriesController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", 'Excel'
        ];
        return ProductCategoriesController;
    }(App.BaseController));
    App.ProductCategoriesController = ProductCategoriesController;
    angular.module("app").controller("ProductCategoriesController", ProductCategoriesController);
})(App || (App = {}));
