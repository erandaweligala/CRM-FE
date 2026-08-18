import { useNavigate, useParams } from "react-router-dom";
import {
    Button,
    Space,
} from "antd";
import React, { useEffect, useState } from "react";
import { getLeadById, getLeadOpportunityInfoById, } from "../accounts-page/services/Account.services.ts";

import "../common-styling/SinglePage.scss";
import { getDealStage } from "../opportunity-page/services/Deals.services.ts";
import ConvertLeadToOpportunity from "../leads-page/components/convert-lead-to-opportunity/ConvertLeadToOpportunity.tsx";
import EntityDetail from "../common-models/EntityDetail.ts";
import DropdownValue from "../common-models/DropdownValueStage.ts";
import { EnterpriseCrmComponent } from "../../../../constants/EnterpriseCrmComponent.const.ts";
import { BASE_PATH } from "../../../../constants/internal-routes.ts";
import { customerProfileAction } from "../../../../store/customer-profile.slice.ts";
import { useAppDispatch } from "../../../../store/main-store.ts";
import { LeadOpportunityInfo } from "./models/LeadOpportunityInfo.model.ts";
import { BSS_Breadcrumb as BssBreadcrumb } from "bss-component-library";
import CommonSections from "../common-components/common-sections/CommonSections.tsx";
import formatCommonSectionResponse from "../common-functions/formatCommonSectionResponse.ts";
import DEFAULT_SECTION from "../constants/default-sections.const.ts";
import { EnterpriseCrmOperationsType } from "../../../../model/EnterpriseCrmOperations.type.ts";
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
    section: "Opportunity Information",
    columnIndex: "1",
    rowIndex,
    isRequired: false,
    isDeletable: false,
    targetPath:"",
});
const SingleLeadPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { id } = useParams();
    const operation: EnterpriseCrmOperationsType = "EDIT";
    const [filteredDetails, setFilteredDetails] = useState<{ title: string; accountDetails: EntityDetail[] }[]>([]);
    const [dynamicSectionKeys, setDynamicSectionKeys] = useState<string[]>([]);
    const [selectedSection, setSelectedSection] = useState<string>();
    const [isLeadUpdateEntityDrawerOpen, setIsLeadUpdateEntityDrawerOpen] = useState<boolean>(false);
    const [editFormData, setEditFormData] = useState<EntityDetail[]>();
    const [isConvertToDealDrawerOpen, setIsConvertToDealDrawerOpen] = useState<boolean>(false);
    const ref = React.useRef<{ [key: string]: HTMLDivElement }>({});
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [breadcrumbDisplayName, setBreadcrumbDisplayName] = useState<string>("");
    const [dealStageList, setDealStageList] = useState<DropdownValue[]>();
    const [OpportunityInfo, setOpportunityInfo] = useState<LeadOpportunityInfo>();
   
     const [canConvert, setCanConvert] = useState(false);


    useEffect(() => {
        loadViewEntityData();
        getDealStageList();
    }, [id]);

    const loadViewEntityData = async () => {
        const response = await getLeadById(id!, "view");
        const { formattedSections, formattedResponse } = formatCommonSectionResponse(response);
        const status = response.find((input) => input.inputId === "56")?.value;
        const leadName = response.find((input) => input.inputId === "95")?.value;

        const sections = [...formattedSections];
        const accountDetailsFiltered = [...formattedResponse];
        const brcStatus = response.find(
                (item) => item.targetPath === "ACCOUNT_STATUS"
                )?.value;

                setCanConvert(brcStatus === "brcApproved");

        if (["ConvertedToDeal", "ConvertedToOpportunity"].includes(status ?? "")) {
            const apiResponse = await getLeadOpportunityInfoById(id!);
            if (apiResponse?.length) {
                const opportunityInfo: EntityDetail[] = [
                    createEntityDetail("Opportunity ID", apiResponse[0].dealId, "1"),
                    createEntityDetail("Opportunity Name", apiResponse[0].dealName, "2"),
                ];
                sections.push("Opportunity Information");
                accountDetailsFiltered.push({
                    title: "Opportunity Information",
                    accountDetails: opportunityInfo,
                });
                setOpportunityInfo(apiResponse[0]);
            }
        }

        setSelectedSection(sections[0]);
        setDynamicSectionKeys(sections);
        setFilteredDetails(accountDetailsFiltered);
        setBreadcrumbDisplayName(leadName ?? "Lead Name Not Available");
    };

    const scrollToOption = (section: string): ScrollToOptions => {
        return {
            behavior: "instant",
            top: ref.current[section].offsetTop,
        };
    };

    const openEditDrawer = () => {
        getLeadById(id!, "edit-create").then((response) => {
            setEditFormData(response);
            setIsLeadUpdateEntityDrawerOpen(true);
        });
    };

    const openConvertToDealDrawer = () => {
        setIsConvertToDealDrawerOpen(true);
    };

    const getDealStageList = async () => {
        const response = await getDealStage();
        const updatedValues = response.map((items) => {
            return {
                label: items.label,
                value: items.value,
                id: Number(items.id),
                allowedTransitions: items.allowedTransitions || [],
                statusOrder: items.statusOrder,
            };
        });

        setDealStageList(updatedValues);
    };

    const redirectToOpportunity = () => {
        const leadID = OpportunityInfo?.dealId;

        if (leadID) {
            dispatch(customerProfileAction.clearStore());
            navigate(BASE_PATH + "/deals/" + leadID);
        }
    }

    const reloadAndCloseDrawer = () => {
        loadViewEntityData();
        setIsLeadUpdateEntityDrawerOpen(false);
    };

    const closeDrawerWithoutReload = () => {
        setIsLeadUpdateEntityDrawerOpen(false);
    };
    return (
        <>
            <div>
                <BssBreadcrumb>
                    <BssBreadcrumb.Section>CRM</BssBreadcrumb.Section>
                    <BssBreadcrumb.Section>View Single Lead</BssBreadcrumb.Section>
                    <BssBreadcrumb.Section>{`${breadcrumbDisplayName}`}</BssBreadcrumb.Section>
                    <BssBreadcrumb.RightContent>
                    {operation === "EDIT" && (
                        <Space size="small">
                        <Button
                            type="primary"
                            size="small"
                            onClick={openConvertToDealDrawer}
                            disabled={!canConvert}
                        >
                            Convert to Opportunity
                        </Button>
                        <Button
                            type="primary"
                            size="small"
                            onClick={openEditDrawer}
                        >
                            Edit Lead
                        </Button>
                        </Space>
                    )}
                    </BssBreadcrumb.RightContent>

                </BssBreadcrumb>
            </div>

            <div
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

                        <CommonSections
                            formattedResponse={filteredDetails}
                            setRef={(el, sectionName) => {
                                ref.current[sectionName] = el!
                            }}
                            redirectTo={() => { redirectToOpportunity() }}
                        />

                        <Notes
                            operation={"EDIT"}
                            entityId={id!}
                            component={EnterpriseCrmComponent.LEADS}
                            setRef={(el) => (ref.current[DEFAULT_SECTION.Notes] = el!)}
                        />

                        <Attachments
                            operation={"EDIT"}
                            entityId={id!}
                            component={EnterpriseCrmComponent.LEADS}
                            setRef={(el) => (ref.current[DEFAULT_SECTION.Attachments] = el!)}
                        />

                        <Meeting
                            operation={"EDIT"}
                            entityId={id!}
                            component={EnterpriseCrmComponent.LEADS}
                            setRef={(el) => (ref.current[DEFAULT_SECTION.Meeting] = el!)}
                        />

                        <Tasks
                            operation={"EDIT"}
                            entityId={id!}
                            component={EnterpriseCrmComponent.LEADS}
                            setRef={(el) => (ref.current[DEFAULT_SECTION.Tasks] = el!)}
                        />

                        <Calls
                            operation={"EDIT"}
                            entityId={id!}
                            component={EnterpriseCrmComponent.LEADS}
                            setRef={(el) => (ref.current[DEFAULT_SECTION.Calls] = el!)}
                        />

                        <Emails
                            operation={"EDIT"}
                            entityId={id!}
                            component={EnterpriseCrmComponent.LEADS}
                            setRef={(el) => (ref.current[DEFAULT_SECTION.Email] = el!)}
                        />
                    </div>
                </div>
            </div>

            <CrmEntityForm
                isDrawerOpen={isLeadUpdateEntityDrawerOpen}
                closeDrawer={(doReload: boolean) => doReload ? reloadAndCloseDrawer() : closeDrawerWithoutReload()}
                entityType={EnterpriseCrmComponent.LEADS}
                operation="EDIT"
                editFormData={editFormData}
                editEntityId={id}
            />

            <ConvertLeadToOpportunity
                filteredDetails={filteredDetails}
                dealStageList={dealStageList}
                loadViewEntityData={loadViewEntityData}
                isConvertToDealDrawerOpen={isConvertToDealDrawerOpen}
                closeConvertToDealDrawer={() => setIsConvertToDealDrawerOpen(false)}
                id={id!}
            />

        </>
    );
};

export default SingleLeadPage;

