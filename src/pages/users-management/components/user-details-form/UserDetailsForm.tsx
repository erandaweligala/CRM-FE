import {FC, useEffect, useState} from "react";
import {Alert, Button, Form, Input, Select, Space} from "antd";
import {
    checkValidEmail,
    getCustomProperties,
    getSingleUserData,
    getUserHierarchyGroupData,
    postCreateNewUserData,
    postEditUserData
} from "../../services/Users.services";
import {UserCreateModel, UserEditModel} from "../../models/User.edit.model";
import {MetaDataModel} from "../../models/MetaData.model";
import {FormInputErrorMessages} from "../../../../constants/form-input-error-messages";
import UserCustomPropertyModel from "../../models/UserCustomProperty.model";
import {BSS_SquareButton as BssSquareButton, BSS_Container as BssContainer} from "bss-component-library";
import {UserViewModel} from "../../models/UserView.model";
import {UserHierarchyGroup} from "../../models/UserHierarchyGroupWithLevels.model";
import {LocalStorageConstants} from "../../../../constants/local-storage.ts";

const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID;

const {Option} = Select;

interface GroupItem {
    key: string;
}

interface UserDetailsCreateProps {
    operationType: "NEW" | "EDIT";
    userID?: string;
    onClose: () => void;
    rolesList: MetaDataModel[];
    statusList: MetaDataModel[];
}

