module App {
    export class ProfileController implements angular.IController{
        searchService: SearchService;
        saveService: SaveService;
        url: UrlService;
        user: UserInfoViewModel;
        changePasswordModel: ChangePasswordModel;
        disable: boolean;

        static $inject: string[] = ["$location", "UrlService", "SearchService", "SaveService"];
        $onInit(): void { }

        constructor(private $location: angular.ILocationService, url: UrlService, search: SearchService, save: SaveService) {
            this.url = url;
            this.searchService = search;
            this.saveService = save;
            this.activate();
        }

        activate() {
            this.user = new UserInfoViewModel();
            this.changePasswordModel = new ChangePasswordModel();
            this.changePasswordModel.newPassword = "";
            this.getUserInfo();
        }

        getUserInfo(): void {
            var self = this;
            var successCallback = (response: SearchResponse): void => {
                console.log(response);
                self.user = <any>response;
                self.disable = self.user.userName === "admin@demo1.com" || self.user.userName === "admin@demo1.com";
            };
            var errorCallback = (error: any): void => {
                console.log(error);
                alert(error.message);
            };
            self.searchService.get(self.url.profileUrl).then(<any>successCallback, errorCallback);
        }

        update(): void {
            var self = this;
            var successCallback = (response: BaseResponse): void => {
                self.activate();
                alert("Password changed successfully.");
            };
            var errorCallback = (error: any): void => {
                console.log(error);
            };

            self.saveService.save(self.changePasswordModel, self.url.changePasswordUrl).then(<any>successCallback, errorCallback);
        }


    }
    angular.module("app").controller("ProfileController", ProfileController);
}
