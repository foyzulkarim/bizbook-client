// Install the angularjs.TypeScript.DefinitelyTyped NuGet package


angular.module('app')
    .controller('ModalInstanceCtrl',
        [
            '$scope', '$uibModalInstance', 'sale', 'customer', function ($scope, $uibModalInstance, sale, customer) {
                // console.log(sale);

                var vm = this;

                vm.customer = customer;
                vm.sale = sale;
                console.log(vm.sale);

                function cancel() {
                    $uibModalInstance.dismiss('cancel');
                }


                //function loadSalesData() {
                //    $scope.sale = sale;
                //    $scope.customer = customer;
                //}

                //loadSalesData();

                vm.ok = function () {
                    $uibModalInstance.close(sale);
                };

                //$scope.Cancel = function () {
                //    $uibModalInstance.dismiss('cancel');
                //};
            }
        ]);


module App {
    "use strict";

    export class SalesController extends BaseController<SaleViewModel> {
        static $inject: string[] =
            [
                "$location", "$state", "$stateParams",
                "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", 'Excel'

            ];

        orderFroms: string[] = [];
        orderTypes: string[] = [];
        saleFroms: string[] = [
            "All", "BizBook365", "Facebook", "Website", "PhoneCall", "MobileApp", "Referral", "Other"
        ];
        saleChannels: string[] = ["All", "Inhouse", "CashOnDelivery", "Courier", "Condition"];
        headers: string[] = [];
        keys: KeyValuePair[] = [];
        searchDates: string[] = [];
        searchDate: string[] = [
            "Created", "Modified", "OrderDate"
        ];

        orderbyValue: string = "RequiredDeliveryDateByCustomer";
        isAccendingValue: boolean = true;
        isTaggedSale: boolean = false;

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
            localStorageService: LocalStorageService,
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

            this.localStorageService = localStorageService;

            this.Excel = excel;

            let stateName = this.localStorageService.get(LocalStorageKeys.OrderState);
            if (!stateName) {
                this.localStorageService.save(LocalStorageKeys.OrderState, this.orderStates[0]);
                stateName = this.orderStates[0];
            }

            this.setSearchKeyword();
            this.setStartDate();
            this.setEndDate();

            let orderbyKeyword = this.localStorageService.get(
                LocalStorageKeys.OrderByKeyword);
            if (!orderbyKeyword) {
                orderbyKeyword = this.orderbyValue;
                this.localStorageService.save(LocalStorageKeys.OrderByKeyword, this.orderbyValue);
            }

            let isAccendingKeyword = this.localStorageService.get(
                LocalStorageKeys.IsAscendingValue);
            if (!isAccendingKeyword) {
                isAccendingKeyword = this.isAccendingValue;
                this.localStorageService.save(LocalStorageKeys.IsAscendingValue, this.isAccendingValue);
            }

            let isTaggedSale = this.localStorageService.get(LocalStorageKeys.IsTaggedSale);
            if (isTaggedSale == null) {
                isTaggedSale = this.isTaggedSale;
                this.localStorageService.save(LocalStorageKeys.IsTaggedSale, this.isTaggedSale);
            }

            let saleTag = this.localStorageService.get(LocalStorageKeys.SaleTag);
            if (saleTag == null) {
                saleTag = "";
                this.localStorageService.save(LocalStorageKeys.SaleTag, saleTag);
            }

            for (var enumMember in SaleFrom) {
                if (SaleFrom.hasOwnProperty(enumMember)) {
                    var isValueProperty = parseInt(enumMember, 10) >= 0;
                    if (isValueProperty) {
                        let i = SaleFrom[enumMember];
                        this.orderFroms.push(i);
                    }
                }
            }

            for (var enumMember in SearchDate) {
                if (SearchDate.hasOwnProperty(enumMember)) {
                    var isValueProperty = parseInt(enumMember, 10) >= 0;
                    if (isValueProperty) {
                        let i = SearchDate[enumMember];
                        this.searchDates.push(i);
                    }
                }
            }
            
            let searchDynamicDate = this.localStorageService.get(LocalStorageKeys.SearchDate);
            if (searchDynamicDate == null) {             
                searchDynamicDate = this.searchDates[0];
                this.localStorageService.save(LocalStorageKeys.SearchDate, searchDynamicDate);
            }

            let saleFrom = this.localStorageService.get(LocalStorageKeys.SaleFrom);
            if (saleFrom == null) {
                saleFrom = this.orderFroms[0];
                this.localStorageService.save(LocalStorageKeys.SaleFrom, saleFrom);
            }

            let isOnlyDues = this.localStorageService.get(LocalStorageKeys.IsOnlyDues);
            if (isOnlyDues == null) {
                isOnlyDues = false;
                this.localStorageService.save(LocalStorageKeys.IsOnlyDues, isOnlyDues);
            }

            this.searchRequest.orderBy = orderbyKeyword;
            this.searchRequest.isAscending = isAccendingKeyword;
            //this.searchRequest.orderBy = "RequiredDeliveryDateByCustomer";
            // this.searchRequest.isAscending = "true";
            this.searchRequest["dateSearchColumn"] = searchDynamicDate;
            this.searchRequest["orderState"] = stateName;
            this.searchRequest["onlyDues"] = isOnlyDues;
            this.searchRequest["isTaggedSale"] = isTaggedSale;
            this.searchRequest["saleTag"] = saleTag;
            this.searchRequest["saleFrom"] = saleFrom;

            let page = this.localStorageService.get(LocalStorageKeys.SaleListPageNo);
            if (!page) {
                this.localStorageService.save(LocalStorageKeys.SaleListPageNo, 1);
                page = 1;
            }
            console.log("searchkey" + this.searchRequest.keyword);
            this.searchRequest.page = page;
            //this.searchByWarehouse().then(result => {
            //    console.log('searched.', result);
            //});
            this.loadWarehouses().then(result => {
                if (this.warehouses.length === 1) {
                    this.searchRequest.warehouseId = this.warehouses[0].id;
                } else {
                    let whId = this.localStorageService.get(LocalStorageKeys.WarehouseId);
                    if (whId != null) {
                        this.searchRequest.warehouseId = whId;
                    }
                }

                return this.search();
            });
        }

