import { FC, useEffect, useState } from "react";
import { useAppSelector } from "../../../../store/main-store";
import Table, { ColumnsType } from "antd/es/table";
import { OrderItem, OrderStatusFlowModel, OrdersModel, OrdersRequestModel } from "../../models/OrdersModel";
import dayjs from "dayjs";
import { getConnectionOrdersData, getOrdersStepsFlowData } from "../../services/customer-profile.service";
import { BSS_SearchPanel as BssSearchPanel, InputType } from "bss-component-library";
import ExpandedRowRenderer from "./components/ExpandedRowRenderer/ExpandedRowRenderer";
const SearchPanelInputs: InputType[] = [
    {
        type: "INPUT",
        valueName: "orderId",
        label: "Order ID",
        required: false,
        mainInput: false,
        placeholder: "Order ID",
        maxLength: 100
    },
    {
        type: "DATEPICKER",
        valueName: "fromDate",
        label: "From Date",
        required: false,
        mainInput: false,
        placeholder: "From Date",
        dateType: 'FROM_DATE'
    },
    {
        type: "DATEPICKER",
        valueName: "toDate",
        label: "To Date",
        required: false,
        mainInput: false,
        placeholder: "To Date",
        dateType: 'TO_DATE'
    },
    {
        type: "DROPDOWN",
        valueName: "status",
        label: "Status",
        required: false,
        mainInput: false,
        placeholder: "Status",
        values: [
            {
                label: "Acknowledged",
                value: "Acknowledged"
            },
            {
                label: "Rejected",
                value: "Rejected"
            },
            {
                label: "Pending",
                value: "Pending"
            },
            {
                label: "Held",
                value: "Held"
            },
            {
                label: "InProgress",
                value: "InProgress"
            },
            {
                label: "Cancelled",
                value: "Cancelled"
            },
            {
                label: "Completed",
                value: "Completed"
            },
            {
                label: "Failed",
                value: "Failed"
            },
            {
                label: "Partial",
                value: "Partial"
            },
            {
                label: "AssessingCancellation",
                value: "AssessingCancellation"
            },
            {
                label: "PendingCancellation",
                value: "PendingCancellation"
            }
        ]
    }
];

const outerTableColumns: ColumnsType<OrdersModel> = [
    {
        title: 'Order Type',
        dataIndex: 'orderType',
    },
    {
        title: 'OrderID',
        dataIndex: 'orderID',
    },
    {
        title: 'Channel',
        dataIndex: 'channel',
    },
    {
        title: 'OrderDate',
        dataIndex: 'orderDate',
    },
    {
        title: 'Status',
        dataIndex: 'status',
    }
];

const innerTableColumns: ColumnsType<OrderItem> = [
    {
        title: 'Order Item State',
        dataIndex: 'orderItemState',
    },
    {
        title: 'Quantity',
        dataIndex: 'quantity',
    },
    {
        title: 'ProductOffering',
        dataIndex: 'productOffering',
    },
    {
        title: 'OrderItemID',
        dataIndex: 'orderItemID',
    },
    {
        title: 'Item Price',
        dataIndex: 'itemPrice',
    },
];

interface OrdersTabProps {
    msisdn: string | undefined | null;
}

const OrdersTab: FC<OrdersTabProps> = ({ msisdn }) => {

    const ordersFromStore = useAppSelector(state => state.customerProfile.orders);

    const [ordersDataList, setOrdersDataList] = useState<OrdersModel[]>();

    const [stepsDataList, setStepsDataList] = useState<OrderStatusFlowModel[]>();

    const [statusFlowDataList, setStatusFlowDataList] = useState<OrderStatusFlowModel[]>();

    const [expandedRows, setExpandedRows] = useState<string[]>([]);


    useEffect(() => {

        if (ordersFromStore) {
            setOrdersDataList(ordersFromStore);
        }

    }, [ordersFromStore])


    const onClear = async () => {

        const initiaLValues: OrdersRequestModel = {
            orderId: undefined,
            fromDate: undefined,
            toDate: undefined,
            serviceReference: msisdn!,
            status: undefined
        }

        await getConnectionOrdersData(initiaLValues);

    }

    const basicSubmitSummarySearchForm = async (formValues: OrdersRequestModel) => {

        const payload: OrdersRequestModel = {
            orderId: formValues.orderId,
            fromDate: formValues.fromDate && dayjs(formValues?.fromDate).format('YYYY-MM-DD'),
            toDate: formValues.toDate && dayjs(formValues?.toDate).format('YYYY-MM-DD'),
            status: formValues.status,
            serviceReference: msisdn!,
        }
        const ordersData = await getConnectionOrdersData(payload);

        setOrdersDataList(ordersData);

    }

    const handleExpand = (expanded: boolean, record: OrderItem, recode: OrdersModel) => {
        if (expanded) {
            getOrdersStepsFlowData(recode.orderID, record.orderItemID).then((response) => {
                setStepsDataList(response);
            }).catch((error) => { console.log(error) })
        }
        setExpandedRows(expanded ? [record.orderItemID] : []);
    };
    const renderExpandedRow = (record: OrdersModel) => (
        <ExpandedRowRenderer
          record={record}
          onExpandInner={handleExpand}
          stepsDataList={stepsDataList}
          statusFlowDataList={statusFlowDataList}
          setStatusFlowDataList={setStatusFlowDataList}
          expandedRows={expandedRows}
          innerTableColumns={innerTableColumns}
        />
      );
      

    return (
        <>
            <BssSearchPanel
                inputs={SearchPanelInputs}
                title="Orders"
                isExpandBtnVisible={true}
                onSubmit={basicSubmitSummarySearchForm}
                onClear={onClear}
                initialExpandStatus="OPEN"
            />

            <div className="mt-3">
                <Table
                    columns={outerTableColumns}
                    dataSource={ordersDataList}
                    expandable={{
                        expandedRowRender: renderExpandedRow,
                        rowExpandable: (_) => true,
                      }}
                      
                    pagination={false}
                    rowKey="orderID"
                />
            </div>
        </>
    );
}

export default OrdersTab;