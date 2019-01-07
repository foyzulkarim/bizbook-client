module App {
    "use strict";

    export class BaseService {
        q: angular.IQService;
        url: UrlService;
        web: WebService;

        constructor($q: angular.IQService, urlService: UrlService, webService: WebService) {
            this.q = $q;
            this.url = urlService;
            this.web = webService;
        }
    }
}