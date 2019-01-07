module App {

    export class SigninRequest {
        email: string;
        password: string;

        constructor(email: string, password: string) {
            this.email = email;
            this.password = password;
        }
    }

    export class RegisterRequest {
        email: string;
        password: string;
        confirmPassword: string;
        firstName: string;
        lastName: string;
        phone: string;

        constructor(email: string, password: string, confirmPassword: string, firstName: string, lastName: string, phone: string) {

            this.email = email;
            this.password = password;
            this.confirmPassword = confirmPassword;
            this.firstName = firstName;
            this.lastName = lastName;
            this.phone = phone;
        }
    }

    export class UserInfo {
        userName: string;
        id: string;
        name: string;
        shopId: string;
        warehouseId: string;
        authToken: string;
        accessToken: string;
        connectionId:string;
        isAuth: boolean;
        routes: string[];
        role: string;
        roleId: string;
        resources: Resource[];
        defaultRoute:string;
    }

    export class RegisterResponse {
        constructor(isSuccess: boolean, data: any, message: string) {
            this.isSuccess = isSuccess;
            this.data = data;
            this.message = message == null ? "Success" : message;
        }

        isSuccess: boolean;
        private data: any;
        message: string;
        isRegistered: boolean;
        userName: string;
    }

    export class Resource {
        name: string;
        isAllowed: boolean;
        isDisabled : boolean;
    }
}