module App {
    export class WarehouseConfig {
        static $inject = ["$stateProvider"];
        constructor(
            $stateProvider: angular.ui.IStateProvider
        ) {
            $stateProvider
                .state("root.warehouse",
                {
                    url: "/warehouse/:id",
                    params: { id: null },
                    templateUrl: "partials/warehouse/warehouse-entry.tpl.html?t=095712282018",
                    controller: "WarehouseController",
                    controllerAs: "vm"
                })
                .state("root.warehouses",
                {
                    url: "/warehouses",
                    templateUrl: "partials/warehouse/warehouse-list.tpl.html?t=095712282018",
                    controller: "WarehousesController",
                    controllerAs: "vm"
                })
                .state("root.mywarehouse",
                {
                    url: "/mywarehouse/:myId",
                    templateUrl: "partials/warehouse/warehouse-list.tpl.html?t=095712282018",
                    controller: "WarehousesController",
                    controllerAs: "vm"
                })
                .state("root.warehouseProductHistory",
                {
                    url: "/warehouse/product-history/{warehouseId}",
                    templateUrl: "partials/warehouse/warehouse-product-history.tpl.html",
                    controller: "WarehouseProductHistoryController",
                    controllerAs: "vm"
                })
                .state("root.warehousehistory",
                {
                    url: "/warehousehistory/:id",
                    templateUrl: "partials/warehouse/warehouse-history.tpl.html?t=095712282018",
                    controller: "WarehouseHistoryController",
                    controllerAs: "vm"
                })
                .state("root.stocktransfer",
                {
                    url: "/stocktransfer/:id",
                    params: { id: null },
                    templateUrl: "partials/warehouse/stocktransfer-entry.tpl.html?t=095712282018",
                    controller: "StockTransferController",
                    controllerAs: "vm"
                })
                .state("root.stocktransfers",
                {
                    url: "/stocktransfers",
                    templateUrl: "partials/warehouse/stocktransfers-list.tpl.html?t=095712282018",
                    controller: "StockTransfersController",
                    controllerAs: "vm"
                })
                .state("root.stocktransferdetail",
                    {
                        url: "/stocktransferdetail/:id",
                        params: {id: null},
                        templateUrl: "partials/warehouse/stocktransfers-detail.tpl.html?t=095712282018",
                        controller: "StockTransferDetailController",
                        controllerAs: "vm"
                    })
                .state("root.damage",
                    {
                        url: "/damage",
                        params: { id: null },
                        templateUrl: "partials/warehouse/damage-entry.tpl.html?t=080001032018",
                        controller: "DamageController",
                        controllerAs: "vm"
                }).state("root.damages",
                    {
                        url: "/damages",
                        templateUrl: "partials/warehouse/damage-list.tpl.html?t=080001032018",
                        controller: "DamagesController",
                        controllerAs: "vm"
                }).state("root.stocktransferreturn",
                {
                    url: "/stocktransferreturn/:id",
                    params: { id: null },
                    templateUrl: "partials/warehouse/stock-transfer-return.tpl.html?t=080001032018",
                    controller: "StockTransferReturnController",
                    controllerAs: "vm"
                }) 
                .state("root.stocktransferreceipt",
                {
                    url: "/stocktransferreceipt/:id",
                    params: { id: null },
                    templateUrl: "partials/warehouse/stock-transfer-receipt.tpl.html?t=080001032018",
                    controller: "StockTransferReturnController",
                    controllerAs: "vm"
                })          
                ;
        }
    }
    angular.module("app").config(WarehouseConfig);
}