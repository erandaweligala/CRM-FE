import CustomerOverviewModel from "../models/CustomerOverviewModel";
import axiosInstance, {axiosInstanceOfmDirectCall} from "../../../services/axios.service";
import BackendEndpoints from "../../../constants/backend-endpoints";
import showNotification from "../../../services/notification.service";
import {getErrorHumanReadableMessage} from "../../../helpers/backend-errors-human-readable";
import ConnectionOverviewModel from "../models/ConnectionOverviewModel";
import  {
    CustomerProfileModel,
    ContactDetailsModel,
    ExternalReferenceModel,
    LanguageModel,
    HierarchyModel,
    RelatedPartyModel,
    TaxExemptionModel} from "../models/CustomerProfileModel";
import AccountModel from "../models/AccountModel";
import SalesAndServicesModel from "../models/SalesAndServicesModel";
import NewCommonApiResponse from "../../../model/NewCommonApiResponse";
import { OrderStatusFlowModel, OrdersModel, OrdersRequestModel } from "../models/OrdersModel";
import {
    UpdateCustomerInfoRequest
} from "../components/customer-profile-tab/components/customer-info/models/update-customer-info.request";
import browserFileDownload from "js-file-download";
import { UpdateOrganizationInfoRequest } from "../../customer/components/customer-profile/components/customer-profile-tab/components/organization-info/models/update-organization-info.request";
import { AccountHierarchyModel } from "../../customer/components/customer-profile/models/AccountHierarchy.Model";


export const getCustomerOverviewData = async (type: string, value: string): Promise<CustomerOverviewModel> => {
    try {
        const apiResponse = await axiosInstance.post<NewCommonApiResponse<CustomerOverviewModel>>(
            BackendEndpoints.CUSTOMER_OVERVIEW,
            { type, value }
        );

        return apiResponse.data.data;
    } catch (error: any) {
        if(error.response.data.message !== ""){

            showNotification("ERROR", error.response.data.message);

        }else{

            showNotification("ERROR", getErrorHumanReadableMessage(error));
            
        }
        throw new Error();
    }
}
export const getAccountHierarchyData = async (customerID: string): Promise<AccountHierarchyModel[]> => {
    console.log("getAccountHierarchyData customerID",customerID);
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<AccountHierarchyModel[]>>(
            BackendEndpoints.CUSTOMER_ACCOUNT_HIERARCHY+customerID);
            console.log(apiResponse.data.data[0]);
        return apiResponse.data.data;
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}
export const getConnectionOverviewData = async (msisdn: string | null): Promise<ConnectionOverviewModel> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<ConnectionOverviewModel>>(
            BackendEndpoints.CONNECTION_OVERVIEW + "/" + msisdn
        );
        return apiResponse.data.data;
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const getCustomerProfileData = async (msisdn: string | null): Promise<CustomerProfileModel> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<CustomerProfileModel>>(
            BackendEndpoints.CUSTOMER_PROFILE + "/" + msisdn
        );
        return apiResponse.data.data;
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const getConnectionAccountData = async (msisdn: string | null): Promise<AccountModel> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<AccountModel>>(
            BackendEndpoints.CONNECTION_ACCOUNT + "/" + msisdn
        );
        return apiResponse.data.data;
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const getConnectionProductData = async (msisdn: string | null): Promise<SalesAndServicesModel[]> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<SalesAndServicesModel[]>>(
            BackendEndpoints.CONNECTION_PRODUCTS_AND_SERVICES + "/" + msisdn
        );
        return apiResponse.data.data;
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}
export const getConnectionSubscriptionsData = async (selectedPaymentResponsibility: string): Promise<SalesAndServicesModel[]> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<SalesAndServicesModel[]>>(
            BackendEndpoints.CONNECTION_Subscriptions_AND_SERVICES + "/" + selectedPaymentResponsibility
        );
        return apiResponse.data.data;
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}
export const getConnectionOrdersData = async (queryParams: OrdersRequestModel): Promise<OrdersModel[]> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<OrdersModel[]>>(
            BackendEndpoints.CONNECTION_ORDERS,
            {
                params: queryParams
            }
        );
        return apiResponse.data.data;
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const getOrdersStatusFlowData = async (orderId: string): Promise<OrderStatusFlowModel[]> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<OrderStatusFlowModel[]>>(
            BackendEndpoints.CONNECTION_ORDERS_STATUS_FLOW + "/" + orderId
        );
        return apiResponse.data.data;
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const getOrdersStepsFlowData = async (orderId: string,orderItemId:string): Promise<OrderStatusFlowModel[]> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<OrderStatusFlowModel[]>>(
            BackendEndpoints.CONNECTION_ORDERS_STEPS + "/" + orderId + "/" + orderItemId
        );
        return apiResponse.data.data;
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const updateContactDetails = async (requestBody: ContactDetailsModel[], customerSystemId: string): Promise<"SUCCESS" | "ERROR"> => {
    try {
        await axiosInstance.put<NewCommonApiResponse<any>>(
            BackendEndpoints.UPDATE_CUSTOMER_CONTACT_DETAILS + "/" + customerSystemId,
            requestBody
        );
        showNotification("SUCCESS", "Customer Contact Details Updated Successfully");
        return "SUCCESS";
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        return "ERROR";
    }
}

