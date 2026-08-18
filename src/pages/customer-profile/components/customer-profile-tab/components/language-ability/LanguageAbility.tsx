import {FC, useState} from "react";
import {LanguageModel} from "../../../../models/CustomerProfileModel";
import {ColumnsType} from "antd/es/table";
import {Button, Checkbox, Drawer, Form, Input, Select, Table} from "antd";
import {FormInputErrorMessages} from "../../../../../../constants/form-input-error-messages";
import {updateLanguage} from "../../../../services/customer-profile.service";
import DigitalBssConfirmModal from "../../../../../../components/DigitalBssConfirmModal";
// @ts-ignore
import {v4 as uuid} from "uuid";
import showNotification from "../../../../../../services/notification.service";
import { BSS_SquareButton as BssSquareButton } from "bss-component-library";
import Empty from "antd/lib/empty";

interface LanguageAbilityProps {
    data: LanguageModel[];
    customerSystemId: string;
    onTriggerReloadProfileTab: () => void;
}

const LanguageAbility: FC<LanguageAbilityProps> = ({
                                                       data,
                                                       customerSystemId,
                                                       onTriggerReloadProfileTab,
}) => {

    const [operation, setOperation] = useState<"NEW" | "UPDATE" | "NON">("NON");
    const [selectedLanguageModel, setSelectedLanguageModel] = useState<LanguageModel | null>(null);

    const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<LanguageModel | null>(null);

    const onClickEditButtonHandle = (recode: LanguageModel) => {
        setSelectedLanguageModel(recode);
        setOperation("UPDATE");
    }

    const tableColumns: ColumnsType<LanguageModel> = [
        {
            title: 'Language Name',
            dataIndex: 'languageName',
        },
        {
            title: 'Favorite Language',
            dataIndex: 'isFavoriteLanguage',
            render: (value) => {
                return (
                    <>
                        {(value === true) ? "YES" : "NO"}
                    </>
                );
            }
        },
        {
            title: 'Listening Proficiency',
            dataIndex: 'listeningProficiency',
        },
        {
            title: 'Reading Proficiency',
            dataIndex: 'readingProficiency',
        },
        {
            title: 'Speaking Proficiency',
            dataIndex: 'speakingProficiency',
        },
        {
            title: 'Writing Proficiency',
            dataIndex: 'writingProficiency',
        },
        {
            title: 'Action',
            dataIndex: 'Action',
            render: (_value, record) => {
                return (
                    <>
                        <BssSquareButton className="mr-2" type="EDIT" onClick={() => onClickEditButtonHandle(record)}/>
                        <BssSquareButton type="DELETE" onClick={() => {
                                    setItemToDelete(record);
                                    setDeleteConfirmVisible(true);
                                }}/>
                    </>
                );
            }
        },
    ];


    const onCloseDeleteConfirm = () => {
        setDeleteConfirmVisible(false);
        setItemToDelete(null);
    };


    const onConfirmDelete = async () => {
        const updatedData = data.filter((item) => item.languageCode !== itemToDelete?.languageCode);

        await updateLanguage(updatedData , customerSystemId);
        onTriggerReloadProfileTab();
        showNotification("SUCCESS", "Deleted Successfully");

        onCloseDeleteConfirm();
    };


    const onClickUpdateButtonHandler = async (formValues: any) => {
        const currentLanguageModelCopy: LanguageModel[] = JSON.parse(JSON.stringify(data));
        if (operation === "UPDATE") {
            const updateElement = currentLanguageModelCopy.find((singleLanguage) => {
                return singleLanguage.languageCode === selectedLanguageModel?.languageCode
            });
            if (updateElement) {
                updateElement.languageName = formValues.languageName;
                updateElement.writingProficiency = formValues.writingProficiency;
                updateElement.speakingProficiency = formValues.speakingProficiency;
                updateElement.readingProficiency = formValues.readingProficiency;
                updateElement.listeningProficiency = formValues.listeningProficiency;
            }
            if(formValues.isFavoriteLanguage === true) {
                currentLanguageModelCopy.forEach((singleLanguage) => singleLanguage.isFavoriteLanguage = false);
            }
            if (updateElement) {
                updateElement.isFavoriteLanguage = formValues.isFavoriteLanguage;
                await updateLanguage(currentLanguageModelCopy, customerSystemId);
            }
            setOperation("NON");
            setSelectedLanguageModel(null);
            onTriggerReloadProfileTab();
            showNotification("SUCCESS", "Update Language Successfully");
        } else if(operation === "NEW") {
            if(formValues.isFavoriteLanguage === true) {
                currentLanguageModelCopy.forEach((singleLanguage) => singleLanguage.isFavoriteLanguage = false);
            }
            currentLanguageModelCopy.push({
                languageName : formValues.languageName,
                writingProficiency : formValues.writingProficiency,
                speakingProficiency : formValues.speakingProficiency,
                readingProficiency : formValues.readingProficiency,
                listeningProficiency : formValues.listeningProficiency,
                isFavoriteLanguage: formValues.isFavoriteLanguage,
                languageCode: uuid()
            });
            await updateLanguage(currentLanguageModelCopy, customerSystemId);
            setOperation("NON");
            setSelectedLanguageModel(null);
            onTriggerReloadProfileTab();
        }
    }

    return (
        <>
            <div className="text-align-right mb-4">
                <Button
                    type="default"
                    size="small"
                    onClick={() => {
                        setOperation("NEW");
                    }}
                >
                    New Language Ability
                </Button>
            </div>
            {data.length === 0 ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Empty className="mt-4 mb-3" description={"No Languages Available"}/>
                </div>
            ) : (
            <Table
                columns={tableColumns}
                dataSource={data}
                pagination={false}
                rowKey="languageCode"
            />)}

            <Drawer
                title={operation === "NEW" ? "Create New Language Ability" : "Update Language Ability"}
                placement="right"
                onClose={() => {
                    setOperation("NON");
                }}
                open={operation !== "NON"}
                width={500}
                className="bss-ui-drawer"
                destroyOnClose={true}
            >
                <Form
                    name="user-edit"
                    initialValues={{
                        languageName: operation === "UPDATE" ? selectedLanguageModel?.languageName : "",
                        isFavoriteLanguage: selectedLanguageModel?.isFavoriteLanguage === true,
                        listeningProficiency: operation === "UPDATE" ? selectedLanguageModel?.listeningProficiency : "",
                        readingProficiency: operation === "UPDATE" ? selectedLanguageModel?.readingProficiency : "",
                        speakingProficiency: operation === "UPDATE" ? selectedLanguageModel?.speakingProficiency : "",
                        writingProficiency: operation === "UPDATE" ? selectedLanguageModel?.writingProficiency : ""
                    }}
                    onFinish={onClickUpdateButtonHandler}
                    layout="vertical"
                >
                    <Form.Item
                        className="mt-3"
                        name="languageName"
                        label="Language Name"
                        rules={[
                            {required: true, message: FormInputErrorMessages.REQUIRED}
                        ]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        className="mt-3"
                        name="listeningProficiency"
                        label="Listening Proficiency"
                        rules={[
                            {required: true, message: FormInputErrorMessages.REQUIRED}
                        ]}
                    >
                        <Select className="w-100">
                            <Select.Option value="Native">Native</Select.Option>
                            <Select.Option value="Advanced">Advanced</Select.Option>
                            <Select.Option value="Intermediate">Intermediate</Select.Option>
                            <Select.Option value="Beginner">Beginner</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        className="mt-3"
                        name="readingProficiency"
                        label="Reading Proficiency"
                        rules={[
                            {required: true, message: FormInputErrorMessages.REQUIRED}
                        ]}
                    >
                        <Select className="w-100">
                            <Select.Option value="Native">Native</Select.Option>
                            <Select.Option value="Advanced">Advanced</Select.Option>
                            <Select.Option value="Intermediate">Intermediate</Select.Option>
                            <Select.Option value="Beginner">Beginner</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        className="mt-3"
                        name="speakingProficiency"
                        label="Speaking Proficiency"
                        rules={[
                            {required: true, message: FormInputErrorMessages.REQUIRED}
                        ]}
                    >
                        <Select className="w-100">
                            <Select.Option value="Native">Native</Select.Option>
                            <Select.Option value="Advanced">Advanced</Select.Option>
                            <Select.Option value="Intermediate">Intermediate</Select.Option>
                            <Select.Option value="Beginner">Beginner</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        className="mt-3"
                        name="writingProficiency"
                        label="Writing Proficiency"
                        rules={[
                            {required: true, message: FormInputErrorMessages.REQUIRED}
                        ]}
                    >
                        <Select className="w-100">
                            <Select.Option value="Native">Native</Select.Option>
                            <Select.Option value="Advanced">Advanced</Select.Option>
                            <Select.Option value="Intermediate">Intermediate</Select.Option>
                            <Select.Option value="Beginner">Beginner</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        className="mt-3"
                        name="isFavoriteLanguage"
                        label="Is Favorite Language"
                        valuePropName='checked'
                    >
                        <Checkbox></Checkbox>
                    </Form.Item>

                    <div className="bss-ui-drawer-footer text-align-right">
                        <Button
                            type="primary"
                            htmlType="submit"
                        >
                            {operation === "NEW" ? "Create" : "Update"}
                        </Button>
                    </div>
                </Form>

            </Drawer>

            <DigitalBssConfirmModal
                title="Confirm Delete"
                isOpen={deleteConfirmVisible}
                onOk={onConfirmDelete}
                onCancel={onCloseDeleteConfirm}
                btnDanger
            >
                Are you sure you want to delete this item?
            </DigitalBssConfirmModal>

        </>

    )
}

export default LanguageAbility;