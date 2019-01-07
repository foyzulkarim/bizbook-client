module App {
    export class OperationConfig {
        static $inject = ["$stateProvider"];
        constructor(
            $stateProvider: angular.ui.IStateProvider

        ) {
            $stateProvider
            .state("root.operation-logs",
            {
                url: "/operation-logs",
                templateUrl: "partials/operation/operation-log-list.tpl.html?t=095712282018",
                controller: "OperationLogsController",
                controllerAs: "vm"
            })
            .state("root.operation-log-detail",
            {
                url: "/operationlogdetail/:id",
                params: { id: null },
                templateUrl: "partials/operation/operation-log-detail-view.tpl.html?t=095712282018",
                controller: "OperationLogDetailController",
                controllerAs: "vm"
            })
                .state("root.operation-log-detail-history",
                {
                    url: "/operationlogdetailhistory/:id",
                    params: { id: null },
                    templateUrl: "partials/operation/operation-log-detail-history-view.tpl.html?t=095712282018",
                    controller: "OperationLogDetailHistoryController",
                    controllerAs: "vm"
                });
        }
    }
    angular.module("app").config(OperationConfig);
}