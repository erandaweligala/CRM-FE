import {Col, Empty, Row} from "antd";
import {FC} from "react";
import DigitalBssTagLabel_Temp from "../../../../../../components/DigitalBssTagLabel_Temp";
import { BSS_Container } from "bss-component-library";

interface CustomerInterestsProps {
}

const CustomerInterests: FC<CustomerInterestsProps> = () => {

    const data: string[] = ["1","2","3"];

    return (
      <BSS_Container title="Customer Interests" className="mb-3">
        {
            (!data || data.length === 0) && <Empty className="mt-4 mb-3" />
        }
        {
             data && data.length > 0 && (
            <Row gutter={[8,8]} className="mb-3 mt-3"  style={{marginRight: 7,marginLeft:7}}>
                <Col span={8} >
                     <DigitalBssTagLabel_Temp text="Movie Lover" backgroundColor="#57B79A" />
                </Col>
                <Col span={8} >
                    <DigitalBssTagLabel_Temp text="Music Lover" backgroundColor="#F0973E" />
                </Col>
                <Col span={8} >
                    <DigitalBssTagLabel_Temp text="Google Maps" backgroundColor="#DD6E63" />
                </Col>
                <Col span={8} >
                    <DigitalBssTagLabel_Temp text="Facebook" backgroundColor="#3F8EB8" />
                </Col>
                <Col span={8} >
                    <DigitalBssTagLabel_Temp text="App Use" backgroundColor="#DD6E63" />
                </Col>
                <Col span={8} >
                    <DigitalBssTagLabel_Temp text="Car Lover" backgroundColor="#9E3EF0" />
                </Col>
            </Row>
        )}
      </BSS_Container>
    );
}

export default CustomerInterests;