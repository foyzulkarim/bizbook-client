var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var App;
(function (App) {
    var SaleSalesmanController = /** @class */ (function (_super) {
        __extends(SaleSalesmanController, _super);
        function SaleSalesmanController(location, state, stateParams, url, search, save, authService, localStorageService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.sale, url.saleQuery, excel) || this;
            _this.orderFroms = [];
            _this.orderTypes = [];
            _this.saleFroms = [
                "All", "BizBook365", "Facebook", "Website", "PhoneCall", "MobileApp", "Referral", "Other"
            ];
            _this.saleChannels = ["All", "Inhouse", "CashOnDelivery", "Courier", "Condition"];
            _this.headers = [];
            _this.keys = [];
            //orderbyValue: string = "RequiredDeliveryDateByCustomer";
            _this.isAccendingValue = true;
            _this.totalProductAmount = 0;
            _this.totalDiscount = 0;
            _this.total = 0;
            _this.totalPaid = 0;
            _this.due = 0;
            _this.totalCost = 0;
            _this.totalProfit = 0;
            _this.localStorageService = localStorageService;
            _this.Excel = excel;
            var searchKeyword = _this.localStorageService.get(App.LocalStorageKeys.SearchKeyword);
            if (!searchKeyword) {
                searchKeyword = "";
                _this.localStorageService.save(App.LocalStorageKeys.SearchKeyword, searchKeyword);
            }
            _this.searchRequest.orderBy = "Modified";
            _this.searchRequest.isAscending = "False";
            _this.searchRequest["onlyDues"] = false;
            _this.searchRequest.keyword = searchKeyword;
            _this.searchRequest.startDate = _this.startDate.toJSON();
            _this.searchRequest.endDate = _this.endDate.toJSON();
            _this.search();
            _this.loadEmplyees();
            return _this;
        }
        SaleSalesmanController.prototype.searchOrders = function () {
            if (this.startDate != null) {
                this.searchRequest.startDate = this.startDate.toDateString();
            }
            if (this.endDate != null) {
                this.searchRequest.endDate = this.endDate.toDateString();
            }
            this.search();
        };
        SaleSalesmanController.prototype.getHeaders = function () {
            return this.headers;
        };
        SaleSalesmanController.prototype.saveSearchKeyword = function () {
            var self = this;
            self.localStorageService.save(App.LocalStorageKeys.SearchKeyword, self.searchRequest.keyword);
        };
        SaleSalesmanController.prototype.saveOrderByValue = function () {
            var self = this;
            self.localStorageService.save(App.LocalStorageKeys.OrderByKeyword, self.searchRequest.orderBy);
            self.localStorageService.save(App.LocalStorageKeys.IsAscendingValue, self.searchRequest.isAscending);
            this.search();
        };
        SaleSalesmanController.prototype.search = function () {
            var self = this;
            self.totalProductAmount = 0;
            self.totalDiscount = 0;
            self.totalPaid = 0;
            self.total = 0;
            self.totalProfit = 0;
            self.totalCost = 0;
            self.due = 0;
            var successCallback = function (response) {
                console.log(response);
                self.models = response.Models;
                if (self.models.length === 0) {
                    console.log('No search result found');
                }
                else {
                    //vm.searchRequest.keyword
                    //super.ensureKeysAreSaved(LocalStorageKeys.SaleListGridKeys, self.models[0]);
                    self.ensureKeysAreSaved(App.LocalStorageKeys.SaleListGridKeys, self.models[0]);
                    self.generateCsvModels();
                    for (var i = 0; i < self.models.length; i++) {
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
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService
                .search(self.searchRequest, self.queryUrl + "/Search")
                .then(successCallback, errorCallback);
        };
        SaleSalesmanController.prototype.loadData = function () {
            this.searchRequest.startDate = this.startDate.toJSON();
            this.searchRequest.endDate = this.endDate.toJSON();
            this.search();
        };
        SaleSalesmanController.prototype.loadEmplyees = function () {
            var self = this;
            var successCallback = function (response) {
                console.log(response);
                self.employees = response.Models;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            var dropdownSearchRequest = new App.SearchRequest("");
            dropdownSearchRequest["role"] = "Salesman";
            self.searchService
                .search(dropdownSearchRequest, self.url.employeeInfoQuery + "/Dropdown")
                .then(successCallback, errorCallback);
        };
        SaleSalesmanController.prototype.employeeInfoChanged = function (emp) {
            var self = this;
            self.model.employeeInfoId = emp.id;
            self.model.employeeInfoName = emp.text;
            self.searchRequest['SalesmanId'] = emp.id;
            self.search();
        };
        SaleSalesmanController.prototype.goto = function (page) {
            var self = this;
            self.localStorageService.save(App.LocalStorageKeys.SaleListPageNo, page);
            _super.prototype.goto.call(this, page);
        };
        SaleSalesmanController.prototype.saveChangedState = function () {
            var self = this;
            self.localStorageService.save(App.LocalStorageKeys.OrderState, self.searchRequest["orderState"]);
            self.search();
        };
        SaleSalesmanController.prototype.updateKeys = function () {
            var self = this;
            self.localStorageService.save(App.LocalStorageKeys.SaleListGridKeys, self.keys);
            self.generateCsvModels();
        };
        SaleSalesmanController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", 'Excel'
        ];
        return SaleSalesmanController;
    }(App.BaseController));
    App.SaleSalesmanController = SaleSalesmanController;
    angular.module("app").controller("SaleSalesmanController", SaleSalesmanController);
})(App || (App = {}));
