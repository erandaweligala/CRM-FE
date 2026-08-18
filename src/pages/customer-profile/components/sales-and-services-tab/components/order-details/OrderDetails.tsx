import {FC} from "react";
import {ColumnsType} from "antd/es/table";
import {Table} from "antd";
import {OrderDetailsModel} from "../../../../models/SalesAndServicesModel";


interface OrderDetailsProps {
    data: OrderDetailsModel[]
}

const OrderDetails: FC<OrderDetailsProps> = ({data}) => {

    const columns: ColumnsType<OrderDetailsModel> = [
        {
            title: 'Product Order ID',
            dataIndex: 'productOrderId',
            key: 'productOrderId',
        },
        {
            title: 'Order Item ID',
            dataIndex: 'orderItemId',
            key: 'orderItemId',
        },
        // {
        //     title: 'Order Item | Action',
        //     dataIndex: 'orderItemAction',
        //     key: 'orderItemAction',
        // },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={data}
            className="mb-3"
            pagination={false}
        />
    )
}

export default OrderDetails;