var App;
(function (App) {
    var OperationConfig = /** @class */ (function () {
        function OperationConfig($stateProvider) {
            $stateProvider
                .state("root.operation-logs", {
                url: "/operation-logs",
                templateUrl: "partials/operation/operation-log-list.tpl.html?t=095712282018",
                controller: "OperationLogsController",
                controllerAs: "vm"
            })
                .state("root.operation-log-detail", {
                url: "/operationlogdetail/:id",
                params: { id: null },
                templateUrl: "partials/operation/operation-log-detail-view.tpl.html?t=095712282018",
                controller: "OperationLogDetailController",
                controllerAs: "vm"
            })
                .state("root.operation-log-detail-history", {
                url: "/operationlogdetailhistory/:id",
                params: { id: null },
                templateUrl: "partials/operation/operation-log-detail-history-view.tpl.html?t=095712282018",
                controller: "OperationLogDetailHistoryController",
                controllerAs: "vm"
            });
        }
        OperationConfig.$inject = ["$stateProvider"];
        return OperationConfig;
    }());
    App.OperationConfig = OperationConfig;
    angular.module("app").config(OperationConfig);
})(App || (App = {}));
