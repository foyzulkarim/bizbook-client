module App {
    "use strict";

    export class UrlService {
        clientSubFolder: string;
        identityBaseUrl: string;
        identityBaseApi: string;
        inventoryBaseUrl: string;
        inventoryBaseApi: string;
        signalrBaseUrl: string;

        signinUrl: string;
        registerUrl: string;
        setDefaultPasswordUrl: string;

        //account
        profileUrl: string;
        changePasswordUrl: string;

        // superadmin
        applicationRoles: string;
        applicationRoleQuery: string;
        applicationRoleQueryData: string;
        roleDropdown: string;
        partnerDropdown: string;
        applicationUsers: string;
        applicationUserQuery: string;
        applicationUserQueryData: string;
        applicationUserRoles: string;
        applicationUserRoleQuery: string;
        applicationUserRoleQueryData: string;
        applicationResources: string;
        applicationResourceQuery: string;
        applicationResourceQueryData: string;
        resourceDropdown: string;
        applicationPermissions: string;
        applicationPermissionQuery: string;
        applicationPermissionQueryData: string;
        signalrUrl: string;

        // employees
        employee: string;
        employeeQuery: string;
        employeeQueryReport: string;

        //employeeInfo
        employeeInfo: string;
        employeeInfoQuery: string;


        // shops
        shop: string;
        shopQuery: string;
        shopQueryDropdown: string;

        constructor() {

            this.clientSubFolder = "";
            let identitySuffix = "";
            let inventorySuffix = "";
            let clientSuffix = "";

            let host = document.location.host;
          
            //this.setServers2();
            this.setLocalhost(); 
            //this.setLocalhostCore();
            //this.setServerCore();
            //this.setLocalIIS(identitySuffix,inventorySuffix);

            this.signalrUrl = this.signalrBaseUrl + "/signalr";            

            this.registerUrl = this.identityBaseApi + "/Account/Register";
            this.setDefaultPasswordUrl = this.identityBaseApi + "/Account/SetDefaultPassword";
            // this.sideMenuUrl = this.identityBaseApi + "/SideMenu" + "/Get";
            this.profileUrl = this.identityBaseApi + "/Profile/Details";
            this.changePasswordUrl = this.identityBaseApi + "/Account/ChangePassword";
            this.applicationRoles = this.identityBaseApi + "/ApplicationRoles";
            this.applicationRoleQuery = this.identityBaseApi + "/ApplicationRoleQuery";
            this.applicationRoleQueryData = this.applicationRoleQuery + "/Data";
            this.roleDropdown = this.applicationRoleQuery + "/RoleDropdown";

            this.applicationUsers = this.identityBaseApi + "/ApplicationUsers";
            this.applicationUserQuery = this.identityBaseApi + "/ApplicationUserQuery";
            this.applicationUserQueryData = this.applicationUserQuery + "/Data";

            this.applicationUserRoles = this.identityBaseApi + "/ApplicationUserRoles";
            this.applicationUserRoleQuery = this.identityBaseApi + "/ApplicationUserRoleQuery";
            this.applicationUserRoleQueryData = this.applicationUserRoleQuery + "/Data";

            this.applicationResources = this.identityBaseApi + "/ApplicationResources";
            this.applicationResourceQuery = this.identityBaseApi + "/ApplicationResourceQuery";
            this.applicationResourceQueryData = this.applicationResourceQuery + "/Data";
            this.resourceDropdown = this.applicationResourceQuery + "/ResourceDropdown";

            this.applicationPermissions = this.identityBaseApi + "/ApplicationPermissions";
            this.applicationPermissionQuery = this.identityBaseApi + "/ApplicationPermissionQuery";
            this.applicationPermissionQueryData = this.applicationPermissionQuery + "/Data";

            // employees
            this.employee = this.identityBaseApi + "/Employee";
            this.employeeQuery = this.identityBaseApi + "/EmployeeQuery";
            this.employeeQueryReport = this.employeeQuery + "/Report";

            // shops
            this.shop = this.identityBaseApi + "/Shop";
            this.shopQuery = this.identityBaseApi + "/ShopQuery";
            this.shopQueryDropdown = this.inventoryBaseApi + "/ShopQuery" + "/Dropdown";

            // inventory
            this.dashboard = this.inventoryBaseApi + "/DashboardQuery";
            //Sms
            this.sms = this.inventoryBaseApi + "/Sms";
            this.smsQuery = this.inventoryBaseApi + "/SmsQuery";

            //HookDetail
            this.hookDetail = this.inventoryBaseApi + "/HookDetail";
            this.hookDetailQuery = this.inventoryBaseApi + "/HookDetailQuery";

            //SmsHook
            this.smsHook = this.inventoryBaseApi + "/SmsHook";
            this.smsHookQuery = this.inventoryBaseApi + "/SmsHookQuery";

            //Sms History
            this.smsHistory = this.inventoryBaseApi + "/SmsHistory";
            this.smsHistoryQuery = this.inventoryBaseApi + "/SmsHistoryQuery";


            // product group
            this.productGroup = this.inventoryBaseApi + "/ProductGroup";
            this.productGroupQuery = this.inventoryBaseApi + "/ProductGroupQuery";
            this.productGroupQueryData = this.productGroupQuery + "/Data";
            this.productGroupQueryReport = this.productGroupQuery + "/Report";

            // product category
            this.barcodeImage = this.inventoryBaseApi + "/BarcodeImage";
            this.product = this.inventoryBaseApi + "/ProductCategory";
            this.productQuery = this.inventoryBaseApi + "/ProductCategoryQuery";
            this.productQueryData = this.productQuery + "/Data";
            this.productQueryReport = this.productQuery + "/Report";

            // product detail
            this.productDetail = this.inventoryBaseApi + "/ProductDetail";
            this.productDetailQuery = this.inventoryBaseApi + "/ProductDetailQuery";
            this.productDetailQueryReport = this.productDetailQuery + "/Report";
            this.productDetailQueryBarcode = this.productDetailQuery + "/Barcode";

            // supplier
            this.supplierQuery = this.inventoryBaseApi + "/SupplierQuery";
            this.supplier = this.inventoryBaseApi + "/Supplier";
            this.supplierQueryData = this.supplierQuery + "/Data";
            this.supplierQueryReport = this.supplierQuery + "/Report";

            // purchase
            this.purchase = this.inventoryBaseApi + "/Purchase";
            this.purchaseQuery = this.inventoryBaseApi + "/PurchaseQuery";
            this.purchaseQueryData = this.purchaseQuery + "/Data";
            this.purchaseQueryReport = this.purchaseQuery + "/Report";

            // sale
            this.sale = this.inventoryBaseApi + "/Sale";
            this.saleQuery = this.inventoryBaseApi + "/SaleQuery";
            this.saleQueryData = this.saleQuery + "/Data";
            this.saleQueryReport = this.saleQuery + "/Report";
            this.saleDetailQuery = this.inventoryBaseApi + "/SaleDetailQuery";

            // customer
            this.customer = this.inventoryBaseApi + "/Customer";
            this.customerQuery = this.inventoryBaseApi + "/CustomerQuery";
            this.customerQueryBarcode = this.customerQuery + "/Barcode";
            this.customerQueryReport = this.customerQuery + "/Report";
            this.customerAddress = this.inventoryBaseApi + "/CustomerAddress";
            this.customerAddressQuery = this.inventoryBaseApi + "/CustomerAddressQuery";
            this.customerFeedback = this.inventoryBaseApi + "/CustomerFeedback";
            this.customerFeedbackQuery = this.inventoryBaseApi + "/CustomerFeedbackQuery";


            // brand
            this.brand = this.inventoryBaseApi + "/Brand";
            this.brandQuery = this.inventoryBaseApi + "/BrandQuery";
            this.brandQueryReport = this.brandQuery + "/Report";
            
            // operation
            this.operationLog = this.inventoryBaseApi + "/OperationLog";
            this.operationLogsQuery = this.inventoryBaseApi + "/OperationLogQuery";
            this.operationLogDetail = this.inventoryBaseApi + "/OperationLogDetail";
            this.operationLogDetailQuery = this.inventoryBaseApi + "/OperationLogDetailQuery";

            // myshop

            this.myShop = this.inventoryBaseApi + "/MyShop";
            this.myShopQuery = this.inventoryBaseApi + "/MyShopQuery";

            this.accountHead = this.inventoryBaseApi + "/AccountHead";
            this.accountHeadQuery = this.inventoryBaseApi + "/AccountHeadQuery";
            this.accountHeadQueryReport = this.accountHeadQuery + "/Report";

            // new url pattern
            this.transaction = this.inventoryBaseApi + "/Transaction";
            this.transactionQuery = this.inventoryBaseApi + "/TransactionQuery";
            this.transactionQueryReport = this.transactionQuery + "/Report";


            //dealer:
            this.dealer = this.inventoryBaseApi + "/Dealer";
            this.dealerQuery = this.inventoryBaseApi + "/DealerQuery";

            //courier
            this.courier = this.inventoryBaseApi + "/Courier";
            this.courierQuery = this.inventoryBaseApi + "/CourierQuery";
            //accountInfo
            this.accountInfo = this.inventoryBaseApi + "/AccountInfo";
            this.accountInfoQuery = this.inventoryBaseApi + "/AccountInfoQuery";

            this.dealerProduct = this.inventoryBaseApi + "/DealerProduct";
            this.dealerProductQuery = this.inventoryBaseApi + "/DealerProductQuery";

            //employeeInfo
            this.employeeInfo = this.inventoryBaseApi + "/EmployeeInfo";
            this.employeeInfoQuery = this.inventoryBaseApi + "/EmployeeInfoQuery";


            this.supplierProduct = this.inventoryBaseApi + "/SupplierProduct";
            this.supplierProductQuery = this.inventoryBaseApi + "/SupplierProductQuery";

            this.warehouse = this.inventoryBaseApi + "/Warehouse";
            this.warehouseQuery = this.inventoryBaseApi + "/WarehouseQuery";

            this.stocktransfer = this.inventoryBaseApi + "/StockTransfer";
            this.stocktransferQuery = this.inventoryBaseApi + "/StockTransferQuery";

            //Damage

            this.damage = this.inventoryBaseApi + "/Damage";
            this.damageQuery = this.inventoryBaseApi + "/DamageQuery";

            // File upload
            this.uploadImage = this.inventoryBaseApi + "/File/UploadImage";
            this.getImage = this.inventoryBaseApi + "/File/GetImage";

            // installment
            this.installmentQuery = this.inventoryBaseApi + "/InstallmentQuery";

            this.installmentDetailQuery = this.inventoryBaseApi + "/InstallmentDetailQuery";
        }

        private setServers(identitySuffix: string, inventorySuffix: string): void {
            let identityfolder = "/bizbook-identity";
            let identityServer = "http://bizbook-server.westus2.cloudapp.azure.com";
            this.identityBaseUrl = identityServer + identityfolder + identitySuffix;
            this.identityBaseApi = this.identityBaseUrl + "/api";

            let inventoryfolder = "/bizbook-inventory";
            let inventoryServer = "http://bizbook-server.westus2.cloudapp.azure.com";
            this.inventoryBaseUrl = inventoryServer + inventoryfolder + inventorySuffix;
            this.inventoryBaseApi = this.inventoryBaseUrl + "/api";

            this.signalrBaseUrl = this.inventoryBaseUrl;
        }

        private setServers2(): void {
            let identityServer = "http://identity.bizbook365.com";
            this.identityBaseUrl = identityServer;
            this.identityBaseApi = this.identityBaseUrl + "/api";
            this.signinUrl = this.identityBaseUrl + "/token";

            let inventoryServer = "http://api.bizbook365.com";
            this.inventoryBaseUrl = inventoryServer;
            this.inventoryBaseApi = this.inventoryBaseUrl + "/api";

            this.signalrBaseUrl = inventoryServer;
        }

        private setLocalhost(): void {
            let identityServer = "http://localhost:61923";
            this.identityBaseUrl = identityServer;
            this.identityBaseApi = this.identityBaseUrl + "/api";
            this.signinUrl = this.identityBaseUrl + "/token";

            let inventoryServer = "http://localhost:61924";
            this.inventoryBaseUrl = inventoryServer;
            this.inventoryBaseApi = this.inventoryBaseUrl + "/api";

            this.signalrBaseUrl = inventoryServer;
        }

        private setLocalhostCore(): void {
            let identityServer = "http://localhost:52894";
            this.identityBaseUrl = identityServer;
            this.identityBaseApi = this.identityBaseUrl + "/api";
            this.signinUrl = this.identityBaseApi + "/token";

            let inventoryServer = "http://localhost:52894";
            this.inventoryBaseUrl = inventoryServer;
            this.inventoryBaseApi = this.inventoryBaseUrl + "/api";

            this.signalrBaseUrl = inventoryServer;
        }

        private setServerCore(): void {
            let identityServer = "http://bizbook.live";
            this.identityBaseUrl = identityServer;
            this.identityBaseApi = this.identityBaseUrl + "/api";
            this.signinUrl = this.identityBaseApi + "/token";

            let inventoryServer = "http://bizbook.live";
            this.inventoryBaseUrl = inventoryServer;
            this.inventoryBaseApi = this.inventoryBaseUrl + "/api";

            this.signalrBaseUrl = inventoryServer;
        }
        
        dashboard: string;

        // account heads
        accountHead: string;
        accountHeadQuery: string;
        accountHeadQueryReport: string;
        accountHeadQueryData: string;

        // transactions
        transaction: string;
        transactionQuery: string;
        transactionQueryReport: string;


        accountInfo: string;
        accountInfoQuery: string;

        //smss
        //sms: string;
        sms: string;
        smsQuery: string;

        //hookDetail
        hookDetail: string;
        hookDetailQuery: string;


        //smsHook
        smsHook: string;
        smsHookQuery: string;

        //SmsHistory
        smsHistory: string;
        smsHistoryQuery: string;

        // products
        product: string;
        productQuery: string;
        productQueryBarcode: string;
        productQueryData: string;
        productQueryReport: string;
        barcodeImage: string;

        productGroup: string;
        productGroupQuery: string;
        productGroupQueryData: string;
        productGroupQueryReport: string;

        productDetail: string;
        productDetailQuery: string;
        productDetailData: string;
        productDetailQueryBarcode: string;
        productDetailQueryReport: string;

        // purchases
        purchase: string;
        purchaseQuery: string;
        purchaseQueryData: string;
        purchaseQueryReport: string;

        // sales
        sale: string;
        saleQuery: string;
        saleQueryData: string;
        saleQueryCount: string;
        saleQueryReport: string;
        saleDetail: string;
        saleDetailQuery: string;

        // shops
        // myshop
        myShop: string;
        myShopQuery: string;
        // suppliers
        supplierQuery: string;
        supplier: string;
        supplierQueryData: string;
        supplierQueryReport: string;

        // brands
        brand: string;
        brandQuery: string;
        brandQueryReport: string;

         // operation
        operationLog: string;
        operationLogsQuery: string;
        operationLogDetail: string;
        operationLogDetailQuery: string;

        // customers
        customer: string;
        customerQuery: string;
        customerQueryBarcode: string;
        customerQueryReport: string;
        customerAddress: string;
        customerAddressQuery: string;
        customerFeedback: string;
        customerFeedbackQuery: string;

        //dealer
        dealer: string;
        dealerQuery: string;

        //courier
        courier: string;
        courierQuery: string;


        dealerProduct: string;
        dealerProductQuery: string;

        supplierProduct: string;
        supplierProductQuery: string;

        warehouse: string;
        warehouseQuery: string;

        stocktransfer: string;
        stocktransferQuery: string;

        //Damge
        damage: string;
        damageQuery: string;

        // File upload
        uploadImage: string;
        getImage: string;

        //Installment

        installmentQuery: string;

        installmentDetailQuery: string;
    }

    angular.module("app").service("UrlService", UrlService);
}