module App {
    "use strict";


    export class PendingSalesController extends BaseController<SaleViewModel> {
        static $inject: string[] =
        [
            "$rootScope", "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", 'Excel'
        ];
        showNextState: boolean;

        saleFroms: string[] = [
            "All", "BizBook365", "Facebook", "Website", "PhoneCall", "MobileApp", "Referral", "Other"
        ];
        saleChannels: string[] = ["All", "Inhouse", "CashOnDelivery", "Courier", "Condition"];
        headers: string[] =
        [
            "id", "date", "orderNumber", "payableTotalAmount", "paidAmount", "dueAmount", "customerName",
            "customerPhone"
        ];

        total = 0;
        due = 0;
        searchDates: string[] =[] ;
        searchDate: string[] = [
            "Created", "Modified", "OrderDate"
        ];
        rootScopeService: angular.IRootScopeService;

        constructor(
            $rootScope: angular.IRootScopeService,
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

            this.rootScopeService = $rootScope;
            this.localStorageService = localStorageService;
            this.searchRequest["orderState"] = "Pending";
            //this.searchRequest["DateSearchColumn"] = this.searchDate;
            //this.searchRequest["saleFrom"] = this.saleFroms[0];
            //this.searchRequest["saleChannel"] = this.saleChannels[0];
            //this.searchRequest["thana"] = this.thanas[0];
            this.searchRequest.startDate = this.startDate.toJSON();
            this.searchRequest.endDate = this.endDate.toJSON();
            for (var enumMember in SearchDate) {
                if (SearchDate.hasOwnProperty(enumMember)) {
                    var isValueProperty = parseInt(enumMember, 10) >= 0;
                    if (isValueProperty) {
                        let i = SearchDate[enumMember];
                        this.searchDates.push(i);
                    }
                }
            }

            let searchDate1 = this.localStorageService.get(LocalStorageKeys.SearchDate);
            if (searchDate1 == null) {
                searchDate1 = this.searchDates[0];
                this.localStorageService.save(LocalStorageKeys.SearchDate, searchDate1);
            }
            this.searchRequest["dateSearchColumn"] = searchDate1;
            this.due = 0;
            this.total = 0;           

            this.setSearchKeyword();
            this.setStartDate();
            this.setEndDate();
            let page = this.localStorageService.get(LocalStorageKeys.PendingSaleListPageNo);
            if (!page) {
                this.localStorageService.save(LocalStorageKeys.PendingSaleListPageNo, 1);
                page = 1;
            }
            this.searchRequest.page = page;

            this.searchByWarehouse().then(result => {
                console.log('searched.');
            });
            this.orderStates = [
                "Created", "ReadyToDeparture", "OnTheWay", "Delivered", "Completed", "Cancel"
            ];

            this.rootScopeService.$on("orderCreated",
                data => {
                    console.info('loading pending triggered by notification hub');
                    this.search();
                });
        }
        loadData(): void {
            var self = this;
            if (this.startDate != null) {
                this.searchRequest.startDate = this.startDate.toDateString();
                self.localStorageService.save(LocalStorageKeys.startDate, self.startDate);
            }
            if (this.endDate != null) {
                this.searchRequest.endDate = this.endDate.toDateString();
                self.localStorageService.save(LocalStorageKeys.endDate, self.endDate);
            }

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

                    self.csvModels = [];
                    for (let i = 0; i < self.models.length; i++) {
                        self.total += self.models[i].totalAmount;
                        self.due += self.models[i].dueAmount;
                        self.csvModels.push(self.generateCsvModel(self.models[i]));
                    }
                }
                self.model.nextOrderState = "Created";
                self.changeStateAll(self.model.nextOrderState);
                self.totalCount = response.Count;
                self.searchRequest.totalPage = Math.ceil(response.Count / 10);
            };

            var errorCallback = (error: any): void => {
                console.log(error);
            };
            
