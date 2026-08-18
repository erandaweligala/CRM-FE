import "./CardType1Detail.scss";
import {FC} from "react";
import {hexToRgbA} from "../../../../../../helpers/hexToRGBA";
import { BSS_EmptyValueHandler } from "bss-component-library";

interface CardType1DetailProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    backgroundColor: string;
    contentDescTitle: Array<string>;
    contentDescDesc: Array<string>;
}

const CardType1Detail: FC<CardType1DetailProps> = ({
                                                       title,
                                                       description,
                                                       backgroundColor,
                                                       contentDescTitle,
                                                       contentDescDesc,
                                                       icon,
                                                   }) => {
    return (
        <div className="detail-card-type-1">

            <div style={{display: "flex"}} className="title-container">
                <div
                    className="icon-container content-center-all-side"
                    style={{backgroundColor: backgroundColor}}
                >
                    {icon}
                </div>
                <div
                    className="content-container"
                    style={{backgroundColor: hexToRgbA(backgroundColor, 0.1)}}
                >
                    <span className="text font-md-regular">{title}</span>
                    <span className="text font-2xl-semi-bold">{description}</span>
                </div>
            </div>

            <div className="content-description">
                {
                    contentDescDesc &&
                    contentDescTitle &&
                    contentDescTitle.map((title, index) => (
                        <div className="ml-4 mt-2 mb-2" key={title}>
                            <div className="text font-md-semi-bold">{title}</div>
                            <div className="text-description font-md-regular">
                                <BSS_EmptyValueHandler value={contentDescDesc[index]}></BSS_EmptyValueHandler>
                            </div>
                        </div>
                    ))
                }
            </div>

        </div>
    );
};

export default CardType1Detail;
