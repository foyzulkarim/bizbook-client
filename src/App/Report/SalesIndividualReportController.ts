module App {
    export class SaleIndividualReportController extends BaseController<SaleViewModel> {
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
        orderbyValue: string = "RequiredDeliveryDateByCustomer";
        isAccendingValue: boolean = true;

        totalProductAmount = 0;
        totalDiscount = 0;
        total = 0;
        totalPaid = 0;
        due = 0;
        totalCost = 0;
        totalProfit = 0;
        totalPaidByCash = 0;
        totalPaidByOther = 0;
        
        chartLabels: string[];
        chartData: number[];

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
            this.searchRequest.isIncludeParents = true;
            this.searchRequest.orderBy = "Modified";
            this.searchRequest.isAscending = "False";
            this.searchRequest["onlyDues"] = false;
            this.searchRequest.startDate = this.startDate.toJSON();
            this.searchRequest.endDate = this.endDate.toJSON();
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
            self.totalProductAmount = 0;
            self.totalDiscount = 0;
            self.totalPaid = 0;
            self.total = 0;
            self.totalProfit = 0;
            self.totalCost = 0;
            self.due = 0;
            var successCallback = (response: SearchResponse): void => {
                console.log(response);
                self.models = <any>response.Models;
                self.chartLabels = [];
                self.chartData = [];
                if (self.models.length === 0) {
                    console.log('No search result found');
                } else {
                    //vm.searchRequest.keyword

                    //super.ensureKeysAreSaved(LocalStorageKeys.SaleListGridKeys, self.models[0]);
                    self.ensureKeysAreSaved(LocalStorageKeys.SaleListGridKeys, self.models[0]);
                    self.generateCsvModels();

                    for (let i = 0; i < self.models.length; i++) {
                        self.totalProductAmount += self.models[i].productAmount;
                        self.totalDiscount += self.models[i].discountAmount;
                        self.totalPaid += self.models[i].paidAmount;
                        self.total += self.models[i].payableTotalAmount;
                        self.totalCost += self.models[i].costAmount;
                        self.due += self.models[i].dueAmount;
                        self.totalProfit += self.models[i].profitAmount;
                        self.totalPaidByCash += self.models[i].paidByCashAmount;
                        self.totalPaidByOther += self.models[i].paidByOtherAmount;

                        self.chartLabels.push(self.models[i].orderNumber);
                        self.chartData.push(self.models[i].productAmount);
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

        updateKeys(): void {
            var self = this;
            self.localStorageService.save(LocalStorageKeys.SaleListGridKeys, self.keys);
            self.generateCsvModels();
        }
    }

    angular.module("app").controller("SaleIndividualReportController", SaleIndividualReportController);

    export class DailySalesOverviewReportController extends BaseController<any> {

        orderFroms: string[] = [];

        productAmountTotal: number = 0;
        costAmountTotal: number = 0;
        payableAmountTotal: number = 0;
        paidAmountTotal: number = 0;
        dueAmountTotal: number = 0;
        orderCountTotal: number = 0;
        averageOrderAmountTotal: number = 0;
        newCustomersCountTotal: number = 0;
        chartLabels: string[];
        chartData: number[];
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
            console.log('i m in DailySalesOverview');
            var self = this;
            self.localStorageService = localStorageService;
            this.searchRequest.startDate = this.startDate.toJSON();
            this.searchRequest.endDate = this.endDate.toJSON();

            for (var enumMember in SaleFrom) {
                if (SaleFrom.hasOwnProperty(enumMember)) {
                    var isValueProperty = parseInt(enumMember, 10) >= 0;
                    if (isValueProperty) {
                        let i = SaleFrom[enumMember];
                        this.orderFroms.push(i);
                    }
                }
            }

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
            self.productAmountTotal = 0;
            self.costAmountTotal = 0;
            self.payableAmountTotal = 0;
            self.paidAmountTotal = 0;
            self.dueAmountTotal = 0;
            self.orderCountTotal = 0;
            self.averageOrderAmountTotal = 0;
            self.newCustomersCountTotal = 0;
            var successCallback = (response: SearchResponse): void => {
                console.log(response);
                self.models = <any>response.data;
                self.chartLabels = [];
                self.chartData = [];
                if (self.models.length === 0) {
                    console.log('No search result found');
                } else {
                    //vm.searchRequest.keyword                   
                    self.generateCsvModels();
                    for (let i = 0; i < self.models.length; i++) {
                        let m = self.models[i];
                        self.productAmountTotal += m.productAmount;
                        self.costAmountTotal += m.costAmount;
                        self.payableAmountTotal += m.payableAmount;
                        self.paidAmountTotal += m.paidAmount;
                        self.dueAmountTotal += m.dueAmount;
                        self.orderCountTotal += m.orderCount;
                        self.newCustomersCountTotal += m.newCustomersCount;

                        var d = new Date(self.models[i].date);
                        self.chartLabels.push(d.toDateString());
                        self.chartData.push(self.models[i].productAmount);
                    }

                    self.averageOrderAmountTotal = self.payableAmountTotal / self.orderCountTotal;
                }

                self.totalCount = response.Count;
                self.searchRequest.totalPage = Math.ceil(response.Count / 10);

            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };

            self.searchService
                .search(self.searchRequest, self.queryUrl + "/DailySalesOverview")
                .then(<any>successCallback, errorCallback);
        }    
        
        saveChangeOrderFrom(): void {
            var self = this;
            self.localStorageService.save(LocalStorageKeys.SaleFrom, self.searchRequest["saleFrom"]);
            self.search();
        }
    }

    angular.module("app").controller("DailySalesOverviewReportController", DailySalesOverviewReportController);

    export class MonthlySalesOverviewReportController extends BaseController<any> {

        orderFroms: string[] = [];

        productAmountTotal: number = 0;
        costAmountTotal: number = 0;
        payableAmountTotal: number = 0;
        paidAmountTotal: number = 0;
        dueAmountTotal: number = 0;
        orderCountTotal: number = 0;
        averageOrderAmountTotal: number = 0;
        newCustomersCountTotal: number = 0;
        chartLabels: string[];
        chartData: number[];
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
            console.log('i m in DailySalesOverview');
            var self = this;
            self.localStorageService = localStorageService;
            this.searchRequest.startDate = this.startDate.toJSON();
            this.searchRequest.endDate = this.endDate.toJSON();

            for (var enumMember in SaleFrom) {
                if (SaleFrom.hasOwnProperty(enumMember)) {
                    var isValueProperty = parseInt(enumMember, 10) >= 0;
                    if (isValueProperty) {
                        let i = SaleFrom[enumMember];
                        this.orderFroms.push(i);
                    }
                }
            }

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
            self.productAmountTotal = 0;
            self.costAmountTotal = 0;
            self.payableAmountTotal = 0;
            self.paidAmountTotal = 0;
            self.dueAmountTotal = 0;
            self.orderCountTotal = 0;
            self.averageOrderAmountTotal = 0;
            self.newCustomersCountTotal = 0;
            var successCallback = (response: SearchResponse): void => {
                console.log(response);
                self.models = <any>response.data;
                self.chartLabels = [];
                self.chartData = [];
                if (self.models.length === 0) {
                    console.log('No search result found');
                } else {
                    //vm.searchRequest.keyword                   
                    self.generateCsvModels();
                    for (let i = 0; i < self.models.length; i++) {
                        let m = self.models[i];
                        self.productAmountTotal += m.productAmount;
                        self.costAmountTotal += m.costAmount;
                        self.payableAmountTotal += m.payableAmount;
                        self.paidAmountTotal += m.paidAmount;
                        self.dueAmountTotal += m.dueAmount;
                        self.orderCountTotal += m.orderCount;
                        self.newCustomersCountTotal += m.newCustomersCount;

                        var d = new Date(self.models[i].date);
                        self.chartLabels.push(d.toDateString());
                        self.chartData.push(self.models[i].productAmount);
                    }

                    self.averageOrderAmountTotal = self.payableAmountTotal / self.orderCountTotal;
                }
                
                self.totalCount = response.Count;
                self.searchRequest.totalPage = Math.ceil(response.Count / 10);

            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };

            self.searchService
                .search(self.searchRequest, self.queryUrl + "/MonthlySalesOverview")
                .then(<any>successCallback, errorCallback);
        }

        saveChangeOrderFrom(): void {
            var self = this;
            self.localStorageService.save(LocalStorageKeys.SaleFrom, self.searchRequest["saleFrom"]);
            self.search();
        }
    }

    angular.module("app").controller("MonthlySalesOverviewReportController", MonthlySalesOverviewReportController);

    export class YearlySalesOverviewReportController extends BaseController<any> {

        orderFroms: string[] = [];

        productAmountTotal: number = 0;
        costAmountTotal: number = 0;
        payableAmountTotal: number = 0;
        paidAmountTotal: number = 0;
        dueAmountTotal: number = 0;
        orderCountTotal: number = 0;
        averageOrderAmountTotal: number = 0;
        newCustomersCountTotal: number = 0;
        chartLabels: string[];
        chartData: number[];
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
            console.log('i m in DailySalesOverview');
            var self = this;
            self.localStorageService = localStorageService;
            this.searchRequest.startDate = this.startDate.toJSON();
            this.searchRequest.endDate = this.endDate.toJSON();

            for (var enumMember in SaleFrom) {
                if (SaleFrom.hasOwnProperty(enumMember)) {
                    var isValueProperty = parseInt(enumMember, 10) >= 0;
                    if (isValueProperty) {
                        let i = SaleFrom[enumMember];
                        this.orderFroms.push(i);
                    }
                }
            }

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
            self.productAmountTotal = 0;
            self.costAmountTotal = 0;
            self.payableAmountTotal = 0;
            self.paidAmountTotal = 0;
            self.dueAmountTotal = 0;
            self.orderCountTotal = 0;
            self.averageOrderAmountTotal = 0;
            self.newCustomersCountTotal = 0;
            var successCallback = (response: SearchResponse): void => {
                console.log(response);
                self.models = <any>response.data;
                self.chartLabels = [];
                self.chartData = [];
                if (self.models.length === 0) {
                    console.log('No search result found');
                } else {
                    //vm.searchRequest.keyword                   
                    self.generateCsvModels();
                    for (let i = 0; i < self.models.length; i++) {
                        let m = self.models[i];
                        self.productAmountTotal += m.productAmount;
                        self.costAmountTotal += m.costAmount;
                        self.payableAmountTotal += m.payableAmount;
                        self.paidAmountTotal += m.paidAmount;
                        self.dueAmountTotal += m.dueAmount;
                        self.orderCountTotal += m.orderCount;
                        self.newCustomersCountTotal += m.newCustomersCount;

                        var d = new Date(self.models[i].date);
                        self.chartLabels.push(d.toDateString());
                        self.chartData.push(self.models[i].productAmount);
                    }

                    self.averageOrderAmountTotal = self.payableAmountTotal / self.orderCountTotal;
                }

                self.totalCount = response.Count;
                self.searchRequest.totalPage = Math.ceil(response.Count / 10);

            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };

            self.searchService
                .search(self.searchRequest, self.queryUrl + "/YearlySalesOverview")
                .then(<any>successCallback, errorCallback);
        }

        saveChangeOrderFrom(): void {
            var self = this;
            self.localStorageService.save(LocalStorageKeys.SaleFrom, self.searchRequest["saleFrom"]);
            self.search();
        }
    }

    angular.module("app").controller("YearlySalesOverviewReportController", YearlySalesOverviewReportController);

    export class CustomerSearchBySaleReportController extends BaseController<any> {


        orderCountTotal: number = 0;
        payableAmountTotal: number = 0;
        paidAmountTotal: number = 0;
        dueAmountTotal: number = 0;
        averageAmountTotal: number = 0;


        chartLabels: string[];
        chartData: number[];

        // inject
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

            console.log('i m in CustomerSearchBySaleReportController');
            var self = this;
            self.localStorageService = localStorageService;

            this.searchRequest.startDate = this.startDate.toJSON();
            this.searchRequest.endDate = this.endDate.toJSON();
            this.loadWarehouses().then(result => {
                if (self.warehouses.length === 1) {
                    self.searchRequest.warehouseId = self.warehouses[0].id;
                } else {
                    let whId = self.localStorageService.get(LocalStorageKeys.WarehouseId);
                    if (whId != null) {
                        self.searchRequest.warehouseId = whId;
                    }
                }

                // implement search                 
                return self.search();
            });
        }

        search(): void {
            var self = this;
            self.orderCountTotal = 0;
            self.payableAmountTotal = 0;
            self.paidAmountTotal = 0;
            self.dueAmountTotal = 0;
            self.averageAmountTotal = 0;

            var successCallback = (response: SearchResponse): void => {
                console.log('i m in CustomerSearchBySale response: ');
                console.log(response);
                self.models = <any>response.data;

                self.chartLabels = [];
                self.chartData = [];
                if (self.models.length === 0) {
                    console.log('No search result found');
                } else {
                    //vm.searchRequest.keyword                   
                    self.generateCsvModels();

                    for (let i = 0; i < self.models.length; i++) {

                        let m = self.models[i];
                        self.orderCountTotal += m.orderCount;
                        self.payableAmountTotal += m.payableAmount;
                        self.paidAmountTotal += m.paidAmount;
                        self.dueAmountTotal += m.dueAmount;

                        self.chartLabels.push(self.models[i].customer.name);
                        self.chartData.push(self.models[i].paidAmount);
                    }

                    self.averageAmountTotal = self.payableAmountTotal / self.orderCountTotal;
                }

                self.totalCount = response.Count;
                self.searchRequest.totalPage = Math.ceil(response.Count / 10);
            };

            var errorCallback = (error: any): void => {
                console.log(error);
            };

            self.searchService
                .search(self.searchRequest, self.queryUrl + "/CustomerSearchBySale")
                .then(<any>successCallback, errorCallback);
        }


    }

    angular.module('app').controller('CustomerSearchBySaleReportController', CustomerSearchBySaleReportController);

    export class SalesByProductReportController extends BaseController<any> {


        quantityTotal: number = 0;
        costAmountTotal: number = 0;
        priceAmountTotal: number = 0;
        discountAmountTotal: number = 0;
        amountTotal: number = 0;
        paidAmountTotal: number = 0;
        dueAmountTotal: number = 0;
        saleCountTotal: number = 0;


        chartLabels: string[];
        chartData: number[];

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

            console.log("i am in SalesByProductReportController");
            var self = this;
            self.localStorageService = localStorageService
            this.searchRequest.startDate = this.startDate.toJSON();
            this.searchRequest.endDate = this.endDate.toJSON();

            this.loadWarehouses().then(result => {

                if (self.warehouses.length === 1) {

                    self.searchRequest.warehouseId = self.warehouses[0].id;

                }
                else {
                    let whId = self.localStorageService.get(LocalStorageKeys.WarehouseId);
                    if (whId != null) {
                        self.searchRequest.warehouseId = whId;
                    }
                }

                return self.search();
            });
        }

        search(): void {
            var self = this;
            self.quantityTotal = 0;
            self.priceAmountTotal = 0;
            self.discountAmountTotal = 0;
            self.amountTotal = 0;
            self.paidAmountTotal = 0;
            self.dueAmountTotal = 0;
            self.saleCountTotal = 0;

            var successCallback = (response: SearchResponse): void => {
                console.log('i m in SalesByProduct response: ');
                console.log(response);
                self.models = <any>response.data;
                self.chartLabels = [];
                self.chartData = [];

                if (self.models.length === 0) {
                    console.log('No search result found');
                } else {
                    //vm.searchRequest.keyword                   
                    self.generateCsvModels();
                    for (let i = 0; i < self.models.length; i++) {
                        let m = self.models[i];
                        self.quantityTotal += m.quantity;
                        self.costAmountTotal += m.costTotal;
                        self.priceAmountTotal += m.priceTotal;
                        self.discountAmountTotal += m.discountTotal;
                        self.amountTotal += m.total;
                        self.paidAmountTotal += m.paid;
                        self.dueAmountTotal += m.due;
                        self.saleCountTotal += m.saleCount;


                        self.chartLabels.push(self.models[i].product.name);
                        self.chartData.push(self.models[i].total);
                    }

                }

                self.totalCount = response.Count;
                self.searchRequest.totalPage = Math.ceil(response.Count / 10);
            };

            var errorCallback = (error: any): void => {
                console.log(error);
            };

            self.searchService
                .search(self.searchRequest, self.queryUrl + "/SalesByProductDetail")
                .then(<any>successCallback, errorCallback);
        }
    }

    angular.module("app").controller("SalesByProductReportController", SalesByProductReportController);

    export class SalesByProductDetailReportController extends BaseController<any> {

        quantityTotal: number = 0;
        costAmountTotal: number = 0;
        priceAmountTotal: number = 0;
        discountAmountTotal: number = 0;
        amountTotal: number = 0;
        paidAmountTotal: number = 0;
        dueAmountTotal: number = 0;
        percentTotal: number = 0;
        saleCountTotal: number = 0;


        chartLabels: string[];
        chartData: number[];

        static $inject: string[] = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", "Excel"

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

            console.log("i am in SalesByProductDetailReportController");

            var self = this;
            self.localStorageService = localStorageService;

            this.searchRequest.startDate = this.startDate.toJSON();
            this.searchRequest.endDate = this.endDate.toJSON();

            this.loadWarehouses().then(result => {
                if (self.warehouses.length === 1) {
                    self.searchRequest.warehouseId = self.warehouses[0].id;

                }
                else {
                    let whId = self.localStorageService.get(LocalStorageKeys.WarehouseId);
                    if (whId != null) {
                        self.searchRequest.warehouseId = whId;
                    }
                }

                return self.search();

            });
        }

        search(): void {
            var self = this;
            self.quantityTotal = 0;
            self.costAmountTotal = 0;
            self.priceAmountTotal = 0;
            self.discountAmountTotal = 0;
            self.amountTotal = 0;
            self.paidAmountTotal = 0;
            self.dueAmountTotal = 0;
            self.percentTotal = 0;
            self.saleCountTotal = 0;

            var successCallback = (response: SearchResponse): void => {
                console.log('i am in  SalesByProductDetail response:');
                console.log(response)
                self.models = <any>response.data;
                self.chartLabels = [];
                self.chartData = [];
                if (self.models.length === 0) {
                    console.log('No search result found');

                } else {
                    self.generateCsvModels();
                    for (let i = 0; i < self.models.length; i++) {
                        let m = self.models[i];
                        self.quantityTotal += m.quantity;
                        self.costAmountTotal += m.costTotal;
                        self.priceAmountTotal += m.priceTotal;
                        self.discountAmountTotal += m.discountTotal;
                        self.amountTotal += m.total;
                        self.paidAmountTotal += m.paid;
                        self.dueAmountTotal += m.due;
                        self.percentTotal += m.totalPercent;
                        self.saleCountTotal += m.saleCount;

                        self.chartLabels.push(self.models[i].product.name);
                        self.chartData.push(self.models[i].total);
                    }
                }
                self.totalCount = response.Count;
                self.searchRequest.totalPage = Math.ceil(response.Count / 10);
            };

            var erroCallback = (error: any) : angular.IPromise<never> => {
                console.log(error);
                return error;
            };

            self.searchService.search(self.searchRequest, self.queryUrl + "/SalesByProductDetail")
                .then<any>(successCallback, erroCallback);
        }
    }

    angular.module("app").controller("SalesByProductDetailReportController", SalesByProductDetailReportController);


    export class SalesByProductCategoryReportController extends BaseController<any> {

        quantityTotal: number = 0;
        costAmountTotal: number = 0;
        priceAmountTotal: number = 0;
        discountAmountTotal: number = 0;
        amountTotal: number = 0;
        paidAmountTotal: number = 0;
        dueAmountTotal: number = 0;
        percentTotal: number = 0;
        saleCountTotal: number = 0;

        chartLabels: string[];
        chartData: number[];

        static $inject: string[] = [

            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", "Excel"
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

            console.log("i am in SalesByProductCategoryReportController");

            var self = this;
            self.localStorageService = localStorageService;

            self.searchRequest.startDate = self.startDate.toJSON();

            self.searchRequest.endDate = self.endDate.toJSON();

            this.loadWarehouses().then(result => {

                if (self.warehouses.length === 1) {

                    self.searchRequest.warehouseId = self.warehouses[0].id;
                }

                else {
                    let whId = self.localStorageService.get(LocalStorageKeys.WarehouseId);
                    if (whId != null) {
                        self.searchRequest.warehouseId = whId;
                    }
                }
                return self.search();
            });
        }

        search(): void {
            var self = this;

            self.quantityTotal = 0;
            self.costAmountTotal = 0;
            self.priceAmountTotal = 0;
            self.discountAmountTotal = 0;
            self.amountTotal = 0;
            self.paidAmountTotal = 0;
            self.dueAmountTotal = 0;
            self.percentTotal = 0;
            self.saleCountTotal = 0;

            var successCallback = (response: SearchResponse): void => {
                console.log('i am in SalesByProductCategory response: ');
                console.log(response);
                self.models = <any>response.data;
                self.chartLabels = [];
                self.chartData = [];

                if (self.models.length === 0) {
                    console.log('No search result found');
                } else {
                    self.generateCsvModels();
                    for (let i = 0; i < self.models.length; i++) {
                        let m = self.models[i];
                        self.quantityTotal += m.quantity;
                        self.costAmountTotal += m.costTotal;
                        self.priceAmountTotal += m.priceTotal;
                        self.discountAmountTotal += m.discountTotal;
                        self.amountTotal += m.total;
                        self.paidAmountTotal += m.paid;
                        self.dueAmountTotal += m.due;
                        self.percentTotal += m.totalPercent;
                        self.saleCountTotal += m.saleCount;

                        self.chartLabels.push(self.models[i].product.name);
                        self.chartData.push(self.models[i].total);
                    }
                }
                self.totalCount = response.Count;
                self.searchRequest.totalPage = Math.ceil(response.Count / 10);
            };

            var errorCallback = (error: any): void => {
                console.log(error);
            };

            self.searchService.search(self.searchRequest, self.queryUrl + "/SalesByProductCategory")
                .then(successCallback, errorCallback);

        }

    }

    angular.module("app").controller("SalesByProductCategoryReportController", SalesByProductCategoryReportController);


    export class SalesByProductGroupReportController extends BaseController<any> {


        quantityTotal: number = 0;
        costAmountTotal: number = 0;
        priceAmountTotal: number = 0;
        discountAmountTotal: number = 0;
        amountTotal: number = 0;
        paidAmountTotal: number = 0;
        dueAmountTotal: number = 0;
        saleCountTotal: number = 0;
        percentTotal: number = 0;


        chartLabels: string[];
        chartData: number[];

        static $inject: string[] = [

            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", "Excel"

        ];

        constructor(
            location: angular.ILocationService,
            sate: angular.ui.IStateService,
            stateParams: angular.ui.IStateParamsService,
            url: UrlService,
            search: SearchService,
            save: SaveService,
            authService: AuthService,
            localStorageService: LocalStorageService,
            excel: any
        ) {
            super(location,
                sate,
                stateParams,
                url,
                search,
                save,
                authService,
                url.sale,
                url.saleQuery,
                excel

            );


            console.log("i am in SalesByProductGroupReportController");

            var self = this;
            self.localStorageService = localStorageService;
            this.searchRequest.startDate = this.startDate.toJSON();
            this.searchRequest.endDate = this.endDate.toJSON();

            this.loadWarehouses().then(result => {

                if (self.warehouses.length === 1) {
                    self.searchRequest.warehouseId = self.warehouses[0].id;
                }
                else {
                    let whId = self.localStorageService.get(LocalStorageKeys.WarehouseId);
                    if (whId != null) {
                        self.searchRequest.warehouseId = whId;
                    }
                }
                return self.search();
            });

        }

        search(): void {
            var self = this;

            self.quantityTotal = 0;
            self.costAmountTotal = 0;
            self.priceAmountTotal = 0;
            self.discountAmountTotal = 0;
            self.amountTotal = 0;
            self.paidAmountTotal = 0;
            self.dueAmountTotal = 0;
            self.percentTotal = 0;
            self.saleCountTotal = 0;


            var successCallback = (response: SearchResponse): void => {

                console.log('i am in  SalesByProductGroup response: ');
                console.log(response);
                self.models = <any>response.data;

                self.chartLabels = [];
                self.chartData = [];
                self.quantityTotal = 0;
                self.costAmountTotal = 0;
                self.priceAmountTotal = 0;
                self.discountAmountTotal = 0;
                self.amountTotal = 0;
                self.paidAmountTotal = 0;
                self.dueAmountTotal = 0;
                self.percentTotal = 0;
                self.saleCountTotal = 0;

                if (self.models.length === 0) {
                    console.log('No search result found');
                }
                else {
                    self.generateCsvModels();
                    for (let i = 0; i < self.models.length; i++) {
                        let m = self.models[i];
                        self.quantityTotal += m.quantity;
                        self.costAmountTotal += m.costTotal;
                        self.priceAmountTotal += m.priceTotal;
                        self.discountAmountTotal += m.discountTotal;
                        self.amountTotal += m.total;
                        self.paidAmountTotal += m.paid;
                        self.dueAmountTotal += m.due;
                        self.percentTotal += m.totalPercent;
                        self.saleCountTotal += m.saleCount;

                        self.chartLabels.push(self.models[i].product.name);
                        self.chartData.push(self.models[i].total);
                    }
                }

                self.totalCount = response.Count;
                self.searchRequest.totalPage = Math.ceil(response.Count / 10);
            };

            var errorCallback = (error: any): void => {

                console.log(error);
            };

            self.searchService.search(self.searchRequest, self.queryUrl + "/SalesByProductGroup")
                .then(successCallback, errorCallback);
        }    

}

