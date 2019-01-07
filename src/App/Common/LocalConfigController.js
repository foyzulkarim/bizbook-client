var App;
(function (App) {
    var LocalConfigController = /** @class */ (function () {
        function LocalConfigController(storageService) {
            console.log('I am in storage Controller');
            this.storageService = storageService;
            this.showOrderNumberAfterSave = this.storageService.get(App.LocalStorageKeys.ShowOrderNumberAfterSave);
            this.addToCartIfResultIsOne = this.storageService.get(App.LocalStorageKeys.AddToCartIfResultIsOne);
            this.deliveryChargeAmount = this.storageService.get(App.LocalStorageKeys.DeliveryChargeAmount);
            this.receiptName = this.storageService.get2(App.LocalStorageKeys.ReceiptName);
            this.chalanName = this.storageService.get2(App.LocalStorageKeys.ChalanName);
            this.defaultWarehouse = this.storageService.get2(App.LocalStorageKeys.DefaultWarehouse);
            this.dealerPriceChange = this.storageService.get2(App.LocalStorageKeys.DealerPriceChange);
        }
        LocalConfigController.prototype.$onInit = function () { console.log('on init LocalConfigController'); };
        LocalConfigController.prototype.valueChanged = function (key, value) {
            console.log(key, value);
            this.storageService.save2(key, value);
        };
        LocalConfigController.$inject = ["LocalStorageService"];
        return LocalConfigController;
    }());
    App.LocalConfigController = LocalConfigController;
    angular.module('app').controller('LocalConfigController', LocalConfigController);
})(App || (App = {}));
