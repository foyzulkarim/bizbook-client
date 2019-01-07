module App {
    "use strict";

    export class PurchasesController extends BaseController<PurchaseViewModel> {

        totalPaid = 0;
        totalDue = 0;
        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService","LocalStorageService", 'Excel'
        ];
        headers = ["id", "totalAmount", "paidAmount", "modified"];

        constructor(location: angular.ILocationService,
            state: angular.ui.IStateService,
            stateParams: angular.ui.IStateParamsService,
            url: UrlService,
            search: SearchService,
            save: SaveService,
            authService: AuthService,
            localStorageService: LocalStorageService,
            excel: any

        ) {
            super(location, state, stateParams, url, search, save, authService, url.purchase, url.purchaseQuery, excel);
            this.localStorageService = localStorageService;
            this.supplierSearchRequest = new SearchRequest("", "Modified", "False", "");
            this.loadSuppliers();
            this.searchRequest.isIncludeParents = true;

            let page = this.localStorageService.get(LocalStorageKeys.SaleListPageNo);
            if (!page) {
                this.localStorageService.save(LocalStorageKeys.SaleListPageNo, 1);
                page = 1;
            }

            this.searchRequest.page = page;

            this.searchByWarehouse().then(result => { console.log('purchases searched by warehouse');});
        }

        suppliers: Supplier[];
        supplierSearchRequest: SearchRequest;

        search(): void {

            var self = this;
            self.totalPaid = 0;
            self.totalDue = 0;
            var successCallback = (response: SearchResponse): void => {
                console.log(response);
                self.models = <any>response.Models;
                if (self.models.length === 0) {
                    console.log('No search result found');
                } else {
                  
                    self.generateCsvModels();

                    for (let i = 0; i < self.models.length; i++) {
                        self.totalPaid += self.models[i].totalAmount;
                        self.totalDue += self.models[i].dueAmount;
                    }
                }

                self.totalCount = response.Count;
                self.searchRequest.totalPage = Math.ceil(response.Count / 10);

            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };

            self.searchService
                .search(self.searchRequest, self.queryUrl + "/Search")
                .then(<any>successCallback, errorCallback);
        }

        loadSuppliers(): void {
            var self = this;
            var successCallback = (response: SearchResponse): void => {
                console.log('suppliers ', response);
                self.suppliers = <any>response.Models;
                let supplier = new Supplier();
                supplier.id = Guid.defaultGuid();
                supplier["text"] = "All";
                self.suppliers.splice(0, 0, supplier);

               
            };
            var errorCallback = (error: any): void => {
                console.log(error);             
            };
            self.searchService
                .search(self.supplierSearchRequest, self.url.supplierQuery + "/Dropdown")
                .then(<any>successCallback, errorCallback);
        }

        goto(page: number): void {
            var self = this;
            self.localStorageService.save(LocalStorageKeys.SaleListPageNo, page);
            super.goto(page);
        }
    }

    angular.module("app").controller("PurchasesController", PurchasesController);

    export class PurchaseController extends BaseController<PurchaseViewModel> {

        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel', 'localStorageService'
        ];
        selectedRow: number;
        purchaseOrderDate: Date;
        constructor(
            location: angular.ILocationService,
            state: angular.ui.IStateService,
            stateParams: angular.ui.IStateParamsService,
            url: UrlService,
            search: SearchService,
            save: SaveService,
            authService: AuthService,
            excel: any,
            localStorageService: LocalStorageService
        ) {
            super(location, state, stateParams, url, search, save, authService, url.purchase, url.purchaseQuery, excel);
            this.purchaseOrderDate = new Date();
        }

        suppliers: Supplier[];
        supplierSearchRequest: SearchRequest;
        productDetailsCount: number;
        productDetails: ProductDetail[];
        productDetail: ProductDetail;
        productDetailSearchRequest: SearchRequest;
        purchaseDetail: PurchaseDetailViewModel;

        activate() {
            this.supplierSearchRequest = new SearchRequest("", "Modified", "False", "");
            this.searchRequest = new SearchRequest("", "Modified", "False", "");
            this.productDetailSearchRequest = new SearchRequest("", "Modified", "False", "");
            this.productDetailSearchRequest["isProductActive"] = true;
            this.model = new PurchaseViewModel();
            this.model.orderNumber = "P-" + this.generateOrderNumber();
            this.model.paidAmount = 0;
            this.purchaseDetail = new PurchaseDetailViewModel();
            this.selectedRow = null;
            this.models = [];
            this.isUpdateMode = false;
            this.totalCount = 0;
            this.loadSuppliers();
            this.loadProductDetails();           
            this.loadWarehouses().then(warehouses => {
                this.model.warehouseId = warehouses[0].id;
            });                        
        }

        loadSuppliers(): void {
            var self = this;
            var successCallback = (response: SearchResponse): void => {
                console.log('suppliers ', response);
                self.suppliers = <any>response.Models;
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            self.searchService
                .search(self.supplierSearchRequest, self.url.supplierQuery + "/Dropdown")
                .then(<any>successCallback, errorCallback);
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
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };

            self.searchService
                .search(self.productDetailSearchRequest, self.url.productDetailQuery + "/Search")
                .then(<any>successCallback, errorCallback);
        }


        getPriceAndName(): void {
            // this.setProductDetail(this.purchaseDetail.productDetail);
            //this.purchaseDetail.totalAmount = this.purchaseDetail.quantity * this.purchaseDetail.pricePerUnit;
            this.purchaseDetail.costTotal = this.purchaseDetail.quantity * this.purchaseDetail.productDetail.costPrice;
            //this.productDetail.productName =
            this.purchaseDetail.costPricePerUnit = this.purchaseDetail.costPricePerUnit;
        }

        decreaseFromCart(index): void {

            let quantity = this.model.purchaseDetails[index].quantity - 1;
            if (quantity === 0) {
                this.removeFromCart(index);
            } else {
                let costPricePerUnit = this.model.purchaseDetails[index].costPricePerUnit;
                this.model.purchaseDetails[index].quantity = quantity;
                this.model.purchaseDetails[index].costTotal = costPricePerUnit * quantity;
            }

            this.updateCartTotal();
        }

        addToCart2(detail: ProductDetail): void {
            let exists = this.model.purchaseDetails.some(x => x.productDetailId === detail.id);
            if (exists) {
                alert('Item : ' + detail.name + " is already added in cart.");
                return;
            }
            this.setProductDetail(detail);
            this.addToCart();
        }


        setProductDetail(detail: ProductDetail): void {
            this.purchaseDetail.costPricePerUnit = detail.costPrice;
            this.purchaseDetail.productDetailId = detail.id;
            this.purchaseDetail.name = detail.name;
            this.purchaseDetail.productDetail = detail;
            this.purchaseDetail.quantity = 1;
            this.getPriceAndName();


        }
        
        addToCart(): void {
            this.model.purchaseDetails.push(this.purchaseDetail);
            this.updateCartTotal();
            this.purchaseDetail = new PurchaseDetailViewModel();
        }

        editCart(p): void {
            this.purchaseDetail = p;
            this.removeByAttr(this.model.purchaseDetails, 'productDetailId', p.productDetailId);
        }

        removeByAttr(arr, attr, value): any {
            var i = arr.length;
            while (i--) {
                if (arr[i]
                    && arr[i].hasOwnProperty(attr)
                    && (arguments.length > 2 && arr[i][attr] === value)) {

                    arr.splice(i, 1);

                }
            }
            return arr;
        }

        removeFromCart(index): void {
            // this.removeByAttr(this.model.purchaseDetails, 'productDetailId', p.productDetailId);
            this.model.purchaseDetails.splice(index, 1);
            this.updateCartTotal();
        }

        //private updateTransactions(): void {
        //    var self = this;
        //    self.model.paidAmount = 0;
        //    $.each(self.model.transactions,
        //        function (x) {
        //            let temp = this as Transaction;
        //            self.model.paidAmount += temp.amount;
        //        });
        //    self.model.dueAmount = self.model.payableTotalAmount - self.model.paidAmount;
        //    self.transaction = new Transaction();
        //    self.transaction.transactionMedium = "Cash";
        //    self.transaction.paymentGatewayService = "Cash";
        //}

        updateCartTotal(): void {
            var self = this;

            // self.model.otherAmount = 0;
            self.model.productAmount = 0;
            self.model.purchaseDetails.forEach(p => this.model.productAmount += p.costTotal);
            self.model.totalAmount = self.model.productAmount;
            self.updateTotal();
        }

        updateTotal() {
            var self = this;
            self.model.totalAmount = self.model.productAmount + self.model.shippingAmount;
            self.model.totalAmount = self.model.totalAmount - self.model.discountAmount;
            self.model.totalAmount = self.model.totalAmount + self.model.otherAmount;
            self.model.dueAmount = self.model.totalAmount - self.model.paidAmount;
        }

        updateQuantityAll(): void {
            for (let i = 0; i < this.model.purchaseDetails.length; i++) {
                this.updateQuantity(i);
            }
        }

        increaseToCart(index): void {
            let quantity = this.model.purchaseDetails[index].quantity + 1;
            let costPricePerUnit = this.model.purchaseDetails[index].costPricePerUnit;
            this.model.purchaseDetails[index].quantity = quantity;
            this.model.purchaseDetails[index].costTotal = costPricePerUnit * quantity;

            this.updateCartTotal();
        }


        updateQuantity(index): void {
            let costPricePerUnit = this.model.purchaseDetails[index].costPricePerUnit;
            let quantity = this.model.purchaseDetails[index].quantity;
            this.model.purchaseDetails[index].quantity = quantity;
            this.model.purchaseDetails[index].costTotal = costPricePerUnit * quantity;
            this.updateCartTotal();
        }

        //updateTotal(): void {
        //    var self = this;
        //    self.model.totalAmount = self.model.productAmount + self.model.deliveryChargeAmount + self.model.paymentServiceChargeAmount;
        //    self.model.payableTotalAmount = self.model.totalAmount - self.model.discountAmount;
        //    self.model.dueAmount = self.model.payableTotalAmount - self.model.paidAmount;
        //}

        save(): void {
            var self = this;

            var successCallback = (response: BaseResponse): void => {
                self.activate();
            };
            var errorCallback = (error: any): void => {
                console.log(error);
                alert("Error occurred during save. Check your data or please contact with administrator.");
            };

            for (var i = 0; i < self.model.purchaseDetails.length; i++) {
                self.model.purchaseDetails[i].productDetail = null;
                self.model.purchaseDetails[i].created = new Date().toDateString();
                self.model.purchaseDetails[i].modified = new Date().toDateString();
                self.model.purchaseDetails[i].createdBy = self.authService.accountInfo.userName;
                self.model.purchaseDetails[i].createdFrom = "Browser";
                self.model.purchaseDetails[i].modifiedBy = self.authService.accountInfo.userName;
                self.model.purchaseDetails[i].id = "1";
                self.model.purchaseDetails[i].shopId = self.model.purchaseDetails[i].shopId != null ? self.model.purchaseDetails[i].shopId : "1";
            }

            self.saveService.save(self.model, self.commandUrl + "/Add").then(<any>successCallback, errorCallback);
        }

    
        dateChanged(): void {
            var self = this;
            console.log(self.purchaseOrderDate);
            self.model.purchaseOrderDate = self.purchaseOrderDate.toDateString();
        }

    }

    angular.module("app").controller("PurchaseController", PurchaseController);



}


