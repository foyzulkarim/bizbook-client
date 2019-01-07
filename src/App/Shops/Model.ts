module App {

    "use strict";

    export class Brand extends Entity {
        constructor() {
            super();
        }

        name: string;
        address: string;
        phone: string;
        remarks: string;
        contactPersonName: string;
        country: string;
        madeInCountry: string;
        email: string;
        brandCode: string;

    }

    export class Shop extends Entity {
        constructor() {
            super();
        }
        name: string;
        nameBn: string;
        houseNo: string;
        roadNo: string;
        area: string;
        thana: string;
        district: string;
        country: string;
        phone: string;
        remarks: string;
        contactPersonName: string;
        about: string;
        expiryDate: Date;
        wcUrl: string;
        key: string;
        secret: string;
        hasDeliveryChain: boolean;
        chalanName: string;
        receiptName: string;
        isShowOrderNumber: boolean;
        isAutoAddToCart: boolean;
        deliveryCharge: number;
    }

    export class Supplier extends Entity {
        constructor() {
            super();
        }
        name: string;
        address: string;
        country: string;
        phone: string;
        remarks: string;
        contactPersonName: string;
    }

    export class Dealer extends Entity {
        constructor() {
            super();
        }
        name: string;
        streetAddress: string;
        area: string;
        thana: string;
        postCode: string;
        district: string;
        country: string;
        phone: string;
        remarks: string;
        companyName: string;
        contactPersonName: string;
        isVerified: boolean;

    }


    export class DealerProduct extends Entity {
        constructor() {
            super();
        }
        quantity: number;
        totalPrice: number;
        paid: number;
        due: number;
        productDetailId: string;
        dealerId: string;
        newlyPaid: number;
    }



    export class DealerProductDetailUpdateModel extends Entity {
        constructor() {
            super();
        }

        dealerId: string;

        transaction: Transaction;

        dealerProductTransactions: DealerProductTransaction[];
    }

    export class DealerProductTransaction extends Entity {
        constructor() {
            super();
        }

        amount: number;
        transactionId: string;
        dealerProductId: string;
    }


    export class SupplierProduct extends Entity {
        constructor() {
            super();
        }
        quantity: number;
        totalPrice: number;
        paid: number;
        due: number;
        productDetailId: string;
        supplierId: string;
        newlyPaid: number;
    }

    export class SupplierProductTransaction extends Entity {
        constructor() {
            super();
        }
        amount: number;
        transactionId: string;
        supplierProductId: string;
    }

    export class SupplierProductDetailUpdateModel extends Entity {
        constructor() {
            super();
        }
        supplierId: string;
        transaction: Transaction;
        supplierProductTransactions: SupplierProductTransaction[];
    }


    export class Courier extends Entity {
        constructor() {
            super();
        }
        contactPersonName: string;
        courierShopId: string;

    }
}

