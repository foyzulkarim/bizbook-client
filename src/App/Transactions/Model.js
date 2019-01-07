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
    var Expense = /** @class */ (function (_super) {
        __extends(Expense, _super);
        function Expense() {
            var _this = _super.call(this) || this;
            _this.payTo = "Cash";
            return _this;
        }
        return Expense;
    }(App.Entity));
    App.Expense = Expense;
    var AccountHead = /** @class */ (function (_super) {
        __extends(AccountHead, _super);
        function AccountHead() {
            return _super.call(this) || this;
        }
        return AccountHead;
    }(App.Entity));
    App.AccountHead = AccountHead;
    var Transaction = /** @class */ (function (_super) {
        __extends(Transaction, _super);
        function Transaction() {
            return _super.call(this) || this;
        }
        return Transaction;
    }(App.Entity));
    App.Transaction = Transaction;
    var AccountInfo = /** @class */ (function (_super) {
        __extends(AccountInfo, _super);
        function AccountInfo() {
            return _super.call(this) || this;
        }
        return AccountInfo;
    }(App.Entity));
    App.AccountInfo = AccountInfo;
})(App || (App = {}));
