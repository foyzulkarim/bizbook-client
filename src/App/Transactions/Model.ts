module App {
    export class Expense extends Entity {
        constructor() {
            super();
            this.payTo = "Cash";
        }

        amount: number;
        memo: string;
        paidBy: string;
        trxId: string;
        remarks: string;
        payTo: string;
        accountHead: string;
    }

    export class AccountHead extends Entity {

        constructor() {
            super();
        }

        name: string;
        accountHeadType: string;

    }

    export class Transaction extends Entity {
        constructor() {
            super();
        }
        transactionDate: string;
        transactionFlowType: string;
        transactionMedium: string;
        paymentGatewayService: string;
        transactionFor: string;
        transactionWith: string;

        parentId: string;
        parentName: string;
        orderNumber: string;
        orderId: string;
        amount: number;

        transactionMediumName: string;
        paymentGatewayServiceName: string;
        transactionNumber: string;
        remarks: string;
        contactPersonName: string;
        contactPersonPhone: string;
       
        accountHeadName: string;
        accountHeadId: string;
        accountInfoType: string;
        accountInfoTitle: string;
        accountInfoId: string;
    }

    export class AccountInfo extends Entity {
        constructor() {
            super();
        }

        accountTitle: string;
        accountNumber: string;
        bankName: string;
        accountInfoType: string;
    }
}

