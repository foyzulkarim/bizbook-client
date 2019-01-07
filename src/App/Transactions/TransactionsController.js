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
    var TransactionsController = /** @class */ (function (_super) {
        __extends(TransactionsController, _super);
        function TransactionsController(location, state, stateParams, url, search, save, authService, localStorageService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.transaction, url.transaction + "Query", excel) || this;
            _this.totalIncome = 0;
            _this.totalExpense = 0;
            _this.headers = ["id", "accountHeadName", "amount", "orderNumber", "transactionFor", "transactionWith", "modified"];
            var self = _this;
            _this.localStorageService = localStorageService;
            _this.setupDropdowns();
            _this.startDate = new Date();
            _this.endDate = new Date();
            var accountSuccess = function (response) {
                console.log('account - ', response);
                self.accountHeads = response.Models;
                self.accountHeads.splice(0, 0, { id: '', text: 'All' });
                self.searchRequest['accountHeadId'] = self.accountHeads[0].id;
            };
            var error = function (error) {
                console.log(error);
            };
            var accountRequest = new App.SearchRequest();
            accountRequest.page = -1;
            self.searchService.search(accountRequest, self.url.accountHeadQuery + "/Dropdown")
                .then(accountSuccess, error);
            var accountInfoSuccess = function (response) {
                self.accountInfos = response.Models;
                self.accountInfos.splice(0, 0, { id: '', text: 'All' });
                self.searchRequest['accountInfoId'] = self.accountInfos[0].id;
            };
            var accountInfoRequest = new App.SearchRequest();
            accountInfoRequest.page = -1;
            self.searchService.search(accountInfoRequest, self.url.accountInfoQuery + "/Dropdown")
                .then(accountInfoSuccess, error);
            self.search();
            return _this;
        }
        TransactionsController.prototype.setupDropdowns = function () {
            var self = this;
            var success = function (response) {
                console.log(response);
                self.transactionMediums = response.transactionMediums;
                self.transaction = new App.Transaction();
                self.searchRequest = new App.SearchRequest();
                self.transaction.transactionMedium = "Cash";
                self.searchRequest['transactionMediumName'] = self.transaction.transactionMedium;
            };
            var error = function (error) {
                console.log(error);
            };
            self.searchService.get(self.url.transactionQuery + "/Dropdowns").then(success, error);
            self.search();
        };
        TransactionsController.prototype.search = function () {
            var self = this;
            self.totalIncome = 0;
            self.totalExpense = 0;
            var successCallback = function (response) {
                console.log('i am in transactions controller ', response);
                self.totalCount = response.Count;
                self.models = response.Models;
                if (self.models.length === 0) {
                    console.log('No search result found');
                    // alert('No search result found');
                }
                else {
                    self.csvModels = [];
                    for (var i = 0; i < self.models.length; i++) {
                        self.csvModels.push(self.generateCsvModel(self.models[i]));
                        if (self.models[i].transactionFlowType == 'Income' || self.models[i].transactionFor == 'Sale') {
                            self.totalIncome += self.models[i].amount;
                        }
                        else {
                            self.totalExpense += self.models[i].amount;
                        }
                    }
                    console.info(self.totalIncome, self.totalExpense);
                }
                self.searchRequest.totalPage = Math.ceil(response.Count / 10);
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchRequest.startDate = self.startDate.toDateString();
            self.searchRequest.endDate = self.endDate.toDateString();
            self.searchService
                .search(self.searchRequest, self.queryUrl + "/Search")
                .then(successCallback, errorCallback);
        };
        TransactionsController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return TransactionsController;
    }(App.BaseController));
    App.TransactionsController = TransactionsController;
    angular.module("app").controller("TransactionsController", TransactionsController);
    var IncomeStatementController = /** @class */ (function (_super) {
        __extends(IncomeStatementController, _super);
        function IncomeStatementController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.transaction, url.transaction + "Query", excel) || this;
            var self = _this;
            return _this;
        }
        //printModel: Transaction;
        //print(id: string) {
        //    var self = this;
        //    self.printModel = new Transaction();
        //    var successCallback = (response: SearchResponse): void => {
        //        self.printModel = response.data;
        //        setTimeout(function (p) {
        //            var printContents = document.getElementById("receipt").innerHTML;
        //            let baseUrl = document.location.host + self.url.clientSubFolder;
        //            let popupWin = window.open('',
        //                '_blank',
        //                'scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
        //            popupWin.window.focus();
        //            popupWin.document.write('<!DOCTYPE html><html><head>' +
        //                '<link rel="stylesheet" href="http://' +
        //                baseUrl +
        //                '/Content/bootstrap.min.css">' +
        //                '</head><body style="width: auto; height:auto;background:white"><div class="container">' +
        //                printContents +
        //                '</div></body></html>');
        //            popupWin.onbeforeunload = function (event) {
        //                popupWin.close();
        //                //return '';
        //            };
        //            popupWin.onabort = function (event) {
        //                popupWin.document.close();
        //                popupWin.close();
        //            }
        //            setTimeout(function () {
        //                popupWin.print();
        //            }, 1000);
        //        },
        //            1000);
        //        self.activate();
        //    };
        //    var errorCallback = (error: any): void => {
        //        console.log(error);
        //    };
        //    var searchRequest = new SearchRequest();
        //    searchRequest.id = this.stateParams["id"];
        //    searchRequest.page = -1;
        //    var httpUrl = self.url.transactionQuery + "/Receipt?id=" + id;
        //    self.searchService.search(null, httpUrl).then(<any>successCallback, errorCallback);
        //}
        IncomeStatementController.prototype.print = function (id) {
            if (id == null) {
                id = "incomestatement";
            }
            var printContents = document.getElementById(id).innerHTML;
            var popupWin;
            var baseUrl = 'http://' + document.location.host + this.url.clientSubFolder;
            console.log(baseUrl);
            var cssUrl = '';
            cssUrl = baseUrl + '/dist/css/all.css?t=074002082011';
            popupWin = window.open('', '_blank', 'scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
            popupWin.window.focus();
            popupWin.document.write('<!DOCTYPE html><html><head>' +
                '<link rel="stylesheet" ' +
                'href="' + cssUrl + '">' +
                '</head><body style="font-size:10px !important; line-height: 1.0 !important;">' +
                printContents +
                '</body></html>');
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
        IncomeStatementController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return IncomeStatementController;
    }(App.BaseController));
    App.IncomeStatementController = IncomeStatementController;
    angular.module("app").controller("IncomeStatementController", IncomeStatementController);
    var MoneyTransferConroller = /** @class */ (function (_super) {
        __extends(MoneyTransferConroller, _super);
        function MoneyTransferConroller(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.transaction, url.transaction + "Query", excel) || this;
            _this.isUpdateMode = false;
            if (_this.stateParams["id"]) {
                _this.isUpdateMode = true;
                _this.edit(_this.stateParams["id"]);
            }
            return _this;
        }
        MoneyTransferConroller.prototype.activate = function () {
            this.model = new App.Transaction();
            this.isUpdateMode = true;
            this.setupDropdowns();
            this.selectedAccountInfo = new App.AccountInfo();
            this.loadAccountInfos();
        };
        MoneyTransferConroller.prototype.setupDropdowns = function () {
            var self = this;
            var success = function (response) {
                console.log(response);
                self.paymentGatewayServices = response.paymentGatewayServices;
                self.accountTypes = response.accountTypes;
                self.accountInfoTypes = response.accountInfoTypes;
                self.model = new App.Transaction();
                self.accountInfoType = "Cash";
            };
            var error = function (error) {
                console.log(error);
            };
            self.searchService.get(self.queryUrl + "/Dropdowns").then(success, error);
        };
        MoneyTransferConroller.prototype.loadAccountInfos = function () {
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
        MoneyTransferConroller.prototype.accountInfoChanged = function () {
            var self = this;
            self.model.accountInfoTitle = self.selectedAccountInfo["text"];
            self.model.accountInfoId = self.selectedAccountInfo.id;
        };
        MoneyTransferConroller.prototype.dateChanged = function () {
            var self = this;
            console.log(self.transactionDate);
            self.model.transactionDate = self.transactionDate.toDateString();
        };
        MoneyTransferConroller.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService",
            'Excel'
        ];
        return MoneyTransferConroller;
    }(App.BaseController));
    App.MoneyTransferConroller = MoneyTransferConroller;
    angular.module("app").controller("MoneyTransferConroller", MoneyTransferConroller);
})(App || (App = {}));
