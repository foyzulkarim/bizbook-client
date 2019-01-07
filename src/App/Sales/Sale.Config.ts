module App {
    export class SaleConfig {
        static $inject = ["$stateProvider"];

        constructor(
            $stateProvider: angular.ui.IStateProvider

        ) {
            $stateProvider
                .state("root.sale",
                {
                    url: "/sale",
                    templateUrl: "partials/sale/sale-entry.tpl.html?t=095712282018",
                    controller: "SaleController",
                    controllerAs: "vm"
                })

                .state("root.saledetail",
                {
                    url: "/saledetail/:id",
                    params: { id: null },
                    templateUrl: "partials/sale/sale-detail-view.tpl.html?t=095712282018",
                    controller: "SaleDetailController",
                    controllerAs: "vm"
                })
                .state("root.sale-pay",
                {
                    url: "/sale-pay/:id",
                    params: { id: null },
                    templateUrl: "partials/sale/sale-pay.tpl.html?t=095712282018",
                    controller: "SaleTransactionController",
                    controllerAs: "vm"
                })
                .state("root.salereturn",
                {
                    url: "/salereturn/:id",
                    params: { id: null },
                    templateUrl: "partials/sale/sale-return.tpl.html?t=095712282018",
                    controller: "SaleReturnController",
                    controllerAs: "vm"
                })
                .state("root.salereturn2",
                {
                    url: "/salereturn2/:id",
                    params: { id: null },
                    templateUrl: "partials/sale/sale-return2.tpl.html?t=095712282018",
                    controller: "SaleReturn2Controller",
                    controllerAs: "vm"
                })
                .state("root.receipt",
                {
                    url: "/receipt/:id",
                    params: { id: null },
                    templateUrl: "partials/sale/receipts/sale-receipt.tpl.html?t=095712282018",
                    controller: "ReceiptController",
                    controllerAs: "vm"
                })
                .state("root.chalan",
                {
                    url: "/chalan/:id",
                    params: { id: null },
                    templateUrl: "partials/sale/sale-chalan.tpl.html?t=095712282018",
                    controller: "ReceiptController",
                    controllerAs: "vm"
                })
                .state("root.receipt2",
                {
                    url: "/receipt2/:id",
                    params: { id: null },
                    templateUrl: "partials/sale/receipts/sale-receipt2.tpl.html?t=095712282018",
                    controller: "ReceiptController",
                    controllerAs: "vm"
                })
                .state("root.chalan2",
                {
                    url: "/chalan2/:id",
                    params: { id: null },
                    templateUrl: "partials/sale/sale-chalan2.tpl.html?t=095712282018",
                    controller: "ReceiptController",
                    controllerAs: "vm"
                })
                .state("root.receipt3",
                {
                    url: "/receipt3/:id",
                    params: { id: null },
                    templateUrl: "partials/sale/receipts/sale-receipt3.tpl.html?t=095712282018",
                    controller: "ReceiptController",
                    controllerAs: "vm"
                })
                .state("root.receipt5",
                {
                    url: "/receipt5/:id",
                    params: { id: null },
                    templateUrl: "partials/sale/receipts/sale-receipt5.tpl.html?t=095712282018",
                    controller: "ReceiptController",
                    controllerAs: "vm"
                })
                .state("root.friends",
                {
                    url: "/friends/:id",
                    params: { id: null },
                    templateUrl: "partials/sale/receipts/sale-friends.tpl.html?t=095712282018",
                    controller: "ReceiptController",
                    controllerAs: "vm"
                })
                .state("root.kf-1",
                {
                    url: "/kf-1/:id",
                    params: { id: null },
                    templateUrl: "partials/sale/receipts/sale-receipt-kf-1.tpl.html?t=095712282018",
                    controller: "ReceiptController",
                    controllerAs: "vm"
                })
                .state("root.chalan3",
                {
                    url: "/chalan3/:id",
                    params: { id: null },
                    templateUrl: "partials/sale/sale-chalan3.tpl.html?t=095712282018",
                    controller: "Receipt3Controller",
                    controllerAs: "vm"

                })

                .state("root.receipt4", {
                    url: "/receipt4/:id",
                    params: { id: null },
                    templateUrl: "partials/sale/receipts/sale-receipt4.tpl.html?t=095712282018",
                    controller: "ReceiptController",
                    controllerAs: "vm"
                })
                .state("root.receipt-shorobor", {
                    url: "/receipt-shorobor/:id",
                    params: { id: null },
                    templateUrl: "partials/sale/receipts/sale-receipt-shorobor.tpl.html?t=095712282018",
                    controller: "ReceiptController",
                    controllerAs: "vm"
                })
                .state("root.receipt2-shorobor", {
                    url: "/receipt2-shorobor/:id",
                    params: { id: null },
                    templateUrl: "partials/sale/receipts/sale-receipt2-shorobor.tpl.html?t=095712282018",
                    controller: "ReceiptController",
                    controllerAs: "vm"
                })

                .state("root.receipt-gayershaad", {
                    url: "/receipt-gayershaad/:id",
                    params: { id: null },
                    templateUrl: "partials/sale/receipts/sale-receipt-gayershaad.tpl.html?t=095712282018",
                    controller: "ReceiptController",
                    controllerAs: "vm"
                })
                .state("root.sales",
                {
                    url: "/sales",
                    templateUrl: "partials/sale/sale-list.tpl.html?t=095712282018",
                    controller: "SalesController",
                    controllerAs: "vm"
                })
                .state("root.sales-dues",
                {
                    url: "/sales-dues",
                    templateUrl: "partials/sale/sale-dues-list.tpl.html?t=095712282018",
                    controller: "SalesDuesController",
                    controllerAs: "vm"
                })
                .state("root.sales-tag-mango",
                {
                    url: "/sales-tag-mango",
                    templateUrl: "partials/sale/sale-tag-mango.tpl.html?t=095712282018",
                    controller: "SalesTagMangoController",
                    controllerAs: "vm"
                })
                .state("root.sales-pending",
                {
                    url: "/sales-pending",
                    templateUrl: "partials/sale/sales-pending.tpl.html?t=095712282018",
                    controller: "PendingSalesController",
                    controllerAs: "vm"
                })

                .state("root.sales-created",
                {
                    url: "/sales-created",
                    templateUrl: "partials/sale/sales-created.tpl.html?t=095712282018",
                    controller: "CreatedSalesController",
                    controllerAs: "vm"
                })

                .state("root.sales-ready-to-departure",
                {
                    url: "/sales-ready-to-departure",
                    templateUrl: "partials/sale/sales-ready-to-departure.tpl.html?t=095712282018",
                    controller: "ReadyToDepartureSalesController",
                    controllerAs: "vm"
                })
                .state("root.sales-ontheway",
                {
                    url: "/sales-ontheway",
                    templateUrl: "partials/sale/sales-ontheway.tpl.html?t=095712282018",
                    controller: "OnTheWaySalesController",
                    controllerAs: "vm"

                })
                .state("root.sales-ontheway-dues",
                {
                    url: "/sales-ontheway-dues",
                    templateUrl: "partials/sale/sales-ontheway-dues.tpl.html?t=095712282018",
                    controller: "OnTheWaySalesDuesController",
                    controllerAs: "vm"

                })
                .state("root.sales-delivered",
                {
                    url: "/sales-delivered",
                    templateUrl: "partials/sale/sales-delivered.tpl.html?t=095712282018",
                    controller: "DeliveredSalesController",
                    controllerAs: "vm"
                })
                .state("root.sales-delivered-product-categories",
                {
                    url: "/sales-delivered-product-categories",
                    templateUrl: "partials/sale/sales-delivered-product-categories.tpl.html?t=095712282018",
                    controller: "DeliveredProductCategoriesController",
                    controllerAs: "vm"
                })
                .state("root.sales-completed",
                {
                    url: "/sales-completed",
                    templateUrl: "partials/sale/sales-completed.tpl.html?t=095712282018",
                    controller: "CompletedSalesController",
                    controllerAs: "vm"
                })

                .state("root.sales-cancelled",
                {
                    url: "/sales-cancelled",
                    templateUrl: "partials/sale/sales-cancelled.tpl.html?t=095712282018",
                    controller: "CancelledSalesController",
                    controllerAs: "vm"
                })

                .state("root.onlinesale",
                {
                    url: "/onlinesale",
                    templateUrl: "partials/sale/online-sale-entry.tpl.html?t=095712282018",
                    controller: "SaleController",
                    controllerAs: "vm"

                })

                .state("root.onlinesales",
                {
                    url: "/onlinesales",
                    templateUrl: "partials/sale/online-sale-list.tpl.html?t=095712282018",
                    controller: "OnlineSalesController",
                    controllerAs: "vm"

                })
                .state("root.salesdelivery",
                {
                    url: "/salesdelivery",
                    templateUrl: "partials/sale/online-sales-history-deliveryman.tpl.html?t=095712282018",
                    controller: "OnlineSalesDeliverymanController",
                    controllerAs: "vm"
                })


                .state("root.dealer-sale",
                {
                    url: "/dealer-sale",
                    templateUrl: "partials/sale/dealer-sale.tpl.html?t=1513651121239",
                    controller: "SaleController",
                    controllerAs: "vm"
                })

                .state("root.dealer-sales",
                {
                    url: "/dealer-sales",
                    templateUrl: "partials/sale/dealer-sale-list.tpl.html?t=1513651121239",
                    controller: "DealerSalesController",
                    controllerAs: "vm"
                })
                .state("root.dealer-sale-cancel",
                {
                    url: "/dealer-sale-cancel/:id",
                    templateUrl: "partials/sale/dealer-sale-cancel.tpl.html?t=1513651121239",
                    controller: "DealerSalesCancelController",
                    controllerAs: "vm"
                })
                .state("root.dealer-pay",
                {
                    url: "/dealer-pay/:id",
                    params: { id: null },
                    templateUrl: "partials/sale/dealer-sale-pay.tpl.html?t=095712282018",
                    controller: "DealerSaleTransactionController",
                    controllerAs: "vm"
                })

                .state("root.couriers-ready-to-departure",
                {
                    url: "/couriers-ready-to-departure",
                    templateUrl: "partials/sale/couriers-ready-to-departure.tpl.html?t=095712282018",
                    controller: "ReadyToDepartureCouriersControllers",
                    controllerAs: "vm"
                })
                .state("root.couriers-ontheway",
                {
                    url: "/couriers-ontheway",
                    templateUrl: "partials/sale/couriers-ontheway.tpl.html?t=095712282018",
                    controller: "OnTheWayCouriersController",
                    controllerAs: "vm"
                })
                .state("root.couriers-delivered",
                {
                    url: "/couriers-delivered",
                    templateUrl: "partials/sale/couriers-delivered.tpl.html?t=095712282018",
                    controller: "DeliveredCouriersController",
                    controllerAs: "vm"
                })

                .state("root.pos-sale",
                {
                    url: "/pos-sale",
                    templateUrl: "partials/sale/sale-entry-pos.tpl.html?t=095712282018",
                    controller: "SaleController",
                    controllerAs: "vm"

                })
                .state("root.sale-pay-edit",
                {
                    url: "/sale-pay-edit/:id",
                    params: { id: null },
                    templateUrl: "partials/sale/sale-pay-edit.tpl.html?t=095712282018",
                    controller: "SaleTransactionEditController",
                    controllerAs: "vm"
                })
                .state("root.dealer-sale-pay-edit",
                {
                    url: "/dealer-sale-pay-edit/:id",
                    params: { id: null },
                    templateUrl: "partials/sale/dealer-sale-pay-edit.tpl.html?t=095712282018",
                    controller: "DealerSaleTransactionEditController",
                    controllerAs: "vm"
                })
                .state("root.product-pending-list",
                {
                    url: "/product-pending-list",
                    templateUrl: "partials/sale/product-pending-list.tpl.html?t=095712282018",
                    controller: "ProductPendingListController",
                    controllerAs: "vm"
                })
                .state("root.warehouse-wise-product-pending-list",
                    {
                        url: "/warehouse-wise-product-pending-list",
                        templateUrl: "partials/sale/warehouse-wise-product-pending-list.tpl.html?t=095712282018",
                        controller: "WareHouseWiseProductPendingListController",
                        controllerAs: "vm"
                    })
                .state("root.sales-by-salesman-list",
                {
                    url: "/sales-by-salesman-list",
                    templateUrl: "partials/sale/sales-by-salesman-list-tpl.html?t=095712282018",
                    controller: "SaleSalesmanController",
                    controllerAs: "vm"
                })
                //installment
                .state("root.kisti-sale",
                {
                    url: "/kisti-sale",
                    templateUrl: "partials/installment/sale-kisty.tpl.html?t=095712282018",
                    controller: "SaleController",
                    controllerAs: "vm"
                })

                .state("root.sale-installments",
                {
                    url: "/sale-installments",
                    templateUrl: "partials/installment/sale-installments.tpl.html?t=095712282018",
                    controller: "SaleInstallmentDetailController",
                    controllerAs: "vm"
                }).state("root.sale-installment-pay",
                {
                    url: "/sale-installment-pay/:id",
                    params: { id: null },
                    templateUrl: "partials/installment/sale-installment-pay.tpl.html?t=095712282018",
                    controller: "SaleInstallmentTransactionController",
                    controllerAs: "vm"
                }).state("root.sale-installment-list",
                {
                    url: "/sale-installment-list",
                    templateUrl: "partials/installment/sale-installment-list.tpl.html?t=095712282018",
                    controller: "SalesController",
                    controllerAs: "vm"
                })

                .state("root.sale-installment-details",
                {
                    url: "/sale-installment-details/:id",
                    params: { id: null },
                    templateUrl: "partials/installment/sale-installment-details.tpl.html?t=095712282018",
                    controller: "SaleDetailController",
                    controllerAs: "vm"
                });
        }

    }


    angular.module("app").config(SaleConfig);

}