module App {
    "use strict";
    declare var angular: any;

    export class WarehouseController extends BaseController<Warehouse>{
        static $inject: string[] =
            [
                "$location", "$state", "$stateParams",
                "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
            ];
        selectedRow: number;
        constructor(
            location: angular.ILocationService,
            state: angular.ui.IStateService,
            stateParams: angular.ui.IStateParamsService,
            url: UrlService,
            search: SearchService,
            save: SaveService,
            authService: AuthService,
            excel: any

        ) {
            super(location, state, stateParams, url, search, save, authService, url.warehouse, url.warehouseQuery, excel);
            this.selectedRow = null;
            this.isUpdateMode = false;
            if (this.stateParams["id"]) {
                this.isUpdateMode = true;
                this.edit(this.stateParams["id"]);
            }
        }
    }
    angular.module("app").controller("WarehouseController", WarehouseController);

    export class WarehousesController extends BaseController<Warehouse>{
        static $inject: string[] =
            [
                "$location", "$state", "$stateParams",
                "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
            ];
        constructor(
            location: angular.ILocationService,
            state: angular.ui.IStateService,
            stateParams: angular.ui.IStateParamsService,
            url: UrlService,
            search: SearchService,
            save: SaveService,
            authService: AuthService,
            excel: any
        ) {
            super(location, state, stateParams, url, search, save, authService, url.warehouse, url.warehouseQuery, excel);
            if (this.stateParams["myId"]) {
                this.searchRequest["warehouseId"] = this.user.warehouseId;
            }
            this.search();
        }
    }
    angular.module("app").controller("WarehousesController", WarehousesController);


    export class WarehouseHistoryController extends BaseController<Warehouse>{
        warehouseViewModel: WarehousehistoryViewModel;

        static $inject: string[] =
            [
                "$location", "$state", "$stateParams",
                "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
            ];

        selectedRow: number;

        constructor(
            location: angular.ILocationService,
            $state: angular.ui.IStateService,
            $stateParams: angular.ui.IStateParamsService,
            url: UrlService,
            searchService: SearchService,
            saveService: SaveService,
            auth: AuthService,
            excel: any
        ) {
            super(location, $state, $stateParams, url, searchService, saveService, auth, url.warehouse, url.warehouseQuery, excel);
            if (this.stateParams["id"]) {
                this.loadWarehouseHistory();
            } else {
                this.back();
            }
        }


        loadWarehouseHistory(): void {
            var self = this;
            var successCallback = (response: SearchResponse): void => {
                console.log(response);
                //self.warehouseViewModel = response.data["result"];
                self.models = response.data;

            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            var searchRequest = new SearchRequest();
            searchRequest.parentId = this.stateParams["id"];
            //            searchRequest.page = 1;
            self.searchService
                .search(searchRequest, self.url.warehouseQuery + "/History")
                .then(<any>successCallback, errorCallback);
        }
    }
    angular.module("app").controller("WarehouseHistoryController", WarehouseHistoryController);

    export class WarehouseProductHistoryController extends BaseController<WarehouseProductHistory>{
        static $inject: string[] =
            [
                "$http", "$location", "$state", "$stateParams",
                "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
            ];
        constructor(
            http: ng.IHttpService,
            location: angular.ILocationService,
            state: angular.ui.IStateService,
            stateParams: angular.ui.IStateParamsService,
            url: UrlService,
            search: SearchService,
            save: SaveService,
            authService: AuthService,
            excel: any) {
            super(location, state, stateParams, url, search, save, authService, url.warehouse, url.warehouseQuery, excel);
            this.http = http;

            this.getWarehouseHistory();
        }

        http: ng.IHttpService

        models: WarehouseProductHistory[];
        isProductActive: boolean = true;

        getWarehouseHistory() {
            var self = this;
            var data = {
                warehouseId : self.stateParams['warehouseId'],
                isProductActive : self.isProductActive
            };

            self.http.post(self.url.warehouseQuery + '/ProductHistory',data).then((res) => {
                self.models = res['data'] as WarehouseProductHistory[];
            })
        }
    }

    angular.module("app").controller("WarehouseProductHistoryController", WarehouseProductHistoryController);

    export class StockTransferController extends BaseController<StockTransfer>{

