module App {
    export class TransactionByAmountReportController extends BaseReportController implements angular.IController {
        $onInit(): void { }

        static $inject: string[] = ["$scope", "UrlService", "SearchService"];
        constructor(scope: angular.IScope, url: UrlService, search: SearchService) {
            super(scope, url, search, 'Transaction-By-Amount-Report-');
            var self = this;
            self.title = "Transaction By Amount";
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
            var request = new SearchRequest("", "Date", "True");
            request["ReportType"] = "Daily";
            request.shopId = "1";
            request.page = -1;
            request.startDate = this.startDate.toJSON();
            request["TransactionReportType"] = "TransactionByAmount";
            this.searchService.search(request, this.urlService.transactionQueryReport).then(<any>successCallback, errorCallback);
        }        
    }

    angular.module('app').controller("TransactionByAmountReportController", TransactionByAmountReportController);

    export class TransactionByAccountHeadReportController extends BaseReportController implements angular.IController {
        $onInit(): void { }

        
        static $inject: string[] = ["$scope", "UrlService", "SearchService"];
        constructor(scope: angular.IScope, url: UrlService, search: SearchService) {
            super(scope, url, search, 'Transaction-By-Account-Report-');
            var self = this;
            self.hideDropdown = false;
            self.title = "Transaction By Account Head";
            self.loadDropdown();
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
            request.parentId = this.selectedItem.id;
            request["TransactionReportType"] = "TransactionByAccountHead";
            this.searchService.search(request, this.urlService.transactionQueryReport).then(<any>successCallback, errorCallback);
        }
        
        loadDropdown(): void {
            var self = this;
            var successCallback = (response: SearchResponse): void => {
                console.log('items ', response);
                self.items = <any>response.Models;
                let all =  { id: '00000000-0000-0000-0000-000000000000', text: 'All' };
                self.items.splice(0, 0, all);
                self.selectedItem = self.items[0];
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            var request = new SearchRequest("", "Name", "True", "");
            self.searchService
                .search(request, self.urlService.accountHeadQuery + "/Dropdown")
                .then(<any>successCallback, errorCallback);
        }

        dropdownChanged(): void {
            this.loadData();
        }
    }

    angular.module('app').controller("TransactionByAccountHeadReportController", TransactionByAccountHeadReportController);


    export class TransactionDetailsHistoryReportController extends BaseController<Transaction> implements angular.IController {
        $onInit(): void { }
        selectedItem: any = "";
        accountHeads: any[];
        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService",'Excel'

        ];
        totaAmountStating = 0;
        totalAmountIn = 0;
        totalAmountOut = 0;
        totalCountTrx = 0;
        totaAmountEndIn = 0;

        chartLabels: string[];
        chartData: number[];

        headers = ["date", "accountHeadName", "amountTotalStarting", "amountTotalIn", "amountTotalOut", "amountTotalEnding", "countTotalTrx"];
        constructor(location: angular.ILocationService,
            state: angular.ui.IStateService,
            stateParams: angular.ui.IStateParamsService,
            url: UrlService,
            search: SearchService,
            save: SaveService,
            authService: AuthService,
            excel: any) {
            super(location, state, stateParams, url, search, save, authService, url.transactionQuery, url.transactionQueryReport, excel);
            var self = this;
            self.loadDropdown();
        }

