var App;
(function (App) {
    var Display = /** @class */ (function () {
        function Display() {
        }
        Display.log = function (m, params) {
            if (params) {
                console.log(m, params);
            }
            else {
                console.log(m);
            }
        };
        return Display;
    }());
    App.Display = Display;
    var Dictionary = /** @class */ (function () {
        function Dictionary() {
            this.items = [];
        }
        Dictionary.prototype.set = function (k, v) {
            this.items[k] = v;
            Display.log(this.items);
        };
        Dictionary.prototype.get = function (k) {
            var item = this.items[k];
            return item;
        };
        return Dictionary;
    }());
    App.Dictionary = Dictionary;
    var KeyValuePair = /** @class */ (function () {
        function KeyValuePair() {
        }
        return KeyValuePair;
    }());
    App.KeyValuePair = KeyValuePair;
    var Guid = /** @class */ (function () {
        function Guid() {
        }
        Guid.newGuid = function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        };
        Guid.defaultGuid = function () {
            return '00000000-0000-0000-0000-000000000000';
        };
        return Guid;
    }());
    App.Guid = Guid;
    var BaseController = /** @class */ (function () {
        function BaseController($location, $state, $stateParams, url, search, save, authService, commandUrl, queryUrl, excel) {
            this.headers = ["id", "modified"];
            this.keys = [];
            this.orderStates = [];
            this.showChart = false;
            this.thanas = ["All", "Dhaka Cantt.", "Dhanmondi", "Gulshan", "Jatrabari",
                "Keraniganj", "Khilgaon", "Lalbag", "Mirpur", "Mohammadpur", "Motijheel", "Nawabganj",
                "New market", "Palton", "Ramna", "Sabujbag", "Sutrapur", "Tejgaon", "Uttara"];
            this.downloadPdf = function (id) {
                var name = Guid.newGuid().toString();
                var jspdf = window["jsPDF"];
                var pdf = new jspdf('p', 'mm', 'a4');
                var printContents = document.getElementById(id);
                pdf.addHTML(printContents, function () {
                    pdf.save(name + '.pdf');
                });
                console.log(printContents);
            };
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
        BaseController.prototype.$onInit = function () { };
        BaseController.prototype.newGuid = function () {
            return Guid.newGuid();
        };
        BaseController.prototype.loadUser = function () {
            var self = this;
            self.user = this.authService.accountInfo;
        };
        BaseController.prototype.goto = function (page) {
            this.searchRequest.page = page;
            this.search();
        };
        BaseController.prototype.createInstance = function (c) {
            return new c();
        };
        BaseController.prototype.activate = function () {
            this.model = this.createInstance(App.Entity);
            this.model.id = "";
            this.models = [];
            this.isUpdateMode = false;
            this.totalCount = 0;
            this.searchRequest = new App.SearchRequest("", "Modified", "False", "");
            this.searchRequest.page = 1;
            this.startDate = new Date();
            this.endDate = new Date();
            //this.search();
        };
        BaseController.prototype.loadData = function () {
            var self = this;
            if (self.startDate != null) {
                self.searchRequest.startDate = self.startDate.toDateString();
                self.localStorageService.save(App.LocalStorageKeys.startDate, self.startDate);
            }
            if (self.endDate != null) {
                self.searchRequest.endDate = self.endDate.toDateString();
                self.localStorageService.save(App.LocalStorageKeys.endDate, self.endDate);
            }
            this.search();
        };
        BaseController.prototype.setStartDate = function () {
            var fromdate = this.localStorageService.get(App.LocalStorageKeys.startDate);
            if (!fromdate) {
                fromdate = new Date();
                this.localStorageService.save(App.LocalStorageKeys.startDate, fromdate);
            }
            else {
                fromdate = new Date(fromdate);
            }
            //let fd = this.searchRequest.startDate = fromdate
            this.searchRequest.startDate = fromdate.toDateString();
            this.startDate = fromdate;
            console.log('Save Start Date' + ' ' + fromdate);
        };
        BaseController.prototype.setEndDate = function () {
            var todate = this.localStorageService.get(App.LocalStorageKeys.endDate);
            if (!todate) {
                todate = new Date();
                this.localStorageService.save(App.LocalStorageKeys.endDate, todate);
            }
            else {
                todate = new Date(todate);
            }
            this.searchRequest.endDate = todate.toDateString();
            this.endDate = todate;
            console.log('Save To Date' + ' ' + todate);
        };
        BaseController.prototype.search = function () {
            var self = this;
            var successCallback = function (response) {
                console.log(response);
                self.totalCount = response.Count;
                self.models = response.Models;
                if (self.models.length === 0) {
                    console.log('No search result found');
                    alert('No search result found');
                }
                else {
                    self.csvModels = [];
                    for (var i = 0; i < self.models.length; i++) {
                        self.csvModels.push(self.generateCsvModel(self.models[i]));
                    }
                }
                self.searchRequest.totalPage = Math.ceil(response.Count / 10);
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService
                .search(self.searchRequest, self.queryUrl + "/Search")
                .then(successCallback, errorCallback);
        };
        BaseController.prototype.generateCsvModel = function (m) {
            var self = this;
            var csvData = {};
            for (var j = 0; j < self.headers.length; j++) {
                var head = self.headers[j];
                csvData[head] = m[head];
            }
            return csvData;
        };
        BaseController.prototype.generateCsvModels = function () {
            var self = this;
            self.headers = [];
            for (var k = 0; k < self.keys.length; k++) {
                if (self.keys[k].value === true) {
                    self.headers.push(self.keys[k].key);
                }
            }
            self.csvModels = [];
            for (var i = 0; i < self.models.length; i++) {
                self.csvModels.push(self.generateCsvModel(self.models[i]));
            }
        };
        BaseController.prototype.ensureKeysAreSaved = function (lskValue, m) {
            var self = this;
            self.keys = self.localStorageService.get(lskValue);
            if (self.keys == null) {
                var dictionary = [];
                var propertyNames = self.getPropertyNames(m);
                for (var j = 0; j < propertyNames.length; j++) {
                    var property = { key: propertyNames[j], value: true };
                    dictionary.push(property);
                }
                self.localStorageService.save(lskValue, dictionary);
                self.keys = self.localStorageService.get(lskValue);
            }
        };
        BaseController.prototype.edit = function (id) {
            var self = this;
            var onSuccess = function (data) {
                self.model = data.data;
            };
            var onError = function (error) {
                console.log(error);
                alert('Error occurred');
            };
            var searchRequest = new App.SearchRequest();
            searchRequest.id = id;
            var url = self.queryUrl + '/Detail';
            if (id && id.length > 0) {
                url += '?id=' + id;
            }
            self.searchService.search(null, url).then(onSuccess, onError);
        };
        BaseController.prototype.editWithCallBack = function (id, callBack) {
            var self = this;
            var onSuccess = function (data) {
                self.model = data.data;
                callBack(self.model, self);
            };
            var onError = function (error) {
                console.log(error);
                alert('Error occurred');
            };
            var searchRequest = new App.SearchRequest();
            searchRequest.id = id;
            var url = self.queryUrl + '/Detail';
            if (id && id.length > 0) {
                url += '?id=' + id;
            }
            self.searchService.search(null, url).then(onSuccess, onError);
        };
        BaseController.prototype.edit2 = function (id) {
            var self = this;
            var onSuccess = function (data) {
                self.model = data.data;
            };
            var onError = function (error) {
                console.log(error);
                alert('Error occurred');
            };
            var searchRequest = new App.SearchRequest();
            searchRequest.id = id;
            var url = self.queryUrl + '/SearchDetail';
            self.searchService.search(searchRequest, url).then(onSuccess, onError);
        };
        BaseController.prototype.save = function () {
            var self = this;
            if (self.isUpdateMode)
                self.update();
            else {
                var successCallback = function (response) {
                    self.activate();
                };
                var errorCallback = function (error) {
                    console.log(error);
                    if (error.status === 500) {
                        alert(error.data.exceptionMessage);
                    }
                };
                self.saveService.save(self.model, self.commandUrl + "/Add").then(successCallback, errorCallback);
            }
        };
        BaseController.prototype.update = function () {
            var self = this;
            var successCallback = function (response) {
                self.activate();
                self.back();
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.saveService.update(self.model, self.commandUrl + "/Edit").then(successCallback, errorCallback);
        };
        BaseController.prototype.updateWithCallBack = function (m, fn, e) {
            var self = this;
            var successCallback = function (response) {
                fn();
            };
            var errorCallback = function (error) {
                console.log(error);
                e();
            };
            self.saveService.update(m, self.commandUrl + "/Edit").then(successCallback, errorCallback);
        };
        BaseController.prototype.update2 = function (p) {
            var self = this;
            var succsessCallBack = function () {
                p["message"] = "Updated Now";
            };
            var error = function (e) {
                alert(e);
            };
            self.updateWithCallBack(p, succsessCallBack, error);
        };
        BaseController.prototype.delete = function (id) {
            var self = this;
            var successCallback = function (response) {
                self.activate();
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.saveService.delete(id, self.commandUrl + "/Delete").then(successCallback, errorCallback);
        };
        BaseController.prototype.loadDropdown = function (name, id) {
            if (id === void 0) { id = ""; }
            var self = this;
            var successCallback = function (response) {
                self.dropdown[name] = response.Models;
                console.log(response.Models);
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            //if (id.length > 0) {
            //    self..load(name, id).then(<any>successCallback, errorCallback);
            //} else {
            //    self..load(name).then(<any>successCallback, errorCallback);
            //}
        };
        BaseController.prototype.pad = function (num, size) {
            var s = num + "";
            while (s.length < size)
                s = "0" + s;
            return s;
        };
        BaseController.prototype.generateOrderNumber = function () {
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
        };
        BaseController.prototype.back = function () {
            window.history.back();
        };
        BaseController.prototype.openStartDate = function () {
            this.startDatePopUp = true;
        };
        BaseController.prototype.openEndDate = function () {
            this.endDatePopUp = true;
        };
        BaseController.prototype.report = function () {
            var self = this;
            var url = self.queryUrl + "/Report";
            window.open(url, "_blank", "");
        };
        BaseController.prototype.nextState = function (sale) {
            var self = this;
            var successCallback = function (response) {
                self.search();
            };
            var errorCallback = function (error) {
                console.log(error);
                if (error.status === 500) {
                    alert(error.data.exceptionMessage);
                }
                else {
                    alert("Error Occurred. Please contact with Administrator");
                }
            };
            sale.customer = null;
            sale.transactions = null;
            self.saveService.update(sale, self.url.sale + "/NextState").then(successCallback, errorCallback);
        };
        BaseController.prototype.nextStateAll = function (sales) {
            var self = this;
            var successCallback = function (response) {
                self.search();
            };
            var errorCallback = function (error) {
                console.log(error);
                if (error.status === 500) {
                    alert(error.data.exceptionMessage);
                }
                else {
                    alert("Error Occurred. Please contact with Administrator");
                }
            };
            var seletedDeliverymans = [];
            for (var i = 0; i < self.models.length; i++) {
                sales[i].customer = null;
                sales[i].transactions = null;
                if (sales[i].deliverymanId != null) {
                    seletedDeliverymans.push(sales[i]);
                }
            }
            self.saveService.updateMultiple(seletedDeliverymans, self.url.sale + "/NextStateAll").then(successCallback, errorCallback);
            //self.saveService.updateMultiple(self.models, self.url.sale + "/NextStateAll").then(successCallback, errorCallback);
        };
        BaseController.prototype.updateState = function (sale) {
            var self = this;
            var successCallback = function (response) {
                self.search();
            };
            var errorCallback = function (error) {
                console.log(error);
                if (error.status === 500) {
                    alert(error.data.exceptionMessage);
                }
                else {
                    alert("Error Occurred. Please contact with Administrator");
                }
            };
            sale.customer = null;
            sale.transactions = null;
            self.saveService.update(sale, self.url.sale + "/UpdateState").then(successCallback, errorCallback);
        };
        BaseController.prototype.updateStateAll = function (sales) {
            var self = this;
            var successCallback = function (response) {
                self.search();
            };
            var errorCallback = function (error) {
                console.log(error);
                if (error.status === 500) {
                    alert(error.data.exceptionMessage);
                }
                else {
                    alert("Error Occurred. Please contact with Administrator");
                }
            };
            for (var i = 0; i < sales.length; i++) {
                sales[i].customer = null;
                sales[i].transactions = null;
            }
            self.saveService.updateMultiple(sales, self.url.sale + "/UpdateStateAll")
                .then(successCallback, errorCallback);
        };
        BaseController.prototype.changeStateAll = function (i) {
            console.log('value-' + i);
            var self = this;
            var sales = self.models;
            for (var j = 0; j < sales.length; j++) {
                console.log('value-' + i);
                sales[j].nextOrderState = i;
                //console.log(sales[j].nextOrderState);
            }
            console.log(i);
        };
        BaseController.prototype.isOverDue = function (item) {
            var diff = this.getDateDiff(item.created);
            return diff > 1 && item.dueAmount >= 1;
        };
        BaseController.prototype.getDateDiff = function (input) {
            var now = new Date();
            var prev = new Date(input);
            var diff = (+now - +prev) / 86400000;
            return diff;
        };
        BaseController.prototype.toInt = function (n) { return Math.round(Number(n)); };
        ;
        // navigation
        //navigateTo(div: string): void {
        //    this.$anchorScroll.yOffset = 150;
        //    this.location.hash(div);
        //    this.$anchorScroll();
        //}
        BaseController.prototype.removeElement = function (array, element) {
            var index = array.indexOf(element);
            if (index !== -1) {
                array.splice(index, 1);
            }
            return array;
        };
        BaseController.prototype.navigateState = function (stateName, param) {
            var self = this;
            self.stateService.go(stateName, param);
        };
        BaseController.prototype.toggleSort = function (property) {
            var self = this;
            self.searchRequest.isAscending = self.searchRequest.isAscending === "false" ? 'true' : 'false';
            self.searchRequest.orderBy = property;
            self.search();
        };
        BaseController.prototype.getPropertyNames = function (m) {
            var properties = [];
            for (var p in m) {
                properties.push(p);
            }
            return properties;
        };
        BaseController.prototype.excelDownload = function (id) {
            var self = this;
            if (id == null) {
                id = 'table-edit';
            }
            self.excelDownloadWithId(id);
        };
        BaseController.prototype.excelDownloadWithId = function (id) {
            var self = this;
            var exportHref = self.Excel.tableToExcel(id, 'Sheet');
            setTimeout(function () { location.href = exportHref; }, 100);
        };
        BaseController.prototype.print = function (id) {
            if (id == null) {
                id = "receipt";
            }
            var printContents = document.getElementById(id).innerHTML;
            var popupWin;
            var baseUrl = 'http://' + document.location.host + this.url.clientSubFolder;
            console.log(baseUrl);
            var cssUrl = '';
            cssUrl = baseUrl + '/dist/css/all.css?t=074002082012';
            popupWin = window.open('', '_blank', 'scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
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
            };
            setTimeout(function () {
                popupWin.print();
            }, 1000);
        };
        BaseController.prototype.loadWarehouses = function () {
            var self = this;
            var successCallback = function (response) {
                self.warehouses = response.Models;
                if (self.warehouses.length > 0) {
                    var warehouseId_1 = self.user.warehouseId;
                    if (warehouseId_1 && self.user.role.indexOf("Warehouse") !== -1) {
                        self.warehouses = self.warehouses.filter(function (x) { return x.id === warehouseId_1; });
                    }
                    else {
                        console.log(self.warehouses);
                        self.warehouses.push({ id: Guid.defaultGuid(), text: "Other" });
                        self.warehouses.push({ id: null, text: "All" });
                    }
                }
                return self.warehouses;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            var reqeust = new App.SearchRequest();
            return self.searchService
                .search(reqeust, self.url.warehouseQuery + "/Dropdown")
                .then(successCallback, errorCallback);
        };
        BaseController.prototype.searchByWarehouse = function () {
            var _this = this;
            return this.loadWarehouses().then(function (result) {
                if (_this.warehouses.length == 1) {
                    _this.searchRequest.warehouseId = _this.warehouses[0].id;
                }
                return _this.search();
            });
        };
        BaseController.prototype.saveSaleTagValue = function () {
            var self = this;
            self.localStorageService.save(App.LocalStorageKeys.IsTaggedSale, self.searchRequest["isTaggedSale"]);
            self.localStorageService.save(App.LocalStorageKeys.SaleTag, self.searchRequest["saleTag"]);
            this.search();
        };
        BaseController.prototype.saveSearchKeyword = function () {
            var self = this;
            self.localStorageService.save(App.LocalStorageKeys.SearchKeyword, self.searchRequest.keyword);
        };
        BaseController.prototype.setSearchKeyword = function () {
            var searchKeyword = this.localStorageService.get(App.LocalStorageKeys.SearchKeyword);
            if (!searchKeyword) {
                searchKeyword = "";
                this.localStorageService.save(App.LocalStorageKeys.SearchKeyword, searchKeyword);
            }
            this.searchRequest.keyword = searchKeyword;
        };
        BaseController.prototype.saveChangeWarehouse = function () {
            var self = this;
            self.localStorageService.save(App.LocalStorageKeys.WarehouseId, self.searchRequest.warehouseId);
            self.search();
        };
        BaseController.prototype.toggleShowChart = function () {
            this.showChart = !this.showChart;
        };
        return BaseController;
    }());
    App.BaseController = BaseController;
})(App || (App = {}));