            self.searchService.search(self.searchRequest, self.queryUrl + "/Search")
                .then(successCallback, errorCallback);
        }

        changeSearchDate(): void {
            var self = this;
            self.localStorageService.save(LocalStorageKeys.SearchDate, self.searchRequest["dateSearchColumn"]);
            self.search();
        }

        nextStateAll(): void {
            super.nextStateAll(this.models);
        }

        updateStateAll(): void {
            super.updateStateAll(this.models);
        }

        completeState(model): void {
            model.nextOrderState = OrderState.Completed;
            super.updateState(model);
        }

        cancelState(model): void {
            model.nextOrderState = OrderState.Cancel;
            super.updateState(model);
        }

        goto(page: number): void {
            var self = this;
            self.localStorageService.save(LocalStorageKeys.PendingSaleListPageNo, page);
            super.goto(page);
        }

        showReceipt(id: string): void {
            var self = this;
            let name = self.localStorageService.get2(LocalStorageKeys.ReceiptName);
            if (!name) {
                name = 'root.receipt2';
                self.localStorageService.save(LocalStorageKeys.ReceiptName, name);
            }
            self.navigateState(name, { id: id });
        }
    }

    angular.module("app").controller("PendingSalesController", PendingSalesController);

    export class CreatedSalesController extends BaseController<SaleViewModel> {
        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", 'Excel'
        ];
        showNextState: boolean;
        saleFroms: string[] = [
            "All", "BizBook365", "Facebook", "Website", "PhoneCall", "MobileApp", "Referral", "Other"
        ];
        saleChannels: string[] = ["All", "Inhouse", "CashOnDelivery", "Courier", "Condition"];
        courier: Courier;
        couriers: Courier[];
        headers: string[] =
        [
            "id", "date", "orderNumber", "payableTotalAmount", "paidAmount", "dueAmount", "customerName",
            "customerPhone"
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
            this.searchRequest["orderState"] = "Created";
            //this.searchRequest["saleFrom"] = this.saleFroms[0];
            //this.searchRequest["saleChannel"] = this.saleChannels[0];
            //this.searchRequest["thana"] = this.thanas[0];

            this.setSearchKeyword();

            this.loadCouriers();
            let page = this.localStorageService.get(LocalStorageKeys.CreatedSaleListPageNo);
            if (!page) {
                this.localStorageService.save(LocalStorageKeys.CreatedSaleListPageNo, 1);
                page = 1;
            }
            this.searchRequest.page = page;

            this.orderStates = [
                "Pending", "ReadyToDeparture", "OnTheWay", "Delivered", "Completed", "Cancel"
            ];

            this.searchByWarehouse().then(result => {
                console.log('searched.');
            });
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

                self.model.nextOrderState = "ReadyToDeparture";
                self.changeStateAll(self.model.nextOrderState);
                self.totalCount = response.Count;
                self.searchRequest.totalPage = Math.ceil(response.Count / 10);
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            self.searchService.search(self.searchRequest, self.queryUrl + "/Search")
                .then(successCallback, errorCallback);
        }

        loadCouriers(): void {
            var self = this;

            var successCallback = (response: SearchResponse): void => {
                console.log('courier' + response);
                self.couriers = <any>response.Models;
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };

            self.searchService.search(self.searchRequest, self.url.courierQuery + "/Dropdown")
                .then(<any>successCallback, errorCallback);
        }

        courierChanged(d: any): void {
            var self = this;
            for (var i = 0; i < self.models.length; i++) {
                self.models[i].courierShopId = d;
            }
            console.log('changed courier with ', d);
        }

        nextStateAll(): void {
            super.nextStateAll(this.models);
        }

        updateStateAll(): void {
            super.updateStateAll(this.models);

        }

        prevState(model): void {
            model.nextOrderState = OrderState.Pending;
            super.updateState(model);
        }

        completeState(model): void {
            model.nextOrderState = OrderState.Completed;
            super.updateState(model);
        }

        cancelState(model): void {
            model.nextOrderState = OrderState.Cancel;
            super.updateState(model);
        }

        goto(page: number): void {
            var self = this;
            self.localStorageService.save(LocalStorageKeys.CreatedSaleListPageNo, page);
            super.goto(page);
        }

        showReceipt(id: string): void {
            var self = this;
            let name = self.localStorageService.get2(LocalStorageKeys.ReceiptName);
            if (!name) {
                name = 'root.receipt2';
                self.localStorageService.save(LocalStorageKeys.ReceiptName, name);
            }
            self.navigateState(name, { id: id });
        }

    }

    angular.module("app").controller("CreatedSalesController", CreatedSalesController);


    export class ReadyToDepartureSalesController extends BaseController<SaleViewModel> {
        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", 'Excel'
        ];
        showNextState: boolean;

        saleFroms: string[] = [
            "All", "BizBook365", "Facebook", "Website", "PhoneCall", "MobileApp", "Referral", "Other"
        ];
        saleChannels: string[] = ["All", "Inhouse", "CashOnDelivery", "Courier", "Condition"];

        deliverymans: any[];
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
            this.searchRequest["orderState"] = "ReadyToDeparture";
            //this.searchRequest["saleFrom"] = this.saleFroms[0];
            //this.searchRequest["saleChannel"] = this.saleChannels[0];
            //this.searchRequest["thana"] = this.thanas[0];
            this.loadWarehouses().then(result => {
                if (this.warehouses.length == 1) {
                    this.searchRequest.warehouseId = this.warehouses[0].id;
                } else {
                    let whId = this.localStorageService.get(LocalStorageKeys.WarehouseId);
                    if (whId != null) {
                        this.searchRequest.warehouseId = whId;
                    }
                }

                return this.search();
            });
            this.orderStates = [
                "Pending", "Created", "OnTheWay", "Delivered", "Completed", "Cancel"
            ];

            this.setSearchKeyword();

            let page = this.localStorageService.get(LocalStorageKeys.ReadyToDepartureSaleListPageNo);
            if (!page) {
                this.localStorageService.save(LocalStorageKeys.ReadyToDepartureSaleListPageNo, 1);
                page = 1;
            }
            this.searchRequest.page = page;
            this.searchByWarehouse().then(result => {
                console.log('searched.');
                this.loadDeliverymans();
            });
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
                        self.total += self.models[i].payableTotalAmount;
                        self.due += self.models[i].dueAmount;
                    }
                }
                self.model.nextOrderState = "OnTheWay";
                self.changeStateAll(self.model.nextOrderState);
                self.totalCount = response.Count;
                self.searchRequest.totalPage = Math.ceil(response.Count / 10);
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            self.searchService.search(self.searchRequest, self.queryUrl + "/Search")
                .then(successCallback, errorCallback);
        }

        prevState(model): void {
            model.nextOrderState = OrderState.Created;
            super.updateState(model);
        }

        completeState(model): void {
            model.nextOrderState = OrderState.Completed;
            super.updateState(model);
        }

        cancelState(model): void {
            model.nextOrderState = OrderState.Cancel;
            super.updateState(model);
        }

        loadDeliverymans(): void {

            var self = this;
            var successCallback = (response: SearchResponse): void => {
                self.deliverymans = response.Models;
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            var request = new SearchRequest();
            request['isEmployeeActive'] = true;
            request["RoleId"] = "9e9c6351-f8a0-492f-8e9b-4098a8f889e6";
            request.warehouseId = self.searchRequest.warehouseId;
            request.page = -1;

            var httpUrl = self.url.employeeInfo + "Query" + "/Search";

            self.searchService
                .search(request, httpUrl)
                .then(<any>successCallback, errorCallback);
        }

        deliverymanChanged(d: any): void {
            var self = this;
            for (var i = 0; i < self.models.length; i++) {
                self.models[i].deliverymanId = d.id;
                self.models[i].deliverymanName = d.email;
            }
        }

        deliverymanChangedSingle(p: any): void {
            var self = this;
            for (var i = 0; i < self.deliverymans.length; i++) {
                if (self.deliverymans[i].id === p.deliverymanId) {
                    p.deliverymanName = self.deliverymans[i].email;
                    break;
                }
            }
        }

        goto(page: number): void {
            var self = this;
            self.localStorageService.save(LocalStorageKeys.ReadyToDepartureSaleListPageNo, page);
            super.goto(page);
        }

        showReceipt(id: string): void {
            var self = this;
            let name = self.localStorageService.get2(LocalStorageKeys.ReceiptName);
            if (!name) {
                name = 'root.receipt2';
                self.localStorageService.save(LocalStorageKeys.ReceiptName, name);
            }
            self.navigateState(name, { id: id });
        }
    }

    angular.module("app").controller("ReadyToDepartureSalesController", ReadyToDepartureSalesController);

    export class OnTheWaySalesController extends BaseController<SaleViewModel> {
        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", 'Excel'
        ];
        showNextState: boolean;
        saleFroms: string[] = [
            "All", "BizBook365", "Facebook", "Website", "PhoneCall", "MobileApp", "Referral", "Other"
        ];
        saleChannels: string[] = ["All", "Inhouse", "CashOnDelivery", "Courier", "Condition"];
        productAmountTotal = 0;
        totalDeliveryChargeAmount = 0;
        total = 0;
        due = 0;
        deliverymans: any[];
        items: any[];

        constructor(
            location: angular.ILocationService,
            state: angular.ui.IStateService,
            stateParams: angular.ui.IStateParamsService,
            url: UrlService,
            search: SearchService,
            save: SaveService,
            authService: AuthService,
            locationStorageService: LocalStorageService,
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
            this.localStorageService = locationStorageService;
            this.searchRequest["orderState"] = "OnTheWay";
            //this.searchRequest["saleFrom"] = this.saleFroms[0];
            //this.searchRequest["saleChannel"] = this.saleChannels[0];
            //this.searchRequest["thana"] = this.thanas[0];

            this.orderStates = [
                "Pending", "Created", "ReadyToDeparture", "Delivered", "Completed", "Cancel"
            ];

            this.setSearchKeyword();

            let page = this.localStorageService.get(LocalStorageKeys.OnTheWaySaleListPageNo);
            if (!page) {
                this.localStorageService.save(LocalStorageKeys.OnTheWaySaleListPageNo, 1);
                page = 1;
            }
            this.searchRequest.page = page;

            this.searchByWarehouse().then(result => {
                console.log('searched.');
                this.loadDeliverymans();
            });
        }

        search(): void {
            var self = this;
            this.productAmountTotal = 0;
            this.totalDeliveryChargeAmount = 0;
            this.due = 0;
            this.total = 0;

            var successCallback = (response: SearchResponse): void => {
                console.log(response);
                self.models = <any>response.Models;
                if (self.models.length === 0) {
                    console.log('No search result found');
                } else {
                    for (let i = 0; i < self.models.length; i++) {
                        self.productAmountTotal += self.models[i].productAmount;
                        self.totalDeliveryChargeAmount += self.models[i].deliveryChargeAmount;
                        self.total += self.models[i].totalAmount;
                        self.due += self.models[i].dueAmount;

                    }
                }
                self.model.nextOrderState = "Delivered";
                self.changeStateAll(self.model.nextOrderState);
                self.totalCount = response.Count;
                self.searchRequest.totalPage = Math.ceil(response.Count / 10);
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            self.searchService.search(self.searchRequest, self.queryUrl + "/Search")
                .then(successCallback, errorCallback);
        }

        nextStateAll(): void {
            super.nextStateAll(this.models);

        }

        updateStateAll(): void {
            super.updateStateAll(this.models);
        }

        prevState(model): void {
            model.nextOrderState = OrderState.ReadyToDeparture;
            super.updateState(model);
        }

        completeState(model): void {

            model.nextOrderState = OrderState.Completed;

            super.updateState(model);
        }

        cancelState(model): void {
            model.nextOrderState = OrderState.Cancel;
            super.updateState(model);
        }


        loadDeliverymans(): void {
            var self = this;
            var successCallback = (response: SearchResponse): void => {
                self.deliverymans = response.Models;
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            var request = new SearchRequest();
            request['isEmployeeActive'] = true;
            request["RoleId"] = "9e9c6351-f8a0-492f-8e9b-4098a8f889e6";
            request.warehouseId = self.searchRequest.warehouseId;
            request.page = -1;

            var httpUrl = self.url.employeeInfo + "Query" + "/Search";

            self.searchService
                .search(request, httpUrl)
                .then(<any>successCallback, errorCallback);
        }

        deliverymanChanged(d: any): void {
            var self = this;
            self.search();
        }

        goto(page: number): void {
            var self = this;
            self.localStorageService.save(LocalStorageKeys.OnTheWaySaleListPageNo, page);
            super.goto(page);
        }

        showReceipt(id: string): void {
            var self = this;
            let name = self.localStorageService.get2(LocalStorageKeys.ReceiptName);
            if (!name) {
                name = 'root.receipt2';
                self.localStorageService.save(LocalStorageKeys.ReceiptName, name);
            }
            self.navigateState(name, { id: id });
        }
    }

    angular.module("app").controller("OnTheWaySalesController", OnTheWaySalesController);

    export class OnTheWaySalesDuesController extends BaseController<SaleViewModel> {

        static $inject: string[] =
            [
                "$location", "$state", "$stateParams",
                "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", 'Excel'
            ];
        //showNextState: boolean;
        //saleFroms: string[] = [
        //    "All", "BizBook365", "Facebook", "Website", "PhoneCall", "MobileApp", "Referral", "Other"
        //];
        //saleChannels: string[] = ["All", "Inhouse", "CashOnDelivery", "Courier", "Condition"];

        productAmountTotal = 0;
        totalDeliveryChargeAmount = 0;
        total = 0;
        due = 0;
        newlyPaid = 0;
        deliverymans: any[];
        items: any[];

        transactionMediums: string[];
        paymentGatewayServices: string[];
        transaction: Transaction;
        accountInfoTypes: any[];
        accountInfoType: any;
        selectedAccountInfo: AccountInfo;
        transactionDate : Date;

        constructor(
            location: angular.ILocationService,
            state: angular.ui.IStateService,
            stateParams: angular.ui.IStateParamsService,
            url: UrlService,
            search: SearchService,
            save: SaveService,
            authService: AuthService,
            locationStorageService: LocalStorageService,
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

            this.localStorageService = locationStorageService;
            this.searchRequest["orderState"] = "OnTheWay";
            //this.searchRequest["saleFrom"] = this.saleFroms[0];
            //this.searchRequest["saleChannel"] = this.saleChannels[0];
            //this.searchRequest["thana"] = this.thanas[0];

            //this.orderStates = [
            //    "Pending", "Created", "ReadyToDeparture", "Delivered", "Completed", "Cancel"
            //];

            this.setSearchKeyword();
            
            this.searchRequest.page = -1;

            this.searchByWarehouse().then(result => {
                console.log('searched.');
                this.loadDeliverymans();
            });

            this.transaction = new Transaction();
            this.transactionDate = new Date();
            this.setupDropdowns();
            this.selectedAccountInfo = new AccountInfo();
            this.loadAccountInfos();
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

        accountInfos: any[];

        loadAccountInfos(): void {
            var self = this;
            var success = (response: any): void => {
                Display.log(response);
                self.accountInfos = response.Models;
                self.accountInfoChanged();
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

        search(): void {
            var self = this;
            this.productAmountTotal = 0;
            this.totalDeliveryChargeAmount = 0;
            this.due = 0;
            this.total = 0;

            var successCallback = (response: SearchResponse): void => {
                console.log(response);
                self.models = <any>response.Models;
                if (self.models.length === 0) {
                    console.log('No search result found');
                } else {
                    for (let i = 0; i < self.models.length; i++) {
                        self.models[i]["newlyPaid"] = 0;
                        self.productAmountTotal += self.models[i].productAmount;
                        self.totalDeliveryChargeAmount += self.models[i].deliveryChargeAmount;
                        self.total += self.models[i].totalAmount;
                        self.due += self.models[i].dueAmount;
                    }
                    self.updateNewlyPaidAmounts();
                }
                self.model.nextOrderState = "Delivered";
                self.changeStateAll(self.model.nextOrderState);
                self.totalCount = response.Count;
                self.searchRequest.totalPage = Math.ceil(response.Count / 10);
            };

            var errorCallback = (error: any): void => {
                console.log(error);
            };

            self.searchService.search(self.searchRequest, self.queryUrl + "/Search")
                .then(successCallback, errorCallback);
        }
        
        loadDeliverymans(): void {
            var self = this;
            var successCallback = (response: SearchResponse): void => {
                self.deliverymans = response.Models;
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            var request = new SearchRequest();
            request['isEmployeeActive'] = true;
            request["RoleId"] = "9e9c6351-f8a0-492f-8e9b-4098a8f889e6";
            request.warehouseId = self.searchRequest.warehouseId;
            request.page = -1;

            var httpUrl = self.url.employeeInfo + "Query" + "/Search";

            self.searchService
                .search(request, httpUrl)
                .then(<any>successCallback, errorCallback);
        }

        deliverymanChanged(d: any): void {
            var self = this;
            self.search();
        }

        goto(page: number): void {
            var self = this;
            self.localStorageService.save(LocalStorageKeys.OnTheWaySaleListPageNo, page);
            super.goto(page);
        }

        showReceipt(id: string): void {
            var self = this;
            let name = self.localStorageService.get2(LocalStorageKeys.ReceiptName);
            if (!name) {
                name = 'root.receipt2';
                self.localStorageService.save(LocalStorageKeys.ReceiptName, name);
            }
            self.navigateState(name, { id: id });
        }

        updateNewlyPaidAmounts(): void {
            var self = this;
            self.newlyPaid = 0;
            self.models.forEach(x => {
                let m = x as any;
                console.log(m.newlyPaid);
                self.newlyPaid += m.newlyPaid;
            });
        }

        save(): void {
            var self = this;
            let payload = new SalesDuesUpdateModel();
            payload.transaction = self.transaction;
            payload.sales = self.models;

            var successCallback = (response: any): void => {
                self.transaction = new Transaction();
                self.search();
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };

            self.transaction.transactionDate = self.transactionDate.toDateString();
            
            let l = 0;
            // process and prepare data
            for (let i = 0; i < self.models.length; i++) {
                l += self.models[i]["newlyPaid"];
            }

            if (l !== self.transaction.amount) {
                alert('Transaction amount and product breakdown amount is not equal. returning');
                return;
            }

            self.saveService.save(payload, self.commandUrl + "/SalesDuesUpdate").then(<any>successCallback, errorCallback);
        }
    }

    angular.module("app").controller("OnTheWaySalesDuesController", OnTheWaySalesDuesController);


    export class DeliveredSalesController extends BaseController<SaleViewModel> {
        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", 'Excel'
        ];
        showNextState: boolean;
        saleFroms: string[] = [
            "All", "BizBook365", "Facebook", "Website", "PhoneCall", "MobileApp", "Referral", "Other"
        ];
        saleChannels: string[] = ["All", "Inhouse", "CashOnDelivery", "Courier", "Condition"];
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
            this.searchRequest["orderState"] = "Delivered";

            //this.searchRequest["saleFrom"] = this.saleFroms[0];
            //this.searchRequest["saleChannel"] = this.saleChannels[0];
            //this.searchRequest["thana"] = this.thanas[0];

            this.orderStates = [
                "Pending", "Created", "ReadyToDeparture", "OnTheWay", "Completed", "Cancel"
            ];

            this.setSearchKeyword();

            let page = this.localStorageService.get(LocalStorageKeys.DeliveredSaleListPageNo);
            if (!page) {
                this.localStorageService.save(LocalStorageKeys.DeliveredSaleListPageNo, 1);
                page = 1;
            }
            this.searchRequest.page = page;

            this.searchByWarehouse().then(result => {
                console.log('searched.');
            });

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

                self.model.nextOrderState = "Completed";
                self.changeStateAll(self.model.nextOrderState);
                self.totalCount = response.Count;
                self.searchRequest.totalPage = Math.ceil(response.Count / 10);
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            self.searchService.search(self.searchRequest, self.queryUrl + "/Search")
                .then(successCallback, errorCallback);
        }
         
        prevState(model): void {
            model.nextOrderState = OrderState.OnTheWay;
            super.updateState(model);
        }


        cancelState(model): void {
            model.nextOrderState = OrderState.Cancel;
            super.updateState(model);
        }
         
        showReceipt(id: string): void {
            var self = this;
            let name = self.localStorageService.get2(LocalStorageKeys.ReceiptName);
            if (!name) {
                name = 'root.receipt2';
                self.localStorageService.save(LocalStorageKeys.ReceiptName, name);
            }
            self.navigateState(name, { id: id });
        }
    }

    angular.module("app").controller("DeliveredSalesController", DeliveredSalesController);

    export class DeliveredProductCategoriesController extends BaseController<SaleViewModel> {

        sales: SaleViewModel[] = [];
        total: number = 0;
        due: number = 0;

        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", 'Excel'
            ];

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
            this.searchRequest["orderState"] = "Delivered";

            //this.searchRequest["saleFrom"] = this.saleFroms[0];
            //this.searchRequest["saleChannel"] = this.saleChannels[0];
            //this.searchRequest["thana"] = this.thanas[0];

            this.orderStates = [
                "Pending", "Created", "ReadyToDeparture", "OnTheWay", "Completed", "Cancel"
            ];

            this.setSearchKeyword();
         
            this.searchRequest.page = -1;       
            this.search();
        }

        search(): void {
            var self = this;
            
            var successCallback = (response: SearchResponse): void => {
                console.log(response);
                self.models = response.data;
                if (self.models.length === 0) {
                    console.log('No search result found');
                } else {
                    for (let i = 0; i < self.models.length; i++) {
                        // todo
                        self.total += self.models[i]["total"];
                        self.due += self.models[i]["due"];
                    }
                }

                self.searchRequest.totalPage = Math.ceil(response.Count / 10);
            };

            var errorCallback = (error: any): void => {
                console.log(error);
            };

            self.searchService.search(self.searchRequest, self.queryUrl + "/DeliveredProductCategories")
                .then(successCallback, errorCallback);

            var success = (response: SearchResponse): void => {
                console.log(response);
                self.sales = <SaleViewModel[]>(response.Models);
            };

            self.searchService.search(self.searchRequest, self.queryUrl + "/Search")
                .then(success, errorCallback);
        }

        updateStateAll(): void {
            super.updateStateAll(this.sales);
            this.total = 0;
            this.due = 0;
        }
    }

    angular.module('app').controller("DeliveredProductCategoriesController", DeliveredProductCategoriesController);

    export class CompletedSalesController extends BaseController<SaleViewModel> {
        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", 'Excel'
        ];
        showNextState: boolean;
        saleFroms: string[] = [
            "All", "BizBook365", "Facebook", "Website", "PhoneCall", "MobileApp", "Referral", "Other"
        ];
        saleChannels: string[] = ["All", "Inhouse", "CashOnDelivery", "Courier", "Condition"];


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
            this.searchRequest["orderState"] = "Completed";
            
            //this.searchRequest["saleFrom"] = this.saleFroms[0];
            //this.searchRequest["saleChannel"] = this.saleChannels[0];
            //this.searchRequest["thana"] = this.thanas[0];

            this.setSearchKeyword();

            let page = this.localStorageService.get(LocalStorageKeys.CompletedSaleListPageNo);
            if (!page) {
                this.localStorageService.save(LocalStorageKeys.CompletedSaleListPageNo, 1);
                page = 1;
            }
            this.searchRequest.page = page;
            this.searchByWarehouse().then(result => {
                console.log('searched.');
            });
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
            self.searchService.search(self.searchRequest, self.queryUrl + "/Search")
                .then(successCallback, errorCallback);
        }

        goto(page: number): void {
            var self = this;
            self.localStorageService.save(LocalStorageKeys.CompletedSaleListPageNo, page);
            super.goto(page);
        }

        showReceipt(id: string): void {
            var self = this;
            let name = self.localStorageService.get2(LocalStorageKeys.ReceiptName);
            if (!name) {
                name = 'root.receipt2';
                self.localStorageService.save(LocalStorageKeys.ReceiptName, name);
            }
            self.navigateState(name, { id: id });
        }
    }

    angular.module("app").controller("CompletedSalesController", CompletedSalesController);

    export class CancelledSalesController extends BaseController<SaleViewModel> {
        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", 'Excel'
        ];
        showNextState: boolean;
        saleFroms: string[] = [
            "All", "BizBook365", "Facebook", "Website", "PhoneCall", "MobileApp", "Referral", "Other"
        ];
        saleChannels: string[] = ["All", "Inhouse", "CashOnDelivery", "Courier", "Condition"];


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

            this.setSearchKeyword();

            this.searchRequest["orderState"] = "Cancel";
            //this.searchRequest["saleFrom"] = this.saleFroms[0];
            //this.searchRequest["saleChannel"] = this.saleChannels[0];
            //this.searchRequest["thana"] = this.thanas[0];
            this.searchByWarehouse().then(result => {
                console.log('searched.');
            });
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
            self.searchService.search(self.searchRequest, self.queryUrl + "/Search")
                .then(successCallback, errorCallback);
        }

        showReceipt(id: string): void {
            var self = this;
            let name = self.localStorageService.get2(LocalStorageKeys.ReceiptName);
            if (!name) {
                name = 'root.receipt2';
                self.localStorageService.save(LocalStorageKeys.ReceiptName, name);
            }
            self.navigateState(name, { id: id });
        }

    }

    angular.module("app").controller("CancelledSalesController", CancelledSalesController);
     
    
    export class ReadyToDepartureCouriersControllers extends BaseController<SaleViewModel> {
        //orderStates: string[] = ["ReadyToDeparture"];
        total = 0;
        due = 0;
        deliverymans: any[];

        static $inject: string[] = [
            "$location", "$state", "$stateParams", "UrlService",
            "SearchService", "SaveService", "AuthService", 'Excel'
        ];

        constructor(
            location: angular.ILocationService,
            state: angular.ui.IStateService,
            statParams: angular.ui.IStateParamsService,
            url: UrlService,
            search: SearchService,
            save: SaveService,
            authService: AuthService,
            excel: any
        ) {
            super(location,
                state,
                statParams,
                url,
                search,
                save,
                authService,
                url.sale,
                url.saleQuery,
                excel
            );
            this.searchRequest["thana"] = this.thanas[0];
            this.searchRequest["orderState"] = OrderState.ReadyToDeparture;
            //this.searchRequest["orderState"] = this.orderStates[0];
            this.couriersSearch();
        }


        couriersSearch(): void {
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
            self.searchService.search(self.searchRequest, self.queryUrl + "/SearchReadyToDeparture")
                .then(successCallback, errorCallback);
        }

        nextStateAll(): void {
            super.nextStateAll(this.models);

        }

        loadDeliverymans(): void {
            var self = this;
            var successCallback = (response: SearchResponse): void => {
                self.deliverymans = response.Models;
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            }
            var searchRequest = new SearchRequest();
            searchRequest["role"] = "DeliveryMan";
            var httpUrl = self.url.employee + "Query" + "/Search";

            self.searchService.search(searchRequest, httpUrl).then(<any>successCallback, errorCallback);


        }

        deliverymanChanged(d: any): void {
            var self = this;
            console.log("deliverymanChanged", d);
            for (var i = 0; i < self.models.length; i++) {
                self.models[i].deliverymanId = d.id;
                self.models[i].deliverymanName = d.userName;
            }
            console.log(self.models);
        }


    }

    angular.module("app").controller("ReadyToDepartureCouriersControllers", ReadyToDepartureCouriersControllers);

    export class OnTheWayCouriersController extends BaseController<SaleViewModel> {
        //orderStates: string[] = ["OnTheWay"];
        total = 0;
        due = 0;
        deliverymans: any[];
        static $inject: string[] = [
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

            this.searchRequest["thana"] = this.thanas[0];
            this.searchRequest["orderState"] = OrderState.OnTheWay;
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
            self.searchService.search(self.searchRequest, self.queryUrl + "/SearchReadyToDeparture")
                .then(successCallback, errorCallback);
        }

        nextStateAll(): void {
            super.nextStateAll(this.models);

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
            self.search();
        }


    }

    angular.module("app").controller("OnTheWayCouriersController", OnTheWayCouriersController);


    export class DeliveredCouriersController extends BaseController<SaleViewModel> {


        total = 0;
        due = 0;
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

            this.searchRequest["thana"] = this.thanas[0];
            this.searchRequest["orderState"] = OrderState.Delivered;
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
            self.searchService.search(self.searchRequest, self.queryUrl + "/SearchReadyToDeparture")
                .then(successCallback, errorCallback);
        }

        nextStateAll(): void {
            super.nextStateAll(this.models);
        }

    }

    angular.module("app").controller("DeliveredCouriersController", DeliveredCouriersController);

    export class DealerSalesController extends BaseController<SaleViewModel> {
        static $inject = [
            "$location", "$state", "$stateParams", "UrlService", "SearchService", "SaveService",
            "AuthService", "LocalStorageService",'Excel'
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
                excel);
            var self = this;
            self.localStorageService = localStorageService;
            self.searchRequest.startDate = self.startDate.toJSON();
            self.searchRequest.endDate = self.endDate.toJSON();
            this.searchRequest["orderState"] = "Completed";

            this.loadWarehouses().then(result => {
                if (self.warehouses.length === 1) {
                    self.searchRequest.warehouseId = self.warehouses[0].id;
                } else {
                    let whId = self.localStorageService.get(LocalStorageKeys.WarehouseId);
                    if (whId != null) {
                        self.searchRequest.warehouseId = whId;
                    }
                }

                return self.search();

            });
            self.search();
        }

        loadData(): void {
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
                console.log('dealer-- ' + response.Models);
                self.models = <any>response.Models;
                console.log('dealer-- ' + self.models);
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
            self.searchRequest["IsDealerSale"] = true;
            self.searchRequest.isIncludeParents = true;
            self.searchService
                .search(self.searchRequest, self.queryUrl + "/Search")
                .then(<any>successCallback, errorCallback);
        }

        receiptPrint(id: string): void {
            var self = this;
            let name = self.localStorageService.get2(LocalStorageKeys.ReceiptName);
            if (name == null) {
                name = 'root.receipt3';
                self.localStorageService.save(LocalStorageKeys.ReceiptName, name);
            }
            self.navigateState(name, { id: id });
        }
        activateDealerSale(): void {
            var self = this;
            self.model.isDealerSale = true;
        }
      
    } 

    angular.module("app").controller("DealerSalesController", DealerSalesController);

   
    export class DealerSalesCancelController extends BaseController<SaleViewModel> {

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
        updateState(): void {
            var self = this;
            var successCallback = (response: BaseResponse): void => {
                self.search();
            };
            var errorCallback = (error: any): void => {
                console.log(error);
                if (error.status === 500) {
                    alert(error.data.exceptionMessage);
                } else {
                    alert("Error Occurred. Please contact with Administrator");

                }
            };
           
            this.saveService.update(self.model, self.url.sale + "/UpdateState")
                .then(<any>successCallback, errorCallback);
        }

    }

    angular.module("app").controller("DealerSalesCancelController", DealerSalesCancelController);

    export class ProductPendingListController extends BaseController<SaleViewModel> {
        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", 'Excel'
        ];
        totalQuantity = 0;
        totalPrice = 0;
        sales: SaleViewModel[];

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

            this.search();
        }

        search(): void {
            var self = this;
            self.totalQuantity = 0;
            self.totalPrice = 0;

            var successCallback = (response: any): void => {
                Display.log('i am in pending product success callback');
                console.log(response.data);
                self.models = <any>response.data.histories;
                self.sales = response.data.sales;
                for (let j = 0; j < self.sales.length; j++) {
                    self.sales[j].nextOrderState = "Created";
                }

                for (let i = 0; i < response.data.histories.length; i++) {

                    self.totalQuantity += response.data.histories[i].quantity;
                    self.totalPrice += response.data.histories[i].total;
                }
                self.totalCount = response.Count;
                self.searchRequest.totalPage = Math.ceil(response.Count / 10);
            };

            var errorCallback = (error: any): void => {
                console.log(error);
            };

            self.searchRequest["orderState"] = "Pending";
            self.searchRequest.page = -1;
            self.searchRequest.isIncludeParents = true;

            self.searchService.search(self.searchRequest, self.queryUrl + "/PendingProducts")
                .then(successCallback, errorCallback);
        }

        updateStateAll(): void {
            super.updateStateAll(this.sales);
        }
    }

    angular.module("app").controller("ProductPendingListController", ProductPendingListController);

    export class WareHouseWiseProductPendingListController extends BaseController<SaleViewModel> {
        static $inject: string[] =
            [
                "$location", "$state", "$stateParams",
                "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", 'Excel'
            ];
        totalQuantity = 0;
        totalPrice = 0;
        totalOnHand = 0;
        sales: SaleViewModel[];

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

            this.search();
        }

        search(): void {
            var self = this;
            self.totalQuantity = 0;
            self.totalPrice = 0;
            self.totalOnHand =0;
            var successCallback = (response: any): void => {
                Display.log('i am in pending product success callback');
                console.log(response.data);
                self.models = <any>response.data.histories;
                self.sales = response.data.sales;
                for (let j = 0; j < self.sales.length; j++) {
                    self.sales[j].nextOrderState = "Created";
                }

                for (let i = 0; i < response.data.histories.length; i++) {

                    self.totalQuantity += response.data.histories[i].quantity;
                    self.totalPrice += response.data.histories[i].total;
                    self.totalOnHand += response.data.histories[i].onHand;
                }
                self.totalCount = response.Count;
                self.searchRequest.totalPage = Math.ceil(response.Count / 10);
            };

            var errorCallback = (error: any): void => {
                console.log(error);
            };

            self.searchRequest["orderState"] = "Pending";
            self.searchRequest.page = -1;
            self.searchRequest.isIncludeParents = true;

            self.searchService.search(self.searchRequest, self.queryUrl + "/PendingProducts")
                .then(successCallback, errorCallback);
        }

        updateStateAll(): void {
            super.updateStateAll(this.sales);
        }
    }

    angular.module("app").controller("WareHouseWiseProductPendingListController", WareHouseWiseProductPendingListController);
}