import { Col, Row, Descriptions, Empty } from "antd";
import OutStandingIcon from "./../../../customer-profile/images/outstanding_icon.svg?react";
import DueDataIcon from "./../../../customer-profile/images/duedate_icon.svg?react";
import UsersIcon from "./../../../customer-profile/images/users_icon.svg?react";
import { BillingInfo } from "../pr-information/Models/PrOverview.Model";
import { FC } from "react";
import DigitalBssCardType from "../../../../../../components/DigitalBssCardType/DigitalBssCardType_Temp";
const billingData: BillingInfo[] = [
  {
    creditScore: "20000",
    outstanding: "1982.0",
    subscription: {
      count: "3",
      status: "Active",
    },
    dueDate: "2024-12-05",
    paymentRelationship: {
      name: "Account Global Tech Corporation",
      paymentStatus: "Pending",
      paymentTerm: "Monthly",
    },
    billCycle: "15",
    billMonth: "November 2024",
    paymentRelationshipNumber: "6747fcbd00376d571b738a4b",
    billingAddress: "Suite 1200, 500 5th Avenue, New York, USA, 10001",
  },
  {
    creditScore: "10000",
    outstanding: "790.0",
    subscription: {
      count: "2",
      status: "Active",
    },
    dueDate: "2024-12-05",
    paymentRelationship: {
      name: "Corporate account Inc.",
      paymentStatus: "Pending",
      paymentTerm: "Monthly",
    },
    billCycle: "15",
    billMonth: "November 2024",
    paymentRelationshipNumber: "6748028400376d571b738a4c",
    billingAddress: "Suite 1201, 500 5th Avenue, New York, USA, 10001",
  },
];

interface PrOverviewProps {
  selectedPaymentResponsibility: string;
}

const PrOverview: FC<PrOverviewProps> = ({ selectedPaymentResponsibility }) => {
  const selectedBillingInfo = billingData.find(
    (item) => item.paymentRelationshipNumber === selectedPaymentResponsibility
  );
  console.log("selectedPaymentResponsibility",selectedPaymentResponsibility);
  console.log("selectedBillingInfo",selectedBillingInfo?.paymentRelationshipNumber);
  if (!selectedBillingInfo) {
    return <div
    style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "200px",
    }}
>
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
</div>;
  }

  return (
    <Col span={24} className="pl-3">
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <DigitalBssCardType
            icon={<OutStandingIcon />}
            text="Outstanding"
            count={`$ ${selectedBillingInfo.outstanding}`}
            backgroundColor="#0090BC"
          />
        </Col>
        <Col span={8}>
          <DigitalBssCardType
            icon={<DueDataIcon />}
            text="Due Date"
            count={selectedBillingInfo.dueDate}
            backgroundColor="#E85E5E"
          />
        </Col>
        <Col span={8}>
          <DigitalBssCardType
            icon={<UsersIcon />}
            text="Subscriptions"
            count={selectedBillingInfo.subscription.count}
            backgroundColor="#17BA98"
          />
        </Col>
      </Row>

      <Descriptions
        bordered
        labelStyle={{ width: 250 }}
        column={1}
        className="mt-3"
        title="Billing Information"
      >
        <Descriptions.Item label="Credit Score">
          {selectedBillingInfo.creditScore}
        </Descriptions.Item>
        <Descriptions.Item label="Outstanding">
          ${selectedBillingInfo.outstanding}
        </Descriptions.Item>
        <Descriptions.Item label="Subscription Count">
          {selectedBillingInfo.subscription.count}
        </Descriptions.Item>
        <Descriptions.Item label="Subscription Status">
          {selectedBillingInfo.subscription.status}
        </Descriptions.Item>
        <Descriptions.Item label="Due Date">
          {selectedBillingInfo.dueDate}
        </Descriptions.Item>
        <Descriptions.Item label="Payment Relationship Name">
          {selectedBillingInfo.paymentRelationship.name}
        </Descriptions.Item>
        <Descriptions.Item label="Payment Status">
          {selectedBillingInfo.paymentRelationship.paymentStatus}
        </Descriptions.Item>
        <Descriptions.Item label="Payment Term">
          {selectedBillingInfo.paymentRelationship.paymentTerm}
        </Descriptions.Item>
        <Descriptions.Item label="Bill Cycle">
          {selectedBillingInfo.billCycle}
        </Descriptions.Item>
        <Descriptions.Item label="Bill Month">
          {selectedBillingInfo.billMonth}
        </Descriptions.Item>
        <Descriptions.Item label="Payment Relationship Number">
          {selectedBillingInfo.paymentRelationshipNumber}
        </Descriptions.Item>
        <Descriptions.Item label="Billing Address">
          {selectedBillingInfo.billingAddress}
        </Descriptions.Item>
      </Descriptions>
    </Col>
  );
};

export default PrOverview;