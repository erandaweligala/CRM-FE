import {Empty,Button} from "antd";
import {FC} from "react";
import "./NextBestOffer.scss";
import Tiktok from "../../../../../../assets/images/Tiktok.svg?react";
import DigitalBssText_Temp from "../../../../../../components/DigitalBssText/DigitalBssText"
import { BSS_Container } from "bss-component-library";
interface NextBestOfferProps {
}

const NextBestOffer: FC<NextBestOfferProps> = () => {

    const data: string[] = ["1","2","3"];

    return (
      <BSS_Container
        title="Next Best Offer"     
        className="mb-3">
        {
            (!data || data.length === 0) && <Empty className="mt-4 mb-3" />
        }
        {
            data && data.length > 0 && (
                <div className="content-section">
                     <div className="content-center-vertical">

                        <div className="mr-3">
                            <Tiktok/>
                        </div>
                        <div>
                            <DigitalBssText_Temp 
                              size='md'
                              style='semi-bold'
                              children= 'Tiktok Unlimited'
                              color="primary"
                            />
                        </div>

                    </div>
                  
                    <Button
                        type="default"
                        size="small"
                        onClick={() => {}}
                        className="font-md-regular"
                    >
                        Order Now
                    </Button>
                </div>
        )}
      </BSS_Container>
    );
}

export default NextBestOffer;
