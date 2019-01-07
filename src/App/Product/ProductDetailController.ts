module App {
    export class ProductDetailsController extends BaseController<ProductDetail> {
        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
                "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", 'Excel'
        ];
        headers = ["id","barCode", "name", "type", "costPrice", "dealerPrice", "salePrice", "sold", "onHand","modified"];
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
            super(location, state, stateParams, url, search, save, authService, url.productDetail, url.productDetailQuery, excel);

            this.localStorageService = localStorageService;

            let page = this.localStorageService.get(LocalStorageKeys.ProductDetailsListPageNo);
            if (!page) {
                this.localStorageService.save(LocalStorageKeys.ProductDetailsListPageNo, 1);
                page = 1;
            }
            this.searchRequest.page = page;
            this.search();
        }

        goto(page: number): void {
            var self = this;
            self.localStorageService.save(LocalStorageKeys.ProductDetailsListPageNo, page);
            super.goto(page);
        }

    }

    angular.module('app').controller('ProductDetailsController', ProductDetailsController);

    export class ProductDetailController extends BaseController<ProductDetail>{

        productSearchRequest: SearchRequest;
        productCategories: ProductCategory[];
        brandSearchRequest: SearchRequest;
        brands: Brand[];

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
            super(location, state, stateParams, url, search, save, authService, url.productDetail, url.productDetailQuery, excel);
            this.productSearchRequest = new SearchRequest("", "Modified", "False", "");
            this.brandSearchRequest = new SearchRequest("", "Modified", "False", "");
            this.loadProductCategories();
            this.loadBrands();
            this.selectedRow = null;
            this.isUpdateMode = false;
            if (this.stateParams["id"]) {
                this.isUpdateMode = true;
                this.edit(this.stateParams["id"]);
            }
        }

        loadProductCategories(): void {
            var self = this;
            var successCallback = (response: SearchResponse): void => {
                console.log('product Categories ', response);
                self.productCategories = <any>response.Models;
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            self.productSearchRequest["isProductCategoryActive"] = true;
            self.searchService
                .search(self.productSearchRequest, self.url.productQuery + "/Dropdown")
                .then(<any>successCallback, errorCallback);
        }

        categoryChanged(): void {
            console.log(this.model.productCategoryId);
        }

        loadBrands(): void {
            var self = this;
            var successCallback = (response: SearchResponse): void => {
                console.log('brands ', response);
                self.brands = <any>response.Models;
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            self.searchService
                .search(self.brandSearchRequest, self.url.brandQuery + "/Dropdown")
                .then(<any>successCallback, errorCallback);
        }

        productChanged(): void {
            console.log(this.model.productCategoryId);
        }

        brandChanged(): void {
            console.log(this.model.brandId);
        }

        getBarcode(): void {
            var self = this;
            var successCallback = (response: any): void => {
                self.model.barCode = response.toString();
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };

            self.searchService.get(self.url.productDetailQueryBarcode).then(successCallback, errorCallback);
        }

        downloadBarcode(): void {
            var self = this;
            var url = self.url.barcodeImage + "/Download?id=" + self.model.id;
            window.open(url, "_blank");
        }
    }

    angular.module("app").controller("ProductDetailController", ProductDetailController);
}