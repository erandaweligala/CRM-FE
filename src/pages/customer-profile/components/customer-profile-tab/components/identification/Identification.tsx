import {FC} from "react";
import {ColumnsType} from "antd/es/table";
import {IdentificationModel} from "../../../../models/CustomerProfileModel";
import {Table} from "antd";
import dayjs from "dayjs";

interface IdentificationProps {
    data: IdentificationModel[]
}

const Identification: FC< IdentificationProps> = ({data}) => {



    const tableColumns: ColumnsType<IdentificationModel> = [
        {
            title: 'Identification Type',
            dataIndex: 'identificationType',
        },
        {
            title: 'Identification ID',
            dataIndex: 'identificationId',
        },
        {
            title: 'Expiration Period',
            dataIndex: 'expirationPeriod',
        },
        {
            title: 'Issuing Date',
            dataIndex: 'issuingDate',
            render: (date: string) => dayjs(date).format("DD MMM YYYY"),
        },
        {
            title: 'Issuing Authority',
            dataIndex: 'issuingAuthority',
        },
        // {
        //     title: 'Attachment',
        //     align: "center",
        //     render: (_, record) => {
        //         return (
        //             <span style={{color: "blue", fontWeight: 500}}>View Attachment Button</span>
        //         )
        //     },
        // },
    ];

    return (
        <Table
            columns={tableColumns}
            dataSource={data}
            pagination={false}
            rowKey="identificationId"
        />
    )
}

export default  Identification;