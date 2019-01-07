module App {
    export class CourierController extends BaseController<Courier> {
        shops:Shop[];

        static $inject: string[] = ["$location", "$state", "$stateParams", "UrlService", "SearchService", "SaveService", "AuthService",'Excel'];
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
            super(location, state, stateParams, url, search, save, authService, url.courier, url.courierQuery, excel);
           // this.model.courierShopId = "00000000-0000-0000-0000-000000000001";
            this.isUpdateMode = false;
            if (this.stateParams["id"]) {
                this.isUpdateMode = true;
                this.edit(this.stateParams["id"]);
            }

            this.loadDropdown();
        }

        loadDropdown(): void {
            var self = this;

            var successCallback = (response: SearchResponse): void => {
                console.log('addresses ', response);
                self.shops = <any>response.Models;
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };

            self.searchService
                .search(self.searchRequest, self.url.shopQueryDropdown)
                .then(<any>successCallback, errorCallback);
        }
    }

    angular.module("app").controller("CourierController", CourierController);

    export class CouriersController extends BaseController<Courier> {

        static $inject: string[] = ["$location", "$state", "$stateParams", "UrlService", "SearchService", "SaveService", "AuthService",'Excel'];
        headers = ["id", "courierShopName", "courierShopPhone", "contactPersonName","modified"];
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
            super(location, state, stateParams, url, search, save, authService, url.courier, url.courierQuery, excel);
            this.search();
        }
    }

    angular.module("app").controller("CouriersController", CouriersController);
}