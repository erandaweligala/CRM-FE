import {ColumnsType} from "antd/es/table";
import {Collapse, Table} from "antd";
import PaymentModel from "./model/Payment.model";
import { collapseCommonProps } from "../../../../../../../../configs/common-props/common-props";

const PrPayment = () => {

    const innerTableColumns: ColumnsType<PaymentModel> = [
        {
            title: 'Payment ID',
            dataIndex: 'paymentId',
        },
        {
            title: 'Date',
            dataIndex: 'paymentDate',
        },
        {
            title: 'Payment Method',
            dataIndex: 'paymentMethod',
        },
        {
            title: 'Status',
            dataIndex: 'status',
        },
        {
            title: 'Payment Amount',
            dataIndex: 'paymentAmount',
        }
    ];

    const paymentDataSet1 = [
        { paymentId: "P10001", paymentDate: "2023-10-01 10:00 AM", paymentMethod: "Credit Card", status: "Success", paymentAmount: "Rs.50,000.00" },
        { paymentId: "P10002", paymentDate: "2023-09-20 02:30 PM", paymentMethod: "UPI", status: "Pending", paymentAmount: "Rs.15,000.00" },
        { paymentId: "P10003", paymentDate: "2023-08-15 11:45 AM", paymentMethod: "PayPal", status: "Failed", paymentAmount: "Rs.25,000.00" },
        { paymentId: "P10004", paymentDate: "2023-07-10 05:20 PM", paymentMethod: "Bank Transfer", status: "Success", paymentAmount: "Rs.30,000.00" },
        { paymentId: "P10005", paymentDate: "2023-06-05 09:15 AM", paymentMethod: "Credit Card", status: "Success", paymentAmount: "Rs.45,000.00" },
        { paymentId: "P10006", paymentDate: "2023-05-25 03:40 PM", paymentMethod: "UPI", status: "Pending", paymentAmount: "Rs.20,000.00" },
        { paymentId: "P10007", paymentDate: "2023-04-18 08:30 AM", paymentMethod: "PayPal", status: "Success", paymentAmount: "Rs.35,000.00" },
    ];

    const paymentDataSet2 = [
        { paymentId: "P20001", paymentDate: "2023-10-05 01:00 PM", paymentMethod: "Bank Transfer", status: "Success", paymentAmount: "Rs.55,000.00" },
        { paymentId: "P20002", paymentDate: "2023-09-25 04:15 PM", paymentMethod: "Credit Card", status: "Failed", paymentAmount: "Rs.10,000.00" },
        { paymentId: "P20003", paymentDate: "2023-08-20 07:30 AM", paymentMethod: "UPI", status: "Success", paymentAmount: "Rs.40,000.00" },
        { paymentId: "P20004", paymentDate: "2023-07-15 06:45 PM", paymentMethod: "PayPal", status: "Pending", paymentAmount: "Rs.18,000.00" },
        { paymentId: "P20005", paymentDate: "2023-06-10 12:00 PM", paymentMethod: "Credit Card", status: "Success", paymentAmount: "Rs.60,000.00" },
        { paymentId: "P20006", paymentDate: "2023-05-30 09:50 AM", paymentMethod: "Bank Transfer", status: "Failed", paymentAmount: "Rs.22,000.00" },
        { paymentId: "P20007", paymentDate: "2023-04-22 02:20 PM", paymentMethod: "UPI", status: "Success", paymentAmount: "Rs.38,000.00" },
    ];

    const getRandomBoolean = () => {
        const array = new Uint8Array(1);
        window.crypto.getRandomValues(array);
        return array[0] > 127;
    };

    const paymentData = getRandomBoolean() ? paymentDataSet1 : paymentDataSet2;

    const paymentList: PaymentModel[] = paymentData.map(payment => ({
        ...payment
    }));

    return (
            <Collapse
                {...collapseCommonProps}
                defaultActiveKey={["1"]}
                className="digital-bss-basic-collapse"
            >
                <Collapse.Panel
                    header="Payments"
                    key="1"
                >
                    <Table
                        columns={innerTableColumns}
                        dataSource={paymentList}
                        pagination={{
                            showSizeChanger: true,
                            hideOnSinglePage: true
                        }}
                        rowKey="paymentId"
                    />
                </Collapse.Panel>
            </Collapse>
    )

}

export default PrPayment;