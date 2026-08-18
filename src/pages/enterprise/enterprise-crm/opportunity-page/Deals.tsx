import {FC, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {DealsTableModel} from "./models/DealsTable.model.ts";
import {
    getAllAccountList,
    getAllContactList,
    getAllSystemUsersList
} from "../../../../services/common-meta-data.service.ts";
import {DealsQueryModel} from "./models/DealsQuery.models.ts";
import {Button, Empty, TablePaginationConfig} from "antd";
import Table, {ColumnsType} from "antd/es/table";
import ActionPermission from "../../../../components/access-control/action-permission/ActionPermission.tsx";
import PageNoData from "../../../../components/page-no-data/PageNoData.tsx";
import {getAllDealData, getAllDealKanbanData, getDealStage} from "./services/Deals.services.ts";
import ACTION_PERMISSION from "../../../../constants/action-permission.ts";
import "./Deals.scss"
import DealsKanbanViewQueryModel from "./models/DealsKanbanViewQuery.model.ts";
import DealsKanbanViewResponseModel from "./models/DealsKanbanViewResponse.model.ts";
import dayjs from "dayjs";
import {BASE_PATH} from "../../../../constants/internal-routes.ts";
import STATUS_COLOR_MAPPING from "../../../../constants/StatusColorMapping.const.ts";
import { EnterpriseCrmComponent } from "../../../../constants/EnterpriseCrmComponent.const.ts";
import DropdownValue from "../common-models/DropdownValue.ts";
import { BSS_Breadcrumb as BssBreadcrumb, BSS_SearchPanel as BssSearchPanel, BSS_SquareButton as BssSquareButton, DefaultInputType, InputType } from "bss-component-library";
import CrmEntityForm from "../common-components/crm-entity-form/CrmEntityForm.tsx";
import KanbanView from "./components/kanban-view/KanbanView.tsx";

interface DealProps {

}
const defaultValues: DefaultInputType[] = [
    {
        valueName: "closingDateTo",
        defaultValue:  dayjs()
    },
    {
        valueName: "closingDateFrom",
        defaultValue: dayjs().subtract(1, 'year')
    }
];
const Deals: FC<DealProps> = () => {

    const navigate = useNavigate();
    const [isCreateDealDrawerOpen, setIsCreateDealDrawerOpen] = useState<boolean>(false);
    const [dataRepresentationType, setDataRepresentationType] = useState<"Table" | "Kanban">("Kanban")
    const [isSearchClicked, setIsSearchClicked] = useState<boolean>(false);

    const [dealsListData, setDealsListData] = useState<{
        totalRecord: number;
        currentPage: number;
        limit: number;
        dealList: DealsTableModel[] | null;
    }>({
        currentPage: 1,
        limit: 10,
        totalRecord: 0,
        dealList: null
    })

    const [kanbanData, setKanbanData] = useState<DealsKanbanViewResponseModel[]>([])
    const [formValues, setFormValues] = useState<DealsQueryModel>();
    const [ownerList, setOwnerList] = useState<DropdownValue[]>();
    const [accountIDList, setAccountIDList] = useState<DropdownValue[]>();
    const [contactIDList, setContactIDList] = useState<DropdownValue[]>();
    const [dealStageList, setDealStageList] = useState<DropdownValue[]>();

    useEffect(() => {
        getOwnerListDetails();
        getAccountListDetails();
        getContactListDetails();
        getDealStageList();
    }, []);


    const getOwnerListDetails = async () => {
        const response = await getAllSystemUsersList();
        setOwnerList(response);

    };

    const getAccountListDetails = async () => {
        const response = await getAllAccountList();
        setAccountIDList(response);

    };

    const getContactListDetails = async () => {
        const response = await getAllContactList();
        setContactIDList(response);

    };

    const getDealStageList = async () => {
        const response = await getDealStage();
        const updatedValues = response.map((items) => {
            return {
                label: items.name,
                value: items.label
            }
        })

        setDealStageList(updatedValues);

    }

    const onClear = async () => {
        setIsSearchClicked(false);
        const initialValues: DealsQueryModel = {
            id: undefined,
            name: undefined,
            ownerId: undefined,
            closingDateFrom: undefined,
            closingDateTo: undefined,
            stage: undefined,
            accountId: undefined,
            contactId: undefined,
            offset: 0,
            limit: dealsListData.limit
        }

        setFormValues(initialValues);

        await getDealsListDetails(initialValues, 0, 1, dealsListData.limit);

    }


    const basicSubmitSummarySearchForm = async (formValues: DealsQueryModel) => {
        setFormValues(formValues);
        setIsSearchClicked(true);
        if (dataRepresentationType === "Table") {
            await getDealsListDetails(formValues, 0, dealsListData.currentPage, dealsListData.limit);
        } else if (dataRepresentationType === "Kanban") {
            await getKanbanDealsDetails(formValues as DealsKanbanViewQueryModel)
        }
    };


    const getDealsListDetails = async (formValues?: DealsQueryModel, offset?: number, currentPage?: number, limit?: number) => {

        if (!formValues) {
            throw new Error("formValues is undefined");
        }

        const queryParams: DealsQueryModel = {
            id: formValues.id,
            name: formValues.name,
            ownerId: formValues.ownerId,
            closingDateFrom: dayjs(formValues.closingDateFrom).format('YYYY-MM-DD'),
            closingDateTo: dayjs(formValues.closingDateTo).format('YYYY-MM-DD'),
            stage: formValues.stage,
            accountId: formValues.accountId,
            contactId: formValues.contactId,
            limit: limit!,
            offset: offset!,
        };


        const [response, pageDetails] = await getAllDealData(queryParams);

        setDealsListData({
            currentPage: currentPage!,
            limit: limit!,
            totalRecord: parseInt(pageDetails.totalRecords),
            dealList: response
        });

    }

    const getKanbanDealsDetails = async (formValues: DealsKanbanViewQueryModel) => {

        const queryParams: DealsKanbanViewQueryModel = {
            id: formValues.id,
            name: formValues.name,
            ownerId: formValues.ownerId,
            closingDateFrom: dayjs(formValues.closingDateFrom).format('YYYY-MM-DD'),
            closingDateTo: dayjs(formValues.closingDateTo).format('YYYY-MM-DD'),
            accountId: formValues.accountId,
            contactId: formValues.contactId
        };


        const apiResponse = await getAllDealKanbanData(queryParams);

        setKanbanData(apiResponse);

    }
    const tableChangeHandler = async (pagination: TablePaginationConfig) => {
        const offset = dealsListData.limit === pagination.pageSize ? (pagination.current ?? 1) * pagination.pageSize - pagination.pageSize : 0;
        const limit = pagination.pageSize;
        const currentPage = dealsListData.limit === pagination.pageSize ? pagination.current! : 1;
        await getDealsListDetails(formValues, offset, currentPage, limit);
    };
    const isNumeric=(value: number | string | null | undefined)=> {
        return /^-?\d+$/.test(String(value));
    }
    const columns: ColumnsType<DealsTableModel> = [
        {
            title: "Name",
            dataIndex: "name",
            key: "Name",
        },
        {
            title: "Owner ID",
            dataIndex: "ownerId",
            key: "Owner Id",
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (amount: number | string | null | undefined) => {
                console.log(amount+" "+isNumeric(amount));
                if (!amount || amount === ""||!isNumeric(amount)) return "Rs. 0.00";

                let formattedAmount: string;

                if (typeof amount === "string" && amount.toUpperCase().includes("E")) {
                    formattedAmount = Number(amount).toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                    });
                }
                formattedAmount = Number(amount).toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                });

                return `Rs. ${formattedAmount}`;
            },
        }
        ,
        {
            title: "Stage",
            dataIndex: "stage",
            key: "Stage",
            align: 'center',
            render: (stage: string) => {
                const style = STATUS_COLOR_MAPPING[stage] || {color: "#000", bgColor: "#F0F5FD"};
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
                        {stage ? stage.replace(/([A-Z])/g, ' $1').trim() : "No Details Stage"}
                    </span>
                );
            },
        },
        {
            title: "Closing Date",
            dataIndex: "closingDate",
            key: "Closing Date",
        },
        {
            title: "Account Name",
            dataIndex: "accountName",
            key: "Account Name",
        },
        {
            title: "Contact Name",
            dataIndex: "contactName",
            key: "Contact Name",
        },
        {
            title: "Action",
            key: "action",
            align: "center" as const,
            render: (item: DealsTableModel) => {
                return (
                        <ActionPermission action={ACTION_PERMISSION.DISPLAY_MORE_USER_DETAILS}>
                            <BssSquareButton
                                onClick={() => {
                                    navigate(BASE_PATH + "/deals/" + item.id)
                                }}
                                type="VIEW"
                                className="mr-1"
                            />
                        </ActionPermission>
                )
            }
        }
    ];


    const SearchPanelInputs: InputType[] = [
        {
            type: "DROPDOWN",
            valueName: "accountId",
            label: "Account",
            required: false,
            mainInput: false,
            placeholder: "Account",
            values: accountIDList ?? []
        },
        {
            type: "DROPDOWN",
            valueName: "ownerId",
            label: "Owner",
            required: false,
            mainInput: false,
            placeholder: "Owner",
            values: ownerList ?? []
        },
        {
            type: "DROPDOWN",
            valueName: "contactId",
            label: "Contact",
            required: false,
            mainInput: false,
            placeholder: "Contact",
            values: contactIDList ?? []
        },
        {
            type: "INPUT",
            valueName: "name",
            label: "Opportunity Name",
            required: false,
            mainInput: false,
            placeholder: "Name"
        },
        {
            type: "INPUT",
            valueName: "id",
            label: "Opportunity ID",
            required: false,
            mainInput: false,
            placeholder: "ID"
        },
        {
            type: "DATEPICKER",
            valueName: "closingDateFrom",
            label: "Closing Date From",
            required: true,
            mainInput: true,
            placeholder: "Closing Date From",
            dateType: "FROM_DATE"
        },
        {
            type: "DATEPICKER",
            valueName: "closingDateTo",
            label: "Closing Date To",
            required: true,
            mainInput: true,
            placeholder: "Closing Date To",
            dateType: "TO_DATE"
        }
    ]

    if (dataRepresentationType === "Table") {
        SearchPanelInputs.push({
            type: "DROPDOWN",
            valueName: "stage",
            label: "Stage",
            required: false,
            mainInput: false,
            placeholder: "Stage",
            values: dealStageList
        })
    }
    const reloadAndCloseDrawer = () => {
        getDealsListDetails(formValues, 0, 1, dealsListData.limit);
        setIsCreateDealDrawerOpen(false);
      };
  
      const closeDrawerWithoutReload = () => {
          setIsCreateDealDrawerOpen(false);
      };

    return (
        <div className="deals">

            <BssBreadcrumb>
                <BssBreadcrumb.Section>CRM</BssBreadcrumb.Section>
                <BssBreadcrumb.Section>Opportunity</BssBreadcrumb.Section>
                <BssBreadcrumb.RightContent>
                    <div className="content-center-vertical">
                    <Button
                            type="primary"
                            onClick={() => {
                                setIsCreateDealDrawerOpen(true)
                            }}
                            className="mr-1"   
                            htmlType="submit"
                            size="small"
                        >
                            Create New
                        </Button>
                        {
                            dataRepresentationType === "Kanban" &&
                            <Button
                                type="default"
                                htmlType="submit"
                                onClick={() => setDataRepresentationType("Table")}
                                size="small"
                            >
                                Switch to Table View
                            </Button>
                        }
                        {
                            dataRepresentationType === "Table" &&
                            <Button
                                type="default"
                                htmlType="submit"
                                onClick={() => setDataRepresentationType("Kanban")}
                                size="small"
                            >
                                Switch to Kanban View
                            </Button>

                        }
                    </div>
                </BssBreadcrumb.RightContent>
            </BssBreadcrumb>


            <ActionPermission action={ACTION_PERMISSION.DISPLAY_USERS_LIST}>

                <div className="page-body" style={{marginTop: 12}}>

                    <BssSearchPanel
                        inputs={SearchPanelInputs}
                        title="Search Opportunity"
                        isExpandBtnVisible={true}
                        onSubmit={basicSubmitSummarySearchForm}
                        onClear={onClear}
                        defaultValues={defaultValues}
                    />

                    {
                        dataRepresentationType === "Table" && isSearchClicked && (
                            <>
                                {dealsListData.dealList && dealsListData.dealList.length > 0 ? (
                                    <div className="mt-4">
                                        <Table
                                            columns={columns}
                                            dataSource={dealsListData.dealList}
                                            rowKey="userId"
                                            onChange={tableChangeHandler}
                                            pagination={{
                                                total: dealsListData?.totalRecord ?? 0,
                                                current: dealsListData?.currentPage ?? 1,
                                                pageSize: dealsListData?.limit ?? 10,
                                                pageSizeOptions: [10, 25, 50],
                                                showSizeChanger: true,
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
                            </>
                        )
                    }


                    {
                        dataRepresentationType === "Kanban" && isSearchClicked && (
                            <>
                                {kanbanData?.length > 0 ? (
                                    <div>
                                        <KanbanView
                                            kanbanData={kanbanData}
                                        />
                                    </div>

                                ) : null}
                            </>
                        )
                    }

                    {
                        !isSearchClicked &&
                        <PageNoData
                            description="Not seeing anything here? Enter a search query to see results displayed below."/>
                    }

                </div>

            </ActionPermission>

            <CrmEntityForm
                isDrawerOpen={isCreateDealDrawerOpen}
                closeDrawer={(doReload:boolean) => doReload ? reloadAndCloseDrawer() : closeDrawerWithoutReload()}
                entityType={EnterpriseCrmComponent.DEALS}
                operation="NEW"
            />

        </div>
    )

}

export default Deals;