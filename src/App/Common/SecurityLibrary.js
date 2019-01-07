var App;
(function (App) {
    var SigninRequest = /** @class */ (function () {
        function SigninRequest(email, password) {
            this.email = email;
            this.password = password;
        }
        return SigninRequest;
    }());
    App.SigninRequest = SigninRequest;
    var RegisterRequest = /** @class */ (function () {
        function RegisterRequest(email, password, confirmPassword, firstName, lastName, phone) {
            this.email = email;
            this.password = password;
            this.confirmPassword = confirmPassword;
            this.firstName = firstName;
            this.lastName = lastName;
            this.phone = phone;
        }
        return RegisterRequest;
    }());
    App.RegisterRequest = RegisterRequest;
    var UserInfo = /** @class */ (function () {
        function UserInfo() {
        }
        return UserInfo;
    }());
    App.UserInfo = UserInfo;
    var RegisterResponse = /** @class */ (function () {
        function RegisterResponse(isSuccess, data, message) {
            this.isSuccess = isSuccess;
            this.data = data;
            this.message = message == null ? "Success" : message;
        }
        return RegisterResponse;
    }());
    App.RegisterResponse = RegisterResponse;
    var Resource = /** @class */ (function () {
        function Resource() {
        }
        return Resource;
    }());
    App.Resource = Resource;
})(App || (App = {}));
