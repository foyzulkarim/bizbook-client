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
    var SaleIndividualReportController = /** @class */ (function (_super) {
        __extends(SaleIndividualReportController, _super);
        function SaleIndividualReportController(location, state, stateParams, url, search, save, authService, localStorageService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.sale, url.saleQuery, excel) || this;
            _this.orderFroms = [];
            _this.orderTypes = [];
            _this.saleFroms = [
                "All", "BizBook365", "Facebook", "Website", "PhoneCall", "MobileApp", "Referral", "Other"
            ];
            _this.saleChannels = ["All", "Inhouse", "CashOnDelivery", "Courier", "Condition"];
            _this.headers = [];
            _this.keys = [];
            _this.orderbyValue = "RequiredDeliveryDateByCustomer";
            _this.isAccendingValue = true;
            _this.totalProductAmount = 0;
            _this.totalDiscount = 0;
            _this.total = 0;
            _this.totalPaid = 0;
            _this.due = 0;
            _this.totalCost = 0;
            _this.totalProfit = 0;
            _this.totalPaidByCash = 0;
            _this.totalPaidByOther = 0;
            _this.localStorageService = localStorageService;
            _this.Excel = excel;
            _this.searchRequest.isIncludeParents = true;
            _this.searchRequest.orderBy = "Modified";
            _this.searchRequest.isAscending = "False";
            _this.searchRequest["onlyDues"] = false;
            _this.searchRequest.startDate = _this.startDate.toJSON();
            _this.searchRequest.endDate = _this.endDate.toJSON();
            _this.loadWarehouses().then(function (result) {
                if (_this.warehouses.length == 1) {
                    _this.searchRequest.warehouseId = _this.warehouses[0].id;
                }
                else {
                    var whId = _this.localStorageService.get(App.LocalStorageKeys.WarehouseId);
                    if (whId != null) {
                        _this.searchRequest.warehouseId = whId;
                    }
                }
                return _this.search();
            });
            return _this;
        }
        SaleIndividualReportController.prototype.loadData = function () {
            if (this.startDate != null) {
                this.searchRequest.startDate = this.startDate.toDateString();
            }
            if (this.endDate != null) {
                this.searchRequest.endDate = this.endDate.toDateString();
            }
            this.search();
        };
        SaleIndividualReportController.prototype.getHeaders = function () {
            return this.headers;
        };
        SaleIndividualReportController.prototype.saveSearchKeyword = function () {
            var self = this;
            self.localStorageService.save(App.LocalStorageKeys.SearchKeyword, self.searchRequest.keyword);
        };
        SaleIndividualReportController.prototype.saveOrderByValue = function () {
            var self = this;
            self.localStorageService.save(App.LocalStorageKeys.OrderByKeyword, self.searchRequest.orderBy);
            self.localStorageService.save(App.LocalStorageKeys.IsAscendingValue, self.searchRequest.isAscending);
            this.search();
        };
        SaleIndividualReportController.prototype.search = function () {
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
                self.chartLabels = [];
                self.chartData = [];
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
                        self.totalPaidByCash += self.models[i].paidByCashAmount;
                        self.totalPaidByOther += self.models[i].paidByOtherAmount;
                        self.chartLabels.push(self.models[i].orderNumber);
                        self.chartData.push(self.models[i].productAmount);
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
        SaleIndividualReportController.prototype.goto = function (page) {
            var self = this;
            self.localStorageService.save(App.LocalStorageKeys.SaleListPageNo, page);
            _super.prototype.goto.call(this, page);
        };
        SaleIndividualReportController.prototype.saveChangedState = function () {
            var self = this;
            self.localStorageService.save(App.LocalStorageKeys.OrderState, self.searchRequest["orderState"]);
            self.search();
        };
        SaleIndividualReportController.prototype.updateKeys = function () {
            var self = this;
            self.localStorageService.save(App.LocalStorageKeys.SaleListGridKeys, self.keys);
            self.generateCsvModels();
        };
        SaleIndividualReportController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", 'Excel'
        ];
        return SaleIndividualReportController;
    }(App.BaseController));
    App.SaleIndividualReportController = SaleIndividualReportController;
    angular.module("app").controller("SaleIndividualReportController", SaleIndividualReportController);
    var DailySalesOverviewReportController = /** @class */ (function (_super) {
        __extends(DailySalesOverviewReportController, _super);
        function DailySalesOverviewReportController(location, state, stateParams, url, search, save, authService, localStorageService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.sale, url.saleQuery, excel) || this;
            _this.orderFroms = [];
            _this.productAmountTotal = 0;
            _this.costAmountTotal = 0;
            _this.payableAmountTotal = 0;
            _this.paidAmountTotal = 0;
            _this.dueAmountTotal = 0;
            _this.orderCountTotal = 0;
            _this.averageOrderAmountTotal = 0;
            _this.newCustomersCountTotal = 0;
            console.log('i m in DailySalesOverview');
            var self = _this;
            self.localStorageService = localStorageService;
            _this.searchRequest.startDate = _this.startDate.toJSON();
            _this.searchRequest.endDate = _this.endDate.toJSON();
            for (var enumMember in App.SaleFrom) {
                if (App.SaleFrom.hasOwnProperty(enumMember)) {
                    var isValueProperty = parseInt(enumMember, 10) >= 0;
                    if (isValueProperty) {
                        var i = App.SaleFrom[enumMember];
                        _this.orderFroms.push(i);
                    }
                }
            }
            _this.loadWarehouses().then(function (result) {
                if (self.warehouses.length === 1) {
                    self.searchRequest.warehouseId = self.warehouses[0].id;
                }
                else {
                    var whId = self.localStorageService.get(App.LocalStorageKeys.WarehouseId);
                    if (whId != null) {
                        self.searchRequest.warehouseId = whId;
                    }
                }
                return self.search();
            });
            return _this;
        }
        DailySalesOverviewReportController.prototype.loadData = function () {
            if (this.startDate != null) {
                this.searchRequest.startDate = this.startDate.toDateString();
            }
            if (this.endDate != null) {
                this.searchRequest.endDate = this.endDate.toDateString();
            }
            this.search();
        };
        DailySalesOverviewReportController.prototype.search = function () {
            var self = this;
            self.productAmountTotal = 0;
            self.costAmountTotal = 0;
            self.payableAmountTotal = 0;
            self.paidAmountTotal = 0;
            self.dueAmountTotal = 0;
            self.orderCountTotal = 0;
            self.averageOrderAmountTotal = 0;
            self.newCustomersCountTotal = 0;
            var successCallback = function (response) {
                console.log(response);
                self.models = response.data;
                self.chartLabels = [];
                self.chartData = [];
                if (self.models.length === 0) {
                    console.log('No search result found');
                }
                else {
                    //vm.searchRequest.keyword                   
                    self.generateCsvModels();
                    for (var i = 0; i < self.models.length; i++) {
                        var m = self.models[i];
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
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService
                .search(self.searchRequest, self.queryUrl + "/DailySalesOverview")
                .then(successCallback, errorCallback);
        };
        DailySalesOverviewReportController.prototype.saveChangeOrderFrom = function () {
            var self = this;
            self.localStorageService.save(App.LocalStorageKeys.SaleFrom, self.searchRequest["saleFrom"]);
            self.search();
        };
        DailySalesOverviewReportController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", 'Excel'
        ];
        return DailySalesOverviewReportController;
    }(App.BaseController));
    App.DailySalesOverviewReportController = DailySalesOverviewReportController;
    angular.module("app").controller("DailySalesOverviewReportController", DailySalesOverviewReportController);
    var MonthlySalesOverviewReportController = /** @class */ (function (_super) {
        __extends(MonthlySalesOverviewReportController, _super);
        function MonthlySalesOverviewReportController(location, state, stateParams, url, search, save, authService, localStorageService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.sale, url.saleQuery, excel) || this;
            _this.orderFroms = [];
            _this.productAmountTotal = 0;
            _this.costAmountTotal = 0;
            _this.payableAmountTotal = 0;
            _this.paidAmountTotal = 0;
            _this.dueAmountTotal = 0;
            _this.orderCountTotal = 0;
            _this.averageOrderAmountTotal = 0;
            _this.newCustomersCountTotal = 0;
            console.log('i m in DailySalesOverview');
            var self = _this;
            self.localStorageService = localStorageService;
            _this.searchRequest.startDate = _this.startDate.toJSON();
            _this.searchRequest.endDate = _this.endDate.toJSON();
            for (var enumMember in App.SaleFrom) {
                if (App.SaleFrom.hasOwnProperty(enumMember)) {
                    var isValueProperty = parseInt(enumMember, 10) >= 0;
                    if (isValueProperty) {
                        var i = App.SaleFrom[enumMember];
                        _this.orderFroms.push(i);
                    }
                }
            }
            _this.loadWarehouses().then(function (result) {
                if (self.warehouses.length === 1) {
                    self.searchRequest.warehouseId = self.warehouses[0].id;
                }
                else {
                    var whId = self.localStorageService.get(App.LocalStorageKeys.WarehouseId);
                    if (whId != null) {
                        self.searchRequest.warehouseId = whId;
                    }
                }
                return self.search();
            });
            return _this;
        }
        MonthlySalesOverviewReportController.prototype.loadData = function () {
            if (this.startDate != null) {
                this.searchRequest.startDate = this.startDate.toDateString();
            }
            if (this.endDate != null) {
                this.searchRequest.endDate = this.endDate.toDateString();
            }
            this.search();
        };
        MonthlySalesOverviewReportController.prototype.search = function () {
            var self = this;
            self.productAmountTotal = 0;
            self.costAmountTotal = 0;
            self.payableAmountTotal = 0;
            self.paidAmountTotal = 0;
            self.dueAmountTotal = 0;
            self.orderCountTotal = 0;
            self.averageOrderAmountTotal = 0;
            self.newCustomersCountTotal = 0;
            var successCallback = function (response) {
                console.log(response);
                self.models = response.data;
                self.chartLabels = [];
                self.chartData = [];
                if (self.models.length === 0) {
                    console.log('No search result found');
                }
                else {
                    //vm.searchRequest.keyword                   
                    self.generateCsvModels();
                    for (var i = 0; i < self.models.length; i++) {
                        var m = self.models[i];
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
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService
                .search(self.searchRequest, self.queryUrl + "/MonthlySalesOverview")
                .then(successCallback, errorCallback);
        };
        MonthlySalesOverviewReportController.prototype.saveChangeOrderFrom = function () {
            var self = this;
            self.localStorageService.save(App.LocalStorageKeys.SaleFrom, self.searchRequest["saleFrom"]);
            self.search();
        };
        MonthlySalesOverviewReportController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", 'Excel'
        ];
        return MonthlySalesOverviewReportController;
    }(App.BaseController));
    App.MonthlySalesOverviewReportController = MonthlySalesOverviewReportController;
    angular.module("app").controller("MonthlySalesOverviewReportController", MonthlySalesOverviewReportController);
    var YearlySalesOverviewReportController = /** @class */ (function (_super) {
        __extends(YearlySalesOverviewReportController, _super);
        function YearlySalesOverviewReportController(location, state, stateParams, url, search, save, authService, localStorageService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.sale, url.saleQuery, excel) || this;
            _this.orderFroms = [];
            _this.productAmountTotal = 0;
            _this.costAmountTotal = 0;
            _this.payableAmountTotal = 0;
            _this.paidAmountTotal = 0;
            _this.dueAmountTotal = 0;
            _this.orderCountTotal = 0;
            _this.averageOrderAmountTotal = 0;
            _this.newCustomersCountTotal = 0;
            console.log('i m in DailySalesOverview');
            var self = _this;
            self.localStorageService = localStorageService;
            _this.searchRequest.startDate = _this.startDate.toJSON();
            _this.searchRequest.endDate = _this.endDate.toJSON();
            for (var enumMember in App.SaleFrom) {
                if (App.SaleFrom.hasOwnProperty(enumMember)) {
                    var isValueProperty = parseInt(enumMember, 10) >= 0;
                    if (isValueProperty) {
                        var i = App.SaleFrom[enumMember];
                        _this.orderFroms.push(i);
                    }
                }
            }
            _this.loadWarehouses().then(function (result) {
                if (self.warehouses.length === 1) {
                    self.searchRequest.warehouseId = self.warehouses[0].id;
                }
                else {
                    var whId = self.localStorageService.get(App.LocalStorageKeys.WarehouseId);
                    if (whId != null) {
                        self.searchRequest.warehouseId = whId;
                    }
                }
                return self.search();
            });
            return _this;
        }
        YearlySalesOverviewReportController.prototype.loadData = function () {
            if (this.startDate != null) {
                this.searchRequest.startDate = this.startDate.toDateString();
            }
            if (this.endDate != null) {
                this.searchRequest.endDate = this.endDate.toDateString();
            }
            this.search();
        };
        YearlySalesOverviewReportController.prototype.search = function () {
            var self = this;
            self.productAmountTotal = 0;
            self.costAmountTotal = 0;
            self.payableAmountTotal = 0;
            self.paidAmountTotal = 0;
            self.dueAmountTotal = 0;
            self.orderCountTotal = 0;
            self.averageOrderAmountTotal = 0;
            self.newCustomersCountTotal = 0;
            var successCallback = function (response) {
                console.log(response);
                self.models = response.data;
                self.chartLabels = [];
                self.chartData = [];
                if (self.models.length === 0) {
                    console.log('No search result found');
                }
                else {
                    //vm.searchRequest.keyword                   
                    self.generateCsvModels();
                    for (var i = 0; i < self.models.length; i++) {
                        var m = self.models[i];
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
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService
                .search(self.searchRequest, self.queryUrl + "/YearlySalesOverview")
                .then(successCallback, errorCallback);
        };
        YearlySalesOverviewReportController.prototype.saveChangeOrderFrom = function () {
            var self = this;
            self.localStorageService.save(App.LocalStorageKeys.SaleFrom, self.searchRequest["saleFrom"]);
            self.search();
        };
        YearlySalesOverviewReportController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", 'Excel'
        ];
        return YearlySalesOverviewReportController;
    }(App.BaseController));
    App.YearlySalesOverviewReportController = YearlySalesOverviewReportController;
    angular.module("app").controller("YearlySalesOverviewReportController", YearlySalesOverviewReportController);
    var CustomerSearchBySaleReportController = /** @class */ (function (_super) {
        __extends(CustomerSearchBySaleReportController, _super);
        function CustomerSearchBySaleReportController(location, state, stateParams, url, search, save, authService, localStorageService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.sale, url.saleQuery, excel) || this;
            _this.orderCountTotal = 0;
            _this.payableAmountTotal = 0;
            _this.paidAmountTotal = 0;
            _this.dueAmountTotal = 0;
            _this.averageAmountTotal = 0;
            console.log('i m in CustomerSearchBySaleReportController');
            var self = _this;
            self.localStorageService = localStorageService;
            _this.searchRequest.startDate = _this.startDate.toJSON();
            _this.searchRequest.endDate = _this.endDate.toJSON();
            _this.loadWarehouses().then(function (result) {
                if (self.warehouses.length === 1) {
                    self.searchRequest.warehouseId = self.warehouses[0].id;
                }
                else {
                    var whId = self.localStorageService.get(App.LocalStorageKeys.WarehouseId);
                    if (whId != null) {
                        self.searchRequest.warehouseId = whId;
                    }
                }
                // implement search                 
                return self.search();
            });
            return _this;
        }
        CustomerSearchBySaleReportController.prototype.search = function () {
            var self = this;
            self.orderCountTotal = 0;
            self.payableAmountTotal = 0;
            self.paidAmountTotal = 0;
            self.dueAmountTotal = 0;
            self.averageAmountTotal = 0;
            var successCallback = function (response) {
                console.log('i m in CustomerSearchBySale response: ');
                console.log(response);
                self.models = response.data;
                self.chartLabels = [];
                self.chartData = [];
                if (self.models.length === 0) {
                    console.log('No search result found');
                }
                else {
                    //vm.searchRequest.keyword                   
                    self.generateCsvModels();
                    for (var i = 0; i < self.models.length; i++) {
                        var m = self.models[i];
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
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService
                .search(self.searchRequest, self.queryUrl + "/CustomerSearchBySale")
                .then(successCallback, errorCallback);
        };
        // inject
        CustomerSearchBySaleReportController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", 'Excel'
        ];
        return CustomerSearchBySaleReportController;
    }(App.BaseController));
    App.CustomerSearchBySaleReportController = CustomerSearchBySaleReportController;
    angular.module('app').controller('CustomerSearchBySaleReportController', CustomerSearchBySaleReportController);
    var SalesByProductReportController = /** @class */ (function (_super) {
        __extends(SalesByProductReportController, _super);
        function SalesByProductReportController(location, state, stateParams, url, search, save, authService, localStorageService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.sale, url.saleQuery, excel) || this;
            _this.quantityTotal = 0;
            _this.costAmountTotal = 0;
            _this.priceAmountTotal = 0;
            _this.discountAmountTotal = 0;
            _this.amountTotal = 0;
            _this.paidAmountTotal = 0;
            _this.dueAmountTotal = 0;
            _this.saleCountTotal = 0;
            console.log("i am in SalesByProductReportController");
            var self = _this;
            self.localStorageService = localStorageService;
            _this.searchRequest.startDate = _this.startDate.toJSON();
            _this.searchRequest.endDate = _this.endDate.toJSON();
            _this.loadWarehouses().then(function (result) {
                if (self.warehouses.length === 1) {
                    self.searchRequest.warehouseId = self.warehouses[0].id;
                }
                else {
                    var whId = self.localStorageService.get(App.LocalStorageKeys.WarehouseId);
                    if (whId != null) {
                        self.searchRequest.warehouseId = whId;
                    }
                }
                return self.search();
            });
            return _this;
        }
        SalesByProductReportController.prototype.search = function () {
            var self = this;
            self.quantityTotal = 0;
            self.priceAmountTotal = 0;
            self.discountAmountTotal = 0;
            self.amountTotal = 0;
            self.paidAmountTotal = 0;
            self.dueAmountTotal = 0;
            self.saleCountTotal = 0;
            var successCallback = function (response) {
                console.log('i m in SalesByProduct response: ');
                console.log(response);
                self.models = response.data;
                self.chartLabels = [];
                self.chartData = [];
                if (self.models.length === 0) {
                    console.log('No search result found');
                }
                else {
                    //vm.searchRequest.keyword                   
                    self.generateCsvModels();
                    for (var i = 0; i < self.models.length; i++) {
                        var m = self.models[i];
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
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService
                .search(self.searchRequest, self.queryUrl + "/SalesByProductDetail")
                .then(successCallback, errorCallback);
        };
        SalesByProductReportController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", 'Excel'
        ];
        return SalesByProductReportController;
    }(App.BaseController));
    App.SalesByProductReportController = SalesByProductReportController;
    angular.module("app").controller("SalesByProductReportController", SalesByProductReportController);
    var SalesByProductDetailReportController = /** @class */ (function (_super) {
        __extends(SalesByProductDetailReportController, _super);
        function SalesByProductDetailReportController(location, state, stateParams, url, search, save, authService, localStorageService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.sale, url.saleQuery, excel) || this;
            _this.quantityTotal = 0;
            _this.costAmountTotal = 0;
            _this.priceAmountTotal = 0;
            _this.discountAmountTotal = 0;
            _this.amountTotal = 0;
            _this.paidAmountTotal = 0;
            _this.dueAmountTotal = 0;
            _this.percentTotal = 0;
            _this.saleCountTotal = 0;
            console.log("i am in SalesByProductDetailReportController");
            var self = _this;
            self.localStorageService = localStorageService;
            _this.searchRequest.startDate = _this.startDate.toJSON();
            _this.searchRequest.endDate = _this.endDate.toJSON();
            _this.loadWarehouses().then(function (result) {
                if (self.warehouses.length === 1) {
                    self.searchRequest.warehouseId = self.warehouses[0].id;
                }
                else {
                    var whId = self.localStorageService.get(App.LocalStorageKeys.WarehouseId);
                    if (whId != null) {
                        self.searchRequest.warehouseId = whId;
                    }
                }
                return self.search();
            });
            return _this;
        }
        SalesByProductDetailReportController.prototype.search = function () {
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
            var successCallback = function (response) {
                console.log('i am in  SalesByProductDetail response:');
                console.log(response);
                self.models = response.data;
                self.chartLabels = [];
                self.chartData = [];
                if (self.models.length === 0) {
                    console.log('No search result found');
                }
                else {
                    self.generateCsvModels();
                    for (var i = 0; i < self.models.length; i++) {
                        var m = self.models[i];
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
            var erroCallback = function (error) {
                console.log(error);
                return error;
            };
            self.searchService.search(self.searchRequest, self.queryUrl + "/SalesByProductDetail")
                .then(successCallback, erroCallback);
        };
        SalesByProductDetailReportController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", "Excel"
        ];
        return SalesByProductDetailReportController;
    }(App.BaseController));
    App.SalesByProductDetailReportController = SalesByProductDetailReportController;
    angular.module("app").controller("SalesByProductDetailReportController", SalesByProductDetailReportController);
    var SalesByProductCategoryReportController = /** @class */ (function (_super) {
        __extends(SalesByProductCategoryReportController, _super);
        function SalesByProductCategoryReportController(location, state, stateParams, url, search, save, authService, localStorageService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.sale, url.saleQuery, excel) || this;
            _this.quantityTotal = 0;
            _this.costAmountTotal = 0;
            _this.priceAmountTotal = 0;
            _this.discountAmountTotal = 0;
            _this.amountTotal = 0;
            _this.paidAmountTotal = 0;
            _this.dueAmountTotal = 0;
            _this.percentTotal = 0;
            _this.saleCountTotal = 0;
            console.log("i am in SalesByProductCategoryReportController");
            var self = _this;
            self.localStorageService = localStorageService;
            self.searchRequest.startDate = self.startDate.toJSON();
            self.searchRequest.endDate = self.endDate.toJSON();
            _this.loadWarehouses().then(function (result) {
                if (self.warehouses.length === 1) {
                    self.searchRequest.warehouseId = self.warehouses[0].id;
                }
                else {
                    var whId = self.localStorageService.get(App.LocalStorageKeys.WarehouseId);
                    if (whId != null) {
                        self.searchRequest.warehouseId = whId;
                    }
                }
                return self.search();
            });
            return _this;
        }
        SalesByProductCategoryReportController.prototype.search = function () {
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
            var successCallback = function (response) {
                console.log('i am in SalesByProductCategory response: ');
                console.log(response);
                self.models = response.data;
                self.chartLabels = [];
                self.chartData = [];
                if (self.models.length === 0) {
                    console.log('No search result found');
                }
                else {
                    self.generateCsvModels();
                    for (var i = 0; i < self.models.length; i++) {
                        var m = self.models[i];
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
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService.search(self.searchRequest, self.queryUrl + "/SalesByProductCategory")
                .then(successCallback, errorCallback);
        };
        SalesByProductCategoryReportController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", "Excel"
        ];
        return SalesByProductCategoryReportController;
    }(App.BaseController));
    App.SalesByProductCategoryReportController = SalesByProductCategoryReportController;
    angular.module("app").controller("SalesByProductCategoryReportController", SalesByProductCategoryReportController);
    var SalesByProductGroupReportController = /** @class */ (function (_super) {
        __extends(SalesByProductGroupReportController, _super);
        function SalesByProductGroupReportController(location, sate, stateParams, url, search, save, authService, localStorageService, excel) {
            var _this = _super.call(this, location, sate, stateParams, url, search, save, authService, url.sale, url.saleQuery, excel) || this;
            _this.quantityTotal = 0;
            _this.costAmountTotal = 0;
            _this.priceAmountTotal = 0;
            _this.discountAmountTotal = 0;
            _this.amountTotal = 0;
            _this.paidAmountTotal = 0;
            _this.dueAmountTotal = 0;
            _this.saleCountTotal = 0;
            _this.percentTotal = 0;
            console.log("i am in SalesByProductGroupReportController");
            var self = _this;
            self.localStorageService = localStorageService;
            _this.searchRequest.startDate = _this.startDate.toJSON();
            _this.searchRequest.endDate = _this.endDate.toJSON();
            _this.loadWarehouses().then(function (result) {
                if (self.warehouses.length === 1) {
                    self.searchRequest.warehouseId = self.warehouses[0].id;
                }
                else {
                    var whId = self.localStorageService.get(App.LocalStorageKeys.WarehouseId);
                    if (whId != null) {
                        self.searchRequest.warehouseId = whId;
                    }
                }
                return self.search();
            });
            return _this;
        }
        SalesByProductGroupReportController.prototype.search = function () {
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
            var successCallback = function (response) {
                console.log('i am in  SalesByProductGroup response: ');
                console.log(response);
                self.models = response.data;
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
                    for (var i = 0; i < self.models.length; i++) {
                        var m = self.models[i];
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
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService.search(self.searchRequest, self.queryUrl + "/SalesByProductGroup")
                .then(successCallback, errorCallback);
        };
        SalesByProductGroupReportController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", "Excel"
        ];
        return SalesByProductGroupReportController;
    }(App.BaseController));
    App.SalesByProductGroupReportController = SalesByProductGroupReportController;
    angular.module("app").controller("SalesByProductGroupReportController", SalesByProductGroupReportController);
    var ChannelWiseSalesReportController = /** @class */ (function (_super) {
        __extends(ChannelWiseSalesReportController, _super);
        function ChannelWiseSalesReportController(location, state, stateParams, url, search, save, authService, localStorageService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.sale, url.saleQuery, excel) || this;
            _this.productAmountTotal = 0;
            _this.costAmountTotal = 0;
            _this.payableAmountTotal = 0;
            _this.paidAmountTotal = 0;
            _this.dueAmountTotal = 0;
            _this.orderCountTotal = 0;
            _this.averageOrderAmountTotal = 0;
            _this.newCustomersCountTotal = 0;
            var self = _this;
            self.localStorageService = localStorageService;
            _this.searchRequest.startDate = _this.startDate.toJSON();
            _this.searchRequest.endDate = _this.endDate.toJSON();
            _this.loadWarehouses().then(function (result) {
                if (self.warehouses.length === 1) {
                    self.searchRequest.warehouseId = self.warehouses[0].id;
                }
                else {
                    var whId = self.localStorageService.get(App.LocalStorageKeys.WarehouseId);
                    if (whId != null) {
                        self.searchRequest.warehouseId = whId;
                    }
                }
                return self.search();
            });
            return _this;
        }
        ChannelWiseSalesReportController.prototype.loadData = function () {
            if (this.startDate != null) {
                this.searchRequest.startDate = this.startDate.toDateString();
            }
            if (this.endDate != null) {
                this.searchRequest.endDate = this.endDate.toDateString();
            }
            this.search();
        };
        ChannelWiseSalesReportController.prototype.search = function () {
            var self = this;
            self.productAmountTotal = 0;
            self.costAmountTotal = 0;
            self.payableAmountTotal = 0;
            self.paidAmountTotal = 0;
            self.dueAmountTotal = 0;
            self.orderCountTotal = 0;
            self.averageOrderAmountTotal = 0;
            self.newCustomersCountTotal = 0;
            var successCallback = function (response) {
                console.log(response);
                self.models = response.data;
                self.chartLabels = [];
                self.chartData = [];
                if (self.models.length === 0) {
                    console.log('No search result found');
                }
                else {
                    //vm.searchRequest.keyword                   
                    self.generateCsvModels();
                    for (var i = 0; i < self.models.length; i++) {
                        var m = self.models[i];
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
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService
                .search(self.searchRequest, self.queryUrl + "/DailySalesOverview")
                .then(successCallback, errorCallback);
        };
        ChannelWiseSalesReportController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", 'Excel'
        ];
        return ChannelWiseSalesReportController;
    }(App.BaseController));
    App.ChannelWiseSalesReportController = ChannelWiseSalesReportController;
    angular.module("app").controller("ChannelWiseSalesReportController", ChannelWiseSalesReportController);
})(App || (App = {}));
