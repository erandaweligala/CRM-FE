import { Button, Input, Select, Form, DatePicker } from "antd";
import { FC, useEffect, useState } from "react";
import dayjs from "dayjs";
import { EmailModel } from "../../models/EmailModel.ts";
import { getEmailRecipient, postEmailList, updateEmailList } from "../../service/Emails.services.ts";
import { FormInputErrorMessages } from "../../../../../../../constants/form-input-error-messages.ts";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { EnterpriseCrmComponent } from "../../../../../../../constants/EnterpriseCrmComponent.const.ts";
import EmailRecipientSelector from "./Components/EmailRecipientSelector.tsx";
import { DropDownEmailResponseModel } from "../../models/dropDownData.model.ts";

const { Option } = Select;

interface EmailCreateEditProps {
  onClose: () => void;
  component: EnterpriseCrmComponent;
  entityId: string;
  operation: "NEW" | "EDIT";
  editData?: EmailModel;
}


const EmailCreateEdit: FC<EmailCreateEditProps> = ({
  onClose,
  component,
  entityId,
  editData,
  operation,
}) => {

  const [form] = Form.useForm();
  const [emailType, setEmailType] = useState<string | undefined>(
    Array.isArray(editData) ? editData[0]?.emailType : undefined
  );  
  const [options, setOptions] = useState<DropDownEmailResponseModel[]>([]);
  const [isCreateOrUpdateDisabled, setIsCreateOrUpdateDisabled] = useState(false);


  useEffect(() => {
    getEmailListDetails();
  }, []);


  useEffect(() => {
    if (editData) {
      console.log("Edit Data:", editData);
      setIsCreateOrUpdateDisabled(editData.emailType === "SEND");
    }
  }, [editData]);

  useEffect(() => {
    console.log("editData:", editData);
    if (operation === "EDIT" && editData) {
      form.setFieldsValue({
        sendTo: editData.sendTo || [],
        carbonCopy: editData.carbonCopy || [],
        blindCarbonCopy: editData.blindCarbonCopy || [],
        sendDate: editData.sendDate ? dayjs(editData.sendDate, "YYYY-MM-DD hh:mm A") : undefined,
        emailBody: editData.emailBody || "",
        subject: editData.subject || "",
        createdBy: editData.createdBy || "",
        emailType: editData.emailType || "",
        referenceId: editData.referenceId || "",
        status: editData.status || "",
        referenceType: editData.referenceType || "",
      });
    }
  }, [editData, operation, form]);
  
  const onEmailTypeChange = (value: string) => {
    setEmailType(value);
  };


  const onCallCreate = async () => {
    await form.validateFields();

    const payload: EmailModel = {
      sendTo: form.getFieldValue("sendTo"),
      carbonCopy: form.getFieldValue("carbonCopy"),
      blindCarbonCopy: form.getFieldValue("blindCarbonCopy"),
      sendDate: dayjs(form.getFieldValue("sendDate")).format("YYYY-MM-DD hh:mm A"),
      emailBody: form.getFieldValue("emailBody"),
      subject: form.getFieldValue("subject"),
      createdBy: form.getFieldValue("createdBy"),
      emailType: form.getFieldValue("emailType"),
      status: form.getFieldValue("status"),
      referenceType: form.getFieldValue("referenceType"),
      referenceId: entityId,
    };


    if (operation === "NEW") {
      const response = await postEmailList(payload, component);
      if (response) {
        form.resetFields();
      }
    } else if (operation === "EDIT") {
      if (editData) {
        const response = await updateEmailList(
          editData.id!,
          payload,
          component
        );

        if (response) {
          form.resetFields();
        }
      }
    }

    onClose();
  };

  const handleSendToChange = (value: string[]) => {
    form.setFieldsValue({ sendTo: value });
  };

  const handleCarbonCopyChange = (value: string[]) => {
    form.setFieldsValue({ carbonCopy: value });
  };

  const handleBlindCarbonCopyChange = (value: string[]) => {
    form.setFieldsValue({ blindCarbonCopy: value });
  };
  const getEmailListDetails = async () => {
    const response = await getEmailRecipient();
    if (response) {
      setOptions(response);
    }
  };
  return (
    <>
      <Form form={form} layout="vertical">
        <Form.Item
          label="Send To"
          name="sendTo"
          rules={[{ required: true, message: FormInputErrorMessages.REQUIRED }]}
        >
          <EmailRecipientSelector
            onChange={handleSendToChange}
            options={options}
            value={form.getFieldValue("sendTo")}
          />
        </Form.Item>

        <Form.Item
          label="Carbon Copy"
          name="carbonCopy"
          rules={[{ required: true, message: FormInputErrorMessages.REQUIRED }]}
        >
          <EmailRecipientSelector
            onChange={handleCarbonCopyChange}
            options={options}
            value={form.getFieldValue("carbonCopy")}
            mode="multiple"
          />
        </Form.Item>

        <Form.Item
          label="Blind Carbon Copy"
          name="blindCarbonCopy"
          rules={[{ required: true, message: FormInputErrorMessages.REQUIRED }]}
        >
          <EmailRecipientSelector
            onChange={handleBlindCarbonCopyChange}
            options={options}
            value={form.getFieldValue("blindCarbonCopy")}
            mode="multiple"
          />
        </Form.Item>


        <Form.Item
          label="Subject"
          name="subject"
          rules={[{ required: true, message: FormInputErrorMessages.REQUIRED }]}
        >
          <Input.TextArea showCount maxLength={100} rows={2} placeholder="Subject" />
        </Form.Item>

        <Form.Item
          label="Email Body"
          name="emailBody"
          rules={[{ required: true, message: FormInputErrorMessages.REQUIRED }]}
        >
          <ReactQuill theme="snow" placeholder="Email Body" />
        </Form.Item>

        <Form.Item
          label="Email type"
          name="emailType"
          rules={[{ required: true, message: FormInputErrorMessages.REQUIRED }]}
        >
          <Select placeholder="Select Type" onChange={onEmailTypeChange}>
            <Option value="SEND">SEND</Option>
            <Option value="DRAFT">DRAFT</Option>
            <Option value="SCHEDULED">SCHEDULED</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Send Date"
          name="sendDate"
          rules={
            emailType == "SCHEDULED"
              ? [
                  {
                    required: true,
                    message: FormInputErrorMessages.REQUIRED,
                  },
                ]
              : []
          }
        >
          <DatePicker
            showTime
            format="YYYY-MM-DD hh:mm A"
            style={{ width: "100%" }}
            placeholder="Select Send Date & type"
            disabled={emailType !== "SCHEDULED"}
            disabledDate={(current) => dayjs(current).isBefore(dayjs(), "day")}
          />
        </Form.Item>
      </Form>

      <div className="bss-ui-drawer-footer text-align-right">
        <Button
          type="primary"
          onClick={onCallCreate}
          className="primary-btn ml-2"
          disabled={isCreateOrUpdateDisabled}
        >
          {operation === "NEW" ? "Create Email" : "Update Email"}
        </Button>
      </div>
    </>
  );
};

export default EmailCreateEdit;