import { Button, Input, Select, Form, DatePicker } from "antd";
import { FC, useEffect, useState } from "react";
import { TaskModel } from "../../models/TaskModel.ts";
import dayjs from "dayjs";
import { createTask, updateTask } from "../../services/task.services.ts";
import { getAllSystemUsersList } from "../../../../../../../services/common-meta-data.service.ts";
import TextArea from "antd/es/input/TextArea";
import { FormInputErrorMessages } from "../../../../../../../constants/form-input-error-messages.ts";
import { EnterpriseCrmComponent } from "../../../../../../../constants/EnterpriseCrmComponent.const.ts";
import DropdownValue from "../../../../common-models/DropdownValue.ts";

const { Option } = Select;

interface TaskFormProps {
  operationType: "NEW" | "EDIT";
  editTask?: TaskModel;
  onClose: () => void;
  entityId?: string;
  component: EnterpriseCrmComponent;
}

const TaskForm: FC<TaskFormProps> = ({ operationType, editTask, onClose, entityId, component }) => {
  const [form] = Form.useForm();
  const [allUsers, setAllUsers] = useState<DropdownValue[]>([]);
  const [newRows, setNewRows] = useState(10);

  useEffect(() => {
    getAllSystemUsersList().then((response) => setAllUsers(response));
  }, []);

  useEffect(() => {
    if (editTask) {
      form.setFieldsValue({
        subject: editTask.subject,
        description: editTask.description,
        status: editTask.status,
        dueDateTime: dayjs(editTask.dueDateTime, "YYYY-MM-DD hh:mm A"),
        priority: editTask.priority,
        ownerId: editTask.ownerId,
      });
    }
  }, [editTask, form]);

  const onSubmit = async () => {
    await form.validateFields();

    const commonPayload: Partial<TaskModel> = {
      subject: form.getFieldValue("subject"),
      description: form.getFieldValue("description"),
      status: form.getFieldValue("status"),
      dueDateTime: dayjs(form.getFieldValue("dueDateTime")).format("YYYY-MM-DD hh:mm A"),
      priority: form.getFieldValue("priority"),
      ownerId: form.getFieldValue("ownerId"),
    };

    let response;

    if (operationType === "NEW") {
      const payload: TaskModel = {
        ...commonPayload,
        createdDateTime: dayjs().format("YYYY-MM-DD hh:mm A"),
        referenceId: entityId,
      } as TaskModel;

      response = await createTask(payload, component);
    }

    if (operationType === "EDIT" && editTask) {
      const payload: TaskModel = {
        ...commonPayload,
        createdDateTime: editTask.createdDateTime,
        referenceId: editTask.referenceId,
      } as TaskModel;

      response = await updateTask(editTask.id!, payload, component);
    }

    if (response) {
      form.resetFields();
    }

    onClose();
  };

  return (
    <>
      <Form form={form} layout="vertical" className="mt-3">
        <Form.Item label="Subject" name="subject" rules={[{ required: true, message: FormInputErrorMessages.REQUIRED }]}>
          <Input showCount maxLength={100} placeholder="Subject" />
        </Form.Item>

        <Form.Item label="Description" name="description" rules={[{ required: true, message: FormInputErrorMessages.REQUIRED }]}>
          <TextArea
            showCount
            maxLength={1000}
            rows={newRows}
            placeholder="Task Description"
            onChange={(e) => {
              const wordCount = e.target.value.split(/\s+/).filter(Boolean).length;
              const newRows = Math.min(Math.max(Math.ceil(wordCount / 10), 5), 20);
              form.setFieldsValue({ description: e.target.value });
              setNewRows(newRows);
            }}
          />
        </Form.Item>

        <Form.Item label="Status" name="status" rules={[{ required: true, message: FormInputErrorMessages.REQUIRED }]}>
          <Select placeholder="Select Status">
            <Option value="DONE">DONE</Option>
            <Option value="NOT STARTED">NOT STARTED</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Due Date" name="dueDateTime" rules={[{ required: true, message: FormInputErrorMessages.REQUIRED }]}>
          <DatePicker
            showTime
            format="YYYY-MM-DD hh:mm A"
            style={{ width: "100%" }}
            placeholder="Enter Due Date"
            disabledDate={(current) => dayjs(current).isBefore(dayjs(), "day")}
          />
        </Form.Item>

        <Form.Item label="Priority" name="priority" rules={[{ required: true, message: FormInputErrorMessages.REQUIRED }]}>
          <Select placeholder="Select Priority">
            <Option value="URGENT">URGENT</Option>
            <Option value="MEDIUM">MEDIUM</Option>
            <Option value="LOW">LOW</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Task Owner" name="ownerId" rules={[{ required: true, message: FormInputErrorMessages.REQUIRED }]}>
          <Select placeholder="Select Task Owner">
            {allUsers.map((singleUser) => (
              <Option value={singleUser.value} key={singleUser.value}>
                {singleUser.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>

      <div className="bss-ui-drawer-footer text-align-right">
        <Button type="primary" onClick={onSubmit} className="primary-btn ml-2">
          {operationType === "EDIT" ? "Update Task" : "Create Task"}
        </Button>
      </div>
    </>
  );
};

export default TaskForm;