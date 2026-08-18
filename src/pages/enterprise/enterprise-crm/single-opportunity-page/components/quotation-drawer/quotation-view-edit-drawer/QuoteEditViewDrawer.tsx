import {FC, lazy, Suspense} from "react";
import {Drawer} from "antd";
import axiosInstance from "../../../../../../../services/axios.service";
import {Quote} from "../models/quotes-response-body-model";
import {BSS_SquareButton} from "bss-component-library";
import LazyLoadingSkeleton from "../../../../../../../components/lazy-loading-skeleton/LazyLoadingSkeleton";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const ViewFullQuotationInfo = lazy(() => import("cpqRemoteApp/ViewFullQuotationInfo"));

interface QuoteEditViewDrawerProps {
    isQuoteEditViewDrawerOpen: boolean;
    closeQuoteEditViewDrawer: () => void;
    operationType?: "EDIT" | "VIEW";
    quoteData: Quote | null;
}

const QuoteEditViewDrawer: FC<QuoteEditViewDrawerProps> = ({
                                                               isQuoteEditViewDrawerOpen,
                                                               closeQuoteEditViewDrawer,
                                                               operationType = "EDIT",
                                                               quoteData
                                                           }) => {

    // const createAxiosInstanceWithBaseURL = (): AxiosInstance => {
    //     const newAxiosInstance = Axios.create({
    //         baseURL: "http://192.168.0.108:30509",
    //         timeout: 10000,
    //     });
    //     setInterceptorsForAxiosInstance(newAxiosInstance);
    //     return newAxiosInstance;
    // };

    return (
        <Drawer
            className="bss-ui-drawer"
            width={1200}
            title={
                <div className="drawer-header">
                   <span className="drawer-title font-2xl-semi-bold">
                      {operationType === "EDIT" ? "Edit Agreement" : "View Agreement"}
                   </span>
                </div>
            }
            open={isQuoteEditViewDrawerOpen}
            onClose={closeQuoteEditViewDrawer}
            closeIcon={
                <BSS_SquareButton type="CLOSE" className="close-icon"/>
             }
            destroyOnClose={true}
            maskClosable={false}
        >
            {
                quoteData && (
                <Suspense fallback={<LazyLoadingSkeleton/>}>
                    <div>
                        <ViewFullQuotationInfo
                            quoteInfo={quoteData}
                            onAddTabClickFromPdfViewer={() => {
                            }}
                            onClickCancelButton={closeQuoteEditViewDrawer}
                            viewOrEdit={{operationValue: operationType}}
                            axiosInstance={axiosInstance}
                        />
                    </div>
                </Suspense>
            )}
        </Drawer>
    );
};

export default QuoteEditViewDrawer;
