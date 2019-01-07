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
    var ZoneWiseSalesReportsController = /** @class */ (function (_super) {
        __extends(ZoneWiseSalesReportsController, _super);
        function ZoneWiseSalesReportsController(location, sate, stateParams, url, search, save, authService, localStorageService, excel) {
            var _this = _super.call(this, location, sate, stateParams, url, search, save, authService, url.sale, url.saleQuery, excel) || this;
            _this.quantityTotal = 0;
            _this.amountTotal = 0;
            var self = _this;
            self.localStorageService = localStorageService;
            _this.searchRequest.startDate = _this.startDate.toJSON();
            _this.searchRequest.endDate = _this.endDate.toJSON();
            _this.loadWarehouses().then(function (result) {
                if (self.warehouses.length === 1) {
                    self.searchRequest.warehouseId = self.warehouses[0].id;
                }
                else {
                    var whId = self.localStorageService.get(App.LocalStorageKeys.WarehouseId);
                    if (whId != null) {
                        self.searchRequest.warehouseId = whId;
                    }
                }
                return self.search();
            });
            return _this;
        }
        ZoneWiseSalesReportsController.prototype.search = function () {
            var self = this;
            self.quantityTotal = 0;
            self.amountTotal = 0;
            var successCallback = function (response) {
                self.models = response.data;
                self.chartLabels = [];
                self.chartData = [];
                self.quantityTotal = 0;
                self.amountTotal = 0;
                if (self.models.length === 0) {
                    console.log('No search result found');
                }
                else {
                    self.generateCsvModels();
                    for (var i = 0; i < self.models.length; i++) {
                        var m = self.models[i];
                        self.quantityTotal += m.count;
                        self.amountTotal += m.amount;
                        self.chartLabels.push(self.models[i].key);
                        self.chartData.push(self.models[i].amount);
                    }
                }
                self.totalCount = response.Count;
                self.searchRequest.totalPage = Math.ceil(response.Count / 10);
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService.search(self.searchRequest, self.queryUrl + "/SalesByZone")
                .then(successCallback, errorCallback);
        };
        ZoneWiseSalesReportsController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", "LocalStorageService", "Excel"
        ];
        return ZoneWiseSalesReportsController;
    }(App.BaseController));
    App.ZoneWiseSalesReportsController = ZoneWiseSalesReportsController;
    angular.module("app").controller("ZoneWiseSalesReportsController", ZoneWiseSalesReportsController);
})(App || (App = {}));