angular.module("app").controller("SalesByProductGroupReportController", SalesByProductGroupReportController);

export class ChannelWiseSalesReportController extends BaseController<any> {

    productAmountTotal: number = 0;
    costAmountTotal: number = 0;
    payableAmountTotal: number = 0;
    paidAmountTotal: number = 0;
    dueAmountTotal: number = 0;
    orderCountTotal: number = 0;
    averageOrderAmountTotal: number = 0;
    newCustomersCountTotal: number = 0;
    chartLabels: string[];
    chartData: number[];
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
        
        var self = this;
        self.localStorageService = localStorageService;
        this.searchRequest.startDate = this.startDate.toJSON();
        this.searchRequest.endDate = this.endDate.toJSON();

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
        self.productAmountTotal = 0;
        self.costAmountTotal = 0;
        self.payableAmountTotal = 0;
        self.paidAmountTotal = 0;
        self.dueAmountTotal = 0;
        self.orderCountTotal = 0;
        self.averageOrderAmountTotal = 0;
        self.newCustomersCountTotal = 0;
        var successCallback = (response: SearchResponse): void => {
            console.log(response);
            self.models = <any>response.data;
            self.chartLabels = [];
            self.chartData = [];
            if (self.models.length === 0) {
                console.log('No search result found');
            } else {
                //vm.searchRequest.keyword                   
                self.generateCsvModels();
                for (let i = 0; i < self.models.length; i++) {
                    let m = self.models[i];
                    self.productAmountTotal += m.productAmount;
                    self.costAmountTotal += m.costAmount;
                    self.payableAmountTotal += m.payableAmount;
                    self.paidAmountTotal += m.paidAmount;
                    self.dueAmountTotal += m.dueAmount;
                    self.orderCountTotal += m.orderCount;
                    self.newCustomersCountTotal += m.newCustomersCount;

                    var d = new Date(self.models[i].date);
                    self.chartLabels.push(d.toDateString());
                    self.chartData.push(self.models[i].productAmount);
                }

                self.averageOrderAmountTotal = self.payableAmountTotal / self.orderCountTotal;
            }

            self.totalCount = response.Count;
            self.searchRequest.totalPage = Math.ceil(response.Count / 10);

        };
        var errorCallback = (error: any): void => {
            console.log(error);
        };

        self.searchService
            .search(self.searchRequest, self.queryUrl + "/DailySalesOverview")
            .then(<any>successCallback, errorCallback);
    }

}

angular.module("app").controller("ChannelWiseSalesReportController", ChannelWiseSalesReportController);

}
