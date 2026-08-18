import { FC, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { Button, Drawer, Empty, Form, Input, Table } from "antd";
import { FormInputErrorMessages } from "../../../../../../../../constants/form-input-error-messages";
import showNotification from "../../../../../../../../services/notification.service";
import DigitalBssConfirmModal from "../../../../../../../../components/DigitalBssConfirmModal/DigitalBssConfirmModal_Temp";
import { BSS_SquareButton as BssSquareButton} from "bss-component-library";
import { RelatedPartyModel } from "../../../../../../../customer-profile/models/CustomerProfileModel";
import { updateRelatedParties } from "../../../../../../../customer-profile/services/customer-profile.service";

interface AddRelatedPartyProps {
    data: RelatedPartyModel[];
    customerSystemId: string;
    onTriggerReloadProfileTab: () => void;
}

const AddRelatedParty: FC<AddRelatedPartyProps> = ({
    data,
    customerSystemId,
    onTriggerReloadProfileTab,
}) => {
    const [operation, setOperation] = useState<"NEW" | "UPDATE" | "NON">("NON");
    const [selectedRelatedParty, setSelectedRelatedParty] = useState<RelatedPartyModel | null>(null);

    const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<RelatedPartyModel | null>(null);

    const onClickEditButtonHandle = (record: RelatedPartyModel) => {
        setSelectedRelatedParty(record);
        setOperation("UPDATE");
    };

    const tableColumns: ColumnsType<RelatedPartyModel> = [
        {
            title: "Role",
            dataIndex: "role",
        },
        {
            title: "Name",
            dataIndex: "name",
        },
        {
            title: "Type",
            dataIndex: "type",
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
        const updatedData = data.filter((item) => item.name !== itemToDelete?.name);

        await updateRelatedParties(updatedData, customerSystemId);
        onTriggerReloadProfileTab();
        showNotification("SUCCESS", "Deleted Successfully");

        onCloseDeleteConfirm();
    };

    const onClickUpdateButtonHandler = async (formValues: any) => {
        const currentRelatedPartyModelCopy: RelatedPartyModel[] = JSON.parse(JSON.stringify(data));

        if (operation === "UPDATE") {
            const updateElement = currentRelatedPartyModelCopy.find((singleParty) => {
                return singleParty.name === selectedRelatedParty?.name;
            });

            if (updateElement) {
                updateElement.role = formValues.role;
                updateElement.name = formValues.name;
                updateElement.type = formValues.type;

                await updateRelatedParties(currentRelatedPartyModelCopy, customerSystemId);
                setOperation("NON");
                setSelectedRelatedParty(null);
                onTriggerReloadProfileTab();
                showNotification("SUCCESS", "Related party updated successfully");
            }
        } else if (operation === "NEW") {
            currentRelatedPartyModelCopy.push({
                role: formValues.role,
                name: formValues.name,
                type: formValues.type,
            });

            await updateRelatedParties(currentRelatedPartyModelCopy, customerSystemId);
            setOperation("NON");
            setSelectedRelatedParty(null);
            onTriggerReloadProfileTab();
            showNotification("SUCCESS", "New related party added successfully");
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
                    Add Related Party
                </Button>
            </div>
            {data.length === 0 ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Empty className="mt-4 mb-3" description={"No Related Parties Available"}/>
                </div>
            ) : (
            <Table
                columns={tableColumns}
                dataSource={data}
                pagination={false}
                rowKey="name"
            />)}

            <Drawer
                title={operation === "NEW" ? "Create New Related Party" : "Update Related Party"}
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
                    name="related-party-edit"
                    initialValues={{
                        role: operation === "UPDATE" ? selectedRelatedParty?.role : "",
                        name: operation === "UPDATE" ? selectedRelatedParty?.name : "",
                        type: operation === "UPDATE" ? selectedRelatedParty?.type : "",
                    }}
                    onFinish={onClickUpdateButtonHandler}
                    layout="vertical"
                >
                    <Form.Item
                        className="mt-3"
                        name="role"
                        label="Role"
                        rules={[
                            { required: true, message: FormInputErrorMessages.REQUIRED },
                        ]}
                    >
                        <Input placeholder="Enter Role" />
                    </Form.Item>

                    <Form.Item
                        className="mt-3"
                        name="name"
                        label="Name"
                        rules={[
                            { required: true, message: FormInputErrorMessages.REQUIRED },
                        ]}
                    >
                        <Input placeholder="Enter Name" />
                    </Form.Item>

                    <Form.Item
                        className="mt-3"
                        name="type"
                        label="Type"
                        rules={[
                            { required: false },
                        ]}
                    >
                        <Input placeholder="Enter Type (Optional)" />
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

export default AddRelatedParty;
