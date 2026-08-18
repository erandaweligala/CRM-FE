import React, { useEffect } from 'react';
import { Button, Form, Input, Select, DatePicker, Descriptions, Drawer } from 'antd';
import { FormInputErrorMessages } from '../../../../../../constants/form-input-error-messages';
import dayjs from 'dayjs';
import currency from '../../../../../../constants/currency-units';
import ConvertLeadToDealRequestModel from '../../models/ConvertLeadToDealRequest.model';
import { convertLeadToDeal } from '../../services/Leads.services';
import {
    CreateLeadAccountInformationSectionName,
    CreateLeadContactInformationSectionName,
} from '../../../common-components/create-entity/CreateEntity';
import DropdownValue from '../../../common-models/DropdownValue';
import EntityDetail from '../../../common-models/EntityDetail';
import { BSS_EmptyValueHandler as BssEmptyValueHandler, BSS_SquareButton as BssSquareButton } from 'bss-component-library';
const AccountNameFormIdInLead = "88";
const ContactFirstNameFormIdInLead = "91";
const ContactLastNameFormIdInLead = "92";
const NameFormIdInLead = "95";


interface ConvertLeadToOpportunityProps {
    filteredDetails: { title: string; accountDetails: EntityDetail[] }[];
    dealStageList: DropdownValue[] | undefined;
    loadViewEntityData: () => void;
    isConvertToDealDrawerOpen: boolean;
    closeConvertToDealDrawer: () => void;
    id: string;
}

const ConvertLeadToOpportunity: React.FC<ConvertLeadToOpportunityProps> = ({
    isConvertToDealDrawerOpen,
    closeConvertToDealDrawer,
    dealStageList,
    loadViewEntityData,
    filteredDetails,
    id,
}) => {
    const [convertToDealForm] = Form.useForm();
    useEffect(() => {

        const dealNameInputElement = filteredDetails[2]?.accountDetails.find(
            (singleInput) => singleInput.inputId === NameFormIdInLead
        );
        if (dealNameInputElement) {
            convertToDealForm.setFieldValue("name", dealNameInputElement.value);
        }

    }, [isConvertToDealDrawerOpen]);
    useEffect(() => {
        if (isConvertToDealDrawerOpen) {
            const dealNameInputElement = filteredDetails[2]?.accountDetails.find(
                (singleInput) => singleInput.inputId === NameFormIdInLead
            );
    
            if (dealNameInputElement) {
                convertToDealForm.setFieldValue("name", dealNameInputElement.value);
            }
    
            const safeDealStageList = dealStageList ?? [];
            if (safeDealStageList.length > 0) {
                convertToDealForm.setFieldValue("status", safeDealStageList[0].label);
            }
    
            if (currency?.length > 0) {
                convertToDealForm.setFieldValue("AMOUNT_UNIT", currency[0].value);
            }
        }
    }, [isConvertToDealDrawerOpen, dealStageList, currency]);
    
    const getAccountName = () => {
        if (isConvertToDealDrawerOpen) {
            return filteredDetails
                .find(
                    (section) => section.title === CreateLeadAccountInformationSectionName
                )!
                .accountDetails.find(
                    (singleInput) => singleInput.inputId === AccountNameFormIdInLead
                )!.value;
        }
    };

    const getContactName = () => {
        if (isConvertToDealDrawerOpen) {
            const contactSection = filteredDetails.find(
                (section) => section.title === CreateLeadContactInformationSectionName
            );
            const firstName = contactSection!.accountDetails.find(
                (singleInput) => singleInput.inputId === ContactFirstNameFormIdInLead
            )?.value;
            const lastName = contactSection!.accountDetails.find(
                (singleInput) => singleInput.inputId === ContactLastNameFormIdInLead
            )?.value;

            return firstName + " " + lastName;
        }
    };

    return (
        <Drawer
            title="Convert Lead To Opportunity"
            placement="right"
            onClose={() => {
                closeConvertToDealDrawer();
            }}
            open={isConvertToDealDrawerOpen}
            width={600}
            className="bss-ui-drawer"
            closeIcon={
                <BssSquareButton type="CLOSE" className="close-icon" />
            }
            destroyOnClose={true}
        >
            <Descriptions bordered column={1} style={{ margin: "8px" }} className="custom-descriptions">
                <Descriptions.Item label="Account Name">
                    <BssEmptyValueHandler value={getAccountName()} />
                </Descriptions.Item>
                <Descriptions.Item label="Contact Name">
                    <BssEmptyValueHandler value={getContactName()} />
                </Descriptions.Item>
            </Descriptions>

            <Form
                name="convert-to-deal-form"
                onFinish={async (formValue) => {
                    console.log("Form Values", formValue);
                    const requestBody: ConvertLeadToDealRequestModel = {
                        createDeal: true,
                        name: formValue.name,
                        closingDate: (formValue.closingDate as dayjs.Dayjs).format(
                            "YYYY-MM-DD"
                        ),
                        status: formValue.status,
                        amount: formValue.AMOUNT_VALUE,
                        unit: formValue.AMOUNT_UNIT
                    };
                    await convertLeadToDeal(id, requestBody);
                    closeConvertToDealDrawer();
                    loadViewEntityData();
                }}
                layout="vertical"
                className="mt-4"
                form={convertToDealForm}
            >
                <Form.Item
                    name="name"
                    label="Opportunity Name"
                    rules={[
                        {
                            required: true,
                            message: FormInputErrorMessages.REQUIRED,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="status"
                    label="Opportunity Initial Status"
                    rules={[
                        {
                            required: true,
                            message: FormInputErrorMessages.REQUIRED,
                        },
                    ]}
                >
                    <Select
                        className="w-100"
                    >
                        {dealStageList?.map((singleStage) => (
                            <Select.Option value={singleStage.label} key={singleStage.label}>
                                {singleStage.label}
                            </Select.Option>
                        ))}

                    </Select>
                </Form.Item>

                <Form.Item
                    name="closingDate"
                    label="Closing Date"
                    rules={[
                        {
                            required: true,
                            message: FormInputErrorMessages.REQUIRED,
                        },
                    ]}
                >
                    <DatePicker className="w-100" />
                </Form.Item>
                <Form.Item
                    name="AMOUNT_UNIT"
                    label="Amount Unit"
                    rules={[
                        {
                            required: true,
                            message: FormInputErrorMessages.REQUIRED,
                        },
                    ]}
                >
                    <Select className="w-100"
                        showSearch={true}
                        filterOption={(input, option) => {
                            return ((typeof option?.children === 'string' && (option.children as string).toLowerCase().includes(input.toLowerCase())) ||
                                option?.value?.toString()?.toLowerCase()?.includes(input.toLowerCase())) ?? false;
                        }}>
                        {currency?.map((currencyUnit) => (
                            <Select.Option value={currencyUnit.value}
                                key={currencyUnit.label}>
                                {currencyUnit.label}
                            </Select.Option>
                        ))}

                    </Select>
                </Form.Item>
                <Form.Item
                    name="AMOUNT_VALUE"
                    label="Amount Value"
                    rules={[
                        {
                            required: true,
                            message: FormInputErrorMessages.REQUIRED,
                        }, {
                            pattern: /^\d+$/,
                            message: "Please enter a valid integer value"
                        }
                    ]}
                >
                    <Input />
                </Form.Item>

                <div className="bss-ui-drawer-footer text-align-right">
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="primary-btn ml-2"
                    >
                        Convert
                    </Button>
                </div>
            </Form>
        </Drawer>
    );
};

export default ConvertLeadToOpportunity;