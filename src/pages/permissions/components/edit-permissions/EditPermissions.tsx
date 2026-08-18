import {FC, useState, useEffect} from "react";
import {Button, Form, Input} from "antd";
import {PermissionViewModel} from "../../models/PermissionViewModel";
import {getSinglePermissionData, putEditPermissionData} from "../../services/Permissions.services";
import {ComponentModel, MenuToComponentModel} from "../../../roles/models/MenuToComponent.model";
import MainActionsPermissions from "../main-actions-permissions/MainActionsPermissions";
import {CheckedValuesObject} from "../../models/PermissionsQueryModel";
import {PermissionsEditModel} from "../../models/PermissionEditModel";
import { FormInputErrorMessages } from "../../../../constants/form-input-error-messages";


interface EditPermissionsProps {
    permissionsId: string
    onClose: () => void;
    menuToComponentList: MenuToComponentModel[];
    isEditable: boolean;
  // updateEditable: (isEditable: boolean) => void;

}


const EditPermissions: FC<EditPermissionsProps> = ({
                                                       permissionsId,
                                                       onClose,
                                                       menuToComponentList,
                                                       isEditable
                                                   }) => {

    const [form] = Form.useForm();
    const [permissionData, setPermissionData] = useState<PermissionViewModel>();
    const [_componentDropdownList, setComponentDropdownList] = useState<ComponentModel[]>([])
    const [checkedValues, setCheckedValues] = useState<CheckedValuesObject>();


    useEffect(() => {

        singlePermissionsDetails(permissionsId);

    }, [permissionsId])


    const singlePermissionsDetails = async (singlePermissionId: string) => {

        try {

            const response = await getSinglePermissionData(singlePermissionId);

            if (response.menuId) {
                handleMenuChange(response.menuId);
            }


            setPermissionData(response);
            console.log(permissionData)

        } catch (_) {

            onClose()

        }

    };

    
    const onEditPermissionClick = async () => {

        await form.validateFields();

        const payload: PermissionsEditModel = {
            permissionId: permissionData?.permissionId!,
            name: permissionData?.permissionName!,
            menuId: permissionData?.menuId!,
            description: form.getFieldValue('description'),
            componentId: permissionData?.componentId!,
            actions: checkedValues?.checkedActions as string[],
            attributes: checkedValues?.checkedAttributes as string[],
        }

        await putEditPermissionData(payload);

        onClose();

    };


    const handleMenuChange = (menuId: string) => {

        if (menuId && menuToComponentList) {

            const menus = menuToComponentList.filter(item => item.menuId === menuId);

            if (menus.length > 0) {
                setComponentDropdownList(menus[0].components);
                form.setFieldValue('componentId', null);
            }

        }
    };



    return (
      <div className="edit-permission mt-5">
        {permissionData && (
          <>
            <Form
              form={form}
              name="permission-edit"
              style={{ marginRight: "auto", marginLeft: "auto" }}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }} //17
              initialValues={permissionData}
            >
              {isEditable && (
                <>
                  <Form.Item
                    name="permissionName"
                    label="Permission Name"
                    rules={[]}
                    style={{ marginBottom: "10px" }}
                  >
                    <Input disabled={true} />
                  </Form.Item>

                  <Form.Item
                    name="menuName"
                    label="Menu"
                    rules={[]}
                    style={{ marginBottom: "10px" }}
                  >
                    <Input disabled={true} />
                  </Form.Item>

                  <Form.Item
                    name="componentName"
                    label="Component Name"
                    rules={[]}
                    style={{ marginBottom: "10px" }}
                  >
                    <Input disabled={true} />
                  </Form.Item>

                  <Form.Item
                    name="description"
                    label="Description"
                    rules={[
                      {
                        required: true,
                        message: FormInputErrorMessages.REQUIRED,
                      },
                    ]}
                  >
                    <Input maxLength={100} />
                  </Form.Item>
                </>
              )}
            </Form>

            <div
              className="mb-5"
              style={{ marginRight: "auto", marginLeft: "auto" }}
            >
              {permissionData.mainActions &&
                permissionData.mainActions.length > 0 && (
                  <MainActionsPermissions
                    isEditable={isEditable}
                    onChange={(e) => setCheckedValues(e)}
                    mainActions={permissionData.mainActions}
                  />
                )}
            </div>

            <div className="bss-ui-drawer-footer text-align-right">
              <Button
                type="primary"
                onClick={onEditPermissionClick}
                className="primary-btn ml-2"
              >
                Save Permission
              </Button>
            </div>
          </>
        )}
      </div>
    );
}

export default EditPermissions;