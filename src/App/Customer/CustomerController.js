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
    var CustomersController = /** @class */ (function (_super) {
        __extends(CustomersController, _super);
        function CustomersController(location, state, stateParams, url, search, save, authService, localStorageService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.customer, url.customerQuery, excel) || this;
            _this.headers = ["id", "name", "email", "phone", "totalDue", "modified"];
            _this.localStorageService = localStorageService;
            var page = _this.localStorageService.get2(App.LocalStorageKeys.CustomerListPageNo);
            if (!page) {
                _this.localStorageService.save(App.LocalStorageKeys.CustomerListPageNo, 1);
                page = 1;
            }
            _this.searchRequest.page = page;
            _this.search();
            return _this;
        }
        CustomersController.prototype.goto = function (page) {
            var self = this;
            self.localStorageService.save(App.LocalStorageKeys.CustomerListPageNo, page);
            _super.prototype.goto.call(this, page);
        };
        CustomersController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", 'Excel'
        ];
        return CustomersController;
    }(App.BaseController));
    App.CustomersController = CustomersController;
    angular.module('app').controller('CustomersController', CustomersController);
    var CustomerController = /** @class */ (function (_super) {
        __extends(CustomerController, _super);
        function CustomerController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.customer, url.customerQuery, excel) || this;
            _this.isUpdateMode = false;
            if (_this.stateParams["id"]) {
                _this.isUpdateMode = true;
                //this.edit(this.stateParams["id"]);
                _this.editWithCallBack(_this.stateParams["id"], _this.loadImage);
            }
            return _this;
        }
        CustomerController.prototype.history = function (p) {
            var self = this;
            self.stateService.go('root.customerhistory', { customer: { Id: p.id, Name: p.name, Phone: p.phone, MembarshipCardNo: p.membershipCardNo } });
        };
        CustomerController.prototype.report = function () {
            var self = this;
            window.open(self.url.customerQueryReport, "_blank", "");
        };
        CustomerController.prototype.getBarcode = function () {
            var self = this;
            var successCallback = function (response) {
                if (self.model == null) {
                    self.model = new App.Customer();
                }
                self.model.membershipCardNo = response;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService.get(self.url.customerQueryBarcode).then(successCallback, errorCallback);
        };
        CustomerController.prototype.getTotal = function () {
            var self = this;
            self.customerPointViewModel = new App.CustomerPointViewModel();
            var customers = self.models;
            for (var i = 0; i < customers.length; i++) {
                var p = customers[i];
                self.customerPointViewModel.pointTotal += parseFloat(p["point"].toString() !== "" ? p["point"].toString() : "0");
            }
            return self.customerPointViewModel;
        };
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
        CustomerController.prototype.uploadImage = function (fileName, type) {
            var self = this;
            var file = self[fileName];
            var folderName = "customers";
            var fd = new FormData();
            fd.append('folderName', folderName);
            fd.append("id", self.model.id);
            fd.append('type', type);
            fd.append('file', file);
            self.uploadContent(fd, folderName, self.model.id, type);
        };
        CustomerController.prototype.loadImage = function (model, self) {
            var random = (new Date()).toString();
            self["customerProfileImageUrl"] = self.url.getImage + "?folderName=customers&id=" + self.model.id + "&name=profile.jpeg&timestamp=" + random;
            self["customerNid1ImageUrl"] = self.url.getImage + "?folderName=customers&id=" + self.model.id + "&name=nid1.jpeg&timestamp=" + random;
            self["customerNid2ImageUrl"] = self.url.getImage + "?folderName=customers&id=" + self.model.id + "&name=nid2.jpeg&timestamp=" + random;
        };
        CustomerController.prototype.uploadContent = function (fd, folderName, id, type) {
            var self = this;
            self.saveService.upload(self.url.uploadImage, fd).then(function (response) {
                self.loadImage(self.model, self);
            }, function (error) {
                console.log(error);
            });
        };
        CustomerController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return CustomerController;
    }(App.BaseController));
    App.CustomerController = CustomerController;
    angular.module("app").controller("CustomerController", CustomerController);
    var CustomerAddressesController = /** @class */ (function (_super) {
        __extends(CustomerAddressesController, _super);
        function CustomerAddressesController(location, state, stateParams, url, search, save, authService, customerService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.customerAddress, url.customerAddressQuery, excel) || this;
            _this.customerService = customerService;
            if (_this.stateParams["id"]) {
                _this.customerId = _this.stateParams["id"];
                _this.searchRequest.parentId = _this.customerId;
                _this.activate();
            }
            return _this;
        }
        CustomerAddressesController.prototype.addressChanged = function () {
            var self = this;
            console.log(self.searchRequest);
            self.loadDetail(self.searchRequest.id);
        };
        CustomerAddressesController.prototype.loadDropdown = function () {
            var self = this;
            var successCallback = function (response) {
                console.log('addresses ', response);
                self.models = response.Models;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService
                .search(self.searchRequest, self.url.customerAddressQuery + "/Dropdown")
                .then(successCallback, errorCallback);
        };
        CustomerAddressesController.prototype.loadDetail = function (id) {
            var self = this;
            var successCallback = function (response) {
                console.log(response);
                self.model = response.data;
                self.isUpdateMode = true;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService
                .search(self.searchRequest, self.url.customerAddressQuery + "/Detail?id=" + id)
                .then(successCallback, errorCallback);
        };
        CustomerAddressesController.prototype.activate = function () {
            this.model = new App.CustomerAddress();
            this.model.customerId = this.customerId;
            this.models = [];
            this.isUpdateMode = false;
            this.searchRequest = new App.SearchRequest();
            this.searchRequest.parentId = this.customerId;
            this.loadDropdown();
        };
        CustomerAddressesController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService",
            "CustomerService", 'Excel'
        ];
        return CustomerAddressesController;
    }(App.BaseController));
    App.CustomerAddressesController = CustomerAddressesController;
    angular.module('app').controller('CustomerAddressesController', CustomerAddressesController);
    var CustomerFeedbackController = /** @class */ (function (_super) {
        __extends(CustomerFeedbackController, _super);
        function CustomerFeedbackController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.customerFeedback, url.customerFeedbackQuery, excel) || this;
            _this.feedbackTypes = ["Positive", "Negative", "Other"];
            _this.isUpdateMode = false;
            if (_this.stateParams["id"]) {
                _this.isUpdateMode = true;
                _this.edit2(_this.stateParams["id"]);
            }
            return _this;
        }
        CustomerFeedbackController.prototype.setFocusOnSearchBox = function () {
            var txtCustomerSearch = document.getElementById("txtCustomerSearch");
            txtCustomerSearch.focus();
            txtCustomerSearch.select();
            txtCustomerSearch.value = '';
        };
        CustomerFeedbackController.prototype.loadCustomers = function () {
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
        CustomerFeedbackController.prototype.selectCustomer = function (selecterCustomer) {
            var self = this;
            self.customer = selecterCustomer;
            var successCallback = function (response) {
                self.model = response.data;
            };
            var errorCallback = function (error) {
                console.log(error);
                alert('Error occurred');
            };
            var searchRequest = new App.SearchRequest();
            searchRequest.parentId = selecterCustomer.id;
            searchRequest.page = -1;
            self.searchService
                .search(searchRequest, self.url.saleQuery + "/Search")
                .then(successCallback, errorCallback);
        };
        CustomerFeedbackController.prototype.selectSaleList = function (selectSaleList) {
            var self = this;
            var successCallback = function (response) {
                self.response = response.data;
            };
            var errorCallback = function (error) {
                console.log(error);
                alert('Error occurred');
            };
            var searchRequest = new App.SearchRequest();
            searchRequest.parentId = selectSaleList.id;
            searchRequest.isIncludeParents = true;
            searchRequest.page = -1;
            self.searchService
                .search(searchRequest, self.url.saleDetailQuery + "/Search")
                .then(successCallback, errorCallback);
        };
        CustomerFeedbackController.prototype.resetOrderCustomer = function () {
            this.customer = new App.Customer();
            this.customerSearchRequest.keyword = "";
            this.customers = [];
        };
        CustomerFeedbackController.prototype.resetCustomer = function () {
            this.customer.name = "";
            this.customer.phone = "";
        };
        CustomerFeedbackController.prototype.save = function () {
            var _this = this;
            var self = this;
            if (self.isUpdateMode)
                self.update();
            if (self.customer.name.length === 0 || self.customer.phone.length === 0) {
                self.customer.phone = "0";
                self.customer.name = "Annonymous";
            }
            else {
                var successCallback = function (response) {
                    self.activate();
                    _this.model.feedbackType = '';
                };
                var errorCallback = function (error) {
                    console.log(error);
                    if (error.status === 500) {
                        alert(error.data.exceptionMessage);
                    }
                };
                self.model.customerId = self.customer.id;
                self.saveService.save(self.model, self.commandUrl + "/Add").then(successCallback, errorCallback);
            }
        };
        CustomerFeedbackController.prototype.activate = function () {
            this.model = new App.CustomerFeedback();
            this.models = [];
            this.isUpdateMode = false;
            this.customer = new App.Customer();
            this.customerSearchRequest = new App.SearchRequest();
            this.resetOrderCustomer();
        };
        CustomerFeedbackController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return CustomerFeedbackController;
    }(App.BaseController));
    App.CustomerFeedbackController = CustomerFeedbackController;
    angular.module('app').controller('CustomerFeedbackController', CustomerFeedbackController);
    var CustomerFeedbacksController = /** @class */ (function (_super) {
        __extends(CustomerFeedbacksController, _super);
        function CustomerFeedbacksController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.customerFeedback, url.customerFeedbackQuery, excel) || this;
            _this.searchRequest.isIncludeParents = true;
            _this.search();
            return _this;
        }
        CustomerFeedbacksController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return CustomerFeedbacksController;
    }(App.BaseController));
    App.CustomerFeedbacksController = CustomerFeedbacksController;
    angular.module('app').controller('CustomerFeedbacksController', CustomerFeedbacksController);
})(App || (App = {}));
