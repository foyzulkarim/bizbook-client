module App {
    export class ProductConfig {
        static $inject = ["$stateProvider"];
        constructor(
            $stateProvider: angular.ui.IStateProvider

        ) {
            $stateProvider
                .state("root.productgroup",
                {
                    url: "/productgroup/:id",
                    params: { id: null },
                    templateUrl: "partials/product/product-group-entry.tpl.html?t=095712282018",
                    controller: "ProductGroupController",
                    controllerAs: "vm"
                })
                .state("root.productgroups",
                {
                    url: "/productgroups",
                    templateUrl: "partials/product/product-group-list.tpl.html?t=095712282018",
                    controller: "ProductGroupsController",
                    controllerAs: "vm"
                })
                .state("root.productcategory",
                {
                    url: "/productcategory/:id",
                    params: { id: null },
                    templateUrl: "partials/product/product-category-entry.tpl.html?t=095712282018",
                    controller: "ProductCategoryController",
                    controllerAs: "vm"
                })
                .state("root.productcategories",
                {
                    url: "/productcategories",
                    templateUrl: "partials/product/product-category-list.tpl.html?t=095712282018",
                    controller: "ProductCategoriesController",
                    controllerAs: "vm"
                })
                .state("root.productdetail",
                {
                    url: "/productdetail/:id",
                    params: { id: null },
                    templateUrl: "partials/product/product-detail-entry.tpl.html?t=095712282018",
                    controller: "ProductDetailController",
                    controllerAs: "vm"
                })
                .state("root.productdetails",
                {
                    url: "/productdetails",
                    templateUrl: "partials/product/product-detail-list.tpl.html?t=095712282018",
                    controller: "ProductDetailsController",
                    controllerAs: "vm"
                })
                .state("root.productDetailList",
                {
                    url: "/product-detail/list",
                    templateUrl: "partials/product/product-detail.list.tpl.html?t=095712282018",
                    controller: "ProductDetailsController",
                    controllerAs: "vm"
                })
                .state("root.producthistory",
                {
                    url: "/product-history/:id",
                    params: { id: null },
                    templateUrl: "partials/product/product-history.tpl.html?t=095712282018",
                    controller: "ProductHistoryController",
                    controllerAs: "vm"
                });
        }
    }
    angular.module("app").config(ProductConfig);
}