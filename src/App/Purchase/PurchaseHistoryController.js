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
    var PurchaseHistoryController = /** @class */ (function (_super) {
        __extends(PurchaseHistoryController, _super);
        function PurchaseHistoryController(location, $state, $stateParams, url, searchService, saveService, auth, excel) {
            var _this = _super.call(this, location, $state, $stateParams, url, searchService, saveService, auth, url.purchase, url.purchaseQuery, excel) || this;
            _this.selectedRow = null;
            return _this;
        }
        PurchaseHistoryController.prototype.activate = function () {
            console.log(this.stateParams);
            console.log('Activated');
            this.loadSupplierHistory();
        };
        PurchaseHistoryController.prototype.detail = function (p, index) {
            this.selectedRow = index;
        };
        PurchaseHistoryController.prototype.loadSupplierHistory = function () {
            var _this = this;
            var self = this;
            var successCallback = function (response) {
                _this.models = response.data["item1"];
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            var searchRequest = new App.SearchRequest();
            searchRequest.parentId = this.stateParams["purchase"];
            searchRequest.page = -1;
            self.searchService
                .search(searchRequest, self.url.supplierQuery + "/History")
                .then(successCallback, errorCallback);
        };
        PurchaseHistoryController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return PurchaseHistoryController;
    }(App.BaseController));
    App.PurchaseHistoryController = PurchaseHistoryController;
    angular.module("app").controller("PurchaseHistoryController", PurchaseHistoryController);
})(App || (App = {}));
