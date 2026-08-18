import {useParams} from "react-router-dom";
import {Button} from "antd";
import React, {useEffect, useState} from "react";
import {getContactById,} from "../accounts-page/services/Account.services.ts";
import EntityDetail from "../common-models/EntityDetail.ts";

import "../common-styling/SinglePage.scss";
import CreateEntity from "../common-components/create-entity/CreateEntity.tsx";
import {EnterpriseCrmComponent} from "../../../../constants/EnterpriseCrmComponent.const.ts";
import LinkedAccountModel from "../accounts-page/models/LinkedAccount.model.ts";
import {BSS_Breadcrumb as BssBreadcrumb} from "bss-component-library";
import CommonSections from "../common-components/common-sections/CommonSections.tsx";
import formatCommonSectionResponse from "../common-functions/formatCommonSectionResponse.ts";
import {EnterpriseCrmOperationsType} from "../../../../model/EnterpriseCrmOperations.type.ts";
import DEFAULT_SECTION from "../constants/default-sections.const.ts";
import mainContainerOnScrollHandler from "../common-functions/mainContainerOnScrollHander.ts";
import Navigation from "../common-components/navigation/Navigation.tsx";
import Attachments from "../common-components/attachments/Attachments.tsx";
import Calls from "../common-components/call/Calls.tsx";
import Emails from "../common-components/emails/Emails.tsx";
import Meeting from "../common-components/meeting/Meeting.tsx";
import Notes from "../common-components/notes/Notes.tsx";
import Tasks from "../common-components/tasks/Tasks.tsx";
import AccountInContact from "./components/accounts-in-contact/AccountInContact.tsx";

const SECTION_ORDER = [
    DEFAULT_SECTION.LinkedAccounts,
    DEFAULT_SECTION.Notes,
    DEFAULT_SECTION.Attachments,
    DEFAULT_SECTION.Meeting,
    DEFAULT_SECTION.Tasks,
    DEFAULT_SECTION.Calls,
    DEFAULT_SECTION.Email,
];
const SingleContactPage = () => {

    const {id} = useParams();
    const operation: EnterpriseCrmOperationsType = "EDIT";
    const [filteredDetails, setFilteredDetails] = useState<{ title: string; accountDetails: EntityDetail[] }[]>([]);
    const [dynamicSectionKeys, setDynamicSectionKeys] = useState<string[]>([]);
    const [selectedSection, setSelectedSection] = useState<string>();
    const [isUpdateEntityDrawerOpen, setIsUpdateEntityDrawerOpen] = useState<boolean>(false);
    const [editFormData, setEditFormData] = useState<EntityDetail[]>();
    const ref = React.useRef<{ [key: string]: HTMLDivElement }>({});
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [breadcrumbDisplayName, setBreadcrumbDisplayName] = useState<string>("");
    const [linkedAccountList, setLinkedAccountList] = useState<LinkedAccountModel[]>([]);

    useEffect(() => {
        loadViewEntityData();
    }, [id]);

    const loadViewEntityData = () => {
        getContactById(id!, "view").then((response) => {
            const {formattedSections, formattedResponse} = formatCommonSectionResponse(response.properties);
            setSelectedSection(formattedSections[0]);
            setDynamicSectionKeys(formattedSections);
            setFilteredDetails(formattedResponse);
            setLinkedAccountList(response.linkedAccounts);
            const contactGivenName = response.properties.find((singleInput) => singleInput.inputId === "11")?.value ?? "Given Name Not Available";
            const contactFamilyName = response.properties.find((singleInput) => singleInput.inputId === "33")?.value ?? "Family Name Not Available";
            setBreadcrumbDisplayName(`${contactGivenName} ${contactFamilyName}`);
        });
    };

    const scrollToOption = (section: string): ScrollToOptions => {
        return {
            behavior: "instant",
            top: ref.current[section].offsetTop,
        };
    };

    const openEditDrawer = () => {
        getContactById(id!, "edit-create").then((response) => {
            setEditFormData(response.properties);
            setIsUpdateEntityDrawerOpen(true);
        });
    };

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
                    <BssBreadcrumb.Section>View Single Contact</BssBreadcrumb.Section>
                    <BssBreadcrumb.Section>{`${breadcrumbDisplayName}`}</BssBreadcrumb.Section>
                    <BssBreadcrumb.RightContent>
                        {operation === "EDIT" && (
                            <div className="breadcrumb-right-content">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="small"
                                    onClick={() => openEditDrawer()}
                                >
                                    Edit Contact
                                </Button>
                            </div>
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

                    <div className="w-100" style={{paddingLeft: "212px"}}>

                        <CommonSections
                            formattedResponse={filteredDetails}
                            setRef={(el, sectionName) => {
                                ref.current[sectionName] = el!
                            }}
                        />

                        <AccountInContact
                            operation={operation}
                            contactId={id!}
                            linkedAccountList={linkedAccountList}
                            reloadParent={loadViewEntityData}
                            setRef={(el) => {ref.current[DEFAULT_SECTION.LinkedAccounts] = el!}}
                        />

                        <Notes
                            operation={operation}
                            entityId={id!}
                            component={EnterpriseCrmComponent.CONTACTS}
                            setRef={(el) => (ref.current[DEFAULT_SECTION.Notes] = el!)}
                        />

                        <Attachments
                            operation={operation}
                            entityId={id!}
                            component={EnterpriseCrmComponent.CONTACTS}
                            setRef={(el) => (ref.current[DEFAULT_SECTION.Attachments] = el!)}
                        />

                        <Meeting
                            operation={operation}
                            entityId={id!}
                            component={EnterpriseCrmComponent.CONTACTS}
                            setRef={(el) => (ref.current[DEFAULT_SECTION.Meeting] = el!)}
                        />

                        <Tasks
                            operation={operation}
                            entityId={id!}
                            component={EnterpriseCrmComponent.CONTACTS}
                            setRef={(el) => (ref.current[DEFAULT_SECTION.Tasks] = el!)}
                        />

                        <Calls
                            operation={operation}
                            entityId={id!}
                            component={EnterpriseCrmComponent.CONTACTS}
                            setRef={(el) => (ref.current[DEFAULT_SECTION.Calls] = el!)}
                        />

                        <Emails
                            operation={operation}
                            entityId={id!}
                            component={EnterpriseCrmComponent.CONTACTS}
                            setRef={(el) => (ref.current[DEFAULT_SECTION.Email] = el!)}
                        />
                    </div>
                </div>
            </div>

            <CreateEntity
                isDrawerOpen={isUpdateEntityDrawerOpen}
                closeDrawer={(doReload) => doReload ? reloadAndCloseDrawer() : closeDrawerWithoutReload()}
                entityType={EnterpriseCrmComponent.CONTACTS}
                operation="EDIT"
                editFormData={editFormData}
                editEntityId={id}
            />

        </>
    );
};

export default SingleContactPage;