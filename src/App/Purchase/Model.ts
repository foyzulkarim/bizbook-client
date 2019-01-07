module App {

    export class Purchase extends Entity {
        constructor() {
            super();
            this.purchaseDetails = [];
        }

        orderNumber: string;
        orderReferenceNumber: string;
        shippingAmount: number;
        productAmount: number;
        otherAmount: number;
        discountAmount: number;
        totalAmount: number;
        paidAmount: number;
        dueAmount: number;
        state: string;
        shippingProvider: string;
        shipmentTrackingNo: string;
        supplierId: string;
        remarks: string;
       
        purchaseDetails: PurchaseDetail[]
    }

    export class PurchaseDetail extends Entity {
        constructor() {
            super();
            this.quantity = 0;
            this.pricePerUnit = 0;
        }

        productDetailId: string;
        purchaseId: string;
        quantity: number;
        pricePerUnit: number;
        totalAmount: number;
        remarks: string;
        isActive: boolean;
    }

    export class PurchaseState extends Entity {

        constructor() {
            super();
        }
        shop: Shop;
        purchaseId: string;
        state: string;
        nextState: string;
        note: string;

    }

    export class Comments extends Entity {

        constructor() {
            super();
        }
        shop: Shop;
        text: string;
        parentId: string;

    }


    export class PurchaseCartModel {
        constructor() {

        }

        productId: string;
        productPriceId: string;
        quantity: number;
        price: number;
        total: number;
        name: string;
        remarks: string;
        partnerShopId: string;

    }

    export class PurchaseCartViewModel {
        constructor() {
            this.purchaseDetailViewModels = [];
            this.total = 0;
        }
        purchaseDetailViewModels: PurchaseCartModel[];
        memo: string;
        total: number;
        partnerShopId: string;
        remarks: string;
        courierNo: string;
        isDirectPurchase: boolean;
        shopId: string;
    }

    export class PurchaseViewModel extends Entity {

        constructor() {
            super();
            this.purchaseDetails = [];
            this.totalAmount = 0;
            this.shippingAmount = 0;
            this.discountAmount = 0;
            this.otherAmount = 0;
        }
        orderReferenceNumber: string;
        orderNumber: string;
        shippingAmount: number;
        productAmount: number;
        otherAmount: number;
        discountAmount: number;
        totalAmount: number;
        paidAmount: number;
        dueAmount: number;
        state: string;
        shippingProvider: string;
        shipmentTrackingNo: string;
        supplierId: string;
        warehouseId: string;
        remarks: string;
        costTotal: number;
        purchaseOrderDate: string;
        purchaseDetails: PurchaseDetailViewModel[];
    }

    export class PurchaseDetailViewModel extends Entity {
        constructor() {
            super();
            this.productDetailId = "";
            this.remarks = "";
            this.quantity = 0;
            this.costPricePerUnit = 0;
            this.costTotal = 0;
            this.purchaseId = "1";
        }

        supplierName: string;


        name: string;
        productDetailId: string;
        purchaseId: string;
        quantity: number;
        costPricePerUnit: number;
        costTotal: number;
        remarks: string;
        isActive: boolean;
        costPrice: number;
        productDetailName: string;
        productDetail: ProductDetail;
    }
}

