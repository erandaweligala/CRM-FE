import {FC, useState} from "react";
import {ContactDetailsModel} from "../../../../models/CustomerProfileModel";
import {Button, Checkbox, Descriptions, Drawer, Form, Input, Select, Tag, Tooltip} from "antd";
import {updateContactDetails} from "../../../../services/customer-profile.service";
import {FormInputErrorMessages} from "../../../../../../constants/form-input-error-messages";
import DigitalBssConfirmModal from "../../../../../../components/DigitalBssConfirmModal";
import EditButton from '../../../../../../assets/images/edit.svg?react';
import DeleteIcon from '../../../../../../assets/images/delete-icon.svg?react';
import { BSS_Container as BssContainer } from "bss-component-library";

interface ContactDetailsProps {
    data: ContactDetailsModel[];
    customerSystemId: string;
    onTriggerReloadProfileTab: () => void;
}

const ContactDetails: FC<ContactDetailsProps> = ({
                                                     data,
                                                     customerSystemId,
                                                     onTriggerReloadProfileTab
                                                 }) => {

    const [form] = Form.useForm();
    const [drawerData, setDrawerData] = useState<{
        isOpen: boolean;
        operation: "NEW" | "EDIT" | "DELETE" | "NON";
        contactType: "address" | "mobileNumber" | "email" | "NON";
        editItemIndex: string | null;
    }>({
        isOpen: false,
        operation: "NON",
        contactType: "NON",
        editItemIndex: null
    });

    const onCloseDrawer = () => {
        setDrawerData({
            isOpen: false,
            operation: "NON",
            contactType: "NON",
            editItemIndex: null
        });
    }

    const deleteContactHandler = async () => {

        const dataDeepCopy: ContactDetailsModel[] = JSON.parse(JSON.stringify(data));

        let deleteItemIndex: number = 0;
        let typeArrayIndex: number | null = null;

        dataDeepCopy.forEach((contactDetailsModel, index) => {
            if (contactDetailsModel.mediumType === drawerData.contactType) {
                if (typeArrayIndex === null) {
                    typeArrayIndex = 0;
                } else {
                    typeArrayIndex++;
                }
                if (typeArrayIndex.toString() === drawerData.editItemIndex) {
                    deleteItemIndex = index;
                    return;
                }
            }
        });

        dataDeepCopy.splice(deleteItemIndex, 1);

        const apiCallStatus = await updateContactDetails(dataDeepCopy, customerSystemId);

        if (apiCallStatus === "SUCCESS") {
            setDrawerData({
                isOpen: false,
                operation: "NON",
                contactType: "NON",
                editItemIndex: null
            });
            onTriggerReloadProfileTab();
        }

    }

    const onClickUpdateButtonHandler = async (formInput: any) => {
        const dataDeepCopy: ContactDetailsModel[] = JSON.parse(JSON.stringify(data));
        const { contactType, operation, editItemIndex } = drawerData;
    
        if (formInput.isPreferred) {
            unsetPreviousPreferred(dataDeepCopy, contactType);
        }
    
        if (operation === "NEW") {
            if (contactType !== "NON") {
                const newContact = buildNewContact(formInput, contactType);
                dataDeepCopy.push(newContact);
            }
        }
    
        if (operation === "EDIT") {
            updateExistingContact(dataDeepCopy, formInput, contactType, parseInt(editItemIndex!));
        }
    
        const apiCallStatus = await updateContactDetails(dataDeepCopy, customerSystemId);
    
        if (apiCallStatus === "SUCCESS") {
            resetDrawer();
            onTriggerReloadProfileTab();
        }
    };
    
    // --- Helper Functions ---
    
    const unsetPreviousPreferred = (contacts: ContactDetailsModel[], type: string) => {
        contacts.forEach((contact) => {
            if (contact.mediumType === type) {
                contact.preferred = false;
            }
        });
    };
    
    const buildNewContact = (formInput: any, type: "address" | "mobileNumber" | "email"): ContactDetailsModel => {
        const baseModel: ContactDetailsModel = {
            mediumType: type,
            preferred: formInput.isPreferred,
            characteristic: {
                phoneNumber: "",
                contactType: "",
                city: "",
                country: "",
                emailAddress: "",
                faxNumber: "",
                postCode: "",
                socialNetworkId: "",
                stateOrProvince: "",
                street1: "",
                street2: "",
            },
        };
    
        switch (type) {
            case "email":
                baseModel.characteristic.emailAddress = formInput.emailAddress;
                break;
            case "mobileNumber":
                baseModel.characteristic.phoneNumber = formInput.phoneNumber;
                break;
            case "address":
                Object.assign(baseModel.characteristic, {
                    street1: formInput.street1,
                    street2: formInput.street2,
                    city: formInput.city,
                    stateOrProvince: formInput.stateOrProvince,
                    country: formInput.country,
                    postCode: formInput.postCode,
                });
                break;
        }
    
        return baseModel;
    };
    
    const updateExistingContact = (
        contacts: ContactDetailsModel[],
        formInput: any,
        type: string,
        index: number
    ) => {
        const target = contacts.filter(c => c.mediumType === type)[index];
    
        switch (type) {
            case "email":
                target.characteristic.emailAddress = formInput.emailAddress;
                break;
            case "mobileNumber":
                target.characteristic.phoneNumber = formInput.phoneNumber;
                break;
            case "address":
                Object.assign(target.characteristic, {
                    street1: formInput.street1,
                    street2: formInput.street2,
                    city: formInput.city,
                    stateOrProvince: formInput.stateOrProvince,
                    country: formInput.country,
                    postCode: formInput.postCode,
                });
                break;
        }
    
        target.preferred = formInput.isPreferred;
    };
    
    const resetDrawer = () => {
        setDrawerData({
            isOpen: false,
            operation: "NON",
            contactType: "NON",
            editItemIndex: null,
        });
    };
    

    const getAddressInStringFormat = (address: ContactDetailsModel): string => {

        let addressString = "";

        addressString = address.characteristic.street1 ?? "";
        addressString = addressString + (address.characteristic.street2 ? ", " + address.characteristic.street2 : "");
        addressString = addressString + (address.characteristic.city ? ", " + address.characteristic.city : "");
        addressString = addressString + (address.characteristic.stateOrProvince ? ", " + address.characteristic.stateOrProvince : "");
        addressString = addressString + (address.characteristic.country ? ", " + address.characteristic.country : "");
        addressString = addressString + (address.characteristic.postCode ? ", " + address.characteristic.postCode : "");

        return addressString;

    }

    const eMailListComponent = () => {

        const onlyEmailContact = data.filter((singleContact) => {
            return singleContact.mediumType === "email"
        });

        return onlyEmailContact.map((emailContact, index) => {
            return (
                <div
                    key={emailContact.characteristic.emailAddress}
                    className={index > 0 ? "mt-1" : ""}
                >
                    <Tooltip title="Edit">
                        <EditButton
                            className="mr-1 svg-edit-button"
                            onClick={() => {
                                setDrawerData({
                                    isOpen: true,
                                    operation: "EDIT",
                                    contactType: "email",
                                    editItemIndex: index.toString()
                                });
                                form.setFieldValue("emailAddress", emailContact.characteristic.emailAddress);
                                form.setFieldValue("isPreferred", emailContact.preferred);
                            }}
                        />
                    </Tooltip>

                    <Tooltip title="Delete">
                        <DeleteIcon
                            className="mr-1 svg-delete-button"
                            onClick={() => {
                                setDrawerData({
                                    isOpen: true,
                                    operation: "DELETE",
                                    contactType: "email",
                                    editItemIndex: index.toString()
                                });
                            }}
                        />
                    </Tooltip>

                    {emailContact.characteristic.emailAddress}
                    {
                        emailContact.preferred &&
                        <Tag
                            color="processing"
                            className="ml-1"
                        >
                            Preferred
                        </Tag>
                    }
                </div>
            )
        });

    }

    const mobileNumberListComponent = () => {

        const onlyMobileNumberContact = data.filter((singleContact) => {
            return singleContact.mediumType === "mobileNumber"
        });

        return onlyMobileNumberContact.map((mobileNumberContact, index) => {
            return (
                <div
                    key={mobileNumberContact.characteristic.phoneNumber}
                    className={index > 0 ? "mt-1" : ""}
                >
                    <Tooltip title="Edit">
                        <EditButton
                            className="mr-1 svg-edit-button"
                            onClick={() => {
                                setDrawerData({
                                    isOpen: true,
                                    operation: "EDIT",
                                    contactType: "mobileNumber",
                                    editItemIndex: index.toString()
                                });
                                form.setFieldValue("phoneNumber", mobileNumberContact.characteristic.phoneNumber);
                                form.setFieldValue("isPreferred", mobileNumberContact.preferred);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <DeleteIcon
                            className="mr-1 svg-delete-button"
                            onClick={() => {
                                setDrawerData({
                                    isOpen: true,
                                    operation: "DELETE",
                                    contactType: "mobileNumber",
                                    editItemIndex: index.toString()
                                });
                            }}
                        />
                    </Tooltip>
                    {mobileNumberContact.characteristic.phoneNumber}
                    {
                        mobileNumberContact.preferred &&
                        <Tag
                            color="processing"
                            className="ml-1"
                        >
                            Preferred
                        </Tag>
                    }
                </div>
            )
        });

    }

    const addressListComponent = () => {

        const onlyAddressContact = data.filter((singleContact) => {
            return singleContact.mediumType === "address"
        });

        return onlyAddressContact.map((addressContact, index) => {
            return (
                <div
                    className={index > 0 ? "mt-1" : ""}
                    key={getAddressInStringFormat(addressContact)}
                >
                    <Tooltip title="Edit">
                        <EditButton
                            onClick={() => {
                                setDrawerData({
                                    isOpen: true,
                                    operation: "EDIT",
                                    contactType: "address",
                                    editItemIndex: index.toString()
                                });
                                form.setFieldValue("street1", addressContact.characteristic.street1);
                                form.setFieldValue("street2", addressContact.characteristic.street2);
                                form.setFieldValue("city", addressContact.characteristic.city);
                                form.setFieldValue("stateOrProvince", addressContact.characteristic.stateOrProvince);
                                form.setFieldValue("country", addressContact.characteristic.country);
                                form.setFieldValue("postCode", addressContact.characteristic.postCode);
                                form.setFieldValue("isPreferred", addressContact.preferred);
                            }}
                            className="mr-1 svg-edit-button"
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <DeleteIcon
                            className="mr-1 svg-delete-button"
                            onClick={() => {
                                setDrawerData({
                                    isOpen: true,
                                    operation: "DELETE",
                                    contactType: "address",
                                    editItemIndex: index.toString()
                                });
                            }}
                        />
                    </Tooltip>
                    {getAddressInStringFormat(addressContact)}
                    {
                        addressContact.preferred &&
                        <Tag
                            color="processing"
                            className="ml-1"
                        >
                            Preferred
                        </Tag>
                    }
                </div>
            )
        });

    }

    const contactTypeConvertToString = (contactType: "address" | "mobileNumber" | "email" | "NON") => {
        if (contactType === "address") {
            return "Address";
        } else if (contactType === "email") {
            return "E-Mail";
        } else if (contactType === "mobileNumber") {
            return "Mobile Number";
        } else {
            return "";
        }
    }

    return (
        <>

            <div className="text-align-right mb-4">
                <Button
                    type="default"
                    size="small"
                    onClick={() => {
                        setDrawerData({
                            isOpen: true,
                            operation: "NEW",
                            contactType: "NON",
                            editItemIndex: null
                        });
                        form.resetFields();
                    }}
                >
                    Create New Contact
                </Button>
            </div>

            <Descriptions
                bordered
                labelStyle={{width: 100}}
            >

                <Descriptions.Item
                    label="Email"
                    key="Email"
                    span={3}
                >
                    {
                        eMailListComponent()
                    }
                </Descriptions.Item>

                <Descriptions.Item
                    label="Mobile"
                    key="Mobile"
                    span={3}
                >
                    {
                        mobileNumberListComponent()
                    }
                </Descriptions.Item>

                <Descriptions.Item
                    label="Address"
                    key="Address"
                    span={3}
                >
                    {
                        addressListComponent()
                    }
                </Descriptions.Item>

            </Descriptions>

            <DigitalBssConfirmModal
                btnDanger={true}
                title="Delete Contact"
                isOpen={drawerData.operation === "DELETE" && drawerData.isOpen}
                onOk={deleteContactHandler}
                onCancel={() => {
                    setDrawerData({
                        isOpen: false,
                        operation: "NON",
                        contactType: "NON",
                        editItemIndex: null
                    });
                }}
            >
                <div className="font-md-regular">Are you sure to delete the contact ?</div>
            </DigitalBssConfirmModal>

            <Drawer
                title={drawerData.operation === "NEW" ? "Create New Contact" : ("Update Contact (" + contactTypeConvertToString(drawerData.contactType) + ")")}
                placement="right"
                onClose={onCloseDrawer}
                open={drawerData.operation === "NEW" || drawerData.operation === "EDIT"}
                width={500}
                className="bss-ui-drawer"
                destroyOnClose={true}
            >
                <Form
                    form={form}
                    name="user-edit"
                    onFinish={onClickUpdateButtonHandler}
                    onError={(x) => {
                        console.log(x);
                    }}
                    layout="vertical"
                >
                    {
                        drawerData.operation !== "EDIT" &&
                        <Form.Item
                            className="mt-3"
                            name="preferredType"
                            label="Contact Method"
                            rules={[
                                {required: true, message: FormInputErrorMessages.REQUIRED}
                            ]}
                        >
                            <Select
                                placeholder="Select Contact Type"
                                className="w-100"
                                onChange={(value, _option) => {
                                    setDrawerData((currentData) => {
                                        return {...currentData, contactType: value}
                                    });
                                    form.resetFields();
                                    form.setFieldValue("preferredType", value);
                                }}
                            >
                                <Select.Option value="email">E-Mail</Select.Option>
                                <Select.Option value="mobileNumber">Mobile Phone</Select.Option>
                                <Select.Option value="address">Address</Select.Option>
                            </Select>
                        </Form.Item>
                    }

                    {
                        drawerData.contactType === "email" &&
                        <Form.Item
                            className="mt-3"
                            name="emailAddress"
                            label="E-Mail"
                            rules={[
                                {required: true, message: FormInputErrorMessages.REQUIRED},
                                {type: "email", message: FormInputErrorMessages.EMAIL}
                            ]}
                        >
                            <Input/>
                        </Form.Item>
                    }

                    {
                        drawerData.contactType === "mobileNumber" &&
                        <Form.Item
                            className="mt-3"
                            name="phoneNumber"
                            label="Mobile"
                            rules={[
                                {required: true, message: FormInputErrorMessages.REQUIRED}
                            ]}
                        >
                            <Input onKeyDown={(event) => {
                                if (!/\d/.test(event.key)) {
                                    event.preventDefault();
                                }
                            }}/>
                        </Form.Item>
                    }

                    {
                        drawerData.contactType === "address" && (
                            <div className="mt-2">
                                <BssContainer
                                    title="Address"
                                    className="px-4"
                                >
                                    <Form.Item
                                        className="mt-3"
                                        name="street1"
                                        label="Street 1"
                                        rules={[
                                            {required: true, message: FormInputErrorMessages.REQUIRED}
                                        ]}
                                    >
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item
                                        className="mt-3"
                                        name="street2"
                                        label="Street 2"
                                    >
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item
                                        className="mt-3"
                                        name="city"
                                        label="City"
                                        rules={[
                                            {required: true, message: FormInputErrorMessages.REQUIRED}
                                        ]}
                                    >
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item
                                        className="mt-3"
                                        name="stateOrProvince"
                                        label="State or Province"
                                        rules={[
                                            {required: true, message: FormInputErrorMessages.REQUIRED}
                                        ]}
                                    >
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item
                                        className="mt-3"
                                        name="country"
                                        label="Country"
                                        rules={[
                                            {required: true, message: FormInputErrorMessages.REQUIRED}
                                        ]}
                                    >
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item
                                        className="mt-3"
                                        name="postCode"
                                        label="Postcode"
                                        rules={[
                                            {required: true, message: FormInputErrorMessages.REQUIRED}
                                        ]}
                                    >
                                        <Input onKeyDown={(event) => {
                                            if (!/\d/.test(event.key)) {
                                                event.preventDefault();
                                            }
                                        }}/>
                                    </Form.Item>

                                </BssContainer>
                            </div>
                        )

                    }

                    {
                        drawerData.contactType !== "NON" &&
                        <Form.Item
                            className="mt-3"
                            name="isPreferred"
                            label={"Is Preferred " + contactTypeConvertToString(drawerData.contactType)}
                            valuePropName="checked"
                        >
                            <Checkbox></Checkbox>
                        </Form.Item>
                    }


                    <div className="bss-ui-drawer-footer text-align-right">
                        <Button
                            type="primary"
                            htmlType="submit"
                        >
                            {drawerData.operation === "NEW" ? "Create" : "Update"}
                        </Button>
                    </div>

                </Form>

            </Drawer>

        </>
    )
}

export default ContactDetails;