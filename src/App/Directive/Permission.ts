module App {

    //export class AccessControl implements ng.IDirective {

    //    public authService: App.AuthService;
    //    public link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => void;

    //    constructor(authService: App.AuthService) {
    //        this.authService = authService;
    //        console.log('authservice: ', authService);
    //        AccessControl.prototype.link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
    //            scope["canShow"] = function (resource: string) {
    //                // some logic
    //                console.log('can show' + resource);
    //                return true;
    //            };
    //        };
    //    }

    //    public static factory(): ng.IDirectiveFactory {
    //        var directive = (authService: App.AuthService) => {
    //            return new AccessControl(authService);
    //        };

    //        directive['$inject'] = ['AuthService'];
    //        return directive;
    //    }

    //    restrict = "A";
    //    scope: "=";
    //}

    //angular.module('app').directive('obsoleteAccessControl', AccessControl.factory());
}

angular.module('app').directive('accessControl',
    ([
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
                    }

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
            }
        }
    ]) as any);


