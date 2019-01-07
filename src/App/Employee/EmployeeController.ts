
module App {
    "use strict";

    export class EmployeesController extends BaseController<Employee> {
        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        headers = ["id", "userName", "email", "password"];
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
            super(location, state, stateParams, url, search, save, authService, url.employee, url.employeeQuery, excel);
            this.search();
        }

        //report(id: string): void {
        //    var self = this;
        //    var downloadUrl = self.url.employeeQueryReport + "/" + id;
        //    window.open(downloadUrl, "_blank", "");
        //}

    }

    angular.module("app").controller("EmployeesController", EmployeesController);

    export class EmployeeController extends BaseController<Employee> {

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
            super(location, state, stateParams, url, search, save, authService, url.employee, url.employeeQuery, excel);

            this.setupDropdowns();
            if (this.stateParams["applicationUserId"]) {
                this.isUpdateMode = true;
                this.edit(this.stateParams["applicationUserId"]);
            }
        }

        userRoles: any[];
        warehouses: Warehouse[];

        setupDropdowns(): void {
            this.setupRoles();
            this.loadWarehouses();
        }

        private setupRoles() {
            var self = this;

            var success = function (response: any) {
                self.userRoles = response;
                console.log(response);
            };

            var error = function (error) {
                console.log(error);
                alert('Error occurred');
            };

            self.searchService.get(self.url.roleDropdown).then(success, error);
        }
        
        edit(id: string): void {            
            var self = this;

            var url = self.url.employeeQuery + '/GetEmployeeDetail/' + id;

            var onSuccess = (data: any) => {
                self.model = data;
                if (self.isUpdateMode)
                    self.model.roleId = self.model["roles"][0]["roleId"];
            }

            var onError = (err: any) => {
                alert('Error occurred');
            }

            self.searchService.get(url).then(onSuccess, onError);
        }

        setDefaultPassword(): void{
            var self = this;
            console.log(self.model.userName);
            let data = {userName : self.model.userName};
            self.authService.setDefaultPassword(data)
            .then(success=>{
                console.log(success);
                alert('password reset success');
            }, error=>{
                console.log(error);
            })
        }
    }

    angular.module("app").controller("EmployeeController", EmployeeController);

    export class EmployeeInfosController extends BaseController<EmployeeInfo>{
        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        headers = ["id", "name", "phone", "email", "salary", "saleTargetAmount", "saleAchivedAmount"];
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
            super(location, state, stateParams, url, search, save, authService, url.employeeInfo, url.employeeInfoQuery, excel);
            this.search();
        }
    }
    angular.module("app").controller("EmployeeInfosController", EmployeeInfosController);

    export class EmployeeInfoController extends BaseController<EmployeeInfo>{
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
            super(location, state, stateParams, url, search, save, authService, url.employeeInfo, url.employeeInfoQuery, excel);

            this.loadEmployeeRole();
            this.loadWarehouses();
            if (this.stateParams["id"]) {
                this.isUpdateMode = true;
                this.edit2(this.stateParams["id"]);
            }
        }
        employeeRoles: any[];
        loadEmployeeRole(): void {
            var self = this;
            var success = function (response: any) {
                self.employeeRoles = response;
                console.log(response);
            };

            var error = function (error) {
                console.log(error);
                alert('Error occurred');
            };

            self.searchService.get(self.url.roleDropdown).then(success, error);
        }
    }
    angular.module("app").controller("EmployeeInfoController", EmployeeInfoController);

    export class SalesmanHistoryController extends BaseController<Sale>{
        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];

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
            super(location, $state, $stateParams, url, searchService, saveService, auth, url.employeeInfo, url.employeeInfoQuery, excel);
            if (this.stateParams["id"]) {
                this.loadSalesmanHistory();
            }
        }
        models: any[];
        amountTotal: number = 0;
        loadSalesmanHistory(): void {
            var self = this;
            var successCallback = (response: SearchResponse): void => {
                console.log('search:' + response.data["item1"]);
                //self.response = response.Models;
                self.models = response.data["item1"];
                for (let i = 0; i < self.models.length; i++) {
                    self.amountTotal = self.models[i].totalAmount + self.amountTotal;
                }


            };

            var errorCallback = (error: any): void => {
                console.log(error);
                alert('Error occurred');
            };
            var searchRequest = new SearchRequest();
            searchRequest["SalesmanId"] = this.stateParams["id"];
            searchRequest.page = -1;
            self.searchService
                .search(searchRequest, self.url.saleQuery + "/Search")
                .then(<any>successCallback, errorCallback);
        }
    }
    angular.module("app").controller("SalesmanHistoryController", SalesmanHistoryController);
}