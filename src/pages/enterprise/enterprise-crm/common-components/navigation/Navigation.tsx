import {FC} from "react";

interface NavigationProps {
    sections: string[];
    selectedSection: string;
    onClickMenuItem: (section: string) => void;
}

const Navigation: FC<NavigationProps> = ({
                                             sections,
                                             selectedSection,
                                             onClickMenuItem
                                         }) => {
    return (
        <div
            style={{
                width: 200,
                background: "transparent",
                position: "fixed",
                height: "500px",
            }}
        >
            {
                sections.map((singleSection) => {
                    return (
                        <div
                            className={`navigation-item ${
                                selectedSection === singleSection ? "selected" : ""
                            }`}
                            onClick={() => {
                                onClickMenuItem(singleSection);
                            }}
                            key={singleSection}
                        >
                            <div className="inner-container font-md-medium pl-3">
                                {singleSection}
                            </div>
                        </div>
                    );
                })
            }

        </div>
    )
}

export default Navigation;