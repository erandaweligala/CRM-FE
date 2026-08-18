import {FC, useEffect, useState} from "react";
import MeetingListModel from "../../models/MeetingList.model.ts";
import {Button, DatePicker, Descriptions, Form, Input, Select, Space} from "antd";
import {getAllSystemUsersList} from "../../../../../../../services/common-meta-data.service.ts";
import {FormInputErrorMessages} from "../../../../../../../constants/form-input-error-messages.ts";
import {getContactsAccountData} from "../../../../contacts-page/services/Contacts.services.ts";
import {DropDownResponseModel} from "../../../../contacts-page/models/DropDownData.response.model.ts";
import PageNoData from "../../../../../../../components/page-no-data/PageNoData.tsx";
import notificationService from "../../../../../../../services/notification.service.tsx";
import CreateMeetingRequestBodyModel from "../../models/CreateMeetingRequestBody.model.ts";
import dayjs from "dayjs";
import {createMeeting, updateMeeting} from "../../services/meeting.services.ts";
import TextArea from "antd/es/input/TextArea";
import {EnterpriseCrmComponent} from "../../../../../../../constants/EnterpriseCrmComponent.const.ts";
import DropdownValue from "../../../../common-models/DropdownValue.ts";
import {BSS_SquareButton as BssSquareButton } from "bss-component-library";


export enum ParticipantTypes {
    "USER" = "USER",
    "CONTACT" = "CONTACT"
}

interface CreateEditViewMeetingProps {
    operation: "NEW" | "VIEW" | "EDIT" | "NON";
    selectedMeeting?: MeetingListModel; // Apply only for operation type VIEW and UPDATE
    onClose: (shouldReload: boolean) => void;
    entityId: string;
    component: EnterpriseCrmComponent;
}

