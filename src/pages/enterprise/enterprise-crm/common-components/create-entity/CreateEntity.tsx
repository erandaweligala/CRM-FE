import {FC, useEffect, useState} from "react";
import {Button, DatePicker, Drawer, Form, Input, Select} from "antd";
import EformsModel from "../../accounts-page/models/Eforms.model.ts";
import {FormInputErrorMessages} from "../../../../../constants/form-input-error-messages.ts";
import notificationService from "../../../../../services/notification.service.tsx";

import dayjs from "dayjs";
import {
    getAllAccountList,
    getAllContactList,
    getAllSystemUsersList
} from "../../../../../services/common-meta-data.service.ts";
import {
    createAccount,
    createContact,
    createLead,
    getAccountFormList,
    getContactFormList,
    getDropdownValues,
    getFormDetailsByFormId,
    getLeadFormList,
    updateAccount,
    updateContact,
    updateLead,
    getDealFormList, createDeal, updateDeal
} from "../../accounts-page/services/Account.services.ts";
import currency from "../../../../../constants/currency-units.ts";
import TextArea from "antd/es/input/TextArea";
import { EnterpriseCrmComponent } from "../../../../../constants/EnterpriseCrmComponent.const.ts";
import DropdownValue from "../../common-models/DropdownValue.ts";
import EntityDetail from "../../common-models/EntityDetail.ts";
import { BSS_Container as BssContainer, BSS_SquareButton as BssSquareButton } from "bss-component-library";
import { Rule } from "antd/lib/form/index";
interface CreateEntityProps {
    isDrawerOpen: boolean;
    closeDrawer: (doReload: boolean) => void;
    entityType: EnterpriseCrmComponent;
    operation: "NEW" | "EDIT",
    editFormData?: EntityDetail[];
    editEntityId?: string;
}

const getDrawerTitle = (entityType: EnterpriseCrmComponent, operation: "NEW" | "EDIT") => {
    const titles: Record<EnterpriseCrmComponent, { NEW: string; EDIT: string }> = {
        [EnterpriseCrmComponent.ACCOUNTS]: { NEW: "Create New Account", EDIT: "Edit Account" },
        [EnterpriseCrmComponent.CONTACTS]: { NEW: "Create New Contact", EDIT: "Edit Contact" },
        [EnterpriseCrmComponent.LEADS]: { NEW: "Create New Leads", EDIT: "Edit Leads" },
        [EnterpriseCrmComponent.DEALS]: { NEW: "Create New Opportunity", EDIT: "Edit Opportunity" },
    };
    const entityTitles = titles[entityType];
    if (!entityTitles) throw new Error("Incorrect Entity Type");

    return entityTitles[operation];
};

