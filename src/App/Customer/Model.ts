module App {
    export class Customer extends Entity {
        constructor() {
            super();
            this.name = "";
            this.id = "00000000-0000-0000-0000-000000000000";
            this.point = 0;
            this.membershipCardNo = '';
            this.addresses = [];
            this.phone = "";
        }

        membershipCardNo: string;
        name: string;
        occupation: string;
        university: string;
        company: string;
        phone: string;
        email: string;
        nationalId: string;
        imageUrl: string;

        point: number;
        remarks: string;
        isActive: boolean;
        addresses: CustomerAddress[];
    }


    export class CustomerAddress extends Entity {
        constructor() {
            super();
            this.country = "Bangladesh";
            this.district = "Dhaka";
            this.thana = this.getThana();
            this.area = this.getArea();
        }
        public addressName: string;
        public isDefault: boolean;
        public contactName: string;
        public contactPhone: string;
        public streetAddress: string;
        public area: string;
        public thana: string;
        public postCode: string;
        public district: string;
        public country: string;
        public specialNote: string;
        public customerId: string;
        public customer: Customer;
        public isActive: boolean;

        setThana(selectedThana:string) {
            localStorage.setItem("selectedThana", selectedThana);
        }

        private getThana():string {
            return  localStorage.getItem("selectedThana");
        }

        setArea(selectedArea:string) {
            localStorage.setItem("selectedArea", selectedArea);
        }

        private getArea(): string {
            return localStorage.getItem("selectedArea");
        }
    }

    export class CustomerCommunication extends Entity {
        constructor() {
            super();

        }
        customerId: string;
        customr: Customer;
        text: string;
        type: string;
    }

    export class CustomerPointViewModel {
        constructor() {
            this.pointTotal = 0;
        }
        pointTotal: number;
    }
    //export class CustomerHistory {
    //    CustomerId: string;
    //    Purchase: Purchase[];
    //    Payments: Payment[];

    //    constructor() {
    //        this.Purchase = [];
    //        this.Payments = [];
    //    }
    //}

    //export class Billing {
    //    firstName: string;
    //    lastName: string;
    //    phone: string;
    //    address1: string;
    //    city: string;
    //    postcode: string;
    //    country: string;
    //    email: string;
    //}

    export class Location {
        district: string;
        thana: string;
        subOffice: string;
        postcode: string;        
    }

    export class CustomerFeedback extends Entity {
        constructor() {
            super();
        }

        customerId: string;
        orderNumber: string;
        feedback: string;
        feedbackType: string;
        managerComment: string;
       
    }

    export enum FeedbackType {
        Positive = 1,
        Negative,
        Other
    }

}

