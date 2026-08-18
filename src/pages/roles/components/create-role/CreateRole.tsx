import {FC, useState, useEffect} from "react";
import {Button, Form, Table, Select, Input,} from "antd";
import {getMenuToComponentData, postCreateNewRole} from "../../services/Role.services";
import {RoleViewPermissionsModel} from "../../models/Role.View.model";
import {ColumnsType} from "antd/es/table";
import "../edit-role/EditRole.scss"
import {PermissionsMetaDataModel} from "../../models/Permissions.meta-date.model";
import {RoleEditModel} from "../../models/Role.edit.mode";
import {ComponentModel, MenuToComponentModel} from "../../models/MenuToComponent.model";
import showNotification from "../../../../services/notification.service";
import { FormInputErrorMessages } from "../../../../constants/form-input-error-messages";
import DigitalBssText from "../../../../components/DigitalBssText";
const {Option} = Select;

interface CreateRoleProps {
    onClose: () => void;
    permissionsDropdownList: PermissionsMetaDataModel[];
}


const CreateRole: FC<CreateRoleProps> = ({onClose, permissionsDropdownList}) => {

    const [form] = Form.useForm();
    const [permissionsList, setPermissionsList] = useState<RoleViewPermissionsModel[]>([]);
    

    useEffect(() => {
        getPermissionsDetails();
    }, [])


    const getPermissionsDetails = async () => {
        const response = await getMenuToComponentData();

        const permissions = response.flatMap((item: MenuToComponentModel) => (
            item.components.map((component: ComponentModel) => {
                const element: RoleViewPermissionsModel = {
                    menuId: item.menuId,
                    menuName: item.menuName,
                    componentId: component.componentId,
                    componentName: component.componentName,
                }
                return element;
            })
        ))
        setPermissionsList(permissions);
    }


    const onCreateRoleClick = async () => {

        await form.validateFields();


        const roleDataIds: number[] = [];

        permissionsList.forEach(item => {
            if (item.permissionId && item.permissionId !== undefined) {
                const pId: number = parseInt(item.permissionId);
                roleDataIds.push(pId);
            }
        })

        if (roleDataIds.length > 0) {

            const payload: RoleEditModel = {
                roleName: form.getFieldValue('roleName'),
                description: form.getFieldValue('description'),
                permissionIdList: roleDataIds
            }

            await postCreateNewRole(payload);

            onClose();

        } else {
            showNotification("ERROR", 'Select at least one permission for this role');
        }
    };


    const handleChange = (newPermissionId: string, record: RoleViewPermissionsModel) => {

        const permissionsDescription = permissionsDropdownList.find(element => element.permissionId === newPermissionId)?.permissionDescription;

        if (permissionsList) {
            const updatePermission: RoleViewPermissionsModel[] = permissionsList.map((element) => {
                if (element.componentId === record.componentId) {
                    return {...element, permissionId: newPermissionId, permissionDescription: permissionsDescription}
                }
                return element;
            })
            setPermissionsList(updatePermission);
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
                    {permissionsDropdownList &&
                        permissionsDropdownList.length > 0 &&
                        permissionsDropdownList.map((item: PermissionsMetaDataModel) => {
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
      <div className="create-role mt-5">
          <Form
            form={form}
            name="role-create"
            style={{ marginRight: "auto", marginLeft: "auto" }}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
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
            <div className="mt-4">
              <DigitalBssText size="lg" style="medium" color="primary">
                Permissions
              </DigitalBssText>
            </div>

            {permissionsList && permissionsList.length > 0 && (
              <Table
                className="mt-4 mb-5"
                columns={columns}
                dataSource={permissionsList}
                rowKey="componentId"
              />
            )}
          </div>

          <div className="bss-ui-drawer-footer text-align-right">
            <Button
              type="primary"
              onClick={onCreateRoleClick}
              className="primary-btn ml-2"
            >
              Create Role
            </Button>
          </div>
      </div>
    );
}

export default CreateRole;