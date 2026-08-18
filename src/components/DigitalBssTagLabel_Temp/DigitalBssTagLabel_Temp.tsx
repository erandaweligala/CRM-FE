import React, {FC} from "react";
import "./DigitalBssTagLabel_Temp.scss";
import {hexToRgbA} from "../../helpers/hexToRGBA";


interface DigitalBssTagLabelProps {
    icon?: React.ReactNode;
    text: string;
    backgroundColor: string;
    className?: string;
}

const DigitalBssTagLabel_Temp: FC<DigitalBssTagLabelProps> = ({
                                                             text,
                                                             backgroundColor,
                                                             icon,
                                                             className
                                                         }) => {

    const containerStyle = `digital-bss-tag content-center-all-side ${className ? className : ''}`

    return (
        <div
            className={containerStyle}
            style={{backgroundColor: hexToRgbA(backgroundColor, 0.1)}}
        >

            <span className={icon ? "mr-1" : ""}>
                {icon}
            </span>

            <span
                className="font-md-semi-bold"
                style={{color: backgroundColor}}
            >
                {text}
            </span>

        </div>
    );
};

export default DigitalBssTagLabel_Temp;
