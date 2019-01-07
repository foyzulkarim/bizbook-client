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
    var IngredientUnit = /** @class */ (function (_super) {
        __extends(IngredientUnit, _super);
        function IngredientUnit() {
            return _super.call(this) || this;
        }
        return IngredientUnit;
    }(App.Entity));
    App.IngredientUnit = IngredientUnit;
    var Ingredient = /** @class */ (function (_super) {
        __extends(Ingredient, _super);
        function Ingredient() {
            return _super.call(this) || this;
        }
        return Ingredient;
    }(App.Entity));
    App.Ingredient = Ingredient;
    var IngredientDetail = /** @class */ (function (_super) {
        __extends(IngredientDetail, _super);
        function IngredientDetail() {
            return _super.call(this) || this;
        }
        return IngredientDetail;
    }(App.Entity));
    App.IngredientDetail = IngredientDetail;
    var IngredientSupplier = /** @class */ (function (_super) {
        __extends(IngredientSupplier, _super);
        function IngredientSupplier() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return IngredientSupplier;
    }(App.Entity));
    App.IngredientSupplier = IngredientSupplier;
})(App || (App = {}));
//# sourceMappingURL=Model.js.map