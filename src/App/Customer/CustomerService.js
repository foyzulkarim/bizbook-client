var App;
(function (App) {
    var CustomerService = /** @class */ (function () {
        function CustomerService($q, url, search, save, authService) {
            this.q = $q;
            this.url = url;
            this.searchService = search;
            this.customerSearchRequest = new App.SearchRequest();
        }
        CustomerService.prototype.loadCustomer = function (phone) {
            var self = this;
            self.customerSearchRequest.keyword = phone;
            var deffered = self.q.defer();
            var successCallback = function (response) {
                var customers = response.Models;
                var customer = null;
                if (customers.length > 0) {
                    customer = customers[0];
                }
                deffered.resolve(customer);
            };
            var errorCallback = function (error) {
                console.log(error);
                deffered.reject(error);
            };
            self.searchService
                .search(self.customerSearchRequest, self.url.customerQuery + "/Search")
                .then(successCallback, errorCallback);
            return deffered.promise;
        };
        CustomerService.prototype.loadLocations = function () {
            var self = this;
            var deffered = self.q.defer();
            var successCallback = function (response) {
                //console.log('locations ', response);
                self.locations = response;
                deffered.resolve(self.locations);
            };
            var errorCallback = function (error) {
                console.log(error);
                deffered.reject(error);
            };
            self.searchService
                .get(self.url.customerAddressQuery + "/Locations")
                .then(successCallback, errorCallback);
            return deffered.promise;
        };
        CustomerService.prototype.loadDistricts = function () {
            var self = this;
            var filter = self.locations.map(function (x) { return x.district; }).filter(function (x, i, z) { return z.indexOf(x) === i; });
            return filter;
        };
        CustomerService.prototype.loadThanas = function (district) {
            var self = this;
            var districWiseLocations = self.locations.filter(function (x) { return x.district === district; });
            var filter = districWiseLocations.map(function (x) { return x.thana; }).filter(function (x, i, z) { return z.indexOf(x) === i; });
            return filter;
        };
        CustomerService.prototype.loadAreas = function (thana) {
            var self = this;
            var areas = self.locations.filter(function (x) { return x.thana === thana; }).map(function (x) { return x.subOffice; }).filter(function (x, i, z) { return z.indexOf(x) === i; });
            ;
            return areas;
        };
        CustomerService.prototype.getArea = function (area) {
            var self = this;
            var location = self.locations.filter(function (x) { return x.subOffice === area; })[0];
            return location;
        };
        CustomerService.$inject = [
            "$q", "UrlService", "SearchService", "SaveService", "AuthService"
        ];
        return CustomerService;
    }());
    App.CustomerService = CustomerService;
    angular.module('app').service("CustomerService", CustomerService);
})(App || (App = {}));
