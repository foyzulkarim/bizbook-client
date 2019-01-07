module App {
    export class Warehouse extends Entity {
        constructor() {
            super();
        }
        name: string;
        streetAddress: string;
        area: string;
        district: string;
        isMain: boolean;
    }

    export class WarehouseProductHistory extends Entity {
        constructor() {
            super();
        }
        productName: string;
        saleQuantity: string;
        purchaseQuantity: string;
    }

    export class WarehousehistoryViewModel extends Entity {

        constructor() {
            super();
        }
        id: string;
        orderNumber: string;
        productName: string;
        quantity: string;
        type: string;
    }

    export class StockTransfer extends Entity {
        constructor() {
            super();
        }
        orderNumber: string;
        orderReferenceNumber: string;
        productAmount: number;
        deliveryTrackingNo: string;
        deliverymanId: string;
        deliverymanName: string;
        deliverymanPhone: string;
        estimatedDeliveryDate: string;
        sourceWarehouseId: string;
        destinationWarehouseId: string;
        remarks: string;
        totalAmount: number;
        stockTransferDetails: StockTransferDetail[];
    }

    export class StockTransferDetail extends Entity {
        constructor() {
            super();
            this.quantity = 0;
            this.salePricePerUnit = 0;
        }

        productDetailId: string;
        stockTransferId: string;
        quantity: number;
        salePricePerUnit: number;
        priceTotal: number;//total amount
        sourceWarehouseId: string;
        destinationWarehouseId: string;
        remarks: string;
        productDetail: ProductDetail;

    }
    export class Damage extends Entity {
        constructor() {
            super();
        }

        warehouseId:string;
        productDetailId: string;
        quantity : number;
    }
    export class StockTransferViewModel extends Entity {
        constructor() {
            super();
            this.stockTransferDetails = [];
            this.totalAmount = 0;
        }

        orderNumber: string;
        orderReferenceNumber: string;
        productAmount: number;
        deliveryTrackingNo: string;
        deliverymanId: string;
        deliverymanName: string;
        deliverymanPhone: string;
        estimatedDeliveryDate: string;
        remarks: string;
        sourceWarehouseId: string;
        destinationWarehouseId: string;
        saleTotal: number;
        totalAmount: number;
        stockTransferDetails: StockTransferDetailViewModel[];
    }

    export class StockTransferDetailViewModel extends Entity {
        constructor() {
            super();
            this.productDetailId = "";
            this.remarks = "";
            this.quantity = 0;
            this.salePricePerUnit = 0;
            this.priceTotal = 0;
            this.stockTransferId = "1";
        }

        quantity: number;
        salePricePerUnit: number;
        stockTransferId: string;
        productDetailId: string;
        sourceWarehouseId: string;
        destinationWarehouseId: string;
        remarks: string;
        priceTotal: number;//costTotal
        productDetailName: string;
        productCategoryId: string;
        productDetail: ProductDetail;
       // stockTransferOrderNumber: string;
        name: string;

    }

   
}