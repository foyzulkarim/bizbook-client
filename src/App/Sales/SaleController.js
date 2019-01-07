// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
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
angular.module('app')
    .controller('ModalInstanceCtrl', [
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
var App;
(function (App) {
    "use strict";
    var SalesController = /** @class */ (function (_super) {
        __extends(SalesController, _super);
        function SalesController(location, state, stateParams, url, search, save, authService, localStorageService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.sale, url.saleQuery, excel) || this;
            _this.orderFroms = [];
            _this.orderTypes = [];
            _this.saleFroms = [
                "All", "BizBook365", "Facebook", "Website", "PhoneCall", "MobileApp", "Referral", "Other"
            ];
            _this.saleChannels = ["All", "Inhouse", "CashOnDelivery", "Courier", "Condition"];
            _this.headers = [];
            _this.keys = [];
            _this.searchDates = [];
            _this.searchDate = [
                "Created", "Modified", "OrderDate"
            ];
            _this.orderbyValue = "RequiredDeliveryDateByCustomer";
            _this.isAccendingValue = true;
            _this.isTaggedSale = false;
            _this.total = 0;
            _this.due = 0;
            _this.localStorageService = localStorageService;
            _this.Excel = excel;
            var stateName = _this.localStorageService.get(App.LocalStorageKeys.OrderState);
            if (!stateName) {
                _this.localStorageService.save(App.LocalStorageKeys.OrderState, _this.orderStates[0]);
                stateName = _this.orderStates[0];
            }
            _this.setSearchKeyword();
            _this.setStartDate();
            _this.setEndDate();
            var orderbyKeyword = _this.localStorageService.get(App.LocalStorageKeys.OrderByKeyword);
            if (!orderbyKeyword) {
                orderbyKeyword = _this.orderbyValue;
                _this.localStorageService.save(App.LocalStorageKeys.OrderByKeyword, _this.orderbyValue);
            }
            var isAccendingKeyword = _this.localStorageService.get(App.LocalStorageKeys.IsAscendingValue);
            if (!isAccendingKeyword) {
                isAccendingKeyword = _this.isAccendingValue;
                _this.localStorageService.save(App.LocalStorageKeys.IsAscendingValue, _this.isAccendingValue);
            }
            var isTaggedSale = _this.localStorageService.get(App.LocalStorageKeys.IsTaggedSale);
            if (isTaggedSale == null) {
                isTaggedSale = _this.isTaggedSale;
                _this.localStorageService.save(App.LocalStorageKeys.IsTaggedSale, _this.isTaggedSale);
            }
            var saleTag = _this.localStorageService.get(App.LocalStorageKeys.SaleTag);
            if (saleTag == null) {
                saleTag = "";
                _this.localStorageService.save(App.LocalStorageKeys.SaleTag, saleTag);
            }
            for (var enumMember in App.SaleFrom) {
                if (App.SaleFrom.hasOwnProperty(enumMember)) {
                    var isValueProperty = parseInt(enumMember, 10) >= 0;
                    if (isValueProperty) {
                        var i = App.SaleFrom[enumMember];
                        _this.orderFroms.push(i);
                    }
                }
            }
            for (var enumMember in App.SearchDate) {
                if (App.SearchDate.hasOwnProperty(enumMember)) {
                    var isValueProperty = parseInt(enumMember, 10) >= 0;
                    if (isValueProperty) {
                        var i = App.SearchDate[enumMember];
                        _this.searchDates.push(i);
                    }
                }
            }
            var searchDynamicDate = _this.localStorageService.get(App.LocalStorageKeys.SearchDate);
            if (searchDynamicDate == null) {
                searchDynamicDate = _this.searchDates[0];
                _this.localStorageService.save(App.LocalStorageKeys.SearchDate, searchDynamicDate);
            }
            var saleFrom = _this.localStorageService.get(App.LocalStorageKeys.SaleFrom);
            if (saleFrom == null) {
                saleFrom = _this.orderFroms[0];
                _this.localStorageService.save(App.LocalStorageKeys.SaleFrom, saleFrom);
            }
            var isOnlyDues = _this.localStorageService.get(App.LocalStorageKeys.IsOnlyDues);
            if (isOnlyDues == null) {
                isOnlyDues = false;
                _this.localStorageService.save(App.LocalStorageKeys.IsOnlyDues, isOnlyDues);
            }
            _this.searchRequest.orderBy = orderbyKeyword;
            _this.searchRequest.isAscending = isAccendingKeyword;
            //this.searchRequest.orderBy = "RequiredDeliveryDateByCustomer";
            // this.searchRequest.isAscending = "true";
            _this.searchRequest["dateSearchColumn"] = searchDynamicDate;
            _this.searchRequest["orderState"] = stateName;
            _this.searchRequest["onlyDues"] = isOnlyDues;
            _this.searchRequest["isTaggedSale"] = isTaggedSale;
            _this.searchRequest["saleTag"] = saleTag;
            _this.searchRequest["saleFrom"] = saleFrom;
            var page = _this.localStorageService.get(App.LocalStorageKeys.SaleListPageNo);
            if (!page) {
                _this.localStorageService.save(App.LocalStorageKeys.SaleListPageNo, 1);
                page = 1;
            }
            console.log("searchkey" + _this.searchRequest.keyword);
            _this.searchRequest.page = page;
            //this.searchByWarehouse().then(result => {
            //    console.log('searched.', result);
            //});
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
            return _this;
        }
        SalesController.prototype.changeSearchDate = function () {
            var self = this;
            self.localStorageService.save(App.LocalStorageKeys.SearchDate, self.searchRequest["DateSearchColumn"]);
            self.search();
        };
        SalesController.prototype.searchOrders = function () {
            if (this.startDate != null) {
                this.searchRequest.startDate = this.startDate.toDateString();
            }
            if (this.endDate != null) {
                this.searchRequest.endDate = this.endDate.toDateString();
            }
            this.search();
        };
        SalesController.prototype.getHeaders = function () {
            return this.headers;
        };
        SalesController.prototype.saveSearchKeyword = function () {
            var self = this;
            self.localStorageService.save(App.LocalStorageKeys.SearchKeyword, self.searchRequest.keyword);
        };
        SalesController.prototype.saveOrderByValue = function () {
            var self = this;
            self.localStorageService.save(App.LocalStorageKeys.OrderByKeyword, self.searchRequest.orderBy);
            self.localStorageService.save(App.LocalStorageKeys.IsAscendingValue, self.searchRequest.isAscending);
            this.search();
        };
        SalesController.prototype.search = function () {
            var self = this;
            self.total = 0;
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
                        self.total += self.models[i].payableTotalAmount;
                        self.due += self.models[i].dueAmount;
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
        SalesController.prototype.showReceipt = function (id) {
            var self = this;
            var name = self.localStorageService.get2(App.LocalStorageKeys.ReceiptName);
            if (name == null) {
                name = 'root.receipt3';
                self.localStorageService.save2(App.LocalStorageKeys.ReceiptName, name);
            }
            self.navigateState(name, { id: id });
        };
        SalesController.prototype.showChalan = function (id) {
            var self = this;
            var chalanName = self.localStorageService.get(App.LocalStorageKeys.ChalanName);
            if (!chalanName) {
                chalanName = 'root.chalan';
                self.localStorageService.save(App.LocalStorageKeys.ChalanName, chalanName);
            }
            self.navigateState(chalanName, { id: id });
        };
        SalesController.prototype.goto = function (page) {
            var self = this;
            self.localStorageService.save(App.LocalStorageKeys.SaleListPageNo, page);
            _super.prototype.goto.call(this, page);
        };
        SalesController.prototype.saveChangedState = function () {
            var self = this;
            self.localStorageService.save(App.LocalStorageKeys.OrderState, self.searchRequest["orderState"]);
            self.search();
        };
        SalesController.prototype.saveChangeOrderFrom = function () {
            var self = this;
            self.localStorageService.save(App.LocalStorageKeys.SaleFrom, self.searchRequest["saleFrom"]);
            self.search();
        };
        SalesController.prototype.saveChangeOnlyDues = function () {
            var self = this;
            self.localStorageService.save(App.LocalStorageKeys.IsOnlyDues, self.searchRequest["onlyDues"]);
            self.search();
        };
        SalesController.prototype.updateKeys = function () {
            var self = this;
            self.localStorageService.save(App.LocalStorageKeys.SaleListGridKeys, self.keys);
            self.generateCsvModels();
        };
        SalesController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", 'Excel'
        ];
        return SalesController;
    }(App.BaseController));
    App.SalesController = SalesController;
    angular.module("app").controller("SalesController", SalesController);
    var SalesDuesController = /** @class */ (function (_super) {
        __extends(SalesDuesController, _super);
        function SalesDuesController(location, state, stateParams, url, search, save, authService, localStorageService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.sale, url.saleQuery, excel) || this;
            _this.orderFroms = [];
            _this.orderTypes = [];
            _this.saleFroms = [
                "All", "BizBook365", "Facebook", "Website", "PhoneCall", "MobileApp", "Referral", "Other"
            ];
            _this.saleChannels = ["All", "Inhouse", "CashOnDelivery", "Courier", "Condition"];
            _this.headers = ["id", "date", "orderNumber", "payableTotalAmount", "paidAmount", "dueAmount", "customerName", "customerPhone"];
            _this.total = 0;
            _this.due = 0;
            _this.orderbyValue = "Modified";
            _this.isAccendingValue = true;
            _this.localStorageService = localStorageService;
            // this.searchRequest["orderState"] = this.orderStates[0];
            //this.searchRequest["saleFrom"] = this.saleFroms[0];
            //this.searchRequest["saleChannel"] = this.saleChannels[0];
            //this.searchRequest["thana"] = this.thanas[0];
            var stateName = _this.localStorageService.get(App.LocalStorageKeys.DueOrderState);
            console.log(stateName);
            if (!stateName) {
                _this.localStorageService.save(App.LocalStorageKeys.DueOrderState, _this.orderStates[0]);
                stateName = _this.orderStates[0];
            }
            var orderbyKeyword = _this.localStorageService.get(App.LocalStorageKeys.OrderByKeyword);
            if (!orderbyKeyword) {
                _this.localStorageService.save(App.LocalStorageKeys.OrderByKeyword, _this.orderbyValue);
                orderbyKeyword = _this.orderbyValue;
            }
            var isAccendingKeyword = _this.localStorageService.get(App.LocalStorageKeys.IsAscendingValue);
            if (!isAccendingKeyword) {
                _this.localStorageService.save(App.LocalStorageKeys.IsAscendingValue, _this.isAccendingValue);
                isAccendingKeyword = _this.isAccendingValue;
            }
            _this.searchRequest.orderBy = orderbyKeyword;
            _this.searchRequest.isAscending = isAccendingKeyword;
            _this.searchRequest["orderState"] = stateName;
            var page = _this.localStorageService.get(App.LocalStorageKeys.DueSaleListPageNo);
            if (!page) {
                _this.localStorageService.save(App.LocalStorageKeys.DueSaleListPageNo, 1);
                page = 1;
            }
            _this.searchRequest.page = page;
            _this.search();
            return _this;
        }
        SalesDuesController.prototype.searchOrders = function () {
            if (this.startDate != null) {
                this.searchRequest.startDate = this.startDate.toDateString();
            }
            if (this.endDate != null) {
                this.searchRequest.endDate = this.endDate.toDateString();
            }
            this.search();
        };
        SalesDuesController.prototype.search = function () {
            var self = this;
            self.total = 0;
            self.due = 0;
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
                self.totalCount = response.Count;
                self.searchRequest.totalPage = Math.ceil(response.Count / 10);
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchRequest["onlyDues"] = true;
            self.searchService
                .search(self.searchRequest, self.queryUrl + "/Search")
                .then(successCallback, errorCallback);
        };
        SalesDuesController.prototype.showReceipt = function (id) {
            var self = this;
            var name = self.localStorageService.get(App.LocalStorageKeys.ReceiptName);
            if (!name) {
                name = 'root.receipt2';
                self.localStorageService.save(App.LocalStorageKeys.ReceiptName, name);
            }
            self.navigateState(name, { id: id });
        };
        SalesDuesController.prototype.saveChangedState = function () {
            var self = this;
            self.localStorageService.save(App.LocalStorageKeys.DueOrderState, self.searchRequest["orderState"]);
            self.search();
        };
        SalesDuesController.prototype.saveOrderByValue = function () {
            var self = this;
            self.localStorageService.save(App.LocalStorageKeys.OrderByKeyword, self.searchRequest.orderBy);
            self.localStorageService.save(App.LocalStorageKeys.IsAscendingValue, self.searchRequest.isAscending);
            this.search();
        };
        SalesDuesController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", 'Excel'
        ];
        return SalesDuesController;
    }(App.BaseController));
    App.SalesDuesController = SalesDuesController;
    angular.module("app").controller("SalesDuesController", SalesDuesController);
    var SalesTagMangoController = /** @class */ (function (_super) {
        __extends(SalesTagMangoController, _super);
        function SalesTagMangoController(location, state, stateParams, url, search, save, authService, localStorageService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.sale, url.saleQuery, excel) || this;
            _this.orderFroms = [];
            _this.orderTypes = [];
            _this.saleFroms = [
                "All", "BizBook365", "Facebook", "Website", "PhoneCall", "MobileApp", "Referral", "Other"
            ];
            _this.saleChannels = ["All", "Inhouse", "CashOnDelivery", "Courier", "Condition"];
            _this.headers = ["id", "date", "orderNumber", "payableTotalAmount", "paidAmount", "dueAmount", "customerName", "customerPhone"];
            _this.total = 0;
            _this.due = 0;
            _this.orderbyValue = "Modified";
            _this.isAccendingValue = true;
            _this.localStorageService = localStorageService;
            _this.search();
            return _this;
        }
        SalesTagMangoController.prototype.search = function () {
            var self = this;
            self.total = 0;
            self.due = 0;
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
                self.totalCount = response.Count;
                self.searchRequest.totalPage = Math.ceil(response.Count / 10);
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchRequest["isTaggedSale"] = true;
            self.searchRequest["saleTag"] = "Mango";
            self.searchService
                .search(self.searchRequest, self.queryUrl + "/Search")
                .then(successCallback, errorCallback);
        };
        SalesTagMangoController.prototype.showReceipt = function (id) {
            var self = this;
            var name = self.localStorageService.get(App.LocalStorageKeys.ReceiptName);
            if (!name) {
                name = 'root.receipt3';
                self.localStorageService.save(App.LocalStorageKeys.ReceiptName, name);
            }
            self.navigateState(name, { id: id });
        };
        SalesTagMangoController.prototype.saveChangedState = function () {
            var self = this;
            self.localStorageService.save(App.LocalStorageKeys.DueOrderState, self.searchRequest["orderState"]);
            self.search();
        };
        SalesTagMangoController.prototype.saveOrderByValue = function () {
            var self = this;
            self.localStorageService.save(App.LocalStorageKeys.OrderByKeyword, self.searchRequest.orderBy);
            self.localStorageService.save(App.LocalStorageKeys.IsAscendingValue, self.searchRequest.isAscending);
            this.search();
        };
        SalesTagMangoController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", 'Excel'
        ];
        return SalesTagMangoController;
    }(App.BaseController));
    App.SalesTagMangoController = SalesTagMangoController;
    angular.module("app").controller("SalesTagMangoController", SalesTagMangoController);
    var SaleController = /** @class */ (function (_super) {
        __extends(SaleController, _super);
        function SaleController(scope, filter, location, state, stateParams, url, search, save, authService, customerService, $uibModal, localStorageService, anchorScroll, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.sale, url.saleQuery, excel) || this;
            _this.isOnlineSale = false;
            _this.paymentServiceChargePercent = 0;
            _this.quantityIsFloat = true;
            _this.successCallbackLoadCustomer = function (customer) {
                var self = _this;
                if (customer != null) {
                    console.log('customer is ', customer);
                    self.customer = customer;
                    self.model.customerName = self.customer.name;
                    _this.loadAddressesDropdown(self.customer.id);
                }
                else {
                    self.customer = new App.Customer();
                    alert('Could not find any customer by phone number ' + self.model.customerPhone);
                }
            };
            _this.errorCallbackLoadCustomer = function (error) {
                console.log(error);
                alert('Error occurred');
            };
            // local configuration
            _this.shouldPrint = false;
            _this.addToCartIfResultIsOne = false;
            // online
            _this.deliveryTypes = ["CashOnDelivery", "Courier", "Condition"];
            _this.paymentMethods = [
                "Cash", "Cash (Sundarban)", "Cash (SA Paribahan)", "Rocket", "Bkash", "Ucash", "Mycash", "Easycash",
                "Mcash", "Other"
            ];
            _this.orderFroms = ["Facebook", "Website", "PhoneCall", "MobileApp", "BizBook365", "Referral", "Other"];
            _this.saleFroms = ["BizBook365", "Facebook", "Website", "PhoneCall", "MobileApp", "Referral", "Other"];
            _this.saleChannels = ["Inhouse", "CashOnDelivery", "Courier", "Condition"];
            _this.saleDetailTypes = ["Sale", "Damage", "Gift", "Return"];
            _this.modal = $uibModal;
            _this.localStorageService = localStorageService;
            _this.$anchorScroll = anchorScroll;
            _this.selectedRow = null;
            _this.customerService = customerService;
            //this.loadDefaultCustomer();
            //this.loadDistricts();
            _this.setupLocalConfiguration();
            _this.requiredDeliveryDateByCustomer = new Date();
            _this.requiredDeliveryDateByCustomer.setDate(_this.requiredDeliveryDateByCustomer.getDate() + 1);
            _this.orderDate = new Date();
            var self = _this;
            scope.$watch('vm.requiredDeliveryDateByCustomer', function (newValue) {
                //$scope.workerDetail.dateOfBirth = $filter('date')(newValue, 'yyyy/MM/dd');
                var string = filter('date')((newValue), 'dd-MMMM-yyyy');
                self.model.requiredDeliveryDateByCustomer = string;
                console.log(string);
            });
            console.log('this.isOnlineSale', _this.isOnlineSale);
            return _this;
        }
        SaleController.prototype.loadOrderNumber = function () {
            var self = this;
            var successCallback = function (response) {
                console.log('order number', response);
                self.model.orderNumber = response;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService.get(self.url.saleQuery + "/OrderNumber")
                .then(successCallback, errorCallback);
        };
        SaleController.prototype.loadDealers = function () {
            var self = this;
            if (self.dealerSearchRequest.keyword.length < 3) {
                return;
            }
            var successCallback = function (response) {
                console.log('dealers', response);
                self.dealers = response.Models;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService.search(self.dealerSearchRequest, self.url.dealerQuery + "/Search")
                .then(successCallback, errorCallback);
        };
        SaleController.prototype.loadCustomers = function () {
            var self = this;
            if (self.customerSearchRequest.keyword.length < 3) {
                return;
            }
            var successCallback = function (response) {
                console.log('customers ', response);
                self.customers = response.Models;
                for (var i = 0; i < self.customers.length; i++) {
                    var addressLength = self.customers[i].addresses.length;
                    var newAddresses = [];
                    for (var j = 0; j < addressLength; j++) {
                        //Display.log(self.customers[i].addresses[j]);
                        if (self.customers[i].addresses[j].isActive) {
                            newAddresses.push(self.customers[i].addresses[j]);
                        }
                    }
                    self.customers[i].addresses = newAddresses;
                }
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.customerSearchRequest.isIncludeParents = true;
            self.customerSearchRequest["IsCustomerActive"] = true;
            self.searchService
                .search(self.customerSearchRequest, self.url.customerQuery + "/Search")
                .then(successCallback, errorCallback);
        };
        SaleController.prototype.loadGuarantor1 = function () {
            var self = this;
            if (self.guarantor1SearchRequest.keyword.length < 3) {
                return;
            }
            var successCallback = function (response) {
                console.log('gurantor1s ', response);
                self.gurantor1s = response.Models;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.guarantor1SearchRequest.isIncludeParents = true;
            self.customerSearchRequest["IsCustomerActive"] = true;
            self.searchService
                .search(self.guarantor1SearchRequest, self.url.customerQuery + "/Search")
                .then(successCallback, errorCallback);
        };
        SaleController.prototype.selectGuarantor1 = function (g) {
            var self = this;
            self.model.guarantor1 = g;
            self.model.guarantor1Id = g.id;
        };
        SaleController.prototype.loadGuarantor2 = function () {
            var self = this;
            if (self.guarantor2SearchRequest.keyword.length < 3) {
                return;
            }
            var successCallback = function (response) {
                console.log('gurantor2s ', response);
                self.gurantor2s = response.Models;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.guarantor2SearchRequest.isIncludeParents = true;
            self.guarantor2SearchRequest["IsCustomerActive"] = true;
            self.searchService
                .search(self.guarantor2SearchRequest, self.url.customerQuery + "/Search")
                .then(successCallback, errorCallback);
        };
        SaleController.prototype.selectGuarantor2 = function (g) {
            var self = this;
            self.model.guarantor2 = g;
            self.model.guarantor2Id = g.id;
        };
        SaleController.prototype.loadEmplyees = function () {
            var self = this;
            var successCallback = function (response) {
                console.log(response);
                self.employees = response.Models;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchRequest["role"] = "Salesman";
            self.searchService
                .search(self.searchRequest, self.url.employeeInfoQuery + "/Dropdown")
                .then(successCallback, errorCallback);
        };
        SaleController.prototype.employeeInfoChanged = function (emp) {
            var self = this;
            self.model.employeeInfoId = emp.id;
            self.model.employeeInfoName = emp.text;
        };
        SaleController.prototype.loadCustomer = function () {
            var self = this;
            self.customerService.loadCustomer(self.model.customerPhone)
                .then(self.successCallbackLoadCustomer, self.errorCallbackLoadCustomer);
        };
        SaleController.prototype.loadDefaultCustomer = function () {
            var self = this;
            self.model.customerPhone = "0";
            self.customerService.loadCustomer(self.model.customerPhone)
                .then(self.successCallbackLoadCustomer, self.errorCallbackLoadCustomer);
        };
        SaleController.prototype.selectCustomer = function (selecterCustomer) {
            var self = this;
            self.customer = selecterCustomer;
            console.log(self.customer);
            self.addresses = self.customer.addresses;
        };
        SaleController.prototype.loadProductDetails = function () {
            var _this = this;
            var self = this;
            console.log(self.isOnlineSale, 'self.isOnlineSale');
            if (self.productDetailSearchRequest.keyword.length < 3) {
                return;
            }
            var successCallback = function (response) {
                self.productDetails = response.Models;
                self.productDetailsCount = response.Count;
                if (self.productDetailsCount === 1 && self.addToCartIfResultIsOne) {
                    _this.addToCart2(self.productDetails[0]);
                }
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.productDetailSearchRequest["isProductActive"] = true;
            self.productDetailSearchRequest.warehouseId = self.model.warehouseId;
            // self.productDetailSearchRequest.page = -1;
            self.searchService
                .search(self.productDetailSearchRequest, self.url.productDetailQuery + "/SearchByWarehouse")
                .then(successCallback, errorCallback);
        };
        SaleController.prototype.getPriceAndName = function () {
            //this.setProductDetail(this.saleDetail.productDetail);
            this.saleDetail.total = this.saleDetail.quantity * this.saleDetail.salePricePerUnit;
        };
        SaleController.prototype.getReturn = function () {
            this.model.dueAmount = this.model.totalAmount - this.model.paidAmount;
        };
        SaleController.prototype.setProductDetail = function (detail) {
            var self = this;
            if (self.model.isDealerSale) {
                var dealerPriceChange = this.localStorageService.get2(App.LocalStorageKeys.DealerPriceChange);
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
            this.saleDetail.saleDetailType = App.SaleDetailType.Sale.toString();
            this.getPriceAndName();
        };
        //addToCart(): void {
        //    this.model.saleDetails.push(this.saleDetail);
        //    this.updateCartTotal();
        //    this.saleDetail = new SaleDetailViewModel();
        //}
        SaleController.prototype.addToCart = function () {
            this.model.saleDetails.push(this.saleDetail);
            this.updateCartTotal();
            var self = this;
            setTimeout(function (parameters) {
                self.setFocusOnCartItem(self.saleDetail.productDetailId);
                self.saleDetail = new App.SaleDetailViewModel();
            }, 100);
        };
        SaleController.prototype.addToCart2 = function (detail) {
            var exists = this.model.saleDetails.some(function (x) { return x.productDetailId === detail.id; });
            if (exists) {
                alert('Item : ' + detail.name + " is already added in cart.");
                return;
            }
            this.setProductDetail(detail);
            this.addToCart();
        };
        SaleController.prototype.setFocusOnCartItem = function (rowId) {
            var self = this;
            var element = this.getElement('cart-table');
            var tBody = element.tBodies[0];
            console.log(tBody);
            for (var i = 0; i < tBody.rows.length; i++) {
                var row = tBody.rows[i];
                if (row.id === rowId) {
                    self.quantityIsFloat = true;
                    var txtQty = self.getElement('qty-' + rowId);
                    txtQty.focus();
                    txtQty.select();
                }
            }
        };
        SaleController.prototype.getElement = function (id) {
            return document.getElementById(id);
        };
        SaleController.prototype.editCart = function (p) {
            this.saleDetail = p;
            this.removeByAttr(this.model.saleDetails, 'productDetailId', p.productDetailId);
        };
        SaleController.prototype.removeByAttr = function (arr, attr, value) {
            var i = arr.length;
            while (i--) {
                if (arr[i] && arr[i].hasOwnProperty(attr) && (arguments.length > 2 && arr[i][attr] === value)) {
                    arr.splice(i, 1);
                }
            }
            this.updateCartTotal();
        };
        SaleController.prototype.removeFromCart = function (index) {
            //this.removeByAttr(this.model.saleDetails, 'productDetailId', p.productDetailId);
            this.model.saleDetails.splice(index, 1);
            this.updateCartTotal();
        };
        SaleController.prototype.decreaseFromCart = function (index) {
            var quantity = this.model.saleDetails[index].quantity - 1;
            if (quantity === 0) {
                this.removeFromCart(index);
            }
            else {
                var salePrice = this.model.saleDetails[index].salePricePerUnit;
                var discountTotal = this.model.saleDetails[index].discountAmount;
                this.model.saleDetails[index].quantity = quantity;
                this.model.saleDetails[index].total = salePrice * quantity;
                this.model.saleDetails[index].discountTotal = discountTotal * quantity;
            }
            this.updateCartTotal();
        };
        SaleController.prototype.increaseToCart = function (index) {
            var quantity = this.model.saleDetails[index].quantity + 1;
            var salePrice = this.model.saleDetails[index].salePricePerUnit;
            var discountTotal = this.model.saleDetails[index].discountAmount;
            this.model.saleDetails[index].quantity = quantity;
            this.model.saleDetails[index].total = salePrice * quantity;
            this.model.saleDetails[index].discountTotal = discountTotal * quantity;
            this.updateCartTotal();
        };
        SaleController.prototype.updateQuantity = function (index) {
            var salePrice = this.model.saleDetails[index].salePricePerUnit;
            var quantity = this.model.saleDetails[index].quantity;
            this.model.saleDetails[index].quantity = quantity;
            this.model.saleDetails[index].priceTotal =
                this.model.saleDetails[index].salePricePerUnitBeforeDiscount * quantity;
            this.model.saleDetails[index].discountTotal = this.model.saleDetails[index].discountAmount * quantity;
            this.model.saleDetails[index].total = salePrice * quantity;
            this.updateCartTotal();
        };
        SaleController.prototype.setFocusOnSearchBox = function () {
            var txtCustomerSearch = document.getElementById("txtCustomerSearch");
            txtCustomerSearch.focus();
            txtCustomerSearch.select();
            txtCustomerSearch.value = '';
        };
        SaleController.prototype.setFocusOnProductSearch = function () {
            var txtProductSearch = document.getElementById("txtProductSearch");
            console.log(txtProductSearch);
            txtProductSearch.focus();
            txtProductSearch.select();
            txtProductSearch.value = '';
        };
        SaleController.prototype.updateQuantityAll = function () {
            for (var i = 0; i < this.model.saleDetails.length; i++) {
                this.updateQuantity(i);
            }
        };
        SaleController.prototype.updateCartTotal = function () {
            var _this = this;
            var self = this;
            self.model.productAmount = 0;
            self.model.saleDetails.forEach(function (p) { return _this.model.productAmount += p.total; });
            self.updateTransactions();
            self.updateTotal();
        };
        SaleController.prototype.applyDiscount = function () {
            var self = this;
            self.model.payableTotalAmount = self.model.totalAmount - self.model.discountAmount;
            self.model.discountPercent = Math.round((self.model.discountAmount / self.model.totalAmount) * 100);
            self.updateTransactions();
        };
        SaleController.prototype.applyDiscountPercent = function () {
            var self = this;
            self.model.discountAmount = self.model.totalAmount * self.model['discountPercent'] / 100;
            self.applyDiscount();
        };
        SaleController.prototype.applyItemDiscount = function (p) {
            p.discountAmount = p.salePricePerUnitBeforeDiscount * p.discountPercent / 100;
            p.salePricePerUnit = p.salePricePerUnitBeforeDiscount - p.discountAmount;
            p.priceTotal = p.salePricePerUnitBeforeDiscount * p.quantity;
            p.discountTotal = p.discountAmount * p.quantity;
            p.total = p.salePricePerUnit * p.quantity;
            this.updateQuantityAll();
        };
        SaleController.prototype.applyItemDiscountPercent = function (p) {
            p.discountPercent = Math.round((p.discountAmount / p.salePricePerUnitBeforeDiscount) * 100);
            p.salePricePerUnit = p.salePricePerUnitBeforeDiscount - p.discountAmount;
            p.priceTotal = p.salePricePerUnitBeforeDiscount * p.quantity;
            p.discountTotal = p.discountAmount * p.quantity;
            p.total = p.salePricePerUnit * p.quantity;
            this.updateQuantityAll();
        };
        SaleController.prototype.resetItemDiscount = function (p) {
            p.salePricePerUnit = p.salePricePerUnitBeforeDiscount;
            p.discountPercent = 0;
            p.discountTotal = 0;
            p.discountAmount = 0;
            p.salePricePerUnitBeforeDiscount = 0;
            this.updateQuantityAll();
        };
        SaleController.prototype.setFocus = function (id) {
            var element = this.getElement(id);
            console.log(element);
            element.focus();
            element.select();
            //element.value = '';
            //element.focus();
        };
        SaleController.prototype.calculateServiceCharge = function () {
            // service charge = (product amount + delivery charge ) * 1.85
            var self = this;
            self.model.paymentServiceChargeAmount = ((self.model.productAmount + self.model.deliveryChargeAmount) *
                self.paymentServiceChargePercent) /
                100;
            self.updateTotal();
        };
        SaleController.prototype.updateTotal = function () {
            var self = this;
            self.model.totalAmount = self.model.productAmount + self.model.otherAmount +
                self.model.deliveryChargeAmount +
                self.model.paymentServiceChargeAmount;
            self.model.payableTotalAmount = self.model.totalAmount - self.model.discountAmount;
            self.model.dueAmount = self.model.payableTotalAmount - self.model.paidAmount;
        };
        SaleController.prototype.save = function () {
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
            var successCallback = function (response) {
                console.log(response);
                if (self.shouldPrint) {
                    self.print(response.data.id.toString());
                }
                else {
                    if (self.showOrderNumber) {
                        alert("Order number : " + response.data.orderNumber.toString());
                    }
                    self.activate();
                    self.shouldPrint = false;
                }
            };
            var errorCallback = function (error) {
                console.log(error);
                if (error.status === 500) {
                    alert(error.data.exceptionMessage);
                }
                else {
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
                self.model.saleChannel = App.SaleChannel.InHouse;
                self.model.saleFrom = App.SaleFrom.BizBook365.toString();
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
            }
            else {
                self.model.addressId = self.address.id;
            }
            self.model['employeeInfo'] = null;
            if (self.installment.cashPriceAmount > 0) {
                self.model.installment = self.installment;
                if (self.model.installment.installmentDetails && self.model.installment.installmentDetails.length > 0) {
                    for (var k = 0; k < self.model.installment.installmentDetails.length; k++) {
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
            self.localStorageService.save(App.LocalStorageKeys.DeliveryChargeAmount, self.model.deliveryChargeAmount);
            //    self.loadOrderNumber();
            self.saveService.save(self.model, self.commandUrl + "/Add")
                .then(successCallback, errorCallback);
        };
        SaleController.prototype.saveComplete = function () {
            var self = this;
            self.model.orderState = App.OrderState.Completed;
            // self.shouldPrint = true;
            self.save();
        };
        SaleController.prototype.saveAndPrint = function () {
            var self = this;
            self.model.orderState = App.OrderState.Completed;
            this.shouldPrint = true;
            this.save();
        };
        SaleController.prototype.print = function (id) {
            var self = this;
            self.printModel = new App.SaleViewModel();
            var successCallback = function (response) {
                self.printModel = response.data;
                setTimeout(function (p) {
                    var printContents = document.getElementById("receipt").innerHTML;
                    var baseUrl = document.location.host + self.url.clientSubFolder;
                    var popupWin = window.open('', '_blank', 'scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
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
                    };
                    setTimeout(function () {
                        popupWin.print();
                    }, 1000);
                }, 1000);
                self.activate();
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            var searchRequest = new App.SearchRequest();
            searchRequest.id = this.stateParams["id"];
            searchRequest.page = -1;
            var httpUrl = self.url.saleQuery + "/Receipt?id=" + id;
            self.searchService.search(null, httpUrl).then(successCallback, errorCallback);
        };
        SaleController.prototype.resetOrderCustomer = function () {
            this.customer = new App.Customer();
            this.customerSearchRequest.keyword = "";
            this.customers = [];
            this.addresses = [];
            this.address = new App.CustomerAddress();
        };
        SaleController.prototype.resetOrderDealer = function () {
            this.dealer = new App.Dealer();
            this.dealerSearchRequest.keyword = "";
            this.dealers = [];
        };
        SaleController.prototype.resetCustomer = function () {
            this.customer.name = "";
            this.customer.phone = "";
        };
        SaleController.prototype.resetAddress = function () {
            this.address = new App.CustomerAddress();
        };
        SaleController.prototype.activate = function () {
            console.log('im in child activate. ');
            _super.prototype.activate.call(this);
            this.customer = new App.Customer();
            this.installment = new App.Installment();
            this.installmentDetail = new App.InstallmentDetail();
            this.addresses = [];
            this.address = new App.CustomerAddress();
            this.customerSearchRequest = new App.SearchRequest();
            //this.loadCustomers();
            this.productDetailSearchRequest = new App.SearchRequest();
            this.model = new App.SaleViewModel();
            //this.loadOrderNumber();
            this.model.saleFrom = App.SaleFrom.Facebook.toString();
            this.model.saleChannel = App.SaleChannel.InHouse;
            this.saleDetail = new App.SaleDetailViewModel();
            //this.loadProductDetails();
            this.setupDropdowns();
            this.selectedAccountInfo = new App.AccountInfo();
            this.loadAccountInfos();
            this.productDetails = [];
            this.resetOrderCustomer();
            this.dealer = new App.Dealer();
            this.dealerSearchRequest = new App.SearchRequest();
            this.setupLocalConfiguration();
            var self = this;
            this.loadWarehouses().then(function (warehouses) {
                if (self.user.warehouseId) {
                    self.model.warehouseId = self.user.warehouseId;
                }
                else {
                    self.model.warehouseId = warehouses[0].id;
                }
            });
        };
        SaleController.prototype.setupLocalConfiguration = function () {
            var self = this;
            if (self.localStorageService == null) {
                console.log('activation not completed');
                return;
            }
            // getting delivery charge amount from local storage
            self.model.deliveryChargeAmount = 0;
            if (self.isOnlineSale) {
                // console.log('i am in isonlinesale logic', self.isOnlineSale);
                var deliveryChargeAmount = self.localStorageService.get(App.LocalStorageKeys.DeliveryChargeAmount);
                if (!deliveryChargeAmount) {
                    deliveryChargeAmount = 0;
                    self.localStorageService.save(App.LocalStorageKeys.DeliveryChargeAmount, 0);
                }
                self.model.deliveryChargeAmount = (deliveryChargeAmount);
            }
            self.showOrderNumber = self.localStorageService.get(App.LocalStorageKeys.ShowOrderNumberAfterSave);
            self.addToCartIfResultIsOne = self.localStorageService.get(App.LocalStorageKeys.AddToCartIfResultIsOne);
        };
        SaleController.prototype.activateDealerSale = function () {
            var self = this;
            self.model.isDealerSale = true;
            self.model.orderState = App.OrderState.Completed;
        };
        SaleController.prototype.activateOnlineSale = function () {
            var self = this;
            self.isOnlineSale = true;
            self.model.saleFrom = App.SaleFrom.Facebook.toString();
        };
        SaleController.prototype.setupDropdowns = function () {
            var self = this;
            var success = function (response) {
                console.log(response);
                self.transactionMediums = response.transactionMediums;
                self.paymentGatewayServices = response.paymentGatewayServices;
                self.accountInfoTypes = response.accountInfoTypes;
                self.transactionFors = response.transactionFors;
                self.transactionWiths = response.transactionWiths;
                self.transactionFlowTypes = response.transactionFlowTypes;
                self.transaction = new App.Transaction();
                self.transaction.transactionMedium = "Cash";
                self.transaction.paymentGatewayService = "Cash";
                self.transaction.paymentGatewayServiceName = "Cash";
                self.transaction.accountInfoType = "Cash";
                self.accountInfoType = "Cash";
                self.paymentGatewayService = "Cash";
                self.saleDetailType = "Sale";
            };
            var error = function (error) {
                console.log(error);
            };
            self.searchService.get(self.url.transactionQuery + "/Dropdowns").then(success, error);
        };
        SaleController.prototype.loadAccountInfos = function () {
            var self = this;
            var success = function (response) {
                App.Display.log('loadAccountInfos result : ', response);
                self.accountInfos = response.Models;
                if (self.accountInfos.length > 0) {
                    for (var i = 0; i < self.accountInfos.length; i++) {
                        if (self.accountInfos[i].text == "Cash") {
                            self.selectedAccountInfo = self.accountInfos[i];
                            console.log(self.selectedAccountInfo);
                            self.transaction.accountInfoId = self.selectedAccountInfo.id;
                            break;
                        }
                    }
                }
            };
            var error = function (error) {
                App.Display.log(error);
            };
            self.searchService.search(self.searchRequest, self.url.accountInfoQuery + "/Dropdown")
                .then(success, error);
        };
        SaleController.prototype.accountInfoChanged = function () {
            this.transaction.accountInfoTitle = this.selectedAccountInfo["text"];
            this.transaction.accountInfoId = this.selectedAccountInfo.id;
            this.transaction.paymentGatewayServiceName = this.transaction.accountInfoTitle;
        };
        SaleController.prototype.addTransaction = function () {
            var self = this;
            self.model.transactions.push(self.transaction);
            self.updateTransactions();
        };
        SaleController.prototype.removeTransaction = function (index) {
            var self = this;
            self.model.transactions.splice(index, 1);
            self.updateTransactions();
        };
        SaleController.prototype.updateTransactions = function () {
            var self = this;
            self.model.paidAmount = 0;
            $.each(self.model.transactions, function (x) {
                var temp = this;
                self.model.paidAmount += temp.amount;
            });
            self.model.dueAmount = self.model.payableTotalAmount - self.model.paidAmount;
            self.transaction = new App.Transaction();
            self.transaction.transactionMedium = "Cash";
            self.transaction.paymentGatewayServiceName = "Cash";
            self.transaction.accountInfoType = "Cash";
            self.accountInfoChanged();
        };
        SaleController.prototype.changeShowAlertState = function () {
            var self = this;
            self.localStorageService.save(App.LocalStorageKeys.ShowOrderNumberAfterSave, self.showOrderNumber);
        };
        SaleController.prototype.changeSelectPrice = function () {
        };
        SaleController.prototype.loadAddressesDropdown = function (customerId) {
            var self = this;
            var successCallback = function (response) {
                console.log('addresses ', response);
                self.models = response.Models;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            var searchRequest = new App.SearchRequest();
            searchRequest.parentId = customerId;
            searchRequest["isAddressActive"] = true;
            self.searchService
                .search(searchRequest, self.url.customerAddressQuery + "/Dropdown")
                .then(successCallback, errorCallback);
        };
        SaleController.prototype.loadAddressDetail = function (p) {
            console.log(p);
            var self = this;
            var successCallback = function (response) {
                console.log(response);
                self.address = response.data;
                self.isUpdateMode = true;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            var id = self.searchRequest["addressId"];
            console.log(id);
        };
        SaleController.prototype.loadDistricts = function () {
            var self = this;
            var successCallback = function (response) {
                // console.log('locations in controller', response);
                self.locations = response;
                self.districts = self.customerService.loadDistricts();
                self.loadThanas();
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.customerService
                .loadLocations().then(successCallback, errorCallback);
        };
        SaleController.prototype.loadThanas = function () {
            var self = this;
            self.thanas = self.customerService.loadThanas(self.address.district);
            self.loadAreas();
        };
        SaleController.prototype.loadAreas = function () {
            var self = this;
            self.areas = self.customerService.loadAreas(self.address.thana);
            self.address.setThana(self.address.thana);
        };
        SaleController.prototype.getArea = function () {
            var self = this;
            self.address.setArea(self.address.area);
            self.area = self.customerService.getArea(self.address.area);
            self.address.postCode = self.area.postcode;
        };
        // navigation       
        SaleController.prototype.navigateTo = function (div) {
            this.$anchorScroll.yOffset = 150;
            this.location.hash(div);
            this.$anchorScroll();
        };
        SaleController.prototype.keyPressed = function (event) {
            //console.log('keypressed ', event);
            App.Display.log('keypressed', event);
            //shift +s
            var saveOk = event.shiftKey && event.keyCode === 83;
            if (saveOk) {
                var saleConfirmed = confirm("Do you want to save the sale?");
                if (saleConfirmed == true) {
                    this.saveAndPrint();
                }
            }
            //shift +m
            var paymentAmount = event.shiftKey && event.keyCode === 77;
            //shift +p
            var productSearch = event.shiftKey && event.keyCode === 80;
            //shift +c
            var customerSearch = event.shiftKey && event.keyCode === 67;
            var self = this;
            console.log('get key' + paymentAmount);
            if (paymentAmount) {
                var txtPayment = self.getElement('txtPaymentAmount');
                txtPayment.focus();
                txtPayment.value = '';
            }
            if (productSearch) {
                var txtProduct = self.getElement('txtProductSearch');
                txtProduct.focus();
                txtProduct.value = '';
            }
            if (customerSearch) {
                var txtCustomer = self.getElement('txtCustomerSearch');
                txtCustomer.focus();
                txtCustomer.value = '';
            }
        };
        SaleController.prototype.calculateProfitAmount = function () {
            var self = this;
            console.log(self.installment);
            self.installment.profitAmount =
                self.installment.cashPriceAmount * self.installment.profitPercent / 100;
            self.installment.installmentTotalAmount =
                self.installment.cashPriceAmount + self.installment.profitAmount;
            self.model.otherAmount = self.installment.profitAmount;
            this.updateCartTotal();
        };
        SaleController.prototype.calculateDownPaymentAmount = function () {
            var self = this;
            self.installment.downPaymentAmount = self.installment.installmentTotalAmount *
                self.installment.downPaymentPercent /
                100;
            self.installment.installmentDueAmount = self.installment.installmentTotalAmount -
                self.installment.downPaymentAmount;
        };
        SaleController.prototype.calculateInstallmentPerMonth = function () {
            var self = this;
            self.installment.installmentPerMonthAmount =
                self.installment.installmentDueAmount / self.installment.installmentMonth;
        };
        SaleController.prototype.calculatePriceDueAmount = function () {
            var self = this;
            self.installment.cashPriceDueAmount =
                self.installment.cashPriceAmount - self.installment.downPaymentAmount;
        };
        SaleController.prototype.calculateProfitAmountPerMonth = function () {
            var self = this;
            console.log(self.installment);
            self.installment.profitAmountPerMonth =
                self.installment.cashPriceDueAmount * self.installment.profitPercent / 100;
        };
        SaleController.prototype.calculateInstallmentProfitPerMonth = function () {
            var self = this;
            console.log(self.installment);
            self.installment.profitAmount = self.installment.profitAmountPerMonth * self.installment.installmentMonth;
            self.installment.installmentTotalAmount =
                self.installment.cashPriceDueAmount + self.installment.profitAmount;
            self.installment.installmentDueAmount =
                self.installment.cashPriceDueAmount + self.installment.profitAmount;
            self.installment.installmentPerMonthAmount =
                self.installment.installmentDueAmount / self.installment.installmentMonth;
        };
        SaleController.prototype.installmentSaleTypeChanged = function (saleType) {
            this.installment = new App.Installment();
            this.installmentDetail = new App.InstallmentDetail();
            this.installment.saleType = saleType;
        };
        SaleController.prototype.addInstallmentDate = function () {
            var self = this;
            self.installment.installmentDetails.push(self.installmentDetail);
            console.log(self.installment);
            self.installmentDetail = new App.InstallmentDetail();
            self.installmentTotal = 0;
            $.each(self.installment.installmentDetails, function (x) {
                var temp = this;
                self.installmentTotal += temp.scheduledAmount;
            });
        };
        SaleController.prototype.removeInstallmentDetails = function (index) {
            var self = this;
            self.installment.installmentDetails.splice(index, 1);
        };
        SaleController.prototype.dateChanged = function () {
            var self = this;
            console.log(self.orderDate);
            self.model.orderDate = self.orderDate.toDateString();
            self.model.requiredDeliveryDateByCustomer = self.requiredDeliveryDateByCustomer.toDateString();
        };
        SaleController.$inject = [
            "$scope", "$filter", "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "CustomerService",
            "$uibModal", "LocalStorageService", "$anchorScroll", 'Excel'
        ];
        return SaleController;
    }(App.BaseController));
    App.SaleController = SaleController;
    angular.module("app").controller("SaleController", SaleController);
})(App || (App = {}));
