module App {

    export class BrandsController extends BaseController<Brand> {
        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService",'Excel'
        ];

        headers = ["id", "brandCode", "name","modified"];
        
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
            super(location, state, stateParams, url, search, save, authService, url.brand, url.brandQuery, excel);
            this.search();
        }

        //report(id: string): void {
        //    var self = this;
        //    window.open(self.url.brandQueryReport + "/" + id, "_blank", "");
        //}
     
    }

    angular.module('app').controller('BrandsController', BrandsController);

    export class BrandController extends BaseController<Brand>{

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
            super(location, state, stateParams, url, search, save, authService, url.brand, url.brandQuery, excel);
            this.isUpdateMode = false;
            if (this.stateParams["id"]) {
                this.isUpdateMode = true;
                this.edit2(this.stateParams["id"]);
            }
        }
      
    }

    angular.module("app").controller("BrandController", BrandController);
}