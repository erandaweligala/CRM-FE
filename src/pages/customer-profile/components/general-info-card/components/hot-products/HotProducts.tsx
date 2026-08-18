import {Empty} from "antd";
import {FC} from "react";
import Youtube from "../../../../../../assets/images/youtube.svg?react";
import Netflix from "../../../../../../assets/images/netflix.svg?react";
import Facebook from "../../../../../../assets/images/facebook.svg?react";
import HotProductsItem from "./components/HotProductsItem";
import { BSS_Container } from "bss-component-library";


interface HotProductsProps {
}

const HotProducts: FC<HotProductsProps> = () => {

    const data: string[] = ["1","2","3"];

    return (
      <BSS_Container
        title="Hot Products"     
        className="mb-3">
        {
            (!data || data.length === 0) && <Empty className="mt-4 mb-3" />
        }
        {
            data && data.length > 0 && (
                <>

                    <HotProductsItem IconComponent={Youtube}  title="Youtube Surfer" />
                    <HotProductsItem IconComponent={Netflix}  title="Netflix Unlimited" />
                    <HotProductsItem IconComponent={Facebook}  title="Social Media blaster" />
               
                </>
        )}
      </BSS_Container>
    );
}

export default HotProducts;
