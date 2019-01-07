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
    var BrandsController = /** @class */ (function (_super) {
        __extends(BrandsController, _super);
        function BrandsController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.brand, url.brandQuery, excel) || this;
            _this.headers = ["id", "brandCode", "name", "modified"];
            _this.search();
            return _this;
        }
        BrandsController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return BrandsController;
    }(App.BaseController));
    App.BrandsController = BrandsController;
    angular.module('app').controller('BrandsController', BrandsController);
    var BrandController = /** @class */ (function (_super) {
        __extends(BrandController, _super);
        function BrandController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.brand, url.brandQuery, excel) || this;
            _this.isUpdateMode = false;
            if (_this.stateParams["id"]) {
                _this.isUpdateMode = true;
                _this.edit2(_this.stateParams["id"]);
            }
            return _this;
        }
        BrandController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return BrandController;
    }(App.BaseController));
    App.BrandController = BrandController;
    angular.module("app").controller("BrandController", BrandController);
})(App || (App = {}));
