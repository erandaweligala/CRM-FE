import {
  Col,
  DatePicker,
  DatePickerProps,
  Form,
  Input,
  Row,
  Select,
} from "antd";
import { FC } from "react";
import dayjs from "dayjs";
import { DropdownType } from "bss-component-library";

const { Option } = Select;

interface SecondarySearchPanelProps {
  activitiesList: DropdownType[];
  statusCodeList: DropdownType[];
  fwdRef:any;
}

const SecondarySearchPanel: FC<SecondarySearchPanelProps> = ({
  activitiesList,
  statusCodeList,
  fwdRef
}) => {
  const disabledToDate: DatePickerProps["disabledDate"] = (current) => {

    const fromDate = fwdRef.current?.getCurrentFormValues()?.["fromDate"];
    console.log(fwdRef.current)

    return fromDate !== undefined && current && current < dayjs(fromDate);

  };

  const disabledFromDate: DatePickerProps["disabledDate"] = (current) => {

    const toDate = fwdRef.current?.getCurrentFormValues()?.["toDate"];

    return toDate !== undefined && current && current > dayjs(toDate);

  };



  return (
      <Row gutter={[8, 8]}>
        <Col span={6}>
          <Form.Item className="mr-3" name="fromDate" label="From Date">
            <DatePicker
              className="w-100"
              placeholder="From Date"
              disabledDate={disabledFromDate}
            />
          </Form.Item>
        </Col>

        <Col span={6}>
          <Form.Item className="mr-3" name="toDate" label="To Date">
            <DatePicker
              placeholder="To Date"
              className="w-100"
              disabledDate={disabledToDate}
            />
          </Form.Item>
        </Col>

        <Col span={6}>
          <Form.Item className="mr-3" name="userId" label="User">
            <Input placeholder="User" />
          </Form.Item>
        </Col>

        <Col span={6}>
          <Form.Item className="mr-3" name="activityId" label="Activity">
            <Select className="w-100" placeholder="Activity">
              {activitiesList &&
                activitiesList.length > 0 &&
                activitiesList.map((item: DropdownType) => (
                  <Option value={item.value} key={item.value}>{item.label}</Option>
                ))}
            </Select>
          </Form.Item>
        </Col>

        <Col span={6}>
          <Form.Item className="mr-3" name="statusId" label="Status">
            <Select className="w-100" placeholder="Status">
              {statusCodeList &&
                statusCodeList.length > 0 &&
                statusCodeList.map((item: DropdownType) => (
                  <Option value={item.value} key={item.value}>{item.label}</Option>
                ))}
            </Select>
          </Form.Item>
        </Col>

        <Col span={6}>
          <Form.Item
            className="mr-3"
            name="transactionId"
            label="Transaction ID"
          >
            <Input placeholder="Transaction" />
          </Form.Item>
        </Col>
      </Row>
  );
};
export default SecondarySearchPanel;
