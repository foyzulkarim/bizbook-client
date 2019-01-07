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
    var IngredientSupplierController = /** @class */ (function (_super) {
        __extends(IngredientSupplierController, _super);
        function IngredientSupplierController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.ingredientSupplier, url.ingredientSupplierQuery, excel) || this;
            _this.isUpdateMode = false;
            if (_this.stateParams["id"]) {
                _this.isUpdateMode = true;
                _this.edit2(_this.stateParams["id"]);
            }
            return _this;
        }
        IngredientSupplierController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return IngredientSupplierController;
    }(App.BaseController));
    App.IngredientSupplierController = IngredientSupplierController;
    angular.module('app').controller("IngredientSupplierController", IngredientSupplierController);
    var IngredientSuppliersController = /** @class */ (function (_super) {
        __extends(IngredientSuppliersController, _super);
        function IngredientSuppliersController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.ingredientSupplier, url.ingredientSupplierQuery, excel) || this;
            _this.headers = ["id", "name", "phone", "modified"];
            _this.search();
            return _this;
        }
        IngredientSuppliersController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return IngredientSuppliersController;
    }(App.BaseController));
    App.IngredientSuppliersController = IngredientSuppliersController;
    angular.module('app').controller("IngredientSuppliersController", IngredientSuppliersController);
})(App || (App = {}));
//# sourceMappingURL=IngredientSupplierController.js.map