export const updateCustomerInfo = async (contactDetails: UpdateCustomerInfoRequest, customerSystemId: string): Promise<"SUCCESS" | "ERROR"> => {
    try {
        await axiosInstance.put<NewCommonApiResponse<any>>(
            BackendEndpoints.UPDATE_CUSTOMER_INFO + "/" + customerSystemId,
            contactDetails
        );
        showNotification("SUCCESS", "Customer Info Updated Successfully");
        return "SUCCESS";
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        return "ERROR";
    }
}
export const updateOrganizationInfo = async (contactDetails: UpdateOrganizationInfoRequest, organizationSystemId: string): Promise<"SUCCESS" | "ERROR"> => {
    try {
        await axiosInstance.put<NewCommonApiResponse<any>>(
            BackendEndpoints.UPDATE_ORGANIZATION_INFO + "/" + organizationSystemId,
            contactDetails
        );
        showNotification("SUCCESS", "Organization Info Updated Successfully");
        return "SUCCESS";
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        return "ERROR";
    }
}
export const updateLanguage = async (requestBody: LanguageModel[], customerSystemId: string): Promise<"SUCCESS" | "ERROR"> => {
    try {
        await axiosInstance.put<NewCommonApiResponse<any>>(
            BackendEndpoints.UPDATE_Language_Info + "/" + customerSystemId,
            requestBody
        );
        return "SUCCESS";
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        return "ERROR";
    }
}
export const updateHierarchy= async (requestBody: HierarchyModel[], customerSystemId: string): Promise<"SUCCESS" | "ERROR"> => {
    try {
        await axiosInstance.put<NewCommonApiResponse<any>>(
            BackendEndpoints.UPDATE_Hierarchy_Info + "/" + customerSystemId,
            requestBody
        );
        return "SUCCESS";
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        return "ERROR";
    }
}
export const updateRelatedParties= async (requestBody: RelatedPartyModel[], customerSystemId: string): Promise<"SUCCESS" | "ERROR"> => {
    try {
        await axiosInstance.put<NewCommonApiResponse<any>>(
            BackendEndpoints.UPDATE_RelatedParty_Info + "/" + customerSystemId,
            requestBody
        );
        return "SUCCESS";
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        return "ERROR";
    }
}
export const updateTaxExemptions = async (requestBody: TaxExemptionModel[],customerSystemId: string): Promise<"SUCCESS" | "ERROR"> => {
    try {
        await axiosInstance.put<NewCommonApiResponse<any>>(
            BackendEndpoints.UPDATE_TAX_EXEMPTIONS_INFO + "/" + customerSystemId,
            requestBody
        );
        return "SUCCESS";
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        return "ERROR";
    }
};

export const downloadAFileFromUrl = async (url: string, fileName: string): Promise<"SUCCESS" | "ERROR"> => {
    try {
        const apiResponse = await axiosInstance.get<Blob>(
            url,
            {
                responseType: "blob"
            }
        );
        showNotification("SUCCESS", "Customer Info Updated Successfully");
        browserFileDownload(apiResponse.data, fileName)
        return "SUCCESS";
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        return "ERROR";
    }
}

export const postToCreateReference = async (id: string , payload: ExternalReferenceModel[]): Promise<"Operation Success"> => {
    try {
        await axiosInstance.put<NewCommonApiResponse<ExternalReferenceModel>>(
            BackendEndpoints.REFERENCE_LINK+id,
            payload,
        );
        return "Operation Success"
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const addProduct = async (msisdn: string|null , productId: string, productName: string): Promise<"Success"> => {
    try {
        await axiosInstanceOfmDirectCall.post(
            BackendEndpoints.ADD_PRODUCT,
            {
                msisdn,
                productId,
                productName
            }
        );
        return "Success"
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const productSuspend = async (msisdn: string|null , productId: string, productName: string): Promise<"Success"> => {
    try {
        await axiosInstanceOfmDirectCall.post(
            BackendEndpoints.PRODUCT_SUSPEND,
            {
                msisdn,
                productId,
                productName
            }
        );
        return "Success"
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}

export const productResume = async (msisdn: string|null , productId: string, productName: string): Promise<"Success"> => {
    try {
        await axiosInstanceOfmDirectCall.post(
            BackendEndpoints.PRODUCT_RESUME,
            {
                msisdn,
                productId,
                productName
            }
        );
        return "Success"
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
}
