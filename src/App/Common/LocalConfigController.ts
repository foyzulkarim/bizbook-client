
module App {


    export class LocalConfigController implements angular.IController {

        $onInit(): void { console.log('on init LocalConfigController'); }

        static $inject = ["LocalStorageService"];

        showOrderNumberAfterSave: boolean;
        addToCartIfResultIsOne: boolean;
        deliveryChargeAmount: number;
        receiptName: string;
        chalanName: string;
        defaultWarehouse: string;
        dealerPriceChange:string;
        storageService: LocalStorageService;

        constructor(storageService: LocalStorageService) {
            console.log('I am in storage Controller');
            this.storageService = storageService;
            this.showOrderNumberAfterSave = this.storageService.get(LocalStorageKeys.ShowOrderNumberAfterSave);
            this.addToCartIfResultIsOne = this.storageService.get(LocalStorageKeys.AddToCartIfResultIsOne);
            this.deliveryChargeAmount = this.storageService.get(LocalStorageKeys.DeliveryChargeAmount);
            this.receiptName = this.storageService.get2(LocalStorageKeys.ReceiptName);
            this.chalanName = this.storageService.get2(LocalStorageKeys.ChalanName);
            this.defaultWarehouse = this.storageService.get2(LocalStorageKeys.DefaultWarehouse);
            this.dealerPriceChange = this.storageService.get2(LocalStorageKeys.DealerPriceChange);
        }

        valueChanged(key: LocalStorageKeys, value: any): void {
            console.log(key, value);
            this.storageService.save2(key, value);
        }
    }

    angular.module('app').controller('LocalConfigController', LocalConfigController);
}
