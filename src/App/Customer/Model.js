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
    var Customer = /** @class */ (function (_super) {
        __extends(Customer, _super);
        function Customer() {
            var _this = _super.call(this) || this;
            _this.name = "";
            _this.id = "00000000-0000-0000-0000-000000000000";
            _this.point = 0;
            _this.membershipCardNo = '';
            _this.addresses = [];
            _this.phone = "";
            return _this;
        }
        return Customer;
    }(App.Entity));
    App.Customer = Customer;
    var CustomerAddress = /** @class */ (function (_super) {
        __extends(CustomerAddress, _super);
        function CustomerAddress() {
            var _this = _super.call(this) || this;
            _this.country = "Bangladesh";
            _this.district = "Dhaka";
            _this.thana = _this.getThana();
            _this.area = _this.getArea();
            return _this;
        }
        CustomerAddress.prototype.setThana = function (selectedThana) {
            localStorage.setItem("selectedThana", selectedThana);
        };
        CustomerAddress.prototype.getThana = function () {
            return localStorage.getItem("selectedThana");
        };
        CustomerAddress.prototype.setArea = function (selectedArea) {
            localStorage.setItem("selectedArea", selectedArea);
        };
        CustomerAddress.prototype.getArea = function () {
            return localStorage.getItem("selectedArea");
        };
        return CustomerAddress;
    }(App.Entity));
    App.CustomerAddress = CustomerAddress;
    var CustomerCommunication = /** @class */ (function (_super) {
        __extends(CustomerCommunication, _super);
        function CustomerCommunication() {
            return _super.call(this) || this;
        }
        return CustomerCommunication;
    }(App.Entity));
    App.CustomerCommunication = CustomerCommunication;
    var CustomerPointViewModel = /** @class */ (function () {
        function CustomerPointViewModel() {
            this.pointTotal = 0;
        }
        return CustomerPointViewModel;
    }());
    App.CustomerPointViewModel = CustomerPointViewModel;
    //export class CustomerHistory {
    //    CustomerId: string;
    //    Purchase: Purchase[];
    //    Payments: Payment[];
    //    constructor() {
    //        this.Purchase = [];
    //        this.Payments = [];
    //    }
    //}
    //export class Billing {
    //    firstName: string;
    //    lastName: string;
    //    phone: string;
    //    address1: string;
    //    city: string;
    //    postcode: string;
    //    country: string;
    //    email: string;
    //}
    var Location = /** @class */ (function () {
        function Location() {
        }
        return Location;
    }());
    App.Location = Location;
    var CustomerFeedback = /** @class */ (function (_super) {
        __extends(CustomerFeedback, _super);
        function CustomerFeedback() {
            return _super.call(this) || this;
        }
        return CustomerFeedback;
    }(App.Entity));
    App.CustomerFeedback = CustomerFeedback;
    var FeedbackType;
    (function (FeedbackType) {
        FeedbackType[FeedbackType["Positive"] = 1] = "Positive";
        FeedbackType[FeedbackType["Negative"] = 2] = "Negative";
        FeedbackType[FeedbackType["Other"] = 3] = "Other";
    })(FeedbackType = App.FeedbackType || (App.FeedbackType = {}));
})(App || (App = {}));
