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
    var AccountInfoController = /** @class */ (function (_super) {
        __extends(AccountInfoController, _super);
        function AccountInfoController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.accountInfo, url.accountInfoQuery, excel) || this;
            _this.accountInfoTypes = ["Cash", "Bank", "Mobile", "Other"];
            _this.isUpdateMode = false;
            if (_this.stateParams["id"]) {
                _this.isUpdateMode = true;
                _this.edit2(_this.stateParams["id"]);
            }
            return _this;
        }
        AccountInfoController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return AccountInfoController;
    }(App.BaseController));
    App.AccountInfoController = AccountInfoController;
    angular.module("app").controller("AccountInfoController", AccountInfoController);
    var AccountInfosController = /** @class */ (function (_super) {
        __extends(AccountInfosController, _super);
        function AccountInfosController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.accountInfo, url.accountInfoQuery, excel) || this;
            _this.headers = ["accounTitle", "accountNumber", "bankName", "accountInfoType"];
            _this.search();
            return _this;
        }
        AccountInfosController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return AccountInfosController;
    }(App.BaseController));
    App.AccountInfosController = AccountInfosController;
    angular.module("app").controller("AccountInfosController", AccountInfosController);
})(App || (App = {}));
