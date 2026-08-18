import PAGE_NO_DATA from "./../../assets/images/page-no-data.svg?react";
import {FC} from "react";
import "./PageNoData.scss";

interface PageNoDataProps {
    description?: string;
    height?: string;
}

const PageNoData: FC<PageNoDataProps> = ({
                                             description = "No Data",
                                             height = "DEFAULT"
                                         }) => {
    return (
        <div
            className={`page-no-data ${height === "DEFAULT" ? "default-height" : ""}`}
            style={{
                height: height !== "DEFAULT" ? height : ""
            }}
        >
            <PAGE_NO_DATA/>
            <p className="font-md-regular mt-5 description">
                {description}
            </p>
        </div>
    )
}

export default PageNoData;