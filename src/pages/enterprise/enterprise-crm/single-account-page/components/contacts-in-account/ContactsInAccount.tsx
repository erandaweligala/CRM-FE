import {FC, useEffect, useState} from "react";
import {
    addContactToAccount,
    getContactListByAccountId,
    removeAccountFromContact
} from "./services/contactInAccount.service.ts";
import ContactInAccountModel from "./models/ContactInAccount.model.ts";
import Table, {ColumnsType} from "antd/es/table";
import {Button, Drawer, Empty, Form, Select, Tooltip} from "antd";
import DropdownValue from "../../../common-models/DropdownValue.ts";
import {getAllContactList} from "../../../../../../services/common-meta-data.service.ts";
import notificationService from "../../../../../../services/notification.service.tsx";
import {FormInputErrorMessages} from "../../../../../../constants/form-input-error-messages.ts";
import EntityDetail from "../../../common-models/EntityDetail.ts";
import DigitalBssConfirmModal from "../../../../../../components/DigitalBssConfirmModal";
import { BSS_SquareButton  as BssSquareButton} from "bss-component-library";
import BssCollapse from "../../../../../../components/BSS_Collapse/BSS_Collapse.tsx";

interface ContactsInAccountProps {
    accountId: string;
    fullAccountDetails: { title: string; accountDetails: EntityDetail[] }[];
    parentOperation?: "EDIT" | "VIEW";
    setRef: (el: HTMLDivElement | null) => void;
}

const ContactsInAccount: FC<ContactsInAccountProps> = ({
                                                           accountId,
                                                           fullAccountDetails,
                                                           parentOperation = "EDIT",
                                                              setRef,
                                                       }) => {

    const [form] = Form.useForm();
    const [accountList, setAccountList] = useState<ContactInAccountModel[]>([]);
    const [allContactList, setAllContactList] = useState<DropdownValue[]>([]);
    const [accountName, setAccountName] = useState<string>("");
    const [isLinkedNewContactDrawerOpen, setIsLinkedNewContactDrawerOpen] = useState<boolean>(false);
    

    const [removeContactDrawer, setRemoveContactDrawer] = useState<{
        isDrawerOpen: boolean;
        data: ContactInAccountModel | null;
    }>({
        isDrawerOpen: false,
        data: null,
    });

    useEffect(() => {
        const accountSection = fullAccountDetails.find((section) => section.title === "Account Information");
        const accountName = accountSection?.accountDetails.find((detail) => detail.inputId === "1")?.value ?? "N/A";
        setAccountName(accountName);
    }, []);

    useEffect(() => {
        fetchContactList();
        getAllContactList()
            .then((data) => {
                setAllContactList(data);
            });
    }, [accountId]);

    const fetchContactList = () => {
        getContactListByAccountId(accountId)
            .then((data) => {
                setAccountList(data);
            });
    }

    const columns: ColumnsType<ContactInAccountModel> = [
        {
            title: "ID",
            dataIndex: "contactId",
            key: "contactId",
        },
        {
            title: "Contact Name",
            dataIndex: "contactName",
        },
        {
            title: "E-Mail",
            dataIndex: "email"
        },
        {
            title: "Phone",
            dataIndex: "phone",
        },
        {
            title: "Status",
            dataIndex: "status"
        },
        {
            title: "Actions",
            dataIndex: "actions",
            key: "action",
            align: "center" as const,
            width: 50,
            render: (_, record: ContactInAccountModel) => (
                <div style={{display: 'flex', justifyContent: 'space-between', gap: '5px'}}>
                    {
                        parentOperation === "EDIT" && (
                                <Tooltip title="Unlink Contact">
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

    const closeLinkedNewContactDrawer = () => {
        setIsLinkedNewContactDrawerOpen(false);
        form.resetFields();
    }


    return (
        <div ref={(reference) => setRef(reference)}>
            <BssCollapse
                title="Linked Contacts"
                defaultExpanded
                extra={
                    parentOperation === "EDIT" && (
                        <Button
                            type="primary"

                            htmlType="submit"
                            size="small"
                            onClick={() => setIsLinkedNewContactDrawerOpen(true)}
                        >
                            Link Contact
                        </Button>
                    )
                }
            >
                {
                accountList && accountList.length > 0 ? (
                        <div className="collapsed-content">
                            <Table
                                columns={columns}
                                dataSource={accountList}
                                rowKey="contactId"
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
            </BssCollapse>
           

            <Drawer
                className="bss-ui-drawer"
                width={600}
                title={<span className="font-2xl-semi-bold">Link New Contact</span>
                }
                open={isLinkedNewContactDrawerOpen}
                onClose={closeLinkedNewContactDrawer}
                closeIcon={
                    <BssSquareButton type="CLOSE" className="close-icon"/>
                }
                destroyOnClose={true}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={(values) => {
                        const isContactAlreadyLinked = accountList.some(
                            (contact) => contact.contactId === values.contact
                        );

                        if (isContactAlreadyLinked) {
                            notificationService("WARNING", "Contact is already linked to this account");
                            return;
                        }
                        addContactToAccount(values.contact, accountId, accountName).then(() => {
                            notificationService("SUCCESS", "Contact linked successfully");
                            fetchContactList();
                            form.resetFields();
                            closeLinkedNewContactDrawer();
                        });
                    }}
                    className="mt-3"
                >
                    <Form.Item
                        label="Contact"
                        name="contact"
                        rules={[{required: true, message: FormInputErrorMessages.REQUIRED}]}
                    >
                        <Select
                            style={{width: '100%'}}
                            placeholder="Please select contact to link"
                            showSearch
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={allContactList.filter(contact => !accountList.some(account => account.contactId === contact.value))}
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

            <DigitalBssConfirmModal
                title="Confirmation"
                isOpen={removeContactDrawer.isDrawerOpen}
                onOk={async () => {
                    if (removeContactDrawer.data) {
                        await removeAccountFromContact(removeContactDrawer.data.contactId, accountId, accountName);
                        notificationService("SUCCESS", "Contact unlinked successfully");
                        fetchContactList();
                        setRemoveContactDrawer({isDrawerOpen: false, data: null})
                    }
                }}
                onCancel={() => setRemoveContactDrawer({isDrawerOpen: false, data: null})}
                btnDanger
            >
                Do you want to unlink the contact - {removeContactDrawer.data?.contactName}?
            </DigitalBssConfirmModal>

        </div>
    )

}

export default ContactsInAccount;