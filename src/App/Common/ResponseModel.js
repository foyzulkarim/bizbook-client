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
    var BaseResponse = /** @class */ (function () {
        function BaseResponse(isSuccess, data, message) {
            this.isSuccess = isSuccess;
            this.data = data;
            this.message = message == null ? "Success" : message;
        }
        return BaseResponse;
    }());
    App.BaseResponse = BaseResponse;
    var PermissionResponse = /** @class */ (function (_super) {
        __extends(PermissionResponse, _super);
        function PermissionResponse() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return PermissionResponse;
    }(BaseResponse));
    App.PermissionResponse = PermissionResponse;
    var ErrorResponse = /** @class */ (function (_super) {
        __extends(ErrorResponse, _super);
        function ErrorResponse() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ErrorResponse;
    }(BaseResponse));
    App.ErrorResponse = ErrorResponse;
    var SearchResponse = /** @class */ (function (_super) {
        __extends(SearchResponse, _super);
        function SearchResponse(data) {
            var _this = _super.call(this, true, data, "Success") || this;
            _this.Models = data.item1;
            _this.Count = data.item2;
            return _this;
        }
        return SearchResponse;
    }(BaseResponse));
    App.SearchResponse = SearchResponse;
})(App || (App = {}));
