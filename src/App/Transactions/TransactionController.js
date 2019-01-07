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
    var TransactionController = /** @class */ (function (_super) {
        __extends(TransactionController, _super);
        function TransactionController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.transaction, url.transaction + "Query", excel) || this;
            _this.startDate = new Date();
            _this.isUpdateMode = false;
            if (_this.stateParams["id"]) {
                _this.isUpdateMode = true;
                _this.edit(_this.stateParams["id"]);
            }
            return _this;
        }
        TransactionController.prototype.activate = function () {
            this.model = new App.Transaction();
            this.isUpdateMode = false;
            this.setupDropdowns();
            this.selectedAccountHead = new App.AccountHead();
            this.selectedAccountInfo = new App.AccountInfo();
            this.loadAccountInfos();
        };
        TransactionController.prototype.setupDropdowns = function () {
            var self = this;
            var success = function (response) {
                console.log(response);
                self.transactionMediums = response.transactionMediums;
                self.paymentGatewayServices = response.paymentGatewayServices;
                self.transactionFors = response.transactionFors;
                self.transactionFors = self.removeElement(self.transactionFors, "Sale");
                self.transactionFors = self.removeElement(self.transactionFors, "Purchase");
                self.transactionWiths = response.transactionWiths;
                self.transactionFlowTypes = response.transactionFlowTypes;
                self.accountTypes = response.accountTypes;
                self.accountInfoTypes = response.accountInfoTypes;
                self.accountInfoType = "Cash";
                self.model = new App.Transaction();
                self.model.transactionMedium = "Cash";
                self.model.paymentGatewayService = "Cash";
                self.model.transactionMediumName = "Cash";
                self.model.paymentGatewayServiceName = "Cash";
                self.model.transactionFlowType = "Income";
                self.model.transactionFor = "Office";
            };
            var error = function (error) {
                console.log(error);
            };
            self.searchService.get(self.queryUrl + "/Dropdowns").then(success, error);
            var accountSuccess = function (response) {
                console.log('account - ', response);
                self.accountHeads = response.Models;
            };
            var accountRequest = new App.SearchRequest();
            self.searchService.search(accountRequest, self.url.accountHeadQuery + "/Dropdown")
                .then(accountSuccess, error);
        };
        TransactionController.prototype.loadParents = function () {
            var _this = this;
            var self = this;
            var success = function (response) {
                _this.parents = response.Models;
                for (var i = 0; i < _this.parents.length; i++) {
                    var data = _this.parents[i].data;
                    _this.parents[i].text = _this.parents[i].text + " Due: " + data.totalDue;
                }
            };
            var error = function (error) {
                console.log(error);
            };
            //var request = new SearchRequest();
            //var url = self.url.inventoryBaseApi + "/" + self.model.transactionWith + "Query/Dropdown";
            //self.searchService.search(request, url).then(success, error);
        };
        TransactionController.prototype.accountHeadChanged = function () {
            this.model.accountHeadName = this.selectedAccountHead["text"];
            this.model.accountHeadId = this.selectedAccountHead.id;
        };
        TransactionController.prototype.loadOrders = function () {
            var self = this;
            var url = "";
            var request = new App.SearchRequest();
            if (this.model.transactionWith === 'Supplier') {
                url = self.url.purchaseQuery + "/Dropdown";
                request["supplierId"] = self.model.parentId;
            }
            if (this.model.transactionWith === 'Customer') {
                url = self.url.saleQuery + "/Dropdown";
                request["customerId"] = self.model.parentId;
            }
            if (url.length > 0) {
                var parent_1 = self.parents.filter(function (x) { return x.id === self.model.parentId; })[0];
                console.info('parent', parent_1);
                self.model.parentName = parent_1["text"];
                var success = function (response) {
                    console.log(response);
                    self.orders = response.Models;
                };
                var error = function (error) {
                    console.log(error);
                };
                self.searchService.search(request, url).then(success, error);
                console.log(this.model);
            }
        };
        TransactionController.prototype.orderSelected = function () {
            var order = this.model['order'];
            this.model.orderId = order.id;
            this.model.orderNumber = order.data.orderNumber;
            console.log(order);
        };
        TransactionController.prototype.edit = function (id) {
            var self = this;
            var onSuccess = function (data) {
                self.model = data.data;
                if (self.isUpdateMode && self.model.transactionWith) {
                    self.loadParents();
                }
            };
            var onError = function (err) {
                alert('Error occurred');
            };
            var url = self.url.transaction + "Query" + '/Detail?id=' + id;
            self.searchService.search(null, url).then(onSuccess, onError);
        };
        TransactionController.prototype.print = function () {
            var printContents = document.getElementById("receipt").innerHTML;
            var baseUrl = document.location.host + this.url.clientSubFolder;
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
            };
            popupWin.onabort = function (event) {
                popupWin.document.close();
                popupWin.close();
            };
            setTimeout(function () {
                popupWin.print();
            }, 1000);
        };
        TransactionController.prototype.loadAccountInfos = function () {
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
            var accountInfoQueryRequest = new App.SearchRequest();
            self.searchService.search(accountInfoQueryRequest, self.url.accountInfoQuery + "/Dropdown")
                .then(success, error);
        };
        TransactionController.prototype.accountInfoChanged = function () {
            var self = this;
            self.model.accountInfoTitle = self.selectedAccountInfo["text"];
            self.model.accountInfoId = self.selectedAccountInfo.id;
        };
        TransactionController.prototype.dateChanged = function () {
            var self = this;
            console.log(self.transactionDate);
            self.model.transactionDate = self.transactionDate.toDateString();
        };
        TransactionController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService",
            'Excel'
        ];
        return TransactionController;
    }(App.BaseController));
    App.TransactionController = TransactionController;
    angular.module("app").controller("TransactionController", TransactionController);
})(App || (App = {}));
