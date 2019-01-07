module App {
    "use strict";

    export class AccountInfoController extends BaseController<AccountInfo> {
        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService",'Excel'
            
        ];

        accountInfoTypes: string[] = ["Cash","Bank", "Mobile","Other"];
        
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
            super(location, state, stateParams, url, search, save, authService, url.accountInfo, url.accountInfoQuery, excel);

            this.isUpdateMode = false;
            if (this.stateParams["id"]) {
                this.isUpdateMode = true;
                this.edit2(this.stateParams["id"]);
            }
        }
    }

    angular.module("app").controller("AccountInfoController", AccountInfoController);

    export class AccountInfosController extends BaseController<AccountInfo> {
        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService",'Excel'
        ];
        headers=["accounTitle","accountNumber","bankName","accountInfoType"];
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
            super(location, state, stateParams, url, search, save, authService, url.accountInfo, url.accountInfoQuery, excel);

            this.search();
        }

    }

    angular.module("app").controller("AccountInfosController", AccountInfosController);
}