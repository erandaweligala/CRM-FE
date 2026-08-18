import {FC} from "react";
import {BillingDetailsModel} from "../../../../models/AccountModel";
import {Descriptions, Tag} from "antd";

interface BillingDetailsProps {
    data: BillingDetailsModel
}

const BillingDetails: FC<BillingDetailsProps> = ({data}) => {
    return (
        <Descriptions bordered className="mb-3">
            <Descriptions.Item label="Billing Format">{data.billFormat}</Descriptions.Item>
            <Descriptions.Item label="Billing Presentation">{data.billPresentation.map((singlePresentation) => (<Tag color="blue" key={singlePresentation}>{singlePresentation}</Tag>))}</Descriptions.Item>
            <Descriptions.Item label="Cycle Start Date">{data.cycleStartDate}</Descriptions.Item>
            <Descriptions.Item label="Cycle End Date">{data.cycleEndDate}</Descriptions.Item>
            <Descriptions.Item label="Payment Due Date">{data.paymentDueDate}</Descriptions.Item>
            <Descriptions.Item label="Billing Period">{data.billingPeriod}</Descriptions.Item>
        </Descriptions>
    )
}

export default BillingDetails;