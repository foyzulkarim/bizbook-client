module App {
    "use strict";

    export class BaseViewModel {
        id: string;
    }
    export class ProductCartModel extends BaseViewModel {
        constructor(p: ProductSaleViewModel, qty: number) {
            super();
            this.productSaleViewModel = p;
            this.quantity = qty;
        }
        total(): number {
            return this.productSaleViewModel.salePrice * this.quantity;
        }
        quantity: number;
        productSaleViewModel: ProductSaleViewModel;
    }

    export class CartViewModel {
        constructor() {
            this.products = [];
            this.total = 0;
            this.itemTotal = 0;
            this.discount = 0;
            this.paid = 0;
            this.pointsPaid = 0;
            this.return = 0;
            this.saleType = 'Cash';
            this.memo = new Date().getTime().toString();
        }
        products: ProductCartModel[];
        memo: string;
        itemTotal: number;
        total: number;
        discount: number;
        paid: number;
        return: number;
        pointsEarned: number;
        pointsPaid: number;
        remarks: string;
        saleType: string;
        card: string;
        trxNo: string;
    }

    export class ProductSaleViewModel extends BaseViewModel {
        constructor() {
            super();
        }
        stockId: string;
        name: string;
        productName: string;
        salePrice: number;
        onHand: number;
        costPrice: number;
    }

    export class Sale extends Entity {
        constructor() {
            super();
            this.saleDetails = [];
        }
        memo: string;
        itemTotal: number;
        total: number;
        discountTotal: number;
        paid: number;
        return: number;
        remarks: string;
        costTotal: number;
        profitTotal: number;
        commissionInPercent: number;
        commissionTotal: number;
        saleType: string;
        saleTo: string;
        paymentType: string;
        paymentFrom: string;
        trxNo: string;
        customerId: string;
        pointsEarned: number;
        pointsPaid: number;
        scheduledDate: string;
        ordertype: SaleChannel;
        orderFrom: SaleFrom;
        orderState: OrderState;
        orderDate: Date;
        saleDetails: SaleDetail[];
        saleStates: any[];
        customer: Customer;
        orderReferenceNumber: string;
    }

    export class OnlineSale extends Entity {
        constructor() {
            super();
            this.saleDetails = [];
        }
        memo: string;
        itemTotal: number;
        total: number;
        discountTotal: number;
        paid: number;
        return: number;
        remarks: string;
        costTotal: number;
        profitTotal: number;
        commissionInPercent: number;
        commissionTotal: number;
        saleType: string;
        saleTo: string;
        paymentType: string;
        paymentFrom: string;
        trxNo: string;
        customerId: string;
        pointsEarned: number;
        pointsPaid: number;
        scheduledDate: string;
        saleDetails: SaleDetail[];
    }

    export class SaleDetail extends Entity {
        constructor() { super(); }

        quantity: number;
        costPricePerUnit: number;
        costTotal: number;
        salePricePerUnit: number;
        salePriceTotal: number;
        discountTotal: number;
        total: number;
        productSerialNumber: string;
        saleId: string;
        remarks: string;
        saleDetailType: SaleDetailType;
        productDetails: ProductDetail[];
    }

    export class SaleReport extends Entity {
        constructor() {
            super();
            this.discountTotal = 0;
            this.itemTotal = 0;
            this.costPrice = 0;
            this.cashTotal = 0;
            this.cardTotal = 0;
            this.total = 0;
        }

        itemTotal: number;
        discountTotal: number;
        costPrice: number;
        cashTotal: number;
        cardTotal: number;
        total: number;
    }

    export class SaleCommision extends Entity {

        constructor() {
            super();
        }

        partnerId: string;
        saleTotal: string;
        profitTotal: string;
        commissionInPercent: string;
        commissionTotal: string;
        saleType: string;
        state: string;
        remarks: string;
        customerId: string;
    }

    export class SaleCommisionDetail extends Entity {

        constructor() {
            super();
        }

        saleCommissionId: string;
        productId: string;
        quantity: string;
        price: string;
        total: string;
    }

    export class SaleCommissionLog extends Entity {
        constructor() {
            super();
        }

        saleCommissionId: string;
        state: string;
        note: string;
    }

    export class SaleLog extends Entity {
        constructor() {
            super();
        }
        saleId: string;
        state: string;
        note: string;
    }

    export class SaleState {
        commandText: string;
        displayText: string;
        currentState: OrderState;
        nextSaleStateObject: SaleState;
    }

    export class SaleViewModel extends Entity {

        constructor() {
            super();
            this.saleDetails = [];
            this.transactions = [];
            // this.customer = new Customer();
            this.orderNumber = "";
            this.orderReferenceNumber = "";

            this.productAmount = 0;
            this.deliveryChargeAmount = 0;
            this.taxAmount = 0;
            this.paymentServiceChargeAmount = 0;
            this.otherAmount = 0;
            this.totalAmount = 0;
            this.discountAmount = 0;
            this.paidAmount = 0;
            this.dueAmount = 0;
            this.customerId = "1";
            this.addressId = "";
            this.customerName = "";
            this.customerPhone = "";
            this.isDealerSale = false;
            this.orderState = OrderState.Pending;
            // this.customer = new Customer();
            //this.installment = new Installment();
        }

        orderNumber: string;
        orderReferenceNumber: string;
        productAmount: number; // 450
        deliveryChargeAmount: number; // 50
        taxAmount: number; // 0
        paymentServiceChargeAmount: number; // (500*1.85)=9
        otherAmount: number; // 0
        totalAmount: number; // 509
        costAmount: number;
        profitAmount: number;
        paidByCashAmount:number;
        paidByOtherAmount:number;
        discountAmount: number; //  9
        discountPercent: number; //  9
        payableTotalAmount: number; // 500
        paidAmount: number; // 400
        dueAmount: number; // 100

        customerId: string;
        addressId: string;
        customerName: string;
        customerPhone: string;
        remarks: string;
        isActive: boolean;
        version: number;
        parentSaleId: string;
        saleChannel: SaleChannel;
        saleFrom: string;
        orderState: OrderState;
        currentState: SaleState;
        nextState: SaleState;
        nextOrderState: string;

        deliverymanId: string;
        deliverymanName: string;
        employeeInfoId: string;
        employeeInfoName : string;
        requiredDeliveryDateByCustomer: string;
        requiredDeliveryTimeByCustomer: string;
        orderDate: string;

        courierShopId: string;

        isDealerSale: boolean;
        // add dealers properties here [take suggestion from server's model]
        dealer: Dealer;
        dealerId: string;
        
        warehouse: Warehouse;
        warehouseId: string;

        saleDetails: SaleDetailViewModel[];

        paymentMethod: string;
        transactions: Transaction[];

        customer: Customer;
        address: CustomerAddress;

        guarantor1Id: string;
        guarantor2Id: string;

        guarantor1: Customer;
        guarantor2: Customer;

        installmentId: string;
        installment : Installment;

    }

    export class SaleDetailViewModel extends Entity {
        constructor() {
            super();
            this.productDetailId = "";
            this.name = "";
            this.remarks = "";
            this.quantity = 0;
            this.salePricePerUnit = 0;
            this.salePricePerUnitBeforeDiscount = 0;
            this.discountPercent = 0;
            this.discountAmount = 0;
            this.discountTotal = 0;
            this.priceTotal = 0;
            this.total = 0;
            this.saleId = "1";
            this.productSerialNumber = "0";
            this.productDetailName = "";
           
        }

        saleId: string;
        productId: string;
        productDetailId: string;
        name: string;
        remarks: string;
        quantity: number;
        salePricePerUnit: number;
        priceTotal: number;
        discountPercent: number;
        discountAmount: number;
        discountTotal: number;
        total: number;
        productDetail: ProductDetail;
        productSerialNumber: string;
        productDetailName: string;
        productCode: string;
        model: string;
        DealerPrice: number;
        salePricePerUnitBeforeDiscount: number;
        saleDetailType: string;
          
    }


    export class Installment extends Entity {

        constructor() {
            super();
            this.saleType = 1;
            this.installmentDetails = [];
        }

        cashPriceAmount: number;
        profitPercent: number;
        profitAmount: number;
        installmentTotalAmount: number;
        downPaymentPercent: number;
        downPaymentAmount: number;
        installmentDueAmount: number;
        installmentMonth: number;
        installmentPerMonthAmount: number;
        saleType: number;
        cashPriceDueAmount: number;
        profitAmountPerMonth: number;

        installmentDetails: InstallmentDetail[];
    }


    export class InstallmentDetail extends  Entity{
        constructor() {
            super();
        }

        scheduledAmount: number;
        scheduledDate: Date;
        paidAmount: number;
        installmentId: string;
        dueAmount: number;
        paidDate: Date;
        saleId:string;
    }

    export class SalesDuesUpdateModel extends Entity {
        transaction: Transaction;
        sales : SaleViewModel[];
    }

    export enum SaleChannel {
        All,
        InHouse,
        CashOnDelivery,
        Courier,
        Condition,
        Other
    }

    export enum SaleFrom {
        All,
        BizBook365,
        Facebook,
        Website,
        PhoneCall,
        MobileApp,
        Referral,
        Other,
    }
    export enum SearchDate {
        Created,
        Modified,
        DeliveryDate       
    }
    export enum OrderState {
        All, //0
        Pending,
        Created,
        ReadyToDeparture, //3
        OnTheWay, // 4
        Delivered, //5
        Completed,    //6
        Cancel
    }
    export enum SaleDetailType {
        Sale,
        Demage,
        Gift,
        Return
    }
}