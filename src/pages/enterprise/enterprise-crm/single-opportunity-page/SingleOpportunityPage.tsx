import { useNavigate, useParams } from "react-router-dom";
import {
    Button,
} from "antd";
import React, { useEffect, useState } from "react";
import {
    getDealById,
} from "../accounts-page/services/Account.services.ts";

import "../common-styling/SinglePage.scss";
import OpportunityStatusPanel from "../opportunity-page/components/status-section/OpportunityStatusPanel.tsx";
import StatusSectionModel from "../accounts-page/models/StatusSection.model.ts";
import { getDealStage } from "../opportunity-page/services/Deals.services.ts";
import showNotification from "../../../../services/notification.service.tsx";
import ConvertToSaleDrawer from "../opportunity-page/components/convert-to-sale-drawer/ConvertToSaleDrawer.tsx";
import EntityDetail from "../common-models/EntityDetail.ts";
import { EnterpriseCrmComponent } from "../../../../constants/EnterpriseCrmComponent.const.ts";
import ProductDetails from "./components/product-details/ProductDetails.tsx";
import { Quote, QuotesResponseBodyModel } from "./components/quotation-drawer/models/quotes-response-body-model.ts";
import QuotationDetails from "./components/quotation-drawer/QuotationDetails.tsx";
import { getQuotationDetailsList } from "./components/quotation-drawer/services/QuotationDetails.service.ts";
import { BASE_PATH } from "../../../../constants/internal-routes.ts";
import { customerProfileAction } from "../../../../store/customer-profile.slice.ts";
import { useAppDispatch } from "../../../../store/main-store.ts";
import { BSS_Breadcrumb as BssBreadcrumb } from "bss-component-library";
import formatCommonSectionResponse from "../common-functions/formatCommonSectionResponse.ts";
import CommonSections from "../common-components/common-sections/CommonSections.tsx";
import { EnterpriseCrmOperationsType } from "../../../../model/EnterpriseCrmOperations.type.ts";
import DEFAULT_SECTION from "../constants/default-sections.const.ts";
import mainContainerOnScrollHandler from "../common-functions/mainContainerOnScrollHander.ts";
import Navigation from "../common-components/navigation/Navigation.tsx";
import Attachments from "../common-components/attachments/Attachments.tsx";
import Calls from "../common-components/call/Calls.tsx";
import Emails from "../common-components/emails/Emails.tsx";
import Meeting from "../common-components/meeting/Meeting.tsx";
import Notes from "../common-components/notes/Notes.tsx";
import Tasks from "../common-components/tasks/Tasks.tsx";
import CrmEntityForm from "../common-components/crm-entity-form/CrmEntityForm.tsx";

const SECTION_ORDER = [
    DEFAULT_SECTION.ProductDetails,
    DEFAULT_SECTION.Quotes,
    DEFAULT_SECTION.Notes,
    DEFAULT_SECTION.Attachments,
    DEFAULT_SECTION.Meeting,
    DEFAULT_SECTION.Tasks,
    DEFAULT_SECTION.Calls,
    DEFAULT_SECTION.Email,
];

const createEntityDetail = (label: string, value: string, rowIndex: string): EntityDetail => ({
    inputType: "TEXT_INPUT",
    inputId: "",
    inputLable: label,
    value,
    section: "Lead Information",
    columnIndex: "1",
    rowIndex,
    isRequired: false,
    isDeletable: false,
    targetPath:""
});

