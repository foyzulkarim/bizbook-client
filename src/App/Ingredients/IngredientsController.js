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
    var IngredientController = /** @class */ (function (_super) {
        __extends(IngredientController, _super);
        function IngredientController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.ingredient, url.ingredientQuery, excel) || this;
            _this.ingredientUnitSearchRequest = new App.SearchRequest("", "Modified", "False", "");
            _this.loadIngredientUints();
            _this.selectedRow = null;
            _this.isUpdateMode = false;
            if (_this.stateParams["id"]) {
                _this.isUpdateMode = true;
                _this.edit2(_this.stateParams["id"]);
            }
            return _this;
        }
        IngredientController.prototype.loadIngredientUints = function () {
            var self = this;
            var successCallback = function (response) {
                console.log(response);
                self.ingredientUnits = response.Models;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService
                .search(self.searchRequest, self.url.ingredientUnitQuery + "/Dropdown")
                .then(successCallback, errorCallback);
        };
        IngredientController.prototype.groupChanged = function () {
            console.log(this.model.ingredientUnitId);
        };
        IngredientController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return IngredientController;
    }(App.BaseController));
    App.IngredientController = IngredientController;
    angular.module("app").controller("IngredientController", IngredientController);
    var IngredientsController = /** @class */ (function (_super) {
        __extends(IngredientsController, _super);
        function IngredientsController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.ingredient, url.ingredientQuery, excel) || this;
            _this.searchRequest.isIncludeParents = true;
            _this.search();
            return _this;
        }
        IngredientsController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return IngredientsController;
    }(App.BaseController));
    App.IngredientsController = IngredientsController;
    angular.module("app").controller("IngredientsController", IngredientsController);
})(App || (App = {}));
//# sourceMappingURL=IngredientsController.js.map