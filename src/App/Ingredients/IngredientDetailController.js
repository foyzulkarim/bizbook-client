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
    var IngredientDetailController = /** @class */ (function (_super) {
        __extends(IngredientDetailController, _super);
        function IngredientDetailController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.ingredientDetail, url.ingredientDetailQuery, excel) || this;
            _this.ingredientUnitSearchRequest = new App.SearchRequest("", "Modified", "False", "");
            _this.ingredientSearchRequest = new App.SearchRequest("", "Modified", "False", "");
            _this.loadIngredientUints();
            _this.loadIngredients();
            _this.selectedRow = null;
            _this.isUpdateMode = false;
            if (_this.stateParams["id"]) {
                _this.isUpdateMode = true;
                _this.edit2(_this.stateParams["id"]);
            }
            return _this;
        }
        IngredientDetailController.prototype.loadIngredientUints = function () {
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
        IngredientDetailController.prototype.loadIngredients = function () {
            var self = this;
            var successCallback = function (response) {
                console.log('ingredients', response);
                self.ingredients = response.Models;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService
                .search(self.ingredientSearchRequest, self.url.ingredientQuery + "/Dropdown")
                .then(successCallback, errorCallback);
        };
        IngredientDetailController.prototype.groupChanged = function () {
            console.log(this.model.ingredientUnitId);
        };
        IngredientDetailController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return IngredientDetailController;
    }(App.BaseController));
    App.IngredientDetailController = IngredientDetailController;
    angular.module("app").controller("IngredientDetailController", IngredientDetailController);
    var IngredientDetailsController = /** @class */ (function (_super) {
        __extends(IngredientDetailsController, _super);
        function IngredientDetailsController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.ingredientDetail, url.ingredientDetailQuery, excel) || this;
            _this.searchRequest.isIncludeParents = true;
            _this.search();
            return _this;
        }
        IngredientDetailsController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return IngredientDetailsController;
    }(App.BaseController));
    App.IngredientDetailsController = IngredientDetailsController;
    angular.module("app").controller("IngredientDetailsController", IngredientDetailsController);
})(App || (App = {}));
//# sourceMappingURL=IngredientDetailController.js.map