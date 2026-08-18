import { useParams } from "react-router-dom";
import { Button } from "antd";
import React, { useEffect, useState } from "react";
import { getAccountById } from "../accounts-page/services/Account.services.ts";
import CreateEntity from "../common-components/create-entity/CreateEntity.tsx";
import "../common-styling/SinglePage.scss";
import EntityDetail from "../common-models/EntityDetail.ts";
import { EnterpriseCrmComponent } from "../../../../constants/EnterpriseCrmComponent.const.ts";
import ContactsInAccount from "./components/contacts-in-account/ContactsInAccount.tsx";
import { BSS_Breadcrumb as BssBreadcrumb } from "bss-component-library";
import formatCommonSectionResponse from "../common-functions/formatCommonSectionResponse.ts";
import CommonSections from "../common-components/common-sections/CommonSections.tsx";
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
import AgreementsSection from "./components/agreements/AgreementsSection.tsx";


const SECTION_ORDER = [
  DEFAULT_SECTION.Agreements,
  DEFAULT_SECTION.LinkedContacts,
  DEFAULT_SECTION.Notes,
  DEFAULT_SECTION.Attachments,
  DEFAULT_SECTION.Meeting,
  DEFAULT_SECTION.Tasks,
  DEFAULT_SECTION.Calls,
  DEFAULT_SECTION.Email,
];

const SingleAccountPage = () => {

  const { id } = useParams();
  const operation: EnterpriseCrmOperationsType = "EDIT";
  const [filteredDetails, setFilteredDetails] = useState<{ title: string; accountDetails: EntityDetail[] }[]>([]);
  const [dynamicSectionKeys, setDynamicSectionKeys] = useState<string[]>([]);
  const [selectedSection, setSelectedSection] = useState<string>();
  const [isUpdateEntityDrawerOpen, setIsUpdateEntityDrawerOpen] = useState<boolean>(false);
  const [editFormData, setEditFormData] = useState<EntityDetail[]>();
  const ref = React.useRef<{ [key: string]: HTMLDivElement }>({});
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [breadcrumbDisplayName, setBreadcrumbDisplayName] = useState<string>("");

  useEffect(() => {
    loadViewEntityData();
  }, [id]);

  const loadViewEntityData = () => {
    getAccountById(id!, "view").then((response) => {
      const { formattedSections, formattedResponse } = formatCommonSectionResponse(response);
      setSelectedSection(formattedSections[0]);
      setDynamicSectionKeys(formattedSections);
      setFilteredDetails(formattedResponse);
      const accName = response.find((singleInput) => singleInput.inputId === "1")?.value;
      setBreadcrumbDisplayName(accName ?? "Account Name Not Available");
    });
  };
  const scrollToOption = (section: string): ScrollToOptions => {
    return {
      behavior: "instant",
      top: ref.current[section].offsetTop,
    };
  };

  const openEditDrawer = () => {
    getAccountById(id!, "edit-create").then((response) => {
      setEditFormData(response);
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


  const handleAttachmentSubmitSuccess = () => {
    loadViewEntityData();
  };


  return (
    <>

      <div>
        <BssBreadcrumb>
          <BssBreadcrumb.Section>CRM</BssBreadcrumb.Section>
          <BssBreadcrumb.Section>View Single Account</BssBreadcrumb.Section>
          <BssBreadcrumb.Section>{breadcrumbDisplayName}</BssBreadcrumb.Section>

          <BssBreadcrumb.RightContent>
            {operation === "EDIT" && (
              <div className="breadcrumb-right-content">
                <Button type="primary" size="small" onClick={openEditDrawer}>
                  Edit Account
                </Button>
              </div>
            )}
          </BssBreadcrumb.RightContent>
        </BssBreadcrumb>
      </div>


      <div
        className="view-single-account"
        onScroll={() =>
          mainContainerOnScrollHandler(
            containerRef,
            ref,
            [...dynamicSectionKeys, ...SECTION_ORDER],
            setSelectedSection
          )
        }
        ref={containerRef}
      >
        <div style={{ display: "flex" }}>

          <Navigation
            sections={[...dynamicSectionKeys, ...SECTION_ORDER]}
            selectedSection={selectedSection!}
            onClickMenuItem={(section) => {
              setTimeout(() => setSelectedSection(section), 100);
              containerRef.current?.scrollTo(scrollToOption(section));
            }}
          />


          <div className="w-100" style={{ paddingLeft: "212px" }}>

            <CommonSections
              formattedResponse={filteredDetails}
              setRef={(el, sectionName) => {
                ref.current[sectionName] = el!;
              }}
            />
            <AgreementsSection
              accountId={id!}
              setRef={(el) => (ref.current[DEFAULT_SECTION.Agreements] = el!)}
            />
            {filteredDetails.length > 0 && (
              <ContactsInAccount
                accountId={id!}
                fullAccountDetails={filteredDetails}
                setRef={(reference) => (ref.current[DEFAULT_SECTION.LinkedContacts] = reference!)}
              />
            )}
            <Notes
              operation={operation}
              entityId={id!}
              component={EnterpriseCrmComponent.ACCOUNTS}
              setRef={(el) => (ref.current[DEFAULT_SECTION.Notes] = el!)}
            />

            <Attachments
              operation={operation}
              entityId={id!}
              component={EnterpriseCrmComponent.ACCOUNTS}
              setRef={(el) => (ref.current[DEFAULT_SECTION.Attachments] = el!)}
              onSubmitSuccess={handleAttachmentSubmitSuccess}
            />

            <Meeting
              operation={operation}
              entityId={id!}
              component={EnterpriseCrmComponent.ACCOUNTS}
              setRef={(el) => (ref.current[DEFAULT_SECTION.Meeting] = el!)}
            />

            <Tasks
              operation={operation}
              entityId={id!}
              component={EnterpriseCrmComponent.ACCOUNTS}
              setRef={(el) => (ref.current[DEFAULT_SECTION.Tasks] = el!)}
            />

            <Calls
              operation={operation}
              entityId={id!}
              component={EnterpriseCrmComponent.ACCOUNTS}
              setRef={(el) => (ref.current[DEFAULT_SECTION.Calls] = el!)}
            />

            <Emails
              operation={operation}
              entityId={id!}
              component={EnterpriseCrmComponent.ACCOUNTS}
              setRef={(el) => (ref.current[DEFAULT_SECTION.Email] = el!)}
            />
          </div>
        </div>
      </div>


      <CreateEntity
        isDrawerOpen={isUpdateEntityDrawerOpen}
        closeDrawer={(doReload) => (doReload ? reloadAndCloseDrawer() : closeDrawerWithoutReload())}
        entityType={EnterpriseCrmComponent.ACCOUNTS}
        operation="EDIT"
        editFormData={editFormData}
        editEntityId={id}
      />
    </>
  );
};

export default SingleAccountPage;
