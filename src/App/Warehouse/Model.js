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
    var Warehouse = /** @class */ (function (_super) {
        __extends(Warehouse, _super);
        function Warehouse() {
            return _super.call(this) || this;
        }
        return Warehouse;
    }(App.Entity));
    App.Warehouse = Warehouse;
    var WarehouseProductHistory = /** @class */ (function (_super) {
        __extends(WarehouseProductHistory, _super);
        function WarehouseProductHistory() {
            return _super.call(this) || this;
        }
        return WarehouseProductHistory;
    }(App.Entity));
    App.WarehouseProductHistory = WarehouseProductHistory;
    var WarehousehistoryViewModel = /** @class */ (function (_super) {
        __extends(WarehousehistoryViewModel, _super);
        function WarehousehistoryViewModel() {
            return _super.call(this) || this;
        }
        return WarehousehistoryViewModel;
    }(App.Entity));
    App.WarehousehistoryViewModel = WarehousehistoryViewModel;
    var StockTransfer = /** @class */ (function (_super) {
        __extends(StockTransfer, _super);
        function StockTransfer() {
            return _super.call(this) || this;
        }
        return StockTransfer;
    }(App.Entity));
    App.StockTransfer = StockTransfer;
    var StockTransferDetail = /** @class */ (function (_super) {
        __extends(StockTransferDetail, _super);
        function StockTransferDetail() {
            var _this = _super.call(this) || this;
            _this.quantity = 0;
            _this.salePricePerUnit = 0;
            return _this;
        }
        return StockTransferDetail;
    }(App.Entity));
    App.StockTransferDetail = StockTransferDetail;
    var Damage = /** @class */ (function (_super) {
        __extends(Damage, _super);
        function Damage() {
            return _super.call(this) || this;
        }
        return Damage;
    }(App.Entity));
    App.Damage = Damage;
    var StockTransferViewModel = /** @class */ (function (_super) {
        __extends(StockTransferViewModel, _super);
        function StockTransferViewModel() {
            var _this = _super.call(this) || this;
            _this.stockTransferDetails = [];
            _this.totalAmount = 0;
            return _this;
        }
        return StockTransferViewModel;
    }(App.Entity));
    App.StockTransferViewModel = StockTransferViewModel;
    var StockTransferDetailViewModel = /** @class */ (function (_super) {
        __extends(StockTransferDetailViewModel, _super);
        function StockTransferDetailViewModel() {
            var _this = _super.call(this) || this;
            _this.productDetailId = "";
            _this.remarks = "";
            _this.quantity = 0;
            _this.salePricePerUnit = 0;
            _this.priceTotal = 0;
            _this.stockTransferId = "1";
            return _this;
        }
        return StockTransferDetailViewModel;
    }(App.Entity));
    App.StockTransferDetailViewModel = StockTransferDetailViewModel;
})(App || (App = {}));
