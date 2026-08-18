
import { Col, Row } from "antd";
import React, {FC} from "react";
import TextSizes from "../../constants/TextSizes";
import '../DigitalBssText/DigitalBssText.scss';

interface DigitalBssLabelValueHorizontalTempProps {
    label: string;
    labelSize?: TextSizes;
    labelStyle?: 'regular' | 'medium' | 'semi-bold';
    value: React.ReactNode;
    valueSize?: TextSizes;
    valueStyle?: 'regular' | 'medium' | 'semi-bold';
}

const DigitalBssLabelValueHorizontal_Temp: FC<DigitalBssLabelValueHorizontalTempProps> = ({
    label,
    value,
    labelSize = 'sm',
    labelStyle = 'medium',
    valueSize = 'md',
    valueStyle = 'semi-bold'
}) => {

    return (
        <Row align="middle" style={{height: 28}}>
            <Col
                className={`digital-bss-label-horizontal ${labelSize} ${labelStyle}`}
            >
                {label}
            </Col>
            {
                value &&
                typeof value === 'string' && 
                    <Col
                        flex="auto"
                        style={{textAlign: "right"}}
                        className={`digital-bss-label-horizontal ${valueSize} ${valueStyle}`}
                    >
                        {value}
                    </Col>
            }
            {
                value &&
                typeof value !== 'string' && 
                    <Col
                        flex="auto"
                        style={{textAlign: "right"}}
                    >
                        {value}
                    </Col>
            }
        </Row>
    )
}

export default DigitalBssLabelValueHorizontal_Temp;