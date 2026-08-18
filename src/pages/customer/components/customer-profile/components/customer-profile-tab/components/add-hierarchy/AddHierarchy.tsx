import { FC, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { Button, Drawer, Empty, Form, Input, Table } from "antd";
import { FormInputErrorMessages } from "../../../../../../../../constants/form-input-error-messages";
import DigitalBssConfirmModal from "../../../../../../../../components/DigitalBssConfirmModal/DigitalBssConfirmModal_Temp";
import showNotification from "../../../../../../../../services/notification.service";
import { BSS_SquareButton as BssSquareButton } from "bss-component-library";
import { HierarchyModel } from "../../../../../../../customer-profile/models/CustomerProfileModel";
import { updateHierarchy } from "../../../../../../../customer-profile/services/customer-profile.service";
interface AddHierarchyProps {
    data: HierarchyModel[];
    customerSystemId: string;
    onTriggerReloadProfileTab: () => void;
}

const AddHierarchy: FC<AddHierarchyProps> = ({
    data,
    customerSystemId,
    onTriggerReloadProfileTab,
}) => {

    const [operation, setOperation] = useState<"NEW" | "UPDATE" | "NON">("NON");
    const [selectedHierarchyModel, setSelectedHierarchyModel] = useState<HierarchyModel | null>(null);

    const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<HierarchyModel | null>(null);

    const onClickEditButtonHandle = (recode: HierarchyModel) => {
        setSelectedHierarchyModel(recode);
        setOperation("UPDATE");
    }

    const tableColumns: ColumnsType<HierarchyModel> = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
        }, {
            title: 'Type',
            dataIndex: 'type',
        },
        {
            title: 'Relationship Type',
            dataIndex: 'relationshipType',
        },
        {
            title: 'Action',
            dataIndex: 'Action',
            render: (_value, record) => {
                return (
                    <>
                        <BssSquareButton className="mr-2" type="EDIT" onClick={() => onClickEditButtonHandle(record)} />
                        <BssSquareButton type="DELETE" onClick={() => {
                            setItemToDelete(record);
                            setDeleteConfirmVisible(true);
                        }} />
                    </>
                );
            }
        },
    ];


    const onCloseDeleteConfirm = () => {
        setDeleteConfirmVisible(false);
        setItemToDelete(null);
    };


    const onConfirmDelete = async () => {
        const updatedData = data.filter((item) => item.id !== itemToDelete?.id);

        await updateHierarchy(updatedData, customerSystemId);
        onTriggerReloadProfileTab();
        showNotification("SUCCESS", "Deleted Successfully");

        onCloseDeleteConfirm();
    };


    const onClickUpdateButtonHandler = async (formValues: any) => {
        const currentHierarchyModelCopy: HierarchyModel[] = JSON.parse(JSON.stringify(data));
    
        if (operation === "UPDATE") {
            const updateElement = currentHierarchyModelCopy.find((singleHierarchy) => {
                return singleHierarchy.id === selectedHierarchyModel?.id;
            });
    
            if (updateElement) {
                updateElement.type = formValues.type;
                updateElement.relationshipType = formValues.relationshipType;
                updateElement.name = formValues.name;
                updateElement.id = formValues.id;
    
                await updateHierarchy(currentHierarchyModelCopy, customerSystemId);
                setOperation("NON");
                setSelectedHierarchyModel(null);
                onTriggerReloadProfileTab();
                showNotification("SUCCESS", "Hierarchy updated successfully");
            }
        } else if (operation === "NEW") {
            currentHierarchyModelCopy.push({
                type: formValues.type,
                relationshipType: formValues.relationshipType,
                id: formValues.id,
                name: formValues.name,
            });
    
            await updateHierarchy(currentHierarchyModelCopy, customerSystemId);
            setOperation("NON");
            setSelectedHierarchyModel(null);
            onTriggerReloadProfileTab();
            showNotification("SUCCESS", "New hierarchy added successfully");
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
                    Add Hierarchy
                </Button>
            </div>
            {data.length === 0 ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Empty className="mt-4 mb-3" description={"No Hierarchy Available"}/>
                </div>
            ) : (
            <Table
                columns={tableColumns}
                dataSource={data}
                pagination={false}
                rowKey="id"
            />)}

            <Drawer
                title={operation === "NEW" ? "Create New Hierarchy" : "Update Hierarchy"}
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
                    name="hierarchy-edit"
                    initialValues={{
                        type: operation === "UPDATE" ? selectedHierarchyModel?.type : "",
                        relationshipType: operation === "UPDATE" ? selectedHierarchyModel?.relationshipType : "",
                        id: operation === "UPDATE" ? selectedHierarchyModel?.id : "",
                        name: operation === "UPDATE" ? selectedHierarchyModel?.name : "",
                    }}
                    onFinish={onClickUpdateButtonHandler}
                    layout="vertical"
                >
                    <Form.Item
                        className="mt-3"
                        name="type"
                        label="Type"
                        rules={[
                            { required: true, message: FormInputErrorMessages.REQUIRED }
                        ]}
                    >
                        <Input placeholder="Enter Type" />
                    </Form.Item>

                    <Form.Item
                        className="mt-3"
                        name="relationshipType"
                        label="Relationship Type"
                        rules={[
                            { required: true, message: FormInputErrorMessages.REQUIRED }
                        ]}
                    >
                        <Input placeholder="Enter Relationship Type" />
                    </Form.Item>

                    <Form.Item
                        className="mt-3"
                        name="id"
                        label="ID"
                        rules={[
                            { required: true, message: FormInputErrorMessages.REQUIRED }
                        ]}
                    >
                        <Input placeholder="Enter ID" />
                    </Form.Item>

                    <Form.Item
                        className="mt-3"
                        name="name"
                        label="Name"
                        rules={[
                            { required: true, message: FormInputErrorMessages.REQUIRED }
                        ]}
                    >
                        <Input placeholder="Enter Name" />
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

    )
}

export default AddHierarchy;