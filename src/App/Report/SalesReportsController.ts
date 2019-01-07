module App {
    export class SalesReportController extends BaseReportController implements angular.IController {

        $onInit(): void { }
        static $inject: string[] = ["$scope", "UrlService", "SearchService"];
        constructor(scope: angular.IScope, url: UrlService, search: SearchService) {
            super(scope, url, search, "SalesReport-");
            var self = this;
            self.loadData();
        }

        loadData() {

            var successCallback = (response: SearchResponse): void => {
                console.log(response.data);
                this.gridOptions["data"] = response.data;
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            var request = new SearchRequest("", "Date", "False");
            request["ReportType"] = "Daily";
            request.shopId = "1";
            request.page = -1;
            request.startDate = this.startDate.toJSON();
            request.endDate = this.endDate.toJSON();
            request["SaleReportType"] = "SaleByAmount";
            this.searchService.search(request, this.urlService.saleQueryReport).then(<any>successCallback, errorCallback);
        }
    }

    angular.module('app').controller("SalesReportController", SalesReportController);


    export class SaleByChannelReportController extends BaseReportController implements angular.IController {

        $onInit(): void { }

        static $inject: string[] = ["$scope", "UrlService", "SearchService"];
        constructor(scope: angular.IScope, url: UrlService, search: SearchService) {
            super(scope, url, search, 'SaleByChannelReport-report-');

            var self = this;
            self.title = "SaleByChannelReport";
            self.loadData();
        }

        loadData() {
            var successCallback = (response: SearchResponse): void => {
                console.log(response.data);
                this.gridOptions["data"] = response.data;
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            var request = new SearchRequest("", "Date", "False");
            request["ReportType"] = "Daily";
            request.shopId = "1";
            request.page = -1;
            request.startDate = this.startDate.toJSON();
            request["SaleReportType"] = "SaleByChannel";
            this.searchService.search(request, this.urlService.saleQueryReport).then(<any>successCallback, errorCallback);
        }

        loadDropdown(): void {
            //todo later
        }

    }

    angular.module('app').controller("SaleByChannelReportController", SaleByChannelReportController);

    export class SaleByOrderFromController extends BaseReportController implements angular.IController {

        $onInit(): void { }

        static $inject: string[] = ["$scope", "UrlService", "SearchService"];
        constructor(scope: angular.IScope, url: UrlService, search: SearchService) {
            super(scope, url, search, 'SaleByOrderFrom-report-');

            var self = this;
            self.title = "SaleByOrderFrom";
            self.loadData();
        }

        loadData() {
            var successCallback = (response: SearchResponse): void => {
                console.log(response.data);
                this.gridOptions["data"] = response.data;
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            var request = new SearchRequest("", "Date", "False");
            request["ReportType"] = "Daily";
            request.shopId = "1";
            request.page = -1;
            request.startDate = this.startDate.toJSON();
            request["SaleReportType"] = "SaleByOrderFrom";
            this.searchService.search(request, this.urlService.saleQueryReport).then(<any>successCallback, errorCallback);
        }
    }

    angular.module('app').controller("SaleByOrderFromController", SaleByOrderFromController);

    export class SaleDetailsHistoryReportController extends BaseController<SaleReport2> implements angular.IController {
        $onInit(): void { }
        selectedItem: any = "";
        saleTypes: string[];

        chartLabels: string[];
        chartData: number[];

        headers: string[] = ["date", "amountProduct","amountTotal","amountDiscount","amountPayable","amountPaid","amountDue"];

        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService",'Excel'

        ];

        totalProductAmount = 0;
        totalAmount = 0;
        totalAmountDiscount = 0;
        totalAmountPayable = 0;
        totalAmountPaid = 0;
        totalAmountDue = 0;
        totalCost = 0;
        totalProfit = 0;

        sales: SaleViewModel[];
        constructor(location: angular.ILocationService,
            state: angular.ui.IStateService,
            stateParams: angular.ui.IStateParamsService,
            url: UrlService,
            search: SearchService,
            save: SaveService,
            authService: AuthService,
            excel: any) {
            super(location, state, stateParams, url, search, save, authService, url.saleDetailQuery, url.saleQueryReport, excel);
            var self = this;

            self.configureHeaderAndFooter();

            self.loadDropdown();
            self.loadData();
        }

        configureHeaderAndFooter(): void {
            var self = this;
            self.showManageColumnsButton = false;
        }

        loadData(): void {

            var self = this;
            self.totalProductAmount = 0;
            self.totalAmount = 0;
            self.totalAmountDiscount = 0;
            self.totalAmountPayable = 0;
            self.totalAmountPaid = 0;
            self.totalAmountDue = 0;
            self.totalCost = 0;
            self.totalProfit = 0;

            var successCallback = (response: SearchResponse): void => {

                console.log(response.data);

                self.models = response.data;

                self.csvModels = [];


                self.chartLabels = [];
                self.chartData = [];

                for (let i = 0; i < self.models.length; i++) {
                    self.csvModels.push(self.generateCsvModel(self.models[i]));
                }   

                for (let i = 0; i < response.data.length; i++) {

                    self.totalProductAmount += response.data[i].amountProduct;
                    self.totalAmount += response.data[i].amountTotal;
                    self.totalAmountDiscount += response.data[i].amountDiscount;
                    self.totalAmountPayable += response.data[i].amountPayable;
                    self.totalAmountPaid += response.data[i].amountPaid;
                    self.totalAmountDue += response.data[i].amountDue;
                    self.totalCost += response.data[i].amountCost;
                    self.totalProfit += response.data[i].amountProfit;

                    
                    self.chartLabels.push(self.models[i].modified);
                    self.chartData.push(self.models[i].amountProduct);
                }
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };

            var request = new SearchRequest();
            request["startDate"] = self.startDate.toLocaleString();
            request["endDate"] = self.endDate.toLocaleString();
            request.shopId = "1";
            request.page = -1;
            request['SaleType'] = self.selectedItem;
            this.searchService.search(request, self.url.saleQueryReport).then(<any>successCallback, errorCallback);
        }

        loadDropdown(): void {
            var self = this;
            self.saleTypes = ["All", "DealerSale", "CustomerSale"];
            self.selectedItem = "All";
        }


        //loadDropdown(): void {
        //    var self = this;
        //    var successCallback = (response: SearchResponse): void => {
        //        self.saleTypes = <any>response.Models;
        //        self.selectedItem = self.saleTypes[0];
        //        self.loadData();
        //    };
        //    var errorCallback = (error: any): void => {
        //        console.log(error);
        //    };
        //    var request = new SearchRequest();
        //    self.searchService
        //        .search(request, self.url.saleQuery + "/Dropdown")
        //        .then(<any>successCallback, errorCallback);
        //}

        dropdownChanged(): void {
            var self = this;
            self.loadData();
        }

        selectedTypeAhead(a: any, b: any, c: any, d: any): void {
            Display.log(this.selectedItem);

        }
    }

    angular.module("app").controller("SaleDetailsHistoryReportController", SaleDetailsHistoryReportController);
}