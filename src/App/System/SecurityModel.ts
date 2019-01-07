module App {

    export class ApplicationRole  {
        id: string;
        name: string;
        description: string;
        defaultRoute: string;
        constructor() {
            
        }
    }

    export class ApplicationUser {
        id: string;
        firstName: string;
        lastName: string;
        isActive: boolean;
        email: string;
        emailConfirmed: boolean;
        passwordHash: string;
        securityStamp: string;
        phoneNumber: string;
        phoneNumberConfirmed: boolean;
        twoFactorEnabled: boolean;
        lockoutEndDateUtc: Date;
        lockoutEnabled: boolean;
        accessFailedCount: number;
        userName: string;
        roleId: string;
        shopId: string;
        role: string;
        roleName: string;
    }

    export class ApplicationUserRole {
        userId: string;
        roleId: string;
        role: string;
        roleName: string;
        userName: string;
    }

    export class ApplicationResource {
        id: string;
        name: string;
        isPublic: boolean;
    }

    export class ApplicationPermission {

        constructor() {
            this.isAllowed = false;
        }

        id: string;
        resourceId: string;
        roleId: string;
        resource: string;
        role:string;
        isAllowed:boolean;
    }

}