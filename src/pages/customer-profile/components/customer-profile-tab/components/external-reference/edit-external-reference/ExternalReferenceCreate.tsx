import {FC} from "react";
import {Button, Form, Input, Select} from "antd";
import {FormInputErrorMessages} from "../../../../../../../constants/form-input-error-messages";
import {ExternalReferenceModel} from "../../../../../models/CustomerProfileModel";
import {postToCreateReference} from "../../../../../services/customer-profile.service";
import showNotification from "../../../../../../../services/notification.service";

const {Option} = Select;

interface ExternalReferenceCreateProps {
    data: ExternalReferenceModel[];
    id: string;
    item?: ExternalReferenceModel | null;
    onTriggerReloadProfileTab: () => void;
    onCloseDrawer: () => void;
    onConfirmEdit?: (updatedReference: ExternalReferenceModel) => void;
}


const ExternalReferenceAdd: FC<ExternalReferenceCreateProps> = ({
                                                                    data,
                                                                    id,
                                                                    item,
                                                                    onTriggerReloadProfileTab,
                                                                    onCloseDrawer,
                                                                    onConfirmEdit,
                                                                }) => {

    const [form] = Form.useForm();

    const onSubmitHandler = async (formInputValues: ExternalReferenceModel) => {

        await form.validateFields();

        const payload: ExternalReferenceModel = {
            type: formInputValues.type,
            url: formInputValues.url,
        };

        if (item) {
            const filteredData = data.filter((item2) => item.url !== item2.url);
            filteredData.push(payload);

            await postToCreateReference(id, filteredData);
            onTriggerReloadProfileTab();

            onCloseDrawer();
            showNotification("SUCCESS", "External Reference Edited Successfully");
        } else {
            const updateData = [...data];
            updateData.push(payload);

            await postToCreateReference(id, updateData);
            onTriggerReloadProfileTab();

            onCloseDrawer();
            onConfirmEdit?.(payload);
            showNotification("SUCCESS", "External Reference Added Successfully");
        }

    };


    return (
        <Form
            initialValues={item || undefined}
            form={form}
            name="create-reference"
            layout="vertical"
            onFinish={onSubmitHandler}
        >
            <Form.Item
                label="Reference Type"
                name="type"
                rules={[{required: true, message: FormInputErrorMessages.REQUIRED}]}
            >
                <Select placeholder="Select Platform">
                    <Option value="Facebook">FaceBook</Option>
                    <Option value="Google">Google</Option>
                    <Option value="LinkedIn">LinkedIn</Option>
                    <Option value="TikTok">TikTok</Option>
                    <Option value="Instagram">Instagram</Option>
                    <Option value="Twitter">Twitter</Option>
                </Select>
            </Form.Item>

            <Form.Item
                label="URL"
                name="url"
                rules={[{required: true, message: FormInputErrorMessages.REQUIRED}]}
            >
                <Input
                    maxLength={100}
                    type="url"
                    name="url"
                    placeholder="add link here"
                />
            </Form.Item>

            <div className="bss-ui-drawer-footer text-align-right">
                <Button type="primary" htmlType="submit" className="primary-btn ml-2">
                    {item ? "Update Reference" : "Add Reference"}
                </Button>
            </div>
        </Form>
    );
};

export default ExternalReferenceAdd;
