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
    var IngredientUnitsController = /** @class */ (function (_super) {
        __extends(IngredientUnitsController, _super);
        function IngredientUnitsController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.ingredientUnit, url.ingredientUnitQuery, excel) || this;
            _this.search();
            return _this;
        }
        IngredientUnitsController.$inject = [
            "$location", "$state", "$stateParams", "UrlService",
            "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return IngredientUnitsController;
    }(App.BaseController));
    App.IngredientUnitsController = IngredientUnitsController;
    angular.module('app').controller("IngredientUnitsController", IngredientUnitsController);
    var IngredientUnitController = /** @class */ (function (_super) {
        __extends(IngredientUnitController, _super);
        function IngredientUnitController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.ingredientUnit, url.ingredientUnitQuery, excel) || this;
            _this.isUpdateMode = false;
            if (_this.stateParams["id"]) {
                _this.isUpdateMode = true;
                _this.edit2(_this.stateParams["id"]);
            }
            return _this;
        }
        IngredientUnitController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return IngredientUnitController;
    }(App.BaseController));
    App.IngredientUnitController = IngredientUnitController;
    angular.module('app').controller("IngredientUnitController", IngredientUnitController);
})(App || (App = {}));
//# sourceMappingURL=IngredientController.js.map