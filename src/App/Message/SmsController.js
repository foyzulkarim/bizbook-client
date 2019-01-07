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
    var SmsListController = /** @class */ (function (_super) {
        __extends(SmsListController, _super);
        function SmsListController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.sms, url.smsQuery, excel) || this;
            _this.search();
            return _this;
        }
        SmsListController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return SmsListController;
    }(App.BaseController));
    App.SmsListController = SmsListController;
    angular.module("app").controller("SmsListController", SmsListController);
    var SmsController = /** @class */ (function (_super) {
        __extends(SmsController, _super);
        function SmsController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.sms, url.smsQuery, excel) || this;
            _this.selectedRow = null;
            _this.isUpdateMode = false;
            if (_this.stateParams["id"]) {
                _this.isUpdateMode = true;
                _this.edit(_this.stateParams["id"]);
            }
            return _this;
        }
        SmsController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return SmsController;
    }(App.BaseController));
    App.SmsController = SmsController;
    angular.module("app").controller("SmsController", SmsController);
    var SmsHistoryController = /** @class */ (function (_super) {
        __extends(SmsHistoryController, _super);
        function SmsHistoryController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.smsHistory, url.smsHistoryQuery, excel) || this;
            _this.search();
            return _this;
        }
        SmsHistoryController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return SmsHistoryController;
    }(App.BaseController));
    App.SmsHistoryController = SmsHistoryController;
    angular.module("app").controller("SmsHistoryController", SmsHistoryController);
})(App || (App = {}));
