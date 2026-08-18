import {FC, useEffect, useState} from "react";
import {Button, Drawer, Empty, Form, Select, Tooltip} from "antd";
import BssCollapse from "../../../../../../components/BSS_Collapse/BSS_Collapse.tsx";
import Table, {ColumnsType} from "antd/es/table";
import {
    addContactToAccount,
    removeAccountFromContact
} from "../../../single-account-page/components/contacts-in-account/services/contactInAccount.service.ts";
import notificationService from "../../../../../../services/notification.service.tsx";
import {BSS_SquareButton as BssSquareButton} from "bss-component-library";
import {FormInputErrorMessages} from "../../../../../../constants/form-input-error-messages.ts";
import DropdownValue from "../../../common-models/DropdownValue.ts";
import LinkedAccountModel from "../../../accounts-page/models/LinkedAccount.model.ts";
import {getAllAccountList} from "../../../../../../services/common-meta-data.service.ts";
import DigitalBssConfirmModal from "../../../../../../components/DigitalBssConfirmModal/index.ts";

interface AccountInContactNewProps {
    operation: "VIEW" | "EDIT";
    contactId: string;
    linkedAccountList: LinkedAccountModel[];
    reloadParent: () => void;
    setRef: (el: HTMLDivElement | null) => void;
}

const AccountInContact: FC<AccountInContactNewProps> = ({
                                                               operation,
                                                               contactId,
                                                               linkedAccountList,
                                                               reloadParent,
                                                               setRef
                                                           }) => {

    const [isLinkedNewAccountDrawerOpen, setIsLinkedNewAccountDrawerOpen] = useState<boolean>(false);

    const [form] = Form.useForm();
    const [allAccountList, setAllAccountList] = useState<DropdownValue[]>([]);

    const [removeContactDrawer, setRemoveContactDrawer] = useState<{
        isDrawerOpen: boolean;
        data: LinkedAccountModel | null;
    }>({
        isDrawerOpen: false,
        data: null,
    });

    useEffect(() => {
        if (isLinkedNewAccountDrawerOpen) {
            getAllAccountList()
                .then((data) => {
                    setAllAccountList(data);
                });
        }
    }, [isLinkedNewAccountDrawerOpen]);

    const columns: ColumnsType<LinkedAccountModel> = [
        {
            title: "Account ID",
            dataIndex: "accountId",
            key: "accountId",
        },
        {
            title: "Account Name",
            dataIndex: "accountName",
        },
        {
            title: "Actions",
            dataIndex: "actions",
            key: "action",
            align: "center" as const,
            width: 50,
            render: (_, record: LinkedAccountModel) => (
                <div style={{display: 'flex', justifyContent: 'space-between', gap: '5px'}}>
                    {
                        operation === "EDIT" && (
                                <Tooltip title="Unlink Account">
                                    <BssSquareButton
                                        onClick={() => setRemoveContactDrawer({isDrawerOpen: true, data: record})}
                                        type="DELETE"
                                    />
                                </Tooltip>
                        )
                    }
                </div>
            ),
        },
    ];

    return (
        <div ref={(reference) => setRef(reference)}>
            <BssCollapse
                title="Linked Accounts"
                defaultExpanded
                extra={
                    operation === "EDIT" && (
                        <Button
                            type="primary"

                            htmlType="submit"
                            size="small"
                            onClick={() => setIsLinkedNewAccountDrawerOpen(true)}
                        >
                            Add Account
                        </Button>
                    )
                }
            >
                <>
                    {
                        linkedAccountList && linkedAccountList.length > 0 ? (
                            <div className="collapsed-content">
                                <Table
                                    columns={columns}
                                    dataSource={linkedAccountList}
                                    rowKey="accountId"
                                />
                            </div>
                        ) : (
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: "200px",
                                }}
                            >
                                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
                            </div>
                        )
                    }
                </>
            </BssCollapse>

            <DigitalBssConfirmModal
                title="Confirmation"
                isOpen={removeContactDrawer.isDrawerOpen}
                onOk={async () => {
                    if (!removeContactDrawer.data) return;
                    await removeAccountFromContact(
                        contactId,
                        removeContactDrawer.data.accountId,
                        removeContactDrawer.data.accountName
                    );
                    notificationService("SUCCESS", "Account unlinked successfully");
                    reloadParent();
                    setRemoveContactDrawer({isDrawerOpen: false, data: null});
                }}
                onCancel={() => setRemoveContactDrawer({isDrawerOpen: false, data: null})}
                btnDanger
            >
                Do you want to unlink the account?
            </DigitalBssConfirmModal>

            <Drawer
                className="bss-ui-drawer"
                width={600}
                title={<span className="font-2xl-semi-bold">Link New Account</span>}
                open={isLinkedNewAccountDrawerOpen}
                onClose={() => {
                    setIsLinkedNewAccountDrawerOpen(false);
                    form.resetFields();
                }}
                closeIcon={<BssSquareButton type="CLOSE" className="close-icon"/>}
                destroyOnClose={true}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={(values) => {
                        if (linkedAccountList.some(account => account.accountId === values.account)) {
                            notificationService("WARNING", "Account is already linked");
                            return;
                        }
                        const accountName = allAccountList.find((account) => account.value === values.account)!.label;
                        addContactToAccount(contactId, values.account, accountName).then(() => {
                            notificationService("SUCCESS", "Account linked successfully");
                            form.resetFields();
                            setIsLinkedNewAccountDrawerOpen(false);
                            reloadParent();
                        });
                    }}
                    className="mt-3"
                >
                    <Form.Item
                        label="Accounts"
                        name="account"
                        rules={[{required: true, message: FormInputErrorMessages.REQUIRED}]}
                    >
                        <Select
                            showSearch
                            style={{width: '100%'}}
                            placeholder="Please select account to link"
                            options={allAccountList.filter(account =>
                                !linkedAccountList.some(linked => linked.accountId === account.value)
                            )}
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                        />
                    </Form.Item>
                    <div className="bss-ui-drawer-footer text-align-right">
                        <Button
                            type="primary"
                            onClick={() => {
                            }}
                            className="primary-btn ml-2"
                            htmlType="submit"
                        >
                            Save
                        </Button>
                    </div>
                </Form>
            </Drawer>

        </div>
    )

}

export default AccountInContact;