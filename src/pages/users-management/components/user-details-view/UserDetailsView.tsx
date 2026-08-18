import {FC, useState, useEffect} from "react";
import {getSingleUserData} from "../../services/Users.services";
import {UserViewModel} from "../../models/UserView.model";
import {Descriptions} from "antd";
import dayjs from "dayjs";

interface UserDetailsViewProps {
    userId: string
}

const UserDetailsView: FC<UserDetailsViewProps> = ({userId}) => {

    const [userData, setUserData] = useState<UserViewModel>();

    useEffect(() => {
        singleUserDetails();
    }, [userId])


    const singleUserDetails = async () => {
        const response = await getSingleUserData(userId);
        setUserData(response)
    };


    return (
        <div className="mt-4">
            {userData &&
                <Descriptions bordered column={1}>
                    <Descriptions.Item label="ID">{userData.userId}</Descriptions.Item>
                    <Descriptions.Item label="Name">{userData.name}</Descriptions.Item>
                    <Descriptions.Item label="Email">{userData.email}</Descriptions.Item>
                    <Descriptions.Item label="Status">{userData.status}</Descriptions.Item>
                    <Descriptions.Item label="Role ID">{userData.roleIds?.join(", ") || "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Role Name">{userData.roleNames?.join(", ") || "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Last Login Date Time">
                        {userData.lastLoginDateTime && dayjs(userData.lastLoginDateTime).format('YYYY-MM-DD HH:mm:ss')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Mobile Number">{userData.mobileNumber}</Descriptions.Item>

                    <Descriptions.Item label="Groups and Levels">
                        <>
                            {
                                userData.groups.map((singleGroup) => {
                                    return (
                                        <Descriptions bordered column={1} className="mb-2">
                                            <Descriptions.Item label="Group" labelStyle={{width: 100}}>{singleGroup.groupName}</Descriptions.Item>
                                            <Descriptions.Item label="Level">{singleGroup.levelName}</Descriptions.Item>
                                        </Descriptions>
                                    )
                                })
                            }
                        </>
                    </Descriptions.Item>

                    <Descriptions.Item label="Properties">
                        <>
                            {
                                userData.customPropertiesItemList.map((singleProperties) => {
                                    return (
                                        <Descriptions bordered column={1} className="mb-2">
                                            <Descriptions.Item label="Property Name" labelStyle={{width: 120}}>{singleProperties.propertyName}</Descriptions.Item>
                                            <Descriptions.Item label="Value">{singleProperties.valueName}</Descriptions.Item>
                                        </Descriptions>
                                    )
                                })
                            }
                        </>
                    </Descriptions.Item>

                </Descriptions>
            }
        </div>
    )
}

export default UserDetailsView;