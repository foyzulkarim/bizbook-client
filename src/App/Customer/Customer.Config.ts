module App {
    export class CustomerConfig {
        static $inject = ["$stateProvider"];
        constructor(
            $stateProvider: angular.ui.IStateProvider

        ) {
            $stateProvider
                .state("root.customer",
                {
                    url: "/customer/:id",
                    params: { id: null },
                    templateUrl: "partials/customer/customer-entry.tpl.html?t=095712282018",
                    controller: "CustomerController",
                    controllerAs: "vm"
                })
                .state("root.customers",
                {
                    url: "/customers",
                    templateUrl: "partials/customer/customer-list.tpl.html?t=095712282018",
                    controller: "CustomersController",
                    controllerAs: "vm"
                })
                .state("root.customerhistory",
                {
                    url: "/customerhistory/:id",
                    params: { id: null },
                    templateUrl: "partials/customer/customer-history.tpl.html?t=095712282018",
                    controller: "CustomerHistoryController",
                    controllerAs: "vm"
                })
                .state("root.customeraddresses",
                {
                    url: "/customer-addresses/:id",
                    params: { id: null },
                    templateUrl: "partials/customer/customer-addresses.tpl.html?t=095712282018",
                    controller: "CustomerAddressesController",
                    controllerAs: "vm"
                })
                .state("root.customerproducthistory",
                {
                    url: "/customerproducthistory/:id",
                    params: { id: null },
                    templateUrl: "partials/customer/customer-product-history.tpl.html?t=095712282018",
                    controller: "CustomerProductHistoryController",
                    controllerAs: "vm"
                })
                .state("root.customerproductview",
                {
                    url: "/customerproductview/:id",
                    params: { id: null },
                    templateUrl: "partials/customer/customer-product-view.tpl.html?t=095712282018",
                    controller: "CustomerProductViewController",
                    controllerAs: "vm"
                })
                .state("root.customerfeedback",
                {
                    url: "/customerfeedback/:id",
                    params: { id: null },
                    templateUrl: "partials/customer/customer-feedback.tpl.html?t=095712282018",
                    controller: "CustomerFeedbackController",
                    controllerAs: "vm"
                })
                .state("root.customerfeedbacks",
                {
                    url: "/customerfeedbacks/:id",
                    params: { id: null },
                    templateUrl: "partials/customer/customer-feedback-list.tpl.html?t=095712282018",
                    controller: "CustomerFeedbacksController",
                    controllerAs: "vm"
                });
        }
    }
    angular.module("app").config(CustomerConfig);
}