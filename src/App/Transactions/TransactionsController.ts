
module App {
    "use strict";

    export class TransactionsController extends BaseController<Transaction>{

        totalIncome : number = 0;
        totalExpense : number = 0;
        accountHeads: any[];
        accountInfos: any[];
        transactionMediums: string[];
        transaction: Transaction;

        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService",'Excel'
        ];

        headers = ["id", "accountHeadName", "amount", "orderNumber", "transactionFor", "transactionWith","modified"];
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
            super(location, state, stateParams, url, search, save, authService, url.transaction, url.transaction + "Query", excel);
            let self = this;
            this.localStorageService = localStorageService;
            this.setupDropdowns();

            this.startDate = new Date();
            this.endDate = new Date();
            var accountSuccess = function (response: SearchResponse) {
                console.log('account - ', response);
                self.accountHeads = response.Models;
                self.accountHeads.splice(0, 0, { id: '', text: 'All' });
                self.searchRequest['accountHeadId'] = self.accountHeads[0].id;                
            }

            var error = function (error) {
                console.log(error);
            };

            var accountRequest = new SearchRequest();
            accountRequest.page = -1;
            self.searchService.search(accountRequest, self.url.accountHeadQuery + "/Dropdown")
                .then(accountSuccess, error);

            var accountInfoSuccess = function(response: SearchResponse) {
                self.accountInfos = response.Models;
                self.accountInfos.splice(0, 0, { id: '', text: 'All' });
                self.searchRequest['accountInfoId'] = self.accountInfos[0].id;
            }


            var accountInfoRequest = new SearchRequest();
            accountInfoRequest.page = -1;
            self.searchService.search(accountInfoRequest, self.url.accountInfoQuery + "/Dropdown")
                .then(accountInfoSuccess, error);

