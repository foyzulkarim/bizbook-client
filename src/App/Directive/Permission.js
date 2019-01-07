angular.module('app').directive('accessControl', ([
    'AuthService', function (authService) {
        return {
            restrict: 'A',
            scope: "=",
            link: function (scope, element, attrs) {
                scope.canShow = function (resource) {
                    //return true;
                    if (authService.accountInfo) {
                        var allowedResources = authService.accountInfo.resources;
                        var isAllowed = contains(allowedResources, resource);
                        return isAllowed;
                    }
                    return false;
                };
                // http://stackoverflow.com/a/237176/326597
                function contains(a, obj) {
                    var i = a.length;
                    while (i--) {
                        if (a[i].name === obj) {
                            return a[i].isAllowed;
                        }
                    }
                    return false;
                }
            }
        };
    }
]));
