var App;
(function (App) {
    var ApplicationRole = /** @class */ (function () {
        function ApplicationRole() {
        }
        return ApplicationRole;
    }());
    App.ApplicationRole = ApplicationRole;
    var ApplicationUser = /** @class */ (function () {
        function ApplicationUser() {
        }
        return ApplicationUser;
    }());
    App.ApplicationUser = ApplicationUser;
    var ApplicationUserRole = /** @class */ (function () {
        function ApplicationUserRole() {
        }
        return ApplicationUserRole;
    }());
    App.ApplicationUserRole = ApplicationUserRole;
    var ApplicationResource = /** @class */ (function () {
        function ApplicationResource() {
        }
        return ApplicationResource;
    }());
    App.ApplicationResource = ApplicationResource;
    var ApplicationPermission = /** @class */ (function () {
        function ApplicationPermission() {
            this.isAllowed = false;
        }
        return ApplicationPermission;
    }());
    App.ApplicationPermission = ApplicationPermission;
})(App || (App = {}));
