import {
    Table,
} from "antd";
import {FC, useState, useEffect, useRef} from "react";
import {ColumnsType} from "antd/es/table";
import PageNoData from "../../components/page-no-data/PageNoData";
import {ActionLogQueryParamsModel, ActionLogsModel} from "./models/ActionLogsModel";
import {
    getActionLogsData,
    getActivitiesData,
    getSearchTypesData,
    getStatusCodesData,
    getUserNameData
} from "./services/actionLogs.services";
import {TablePaginationConfig} from "antd/lib/table/interface";
import dayjs from "dayjs";
import ActionPermission from "../../components/access-control/action-permission/ActionPermission";
import ACTION_PERMISSION from "../../constants/action-permission";
import SecondarySearchPanel from "./components/secondary-search-panel/SecondarySearchPanel";
import { BSS_Breadcrumb as BssBreadcrumb, BSS_SearchPanel as BssSearchPanel, DropdownType, InputType } from "bss-component-library";

const columns: ColumnsType<ActionLogsModel> = [
    {
        title: "Transaction ID",
        dataIndex: "transactionId",
        key: "transactionId",
    },
    {
        title: "Date And Time",
        dataIndex: "dateAndTime",
        key: "dateAndTime",
    },
    {
        title: "Username",
        dataIndex: "userName",
        key: "userName",
    },
    {
        title: "Activity",
        dataIndex: "activity",
        key: "activity",
    },
    {
        title: "Subject Type",
        dataIndex: "subjectType",
        key: "subjectType",
    },
    {
        title: "Subject Value",
        dataIndex: "subjectValue",
        key: "subjectValue",
    },
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
    },
    {
        title: "Status Description",
        dataIndex: "statusDescription",
        key: "statusDescription",
    }
    // {
    //   title: "Client Ip",
    //   dataIndex: "clientIp",
    //   key: "clientIp",
    // }
];


interface ActionLogsProps {
}

