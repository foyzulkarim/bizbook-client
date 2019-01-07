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
    var ProductReport = /** @class */ (function (_super) {
        __extends(ProductReport, _super);
        function ProductReport() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ProductReport;
    }(App.Entity));
    App.ProductReport = ProductReport;
    var SaleReport2 = /** @class */ (function (_super) {
        __extends(SaleReport2, _super);
        function SaleReport2() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return SaleReport2;
    }(App.Entity));
    App.SaleReport2 = SaleReport2;
    var TransactionReport = /** @class */ (function (_super) {
        __extends(TransactionReport, _super);
        function TransactionReport() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return TransactionReport;
    }(App.Entity));
    App.TransactionReport = TransactionReport;
})(App || (App = {}));
