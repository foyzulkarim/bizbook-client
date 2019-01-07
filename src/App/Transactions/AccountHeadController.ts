module App {
    "use strict";

    export class AccountHeadsController extends BaseController<AccountHead>{

        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService",'Excel'
        ];
        headers = ["id", "name", "accountHeadType","modified"];
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
            super(location, state, stateParams, url, search, save, authService, url.accountHead, url.accountHeadQuery, excel);
            this.search();
        }

        report(): void {
            var self = this;
            window.open(self.url.accountHeadQueryReport, "_blank", "");
        }
    }

    angular.module("app").controller("AccountHeadsController", AccountHeadsController);

    export class AccountHeadController extends BaseController<AccountHead>{

        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService",'Excel'
        ];

        accountTypes: string[];
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
            super(location, state, stateParams, url, search, save, authService, url.accountHead, url.accountHeadQuery, excel);
            
            this.isUpdateMode = false;
            var self = this;

            var success = function (response: any) {
                console.log('reasult---' + response);
                self.accountTypes = response.accountTypes;
            };

            var error = function (error) {
                console.log(error);
            };
            
            self.searchService.get(url.transaction + "Query" + "/Dropdowns").then(success, error);

            if (this.stateParams["id"]) {
                this.isUpdateMode = true;
                this.edit(this.stateParams["id"]);
            }
        }
    }

    angular.module("app").controller("AccountHeadController", AccountHeadController);
}