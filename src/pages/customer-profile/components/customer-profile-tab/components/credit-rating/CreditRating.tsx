import {FC} from "react";
import {CreditRatingModel} from "../../../../models/CustomerProfileModel";
import {ColumnsType} from "antd/es/table";
import {Table} from "antd";

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
        <Table
            columns={tableColumns}
            dataSource={data}
            pagination={false}
            rowKey="creditAgencyName"
        />
    )
}

export default CreditRating;