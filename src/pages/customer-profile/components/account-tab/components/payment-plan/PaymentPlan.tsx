import {FC} from "react";
import {PaymentPlanModel} from "../../../../models/AccountModel";
import {ColumnsType} from "antd/es/table";
import {Table} from "antd";

interface PaymentPlanProps {
    data: PaymentPlanModel[]
}

const PaymentPlan: FC<PaymentPlanProps> = ({data}) => {

    const tableColumns: ColumnsType<PaymentPlanModel> = [
        {
            title: 'Number of Payment',
            dataIndex: 'numberOfPayment',
        },
        {
            title: 'Payment Frequency',
            dataIndex: 'paymentFrequency',
        },
        {
            title: 'Priority',
            dataIndex: 'priority',
        },
        {
            title: 'Payment Method',
            dataIndex: 'paymentMethod',
        },
        {
            title: 'Total Amount',
            dataIndex: 'totalAmount',
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
        },
        {
            title: 'Status',
            dataIndex: 'status',
        }
    ];

    return (
        <Table
            columns={tableColumns}
            dataSource={data}
            pagination={false}
            rowKey="id"
        />
    )
}

export default PaymentPlan;