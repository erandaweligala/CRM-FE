import React, {useState} from 'react';
import './BSS_Collapse.scss';
import {BSS_SquareButton} from 'bss-component-library';

type BSS_CollapseProps = {
    title: string;
    children: React.ReactNode;
    defaultExpanded?: boolean;
    extra?: React.ReactNode;
    className?: string;
};

const BSS_Collapse: React.FC<BSS_CollapseProps> = ({
                                                       title,
                                                       children,
                                                       defaultExpanded = false,
                                                       extra,
                                                       className
                                                   }) => {

    const [isFirstTimeExpanded, setIsFirstTimeExpanded] = useState(defaultExpanded);
    const [expanded, setExpanded] = useState(defaultExpanded);

    const toggleExpand = () => {
        setExpanded(prev => !prev);
        setIsFirstTimeExpanded(true)
    };

    const icon = expanded ? <BSS_SquareButton type="MINUS"/> : <BSS_SquareButton type="ADD"/>;

    return (
        <div className={`bss-collapse ${className}`}>

            <div className="header" onClick={toggleExpand}>
                <div className="header-left">
                    {icon}
                    <span className="header-title">{title}</span>
                </div>
                {extra && (
                    <div className="header-right" onClick={(e) => e.stopPropagation()}>
                        {extra}
                    </div>
                )}
            </div>


            <div className={`content_wrapper ${expanded ? "is-expanded" : ""}`}>
                {
                    <div className="inner">
                        <div className="ma-4">{(expanded || isFirstTimeExpanded) && children}</div>
                    </div>
                }
            </div>


        </div>
    );
};

export default BSS_Collapse;