module App {
    "use strict";

    export class ApplicationUserRolesController implements angular.IController {
        $onInit(): void { }

        searchService: SearchService;
        saveService: SaveService;
        url: UrlService;
        searchRequest: SearchRequest;
        isUpdateMode: boolean;
        models: ApplicationUserRole[];
        model: ApplicationUserRole;
        user: ApplicationUser;
        users: ApplicationUser[];
        role: ApplicationRole;
        roles:ApplicationRole[];

        static $inject: string[] = ["$location", "UrlService", "SearchService", "SaveService"];

        constructor(private $location: angular.ILocationService, url: UrlService, search: SearchService, save: SaveService) {
            this.url = url;
            this.searchService = search;
            this.saveService = save;
            this.isUpdateMode = false;
            this.activate();
        }

        activate() {
            console.log('i m in ApplicationUserRolesController');
            this.models = [];
            this.model = new ApplicationUserRole();
            this.users = [];
            this.user = new ApplicationUser();
            this.roles = [];
            this.role = new ApplicationRole();
            this.searchRequest = new SearchRequest("", "Modified", "False", "");
            this.search();
            this.loadApplicationUserDropDown();
            this.loadApplicationRoleDropDown();
        }

        loadApplicationUserDropDown(): void {
            var self = this;
            var successCallback = (response: SearchResponse): void => {
                console.log(response);
                self.users = <any>response;
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            self.searchService.get(self.url.applicationUserQueryData).then(<any>successCallback, errorCallback);

        }

        loadApplicationRoleDropDown(): void {
            var self = this;
            var successCallback = (response: SearchResponse): void => {
                console.log(response);
                self.roles = <any>response;
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            self.searchService.get(self.url.roleDropdown).then(<any>successCallback, errorCallback);

        }

        search(): void {
            var self = this;
            var successCallback = (response: SearchResponse): void => {
                console.log(response);
                self.models = <any>response;
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            self.searchService.get(self.url.applicationUserRoleQueryData).then(<any>successCallback, errorCallback);

        }

        goto(page: number): void {
            this.searchRequest.page = page;
            this.search();
        }

        save(): void {
            var self = this;
            var successCallback = (response: BaseResponse): void => {
                console.log(response);
                self.model = new ApplicationUserRole();
                this.search();
                this.loadApplicationUserDropDown();
                this.loadApplicationRoleDropDown();
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };
            //self.Model.UserId = self.User.Id;
            //self.Model.RoleId = self.Role.Id;
            self.saveService.save(<any>self.model, self.url.applicationUserRoles).then(<any>successCallback, errorCallback);
        }

        update(): void {
            var self = this;

            var successCallback = (response: BaseResponse): void => {
                console.log(response);
                self.isUpdateMode = false;
                self.model = new ApplicationUserRole();
                this.search();
            };
            var errorCallback = (error: any): void => {
                console.log(error);
                this.search();
            };
            //self.Model.UserId = self.User.Id;
            //self.Model.RoleId = self.Role.Id;
            self.saveService.update(<any>self.model, self.url.applicationUserRoles).then(<any>successCallback, errorCallback);
        }

        edit(p: ApplicationUserRole): void {
            //this.User.Id = p.UserId;
            //this.User.UserName = p.UserName;
            //this.Role.Id = p.RoleId;
            //this.Role.Name = p.RoleName;
            this.model = p;
            this.isUpdateMode = true;
        }

        delete(id: string): void {
            var self = this;
            var successCallback = (response: BaseResponse): void => {
                console.log(response);
                self.isUpdateMode = false;
                self.model = new ApplicationUserRole();
                this.search();
            };
            var errorCallback = (error: any): void => {
                console.log(error);
                this.search();
            };
            self.saveService.delete(id, self.url.applicationUserRoles).then(successCallback, errorCallback);
        }
    }

    angular.module("app").controller("ApplicationUserRolesController", ApplicationUserRolesController);
}