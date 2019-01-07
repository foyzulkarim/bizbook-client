// Install the angularjs.TypeScript.DefinitelyTyped NuGet package
var App;
(function (App) {
    "use strict";
    var SearchService = /** @class */ (function () {
        function SearchService($q, urlService, webService) {
            this.q = $q;
            this.url = urlService;
            this.web = webService;
            this.id = undefined;
        }
        SearchService.prototype.search = function (request, url) {
            var self = this;
            var deffered = self.q.defer();
            self.web.post(url, request).then(function (result) {
                var response = new App.SearchResponse(result.data);
                deffered.resolve(response);
            }, function (error) {
                deffered.reject(error);
            });
            return deffered.promise;
        };
        SearchService.prototype.get = function (url) {
            var self = this;
            var deffered = self.q.defer();
            self.web.get(url).then(function (result) {
                var response = result.data;
                deffered.resolve(response);
            }, function (error) {
                deffered.reject(error);
            });
            return deffered.promise;
        };
        SearchService.prototype.download = function (url) {
            var self = this;
            var deffered = self.q.defer();
            self.web.get(url).then(function (result) {
                deffered.resolve(result);
            }, function (error) {
                deffered.reject(error);
            });
            return deffered.promise;
        };
        SearchService.$inject = ["$q", "UrlService", "WebService"];
        return SearchService;
    }());
    App.SearchService = SearchService;
    angular.module("app").service("SearchService", SearchService);
})(App || (App = {}));
