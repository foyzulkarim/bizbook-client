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
    var AccountHeadsController = /** @class */ (function (_super) {
        __extends(AccountHeadsController, _super);
        function AccountHeadsController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.accountHead, url.accountHeadQuery, excel) || this;
            _this.headers = ["id", "name", "accountHeadType", "modified"];
            _this.search();
            return _this;
        }
        AccountHeadsController.prototype.report = function () {
            var self = this;
            window.open(self.url.accountHeadQueryReport, "_blank", "");
        };
        AccountHeadsController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return AccountHeadsController;
    }(App.BaseController));
    App.AccountHeadsController = AccountHeadsController;
    angular.module("app").controller("AccountHeadsController", AccountHeadsController);
    var AccountHeadController = /** @class */ (function (_super) {
        __extends(AccountHeadController, _super);
        function AccountHeadController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.accountHead, url.accountHeadQuery, excel) || this;
            _this.isUpdateMode = false;
            var self = _this;
            var success = function (response) {
                console.log('reasult---' + response);
                self.accountTypes = response.accountTypes;
            };
            var error = function (error) {
                console.log(error);
            };
            self.searchService.get(url.transaction + "Query" + "/Dropdowns").then(success, error);
            if (_this.stateParams["id"]) {
                _this.isUpdateMode = true;
                _this.edit(_this.stateParams["id"]);
            }
            return _this;
        }
        AccountHeadController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return AccountHeadController;
    }(App.BaseController));
    App.AccountHeadController = AccountHeadController;
    angular.module("app").controller("AccountHeadController", AccountHeadController);
})(App || (App = {}));