        loadData(): void {
            var self = this;
            self.totalAmountIn = 0;
            self.totalAmountOut = 0;
            self.totalCountTrx = 0;
            var successCallback = (response: SearchResponse): void => {
                console.log(response.data);
                self.models = response.data;
                self.chartLabels = [];
                self.chartData = [];
                self.csvModels = [];

                for (var i = 0; i < self.models.length; i++) {
                    self.csvModels.push(self.generateCsvModel(self.models[i]));
                }

                for (let i = 0; i < response.data.length; i++) {
                    self.totaAmountStating += response.data[i].amountTotalStarting;
                    self.totalAmountIn += response.data[i].amountTotalIn;
                    self.totalAmountOut += response.data[i].amountTotalOut;
                    self.totaAmountEndIn += response.data[i].amountTotalEnding;
                    self.totalCountTrx += response.data[i].countTotalTrx;

                    self.chartLabels.push(self.models[i].modified);
                    self.chartData.push(self.models[i].amount);
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
            request["AccountReportType"] = "TransactionHistory";
            request['accountHeadId'] = self.selectedItem.id;
            this.searchService.search(request, self.url.accountHeadQueryReport).then(<any>successCallback, errorCallback);
        }

        loadDropdown(): void {
            var self = this;
            var successCallback = (response: SearchResponse): void => {
                self.accountHeads = <any>response.Models;
                self.selectedItem = self.accountHeads[0];
                self.loadData();
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            var request = new SearchRequest();
            self.searchService
                .search(request, self.url.accountHeadQuery + "/Dropdown")
                .then(<any>successCallback, errorCallback);
        }

        dropdownChanged(): void {
            var self = this;
            self.loadData();
        }
        
    }

    angular.module('app').controller("TransactionDetailsHistoryReportController", TransactionDetailsHistoryReportController);


    export class TransactionDetailsReportController extends BaseController<Transaction> implements angular.IController {
        $onInit(): void { }
        selectedItem: any = "";
        transactionDetails: any[];
        //accountHeads: any[];
        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService",'Excel'
        ];


        totalAmountStating = 0;
        totalAmountIn = 0;
        totalAmountOut = 0;
        totalAmountEnding = 0;
        totalCountTrx = 0;

        chartLabels: string[];
        chartData: number[];

        headers = ["date", "accountHeadName", "amountTotalStarting", "amountTotalIn", "amountTotalOut", "amountTotalEnding", "countTotalTrx"];

        constructor(location: angular.ILocationService,
            state: angular.ui.IStateService,
            stateParams: angular.ui.IStateParamsService,
            url: UrlService,
            search: SearchService,
            save: SaveService,
            authService: AuthService,
            excel: any) {
            super(location,
                state,
                stateParams,
                url,
                search,
                save,
                authService,
                url.transactionQuery,
                url.transactionQueryReport,excel);
            var self = this;
            self.hideEndDate = true;
            self.loadData();

        }

        loadData(): void {

            var self = this;
            self.totalAmountIn = 0;
            self.totalAmountOut = 0;
            self.totalCountTrx = 0;

            var successCallback = (response: SearchResponse): void => {
                console.log(response.data);
                self.models = response.data;

                self.csvModels = [];
                self.chartLabels = [];
                self.chartData = [];


                for (var i = 0; i < self.models.length; i++) {
                    self.csvModels.push(self.generateCsvModel(self.models[i]));
                }
                for (let i = 0; i < response.data.length; i++) {
                    self.totalAmountStating += response.data[i].amountTotalStarting;
                    self.totalAmountIn += response.data[i].amountTotalIn;
                    self.totalAmountOut += response.data[i].amountTotalOut;
                    self.totalAmountEnding += response.data[i].amountTotalEnding;
                    self.totalCountTrx += response.data[i].countTotalTrx;

                    self.chartLabels.push(self.models[i].modified);
                    self.chartData.push(self.models[i].amount);
                }
            };


            var errorCallback = (error: any): void => {
                console.log(error);
            };

            var request = new SearchRequest();
            request["startDate"] = self.startDate.toLocaleString();
           // request["endDate"] = self.endDate.toLocaleString();
            request.shopId = "1";
            request.page = -1;
            request["AccountReportType"] = "TransactionDeatil";

            this.searchService.search(request, self.url.accountHeadQueryReport).then(<any>successCallback, errorCallback);
        }


        loadDropdown(): void {
            var self = this;
            var successCallback = (response: SearchResponse): void => {
                self.transactionDetails = <any>response.Models;
                self.selectedItem = self.transactionDetails[0];
                self.loadData();
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            var request = new SearchRequest();
            self.searchService
                .search(request, self.url.transactionQuery + "/Dropdown")
                .then(<any>successCallback, errorCallback);
        }
    }

    angular.module('app').controller("TransactionDetailsReportController", TransactionDetailsReportController);

}