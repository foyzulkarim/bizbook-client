
module App {

    export class PurchaseDetailController extends BaseController<SaleViewModel>{

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
        PurchaseDetailViewModel: PurchaseDetailViewModel;

        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "$uibModal",'Excel'
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
            super(location, state, stateParams, url, search, save, authService, url.sale, url.purchaseQuery, excel);
            if (this.stateParams["id"]) {
                this.edit(this.stateParams["id"]);
            } else {
                this.back();
            }
        }

        loadDetail(): void {
            var self = this;
            var successCallback = (response: SearchResponse): void => {
                this.model = response.data;
                console.log(this.model);
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            var searchRequest = new SearchRequest();
            searchRequest.id = this.stateParams["id"];
            searchRequest.page = -1;

            var purchaseId = this.stateParams["id"];

            self.searchService
                .search(searchRequest, self.url.purchaseQuery + "/Detail?id=" + purchaseId)
                .then(<any>successCallback, errorCallback);
        }
    }

    angular.module("app").controller("PurchaseDetailController", PurchaseDetailController);

    export class PurchaseReturnController extends BaseController<PurchaseViewModel>{
        transaction: Transaction;
      
        due: number;
        purchaseDetail: PurchaseDetailViewModel;
        productDetailSearchRequest: SearchRequest;
        productDetailsCount: number;
        productDetails: ProductDetail[];
       


        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "$uibModal",'Excel'
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
            super(location, state, stateParams, url, search, save, authService, url.purchase, url.purchaseQuery, excel);
            if (this.stateParams["id"]) {
                this.purchaseDetail = new PurchaseDetailViewModel();
                this.productDetailSearchRequest = new SearchRequest();
                this.loadDetail();
                this.loadProductDetails();
            } else {
                this.back();
            }
        }

        loadDetail(): void {
            console.log(this.stateParams);
            var self = this;
            var successCallback = (response: SearchResponse): void => {
                self.model = response.data;
                
                console.log(this.model);
                self.due = self.model.dueAmount;
                self.transaction.orderId = self.model.id;
                self.transaction.orderNumber = self.model.orderNumber;
                self.transaction.accountHeadId = "a";
                self.transaction.parentId = "a";
                self.transaction.paymentGatewayService = "Cash";
                self.transaction.accountHeadName = "Purchase";
                self.transaction.paymentGatewayServiceName = "Cash";
                self.transaction.transactionMediumName = "Cash";
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            var searchRequest = new SearchRequest();
            searchRequest.id = this.stateParams["id"];
            searchRequest.page = -1;

            var id = this.stateParams["id"];

            var httpUrl = self.url.purchaseQuery + "/Detail?id=" + id;

            self.searchService
                .search(searchRequest, httpUrl)
                .then(<any>successCallback, errorCallback);

            self.transaction = new Transaction();
            self.transaction.amount = 0;
            self.transaction.transactionFlowType = "Expense";
            self.transaction.created = new Date().toDateString();
            self.transaction.modified = new Date().toDateString();
            self.transaction.shopId = "1";
            self.transaction.createdFrom = "Bizbook365";
            self.transaction.createdBy = "1";
            self.transaction.modifiedBy = "1";
            self.transaction.accountHeadId = "a";
            self.transaction.parentId = "a";
            self.transaction.paymentGatewayService = "Cash";
            self.transaction.accountHeadName = "Purchase";
            self.transaction.paymentGatewayServiceName = "Cash";
            self.transaction.transactionMediumName = "Cash";


            self.due = 0;
        }


        loadProductDetails(): void {
            var self = this;

            if (self.productDetailSearchRequest.keyword.length < 3) {
                return;
            }

            var successCallback = (response: SearchResponse): void => {
                console.log('products--- ', response);
                self.productDetails = <any>response.Models;
                self.productDetailsCount = response.Count;
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };


            self.searchService
                .search(self.productDetailSearchRequest, self.url.productDetailQuery + "/Search")
                .then(<any>successCallback, errorCallback);
        }

        addToCart2(detail: ProductDetail): void {
            this.setProductDetail(detail);
            this.addToCart();
        }
        addToCart(): void {
            
            this.model.purchaseDetails.push(this.purchaseDetail);
            console.log('purchaseDetails result--',this.model.purchaseDetails);
            this.updateCartTotal();
            this.purchaseDetail = new PurchaseDetailViewModel();
        }

        updateCartTotal(): void {
            var self = this;
            self.due = 0;
            self.transaction.amount = 0;
            self.model.productAmount = 0;
            self.model.purchaseDetails.forEach(p => this.model.productAmount += p.costTotal);
            self.model.totalAmount = self.model.productAmount - self.model.discountAmount;
            self.updateTransactions();

        }
        private updateTransactions(): void {
            var self = this;
            self.model.dueAmount = self.model.totalAmount - self.model.paidAmount;
            self.updateDue();
        }
        updateDue(): void {
            var self = this;
            //self.due = self.model.dueAmount + self.transaction.amount;
            self.due = self.model.dueAmount;
        }
        getPriceAndName(): void {

            this.purchaseDetail.costTotal = this.purchaseDetail.quantity * this.purchaseDetail.costPrice;

        }

        setProductDetail(detail: ProductDetail): void {
            this.purchaseDetail.costPricePerUnit = detail.costPrice;
            this.purchaseDetail.costPrice = detail.costPrice;
            this.purchaseDetail.productDetailId = detail.id;
            this.purchaseDetail.productDetailName = detail.name;
            this.purchaseDetail.productDetail = detail;
            this.purchaseDetail.quantity = 1;
            this.getPriceAndName();
            
        }

        updateQuantityAll(): void {
            for (let i = 0; i < this.model.purchaseDetails.length; i++) {
                this.updateQuantity(i);
            } 
        }

        updateQuantity(index): void {
            let costPrice = this.model.purchaseDetails[index].costPricePerUnit;
            let quantity = this.model.purchaseDetails[index].quantity;
            this.model.purchaseDetails[index].quantity = quantity;
            this.model.purchaseDetails[index].costPricePerUnit = costPrice;
            this.model.purchaseDetails[index].costTotal = costPrice * quantity;
            this.updateCartTotal();
        }


        increaseToCart(index): void {
            let costPrice = this.model.purchaseDetails[index].costPricePerUnit;
            let quantity = this.model.purchaseDetails[index].quantity + 1;
            this.model.purchaseDetails[index].quantity = quantity;
            this.model.purchaseDetails[index].costTotal = costPrice * quantity;
            this.updateCartTotal();
        }

        decreaseFromCart(index): void {
            let costPrice = this.model.purchaseDetails[index].costPricePerUnit;
            let quantity = this.model.purchaseDetails[index].quantity - 1;
            this.model.purchaseDetails[index].quantity = quantity;
            this.model.purchaseDetails[index].costTotal = costPrice * quantity;

            this.updateCartTotal();
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

            for (let i = 0; i < self.model.purchaseDetails.length; i++) {
                self.model.purchaseDetails[i].productDetail = null;
            }
            
            this.saveService.update(self.model, self.commandUrl + "/Return")
                .then(<any>successCallback, errorCallback);
        }

    }
    angular.module("app").controller("PurchaseReturnController", PurchaseReturnController);

