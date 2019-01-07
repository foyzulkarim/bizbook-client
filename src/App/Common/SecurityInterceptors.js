angular.module('app').service("authInterceptorService",
[
    "$q", "$injector", function($q, $injector) {

        var authInterceptorServiceFactory = {};

        var request = function(config) {
            var authService = $injector.get("AuthService");
            config.headers = config.headers || {};
            //  config.headers.Mama = 'mamamama';
            var authData = authService.accountInfo;
            // console.log(authData);
            //var authData = localStorageService.get("authorizationData");
            if (authData) {
                config.headers.Authorization = "Bearer " + authData.accessToken;
                config.headers.ConnectionId = authData.connectionId;
            }

            return config;
        };
        var responseError = function(rejection) {
            if (rejection.status === 401 || rejection.status === 403) {
                console.log('permission rejection');
                console.log(rejection);
                
                var $state  = $injector.get("$state");
                $state.go("root.signin");
            }
            return $q.reject(rejection);
        };

        var response = function (response) {
            console.log(response.headers('content-length'));
            return $q.resolve(response);
        }


        authInterceptorServiceFactory["request"] = request;
        //authInterceptorServiceFactory['response'] = response;
        authInterceptorServiceFactory["responseError"] = responseError;

        return authInterceptorServiceFactory;
    }
]);
angular.module("app").config([
    '$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push("authInterceptorService");
    }
]);

angular.module("app").service('loaderHttpInterceptor', ["$q","$rootScope",function ($q, $rootScope) {

        var numLoadings = 0;

        return {
            request: function (config) {

                numLoadings++;

                // Show loader
                $rootScope.$broadcast("loader_show");
                return config || $q.when(config);

            },
            response: function (response) {

                if ((--numLoadings) === 0) {
                    // Hide loader
                    $rootScope.$broadcast("loader_hide");
                }

                return response || $q.when(response);

            },
            responseError: function (response) {

                if (!(--numLoadings)) {
                    // Hide loader
                    $rootScope.$broadcast("loader_hide");
                }

                return $q.reject(response);
            }
        };
    }]);
angular.module("app").config([
    '$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push("loaderHttpInterceptor");
    }
]);

angular.module("app").directive("loader",
    function ($rootScope) {
        return function ($scope, element, attrs) {
            $scope.$on("loader_show",
                function () {
                    return element.show();
                });
            return $scope.$on("loader_hide",
                function () {
                    return element.hide();
                });
        };
    }
);

angular.module("app").run([
    "AuthService", 
    function(authService){
        if (authService.isSignedIn()) {
            // authService.Signout();
        }
        authService.fillAuthData();
    }
]);



angular.module("app").run([
    "$rootScope", "$state", "permissionService", "AuthService",
    function($rootScope, $state, permissionService, authService) {
        $rootScope.$on('$viewContentLoaded', function (event) {
            var element = jQuery("#toggleButtonHtla");
            var active = element.hasClass('is-active');
            var visible = element.is(":visible");
            if (active && visible) {
                element.click();
            }
        });
    }
]);