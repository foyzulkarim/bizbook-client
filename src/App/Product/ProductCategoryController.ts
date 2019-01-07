module App {
    "use strict";

    export class ProductCategoryController extends BaseController<ProductCategory> {
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
            super(location, state, stateParams, url, search, save, authService, url.product, url.productQuery, excel);
            this.loadProductGroups();
            this.selectedRow = null;
            this.isUpdateMode = false;
            if (this.stateParams["id"]) {
                this.isUpdateMode = true;
                this.edit2(this.stateParams["id"]);
            }
        }

        productGroups: ProductGroup[];
        loadProductGroups(): void {
            var self = this;
            var successCallback = (response: any): void => {
                console.log(response);
                self.productGroups = response.Models;
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            self.searchRequest["isProductGroupActive"]=true;
            self.searchService
                .search(self.searchRequest, self.url.productGroupQuery + "/Dropdown")
                .then(<any>successCallback, errorCallback);
        }

        groupChanged(): void {
            console.log(this.model.productGroupId);
        }
    }

    angular.module("app").controller("ProductCategoryController", ProductCategoryController);

    export class ProductCategoriesController extends BaseController<ProductCategory>{

        productGroups : ProductGroup[];

        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
                "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService",'Excel'
        ];
        selectedRow: number;
        headers = ["id", "name","productGroupName","modified"];
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
            super(location, state, stateParams, url, search, save, authService, url.product, url.productQuery, excel);
            this.searchRequest.isIncludeParents = true;
            this.localStorageService = localStorageService;

            let page = this.localStorageService.get(LocalStorageKeys.ProductCategoryListPageNo);
            if (!page) {
                this.localStorageService.save(LocalStorageKeys.ProductCategoryListPageNo, 1);
                page = 1;
            }
            this.searchRequest.page = page;
            this.search();
        }
         
        loadProductGroups(): void {
            var self = this;
            var successCallback = (response: any): void => {
                console.log(response);
                self.productGroups = response.Models;
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            self.searchService
                .search(self.searchRequest, self.url.productGroupQuery + "/Dropdown")
                .then(<any>successCallback, errorCallback);
        } 
        goto(page: number): void {
            var self = this;
            self.localStorageService.save(LocalStorageKeys.ProductCategoryListPageNo, page);
            super.goto(page);
        }       
    }

    angular.module("app").controller("ProductCategoriesController", ProductCategoriesController);
}