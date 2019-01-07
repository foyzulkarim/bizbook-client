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
    var CourierController = /** @class */ (function (_super) {
        __extends(CourierController, _super);
        function CourierController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.courier, url.courierQuery, excel) || this;
            // this.model.courierShopId = "00000000-0000-0000-0000-000000000001";
            _this.isUpdateMode = false;
            if (_this.stateParams["id"]) {
                _this.isUpdateMode = true;
                _this.edit(_this.stateParams["id"]);
            }
            _this.loadDropdown();
            return _this;
        }
        CourierController.prototype.loadDropdown = function () {
            var self = this;
            var successCallback = function (response) {
                console.log('addresses ', response);
                self.shops = response.Models;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService
                .search(self.searchRequest, self.url.shopQueryDropdown)
                .then(successCallback, errorCallback);
        };
        CourierController.$inject = ["$location", "$state", "$stateParams", "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'];
        return CourierController;
    }(App.BaseController));
    App.CourierController = CourierController;
    angular.module("app").controller("CourierController", CourierController);
    var CouriersController = /** @class */ (function (_super) {
        __extends(CouriersController, _super);
        function CouriersController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.courier, url.courierQuery, excel) || this;
            _this.headers = ["id", "courierShopName", "courierShopPhone", "contactPersonName", "modified"];
            _this.search();
            return _this;
        }
        CouriersController.$inject = ["$location", "$state", "$stateParams", "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'];
        return CouriersController;
    }(App.BaseController));
    App.CouriersController = CouriersController;
    angular.module("app").controller("CouriersController", CouriersController);
})(App || (App = {}));
