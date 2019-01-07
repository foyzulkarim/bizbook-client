module App {
    export class ReportConfig {
        static $inject = ["$stateProvider"];

        constructor($stateProvider: angular.ui.IStateProvider) {
            // reports
            $stateProvider
                .state("root.sale-individual-report",
                {
                    url: '/sale-individual-report',
                    templateUrl: "partials/reports/sale-individual-report.tpl.html?t=095712282018",
                    controller: "SaleIndividualReportController",
                    controllerAs: "vm"
                })
                .state("root.sales-report",
                {
                    url: '/sales-report',
                    templateUrl: "partials/reports/report.tpl.html?t=095712282018",
                    controller: "SalesReportController",
                    controllerAs: "vm"
                })
                .state("root.sales-by-channel-report",
                {
                    url: '/sales-by-channel-report',
                    templateUrl: "partials/reports/report.tpl.html?t=095712282018",
                    controller: "SaleByChannelReportController",
                    controllerAs: "vm"
                })
                .state("root.sales-by-order-from-report",
                {
                    url: '/sales-by-order-from-report',
                    templateUrl: "partials/reports/report.tpl.html?t=095712282018",
                    controller: "SaleByOrderFromController",
                    controllerAs: "vm"
                })
                .state("root.product-details-amount-report",
                {
                    url: '/product-details-amount-report',
                    templateUrl: "partials/reports/report.tpl.html?t=095712282018",
                    controller: "ProductDetailsAmountReportController",
                    controllerAs: "vm"
                })
                .state("root.product-details-history-report",
                {
                    url: '/product-details-history-report',
                    templateUrl: "partials/reports/report.tpl.html?t=095712282018",
                    controller: "ProductDetailsHistoryReportController",
                    controllerAs: "vm"
                })
                .state("root.transaction-by-amount-report",
                {
                    url: '/transaction-by-amount-report',
                    templateUrl: "partials/reports/report.tpl.html?t=095712282018",
                    controller: "TransactionByAmountReportController",
                    controllerAs: "vm"
                })
                .state("root.transaction-by-account-head-report",
                {
                    url: '/transaction-by-account-head-report',
                    templateUrl: "partials/reports/report.tpl.html?t=095712282018",
                    controller: "TransactionByAccountHeadReportController",
                    controllerAs: "vm"
                })
                .state("root.product-details-history-report2",
                {
                    url: '/product-details-history-report2',
                    templateUrl: "partials/reports/product-history-report.tpl.html?t=095712282018",
                    controller: "ProductDetailsHistoryReport2Controller",
                    controllerAs: "vm"
                })
                .state("root.product-details-stock-report",
                {
                    url: '/product-details-stock-report',
                    templateUrl: "partials/reports/product-details-stock-report.tpl.html?t=095712282018",
                    controller: "ProductDetailsStockReportController",
                    controllerAs: "vm"
                })
                .state("root.sale-details-history-report",
                {
                    url: '/sale-details-history-report',
                    templateUrl: "partials/reports/sale-details-history-report.tpl.html?t=095712282018",
                    controller: "SaleDetailsHistoryReportController",
                    controllerAs: "vm"
                })
                .state("root.transaction-details-history-report",
                {
                    url: '/transaction-details-history-report',
                    templateUrl: "partials/reports/transaction-details-history-report.tpl.html?t=095712282018",
                    controller: "TransactionDetailsHistoryReportController",
                    controllerAs: "vm"
                })

                .state("root.transaction-details-report",
                {
                    url: '/transaction-details-report',
                    templateUrl: "partials/reports/transaction-details-report.tpl.html?t=095712282018",
                    controller: "TransactionDetailsReportController",
                    controllerAs: "vm"
                })

                .state("root.daily-sales-overview-report",
                {
                    url: '/daily-sales-overview-report',
                    templateUrl: "partials/reports/daily-sales-overview-report.tpl.html?t=095712282018",
                    controller: "DailySalesOverviewReportController",
                    controllerAs: "vm"
                })
                .state("root.monthly-sales-overview-report",
                {
                    url: '/monthly-sales-overview-report',
                    templateUrl: "partials/reports/monthly-sales-overview-report.tpl.html?t=095712282018",
                    controller: "MonthlySalesOverviewReportController",
                    controllerAs: "vm"
                })
                .state("root.yearly-sales-overview-report",
                {
                    url: '/yearly-sales-overview-report',
                    templateUrl: "partials/reports/yearly-sales-overview-report.tpl.html?t=095712282018",
                    controller: "YearlySalesOverviewReportController",
                    controllerAs: "vm"
                })
                .state("root.channel-wise-sales-report",
                {
                    url: '/channel-wise-sales-report',
                    templateUrl: "partials/reports/sales/SaleByChannel-report.tpl.html?t=095712282018",
                    controller: "ChannelWiseSalesReportController",
                    controllerAs: "vm"
                })
                .state("root.customer-search-by-sale-report",
                {
                    url: '/customer-search-by-sale-report',
                    templateUrl: "partials/reports/customer-search-by-sale-report.tpl.html?t=095712282018", // ignore this for now
                    controller: "CustomerSearchBySaleReportController",
                    controllerAs: "vm"
                })
                .state("root.sales-by-product-report",
                {
                    url: '/sales-by-product-report',
                    templateUrl: "partials/reports/sales-by-product-report.tpl.html?t=095712282018", 
                    controller: "SalesByProductReportController",
                    controllerAs: "vm"
                })

                .state("root.sales-by-product-detail-report",
                {
                    url: '/sales-by-product-detail-report',
                    templateUrl: "partials/reports/sales-by-product-detail-report.tpl.html?t=095712282018",
                    controller: "SalesByProductDetailReportController",
                    controllerAs: "vm"
                })
                .state("root.sales-by-product-category-report",
                {
                    url: '/sales-by-product-category-report',
                    templateUrl: "partials/reports/sales-by-product-category-report.tpl.html?t=095712282018",
                    controller: "SalesByProductCategoryReportController",
                    controllerAs: "vm"
                })

                .state("root.sales-by-product-group-report",
                {
                    url: '/sales-by-product-group-report',
                    templateUrl: "partials/reports/sales-by-product-group-report.tpl.html?t=095712282018",
                    controller: "SalesByProductGroupReportController",
                    controllerAs: "vm"
                })

                .state("root.zone-wise-sales-report",
                {
                    url: '/zone-wise-sales-report',
                    templateUrl: "partials/reports/zone-wise-sales-report.tpl.html?t=095712282018",
                    controller: "ZoneWiseSalesReportsController",
                    controllerAs: "vm"
                })
                ;
        }
    }

    angular.module("app").config(ReportConfig);

}