import { FC, useEffect, useState } from "react";
import ACTION_PERMISSION from "../../../../constants/action-permission.ts";
import ActionPermission from "../../../../components/access-control/action-permission/ActionPermission.tsx";
import { Button, Empty, Table } from "antd";
import { TablePaginationConfig } from "antd/lib/table/interface"
import { LeadsTableModel } from "./models/LeadsTable.model.ts";
import { MetaDataModel } from "./models/MetaData.model.ts";
import { LeadsQueryModel } from "./models/LeadsQuery.model.ts";
import { getAllSystemUsersList } from "../../../../services/common-meta-data.service.ts";
import { getAllLeadData, getLeadSourceList, getLeadStatusData } from "./services/Leads.services.ts";
import { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import { getParentAccountData } from "../accounts-page/services/Account.services.ts";
import {BASE_PATH} from "../../../../constants/internal-routes.ts";
import STATUS_COLOR_MAPPING from "../../../../constants/StatusColorMapping.const.ts";
import { EnterpriseCrmComponent } from "../../../../constants/EnterpriseCrmComponent.const.ts";
import DropdownValue from "../common-models/DropdownValue.ts";
import { BSS_Breadcrumb as BssBreadcrumb, BSS_SearchPanel as BssSearchPanel, BSS_SquareButton as BssSquareButton, InputType } from "bss-component-library";
import CrmEntityForm from "../common-components/crm-entity-form/CrmEntityForm.tsx";

interface LeadProps {
}

const Leads: FC<LeadProps> = () => {

    const navigate = useNavigate();
    const [isCreateLeadDrawerOpen, setIsCreateLeadDrawerOpen] = useState<boolean>(false)

    const [leadsListData, setLeadsListData] = useState<{
        totalRecord: number;
        currentPage: number;
        limit: number;
        leadList: LeadsTableModel[] | null;
    }>({
        currentPage: 1,
        limit: 10,
        totalRecord: 0,
        leadList: null
    })


    const [accountList, setAccountList] = useState<MetaDataModel[]>()
    const [formValues, setFormValues] = useState<LeadsQueryModel>();
    const [ownerList, setOwnerList] = useState<DropdownValue[]>();
    const [leadStatus, setLeadStatus] = useState<DropdownValue[]>();
    const [leadSource, setLeadSource] = useState<DropdownValue[]>();


    useEffect(() => {
        getLeadsAccountDataList();
        getOwnerListDetails();
        getLeadsListDetails(formValues, 0, leadsListData.currentPage, leadsListData.limit);
        getLeadStatus();
        getLeadSource();
    }, []);


    const getOwnerListDetails = async () => {

        const response = await getAllSystemUsersList();
        setOwnerList(response);

    };

    const getLeadStatus = async () => {
        const response = await getLeadStatusData();
        const updatedValues = response.map((items) => {
            return {
                label: items.name,
                value: items.value
            }
        })

        setLeadStatus(updatedValues);

    };

    const getLeadSource = async () => {
        const response = await getLeadSourceList();
        const updatedValues = response.map((items) => {
            return {
                label: items.name,
                value: items.value
            }
        })

        setLeadSource(updatedValues);

    }


    const onClear = async () => {

        const initiaLValues: LeadsQueryModel = {
            id: undefined,
            name: undefined,
            ownerId: undefined,
            creationDate: undefined,
            status: undefined,
            leadSource: undefined,
            accountName: undefined,
            contactName: undefined,
            offset: 0,
            limit: leadsListData.limit
        }

        setFormValues(initiaLValues);

        await getLeadsListDetails(initiaLValues, 0, 1, leadsListData.limit);

    }


    const basicSubmitSummarySearchForm = async (formValues: LeadsQueryModel) => {
        setFormValues(formValues);
        await getLeadsListDetails(formValues, 0, leadsListData.currentPage, leadsListData.limit);
    };

    const getLeadsListDetails = async (formValues?: LeadsQueryModel, offset?: number, currentPage?: number, limit?: number) => {


        const queryParams: LeadsQueryModel = {
            id: formValues?.id,
            name: formValues?.name,
            ownerId: formValues?.ownerId,
            creationDate: formValues?.creationDate,
            status: formValues?.status,
            leadSource: formValues?.leadSource,
            accountName: formValues?.accountName,
            contactName: formValues?.contactName,
            limit: limit!,
            offset: offset!,
        };


        const [response, pageDetails] = await getAllLeadData(queryParams);


        setLeadsListData({
            currentPage: currentPage!,
            limit: limit!,
            totalRecord: parseInt(pageDetails.totalRecords),
            leadList: response
        });

    }
        const tableChangeHandler = async (pagination: TablePaginationConfig) => {
            const offset = leadsListData.limit === pagination.pageSize ? (pagination.current ?? 1) * pagination.pageSize - pagination.pageSize : 0;
            const limit = pagination.pageSize;
            const currentPage = leadsListData.limit === pagination.pageSize ? pagination.current! : 1;
            await getLeadsListDetails(formValues,offset, currentPage, limit);
        };
    const columns: ColumnsType<LeadsTableModel> = [
        {
            title: "Lead Name",
            dataIndex: "name",
            key: "Name",
        },
        {
            title: "Creation Date",
            dataIndex: "creationDate",
            key: "Creation- Date",
        },
        {
            title: "Contact Name",
            dataIndex: "contactName",
            key: "Contact Name",
        },
        {
            title: "Owner ID",
            dataIndex: "ownerId",
            key: "Owner Id",
        },
        {
            title: "Account Name",
            dataIndex: "accountName",
            key: "Account Name",
        },
        {
            title: "Lead Source",
            dataIndex: "leadSource",
            key: "leadSource",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            align: 'center',
            render: (status: string) => {
                const style = STATUS_COLOR_MAPPING[status] || { color: "#000", bgColor: "#F0F5FD" };
            
            
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
            render: (item: LeadsTableModel) => {
                return (
                        <ActionPermission action={ACTION_PERMISSION.DISPLAY_MORE_USER_DETAILS}>
                            <BssSquareButton
                                onClick={() => {
                                    navigate(BASE_PATH + "/leads/" + item.id)
                                }}
                                type="VIEW"
                                className="mr-1"
                            />
                        </ActionPermission>
                )
            }
        }
    ];


    const getLeadsAccountDataList = async () => {
        const response = await getParentAccountData();
        const updatedValues = response.map((items) => {
            return {
                label: items.name,
                value: items.id
            }
        })

        setAccountList(updatedValues);

    }


    const SearchPanelInputs: InputType[] = [
        {
            type: "INPUT",
            valueName: "id",
            label: "Lead ID",
            required: false,
            mainInput: true,
            placeholder: "ID"
        },
        {
            type: "INPUT",
            valueName: "name",
            label: "Lead Name",
            required: false,
            mainInput: true,
            placeholder: "Name",
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
            values: leadStatus ?? []
        },
        {
            type: "DROPDOWN",
            valueName: "leadSource",
            label: "Lead Source",
            required: false,
            mainInput: false,
            placeholder: "Lead Source",
            values: leadSource ?? []
        },

    ]
    const handleReloadAndCloseDrawer = async () => {
        await getLeadsListDetails(formValues, 0, 1, leadsListData.limit);
        closeDrawer();
    };

    const closeDrawer = () => {
        setIsCreateLeadDrawerOpen(false);
    };

    return (
        <div className="page">
            <BssBreadcrumb>
                <BssBreadcrumb.Section>CRM</BssBreadcrumb.Section>
                <BssBreadcrumb.Section>Leads</BssBreadcrumb.Section>
                <BssBreadcrumb.RightContent>
                    <Button
                            type="primary"
                            onClick={() => {
                                setIsCreateLeadDrawerOpen(true)
                            }}
                           
                            htmlType="submit"
                            size="small"
                        >
                            Create New
                        </Button>
                </BssBreadcrumb.RightContent>
            </BssBreadcrumb>


            <ActionPermission action={ACTION_PERMISSION.DISPLAY_USERS_LIST}>
                <div className="page-container">

                    <BssSearchPanel
                        inputs={SearchPanelInputs}
                        title="Search Lead"
                        isExpandBtnVisible={true}
                        onSubmit={basicSubmitSummarySearchForm}
                        onClear={onClear}
                    />

                    {
                        leadsListData.leadList &&
                            leadsListData.leadList.length > 0 ? (
                                <div className="mt-4">

                                    <Table
                                        columns={columns}
                                        dataSource={leadsListData.leadList}
                                        rowKey="userId"
                                        onChange={tableChangeHandler}
                                        pagination={{
                                            total: leadsListData.totalRecord,
                                            current: leadsListData.currentPage,
                                            pageSize: leadsListData.limit,
                                            pageSizeOptions: [10, 25, 50],
                                            showSizeChanger: true,
                                        }}
                                        rowClassName={() => 'custom-table-row'}
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


            <CrmEntityForm
                isDrawerOpen={isCreateLeadDrawerOpen}
                closeDrawer={(doReload:boolean) => doReload ? handleReloadAndCloseDrawer() : closeDrawer()}
                entityType={EnterpriseCrmComponent.LEADS}
                operation="NEW"
            />

        </div>
    )

}

export default Leads;