            self.search();
        }    
        
        setupDropdowns(): void {
            var self = this;

            var success = (response: any) => {
                console.log(response);
                self.transactionMediums = response.transactionMediums;
                self.transaction = new Transaction();
                self.searchRequest = new SearchRequest();
                self.transaction.transactionMedium = "Cash";
                self.searchRequest['transactionMediumName']= self.transaction.transactionMedium;
                
            };

            var error = error => {
                console.log(error);
            };

            self.searchService.get(self.url.transactionQuery + "/Dropdowns").then(success, error);
            self.search();
        }
        search(): void {
            var self = this;
            self.totalIncome = 0;
            self.totalExpense = 0;
            var successCallback = (response: SearchResponse): void => {
                console.log('i am in transactions controller ',response);
                self.totalCount = response.Count;
                self.models = <any>response.Models;
                if (self.models.length === 0) {
                    console.log('No search result found');
                   // alert('No search result found');
                } else {
                    self.csvModels = [];
                   
                    for (let i = 0; i < self.models.length; i++) {
                        self.csvModels.push(self.generateCsvModel(self.models[i]));

                        if (self.models[i].transactionFlowType=='Income' || self.models[i].transactionFor=='Sale') {
                            self.totalIncome += self.models[i].amount;
                        } else {
                            self.totalExpense += self.models[i].amount;
                        }                        
                    }


                    console.info(self.totalIncome, self.totalExpense);
                }

                self.searchRequest.totalPage = Math.ceil(response.Count / 10);
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            
            self.searchRequest.startDate = self.startDate.toDateString();
            self.searchRequest.endDate = self.endDate.toDateString();

            self.searchService
                .search(self.searchRequest, self.queryUrl + "/Search")
                .then(<any>successCallback, errorCallback);
        }

    }

    angular.module("app").controller("TransactionsController", TransactionsController);



    export class IncomeStatementController extends BaseController<Transaction>{
        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];

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
            super(location, state, stateParams, url, search, save, authService, url.transaction, url.transaction + "Query", excel);
            let self = this;

               
        }


        //printModel: Transaction;
        //print(id: string) {
        //    var self = this;
        //    self.printModel = new Transaction();
        //    var successCallback = (response: SearchResponse): void => {
        //        self.printModel = response.data;
        //        setTimeout(function (p) {
        //            var printContents = document.getElementById("receipt").innerHTML;
        //            let baseUrl = document.location.host + self.url.clientSubFolder;
        //            let popupWin = window.open('',
        //                '_blank',
        //                'scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
        //            popupWin.window.focus();
        //            popupWin.document.write('<!DOCTYPE html><html><head>' +
        //                '<link rel="stylesheet" href="http://' +
        //                baseUrl +
        //                '/Content/bootstrap.min.css">' +
        //                '</head><body style="width: auto; height:auto;background:white"><div class="container">' +
        //                printContents +
        //                '</div></body></html>');

        //            popupWin.onbeforeunload = function (event) {
        //                popupWin.close();
        //                //return '';
        //            };
        //            popupWin.onabort = function (event) {
        //                popupWin.document.close();
        //                popupWin.close();
        //            }

        //            setTimeout(function () {
        //                popupWin.print();
        //            }, 1000);
        //        },
        //            1000);
        //        self.activate();
        //    };
        //    var errorCallback = (error: any): void => {
        //        console.log(error);
        //    };

        //    var searchRequest = new SearchRequest();
        //    searchRequest.id = this.stateParams["id"];
        //    searchRequest.page = -1;
        //    var httpUrl = self.url.transactionQuery + "/Receipt?id=" + id;
        //    self.searchService.search(null, httpUrl).then(<any>successCallback, errorCallback);
        //}


        print(id: string) {
            if (id == null) {
                id = "incomestatement";
            }

            var printContents = document.getElementById(id).innerHTML;
            var popupWin;
            let baseUrl = 'http://' + document.location.host + this.url.clientSubFolder;
            console.log(baseUrl);
            let cssUrl: string = '';
            cssUrl = baseUrl + '/dist/css/all.css?t=074002082011';
            popupWin = window.open('',
                '_blank',
                'scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
            popupWin.window.focus();
            popupWin.document.write('<!DOCTYPE html><html><head>' +
                '<link rel="stylesheet" ' +
                'href="' + cssUrl + '">' +
                '</head><body style="font-size:10px !important; line-height: 1.0 !important;">' +
                printContents +
                '</body></html>');

            popupWin.onbeforeunload = function (event) {
                popupWin.close();

            };
            popupWin.onabort = function (event) {
                popupWin.document.close();
                popupWin.close();
            }

            setTimeout(function () {
                popupWin.print();
            },
                1000);
        }


    }
    angular.module("app").controller("IncomeStatementController", IncomeStatementController);



    export class MoneyTransferConroller extends BaseController<Transaction> {


        transaction: Transaction;
        transactionDate: Date;
        selectedAccountInfo: AccountInfo;
        paymentGatewayServices: string[];
        accountTypes: string[];
        accountInfoTypes: any[];
        accountInfoType: any;

        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService",
            'Excel'
        ];

        constructor(
            location: angular.ILocationService,
            state: angular.ui.IStateService,
            stateParams: angular.ui.IStateParamsService,
            url: UrlService,
            search: SearchService,
            save: SaveService,
            authService: AuthService,
            excel: any


        )
        {
            super(location, state, stateParams, url, search, save, authService, url.transaction, url.transaction + "Query", excel);

            this.isUpdateMode = false;
            if (this.stateParams["id"]) {
                this.isUpdateMode = true;
                this.edit(this.stateParams["id"]);

            }
        }


        activate() {
            this.model = new Transaction();
            this.isUpdateMode = true;
            this.setupDropdowns();
            this.selectedAccountInfo = new AccountInfo();
            this.loadAccountInfos();
        }

        setupDropdowns(): void {
            var self = this;

            var success = function (response: any) {
                console.log(response);

                self.paymentGatewayServices = response.paymentGatewayServices;
                self.accountTypes = response.accountTypes;
                self.accountInfoTypes = response.accountInfoTypes;
                self.model = new Transaction();
                self.accountInfoType = "Cash";
            };

            var error = function (error) {
                console.log(error);
            };

            self.searchService.get(self.queryUrl + "/Dropdowns").then(success, error);
        }
        


        accountInfos: any[];
        loadAccountInfos(): void {
            var self = this;
            var success = (response: any): void => {
                Display.log('loadAccountInfos result : ', response);
                self.accountInfos = response.Models;
                if (self.accountInfos.length > 0) {
                    for (let i = 0; i < self.accountInfos.length; i++) {
                        if (self.accountInfos[i].text == "Cash") {
                            self.selectedAccountInfo = self.accountInfos[i];
                            console.log(self.selectedAccountInfo);
                            self.transaction.accountInfoId = self.selectedAccountInfo.id;
                            break;
                        }

                    }
                }
            };

            var error = (error: any): void => {
                Display.log(error);
            };
            let accountInfoQueryRequest = new SearchRequest();
            self.searchService.search(accountInfoQueryRequest, self.url.accountInfoQuery + "/Dropdown")
                .then(<any>success, error);
        }

        accountInfoChanged(): void {
            var self = this;
            self.model.accountInfoTitle = self.selectedAccountInfo["text"];
            self.model.accountInfoId = self.selectedAccountInfo.id;
        }

        dateChanged(): void {
            var self = this;
            console.log(self.transactionDate);
            self.model.transactionDate = self.transactionDate.toDateString();
        }
    }

    angular.module("app").controller("MoneyTransferConroller", MoneyTransferConroller);

}