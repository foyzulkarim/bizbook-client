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
    var BaseViewModel = /** @class */ (function () {
        function BaseViewModel() {
        }
        return BaseViewModel;
    }());
    App.BaseViewModel = BaseViewModel;
    var ProductCartModel = /** @class */ (function (_super) {
        __extends(ProductCartModel, _super);
        function ProductCartModel(p, qty) {
            var _this = _super.call(this) || this;
            _this.productSaleViewModel = p;
            _this.quantity = qty;
            return _this;
        }
        ProductCartModel.prototype.total = function () {
            return this.productSaleViewModel.salePrice * this.quantity;
        };
        return ProductCartModel;
    }(BaseViewModel));
    App.ProductCartModel = ProductCartModel;
    var CartViewModel = /** @class */ (function () {
        function CartViewModel() {
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
        return CartViewModel;
    }());
    App.CartViewModel = CartViewModel;
    var ProductSaleViewModel = /** @class */ (function (_super) {
        __extends(ProductSaleViewModel, _super);
        function ProductSaleViewModel() {
            return _super.call(this) || this;
        }
        return ProductSaleViewModel;
    }(BaseViewModel));
    App.ProductSaleViewModel = ProductSaleViewModel;
    var Sale = /** @class */ (function (_super) {
        __extends(Sale, _super);
        function Sale() {
            var _this = _super.call(this) || this;
            _this.saleDetails = [];
            return _this;
        }
        return Sale;
    }(App.Entity));
    App.Sale = Sale;
    var OnlineSale = /** @class */ (function (_super) {
        __extends(OnlineSale, _super);
        function OnlineSale() {
            var _this = _super.call(this) || this;
            _this.saleDetails = [];
            return _this;
        }
        return OnlineSale;
    }(App.Entity));
    App.OnlineSale = OnlineSale;
    var SaleDetail = /** @class */ (function (_super) {
        __extends(SaleDetail, _super);
        function SaleDetail() {
            return _super.call(this) || this;
        }
        return SaleDetail;
    }(App.Entity));
    App.SaleDetail = SaleDetail;
    var SaleReport = /** @class */ (function (_super) {
        __extends(SaleReport, _super);
        function SaleReport() {
            var _this = _super.call(this) || this;
            _this.discountTotal = 0;
            _this.itemTotal = 0;
            _this.costPrice = 0;
            _this.cashTotal = 0;
            _this.cardTotal = 0;
            _this.total = 0;
            return _this;
        }
        return SaleReport;
    }(App.Entity));
    App.SaleReport = SaleReport;
    var SaleCommision = /** @class */ (function (_super) {
        __extends(SaleCommision, _super);
        function SaleCommision() {
            return _super.call(this) || this;
        }
        return SaleCommision;
    }(App.Entity));
    App.SaleCommision = SaleCommision;
    var SaleCommisionDetail = /** @class */ (function (_super) {
        __extends(SaleCommisionDetail, _super);
        function SaleCommisionDetail() {
            return _super.call(this) || this;
        }
        return SaleCommisionDetail;
    }(App.Entity));
    App.SaleCommisionDetail = SaleCommisionDetail;
    var SaleCommissionLog = /** @class */ (function (_super) {
        __extends(SaleCommissionLog, _super);
        function SaleCommissionLog() {
            return _super.call(this) || this;
        }
        return SaleCommissionLog;
    }(App.Entity));
    App.SaleCommissionLog = SaleCommissionLog;
    var SaleLog = /** @class */ (function (_super) {
        __extends(SaleLog, _super);
        function SaleLog() {
            return _super.call(this) || this;
        }
        return SaleLog;
    }(App.Entity));
    App.SaleLog = SaleLog;
    var SaleState = /** @class */ (function () {
        function SaleState() {
        }
        return SaleState;
    }());
    App.SaleState = SaleState;
    var SaleViewModel = /** @class */ (function (_super) {
        __extends(SaleViewModel, _super);
        function SaleViewModel() {
            var _this = _super.call(this) || this;
            _this.saleDetails = [];
            _this.transactions = [];
            // this.customer = new Customer();
            _this.orderNumber = "";
            _this.orderReferenceNumber = "";
            _this.productAmount = 0;
            _this.deliveryChargeAmount = 0;
            _this.taxAmount = 0;
            _this.paymentServiceChargeAmount = 0;
            _this.otherAmount = 0;
            _this.totalAmount = 0;
            _this.discountAmount = 0;
            _this.paidAmount = 0;
            _this.dueAmount = 0;
            _this.customerId = "1";
            _this.addressId = "";
            _this.customerName = "";
            _this.customerPhone = "";
            _this.isDealerSale = false;
            _this.orderState = OrderState.Pending;
            return _this;
            // this.customer = new Customer();
            //this.installment = new Installment();
        }
        return SaleViewModel;
    }(App.Entity));
    App.SaleViewModel = SaleViewModel;
    var SaleDetailViewModel = /** @class */ (function (_super) {
        __extends(SaleDetailViewModel, _super);
        function SaleDetailViewModel() {
            var _this = _super.call(this) || this;
            _this.productDetailId = "";
            _this.name = "";
            _this.remarks = "";
            _this.quantity = 0;
            _this.salePricePerUnit = 0;
            _this.salePricePerUnitBeforeDiscount = 0;
            _this.discountPercent = 0;
            _this.discountAmount = 0;
            _this.discountTotal = 0;
            _this.priceTotal = 0;
            _this.total = 0;
            _this.saleId = "1";
            _this.productSerialNumber = "0";
            _this.productDetailName = "";
            return _this;
        }
        return SaleDetailViewModel;
    }(App.Entity));
    App.SaleDetailViewModel = SaleDetailViewModel;
    var Installment = /** @class */ (function (_super) {
        __extends(Installment, _super);
        function Installment() {
            var _this = _super.call(this) || this;
            _this.saleType = 1;
            _this.installmentDetails = [];
            return _this;
        }
        return Installment;
    }(App.Entity));
    App.Installment = Installment;
    var InstallmentDetail = /** @class */ (function (_super) {
        __extends(InstallmentDetail, _super);
        function InstallmentDetail() {
            return _super.call(this) || this;
        }
        return InstallmentDetail;
    }(App.Entity));
    App.InstallmentDetail = InstallmentDetail;
    var SalesDuesUpdateModel = /** @class */ (function (_super) {
        __extends(SalesDuesUpdateModel, _super);
        function SalesDuesUpdateModel() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return SalesDuesUpdateModel;
    }(App.Entity));
    App.SalesDuesUpdateModel = SalesDuesUpdateModel;
    var SaleChannel;
    (function (SaleChannel) {
        SaleChannel[SaleChannel["All"] = 0] = "All";
        SaleChannel[SaleChannel["InHouse"] = 1] = "InHouse";
        SaleChannel[SaleChannel["CashOnDelivery"] = 2] = "CashOnDelivery";
        SaleChannel[SaleChannel["Courier"] = 3] = "Courier";
        SaleChannel[SaleChannel["Condition"] = 4] = "Condition";
        SaleChannel[SaleChannel["Other"] = 5] = "Other";
    })(SaleChannel = App.SaleChannel || (App.SaleChannel = {}));
    var SaleFrom;
    (function (SaleFrom) {
        SaleFrom[SaleFrom["All"] = 0] = "All";
        SaleFrom[SaleFrom["BizBook365"] = 1] = "BizBook365";
        SaleFrom[SaleFrom["Facebook"] = 2] = "Facebook";
        SaleFrom[SaleFrom["Website"] = 3] = "Website";
        SaleFrom[SaleFrom["PhoneCall"] = 4] = "PhoneCall";
        SaleFrom[SaleFrom["MobileApp"] = 5] = "MobileApp";
        SaleFrom[SaleFrom["Referral"] = 6] = "Referral";
        SaleFrom[SaleFrom["Other"] = 7] = "Other";
    })(SaleFrom = App.SaleFrom || (App.SaleFrom = {}));
    var SearchDate;
    (function (SearchDate) {
        SearchDate[SearchDate["Created"] = 0] = "Created";
        SearchDate[SearchDate["Modified"] = 1] = "Modified";
        SearchDate[SearchDate["DeliveryDate"] = 2] = "DeliveryDate";
    })(SearchDate = App.SearchDate || (App.SearchDate = {}));
    var OrderState;
    (function (OrderState) {
        OrderState[OrderState["All"] = 0] = "All";
        OrderState[OrderState["Pending"] = 1] = "Pending";
        OrderState[OrderState["Created"] = 2] = "Created";
        OrderState[OrderState["ReadyToDeparture"] = 3] = "ReadyToDeparture";
        OrderState[OrderState["OnTheWay"] = 4] = "OnTheWay";
        OrderState[OrderState["Delivered"] = 5] = "Delivered";
        OrderState[OrderState["Completed"] = 6] = "Completed";
        OrderState[OrderState["Cancel"] = 7] = "Cancel";
    })(OrderState = App.OrderState || (App.OrderState = {}));
    var SaleDetailType;
    (function (SaleDetailType) {
        SaleDetailType[SaleDetailType["Sale"] = 0] = "Sale";
        SaleDetailType[SaleDetailType["Demage"] = 1] = "Demage";
        SaleDetailType[SaleDetailType["Gift"] = 2] = "Gift";
        SaleDetailType[SaleDetailType["Return"] = 3] = "Return";
    })(SaleDetailType = App.SaleDetailType || (App.SaleDetailType = {}));
})(App || (App = {}));