    export class PurchaseTransactionController extends BaseController<PurchaseViewModel>{
        
        userNotes: string;
        transactionMediums: string[];
        paymentGatewayServices: string[];
        transaction: Transaction;
        accountInfoTypes: any[];
        accountInfoType: any;
        selectedAccountInfo: AccountInfo;
        transactionDate: Date;
        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "$uibModal",'Excel'
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
            super(location, state, stateParams, url, search, save, authService, url.purchase, url.purchaseQuery, excel);
            if (this.stateParams["id"]) {
                this.transaction = new Transaction();
                this.setupDropdowns();
                this.loadDetail();   
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
                console.log(this.model);
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            var searchRequest = new SearchRequest();
            searchRequest.id = this.stateParams["id"];
            searchRequest.page = -1;

            var id = this.stateParams["id"];

            var httpUrl = self.url.purchaseQuery + "/Detail?id=" + id;

            self.searchService
                .search(searchRequest, httpUrl)
                .then(<any>successCallback, errorCallback);
        }
        
        setupDropdowns(): void {
            var self = this;

            var success = (response: any) => {
                console.log(response);
                self.transactionMediums = response.transactionMediums;
                self.paymentGatewayServices = response.paymentGatewayServices; 
                self.accountInfoTypes = response.accountInfoTypes;
                self.transaction.transactionMedium = "Cash";
                self.transaction.paymentGatewayService = "Cash";
                self.accountInfoType = "Cash";
            };

            var error = error => {
                console.log(error);
            };

            self.searchService.get(self.url.transactionQuery + "/Dropdowns").then(success, error);


            var accountSuccess = function (response: SearchResponse) {
                console.log('account - ', response);
                var accountHeads: any[] = response.Models;
                let sale = accountHeads.filter(x => x.text === "Purchase")[0] as any;
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
            console.log(this.transaction);
            var self = this;
            self.transaction.orderId = self.model.id;
            self.transaction.orderNumber = self.model.orderNumber;
            self.transaction.paymentGatewayServiceName = self.transaction.paymentGatewayService;
            self.transaction.transactionMediumName = self.transaction.transactionMedium;
            self.transaction.parentId = self.model.supplierId;
            self.transaction.transactionFor = "Purchase";

            self.transaction.transactionDate = self.transactionDate.toDateString();
            self.saveService.save(self.transaction, self.url.transaction + "/Add")
                .then((s) => { self.stateService.go('root.purchases') },
                    (e) => {
                        alert('error occurred');
                        console.log(e)
                    });
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
            self.searchService.search(self.searchRequest, self.url.accountInfoQuery + "/Dropdown")
                .then(<any>success, error);

        }

        accountInfoChanged(): void {
            this.transaction.accountInfoTitle = this.selectedAccountInfo["text"];
            this.transaction.accountInfoId = this.selectedAccountInfo.id;
            this.transaction.paymentGatewayServiceName = this.transaction.accountInfoTitle;
        }
    }
    angular.module("app").controller("PurchaseTransactionController", PurchaseTransactionController);

}

