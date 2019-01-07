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
    var SmsHooksController = /** @class */ (function (_super) {
        __extends(SmsHooksController, _super);
        function SmsHooksController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.smsHook, url.smsHookQuery, excel) || this;
            _this.search();
            return _this;
        }
        SmsHooksController.prototype.search = function () {
            var self = this;
            var successCallback = function (response) {
                console.log(response);
                self.models = response.Models;
                if (self.models.length === 0) {
                    console.log('No search result found');
                    alert('No search result found');
                }
                else {
                    self.csvModels = [];
                    for (var i = 0; i < self.models.length; i++) {
                        self.csvModels.push(self.generateCsvModel(self.models[i]));
                    }
                }
                self.searchRequest.totalPage = Math.ceil(response.Count / 10);
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService
                .search(self.searchRequest, self.queryUrl + "/SearchHooks")
                .then(successCallback, errorCallback);
        };
        SmsHooksController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return SmsHooksController;
    }(App.BaseController));
    App.SmsHooksController = SmsHooksController;
    angular.module("app").controller("SmsHooksController", SmsHooksController);
    var SmsHookController = /** @class */ (function (_super) {
        __extends(SmsHookController, _super);
        function SmsHookController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.smsHook, url.smsHookQuery, excel) || this;
            _this.selectedRow = null;
            _this.isUpdateMode = false;
            if (_this.stateParams["id"]) {
                _this.isUpdateMode = true;
                _this.edit2(_this.stateParams["id"]);
            }
            return _this;
        }
        SmsHookController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return SmsHookController;
    }(App.BaseController));
    App.SmsHookController = SmsHookController;
    angular.module("app").controller("SmsHookController", SmsHookController);
    var HookDetailsController = /** @class */ (function (_super) {
        __extends(HookDetailsController, _super);
        function HookDetailsController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.hookDetail, url.hookDetailQuery, excel) || this;
            _this.search();
            return _this;
        }
        HookDetailsController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return HookDetailsController;
    }(App.BaseController));
    App.HookDetailsController = HookDetailsController;
    angular.module("app").controller("HookDetailsController", HookDetailsController);
    var HookDetailController = /** @class */ (function (_super) {
        __extends(HookDetailController, _super);
        function HookDetailController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.hookDetail, url.hookDetailQuery, excel) || this;
            _this.loadSmsHooks();
            _this.selectedRow = null;
            _this.isUpdateMode = false;
            if (_this.stateParams["id"]) {
                _this.isUpdateMode = true;
                _this.edit2(_this.stateParams["id"]);
            }
            return _this;
        }
        HookDetailController.prototype.loadSmsHooks = function () {
            var self = this;
            var successCallback = function (response) {
                console.log(response);
                self.smsHooks = response.Models;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService
                .search(self.searchRequest, self.url.smsHookQuery + "/Dropdown")
                .then(successCallback, errorCallback);
        };
        HookDetailController.prototype.groupChanged = function () {
            console.log(this.model.smsHookId);
        };
        HookDetailController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return HookDetailController;
    }(App.BaseController));
    App.HookDetailController = HookDetailController;
    angular.module("app").controller("HookDetailController", HookDetailController);
})(App || (App = {}));
