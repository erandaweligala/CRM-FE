import {FC, useState, useEffect} from "react";
import {Button, Form, Table, Select, Input,} from "antd";
import {getSingleRolesData, putEditRoleData} from "../../services/Role.services";
import {RoleViewModel, RoleViewPermissionsModel} from "../../models/Role.View.model";
import {ColumnsType} from "antd/es/table";
import {PermissionsMetaDataModel} from "../../models/Permissions.meta-date.model";
import {RoleEditModel} from "../../models/Role.edit.mode";
import { FormInputErrorMessages } from "../../../../constants/form-input-error-messages";
import DigitalBssText  from "../../../../components/DigitalBssText";
const {Option} = Select;

interface EditRolesProps {
    roleId: string;
    onClose: () => void;
    permissionsList: PermissionsMetaDataModel[];
}


const EditRoles: FC<EditRolesProps> = ({roleId, onClose, permissionsList}) => {

    const [form] = Form.useForm();
    const [roleData, setRoleData] = useState<RoleViewModel>();


    useEffect(() => {

        singleRoleDetails(roleId);

    }, [roleId])


    const singleRoleDetails = async (singleRoleId: string) => {

        try {

            const response = await getSingleRolesData(singleRoleId);

            setRoleData(response)

        } catch (_) {

            onClose()

        }

    };
    

    const onEditRoleClick = async () => {

        await form.validateFields();

        let roleDataIds : number[] = [];

        roleData?.permissions.forEach(item => {
            if (item.permissionId && item.permissionId !== null) {
                 roleDataIds.push(parseInt(item.permissionId));
            }
        })

        const payload: RoleEditModel = {
            description: form.getFieldValue('description'),
            roleId: form.getFieldValue('roleId'),
            roleName: form.getFieldValue('roleName'),
            permissionIdList: roleDataIds
        }

        await putEditRoleData(payload);

        onClose();

    };


    const handleChange = (newPermissionId: string, record: RoleViewPermissionsModel) => {

        const permissionData = permissionsList.find(element => element.permissionId === newPermissionId);

        if (roleData) {
            const updatePermission: RoleViewPermissionsModel[] = roleData.permissions.map((permission) => {
                if (permission.menuId === record.menuId && permission.componentId === record.componentId) {
                    return {...permission, permissionId: newPermissionId, permissionDescription: permissionData?.permissionDescription,permissionName:permissionData?.permissionName}
                }
                return permission;
            })
            setRoleData({...roleData, permissions: updatePermission});
        }

    };


    const columns: ColumnsType<RoleViewPermissionsModel> = [
        {
            title: "Menu",
            dataIndex: "menuName",
            key: "menuName",
        },
        {
            title: "Component",
            dataIndex: "componentName",
            key: "componentName",
        },
        {
            title: "Permission Name",
            dataIndex: "permissionName",
            key: "permissionName",
            width: '220px',
            render: (_, record) => (
                <Select
                    size="small"
                    style={{width: '220px'}}
                    defaultValue={record.permissionId}
                    onChange={(newPermissionId) => handleChange(newPermissionId, record)}
                    allowClear
                >
                    {permissionsList &&
                        permissionsList.length > 0 &&
                        permissionsList.map((item: PermissionsMetaDataModel) => {
                            if (item.menuId === record.menuId && item.componentId === record.componentId) {
                                return <Option value={item.permissionId} key={item.permissionId}>{item.permissionName}</Option>
                            }
                        })
                    }
                </Select>
            ),
        },
        {
            title: "Description",
            dataIndex: "permissionDescription",
            key: "permissionDescription",
            width: '220px',
        }
    ];



    return (
      <div className="edit-role">
        {roleData && (
          <>
            <Form
              form={form}
              name="role-edit"
              labelCol={{ span: 24 }} //7
              wrapperCol={{ span: 24 }} //17
              initialValues={roleData}
            >
              <Form.Item
                name="roleName"
                label="Name"
                rules={[
                  { required: true, message: FormInputErrorMessages.REQUIRED },
                ]}
              >
                <Input maxLength={100} />
              </Form.Item>

              <Form.Item
                name="description"
                label="Description"
                rules={[
                  { required: true, message: FormInputErrorMessages.REQUIRED },
                ]}
              >
                <Input maxLength={100} />
              </Form.Item>
            </Form>

            <div>
              <div>
                <DigitalBssText size="lg" style="medium" color="primary">
                  Permissions
                </DigitalBssText>
              </div>

              {roleData.permissions && roleData.permissions.length > 0 && (
                <Table
                  className="mt-4 mb-5"
                  columns={columns}
                  dataSource={roleData.permissions}
                  rowKey="componentId"
                />
              )}
            </div>

            <div className="bss-ui-drawer-footer text-align-right">
              <Button type="primary" onClick={onEditRoleClick}>
                Save Role
              </Button>
            </div>
          </>
        )}
      </div>
    );
}

export default EditRoles;