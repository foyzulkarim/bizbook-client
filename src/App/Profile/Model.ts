module App {
    export class UserInfoViewModel  {
        firstName: string;
        lastName: string;
        phone: string;
        email: string;
        password: string;
        confirmPassword: number;
        userName: string;
    }

    export class ChangePasswordModel extends Entity{
        constructor() {
            super();
        }
        oldPassword: string;
        newPassword: string;
        confirmPassword: number;
    }

   
}