        static $inject: string[] =
            [
                "$scope", "$filter", "$location", "$state", "$stateParams", "UrlService", "SearchService",
                "SaveService", "AuthService", 'Excel'
            ];
        estimatedDeliveyDate: Date;
        selectedRow: number;
        requiredDeliveryDateByCustomer: Date;
        constructor(
            scope: angular.IScope,
            filter: angular.IFilterService,
            location: angular.ILocationService,
            state: angular.ui.IStateService,
            stateParams: angular.ui.IStateParamsService,
            url: UrlService,
            search: SearchService,
            save: SaveService,
            authService: AuthService,
            excel: any
        ) {
            super(location, state, stateParams, url, search, save, authService, url.stocktransfer, url.stocktransferQuery, excel);

            this.estimatedDeliveyDate = new Date();
            this.estimatedDeliveyDate.setDate(this.estimatedDeliveyDate.getDate());
            var self = this;
            scope.$watch('vm.estimatedDeliveyDate', function (newValue) {
                let dateValue = filter('date')((newValue) as any, 'dd-MMMM-yyyy');
                self.model.estimatedDeliveryDate = dateValue;
                console.log(dateValue);
            });
        }
        productDetailsCount: number;
        productDetails: ProductDetail[];
        productDetail: ProductDetail;
        productDetailSearchRequest: SearchRequest;
        stockTransferDetail: StockTransferDetailViewModel;
        destinationWarehouses: Warehouse[];


        activate() {
            this.searchRequest = new SearchRequest("", "Modified", "False", "");
            this.productDetailSearchRequest = new SearchRequest("", "Modified", "False", "");
            this.model = new StockTransferViewModel();
            this.model.orderNumber = "ST-" + this.generateOrderNumber();
            this.stockTransferDetail = new StockTransferDetailViewModel();
            this.selectedRow = null;
            this.models = [];
            this.isUpdateMode = false;
            this.totalCount = 0;
            let self = this;
            this.loadWarehouses().then(warehouses => {
                self.model.sourceWarehouseId = warehouses[0].id;
                self.loadOtherWarehouses();
            });
            this.loadProductDetails();
        }

        loadProductDetails(): void {
            var self = this;
            if (self.productDetailSearchRequest.keyword.length < 3) {
                return;
            }
            var successCallback = (response: SearchResponse): void => {
                console.log('products ', response);
                self.productDetails = <any>response.Models;
                self.productDetailsCount = response.Count;
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };

            self.productDetailSearchRequest["isProductActive"] = true;
            self.productDetailSearchRequest.warehouseId = self.model.sourceWarehouseId;

            self.searchService
                .search(self.productDetailSearchRequest, self.url.productDetailQuery + "/SearchByWarehouse")
                .then(<any>successCallback, errorCallback);
        }

        getPriceAndName(): void {
            this.stockTransferDetail.priceTotal = this.stockTransferDetail.quantity * this.stockTransferDetail.salePricePerUnit;
        }

        decreaseFromCart(index): void {

            let quantity = this.model.stockTransferDetails[index].quantity - 1;
            if (quantity === 0) {
                this.removeFromCart(index);
            } else {
                let salePrice = this.model.stockTransferDetails[index].salePricePerUnit;
                this.model.stockTransferDetails[index].quantity = quantity;
                this.model.stockTransferDetails[index].priceTotal = salePrice * quantity;
            }

            this.updateCartTotal();
        }
        removeFromCart(index): void {
            this.model.stockTransferDetails.splice(index, 1);
            this.updateCartTotal();
        }

        increaseToCart(index): void {
            let quantity = this.model.stockTransferDetails[index].quantity + 1;
            let salePrice = this.model.stockTransferDetails[index].salePricePerUnit;
            this.model.stockTransferDetails[index].quantity = quantity;
            this.model.stockTransferDetails[index].priceTotal = salePrice * quantity;

            this.updateCartTotal();
        }
        private updateCartTotal(): void {
            var self = this;
            self.model.productAmount = 0;
            self.model.stockTransferDetails.forEach(p => this.model.productAmount += p.priceTotal);
            self.model.totalAmount = self.model.productAmount;
        }

        addToCart2(detail: ProductDetail): void {
            this.setProductDetail(detail);
            this.addToCart();
        }

