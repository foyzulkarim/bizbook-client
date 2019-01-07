var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var App;
(function (App) {
    var Variance = /** @class */ (function (_super) {
        __extends(Variance, _super);
        function Variance() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Variance;
    }(App.Entity));
    App.Variance = Variance;
    var VarianceDetail = /** @class */ (function (_super) {
        __extends(VarianceDetail, _super);
        function VarianceDetail() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return VarianceDetail;
    }(App.Entity));
    App.VarianceDetail = VarianceDetail;
    var ProductCategory = /** @class */ (function (_super) {
        __extends(ProductCategory, _super);
        function ProductCategory() {
            return _super.call(this) || this;
        }
        return ProductCategory;
    }(App.Entity));
    App.ProductCategory = ProductCategory;
    var ProductDetail = /** @class */ (function (_super) {
        __extends(ProductDetail, _super);
        function ProductDetail() {
            var _this = _super.call(this) || this;
            _this.product = new ProductCategory();
            return _this;
        }
        return ProductDetail;
    }(App.Entity));
    App.ProductDetail = ProductDetail;
    var ProductGroup = /** @class */ (function (_super) {
        __extends(ProductGroup, _super);
        function ProductGroup() {
            return _super.call(this) || this;
        }
        return ProductGroup;
    }(App.Entity));
    App.ProductGroup = ProductGroup;
    var Stock = /** @class */ (function (_super) {
        __extends(Stock, _super);
        function Stock() {
            var _this = _super.call(this) || this;
            _this.startingInventory = 0;
            _this.purchased = 0;
            _this.sold = 0;
            _this.onHand = 0;
            _this.product = new ProductDetail();
            return _this;
        }
        return Stock;
    }(App.Entity));
    App.Stock = Stock;
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
    var ProductPriceViewModel = /** @class */ (function () {
        function ProductPriceViewModel() {
            this.costPriceTotal = 0;
            this.salePriceTotal = 0;
            this.dealerPriceTotal = 0;
            this.costTotal = 0;
        }
        return ProductPriceViewModel;
    }());
    App.ProductPriceViewModel = ProductPriceViewModel;
    var ProductDetailViewModel = /** @class */ (function () {
        function ProductDetailViewModel() {
        }
        return ProductDetailViewModel;
    }());
    App.ProductDetailViewModel = ProductDetailViewModel;
})(App || (App = {}));
