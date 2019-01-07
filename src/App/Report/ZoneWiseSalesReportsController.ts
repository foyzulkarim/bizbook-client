module App {

    export class ZoneWiseSalesReportsController extends BaseController<any> {

        quantityTotal: number = 0;
        amountTotal: number = 0;
        chartLabels: string[];
        chartData: number[];

        static $inject: string[] = [

            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", "Excel"

        ];

        constructor(
            location: angular.ILocationService,
            sate: angular.ui.IStateService,
            stateParams: angular.ui.IStateParamsService,
            url: UrlService,
            search: SearchService,
            save: SaveService,
            authService: AuthService,
            localStorageService: LocalStorageService,
            excel: any
        ) {
            super(location,
                sate,
                stateParams,
                url,
                search,
                save,
                authService,
                url.sale,
                url.saleQuery,
                excel

            );
            
            var self = this;
            self.localStorageService = localStorageService;
            this.searchRequest.startDate = this.startDate.toJSON();
            this.searchRequest.endDate = this.endDate.toJSON();

            this.loadWarehouses().then(result => {

                if (self.warehouses.length === 1) {
                    self.searchRequest.warehouseId = self.warehouses[0].id;
                }

                else {
                    let whId = self.localStorageService.get(LocalStorageKeys.WarehouseId);
                    if (whId != null) {
                        self.searchRequest.warehouseId = whId;
                    }
                }
                return self.search();
            });
        }

        search(): void {
            var self = this;

            self.quantityTotal = 0;
            self.amountTotal = 0;

            var successCallback = (response: SearchResponse): void => {

                self.models = <any>response.data;

                self.chartLabels = [];
                self.chartData = [];
                self.quantityTotal = 0;
                self.amountTotal = 0;

                if (self.models.length === 0) {
                    console.log('No search result found');
                }
                else {
                    self.generateCsvModels();
                    for (let i = 0; i < self.models.length; i++) {
                        let m = self.models[i];
                        self.quantityTotal += m.count;
                        self.amountTotal += m.amount;

                        self.chartLabels.push(self.models[i].key);
                        self.chartData.push(self.models[i].amount);
                    }
                }

                self.totalCount = response.Count;
                self.searchRequest.totalPage = Math.ceil(response.Count / 10);
            };

            var errorCallback = (error: any): void => {
                console.log(error);
            };
           
            self.searchService.search(self.searchRequest, self.queryUrl + "/SalesByZone")
                .then(successCallback, errorCallback);
        }
    }

    angular.module("app").controller("ZoneWiseSalesReportsController", ZoneWiseSalesReportsController);
}