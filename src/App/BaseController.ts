module App {

    declare var angular: any;

    export class Display {
        static log(m: any, params?: any[]): void {
            if (params) {
                console.log(m, params);
            } else {
                console.log(m);
            }
        }
    }

    export class Dictionary {
        items: KeyValuePair[];

        constructor() {
            this.items = [];
        }

        set(k: any, v: any): void {
            this.items[k] = v;
            Display.log(this.items);
        }

        get(k: any): any {
            let item = this.items[k];
            return item;
        }
    }

    export class KeyValuePair {
        key: any;
        value: any;
    }

    export class Guid {
        public static newGuid() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
                c => {
                    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
        }

        public static defaultGuid() {
            return '00000000-0000-0000-0000-000000000000';
        }
    }

    export class BaseController<T extends Entity> implements angular.IController {

        // my services
        searchService: SearchService;
        saveService: SaveService;
        authService: AuthService;
        url: UrlService;
        localStorageService: LocalStorageService;

        dropdown: Object;
        subUrlPath: string;

        // my variables
        searchRequest: SearchRequest;
        isUpdateMode: boolean;
        isApproveProduct: boolean;
        user: UserInfo;

        // angular ui params
        stateService: angular.ui.IStateService;
        stateParams: angular.ui.IStateParamsService;
        location: angular.ILocationService;

        // generic variables
        commandUrl: string;
        queryUrl: string;
        models: T[];
        csvModels: any[];
        headers: string[] = ["id", "modified"];
        keys: KeyValuePair[] = [];
        totalCount: number;
        model: T;
        Excel: any;
        //seletedDeliverymans: any[];

        showManageColumnsButton: boolean;

        orderStates: string[] = [];

        showChart: boolean = false;

        $onInit(): void { }

        constructor(
            $location: angular.ILocationService,
            $state: angular.ui.IStateService,
            $stateParams: angular.ui.IStateParamsService,
            url: UrlService,
            search: SearchService,
            save: SaveService,
            authService: AuthService,
            commandUrl: string,
            queryUrl: string,
            excel: any
        ) {
            this.location = $location;
            this.url = url;
            this.subUrlPath = url.clientSubFolder;
            this.commandUrl = commandUrl;
            this.queryUrl = queryUrl;
            this.searchService = search;
            this.saveService = save;
            this.authService = authService;
            this.stateService = $state;
            this.Excel = excel;
            this.stateParams = $stateParams;
            var acc = this.authService.accountInfo;
            this.dropdown = {};
            if (acc && acc.isAuth) {
                this.loadUser();
            }

            this.orderStates = [
                "All", "Pending", "Created", "ReadyToDeparture", "OnTheWay", "Delivered", "Completed", "Cancel"
            ];

            // this.startDate = new Date();
            this.startDatePopUp = false;

            //  this.endDate = new Date();
            this.endDatePopUp = false;

            this.activate();

        }

        newGuid(): string {
            return Guid.newGuid();
        }

        loadUser(): void {
            var self = this;
            self.user = this.authService.accountInfo;
        }


        goto(page: number): void {
            this.searchRequest.page = page;
            this.search();
        }

        createInstance<Entity>(c: new () => Entity): Entity {
            return new c();
        }

        activate() {
            this.model = this.createInstance(Entity) as T;
            this.model.id = "";
            this.models = [];
            this.isUpdateMode = false;
            this.totalCount = 0;
            this.searchRequest = new SearchRequest("", "Modified", "False", "");
            this.searchRequest.page = 1;
            this.startDate = new Date();
            this.endDate = new Date();

            //this.search();
        }

        loadData(): void {
            var self = this;
            if (self.startDate != null) {
                self.searchRequest.startDate = self.startDate.toDateString();
                self.localStorageService.save(LocalStorageKeys.startDate, self.startDate);
            }

            if (self.endDate != null) {
                self.searchRequest.endDate = self.endDate.toDateString();
                self.localStorageService.save(LocalStorageKeys.endDate, self.endDate);
            }

            this.search();

        }

        setStartDate(): void {
            let fromdate = this.localStorageService.get(LocalStorageKeys.startDate);

            if (!fromdate) {
                fromdate = new Date();
                this.localStorageService.save(LocalStorageKeys.startDate, fromdate);
            }
            else {
                fromdate = new Date(fromdate);
            }
            //let fd = this.searchRequest.startDate = fromdate
            this.searchRequest.startDate = fromdate.toDateString();
            this.startDate = fromdate;
            console.log('Save Start Date' + ' ' + fromdate);
        }

        setEndDate(): void {
            let todate = this.localStorageService.get(LocalStorageKeys.endDate);
            if (!todate) {
                todate = new Date();
                this.localStorageService.save(LocalStorageKeys.endDate, todate);
            }
            else {
                todate = new Date(todate);
            }

            this.searchRequest.endDate = todate.toDateString();
            this.endDate = todate;
            console.log('Save To Date' + ' ' + todate);
        }

        search(): void {
            var self = this;
            var successCallback = (response: SearchResponse): void => {
                console.log(response);
                self.totalCount = response.Count;
                self.models = <any>response.Models;
                if (self.models.length === 0) {
                    console.log('No search result found');
                    alert('No search result found');
                } else {
                    self.csvModels = [];
                    for (let i = 0; i < self.models.length; i++) {
                        self.csvModels.push(self.generateCsvModel(self.models[i]));
                    }
                }

                self.searchRequest.totalPage = Math.ceil(response.Count / 10);
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            self.searchService
                .search(self.searchRequest, self.queryUrl + "/Search")
                .then(<any>successCallback, errorCallback);
        }

        generateCsvModel(m: any): any {
            var self = this;
            let csvData = {};
            for (let j = 0; j < self.headers.length; j++) {
                let head = self.headers[j];
                csvData[head] = m[head];
            }

            return csvData;
        }

        generateCsvModels(): void {
            var self = this;
            self.headers = [];
            for (let k = 0; k < self.keys.length; k++) {
                if (self.keys[k].value === true) {
                    self.headers.push(self.keys[k].key);
                }
            }

            self.csvModels = [];
            for (let i = 0; i < self.models.length; i++) {
                self.csvModels.push(self.generateCsvModel(self.models[i]));
            }
        }

        ensureKeysAreSaved(lskValue: LocalStorageKeys, m: any): void {
            var self = this;
            self.keys = self.localStorageService.get(lskValue);
            if (self.keys == null) {
                let dictionary: KeyValuePair[] = [];
                let propertyNames = self.getPropertyNames(m);
                for (let j = 0; j < propertyNames.length; j++) {
                    let property = { key: propertyNames[j], value: true };
                    dictionary.push(property);
                }
                self.localStorageService.save(lskValue, dictionary);
                self.keys = self.localStorageService.get(lskValue);
            }
        }

        edit(id: string): void {
            var self = this;
            var onSuccess = (data: SearchResponse) => {
                self.model = data.data;
            }

            var onError = (error: any) => {
                console.log(error);
                alert('Error occurred');
            }
            var searchRequest = new SearchRequest();
            searchRequest.id = id;

            var url = self.queryUrl + '/Detail';
            if (id && id.length > 0) {
                url += '?id=' + id;
            }

            self.searchService.search(null, url).then(onSuccess, onError);
        }

        editWithCallBack(id: string, callBack: Function): void {
            var self = this;
            var onSuccess = (data: SearchResponse) => {
                self.model = data.data;
                callBack(self.model, self);
            }

            var onError = (error: any) => {
                console.log(error);
                alert('Error occurred');
            }
            var searchRequest = new SearchRequest();
            searchRequest.id = id;

            var url = self.queryUrl + '/Detail';
            if (id && id.length > 0) {
                url += '?id=' + id;
            }

            self.searchService.search(null, url).then(onSuccess, onError);
        }

        edit2(id: string): void {
            var self = this;
            var onSuccess = (data: SearchResponse) => {
                self.model = data.data;
            }

            var onError = (error: any) => {
                console.log(error);
                alert('Error occurred');
            }

            var searchRequest = new SearchRequest();
            searchRequest.id = id;

            var url = self.queryUrl + '/SearchDetail';
            self.searchService.search(searchRequest, url).then(onSuccess, onError);
        }

        save(): void {
            var self = this;

            if (self.isUpdateMode) self.update();

            else {
                var successCallback = (response: BaseResponse): void => {
                    self.activate();
                };
                var errorCallback = (error: any): void => {
                    console.log(error);
                    if (error.status === 500) {
                        alert(error.data.exceptionMessage);
                    }
                };

                self.saveService.save(self.model, self.commandUrl + "/Add").then(<any>successCallback, errorCallback);
            }
        }

        update(): void {
            var self = this;
            var successCallback = (response: BaseResponse): void => {
                self.activate();
                self.back();
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };

            self.saveService.update(self.model, self.commandUrl + "/Edit").then(<any>successCallback, errorCallback);
        }

        updateWithCallBack(m: T, fn: Function, e: Function): void {
            let self = this;
            var successCallback = (response: BaseResponse): void => {
                fn();
            };
            var errorCallback = (error: any): void => {
                console.log(error);
                e();
            };

            self.saveService.update(m, self.commandUrl + "/Edit").then(<any>successCallback, errorCallback);
        }

        update2(p: T): void {
            let self = this;
            let succsessCallBack = () => {
                p["message"] = "Updated Now";
            };

            let error = (e) => {
                alert(e);
            }

            self.updateWithCallBack(p, succsessCallBack, error);
        }

        delete(id: string): void {
            var self = this;
            var successCallback = (response: BaseResponse): void => {
                self.activate();
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            self.saveService.delete(id, self.commandUrl + "/Delete").then(successCallback, errorCallback);
        }


        loadDropdown(name: string, id: string = "") {
            var self = this;
            var successCallback = (response: SearchResponse): void => {
                self.dropdown[name] = response.Models;
                console.log(response.Models);
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            //if (id.length > 0) {
            //    self..load(name, id).then(<any>successCallback, errorCallback);
            //} else {
            //    self..load(name).then(<any>successCallback, errorCallback);
            //}
        }

        private pad(num: number, size: number): string {
            var s = num + "";
            while (s.length < size) s = "0" + s;
            return s;
        }

        generateOrderNumber(): string {
            var date = new Date();
            var orderNumber = this.pad(date.getMilliseconds(), 3) +
                '' +
                this.pad(date.getMinutes(), 2) +
                '-' +
                this.pad(date.getHours(), 2) +
                this.pad(date.getDate(), 2) +
                this.pad(date.getMonth() + 1, 2) +
                '-' +
                date.getFullYear();
            return orderNumber;
        }

        back(): void {
            window.history.back();
        }

        startDate: Date;
        startDatePopUp: boolean;
        hideStartDate: boolean;

        endDate: Date;
        endDatePopUp: boolean;
        hideEndDate: boolean;

        openStartDate(): void {
            this.startDatePopUp = true;
        }

        openEndDate(): void {
            this.endDatePopUp = true;
        }

        report(): void {
            var self = this;
            var url = self.queryUrl + "/Report";
            window.open(url, "_blank", "");
        }

        thanas: string[] = ["All", "Dhaka Cantt.", "Dhanmondi", "Gulshan", "Jatrabari",
            "Keraniganj", "Khilgaon", "Lalbag", "Mirpur", "Mohammadpur", "Motijheel", "Nawabganj",
            "New market", "Palton", "Ramna", "Sabujbag", "Sutrapur", "Tejgaon", "Uttara"];

        nextState(sale: SaleViewModel): void {
            var self = this;

            var successCallback = (response: BaseResponse): void => {
                self.search();
            };
            var errorCallback = (error: any): void => {
                console.log(error);
                if (error.status === 500) {
                    alert(error.data.exceptionMessage);
                } else {
                    alert("Error Occurred. Please contact with Administrator");
                }
            };

            sale.customer = null;
            sale.transactions = null;
            self.saveService.update(sale, self.url.sale + "/NextState").then(successCallback, errorCallback);
        }


        nextStateAll(sales: SaleViewModel[]): void {

            var self = this;
            var successCallback = (response: BaseResponse): void => {
                self.search();
            };
            var errorCallback = (error: any): void => {
                console.log(error);
                if (error.status === 500) {
                    alert(error.data.exceptionMessage);
                } else {
                    alert("Error Occurred. Please contact with Administrator");
                }
            };


            let seletedDeliverymans = [];
            for (let i = 0; i < self.models.length; i++) {
                sales[i].customer = null;
                sales[i].transactions = null;

                if (sales[i].deliverymanId != null) {
                    seletedDeliverymans.push(sales[i]);
                }

            }
            self.saveService.updateMultiple(seletedDeliverymans, self.url.sale + "/NextStateAll").then(successCallback, errorCallback);

            //self.saveService.updateMultiple(self.models, self.url.sale + "/NextStateAll").then(successCallback, errorCallback);

        }

        updateState(sale: SaleViewModel): void {
            var self = this;
            var successCallback = (response: BaseResponse): void => {
                self.search();
            };
            var errorCallback = (error: any): void => {
                console.log(error);
                if (error.status === 500) {
                    alert(error.data.exceptionMessage);
                } else {
                    alert("Error Occurred. Please contact with Administrator");

                }
            };
            sale.customer = null;
            sale.transactions = null;
            self.saveService.update(sale, self.url.sale + "/UpdateState").then(successCallback, errorCallback);
        }

        updateStateAll(sales: SaleViewModel[]): void {
            var self = this;
            var successCallback = (response: BaseResponse): void => {
                self.search();
            };
            var errorCallback = (error: any): void => {
                console.log(error);
                if (error.status === 500) {
                    alert(error.data.exceptionMessage);
                } else {
                    alert("Error Occurred. Please contact with Administrator");
                }
            };

            for (let i = 0; i < sales.length; i++) {
                sales[i].customer = null;
                sales[i].transactions = null;
            }

            self.saveService.updateMultiple(sales, self.url.sale + "/UpdateStateAll")
                .then(successCallback, errorCallback);
        }

        changeStateAll(i): void {
            console.log('value-' + i);
            var self = this;
            var sales = self.models as any[];
            for (let j = 0; j < sales.length; j++) {
                console.log('value-' + i);
                sales[j].nextOrderState = i;
                //console.log(sales[j].nextOrderState);
            }
            console.log(i);
        }


        isOverDue(item: SaleViewModel): boolean {
            let diff = this.getDateDiff(item.created);
            return diff > 1 && item.dueAmount >= 1;
        }

        getDateDiff(input: string): number {
            let now = new Date();
            let prev = new Date(input);
            let diff = (+now - +prev) / 86400000;
            return diff;
        }

        toInt(n) { return Math.round(Number(n)); };

        // navigation

        //navigateTo(div: string): void {

        //    this.$anchorScroll.yOffset = 150;
        //    this.location.hash(div);
        //    this.$anchorScroll();
        //}

        removeElement(array: any[], element: any): any[] {
            const index = array.indexOf(element);
            if (index !== -1) {
                array.splice(index, 1);
            }
            return array;
        }

        navigateState(stateName: string, param: any): void {
            var self = this;
            self.stateService.go(stateName, param);
        }

        toggleSort(property: string): void {
            var self = this;
            self.searchRequest.isAscending = self.searchRequest.isAscending === "false" ? 'true' : 'false';
            self.searchRequest.orderBy = property;
            self.search();
        }

        downloadPdf = function (id) {
            let name = Guid.newGuid().toString();
            let jspdf = window["jsPDF"] as any;
            let pdf = new jspdf('p', 'mm', 'a4');
            var printContents = document.getElementById(id);
            pdf.addHTML(printContents, function () {
                pdf.save(name + '.pdf');
            });
            console.log(printContents);
        };


        getPropertyNames(m: any): string[] {
            let properties: string[] = [];
            for (var p in m) {
                properties.push(p);
            }
            return properties;
        }

        excelDownload(id: string): void {
            var self = this;
            if (id == null) {
                id = 'table-edit';
            }
            self.excelDownloadWithId(id);
        }

        excelDownloadWithId(id: string): void {
            var self = this;
            let exportHref = self.Excel.tableToExcel(id, 'Sheet');
            setTimeout(function () { location.href = exportHref; }, 100);
        }

        print(id: string) {
            if (id == null) {
                id = "receipt";
            }

            var printContents = document.getElementById(id).innerHTML;
            var popupWin;
            let baseUrl = 'http://' + document.location.host + this.url.clientSubFolder;
            console.log(baseUrl);
            let cssUrl: string = '';
            cssUrl = baseUrl + '/dist/css/all.css?t=074002082012';
            popupWin = window.open('',
                '_blank',
                'scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
            popupWin.window.focus();
            popupWin.document.write('<!DOCTYPE html><html><head>' +
                '<link rel="stylesheet" ' +
                'href="' + cssUrl + '">' +
                '</head><body style="font-size:10px !important; line-height: 0.3 !important;">' +
                printContents +
                '</body></html>');

            popupWin.onbeforeunload = function (event) {
                popupWin.close();
            };
            popupWin.onabort = function (event) {
                popupWin.document.close();
                popupWin.close();
            }

            setTimeout(function () {
                popupWin.print();
            },
                1000);
        }

        warehouses: any[];
        whouse: Warehouse;
        loadWarehouses(): any {
            var self = this;
            var successCallback = (response: any): any[] => {
                self.warehouses = response.Models;
                if (self.warehouses.length > 0) {
                    let warehouseId = self.user.warehouseId;
                    if (warehouseId && self.user.role.indexOf("Warehouse") !== -1) {
                        self.warehouses = self.warehouses.filter(x => { return x.id === warehouseId });
                    } else {
                        console.log(self.warehouses);
                        self.warehouses.push({ id: Guid.defaultGuid(), text: "Other" });
                        self.warehouses.push({ id: null, text: "All" });
                    }
                }

                return self.warehouses;
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            }

            let reqeust = new SearchRequest();

            return self.searchService
                .search(reqeust, self.url.warehouseQuery + "/Dropdown")
                .then(<any>successCallback, errorCallback);
        }

        searchByWarehouse(): any {
            return this.loadWarehouses().then(result => {
                if (this.warehouses.length == 1) {
                    this.searchRequest.warehouseId = this.warehouses[0].id;
                }

                return this.search();
            });
        }

        saveSaleTagValue(): void {
            var self = this;
            self.localStorageService.save(LocalStorageKeys.IsTaggedSale, self.searchRequest["isTaggedSale"]);
            self.localStorageService.save(LocalStorageKeys.SaleTag, self.searchRequest["saleTag"]);
            this.search();
        }

        saveSearchKeyword(): void {
            var self = this;
            self.localStorageService.save(LocalStorageKeys.SearchKeyword, self.searchRequest.keyword);
        }

        setSearchKeyword(): void {
            let searchKeyword = this.localStorageService.get(LocalStorageKeys.SearchKeyword);
            if (!searchKeyword) {
                searchKeyword = "";
                this.localStorageService.save(LocalStorageKeys.SearchKeyword, searchKeyword);
            }
            this.searchRequest.keyword = searchKeyword;
        }

        saveChangeWarehouse(): void {
            var self = this;
            self.localStorageService.save(LocalStorageKeys.WarehouseId, self.searchRequest.warehouseId);
            self.search();
        }

        toggleShowChart(): void {
            this.showChart = !this.showChart;
        }
    }
}