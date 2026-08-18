import {FC} from "react";
import {CustomerCharacteristicModel} from "../../../../models/CustomerProfileModel";
import {Descriptions} from "antd";

interface CustomerCharacteristicsProps {
    data: CustomerCharacteristicModel[]
}

const CustomerCharacteristics: FC<CustomerCharacteristicsProps> = ({data}) => {
    return (
        <Descriptions bordered className="mb-3">
            {
                data.map((singleReference) => {
                    return <Descriptions.Item label={singleReference.attributeName} key={singleReference.attributeName}>{singleReference.attributeValue}</Descriptions.Item>
                })
            }
        </Descriptions>
    )
}

export default CustomerCharacteristics;