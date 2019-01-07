// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
var App;
(function (App) {
    "use strict";
    var SaveService = /** @class */ (function () {
        function SaveService($q, urlService, webService, auth) {
            this.q = $q;
            this.url = urlService;
            this.web = webService;
            this.auth = auth;
        }
        SaveService.prototype.save = function (data, url) {
            var self = this;
            var deferred = self.q.defer();
            data.created = new Date().toDateString();
            data.modified = new Date().toDateString();
            data.createdBy = self.auth.accountInfo.userName;
            data.createdFrom = "Browser";
            data.modifiedBy = self.auth.accountInfo.userName;
            data.id = "1";
            data.shopId = data.shopId != null ? data.shopId : "1";
            self.web.post(url, data).then(function (result) {
                var response = new App.BaseResponse(true, result.data, "Success");
                deferred.resolve(response);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };
        SaveService.prototype.update = function (data, url) {
            var self = this;
            var deffered = self.q.defer();
            data.modified = new Date().toDateString();
            data.modifiedBy = self.auth.accountInfo.userName;
            data.shopId = data.shopId != null ? data.shopId : "1";
            self.web.put(url, data).then(function (result) {
                var response = new App.BaseResponse(true, result.data, "Success");
                deffered.resolve(response);
            }, function (error) {
                deffered.reject(error);
            });
            return deffered.promise;
        };
        SaveService.prototype.updateMultiple = function (data, url) {
            var self = this;
            var deffered = self.q.defer();
            for (var i = 0; i < data.length; i++) {
                data[i].modified = new Date().toDateString();
                data[i].modifiedBy = self.auth.accountInfo.userName;
                data[i].shopId = data[i].shopId != null ? data[i].shopId : "1";
            }
            self.web.put(url, data).then(function (result) {
                var response = new App.BaseResponse(true, result.data, "Success");
                deffered.resolve(response);
            }, function (error) {
                deffered.reject(error);
            });
            return deffered.promise;
        };
        SaveService.prototype.delete = function (id, url) {
            var self = this;
            var deffered = self.q.defer();
            self.web.delete(url + "?id=" + id).then(function (result) {
                var response = new App.BaseResponse(true, result.data, "Success");
                deffered.resolve(response);
            }, function (error) {
                deffered.reject(error);
            });
            return deffered.promise;
        };
        SaveService.prototype.upload = function (url, form) {
            var self = this;
            var deferred = self.q.defer();
            var config = {
                headers: { 'Content-Type': undefined },
                transformRequest: angular.identity,
            };
            self.web.upload(url, form, config).then(function (result) {
                var response = new App.BaseResponse(true, result.data, "Success");
                deferred.resolve(response);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };
        SaveService.$inject = ["$q", "UrlService", "WebService", "AuthService"];
        return SaveService;
    }());
    App.SaveService = SaveService;
    angular.module("app").service("SaveService", SaveService);
})(App || (App = {}));
