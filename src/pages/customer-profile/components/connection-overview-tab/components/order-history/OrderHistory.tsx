import {FC} from "react";
import {ColumnsType} from "antd/es/table";
import {Table} from "antd";
import {OrderSummaryModel} from "../../../../models/ConnectionOverviewModel";
import { BSS_Container as BssContainer, BSS_SquareButton as BssSquareButton, BSS_StatusTag as BssStatusTag } from "bss-component-library";

interface OrderHistoryProps {
    data: OrderSummaryModel[]
}

const OrderHistory: FC<OrderHistoryProps> = () => {

    const dummyData: OrderSummaryModel[] = [
        {
            orderId: "PO1001075",
            orderStatus: "Acknowledged",
            orderDate: "Feb 25, 2023 09:50:51 AM",
        },
        {
            orderId: "PO1001048",
            orderStatus: "Completed",
            orderDate: "Feb 12, 2023 06:08 AM",
        },
        {
            orderId: "PO1000095",
            orderStatus: "Fail",
            orderDate: "Jan 23, 2023 02:30: PM",
        },
        {
            orderId: "PO1000058",
            orderStatus: "Completed",
            orderDate: "Jan 18, 2023 07:15 AM",
        },        {
            orderId: "PO1000012",
            orderStatus: "Completed",
            orderDate: "Jan 06, 2023 10:20 PM",
        }
    ]

    const columns: ColumnsType<OrderSummaryModel> = [
        {
            title: 'Order ID',
            dataIndex: 'orderId',
        },
        {
            title: 'Order Date',
            dataIndex: 'orderDate',
        },
        {
            title: 'Status',
            key: 'orderStatus',
            dataIndex: 'orderStatus',
            align: "center",
            render: (_, recode) => {
                let statusType: "active" | "inactive" | "pending";
                if (recode.orderStatus === "Completed") {
                    statusType = "active";
                } else if (recode.orderStatus === "Fail") {
                    statusType = "inactive";
                } else {
                    statusType = "pending";
                }

                return (
                    <div className="content-center-horizontal">
                        <BssStatusTag
                            type={statusType}
                            className="mr-2"/>
                    </div>
                )
            },
        },
    ];

    return (
            <BssContainer
                titleComponent={<BssSquareButton onClick={() => {
                }} type="MORE"/>}
                title="Last 5 Order History"
                height="250px"
            >
                <div className="pa-3">
                    <Table
                        columns={columns}
                        dataSource={dummyData}
                        pagination={false}
                        rowKey="orderId"
                    />
                </div>
            </BssContainer>
    )
}

export default OrderHistory;