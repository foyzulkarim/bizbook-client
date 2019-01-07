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
    "use strict";
    var Brand = /** @class */ (function (_super) {
        __extends(Brand, _super);
        function Brand() {
            return _super.call(this) || this;
        }
        return Brand;
    }(App.Entity));
    App.Brand = Brand;
    var Shop = /** @class */ (function (_super) {
        __extends(Shop, _super);
        function Shop() {
            return _super.call(this) || this;
        }
        return Shop;
    }(App.Entity));
    App.Shop = Shop;
    var Supplier = /** @class */ (function (_super) {
        __extends(Supplier, _super);
        function Supplier() {
            return _super.call(this) || this;
        }
        return Supplier;
    }(App.Entity));
    App.Supplier = Supplier;
    var Dealer = /** @class */ (function (_super) {
        __extends(Dealer, _super);
        function Dealer() {
            return _super.call(this) || this;
        }
        return Dealer;
    }(App.Entity));
    App.Dealer = Dealer;
    var DealerProduct = /** @class */ (function (_super) {
        __extends(DealerProduct, _super);
        function DealerProduct() {
            return _super.call(this) || this;
        }
        return DealerProduct;
    }(App.Entity));
    App.DealerProduct = DealerProduct;
    var DealerProductDetailUpdateModel = /** @class */ (function (_super) {
        __extends(DealerProductDetailUpdateModel, _super);
        function DealerProductDetailUpdateModel() {
            return _super.call(this) || this;
        }
        return DealerProductDetailUpdateModel;
    }(App.Entity));
    App.DealerProductDetailUpdateModel = DealerProductDetailUpdateModel;
    var DealerProductTransaction = /** @class */ (function (_super) {
        __extends(DealerProductTransaction, _super);
        function DealerProductTransaction() {
            return _super.call(this) || this;
        }
        return DealerProductTransaction;
    }(App.Entity));
    App.DealerProductTransaction = DealerProductTransaction;
    var SupplierProduct = /** @class */ (function (_super) {
        __extends(SupplierProduct, _super);
        function SupplierProduct() {
            return _super.call(this) || this;
        }
        return SupplierProduct;
    }(App.Entity));
    App.SupplierProduct = SupplierProduct;
    var SupplierProductTransaction = /** @class */ (function (_super) {
        __extends(SupplierProductTransaction, _super);
        function SupplierProductTransaction() {
            return _super.call(this) || this;
        }
        return SupplierProductTransaction;
    }(App.Entity));
    App.SupplierProductTransaction = SupplierProductTransaction;
    var SupplierProductDetailUpdateModel = /** @class */ (function (_super) {
        __extends(SupplierProductDetailUpdateModel, _super);
        function SupplierProductDetailUpdateModel() {
            return _super.call(this) || this;
        }
        return SupplierProductDetailUpdateModel;
    }(App.Entity));
    App.SupplierProductDetailUpdateModel = SupplierProductDetailUpdateModel;
    var Courier = /** @class */ (function (_super) {
        __extends(Courier, _super);
        function Courier() {
            return _super.call(this) || this;
        }
        return Courier;
    }(App.Entity));
    App.Courier = Courier;
})(App || (App = {}));