        setProductDetail(detail: ProductDetail): void {
            this.stockTransferDetail.salePricePerUnit = detail.salePrice;
            this.stockTransferDetail.productDetailId = detail.id;
            this.stockTransferDetail.productDetailName = detail.name;
            this.stockTransferDetail.productDetail = detail;
            this.stockTransferDetail.quantity = 1;
            this.getPriceAndName();
        }

        addToCart(): void {
            this.model.stockTransferDetails.push(this.stockTransferDetail);
            this.updateCartTotal();
            this.stockTransferDetail = new StockTransferDetailViewModel();
        }

        editCart(p): void {
            this.stockTransferDetail = p;
            this.removeByAttr(this.model.stockTransferDetails, 'productDetailId', p.productDetailId);
        }

        removeByAttr(arr, attr, value): any {
            var i = arr.length;
            while (i--) {
                if (arr[i]
                    && arr[i].hasOwnProperty(attr)
                    && (arguments.length > 2 && arr[i][attr] === value)) {

                    arr.splice(i, 1);

                }
            }
            return arr;
        }

        updateQuantityAll(): void {
            for (let i = 0; i < this.model.stockTransferDetails.length; i++) {
                this.updateQuantity(i);
            }
        }

        updateQuantity(index): void {
            let salePrice = this.model.stockTransferDetails[index].salePricePerUnit;
            let quantity = this.model.stockTransferDetails[index].quantity;
            this.model.stockTransferDetails[index].quantity = quantity;
            this.model.stockTransferDetails[index].priceTotal = salePrice * quantity;
            this.updateCartTotal();
        }

        save(): void {
            var self = this;
            var successCallback = (response: BaseResponse): void => {
                self.activate();
            };
            var errorCallback = (error: any): void => {
                console.log(error);
                alert("Error occurred during save. Check your data or please contact with administrator.");
            };

            if (self.model.destinationWarehouseId == null || self.model.destinationWarehouseId == "") {
                alert('Destination warehouse can not be empty');
                return;
            }

            for (var i = 0; i < self.model.stockTransferDetails.length; i++) {
                self.model.stockTransferDetails[i].productDetail = null;
                self.model.stockTransferDetails[i].created = new Date().toDateString();
                self.model.stockTransferDetails[i].modified = new Date().toDateString();
                self.model.stockTransferDetails[i].createdBy = self.authService.accountInfo.userName;
                self.model.stockTransferDetails[i].createdFrom = "Browser";
                self.model.stockTransferDetails[i].modifiedBy = self.authService.accountInfo.userName;
                self.model.stockTransferDetails[i].id = "1";
                self.model.stockTransferDetails[i].shopId = self.model.stockTransferDetails[i].shopId != null ? self.model.stockTransferDetails[i].shopId : "1";
            }

            self.saveService.save(self.model, self.commandUrl + "/Add").then(<any>successCallback, errorCallback);
        }

        loadOtherWarehouses(): any {
            var self = this;
            var successCallback = (response: any): any[] => {
                self.destinationWarehouses = response.Models;
                if (self.destinationWarehouses.length > 0) {
                    let warehouseId = self.user.warehouseId;
                    if (warehouseId && self.user.role.indexOf("Warehouse") !== -1) {
                        self.destinationWarehouses = self.destinationWarehouses.filter(x => { return x.id !== warehouseId });
                    }
                }

                return self.destinationWarehouses;
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            }

            let reqeust = new SearchRequest();
            return self.searchService
                .search(reqeust, self.url.warehouseQuery + "/Dropdown")
                .then(<any>successCallback, errorCallback);
        }
    }
    angular.module("app").controller("StockTransferController", StockTransferController);

    export class StockTransfersController extends BaseController<StockTransfer>{
        static $inject: string[] =
            [
                "$scope", "$filter", "$location", "$state", "$stateParams", "UrlService", "SearchService",
                "SaveService", "AuthService", 'Excel'
            ];
        constructor(
            scope: angular.IScope,
            filter: angular.IFilterService,
            location: angular.ILocationService,
            state: angular.ui.IStateService,
            stateParams: angular.ui.IStateParamsService,
            url: UrlService,
            search: SearchService,
            save: SaveService,
            authService: AuthService,
            excel: any
        ) {
            super(location, state, stateParams, url, search, save, authService, url.stocktransfer, url.stocktransferQuery, excel);
            this.searchRequest.isIncludeParents = true;
            this.search();
        }
    }
    angular.module("app").controller("StockTransfersController", StockTransfersController);

