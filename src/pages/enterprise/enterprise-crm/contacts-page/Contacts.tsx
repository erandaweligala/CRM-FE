import {FC, useEffect, useState} from "react";
import {Button, Empty, Table,} from "antd";
import {ColumnsType} from "antd/es/table";
import {getAllContactData, getStatusData} from "./services/Contacts.services.ts";
import {TablePaginationConfig} from "antd/lib/table/interface";
import ActionPermission from "../../../../components/access-control/action-permission/ActionPermission.tsx";
import ACTION_PERMISSION from "../../../../constants/action-permission.ts";
import {MetaDataModel} from "./models/MetaData.model.ts";
import {ContactTableModel} from "./models/ContactTable.model.ts";
import {ContactQueryModel} from "./models/ContactQuery.model.ts";
import {useNavigate} from "react-router-dom";
import CreateEntity from "../common-components/create-entity/CreateEntity.tsx";
import {getAllSystemUsersList} from "../../../../services/common-meta-data.service.ts";
import {getParentAccountData} from "../accounts-page/services/Account.services.ts";
import {BASE_PATH} from "../../../../constants/internal-routes.ts";
import STATUS_COLOR_MAPPING from "../../../../constants/StatusColorMapping.const.ts";
import {EnterpriseCrmComponent} from "../../../../constants/EnterpriseCrmComponent.const.ts";
import DropdownValue from "../common-models/DropdownValue.ts";
import { BSS_Breadcrumb as BssBreadcrumb, BSS_SearchPanel as BssSearchPanel, BSS_SquareButton as BssSquareButton, InputType } from "bss-component-library";

