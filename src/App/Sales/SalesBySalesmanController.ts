module App {

    export class SaleSalesmanController extends BaseController<SaleViewModel> {
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
        //orderbyValue: string = "RequiredDeliveryDateByCustomer";
        isAccendingValue: boolean = true;

        totalProductAmount = 0;
        totalDiscount = 0;
        total = 0;
        totalPaid = 0;
        due = 0;
        totalCost = 0;
        totalProfit = 0;
        Excel: any;

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

            let searchKeyword = this.localStorageService.get(LocalStorageKeys.SearchKeyword);
            if (!searchKeyword) {
                searchKeyword = "";
                this.localStorageService.save(LocalStorageKeys.SearchKeyword, searchKeyword);
            }
            
            this.searchRequest.orderBy = "Modified";
            this.searchRequest.isAscending = "False";
            this.searchRequest["onlyDues"] = false;
            this.searchRequest.keyword = searchKeyword;
            this.searchRequest.startDate = this.startDate.toJSON();
            this.searchRequest.endDate = this.endDate.toJSON();
            this.search();
            this.loadEmplyees();
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

        loadData(): void {
            this.searchRequest.startDate = this.startDate.toJSON();
            this.searchRequest.endDate = this.endDate.toJSON();
            this.search();
        }

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
            let dropdownSearchRequest: SearchRequest = new SearchRequest("");
            dropdownSearchRequest["role"] = "Salesman";
            self.searchService
                .search(dropdownSearchRequest, self.url.employeeInfoQuery + "/Dropdown")
                .then(<any>successCallback, errorCallback);
        }

        employeeInfoChanged(emp: any): void {
            var self = this;
            self.model.employeeInfoId = emp.id;
            self.model.employeeInfoName = emp.text;
            self.searchRequest['SalesmanId'] = emp.id;
            self.search();
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
    angular.module("app").controller("SaleSalesmanController", SaleSalesmanController)

}