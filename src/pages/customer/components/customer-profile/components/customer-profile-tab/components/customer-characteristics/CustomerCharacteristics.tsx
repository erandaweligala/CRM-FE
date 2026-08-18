import {FC} from "react";
import {Descriptions, Empty} from "antd";
import { CustomerCharacteristicModel } from "../../../../../../../customer-profile/models/CustomerProfileModel";

interface CustomerCharacteristicsProps {
    data: CustomerCharacteristicModel[]
}

const CustomerCharacteristics: FC<CustomerCharacteristicsProps> = ({data}) => {
    return (
        data.length === 0 ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Empty className="mt-4 mb-3" description={"No Identification Available"}/>
            </div>
        ) : (
        <Descriptions bordered className="mb-3">
            {
                data.map((singleReference) => {
                    return <Descriptions.Item label={singleReference.attributeName} key={singleReference.attributeName}>{singleReference.attributeValue}</Descriptions.Item>
                })
            }
        </Descriptions>
        )
    )
}

export default CustomerCharacteristics;