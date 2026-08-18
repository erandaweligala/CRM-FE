import {FC, useEffect, useState} from "react";
import {PermissionViewModel} from "../../models/PermissionViewModel";
import {getSinglePermissionData} from "../../services/Permissions.services";
import {Descriptions} from "antd";
import MainActionsPermissions from "../main-actions-permissions/MainActionsPermissions";
import {CheckedValuesObject} from "../../models/PermissionsQueryModel";

interface PermissionDetailsViewProps {
    permissionsId: string
    onClose: () => void;
    isEditable: boolean;
}
const ViewPermissions: FC<PermissionDetailsViewProps> = ({permissionsId,onClose,isEditable}) => {

    const [permissionData,setPermissionData] = useState<PermissionViewModel>();

    const [_checkedValues,setCheckedValues] = useState<CheckedValuesObject>();

    useEffect(() =>{

        singlePermissionsDetails(permissionsId);

    },[permissionsId])

    const singlePermissionsDetails = async (singlePermissionId: string) => {

        try{

            const response = await getSinglePermissionData(singlePermissionId);
            setPermissionData(response);
        } catch (_){
            onClose()
        }

    };


    return(
        <div className="mt-4">
            {permissionData &&
                <Descriptions bordered column={1}>
                    <Descriptions.Item label="Permission Name">{permissionData.permissionName}</Descriptions.Item>
                    <Descriptions.Item label="Menu">{permissionData.menuName}</Descriptions.Item>
                    <Descriptions.Item label="Component">{permissionData.componentName}</Descriptions.Item>
                    <Descriptions.Item label="Description">{permissionData.description}</Descriptions.Item>
                </Descriptions>}

            {permissionData?.mainActions &&
                permissionData.mainActions.length > 0 &&
                (
                    <div className="mt-4">
                        <MainActionsPermissions
                            isEditable={isEditable}
                            onChange={(e)=> setCheckedValues(e)}
                            mainActions={permissionData.mainActions}/>
                    </div>

                )

            }
        </div>
    )
}

export default ViewPermissions;
