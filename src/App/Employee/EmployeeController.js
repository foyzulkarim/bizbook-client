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
    var EmployeesController = /** @class */ (function (_super) {
        __extends(EmployeesController, _super);
        function EmployeesController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.employee, url.employeeQuery, excel) || this;
            _this.headers = ["id", "userName", "email", "password"];
            _this.search();
            return _this;
        }
        EmployeesController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return EmployeesController;
    }(App.BaseController));
    App.EmployeesController = EmployeesController;
    angular.module("app").controller("EmployeesController", EmployeesController);
    var EmployeeController = /** @class */ (function (_super) {
        __extends(EmployeeController, _super);
        function EmployeeController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.employee, url.employeeQuery, excel) || this;
            _this.setupDropdowns();
            if (_this.stateParams["applicationUserId"]) {
                _this.isUpdateMode = true;
                _this.edit(_this.stateParams["applicationUserId"]);
            }
            return _this;
        }
        EmployeeController.prototype.setupDropdowns = function () {
            this.setupRoles();
            this.loadWarehouses();
        };
        EmployeeController.prototype.setupRoles = function () {
            var self = this;
            var success = function (response) {
                self.userRoles = response;
                console.log(response);
            };
            var error = function (error) {
                console.log(error);
                alert('Error occurred');
            };
            self.searchService.get(self.url.roleDropdown).then(success, error);
        };
        EmployeeController.prototype.edit = function (id) {
            var self = this;
            var url = self.url.employeeQuery + '/GetEmployeeDetail/' + id;
            var onSuccess = function (data) {
                self.model = data;
                if (self.isUpdateMode)
                    self.model.roleId = self.model["roles"][0]["roleId"];
            };
            var onError = function (err) {
                alert('Error occurred');
            };
            self.searchService.get(url).then(onSuccess, onError);
        };
        EmployeeController.prototype.setDefaultPassword = function () {
            var self = this;
            console.log(self.model.userName);
            var data = { userName: self.model.userName };
            self.authService.setDefaultPassword(data)
                .then(function (success) {
                console.log(success);
                alert('password reset success');
            }, function (error) {
                console.log(error);
            });
        };
        EmployeeController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return EmployeeController;
    }(App.BaseController));
    App.EmployeeController = EmployeeController;
    angular.module("app").controller("EmployeeController", EmployeeController);
    var EmployeeInfosController = /** @class */ (function (_super) {
        __extends(EmployeeInfosController, _super);
        function EmployeeInfosController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.employeeInfo, url.employeeInfoQuery, excel) || this;
            _this.headers = ["id", "name", "phone", "email", "salary", "saleTargetAmount", "saleAchivedAmount"];
            _this.search();
            return _this;
        }
        EmployeeInfosController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return EmployeeInfosController;
    }(App.BaseController));
    App.EmployeeInfosController = EmployeeInfosController;
    angular.module("app").controller("EmployeeInfosController", EmployeeInfosController);
    var EmployeeInfoController = /** @class */ (function (_super) {
        __extends(EmployeeInfoController, _super);
        function EmployeeInfoController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.employeeInfo, url.employeeInfoQuery, excel) || this;
            _this.loadEmployeeRole();
            _this.loadWarehouses();
            if (_this.stateParams["id"]) {
                _this.isUpdateMode = true;
                _this.edit2(_this.stateParams["id"]);
            }
            return _this;
        }
        EmployeeInfoController.prototype.loadEmployeeRole = function () {
            var self = this;
            var success = function (response) {
                self.employeeRoles = response;
                console.log(response);
            };
            var error = function (error) {
                console.log(error);
                alert('Error occurred');
            };
            self.searchService.get(self.url.roleDropdown).then(success, error);
        };
        EmployeeInfoController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return EmployeeInfoController;
    }(App.BaseController));
    App.EmployeeInfoController = EmployeeInfoController;
    angular.module("app").controller("EmployeeInfoController", EmployeeInfoController);
    var SalesmanHistoryController = /** @class */ (function (_super) {
        __extends(SalesmanHistoryController, _super);
        function SalesmanHistoryController(location, $state, $stateParams, url, searchService, saveService, auth, excel) {
            var _this = _super.call(this, location, $state, $stateParams, url, searchService, saveService, auth, url.employeeInfo, url.employeeInfoQuery, excel) || this;
            _this.amountTotal = 0;
            if (_this.stateParams["id"]) {
                _this.loadSalesmanHistory();
            }
            return _this;
        }
        SalesmanHistoryController.prototype.loadSalesmanHistory = function () {
            var self = this;
            var successCallback = function (response) {
                console.log('search:' + response.data["item1"]);
                //self.response = response.Models;
                self.models = response.data["item1"];
                for (var i = 0; i < self.models.length; i++) {
                    self.amountTotal = self.models[i].totalAmount + self.amountTotal;
                }
            };
            var errorCallback = function (error) {
                console.log(error);
                alert('Error occurred');
            };
            var searchRequest = new App.SearchRequest();
            searchRequest["SalesmanId"] = this.stateParams["id"];
            searchRequest.page = -1;
            self.searchService
                .search(searchRequest, self.url.saleQuery + "/Search")
                .then(successCallback, errorCallback);
        };
        SalesmanHistoryController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return SalesmanHistoryController;
    }(App.BaseController));
    App.SalesmanHistoryController = SalesmanHistoryController;
    angular.module("app").controller("SalesmanHistoryController", SalesmanHistoryController);
})(App || (App = {}));
