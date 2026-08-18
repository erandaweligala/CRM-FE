import { BSS_SquareButton } from "bss-component-library";

const collapseCommonProps = {
    collapsible: "icon" as const,
    expandIcon : (panelProps: {isActive?: boolean;}) => panelProps.isActive ? <BSS_SquareButton type="MINUS"/> : <BSS_SquareButton  type="ADD" className="mr-2"/>
}

export {collapseCommonProps}