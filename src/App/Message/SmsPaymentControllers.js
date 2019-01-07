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
    var SmsPaymentController = /** @class */ (function (_super) {
        __extends(SmsPaymentController, _super);
        function SmsPaymentController(location, state, stateParams, url, search, save, authService, excel) {
            return _super.call(this, location, state, stateParams, url, search, save, authService, url.smsHistory, url.smsHistoryQuery, excel) || this;
        }
        SmsPaymentController.prototype.save = function () {
            var self = this;
            this.model.transactionType = 1;
            this.model.text = 'payment';
            this.saveService.save(this.model, this.commandUrl + "/Add").then(function (success) {
                self.activate();
            }, function (error) {
                alert('error occurred.');
            });
        };
        SmsPaymentController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return SmsPaymentController;
    }(App.BaseController));
    App.SmsPaymentController = SmsPaymentController;
    angular.module("app").controller("SmsPaymentController", SmsPaymentController);
    var SmsPaymentsController = /** @class */ (function (_super) {
        __extends(SmsPaymentsController, _super);
        function SmsPaymentsController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.smsHistory, url.smsHistoryQuery, excel) || this;
            _this.search();
            return _this;
        }
        SmsPaymentsController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return SmsPaymentsController;
    }(App.BaseController));
    App.SmsPaymentsController = SmsPaymentsController;
    angular.module("app").controller("SmsPaymentsController", SmsPaymentsController);
})(App || (App = {}));
