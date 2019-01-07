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
    var Purchase = /** @class */ (function (_super) {
        __extends(Purchase, _super);
        function Purchase() {
            var _this = _super.call(this) || this;
            _this.purchaseDetails = [];
            return _this;
        }
        return Purchase;
    }(App.Entity));
    App.Purchase = Purchase;
    var PurchaseDetail = /** @class */ (function (_super) {
        __extends(PurchaseDetail, _super);
        function PurchaseDetail() {
            var _this = _super.call(this) || this;
            _this.quantity = 0;
            _this.pricePerUnit = 0;
            return _this;
        }
        return PurchaseDetail;
    }(App.Entity));
    App.PurchaseDetail = PurchaseDetail;
    var PurchaseState = /** @class */ (function (_super) {
        __extends(PurchaseState, _super);
        function PurchaseState() {
            return _super.call(this) || this;
        }
        return PurchaseState;
    }(App.Entity));
    App.PurchaseState = PurchaseState;
    var Comments = /** @class */ (function (_super) {
        __extends(Comments, _super);
        function Comments() {
            return _super.call(this) || this;
        }
        return Comments;
    }(App.Entity));
    App.Comments = Comments;
    var PurchaseCartModel = /** @class */ (function () {
        function PurchaseCartModel() {
        }
        return PurchaseCartModel;
    }());
    App.PurchaseCartModel = PurchaseCartModel;
    var PurchaseCartViewModel = /** @class */ (function () {
        function PurchaseCartViewModel() {
            this.purchaseDetailViewModels = [];
            this.total = 0;
        }
        return PurchaseCartViewModel;
    }());
    App.PurchaseCartViewModel = PurchaseCartViewModel;
    var PurchaseViewModel = /** @class */ (function (_super) {
        __extends(PurchaseViewModel, _super);
        function PurchaseViewModel() {
            var _this = _super.call(this) || this;
            _this.purchaseDetails = [];
            _this.totalAmount = 0;
            _this.shippingAmount = 0;
            _this.discountAmount = 0;
            _this.otherAmount = 0;
            return _this;
        }
        return PurchaseViewModel;
    }(App.Entity));
    App.PurchaseViewModel = PurchaseViewModel;
    var PurchaseDetailViewModel = /** @class */ (function (_super) {
        __extends(PurchaseDetailViewModel, _super);
        function PurchaseDetailViewModel() {
            var _this = _super.call(this) || this;
            _this.productDetailId = "";
            _this.remarks = "";
            _this.quantity = 0;
            _this.costPricePerUnit = 0;
            _this.costTotal = 0;
            _this.purchaseId = "1";
            return _this;
        }
        return PurchaseDetailViewModel;
    }(App.Entity));
    App.PurchaseDetailViewModel = PurchaseDetailViewModel;
})(App || (App = {}));
