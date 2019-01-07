module App {

    export class ShopsController extends BaseController<Shop> {

        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService",
            'Excel'
        ];

        constructor(
            location: angular.ILocationService,
            state: angular.ui.IStateService,
            stateParams: angular.ui.IStateParamsService,
            url: UrlService,
            search: SearchService,
            save: SaveService,
            authService: AuthService,
            excel: any
        ) {
            super(location, state, stateParams, url, search, save, authService, url.shop, url.shopQuery, excel);
            this.search();
        }
    }

    angular.module('app').controller('ShopsController', ShopsController);

    export class ShopController extends BaseController<Shop>{

        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService",
            'Excel'
        ];
        selectedRow: number;
        constructor(
            location: angular.ILocationService,
            state: angular.ui.IStateService,
            stateParams: angular.ui.IStateParamsService,
            url: UrlService,
            search: SearchService,
            save: SaveService,
            authService: AuthService,
            excel: any
        ) {
            super(location, state, stateParams, url, search, save, authService, url.shop, url.shopQuery, excel);
            this.isUpdateMode = false;
            if (this.stateParams["id"]) {
                this.isUpdateMode = true;
                console.log(this.queryUrl);
                this.edit(this.stateParams["id"]);
            }
        }
    }

    angular.module("app").controller("ShopController", ShopController);
    
    export class MyShopController extends BaseController<Shop>{

        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService",
            'Excel'
        ];
        
        constructor(
            location: angular.ILocationService,
            state: angular.ui.IStateService,
            stateParams: angular.ui.IStateParamsService,
            url: UrlService,
            search: SearchService,
            save: SaveService,
            authService: AuthService,
            excel: any
        ) {
            super(location, state, stateParams, url, search, save, authService, url.myShop, url.myShopQuery, excel);
            this.isUpdateMode = true;
            this.edit("");
        }

        update(): void {
            var self = this;
            var successCallback = (response: BaseResponse): void => {
                self.location.path("/");
            };
            var errorCallback = (error: any): void => {
                console.log(error);
                alert(error);
            };

            self.saveService.update(self.model, self.commandUrl + "/Edit").then(<any>successCallback, errorCallback);
        }
    }

    angular.module("app").controller("MyShopController", MyShopController);
}