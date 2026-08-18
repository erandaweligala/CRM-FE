import { FC } from "react";
import { Collapse, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import OrderLogStep from "../order-log-step/OrderLogStep";
import { collapseCommonProps } from "../../../../../../configs/common-props/common-props";
import { OrdersModel, OrderItem, OrderStatusFlowModel } from "../../../../models/OrdersModel";
import { getOrdersStatusFlowData } from "../../../../services/customer-profile.service";


const { Panel } = Collapse;

interface ExpandedRowRendererProps {
  record: OrdersModel;
  onExpandInner: (expanded: boolean, record: OrderItem, recode: OrdersModel) => void;
  stepsDataList: OrderStatusFlowModel[] | undefined;
  statusFlowDataList: OrderStatusFlowModel[] | undefined;
  setStatusFlowDataList: React.Dispatch<React.SetStateAction<OrderStatusFlowModel[] | undefined>>;
  expandedRows: string[];
  innerTableColumns: ColumnsType<OrderItem>;
}

const ExpandedRowRenderer: FC<ExpandedRowRendererProps> = ({
  record,
  onExpandInner,
  stepsDataList,
  statusFlowDataList,
  setStatusFlowDataList,
  expandedRows,
  innerTableColumns,
}) => {
    const handleOrderStepsFlowData = () => {
        return <OrderLogStep ownSteps={stepsDataList} />;
    }
  return (
    <Collapse
      {...collapseCommonProps}
      accordion
      className="digital-bss-basic-collapse"
      onChange={(key: any) => {
        if (key[0] === "2") {
          getOrdersStatusFlowData(record.orderID)
            .then((response) => setStatusFlowDataList(response))
            .catch((error) => console.log(error));
        }
      }}
    >
      <Panel header="Order Status" key="1">
        <Table
          columns={innerTableColumns}
          dataSource={record.orderItems}
          pagination={false}
          rowKey="orderItemID"
          expandable={{
            expandedRowRender:handleOrderStepsFlowData,
            rowExpandable: (_) => true,
            onExpand: (expanded, item) => onExpandInner(expanded, item, record),
            expandedRowKeys: expandedRows,
          }}
        />
      </Panel>
      <Panel header="Order Steps" key="2">
        <OrderLogStep ownSteps={statusFlowDataList} />
      </Panel>
    </Collapse>
  );
};

export default ExpandedRowRenderer;
