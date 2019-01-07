var App;
(function (App) {
    var BaseReportController = /** @class */ (function () {
        function BaseReportController(scope, url, search, reportName) {
            this.hideDropdown = true;
            var self = this;
            var timestamp = new Date().toString();
            self.gridOptions = {
                enableGridMenu: true,
                enableSelectAll: true,
                exporterCsvFilename: reportName + timestamp + '.csv',
                exporterPdfDefaultStyle: { fontSize: 9 },
                exporterPdfTableStyle: { margin: [30, 30, 30, 30] },
                exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'red' },
                exporterPdfHeader: { text: "My Header", style: 'headerStyle' },
                exporterPdfFooter: function (currentPage, pageCount) {
                    return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
                },
                exporterPdfCustomFormatter: function (docDefinition) {
                    docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
                    docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
                    return docDefinition;
                },
                exporterPdfOrientation: 'portrait',
                exporterPdfPageSize: 'LETTER',
                exporterPdfMaxGridWidth: 500,
                exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
                onRegisterApi: function (gridApi) {
                    self.gridApi = gridApi;
                }
            };
            self.searchService = search;
            self.urlService = url;
            self.startDate = new Date();
            self.endDate = new Date();
        }
        BaseReportController.prototype.openStartDate = function () {
            this.startDatePopUp = true;
        };
        BaseReportController.prototype.openEndDate = function () {
            this.endDatePopUp = true;
        };
        return BaseReportController;
    }());
    App.BaseReportController = BaseReportController;
})(App || (App = {}));
