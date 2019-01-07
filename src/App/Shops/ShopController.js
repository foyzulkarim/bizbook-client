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
    var ShopsController = /** @class */ (function (_super) {
        __extends(ShopsController, _super);
        function ShopsController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.shop, url.shopQuery, excel) || this;
            _this.search();
            return _this;
        }
        ShopsController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService",
            'Excel'
        ];
        return ShopsController;
    }(App.BaseController));
    App.ShopsController = ShopsController;
    angular.module('app').controller('ShopsController', ShopsController);
    var ShopController = /** @class */ (function (_super) {
        __extends(ShopController, _super);
        function ShopController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.shop, url.shopQuery, excel) || this;
            _this.isUpdateMode = false;
            if (_this.stateParams["id"]) {
                _this.isUpdateMode = true;
                console.log(_this.queryUrl);
                _this.edit(_this.stateParams["id"]);
            }
            return _this;
        }
        ShopController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService",
            'Excel'
        ];
        return ShopController;
    }(App.BaseController));
    App.ShopController = ShopController;
    angular.module("app").controller("ShopController", ShopController);
    var MyShopController = /** @class */ (function (_super) {
        __extends(MyShopController, _super);
        function MyShopController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.myShop, url.myShopQuery, excel) || this;
            _this.isUpdateMode = true;
            _this.edit("");
            return _this;
        }
        MyShopController.prototype.update = function () {
            var self = this;
            var successCallback = function (response) {
                self.location.path("/");
            };
            var errorCallback = function (error) {
                console.log(error);
                alert(error);
            };
            self.saveService.update(self.model, self.commandUrl + "/Edit").then(successCallback, errorCallback);
        };
        MyShopController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService",
            'Excel'
        ];
        return MyShopController;
    }(App.BaseController));
    App.MyShopController = MyShopController;
    angular.module("app").controller("MyShopController", MyShopController);
})(App || (App = {}));
