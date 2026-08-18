import {FC, useEffect, useState} from "react";
import {Button, Empty, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import { getAllAccountData, getParentAccountData} from "./services/Account.services.ts";
import {TablePaginationConfig} from "antd/lib/table/interface";
import ActionPermission from "../../../../components/access-control/action-permission/ActionPermission.tsx";
import ACTION_PERMISSION from "../../../../constants/action-permission.ts";
import {AccountTableModel} from "./models/AccountTable.model.ts";
import {AccountQueryModel} from "./models/AccountQuery.model.ts";
import {useNavigate} from "react-router-dom";
import CreateEntity from "../common-components/create-entity/CreateEntity.tsx";
import {getAllSystemUsersList} from "../../../../services/common-meta-data.service.ts";
import { getAccountType, getIndustryList, getStatusData } from "../contacts-page/services/Contacts.services.ts";
import {BASE_PATH} from "../../../../constants/internal-routes.ts";
import STATUS_COLOR_MAPPING from "../../../../constants/StatusColorMapping.const.ts";
import DropdownValue from "../common-models/DropdownValue.ts";
import { EnterpriseCrmComponent } from "../../../../constants/EnterpriseCrmComponent.const.ts";
import {BSS_Breadcrumb as BssBreadcrumb, BSS_SearchPanel as BssSearchPanel, BSS_SquareButton as BssSquareButton, InputType} from "bss-component-library";

const Accounts: FC = () => {

    const navigate = useNavigate();
    const [isCreateAccountDrawerOpen, setIsCreateAccountDrawerOpen] = useState<boolean>(false);

    const [accountListData, setAccountListData] = useState<{
        totalRecord: number;
        currentPage: number;
        limit: number;
        accountList: AccountTableModel[] | null
    }>({
        currentPage: 1,
        limit: 10,
        totalRecord: 0,
        accountList: null
    })

    const [accountList, setAccountList] = useState<DropdownValue[]>();
    const [ownerList, setOwnerList] = useState<DropdownValue[]>();
    const [formValues, setFormValues] = useState<AccountQueryModel>();
    const [status, setStatus] = useState<DropdownValue[]>();
    const [industry, setIndustry] = useState<DropdownValue[]>();
    const [accountTypeList, setAccountTypeList] = useState<DropdownValue[]>();

    useEffect(() => {
        getParentAccountDataList();
        getOwnerListDetails();
        getAccountListDetails(formValues, 0, accountListData.currentPage, accountListData.limit);
        getStatus();
        getIndustry();
        getAccountTypeList();
    }, []);

    const onClear = async () => {

        const initiaLValues: AccountQueryModel = {
            id: undefined,
            name: undefined,
            brn: undefined,
            status: undefined,
            accountType: undefined,
            ownerId: undefined,
            industry: undefined,
            parentAccountId: undefined,
            offset: 0,
            limit: accountListData.limit
        }

        setFormValues(initiaLValues);

        await getAccountListDetails(initiaLValues, 0, 1, accountListData.limit);
    }

    const basicSubmitSummarySearchForm = async (formValues: AccountQueryModel) => {
        setFormValues(formValues);
        await getAccountListDetails(formValues, 0, accountListData.currentPage, accountListData.limit);

    };

    const getAccountListDetails = async (formValues?: AccountQueryModel, offset?: number, currentPage?: number, limit?: number) => {
        const queryParams: AccountQueryModel = {
            id: formValues?.id,
            name: formValues?.name,
            brn: formValues?.brn,
            status: formValues?.status,
            accountType: formValues?.accountType,
            ownerId: formValues?.ownerId,
            limit: limit!,
            industry: formValues?.industry,
            offset: offset!,
            parentAccountId: formValues?.parentAccountId
        };
        const [response, pageDetails] = await getAllAccountData(queryParams);

        setAccountListData({
            currentPage: currentPage!,
            limit: limit!,
            totalRecord: parseInt(pageDetails.totalRecords),
            accountList: response
        })
    }
    const tableChangeHandler = async (pagination: TablePaginationConfig) => {
        const offset = accountListData.limit === pagination.pageSize ? (pagination.current ?? 1) * pagination.pageSize - pagination.pageSize : 0;
        const limit = pagination.pageSize;
        const currentPage = accountListData.limit === pagination.pageSize ? pagination.current! : 1;
        await getAccountListDetails(formValues,offset, currentPage, limit);
    };
    const columns: ColumnsType<AccountTableModel> = [
        {
            title: "Account Name",
            dataIndex: "name",
            key: "Account Name",
        },
        {
            title: "BRN",
            dataIndex: "brn",
            key: "BRN",
        },
        {
            title: "Account Type",
            dataIndex: "accountType",
            key: "Account Type",
        },
        {
            title: "Industry",
            dataIndex: "industry",
            key: "Industry",
        },
        {
            title: "Owner ID",
            dataIndex: "ownerId",
            key: "Owner Id",
        },
        {
            title: "Parent Account Name",
            dataIndex: "parentAccountName",
            key: "parentAccountName",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            align: "center",
            render: (status: string) => {
              const style =
                STATUS_COLOR_MAPPING[status] || { color: "#000", bgColor: "#F0F5FD" };
          
              const formatStatus = (s: string) => {
                
                const spaced = s
                  .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
                  .replace(/([a-z\d])([A-Z])/g, "$1 $2")
                  .trim();
          
                return spaced
                  .split(" ")
                  .map((word, idx) =>
                    idx === 0 && word.length <= 4
                      ? word.toUpperCase() 
                      : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                  )
                  .join(" ");
              };
          
              return (
                <span
                  style={{
                    backgroundColor: style.bgColor,
                    color: style.color,
                    padding: "4px 8px",
                    borderRadius: 8,
                    fontWeight: 500,
                    display: "inline-block",
                    minWidth: 100,
                    textAlign: "center",
                  }}
                >
                  {status ? formatStatus(status) : "No Status"}
                </span>
              );
            },
          },
          {
            title: "Action",
            key: "action",
            align: "center" as const,
            render: (item: AccountTableModel) => {
                return (
                        <ActionPermission action={ACTION_PERMISSION.DISPLAY_MORE_USER_DETAILS}>
                            <BssSquareButton
                                onClick={() => {
                                    navigate(BASE_PATH + "/accounts/" + item.id)
                                }}
                                type="VIEW"
                                className="mr-1"
                            />
                        </ActionPermission>
                )
            }
        }
    ];

    const getParentAccountDataList = async () => {

        const response = await getParentAccountData();
        const updatedValues = response.map((items) => {
            return {
                label: items.name,
                value: items.id
            }
        })

        setAccountList(updatedValues);

    }
    
    const getOwnerListDetails = async () => {

        const response = await getAllSystemUsersList();
        setOwnerList(response);

    };

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

    const getIndustry = async () => {
        const response = await getIndustryList();
        const updatedValues = response.map((items) => {
            return {
                label: items.name,
                value: items.value
            }
        })

        setIndustry(updatedValues);

    }

    const getAccountTypeList = async () => {
        const response = await getAccountType();
        const updatedValues = response.map((items) => {
            return {
                label: items.name,
                value: items.value
            }
        })

        setAccountTypeList(updatedValues);

    }

    const SearchPanelInputs: InputType[] = [
        {
            type: "INPUT",
            valueName: "id",
            label: "Account ID",
            required: false,
            mainInput: true,
            placeholder: "Account ID"
        },
        {
            type: "INPUT",
            valueName: "name",
            label: "Account Name",
            required: false,
            mainInput: true,
            placeholder: "Account Name",
        },
        {
            type: "DROPDOWN",
            valueName: "accountType",
            label: "Account Type",
            required: false,
            mainInput: false,
            placeholder: "Account Type",
            values: accountTypeList ?? []
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
        {
            type: "DROPDOWN",
            valueName: "parentAccountId",
            label: "Parent Account",
            required: false,
            mainInput: false,
            placeholder: "Parent Account ID",
            values: accountList ?? []
        },
        {
            type: "DROPDOWN",
            valueName: "industry",
            label: "Industry",
            required: false,
            mainInput: false,
            placeholder: "Industry",
            values: industry ?? []
        },
        {
            type: "INPUT",
            valueName: "brn",
            label: "BRN",
            required: false,
            mainInput: false,
            placeholder: "BRN"
        },
    ]
    const handleReloadAndCloseDrawer = async () => {
        getAccountListDetails(formValues, 0, 1, accountListData.limit);
        setIsCreateAccountDrawerOpen(false);
    };

    const closeDrawer = () => {
        setIsCreateAccountDrawerOpen(false);
    };

    return (
        <div className="page">

            <BssBreadcrumb>
                <BssBreadcrumb.Section>CRM</BssBreadcrumb.Section>
                <BssBreadcrumb.Section>Accounts</BssBreadcrumb.Section>

                <BssBreadcrumb.RightContent>
                    <ActionPermission action={ACTION_PERMISSION.DISPLAY_CREATE_USER}>
                         <Button
                            type="primary"
                            onClick={() => {
                                setIsCreateAccountDrawerOpen(true)
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
                        title="Search Account"
                        isExpandBtnVisible={true}
                        onSubmit={basicSubmitSummarySearchForm}
                        onClear={onClear}
                    />

                    {
                        accountListData.accountList &&
                        accountListData.accountList.length > 0 ? (
                                <div className="mt-4">
                                    <Table
                                        columns={columns}
                                        dataSource={accountListData.accountList}
                                        rowKey="id"
                                        onChange={tableChangeHandler}
                                        pagination={{
                                            total: (accountListData.totalRecord),
                                            current: (accountListData.currentPage),
                                            pageSize: (accountListData.limit),
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
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                          </div>
                        )}

                </div>
            </ActionPermission>

            <CreateEntity
                isDrawerOpen={isCreateAccountDrawerOpen}
                closeDrawer={(doReload:boolean) => doReload ? handleReloadAndCloseDrawer() : closeDrawer()}
                entityType={EnterpriseCrmComponent.ACCOUNTS}
                operation="NEW"
            />

        </div>
    );

};

export default Accounts;
