import {FC} from "react";
import {CustomerBills} from "../../../../models/AccountModel";
import {ColumnsType} from "antd/es/table";
import {Table} from "antd";
import {downloadAFileFromUrl} from "../../../../services/customer-profile.service";
import { BSS_SquareButton } from "bss-component-library";
interface BillsProps {
    data: CustomerBills[]
}
const Bills: FC<BillsProps> = ({data}) => {

    const downloadSelectBill = async (billRecode: CustomerBills) => {
        await downloadAFileFromUrl(billRecode.billDocument, billRecode.billingPeriod + " Bill.pdf");
    }

    const tableColumns: ColumnsType<CustomerBills> = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: 'Bill No',
            dataIndex: 'billNo',
        },
        {
            title: 'Bill Date',
            dataIndex: 'billDate',
        },

        {
            title: 'Billing Period',
            dataIndex: 'billingPeriod',
        },
        {
            title: 'Next Bill Date',
            dataIndex: 'nextBillDate',
        },
        {
            title: 'Amount Due',
            dataIndex: 'amountDue',
        },
        {
            title: 'Payment Due Date',
            dataIndex: 'paymentDueDate',
        },
        {
            title: 'Run Type',
            dataIndex: 'runType',
        },
        {
            title: 'State',
            dataIndex: 'state',
        },
        {
            title: 'Category',
            dataIndex: 'category',
        },
        {
            title: 'Action',
            dataIndex: 'Action',
            render: (_value, record) => {
                return (
                    <BSS_SquareButton
                        type="DOWNLOAD"
                        isButtonInsideTable={true}
                        onClick={() => downloadSelectBill(record)}
                    />
                )
            }
        },
    ]

    return (
        <Table
            columns={tableColumns}
            dataSource={data}
            pagination={false}
            rowKey="id"
        />
    )

}

export default Bills;