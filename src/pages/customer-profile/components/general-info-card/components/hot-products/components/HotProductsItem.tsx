import {FC} from "react";
import "./HotProductsItem.scss";
import {Button} from "antd";
import DigitalBssText_Temp from "../../../../../../../components/DigitalBssText/DigitalBssText"
interface HotProductsItemProps {
    IconComponent: FC<React.SVGProps<SVGSVGElement>>;
    title:string;
}

const HotProductsItem: FC<HotProductsItemProps> = ({IconComponent,title}) => {

    return (
        <div className="hot-product-content-section">
            <div className="content-center-vertical">

                <div className="mr-3">
                    <IconComponent/>
                </div>
                <div>
                    <DigitalBssText_Temp 
                      size='md'
                      style='semi-bold'
                      children= {title}
                      color="primary"
                    />
                </div>
                
            </div>

            <Button
                size="small"
                type="default"
                onClick={() => {}}
                className="font-md-regular"
            >
                Order Now
            </Button>
    </div>
    );
}

export default HotProductsItem;
