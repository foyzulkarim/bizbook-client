
module App {
    "use strict";

    // for deliveryman
    export class OnlineSalesDeliverymanController extends BaseController<SaleViewModel> {
        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService",'Excel'
        ];

        total = 0;
        due = 0;

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
            super(location, state, stateParams, url, search, save, authService, url.sale, url.saleQuery, excel);
            this.search();
        }

        search(): void {
            var self = this;
            this.due = 0;
            this.total = 0;
            var successCallback = (response: SearchResponse): void => {
                console.log(response);
                self.models = <any>response.Models;
                if (self.models.length === 0) {
                    console.log('No search result found');
                } else {
                    for (let i = 0; i < self.models.length; i++) {
                        self.total += self.models[i].totalAmount;
                        self.due += self.models[i].dueAmount;
                    }
                }
                self.totalCount = response.Count;
                self.searchRequest.totalPage = Math.ceil(response.Count / 10);
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };

            //self.searchRequest

            self.searchService
                .search(self.searchRequest, self.queryUrl + "/SearchDelivery")
                .then(<any>successCallback, errorCallback);
        }
    }

    angular.module("app").controller("OnlineSalesDeliverymanController", OnlineSalesDeliverymanController);


    export class OnlineSalesController extends BaseController<SaleViewModel> {
        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService",'Excel'
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
            super(location, state, stateParams, url, search, save, authService, url.sale, url.saleQuery,excel);
            this.search();
        }

        searchOrders(): void {
            if (this.startDate != null) {
                this.searchRequest.startDate = this.startDate.toDateString();
            }
            if (this.endDate != null) {
                this.searchRequest.endDate = this.endDate.toDateString();
            }

            this.search();
        }

        search(): void {
            var self = this;
            var successCallback = (response: SearchResponse): void => {
                console.log(response);
                self.models = <any>response.Models;
                if (self.models.length === 0) {
                    console.log('No search result found');
                }

                self.searchRequest.totalPage = Math.ceil(response.Count / 10);
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };

            self.searchService
                .search(self.searchRequest, self.queryUrl + "/Search")
                .then(<any>successCallback, errorCallback);
        }
    }

    angular.module("app").controller("OnlineSalesController", OnlineSalesController);

    export class OnlineSaleController extends BaseController<SaleViewModel> {

        modal: angular.ui.bootstrap.IModalService;
        modalInstance: ng.ui.bootstrap.IModalServiceInstance;

        orderTypes: string[] = ["CashOnDelivery", "Courier", "Condition"];
        transactionTypes: string[] = ["Cash", "Online", "Cheque", "Card", "Mobile", "Other"];
        paymentMethods: string[] = ["Cash", "Cash (Sundarban)", "Cash (SA Paribahan)", "Rocket", "Bkash", "Ucash", "Mycash", "Easycash", "Mcash", "Other"];
        orderFroms: string[] = ["Facebook", "Website", "PhoneCall", "MobileApp", "BizBook365", "Referral", "Other"];


        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "CustomerService", "$uibModal",'Excel'
        ];

        constructor(
            location: angular.ILocationService,
            state: angular.ui.IStateService,
            stateParams: angular.ui.IStateParamsService,
            url: UrlService,
            search: SearchService,
            save: SaveService,
            authService: AuthService,
            customerService: CustomerService,
            $uibModal: angular.ui.bootstrap.IModalService,
            excel: any
        ) {
            super(location, state, stateParams, url, search, save, authService, url.sale, url.saleQuery, excel);
            this.modal = $uibModal;
            this.selectedRow = null;
            this.customerService = customerService;
        }

        serviceChargePercent: number;
        selectedRow: number;
        customers: Customer[];
        customerSearchRequest: SearchRequest;
        customer: Customer;
        customerService: CustomerService;

        productDetailsCount: number;
        productDetails: ProductDetail[];
        productDetail: ProductDetail;
        productDetailSearchRequest: SearchRequest;
        saleDetail: SaleDetailViewModel;

        loadCustomers(): void {
            var self = this;
            var successCallback = (response: SearchResponse): void => {
                console.log('customers ', response);
                self.customers = <any>response.Models;
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            self.searchService
                .search(self.customerSearchRequest, self.url.customerQuery + "/Search")
                .then(<any>successCallback, errorCallback);
        }

        loadCustomer(): void {
            var self = this;
            if (self.model.customerPhone.length < 11) {
                alert("Please enter valid phone number");
            }

            var successCallback = (customer: Customer): void => {
                if (customer != null) {
                    console.log('customer is ', customer);
                    self.customer = customer;
                    self.model.customerName = self.customer.name;
                } else {
                    alert('Could not find any customer by phone number ' + self.model.customerPhone);
                }
            };
            var errorCallback = (error: any): void => {
                console.log(error);
                alert('Error occurred');
            };

            self.customerService.loadCustomer(self.model.customerPhone).then(successCallback, errorCallback);

        }

        selectCustomer(selecterCustomer: Customer): void {
            this.customer = selecterCustomer;
        }

        loadProductDetails(): void {
            var self = this;
            var successCallback = (response: SearchResponse): void => {
                console.log('products ', response);
                self.productDetails = <any>response.Models;
                self.productDetailsCount = response.Count;
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };

            // self.productDetailSearchRequest.page = -1;
            self.searchService
                .search(self.productDetailSearchRequest, self.url.productDetailQuery + "/Search")
                .then(<any>successCallback, errorCallback);
        }

        getPriceAndName(): void {
            //this.setProductDetail(this.saleDetail.productDetail);
            this.saleDetail.total = this.saleDetail.quantity * this.saleDetail.salePricePerUnit;
        }

        getReturn(): void {
            this.model.dueAmount = this.model.totalAmount - this.model.paidAmount;
        }

        setProductDetail(detail: ProductDetail): void {
            this.saleDetail.salePricePerUnit = detail.salePrice;
            this.saleDetail.productDetailId = detail.id;
            this.saleDetail.name = detail.name;
            this.saleDetail.productDetail = detail;
        }

        addToCart(): void {
            this.model.saleDetails.push(this.saleDetail);
            this.updateCartTotal();
            this.saleDetail = new SaleDetailViewModel();
        }

        editCart(p): void {
            this.saleDetail = p;
            this.removeByAttr(this.model.saleDetails, 'productDetailId', p.productDetailId);
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

        removeFromCart(p): void {
            this.removeByAttr(this.model.saleDetails, 'productDetailId', p.productDetailId);
        }

        private updateCartTotal(): void {
            var self = this;
            self.model.productAmount = 0;
            self.model.saleDetails.forEach(p => this.model.productAmount += p.total);
            self.model.totalAmount = self.model.productAmount;
        }

        calculateServiceCharge(): void {
            var self = this;
            self.model.otherAmount = self.serviceChargePercent * self.model.productAmount / 100;
        }

        calculateTotal(): void {
            var self = this;
            self.model.totalAmount = self.model.productAmount + self.model.deliveryChargeAmount + self.model.otherAmount - self.model.discountAmount;
        }

        save(): void {

            var self = this;

            var successCallback = (response: BaseResponse): void => {
                //this.print();
                self.activate();
            };
            var errorCallback = (error: any): void => {
                console.log(error);
                if (error.status === 500) {
                    alert(error.data.exceptionMessage);
                }
            };
            for (var i = 0; i < self.model.saleDetails.length; i++) {
                self.model.saleDetails[i].productDetail = null;
                self.model.saleDetails[i].created = new Date().toDateString();
                self.model.saleDetails[i].modified = new Date().toDateString();
                self.model.saleDetails[i].createdBy = self.authService.accountInfo.userName;
                self.model.saleDetails[i].createdFrom = "Browser";
                self.model.saleDetails[i].modifiedBy = self.authService.accountInfo.userName;
                self.model.saleDetails[i].id = "1";
                self.model.saleDetails[i].shopId = self.model.saleDetails[i].shopId != null ? self.model.saleDetails[i].shopId : "1";
            }

            self.model.orderState = OrderState.Pending;
            //self.model.requiredDeliveryDateByCustomer = self.requ;

            this.saveService.save(self.model, self.commandUrl + "/Add")
                .then(<any>successCallback, errorCallback);
        }

        activate(): void {
            console.log('im in child activate. ');
            super.activate();
            this.customerSearchRequest = new SearchRequest("", "Modified", "False", "");
            this.productDetailSearchRequest = new SearchRequest("", "Modified", "False", "");
            this.model = new SaleViewModel();
            this.model.orderNumber = "S-" + this.generateOrderNumber();
          //  this.model.requiredDeliveryDateByCustomer = new Date();
            this.saleDetail = new SaleDetailViewModel();
            this.serviceChargePercent = 0;
        }
    }

    angular.module("app").controller("OnlineSaleController", OnlineSaleController);

}