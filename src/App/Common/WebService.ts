module App {
    export class WebService {

        private qService: angular.IQService;
        private httpService: angular.IHttpService;

        static $inject = ["$q", "$http"];

        constructor($q: angular.IQService, $http: angular.IHttpService) {
            this.qService = $q;
            this.httpService = $http;
        }

        post(url: string, data: any): angular.IPromise<any> {
            var self = this;
            var deffered = self.qService.defer();
            self.httpService.post(url, data).then((result: any): any => {
                if (result.status === 200) {
                    deffered.resolve(result);
                } else {
                    deffered.reject(result);
                }
            }, error => {
                deffered.reject(error);
            });

            //self.httpService.post(url, data).success(
            //    (data: any,
            //        status: number,
            //        headers: (headerName: string) => string,
            //        config: ng.IRequestConfig): void => {
            //        if (status == 200 && headers('location') == null && config.timeout > 200) {
            //            //do something with data
            //        }

            //        deffered.resolve(data);
            //    })
            //    .error((data: any, status: number, headers: (headerName: string) => string, config: ng.IRequestConfig):
            //        void => {
            //            if (status == 500 && headers('myAuth') != null && config.method == 'GET') {
            //                // write to log
            //            }

            //            return deffered.reject(data);
            //        });

            return deffered.promise;
        }

        put(url: string, data: any): angular.IPromise<any> {
            var self = this;
            var deffered = self.qService.defer();
            self.httpService.put(url, data).then((result: any): any => {
                if (result.status === 200) {
                    deffered.resolve(result);
                } else {
                    deffered.reject(result);
                }
            }, error => {
                deffered.reject(error);
            });
            return deffered.promise;
        }


        postUrlencodedForm(url: string, data: string): angular.IPromise<any> {
            var self = this;
            var deffered = self.qService.defer();
            var config: angular.IRequestShortcutConfig = { headers: { 'Content-Type': "application/x-www-form-urlencoded" } };
            self.httpService.post(url, data, config).then((result: any): any => {
                if (result.status === 200) {
                    deffered.resolve(result);
                } else {
                    deffered.reject(result);
                }
            }, error => {
                deffered.reject(error);
            });
            return deffered.promise;
        }

        upload(url: string, data: any, config: angular.IRequestShortcutConfig): angular.IPromise<any> {
            var self = this;
            var deferred = self.qService.defer();
            self.httpService.post(url, data, config).then((result): any => {
                console.log(result);
                deferred.resolve(result);
            }, error => {
                deferred.reject(error);
            });

            return deferred.promise;
        }


        get(url: string): angular.IPromise<any> {
            var self = this;
            var deffered = self.qService.defer();
            self.httpService.get(url).then((result: any): any => {
                if (result.status === 200) {
                    deffered.resolve(result);
                } else {
                    deffered.reject(result);
                }
            }, error => {
                deffered.reject(error);
            });
            return deffered.promise;
        }



        delete(url: string): angular.IPromise<any> {
            var self = this;
            var deffered = self.qService.defer();
            self.httpService.delete(url).then((result: any): any => {
                if (result.status === 200) {
                    deffered.resolve(result);
                } else {
                    deffered.reject(result);
                }
            }, error => {
                deffered.reject(error);
            });
            return deffered.promise;
        }
    }

    angular.module("app").service("WebService", WebService);
}