const UserDetailsForm: FC<UserDetailsCreateProps> = ({operationType, userID, onClose, rolesList, statusList}) => {
    const [form] = Form.useForm();
    const [userData, setUserData] = useState<UserViewModel>();
    const [customProperties, setCustomProperties] = useState<UserCustomPropertyModel[]>([]);
    const [userHierarchyGroupData, setUserHierarchyGroupData] = useState<UserHierarchyGroup[]>([]);
    const [validateResponse, setValidateResponse] = useState<{
        isEmailValid: boolean;
        email: string | null;
        name: string | null;
    }>({
        isEmailValid: false,
        email: null,
        name: null
    });
    const [groups, setGroups] = useState<GroupItem[]>([{key: Date.now().toString()}]);

    useEffect(() => {
        if (operationType === "EDIT") {
            fetchSingleUserDetails();
        }
        loadCustomProperties();
        loadGroupsData();
    }, []);


    const loadCustomProperties = async () => {
        const response = await getCustomProperties();
        setCustomProperties(response);
    };


    const loadGroupsData = async () => {
        const response = await getUserHierarchyGroupData();
        setUserHierarchyGroupData(response);
    }


    const fetchSingleUserDetails = async () => {
        if (!userID) return;
        const response = await getSingleUserData(userID);
        const formattedUser: UserViewModel = {
            ...response,
            status: statusList.find((s) => s.label === (response.status ?? ""))?.value!,
            roleIds: response.roleIds
        };
        setUserData(formattedUser);

        form.setFieldsValue({
            ...formattedUser,
            name: formattedUser.name,
            roleIds: formattedUser.roleIds,
            status: formattedUser.status
        });

        response.customPropertiesItemList?.forEach((prop) => {
            form.setFieldValue(prop.propertyName, prop.valueName);
        });
        const groupsFromResponse = response.groups.length > 0 ? response.groups : [{
            groupId: undefined,
            levelId: undefined
        }];

        const formattedGroups = groupsFromResponse.map((group, idx) => ({
            key: `group-${idx}-${group.groupId ?? "new"}-${group.levelId ?? "new"}`
        }));

        setGroups(formattedGroups);

        groupsFromResponse.forEach((group, index) => {
            const key = formattedGroups[index].key;
            if (group.groupId) {
                form.setFieldValue(["group", key, "name"], group.groupId);
            }
            if (group.levelId) {
                form.setFieldValue(["group", key, "level"], group.levelId);
            }
        });
    };


    const onFinish = async (values: any) => {

        await form.validateFields();

        const customPayload = customProperties.map((prop) => {
            const selected = prop.values.find((v) => v.valueId === values[prop.propertyName]);
            return {
                propertyId: prop.propertyId,
                propertyName: prop.propertyName,
                valueId: selected?.valueId ?? "",
                valueName: selected?.valueName ?? ""
            };
        });

        const rawGroupEntries = Object.values(values.group ? values.group : {});

        const groupEntries: { name: string; level: string }[] = rawGroupEntries.filter(
            (entry): entry is { name: string; level: string } =>
                typeof entry === "object" &&
                entry !== null &&
                "name" in entry &&
                "level" in entry
        );

        const groupPayload = groupEntries.map((entry) => {
            const group = userHierarchyGroupData.find((g) => g.groupId === entry.name);
            const level = group?.levels.find((l) => l.levelId === entry.level);

            return {
                groupId: entry.name,
                groupName: group?.groupName ?? "",
                levelId: entry.level,
                levelName: level?.levelName ?? ""
            };
        });

        if (operationType === "EDIT" && userID) {
            const payload: UserEditModel = {
                userId: userID,
                name: userData!.name!,
                roleIds: values.roleIds,
                status: values.status,
                customProperties: customPayload,
                groups: (groupPayload.length === 1 && groupPayload[0].groupId === undefined) ? [] : groupPayload,
                clientId: clientId,
                tenantId: localStorage.getItem(LocalStorageConstants.TENANT_ID)!
            };
            await postEditUserData(payload);
        }

        if (operationType === "NEW") {
            const payload: UserCreateModel = {
                name: validateResponse.name!,
                email: values.email,
                roleIds: values.roleIds,
                status: values.status,
                customProperties: customPayload,
                groups: (groupPayload.length === 1 && groupPayload[0].groupId === undefined) ? [] : groupPayload,
                clientId: clientId,
                tenantId: localStorage.getItem(LocalStorageConstants.TENANT_ID)!
            };
            await postCreateNewUserData(payload);
        }

        onClose();
    };


    const checkEmailValid = async () => {
        await form.validateFields();

        const email = form.getFieldValue("email");
        const response = await checkValidEmail(email);

        setValidateResponse({
            isEmailValid: response.isValidUser,
            email,
            name: response.userDetails.name
        });

        form.setFieldsValue({
            name: response.userDetails.name,
            status: "1",
            roleIds: null
        });
    };


    const canRenderFormFields = operationType === "EDIT" || validateResponse.isEmailValid;


    const addGroup = () => {
        setGroups([...groups, {key: Date.now().toString()}]);
    };


    const removeGroup = (key: string) => {
        const currentGroups = form.getFieldValue("group") ?? {};
        delete currentGroups[key];
        form.setFieldValue("group", currentGroups);
        setGroups(groups.filter((item) => item.key !== key));
    };


    return (
        <div className="user-details-create mt-4">
            <Form
                form={form}
                layout="vertical"
                name="user-create"
                onFinish={onFinish}
                labelCol={{span: 24}}
                wrapperCol={{span: 24}}
            >
                {operationType === "NEW" && (
                    <>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                {type: "email", message: "Invalid Email"},
                                {required: true, message: "Email is Required"}
                            ]}
                            validateTrigger={["onBlur"]}
                        >
                            <Input/>
                        </Form.Item>

                        {validateResponse.isEmailValid && (
                            <Alert message="Email Validated" type="success" showIcon style={{marginBottom: 16}}/>
                        )}

                        <Button type="primary" onClick={checkEmailValid} className="primary-btn mb-3">
                            Validate Email
                        </Button>
                    </>
                )}

                {
                    canRenderFormFields && (
                        <>
                            <Form.Item name="name" label="Name">
                                <Input disabled/>
                            </Form.Item>

                            <Form.Item name="status" label="Status"
                                       rules={[{required: true, message: FormInputErrorMessages.REQUIRED}]}>
                                <Select className="w-100">
                                    {statusList.map((item) => (
                                        <Option key={item.value} value={item.value}>
                                            {item.label}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item name="roleIds" label="Roles"
                                       rules={[{required: true, message: FormInputErrorMessages.REQUIRED}]}>
                                <Select mode="multiple" className="w-100">
                                    {rolesList.map((item) => (
                                        <Option key={item.value} value={item.value}>
                                            {item.label}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <BssContainer title="Custom Properties" key={"custom-properties"} className="mb-3">
                                {
                                    customProperties &&
                                    customProperties.length > 0 &&
                                    customProperties.map((prop) => (
                                        <Form.Item name={prop.propertyName} label={prop.propertyName}
                                                   key={prop.propertyName}>
                                            <Select allowClear className="w-100">
                                                {prop.values.map((val) => (
                                                    <Option key={val.valueId} value={val.valueId}>
                                                        {val.valueName}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    ))}
                            </BssContainer>

                            <BssContainer title="Groups" key={"groups"}>
                                {
                                    groups.map((group, index) => {
                                        const groupValues = form.getFieldValue("group") ?? {};

                                        const selectedGroupIds = Object.entries(groupValues)
                                            .filter(([k]) => k !== group.key)
                                            .map(([_, v]: any) => v?.name)
                                            .filter(Boolean);

                                        const availableGroupOptions = userHierarchyGroupData.filter(
                                            (g) => !selectedGroupIds.includes(g.groupId)
                                        );

                                        return (
                                            <div
                                                key={group.key}
                                                style={{
                                                    borderBottom: "2px solid #f0f0f0",
                                                    marginBottom: 12,
                                                    paddingBottom: 12
                                                }}
                                            >
                                                <Form.Item
                                                    name={["group", group.key, "name"]}
                                                    label="Group"
                                                    rules={[{required: groups.length > 1, message: "Group is required"}]}
                                                >
                                                    <Select
                                                        placeholder="Select Group"
                                                        onChange={() => {
                                                            form.setFieldValue(["group", group.key, "level"], undefined);
                                                        }}
                                                        allowClear={groups.length === 1}
                                                    >
                                                        {availableGroupOptions.map((groupOption) => (
                                                            <Option key={groupOption.groupId} value={groupOption.groupId}>
                                                                {groupOption.groupName}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                                <Form.Item shouldUpdate noStyle>
                                                    {() => {
                                                        const selectedGroupId = form.getFieldValue(["group", group.key, "name"]);
                                                        const selectedGroup = userHierarchyGroupData.find((g) => g.groupId === selectedGroupId);

                                                        return (
                                                            <Form.Item
                                                                name={["group", group.key, "level"]}
                                                                label="Group Level"
                                                                rules={[{
                                                                    required: groups.length > 1 || (groups.length === 1 && !!selectedGroupId),
                                                                    message: "Group Level is required"
                                                                }]}
                                                            >
                                                                <Select
                                                                    placeholder="Select Level"
                                                                    disabled={!selectedGroup}
                                                                    allowClear={groups.length === 1}
                                                                >
                                                                    {selectedGroup?.levels.map((level) => (
                                                                        <Option key={level.levelId} value={level.levelId}>
                                                                            {level.levelName}
                                                                        </Option>
                                                                    ))}
                                                                </Select>
                                                            </Form.Item>
                                                        );
                                                    }}
                                                </Form.Item>

                                                <Space>
                                                    {groups.length > 1 && (
                                                        <BssSquareButton type="DELETE"
                                                                         onClick={() => removeGroup(group.key)}/>
                                                    )}
                                                    {index === groups.length - 1 && (
                                                        <BssSquareButton type="ADD" onClick={addGroup}/>
                                                    )}
                                                </Space>
                                            </div>
                                        );
                                    })
                                }

                            </BssContainer>
                        </>
                    )
                }

                <div className="bss-ui-drawer-footer text-align-right">
                    <Button type="primary" htmlType="submit" className="primary-btn ml-2">
                        {operationType === "EDIT" ? "Update User" : "Create User"}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default UserDetailsForm;