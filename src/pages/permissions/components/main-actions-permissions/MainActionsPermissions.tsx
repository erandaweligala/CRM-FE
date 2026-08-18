import {FC, useEffect} from "react";
import {Attributes, MainActions} from "../../models/PermissionViewModel";
import {Checkbox} from "antd";
import {CheckboxChangeEvent} from "antd/es/checkbox";
import {CheckedValuesObject} from "../../models/PermissionsQueryModel";
import DigitalBssText from "../../../../components/DigitalBssText";

import "./MainActionsPermissions.scss";

interface MainActionsPermissionsProps {
    mainActions: MainActions[];
    isEditable: boolean;
    onChange: (checkedValues: CheckedValuesObject) => void;
}

const MainActionsPermissions: FC<MainActionsPermissionsProps> = ({
                                                                     mainActions,
                                                                     onChange,
                                                                     isEditable,
                                                                 }) => {


    useEffect(() => {
        onSubmit()
    }, [])


    const onChangeMainActions = () => {
        onSubmit();
    };

    const onChangeSubActions = () => {
        onSubmit();
    };

    const onChangeAttributes = () => {
        onSubmit();
    };

    const onChangeSubActionsAttributes = () => {
        onSubmit();
    };

    const onSubmit = () => {
        const actionIds: string[] = [];
        const attributeIds: string[] = [];
    
        mainActions.forEach((mainAction) => {
            if (!mainAction.isSelected) return;
    
            actionIds.push(mainAction.actionId);
            collectSelectedAttributes(mainAction.attributes, attributeIds);
    
            mainAction.subActions
                .filter((subAction) => subAction.isSelected)
                .forEach((subAction) => {
                    actionIds.push(subAction.actionId);
                    collectSelectedAttributes(subAction.attributes, attributeIds);
                });
        });
    
        const obj: CheckedValuesObject = {
            checkedActions: actionIds,
            checkedAttributes: attributeIds,
        };
    
        onChange(obj);
    };
    
    const collectSelectedAttributes = (
        attributes: { isSelected: boolean; attributeId: string }[],
        targetList: string[]
    ) => {
        attributes.forEach((attr) => {
            if (attr.isSelected) {
                targetList.push(attr.attributeId);
            }
        });
    };
    const handleAttributeChange = (e: CheckboxChangeEvent, attribute: { isSelected: boolean }) => {
        attribute.isSelected = e.target.checked;
        onSubmit();
    };
    const onSaAttributeChange = (saAttribute: Attributes) => 
        (e: CheckboxChangeEvent) => handleAttributeChange(e, saAttribute);
    return (

        <div className="main-action-permissions mt-5">
            <Checkbox.Group
                onChange={onChangeMainActions}
                style={{width: "100%", display: "block"}}
                defaultValue={mainActions
                    .filter((element) => element.isSelected)
                    .map((element) => element.actionId)}
            >
                {
                    mainActions &&
                    mainActions.length > 0 &&
                    mainActions.map((mainAction) => (

                        <div className="box-container" key={mainAction.actionId}>
                            <div className="box-header">
                                <Checkbox
                                    className="mr-2"
                                    onChange={(e: CheckboxChangeEvent) =>
                                        (mainAction.isSelected = e.target.checked)
                                    }
                                    value={mainAction.actionId}
                                    disabled={!isEditable}
                                />

                                <DigitalBssText size="md" style="medium" color="primary">
                                    {mainAction.actionName}
                                </DigitalBssText>
                            </div>

                            {
                                mainAction.subActions &&
                                mainAction.subActions.length > 0 &&
                                (
                                    <div className="box-container ma-4">
                                        <div className="box-header">
                                            <DigitalBssText size="md" style="medium" color="primary">
                                                Sub Actions
                                            </DigitalBssText>
                                        </div>

                                        <Checkbox.Group
                                            onChange={onChangeSubActions}
                                            style={{width: "100%", display: "block"}}
                                            defaultValue={mainAction.subActions
                                                .filter((subA) => subA.isSelected)
                                                .map((subA) => subA.actionId)}
                                            disabled={!mainAction.isSelected}
                                        >
                                            {
                                                mainAction.subActions.map((subAction) => (
                                                    <div className="ma-4 box-container" key={subAction.actionId}>
                                                        <div className="box-header">
                                                            <Checkbox
                                                                className="mr-2"
                                                                onChange={(e: CheckboxChangeEvent) =>
                                                                    (subAction.isSelected = e.target.checked)
                                                                }
                                                                // value={subAction.actionId}
                                                                value={(mainAction.isSelected) && subAction.actionId}
                                                                disabled={!isEditable}
                                                            />
                                                            <DigitalBssText
                                                                size="md"
                                                                style="medium"
                                                                color="primary"
                                                            >
                                                                {subAction.actionName}
                                                            </DigitalBssText>
                                                        </div>

                                                        {
                                                            subAction.attributes &&
                                                            subAction.attributes.length > 0 && (
                                                                <div className="ma-4 box-container">
                                                                    <div className="box-header">
                                                                        <DigitalBssText
                                                                            size="md"
                                                                            style="medium"
                                                                            color="primary"
                                                                        >
                                                                            Attributes
                                                                        </DigitalBssText>
                                                                    </div>

                                                                    <Checkbox.Group
                                                                        onChange={onChangeSubActionsAttributes}
                                                                        style={{width: "100%", display: "block"}}
                                                                        defaultValue={subAction.attributes
                                                                            .filter((subAAttr) => subAAttr.isSelected)
                                                                            .map((subAAttr) => subAAttr.attributeId)}
                                                                        disabled={
                                                                            !mainAction.isSelected ||
                                                                            !subAction.isSelected
                                                                        }
                                                                    >
                                                                        <div className="pa-2">
                                                                            {
                                                                                subAction.attributes.map((saAttribute) => (
                                                                                    <div className="pa-1 ml-3" key={saAttribute.attributeId}>
                                                                                        <Checkbox
                                                                                            className="mr-2"
                                                                                            value={(mainAction.isSelected) && (subAction.isSelected) && saAttribute.attributeId}
                                                                                            onChange={onSaAttributeChange(saAttribute)}
                                                                                            disabled={!isEditable}
                                                                                        >
                                                                                            {saAttribute.attributeName}
                                                                                        </Checkbox>
                                                                                    </div>
                                                                                ))}
                                                                        </div>
                                                                    </Checkbox.Group>
                                                                </div>
                                                            )}
                                                    </div>
                                                ))}
                                        </Checkbox.Group>
                                    </div>
                                )}

                            {
                                mainAction.attributes &&
                                mainAction.attributes.length > 0 &&
                                (
                                    <div className="ma-4 box-container">
                                        <div className="box-header">
                                            <DigitalBssText size="md" style="medium" color="primary">
                                                Attributes
                                            </DigitalBssText>
                                        </div>

                                        <Checkbox.Group
                                            onChange={onChangeAttributes}
                                            style={{width: "100%", display: "block"}}
                                            defaultValue={mainAction.attributes
                                                .filter((attr) => attr.isSelected)
                                                .map((attr) => attr.attributeId)}
                                            disabled={!mainAction.isSelected}
                                        >
                                            <div className="pa-4">
                                                {mainAction.attributes.map((attribute) => (
                                                    <div className="mb-2" key={attribute.attributeId}>
                                                        <Checkbox
                                                            className="mr-2"
                                                            onChange={(e: CheckboxChangeEvent) =>
                                                                (attribute.isSelected = e.target.checked)
                                                            }
                                                            value={(mainAction.isSelected) && attribute.attributeId}
                                                            disabled={!isEditable}
                                                        >
                                                            <DigitalBssText
                                                                size="md"
                                                                style="medium"
                                                                color="primary"
                                                            >
                                                                {attribute.attributeName}
                                                            </DigitalBssText>
                                                        </Checkbox>
                                                    </div>
                                                ))}
                                            </div>
                                        </Checkbox.Group>
                                    </div>
                                )}
                        </div>
                    ))}
            </Checkbox.Group>
        </div>

    );
};

export default MainActionsPermissions;