    export class StockTransferDetailController extends BaseController<StockTransfer> {
        static $inject: string[] =
            [
                "$location", "$state", "$stateParams",
                "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'

            ];

        constructor(
            location: angular.ILocationService,
            state: angular.ui.IStateService,
            stateParams: angular.ui.IStateParamsService,
            url: UrlService,
            search: SearchService,
            save: SaveService,
            authService: AuthService,
            excel: any
        ) {
            super(location, state, stateParams, url, search, save, authService, url.stocktransfer, url.stocktransferQuery, excel);
            console.log('StockTransferDetailController');
            if (this.stateParams["id"]) {
                this.loadDetail();
            } else {
                this.back();
            }
        }


        loadDetail(): void {
            console.log(this.stateParams);
            var self = this;
            var successCallback = (response: SearchResponse): void => {
                self.model = response.data;
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            var searchRequest = new SearchRequest();
            searchRequest.id = this.stateParams["id"];
            searchRequest.page = -1;

            var id = this.stateParams["id"];

            var httpUrl = self.url.stocktransferQuery + "/SearchDetail?id=" + id;

            self.searchService
                .search(searchRequest, httpUrl)
                .then(<any>successCallback, errorCallback);
        }
    }

    angular.module('app').controller("StockTransferDetailController", StockTransferDetailController);



    export class DamageController extends BaseController<Damage> {

        static $inject: string[] =
            [
                "$location", "$state", "$stateParams",
                "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'

            ];
        selectedRow: number;
        constructor(
            location: angular.ILocationService,
            state: angular.ui.IStateService,
            stateParams: angular.ui.IStateParamsService,
            url: UrlService,
            search: SearchService,
            save: SaveService,
            authService: AuthService,
            excel: any

        ) {
            super(location, state, stateParams, url, search, save, authService, url.damage, url.damageQuery, excel);

            this.loadProductDetails();
            this.selectedRow = null;
            this.isUpdateMode = false;
            this.loadWarehouses().then(warehouses => {
                this.model.warehouseId = warehouses[0].id;
            });

            if (this.stateParams["id"]) {
                this.isUpdateMode = true;
                this.edit2(this.stateParams["id"]);
            }

        }

        productDteails: ProductDetail[];

        loadProductDetails(): void {
            var self = this;
            var successCallback = (response: any): void => {
                console.log(response);
                self.productDteails = response.Models;

            };

            var errorCallback = (error: any): void => {
                console.log(error);
            }
            self.searchService
                .search(self.searchRequest, self.url.productDetailQuery + "/Dropdown")
                .then(<any>successCallback, errorCallback);
        }
        groupChanged(): void {
            console.log(this.model.productDetailId);
        }
    }

    angular.module("app").controller("DamageController", DamageController);
    export class DamagesController extends BaseController<Damage> {

        static $inject: string[] =
            [
                "$location", "$state", "$stateParams",
                "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'

            ];
        selectedRow: number;
        constructor(
            location: angular.ILocationService,
            state: angular.ui.IStateService,
            stateParams: angular.ui.IStateParamsService,
            url: UrlService,
            search: SearchService,
            save: SaveService,
            authService: AuthService,
            excel: any

        ) {
            super(location, state, stateParams, url, search, save, authService, url.damage, url.damageQuery, excel);
            this.loadProductDetails();
            this.selectedRow = null;
            this.isUpdateMode = false;
            this.loadWarehouses().then(warehouses => {
                this.model.warehouseId = warehouses[0].id;
            });

            this.searchRequest.isIncludeParents = true;
            this.search();
        }
        productDteails: ProductDetail[];
        loadProductDetails(): void {
            var self = this;
            var successCallback = (response: any): void => {
                console.log(response);
                self.productDteails = response.Models;

            };

            var errorCallback = (error: any): void => {
                console.log(error);
            }
            self.searchService
                .search(self.searchRequest, self.url.productDetailQuery + "/Dropdown")
                .then(<any>successCallback, errorCallback);
        }

    }

    angular.module("app").controller("DamagesController", DamagesController);

