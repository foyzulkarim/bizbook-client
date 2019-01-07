module App {

    export class LocalStorageService {
        //storage: Storage;
        private localStorageService: angular.local.storage.ILocalStorageService;

        static $inject = ["localStorageService"];

        constructor(localStorageService: angular.local.storage.ILocalStorageService) {
            this.localStorageService = localStorageService;
        }

        private getStorageKey(key: LocalStorageKeys): string {
            let storageKey = LocalStorageKeys[key].toString();
            return storageKey;
        }


        //save(key: LocalStorageKeys, value: any): void {
        //    let type: StorageType = StorageType.localStorage;
        //    let storageType = this.localStorageService.getStorageType();
        //    if (storageType != null) {
        //        type = storageType === 'localStorage' ? StorageType.localStorage : StorageType.sessionStorage;
        //    }
        //    this.save(key, value, type);
        //}

        save(key: LocalStorageKeys, value: any, type?: StorageType): void {
            let storageKey = this.getStorageKey(key);
            let storageValue = JSON.stringify(value);
            let storageType = this.localStorageService.getStorageType();
            if (type != null) {
                storageType = type === StorageType.localStorage ? 'localStorage' : 'sessionStorage';
            }
            let service: any = this.localStorageService;
            service.set(storageKey, storageValue, storageType);
        }

        save2(key: LocalStorageKeys, value: any, type?: StorageType): void {
            let storageKey = this.getStorageKey(key);
            let storageType = this.localStorageService.getStorageType();
            if (type != null) {
                storageType = type === StorageType.localStorage ? 'localStorage' : 'sessionStorage';
            }
            let service: any = this.localStorageService;
            service.set(storageKey, value, storageType);
        }

        get(key: LocalStorageKeys): any {
            let storageKey = this.getStorageKey(key);
            let strItem = this.localStorageService.get<string>(storageKey);
            let item = JSON.parse(strItem);
            return item;
        }

        get2(key: LocalStorageKeys): any {
            let storageKey = this.getStorageKey(key);
            let strItem = this.localStorageService.get<string>(storageKey);
            return strItem;
        }

        remove(key: LocalStorageKeys): void {
            let storageKey = this.getStorageKey(key);
            this.localStorageService.remove(storageKey);
        }

    }

    angular.module('app').service('LocalStorageService', LocalStorageService);

    export enum LocalStorageKeys {
        ShowOrderNumberAfterSave, //0
        AddToCartIfResultIsOne, // 1
        DeliveryChargeAmount, // 2
        ReceiptName,//3
        ChalanName,
        CustomerListPageNo,
        DefaultWarehouse,
        DealerPriceChange,
        SaleListPageNo,
        DueSaleListPageNo,
        PendingSaleListPageNo,
        CreatedSaleListPageNo,
        ReadyToDepartureSaleListPageNo,
        OnTheWaySaleListPageNo,
        DeliveredSaleListPageNo,
        CompletedSaleListPageNo,
        ProductGroupListPageNo,
        ProductCategoryListPageNo,
        ProductDetailsListPageNo,
        OrderState,
        DueOrderState,
        SaleListGridKeys,
        SearchKeyword,
        OrderByKeyword,
        IsAscendingValue,
        IsTaggedSale,
        SaleTag,
        SaleFrom,
        SearchDate,
        IsOnlyDues,
        startDate,
        endDate,
        WarehouseId,
        CustomerName
    }

    export enum StorageType {
        localStorage,
        sessionStorage
    }
}



