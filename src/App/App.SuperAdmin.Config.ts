module App {
    export class SuperAdminConfig {

        static $inject = ["$stateProvider"];
        
        constructor($stateProvider: angular.ui.IStateProvider) {

            // superadmin
            $stateProvider
                .
                state("root.role",
                {
                    url: "/role/:id",
                    params: { id: null },
                    templateUrl: "partials/system/role-entry.tpl.html?t=095712282018",
                    controller: "ApplicationRoleController",
                    controllerAs: "vm"
                })
                .state("root.roles",
                {
                    url: "/roles",
                    templateUrl: "partials/system/role-list.tpl.html?t=095712282018",
                    controller: "ApplicationRoleController",
                    controllerAs: "vm"
                })
                .state("root.user",
                {
                    url: "/user/:id",
                    params: { id: null },
                    templateUrl: "partials/system/user-entry.tpl.html?t=095712282018",
                    controller: "ApplicationUserController",
                    controllerAs: "vm"
                })
                .state("root.users",
                {
                    url: "/users",
                    templateUrl: "partials/system/user-list.tpl.html?t=095712282018",
                    controller: "ApplicationUsersController",
                    controllerAs: "vm"
                })
                .state("root.adduserrole",
                {
                    url: "/user-roles",
                    templateUrl: "partials/system/userroles.tpl.html?t=095712282018",
                    controller: "ApplicationUserRolesController",
                    controllerAs: "vm"
                })
                .state("root.resource",
                {
                    url: "/resource/:id",
                    params: { id: null },
                    templateUrl: "partials/system/resource-entry.tpl.html?t=095712282018",
                    controller: "ApplicationResourceController",
                    controllerAs: "vm"
                })
                .state("root.resources",
                {
                    url: "/resources",
                    templateUrl: "partials/system/resource-list.tpl.html?t=095712282018",
                    controller: "ApplicationResourcesController",
                    controllerAs: "vm"
                })
                .state("root.addresource",
                {
                    url: "/resources",
                    templateUrl: "partials/system/resources.tpl.html?t=095712282018",
                    controller: "ApplicationResourcesController",
                    controllerAs: "vm"
                })
                .state("root.permission",
                {
                    url: "/permission",
                    templateUrl: "partials/system/permission-entry.tpl.html?t=095712282018",
                    controller: "ApplicationPermissionsController",
                    controllerAs: "vm"
                })
                .state("root.updateResourcePermission",
                {
                    url: "/update-resource-permission",
                    templateUrl: "partials/system/update-resource-permissions.tpl.html?t=095712282018",
                    controller: "ApplicationPermissionsController",
                    controllerAs: "vm"
                })
                .state("root.shop",
                {
                    url: "/shop/:id",
                    params: { id: null },
                    templateUrl: "partials/shop/shop-entry.tpl.html?t=095712282018",
                    controller: "ShopController",
                    controllerAs: "vm"
                })
                .state("root.shops",
                {
                    url: "/shops",
                    templateUrl: "partials/shop/shop-list.tpl.html?t=095712282018",
                    controller: "ShopsController",
                    controllerAs: "vm"
                })
                .state("root.denied",
                {
                    url: "/denied",
                    template: "<h1>Access Denied <a ui-sref=\"root.home\"> back to home </a></h1>"
                });
        }
    }

    angular.module("app").config(SuperAdminConfig);
}