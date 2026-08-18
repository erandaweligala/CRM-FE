import { Collapse, Descriptions } from "antd";
import { FC } from "react";
import { collapseCommonProps } from "../../../../../../configs/common-props/common-props";
import { ProductsModel } from "../../../../models/SalesAndServicesModel";
import OrderDetails from "../order-details/OrderDetails";

const {Panel} = Collapse;

const SalesAndServicesTabExpandedCollapse: FC<{ data: ProductsModel }> = ({ data }) => (
    <Collapse
    {...collapseCommonProps}
    className="digital-bss-basic-collapse"
>

    <Panel
        header="Order Details"
        key="Order_Details"
    >
        <OrderDetails data={data.orderDetails}/>
    </Panel>

    <Panel
        header="Offering Characteristic"
        key="Offering Characteristic"
    >
        <Descriptions bordered className="mb-3">
            {
                data.offerCharacteristic.map((singleCharacteristic) => (
                    <Descriptions.Item
                        label={singleCharacteristic.attributeName}
                        key={singleCharacteristic.attributeName}
                    >
                        {singleCharacteristic.attributeValue}
                    </Descriptions.Item>
                ))
            }
        </Descriptions>
    </Panel>

</Collapse>
  );
  export default SalesAndServicesTabExpandedCollapse;
  