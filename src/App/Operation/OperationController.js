var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var App;
(function (App) {
    "use strict";
    var OperationLogsController = /** @class */ (function (_super) {
        __extends(OperationLogsController, _super);
        function OperationLogsController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.operationLog, url.operationLogsQuery, excel) || this;
            _this.searchRequest.perPageCount = 50;
            _this.searchRequest.isIncludeParents = true;
            _this.search();
            return _this;
        }
        OperationLogsController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "AuthService", 'Excel'
        ];
        return OperationLogsController;
    }(App.BaseController));
    App.OperationLogsController = OperationLogsController;
    angular.module('app').controller('OperationLogsController', OperationLogsController);
    var OperationLogDetailController = /** @class */ (function (_super) {
        __extends(OperationLogDetailController, _super);
        function OperationLogDetailController(location, state, stateParams, url, search, save, authService, excel) {
            var _this = _super.call(this, location, state, stateParams, url, search, save, authService, url.operationLog, url.operationLogsQuery, excel) || this;
            if (_this.stateParams["id"]) {
                _this.loadDetail();
            }
            else {
                _this.back();
            }
            return _this;
        }
        OperationLogDetailController.prototype.loadDetail = function () {
            console.log(this.stateParams);
            var self = this;
            var successCallback = function (response) {
                self.model = response.data;
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            var searchRequest = new App.SearchRequest();
            searchRequest.id = this.stateParams["id"];
            searchRequest.page = -1;
            var id = this.stateParams["id"];
            var httpUrl = self.url.operationLogsQuery + "/SearchDetail?id=" + id;
            self.searchService
                .search(searchRequest, httpUrl)
                .then(successCallback, errorCallback);
        };
        OperationLogDetailController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return OperationLogDetailController;
    }(App.BaseController));
    App.OperationLogDetailController = OperationLogDetailController;
    angular.module('app').controller("OperationLogDetailController", OperationLogDetailController);
    var OperationLogDetailHistoryController = /** @class */ (function (_super) {
        __extends(OperationLogDetailHistoryController, _super);
        function OperationLogDetailHistoryController(location, state, stateParams, url, search, save, authService, excel) {
            return _super.call(this, location, state, stateParams, url, search, save, authService, url.operationLogDetail, url.operationLogDetailQuery, excel) || this;
        }
        OperationLogDetailHistoryController.prototype.search = function () {
            var self = this;
            if (self.searchRequest.keyword.length < 3) {
                return;
            }
            var successCallback = function (response) {
                self.models = response.Models;
                if (self.models.length === 0) {
                    console.log('No search result found');
                }
                else {
                    for (var i = 0; i < self.models.length; i++) {
                        var m = self.models[i];
                    }
                }
                self.totalCount = response.Count;
                self.searchRequest.totalPage = Math.ceil(response.Count / 10);
            };
            var errorCallback = function (error) {
                console.log(error);
            };
            self.searchService.search(self.searchRequest, self.url.operationLogDetailQuery + "/Search")
                .then(successCallback, errorCallback);
        };
        OperationLogDetailHistoryController.$inject = [
            "$location", "$state", "$stateParams",
            "UrlService", "SearchService", "SaveService", "AuthService", 'Excel'
        ];
        return OperationLogDetailHistoryController;
    }(App.BaseController));
    App.OperationLogDetailHistoryController = OperationLogDetailHistoryController;
    angular.module('app').controller("OperationLogDetailHistoryController", OperationLogDetailHistoryController);
})(App || (App = {}));