const CreateEditViewMeeting: FC<CreateEditViewMeetingProps> = ({
                                                                   operation,
                                                                   selectedMeeting,
                                                                   component,
                                                                   entityId,
                                                                   onClose
                                                               }) => {

    const [form] = Form.useForm();
    const [participantsForm] = Form.useForm();

    const [allUsers, setAllUsers] = useState<DropdownValue[]>([]);
    const [allContacts, setAllContacts] = useState<DropDownResponseModel[]>([]);
    const [participantList, setParticipantList] = useState<{
        users: { id: string; name: string; type: ParticipantTypes }[];
        contacts: { id: string; name: string; type: ParticipantTypes }[];
    }>({
        users: [],
        contacts: []
    });
    const [newRows, setNewRows] = useState(10);
    const type = Form.useWatch('type', participantsForm);
    const participate = Form.useWatch('participate', participantsForm);

    useEffect(() => {
        getAllSystemUsersList().then((response) => {
            setAllUsers(response)
        })
        getContactsAccountData().then((response) => {
            setAllContacts(response)
        })
        if (operation === "EDIT" && selectedMeeting) {
            form.setFieldsValue({
                title: selectedMeeting.title,
                description: selectedMeeting.description,
                fromDateTime: dayjs(selectedMeeting.fromDateTime, "YYYY-MM-DD hh:mm A"),
                toDateTime: dayjs(selectedMeeting.toDateTime, "YYYY-MM-DD hh:mm A"),
                host: selectedMeeting.host,
                location: selectedMeeting.location,
                status: selectedMeeting.status,
                referenceId: entityId,
                participants: [...participantList.users, ...participantList.contacts]
            });
            setParticipantList({
                users: selectedMeeting.participants.filter((singleParticipant) => singleParticipant.type === ParticipantTypes.USER),
                contacts: selectedMeeting.participants.filter((singleParticipant) => singleParticipant.type === ParticipantTypes.CONTACT)
            });
        }
    }, []);

    const removeParticipant = (type: ParticipantTypes, id: string) => {
        setParticipantList((prevState) => {
            const newState = {...prevState}
            if (type === ParticipantTypes.USER) {
                newState.users = newState.users.filter((singleUser) => singleUser.id !== id)
            } else if (type === ParticipantTypes.CONTACT) {
                newState.contacts = newState.contacts.filter((singleContact) => singleContact.id !== id)
            }
            return newState
        })
    };

    const mainFormSubmit = async (formInputs: { [key: string]: any }) => {
        if (participantList.users.length + participantList.contacts.length < 2) {
            notificationService("ERROR", "Please select at least two participants");
            return;
        }

        const requestBody: CreateMeetingRequestBodyModel = {
            title: formInputs.title,
            description: formInputs.description,
            fromDateTime: (formInputs.fromDateTime as dayjs.Dayjs).format("YYYY-MM-DD hh:mm A"),
            toDateTime: (formInputs.toDateTime as dayjs.Dayjs).format("YYYY-MM-DD hh:mm A"),
            host: formInputs.host,
            location: formInputs.location,
            status: formInputs.status,
            referenceId: entityId,
            participants: [...participantList.users, ...participantList.contacts]
        }

        if (operation === "NEW") {
            await createMeeting(requestBody, component);
            onClose(true);
        } else if (operation === "EDIT") {
            if (selectedMeeting) {
                await updateMeeting(selectedMeeting.id, requestBody, component);
            }
            onClose(true);
        }

    }


    return (
        <>
            {
                (operation === "NEW" || operation === "EDIT") &&
                <>
                    <Form
                        form={form}
                        layout="vertical"
                        className="mt-3"
                        onFinish={mainFormSubmit}
                    >

                        <Form.Item
                            label="Title"
                            name="title"
                            rules={[{required: true, message: FormInputErrorMessages.REQUIRED}]}
                        >
                            <Input showCount maxLength={50} placeholder="Meeting Title"/>

                        </Form.Item>

                        <Form.Item
                            label="Description"
                            name="description"
                            rules={[{required: true, message: FormInputErrorMessages.REQUIRED}]}
                        >
                            <TextArea
                                showCount
                                maxLength={1000}
                                rows={newRows}
                                placeholder="Meeting Description"
                                onChange={(e) => {
                                    const wordCount = e.target.value.split(/\s+/).filter(word => word).length;
                                    const newRows = Math.min(Math.max(Math.ceil(wordCount / 10), 5), 20);
                                    form.setFieldsValue({description: e.target.value});
                                    setNewRows(newRows);
                                }}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Location"
                            name="location"
                            rules={[{required: true, message: FormInputErrorMessages.REQUIRED}]}
                        >
                            <Input showCount maxLength={50} placeholder="Location"/>
                        </Form.Item>

                        <Form.Item
                            label="Meeting Start Time"
                            name="fromDateTime"
                            rules={[
                                {required: true, message: FormInputErrorMessages.REQUIRED},
                                ({getFieldValue}) => ({
                                    validator(_, value) {
                                        const toDateTime = getFieldValue('toDateTime');
                                        if (!value || !toDateTime || value.isBefore(toDateTime)) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Start time must be before end time.'));
                                    },
                                }),
                            ]}
                        >
                            <DatePicker
                                showTime
                                format="YYYY-MM-DD hh:mm A"
                                style={{width: "100%"}}
                                placeholder="Meeting Start Date and Time"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Meeting End Time"
                            name="toDateTime"
                            rules={[
                                {required: true, message: FormInputErrorMessages.REQUIRED},
                                ({getFieldValue}) => ({
                                    validator(_, value) {
                                        const fromDateTime = getFieldValue('fromDateTime');
                                        if (!value || !fromDateTime || value.isAfter(fromDateTime)) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('End time must be after start time.'));
                                    },
                                }),
                            ]}
                        >
                            <DatePicker
                                showTime
                                format="YYYY-MM-DD hh:mm A"
                                style={{width: "100%"}}
                                placeholder="Meeting End Date and Time"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Host"
                            name="host"
                            rules={[{required: true, message: FormInputErrorMessages.REQUIRED}]}
                        >
                            <Select placeholder="Select Host" showSearch>
                                {
                                    allUsers.map((singleUser) => {
                                        return (
                                            <Select.Option
                                                value={singleUser.value}
                                                key={singleUser.value}
                                            >
                                                {singleUser.label}
                                            </Select.Option>
                                        )
                                    })
                                }
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Status"
                            name="status"
                            rules={[{required: true, message: FormInputErrorMessages.REQUIRED}]}
                        >
                            <Select placeholder="Select Status">
                                <Select.Option value="Scheduled">Scheduled</Select.Option>
                                <Select.Option value="Canceled">Canceled</Select.Option>
                                <Select.Option value="Completed">Completed</Select.Option>
                                <Select.Option value="On Hold">On Hold</Select.Option>
                                <Select.Option value="Rescheduled">Rescheduled</Select.Option>
                            </Select>
                        </Form.Item>

                    </Form>

                    <p className="font-md-medium">Participants</p>

                    <Form
                        form={participantsForm}
                        layout="vertical"
                        className="mt-3"
                        onFinish={(formInput) => {
                            if (formInput.type === ParticipantTypes.USER) {
                                setParticipantList((prevState) => {

                                    const newState = {...prevState}
                                    newState.users.push({
                                        type: ParticipantTypes.USER,
                                        id: formInput.participate,
                                        name: formInput.participate,
                                    })

                                    return {...prevState}
                                })
                            } else if (formInput.type === ParticipantTypes.CONTACT) {
                                setParticipantList((prevState) => {

                                    const newState = {...prevState}
                                    newState.contacts.push({
                                        type: ParticipantTypes.CONTACT,
                                        id: formInput.participate,
                                        name: allContacts.find((contact) => contact.id === formInput.participate)!.name,
                                    })

                                    return {...prevState}
                                })
                            }

                            participantsForm.setFieldValue('participate', undefined);

                        }}
                        initialValues={{
                            type: ParticipantTypes.USER
                        }}
                    >
                        <Space.Compact>
                            <Form.Item name="type">
                                <Select
                                    onChange={() => participantsForm.setFieldValue('participate', undefined)}
                                    style={{width: 100}}
                                >
                                    <Select.Option value={ParticipantTypes.USER}>Users</Select.Option>
                                    <Select.Option value={ParticipantTypes.CONTACT}>Contact</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item name="participate">
                                <Select placeholder="Select Participate" style={{width: 275}}>
                                    {
                                        type === ParticipantTypes.USER &&
                                        allUsers.map((singleUser) => {
                                            return (
                                                <Select.Option
                                                    value={singleUser.value}
                                                    key={singleUser.value}
                                                >
                                                    {singleUser.label}
                                                </Select.Option>
                                            )
                                        })
                                    }
                                    {
                                        type === ParticipantTypes.CONTACT &&
                                        allContacts.map((singleContact) => {
                                            return (
                                                <Select.Option
                                                    value={singleContact.id}
                                                    key={singleContact.id}
                                                >
                                                    {singleContact.name}
                                                </Select.Option>
                                            )
                                        })
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item>
                                <Button htmlType="submit" disabled={!participate}>Add</Button>
                            </Form.Item>
                        </Space.Compact>
                    </Form>

                    {
                        (participantList.users.length + participantList.contacts.length) === 0 &&
                        <div className="default-border" style={{marginTop: "-12px"}}>
                            <PageNoData height="100px"
                                        description="No Participant Selected. Need Minimun Two Participants"/>
                        </div>
                    }

                    {
                        (participantList.users.length + participantList.contacts.length) > 0 &&
                        <Descriptions bordered column={1} className="custom-descriptions" style={{marginTop: "-12px"}}>
                            {
                                participantList.users.map((singleUsers) => {
                                    return (
                                        <Descriptions.Item
                                            label={singleUsers.name + " (User)"}
                                            contentStyle={{width: 60}}
                                            key={singleUsers.id}
                                        >
                                            <BssSquareButton
                                                onClick={() => {
                                                    removeParticipant(ParticipantTypes.USER, singleUsers.id);
                                                }}
                                                type="DELETE"
                                            />
                                        </Descriptions.Item>
                                    )
                                })
                            }
                            {
                                participantList.contacts.map((singleContact) => {
                                    return (
                                        <Descriptions.Item
                                            label={singleContact.name + " (Contact)"}
                                            contentStyle={{width: 60}}
                                            key={singleContact.id}
                                        >
                                            <BssSquareButton
                                                onClick={() => {
                                                    removeParticipant(ParticipantTypes.CONTACT, singleContact.id);
                                                }}
                                                type="DELETE"
                                            />
                                        </Descriptions.Item>
                                    )
                                })
                            }

                        </Descriptions>
                    }


                    <div className="bss-ui-drawer-footer text-align-right">
                        <Button
                            type="primary"
                            onClick={form.submit}
                            className="primary-btn ml-2"
                        >
                            {operation === "NEW" && "Create Meeting"}
                            {operation === "EDIT" && "Update Meeting"}
                        </Button>
                    </div>

                </>
            }
            {
                operation === "VIEW" &&
                <Descriptions bordered className="custom-descriptions" column={1} style={{marginTop: "20px"}}>
                    <Descriptions.Item label="ID">{selectedMeeting?.id}</Descriptions.Item>
                    <Descriptions.Item label="Title">{selectedMeeting?.title}</Descriptions.Item>
                    <Descriptions.Item label="Description">{selectedMeeting?.description}</Descriptions.Item>
                    <Descriptions.Item label="Location">{selectedMeeting?.location}</Descriptions.Item>
                    <Descriptions.Item label="Status">{selectedMeeting?.status}</Descriptions.Item>
                    <Descriptions.Item label="Start Date & Time">{selectedMeeting?.fromDateTime}</Descriptions.Item>
                    <Descriptions.Item label="End Date & Time">{selectedMeeting?.toDateTime}</Descriptions.Item>
                    <Descriptions.Item label="Host">{selectedMeeting?.host}</Descriptions.Item>
                    <Descriptions.Item label="Participants">
                        {
                            selectedMeeting?.participants.map((singleParticipant) => {
                                return <p key={singleParticipant.id}>
                                    {singleParticipant.name}
                                    {singleParticipant.type === "USER" ? " (User)" : ''}
                                    {singleParticipant.type === "CONTACT" ? " (Contact)" : ''}
                                </p>
                            })
                        }
                    </Descriptions.Item>
                </Descriptions>
            }
        </>

    )
}

export default CreateEditViewMeeting;