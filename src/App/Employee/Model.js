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
    var Employee = /** @class */ (function (_super) {
        __extends(Employee, _super);
        function Employee() {
            return _super.call(this) || this;
        }
        return Employee;
    }(App.Entity));
    App.Employee = Employee;
    var EmployeeInfo = /** @class */ (function (_super) {
        __extends(EmployeeInfo, _super);
        function EmployeeInfo() {
            return _super.call(this) || this;
        }
        return EmployeeInfo;
    }(App.Entity));
    App.EmployeeInfo = EmployeeInfo;
})(App || (App = {}));
