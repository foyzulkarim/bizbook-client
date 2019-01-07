// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
module App {
    "use strict";

    export class SaveService {
        q: angular.IQService;
        url: UrlService;
        web: WebService;
        auth: AuthService;

        static $inject: string[] = ["$q", "UrlService", "WebService","AuthService"];

        constructor($q: angular.IQService, urlService: UrlService, webService: WebService, auth: AuthService) {
            this.q = $q;
            this.url = urlService;
            this.web = webService;
            this.auth = auth;
        }

        save(data: Entity, url: string): angular.IPromise<BaseResponse> {
            var self = this;
            var deferred: angular.IDeferred<BaseResponse> = self.q.defer();
            data.created = new Date().toDateString();
            data.modified = new Date().toDateString();
            data.createdBy = self.auth.accountInfo.userName;
            data.createdFrom = "Browser";
            data.modifiedBy = self.auth.accountInfo.userName;
            data.id = "1";
            data.shopId = data.shopId != null ? data.shopId:"1";
            self.web.post(url, data).then((result: any): any => {
                var response = new BaseResponse(true, result.data, "Success");
                deferred.resolve(response);
            }, error => {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        update(data: Entity, url: string): angular.IPromise<BaseResponse> {
            var self = this;
            var deffered: angular.IDeferred<BaseResponse> = self.q.defer();
            data.modified = new Date().toDateString();
            data.modifiedBy = self.auth.accountInfo.userName;
            data.shopId = data.shopId != null ? data.shopId : "1";
            self.web.put(url, data).then((result: any): any => {
                var response = new BaseResponse(true, result.data, "Success");
                deffered.resolve(response);
            }, error => {
                deffered.reject(error);
            });
            return deffered.promise;
        }

        updateMultiple(data: Entity[], url: string): angular.IPromise<BaseResponse> {
            var self = this;
            var deffered: angular.IDeferred<BaseResponse> = self.q.defer();
            for (let i = 0; i < data.length; i++) {
                data[i].modified = new Date().toDateString();
                data[i].modifiedBy = self.auth.accountInfo.userName;
                data[i].shopId = data[i].shopId != null ? data[i].shopId : "1";
            }
            
            self.web.put(url, data).then((result: any): any => {
                var response = new BaseResponse(true, result.data, "Success");
                deffered.resolve(response);
            }, error => {
                deffered.reject(error);
            });
            return deffered.promise;
        }

        delete(id: string, url: string): angular.IPromise<BaseResponse> {
            var self = this;
            var deffered: angular.IDeferred<BaseResponse> = self.q.defer();

            self.web.delete(url+"?id="+id).then((result: any): any => {
                var response = new BaseResponse(true, result.data, "Success");
                deffered.resolve(response);
            }, error => {
                deffered.reject(error);
            });
            return deffered.promise;
        }

        upload(url : string, form: FormData): angular.IPromise<BaseResponse> {
            var self = this;
            var deferred: angular.IDeferred<BaseResponse> = self.q.defer();
            var config: angular.IRequestShortcutConfig = {
                headers: { 'Content-Type': undefined  },
                transformRequest: angular.identity,
            };
            self.web.upload(url, form, config).then((result): any => {
                var response = new BaseResponse(true, result.data, "Success");
                deferred.resolve(response);
            }, error => {
                deferred.reject(error);
            });

            return deferred.promise;
        }

    }


    angular.module("app").service("SaveService", SaveService);
}