import {FC, useState} from "react";
import {ExternalReferenceModel} from "../../../../models/CustomerProfileModel";
import {Button, Descriptions, Drawer, Tooltip} from "antd";
import ExternalReferenceAdd from "./edit-external-reference/ExternalReferenceCreate";
import DeleteIcon from "../../../../../../assets/images/delete-icon.svg?react";
import EditButton from "../../../../../../assets/images/edit.svg?react";
import Facebook from "../../../../../../assets/images/facebook.svg?react";
import Google from "../../../../../../assets/images/google.svg?react";
import TikTok from "../../../../../../assets/images/Tiktok.svg?react";
import Instagram from "../../../../../../assets/images/Instagram.svg?react";
import LinkedIn from "../../../../../../assets/images/linkedin.svg?react";
import Twitter from "../../../../../../assets/images/twitter.svg?react";
import {postToCreateReference} from "../../../../services/customer-profile.service";
import showNotification from "../../../../../../services/notification.service";
import DigitalBssConfirmModal from "../../../../../../components/DigitalBssConfirmModal";
interface ExternalReferenceProps {
    data: ExternalReferenceModel[];
    customerSystemId: string;
    onTriggerReloadProfileTab: () => void;
}

const ExternalReference: FC<ExternalReferenceProps> = ({
                                                           data,
                                                           customerSystemId,
                                                           onTriggerReloadProfileTab
                                                       }) => {


    const [addReferenceDrawer, setAddReferenceDrawer] = useState<{
        isOpen: boolean;
        operation: "NEW" | "EDIT" | null;
        item: ExternalReferenceModel | null;
    }>({
        isOpen: false,
        operation: null,
        item: null,
    });

    const onCloseDrawer = () => {
        setAddReferenceDrawer({
            isOpen: false,
            operation: null,
            item: null
        });
    };


    const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<ExternalReferenceModel | null>(null);


    const onCloseDeleteConfirm = () => {
        setDeleteConfirmVisible(false);
        setItemToDelete(null);
    };


    const onConfirmDelete = async () => {
        const updatedData = data.filter((item) => item.url !== itemToDelete?.url);

        await postToCreateReference(customerSystemId, updatedData);
        onTriggerReloadProfileTab();
        showNotification("SUCCESS", "External Reference Deleted Successfully");

        onCloseDeleteConfirm();
    };


    const onConfirmEdit = async (updatedReference: ExternalReferenceModel) => {
        const updatedData = data.map(item => (item.url === updatedReference.url ? updatedReference : item));

        await postToCreateReference(customerSystemId, updatedData);
        onTriggerReloadProfileTab();
        showNotification("SUCCESS", "External Reference Edited Successfully");

        onCloseDrawer();
    };

    return (
        <>
            <div className="text-align-right mb-4">

                <Button
                    type="default"
                    size="small"
                    onClick={() => {
                        setAddReferenceDrawer({
                            isOpen: true,
                            operation: "NEW",
                            item: null
                        });
                    }}
                >
                    Create External Reference
                </Button>
            </div>

            {data.length === 0 ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    No Any Reference Links Available
                </div>
            ) : (
                <Descriptions bordered className="mb-3 mt-4" column={1}>
                    {data.map((item) => (
                        <Descriptions.Item
                            key={item.url}
                            label={
                                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <span className="mr-2">
                                        {item.type === 'Facebook' && (
                                            <Facebook />
                                        )}

                                        {item.type === 'Google' && (
                                            <Google />
                                        )}

                                        {item.type === 'TikTok' && (
                                            <TikTok />
                                        )}

                                        {item.type === 'Instagram' && (
                                            <Instagram />
                                        )}

                                        {item.type === 'LinkedIn' && (
                                            <LinkedIn />
                                        )}

                                        {item.type === 'Twitter' && (
                                            <Twitter />
                                        )}
                                    </span>
                                    {item.type}
                                </div>
                            }>


                            <Tooltip title="Edit">
                                <EditButton
                                    className="mr-1 svg-edit-button"
                                    onClick={() => {
                                        setAddReferenceDrawer({
                                            isOpen: true,
                                            operation: "EDIT",
                                            item: item,
                                        });
                                    }}
                                />
                            </Tooltip>

                            <Tooltip title="Delete">
                                <DeleteIcon
                                    className="mr-1 svg-delete-button"
                                    onClick={() => {
                                        setItemToDelete(item);
                                        setDeleteConfirmVisible(true);
                                    }}
                                />
                            </Tooltip>

                            <a href={item.url} target="_blank" rel="noreferrer">
                                {item.url}
                            </a>

                        </Descriptions.Item>
                    ))}
                </Descriptions>
            )}

            <Drawer
                className="bss-ui-drawer"
                title={addReferenceDrawer.operation === "NEW" ? "Add New Reference" : "Edit Reference"}
                open={addReferenceDrawer.operation === "NEW" || addReferenceDrawer.operation === "EDIT"}
                placement="right"
                onClose={onCloseDrawer}
                destroyOnClose={true}
                width={500}
            >
                <>
                    {
                        addReferenceDrawer.operation === "NEW" &&
                        <ExternalReferenceAdd
                            data={data}
                            id={customerSystemId}
                            onTriggerReloadProfileTab={onTriggerReloadProfileTab}
                            onCloseDrawer={onCloseDrawer}
                        />
                    }

                    {
                        addReferenceDrawer.operation === "EDIT" &&
                        <ExternalReferenceAdd
                            data={data}
                            id={customerSystemId}
                            onTriggerReloadProfileTab={onTriggerReloadProfileTab}
                            onCloseDrawer={onCloseDrawer}
                            item={addReferenceDrawer.item}
                            onConfirmEdit={onConfirmEdit}
                        />
                    }
                </>
            </Drawer>

            <DigitalBssConfirmModal
                title="Confirm Delete"
                isOpen={deleteConfirmVisible}
                onOk={onConfirmDelete}
                onCancel={onCloseDeleteConfirm}
                btnDanger
            >
                Are you sure you want to delete this Reference Link?
            </DigitalBssConfirmModal>
        </>

    );
};

export default ExternalReference;
