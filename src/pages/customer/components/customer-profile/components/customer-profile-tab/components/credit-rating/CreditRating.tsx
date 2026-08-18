import {FC} from "react";
import {ColumnsType} from "antd/es/table";
import {Empty, Table} from "antd";
import { CreditRatingModel } from "../../../../../../../customer-profile/models/CustomerProfileModel";

interface CreditRatingProps {
    data: CreditRatingModel[]
}

const CreditRating: FC<CreditRatingProps> = ({data}) => {

    const tableColumns: ColumnsType<CreditRatingModel> = [
        {
            title: 'Credit Agency Name',
            dataIndex: 'creditAgencyName',
        },
        {
            title: 'Credit Agency Type',
            dataIndex: 'creditAgencyType',
        },
        {
            title: 'Rating Reference',
            dataIndex: 'ratingReference',
        },
        {
            title: 'Rating Score',
            dataIndex: 'ratingScore',
        },
    ];

    return (
        data.length === 0 ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Empty className="mt-4 mb-3" description={"No Credit Rating Available"}/>
            </div>
        ) : (
        <Table
            columns={tableColumns}
            dataSource={data}
            pagination={false}
            rowKey="creditAgencyName"
        />
        )
    )
}

export default CreditRating;