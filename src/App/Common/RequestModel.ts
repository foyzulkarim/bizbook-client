module App {
    "use strict";

    export class Entity {
        id: string;
        created: string;
        createdBy: string;
        createdFrom: string;
        modified: string;
        modifiedBy: string;
        shopId: string;

        constructor() {
            this.id = "00000000-0000-0000-0000-000000000000";
            this.created = new Date().toJSON();
            this.modified = new Date().toJSON();
            this.createdBy = "1";
            this.modifiedBy = "1";
            this.shopId = "1";
            this.createdFrom = "Browser";
        }
    }

    export class PermissionRequest {
        name: string;

        constructor(name: string) {
            this.name = name;
        }
    }

    export class Notification {
        isError: boolean;
        isInfo: boolean;
        message: string;
    }

    export class DataRequest {
        id: string;
        page: number;
        perPageCount: number;
        orderBy: string;
        keyword: string;
        isAscending: string;
        parentId: string;
        totalPage: number;
        startDate: string;
        endDate: string;
        shopId: string;
        dateRange: string;
        isIncludeParents: boolean;
        warehouseId:string;
    }

    export class SearchRequest extends DataRequest {
        constructor(keyword = "", orderBy = "Modified", isAsc = "false", parentId = "") {
            super();
            this.keyword = keyword;
            this.orderBy = orderBy;
            this.isAscending = isAsc;
            this.parentId = parentId;
            this.page = 1;
        }       
    }

    export class PartnerCommunicationSearchRequest extends SearchRequest {

        constructor(keyword: string, orderBy: string, isAsc: string, parentId?: string) {
            super(keyword, orderBy, isAsc);
            this.keyword = keyword;
            this.orderBy = orderBy;
            this.isAscending = isAsc;
            this.parentId = parentId;
            this.page = 1;
        }
        partnerShopId: string;
    }

    export class DetailRequest extends DataRequest {
        id: string;

        constructor(id: string) {
            super();
            this.id = id;
        }

        GetQueryString(): string {
            return `?id=${this.id}`;
        }
    }

    export class PurchaseHistorySearchRequest extends SearchRequest {

        constructor(keyword: string, orderBy: string, isAsc: string) {
            super(keyword, orderBy, isAsc);
        }

        state: string;
        partnerId: string;
        orderType: string;
        warehouseId: string;
    }

    export class ProductHistorySearchRequest extends SearchRequest {

        constructor(keyword: string, orderBy: string, isAsc: string) {
            super(keyword, orderBy, isAsc);
        }

        partnerId: string;
        warehouseId: string;
    }

    export class ProductVarianceSearchRequest extends SearchRequest {

        constructor(keyword: string, orderBy: string, isAsc: string, parentId: string, partnerShopId: string) {
            super(keyword, orderBy, isAsc, parentId);
            this.partnerShopId = partnerShopId;
        }

        partnerShopId: string;
    }

}