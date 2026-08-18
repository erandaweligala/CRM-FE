import React, { useEffect, useState } from 'react';
import { EnterpriseCrmComponent } from '../../../../../constants/EnterpriseCrmComponent.const';
import EntityDetail from '../../common-models/EntityDetail';
import { Button, DatePicker, Descriptions, Drawer, Form, Input, Select } from 'antd';
import EformsModel from '../../accounts-page/models/Eforms.model';
import DropdownValue from '../../common-models/DropdownValue';
import { getLeadFormList, getDealFormList, getAccountById, getContactById, getFormDetailsByFormId, getDropdownValues, createDeal, createLead, updateDeal, updateLead, getAccountFormList, getContactFormList, createAccount, updateAccount, createContact, updateContact } from '../../accounts-page/services/Account.services';
import dayjs from 'dayjs';
import { getAllAccountList, getAllContactList, getAllSystemUsersList } from '../../../../../services/common-meta-data.service';
import currency from '../../../../../constants/currency-units';
import notificationService from '../../../../../services/notification.service';
import TextArea from 'antd/es/input/TextArea';
import { FormInputErrorMessages } from '../../../../../constants/form-input-error-messages';
import { BSS_Container as BssContainer, BSS_EmptyValueHandler as BssEmptyValueHandler, BSS_SquareButton as BssSquareButton } from "bss-component-library";
interface CrmEntityFormProps {
    isDrawerOpen: boolean;
    closeDrawer: (doReload: boolean) => void;
    operation: "NEW" | "EDIT",
    editFormData?: EntityDetail[];
    editEntityId?: string;
    entityType: EnterpriseCrmComponent;
}
const ViewAccountDisplayInputIds: string[] = ["1", "41", "5", "9"]; // Account Name, Account Type, BRN, Industry
const ViewContactDisplayInputIds = ["10", "11", "33", "13"]; // Title, First Name, Last Name, Gender
const CrmEntityForm: React.FC<CrmEntityFormProps> = ({ isDrawerOpen, closeDrawer, operation, editFormData, editEntityId, entityType }) => {
    const [createAccountInformationSectionName, setCreateAccountInformationSectionName] = React.useState<string>("");
    const [createContactInformationSectionName, setCreateContactInformationSectionName] = React.useState<string>("");
    const [entityFormList, setEntityFormList] = useState<EformsModel[]>([]);
    const [selectedFormDetails, setSelectedFormDetails] = useState<EntityDetail[]>([]);
    const [selectedFromId, setSelectedFromId] = useState<string>();
    const [formattedSelectedFormDetails, setFormattedSelectedFormDetails]
        = useState<{ sectionName: string; sectionInputs: EntityDetail[] }[]>([]);

    const [dropdownValues, setDropdownValues] = useState<Record<string, DropdownValue[]>>({});
    const [filteredAccountList, setFilteredAccountList] = useState<DropdownValue[]>([]);
    const [filteredContactList, setFilteredContactList] = useState<DropdownValue[]>([]);
    const [selectedAccountId, setSelectedAccountId] = useState<string>();
    const [selectedAccountDetails, setSelectedAccountDetails] = useState<EntityDetail[]>();
    const [selectedContactId, setSelectedContactId] = useState<string>();
    const [selectedContactDetails, setSelectedContactDetails] = useState<EntityDetail[]>();
    const [newRows, setNewRows] = useState(10);
    const [form] = Form.useForm();
    useEffect(() => {
        if (!isDrawerOpen) return;

        const loadInitialData = async () => {
            resetFormState();

            if (operation === "NEW") {
                await handleNewOperation();
            }

            if (operation === "EDIT" && editFormData) {
                await handleEditOperation(editFormData);
            }
        };

        loadInitialData();
    }, [entityType, isDrawerOpen]);
    useEffect(() => {
        if (selectedAccountId) {
            getAccountById(selectedAccountId, "view")
                .then((response) => {
                    setSelectedAccountDetails(response);
                });
        }
    }, [selectedAccountId]);

    useEffect(() => {
        if (selectedContactId) {
            getContactById(selectedContactId, "view")
                .then((response) => {
                    setSelectedContactDetails(response.properties);
                });
        }
    }, [selectedContactId]);
    useEffect(() => {
        const accountSectionNames: Record<string, string> = {
            leads: "Account Information",
            deals: "Account Details",
        };

        const contactSectionNames: Record<string, string> = {
            leads: "Contact Information",
            deals: "Contact Details",
        };

        if (entityType in accountSectionNames) {
            setCreateAccountInformationSectionName(accountSectionNames[entityType]);
        }
        if (entityType in contactSectionNames) {
            setCreateContactInformationSectionName(contactSectionNames[entityType]);
        }
    }, [entityType]);
    const getDrawerTitle = () => {
        const titles: Record<string, Record<string, string>> = {
            leads: {
                NEW: "Create New Lead",
                EDIT: "Edit Lead",
            },
            deals: {
                NEW: "Create New Opportunity",
                EDIT: "Edit Opportunity",
            },
            accounts: {
                NEW: "Create New Account",
                EDIT: "Edit Account",
            },
            contacts: {
                NEW: "Create New Contact",
                EDIT: "Edit Contact",
            },
        };
        if (entityType in titles) {
            const title = titles[entityType]?.[operation];
            if (title) {
                return title;
            }
        }
    };
    const resetFormState = () => {
        setSelectedAccountId(undefined);
        setSelectedContactId(undefined);
        setSelectedAccountDetails(undefined);
        setSelectedContactDetails(undefined);
        form.resetFields();
    };
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

        const formValues: { [key: string]: any } = {};
        formData.forEach((element) => {
            const value = parseFormElementValue(element);
            if (value !== undefined) {
                formValues[element.inputId] = value;
            }
        });

        form.setFieldsValue(formValues);
        setAccountAndContactDropdowns(formData);
    };
    const parseFormElementValue = (element: EntityDetail) => {
        if (element.inputType === "DATE") {
            return element.value ? dayjs(element.value, "YYYY-MM-DD") : undefined;
        }
        return element.value;
    };
    const setAccountAndContactDropdowns = (formData: EntityDetail[]) => {
        const accountInput = formData.find(
            (el) => el.section === createAccountInformationSectionName && el.inputType === "ACCOUNT_LIST"
        );
        if (accountInput?.value) {
            onChangeLeadAccountOrContactDropdown("ACCOUNT_LIST", accountInput.value);
        }

        const contactInput = formData.find(
            (el) => el.section === createContactInformationSectionName && el.inputType === "CONTACT_LIST"
        );
        if (contactInput?.value) {
            onChangeLeadAccountOrContactDropdown("CONTACT_LIST", contactInput.value);
        }
    };
    const getAccountRelatedContacts = async (contactId: string) => {
        const response = await getAllAccountList(contactId);
        if(response.length > 0) {
           setFilteredAccountList(response);
        }
    }
    const getContactRelatedAccount = async (accountId: string) => {
        const response = await getAllContactList(accountId);
        if(response.length > 0) {
           setFilteredContactList(response);
        }
    }
    const selectAForm = async (formId: string) => {

        const defaultFormDetails = await getFormDetailsByFormId(formId);
        setSelectedFromId(formId);

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
                } else if (singleFormInput.inputType === "CURRENCY_UNIT_LIST") {
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
        if (entityType === "leads" && entityType !== EnterpriseCrmComponent.LEADS) {
            throw new Error("Incorrect Entity Type");
        }
        if (entityType === "deals" && entityType !== EnterpriseCrmComponent.DEALS) {
            throw new Error("Incorrect Entity Type");
        }
        const requestBody = buildRequestBody(formData);
        await handleDealSubmission(requestBody);
        form.resetFields();
        closeDrawer(true);
    };
    const buildRequestBody = (formData: Record<string, any>) => {
        return selectedFormDetails.reduce((acc: { inputId: string; value: string }[], item) => {
            const rawValue = formData[item.inputId];
            if (rawValue === undefined) return acc;

            const value = item.inputType === "DATE" && rawValue
                ? (rawValue as dayjs.Dayjs).format("YYYY-MM-DD")
                : rawValue;

            acc.push({ inputId: item.inputId, value });
            return acc;
        }, []);
    };
    const handleDealSubmission = async (requestBody: { inputId: string; value: string }[]) => {
        const actions = {
            leads: {
                NEW: async () => {
                    await createLead(selectedFromId!, requestBody);
                    notificationService("SUCCESS", "Lead Created Successfully");
                },
                EDIT: async () => {
                    await updateLead(editEntityId!, requestBody);
                    notificationService("SUCCESS", "Lead Updated Successfully");
                }
            },
            deals: {
                NEW: async () => {
                    await createDeal(selectedFromId!, requestBody);
                    notificationService("SUCCESS", "Opportunity Created Successfully");
                },
                EDIT: async () => {
                    await updateDeal(editEntityId!, requestBody);
                    notificationService("SUCCESS", "Opportunity Updated Successfully");
                }
            },
            accounts: {
                NEW: async () => {
                    await createAccount(selectedFromId!, requestBody);
                    notificationService("SUCCESS", "Account Created Successfully");
                },
                EDIT: async () => {
                    await updateAccount(editEntityId!, requestBody);
                    notificationService("SUCCESS", "Account Updated Successfully");
                }
            },
            contacts: {
                NEW: async () => {
                    await createContact(selectedFromId!, requestBody);
                    notificationService("SUCCESS", "Contact Created Successfully");
                },
                EDIT: async () => {
                    await updateContact(editEntityId!, requestBody);
                    notificationService("SUCCESS", "Contact Updated Successfully");
                }
            }
        };
        if (entityType in actions) {
            await actions[entityType]?.[operation]?.();
        }
    };
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
            ? createAccountInformationSectionName
            : createContactInformationSectionName;

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
    const handleOpportunityDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>, inputId: string) => {
        const value = e.target.value;
        const wordCount = value.split(/\s+/).filter(Boolean).length;
        const calculatedRows = Math.min(Math.max(Math.ceil(wordCount / 10), 5), 20);

        form.setFieldsValue({ [inputId]: value });
        setNewRows(calculatedRows);
    };
    const renderFormItem = (input: any, sectionName: string) => {
        const isAccountSection = sectionName === createAccountInformationSectionName;
        const isContactSection = sectionName === createContactInformationSectionName;

        const isAccountSelected = !!selectedAccountId;
        const isContactSelected = !!selectedContactId;

        const isAccountInputHidden =
            isAccountSection && isAccountSelected && input.inputType !== "ACCOUNT_LIST";

        const isContactInputHidden =
            isContactSection && isContactSelected && input.inputType !== "CONTACT_LIST";

        if (isAccountInputHidden || isContactInputHidden) return null;

        if (["143", "144"].includes(input.inputId)) return null;
        
        switch (input.inputType) {
            case "TEXT_INPUT":
                return input.inputLable === "Description"
                    ? renderDescriptionTextArea(input)
                    : renderTextInput(input);

            case "EMAIL":
                return renderEmailInput(input);

            case "NUMBER":
            case "PHONE":
                return renderNumberOrPhoneInput(input);

            case "DATE":
                return renderDatePicker(input);

            case "ACCOUNT_LIST":
            case "CONTACT_LIST":
            case "LIST":
            case "USER_LIST":
            case "CURRENCY_UNIT_LIST":
                return renderDropdown(input);

            default:
                return renderUnknownInput(input);
        }
    };
    const renderEmailInput = (input: any) => (
        <Form.Item
            name={input.inputId}
            label={input.inputLable}
            key={input.inputId}
            rules={[
                { required: input.isRequired, message: FormInputErrorMessages.REQUIRED },
                { type: "email", message: "The input is not valid E-mail!" },
            ]}
            style={{ marginBottom: 16 }}
        >
            <Input />
        </Form.Item>
    );
    const renderDescriptions = (items: any[], allowedIds: string[]) => (
        <Descriptions bordered column={1} className="custom-descriptions">
            {items
                .filter((item) => allowedIds.includes(item.inputId))
                .map((item) => (
                    <Descriptions.Item label={item.inputLable} key={item.inputLable}>
                        <BssEmptyValueHandler value={item.value} />
                    </Descriptions.Item>
                ))}
        </Descriptions>
    );
    const renderDescriptionTextArea = (input: any) => (
        <Form.Item
            name={input.inputId}
            label={input.inputLable}
            key={input.inputId}
            rules={[
                {
                    required: input.isRequired,
                    message: FormInputErrorMessages.REQUIRED,
                },
            ]}
            style={{ marginBottom: 16 }}
        >
            <TextArea
                showCount
                maxLength={1000}
                rows={newRows}
                placeholder="Opportunity Description"
                onChange={(e) => handleOpportunityDescriptionChange(e, input.inputId)}
            />
        </Form.Item>
    );
    const renderTextInput = (input: any) => (
        <Form.Item
            name={input.inputId}
            label={input.inputLable}
            key={input.inputId}
            rules={[
                {
                    required: input.isRequired,
                    message: FormInputErrorMessages.REQUIRED,
                },
                ...(input.inputLable === "Revenue Value"
                    ? [
                        {
                            pattern: /^\d+$/,
                            message: "Please enter a valid integer value",
                        },
                    ]
                    : []),
            ]}
            style={{ marginBottom: 16 }}
        >
            <TextArea showCount maxLength={50} rows={1} />
        </Form.Item>
    );
    const renderNumberOrPhoneInput = (input: any) => (
        <Form.Item
            name={input.inputId}
            label={input.inputLable}
            key={input.inputId}
            rules={[
                {
                    required: input.isRequired,
                    message: FormInputErrorMessages.REQUIRED,
                },
                ...(input.inputType === "NUMBER"
                    ? [
                        {
                            pattern: /^\d+$/,
                            message: "Please enter a valid number",
                        },
                    ]
                    : []),
                ...(input.inputType === "PHONE"
                    ? [
                        {
                            pattern: /^\+\d{1,3}\d{4,14}$/,
                            message:
                                "Please enter a valid phone number with country code (e.g. +94123456789)",
                        },
                    ]
                    : []),
                ...(["Amount", "Revenue Value", "Annual Revenue"].includes(input.inputLable)
                    ? [
                        {
                            pattern: /^\d+$/,
                            message: "Please enter a valid integer value",
                        },
                    ]
                    : []),
            ]}
        >
            <Input />
        </Form.Item>
    );
    const renderDatePicker = (input: any) => (
        <Form.Item
            name={input.inputId}
            label={input.inputLable}
            key={input.inputId}
            rules={[
                {
                    required: input.isRequired,
                    message: FormInputErrorMessages.REQUIRED,
                },
                {
                    validator: (_, value) => {
                        if (value && !dayjs(value).isValid()) {
                            return Promise.reject(new Error("Invalid date format"));
                        }
                        return Promise.resolve();
                    },
                },
            ]}
            style={{ marginBottom: 16 }}
        >
            <DatePicker className="w-100" value={input.value ? dayjs(input.value) : null} />
        </Form.Item>
    );
    const renderDropdown = (input: any) => {
        const options = dropdownValues[input.inputId] || [];
        const isAccountList = input.inputType === "ACCOUNT_LIST";
        const isContactList = input.inputType === "CONTACT_LIST";
        let dataList;
        if (isAccountList && selectedContactId) {
            dataList = filteredAccountList || options;
        } else if (isContactList && selectedAccountId) {
            dataList = filteredContactList || options;
        } else {
            dataList = options;
        }

        const handleChange = (value: string) => {
            if (isAccountList) onChangeLeadAccountOrContactDropdown("ACCOUNT_LIST", value);
            else if (isContactList) onChangeLeadAccountOrContactDropdown("CONTACT_LIST", value);
        };

        return (
            <Form.Item
                name={input.inputId}
                label={input.inputLable}
                key={input.inputId}
                rules={[
                    {
                        required: input.isRequired,
                        message: FormInputErrorMessages.REQUIRED,
                    },
                ]}
            >
                <Select
                    className="w-100"
                    allowClear
                    showSearch={["Revenue Unit", "Amount Unit"].includes(input.inputLable)}
                    filterOption={(inputValue, option) =>
                        (typeof option?.children === "string" && (option.children as string).toLowerCase().includes(inputValue.toLowerCase())) ||
                        (typeof option?.value === "string" && option.value.toLowerCase().includes(inputValue.toLowerCase()))
                    }
                    onChange={handleChange}
                    onClear={() => {
                        if (input.inputType === "ACCOUNT_LIST") {
                            setSelectedAccountDetails(undefined);
                        } else if (input.inputType === "CONTACT_LIST") {
                            setSelectedContactDetails(undefined);
                        }
                    }}
                >
                    {dataList.map((opt: any) => (
                        <Select.Option key={opt.value} value={opt.value}>
                            {opt.label}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
        );
    };
    const renderUnknownInput = (input: any) => (
        <Form.Item
            name={input.inputId}
            label={input.inputLable}
            key={input.inputId}
            style={{ marginBottom: 16 }}
        >
            <h3>Unknown Form Element Type</h3>
        </Form.Item>
    );
    return (
        <Drawer
            title={getDrawerTitle()}
            placement="right"
            onClose={() => {
                closeDrawer(false);
                form.resetFields();
            }}
            open={isDrawerOpen}
            width={600}
            className="bss-ui-drawer"
            destroyOnClose={true}
            closeIcon={
                <BssSquareButton type="CLOSE" className="close-icon" />
            }
            extra={(
                operation === "NEW" &&
                <Select
                    style={{ width: 180 }}
                    size="small"
                    value={selectedFromId}
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
                    {formattedSelectedFormDetails.map((section) => (
                        <BssContainer title={section.sectionName} className="pa-4 mb-3" key={section.sectionName}>
                            {section.sectionInputs.map((input) => renderFormItem(input, section.sectionName))}
                            {section.sectionName === createAccountInformationSectionName &&
                                selectedAccountDetails &&
                                renderDescriptions(selectedAccountDetails, ViewAccountDisplayInputIds)}
                            {section.sectionName === createContactInformationSectionName &&
                                selectedContactDetails &&
                                renderDescriptions(selectedContactDetails, ViewContactDisplayInputIds)}
                        </BssContainer>
                    ))}

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
};

export default CrmEntityForm;