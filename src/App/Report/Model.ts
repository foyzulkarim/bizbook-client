module App {
    export class ProductReport extends Entity {
        value: string;
        //Classifications
        productGroupId: string;
        productGroupName: string;
        productCategoryId: string;
        productCategoryName: string;
        productDetailId: string;
        productDetailName: string;

        //Quantities
        uantityStartingToday: number;
        quantityEndingToday: number;
        quantityPurchaseToday: number;

        quantityPurchasePercentInAllProductsToday: number;
        quantitySaleToday: number;
        quantitySalePercentInAllProductsToday: number;
        quantitySaleToDealerToday: number;
        quantitySaleToCustomerToday: number;

        //Amounts Sale
        amountSaleToday: number;
        amountCostForSaleToday: number;
        amountSalePercentInAllProductsToday: number;
        amountReceivedToday: number;
        amountReceivableToday: number;
        amountAverageSalePriceToday: number;
        amountProfitToday: number;
        amountProfitPercentToday: number;
        amountProfitPercentInAllProductsToday: number;
        amountSaleToDealerToday: number;
        amountSaleToCustomerToday: number;

        //Amounts Purchase

        amountPurchaseToday: number;
        amountPurchasePercentInAllProductsToday: number;
        amountPaidToday: number;
        amountPayableToday: number;
        amountAveragePurchasePricePerUnitToday: number;

    }

    export class SaleReport2 extends Entity {
        saleType: string;
        amountProduct: number;
        amountDeliveryCharge: number;
        amountTax: number;
        amountOther: number;
        amountTotal: number;
        amountDiscount: number;
        amountPayable: number;
        amountPaid: number;
        amountDue: number;
        amountCost: number;
        amountProfit: number;
        amountProfitPercent: number;
        amountProfitPercentInAllSale: number;
        amountPreviousDueCollection: number;
        amountFromInhouse: number;
        amountFromWebsite: number;
        amountFromFacebook: number;
        amountFromOther: number;
        countSaleCreated: number;
        countSaleCompleted:number;
    } 

    export class TransactionReport extends Entity {
        accountHeadName: string;
        accountHeadId: string;
        amountTotalStarting: number;
        amountTotalIn: number;
        amountTotalOut: number;
        amountTotalEnding: number;
        countTotalTrx: number;
        amountCashStarting: number;
        amountCashIn: number;
        amountCashOut: number;
        amountCashEnding: number;
        countCashTrx: number;
        amountBankStarting: number;
        amountBankIn: number;
        amountBankOut: number;
        amountBankEnding: number;
        countBankTrx: number;
        amountMobileStarting: number;
        amountMobileIn: number;
        amountMobileOut: number;
        amountMobileEnding: number;
        countMobileTrx: number;
        amountOtherStarting: number;
        amountOtherIn: number;
        amountOtherOut: number;
        amountOtherEnding: number;
        countOtherTrx:number;
    }
}