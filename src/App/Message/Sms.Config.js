var App;
(function (App) {
    var SmsConfig = /** @class */ (function () {
        function SmsConfig($stateProvider) {
            $stateProvider
                .state("root.smspayment", {
                url: "/smspayment/:id",
                params: { id: null },
                templateUrl: "partials/message/sms-payment-entry.tpl.html?t=095712282018",
                controller: "SmsPaymentController",
                controllerAs: "vm"
            }).state("root.smspayments", {
                url: "/smspayments",
                templateUrl: "partials/message/sms-payment-list.tpl.html?t=095712282018",
                controller: "SmsPaymentsController",
                controllerAs: "vm"
            }).state("root.smshistory", {
                url: "/smshistory",
                templateUrl: "partials/message/sms-history.tpl.html?t=095712282018",
                controller: "SmsHistoryController",
                controllerAs: "vm"
            });
        }
        SmsConfig.$inject = ["$stateProvider"];
        return SmsConfig;
    }());
    App.SmsConfig = SmsConfig;
    angular.module("app").config(SmsConfig);
})(App || (App = {}));
