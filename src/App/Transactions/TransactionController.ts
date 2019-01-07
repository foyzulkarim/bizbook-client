
module App {
    "use strict";

    export class TransactionController extends BaseController<Transaction>{

        transactionFors: string[];
        transactionWiths: string[];
        transactionMediums: string[];
        paymentGatewayServices: string[];
        transactionFlowTypes: string[];
        accountHeads: any[];
        accountTypes: string[];
        transaction: Transaction;
        transactionDate : Date;
        parents: any[];
        orders: any[];

        selectedAccountHead: AccountHead;
        accountInfoTypes: any[];
        accountInfoType: any;
        selectedAccountInfo: AccountInfo;
        startDate: Date;
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
        ) {
            super(location, state, stateParams, url, search, save, authService, url.transaction, url.transaction + "Query", excel);
            this.startDate = new Date();
            this.isUpdateMode = false;
            if (this.stateParams["id"]) {
                this.isUpdateMode = true;
                this.edit(this.stateParams["id"]);
            }
        }

        activate() {
            this.model = new Transaction();
            this.isUpdateMode = false;
            this.setupDropdowns();
            this.selectedAccountHead = new AccountHead();
            this.selectedAccountInfo = new AccountInfo();
            this.loadAccountInfos();
        }        

        setupDropdowns(): void {
            var self = this;

            var success = function (response: any) {
                console.log(response);
                self.transactionMediums = response.transactionMediums;
                self.paymentGatewayServices = response.paymentGatewayServices;
                self.transactionFors = response.transactionFors;
                self.transactionFors = self.removeElement(self.transactionFors, "Sale");
                self.transactionFors = self.removeElement(self.transactionFors, "Purchase");
                self.transactionWiths = response.transactionWiths;
                self.transactionFlowTypes = response.transactionFlowTypes;
                self.accountTypes = response.accountTypes;
                self.accountInfoTypes = response.accountInfoTypes;
                self.accountInfoType = "Cash";
                self.model = new Transaction();
                self.model.transactionMedium = "Cash";
                self.model.paymentGatewayService = "Cash";
                self.model.transactionMediumName = "Cash";
                self.model.paymentGatewayServiceName = "Cash";
                self.model.transactionFlowType = "Income";
                self.model.transactionFor = "Office";
            };

            var error = function (error) {
                console.log(error);
            };

            self.searchService.get(self.queryUrl + "/Dropdowns").then(success, error);

            var accountSuccess = function (response: SearchResponse) {
                console.log('account - ', response);
                self.accountHeads = response.Models;               
            }

            var accountRequest = new SearchRequest();
            self.searchService.search(accountRequest, self.url.accountHeadQuery + "/Dropdown")
                .then(accountSuccess, error);
        }

        loadParents(): void {
            var self = this;
            var success = (response: SearchResponse) => {
                this.parents = response.Models;
                for (let i = 0; i < this.parents.length; i++) {
                    let data = this.parents[i].data;
                    this.parents[i].text = this.parents[i].text + " Due: "+data.totalDue;
                }
            };

            var error = function (error) {
                console.log(error);
            };
            //var request = new SearchRequest();
            //var url = self.url.inventoryBaseApi + "/" + self.model.transactionWith + "Query/Dropdown";
            //self.searchService.search(request, url).then(success, error);
        }

        accountHeadChanged(): void {
            this.model.accountHeadName = this.selectedAccountHead["text"];
            this.model.accountHeadId = this.selectedAccountHead.id;
        }

        loadOrders(): void {
            var self = this;
            var url: string = "";
            var request = new SearchRequest();

            if (this.model.transactionWith === 'Supplier') {
                url = self.url.purchaseQuery + "/Dropdown";
                request["supplierId"] = self.model.parentId;
            }
            if (this.model.transactionWith === 'Customer') {
                url = self.url.saleQuery + "/Dropdown";
                request["customerId"] = self.model.parentId;
            }

            if (url.length > 0) {

                let parent = self.parents.filter(x => x.id === self.model.parentId)[0];
                console.info('parent', parent);
                self.model.parentName = parent["text"];
                var success = (response: SearchResponse) => {
                    console.log(response);
                    self.orders = response.Models;
                };

                var error = function (error) {
                    console.log(error);
                };

                self.searchService.search(request, url).then(success, error);
                console.log(this.model);
            }
        }

        orderSelected(): void {
            var order = this.model['order'] as any;
            this.model.orderId = order.id;
            this.model.orderNumber = order.data.orderNumber;
            console.log(order);
        }

        edit(id: string): void {
            var self = this;
            var onSuccess = (data: any) => {
                self.model = data.data;
                if (self.isUpdateMode && self.model.transactionWith) {
                    self.loadParents();
                }
            }

            var onError = (err: any) => {
                alert('Error occurred');
            }

            var url = self.url.transaction + "Query" + '/Detail?id=' + id;

            self.searchService.search(null, url).then(onSuccess, onError);
        }

        print(): void {
            var printContents = document.getElementById("receipt").innerHTML;
            let baseUrl = document.location.host + this.url.clientSubFolder;
           
            let popupWin = window.open('',
                '_blank',
                'scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
            popupWin.window.focus();
            popupWin.document.write('<!DOCTYPE html><html><head>' +
                '<link rel="stylesheet" href="http://' +
                baseUrl +
                '/Content/bootstrap.min.css">' +
                '</head><body style="width: auto; height:auto;background:white"><div class="container">' +
                printContents +
                '</div></body></html>');

            popupWin.onbeforeunload = function (event) {
                popupWin.close();
            }
            popupWin.onabort = function (event) {
                popupWin.document.close();
                popupWin.close();
            }
            setTimeout(function () {
                popupWin.print();
            }, 1000);
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
            }
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

    angular.module("app").controller("TransactionController", TransactionController);
}