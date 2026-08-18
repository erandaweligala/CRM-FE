import {CSSProperties, FC, ReactNode} from "react";
import './DigitalBssText.scss';
import TextSizes from "../../constants/TextSizes";

interface DigitalBssTextProps {
    size: TextSizes;
    style: 'regular' | 'medium' | 'semi-bold';
    color: 'primary' | 'secondary' | 'tertiary';
    children: ReactNode;
    customStyles?: CSSProperties;
    className?: string;
}

const DigitalBssText: FC<DigitalBssTextProps> = ({
                                                     size,
                                                     style,
                                                     color = 'primary',
                                                     children,
                                                     customStyles,
                                                     className
                                                 }) => {

    return (
        <div
            className={`digital-bss-text ${className} ${size} ${style} ${color}`}
            style={customStyles ? customStyles : undefined}
        >
            {children}
        </div>
    )

}

export default DigitalBssText;