        changeSearchDate(): void {
            var self = this;
            self.localStorageService.save(LocalStorageKeys.SearchDate, self.searchRequest["DateSearchColumn"]);            
            self.search();
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

        getHeaders(): string[] {
            return this.headers;
        }

        saveSearchKeyword(): void {
            var self = this;
            self.localStorageService.save(LocalStorageKeys.SearchKeyword, self.searchRequest.keyword);
        }

        saveOrderByValue(): void {
            var self = this;
            self.localStorageService.save(LocalStorageKeys.OrderByKeyword, self.searchRequest.orderBy);
            self.localStorageService.save(LocalStorageKeys.IsAscendingValue,
                self.searchRequest.isAscending);
            this.search();
        }

        search(): void {

            var self = this;
            self.total = 0;
            self.due = 0;
            var successCallback = (response: SearchResponse): void => {
                console.log(response);
                self.models = <any>response.Models;
                if (self.models.length === 0) {
                    console.log('No search result found');
                } else {
                    //vm.searchRequest.keyword

                    //super.ensureKeysAreSaved(LocalStorageKeys.SaleListGridKeys, self.models[0]);
                    self.ensureKeysAreSaved(LocalStorageKeys.SaleListGridKeys, self.models[0]);
                    self.generateCsvModels();

                    for (let i = 0; i < self.models.length; i++) {
                        self.total += self.models[i].payableTotalAmount;
                        self.due += self.models[i].dueAmount;
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

        showReceipt(id: string): void {
            var self = this;
            let name = self.localStorageService.get2(LocalStorageKeys.ReceiptName);
            if (name == null) {
                name = 'root.receipt3';
                self.localStorageService.save2(LocalStorageKeys.ReceiptName, name);
            }
            self.navigateState(name, { id: id });
        }

        showChalan(id: string): void {
            var self = this;
            let chalanName = self.localStorageService.get(LocalStorageKeys.ChalanName);

            if (!chalanName) {
                chalanName = 'root.chalan';
                self.localStorageService.save(LocalStorageKeys.ChalanName, chalanName);
            }

            self.navigateState(chalanName, { id: id });
        }

        goto(page: number): void {
            var self = this;
            self.localStorageService.save(LocalStorageKeys.SaleListPageNo, page);
            super.goto(page);
        }

        saveChangedState(): void {
            var self = this;
            self.localStorageService.save(LocalStorageKeys.OrderState, self.searchRequest["orderState"]);
            self.search();
        }

        saveChangeOrderFrom(): void {
            var self = this;
            self.localStorageService.save(LocalStorageKeys.SaleFrom, self.searchRequest["saleFrom"]);
            self.search();
        }

        saveChangeOnlyDues(): void {
            var self = this;
            self.localStorageService.save(LocalStorageKeys.IsOnlyDues, self.searchRequest["onlyDues"]);
            self.search();
        }

        updateKeys(): void {
            var self = this;
            self.localStorageService.save(LocalStorageKeys.SaleListGridKeys, self.keys);
            self.generateCsvModels();
        }
    }

    angular.module("app").controller("SalesController", SalesController);

    export class SalesDuesController extends BaseController<SaleViewModel>{

        static $inject: string[] =
            [
                "$location", "$state", "$stateParams",
                "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", 'Excel'
            ];

        orderFroms: string[] = [];
        orderTypes: string[] = [];
        saleFroms: string[] = [
            "All", "BizBook365", "Facebook", "Website", "PhoneCall", "MobileApp", "Referral", "Other"
        ];
        saleChannels: string[] = ["All", "Inhouse", "CashOnDelivery", "Courier", "Condition"];
        headers: string[] =
            ["id", "date", "orderNumber", "payableTotalAmount", "paidAmount", "dueAmount", "customerName", "customerPhone"];

        total = 0;
        due = 0;
        orderbyValue: string = "Modified";
        isAccendingValue: boolean = true;

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
            super(location,
                state,
                stateParams,
                url,
                search,
                save,
                authService,
                url.sale,
                url.saleQuery, excel
            );

            this.localStorageService = localStorageService;
            // this.searchRequest["orderState"] = this.orderStates[0];
            //this.searchRequest["saleFrom"] = this.saleFroms[0];
            //this.searchRequest["saleChannel"] = this.saleChannels[0];
            //this.searchRequest["thana"] = this.thanas[0];

            let stateName = this.localStorageService.get(LocalStorageKeys.DueOrderState);
            console.log(stateName);
            if (!stateName) {
                this.localStorageService.save(LocalStorageKeys.DueOrderState, this.orderStates[0]);
                stateName = this.orderStates[0];
            }

            let orderbyKeyword = this.localStorageService.get(
                LocalStorageKeys.OrderByKeyword);
            if (!orderbyKeyword) {
                this.localStorageService.save(LocalStorageKeys.OrderByKeyword, this.orderbyValue);
                orderbyKeyword = this.orderbyValue;
            }
            let isAccendingKeyword = this.localStorageService.get(
                LocalStorageKeys.IsAscendingValue);
            if (!isAccendingKeyword) {
                this.localStorageService.save(LocalStorageKeys.IsAscendingValue, this.isAccendingValue);
                isAccendingKeyword = this.isAccendingValue;
            }

            this.searchRequest.orderBy = orderbyKeyword;
            this.searchRequest.isAscending = isAccendingKeyword;
            this.searchRequest["orderState"] = stateName;

            let page = this.localStorageService.get(LocalStorageKeys.DueSaleListPageNo);
            if (!page) {
                this.localStorageService.save(LocalStorageKeys.DueSaleListPageNo, 1);
                page = 1;
            }
            this.searchRequest.page = page;
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
            self.total = 0;
            self.due = 0;
            var successCallback = (response: SearchResponse): void => {
                console.log(response);
                self.models = <any>response.Models;
                if (self.models.length === 0) {
                    console.log('No search result found');
                } else {
                    self.csvModels = [];
                    for (let i = 0; i < self.models.length; i++) {
                        self.total += self.models[i].totalAmount;
                        self.due += self.models[i].dueAmount;
                        self.csvModels.push(self.generateCsvModel(self.models[i]));
                    }
                }

                self.totalCount = response.Count;
                self.searchRequest.totalPage = Math.ceil(response.Count / 10);
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };

            self.searchRequest["onlyDues"] = true;
            self.searchService
                .search(self.searchRequest, self.queryUrl + "/Search")
                .then(<any>successCallback, errorCallback);
        }

        showReceipt(id: string): void {
            var self = this;
            let name = self.localStorageService.get(LocalStorageKeys.ReceiptName);
            if (!name) {
                name = 'root.receipt2';
                self.localStorageService.save(LocalStorageKeys.ReceiptName, name);
            }
            self.navigateState(name, { id: id });
        }

        saveChangedState(): void {
            var self = this;
            self.localStorageService.save(LocalStorageKeys.DueOrderState, self.searchRequest["orderState"]);
            self.search();
        }

        saveOrderByValue(): void {
            var self = this;
            self.localStorageService.save(LocalStorageKeys.OrderByKeyword, self.searchRequest.orderBy);
            self.localStorageService.save(LocalStorageKeys.IsAscendingValue,
                self.searchRequest.isAscending);
            this.search();
        }
    }

    angular.module("app").controller("SalesDuesController", SalesDuesController);

    export class SalesTagMangoController extends BaseController<SaleViewModel>{

        static $inject: string[] =
            [
                "$location", "$state", "$stateParams",
                "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", 'Excel'
            ];

        orderFroms: string[] = [];
        orderTypes: string[] = [];
        saleFroms: string[] = [
            "All", "BizBook365", "Facebook", "Website", "PhoneCall", "MobileApp", "Referral", "Other"
        ];
        saleChannels: string[] = ["All", "Inhouse", "CashOnDelivery", "Courier", "Condition"];
        headers: string[] =
            ["id", "date", "orderNumber", "payableTotalAmount", "paidAmount", "dueAmount", "customerName", "customerPhone"];

        total = 0;
        due = 0;
        orderbyValue: string = "Modified";
        isAccendingValue: boolean = true;

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
            super(location,
                state,
                stateParams,
                url,
                search,
                save,
                authService,
                url.sale,
                url.saleQuery, excel
            );

            this.localStorageService = localStorageService;
            this.search();
        }

        search(): void {

            var self = this;
            self.total = 0;
            self.due = 0;
            var successCallback = (response: SearchResponse): void => {
                console.log(response);
                self.models = <any>response.Models;
                if (self.models.length === 0) {
                    console.log('No search result found');
                } else {
                    self.csvModels = [];
                    for (let i = 0; i < self.models.length; i++) {
                        self.total += self.models[i].totalAmount;
                        self.due += self.models[i].dueAmount;
                        self.csvModels.push(self.generateCsvModel(self.models[i]));
                    }
                }

                self.totalCount = response.Count;
                self.searchRequest.totalPage = Math.ceil(response.Count / 10);
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };

            self.searchRequest["isTaggedSale"] = true;
            self.searchRequest["saleTag"] = "Mango";
            self.searchService
                .search(self.searchRequest, self.queryUrl + "/Search")
                .then(<any>successCallback, errorCallback);
        }

        showReceipt(id: string): void {
            var self = this;
            let name = self.localStorageService.get(LocalStorageKeys.ReceiptName);
            if (!name) {
                name = 'root.receipt3';
                self.localStorageService.save(LocalStorageKeys.ReceiptName, name);
            }
            self.navigateState(name, { id: id });
        }

        saveChangedState(): void {
            var self = this;
            self.localStorageService.save(LocalStorageKeys.DueOrderState, self.searchRequest["orderState"]);
            self.search();
        }

        saveOrderByValue(): void {
            var self = this;
            self.localStorageService.save(LocalStorageKeys.OrderByKeyword, self.searchRequest.orderBy);
            self.localStorageService.save(LocalStorageKeys.IsAscendingValue,
                self.searchRequest.isAscending);
            this.search();
        }
    }

    angular.module("app").controller("SalesTagMangoController", SalesTagMangoController);


    export class SaleController extends BaseController<SaleViewModel> {

        private modal: angular.ui.bootstrap.IModalService;
        private modalInstance: ng.ui.bootstrap.IModalServiceInstance;
        private $anchorScroll: angular.IAnchorScrollService;

        static $inject: string[] =
            [
                "$scope", "$filter", "$location", "$state", "$stateParams",
                "UrlService", "SearchService", "SaveService", "AuthService", "CustomerService",
                "$uibModal", "LocalStorageService", "$anchorScroll", 'Excel'
            ];

        selectedAccountInfo: any;
        requiredDeliveryDateByCustomer: Date;
        orderDate: Date;

        constructor(
            scope: angular.IScope,
            filter: angular.IFilterService,
            location: angular.ILocationService,
            state: angular.ui.IStateService,
            stateParams: angular.ui.IStateParamsService,
            url: UrlService,
            search: SearchService,
            save: SaveService,
            authService: AuthService,
            customerService: CustomerService,
            $uibModal: angular.ui.bootstrap.IModalService,
            localStorageService: LocalStorageService,
            anchorScroll: angular.IAnchorScrollService,
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
            this.modal = $uibModal;
            this.localStorageService = localStorageService;
            this.$anchorScroll = anchorScroll;
            this.selectedRow = null;
            this.customerService = customerService;
            //this.loadDefaultCustomer();
            //this.loadDistricts();
            this.setupLocalConfiguration();
            this.requiredDeliveryDateByCustomer = new Date();
            this.requiredDeliveryDateByCustomer.setDate(this.requiredDeliveryDateByCustomer.getDate() + 1);
            this.orderDate = new Date();
            var self = this;
            scope.$watch('vm.requiredDeliveryDateByCustomer', function (newValue) {
                //$scope.workerDetail.dateOfBirth = $filter('date')(newValue, 'yyyy/MM/dd');
                let string = filter('date')((newValue) as any, 'dd-MMMM-yyyy');
                self.model.requiredDeliveryDateByCustomer = string;
                console.log(string);
            });

            console.log('this.isOnlineSale', this.isOnlineSale);
        }

        isOnlineSale: boolean = false;
        dealerSearchRequest: SearchRequest;
        dealer: Dealer;
        dealers: Dealer[];

        selectedRow: number;
        customers: Customer[];
        customerList: Customer[];
        customerSearchRequest: SearchRequest;
        customer: Customer;
        customerService: CustomerService;
        address: CustomerAddress;
        addresses: CustomerAddress[];
        gurantor1s: Customer[];
        gurantor2s: Customer[];
        guarantor1SearchRequest: SearchRequest;
        guarantor2SearchRequest: SearchRequest;
        guarantor1: Customer;
        guarantor2: Customer;

        installment: Installment;
        installmentDetail: InstallmentDetail;
        installmentTotal: number;

        locations: Location[];
        districts: string[];
        thanas: string[];
        areas: string[];
        area: Location;

        paymentServiceChargePercent: number = 0;

        productDetailsCount: number;
        productDetails: ProductDetail[];
        productDetail: ProductDetail;
        productDetailSearchRequest: SearchRequest;

        saleDetail: SaleDetailViewModel;

        quantityIsFloat: boolean = true;

        loadOrderNumber(): void {
            var self = this;
            var successCallback = (response: any): void => {
                console.log('order number', response);
                self.model.orderNumber = response;
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };

            self.searchService.get(self.url.saleQuery + "/OrderNumber")
                .then(<any>successCallback, errorCallback);
        }


        loadDealers(): void {
            var self = this;
            if (self.dealerSearchRequest.keyword.length < 3) {
                return;
            }
            var successCallback = (response: SearchResponse): void => {

                console.log('dealers', response);
                self.dealers = <any>response.Models;
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            self.searchService.search(self.dealerSearchRequest, self.url.dealerQuery + "/Search")
                .then(<any>successCallback, errorCallback);
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

        loadGuarantor1(): void {
            var self = this;
            if (self.guarantor1SearchRequest.keyword.length < 3) {
                return;
            }
            var successCallback = (response: SearchResponse): void => {
                console.log('gurantor1s ', response);
                self.gurantor1s = <any>response.Models;
            };

            var errorCallback = (error: any): void => {
                console.log(error);
            };

            self.guarantor1SearchRequest.isIncludeParents = true;
            self.customerSearchRequest["IsCustomerActive"] = true;
            self.searchService
                .search(self.guarantor1SearchRequest, self.url.customerQuery + "/Search")
                .then(<any>successCallback, errorCallback);
        }

        selectGuarantor1(g: Customer): void {
            var self = this;
            self.model.guarantor1 = g;
            self.model.guarantor1Id = g.id;
        }

        loadGuarantor2(): void {
            var self = this;
            if (self.guarantor2SearchRequest.keyword.length < 3) {
                return;
            }
            var successCallback = (response: SearchResponse): void => {
                console.log('gurantor2s ', response);
                self.gurantor2s = <any>response.Models;
            };

            var errorCallback = (error: any): void => {
                console.log(error);
            };

            self.guarantor2SearchRequest.isIncludeParents = true;
            self.guarantor2SearchRequest["IsCustomerActive"] = true;
            self.searchService
                .search(self.guarantor2SearchRequest, self.url.customerQuery + "/Search")
                .then(<any>successCallback, errorCallback);
        }

        selectGuarantor2(g: Customer): void {
            var self = this;
            self.model.guarantor2 = g;
            self.model.guarantor2Id = g.id;
        }

        successCallbackLoadCustomer = (customer: Customer): void => {
            var self = this;
            if (customer != null) {
                console.log('customer is ', customer);
                self.customer = customer;
                self.model.customerName = self.customer.name;
                this.loadAddressesDropdown(self.customer.id);
            } else {
                self.customer = new Customer();
                alert('Could not find any customer by phone number ' + self.model.customerPhone);
            }
        };

        errorCallbackLoadCustomer = (error: any): void => {
            console.log(error);
            alert('Error occurred');
        };
        employees: Employee[];
        loadEmplyees(): void {
            var self = this;
            var successCallback = (response: any): void => {
                console.log(response);
                self.employees = response.Models;
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            self.searchRequest["role"] = "Salesman";
            self.searchService
                .search(self.searchRequest, self.url.employeeInfoQuery + "/Dropdown")
                .then(<any>successCallback, errorCallback);
        }

        employeeInfoChanged(emp: any): void {
            var self = this;
            self.model.employeeInfoId = emp.id;
            self.model.employeeInfoName = emp.text;
        }

        loadCustomer(): void {
            var self = this;
            self.customerService.loadCustomer(self.model.customerPhone)
                .then(self.successCallbackLoadCustomer, self.errorCallbackLoadCustomer);
        }

        private loadDefaultCustomer(): void {
            var self = this;
            self.model.customerPhone = "0";
            self.customerService.loadCustomer(self.model.customerPhone)
                .then(self.successCallbackLoadCustomer, self.errorCallbackLoadCustomer);
        }

        selectCustomer(selecterCustomer: Customer): void {
            var self = this;
            self.customer = selecterCustomer;
            console.log(self.customer);
            self.addresses = self.customer.addresses;
        }

        loadProductDetails(): void {
            var self = this;
            console.log(self.isOnlineSale, 'self.isOnlineSale');
            if (self.productDetailSearchRequest.keyword.length < 3) {
                return;
            }

            var successCallback = (response: SearchResponse): void => {
                self.productDetails = <any>response.Models;
                self.productDetailsCount = response.Count;

                if (self.productDetailsCount === 1 && self.addToCartIfResultIsOne) {
                    this.addToCart2(self.productDetails[0]);
                }
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };

            self.productDetailSearchRequest["isProductActive"] = true;
            self.productDetailSearchRequest.warehouseId = self.model.warehouseId;
            // self.productDetailSearchRequest.page = -1;
            self.searchService
                .search(self.productDetailSearchRequest, self.url.productDetailQuery + "/SearchByWarehouse")
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
            var self = this;
            if (self.model.isDealerSale) {
                let dealerPriceChange = this.localStorageService.get2(LocalStorageKeys.DealerPriceChange);
                
                if (dealerPriceChange == null || dealerPriceChange != 'dealer') {
                    this.saleDetail.salePricePerUnit = detail.salePrice;
                }
                else {
                    this.saleDetail.salePricePerUnit = detail.dealerPrice;
                }
            } 
            else {
                this.saleDetail.salePricePerUnit = detail.salePrice;
            }

            this.saleDetail.productDetailId = detail.id;
            this.saleDetail.name = detail.name;
            this.saleDetail.productDetail = detail;
            this.saleDetail.quantity = 1;
            this.saleDetail.saleDetailType = SaleDetailType.Sale.toString();
            this.getPriceAndName();
        }

        //addToCart(): void {

        //    this.model.saleDetails.push(this.saleDetail);
        //    this.updateCartTotal();
        //    this.saleDetail = new SaleDetailViewModel();
        //}

        addToCart(): void {
            
            this.model.saleDetails.push(this.saleDetail);
            this.updateCartTotal();
            var self = this;
            setTimeout(function (parameters) {
                self.setFocusOnCartItem(self.saleDetail.productDetailId);
                self.saleDetail = new SaleDetailViewModel();
            }, 100);
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

        setFocusOnCartItem(rowId: string): void {
            var self = this;
            let element = this.getElement('cart-table') as HTMLTableElement;
            let tBody = element.tBodies[0];
            console.log(tBody);
            for (var i = 0; i < tBody.rows.length; i++) {
                let row = tBody.rows[i];
                if (row.id === rowId) {
                    self.quantityIsFloat = true;
                    let txtQty = self.getElement('qty-' + rowId) as HTMLInputElement;
                    txtQty.focus();
                    txtQty.select();
                }
            }
        }

        getElement(id: string): any {
            return document.getElementById(id);
        }

        editCart(p): void {
            this.saleDetail = p;
            this.removeByAttr(this.model.saleDetails, 'productDetailId', p.productDetailId);
        }

        removeByAttr(arr, attr, value): void {
            var i = arr.length;
            while (i--) {
                if (arr[i] && arr[i].hasOwnProperty(attr) && (arguments.length > 2 && arr[i][attr] === value)) {
                    arr.splice(i, 1);
                }
            }
            this.updateCartTotal();
        }

        removeFromCart(index): void {
            //this.removeByAttr(this.model.saleDetails, 'productDetailId', p.productDetailId);
            this.model.saleDetails.splice(index, 1);
            this.updateCartTotal();
        }

        decreaseFromCart(index): void {

            let quantity = this.model.saleDetails[index].quantity - 1;
            if (quantity === 0) {
                this.removeFromCart(index);
            } else {
                let salePrice = this.model.saleDetails[index].salePricePerUnit;
                let discountTotal = this.model.saleDetails[index].discountAmount
                this.model.saleDetails[index].quantity = quantity;
                this.model.saleDetails[index].total = salePrice * quantity;
                this.model.saleDetails[index].discountTotal = discountTotal * quantity;
            }

            this.updateCartTotal();
        }

        increaseToCart(index): void {
            let quantity = this.model.saleDetails[index].quantity + 1;
            let salePrice = this.model.saleDetails[index].salePricePerUnit;
            let discountTotal = this.model.saleDetails[index].discountAmount
            this.model.saleDetails[index].quantity = quantity;
            this.model.saleDetails[index].total = salePrice * quantity;
            this.model.saleDetails[index].discountTotal = discountTotal * quantity;
            this.updateCartTotal();
        }

        updateQuantity(index): void {
            let salePrice = this.model.saleDetails[index].salePricePerUnit;
            let quantity = this.model.saleDetails[index].quantity;
            this.model.saleDetails[index].quantity = quantity;
            this.model.saleDetails[index].priceTotal =
                this.model.saleDetails[index].salePricePerUnitBeforeDiscount * quantity;
            this.model.saleDetails[index].discountTotal = this.model.saleDetails[index].discountAmount * quantity;
            this.model.saleDetails[index].total = salePrice * quantity;
            this.updateCartTotal();
        }

        setFocusOnSearchBox(): void {
            var txtCustomerSearch = document.getElementById("txtCustomerSearch") as HTMLInputElement;
            txtCustomerSearch.focus();
            txtCustomerSearch.select();
            txtCustomerSearch.value = '';
        }

        setFocusOnProductSearch(): void {
            var txtProductSearch = document.getElementById("txtProductSearch") as HTMLInputElement;
            console.log(txtProductSearch);
            txtProductSearch.focus();
            txtProductSearch.select();
            txtProductSearch.value = '';
        }

        updateQuantityAll(): void {
            for (let i = 0; i < this.model.saleDetails.length; i++) {
                this.updateQuantity(i);
            }
        }

        private updateCartTotal(): void {
            var self = this;
            self.model.productAmount = 0;
            self.model.saleDetails.forEach(p => this.model.productAmount += p.total);
            self.updateTransactions();
            self.updateTotal();
        }

        applyDiscount(): void {
            var self = this;
            self.model.payableTotalAmount = self.model.totalAmount - self.model.discountAmount;
            self.model.discountPercent = Math.round((self.model.discountAmount / self.model.totalAmount) * 100);
            self.updateTransactions();
        }

        applyDiscountPercent(): void {
            var self = this;
            self.model.discountAmount = self.model.totalAmount * self.model['discountPercent'] / 100;
            self.applyDiscount();
        }

        applyItemDiscount(p: SaleDetailViewModel): void {
           
            p.discountAmount = p.salePricePerUnitBeforeDiscount * p.discountPercent / 100;
            p.salePricePerUnit = p.salePricePerUnitBeforeDiscount - p.discountAmount;
            p.priceTotal = p.salePricePerUnitBeforeDiscount * p.quantity;
            p.discountTotal = p.discountAmount * p.quantity;
            p.total = p.salePricePerUnit * p.quantity;
            this.updateQuantityAll();
        }
        applyItemDiscountPercent(p: SaleDetailViewModel): void {
            p.discountPercent = Math.round((p.discountAmount / p.salePricePerUnitBeforeDiscount) * 100 );
            p.salePricePerUnit = p.salePricePerUnitBeforeDiscount - p.discountAmount;
            p.priceTotal = p.salePricePerUnitBeforeDiscount * p.quantity;
            p.discountTotal = p.discountAmount * p.quantity;
            p.total = p.salePricePerUnit * p.quantity;
            this.updateQuantityAll();
        }
        resetItemDiscount(p: SaleDetailViewModel): void {
            p.salePricePerUnit = p.salePricePerUnitBeforeDiscount;
            p.discountPercent = 0;
            p.discountTotal = 0;
            p.discountAmount = 0;
            p.salePricePerUnitBeforeDiscount = 0;
            this.updateQuantityAll();
        }

        setFocus(id: string): void {
            var element = this.getElement(id) as HTMLInputElement;
            console.log(element);
            element.focus();
            element.select();
            //element.value = '';
            //element.focus();
        }

        calculateServiceCharge(): void {
            // service charge = (product amount + delivery charge ) * 1.85
            var self = this;
            self.model.paymentServiceChargeAmount = ((self.model.productAmount + self.model.deliveryChargeAmount) *
                self.paymentServiceChargePercent) /
                100;
            self.updateTotal();
        }

        updateTotal(): void {
            var self = this;
            self.model.totalAmount = self.model.productAmount + self.model.otherAmount +
                self.model.deliveryChargeAmount +
                self.model.paymentServiceChargeAmount;
            self.model.payableTotalAmount = self.model.totalAmount - self.model.discountAmount;
            self.model.dueAmount = self.model.payableTotalAmount - self.model.paidAmount;
        }

        save(): void {

            var self = this;
            if (self.customer.name.length === 0 || self.customer.phone.length === 0) {
                self.customer.phone = "0";
                self.customer.name = "Annonymous";
            }

            if (!self.model.isDealerSale) {
                self.model.customerPhone = self.customer.phone;
                self.model.customerName = self.customer.name;
            }

            if (self.model.saleDetails.length === 0) {
                alert("Your shopping cart is empty. Please add some products and then save");
                self.shouldPrint = false;
                return;
            }

            var successCallback = (response: BaseResponse): void => {
                console.log(response);
                if (self.shouldPrint) {
                    self.print(response.data.id.toString());
                } else {
                    if (self.showOrderNumber) {
                        alert("Order number : " + response.data.orderNumber.toString());
                    }
                    self.activate();
                    self.shouldPrint = false;
                }
            };

            var errorCallback = (error: any): void => {
                console.log(error);
                if (error.status === 500) {
                    alert(error.data.exceptionMessage);
                } else {
                    alert(error.data.message);
                }
                self.shouldPrint = false;
            };

            for (var i = 0; i < self.model.saleDetails.length; i++) {
                self.model.saleDetails[i].productDetail = null;
                self.model.saleDetails[i].created = new Date().toDateString();
                self.model.saleDetails[i].modified = new Date().toDateString();
                self.model.saleDetails[i].createdBy = self.authService.accountInfo.userName;
                self.model.saleDetails[i].createdFrom = "Browser";
                self.model.saleDetails[i].modifiedBy = self.authService.accountInfo.userName;
                self.model.saleDetails[i].id = "1";
                self.model.saleDetails[i].shopId =
                    self.model.saleDetails[i].shopId != null ? self.model.saleDetails[i].shopId : "1";
                if (self.model.saleDetails[i].saleDetailType == "0") {
                    self.model.saleDetails[i].saleDetailType = "Sale";
                }
            }

            for (var j = 0; j < self.model.transactions.length; j++) {
                self.model.transactions[j].created = new Date().toDateString();
                self.model.transactions[j].modified = new Date().toDateString();
                self.model.transactions[j].createdBy = self.authService.accountInfo.userName;
                self.model.transactions[j].createdFrom = "Browser";
                self.model.transactions[j].modifiedBy = self.authService.accountInfo.userName;
                self.model.transactions[j].id = "1";
                self.model.transactions[j].shopId =
                    self.model.transactions[j].shopId != null ? self.model.transactions[j].shopId : "1";
                self.model.transactions[j].accountHeadId = "1";
                self.model.transactions[j].accountHeadName = "1";
                self.model.transactions[j].parentId = "1";
                self.model.transactions[j].paymentGatewayServiceName =
                    self.model.transactions[j].paymentGatewayServiceName;
                self.model.transactions[j].transactionMediumName = self.model.transactions[j].transactionMedium;
                self.model.transactions[j].accountInfoId = self.model.transactions[j].accountInfoId;
            }

            if (!self.isOnlineSale) {
                self.model.saleChannel = SaleChannel.InHouse;
                self.model.saleFrom = SaleFrom.BizBook365.toString();
                self.model.requiredDeliveryDateByCustomer = new Date().toDateString();
                self.model.orderDate = new Date().toDateString();
            }

            self.model.paymentMethod = "Cash";
            self.model.customer = null;
            self.model.customerId = self.customer.id;
            self.model.orderNumber = "1";
            self.address.customerId = self.model.customerId;
            
            self.model.guarantor1 = null;
            self.model.guarantor2 = null;

            if (self.address.id === "00000000-0000-0000-0000-000000000000") {
                self.model.address = self.address;
                if (self.model.address.thana === "null") {
                    self.model.address.thana = "";
                }
            } else {
                self.model.addressId = self.address.id;
            }

            self.model['employeeInfo'] = null;

            if (self.installment.cashPriceAmount > 0) {
                self.model.installment = self.installment;
                if (self.model.installment.installmentDetails && self.model.installment.installmentDetails.length > 0) {
                    for (let k = 0; k < self.model.installment.installmentDetails.length; k++) {
                        self.model.installment.installmentDetails[k].created = new Date().toDateString();
                        self.model.installment.installmentDetails[k].modified = new Date().toDateString();
                        self.model.installment.installmentDetails[k].createdBy = self.authService.accountInfo.userName;
                        self.model.installment.installmentDetails[k].createdFrom = "Browser";
                        self.model.installment.installmentDetails[k].modifiedBy = self.authService.accountInfo.userName;
                        self.model.installment.installmentDetails[k].id = "1";
                        self.model.installment.installmentDetails[k].shopId =
                            self.model.installment.installmentDetails[k].shopId != null ? self.model.installment.installmentDetails[k].shopId : "1";
                    }
                }
            }

            // setting delivery charge amount to local storage
            self.localStorageService.save(LocalStorageKeys.DeliveryChargeAmount, self.model.deliveryChargeAmount);
            //    self.loadOrderNumber();
            self.saveService.save(self.model, self.commandUrl + "/Add")
                .then(<any>successCallback, errorCallback);
        }

        saveComplete(): void {
            var self = this;
            self.model.orderState = OrderState.Completed;
            // self.shouldPrint = true;
            self.save();
        }

        // local configuration
        shouldPrint: boolean = false;
        showOrderNumber: boolean;
        addToCartIfResultIsOne: boolean = false;

        saveAndPrint(): void {
            var self = this;
            self.model.orderState = OrderState.Completed;
            this.shouldPrint = true;
            this.save();
        }



        printModel: SaleViewModel;
        print(id: string) {
            var self = this;
            self.printModel = new SaleViewModel();
            var successCallback = (response: SearchResponse): void => {
                self.printModel = response.data;
                setTimeout(function (p) {
                    var printContents = document.getElementById("receipt").innerHTML;
                    let baseUrl = document.location.host + self.url.clientSubFolder;
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
                        //return '';
                    };
                    popupWin.onabort = function (event) {
                        popupWin.document.close();
                        popupWin.close();
                    }

                    setTimeout(function () {
                        popupWin.print();
                    }, 1000);
                },
                    1000);
                self.activate();
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };

            var searchRequest = new SearchRequest();
            searchRequest.id = this.stateParams["id"];
            searchRequest.page = -1;
            var httpUrl = self.url.saleQuery + "/Receipt?id=" + id;
            self.searchService.search(null, httpUrl).then(<any>successCallback, errorCallback);
        }

        resetOrderCustomer(): void {
            this.customer = new Customer();
            this.customerSearchRequest.keyword = "";
            this.customers = [];
            this.addresses = [];
            this.address = new CustomerAddress();

        }

        resetOrderDealer(): void {
            this.dealer = new Dealer();
            this.dealerSearchRequest.keyword = "";
            this.dealers = [];
        }


        resetCustomer(): void {
            this.customer.name = "";
            this.customer.phone = "";
        }


        resetAddress(): void {
            this.address = new CustomerAddress();
        }

        activate(): void {
            console.log('im in child activate. ');
            super.activate();
            this.customer = new Customer();
            this.installment = new Installment();
            this.installmentDetail = new InstallmentDetail();
            this.addresses = [];
            this.address = new CustomerAddress();
            this.customerSearchRequest = new SearchRequest();
            //this.loadCustomers();
            this.productDetailSearchRequest = new SearchRequest();
            this.model = new SaleViewModel();
            //this.loadOrderNumber();
            this.model.saleFrom = SaleFrom.Facebook.toString();
            this.model.saleChannel = SaleChannel.InHouse;
            this.saleDetail = new SaleDetailViewModel();

            //this.loadProductDetails();
            this.setupDropdowns();
            this.selectedAccountInfo = new AccountInfo();
            this.loadAccountInfos();
            this.productDetails = [];
            this.resetOrderCustomer();
            this.dealer = new Dealer();
            this.dealerSearchRequest = new SearchRequest();
            this.setupLocalConfiguration();
            let self = this;            
            this.loadWarehouses().then(warehouses => {
                if (self.user.warehouseId) {
                    self.model.warehouseId = self.user.warehouseId;
                }
                else
                {
                    self.model.warehouseId = warehouses[0].id;
                }                
            });
        }

        setupLocalConfiguration(): void {
            var self = this;
            if (self.localStorageService == null) {
                console.log('activation not completed');
                return;
            }

            // getting delivery charge amount from local storage
            self.model.deliveryChargeAmount = 0;
            if (self.isOnlineSale) {
               // console.log('i am in isonlinesale logic', self.isOnlineSale);
                var deliveryChargeAmount = self.localStorageService.get(LocalStorageKeys.DeliveryChargeAmount);
                if (!deliveryChargeAmount) {
                    deliveryChargeAmount = 0;
                    self.localStorageService.save(LocalStorageKeys.DeliveryChargeAmount, 0);
                }

                self.model.deliveryChargeAmount = <number>(deliveryChargeAmount);
            }

            self.showOrderNumber = <boolean>self.localStorageService.get(LocalStorageKeys.ShowOrderNumberAfterSave);

            self.addToCartIfResultIsOne = <boolean>self.localStorageService.get(LocalStorageKeys.AddToCartIfResultIsOne);
        }

        activateDealerSale(): void {
            var self = this;
            self.model.isDealerSale = true;
            self.model.orderState = OrderState.Completed;
        }

        activateOnlineSale(): void {
            var self = this;
            self.isOnlineSale = true;
            self.model.saleFrom = SaleFrom.Facebook.toString();
        }


        transactionFors: string[];
        transactionWiths: string[];
        transactionMediums: string[];
        paymentGatewayServices: string[];
        transactionFlowTypes: string[];
        accountHeads: any[];
        accountInfoTypes: any[];
        accountInfoType: any;
        saleDetailType:any;
        paymentGatewayService: any;
        transaction: Transaction;

        setupDropdowns(): void {
            var self = this;

            var success = (response: any) => {
                console.log(response);
                self.transactionMediums = response.transactionMediums;
                self.paymentGatewayServices = response.paymentGatewayServices;
                self.accountInfoTypes = response.accountInfoTypes;
                self.transactionFors = response.transactionFors;
                self.transactionWiths = response.transactionWiths;
                self.transactionFlowTypes = response.transactionFlowTypes;
                self.transaction = new Transaction();
                self.transaction.transactionMedium = "Cash";
                self.transaction.paymentGatewayService = "Cash";
                self.transaction.paymentGatewayServiceName = "Cash";
                self.transaction.accountInfoType = "Cash";
                self.accountInfoType = "Cash";
                self.paymentGatewayService = "Cash";
                self.saleDetailType ="Sale";
            };

            var error = error => {
                console.log(error);
            };

            self.searchService.get(self.url.transactionQuery + "/Dropdowns").then(success, error);
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

        addTransaction(): void {
            var self = this;
            self.model.transactions.push(self.transaction);
            self.updateTransactions();
        }

        removeTransaction(index): void {
            var self = this;
            self.model.transactions.splice(index, 1);
            self.updateTransactions();
        }

        private updateTransactions(): void {
            var self = this;
            self.model.paidAmount = 0;
            $.each(self.model.transactions,
                function (x) {
                    let temp = this as Transaction;
                    self.model.paidAmount += temp.amount;
                });
            self.model.dueAmount = self.model.payableTotalAmount - self.model.paidAmount;
            self.transaction = new Transaction();
            self.transaction.transactionMedium = "Cash";
            self.transaction.paymentGatewayServiceName = "Cash";
            self.transaction.accountInfoType = "Cash";
            self.accountInfoChanged();
        }

        changeShowAlertState(): void {
            var self = this;
            self.localStorageService.save(LocalStorageKeys.ShowOrderNumberAfterSave, self.showOrderNumber);
        }

        changeSelectPrice(): void{
            
        }

        // online
        deliveryTypes: string[] = ["CashOnDelivery", "Courier", "Condition"];
        paymentMethods: string[] = [
            "Cash", "Cash (Sundarban)", "Cash (SA Paribahan)", "Rocket", "Bkash", "Ucash", "Mycash", "Easycash",
            "Mcash", "Other"
        ];
        orderFroms: string[] = ["Facebook", "Website", "PhoneCall", "MobileApp", "BizBook365", "Referral", "Other"];

        saleFroms: string[] = ["BizBook365", "Facebook", "Website", "PhoneCall", "MobileApp", "Referral", "Other"];
        saleChannels: string[] = ["Inhouse", "CashOnDelivery", "Courier", "Condition"];
        saleDetailTypes: string[] = ["Sale", "Damage", "Gift", "Return"];

        loadAddressesDropdown(customerId: string): void {
            var self = this;

            var successCallback = (response: SearchResponse): void => {
                console.log('addresses ', response);
                self.models = <any>response.Models;
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };

            let searchRequest = new SearchRequest();
            searchRequest.parentId = customerId;
            searchRequest["isAddressActive"] = true;
            self.searchService
                .search(searchRequest, self.url.customerAddressQuery + "/Dropdown")
                .then(<any>successCallback, errorCallback);
        }

        loadAddressDetail(p): void {
            console.log(p);
            var self = this;
            var successCallback = (response: SearchResponse): void => {
                console.log(response);
                self.address = <any>response.data;
                self.isUpdateMode = true;
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            let id = self.searchRequest["addressId"];
            console.log(id);
        }

        loadDistricts(): void {
            var self = this;
            var successCallback = (response: Location[]): void => {
                // console.log('locations in controller', response);
                self.locations = response;
                self.districts = self.customerService.loadDistricts();
                self.loadThanas();
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };

            self.customerService
                .loadLocations().then(<any>successCallback, errorCallback);
        }

        loadThanas(): void {
            var self = this;
            self.thanas = self.customerService.loadThanas(self.address.district);
            self.loadAreas();
        }

        loadAreas(): void {
            var self = this;
            self.areas = self.customerService.loadAreas(self.address.thana);
            self.address.setThana(self.address.thana);
        }

        getArea(): void {
            var self = this;
            self.address.setArea(self.address.area);
            self.area = self.customerService.getArea(self.address.area);
            self.address.postCode = self.area.postcode;
        }

        // navigation       

        navigateTo(div: string): void {
            this.$anchorScroll.yOffset = 150;
            this.location.hash(div);
            this.$anchorScroll();
        }

        keyPressed(event: any): void {
            //console.log('keypressed ', event);
            Display.log('keypressed', event);
            //shift +s
            let saveOk = event.shiftKey && event.keyCode === 83;
            if (saveOk) {
                var saleConfirmed = confirm("Do you want to save the sale?");
                if (saleConfirmed == true) {
                    this.saveAndPrint();
                }
            }

            //shift +m
            let paymentAmount = event.shiftKey && event.keyCode === 77;

            //shift +p
            let productSearch = event.shiftKey && event.keyCode === 80;

            //shift +c
            let customerSearch = event.shiftKey && event.keyCode === 67;

            var self = this;

            console.log('get key' + paymentAmount);

            if (paymentAmount) {
                let txtPayment = self.getElement('txtPaymentAmount') as HTMLInputElement;
                txtPayment.focus();
                txtPayment.value = '';
            }
            if (productSearch) {
                let txtProduct = self.getElement('txtProductSearch') as HTMLInputElement;
                txtProduct.focus();
                txtProduct.value = '';
            }
            if (customerSearch) {
                let txtCustomer = self.getElement('txtCustomerSearch') as HTMLInputElement;
                txtCustomer.focus();
                txtCustomer.value = '';
            }
        }

        calculateProfitAmount(): void {
            var self = this;
            console.log(self.installment);
            self.installment.profitAmount =
                self.installment.cashPriceAmount * self.installment.profitPercent / 100;
            self.installment.installmentTotalAmount =
                self.installment.cashPriceAmount + self.installment.profitAmount;
            self.model.otherAmount = self.installment.profitAmount;
            this.updateCartTotal();
        }

        calculateDownPaymentAmount(): void {
            var self = this;
            self.installment.downPaymentAmount = self.installment.installmentTotalAmount *
                self.installment.downPaymentPercent /
                100;
            self.installment.installmentDueAmount = self.installment.installmentTotalAmount -
                self.installment.downPaymentAmount;
        }

        calculateInstallmentPerMonth(): void {
            var self = this;
            self.installment.installmentPerMonthAmount =
                self.installment.installmentDueAmount / self.installment.installmentMonth;
        }

        calculatePriceDueAmount(): void {
            var self = this;
            self.installment.cashPriceDueAmount =
                self.installment.cashPriceAmount - self.installment.downPaymentAmount;

        }

        calculateProfitAmountPerMonth(): void {
            var self = this;
            console.log(self.installment);
            self.installment.profitAmountPerMonth =
                self.installment.cashPriceDueAmount * self.installment.profitPercent / 100;

        }

        calculateInstallmentProfitPerMonth(): void {
            var self = this;
            console.log(self.installment);
            self.installment.profitAmount = self.installment.profitAmountPerMonth * self.installment.installmentMonth;
            self.installment.installmentTotalAmount =
                self.installment.cashPriceDueAmount + self.installment.profitAmount;

            self.installment.installmentDueAmount =
                self.installment.cashPriceDueAmount + self.installment.profitAmount;
            self.installment.installmentPerMonthAmount =
                self.installment.installmentDueAmount / self.installment.installmentMonth;

        }

        installmentSaleTypeChanged(saleType): void {
            this.installment = new Installment();
            this.installmentDetail = new InstallmentDetail();
            this.installment.saleType = saleType;
        }

        addInstallmentDate(): void {
            let self = this;
            self.installment.installmentDetails.push(self.installmentDetail);
            console.log(self.installment);
            self.installmentDetail = new InstallmentDetail();
            self.installmentTotal = 0;
            $.each(self.installment.installmentDetails,
                function (x) {
                    let temp = this as InstallmentDetail;
                    self.installmentTotal += temp.scheduledAmount;
                });
        }

        removeInstallmentDetails(index): void {
            var self = this;
            self.installment.installmentDetails.splice(index, 1);
        }

        dateChanged(): void {
            var self = this;
            console.log(self.orderDate);
            self.model.orderDate = self.orderDate.toDateString();
            self.model.requiredDeliveryDateByCustomer = self.requiredDeliveryDateByCustomer.toDateString();
        }
    }

    angular.module("app").controller("SaleController", SaleController);

}