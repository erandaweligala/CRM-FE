import { FC, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { Button, Drawer, Empty, Form, Input, Table, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { FormInputErrorMessages } from "../../../../../../../../constants/form-input-error-messages";
import showNotification from "../../../../../../../../services/notification.service";
import dayjs from "dayjs";
import DigitalBssConfirmModal from "../../../../../../../../components/DigitalBssConfirmModal/DigitalBssConfirmModal_Temp";
import { BSS_SquareButton as BssSquareButton } from "bss-component-library";
import { TaxExemptionModel } from "../../../../../../../customer-profile/models/CustomerProfileModel";
import { updateTaxExemptions } from "../../../../../../../customer-profile/services/customer-profile.service";
interface AddTaxExemptionProps {
    data: TaxExemptionModel[];
    customerSystemId: string;
    onTriggerReloadProfileTab: () => void;
}

const AddTaxExemption: FC<AddTaxExemptionProps> = ({
    data,
    customerSystemId,
    onTriggerReloadProfileTab,
}) => {
    const [operation, setOperation] = useState<"NEW" | "UPDATE" | "NON">("NON");
    const [selectedTaxExemption, setSelectedTaxExemption] = useState<TaxExemptionModel | null>(null);

    const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<TaxExemptionModel | null>(null);

    const onClickEditButtonHandle = (record: TaxExemptionModel) => {
        setSelectedTaxExemption(record);
        setOperation("UPDATE");
    };

    const tableColumns: ColumnsType<TaxExemptionModel> = [
        {
            title: "Tax Definition",
            dataIndex: "taxDefinition",
        },
        {
            title: "Valid Duration",
            dataIndex: "validDuration",
            render: (duration: string) => {
              if (!duration.includes("Z-")) return "Invalid Date";
              const [startPart, endPart] = duration.split("Z-");
              const start = `${startPart}Z`;
              const end = endPart;
          
              if (!dayjs(start).isValid() || !dayjs(end).isValid()) {
                return "Invalid Date";
              }
          
              return `${dayjs(start).format("DD MMM YYYY")} - ${dayjs(end).format("DD MMM YYYY")}`;
            }
    },
        {
            title: "Attachment Type",
            dataIndex: ["attachment", "type"],
            render: (type) => type ?? "N/A",
        },
        {
            title: "Attachment URL",
            dataIndex: ["attachment", "url"],
            render: (url) => (url ? <a href={url} target="_blank" rel="noopener noreferrer">View</a> : "N/A"),
        },
        {
            title: "Action",
            dataIndex: "action",
            render: (_value, record) => (
                <>
                    <BssSquareButton className="mr-2" type="EDIT" onClick={() => onClickEditButtonHandle(record)} />
                    <BssSquareButton type="DELETE" onClick={() => {
                        setItemToDelete(record);
                        setDeleteConfirmVisible(true);
                    }} />
                </>
            ),
        },
    ];

    const onCloseDeleteConfirm = () => {
        setDeleteConfirmVisible(false);
        setItemToDelete(null);
    };

    const onConfirmDelete = async () => {
        const updatedData = data.filter((item) => item.taxDefinition !== itemToDelete?.taxDefinition);

        await updateTaxExemptions(updatedData, customerSystemId);
        onTriggerReloadProfileTab();
        showNotification("SUCCESS", "Deleted Successfully");

        onCloseDeleteConfirm();
    };

    const onClickUpdateButtonHandler = async (formValues: any) => {
        const currentTaxExemptionsCopy: TaxExemptionModel[] = JSON.parse(JSON.stringify(data));

        if (operation === "UPDATE") {
            const updateElement = currentTaxExemptionsCopy.find((item) => {
                return item.taxDefinition === selectedTaxExemption?.taxDefinition;
            });

            if (updateElement) {
                updateElement.taxDefinition = formValues.taxDefinition;
                updateElement.validDuration = formValues.validDuration;
                updateElement.attachment = formValues.attachment
                    ? {
                        type: formValues.attachment.type,
                        content: formValues.attachment.content,
                        id: formValues.attachment.id,
                        url: formValues.attachment.url,
                    }
                    : null;

                await updateTaxExemptions(currentTaxExemptionsCopy, customerSystemId);
                setOperation("NON");
                setSelectedTaxExemption(null);
                onTriggerReloadProfileTab();
                showNotification("SUCCESS", "Tax exemption updated successfully");
            }
        } else if (operation === "NEW") {
            currentTaxExemptionsCopy.push({
                taxDefinition: formValues.taxDefinition,
                validDuration: formValues.validDuration,
                attachment: formValues.attachment
                    ? {
                        type: formValues.attachment.type,
                        content: formValues.attachment.content,
                        id: formValues.attachment.id,
                        url: formValues.attachment.url,
                    }
                    : null,
            });

            await updateTaxExemptions(currentTaxExemptionsCopy, customerSystemId);
            setOperation("NON");
            setSelectedTaxExemption(null);
            onTriggerReloadProfileTab();
            showNotification("SUCCESS", "New tax exemption added successfully");
        }
    };

    return (
        <>
            <div className="text-align-right mb-4">
                <Button
                    type="default"
                    size="small"
                    onClick={() => {
                        setOperation("NEW");
                    }}
                >
                    Add Tax Exemption
                </Button>
            </div>
            {data.length === 0 ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Empty className="mt-4 mb-3" description={"No Tax Exemption Available"}/>
                </div>
            ) : (
            <Table
                columns={tableColumns}
                dataSource={data}
                pagination={false}
                rowKey="taxDefinition"
            />)}

            <Drawer
                title={operation === "NEW" ? "Create New Tax Exemption" : "Update Tax Exemption"}
                placement="right"
                onClose={() => {
                    setOperation("NON");
                }}
                open={operation !== "NON"}
                width={500}
                className="bss-ui-drawer"
                destroyOnClose={true}
            >
                <Form
                    name="tax-exemption-edit"
                    initialValues={{
                        taxDefinition: operation === "UPDATE" ? selectedTaxExemption?.taxDefinition : "",
                        validDuration: operation === "UPDATE" ? selectedTaxExemption?.validDuration : "",
                        attachment: operation === "UPDATE" ? selectedTaxExemption?.attachment : null,
                    }}
                    onFinish={onClickUpdateButtonHandler}
                    layout="vertical"
                >
                    <Form.Item
                        className="mt-3"
                        name="taxDefinition"
                        label="Tax Definition"
                        rules={[{ required: true, message: FormInputErrorMessages.REQUIRED }]}
                    >
                        <Input placeholder="Enter Tax Definition" />
                    </Form.Item>

                    <Form.Item
                        className="mt-3"
                        name="validDuration"
                        label="Valid Duration"
                        rules={[{ required: true, message: FormInputErrorMessages.REQUIRED }]}
                    >
                        <Input placeholder="Enter Valid Duration" />
                    </Form.Item>

                    <Form.Item
                        className="mt-3"
                        name="attachment"
                        label="Attachment"
                    >
                        <Upload beforeUpload={() => false}>
                            <Button icon={<UploadOutlined />}>Upload File</Button>
                        </Upload>
                    </Form.Item>

                    <div className="bss-ui-drawer-footer text-align-right">
                        <Button
                            type="primary"
                            htmlType="submit"
                        >
                            {operation === "NEW" ? "Create" : "Update"}
                        </Button>
                    </div>
                </Form>
            </Drawer>

            <DigitalBssConfirmModal
                title="Confirm Delete"
                isOpen={deleteConfirmVisible}
                onOk={onConfirmDelete}
                onCancel={onCloseDeleteConfirm}
                btnDanger
            >
                Are you sure you want to delete this item?
            </DigitalBssConfirmModal>
        </>
    );
};

export default AddTaxExemption;
