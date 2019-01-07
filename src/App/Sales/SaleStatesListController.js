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
    "use strict";
    var PendingSalesController = /** @class */ (function (_super) {
        __extends(PendingSalesController, _super);
        function PendingSalesController($rootScope, location, state, stateParams, url, search, save, authService, localStorageService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.sale, url.saleQuery, excel) || this;
            _this.saleFroms = [
                "All", "BizBook365", "Facebook", "Website", "PhoneCall", "MobileApp", "Referral", "Other"
            ];
            _this.saleChannels = ["All", "Inhouse", "CashOnDelivery", "Courier", "Condition"];
            _this.headers = [
                "id", "date", "orderNumber", "payableTotalAmount", "paidAmount", "dueAmount", "customerName",
                "customerPhone"
            ];
            _this.total = 0;
            _this.due = 0;
            _this.searchDates = [];
            _this.searchDate = [
                "Created", "Modified", "OrderDate"
            ];
            _this.rootScopeService = $rootScope;
            _this.localStorageService = localStorageService;
            _this.searchRequest["orderState"] = "Pending";
            //this.searchRequest["DateSearchColumn"] = this.searchDate;
            //this.searchRequest["saleFrom"] = this.saleFroms[0];
            //this.searchRequest["saleChannel"] = this.saleChannels[0];
            //this.searchRequest["thana"] = this.thanas[0];
            _this.searchRequest.startDate = _this.startDate.toJSON();
            _this.searchRequest.endDate = _this.endDate.toJSON();
            for (var enumMember in App.SearchDate) {
                if (App.SearchDate.hasOwnProperty(enumMember)) {
                    var isValueProperty = parseInt(enumMember, 10) >= 0;
                    if (isValueProperty) {
                        var i = App.SearchDate[enumMember];
                        _this.searchDates.push(i);
                    }
                }
            }
            var searchDate1 = _this.localStorageService.get(App.LocalStorageKeys.SearchDate);
            if (searchDate1 == null) {
                searchDate1 = _this.searchDates[0];
                _this.localStorageService.save(App.LocalStorageKeys.SearchDate, searchDate1);
            }
            _this.searchRequest["dateSearchColumn"] = searchDate1;
            _this.due = 0;
            _this.total = 0;
            _this.setSearchKeyword();
            _this.setStartDate();
            _this.setEndDate();
            var page = _this.localStorageService.get(App.LocalStorageKeys.PendingSaleListPageNo);
            if (!page) {
                _this.localStorageService.save(App.LocalStorageKeys.PendingSaleListPageNo, 1);
                page = 1;
            }
            _this.searchRequest.page = page;
            _this.searchByWarehouse().then(function (result) {
                console.log('searched.');
            });
            _this.orderStates = [
                "Created", "ReadyToDeparture", "OnTheWay", "Delivered", "Completed", "Cancel"
            ];
            _this.rootScopeService.$on("orderCreated", function (data) {
                console.info('loading pending triggered by notification hub');
                _this.search();
            });
            return _this;
        }
        PendingSalesController.prototype.loadData = function () {
            var self = this;
            if (this.startDate != null) {
                this.searchRequest.startDate = this.startDate.toDateString();
                self.localStorageService.save(App.LocalStorageKeys.startDate, self.startDate);
            }
            if (this.endDate != null) {
                this.searchRequest.endDate = this.endDate.toDateString();
                self.localStorageService.save(App.LocalStorageKeys.endDate, self.endDate);
            }
            this.search();
        };
        PendingSalesController.prototype.search = function () {
            var self = this;
            this.due = 0;
            this.total = 0;
            var successCallback = function (response) {
                console.log(response);
                self.models = response.Models;
                if (self.models.length === 0) {
                    console.log('No search result found');
                }
                else {
                    self.csvModels = [];
                    for (var i = 0; i < self.models.length; i++) {
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
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService.search(self.searchRequest, self.queryUrl + "/Search")
                .then(successCallback, errorCallback);
        };
        PendingSalesController.prototype.changeSearchDate = function () {
            var self = this;
            self.localStorageService.save(App.LocalStorageKeys.SearchDate, self.searchRequest["dateSearchColumn"]);
            self.search();
        };
        PendingSalesController.prototype.nextStateAll = function () {
            _super.prototype.nextStateAll.call(this, this.models);
        };
        PendingSalesController.prototype.updateStateAll = function () {
            _super.prototype.updateStateAll.call(this, this.models);
        };
        PendingSalesController.prototype.completeState = function (model) {
            model.nextOrderState = App.OrderState.Completed;
            _super.prototype.updateState.call(this, model);
        };
        PendingSalesController.prototype.cancelState = function (model) {
            model.nextOrderState = App.OrderState.Cancel;
            _super.prototype.updateState.call(this, model);
        };
        PendingSalesController.prototype.goto = function (page) {
            var self = this;
            self.localStorageService.save(App.LocalStorageKeys.PendingSaleListPageNo, page);
            _super.prototype.goto.call(this, page);
        };
        PendingSalesController.prototype.showReceipt = function (id) {
            var self = this;
            var name = self.localStorageService.get2(App.LocalStorageKeys.ReceiptName);
            if (!name) {
                name = 'root.receipt2';
                self.localStorageService.save(App.LocalStorageKeys.ReceiptName, name);
            }
            self.navigateState(name, { id: id });
        };
        PendingSalesController.$inject = [
            "$rootScope", "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", 'Excel'
        ];
        return PendingSalesController;
    }(App.BaseController));
    App.PendingSalesController = PendingSalesController;
    angular.module("app").controller("PendingSalesController", PendingSalesController);
    var CreatedSalesController = /** @class */ (function (_super) {
        __extends(CreatedSalesController, _super);
        function CreatedSalesController(location, state, stateParams, url, search, save, authService, localStorageService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.sale, url.saleQuery, excel) || this;
            _this.saleFroms = [
                "All", "BizBook365", "Facebook", "Website", "PhoneCall", "MobileApp", "Referral", "Other"
            ];
            _this.saleChannels = ["All", "Inhouse", "CashOnDelivery", "Courier", "Condition"];
            _this.headers = [
                "id", "date", "orderNumber", "payableTotalAmount", "paidAmount", "dueAmount", "customerName",
                "customerPhone"
            ];
            _this.total = 0;
            _this.due = 0;
            _this.localStorageService = localStorageService;
            _this.searchRequest["orderState"] = "Created";
            //this.searchRequest["saleFrom"] = this.saleFroms[0];
            //this.searchRequest["saleChannel"] = this.saleChannels[0];
            //this.searchRequest["thana"] = this.thanas[0];
            _this.setSearchKeyword();
            _this.loadCouriers();
            var page = _this.localStorageService.get(App.LocalStorageKeys.CreatedSaleListPageNo);
            if (!page) {
                _this.localStorageService.save(App.LocalStorageKeys.CreatedSaleListPageNo, 1);
                page = 1;
            }
            _this.searchRequest.page = page;
            _this.orderStates = [
                "Pending", "ReadyToDeparture", "OnTheWay", "Delivered", "Completed", "Cancel"
            ];
            _this.searchByWarehouse().then(function (result) {
                console.log('searched.');
            });
            return _this;
        }
        CreatedSalesController.prototype.search = function () {
            var self = this;
            this.due = 0;
            this.total = 0;
            var successCallback = function (response) {
                console.log(response);
                self.models = response.Models;
                if (self.models.length === 0) {
                    console.log('No search result found');
                }
                else {
                    for (var i = 0; i < self.models.length; i++) {
                        self.total += self.models[i].totalAmount;
                        self.due += self.models[i].dueAmount;
                    }
                }
                self.model.nextOrderState = "ReadyToDeparture";
                self.changeStateAll(self.model.nextOrderState);
                self.totalCount = response.Count;
                self.searchRequest.totalPage = Math.ceil(response.Count / 10);
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService.search(self.searchRequest, self.queryUrl + "/Search")
                .then(successCallback, errorCallback);
        };
        CreatedSalesController.prototype.loadCouriers = function () {
            var self = this;
            var successCallback = function (response) {
                console.log('courier' + response);
                self.couriers = response.Models;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService.search(self.searchRequest, self.url.courierQuery + "/Dropdown")
                .then(successCallback, errorCallback);
        };
        CreatedSalesController.prototype.courierChanged = function (d) {
            var self = this;
            for (var i = 0; i < self.models.length; i++) {
                self.models[i].courierShopId = d;
            }
            console.log('changed courier with ', d);
        };
        CreatedSalesController.prototype.nextStateAll = function () {
            _super.prototype.nextStateAll.call(this, this.models);
        };
        CreatedSalesController.prototype.updateStateAll = function () {
            _super.prototype.updateStateAll.call(this, this.models);
        };
        CreatedSalesController.prototype.prevState = function (model) {
            model.nextOrderState = App.OrderState.Pending;
            _super.prototype.updateState.call(this, model);
        };
        CreatedSalesController.prototype.completeState = function (model) {
            model.nextOrderState = App.OrderState.Completed;
            _super.prototype.updateState.call(this, model);
        };
        CreatedSalesController.prototype.cancelState = function (model) {
            model.nextOrderState = App.OrderState.Cancel;
            _super.prototype.updateState.call(this, model);
        };
        CreatedSalesController.prototype.goto = function (page) {
            var self = this;
            self.localStorageService.save(App.LocalStorageKeys.CreatedSaleListPageNo, page);
            _super.prototype.goto.call(this, page);
        };
        CreatedSalesController.prototype.showReceipt = function (id) {
            var self = this;
            var name = self.localStorageService.get2(App.LocalStorageKeys.ReceiptName);
            if (!name) {
                name = 'root.receipt2';
                self.localStorageService.save(App.LocalStorageKeys.ReceiptName, name);
            }
            self.navigateState(name, { id: id });
        };
        CreatedSalesController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", 'Excel'
        ];
        return CreatedSalesController;
    }(App.BaseController));
    App.CreatedSalesController = CreatedSalesController;
    angular.module("app").controller("CreatedSalesController", CreatedSalesController);
    var ReadyToDepartureSalesController = /** @class */ (function (_super) {
        __extends(ReadyToDepartureSalesController, _super);
        function ReadyToDepartureSalesController(location, state, stateParams, url, search, save, authService, localStorageService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.sale, url.saleQuery, excel) || this;
            _this.saleFroms = [
                "All", "BizBook365", "Facebook", "Website", "PhoneCall", "MobileApp", "Referral", "Other"
            ];
            _this.saleChannels = ["All", "Inhouse", "CashOnDelivery", "Courier", "Condition"];
            _this.total = 0;
            _this.due = 0;
            _this.localStorageService = localStorageService;
            _this.searchRequest["orderState"] = "ReadyToDeparture";
            //this.searchRequest["saleFrom"] = this.saleFroms[0];
            //this.searchRequest["saleChannel"] = this.saleChannels[0];
            //this.searchRequest["thana"] = this.thanas[0];
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
            _this.orderStates = [
                "Pending", "Created", "OnTheWay", "Delivered", "Completed", "Cancel"
            ];
            _this.setSearchKeyword();
            var page = _this.localStorageService.get(App.LocalStorageKeys.ReadyToDepartureSaleListPageNo);
            if (!page) {
                _this.localStorageService.save(App.LocalStorageKeys.ReadyToDepartureSaleListPageNo, 1);
                page = 1;
            }
            _this.searchRequest.page = page;
            _this.searchByWarehouse().then(function (result) {
                console.log('searched.');
                _this.loadDeliverymans();
            });
            return _this;
        }
        ReadyToDepartureSalesController.prototype.search = function () {
            var self = this;
            this.due = 0;
            this.total = 0;
            var successCallback = function (response) {
                console.log(response);
                self.models = response.Models;
                if (self.models.length === 0) {
                    console.log('No search result found');
                }
                else {
                    for (var i = 0; i < self.models.length; i++) {
                        self.total += self.models[i].payableTotalAmount;
                        self.due += self.models[i].dueAmount;
                    }
                }
                self.model.nextOrderState = "OnTheWay";
                self.changeStateAll(self.model.nextOrderState);
                self.totalCount = response.Count;
                self.searchRequest.totalPage = Math.ceil(response.Count / 10);
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService.search(self.searchRequest, self.queryUrl + "/Search")
                .then(successCallback, errorCallback);
        };
        ReadyToDepartureSalesController.prototype.prevState = function (model) {
            model.nextOrderState = App.OrderState.Created;
            _super.prototype.updateState.call(this, model);
        };
        ReadyToDepartureSalesController.prototype.completeState = function (model) {
            model.nextOrderState = App.OrderState.Completed;
            _super.prototype.updateState.call(this, model);
        };
        ReadyToDepartureSalesController.prototype.cancelState = function (model) {
            model.nextOrderState = App.OrderState.Cancel;
            _super.prototype.updateState.call(this, model);
        };
        ReadyToDepartureSalesController.prototype.loadDeliverymans = function () {
            var self = this;
            var successCallback = function (response) {
                self.deliverymans = response.Models;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            var request = new App.SearchRequest();
            request['isEmployeeActive'] = true;
            request["RoleId"] = "9e9c6351-f8a0-492f-8e9b-4098a8f889e6";
            request.warehouseId = self.searchRequest.warehouseId;
            request.page = -1;
            var httpUrl = self.url.employeeInfo + "Query" + "/Search";
            self.searchService
                .search(request, httpUrl)
                .then(successCallback, errorCallback);
        };
        ReadyToDepartureSalesController.prototype.deliverymanChanged = function (d) {
            var self = this;
            for (var i = 0; i < self.models.length; i++) {
                self.models[i].deliverymanId = d.id;
                self.models[i].deliverymanName = d.email;
            }
        };
        ReadyToDepartureSalesController.prototype.deliverymanChangedSingle = function (p) {
            var self = this;
            for (var i = 0; i < self.deliverymans.length; i++) {
                if (self.deliverymans[i].id === p.deliverymanId) {
                    p.deliverymanName = self.deliverymans[i].email;
                    break;
                }
            }
        };
        ReadyToDepartureSalesController.prototype.goto = function (page) {
            var self = this;
            self.localStorageService.save(App.LocalStorageKeys.ReadyToDepartureSaleListPageNo, page);
            _super.prototype.goto.call(this, page);
        };
        ReadyToDepartureSalesController.prototype.showReceipt = function (id) {
            var self = this;
            var name = self.localStorageService.get2(App.LocalStorageKeys.ReceiptName);
            if (!name) {
                name = 'root.receipt2';
                self.localStorageService.save(App.LocalStorageKeys.ReceiptName, name);
            }
            self.navigateState(name, { id: id });
        };
        ReadyToDepartureSalesController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", 'Excel'
        ];
        return ReadyToDepartureSalesController;
    }(App.BaseController));
    App.ReadyToDepartureSalesController = ReadyToDepartureSalesController;
    angular.module("app").controller("ReadyToDepartureSalesController", ReadyToDepartureSalesController);
    var OnTheWaySalesController = /** @class */ (function (_super) {
        __extends(OnTheWaySalesController, _super);
        function OnTheWaySalesController(location, state, stateParams, url, search, save, authService, locationStorageService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.sale, url.saleQuery, excel) || this;
            _this.saleFroms = [
                "All", "BizBook365", "Facebook", "Website", "PhoneCall", "MobileApp", "Referral", "Other"
            ];
            _this.saleChannels = ["All", "Inhouse", "CashOnDelivery", "Courier", "Condition"];
            _this.productAmountTotal = 0;
            _this.totalDeliveryChargeAmount = 0;
            _this.total = 0;
            _this.due = 0;
            _this.localStorageService = locationStorageService;
            _this.searchRequest["orderState"] = "OnTheWay";
            //this.searchRequest["saleFrom"] = this.saleFroms[0];
            //this.searchRequest["saleChannel"] = this.saleChannels[0];
            //this.searchRequest["thana"] = this.thanas[0];
            _this.orderStates = [
                "Pending", "Created", "ReadyToDeparture", "Delivered", "Completed", "Cancel"
            ];
            _this.setSearchKeyword();
            var page = _this.localStorageService.get(App.LocalStorageKeys.OnTheWaySaleListPageNo);
            if (!page) {
                _this.localStorageService.save(App.LocalStorageKeys.OnTheWaySaleListPageNo, 1);
                page = 1;
            }
            _this.searchRequest.page = page;
            _this.searchByWarehouse().then(function (result) {
                console.log('searched.');
                _this.loadDeliverymans();
            });
            return _this;
        }
        OnTheWaySalesController.prototype.search = function () {
            var self = this;
            this.productAmountTotal = 0;
            this.totalDeliveryChargeAmount = 0;
            this.due = 0;
            this.total = 0;
            var successCallback = function (response) {
                console.log(response);
                self.models = response.Models;
                if (self.models.length === 0) {
                    console.log('No search result found');
                }
                else {
                    for (var i = 0; i < self.models.length; i++) {
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
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService.search(self.searchRequest, self.queryUrl + "/Search")
                .then(successCallback, errorCallback);
        };
        OnTheWaySalesController.prototype.nextStateAll = function () {
            _super.prototype.nextStateAll.call(this, this.models);
        };
        OnTheWaySalesController.prototype.updateStateAll = function () {
            _super.prototype.updateStateAll.call(this, this.models);
        };
        OnTheWaySalesController.prototype.prevState = function (model) {
            model.nextOrderState = App.OrderState.ReadyToDeparture;
            _super.prototype.updateState.call(this, model);
        };
        OnTheWaySalesController.prototype.completeState = function (model) {
            model.nextOrderState = App.OrderState.Completed;
            _super.prototype.updateState.call(this, model);
        };
        OnTheWaySalesController.prototype.cancelState = function (model) {
            model.nextOrderState = App.OrderState.Cancel;
            _super.prototype.updateState.call(this, model);
        };
        OnTheWaySalesController.prototype.loadDeliverymans = function () {
            var self = this;
            var successCallback = function (response) {
                self.deliverymans = response.Models;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            var request = new App.SearchRequest();
            request['isEmployeeActive'] = true;
            request["RoleId"] = "9e9c6351-f8a0-492f-8e9b-4098a8f889e6";
            request.warehouseId = self.searchRequest.warehouseId;
            request.page = -1;
            var httpUrl = self.url.employeeInfo + "Query" + "/Search";
            self.searchService
                .search(request, httpUrl)
                .then(successCallback, errorCallback);
        };
        OnTheWaySalesController.prototype.deliverymanChanged = function (d) {
            var self = this;
            self.search();
        };
        OnTheWaySalesController.prototype.goto = function (page) {
            var self = this;
            self.localStorageService.save(App.LocalStorageKeys.OnTheWaySaleListPageNo, page);
            _super.prototype.goto.call(this, page);
        };
        OnTheWaySalesController.prototype.showReceipt = function (id) {
            var self = this;
            var name = self.localStorageService.get2(App.LocalStorageKeys.ReceiptName);
            if (!name) {
                name = 'root.receipt2';
                self.localStorageService.save(App.LocalStorageKeys.ReceiptName, name);
            }
            self.navigateState(name, { id: id });
        };
        OnTheWaySalesController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", 'Excel'
        ];
        return OnTheWaySalesController;
    }(App.BaseController));
    App.OnTheWaySalesController = OnTheWaySalesController;
    angular.module("app").controller("OnTheWaySalesController", OnTheWaySalesController);
    var OnTheWaySalesDuesController = /** @class */ (function (_super) {
        __extends(OnTheWaySalesDuesController, _super);
        function OnTheWaySalesDuesController(location, state, stateParams, url, search, save, authService, locationStorageService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.sale, url.saleQuery, excel) || this;
            //showNextState: boolean;
            //saleFroms: string[] = [
            //    "All", "BizBook365", "Facebook", "Website", "PhoneCall", "MobileApp", "Referral", "Other"
            //];
            //saleChannels: string[] = ["All", "Inhouse", "CashOnDelivery", "Courier", "Condition"];
            _this.productAmountTotal = 0;
            _this.totalDeliveryChargeAmount = 0;
            _this.total = 0;
            _this.due = 0;
            _this.newlyPaid = 0;
            _this.localStorageService = locationStorageService;
            _this.searchRequest["orderState"] = "OnTheWay";
            //this.searchRequest["saleFrom"] = this.saleFroms[0];
            //this.searchRequest["saleChannel"] = this.saleChannels[0];
            //this.searchRequest["thana"] = this.thanas[0];
            //this.orderStates = [
            //    "Pending", "Created", "ReadyToDeparture", "Delivered", "Completed", "Cancel"
            //];
            _this.setSearchKeyword();
            _this.searchRequest.page = -1;
            _this.searchByWarehouse().then(function (result) {
                console.log('searched.');
                _this.loadDeliverymans();
            });
            _this.transaction = new App.Transaction();
            _this.transactionDate = new Date();
            _this.setupDropdowns();
            _this.selectedAccountInfo = new App.AccountInfo();
            _this.loadAccountInfos();
            return _this;
        }
        OnTheWaySalesDuesController.prototype.setupDropdowns = function () {
            var _this = this;
            var self = this;
            var success = function (response) {
                console.log(response);
                self.transactionMediums = response.transactionMediums;
                self.paymentGatewayServices = response.paymentGatewayServices;
                self.accountInfoTypes = response.accountInfoTypes;
                self.accountInfoType = "Cash";
                self.transaction.transactionMedium = "Cash";
                self.transaction.paymentGatewayService = "Cash";
            };
            var error = function (error) {
                console.log(error);
            };
            self.searchService.get(self.url.transactionQuery + "/Dropdowns").then(success, error);
            var accountSuccess = function (response) {
                console.log('account - ', response);
                var accountHeads = response.Models;
                var sale = accountHeads.filter(function (x) { return x.text === "Sale"; })[0];
                if (sale != null) {
                    _this.transaction.accountHeadId = sale.id;
                    _this.transaction.accountHeadName = sale.text;
                }
            };
            var accountRequest = new App.SearchRequest();
            self.searchService.search(accountRequest, self.url.accountHeadQuery + "/Dropdown")
                .then(accountSuccess, error);
        };
        OnTheWaySalesDuesController.prototype.loadAccountInfos = function () {
            var self = this;
            var success = function (response) {
                App.Display.log(response);
                self.accountInfos = response.Models;
                self.accountInfoChanged();
            };
            var error = function (error) {
                App.Display.log(error);
            };
            self.searchService.search(self.searchRequest, self.url.accountInfoQuery + "/Dropdown")
                .then(success, error);
        };
        OnTheWaySalesDuesController.prototype.accountInfoChanged = function () {
            var self = this;
            self.transaction.accountInfoTitle = self.selectedAccountInfo["text"];
            self.transaction.accountInfoId = self.selectedAccountInfo.id;
            self.transaction.paymentGatewayServiceName = self.transaction.accountInfoTitle;
            self.transaction.transactionMediumName = self.transaction.transactionMedium;
        };
        OnTheWaySalesDuesController.prototype.search = function () {
            var self = this;
            this.productAmountTotal = 0;
            this.totalDeliveryChargeAmount = 0;
            this.due = 0;
            this.total = 0;
            var successCallback = function (response) {
                console.log(response);
                self.models = response.Models;
                if (self.models.length === 0) {
                    console.log('No search result found');
                }
                else {
                    for (var i = 0; i < self.models.length; i++) {
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
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService.search(self.searchRequest, self.queryUrl + "/Search")
                .then(successCallback, errorCallback);
        };
        OnTheWaySalesDuesController.prototype.loadDeliverymans = function () {
            var self = this;
            var successCallback = function (response) {
                self.deliverymans = response.Models;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            var request = new App.SearchRequest();
            request['isEmployeeActive'] = true;
            request["RoleId"] = "9e9c6351-f8a0-492f-8e9b-4098a8f889e6";
            request.warehouseId = self.searchRequest.warehouseId;
            request.page = -1;
            var httpUrl = self.url.employeeInfo + "Query" + "/Search";
            self.searchService
                .search(request, httpUrl)
                .then(successCallback, errorCallback);
        };
        OnTheWaySalesDuesController.prototype.deliverymanChanged = function (d) {
            var self = this;
            self.search();
        };
        OnTheWaySalesDuesController.prototype.goto = function (page) {
            var self = this;
            self.localStorageService.save(App.LocalStorageKeys.OnTheWaySaleListPageNo, page);
            _super.prototype.goto.call(this, page);
        };
        OnTheWaySalesDuesController.prototype.showReceipt = function (id) {
            var self = this;
            var name = self.localStorageService.get2(App.LocalStorageKeys.ReceiptName);
            if (!name) {
                name = 'root.receipt2';
                self.localStorageService.save(App.LocalStorageKeys.ReceiptName, name);
            }
            self.navigateState(name, { id: id });
        };
        OnTheWaySalesDuesController.prototype.updateNewlyPaidAmounts = function () {
            var self = this;
            self.newlyPaid = 0;
            self.models.forEach(function (x) {
                var m = x;
                console.log(m.newlyPaid);
                self.newlyPaid += m.newlyPaid;
            });
        };
        OnTheWaySalesDuesController.prototype.save = function () {
            var self = this;
            var payload = new App.SalesDuesUpdateModel();
            payload.transaction = self.transaction;
            payload.sales = self.models;
            var successCallback = function (response) {
                self.transaction = new App.Transaction();
                self.search();
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.transaction.transactionDate = self.transactionDate.toDateString();
            var l = 0;
            // process and prepare data
            for (var i = 0; i < self.models.length; i++) {
                l += self.models[i]["newlyPaid"];
            }
            if (l !== self.transaction.amount) {
                alert('Transaction amount and product breakdown amount is not equal. returning');
                return;
            }
            self.saveService.save(payload, self.commandUrl + "/SalesDuesUpdate").then(successCallback, errorCallback);
        };
        OnTheWaySalesDuesController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", 'Excel'
        ];
        return OnTheWaySalesDuesController;
    }(App.BaseController));
    App.OnTheWaySalesDuesController = OnTheWaySalesDuesController;
    angular.module("app").controller("OnTheWaySalesDuesController", OnTheWaySalesDuesController);
    var DeliveredSalesController = /** @class */ (function (_super) {
        __extends(DeliveredSalesController, _super);
        function DeliveredSalesController(location, state, stateParams, url, search, save, authService, localStorageService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.sale, url.saleQuery, excel) || this;
            _this.saleFroms = [
                "All", "BizBook365", "Facebook", "Website", "PhoneCall", "MobileApp", "Referral", "Other"
            ];
            _this.saleChannels = ["All", "Inhouse", "CashOnDelivery", "Courier", "Condition"];
            _this.total = 0;
            _this.due = 0;
            _this.localStorageService = localStorageService;
            _this.searchRequest["orderState"] = "Delivered";
            //this.searchRequest["saleFrom"] = this.saleFroms[0];
            //this.searchRequest["saleChannel"] = this.saleChannels[0];
            //this.searchRequest["thana"] = this.thanas[0];
            _this.orderStates = [
                "Pending", "Created", "ReadyToDeparture", "OnTheWay", "Completed", "Cancel"
            ];
            _this.setSearchKeyword();
            var page = _this.localStorageService.get(App.LocalStorageKeys.DeliveredSaleListPageNo);
            if (!page) {
                _this.localStorageService.save(App.LocalStorageKeys.DeliveredSaleListPageNo, 1);
                page = 1;
            }
            _this.searchRequest.page = page;
            _this.searchByWarehouse().then(function (result) {
                console.log('searched.');
            });
            return _this;
        }
        DeliveredSalesController.prototype.search = function () {
            var self = this;
            this.due = 0;
            this.total = 0;
            var successCallback = function (response) {
                console.log(response);
                self.models = response.Models;
                if (self.models.length === 0) {
                    console.log('No search result found');
                }
                else {
                    for (var i = 0; i < self.models.length; i++) {
                        self.total += self.models[i].totalAmount;
                        self.due += self.models[i].dueAmount;
                    }
                }
                self.model.nextOrderState = "Completed";
                self.changeStateAll(self.model.nextOrderState);
                self.totalCount = response.Count;
                self.searchRequest.totalPage = Math.ceil(response.Count / 10);
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService.search(self.searchRequest, self.queryUrl + "/Search")
                .then(successCallback, errorCallback);
        };
        DeliveredSalesController.prototype.prevState = function (model) {
            model.nextOrderState = App.OrderState.OnTheWay;
            _super.prototype.updateState.call(this, model);
        };
        DeliveredSalesController.prototype.cancelState = function (model) {
            model.nextOrderState = App.OrderState.Cancel;
            _super.prototype.updateState.call(this, model);
        };
        DeliveredSalesController.prototype.showReceipt = function (id) {
            var self = this;
            var name = self.localStorageService.get2(App.LocalStorageKeys.ReceiptName);
            if (!name) {
                name = 'root.receipt2';
                self.localStorageService.save(App.LocalStorageKeys.ReceiptName, name);
            }
            self.navigateState(name, { id: id });
        };
        DeliveredSalesController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", 'Excel'
        ];
        return DeliveredSalesController;
    }(App.BaseController));
    App.DeliveredSalesController = DeliveredSalesController;
    angular.module("app").controller("DeliveredSalesController", DeliveredSalesController);
    var DeliveredProductCategoriesController = /** @class */ (function (_super) {
        __extends(DeliveredProductCategoriesController, _super);
        function DeliveredProductCategoriesController(location, state, stateParams, url, search, save, authService, localStorageService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.sale, url.saleQuery, excel) || this;
            _this.sales = [];
            _this.total = 0;
            _this.due = 0;
            _this.localStorageService = localStorageService;
            _this.searchRequest["orderState"] = "Delivered";
            //this.searchRequest["saleFrom"] = this.saleFroms[0];
            //this.searchRequest["saleChannel"] = this.saleChannels[0];
            //this.searchRequest["thana"] = this.thanas[0];
            _this.orderStates = [
                "Pending", "Created", "ReadyToDeparture", "OnTheWay", "Completed", "Cancel"
            ];
            _this.setSearchKeyword();
            _this.searchRequest.page = -1;
            _this.search();
            return _this;
        }
        DeliveredProductCategoriesController.prototype.search = function () {
            var self = this;
            var successCallback = function (response) {
                console.log(response);
                self.models = response.data;
                if (self.models.length === 0) {
                    console.log('No search result found');
                }
                else {
                    for (var i = 0; i < self.models.length; i++) {
                        // todo
                        self.total += self.models[i]["total"];
                        self.due += self.models[i]["due"];
                    }
                }
                self.searchRequest.totalPage = Math.ceil(response.Count / 10);
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService.search(self.searchRequest, self.queryUrl + "/DeliveredProductCategories")
                .then(successCallback, errorCallback);
            var success = function (response) {
                console.log(response);
                self.sales = (response.Models);
            };
            self.searchService.search(self.searchRequest, self.queryUrl + "/Search")
                .then(success, errorCallback);
        };
        DeliveredProductCategoriesController.prototype.updateStateAll = function () {
            _super.prototype.updateStateAll.call(this, this.sales);
            this.total = 0;
            this.due = 0;
        };
        DeliveredProductCategoriesController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", 'Excel'
        ];
        return DeliveredProductCategoriesController;
    }(App.BaseController));
    App.DeliveredProductCategoriesController = DeliveredProductCategoriesController;
    angular.module('app').controller("DeliveredProductCategoriesController", DeliveredProductCategoriesController);
    var CompletedSalesController = /** @class */ (function (_super) {
        __extends(CompletedSalesController, _super);
        function CompletedSalesController(location, state, stateParams, url, search, save, authService, localStorageService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.sale, url.saleQuery, excel) || this;
            _this.saleFroms = [
                "All", "BizBook365", "Facebook", "Website", "PhoneCall", "MobileApp", "Referral", "Other"
            ];
            _this.saleChannels = ["All", "Inhouse", "CashOnDelivery", "Courier", "Condition"];
            _this.total = 0;
            _this.due = 0;
            _this.localStorageService = localStorageService;
            _this.searchRequest["orderState"] = "Completed";
            //this.searchRequest["saleFrom"] = this.saleFroms[0];
            //this.searchRequest["saleChannel"] = this.saleChannels[0];
            //this.searchRequest["thana"] = this.thanas[0];
            _this.setSearchKeyword();
            var page = _this.localStorageService.get(App.LocalStorageKeys.CompletedSaleListPageNo);
            if (!page) {
                _this.localStorageService.save(App.LocalStorageKeys.CompletedSaleListPageNo, 1);
                page = 1;
            }
            _this.searchRequest.page = page;
            _this.searchByWarehouse().then(function (result) {
                console.log('searched.');
            });
            return _this;
        }
        CompletedSalesController.prototype.search = function () {
            var self = this;
            this.due = 0;
            this.total = 0;
            var successCallback = function (response) {
                console.log(response);
                self.models = response.Models;
                if (self.models.length === 0) {
                    console.log('No search result found');
                }
                else {
                    for (var i = 0; i < self.models.length; i++) {
                        self.total += self.models[i].totalAmount;
                        self.due += self.models[i].dueAmount;
                    }
                }
                self.totalCount = response.Count;
                self.searchRequest.totalPage = Math.ceil(response.Count / 10);
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService.search(self.searchRequest, self.queryUrl + "/Search")
                .then(successCallback, errorCallback);
        };
        CompletedSalesController.prototype.goto = function (page) {
            var self = this;
            self.localStorageService.save(App.LocalStorageKeys.CompletedSaleListPageNo, page);
            _super.prototype.goto.call(this, page);
        };
        CompletedSalesController.prototype.showReceipt = function (id) {
            var self = this;
            var name = self.localStorageService.get2(App.LocalStorageKeys.ReceiptName);
            if (!name) {
                name = 'root.receipt2';
                self.localStorageService.save(App.LocalStorageKeys.ReceiptName, name);
            }
            self.navigateState(name, { id: id });
        };
        CompletedSalesController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", 'Excel'
        ];
        return CompletedSalesController;
    }(App.BaseController));
    App.CompletedSalesController = CompletedSalesController;
    angular.module("app").controller("CompletedSalesController", CompletedSalesController);
    var CancelledSalesController = /** @class */ (function (_super) {
        __extends(CancelledSalesController, _super);
        function CancelledSalesController(location, state, stateParams, url, search, save, authService, localStorageService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.sale, url.saleQuery, excel) || this;
            _this.saleFroms = [
                "All", "BizBook365", "Facebook", "Website", "PhoneCall", "MobileApp", "Referral", "Other"
            ];
            _this.saleChannels = ["All", "Inhouse", "CashOnDelivery", "Courier", "Condition"];
            _this.total = 0;
            _this.due = 0;
            _this.localStorageService = localStorageService;
            _this.setSearchKeyword();
            _this.searchRequest["orderState"] = "Cancel";
            //this.searchRequest["saleFrom"] = this.saleFroms[0];
            //this.searchRequest["saleChannel"] = this.saleChannels[0];
            //this.searchRequest["thana"] = this.thanas[0];
            _this.searchByWarehouse().then(function (result) {
                console.log('searched.');
            });
            return _this;
        }
        CancelledSalesController.prototype.search = function () {
            var self = this;
            this.due = 0;
            this.total = 0;
            var successCallback = function (response) {
                console.log(response);
                self.models = response.Models;
                if (self.models.length === 0) {
                    console.log('No search result found');
                }
                else {
                    for (var i = 0; i < self.models.length; i++) {
                        self.total += self.models[i].totalAmount;
                        self.due += self.models[i].dueAmount;
                    }
                }
                self.totalCount = response.Count;
                self.searchRequest.totalPage = Math.ceil(response.Count / 10);
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService.search(self.searchRequest, self.queryUrl + "/Search")
                .then(successCallback, errorCallback);
        };
        CancelledSalesController.prototype.showReceipt = function (id) {
            var self = this;
            var name = self.localStorageService.get2(App.LocalStorageKeys.ReceiptName);
            if (!name) {
                name = 'root.receipt2';
                self.localStorageService.save(App.LocalStorageKeys.ReceiptName, name);
            }
            self.navigateState(name, { id: id });
        };
        CancelledSalesController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", 'Excel'
        ];
        return CancelledSalesController;
    }(App.BaseController));
    App.CancelledSalesController = CancelledSalesController;
    angular.module("app").controller("CancelledSalesController", CancelledSalesController);
    var ReadyToDepartureCouriersControllers = /** @class */ (function (_super) {
        __extends(ReadyToDepartureCouriersControllers, _super);
        function ReadyToDepartureCouriersControllers(location, state, statParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, statParams, url, search, save, authService, url.sale, url.saleQuery, excel) || this;
            //orderStates: string[] = ["ReadyToDeparture"];
            _this.total = 0;
            _this.due = 0;
            _this.searchRequest["thana"] = _this.thanas[0];
            _this.searchRequest["orderState"] = App.OrderState.ReadyToDeparture;
            //this.searchRequest["orderState"] = this.orderStates[0];
            _this.couriersSearch();
            return _this;
        }
        ReadyToDepartureCouriersControllers.prototype.couriersSearch = function () {
            var self = this;
            this.due = 0;
            this.total = 0;
            var successCallback = function (response) {
                console.log(response);
                self.models = response.Models;
                if (self.models.length === 0) {
                    console.log('No search result found');
                }
                else {
                    for (var i = 0; i < self.models.length; i++) {
                        self.total += self.models[i].totalAmount;
                        self.due += self.models[i].dueAmount;
                    }
                }
                self.totalCount = response.Count;
                self.searchRequest.totalPage = Math.ceil(response.Count / 10);
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService.search(self.searchRequest, self.queryUrl + "/SearchReadyToDeparture")
                .then(successCallback, errorCallback);
        };
        ReadyToDepartureCouriersControllers.prototype.nextStateAll = function () {
            _super.prototype.nextStateAll.call(this, this.models);
        };
        ReadyToDepartureCouriersControllers.prototype.loadDeliverymans = function () {
            var self = this;
            var successCallback = function (response) {
                self.deliverymans = response.Models;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            var searchRequest = new App.SearchRequest();
            searchRequest["role"] = "DeliveryMan";
            var httpUrl = self.url.employee + "Query" + "/Search";
            self.searchService.search(searchRequest, httpUrl).then(successCallback, errorCallback);
        };
        ReadyToDepartureCouriersControllers.prototype.deliverymanChanged = function (d) {
            var self = this;
            console.log("deliverymanChanged", d);
            for (var i = 0; i < self.models.length; i++) {
                self.models[i].deliverymanId = d.id;
                self.models[i].deliverymanName = d.userName;
            }
            console.log(self.models);
        };
        ReadyToDepartureCouriersControllers.$inject = [
            "$location", "$state", "$stateParams", "UrlService",
            "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return ReadyToDepartureCouriersControllers;
    }(App.BaseController));
    App.ReadyToDepartureCouriersControllers = ReadyToDepartureCouriersControllers;
    angular.module("app").controller("ReadyToDepartureCouriersControllers", ReadyToDepartureCouriersControllers);
    var OnTheWayCouriersController = /** @class */ (function (_super) {
        __extends(OnTheWayCouriersController, _super);
        function OnTheWayCouriersController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.sale, url.saleQuery, excel) || this;
            //orderStates: string[] = ["OnTheWay"];
            _this.total = 0;
            _this.due = 0;
            _this.searchRequest["thana"] = _this.thanas[0];
            _this.searchRequest["orderState"] = App.OrderState.OnTheWay;
            _this.search();
            return _this;
        }
        OnTheWayCouriersController.prototype.search = function () {
            var self = this;
            this.due = 0;
            this.total = 0;
            var successCallback = function (response) {
                console.log(response);
                self.models = response.Models;
                if (self.models.length === 0) {
                    console.log('No search result found');
                }
                else {
                    for (var i = 0; i < self.models.length; i++) {
                        self.total += self.models[i].totalAmount;
                        self.due += self.models[i].dueAmount;
                    }
                }
                self.totalCount = response.Count;
                self.searchRequest.totalPage = Math.ceil(response.Count / 10);
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService.search(self.searchRequest, self.queryUrl + "/SearchReadyToDeparture")
                .then(successCallback, errorCallback);
        };
        OnTheWayCouriersController.prototype.nextStateAll = function () {
            _super.prototype.nextStateAll.call(this, this.models);
        };
        OnTheWayCouriersController.prototype.loadDeliverymans = function () {
            var self = this;
            var successCallback = function (response) {
                self.deliverymans = response.Models;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            var searchRequest = new App.SearchRequest();
            searchRequest["role"] = "DeliveryMan";
            var httpUrl = self.url.employee + "Query" + "/Search";
            self.searchService
                .search(searchRequest, httpUrl)
                .then(successCallback, errorCallback);
        };
        OnTheWayCouriersController.prototype.deliverymanChanged = function (d) {
            var self = this;
            self.search();
        };
        OnTheWayCouriersController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return OnTheWayCouriersController;
    }(App.BaseController));
    App.OnTheWayCouriersController = OnTheWayCouriersController;
    angular.module("app").controller("OnTheWayCouriersController", OnTheWayCouriersController);
    var DeliveredCouriersController = /** @class */ (function (_super) {
        __extends(DeliveredCouriersController, _super);
        function DeliveredCouriersController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.sale, url.saleQuery, excel) || this;
            _this.total = 0;
            _this.due = 0;
            _this.searchRequest["thana"] = _this.thanas[0];
            _this.searchRequest["orderState"] = App.OrderState.Delivered;
            _this.search();
            return _this;
        }
        DeliveredCouriersController.prototype.search = function () {
            var self = this;
            this.due = 0;
            this.total = 0;
            var successCallback = function (response) {
                console.log(response);
                self.models = response.Models;
                if (self.models.length === 0) {
                    console.log('No search result found');
                }
                else {
                    for (var i = 0; i < self.models.length; i++) {
                        self.total += self.models[i].totalAmount;
                        self.due += self.models[i].dueAmount;
                    }
                }
                self.totalCount = response.Count;
                self.searchRequest.totalPage = Math.ceil(response.Count / 10);
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService.search(self.searchRequest, self.queryUrl + "/SearchReadyToDeparture")
                .then(successCallback, errorCallback);
        };
        DeliveredCouriersController.prototype.nextStateAll = function () {
            _super.prototype.nextStateAll.call(this, this.models);
        };
        DeliveredCouriersController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return DeliveredCouriersController;
    }(App.BaseController));
    App.DeliveredCouriersController = DeliveredCouriersController;
    angular.module("app").controller("DeliveredCouriersController", DeliveredCouriersController);
    var DealerSalesController = /** @class */ (function (_super) {
        __extends(DealerSalesController, _super);
        function DealerSalesController(location, state, stateParams, url, search, save, authService, localStorageService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.sale, url.saleQuery, excel) || this;
            _this.total = 0;
            _this.due = 0;
            var self = _this;
            self.localStorageService = localStorageService;
            self.searchRequest.startDate = self.startDate.toJSON();
            self.searchRequest.endDate = self.endDate.toJSON();
            _this.searchRequest["orderState"] = "Completed";
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
            self.search();
            return _this;
        }
        DealerSalesController.prototype.loadData = function () {
            if (this.startDate != null) {
                this.searchRequest.startDate = this.startDate.toDateString();
            }
            if (this.endDate != null) {
                this.searchRequest.endDate = this.endDate.toDateString();
            }
            this.search();
        };
        DealerSalesController.prototype.search = function () {
            var self = this;
            self.total = 0;
            self.due = 0;
            var successCallback = function (response) {
                console.log('dealer-- ' + response.Models);
                self.models = response.Models;
                console.log('dealer-- ' + self.models);
                if (self.models.length === 0) {
                    console.log('No search result found');
                }
                else {
                    for (var i = 0; i < self.models.length; i++) {
                        self.total += self.models[i].totalAmount;
                        self.due += self.models[i].dueAmount;
                    }
                }
                self.totalCount = response.Count;
                self.searchRequest.totalPage = Math.ceil(response.Count / 10);
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchRequest["IsDealerSale"] = true;
            self.searchRequest.isIncludeParents = true;
            self.searchService
                .search(self.searchRequest, self.queryUrl + "/Search")
                .then(successCallback, errorCallback);
        };
        DealerSalesController.prototype.receiptPrint = function (id) {
            var self = this;
            var name = self.localStorageService.get2(App.LocalStorageKeys.ReceiptName);
            if (name == null) {
                name = 'root.receipt3';
                self.localStorageService.save(App.LocalStorageKeys.ReceiptName, name);
            }
            self.navigateState(name, { id: id });
        };
        DealerSalesController.prototype.activateDealerSale = function () {
            var self = this;
            self.model.isDealerSale = true;
        };
        DealerSalesController.$inject = [
            "$location", "$state", "$stateParams", "UrlService", "SearchService", "SaveService",
            "AuthService", "LocalStorageService", 'Excel'
        ];
        return DealerSalesController;
    }(App.BaseController));
    App.DealerSalesController = DealerSalesController;
    angular.module("app").controller("DealerSalesController", DealerSalesController);
    var DealerSalesCancelController = /** @class */ (function (_super) {
        __extends(DealerSalesCancelController, _super);
        function DealerSalesCancelController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.sale, url.saleQuery, excel) || this;
            _this.purchaseTotal = 0;
            if (_this.stateParams["id"]) {
                if (authService.accountInfo.role !== 'Deliveryman') {
                    _this.loadDeliverymans();
                }
                _this.loadDetail();
            }
            else {
                _this.back();
            }
            return _this;
        }
        DealerSalesCancelController.prototype.loadDetail = function () {
            console.log(this.stateParams);
            var self = this;
            var successCallback = function (response) {
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
            var errorCallback = function (error) {
                console.log(error);
            };
            var searchRequest = new App.SearchRequest();
            searchRequest.id = this.stateParams["id"];
            searchRequest.page = -1;
            var id = this.stateParams["id"];
            var httpUrl = self.url.saleQuery + "/Detail?id=" + id;
            self.searchService
                .search(searchRequest, httpUrl)
                .then(successCallback, errorCallback);
        };
        DealerSalesCancelController.prototype.loadDeliverymans = function () {
            var self = this;
            var successCallback = function (response) {
                self.deliverymans = response.Models;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            var searchRequest = new App.SearchRequest();
            searchRequest["role"] = "DeliveryMan";
            var httpUrl = self.url.employee + "Query" + "/Search";
            self.searchService
                .search(searchRequest, httpUrl)
                .then(successCallback, errorCallback);
        };
        DealerSalesCancelController.prototype.deliverymanChanged = function (d) {
            var self = this;
            self.model.deliverymanName = d.userName;
            self.model.deliverymanId = d.id;
        };
        DealerSalesCancelController.prototype.nextState = function () {
            var self = this;
            var successCallback = function (response) {
                self.loadDetail();
            };
            var errorCallback = function (error) {
                console.log(error);
                if (error.status === 500) {
                    alert(error.data.exceptionMessage);
                }
                else {
                    alert("Error Occurred. Please contact with Administrator");
                }
            };
            self.model.customer = null;
            self.model.transactions = null;
            self.saveService.update(self.model, self.url.sale + "/NextState").then(successCallback, errorCallback);
        };
        DealerSalesCancelController.prototype.receiptView = function () {
            var self = this;
            self.stateService.go("root.receipt", { receipt: self.model });
        };
        DealerSalesCancelController.prototype.loadInstallments = function (installmentId) {
            var self = this;
            var searchRequest = new App.SearchRequest();
            var success = function (response) {
                self.model.installment = response.data;
                console.log(self.model.installment);
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            searchRequest.id = installmentId;
            searchRequest.page = -1;
            var url = self.url.installmentQuery + '/SearchDetail';
            self.searchService.search(searchRequest, url).then(success, errorCallback);
        };
        DealerSalesCancelController.prototype.installmentPay = function (p) {
            console.log(p);
        };
        DealerSalesCancelController.prototype.updateState = function () {
            var self = this;
            var successCallback = function (response) {
                self.search();
            };
            var errorCallback = function (error) {
                console.log(error);
                if (error.status === 500) {
                    alert(error.data.exceptionMessage);
                }
                else {
                    alert("Error Occurred. Please contact with Administrator");
                }
            };
            this.saveService.update(self.model, self.url.sale + "/UpdateState")
                .then(successCallback, errorCallback);
        };
        DealerSalesCancelController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "$uibModal", 'Excel'
        ];
        return DealerSalesCancelController;
    }(App.BaseController));
    App.DealerSalesCancelController = DealerSalesCancelController;
    angular.module("app").controller("DealerSalesCancelController", DealerSalesCancelController);
    var ProductPendingListController = /** @class */ (function (_super) {
        __extends(ProductPendingListController, _super);
        function ProductPendingListController(location, state, stateParams, url, search, save, authService, localStorageService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.sale, url.saleQuery, excel) || this;
            _this.totalQuantity = 0;
            _this.totalPrice = 0;
            _this.search();
            return _this;
        }
        ProductPendingListController.prototype.search = function () {
            var self = this;
            self.totalQuantity = 0;
            self.totalPrice = 0;
            var successCallback = function (response) {
                App.Display.log('i am in pending product success callback');
                console.log(response.data);
                self.models = response.data.histories;
                self.sales = response.data.sales;
                for (var j = 0; j < self.sales.length; j++) {
                    self.sales[j].nextOrderState = "Created";
                }
                for (var i = 0; i < response.data.histories.length; i++) {
                    self.totalQuantity += response.data.histories[i].quantity;
                    self.totalPrice += response.data.histories[i].total;
                }
                self.totalCount = response.Count;
                self.searchRequest.totalPage = Math.ceil(response.Count / 10);
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchRequest["orderState"] = "Pending";
            self.searchRequest.page = -1;
            self.searchRequest.isIncludeParents = true;
            self.searchService.search(self.searchRequest, self.queryUrl + "/PendingProducts")
                .then(successCallback, errorCallback);
        };
        ProductPendingListController.prototype.updateStateAll = function () {
            _super.prototype.updateStateAll.call(this, this.sales);
        };
        ProductPendingListController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", 'Excel'
        ];
        return ProductPendingListController;
    }(App.BaseController));
    App.ProductPendingListController = ProductPendingListController;
    angular.module("app").controller("ProductPendingListController", ProductPendingListController);
    var WareHouseWiseProductPendingListController = /** @class */ (function (_super) {
        __extends(WareHouseWiseProductPendingListController, _super);
        function WareHouseWiseProductPendingListController(location, state, stateParams, url, search, save, authService, localStorageService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.sale, url.saleQuery, excel) || this;
            _this.totalQuantity = 0;
            _this.totalPrice = 0;
            _this.totalOnHand = 0;
            _this.localStorageService = localStorageService;
            _this.loadWarehouses().then(function (result) {
                if (_this.warehouses.length === 1) {
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
            _this.search();
            return _this;
        }
        WareHouseWiseProductPendingListController.prototype.search = function () {
            var self = this;
            self.totalQuantity = 0;
            self.totalPrice = 0;
            self.totalOnHand = 0;
            var successCallback = function (response) {
                App.Display.log('i am in pending product success callback');
                console.log(response.data);
                self.models = response.data.histories;
                self.sales = response.data.sales;
                for (var j = 0; j < self.sales.length; j++) {
                    self.sales[j].nextOrderState = "Created";
                }
                for (var i = 0; i < response.data.histories.length; i++) {
                    self.totalQuantity += response.data.histories[i].quantity;
                    self.totalPrice += response.data.histories[i].total;
                    self.totalOnHand += response.data.histories[i].onHand;
                }
                self.totalCount = response.Count;
                self.searchRequest.totalPage = Math.ceil(response.Count / 10);
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchRequest["orderState"] = "Pending";
            self.searchRequest.page = -1;
            self.searchRequest.isIncludeParents = true;
            self.searchService.search(self.searchRequest, self.queryUrl + "/PendingProducts")
                .then(successCallback, errorCallback);
        };
        WareHouseWiseProductPendingListController.prototype.updateStateAll = function () {
            _super.prototype.updateStateAll.call(this, this.sales);
        };
        WareHouseWiseProductPendingListController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", 'Excel'
        ];
        return WareHouseWiseProductPendingListController;
    }(App.BaseController));
    App.WareHouseWiseProductPendingListController = WareHouseWiseProductPendingListController;
    angular.module("app").controller("WareHouseWiseProductPendingListController", WareHouseWiseProductPendingListController);
})(App || (App = {}));
