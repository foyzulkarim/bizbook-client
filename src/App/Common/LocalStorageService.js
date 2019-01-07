var App;
(function (App) {
    var LocalStorageService = /** @class */ (function () {
        function LocalStorageService(localStorageService) {
            this.localStorageService = localStorageService;
        }
        LocalStorageService.prototype.getStorageKey = function (key) {
            var storageKey = LocalStorageKeys[key].toString();
            return storageKey;
        };
        //save(key: LocalStorageKeys, value: any): void {
        //    let type: StorageType = StorageType.localStorage;
        //    let storageType = this.localStorageService.getStorageType();
        //    if (storageType != null) {
        //        type = storageType === 'localStorage' ? StorageType.localStorage : StorageType.sessionStorage;
        //    }
        //    this.save(key, value, type);
        //}
        LocalStorageService.prototype.save = function (key, value, type) {
            var storageKey = this.getStorageKey(key);
            var storageValue = JSON.stringify(value);
            var storageType = this.localStorageService.getStorageType();
            if (type != null) {
                storageType = type === StorageType.localStorage ? 'localStorage' : 'sessionStorage';
            }
            var service = this.localStorageService;
            service.set(storageKey, storageValue, storageType);
        };
        LocalStorageService.prototype.save2 = function (key, value, type) {
            var storageKey = this.getStorageKey(key);
            var storageType = this.localStorageService.getStorageType();
            if (type != null) {
                storageType = type === StorageType.localStorage ? 'localStorage' : 'sessionStorage';
            }
            var service = this.localStorageService;
            service.set(storageKey, value, storageType);
        };
        LocalStorageService.prototype.get = function (key) {
            var storageKey = this.getStorageKey(key);
            var strItem = this.localStorageService.get(storageKey);
            var item = JSON.parse(strItem);
            return item;
        };
        LocalStorageService.prototype.get2 = function (key) {
            var storageKey = this.getStorageKey(key);
            var strItem = this.localStorageService.get(storageKey);
            return strItem;
        };
        LocalStorageService.prototype.remove = function (key) {
            var storageKey = this.getStorageKey(key);
            this.localStorageService.remove(storageKey);
        };
        LocalStorageService.$inject = ["localStorageService"];
        return LocalStorageService;
    }());
    App.LocalStorageService = LocalStorageService;
    angular.module('app').service('LocalStorageService', LocalStorageService);
    var LocalStorageKeys;
    (function (LocalStorageKeys) {
        LocalStorageKeys[LocalStorageKeys["ShowOrderNumberAfterSave"] = 0] = "ShowOrderNumberAfterSave";
        LocalStorageKeys[LocalStorageKeys["AddToCartIfResultIsOne"] = 1] = "AddToCartIfResultIsOne";
        LocalStorageKeys[LocalStorageKeys["DeliveryChargeAmount"] = 2] = "DeliveryChargeAmount";
        LocalStorageKeys[LocalStorageKeys["ReceiptName"] = 3] = "ReceiptName";
        LocalStorageKeys[LocalStorageKeys["ChalanName"] = 4] = "ChalanName";
        LocalStorageKeys[LocalStorageKeys["CustomerListPageNo"] = 5] = "CustomerListPageNo";
        LocalStorageKeys[LocalStorageKeys["DefaultWarehouse"] = 6] = "DefaultWarehouse";
        LocalStorageKeys[LocalStorageKeys["DealerPriceChange"] = 7] = "DealerPriceChange";
        LocalStorageKeys[LocalStorageKeys["SaleListPageNo"] = 8] = "SaleListPageNo";
        LocalStorageKeys[LocalStorageKeys["DueSaleListPageNo"] = 9] = "DueSaleListPageNo";
        LocalStorageKeys[LocalStorageKeys["PendingSaleListPageNo"] = 10] = "PendingSaleListPageNo";
        LocalStorageKeys[LocalStorageKeys["CreatedSaleListPageNo"] = 11] = "CreatedSaleListPageNo";
        LocalStorageKeys[LocalStorageKeys["ReadyToDepartureSaleListPageNo"] = 12] = "ReadyToDepartureSaleListPageNo";
        LocalStorageKeys[LocalStorageKeys["OnTheWaySaleListPageNo"] = 13] = "OnTheWaySaleListPageNo";
        LocalStorageKeys[LocalStorageKeys["DeliveredSaleListPageNo"] = 14] = "DeliveredSaleListPageNo";
        LocalStorageKeys[LocalStorageKeys["CompletedSaleListPageNo"] = 15] = "CompletedSaleListPageNo";
        LocalStorageKeys[LocalStorageKeys["ProductGroupListPageNo"] = 16] = "ProductGroupListPageNo";
        LocalStorageKeys[LocalStorageKeys["ProductCategoryListPageNo"] = 17] = "ProductCategoryListPageNo";
        LocalStorageKeys[LocalStorageKeys["ProductDetailsListPageNo"] = 18] = "ProductDetailsListPageNo";
        LocalStorageKeys[LocalStorageKeys["OrderState"] = 19] = "OrderState";
        LocalStorageKeys[LocalStorageKeys["DueOrderState"] = 20] = "DueOrderState";
        LocalStorageKeys[LocalStorageKeys["SaleListGridKeys"] = 21] = "SaleListGridKeys";
        LocalStorageKeys[LocalStorageKeys["SearchKeyword"] = 22] = "SearchKeyword";
        LocalStorageKeys[LocalStorageKeys["OrderByKeyword"] = 23] = "OrderByKeyword";
        LocalStorageKeys[LocalStorageKeys["IsAscendingValue"] = 24] = "IsAscendingValue";
        LocalStorageKeys[LocalStorageKeys["IsTaggedSale"] = 25] = "IsTaggedSale";
        LocalStorageKeys[LocalStorageKeys["SaleTag"] = 26] = "SaleTag";
        LocalStorageKeys[LocalStorageKeys["SaleFrom"] = 27] = "SaleFrom";
        LocalStorageKeys[LocalStorageKeys["SearchDate"] = 28] = "SearchDate";
        LocalStorageKeys[LocalStorageKeys["IsOnlyDues"] = 29] = "IsOnlyDues";
        LocalStorageKeys[LocalStorageKeys["startDate"] = 30] = "startDate";
        LocalStorageKeys[LocalStorageKeys["endDate"] = 31] = "endDate";
        LocalStorageKeys[LocalStorageKeys["WarehouseId"] = 32] = "WarehouseId";
        LocalStorageKeys[LocalStorageKeys["CustomerName"] = 33] = "CustomerName";
    })(LocalStorageKeys = App.LocalStorageKeys || (App.LocalStorageKeys = {}));
    var StorageType;
    (function (StorageType) {
        StorageType[StorageType["localStorage"] = 0] = "localStorage";
        StorageType[StorageType["sessionStorage"] = 1] = "sessionStorage";
    })(StorageType = App.StorageType || (App.StorageType = {}));
})(App || (App = {}));