    export class StockTransferReturnController extends BaseController<StockTransferViewModel> {

        transaction: Transaction;
        stockTransferDetail: StockTransferDetailViewModel;
        productDetailSearchRequest: SearchRequest;
        productDetailsCount: number;
        productDetails: ProductDetail[];
        destinationWarehouses: Warehouse[];
        selectedRow: number;

        due: number;
        static $inject: string[] = [

            "$location", "$state", "$stateParams", "UrlService", "SearchService",
            "SaveService", "AuthService", 'Excel'
        ];


        constructor(
            location: angular.ILocationService,
            state: angular.ui.IStateService,
            stateParams: angular.ui.IStateParamsService,
            url: UrlService,
            search: SearchService,
            save: SaveService,
            authService: AuthService,
            localStorageService: LocalStorageService,
            excel: any
        ) {
            super(location, state, stateParams, url, search, save, authService, url.stocktransfer, url.stocktransferQuery, excel);

            let self = this;

            self.localStorageService = localStorageService;
            this.loadWarehouses().then(warehouses => {
                self.model.sourceWarehouseId = warehouses[0].id;
                self.loadOtherWarehouses();
            });

            if (this.stateParams["id"]) {
                this.stockTransferDetail = new StockTransferDetailViewModel();
                this.productDetailSearchRequest = new SearchRequest();
                this.loadDetail();
                this.loadProductDetails();
            }
            else {
                this.back();
            }

            var acc = this.authService.accountInfo;
            self.isApproveProduct = false;

            if (acc.role == 'ShopAdmin' || acc.role =='WarehouseAdmin') {
                self.isApproveProduct = true;
                console.log(acc.role);
            }
        }
       
