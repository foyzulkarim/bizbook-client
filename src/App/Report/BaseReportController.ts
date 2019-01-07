module App {
    export class BaseReportController {

        // header
        startDate: Date;
        startDatePopUp: boolean;
        hideStartDate: boolean;
        hideDropdown: boolean = true;

        endDate: Date;
        endDatePopUp: boolean;
        hideEndDate: boolean;
        //hideDropdown: boolean = true;

        selectedItem: any;
        items: any[];

        // grid
        searchService: SearchService;
        urlService: UrlService;
        gridOptions: any;
        gridApi: any;
        
        title: string;

        constructor(scope: angular.IScope, url: UrlService, search: SearchService, reportName: string) {
            var self = this;

            let timestamp = new Date().toString();          
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
        
        openStartDate(): void {
            this.startDatePopUp = true;
        }

        openEndDate(): void {
            this.endDatePopUp = true;
        }

       
    }

}