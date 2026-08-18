import { FC } from "react";
import { Descriptions } from "antd";
import { ProductResponseSearchBody } from "../models/ProductDetailsListResponseBody.model";

interface ProductDetailsViewProps {
    clickedItem: ProductResponseSearchBody;
}

const ProductDetailsView: FC<ProductDetailsViewProps> = ({ clickedItem }) => {

    return (
        <>
            {clickedItem && (
                <Descriptions bordered className="custom-descriptions" column={1}>
                    <Descriptions.Item label="Product Name">{clickedItem.name}</Descriptions.Item>
                    <Descriptions.Item label="Product ID">{clickedItem.productId}</Descriptions.Item>
                    <Descriptions.Item label="Product Category">{clickedItem.category}</Descriptions.Item>
                </Descriptions>
            )}
          
                {/* <PageNoData description="This Feature Is Not Fully Complted Yet" height="200px" /> */}



        </>
    )
}

export default ProductDetailsView;