const SingleOpportunityPage = () => {
    const navigate = useNavigate();
    const { component, id } = useParams();
    const dispatch = useAppDispatch();
    const operation: EnterpriseCrmOperationsType = "EDIT";
    const [filteredDetails, setFilteredDetails] = useState<{ title: string; accountDetails: EntityDetail[] }[]>([]);
    const [dynamicSectionKeys, setDynamicSectionKeys] = useState<string[]>([]);
    const [selectedSection, setSelectedSection] = useState<string>();
    const [isUpdateEntityDrawerOpen, setIsUpdateEntityDrawerOpen] = useState<boolean>(false);
    const [quoteCreationStatus, setQuoteCreationStatus] = useState<boolean>(false);
    const [editFormData, setEditFormData] = useState<EntityDetail[]>();
    const [timeLineData, setTimeLineData] = useState<StatusSectionModel>();
    const ref = React.useRef<{ [key: string]: HTMLDivElement }>({});
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [quoteList, setQuoteList] = useState<Quote[]>([]);
    const [isConvertToSalesDrawer, setIsConvertToSalesDrawer] = useState<boolean>(false);
    const [breadcrumbDisplayName, setBreadcrumbDisplayName] = useState<string>("");
    const [leadID, setLeadID] = useState<string>("");
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        loadViewEntityData();
        getQuoteList();
    }, [id, component]);

    useEffect(() => {
        fetchDealStage();
    }, [timeLineData]);

    const reloadStages = () => {
        loadViewEntityData();
    };
    const redirectToLeads = () => {
        console.log("Lead ID:", leadID);
        if (leadID) {
            navigate(BASE_PATH + "/leads/" + leadID);
            dispatch(customerProfileAction.clearStore());
        }
    }
    const fetchDealStage = async () => {
        try {
            const response = await getDealStage();
            if (Array.isArray(response) && timeLineData?.stage) {
                const matchingStage = response.find((item) =>
                    item.isQuotaEnabled === true && item.value === timeLineData.stage
                );
                setQuoteCreationStatus(!!matchingStage);
            } else {
                setQuoteCreationStatus(false);
            }
        } catch (error) {
            console.error("Error fetching deal stage:", error);
        }
    };

    const loadViewEntityData = async () => {
        if (component !== EnterpriseCrmComponent.DEALS) return;
      
        try {
          const response = await getDealById(id!, "view");
          const { formData, leadInformation = [], timeLineData } = response;
          
          const sections = ["Opportunity Status"];
          const accountDetailsFiltered = [
          ];
          const { formattedSections, formattedResponse } = formatCommonSectionResponse(formData);
          sections.push(...formattedSections);
          accountDetailsFiltered.push(...formattedResponse);
          if (leadInformation.length) {
            const { id: leadId, name: leadName } = leadInformation[0];
            setLeadID(leadId);
            const leadDetails: EntityDetail[] = [
              createEntityDetail("Lead ID", leadId, "1"),
              createEntityDetail("Lead Name", leadName, "2"),
            ];
            sections.push("Lead Information");
            accountDetailsFiltered.push({ title: "Lead Information", accountDetails: leadDetails });
          }
          setSelectedSection(sections[0]);
          setDynamicSectionKeys(sections);
          setFilteredDetails(accountDetailsFiltered);
          setTimeLineData(timeLineData.at(-1));
          const dealName = formData.find(item => item.inputId === "139")?.value;
          setBreadcrumbDisplayName(dealName ?? "Deal Name Not Available");
        } catch (error) {
          console.error("Error loading view entity data:", error);
        }
      };

      const scrollToOption = (section: string): ScrollToOptions => {
        return {
            behavior: "instant",
            top: ref.current[section].offsetTop,
        };
    };

    const openEditDrawer = () => {
        if (component === EnterpriseCrmComponent.DEALS) {
            getDealById(id!, "edit-create").then((response) => {
                setEditFormData(response.formData);
                setIsUpdateEntityDrawerOpen(true);
            });
        }
    };

    const getQuoteList = async () => {
        if (component === EnterpriseCrmComponent.DEALS) {
            const apiResponse: QuotesResponseBodyModel = await getQuotationDetailsList(id!);
            setQuoteList(apiResponse.quoteList);
        }
    };

    const openConvertToSaleDrawer = () => {
        const isAtLeastOneQuoteApproved = quoteList?.some(
            (quote) => quote.status === "Approved"
        );

        if (isAtLeastOneQuoteApproved) {
            setIsConvertToSalesDrawer(true);
        } else {
            showNotification("WARNING", "At least one quote should be in 'Approved' status");
        }
    }

    const showConvertToSaleButton = (): boolean => {
        return timeLineData?.status === "closedWon";
    }
    const reloadAndCloseDrawer = () => {
        loadViewEntityData();
        setIsUpdateEntityDrawerOpen(false);
    };

    const closeDrawerWithoutReload = () => {
        setIsUpdateEntityDrawerOpen(false);
    };

    return (
        <>
            <div>
                <BssBreadcrumb>
                    <BssBreadcrumb.Section>CRM</BssBreadcrumb.Section>
                    <BssBreadcrumb.Section>
                        View Single Opportunity
                    </BssBreadcrumb.Section>
                    <BssBreadcrumb.Section>
                        {`${breadcrumbDisplayName}`}
                    </BssBreadcrumb.Section>

                    <BssBreadcrumb.RightContent>
                        {(
                            <div className="breadcrumb-right-content">
                                {
                                    showConvertToSaleButton() &&
                                    <Button
                                        type="primary"
                                        className="mr-1" 
                                        htmlType="submit"
                                        onClick={() => openConvertToSaleDrawer()}
                                        size="small"
                                    >
                                        Convert to Sale Order
                                    </Button>
                                }
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    onClick={() => openEditDrawer()}
                                    size="small"
                                >
                                    Edit Opportunity
                                </Button>
                            </div>
                        )}
                    </BssBreadcrumb.RightContent>
                </BssBreadcrumb>
            </div>
            <div
                key={reloadKey}
                className="view-single-account"
                onScroll={() => {
                    mainContainerOnScrollHandler(
                        containerRef,
                        ref,
                        [...dynamicSectionKeys, ...SECTION_ORDER],
                        setSelectedSection
                    )
                }}
                ref={containerRef}
            >
                <div style={{ display: "flex" }}>
                    <Navigation
                        sections={[...dynamicSectionKeys, ...SECTION_ORDER]}
                        selectedSection={selectedSection!}
                        onClickMenuItem={(section) => {
                            setTimeout(() => {
                                setSelectedSection(section);
                            }, 100)
                            containerRef.current?.scrollTo(scrollToOption(section));
                        }}
                    />

                    <div className="w-100" style={{ paddingLeft: "212px" }}>

                        {timeLineData && (
                            <OpportunityStatusPanel
                                reloadStages={reloadStages}
                                currentStatus={timeLineData.stage}
                                dealID={id!}
                                setRef={(reference) => (ref.current[DEFAULT_SECTION.Status] = reference!)}
                            />
                        )}

                        <CommonSections
                            formattedResponse={filteredDetails}
                            setRef={(el, sectionName) => {
                                ref.current[sectionName] = el!
                            }}
                            redirectTo={() => { redirectToLeads() }}
                        />
                        <ProductDetails
                            entityId={id!}
                            setRef={(el) => (ref.current[DEFAULT_SECTION.ProductDetails] = el!)}
                        />
                        <QuotationDetails
                            timeLineData={timeLineData}
                            entityId={id!}
                            filteredDetails={filteredDetails}
                            quoteCreationStatus={quoteCreationStatus}
                            setRef={(el) => (ref.current[DEFAULT_SECTION.Quotes] = el!)}
                        />
                        <Notes
                            operation={operation}
                            entityId={id!}
                            component={EnterpriseCrmComponent.DEALS}
                            setRef={(el) => (ref.current[DEFAULT_SECTION.Notes] = el!)}
                        />

                        <Attachments
                            operation={operation}
                            entityId={id!}
                            component={EnterpriseCrmComponent.DEALS}
                            setRef={(el) => (ref.current[DEFAULT_SECTION.Attachments] = el!)}
                        />

                        <Meeting
                            operation={operation}
                            entityId={id!}
                            component={EnterpriseCrmComponent.DEALS}
                            setRef={(el) => (ref.current[DEFAULT_SECTION.Meeting] = el!)}
                        />

                        <Tasks
                            operation={operation}
                            entityId={id!}
                            component={EnterpriseCrmComponent.DEALS}
                            setRef={(el) => (ref.current[DEFAULT_SECTION.Tasks] = el!)}
                        />

                        <Calls
                            operation={operation}
                            entityId={id!}
                            component={EnterpriseCrmComponent.DEALS}
                            setRef={(el) => (ref.current[DEFAULT_SECTION.Calls] = el!)}
                        />

                        <Emails
                            operation={operation}
                            entityId={id!}
                            component={EnterpriseCrmComponent.DEALS}
                            setRef={(el) => (ref.current[DEFAULT_SECTION.Email] = el!)}
                        />
                    </div>
                </div>
            </div>

            <CrmEntityForm
                isDrawerOpen={isUpdateEntityDrawerOpen}
                closeDrawer={(doReload:boolean) => doReload ? reloadAndCloseDrawer() : closeDrawerWithoutReload()}
                entityType={component as EnterpriseCrmComponent}
                operation={operation}
                editFormData={editFormData}
                editEntityId={id}
            />
            <ConvertToSaleDrawer
                isConvertToSaleDrawerOpen={isConvertToSalesDrawer}
                closeConvertToSaleDrawer={() => {
                    setIsConvertToSalesDrawer(false);
                    setReloadKey(prevKey => prevKey + 1);
                }}
                quoteList={quoteList}
                opportunityId={id!}
            />
        </>
    );
};

export default SingleOpportunityPage;
