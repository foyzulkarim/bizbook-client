module App {
    "use strict";
    export class CustomersController extends BaseController<Customer> {

        static $inject: string[] =
            [
                "$location", "$state", "$stateParams",
                "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", 'Excel'
            ];
        headers = ["id", "name", "email", "phone", "totalDue", "modified"];

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
            super(location, state, stateParams, url, search, save, authService, url.customer, url.customerQuery, excel);

            this.localStorageService = localStorageService;

            let page = this.localStorageService.get2(LocalStorageKeys.CustomerListPageNo);
            
            if (!page) {
                this.localStorageService.save(LocalStorageKeys.CustomerListPageNo, 1);
                page = 1;
            }
           
            this.searchRequest.page = page;
            
            this.search();
        }
        goto(page: number): void {
            var self = this;
            self.localStorageService.save(LocalStorageKeys.CustomerListPageNo, page);
            super.goto(page);
        }
    }

    angular.module('app').controller('CustomersController', CustomersController);

    export class CustomerController extends BaseController<Customer> {

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
            super(location, state, stateParams, url, search, save, authService, url.customer, url.customerQuery, excel);
            this.isUpdateMode = false;
            if (this.stateParams["id"]) {
                this.isUpdateMode = true;
                //this.edit(this.stateParams["id"]);
                this.editWithCallBack(this.stateParams["id"], this.loadImage);
            }
        }

        customerPointViewModel: CustomerPointViewModel;

        history(p: Customer): void {
            var self = this;
            self.stateService.go('root.customerhistory', { customer: { Id: p.id, Name: p.name, Phone: p.phone, MembarshipCardNo: p.membershipCardNo } });
        }

        report(): void {
            var self = this;
            window.open(self.url.customerQueryReport, "_blank", "");
        }

        getBarcode(): void {
            var self = this;
            var successCallback = (response: any): void => {
                if (self.model == null) {
                    self.model = new Customer();
                }
                self.model.membershipCardNo = response;
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };

            self.searchService.get(self.url.customerQueryBarcode).then(successCallback, errorCallback);
        }

        getTotal(): CustomerPointViewModel {
            var self = this;
            self.customerPointViewModel = new CustomerPointViewModel();
            var customers: Customer[] = self.models;
            for (var i = 0; i < customers.length; i++) {
                var p = customers[i];
                self.customerPointViewModel.pointTotal += parseFloat(p["point"].toString() !== "" ? p["point"].toString() : "0");
            }
            return self.customerPointViewModel;
        }

        //uploadProfileImage(): void {
        //    var self = this;
        //    let file = self["customerImage"] as File;
        //    let folderName = "customers";
        //    var fd = new FormData();
        //    fd.append('folderName', folderName);
        //    fd.append("id", self.model.id);
        //    let type = 'profile';
        //    fd.append('type', type);
        //    fd.append('file', file);
        //    self.uploadImage(fd, folderName, self.model.id, type);
        //}

        uploadImage(fileName: string, type: string): void {
            var self = this;           
            let file = self[fileName] as File;
            let folderName = "customers";
            var fd = new FormData();
            fd.append('folderName', folderName);
            fd.append("id", self.model.id);            
            fd.append('type', type);
            fd.append('file', file);
            self.uploadContent(fd, folderName, self.model.id, type);
        }

        loadImage(model, self): void {
            var random = (new Date()).toString();
            self["customerProfileImageUrl"] = self.url.getImage + "?folderName=customers&id=" + self.model.id + "&name=profile.jpeg&timestamp=" + random;
            self["customerNid1ImageUrl"] = self.url.getImage + "?folderName=customers&id=" + self.model.id + "&name=nid1.jpeg&timestamp=" + random;
            self["customerNid2ImageUrl"] = self.url.getImage + "?folderName=customers&id=" + self.model.id + "&name=nid2.jpeg&timestamp=" + random;
        }

        uploadContent(fd: FormData, folderName: string, id: string, type: string): void {
            let self = this;
            self.saveService.upload(self.url.uploadImage, fd).then((response): any => {
                self.loadImage(self.model, self);
            },
                error => {
                    console.log(error);
                });
        }
    }

    angular.module("app").controller("CustomerController", CustomerController);


    export class CustomerAddressesController extends BaseController<CustomerAddress> {

        static $inject: string[] =
            [
                "$location", "$state", "$stateParams",
                "UrlService", "SearchService", "SaveService", "AuthService",
                "CustomerService", 'Excel'
            ];

        customerService: CustomerService;

        customerId: string;

        constructor(
            location: angular.ILocationService,
            state: angular.ui.IStateService,
            stateParams: angular.ui.IStateParamsService,
            url: UrlService,
            search: SearchService,
            save: SaveService,
            authService: AuthService,
            customerService: CustomerService,
            excel: any
        ) {
            super(location, state, stateParams, url, search, save, authService, url.customerAddress, url.customerAddressQuery, excel);

            this.customerService = customerService;
            if (this.stateParams["id"]) {
                this.customerId = this.stateParams["id"];
                this.searchRequest.parentId = this.customerId;
                this.activate();
            }
        }

        addressChanged(): void {
            var self = this;
            console.log(self.searchRequest);
            self.loadDetail(self.searchRequest.id);

        }

        loadDropdown(): void {
            var self = this;

            var successCallback = (response: SearchResponse): void => {
                console.log('addresses ', response);
                self.models = <any>response.Models;
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };

            self.searchService
                .search(self.searchRequest, self.url.customerAddressQuery + "/Dropdown")
                .then(<any>successCallback, errorCallback);
        }

        loadDetail(id: string): void {
            var self = this;
            var successCallback = (response: SearchResponse): void => {
                console.log(response);
                self.model = <any>response.data;
                self.isUpdateMode = true;
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };

            self.searchService
                .search(self.searchRequest, self.url.customerAddressQuery + "/Detail?id=" + id)
                .then(<any>successCallback, errorCallback);
        }

        activate() {
            this.model = new CustomerAddress();
            this.model.customerId = this.customerId;
            this.models = [];
            this.isUpdateMode = false;
            this.searchRequest = new SearchRequest();
            this.searchRequest.parentId = this.customerId;
            this.loadDropdown();
        }
    }

    angular.module('app').controller('CustomerAddressesController', CustomerAddressesController);

    export class CustomerFeedbackController extends BaseController<CustomerFeedback>{

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
            super(location, state, stateParams, url, search, save, authService, url.customerFeedback, url.customerFeedbackQuery, excel);
            this.isUpdateMode = false;
            if (this.stateParams["id"]) {
                this.isUpdateMode = true;
                this.edit2(this.stateParams["id"]);
            }
            
        }
        customerSearchRequest: SearchRequest;
        customers: Customer[];
        customer: Customer;
        feedbackTypes: string[] = ["Positive", "Negative", "Other"];

        setFocusOnSearchBox(): void {
            var txtCustomerSearch = document.getElementById("txtCustomerSearch") as HTMLInputElement;
            txtCustomerSearch.focus();
            txtCustomerSearch.select();
            txtCustomerSearch.value = '';
        }

        loadCustomers(): void {
            var self = this;
            if (self.customerSearchRequest.keyword.length < 3) {
                return;
            }
            var successCallback = (response: SearchResponse): void => {
                console.log('customers ', response);
                self.customers = <any>response.Models;
                for (let i = 0; i < self.customers.length; i++) {
                    let addressLength = self.customers[i].addresses.length;
                    let newAddresses = [];
                    for (var j = 0; j < addressLength; j++) {
                        //Display.log(self.customers[i].addresses[j]);
                        if (self.customers[i].addresses[j].isActive) {
                            newAddresses.push(self.customers[i].addresses[j]);
                        }
                    }
                    self.customers[i].addresses = newAddresses;
                }
            };

            var errorCallback = (error: any): void => {
                console.log(error);
            };

            self.customerSearchRequest.isIncludeParents = true;
            self.customerSearchRequest["IsCustomerActive"] = true;

            self.searchService
                .search(self.customerSearchRequest, self.url.customerQuery + "/Search")
                .then(<any>successCallback, errorCallback);
        }

        response: any;

        selectCustomer(selecterCustomer: Customer): void {
            var self = this;
            self.customer = selecterCustomer;
            
            var successCallback = (response: SearchResponse): void => {
                self.model = response.data;
            };
            var errorCallback = (error: any): void => {
                console.log(error);
                alert('Error occurred');
            };

            var searchRequest = new SearchRequest();
            searchRequest.parentId = selecterCustomer.id;
            searchRequest.page = -1;

            self.searchService
                .search(searchRequest, self.url.saleQuery + "/Search")
                .then(<any>successCallback, errorCallback);
        }

        selectSaleList(selectSaleList): void {
            var self = this;
            var successCallback = (response: SearchResponse): void => {
                self.response = response.data;
            };
            var errorCallback = (error: any): void => {
                console.log(error);
                alert('Error occurred');
            };

            var searchRequest = new SearchRequest();
            searchRequest.parentId = selectSaleList.id;
            searchRequest.isIncludeParents = true;
            searchRequest.page = -1;
          
            self.searchService
                .search(searchRequest, self.url.saleDetailQuery + "/Search" )
                .then(<any>successCallback, errorCallback);
        }
        
        resetOrderCustomer(): void {
            this.customer = new Customer();
            this.customerSearchRequest.keyword = "";
            this.customers = [];
        }

        resetCustomer(): void {
            this.customer.name = "";
            this.customer.phone = "";
        }

        save(): void {
            var self = this;

            if (self.isUpdateMode) self.update();

            if (self.customer.name.length === 0 || self.customer.phone.length === 0) {
                self.customer.phone = "0";
                self.customer.name = "Annonymous";
            }
            else {
                var successCallback = (response: BaseResponse): void => {
                     self.activate();
                     this.model.feedbackType = '';
                };
                var errorCallback = (error: any): void => {
                    console.log(error);
                    if (error.status === 500) {
                        alert(error.data.exceptionMessage);
                    }
                };
               
                self.model.customerId = self.customer.id;
                self.saveService.save(self.model, self.commandUrl + "/Add").then(<any>successCallback, errorCallback);
            }
        }

        activate() {
            this.model = new CustomerFeedback();
            this.models = [];
            this.isUpdateMode = false;
            this.customer = new Customer();
            this.customerSearchRequest = new SearchRequest();
            this.resetOrderCustomer();
        }
    }

    angular.module('app').controller('CustomerFeedbackController', CustomerFeedbackController);

    export class CustomerFeedbacksController extends BaseController<any>{

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
            super(location, state, stateParams, url, search, save, authService, url.customerFeedback, url.customerFeedbackQuery, excel);
            this.searchRequest.isIncludeParents = true;
            this.search();
        }
    }

    angular.module('app').controller('CustomerFeedbacksController', CustomerFeedbacksController);
}