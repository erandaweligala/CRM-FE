import {FC, useState} from "react";
import {Button, Form, Select, Input} from "antd";
import "../edit-permissions/EditPermissions.scss";
import {MainActions} from "../../models/PermissionViewModel";
import {getPermissionByComponentId, postCreatePermissionData} from "../../services/Permissions.services";
import {ComponentModel, MenuToComponentModel} from "../../../roles/models/MenuToComponent.model";
import MainActionsPermissions from "../main-actions-permissions/MainActionsPermissions";
import {CheckedValuesObject, PermissionByComponentIdAndMenuId} from "../../models/PermissionsQueryModel";
import {PermissionsEditModel} from "../../models/PermissionEditModel";
import showNotification from "../../../../services/notification.service";
import {FormInputErrorMessages} from "../../../../constants/form-input-error-messages";

const {Option} = Select;

interface CreatePermissionsProps {
    onClose: () => void;
    menuToComponentList: MenuToComponentModel[];
}


const CreatePermissions: FC<CreatePermissionsProps> = ({onClose, menuToComponentList}) => {

    const [form] = Form.useForm();
    const [mainActionsData, setMainActionsData] = useState<MainActions[]>();
    const [componentDropdownList, setComponentDropdownList] = useState<ComponentModel[]>()
    const [checkedValues, setCheckedValues] = useState<CheckedValuesObject>();


    const onCreatePermissionClick = async () => {

        await form.validateFields();

        if (checkedValues?.checkedActions.length! > 0 || checkedValues?.checkedAttributes.length! > 0) {

            const payload: PermissionsEditModel = {
                name: form.getFieldValue('permissionName'),
                menuId: form.getFieldValue('menuId'),
                description: form.getFieldValue('description'),
                componentId: form.getFieldValue('componentId'),
                actions: checkedValues?.checkedActions as string[],
                attributes: checkedValues?.checkedAttributes as string[],
            }

            await postCreatePermissionData(payload);
            onClose();

        } else {

            showNotification("ERROR", 'Check at least one permission');

        }


    };


    const handleMenuChange = (menuId: string) => {

        if (menuId && menuToComponentList) {

            const menus = menuToComponentList.filter(item => item.menuId === menuId);

            if (menus.length > 0) {
                setComponentDropdownList(menus[0].components);
                setMainActionsData([]);
                form.setFieldValue('componentId', null);
            }

        }
    };


    const handleComponentChange = async (componentId: string) => {

        const queryParams: PermissionByComponentIdAndMenuId = {
            componentId: componentId
        }

        const response = await getPermissionByComponentId(queryParams);

        setMainActionsData(response.mainActions)

    }


    return (
        <div className="create-permission mt-5">
            <>
                <Form
                    form={form}
                    name="permission-create"
                    style={{marginRight: "auto", marginLeft: "auto"}}
                    labelCol={{span: 24}}
                    wrapperCol={{span: 24}}
                >
                    <Form.Item
                        name="permissionName"
                        label="Permission Name"
                        rules={[
                            {required: true, message: FormInputErrorMessages.REQUIRED},
                        ]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        name="menuId"
                        label="Menu"
                        rules={[
                            {required: true, message: FormInputErrorMessages.REQUIRED},
                        ]}
                    >
                        <Select placeholder="Menu" onChange={handleMenuChange}>
                            {menuToComponentList &&
                                menuToComponentList.length > 0 &&
                                menuToComponentList.map((item: MenuToComponentModel) => (
                                    <Option value={item.menuId} key={item.menuId}>{item.menuName}</Option>
                                ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="componentId"
                        label="Component"
                        rules={[
                            {required: true, message: FormInputErrorMessages.REQUIRED},
                        ]}
                    >
                        <Select
                            placeholder="Component"
                            onChange={handleComponentChange}
                            disabled={
                                componentDropdownList && componentDropdownList.length > 0
                                    ? false
                                    : true
                            }
                        >
                            {componentDropdownList &&
                                componentDropdownList.length > 0 &&
                                componentDropdownList.map((item: ComponentModel) => (
                                    <Option value={item.componentId} key={item.componentId}>
                                        {item.componentName}
                                    </Option>
                                ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[
                            {required: true, message: FormInputErrorMessages.REQUIRED},
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                </Form>

                <div style={{marginRight: "auto", marginLeft: "auto"}}>
                    {mainActionsData && mainActionsData.length > 0 && (
                        <MainActionsPermissions
                            isEditable={true}
                            onChange={(e) => setCheckedValues(e)}
                            mainActions={mainActionsData}
                        />
                    )}
                </div>

                <div className="bss-ui-drawer-footer text-align-right">
                    <Button
                        type="primary"
                        onClick={onCreatePermissionClick}
                        className="primary-btn ml-2"
                    >
                        Save Permission
                    </Button>
                </div>
            </>
        </div>
    );
}

export default CreatePermissions;