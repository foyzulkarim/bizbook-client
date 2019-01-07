var App;
(function (App) {
    "use strict";
    var BaseService = /** @class */ (function () {
        function BaseService($q, urlService, webService) {
            this.q = $q;
            this.url = urlService;
            this.web = webService;
        }
        return BaseService;
    }());
    App.BaseService = BaseService;
})(App || (App = {}));
