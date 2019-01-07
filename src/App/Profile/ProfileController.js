var App;
(function (App) {
    var ProfileController = /** @class */ (function () {
        function ProfileController($location, url, search, save) {
            this.$location = $location;
            this.url = url;
            this.searchService = search;
            this.saveService = save;
            this.activate();
        }
        ProfileController.prototype.$onInit = function () { };
        ProfileController.prototype.activate = function () {
            this.user = new App.UserInfoViewModel();
            this.changePasswordModel = new App.ChangePasswordModel();
            this.changePasswordModel.newPassword = "";
            this.getUserInfo();
        };
        ProfileController.prototype.getUserInfo = function () {
            var self = this;
            var successCallback = function (response) {
                console.log(response);
                self.user = response;
                self.disable = self.user.userName === "admin@demo1.com" || self.user.userName === "admin@demo1.com";
            };
            var errorCallback = function (error) {
                console.log(error);
                alert(error.message);
            };
            self.searchService.get(self.url.profileUrl).then(successCallback, errorCallback);
        };
        ProfileController.prototype.update = function () {
            var self = this;
            var successCallback = function (response) {
                self.activate();
                alert("Password changed successfully.");
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.saveService.save(self.changePasswordModel, self.url.changePasswordUrl).then(successCallback, errorCallback);
        };
        ProfileController.$inject = ["$location", "UrlService", "SearchService", "SaveService"];
        return ProfileController;
    }());
    App.ProfileController = ProfileController;
    angular.module("app").controller("ProfileController", ProfileController);
})(App || (App = {}));