const Contacts: FC = () => {

    const navigate = useNavigate();
    const [isCreateContactsDrawerOpen, setIsCreateContactsDrawerOpen] = useState<boolean>(false);

    const [contactsListData, setContactsListData] = useState<{
        totalRecord: number;
        currentPage: number;
        limit: number;
        contactList: ContactTableModel[] | null;
    }>({
        currentPage: 1,
        limit: 10,
        totalRecord: 0,
        contactList: null
    })

    const [accountList, setAccountList] = useState<MetaDataModel[]>()
    const [formValues, setFormValues] = useState<ContactQueryModel>();
    const [ownerList, setOwnerList] = useState<DropdownValue[]>();
    const [status, setStatus] = useState<DropdownValue[]>()

    useEffect(() => {
        getAccountDataList();
        getOwnerListDetails();
        getContactListDetails(formValues, 0, contactsListData.currentPage, contactsListData.limit);
        getStatus();
    }, []);

    const getOwnerListDetails = async () => {

        const response = await getAllSystemUsersList();
        setOwnerList(response);

    };

    const onClear = async () => {

        const initiaLValues: ContactQueryModel = {
            id: undefined,
            name: undefined,
            givenName: undefined,
            familyName: undefined,
            accountName: undefined,
            accountId: undefined,
            email: undefined,
            ownerId: undefined,
            phone: undefined,
            status: undefined,
            offset: 0,
            limit: contactsListData.limit
        }

        setFormValues(initiaLValues);

        await getContactListDetails(initiaLValues, 0, 1, contactsListData.limit);

    }

    const basicSubmitSummarySearchForm = async (formValues: ContactQueryModel) => {
        setFormValues(formValues);
        await getContactListDetails(formValues, 0, contactsListData.currentPage, contactsListData.limit);
    };

    const getContactListDetails = async (formValues?: ContactQueryModel, offset?: number, currentPage?: number, limit?: number) => {

        const queryParams: ContactQueryModel = {
            id: formValues?.id,
            name: formValues?.name,
            givenName: formValues?.givenName,
            familyName: formValues?.familyName,
            accountName: formValues?.accountName,
            accountId: formValues?.accountId,
            email: formValues?.email,
            ownerId: formValues?.ownerId,
            phone: formValues?.phone,
            status: formValues?.status,
            limit: limit!,
            offset: offset!,
        };

        const [response, pageDetails] = await getAllContactData(queryParams);

        setContactsListData({
            currentPage: currentPage!,
            limit: limit!,
            totalRecord: parseInt(pageDetails.totalRecords),
            contactList: response
        });

    }
    const tableChangeHandler = async (pagination: TablePaginationConfig) => {
        const offset = contactsListData.limit === pagination.pageSize ? (pagination.current ?? 1) * pagination.pageSize - pagination.pageSize : 0;
        const limit = pagination.pageSize;
        const currentPage = contactsListData.limit === pagination.pageSize ? pagination.current! : 1;
        await getContactListDetails(formValues,offset, currentPage, limit);
    };
    const columns: ColumnsType<ContactTableModel> = [
        {
            title: "Contact Name",
            dataIndex: "name",
            key: "Name",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "Email",
        },
        {
            title: "Owner ID",
            dataIndex: "ownerId",
            key: "Owner Id",
        },
        {
            title: "Phone",
            dataIndex: "phone",
            key: "Phone",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            align: 'center',
            render: (status: string) => {
                const style = STATUS_COLOR_MAPPING[status] || {color: "#000", bgColor: "#F0F5FD"};
                return (
                    <span
                        style={{
                            backgroundColor: style.bgColor,
                            color: style.color,
                            padding: "4px 8px",
                            borderRadius: "8px",
                            fontWeight: 500,
                            display: "inline-block",
                            minWidth: "100px",
                            textAlign: "center",
                        }}
                    >
                        {status ? status.replace(/([A-Z])/g, ' $1').trim() : "No Status"}
                    </span>
                );
            },
        },
        {
            title: "Action",
            key: "action",
            align: "center" as const,
            render: (item: ContactTableModel) => {
                return (
                        <ActionPermission action={ACTION_PERMISSION.DISPLAY_MORE_USER_DETAILS}>
                            <BssSquareButton
                                onClick={() => {
                                    navigate(BASE_PATH + "/contacts/" + item.id)
                                }}
                                type="VIEW"
                                className="mr-1"
                            />
                        </ActionPermission>
                )
            }
        }
    ];

    const getAccountDataList = async () => {
        const response = await getParentAccountData();
        const updatedValues = response.map((items) => {
            return {
                label: items.name,
                value: items.id
            }
        })

        setAccountList(updatedValues);

    }

    const getStatus = async () => {
        const response = await getStatusData();
        const updatedValues = response.map((items) => {
            return {
                label: items.name,
                value: items.value
            }
        })

        setStatus(updatedValues);

    }

    const SearchPanelInputs: InputType[] = [
        {
            type: "INPUT",
            valueName: "id",
            label: "Contact ID",
            required: false,
            mainInput: true,
            placeholder: "ID"
        },
        {
            type: "INPUT",
            valueName: "givenName",
            label: "First Name",
            required: false,
            mainInput: true,
            placeholder: "First Name",
        }, {
            type: "INPUT",
            valueName: "familyName",
            label: "Last Name",
            required: false,
            mainInput: true,
            placeholder: "Last Name",
        },
        {
            type: "DROPDOWN",
            valueName: "accountName",
            label: "Account Name",
            required: false,
            mainInput: false,
            placeholder: "Account Name",
            values: accountList ?? []
        },
        {
            type: "INPUT",
            valueName: "email",
            label: "Email",
            required: false,
            mainInput: false,
            placeholder: "Email",
        },
        {
            type: "INPUT",
            valueName: "phone",
            label: "Phone",
            required: false,
            mainInput: false,
            placeholder: "Phone",
        },
        {
            type: "DROPDOWN",
            valueName: "ownerId",
            label: "Owner",
            required: false,
            mainInput: false,
            placeholder: "Owner ID",
            values: ownerList ?? []
        },
        {
            type: "DROPDOWN",
            valueName: "status",
            label: "Status",
            required: false,
            mainInput: false,
            placeholder: "Status",
            values: status ?? []
        },

    ]

    const handleReloadAndCloseDrawer = async () => {
        getContactListDetails(formValues, 0, 1, contactsListData.limit);
        setIsCreateContactsDrawerOpen(false);
    };

    const closeDrawer = () => {
        setIsCreateContactsDrawerOpen(false);
    };
    return (
        <div className="page">

            <BssBreadcrumb>
                <BssBreadcrumb.Section>CRM</BssBreadcrumb.Section>
                <BssBreadcrumb.Section>Contacts</BssBreadcrumb.Section>

                <BssBreadcrumb.RightContent>
                    <ActionPermission action={ACTION_PERMISSION.DISPLAY_CREATE_USER}>
                        <Button
                            type="primary"
                            onClick={() => {
                                setIsCreateContactsDrawerOpen(true)
                            }}
                           
                            htmlType="submit"
                            size="small"
                        >
                            Create New
                        </Button>
                    </ActionPermission>
                </BssBreadcrumb.RightContent>
            </BssBreadcrumb>

            <ActionPermission action={ACTION_PERMISSION.DISPLAY_USERS_LIST}>
                <div className="page-container">

                    <BssSearchPanel
                        inputs={SearchPanelInputs}
                        title="Search Contact"
                        isExpandBtnVisible={true}
                        onSubmit={basicSubmitSummarySearchForm}
                        onClear={onClear}
                    />

                    {
                        contactsListData.contactList &&
                        contactsListData.contactList.length > 0 ? (
                                <div className="mt-4">

                                    <Table
                                        columns={columns}
                                        dataSource={contactsListData.contactList}
                                        rowKey="userId"
                                        onChange={tableChangeHandler}
                                        pagination={{
                                            total: (contactsListData.totalRecord),
                                            current: (contactsListData.currentPage),
                                            pageSize: (contactsListData.limit),
                                            pageSizeOptions: [10, 25, 50],
                                            showSizeChanger: true
                                        }}
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
                        )}

                </div>
            </ActionPermission>

            <CreateEntity
                isDrawerOpen={isCreateContactsDrawerOpen}
                closeDrawer={(doReload) => doReload ? handleReloadAndCloseDrawer() : closeDrawer()}
                entityType={EnterpriseCrmComponent.CONTACTS}
                operation="NEW"
            />

        </div>
    );

};

export default Contacts;
