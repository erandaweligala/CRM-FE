import {FC, useEffect, useState} from "react";
import {CustomerInfoModel} from "../../../../models/CustomerProfileModel";
import {Button, DatePicker, Descriptions, Drawer, Form, Input, Select} from "antd";
import AttributePermission from "../../../../../../components/access-control/attribute-permission/AttributePermission";
import ATTRIBUTE_PERMISSION from "../../../../../../constants/attribute-permission";
import {FormInputErrorMessages} from "../../../../../../constants/form-input-error-messages";
import {updateCustomerInfo} from "../../../../services/customer-profile.service";
import dayjs from 'dayjs'
import {hasOnlyAsterisks} from "../../../../../../helpers/string-validators";
import {UpdateCustomerInfoRequest} from "./models/update-customer-info.request";
import {DATA_FORMAT_REGEX} from "../../../../../../constants/common-regex";
interface CustomerInfoProps {
    data: CustomerInfoModel;
    customerSystemId: string;
    isDrawerOpen: boolean;
    onTriggerReloadProfileTab: () => void;
    setIsDrawerOpen: (open: boolean) => void;
}

const CustomerInfo: FC<CustomerInfoProps> = ({data, customerSystemId, onTriggerReloadProfileTab, isDrawerOpen, setIsDrawerOpen }) => {

    const [form] = Form.useForm();
    const [isUpdateDrawerOpen, setIsUpdateDrawerOpen] = useState<boolean>(false);


    useEffect(() => {
        if(isDrawerOpen){
            setIsUpdateDrawerOpen(true);
        }
    },[isDrawerOpen]);

    useEffect(()=>{
        setIsDrawerOpen(isUpdateDrawerOpen);
    },[isUpdateDrawerOpen]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onClickUpdateButtonHandler = async (formInput: any) => {

        const requestBody: UpdateCustomerInfoRequest = {
            title: formInput.title ?? data.title,
            fullName: formInput.fullName ?? data.fullName,
            preferredName: formInput.preferredName ?? data.preferredName,
            nationality: formInput.nationality ?? data.nationality,
            maritalStatus: formInput.maritalStatus ?? data.maritalStatus,
            birthday: formInput.birthday ? (formInput.birthday as dayjs.Dayjs).format('YYYY-MM-DD') : data.birthday,
            gender: formInput.gender ?? data.gender,
        }

        const apiCallStatus = await updateCustomerInfo(requestBody, customerSystemId);
        if (apiCallStatus === "SUCCESS") {
            setIsUpdateDrawerOpen(false);
            onTriggerReloadProfileTab();
        }
    }

    return (
        <>
            {data && (
                <Descriptions labelStyle={{width: 200}} bordered className="mb-3">
                    <Descriptions.Item label="Title">{data?.title}</Descriptions.Item>
                    <Descriptions.Item label="Full Name" span={2}>{data.fullName}</Descriptions.Item>
                    <Descriptions.Item label="Birthday">
                        <AttributePermission attribute={ATTRIBUTE_PERMISSION.CUSTOMER_PROFILE.BIRTHDAY}>
                            {data.birthday}
                        </AttributePermission>
                    </Descriptions.Item>
                    <Descriptions.Item label="Gender">{data.gender}</Descriptions.Item>
                    <Descriptions.Item label="Preferred Name">{data.preferredName}</Descriptions.Item>
                    <Descriptions.Item label="Nationality">
                        <AttributePermission attribute={ATTRIBUTE_PERMISSION.CUSTOMER_PROFILE.NATIONALITY}>
                            {data.nationality}
                        </AttributePermission>
                    </Descriptions.Item>
                    <Descriptions.Item label="Marital Status">{data.maritalStatus}</Descriptions.Item>
                    <Descriptions.Item label="Customer Status">{data.customerStatus}</Descriptions.Item>
                    <Descriptions.Item label="Customer Expiration Date">{data.customerExpirationDate}</Descriptions.Item>
                    <Descriptions.Item label="Customer Create Date">{data.customerCreatedDate}</Descriptions.Item>
                    <Descriptions.Item label="Customer Type">{data.customerType}</Descriptions.Item>
                </Descriptions>
            )}

            <Drawer
                title="Update Customer Info"
                placement="right"
                onClose={() => setIsUpdateDrawerOpen(false)}
                open={isUpdateDrawerOpen}
                width={500}
                className="bss-ui-drawer"
                destroyOnClose={true}
            >
                <Form
                    form={form}
                    name="update-customer-information"
                    initialValues={{
                        title: data?.title,
                        fullName: data?.fullName,
                        birthday: data?.birthday && DATA_FORMAT_REGEX.test(data.birthday) ? dayjs(data.birthday, 'YYYY-MM-DD') : null,
                        gender: data?.gender,
                        preferredName: data?.preferredName,
                        nationality: data?.nationality,
                        maritalStatus: data?.maritalStatus,
                      }}                      
                    onFinish={onClickUpdateButtonHandler}
                    layout="vertical"
                >

                    {
                        !hasOnlyAsterisks(data?.title) &&
                        <Form.Item
                            className="mt-3"
                            name="title"
                            label="Title"
                            rules={[
                                {required: true, message: FormInputErrorMessages.REQUIRED}
                            ]}
                        >
                            <Select className="w-100">
                                <Select.Option value="Mr">Mr</Select.Option>
                                <Select.Option value="Mrs">Mrs</Select.Option>
                                <Select.Option value="Miss">Miss</Select.Option>
                            </Select>
                        </Form.Item>
                    }

                    {
                        !hasOnlyAsterisks(data?.fullName) &&
                        <Form.Item
                            className="mt-3"
                            name="fullName"
                            label="Full Name"
                            rules={[
                                {required: true, message: FormInputErrorMessages.REQUIRED},
                            ]}
                        >
                            <Input/>
                        </Form.Item>
                    }

                    {
                        !hasOnlyAsterisks(data?.preferredName) &&
                        <Form.Item
                            className="mt-3"
                            name="preferredName"
                            label="Preferred Name"
                            rules={[
                                {required: true, message: FormInputErrorMessages.REQUIRED},
                            ]}
                        >
                            <Input/>
                        </Form.Item>
                    }

                    {
                        !hasOnlyAsterisks(data?.birthday) &&
                        <Form.Item
                            className="mt-3"
                            name="birthday"
                            label="Birthday"
                            rules={[
                                {required: true, message: FormInputErrorMessages.REQUIRED},
                            ]}
                        >
                            <DatePicker className="w-100"/>
                        </Form.Item>
                    }


                    {
                        !hasOnlyAsterisks(data?.gender) &&
                        <Form.Item
                            className="mt-3"
                            name="gender"
                            label="gender"
                            rules={[
                                {required: true, message: FormInputErrorMessages.REQUIRED}
                            ]}
                        >
                            <Select className="w-100">
                                <Select.Option value="Male">Male</Select.Option>
                                <Select.Option value="Female">Female</Select.Option>
                                <Select.Option value="Other">Other</Select.Option>
                            </Select>
                        </Form.Item>
                    }


                    {
                        !hasOnlyAsterisks(data?.nationality) &&
                        <Form.Item
                            className="mt-3"
                            name="nationality"
                            label="Nationality"
                            rules={[
                                {required: true, message: FormInputErrorMessages.REQUIRED}
                            ]}
                        >
                            <Input/>
                        </Form.Item>
                    }


                    {
                        !hasOnlyAsterisks(data?.maritalStatus) &&
                        <Form.Item
                            className="mt-3"
                            name="maritalStatus"
                            label="Marital Status"
                            rules={[
                                {required: true, message: FormInputErrorMessages.REQUIRED}
                            ]}
                        >
                            <Select className="w-100">
                                <Select.Option value="Married">Married</Select.Option>
                                <Select.Option value="Single">Single</Select.Option>
                            </Select>
                        </Form.Item>
                    }

                    <div className="bss-ui-drawer-footer text-align-right">
                        <Button
                            type="primary"
                            htmlType="submit"
                        >
                            Update
                        </Button>
                    </div>
                </Form>

            </Drawer>

        </>
    )
}

export default CustomerInfo;