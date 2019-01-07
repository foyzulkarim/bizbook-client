module App {
    "use strict";

    export class BaseResponse {
        isSuccess: boolean;
        data: any;
        message: string;

        constructor(isSuccess: boolean, data: any, message: string) {
            this.isSuccess = isSuccess;
            this.data = data;
            this.message = message == null ? "Success" : message;
        }
    }

    export class PermissionResponse extends BaseResponse {
        isAllowed: boolean;
    }

    

    export class ErrorResponse extends BaseResponse {
        Exception: string;
    }

    export class SearchResponse extends BaseResponse {
        constructor(data: any) {
            super(true, data, "Success");
            this.Models = data.item1;
            this.Count = data.item2;
        }

        Models: Object[];
        Count: number;
    }

     
}