import {FC} from "react";
import {ColumnsType} from "antd/es/table";
import {Collapse, Table} from "antd";
import { BSS_SquareButton as BssSquareButton } from "bss-component-library";
import { collapseCommonProps } from "../../../../../../../../configs/common-props/common-props";
import BillsModel from "./models/BillsModel";

interface PrBillProp {

}
const PrBill: FC<PrBillProp> = () => {

    const innerTableColumns: ColumnsType<BillsModel> = [
        {
            title: 'Bill ID',
            dataIndex: 'billId',
        },
        {
            title: 'Bill Period',
            dataIndex: 'billPeriod',
        },
        {
            title: 'Bill Generated Date',
            dataIndex: 'billGeneratedDate',
        },
        {
            title: 'Charge for the Period',
            dataIndex: 'chargeForThePeriod',
        },
        {
            title: 'Total Payable',
            dataIndex: 'totalPayable',
        },
        {
            title: 'Action',
            dataIndex: '',
            width: 100,
            align: "center",
            render: () => {
                return (
                    <div className="text-align-center">
                        <BssSquareButton type="DOWNLOAD"/>
                    </div>
                )
            }
        }
    ];

    const billList: BillsModel[] = [
        {
            billId: "INV698745",
            billPeriod: "2023-08-15 To 2023-09-14",
            billGeneratedDate: "2023-09-15",
            chargeForThePeriod: "Rs. 56,154.00",
            totalPayable: "Rs. 60,154.00"
        },
        {
            billId: "INV687744",
            billPeriod: "2023-07-15 To 2023-08-14",
            billGeneratedDate: "2023-08-15",
            chargeForThePeriod: "Rs. 70,154.00",
            totalPayable: "Rs. 65.079.84"
        },
        {
            billId: "INV679871",
            billPeriod: "2023-06-15 To 2023-07-14",
            billGeneratedDate: "2023-07-15",
            chargeForThePeriod: "Rs. 41,154.00",
            totalPayable: "Rs. 65,541.00"
        },
        {
            billId: "INV661784",
            billPeriod: "2023-05-15 To 2023-06-14",
            billGeneratedDate: "2023-06-15",
            chargeForThePeriod: "Rs. 60,154.00",
            totalPayable: "Rs. 65,514.00"
        },
        {
            billId: "INV660005",
            billPeriod: "2023-04-15 To 2023-05-14",
            billGeneratedDate: "2023-05-15",
            chargeForThePeriod: "Rs. 87,415.00",
            totalPayable: "Rs. 81,415.00",
        },
    ];

    return (
            <Collapse
                {...collapseCommonProps}
                defaultActiveKey={["1"]}
                className="digital-bss-basic-collapse"
            >
                <Collapse.Panel
                    header="Bills"
                    key="1"
                >
                    <Table
                        columns={innerTableColumns}
                        dataSource={billList}
                        pagination={{
                            showSizeChanger: true,
                            hideOnSinglePage: true
                        }}
                        rowKey="mailId"
                    />
                </Collapse.Panel>
            </Collapse>
    )

}

export default PrBill;