module App {

    export class DealerController extends BaseController<Dealer> {
        static $inject: string[] = ["$location", "$state", "$stateParams", "UrlService", "SearchService",
            "SaveService", "AuthService", 'Excel'];
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
            super(location, state, stateParams, url, search, save, authService, url.dealer, url.dealerQuery, excel);
            this.isUpdateMode = false;
            if (this.stateParams["id"]) {
                this.isUpdateMode = true;
                this.model = new Dealer();
                this.model.isVerified = true;
                this.edit(this.stateParams["id"]);
            }
        }
    }

    angular.module("app").controller("DealerController", DealerController);


    export class DealersController extends BaseController<Dealer> {
        static $inject: string[] = ["$location", "$state", "$stateParams", "UrlService",
            "SearchService", "SaveService", "AuthService", 'Excel'];
        headers = ["id", "name", "phone", "postCode", "modified"];
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
            super(location, state, stateParams, url, search, save, authService, url.dealer, url.dealerQuery, excel);
            this.search();
        }
    }

    angular.module("app").controller("DealersController", DealersController);

    export class DealerHistoryController extends BaseController<Dealer> {

        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        headers = ["date", "invoiceNumber", "transactionNumber", "type", "total", "paid"];

        constructor(
            location: angular.ILocationService,
            $state: angular.ui.IStateService,
            $stateParams: angular.ui.IStateParamsService,
            url: UrlService,
            searchService: SearchService,
            saveService: SaveService,
            auth: AuthService,
            excel: any
        ) {
            super(location, $state, $stateParams, url, searchService, saveService, auth, url.dealer, url.dealerQuery, excel);
            if (this.stateParams["id"]) {
                this.loadDealerHistory();
            }
        }

        response: any;


        loadDealerHistory(): void {
            var self = this;
            var successCallback = (response: SearchResponse): void => {
                self.response = response.data;
                Display.log('dealer history', self.response);
                self.csvModels = [];
                for (let i = 0; i < self.response.histories.length; i++) {
                    self.csvModels.push(self.generateCsvModel(self.response.histories[i]));
                }
            };
            var errorCallback = (error: any): void => {
                console.log(error);
                alert('Error occurred');
            };
            var searchRequest = new SearchRequest();
            searchRequest.parentId = this.stateParams["id"];
            searchRequest.page = -1;
            searchRequest["isDealerSale"] = true;
            self.searchService
                .search(searchRequest, self.url.saleQuery + "/BuyerHistory")
                .then(<any>successCallback, errorCallback);
        }

    }

    angular.module("app").controller("DealerHistoryController", DealerHistoryController);

    export class DealerProductHistoryController extends BaseController<Sale>{
        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        totalQuantity = 0;
        totalUnitPrice = 0;
        totalPrice = 0;

        constructor(
            location: angular.ILocationService,
            $state: angular.ui.IStateService,
            $stateParams: angular.ui.IStateParamsService,
            url: UrlService,
            searchService: SearchService,
            saveService: SaveService,
            auth: AuthService,
            excel: any
        ) {
            super(location, $state, $stateParams, url, searchService, saveService, auth, url.dealer, url.dealerQuery, excel);
            if (this.stateParams["id"]) {
                this.loadDealerProductHistory();
            }
        }
        response: any;
        loadDealerProductHistory(): void {
            var self = this;
            self.totalUnitPrice = 0;
            self.totalQuantity = 0;
            self.totalPrice = 0;
            var successCallback = (response: SearchResponse): void => {
                self.response = response.data;
                Display.log('i am in history', self.response);
                self.csvModels = [];
                for (let i = 0; i < self.response.histories.length; i++) {
                    self.totalUnitPrice += self.response.histories[i].unitPrice;
                    self.totalQuantity += self.response.histories[i].quantity;
                    self.totalPrice += self.response.histories[i].total;
                    // do your stuff for csv model generation
                    self.csvModels.push(self.generateCsvModel(self.response.histories[i]));

                }
            };
            var errorCallback = (error: any): void => {
                console.log(error);
                alert('Error occurred');
            };
            var searchRequest = new SearchRequest();
            searchRequest.parentId = this.stateParams["id"];
            searchRequest.page = -1;
            searchRequest["isDealerSale"] = true;
            self.searchService
                .search(searchRequest, self.url.saleQuery + "/ProductHistory")
                .then(<any>successCallback, errorCallback);
        }
    }
    angular.module("app").controller("DealerProductHistoryController", DealerProductHistoryController);

    export class DealerProductDueController extends BaseController<DealerProduct>{

        dealerId: string;
        transactionMediums: string[];
        paymentGatewayServices: string[];
        transaction: Transaction;
        accountInfoTypes: any[];
        accountInfoType: any;
        selectedAccountInfo: AccountInfo;
    
        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
            ];
        transactionDate: Date;
        constructor(
            location: angular.ILocationService,
            $state: angular.ui.IStateService,
            $stateParams: angular.ui.IStateParamsService,
            url: UrlService,
            searchService: SearchService,
            saveService: SaveService,
            auth: AuthService,
            excel: any
        ) {
            super(location, $state, $stateParams, url, searchService, saveService, auth, url.dealerProduct, url.dealerProductQuery, excel);
            if (this.stateParams["id"]) {
                this.dealerId = this.stateParams["id"];
                //this.searchRequest["dealerId"] = this.stateParams["id"];
                this.searchRequest.isIncludeParents = true;
                this.search();

                this.transaction = new Transaction();
                this.setupDropdowns();
                this.selectedAccountInfo = new AccountInfo();
                this.loadAccountInfos();
            }            
        }

        setupDropdowns(): void {
            var self = this;

            var success = (response: any) => {
                console.log(response);
                self.transactionMediums = response.transactionMediums;
                self.paymentGatewayServices = response.paymentGatewayServices;
                self.accountInfoTypes = response.accountInfoTypes;
                self.accountInfoType = "Cash";
                self.transaction.transactionMedium = "Cash";
                self.transaction.paymentGatewayService = "Cash";

            };

            var error = error => {
                console.log(error);
            };

            self.searchService.get(self.url.transactionQuery + "/Dropdowns").then(success, error);


            var accountSuccess = (response: SearchResponse) => {
                console.log('account - ', response);
                var accountHeads: any[] = response.Models;
                let sale = accountHeads.filter(x => x.text === "Sale")[0] as any;
                if (sale != null) {
                    this.transaction.accountHeadId = sale.id;
                    this.transaction.accountHeadName = sale.text;
                }
            }

            var accountRequest = new SearchRequest();
            self.searchService.search(accountRequest, self.url.accountHeadQuery + "/Dropdown")
                .then(accountSuccess, error);
        }


        save(): void {
            var self = this;
            Display.log(self.models);
            var successCallback = (response: any): void => {
                Display.log(response);
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            self.transaction.transactionDate = self.transactionDate.toDateString();
            let dealerProductTransactions: DealerProductTransaction[] = [];
            let l = 0;
            // process and prepare data
            for (let i = 0; i < self.models.length; i++) {
                let m: DealerProductTransaction = new DealerProductTransaction();
                m.amount = self.models[i].newlyPaid;
                m.dealerProductId = self.models[i].id;
                dealerProductTransactions.push(m);
                l += dealerProductTransactions[i].amount;
            }

            if (l !== self.transaction.amount) {
                alert('Transaction amount and product breakdown amount is not equal. returning');
                return;
            }

            let updateModel = new DealerProductDetailUpdateModel();
            updateModel.dealerId = self.dealerId;
            updateModel.dealerProductTransactions = dealerProductTransactions;
            updateModel.transaction = self.transaction;
             
            self.saveService.update(updateModel, self.commandUrl + "/UpdateDues").then(<any>successCallback, errorCallback);
        }

        accountInfos: any[];
        loadAccountInfos(): void {
            var self = this;
            var success = (response: any): void => {
                Display.log(response);
                self.accountInfos = response.Models;
            };
            var error = (error: any): void => {
                Display.log(error);
            }
            self.searchService.search(self.searchRequest, self.url.accountInfoQuery + "/Dropdown")
                .then(<any>success, error);

        }

        accountInfoChanged(): void {
            var self = this;
            self.transaction.accountInfoTitle = self.selectedAccountInfo["text"];
            self.transaction.accountInfoId = self.selectedAccountInfo.id;
            self.transaction.paymentGatewayServiceName = self.transaction.accountInfoTitle;
            self.transaction.transactionMediumName = self.transaction.transactionMedium;
        }


    }
    angular.module("app").controller("DealerProductDueController", DealerProductDueController);
}