export const CreateLeadAccountInformationSectionName = "Account Information";
export const CreateLeadContactInformationSectionName = "Contact Information";
const CreateEntity: FC<CreateEntityProps> = ({
                                                 isDrawerOpen,
                                                 closeDrawer,
                                                 entityType,
                                                 operation,
                                                 editFormData,
                                                 editEntityId
                                             }) => {

    const [entityFormList, setEntityFormList] = useState<EformsModel[]>([]);
    const [selectedFormDetails, setSelectedFormDetails] = useState<EntityDetail[]>([]);
    const [selectedFormId, setSelectedFormId] = useState<string>();
    const [formattedSelectedFormDetails, setFormattedSelectedFormDetails]
        = useState<{ sectionName: string; sectionInputs: EntityDetail[] }[]>([]);

    const [dropdownValues, setDropdownValues] = useState<Record<string, DropdownValue[]>>({});
    const [filteredAccountList, setFilteredAccountList] = useState<DropdownValue[]>([]);
    const [filteredContactList, setFilteredContactList] = useState<DropdownValue[]>([]);
    const [selectedAccountId, setSelectedAccountId] = useState<string>();
    const [selectedContactId, setSelectedContactId] = useState<string>();
    const [newRows, setNewRows] = useState(10);

    const [form] = Form.useForm();

    useEffect(() => {
      if (!isDrawerOpen) return;
    
      const loadInitialData = async () => {
        if (operation === "NEW") {
          await handleNewOperation();
        }
    
        if (operation === "EDIT" && editFormData) {
          await handleEditOperation(editFormData);
        }
      };
    
      loadInitialData();
    }, [entityType, isDrawerOpen]);

    const handleNewOperation = async () => {
      if (entityFormList.length > 0) return;
    
      const formList = await loadFormListForEntity(entityType);
      setEntityFormList(formList);
      if (formList.length > 0) {
        await selectAForm(formList[0].id);
      }
    };
    const loadFormListForEntity = async (entity: string): Promise<EformsModel[]> => {
      switch (entity) {
        case EnterpriseCrmComponent.ACCOUNTS:
          return await getAccountFormList();
        case EnterpriseCrmComponent.CONTACTS:
          return await getContactFormList();
        case EnterpriseCrmComponent.LEADS:
          return await getLeadFormList();
        case EnterpriseCrmComponent.DEALS:
          return await getDealFormList();
        default:
          return [];
      }
    };
    const handleEditOperation = async (formData: EntityDetail[]) => {
      await formatFormDetails(formData);
    
      const formValues = buildFormValuesFromEditData(formData);
      form.setFieldsValue(formValues);
    
      if (entityType === EnterpriseCrmComponent.LEADS) {
        handleLeadDropdownPopulation(formData);
      }
    };
    
    const buildFormValuesFromEditData = (formData: EntityDetail[]) => {
      const values: { [key: string]: any } = {};
    
      formData.forEach((element) => {
        if (element.inputType === "DATE") {
          values[element.inputId] = element.value ? dayjs(element.value, "YYYY-MM-DD") : undefined;
        } else {
          values[element.inputId] = element.value;
        }
      });
    
      return values;
    };
    
    const handleLeadDropdownPopulation = (formData: EntityDetail[]) => {
      const accountInput = formData.find(
        (item) => item.section === CreateLeadAccountInformationSectionName && item.inputType === "ACCOUNT_LIST"
      );
    
      const contactInput = formData.find(
        (item) => item.section === CreateLeadContactInformationSectionName && item.inputType === "CONTACT_LIST"
      );
    
      if (accountInput?.value) {
        onChangeLeadAccountOrContactDropdown("ACCOUNT_LIST", accountInput.value);
      }
    
      if (contactInput?.value) {
        onChangeLeadAccountOrContactDropdown("CONTACT_LIST", contactInput.value);
      }
    };
    

    const selectAForm = async (formId: string) => {

        const defaultFormDetails = await getFormDetailsByFormId(formId);
        setSelectedFormId(formId);

        await formatFormDetails(defaultFormDetails);

    }
    const formatFormDetails = async (defaultFormDetails: EntityDetail[]) => {

        setSelectedFormDetails(defaultFormDetails);

        const formattedFormDetails: { sectionName: string; sectionInputs: EntityDetail[] }[] = [];

        defaultFormDetails.forEach((singleEntityDetail) => {

            const formattedFormDetailsIndex = formattedFormDetails.findIndex((singleFormattedFormDetail) => {
                return singleFormattedFormDetail.sectionName === singleEntityDetail.section;
            });

            if (formattedFormDetailsIndex === -1) {
                formattedFormDetails.push({
                    sectionName: singleEntityDetail.section,
                    sectionInputs: [singleEntityDetail]
                });
            } else {
                formattedFormDetails[formattedFormDetailsIndex].sectionInputs.push(singleEntityDetail);
            }

        });

        formattedFormDetails.forEach((singleSection) => {
            singleSection.sectionInputs.sort((a, b) => {
                return parseInt(a.rowIndex) - parseInt(b.rowIndex)
            })
        });
        const promiseArray: Promise<DropdownValue[]>[] = [];
        const formInputIdArray: string[] = [];

        formattedFormDetails.forEach((singleSection) => {
            singleSection.sectionInputs.forEach((singleFormInput) => {
                if (singleFormInput.inputType === "LIST") {
                    promiseArray.push(getDropdownValues(singleFormInput.inputId));
                    formInputIdArray.push(singleFormInput.inputId)
                } else if (singleFormInput.inputType === "USER_LIST") {
                    promiseArray.push(getAllSystemUsersList());
                    formInputIdArray.push(singleFormInput.inputId)
                } else if (singleFormInput.inputType === "ACCOUNT_LIST") {
                    promiseArray.push(getAllAccountList());
                    formInputIdArray.push(singleFormInput.inputId)
                } else if (singleFormInput.inputType === "CONTACT_LIST") {
                    promiseArray.push(getAllContactList());
                    formInputIdArray.push(singleFormInput.inputId)
                }else if (singleFormInput.inputType ==="CURRENCY_UNIT_LIST"){
                    promiseArray.push(Promise.resolve(currency));
                    formInputIdArray.push(singleFormInput.inputId)
                }
            })
        });

        const allDropdownValues = await Promise.all(promiseArray);

        const tempDropdownValue: Record<string, DropdownValue[]> = {}

        allDropdownValues.forEach((singleDropdownValue, index) => {
            tempDropdownValue[formInputIdArray[index]] = singleDropdownValue;
        });

        setDropdownValues(tempDropdownValue);
        setFormattedSelectedFormDetails(formattedFormDetails);

    }
    const submitForm = async (formData: Record<string, any>) => {
      const requestBody = buildRequestBody(formData);
  
      const handlers: Record<string, Record<string, () => Promise<void>>> = {
        accounts: {
              NEW: async () => { await createAccount(selectedFormId!, requestBody); },
              EDIT: async () => { await updateAccount(editEntityId!, requestBody); }
          },
          contacts: {
              NEW: async () => { await createContact(selectedFormId!, requestBody); },
              EDIT: async () => { await updateContact(editEntityId!, requestBody); }
          },
          leads: {
              NEW: async () => { await createLead(selectedFormId!, requestBody); },
              EDIT: async () => { await updateLead(editEntityId!, requestBody); }
          },
          deals: {
              NEW: async () => { await createDeal(selectedFormId!, requestBody); },
              EDIT: async () => { await updateDeal(editEntityId!, requestBody); }
          }
      };
  
      const successMessages: Record<string, Record<string, string>> = {
        accounts: {
              NEW: "Account Created Successfully",
              EDIT: "Account Updated Successfully"
          },
          contacts: {
              NEW: "Contact Created Successfully",
              EDIT: "Contact Updated Successfully"
          },
          leads: {
              NEW: "Lead Created Successfully",
              EDIT: "Lead Updated Successfully"
          },
          deals: {
              NEW: "Opportunity Created Successfully",
              EDIT: "Opportunity Updated Successfully"
          }
      };
  
      const entityKey = entityType as keyof typeof handlers;
      const operationKey = operation as keyof typeof handlers[typeof entityKey];
      console.log("entityKey", entityKey, "operationKey", operationKey);
      await handlers[entityKey][operationKey]();
      postSubmission(successMessages[entityKey][operationKey]);
  };
  
  const buildRequestBody = (formData: Record<string, any>) => {
      return selectedFormDetails.map(({ inputId, inputType }) => {
          const value = formData[inputId];
          const formattedValue =
              inputType === "DATE" && value
                  ? (value as dayjs.Dayjs).format("YYYY-MM-DD")
                  : value;
          return { inputId, value: formattedValue };
      });
  };
  
  const postSubmission = (message: string) => {
      form.resetFields();
      closeDrawer(true);
      notificationService("SUCCESS", message);
  };
  

    const isInputFieldDisable = (entity: EntityDetail) => {

        if (
            (
                entityType === EnterpriseCrmComponent.LEADS &&
                entity.section === CreateLeadAccountInformationSectionName &&
                entity.inputType !== "ACCOUNT_LIST" &&
                selectedAccountId
            ) || (
                entityType === EnterpriseCrmComponent.LEADS &&
                entity.section === CreateLeadContactInformationSectionName &&
                entity.inputType !== "CONTACT_LIST" &&
                selectedContactId
            )
        ) {
            return true;
        } else {
            return false;
        }

    }

    const onChangeLeadAccountOrContactDropdown = (dropdownType: "ACCOUNT_LIST" | "CONTACT_LIST", dropdownValue: string) => {
      const isAccount = dropdownType === "ACCOUNT_LIST";
      const isContact = dropdownType === "CONTACT_LIST";
    
      if (isAccount) {
        setSelectedAccountId(dropdownValue);
      } else if (isContact) {
        setSelectedContactId(dropdownValue);
      }
    
      const formDetails: EntityDetail[] =
        operation === "EDIT" ? editFormData! : selectedFormDetails;
    
      const sectionName = isAccount
        ? CreateLeadAccountInformationSectionName
        : CreateLeadContactInformationSectionName;
    
      const excludedInput = isAccount ? "ACCOUNT_LIST" : "CONTACT_LIST";
    
      clearSectionFields(formDetails, sectionName, excludedInput);
    
      if (isAccount) {
        getContactRelatedAccount(dropdownValue);
      } else {
        getAccountRelatedContacts(dropdownValue);
      }
    };
    const clearSectionFields = (
      formDetails: EntityDetail[],
      section: string,
      excludedInputType: string
    ) => {
      formDetails.forEach((field) => {
        if (field.section === section && field.inputType !== excludedInputType) {
          form.setFieldValue(field.inputId, undefined);
        }
      });
    };
    const getAccountRelatedContacts = async (contactId:string) => {
        const response = await getAllAccountList(contactId);
        setFilteredAccountList(response);
    }
    const getContactRelatedAccount = async (accountId:string) => {
        const response = await getAllContactList(accountId);
        setFilteredContactList(response);
    }
    const getDescriptionChangeHandler = (inputId: string) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const inputValue = e.target.value;
        const wordCount = inputValue.split(/\s+/).filter(word => word).length;
        const updatedRows = Math.min(Math.max(Math.ceil(wordCount / 10), 5), 20);
    
        form.setFieldsValue({ [inputId]: inputValue });
        setNewRows(updatedRows);
    };
    const renderTextInput = (input: EntityDetail) => {
        if (["143", "144"].includes(input.inputId)) return null;
      
        const rules: Rule[] = [
            {
              required: input.isRequired && !isInputFieldDisable(input),
              message: FormInputErrorMessages.REQUIRED,
            },
          ];
          
          if (input.inputLable === "Revenue") {
            rules.push({
              pattern: /^\d+$/,
              message: "Please enter a valid integer value",
            });
          }
          
      
        return (
          <Form.Item
            key={input.inputId}
            name={input.inputId}
            label={input.inputLable}
            rules={rules}
            style={{ marginBottom: 16 }}
          >
            {input.inputLable === "Description" ? (
              <TextArea
                showCount
                maxLength={1000}
                rows={newRows}
                placeholder="Description"
                onChange={getDescriptionChangeHandler(input.inputId)}
              />
            ) : (
              <TextArea
                showCount
                maxLength={50}
                rows={1}
                disabled={isInputFieldDisable(input)}
              />
            )}
          </Form.Item>
        );
      };
      
      const renderEmailInput = (input: EntityDetail) => (
        <Form.Item
          key={input.inputId}
          name={input.inputId}
          label={input.inputLable}
          rules={[
            {
              required: input.isRequired && !isInputFieldDisable(input),
              message: FormInputErrorMessages.REQUIRED,
            },
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
          ]}
        >
          <Input disabled={isInputFieldDisable(input)} />
        </Form.Item>
      );
      const renderDateInput = (input: EntityDetail) => (
        <Form.Item
          key={input.inputId}
          name={input.inputId}
          label={input.inputLable}
          rules={[
            {
              required: input.isRequired && !isInputFieldDisable(input),
              message: FormInputErrorMessages.REQUIRED,
            },
            {
              validator: (_, value) => {
                if (!value || value === '' || value === null || value === undefined) {
                  return Promise.reject(new Error("Date is required"));
                }
                if (!dayjs(value).isValid()) {
                  return Promise.reject(new Error("Invalid date format"));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <DatePicker className="w-100" disabled={isInputFieldDisable(input)} />
        </Form.Item>
      );
      const renderNumberOrPhoneInput = (input: EntityDetail) => {
        const rules: Rule[] = [
          {
            required: input.isRequired && !isInputFieldDisable(input),
            message: FormInputErrorMessages.REQUIRED,
          },
        ];
      
        if (input.inputType === "NUMBER") {
          rules.push({
            pattern: /^\d+$/,
            message: "Please enter a valid number",
          });
        }
      
        if (input.inputType === "PHONE") {
          rules.push({
            pattern: /^\+\d{1,3}\d{4,14}$/,
            message: "Please enter a valid phone number with country code (e.g. +94123456789)",
          });
        }
      
        if (["Amount", "Revenue Value", "Annual Revenue"].includes(input.inputLable)) {
          rules.push({
            pattern: /^\d+$/,
            message: "Please enter a valid integer value",
          });
        }
      
        return (
          <Form.Item
            key={input.inputId}
            name={input.inputId}
            label={input.inputLable}
            rules={rules}
          >
            <Input disabled={isInputFieldDisable(input)} />
          </Form.Item>
        );
      };
      const renderDropdownInput = (input: EntityDetail) => {
        if (isBlockedInput(input)) return null;
      
        const options = getDropdownOptions(input);
        const enableSearch = shouldEnableSearch(input);
        const shouldRender = shouldRenderDefaultDropdown(input);
      
        switch (input.inputType) {
          case "ACCOUNT_LIST":
            return renderFormItem(options, input, (value) =>
              onChangeLeadAccountOrContactDropdown("ACCOUNT_LIST", value)
            );
      
          case "CONTACT_LIST":
            return renderFormItem(options, input, (value) =>
              onChangeLeadAccountOrContactDropdown("CONTACT_LIST", value)
            );
      
          default:
            if (shouldRender) {
              return renderFormItem(
                options,
                input,
                undefined,
                enableSearch,
                commonFilterOption
              );
            }
            return null;
        }
      };
      const isBlockedInput = (input: EntityDetail) => {
        const isStageEditBlock =
          input.inputLable === "Stage" &&
          entityType === EnterpriseCrmComponent.DEALS &&
          operation === "EDIT";
      
        return isStageEditBlock || Number(input.inputId) === 142;
      };
      
      const shouldRenderDefaultDropdown = (input: EntityDetail) => {
        return !(
          (input.section === CreateLeadAccountInformationSectionName && selectedAccountId) ||
          (input.section === CreateLeadContactInformationSectionName && selectedContactId)
        );
      };
      
      const shouldEnableSearch = (input: EntityDetail) =>
        ["Revenue Unit", "Amount Unit"].includes(input.inputLable);
      
      const commonFilterOption = (inputText: string, option?: any) =>
        (typeof option?.children === "string" &&
          option?.children.toLowerCase().includes(inputText.toLowerCase())) ||
        option?.value?.toString()?.toLowerCase()?.includes(inputText.toLowerCase());
      
      const getDropdownOptions = (input: EntityDetail) => {
        if (input.inputType === "ACCOUNT_LIST") {
          return selectedContactId ? filteredAccountList : dropdownValues[input.inputId] || [];
        }
    
        if (input.inputType === "CONTACT_LIST") {
          return selectedAccountId && filteredContactList
            ? filteredContactList
            : dropdownValues[input.inputId] || [];
        }
    
        return dropdownValues[input.inputId] || [];
      };
      const renderFormItem = (
        options: DropdownValue[],
        input: EntityDetail,
        onChange?: (value: string) => void,
        showSearch?: boolean,
        filterOption?: (input: string, option?: any) => boolean
      ) => (
        <Form.Item
          key={input.inputId}
          name={input.inputId}
          label={input.inputLable}
          rules={[
            {
              required: input.isRequired,
              message: FormInputErrorMessages.REQUIRED,
            },
          ]}
        >
          <Select
            className="w-100"
            onChange={onChange}
            allowClear
            showSearch={showSearch}
            filterOption={filterOption}
          >
            {options.map((item) => (
              <Select.Option key={item.value} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      );

    return (
        <Drawer
            title={getDrawerTitle(entityType, operation)}
            placement="right"
            onClose={() => {
                closeDrawer(false);
                form.resetFields();
            }}
            closeIcon={
                    <BssSquareButton type="CLOSE" className="close-icon"/>
             }
            open={isDrawerOpen}
            width={600}
            className="bss-ui-drawer"
            destroyOnClose={true}
            extra={(
                operation === "NEW" &&
                <Select
                    style={{width: 180}}
                    size="small"
                    value={selectedFormId}
                    onChange={(id) => {
                        form.resetFields();
                        selectAForm(id)
                    }}
                >
                    {
                        entityFormList.map((singleForm) => {
                            return (
                                <Select.Option
                                    value={singleForm.id}
                                    key={singleForm.id}
                                >
                                    {singleForm.name}
                                </Select.Option>
                            )
                        })
                    }
                </Select>
            )}
        >
            <div className="pt-4">
                <Form
                    form={form}
                    name="create-entity-form"
                    onFinish={submitForm}
                    layout="vertical"
                >
                    {
                        formattedSelectedFormDetails.map((singleSection) => {
                            return (
                                <BssContainer
                                    title={singleSection.sectionName}
                                    className="pa-4 mb-3"
                                    key={singleSection.sectionName}
                                >

                                    {singleSection.sectionInputs.map((input) => {
                                        switch (input.inputType) {
                                            case "TEXT_INPUT":
                                                return renderTextInput(input);
                                            case "EMAIL":
                                                return renderEmailInput(input);
                                            case "DATE":
                                                return renderDateInput(input);
                                            case "NUMBER":
                                            case "PHONE":
                                                return renderNumberOrPhoneInput(input);
                                            case "LIST":
                                            case "ACCOUNT_LIST":
                                            case "USER_LIST":
                                            case "CONTACT_LIST":
                                            case "CURRENCY_UNIT_LIST":
                                                return renderDropdownInput(input);
                                            default:
                                                return (
                                                    <Form.Item key={input.inputId} label={input.inputLable} name={input.inputId}>
                                                        <h3>Unknown Form Element Type</h3>
                                                    </Form.Item>
                                                );
                                        }
                                    })}

                                </BssContainer>
                            )
                        })
                    }

                    <div className="bss-ui-drawer-footer text-align-right">
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="primary-btn ml-2"
                        >
                            {operation === "NEW" ? "Create" : "Update"}
                        </Button>
                    </div>

                </Form>

            </div>
        </Drawer>
    )
}

export default CreateEntity;