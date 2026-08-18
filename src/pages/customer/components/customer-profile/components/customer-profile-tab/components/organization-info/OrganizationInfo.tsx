import { FC, useState } from "react";
import { Button, DatePicker, Descriptions, Drawer, Empty, Form, Input, Select } from "antd";
import { FormInputErrorMessages } from "../../../../../../../../constants/form-input-error-messages";
import dayjs from "dayjs";
import { UpdateOrganizationInfoRequest } from "./models/update-organization-info.request";
import { DATA_FORMAT_REGEX } from "../../../../../../../../constants/common-regex";
import { OrganizationInfoModel } from "../../../../../../../customer-profile/models/CustomerProfileModel";
import { updateOrganizationInfo } from "../../../../../../../customer-profile/services/customer-profile.service";

interface OrganizationInfoProps {
    data: OrganizationInfoModel;
    customerSystemId: string;
    onTriggerReloadProfileTab: () => void;
}

const OrganizationInfo: FC<OrganizationInfoProps> = ({ data, customerSystemId, onTriggerReloadProfileTab }) => {

    const [form] = Form.useForm();
    const [isUpdateDrawerOpen, setIsUpdateDrawerOpen] = useState<boolean>(false);
    const onClickUpdateButtonHandler = async (formInput: any) => {
        const requestBody: UpdateOrganizationInfoRequest = {
            nameType: formInput.nameType ?? data.nameType,
            tradingName: formInput.tradingName ?? data.tradingName,
            isLegalEntity: formInput.isLegalEntity ?? data.isLegalEntity,
            isHeadOffice: formInput.isHeadOffice ?? data.isHeadOffice,
            organizationType: formInput.organizationType ?? data.organizationType,
            existsDuring: formInput.existsDuring ?? data.existsDuring,
            status: formInput.status ?? data.status,
            createDate: formInput.createDate 
                ? (formInput.createDate as dayjs.Dayjs).format('YYYY-MM-DD') 
                : data.createDate,
        };
    
        const apiCallStatus = await updateOrganizationInfo(requestBody, customerSystemId);
        if (apiCallStatus === "SUCCESS") {
            setIsUpdateDrawerOpen(false);
            onTriggerReloadProfileTab();
        }
    };
    

    return (
        <>
            <div className="text-align-right mb-4">
                <Button
                    type="default"
                    size="small"
                    onClick={() => setIsUpdateDrawerOpen(true)}
                >
                    Update Organization Info
                </Button>
            </div>
            {!data ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Empty className="mt-4 mb-3" description={"No Organization Info Available"}/>
                </div>
            ) : (
            <Descriptions
                labelStyle={{ width: 130 }}
                bordered
                column={3}
                className="mb-3"
            >
                <Descriptions.Item label="Name Type">{data.nameType}</Descriptions.Item>
                <Descriptions.Item label="Trading Name" span={2}>{data.tradingName}</Descriptions.Item>
                <Descriptions.Item label="Is Legal Entity">{data.isLegalEntity}</Descriptions.Item>
                <Descriptions.Item label="Is Head Office">{data.isHeadOffice}</Descriptions.Item>
                <Descriptions.Item label="Organization Type">{data.organizationType}</Descriptions.Item>
                <Descriptions.Item label="Exists During">{data.existsDuring}</Descriptions.Item>
                <Descriptions.Item label="Status">{data.status}</Descriptions.Item>
                <Descriptions.Item label="Create Date">{data.createDate}</Descriptions.Item>
            </Descriptions>

            )}

            <Drawer
                title="Update Organization Info"
                placement="right"
                onClose={() => setIsUpdateDrawerOpen(false)}
                open={isUpdateDrawerOpen}
                width={500}
                className="bss-ui-drawer"
                destroyOnClose={true}
            >
                <Form
                    form={form}
                    name="update-organization-info"
                    initialValues={{
                        nameType: data.nameType,
                        tradingName: data.tradingName,
                        isLegalEntity: data.isLegalEntity,
                        isHeadOffice: data.isHeadOffice,
                        organizationType: data.organizationType,
                        existsDuring: data.existsDuring,
                        status: data.status,
                        createDate: data.createDate && DATA_FORMAT_REGEX.test(data.createDate) ? dayjs(data.createDate, 'YYYY-MM-DD') : null,
                    }}
                    onFinish={onClickUpdateButtonHandler}
                    layout="vertical"
                >
                    <Form.Item
                        name="nameType"
                        label="Name Type"
                        rules={[{ required: false }]}
                    >
                        <Input placeholder="Enter Name Type" />
                    </Form.Item>

                    <Form.Item
                        name="tradingName"
                        label="Trading Name"
                        rules={[{ required: false }]}
                    >
                        <Input placeholder="Enter Trading Name" />
                    </Form.Item>

                    <Form.Item
                        name="isLegalEntity"
                        label="Is Legal Entity"
                        rules={[{ required: true, message: FormInputErrorMessages.REQUIRED }]}
                    >
                        <Select className="w-100">
                            <Select.Option value="Yes">Yes</Select.Option>
                            <Select.Option value="No">No</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="isHeadOffice"
                        label="Is Head Office"
                        rules={[{ required: true, message: FormInputErrorMessages.REQUIRED }]}
                    >
                        <Select className="w-100">
                            <Select.Option value="Yes">Yes</Select.Option>
                            <Select.Option value="No">No</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="organizationType"
                        label="Organization Type"
                        rules={[{ required: false }]}
                    >
                        <Input placeholder="Enter Organization Type" />
                    </Form.Item>

                    <Form.Item
                        name="existsDuring"
                        label="Exists During"
                        rules={[{ required: false }]}
                    >
                        <Input placeholder="Enter Time Period (if any)" />
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label="Status"
                        rules={[{ required: true, message: FormInputErrorMessages.REQUIRED }]}
                    >
                        <Select className="w-100">
                            <Select.Option value="validated">Validated</Select.Option>
                            <Select.Option value="pending">Pending</Select.Option>
                            <Select.Option value="rejected">Rejected</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="createDate"
                        label="Creation Date"
                        rules={[{ required: false }]}
                    >
                        <DatePicker className="w-100" format="YYYY-MM-DD" />
                    </Form.Item>

                    <div className="bss-ui-drawer-footer text-align-right">
                        <Button type="primary" htmlType="submit">
                            Update
                        </Button>
                    </div>
                </Form>
            </Drawer>


        </>
    )
}

export default OrganizationInfo;