        loadDetail(): void {
            console.log(this.stateParams);
            var self = this;
            var successCallback = (response: SearchResponse): void => {
                self.model = response.data;
                console.log(self.model);
                
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            var searchRequest = new SearchRequest();
            searchRequest.id = this.stateParams["id"];
            searchRequest.page = -1;

            var id = this.stateParams["id"];

            var httpUrl = self.url.stocktransferQuery + "/SearchDetail?id=" + id;

            self.searchService
                .search(searchRequest, httpUrl)
                .then(<any>successCallback, errorCallback);
        }

        loadProductDetails(): void {
            var self = this;
            if (self.productDetailSearchRequest.keyword.length < 3) {
                return;
            }
            var successCallback = (response: SearchResponse): void => {
                console.log('products ', response);
                self.productDetails = <any>response.Models;
                self.productDetailsCount = response.Count;
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };

            self.productDetailSearchRequest["isProductActive"] = true;
            self.productDetailSearchRequest.warehouseId = self.model.sourceWarehouseId;

            self.searchService
                .search(self.productDetailSearchRequest, self.url.productDetailQuery + "/SearchByWarehouse")
                .then(<any>successCallback, errorCallback);
        }

        getPriceAndName(): void {
            this.stockTransferDetail.priceTotal = this.stockTransferDetail.quantity * this.stockTransferDetail.salePricePerUnit;
        }

        decreaseFromCart(index): void {

            let quantity = this.model.stockTransferDetails[index].quantity - 1;
            if (quantity === 0) {
                this.removeFromCart(index);
            } else {
                let salePrice = this.model.stockTransferDetails[index].salePricePerUnit;
                this.model.stockTransferDetails[index].quantity = quantity;
                this.model.stockTransferDetails[index].priceTotal = salePrice * quantity;
            }

            this.updateCartTotal();
        }

        removeFromCart(index): void {
            this.model.stockTransferDetails.splice(index, 1);
            this.updateCartTotal();
        }

        increaseToCart(index): void {
            let quantity = this.model.stockTransferDetails[index].quantity + 1;
            let salePrice = this.model.stockTransferDetails[index].salePricePerUnit;
            this.model.stockTransferDetails[index].quantity = quantity;
            this.model.stockTransferDetails[index].priceTotal = salePrice * quantity;

            this.updateCartTotal();
        }

        removeByAttr(arr, attr, value): any {
            var i = arr.length;
            while (i--) {
                if (arr[i]
                    && arr[i].hasOwnProperty(attr)
                    && (arguments.length > 2 && arr[i][attr] === value)) {

                    arr.splice(i, 1);

                }
            }
            return arr;
        }

        addToCart(): void {

            this.model.stockTransferDetails.push(this.stockTransferDetail);
            console.log('stockTransferDetails result--', this.model.stockTransferDetails);
            this.updateCartTotal();
            this.stockTransferDetail = new StockTransferDetailViewModel();
        }

        addToCart2(detail: ProductDetail): void {
            this.setProductDetail(detail);
            this.addToCart();
        }

        editCart(p): void {
            this.stockTransferDetail = p;
            this.removeByAttr(this.model.stockTransferDetails, 'productDetailId', p.productDetailId);
        }

        updateCartTotal(): void {
            var self = this;
            self.model.productAmount = 0;
            self.model.stockTransferDetails.forEach(p => this.model.productAmount += p.priceTotal);
            self.model.totalAmount = self.model.productAmount;
        }

        setProductDetail(detail: ProductDetail): void {
            this.stockTransferDetail.salePricePerUnit = detail.salePrice;
            this.stockTransferDetail.productDetailId = detail.id;
            this.stockTransferDetail.productDetailName = detail.name;
            this.stockTransferDetail.productDetail = detail;
            this.stockTransferDetail.quantity = 1;
            this.getPriceAndName();
        }

        updateQuantityAll(): void {
            for (let i = 0; i < this.model.stockTransferDetails.length; i++) {
                this.updateQuantity(i);
            }
        }

        updateQuantity(index): void {
            let salePrice = this.model.stockTransferDetails[index].salePricePerUnit;
            let quantity = this.model.stockTransferDetails[index].quantity;
            this.model.stockTransferDetails[index].quantity = quantity;
            this.model.stockTransferDetails[index].priceTotal = salePrice * quantity;
            this.updateCartTotal();
        }

        save(): void {
            var self = this;
            var successCallback = (response: BaseResponse): void => {
                self.back();
            };
            var errorCallback = (error: any): void => {
                console.log(error);
                alert("Error occurred during save. Check your data or please contact with administrator.");
            };

            for (var i = 0; i < self.model.stockTransferDetails.length; i++) {
                self.model.stockTransferDetails[i].productDetail = null;
               // self.model.stockTransferDetails[i].created = new Date().toDateString();
                self.model.stockTransferDetails[i].modified = new Date().toDateString();
                self.model.stockTransferDetails[i].createdBy = self.authService.accountInfo.userName;
                self.model.stockTransferDetails[i].createdFrom = "Browser";
                self.model.stockTransferDetails[i].modifiedBy = self.authService.accountInfo.userName;
                self.model.stockTransferDetails[i].destinationWarehouseId = self.model.destinationWarehouseId;
                self.model.stockTransferDetails[i].sourceWarehouseId = self.model.sourceWarehouseId;
                if (self.model.stockTransferDetails[i].id==null) {
                    self.model.stockTransferDetails[i].id = "1";
                }
                
                self.model.stockTransferDetails[i].shopId = self.model.stockTransferDetails[i].shopId != null ? self.model.stockTransferDetails[i].shopId : "1";
            }
            
           
            self.saveService.update(self.model, self.commandUrl + "/Edit").then(<any>successCallback, errorCallback);
        }

        loadOtherWarehouses(): any {
            var self = this;
            var successCallback = (response: any): any[] => {
                self.destinationWarehouses = response.Models;
                if (self.destinationWarehouses.length > 0) {
                    let warehouseId = self.user.warehouseId;
                    if (warehouseId && self.user.role.indexOf("Warehouse") !== -1) {
                        self.destinationWarehouses = self.destinationWarehouses.filter(x => { return x.id !== warehouseId });
                    }
                }

                return self.destinationWarehouses;
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            }

            let reqeust = new SearchRequest();
            return self.searchService
                .search(reqeust, self.url.warehouseQuery + "/Dropdown")
                .then(<any>successCallback, errorCallback);
        }

        updateState(){
            var self = this; 
            var successCallback = function (params:any) {
                self.back();
            }

            var errorCallback = function(error: any){
                console.log(error);
            }

            self.saveService.update(self.model, self.commandUrl + "/UpdateState").then(<any>successCallback, errorCallback);
        }
    }

    angular.module('app').controller("StockTransferReturnController", StockTransferReturnController);

}