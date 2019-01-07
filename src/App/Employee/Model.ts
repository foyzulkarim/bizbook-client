module App {
    export class Employee extends Entity {
        constructor() {
            super();
        }
        firstName: string;
        lastName: string;
        userName: string;
        phoneNumber: string;
        roleId:string;
        isActive: boolean;

    }
    export class EmployeeInfo extends Entity {
        constructor() {
            super();
        }
        name: string;
        phone: string;
        email: string;
        roleId: string;
        salary: number;
        saleTargetAmount: number;
        saleAchivedAmount: number;
    }
}