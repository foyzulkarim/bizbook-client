module App {
    export class Sms extends Entity {
        constructor() {
            super();
        }
        text: string;
        receiverNumber: number;
        deliveryStatus: string;
    }
    export class HookDetail extends Entity {
        constructor() {
            super();
        }
        smsHookId: string;
        hookName: string;
        isEnabled: boolean;
    }

    export class SmsHook extends Entity {
        constructor() {
            super();
        }
        name: string;
        isEnabled: boolean; 
    }


    export class SmsHistory extends  Entity {
        constructor() {
            super();
        }

        amount: number;
        text: string;
        deliveryReport: string;
        transactionType: number;
        remarks: string;
        parentType: number;
        parentId:string;
    }

}