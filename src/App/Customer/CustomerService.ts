module App {
    export class CustomerService {

        customerSearchRequest: SearchRequest;
        searchService: SearchService;
        url: UrlService;
        q: angular.IQService;

        locations: Location[];

        static $inject: string[] =
        [
            "$q", "UrlService", "SearchService", "SaveService", "AuthService"
        ];

        constructor(
            $q: angular.IQService,
            url: UrlService,
            search: SearchService,
            save: SaveService,
            authService: AuthService,
            
        ) {
            this.q = $q;
            this.url = url;
            this.searchService = search;
            this.customerSearchRequest = new SearchRequest();
        }

        loadCustomer(phone): angular.IPromise<Customer> {
            var self = this;
            self.customerSearchRequest.keyword = phone;
            var deffered: angular.IDeferred<Customer> = self.q.defer();
            var successCallback = (response: SearchResponse): void => {
                var customers = <any>response.Models;
                var customer = null;
                if (customers.length > 0) {
                    customer = customers[0];
                }
                deffered.resolve(customer);
            };
            var errorCallback = (error: any): void => {
                console.log(error);
                deffered.reject(error);
            };
            self.searchService
                .search(self.customerSearchRequest, self.url.customerQuery + "/Search")
                .then(<any>successCallback, errorCallback);
            return deffered.promise;
        }

        loadLocations(): angular.IPromise<Location[]> {
            var self = this;
            var deffered: angular.IDeferred<Location[]> = self.q.defer();
            var successCallback = (response: any): void => {
                //console.log('locations ', response);
                self.locations = response;
                deffered.resolve(self.locations);
            };
            var errorCallback = (error: any): void => {
                console.log(error);
                deffered.reject(error);
            };
            
            self.searchService
                .get(self.url.customerAddressQuery + "/Locations")
                .then(<any>successCallback, errorCallback);
            return deffered.promise;
        }

        loadDistricts():string[] {
            var self = this;
            let filter: string[] = self.locations.map(x => x.district).filter((x, i, z) => z.indexOf(x) === i);
            return filter;
        }

        loadThanas(district: string): string[] {
            var self = this;
            let districWiseLocations: Location[] = self.locations.filter(x => x.district === district);
            let filter: string[] = districWiseLocations.map(x => x.thana).filter((x, i, z) => z.indexOf(x) === i);
            return filter;
        }

        loadAreas(thana: string): string[] {
            var self = this;
            let areas: string[] = self.locations.filter(x => x.thana === thana).map(x => x.subOffice).filter((x, i, z) => z.indexOf(x) === i);;
            return areas;
        }

        getArea(area: string): Location {
            var self = this;
            let location: Location = self.locations.filter(x => x.subOffice === area)[0];
            return location;
        }
    }

    angular.module('app').service("CustomerService", CustomerService);
}
