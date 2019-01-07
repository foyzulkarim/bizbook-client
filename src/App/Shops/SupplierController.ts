module App {
    "use strict";

    export class SuppliersController extends BaseController<Supplier> {
        static $inject: string[] = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        headers = ["id", "name", "phone", "modified"];
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
            super(location,
                state,
                stateParams,
                url,
                search,
                save,
                authService,
                url.supplier,
                url.supplierQuery,
                excel
            );
            this.search();
        }

        //report(id:string): void {
        //    var self = this;
        //    var downloadUrl = self.url.supplierQueryReport + "/" + id;
        //    window.open(downloadUrl, "_blank", "");
        //}
    }

    angular.module('app').controller('SuppliersController', SuppliersController);

    export class SupplierController extends BaseController<Supplier>{
        static $inject: string[] = ["$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'];
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
            super(location,
                state,
                stateParams,
                url,
                search,
                save,
                authService,
                url.supplier,
                url.supplierQuery,
                excel
            );

            this.isUpdateMode = false;
            if (this.stateParams["id"]) {
                this.isUpdateMode = true;
                this.edit(this.stateParams["id"]);
            }
        }

    }

    angular.module("app").controller("SupplierController", SupplierController);

    export class SupplierHistoryController extends BaseController<Supplier>{
        static $inject: string[] = ["$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'];
        headers = ["id", "type", "total", "paid", "date"];

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
            super(location,
                state,
                stateParams,
                url,
                search,
                save,
                authService,
                url.supplier,
                url.supplierQuery,
                excel
            );

            this.isUpdateMode = false;
            if (this.stateParams["id"]) {
                this.isUpdateMode = true;
                this.loadSupplierHistory(this.stateParams["id"]);
            }
        }

        response: any;

        loadSupplierHistory(id: string): void {
            var self = this;
            var onSuccess = (response: SearchResponse) => {
                self.response = response.data;
                Display.log(response.data);
                self.csvModels = [];
                for (let i = 0; i < self.response.histories.length; i++) {
                    self.csvModels.push(self.generateCsvModel(self.response.histories[i]));
                }
            };

            var onError = (error: any) => {
                console.log(error);
                alert('Error occurred');
            };
            var searchRequest = new SearchRequest();
            searchRequest.parentId = id;
            var url = self.queryUrl + '/History';
            self.searchService.search(searchRequest, url).then(onSuccess, onError);
        }
    }

    angular.module("app").controller("SupplierHistoryController", SupplierHistoryController);

    export class SupplierProductHistoryController extends BaseController<Purchase>{
        static $inject: string[] = ["$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'];

        totalQuantity = 0;
        totalUnitPrice = 0;
        totalPrice = 0;

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
            super(location,
                state,
                stateParams,
                url,
                search,
                save,
                authService,
                url.supplier,
                url.supplierQuery,
                excel);
            if (this.stateParams["id"]) {
                this.loadSupplierProductHistory();
            }
        }
        response: any;
        loadSupplierProductHistory(): void {
            var self = this;
            var successCallback = (response: SearchResponse): void => {
                self.response = response.data;
                console.log("response" + self.response);
                self.csvModels = [];
                for (let i = 0; i < self.response.histories.length; i++) {
                    self.totalUnitPrice += self.response.histories[i].unitPrice;
                    self.totalQuantity += self.response.histories[i].quantity;
                    self.totalPrice += self.response.histories[i].total;
                    self.csvModels.push(self.generateCsvModel(self.response.histories[i]));

                }
            };
            var errorCallback = (error: any): void => {
                console.log(error);
                alert("Error");
            };

            var searchRequest = new SearchRequest();
            searchRequest.parentId = this.stateParams["id"];
            searchRequest.page = -1;
            self.
                searchService.
                search(searchRequest, self.url.purchaseQuery + "/ProductHistory").
                then(<any>successCallback, errorCallback);
        }
    }
    angular.module("app").controller("SupplierProductHistoryController", SupplierProductHistoryController);

    export class SupplierProductDueController extends BaseController<SupplierProduct>{
        supplierId: string;
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
            super(location, $state, $stateParams, url, searchService, saveService, auth, url.supplierProduct, url.supplierProductQuery, excel);
            if (this.stateParams["id"]) {
                this.supplierId = this.stateParams["id"];
                this.searchRequest.isIncludeParents = true;
                this.searchRequest.parentId = this.supplierId;
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
                let purchase = accountHeads.filter(x => x.text === "Purchase")[0] as any;
                if (purchase != null) {
                    this.transaction.accountHeadId = purchase.id;
                    this.transaction.accountHeadName = purchase.text;
                }
            }

            var accountRequest = new SearchRequest();
            self.searchService.search(accountRequest, self.url.accountHeadQuery + "/Dropdown")
                .then(accountSuccess, error);
        }

        accountInfos: any[];
        loadAccountInfos(): void {

            var self = this;
            var success = (response: any): void => {
                console.log(response);
                self.accountInfos = response.Models;
            };
            var error = (error: any): void => {
                console.log(error);
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
        
        save(): void {
            var self = this;
            console.log("update model-" + self.models);
            var successCallback = (response: any): void => {
                console.log(response);
                self.back();
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };

            let supplierProductTransactions: SupplierProductTransaction[] = [];
            let val = 0;
            for (let i = 0; i < self.models.length; i++) {
                let m: SupplierProductTransaction = new SupplierProductTransaction();
                m.amount = self.models[i].newlyPaid;
                m.supplierProductId = self.models[i].id;
                supplierProductTransactions.push(m);
                val += supplierProductTransactions[i].amount;

            }
            if (val !== self.transaction.amount) {
                alert('Transaction amount and product breakdown amount is not equal. returning');
                return;
            }

            let updateModel = new SupplierProductDetailUpdateModel();
            updateModel.supplierId = self.supplierId;
            updateModel.supplierProductTransactions = supplierProductTransactions;
            updateModel.transaction = self.transaction;

            self.saveService.update(updateModel, self.commandUrl + "/UpdateDues")
                .then(<any>successCallback, errorCallback);
        }
    }
    angular.module("app").controller("SupplierProductDueController", SupplierProductDueController);
}