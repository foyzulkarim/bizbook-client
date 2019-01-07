
module App {
    "use strict";

    export class ProductGroupsController extends BaseController<ProductGroup>{

        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
                "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", 'Excel'
        ];
        headers = ["id","name","modified"];
        constructor(
            location: angular.ILocationService,
            state: angular.ui.IStateService,
            stateParams: angular.ui.IStateParamsService,
            url: UrlService,
            search: SearchService,
            save: SaveService,
            authService: AuthService,
            localStorageService: LocalStorageService,
            excel: any
            
        ) {
            super(location, state, stateParams, url, search, save, authService, url.productGroup, url.productGroupQuery, excel);
            this.localStorageService = localStorageService;

            let page = this.localStorageService.get(LocalStorageKeys.ProductGroupListPageNo);
            if (!page) {
                this.localStorageService.save(LocalStorageKeys.ProductGroupListPageNo, 1);
                page = 1;
            }
            this.searchRequest.page = page;

            this.search();
            
        }

        goto(page: number): void {
            var self = this;
            self.localStorageService.save(LocalStorageKeys.ProductGroupListPageNo, page);
            super.goto(page);
        }     
      
    }

    angular.module("app").controller("ProductGroupsController", ProductGroupsController);

    export class ProductGroupController extends BaseController<ProductGroup>{

        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService",'Excel'
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
            super(location, state, stateParams, url, search, save, authService, url.productGroup, url.productGroupQuery, excel);
            this.selectedRow = null;
            this.isUpdateMode = false;
            if (this.stateParams["id"]) {
                this.isUpdateMode = true;
                this.edit(this.stateParams["id"]);
            }
        }
    }

    angular.module("app").controller("ProductGroupController", ProductGroupController);
}