const ActionLogs: FC<ActionLogsProps> = () => {


    const [actionLogsData, setActionLogsData] = useState<{
        totalRecord: number;
        currentPage: number;
        itemPerPage: number;
        actionLogsList: ActionLogsModel[] | null
    }>({
        currentPage: 1,
        itemPerPage: 10,
        totalRecord: 0,
        actionLogsList: null
    })


    const [searchValues, setSearchValues] = useState<ActionLogQueryParamsModel>();
    const [searchTypesList, setSearchTypesList] = useState<DropdownType[]>();
    const [statusCodeList, setStatusCodeList] = useState<DropdownType[]>();
    const [activitiesList, setActivitiesList] = useState<DropdownType[]>();

    const fwdRef = useRef<any>();

    useEffect(() => {
        fetchSearchTypesDataDropDown();
        fetchActivitiesDataDropDown();
        fetchStatusCodesDataDropDown();
        fetchUserNamesDataDropDown();

        getActionLogsDetails(0, 1, actionLogsData.itemPerPage);
    }, [])


    useEffect(() => {

        if (searchValues) {
            getActionLogsDetails(0, 1, actionLogsData.itemPerPage);
        }

    }, [searchValues])


    const fetchSearchTypesDataDropDown = async () => {
        const response = await getSearchTypesData();
        const changedResponse = response.map((item) => {
            return {
                label: item.name,
                value: item.id
            }
        })
        setSearchTypesList(changedResponse);
    };


    const fetchStatusCodesDataDropDown = async () => {
        const response = await getStatusCodesData();
        const changedResponse = response.map((item) => {
            return {
                label: item.name,
                value: item.id
            }
        })
        setStatusCodeList(changedResponse);
    };


    const fetchUserNamesDataDropDown = async () => {
        const response = await getUserNameData();
        const changedResponse = response.map((item) => {
            return {
                label: item.name,
                value: item.id
            }
        })
        console.log("userNamesList", changedResponse)
    };


    const fetchActivitiesDataDropDown = async () => {
        const response = await getActivitiesData();
        const changedResponse = response.map((item) => {
            return {
                label: item.name,
                value: item.id
            }
        })
        setActivitiesList(changedResponse);
    };


    const SearchPanelInputs: InputType[] = [
        {
            type: "DROPDOWN",
            valueName: "subjectTypeId",
            label: "Subject Type",
            required: false,
            mainInput: true,
            placeholder: "Subject Type",
            values: searchTypesList
        },
        {
            type: "INPUT",
            valueName: "subjectValue",
            label: "Subject Value",
            required: false,
            mainInput: true,
            placeholder: "Subject Value",
            maxLength: 10,
        }
    ]


    const onClear = async () => {

        const initiaLValues: ActionLogQueryParamsModel = {
            offSet:0,
            itemsPerPage:actionLogsData.itemPerPage,
            fromDate:undefined ,
            toDate:undefined ,
            subjectTypeId:undefined ,
            subjectTypeValue:undefined ,
            subjectValue:undefined ,
            userId:undefined ,
            user:undefined ,
            activityId:undefined ,
            activityValue:undefined ,
            statusId:undefined ,
            status:undefined ,
            transactionId:undefined ,
            sortBy:undefined ,
            sortOrder:undefined ,
        }

        setSearchValues(initiaLValues)

        await getActionLogsDetails(0, 1, 10);

    }

    const basicSubmitSummarySearchForm = async (formValues: ActionLogQueryParamsModel) => {
        setSearchValues(formValues);
        await getActionLogsDetails( 0, actionLogsData.currentPage, actionLogsData.itemPerPage);
    };


    const getActionLogsDetails = async (offset?: number, currentPage?: number, itemPerPage?: number) => {

        const queryParams: ActionLogQueryParamsModel = {
            itemsPerPage: itemPerPage!,
            offSet: offset!,
            fromDate: searchValues?.fromDate && dayjs(searchValues?.fromDate).format('YYYY-MM-DD'),
            toDate: searchValues?.toDate && dayjs(searchValues?.toDate).format('YYYY-MM-DD'),
            subjectTypeValue: searchValues?.subjectTypeId && searchTypesList?.find(element => element.value === searchValues?.subjectTypeId)?.label,
            subjectValue: searchValues?.subjectValue,
            user: searchValues?.userId,
            activityValue: searchValues?.activityId && activitiesList?.find(element => element.value === searchValues?.activityId)?.label,
            status: searchValues?.statusId && statusCodeList?.find(element => element.value === searchValues?.statusId)?.label,
            transactionId: searchValues?.transactionId,
            //sortBy:
            //sortOrder:string;
        };

        const [actionLogsDataR, pageDetails] = await getActionLogsData(queryParams);

        setActionLogsData({
            currentPage: currentPage!,
            itemPerPage: itemPerPage!,
            totalRecord: parseInt(pageDetails.totalRecords),
            actionLogsList: actionLogsDataR
        })

    };

    const tableChangeHandler = (pagination: TablePaginationConfig) => {
        const offset = actionLogsData.itemPerPage === pagination.pageSize ? (pagination.current ?? 1) * pagination.pageSize - pagination.pageSize : 0;
        const itemPerPage = pagination.pageSize;
        const currentPage = actionLogsData.itemPerPage === pagination.pageSize ? pagination.current! : 1;
        getActionLogsDetails(offset, currentPage, itemPerPage);
    }


    return (
        <>

            <BssBreadcrumb>
                <BssBreadcrumb.Section>CRM</BssBreadcrumb.Section>
                <BssBreadcrumb.Section>System</BssBreadcrumb.Section>
                <BssBreadcrumb.Section>Action Logs</BssBreadcrumb.Section>
            </BssBreadcrumb>


            <ActionPermission action={ACTION_PERMISSION.DISPLAY_AUDIT_LOG}>

                <div className="common-page-margin">

                    <BssSearchPanel
                        isExpandBtnVisible={true}
                        onSubmit={basicSubmitSummarySearchForm}
                        title="Action Logs"
                        inputs={SearchPanelInputs}
                        key={'searchResults'}
                        ref={fwdRef}
                        onClear={onClear}
                    >
                      <SecondarySearchPanel
                            statusCodeList={statusCodeList ?? []}
                            activitiesList={activitiesList ?? []}
                            fwdRef={fwdRef}
                        />  
                    </BssSearchPanel>


                    {
                        actionLogsData.actionLogsList && actionLogsData.actionLogsList.length > 0 ? (
                            <div className="mt-3">
                                <Table
                                    columns={columns}
                                    dataSource={actionLogsData.actionLogsList}
                                    rowKey="transactionId"
                                    onChange={tableChangeHandler}
                                    pagination={{
                                        total: actionLogsData.totalRecord,
                                        current: (actionLogsData.currentPage),
                                        pageSize: (actionLogsData.itemPerPage),
                                        pageSizeOptions: [10, 25, 50],
                                        showSizeChanger: true
                                    }}
                                />
                            </div>
                        ) : (
                            <PageNoData description="No Data Found"/>
                        )
                    }
                </div>

            </ActionPermission>
        </>
    );
};

export default ActionLogs;
  