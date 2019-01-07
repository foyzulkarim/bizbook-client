module App {

    export class Variance extends Entity {
        name: string;
    }

    export class VarianceDetail extends  Entity {
        name: string;
        varianceId : string;
    }    

    export class ProductCategory extends Entity {
        constructor() {
            super();
        }

        name: string;
        productGroupId: string;
    }

    export class ProductDetail extends Entity {
        constructor() {
            super();
           
            this.product = new ProductCategory();
        }

        name: string;
        model: string;
        year: string;
        barCode: string;
        productCode: string;
        hasUniqueSerial: boolean;
        hasWarrenty: boolean;
        salePrice: number;
        dealerPrice:number;
        costPrice: number;
        capacity: string;
        size: string;
        type: string;
        weight: string;
        volume: string;
        material: string;
        color: string;
        dimension: string;
        other: string;
        startingInventory: number;
        purchased: number;
        sold: number;
        onHand: number;
        productCategoryId: string;
        brandId: string;
        product: ProductCategory;
        isActive:boolean;
    }
     
    export class ProductGroup extends Entity {

        constructor() {
            super();
        }

        name: string;
    }

    export class Stock extends Entity {

        constructor() {
            super();
            this.startingInventory = 0;
            this.purchased = 0;
            this.sold = 0;
            this.onHand = 0;
            this.product = new ProductDetail();
        }

        startingInventory: number;
        purchased: number;
        sold: number;
        onHand: number;
        productId: string;
        product: ProductDetail;
    }


   

    //export class  StockDetailViewModel {
    //    Product: {
    //        BarcodeUrl: string;
    //        GroupName: string;
    //        Brand: string;
    //        BarCode: string;
          
    //        Name: string;
    //        StartingInventory: number;
    //        Received: number;
    //        Sold: number;
    //        OnHand: number;
    //        MinimumRequired: number;
    //        CostPrice: number;
    //        SalePrice: number;
    //    };
    //    BookmarkStartingOnHand: number;
    //    StartingOnHand: number;
    //    StockIn: number;
    //    StockOut: number;
    //    CurrentOnHand: number;
    //    EndOnHand: number;
    //    CostTotal: number;
    //}

    //export class  StockViewModel {
    //    StartDate: Date;
    //    EndDate: Date;
    //    BookmarkDate: Date;
    //    CostTotal: number;
    //    StockDetailViewModels: StockDetailViewModel[];

    //    constructor() {
    //        this.StockDetailViewModels = [];
    //    }
    //}

    export class ProductPriceViewModel {
        constructor() {
            this.costPriceTotal = 0;
            this.salePriceTotal = 0;
            this.dealerPriceTotal = 0;
            this.costTotal = 0;
        }
        costPriceTotal: number;
        salePriceTotal: number;
        dealerPriceTotal: number;
        costTotal:number;
    }

    export class ProductDetailViewModel {
        shopId: string;
        name: string;
        model: string;
        productCode: string;
        year: string;
        barCode: string;
        hasUniqueSerial: boolean;
        hasWarrenty: boolean;
        salePrice: number;
        costPrice: number;
        capacity: string;
        size: string;
        type: string;
        weight: string;
        volume: string;
        material: string;
        color: string;
        minimumStockToNotify: number;
        dimension: string;
        other: string;
        startingInventory: number;
        purchased: number;
        sold: number;
        onHand: number;
        productId: number;
        productName: number;
        brandId: number;
        brandName: string;
        id: string;
        created: string;
        createdBy: string;
        createdFrom: string;
        modified: string;
        modifiedBy: string;
    }
    
}

