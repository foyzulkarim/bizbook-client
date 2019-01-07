var App;
(function (App) {
    var PurchaseConfig = /** @class */ (function () {
        function PurchaseConfig($stateProvider) {
            $stateProvider
                .state("root.purchase", {
                url: "/purchase",
                templateUrl: "partials/purchase/purchase-entry.tpl.html?t=095712282018",
                controller: "PurchaseController",
                controllerAs: "vm"
            })
                .state("root.purchases", {
                url: "/purchases",
                templateUrl: "partials/purchase/purchase-list.tpl.html?t=095712282018",
                controller: "PurchasesController",
                controllerAs: "vm"
            })
                .state("root.purchasedetail", {
                url: "/purchasedetail/:id",
                params: { id: null },
                templateUrl: "partials/purchase/purchase-detail-view.tpl.html?t=095712282018",
                controller: "PurchaseDetailController",
                controllerAs: "vm"
            })
                .state("root.purchasehistory", {
                url: "/purchasehistory/:purchase",
                params: { purchase: null },
                templateUrl: "partials/purchase/purchases-history.tpl.html?t=095712282018",
                controller: "PurchaseHistoryController",
                controllerAs: "vm"
            })
                .state("root.purchasereturn", {
                url: "/purchasereturn/:id",
                params: { id: null },
                templateUrl: "partials/purchase/purchase-return.tpl.html?t=095712282018",
                controller: "PurchaseReturnController",
                controllerAs: "vm"
            })
                .state("root.purchase-pay", {
                url: "/purchase-pay/:id",
                params: { id: null },
                templateUrl: "partials/purchase/purchase-pay.tpl.html?t=095712282018",
                controller: "PurchaseTransactionController",
                controllerAs: "vm"
            });
        }
        PurchaseConfig.$inject = ["$stateProvider"];
        return PurchaseConfig;
    }());
    App.PurchaseConfig = PurchaseConfig;
    angular.module("app").config(PurchaseConfig);
})(App || (App = {}));
