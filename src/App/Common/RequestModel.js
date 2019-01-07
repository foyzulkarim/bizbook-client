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
    var Entity = /** @class */ (function () {
        function Entity() {
            this.id = "00000000-0000-0000-0000-000000000000";
            this.created = new Date().toJSON();
            this.modified = new Date().toJSON();
            this.createdBy = "1";
            this.modifiedBy = "1";
            this.shopId = "1";
            this.createdFrom = "Browser";
        }
        return Entity;
    }());
    App.Entity = Entity;
    var PermissionRequest = /** @class */ (function () {
        function PermissionRequest(name) {
            this.name = name;
        }
        return PermissionRequest;
    }());
    App.PermissionRequest = PermissionRequest;
    var Notification = /** @class */ (function () {
        function Notification() {
        }
        return Notification;
    }());
    App.Notification = Notification;
    var DataRequest = /** @class */ (function () {
        function DataRequest() {
        }
        return DataRequest;
    }());
    App.DataRequest = DataRequest;
    var SearchRequest = /** @class */ (function (_super) {
        __extends(SearchRequest, _super);
        function SearchRequest(keyword, orderBy, isAsc, parentId) {
            if (keyword === void 0) { keyword = ""; }
            if (orderBy === void 0) { orderBy = "Modified"; }
            if (isAsc === void 0) { isAsc = "false"; }
            if (parentId === void 0) { parentId = ""; }
            var _this = _super.call(this) || this;
            _this.keyword = keyword;
            _this.orderBy = orderBy;
            _this.isAscending = isAsc;
            _this.parentId = parentId;
            _this.page = 1;
            return _this;
        }
        return SearchRequest;
    }(DataRequest));
    App.SearchRequest = SearchRequest;
    var PartnerCommunicationSearchRequest = /** @class */ (function (_super) {
        __extends(PartnerCommunicationSearchRequest, _super);
        function PartnerCommunicationSearchRequest(keyword, orderBy, isAsc, parentId) {
            var _this = _super.call(this, keyword, orderBy, isAsc) || this;
            _this.keyword = keyword;
            _this.orderBy = orderBy;
            _this.isAscending = isAsc;
            _this.parentId = parentId;
            _this.page = 1;
            return _this;
        }
        return PartnerCommunicationSearchRequest;
    }(SearchRequest));
    App.PartnerCommunicationSearchRequest = PartnerCommunicationSearchRequest;
    var DetailRequest = /** @class */ (function (_super) {
        __extends(DetailRequest, _super);
        function DetailRequest(id) {
            var _this = _super.call(this) || this;
            _this.id = id;
            return _this;
        }
        DetailRequest.prototype.GetQueryString = function () {
            return "?id=" + this.id;
        };
        return DetailRequest;
    }(DataRequest));
    App.DetailRequest = DetailRequest;
    var PurchaseHistorySearchRequest = /** @class */ (function (_super) {
        __extends(PurchaseHistorySearchRequest, _super);
        function PurchaseHistorySearchRequest(keyword, orderBy, isAsc) {
            return _super.call(this, keyword, orderBy, isAsc) || this;
        }
        return PurchaseHistorySearchRequest;
    }(SearchRequest));
    App.PurchaseHistorySearchRequest = PurchaseHistorySearchRequest;
    var ProductHistorySearchRequest = /** @class */ (function (_super) {
        __extends(ProductHistorySearchRequest, _super);
        function ProductHistorySearchRequest(keyword, orderBy, isAsc) {
            return _super.call(this, keyword, orderBy, isAsc) || this;
        }
        return ProductHistorySearchRequest;
    }(SearchRequest));
    App.ProductHistorySearchRequest = ProductHistorySearchRequest;
    var ProductVarianceSearchRequest = /** @class */ (function (_super) {
        __extends(ProductVarianceSearchRequest, _super);
        function ProductVarianceSearchRequest(keyword, orderBy, isAsc, parentId, partnerShopId) {
            var _this = _super.call(this, keyword, orderBy, isAsc, parentId) || this;
            _this.partnerShopId = partnerShopId;
            return _this;
        }
        return ProductVarianceSearchRequest;
    }(SearchRequest));
    App.ProductVarianceSearchRequest = ProductVarianceSearchRequest;
})(App || (App = {}));
