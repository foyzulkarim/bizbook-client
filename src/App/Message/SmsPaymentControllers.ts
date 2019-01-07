module App {
    "use strict";
    export class SmsPaymentController extends BaseController<SmsHistory>{
        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        constructor(
            location: angular.ILocationService,
            state: angular.ui.IStateService,
            stateParams: angular.ui.IStateParamsService,
            url: UrlService,
            search: SearchService,
            save: SaveService,
            authService: AuthService,
            excel: any

        ) {
            super(location, state, stateParams, url, search, save, authService, url.smsHistory, url.smsHistoryQuery, excel);
        }

        save(): void {
            let self = this;
            this.model.transactionType = 1;
            this.model.text = 'payment';
            this.saveService.save(this.model, this.commandUrl + "/Add").then(success => {
                    self.activate();
                },
                error => {
                     alert('error occurred.');
                });
        }
    }

    angular.module("app").controller("SmsPaymentController", SmsPaymentController);

    export class SmsPaymentsController extends BaseController<SmsHistory>{

        static $inject: string[] =
        [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        constructor(
            location: angular.ILocationService,
            state: angular.ui.IStateService,
            stateParams: angular.ui.IStateParamsService,
            url: UrlService,
            search: SearchService,
            save: SaveService,
            authService: AuthService,
            excel: any
        ) {
            super(location, state, stateParams, url, search, save, authService, url.smsHistory, url.smsHistoryQuery, excel);
            this.search();
        }
    }

    angular.module("app").controller("SmsPaymentsController", SmsPaymentsController);
}