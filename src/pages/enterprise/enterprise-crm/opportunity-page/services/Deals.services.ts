import NewCommonApiResponse from "../../../../../model/NewCommonApiResponse.ts";
import axiosInstance from "../../../../../services/axios.service.ts";
import BackendEndpoints from "../../../../../constants/backend-endpoints.ts";
import showNotification from "../../../../../services/notification.service.tsx";
import { getErrorHumanReadableMessage } from "../../../../../helpers/backend-errors-human-readable.ts";
import CommonPageDetailsResponse from "../../../../../model/CommonPageDetailsResponse.ts";
import { DropDownResponseModel } from "../../contacts-page/models/DropDownData.response.model.ts";
import { DealsQueryModel } from "../models/DealsQuery.models.ts";
import { DealsTableModel } from "../models/DealsTable.model.ts";
import DealsKanbanViewQueryModel from "../models/DealsKanbanViewQuery.model.ts";
import DealsKanbanViewResponseModel from "../models/DealsKanbanViewResponse.model.ts";
import { ParentQuoteResponseBody} from "../../single-opportunity-page/components/quotation-drawer/models/quotes-response-body-model.ts";

export const getAllDealData = async (
    payload: DealsQueryModel
): Promise<[DealsTableModel[], CommonPageDetailsResponse]> => {
    try {
        const apiResponse = await axiosInstance.post<
            NewCommonApiResponse<DealsTableModel[]>
        >(BackendEndpoints.DEALS_DATA, payload);
        return [apiResponse.data.data, apiResponse.data.pageDetail!];
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
};

export const getAllDealKanbanData = async (
    payload: DealsKanbanViewQueryModel
): Promise<DealsKanbanViewResponseModel[]> => {
    try {
        const apiResponse = await axiosInstance.post<
            NewCommonApiResponse<DealsKanbanViewResponseModel[]>
        >(BackendEndpoints.DEALS_KANBAN_DATA, payload);

        return apiResponse.data.data.sort((a, b) => {
            return parseInt(a.percentage) - parseInt(b.percentage);
        });
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
};

export const getDealStage = async (): Promise<DropDownResponseModel[]> => {
    try {
        const apiResponse = await axiosInstance.get<NewCommonApiResponse<any[]>>(
            BackendEndpoints.DEAL_STAGES
        );
        const response = transformApiResponse(apiResponse.data.data);
        return response;
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
};

export const convertToSalesOrder = async (
  opportunityId: string,
  quoteId: string,
  optionId: string,
  payload: {
    referenceId: string;
    description: string;
    fileName: string;
    content: string;
    createdBy: string | undefined;
  }
):Promise<"SUCCESSFUL"> => {
  try {
    await axiosInstance.post(
      BackendEndpoints.CONVERT_DEAL_TO_SALES_ORDER,
      payload,
      {
        params: {
          opportunityId: opportunityId,
          quoteId: quoteId,
          optionId: optionId,
        },
      }
    );
    return "SUCCESSFUL";
  } catch (error) {
    showNotification("ERROR", getErrorHumanReadableMessage(error));
    throw new Error();
  }
};

export const getQuoteListByParentQuoteId = async (
    parentQuoteId: string
): Promise<ParentQuoteResponseBody> => {
    try {
        const apiResponse = await axiosInstance.get<
            NewCommonApiResponse<ParentQuoteResponseBody>
        >(BackendEndpoints.GET_FULL_QUOTE_DETAILS_BY_PARENT_QUOTE_ID, {
            params: {
                externalId: parentQuoteId,
            },
        });
        return apiResponse.data.data;
    } catch (error) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        throw new Error();
    }
};

export const updateDealStage = async (
    dealId: string,
    stageId: string
): Promise<boolean> => {
    try {
        const response = await axiosInstance.post<NewCommonApiResponse<any>>(
            BackendEndpoints.UPDATE_DEAL_STAGE + dealId,
            { toStageValue: stageId }
        );

        const { code, message, description, data } = response.data;

        if (code === "00" && message === "SUCCESSFUL") {
            showNotification(
                "SUCCESS",
                description || "Opportunity stage updated successfully."
            );
            return true;
        } else {
            let errorMessage = description || "An error occurred.";
            if (data && data.length > 0) {
                errorMessage += ` Missing: ${data.join(", ")}.`;
            }

            showNotification("ERROR", errorMessage);
            return false;
        }
    } catch (error: any) {
        showNotification("ERROR", getErrorHumanReadableMessage(error));
        return false;
    }
};

function transformApiResponse(response: any[]): DropDownResponseModel[] {
    return response.map((item) => ({
        id: item.id,
        value: item.value,
        name: item.name,
        label: item.label,
        isQuotaEnabled: item.is_quota_enabled === "true",
        allowedTransitions: item.allowed_transitions ?? [],
        statusOrder: Number(item.status_order),
    }));
}

export interface SimpleWorkOrderRequest {
  date: string;
  quoteId: string;
  customerName: string;
  customerEmail: string;
}

export const createSimpleWorkOrder = async (
  payload: SimpleWorkOrderRequest
): Promise<DropDownResponseModel[]> => {
  try {
  const apiResponse = await axiosInstance.post<NewCommonApiResponse<any[]>>(
    BackendEndpoints.CREATE_WORK_ORDER,
    payload
  );
  return apiResponse.data.data;
  } catch (error: any) {
    showNotification("ERROR", getErrorHumanReadableMessage(error));
    throw new Error(getErrorHumanReadableMessage(error));
  }
};

// export interface CustomerInfo {
//   name: string;
//   email: string;
//   // contactNo: string;
//   // address: string;
//   // city: string;
//   // postalCode: string;
//   // country: string;
// }

// export interface CreateWorkOrderPayload {
//   quoteId: string;
//   startDate: string;
//   optionId: string;
//   title:string;
//   createdBy?: string;
//   customerInfo: CustomerInfo;
// }

// export const createWorkOrder = async (
//   payload: CreateWorkOrderPayload
// ): Promise<NewCommonApiResponse<any>> => {
//   try {
//     const tokenParams = new URLSearchParams();
//     tokenParams.append("grant_type", "password");
//     tokenParams.append("client_id", "woms-react-web");
//     tokenParams.append("username", "admin");
//     tokenParams.append("password", "admin");

//     const tokenResponse = await axiosInstance.post(
//       BackendEndpoints.CREATE_TOKEN,
//       tokenParams,
//       {
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//       }
//     );

//     const token = tokenResponse.data.access_token;

//     const requestBody = {
//       formTemplate: "wot1",
//       type: "Fixings",
//       branch: "Colombo",
//       documents: [],
//       images: [],
//       customerInfo: {
//         name: payload.customerInfo.name,
//         email: payload.customerInfo.email,
//         primaryContactNo: "0712130891",
//         addressLine1: "Colombo",
//         city: "Colombo",
//         country: "Srilanka",
//         postalCode: "10100",
//       },
//       requestIncidentType: "Incident",
//       customerId: payload.quoteId,
//       createdAt: new Date().toISOString().slice(0, 16).replace("T", " "),
//       updatedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
//       preferredFulfillmentDateTime: payload.startDate,
//       title: payload.title,
//       description: "Fixing Team B Description 2",
//       customerName: payload.customerInfo.name,
//       customerEmail: payload.customerInfo.email,
//       contactNo: "0712130891",
//       address: "Colombo",
//       city: "Colombo",
//       postalCode: "10100",
//       country: "Srilanka",
//     };

//     const response = await axiosInstance.post<NewCommonApiResponse<any>>(
//       BackendEndpoints.CREATE_WORK_ORDER,
//       requestBody,
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );

//     return response.data;

//   } catch (error) {
//     showNotification("ERROR", getErrorHumanReadableMessage(error));
//     throw new Error("Work order creation failed.");
//   }
// };