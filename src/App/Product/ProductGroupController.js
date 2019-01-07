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
    var ProductGroupsController = /** @class */ (function (_super) {
        __extends(ProductGroupsController, _super);
        function ProductGroupsController(location, state, stateParams, url, search, save, authService, localStorageService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.productGroup, url.productGroupQuery, excel) || this;
            _this.headers = ["id", "name", "modified"];
            _this.localStorageService = localStorageService;
            var page = _this.localStorageService.get(App.LocalStorageKeys.ProductGroupListPageNo);
            if (!page) {
                _this.localStorageService.save(App.LocalStorageKeys.ProductGroupListPageNo, 1);
                page = 1;
            }
            _this.searchRequest.page = page;
            _this.search();
            return _this;
        }
        ProductGroupsController.prototype.goto = function (page) {
            var self = this;
            self.localStorageService.save(App.LocalStorageKeys.ProductGroupListPageNo, page);
            _super.prototype.goto.call(this, page);
        };
        ProductGroupsController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", 'Excel'
        ];
        return ProductGroupsController;
    }(App.BaseController));
    App.ProductGroupsController = ProductGroupsController;
    angular.module("app").controller("ProductGroupsController", ProductGroupsController);
    var ProductGroupController = /** @class */ (function (_super) {
        __extends(ProductGroupController, _super);
        function ProductGroupController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.productGroup, url.productGroupQuery, excel) || this;
            _this.selectedRow = null;
            _this.isUpdateMode = false;
            if (_this.stateParams["id"]) {
                _this.isUpdateMode = true;
                _this.edit(_this.stateParams["id"]);
            }
            return _this;
        }
        ProductGroupController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return ProductGroupController;
    }(App.BaseController));
    App.ProductGroupController = ProductGroupController;
    angular.module("app").controller("ProductGroupController", ProductGroupController);
})(App || (App = {}));
