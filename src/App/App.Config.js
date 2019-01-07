var App;
(function (App) {
    "use strict";
    var AppConfig = /** @class */ (function () {
        function AppConfig($stateProvider, $urlRouterProvider, localStorageProvider) {
            $urlRouterProvider.otherwise("/");
            $stateProvider
                .state("root", {
                abstract: true,
                url: "",
                template: "<div ui-view class=\"container-fluid slide\"></div>"
            })
                .state("root.signin", {
                url: "/signin",
                templateUrl: "partials/account/signin.tpl.html?t=095712282018",
                controller: "SigninController",
                controllerAs: "vm"
            })
                .state("root.profile", {
                url: "/profile",
                templateUrl: "partials/account/profile.tpl.html?t=095712282018",
                controller: "ProfileController",
                controllerAs: "vm"
            })
                // shop info
                .state("root.myshop", {
                url: "/myshop",
                templateUrl: "partials/shop/myshop.tpl.html?t=095712282018",
                controller: "MyShopController",
                controllerAs: "vm"
            })
                .state("root.employee", {
                url: "/employee/:applicationUserId",
                params: { applicationUserId: null },
                templateUrl: "partials/employee/employee-entry.tpl.html?t=095712282018",
                controller: "EmployeeController",
                controllerAs: "vm"
            })
                .state("root.employees", {
                url: "/employees",
                templateUrl: "partials/employee/employee-list.tpl.html?t=095712282018",
                controller: "EmployeesController",
                controllerAs: "vm"
            })
                .state("root.employeeInfo", {
                url: "/employeeInfo/:id",
                params: { id: null },
                templateUrl: "partials/employee/employee-info-entry.tpl.html?t=095712282018",
                controller: "EmployeeInfoController",
                controllerAs: "vm"
            })
                .state("root.employeeInfos", {
                url: "/employeeInfos",
                templateUrl: "partials/employee/employee-info-list.tpl.html?t=095712282018",
                controller: "EmployeeInfosController",
                controllerAs: "vm"
            })
                .state("root.salesmanhistory", {
                url: "/salesmanhistory/:id",
                params: { id: null },
                templateUrl: "partials/employee/salesman-history.tpl.html?t=095712282018",
                controller: "SalesmanHistoryController",
                controllerAs: "vm"
            })
                .state("root.brand", {
                url: "/brand/:id",
                params: { id: null },
                templateUrl: "partials/shop/brand-entry.tpl.html?t=095712282018",
                controller: "BrandController",
                controllerAs: "vm"
            })
                .state("root.brands", {
                url: "/brands",
                templateUrl: "partials/shop/brand-list.tpl.html?t=095712282018",
                controller: "BrandsController",
                controllerAs: "vm"
            })
                .state("root.supplier", {
                url: "/supplier/:id",
                params: { id: null },
                templateUrl: "partials/shop/supplier-entry.tpl.html?t=095712282018",
                controller: "SupplierController",
                controllerAs: "vm"
            })
                .state("root.suppliers", {
                url: "/suppliers",
                templateUrl: "partials/shop/supplier-list.tpl.html?t=095712282018",
                controller: "SuppliersController",
                controllerAs: "vm"
            })
                .state("root.supplierhistory", {
                url: "/supplierhistory/:id",
                templateUrl: "partials/shop/supplier-history.tpl.html?t=095712282018",
                controller: "SupplierHistoryController",
                controllerAs: "vm"
            })
                .state("root.supplierproducthistory", {
                url: "/supplierproducthistory/:id",
                params: { id: null },
                templateUrl: "partials/shop/supplier-product-history.tpl.html?t=095712282018",
                controller: "SupplierProductHistoryController",
                controllerAs: "vm"
            })
                .state("root.supplierproductdue", {
                url: "/supplierproductdue/:id",
                params: { id: null },
                templateUrl: "partials/shop/supplier-productwise-due.tpl.html?t=095712282018",
                controller: "SupplierProductDueController",
                controllerAs: "vm"
            })
                .state("root.dealer", {
                url: "/dealer/:id",
                params: { id: null },
                templateUrl: "partials/shop/dealer-entry.tpl.html?t=095712282018",
                controller: "DealerController",
                controllerAs: "vm"
            })
                .state("root.dealers", {
                url: '/dealers',
                templateUrl: "partials/shop/dealer-list.tpl.html?t=095712282018",
                controller: "DealersController",
                controllerAs: "vm"
            })
                .state("root.dealerhistory", {
                url: "/dealerhistory/:id",
                params: { id: null },
                templateUrl: "partials/shop/dealer-history.tpl.html?t=095712282018",
                controller: "DealerHistoryController",
                controllerAs: "vm"
            })
                .state("root.dealerproducthistory", {
                url: "/dealerproducthistory/:id",
                params: { id: null },
                templateUrl: "partials/shop/dealer-product-history.tpl.html?t=095712282018",
                controller: "DealerProductHistoryController",
                controllerAs: "vm"
            })
                .state("root.dealerproductdue", {
                url: "/dealerproductdue/:id",
                params: { id: null },
                templateUrl: "partials/shop/dealer-productwise-due.tpl.html?t=095712282018",
                controller: "DealerProductDueController",
                controllerAs: "vm"
            })
                .state("root.courier", {
                url: "/courier/:id",
                params: { id: null },
                templateUrl: "partials/shop/courier-entry.tpl.html?t=095712282018",
                controller: "CourierController",
                controllerAs: "vm"
            })
                .state("root.couriers", {
                url: '/couriers',
                templateUrl: "partials/shop/courier-list.tpl.html?t=095712282018",
                controller: "CouriersController",
                controllerAs: "vm"
            })
                .state("root.config", {
                url: "/config",
                templateUrl: "partials/common/config.tpl.html?t=095712282018",
                controller: "LocalConfigController",
                controllerAs: "vm"
            })
                //.state("root.accountinfo",
                //{
                //    url: "/accountinfo/:id",
                //    params: { id: null },
                //    templateUrl: "partials/transactions/account-info-entry.tpl.html?t=095712282018",
                //    controller: "AccountInfoController",
                //    controllerAs: "vm"
                //})
                //.state("root.accountinfos",
                //{
                //    url: "/accountinfos",
                //    templateUrl: "partials/transactions/account-info-list.tpl.html?t=095712282018",
                //    controller: "AccountInfosController",
                //    controllerAs: "vm"
                //})
                //Sms
                .state("root.sms", {
                url: "/sms/:id",
                params: { id: null },
                templateUrl: "partials/message/sms-entry.tpl.html?t=095712282018",
                controller: "SmsController",
                controllerAs: "vm"
            })
                .state("root.smses", {
                url: "/smses",
                templateUrl: "partials/message/smses-list.tpl.html?t=095712282018",
                controller: "SmsListController",
                controllerAs: "vm"
            })
                .state("root.hookDetail", {
                url: "/hookDetail/:id",
                params: { id: null },
                templateUrl: "partials/message/hook-detail-entry.tpl.html?t=095712282018",
                controller: "HookDetailController",
                controllerAs: "vm"
            })
                .state("root.hookDetails", {
                url: "/hookDetails",
                templateUrl: "partials/message/hook-detail-list.tpl.html?t=095712282018",
                controller: "HookDetailsController",
                controllerAs: "vm"
            })
                .state("root.smsHook", {
                url: "/smsHook/:id",
                params: { id: null },
                templateUrl: "partials/message/sms-hook-entry.tpl.html?t=095712282018",
                controller: "SmsHookController",
                controllerAs: "vm"
            })
                .state("root.smsHooks", {
                url: "/smsHooks",
                templateUrl: "partials/message/sms-hook-list.tpl.html?t=095712282018",
                controller: "SmsHooksController",
                controllerAs: "vm"
            });
            $urlRouterProvider.otherwise("/");
            //localStorageProvider.setPrefix('bizbook').setStorageType('sessionStorage');
            localStorageProvider.setPrefix('bizbook').setStorageType('localStorage');
        }
        AppConfig.$inject = ["$stateProvider", "$urlRouterProvider", "localStorageServiceProvider"];
        return AppConfig;
    }());
    App.AppConfig = AppConfig;
    angular.module("app", ["ngSanitize", "ngResource", "ngAnimate",
        "ui.router",
        "LocalStorageModule",
        "ngCsv",
        "ui.bootstrap",
        //'ui.grid', 'ui.grid.selection', 'ui.grid.exporter',
        'chart.js']);
    angular.module("app").config(AppConfig);
    //angular.module("app").config(function (localStorageServiceProvider) {
    //    localStorageServiceProvider
    //        .setPrefix('bizbook')
    //        .setStorageType('sessionStorage');
    //});   
})(App || (App = {}));
