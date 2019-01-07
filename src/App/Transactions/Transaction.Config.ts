module App {
    export class TransactionConfig {
        static $inject = ["$stateProvider"];
        constructor(
            $stateProvider: angular.ui.IStateProvider
        ) {
            $stateProvider
                .state("root.newAccounthead",
                {
                    url: "/account-head/new",
                    templateUrl: "partials/transactions/account-head-entry.tpl.html?t=095712282018",
                    controller: "AccountHeadController",
                    controllerAs: "vm"
                })
                .state("root.accountheadList",
                {
                    url: "/account-head/list",
                    templateUrl: "partials/transactions/account-head-list.tpl.html?t=095712282018",
                    controller: "AccountHeadController",
                    controllerAs: "vm"
                })
                .state("root.accounthead",
                {
                    url: "/accounthead/:id",
                    params: { id: null },
                    templateUrl: "partials/transactions/account-head-entry.tpl.html?t=095712282018",
                    controller: "AccountHeadController",
                    controllerAs: "vm"
                })
                .state("root.accountheads",
                {
                    url: "/accountheads",
                    templateUrl: "partials/transactions/account-head-list.tpl.html?t=095712282018",
                    controller: "AccountHeadsController",
                    controllerAs: "vm"
                })
                .state("root.new-transaction",
                {
                    url: '/new-transaction/:id',
                    params: { id: null },
                    templateUrl: "partials/transactions/transaction-entry.tpl.html?t=095712282018",
                    controller: "TransactionController",
                    controllerAs: "vm"
                })
                .state("root.transaction",
                {
                    url: "/transaction/:id",
                    params: { id: null },
                    templateUrl: "partials/transactions/transaction-entry.tpl.html?t=095712282018",
                    controller: "TransactionController",
                    controllerAs: "vm"
                })
                .state("root.transactions",
                {
                    url: '/transactions',
                    templateUrl: "partials/transactions/transaction.list.tpl.html?t=095712282018",
                    controller: "TransactionsController",
                    controllerAs: "vm"
                })
                .state("root.moneyreceipt",
                {
                    url: "/moneyreceipt/:id",
                    params: { id: null },
                    templateUrl: "partials/transactions/receipts/money-receipt.tpl.html?t=095712282018",
                    controller: "TransactionController",
                    controllerAs: "vm"
                })
                .state("root.accountinfo",
                {
                    url: "/accountinfo/:id",
                    params: { id: null },
                    templateUrl: "partials/transactions/account-info-entry.tpl.html?t=095712282018",
                    controller: "AccountInfoController",
                    controllerAs: "vm"
                })
                .state("root.accountinfos",
                {
                    url: "/accountinfos",
                    templateUrl: "partials/transactions/account-info-list.tpl.html?t=095712282018",
                    controller: "AccountInfosController",
                    controllerAs: "vm"
                })
                .state("root.accountinfohistory",
                {
                    url: "/accountinfohistory",
                    templateUrl: "partials/transactions/account-info-history.tpl.html?t=095712282018",
                    controller: "AccountInfosController",
                    controllerAs: "vm"
                }).state("root.incomestatement",
                {
                    url: "/incomestatement",
                    //url: "/incomestatement/:id",
                    //params: { id: null },
                    templateUrl: "partials/transactions/income-statement.tpl.html?t=095712282018",
                    controller: "IncomeStatementController",
                    controllerAs: "vm"
                })

                .state("root.moneytransfer",
                {
                    url: '/moneytransfer',
                    templateUrl: "partials/transactions/money-transfer.tpl.html?t=095712282018",
                    controller: "MoneyTransferConroller",
                    controllerAs: "vm"
                }).state("root.cashflowstatement",
                {
                    url: '/cashflowstatement',
                    templateUrl: "partials/transactions/cash-flow-statement.tpl.html?t=095712282018",
                    controller: "IncomeStatementController",
                    controllerAs: "vm"
                });
        }
    }
    angular.module("app").config(TransactionConfig);
}