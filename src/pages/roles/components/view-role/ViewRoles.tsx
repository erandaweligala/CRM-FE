import { FC, useState,useEffect } from "react";
import {Descriptions,Table} from "antd";
import { getSingleRolesData } from "../../services/Role.services";
import { RoleViewModel, RoleViewPermissionsModel } from "../../models/Role.View.model";
import  { ColumnsType } from "antd/es/table";
import DigitalBssText_Temp from "../../../../components/DigitalBssText";
interface ViewRolesProps {
    roleId: string
    onClose: () => void;
}

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
        align: 'center',
        render: (item) => {
          if (item) {
              return <span style={{display: 'flex', justifyContent: 'center'}}>{item}</span>
          }else{
              return <span style={{display: 'flex', justifyContent: 'center'}}>-</span>
          }
      }
    },
    {
        title: "Description",
        dataIndex: "permissionDescription",
        key: "permissionDescription",
        render: (item) => {
          if (item) {
              return <span>{item}</span>
          }else{
              return <span style={{display: 'flex', justifyContent: 'center'}}>-</span>
          }
      }
      }
  ];
  
const ViewRoles: FC<ViewRolesProps> = ({roleId,onClose}) => {

    const [roleData, setRoleData] = useState<RoleViewModel>();

    useEffect(() =>{

        singleRoleDetails(roleId);

    },[roleId])


    const singleRoleDetails = async (singleRoleId: string) => {   
        
        try{

            const response = await getSingleRolesData(singleRoleId);

            setRoleData(response)

        } catch (_){

            onClose()
        
        }
  
    };
    

    return (
      <>
        {roleData && (
          <div className="mt-4">
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Name">
                {roleData.roleName}
              </Descriptions.Item>
              <Descriptions.Item label="Description">
                {roleData.description}
              </Descriptions.Item>
            </Descriptions>

            <div className="mt-4">
              <div>
                <DigitalBssText_Temp size="lg" style="medium" color="primary">
                  Permissions
                </DigitalBssText_Temp>
              </div>

              {roleData.description && roleData.description.length > 0 && (
                <Table
                  className="mt-4"
                  columns={columns}
                  dataSource={roleData.permissions}
                  rowKey="componentId"
                />
              )}
            </div>
          </div>
        )}
      </>
    );
}

export default ViewRoles;