import {Button, Input, Select, Form, DatePicker} from "antd";
import {FC, useEffect, useState} from "react";
import {CallModel} from "../../model/CallModel.ts";
import {FormInputErrorMessages} from "../../../../../../../constants/form-input-error-messages.ts";
import dayjs from "dayjs";
import {postCallList, updateCallList} from "../../services/call.services.ts";
import {getAllSystemUsersList} from "../../../../../../../services/common-meta-data.service.ts";
import TextArea from "antd/es/input/TextArea";
import { EnterpriseCrmComponent } from "../../../../../../../constants/EnterpriseCrmComponent.const.ts";
import DropdownValue from "../../../../common-models/DropdownValue.ts";

const {Option} = Select;

interface CallCreateProps {
  onClose: () => void;
  component: EnterpriseCrmComponent;
  entityId: string;
  operation: "NEW" | "EDIT";
  editData?: CallModel;
}

const CallCreate: FC<CallCreateProps> = ({
                                            onClose,
                                            component,
                                            entityId,
                                            editData,
                                            operation,
                                          }) => {


  const [form] = Form.useForm();

  const [allUsers, setAllUsers] = useState<DropdownValue[]>([]);
  const [newRows, setNewRows] = useState(10);
  useEffect(() => {
    getAllSystemUsersList().then((response) => {
        setAllUsers(response)
    })
}, []);

  useEffect(() => {
    if (operation === "EDIT" && editData) {
      form.setFieldsValue({
          callType: editData.callType,
          callMedium: editData.callMedium,
          startDateTime: dayjs(editData.startDateTime),
          status: editData.status,
          ownerId: editData.ownerId,
          subject: editData.subject,
          purpose: editData.purpose,
          agenda: editData.agenda,
          referenceId: editData?.referenceId,
      });
    }
  }, [editData, operation, form]);


  const onCallCreate = async () => {
    await form.validateFields();

    const payload: CallModel = {
        callType: form.getFieldValue("callType"),
        callMedium: form.getFieldValue("callMedium"),
        status: form.getFieldValue("status"),
        startDateTime: dayjs(form.getFieldValue("startDateTime")).format("YYYY-MM-DD hh:mm A"),
        ownerId: form.getFieldValue("ownerId"),
        subject: form.getFieldValue("subject"),
        purpose: form.getFieldValue("purpose"),
        agenda: form.getFieldValue("agenda"),
        referenceId: entityId
    };


    if (operation === "NEW") {
      const response = await postCallList(payload, component);

      if (response) {
        form.resetFields();
      }
    } else if (operation === "EDIT") {
      if (editData) {
        const response = await updateCallList(editData.id!, payload, component);

        if (response) {
          form.resetFields();
        }
      }
    }

    onClose();
  };

  return (
    <>

      <Form form={form} layout="vertical">
        <Form.Item
          label="Call Type"
          name="callType"
          rules={[{ required: true, message: FormInputErrorMessages.REQUIRED }]}
        >
          <Select placeholder="Select Type">
            <Option value="Inbound">Inbound</Option>
            <Option value="Outbound">Outbound</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Call Medium"
          name="callMedium"
          rules={[{ required: true, message: FormInputErrorMessages.REQUIRED }]}
        >
          <Select placeholder="Select Type">
            <Option value="Mobile">Mobile</Option>
            <Option value="Whatsapp">Whatsapp</Option>
            <Option value="Viber">Viber</Option>
            <Option value="Messenger">Messenger</Option>
            <Option value="Zoom">Zoom</Option>
            <Option value="Teams">Teams</Option>
            <Option value="imo">imo</Option>
            <Option value="Others">Others</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: FormInputErrorMessages.REQUIRED }]}
        >
          <Select placeholder="Select Status">
            <Option value="Scheduled">Scheduled</Option>
            <Option value="Rescheduled">Rescheduled</Option>
            <Option value="Completed">Completed</Option>
            <Option value="Canceled">Canceled</Option>
          </Select>
        </Form.Item>

        <Form.Item
            label="Owner"
            name="ownerId"
            rules={[{required: true, message: FormInputErrorMessages.REQUIRED}]}
        >
            <Select 
            placeholder="Select Owner">
                {
                    allUsers.map((singleUser) => {
                        return (
                            <Option
                                value={singleUser.value}
                                key={singleUser.value}
                            >
                                {singleUser.label}
                            </Option>
                        )
                    })
                }
            </Select>

          </Form.Item>

        <Form.Item
          label="Start Date & Time"
          name="startDateTime"
          rules={[
            { required: true, message: FormInputErrorMessages.REQUIRED },
            {
              validator: (_, value) => {
          if (value && value.isBefore(dayjs())) {
            return Promise.reject(new Error("Start date and time cannot be in the past."));
          }
          return Promise.resolve();
              },
            },
          ]}
        >
          <DatePicker
            showTime
            format="YYYY-MM-DD hh:mm A"
            style={{ width: "100%" }}
            placeholder="Select Start Date & Time"
          />
        </Form.Item>

        <Form.Item
          label="Subject"
          name="subject"
          rules={[{ required: true, message: FormInputErrorMessages.REQUIRED }]}
        >
          <Input showCount maxLength={100} placeholder="Subject" />
        </Form.Item>

        <Form.Item
          label="Purpose"
          name="purpose"
          rules={[{ required: true, message: FormInputErrorMessages.REQUIRED }]}
        >
          <TextArea 
                        showCount 
                        maxLength={1000} 
                        rows={newRows} 
                        placeholder="Call Purpose" 
                        onChange={(e) => {
                           const wordCount = e.target.value.split(/\s+/).filter(word => word).length;
                           const newRows = Math.min(Math.max(Math.ceil(wordCount / 10), 5), 20);
                           form.setFieldsValue({ purpose: e.target.value });
                           setNewRows(newRows);
                        }}
                      />
        </Form.Item>

        <Form.Item
          label="Agenda"
          name="agenda"
          rules={[{ required: true, message: FormInputErrorMessages.REQUIRED }]}
        >
          <TextArea 
                        showCount 
                        maxLength={1000} 
                        rows={newRows} 
                        placeholder="Call Agenda" 
                        onChange={(e) => {
                           const wordCount = e.target.value.split(/\s+/).filter(word => word).length;
                           const newRows = Math.min(Math.max(Math.ceil(wordCount / 10), 5), 20);
                           form.setFieldsValue({ agenda: e.target.value });
                           setNewRows(newRows);
                        }}
                      />
        </Form.Item>
      </Form>

      <div className="bss-ui-drawer-footer text-align-right">
        <Button
          type="primary"
          onClick={onCallCreate}
          className="primary-btn ml-2"
        >
          {operation === "NEW" ? "Create Call" : "Update Call"}
        </Button>
      </div>

    </>
  );
};

export default CallCreate;
