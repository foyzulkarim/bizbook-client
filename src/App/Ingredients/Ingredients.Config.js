var App;
(function (App) {
    var IngredientsConfig = /** @class */ (function () {
        function IngredientsConfig($stateProvider) {
            $stateProvider
                .state("root.ingredientunit", {
                url: "/ingredientunit",
                params: { id: null },
                templateUrl: "partials/Ingredient/ingredientunit-entry.tpl.html?t=080001032018",
                controller: "IngredientUnitController",
                controllerAs: "vm"
            })
                .state("root.ingredientunits", {
                url: "/ingredientunits",
                templateUrl: "partials/Ingredient/ingredientunit-list.tpl.html?t=080001032018",
                controller: "IngredientUnitsController",
                controllerAs: "vm"
            })
                .state("root.ingredient", {
                params: { id: null },
                url: "/ingredient",
                templateUrl: "partials/Ingredient/ingredient-entry.tpl.html?t=080001032018",
                controller: "IngredientController",
                controllerAs: "vm"
            })
                .state("root.ingredients", {
                url: "/ingredients",
                templateUrl: "partials/Ingredient/ingredient-list.tpl.html?t=080001032018",
                controller: "IngredientsController",
                controllerAs: "vm"
            })
                .state("root.ingredientdetail", {
                params: { id: null },
                url: "/ingredientdetail",
                templateUrl: "partials/Ingredient/ingredient-detail-entry.tpl.html?t=080001032018",
                controller: "IngredientDetailController",
                controllerAs: "vm"
            })
                .state("root.ingredientdetails", {
                url: "/ingredientdetails",
                templateUrl: "partials/Ingredient/ingredient-detail-list.tpl.html?t=080001032018",
                controller: "IngredientDetailsController",
                controllerAs: "vm"
            })
                .state("root.ingredientsupplier", {
                params: { id: null },
                url: "/ingredientsupplier",
                templateUrl: "partials/Ingredient/ingredient-supplier-entry.tpl.html?t=080001032018",
                controller: "IngredientSupplierController",
                controllerAs: "vm"
            })
                .state("root.ingredientsuppliers", {
                url: "/ingredientsuppliers",
                templateUrl: "partials/Ingredient/ingredient-supplier-list.tpl.html?t=080001032018",
                controller: "IngredientSuppliersController",
                controllerAs: "vm"
            });
        }
        IngredientsConfig.$inject = ["$stateProvider"];
        return IngredientsConfig;
    }());
    App.IngredientsConfig = IngredientsConfig;
    angular.module("app").config(IngredientsConfig);
})(App || (App = {}));
//# sourceMappingURL=Ingredients.Config.js.map