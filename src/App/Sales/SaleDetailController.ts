
module App {
    "use strict";

    export class SaleDetailController extends BaseController<SaleViewModel> {

        parent: Purchase;
        products: ProductCategory[];
        product: ProductCategory;
        psid: string;
        purchaseCreator: string;
        purchaseTotal: number = 0;
        isDealerPrice: boolean;
        selectedProductRow: number;
        selectedPurchaseRow: number;
        productName: string;
        showNextState: boolean;
        deliverymans: any[];
        userNotes: string;
        static $inject: string[] =
            [
                "$location", "$state", "$stateParams",
                "UrlService", "SearchService", "SaveService", "AuthService", "$uibModal", 'Excel'
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
            super(location,
                state,
                stateParams,
                url,
                search,
                save,
                authService,
                url.sale,
                url.saleQuery,
                excel
            );
            if (this.stateParams["id"]) {
                if (authService.accountInfo.role !== 'Deliveryman') {
                    this.loadDeliverymans();
                }
                this.loadDetail();
            } else {
                this.back();
            }


        }

        loadDetail(): void {
            console.log(this.stateParams);
            var self = this;
            var successCallback = (response: SearchResponse): void => {
                self.model = response.data;
                self.showNextState = self.model.nextState != null;
               
                if (self.showNextState) {
                    self.userNotes = self.model.remarks;
                    self.model.remarks = '';
                }                
                if (self.model.installmentId) {
                    self.loadInstallments(self.model.installmentId);
                   
                }
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            var searchRequest = new SearchRequest();
            searchRequest.id = this.stateParams["id"];
            searchRequest.page = -1;

            var id = this.stateParams["id"];

            var httpUrl = self.url.saleQuery + "/Detail?id=" + id;

            self.searchService
                .search(searchRequest, httpUrl)
                .then(<any>successCallback, errorCallback);
        }

        loadDeliverymans(): void {

            var self = this;
            var successCallback = (response: SearchResponse): void => {
                self.deliverymans = response.Models;
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            var searchRequest = new SearchRequest();
            searchRequest["role"] = "DeliveryMan";

            var httpUrl = self.url.employee + "Query" + "/Search";

            self.searchService
                .search(searchRequest, httpUrl)
                .then(<any>successCallback, errorCallback);
        }

        deliverymanChanged(d: any): void {
            var self = this;
            self.model.deliverymanName = d.userName;
            self.model.deliverymanId = d.id;
        }

        nextState(): void {
            var self = this;
            var successCallback = (response: BaseResponse): void => {
                self.loadDetail();
            };
            var errorCallback = (error: any): void => {
                console.log(error);
                if (error.status === 500) {
                    alert(error.data.exceptionMessage);
                } else {
                    alert("Error Occurred. Please contact with Administrator");
                }
            };

            self.model.customer = null;
            self.model.transactions = null;

            self.saveService.update(self.model, self.url.sale + "/NextState").then(successCallback, errorCallback);
        }

        receiptView(): void {
            var self = this;
            self.stateService.go("root.receipt", { receipt: self.model });
        }

        loadInstallments(installmentId: string): void {
            var self = this;
            var searchRequest = new SearchRequest();
            var success = (response: any): void => {
                self.model.installment = response.data;                
                console.log(self.model.installment);
            };
             
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            searchRequest.id = installmentId;
            searchRequest.page = -1;
            var url = self.url.installmentQuery + '/SearchDetail';
            self.searchService.search(searchRequest, url).then(success, errorCallback);
        }

        installmentPay(p: any): void {
            console.log(p);
        }
    }

    angular.module("app").controller("SaleDetailController", SaleDetailController);


    export class ReceiptController extends BaseController<SaleViewModel> {

        today: Date;
        url: UrlService;
        totalQuantity: number = 0;
        discountTotal: number = 0;
        salePricePerUnitTotal = 0;
        isDivShow: boolean;

        static $inject: string[] =
            [
                "$location", "$state", "$stateParams",
                "UrlService", "SearchService", "SaveService", "AuthService", "$uibModal", 'Excel'
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
            super(location,
                state,
                stateParams,
                url,
                search,
                save,
                authService,
                url.sale,
                url.saleQuery,
                excel
            );
            if (this.stateParams["id"]) {
                this.loadDetail();
                this.today = new Date();
            } else {
                this.back();
            }
            this.url = url;
            this.isDivShow = false;

            
        }

        loadDetail(): void {
            console.log(this.stateParams);
            var self = this;
            var successCallback = (response: SearchResponse): void => {
                self.model = response.data;
                console.log(self.model);
                for (var i = 0; i < self.model.saleDetails.length; i++) {
                    self.totalQuantity += self.model.saleDetails[i].quantity;
                    self.discountTotal += self.model.saleDetails[i].discountTotal;
                    self.salePricePerUnitTotal += self.model.saleDetails[i].salePricePerUnit;
                }
                if (this.discountTotal > 0) {
                    this.isDivShow = true;
                }
            };
            
            var errorCallback = (error: any): void => {
                console.log(error);
            };

            var searchRequest = new SearchRequest();
            searchRequest.id = this.stateParams["id"];
            searchRequest.page = -1;

            var id = this.stateParams["id"].toString();

            var httpUrl = self.url.saleQuery + "/Receipt?id=" + id;

            self.searchService.search(null, httpUrl).then(<any>successCallback, errorCallback);
        }

        ok(): void {
            window.print();
        }
    }

    angular.module("app").controller("ReceiptController", ReceiptController);

    export class Receipt2Controller extends BaseController<SaleViewModel>{

        today: Date;
        url: UrlService;
        totalQuantity: number = 0;

        static $inject: string[] =
            [
                "$location", "$state", "$stateParams",
                "UrlService", "SearchService", "SaveService", "AuthService", "$uibModal", 'Excel'
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
            super(location,
                state,
                stateParams,
                url,
                search,
                save,
                authService,
                url.sale,
                url.saleQuery,
                excel
            );
            if (this.stateParams["id"]) {
                this.loadDetail();
                this.today = new Date();
            } else {
                this.back();
            }
            this.url = url;
        }

        loadDetail(): void {
            console.log(this.stateParams);
            var self = this;
            var successCallback = (response: SearchResponse): void => {
                self.model = response.data;
                for (var i = 0; i < self.model.saleDetails.length; i++) {
                    self.totalQuantity += self.model.saleDetails[i].quantity;
                }

            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            var searchRequest = new SearchRequest();
            searchRequest.id = this.stateParams["id"];
            searchRequest.page = -1;

            var id = this.stateParams["id"].toString();

            var httpUrl = self.url.saleQuery + "/Receipt?id=" + id;

            self.searchService.search(null, httpUrl).then(<any>successCallback, errorCallback);
        }

        ok(): void {
            window.print();
        }
    }
    angular.module("app").controller("Receipt2Controller", Receipt2Controller);

    export class Receipt3Controller extends BaseController<SaleViewModel>{

        today: Date;
        url: UrlService;
        totalQuantity: number = 0;

        static $inject: string[] =
            [
                "$location", "$state", "$stateParams",
                "UrlService", "SearchService", "SaveService", "AuthService", "$uibModal", 'Excel'
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
            super(location,
                state,
                stateParams,
                url,
                search,
                save,
                authService,
                url.sale,
                url.saleQuery,
                excel
            );
            if (this.stateParams["id"]) {
                this.loadDetail();
                this.today = new Date();
            } else {
                this.back();
            }
            this.url = url;
        }

        loadDetail(): void {
            console.log(this.stateParams);
            var self = this;
            var successCallback = (response: SearchResponse): void => {
                console.log(response);
                self.model = response.data;
                for (var i = 0; i < self.model.saleDetails.length; i++) {
                    self.totalQuantity += self.model.saleDetails[i].quantity;
                }

            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            var searchRequest = new SearchRequest();
            searchRequest.id = this.stateParams["id"];
            searchRequest.page = -1;

            var id = this.stateParams["id"].toString();

            var httpUrl = self.url.saleQuery + "/Receipt?id=" + id;

            self.searchService.search(null, httpUrl).then(<any>successCallback, errorCallback);
        }

        ok(): void {
            window.print();
        }

        print(id: string) {
            if (id == null) {
                id = "receipt";
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
    angular.module("app").controller("Receipt3Controller", Receipt3Controller);

    export class SaleReturnController extends BaseController<SaleViewModel> {

        //transaction: Transaction;
        due: number;
        saleDetail: SaleDetailViewModel;
        productDetailSearchRequest: SearchRequest;
        productDetailsCount: number;
        productDetails: ProductDetail[];

        static $inject: string[] =
            [
                "$location", "$state", "$stateParams",
                "UrlService", "SearchService", "SaveService", "AuthService", "$uibModal", 'Excel'
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
            super(location,
                state,
                stateParams,
                url,
                search,
                save,
                authService,
                url.sale,
                url.saleQuery,
                excel
            );
            if (this.stateParams["id"]) {
                this.saleDetail = new SaleDetailViewModel();
                this.productDetailSearchRequest = new SearchRequest();
                this.loadDetail();
            } else {
                this.back();
            }

            this.loadWarehouses().then(warehouses => {
                //this.model.warehouseId = warehouses[0].id;
            });
        }
        saleDetailTypes: string[] = ["Sale", "Damage", "Gift", "Return"];
        loadDetail(): void {
            console.log(this.stateParams);
            var self = this;
            var successCallback = (response: SearchResponse): void => {
                self.model = response.data;
                console.log(this.model);
                self.due = self.model.dueAmount;
                self.model.transactions = [];
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            var searchRequest = new SearchRequest();
            searchRequest.id = this.stateParams["id"];
            searchRequest.page = -1;

            var id = this.stateParams["id"];

            var httpUrl = self.url.saleQuery + "/Detail?id=" + id;

            self.searchService
                .search(searchRequest, httpUrl)
                .then(<any>successCallback, errorCallback);

            self.due = 0;
        }


        loadProductDetails(): void {
            var self = this;

            if (self.productDetailSearchRequest.keyword.length < 3) {
                return;
            }

            var successCallback = (response: SearchResponse): void => {
                console.log('products ', response);
                self.productDetails = <any>response.Models;
                self.productDetailsCount = response.Count;
                // self.productDetailSearchRequest.keyword = "";
                if (self.productDetailsCount === 1) {
                    //    this.addToCart2(self.productDetails[0]);
                }
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };

            self.productDetailSearchRequest["isProductActive"] = true;
            // self.productDetailSearchRequest.page = -1;
            self.searchService
                .search(self.productDetailSearchRequest, self.url.productDetailQuery + "/Search")
                .then(<any>successCallback, errorCallback);
        }

        getPriceAndName(): void {
            this.saleDetail.total = this.saleDetail.quantity * this.saleDetail.salePricePerUnit;
        }

        setProductDetail(detail: ProductDetail): void {
            this.saleDetail.salePricePerUnit = detail.salePrice;
            this.saleDetail.productDetailId = detail.id;
            this.saleDetail.name = detail.name;
            this.saleDetail.productDetail = detail;
            this.saleDetail.productDetailName = detail.name;
            this.saleDetail.quantity = 1;
            this.getPriceAndName();
        }

        addToCart(): void {
            this.model.saleDetails.push(this.saleDetail);
            this.updateCartTotal();
            this.saleDetail = new SaleDetailViewModel();
        }

        addToCart2(detail: ProductDetail): void {
            let exists = this.model.saleDetails.some(x => x.productDetailId === detail.id);
            if (exists) {
                alert('Item : ' + detail.name + " is already added in cart.");
                return;
            }
            this.setProductDetail(detail);
            this.addToCart();
        }

        decreaseFromCart(index): void {
            //this.model.saleDetails.splice(index, 1);
            let salePrice = this.model.saleDetails[index].salePricePerUnit;
            let quantity = this.model.saleDetails[index].quantity - 1;          
            this.model.saleDetails[index].quantity = quantity;
            this.model.saleDetails[index].total = salePrice * quantity;

            this.updateCartTotal();
        }

        //updateQuantity(index): void {
        //    let salePrice = this.model.saleDetails[index].salePricePerUnit;
        //    let quantity = this.model.saleDetails[index].quantity;
        //    this.model.saleDetails[index].quantity = quantity;
        //    this.model.saleDetails[index].total = salePrice * quantity;
        //    this.updateCartTotal();
        //}
        updateQuantity(index): void {
            let salePrice = this.model.saleDetails[index].salePricePerUnit;
            let quantity = this.model.saleDetails[index].quantity;
            this.model.saleDetails[index].quantity = quantity;
            this.model.saleDetails[index].total = salePrice * quantity;
            this.updateCartTotal();
        }

        updateQuantityAll(): void {
            for (let i = 0; i < this.model.saleDetails.length; i++) {
                this.updateQuantity(i);
            }
        }

        updateRemarks(index): void {
            let salePrice = this.model.saleDetails[index].salePricePerUnit;
            let remarks = this.model.saleDetails[index].remarks;
            this.model.saleDetails[index].remarks = remarks;
          
            this.updateCartTotal();

        }

        updateRemarksAll(): void {

            for (let i = 0; i < this.model.saleDetails.length; i++) {
                this.updateRemarks(i);
            }
        }

        increaseToCart(index): void {
            let salePrice = this.model.saleDetails[index].salePricePerUnit;
            let quantity = this.model.saleDetails[index].quantity + 1;         
            this.model.saleDetails[index].quantity = quantity;
            this.model.saleDetails[index].total = salePrice * quantity;          
            this.updateCartTotal();
        }

        removeFromCart(index): void {
            this.model.saleDetails.splice(index, 1);
            this.updateCartTotal();
        }

        updateCartTotal(): void {
            var self = this;
            self.due = 0;
            //self.transaction.amount = 0;
            self.model.productAmount = 0;
            self.model.saleDetails.forEach(p => this.model.productAmount += p.total);
            self.model.totalAmount = self.model.productAmount + self.model.otherAmount +
                self.model.deliveryChargeAmount +
                self.model.paymentServiceChargeAmount;
            self.model.payableTotalAmount = self.model.totalAmount - self.model.discountAmount;
            self.updateTransactions();
        }

        applyShippingAmount(): void {
            var self = this;
            self.updateCartTotal();
            //self.model.totalAmount = self.model.productAmount + self.model.deliveryChargeAmount;
            //self.model.payableTotalAmount = self.model.totalAmount;
            //self.updateTransactions();
        }
        private updateTransactions(): void {
            var self = this;
            self.model.dueAmount = self.model.payableTotalAmount - self.model.paidAmount;
            self.updateDue();
        }

        updateDue(): void {
            var self = this;
            self.due = self.model.dueAmount;
        }

        save(): void {
            var self = this;
            self.model.customer = null;
            self.model.transactions = [];
            // self.model.transactions.push(self.transaction);
            console.log(this.model);

            var successCallback = (response: BaseResponse): void => {
                console.log(response);
                self.back();
            };

            var errorCallback = (error: any): void => {
                console.log(error);
                if (error.status === 500) {
                    alert(error.data.exceptionMessage);
                } else {
                    alert("Error occurred");
                }
            };

            for (let i = 0; i < self.model.saleDetails.length; i++) {
                self.model.saleDetails[i].productDetail = null;
            }

            self.model.transactions = [];
            self.model.address = null;

            this.saveService.update(self.model, self.commandUrl + "/Return")
                .then(<any>successCallback, errorCallback);
        }
    }

    angular.module("app").controller("SaleReturnController", SaleReturnController);


    export class SaleReturn2Controller extends BaseController<SaleViewModel> {

        //transaction: Transaction;
        due: number;
        saleDetail: SaleDetailViewModel;
        productDetailSearchRequest: SearchRequest;
        productDetailsCount: number;
        productDetails: ProductDetail[];

        static $inject: string[] =
            [
                "$location", "$state", "$stateParams",
                "UrlService", "SearchService", "SaveService", "AuthService", "$uibModal", 'Excel'
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
            super(location,
                state,
                stateParams,
                url,
                search,
                save,
                authService,
                url.sale,
                url.saleQuery,
                excel
            );
            if (this.stateParams["id"]) {
                this.saleDetail = new SaleDetailViewModel();
                this.loadDetail();
            } else {
                this.back();
            }

            this.loadWarehouses().then(warehouses => {
                //this.model.warehouseId = warehouses[0].id;
            });
        }
        // saleDetailTypes: string[] = ["Damage", "Return"];
        loadDetail(): void {
            console.log(this.stateParams);
            var self = this;
            var successCallback = (response: SearchResponse): void => {
                self.model = response.data;
                self.model.productAmount = 0;
                for(let i = 0; i< self.model.saleDetails.length; i++){
                    self.model.saleDetails[i].quantity = 0;
                    self.model.saleDetails[i].total = 0;
                }
                self.due = self.model.dueAmount;
                self.model.transactions = [];
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            var searchRequest = new SearchRequest();
            searchRequest.id = this.stateParams["id"];
            searchRequest.page = -1;

            var id = this.stateParams["id"];

            var httpUrl = self.url.saleQuery + "/Detail?id=" + id;

            self.searchService
                .search(searchRequest, httpUrl)
                .then(<any>successCallback, errorCallback);

            self.due = 0;
        }


        decreaseFromCart(index): void {
            //this.model.saleDetails.splice(index, 1);
            let salePrice = this.model.saleDetails[index].salePricePerUnit;
            let quantity = this.model.saleDetails[index].quantity - 1;
            this.model.saleDetails[index].quantity = quantity;
            this.model.saleDetails[index].total = salePrice * quantity;

            this.updateCartTotal();
        }

        updateQuantity(index): void {
            let salePrice = this.model.saleDetails[index].salePricePerUnit;
            let quantity = this.model.saleDetails[index].quantity;
            this.model.saleDetails[index].quantity = quantity;
            this.model.saleDetails[index].total = salePrice * quantity;
            this.updateCartTotal();
        }

        updateQuantityAll(): void {
            for (let i = 0; i < this.model.saleDetails.length; i++) {
                this.updateQuantity(i);
            }
        }

        updateRemarks(index): void {
            let salePrice = this.model.saleDetails[index].salePricePerUnit;
            let remarks = this.model.saleDetails[index].remarks;
            this.model.saleDetails[index].remarks = remarks;
            this.updateCartTotal();
        }

        updateRemarksAll(): void {
            for (let i = 0; i < this.model.saleDetails.length; i++) {
                this.updateRemarks(i);
            }
        }

        increaseToCart(index): void {
            let salePrice = this.model.saleDetails[index].salePricePerUnit;
            let quantity = this.model.saleDetails[index].quantity + 1;
            this.model.saleDetails[index].quantity = quantity;
            this.model.saleDetails[index].total = salePrice * quantity;
            this.updateCartTotal();
        }

        updateCartTotal(): void {
            var self = this;
            
            self.model.productAmount = 0;
            self.model.saleDetails.forEach(p => this.model.productAmount += p.total);
           
        }

        save(): void {
            var self = this;
            console.log(this.model);

            var successCallback = (response: BaseResponse): void => {
                console.log(response);
                self.back();
            };

            var errorCallback = (error: any): void => {
                console.log(error);
                if (error.status === 500) {
                    alert(error.data.exceptionMessage);
                } else {
                    alert("Error occurred");
                }

            };

            for (let i = 0; i < self.model.saleDetails.length; i++) {
                self.model.saleDetails[i].productDetail = null;
                self.model.saleDetails[i].quantity = 0 - self.model.saleDetails[i].quantity;
                self.model.saleDetails[i].total = 0 - self.model.saleDetails[i].total;
               
            }

            this.saveService.update(self.model, self.commandUrl + "/Return2")
                .then(<any>successCallback, errorCallback);
        }
    }

    angular.module("app").controller("SaleReturn2Controller", SaleReturn2Controller);

    export class SaleTransactionController extends BaseController<SaleViewModel> {

        showNextState: boolean;
        userNotes: string;
        selectedAccountInfo: any;
        transactionFors: string[];
        transactionWiths: string[];
        transactionMediums: string[];
        paymentGatewayServices: string[];
        transactionFlowTypes: string[];
        accountHeads: any[];
        accountInfoTypes: any[];
        accountInfoType: any;
        paymentGatewayService: any;
        transaction: Transaction;
        transactionDate : Date;

        static $inject: string[] =
            [
                "$location", "$state", "$stateParams",
                "UrlService", "SearchService", "SaveService", "AuthService", "$uibModal", 'Excel'
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
            super(location,
                state,
                stateParams,
                url,
                search,
                save,
                authService,
                url.sale,
                url.saleQuery,
                excel
            );
            if (this.stateParams["id"]) {
                this.transaction = new Transaction();
                this.loadDetail();
                this.setupDropdowns();
                this.selectedAccountInfo = new AccountInfo();
                this.loadAccountInfos();

            } else {
                this.back();
            }
        }



        loadDetail(): void {
            console.log(this.stateParams);
            var self = this;
            var successCallback = (response: SearchResponse): void => {
                self.model = response.data;
                self.showNextState = self.model.nextState != null;
                if (self.showNextState) {
                    self.userNotes = self.model.remarks;
                    self.model.remarks = '';
                }

                console.log(this.model);
                self.transaction.amount = self.model.dueAmount;
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            var searchRequest = new SearchRequest();
            searchRequest.id = this.stateParams["id"];
            searchRequest.page = -1;

            var id = this.stateParams["id"];

            var httpUrl = self.url.saleQuery + "/Detail?id=" + id;
            // var httpUrl = self.url.saleQuery + "/SearchDetail";

            self.searchService
                .search(searchRequest, httpUrl)
                .then(<any>successCallback, errorCallback);

            //self.searchService.search(searchRequest, httpUrl).then(successCallback, errorCallback);
        }


        setupDropdowns(): void {
            var self = this;

            var success = (response: any) => {
                console.log(response);
                self.transactionMediums = response.transactionMediums;
                //self.paymentGatewayServices = response.paymentGatewayServices;
                //self.accountInfoTypes = response.accountInfoTypes;
                //self.transactionFors = response.transactionFors;
                //self.transactionWiths = response.transactionWiths;
                //self.transactionFlowTypes = response.transactionFlowTypes;
                //self.transaction = new Transaction();
                self.transaction.transactionMedium = "Cash";
                //self.transaction.paymentGatewayService = "Cash";
                self.transaction.paymentGatewayServiceName = "Cash";
                //self.transaction.accountInfoType = "Cash";
                //self.accountInfoType = "Cash";
                //self.paymentGatewayService = "Cash";
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
                    self.transaction.accountHeadId = sale.id;
                    self.transaction.accountHeadName = sale.text;
                }
            }

            var accountRequest = new SearchRequest();
            self.searchService.search(accountRequest, self.url.accountHeadQuery + "/Dropdown")
                .then(accountSuccess, error);
        }


        save(): void {
            var self = this;
            console.log(self.transaction);
            self.transaction.orderId = self.model.id;
            self.transaction.orderNumber = self.model.orderNumber;
            self.transaction.paymentGatewayServiceName = self.transaction.accountInfoTitle;
            self.transaction.transactionMediumName = self.transaction.transactionMedium;
            if (self.model.isDealerSale) {
                self.transaction.parentId = self.model.dealerId;
            } else {
                self.transaction.parentId = self.model.customerId;
            }

            self.transaction.transactionWith = "Customer";
            self.transaction.transactionFor = "Sale";
            self.transaction.transactionFlowType = "Income";

            self.transaction.transactionDate = self.transactionDate.toDateString();

            self.saveService.save(self.transaction, self.url.transaction + "/Add")
                .then((s) => {
                    //self.stateService.go('root.sales');
                    self.back();
                },
                (e) => {
                    alert('error occurred');
                    console.log(e);
                });
        }

        accountInfos: any[];
        loadAccountInfos(): void {
            var self = this;
            var success = (response: any): void => {
                self.accountInfos = response.Models;
                if (self.accountInfos.length > 0) {
                    for (let i = 0; i < self.accountInfos.length; i++) {
                        if (self.accountInfos[i].text === "Cash") {
                            self.selectedAccountInfo = self.accountInfos[i];
                            self.transaction.accountInfoId = self.selectedAccountInfo.id;
                            self.transaction.accountInfoTitle = self.selectedAccountInfo.text;
                            break;
                        }
                    }
                }
            };
            var error = (error: any): void => {
                Display.log(error);
            }
            self.searchService.search(self.searchRequest, self.url.accountInfoQuery + "/Dropdown")
                .then(<any>success, error);

        }

        accountInfoChanged(): void {
            this.transaction.accountInfoTitle = this.selectedAccountInfo["text"];
            this.transaction.accountInfoId = this.selectedAccountInfo.id;
        }
    }

    angular.module("app").controller("SaleTransactionController", SaleTransactionController);

    export class SaleInstallmentTransactionController extends BaseController<SaleViewModel> {

        showNextState: boolean;
        userNotes: string;
        selectedAccountInfo: any;
        transactionFors: string[];
        transactionWiths: string[];
        transactionMediums: string[];
        paymentGatewayServices: string[];
        transactionFlowTypes: string[];
        accountHeads: any[];
        accountInfoTypes: any[];
        accountInfoType: any;
        paymentGatewayService: any;
        transaction: Transaction;
        transactionDate: Date;
        static $inject: string[] =
            [
                "$location", "$state", "$stateParams",
                "UrlService", "SearchService", "SaveService", "AuthService", "$uibModal", 'Excel'
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
            super(location,
                state,
                stateParams,
                url,
                search,
                save,
                authService,
                url.sale,
                url.saleQuery,
                excel
            );
            if (this.stateParams["id"]) {
                this.transaction = new Transaction();
                console.log('i m in SaleInstallmentTransactionController and id is ' + this.stateParams['id']);

                this.loadDetail();
                this.setupDropdowns();
                this.selectedAccountInfo = new AccountInfo();
                this.loadAccountInfos();

            } else {
                this.back();
            }
        }



        loadDetail(): void {
            console.log(this.stateParams);
            var self = this;
            var successCallback = (response: SearchResponse): void => {
                self.model = response.data;
                console.log(self.model);                
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            var searchRequest = new SearchRequest();
            searchRequest.id = this.stateParams["id"];
            searchRequest.page = -1;

            var id = this.stateParams["id"];

            var httpUrl = self.url.saleQuery + "/Detail?id=" + id;
            // var httpUrl = self.url.saleQuery + "/SearchDetail";

            self.searchService
                .search(searchRequest, httpUrl)
                .then(<any>successCallback, errorCallback);

            //self.searchService.search(searchRequest, httpUrl).then(successCallback, errorCallback);
        }


        setupDropdowns(): void {
            var self = this;

            var success = (response: any) => {
                console.log(response);
                self.transactionMediums = response.transactionMediums;
                self.transaction.transactionMedium = "Cash";
                self.transaction.transactionMediumName = "Cash";
                self.transaction.paymentGatewayServiceName = "Cash";                
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
                    self.transaction.accountHeadId = sale.id;
                    self.transaction.accountHeadName = sale.text;
                }
            }

            var accountRequest = new SearchRequest();
            self.searchService.search(accountRequest, self.url.accountHeadQuery + "/Dropdown")
                .then(accountSuccess, error);
        }


        save(): void {
            var self = this;
            console.log(self.transaction);
            self.transaction.orderId = self.model.id;
            self.transaction.transactionFor = "Sale";
            self.transaction.transactionFlowType = "Income";

            self.transaction.transactionDate = self.transactionDate.toDateString();
            self.saveService.save(self.transaction, self.url.transaction + "/Add")
                .then((s) => {
                    //self.stateService.go('root.sales');
                    self.back();
                },
                (e) => {
                    alert('error occurred');
                    console.log(e);
                });
        }

        accountInfos: any[];
        loadAccountInfos(): void {
            var self = this;
            var success = (response: any): void => {
                self.accountInfos = response.Models;
                if (self.accountInfos.length > 0) {
                    for (let i = 0; i < self.accountInfos.length; i++) {
                        if (self.accountInfos[i].text === "Cash") {
                            self.selectedAccountInfo = self.accountInfos[i];
                            self.transaction.accountInfoId = self.selectedAccountInfo.id;
                            self.transaction.accountInfoTitle = self.selectedAccountInfo.text;
                            break;
                        }
                    }
                }
            };
            var error = (error: any): void => {
                Display.log(error);
            }
            self.searchService.search(self.searchRequest, self.url.accountInfoQuery + "/Dropdown")
                .then(<any>success, error);

        }

        accountInfoChanged(): void {
            this.transaction.accountInfoTitle = this.selectedAccountInfo["text"];
            this.transaction.accountInfoId = this.selectedAccountInfo.id;
        }
    }

    angular.module('app').controller('SaleInstallmentTransactionController', SaleInstallmentTransactionController);

    export class SaleInstallmentDetailController extends BaseController<InstallmentDetail>{

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
            super(location, state, stateParams, url, search, save, authService, "", url.installmentDetailQuery, excel);
            this.search();
        }
    }

    angular.module("app").controller("SaleInstallmentDetailController", SaleInstallmentDetailController);

    export class SaleTransactionEditController extends BaseController<Transaction> {

        transactionMediums: string[];
        paymentGatewayServices: string[];
        //transaction: Transaction;
        accountInfoTypes: any[];
        accountInfoType: any;
        selectedAccountInfo: AccountInfo;

        static $inject: string[] =
            [
                "$location", "$state", "$stateParams",
                "UrlService", "SearchService", "SaveService", "AuthService", "$uibModal", 'Excel'
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
            super(location,
                state,
                stateParams,
                url,
                search,
                save,
                authService,
                url.transaction,
                url.transactionQuery,
                excel
            );
            if (this.stateParams["id"]) {          
                this.editWithCallBack(this.stateParams["id"], this.callBack);
            } else {
                this.back();
            }
        }

        setupDropdowns(): void {
            var self = this;

            var success = (response: any) => {
                console.log(response);
                self.transactionMediums = response.transactionMediums;
                self.paymentGatewayServices = response.paymentGatewayServices;

                //self.transaction.transactionMedium = self.transaction.transactionMediumName;
                //self.transaction.paymentGatewayService = "Cash";
                //self.transaction.paymentGatewayServiceName = "Cash";
            };

            var error = error => {
                console.log(error);
            };

            self.searchService.get(self.url.transactionQuery + "/Dropdowns").then(success, error);
        }

        callBack(data: any, self: any): void {
            self.setupDropdowns();
            self.selectedAccountInfo = new AccountInfo();
            self.loadAccountInfos(self);
        }

        accountInfos: any[];
        loadAccountInfos(self): void {
            //var self = this;
            var success = (response: any): void => {
                Display.log(response);
                self.accountInfos = response.Models;
                for (let i = 0; i < self.accountInfos.length; i++) {
                    if (self.accountInfos[i].id === self.model.accountInfoId) {
                        self.selectedAccountInfo = self.accountInfos[i];
                    }
                }
            };
            var error = (error: any): void => {
                Display.log(error);
            }
            self.searchService.search(self.searchRequest, self.url.accountInfoQuery + "/Dropdown")
                .then(<any>success, error);

        }

        accountInfoChanged(): void {
            var self = this;
            self.model.accountInfoTitle = self.selectedAccountInfo["text"];
            self.model.accountInfoId = self.selectedAccountInfo.id;
        }
    }

    angular.module("app").controller("SaleTransactionEditController", SaleTransactionEditController);

    export class DealerSaleTransactionController extends BaseController<SaleViewModel> {
        static $inject: string[] =
            [
                "$location", "$state", "$stateParams",
                "UrlService", "SearchService", "SaveService", "AuthService", "$uibModal", 'Excel'
            ];
        showNextState: boolean;
        userNotes: string;


        transactionMediums: string[];
        paymentGatewayServices: string[];
        transaction: Transaction;
        accountInfoTypes: any[];
        accountInfoType: any;
        selectedAccountInfo: AccountInfo;
        transactionDate: Date;

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
                url.sale,
                url.saleQuery,
                excel
            );
            if (this.stateParams["id"]) {
                this.transaction = new Transaction();
                this.loadDetail();
                this.setupDropdowns();
                this.selectedAccountInfo = new AccountInfo();
                this.loadAccountInfos();

            } else {
                this.back();
            }
        }
        loadDetail(): void {
            console.log(this.stateParams);
            var self = this;
            var successCallback = (response: SearchResponse): void => {
                self.model = response.data;
                self.showNextState = self.model.nextState != null;
                if (self.showNextState) {
                    self.userNotes = self.model.remarks;
                    self.model.remarks = '';
                }

                console.log(this.model);
                self.transaction.amount = self.model.dueAmount;
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            var searchRequest = new SearchRequest();
            searchRequest.id = this.stateParams["id"];
            searchRequest.page = -1;
            searchRequest["IsDealerSale"] = true;

            var id = this.stateParams["id"];
            var httpUrl = self.url.saleQuery + "/Detail?id=" + id;
            self.searchService
                .search(searchRequest, httpUrl)
                .then(<any>successCallback, errorCallback);
        }
        activateDealerSale(): void {
            var self = this;
            self.model.isDealerSale = true;
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
            console.log(this.transaction);
            var self = this;
            self.transaction.orderId = self.model.id;
            self.transaction.orderNumber = self.model.orderNumber;
            self.transaction.paymentGatewayServiceName = self.transaction.paymentGatewayServiceName;
            self.transaction.transactionMediumName = self.transaction.transactionMedium;
            if (self.model.isDealerSale) {
                self.transaction.parentId = self.model.dealerId;
            } else {
                self.transaction.parentId = self.model.customerId;
            }

            self.transaction.transactionFor = "Sale";
            self.transaction.transactionFlowType = "Income";

            self.transaction.transactionDate = self.transactionDate.toDateString();
            self.saveService.save(self.transaction, self.url.transaction + "/Add")
                .then((s) => {
                    self.back();
                },
                (e) => {
                    alert('error occurred');
                    console.log(e);
                });
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
        }

    }

    angular.module("app").controller("DealerSaleTransactionController", DealerSaleTransactionController);

    export class DealerSaleTransactionEditController extends BaseController<Transaction> {

        transactionMediums: string[];
        paymentGatewayServices: string[];
        transaction: Transaction;
        accountInfoTypes: any[];
        accountInfoType: any;
        selectedAccountInfo: AccountInfo;

        static $inject: string[] =
            [
                "$location", "$state", "$stateParams",
                "UrlService", "SearchService", "SaveService", "AuthService", "$uibModal", 'Excel'
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
            super(location,
                state,
                stateParams,
                url,
                search,
                save,
                authService,
                url.transaction,
                url.transactionQuery,
                excel
            );
            if (this.stateParams["id"]) {
                this.transaction = new Transaction();
                this.editWithCallBack(this.stateParams["id"], this.callBack);
                this.setupDropdowns();
                this.selectedAccountInfo = new AccountInfo();
                this.loadAccountInfos();

            } else {
                this.back();
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
                self.transaction.transactionFlowType = "Income";

            };

            var error = error => {
                console.log(error);
            };

            self.searchService.get(self.url.transactionQuery + "/Dropdowns").then(success, error);
        }

        callBack(data: any): void {
            console.log(data);
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
            //self.transaction.paymentGatewayServiceName = self.transaction.accountInfoTitle;
        }

        update(): void {
            var self = this;
            self.model.transactionFlowType = "Income";
            self.model.transactionFor = "Sale";
            super.update();
        }
    }

    angular.module("app").controller("DealerSaleTransactionEditController", DealerSaleTransactionEditController);


}