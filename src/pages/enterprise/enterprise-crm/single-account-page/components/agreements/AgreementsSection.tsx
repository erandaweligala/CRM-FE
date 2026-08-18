import { FC, useEffect, useState, useMemo } from "react";
import { Button, Empty, Table, TablePaginationConfig } from "antd";
import { ColumnsType } from "antd/es/table";
import BssCollapse from "../../../../../../components/BSS_Collapse/BSS_Collapse";
import { onCell } from "../../../../../../helpers/table-on-cell-values";
import ReinitiateAgreementDrawer from "./components/ReinitiateAgreementDrawer/ReinitiateAgreementDrawer";
import { getAccountAgreements } from "./service/Agreements.service";
import { Quote } from "./model/agreement-quote-body-model";

interface AgreementsSectionProps {
  accountId: string;
  setRef: (el: HTMLDivElement | null) => void;
}

const AgreementsSection: FC<AgreementsSectionProps> = ({ accountId, setRef }) => {
  const [agreements, setAgreements] = useState<Quote[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [loading, setLoading] = useState<boolean>(false);
  const [reinitiateDrawerOpen, setReinitiateDrawerOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  const fetchAgreements = async (accountId: string, current: number, pageSize: number) => {
    setLoading(true);
    try {
      const offset = (current - 1) * pageSize;
      const { quoteList, total } = await getAccountAgreements(accountId, offset, pageSize);
      setAgreements(quoteList);
      setTotalCount(total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accountId) {
      fetchAgreements(accountId, pagination.current, pagination.pageSize);
    }
  }, [accountId, pagination.current, pagination.pageSize]);

  const columns: ColumnsType<Quote> = useMemo(() => [
    {
      title: "Agreement ID",
      dataIndex: "id",
      key: "id",
      onCell: () => onCell("60px"),
      render: (text) => <span title={text}>{text}</span>,
    },
    {
      title: "Agreement Name",
      dataIndex: "name",
      key: "name",
      onCell: () => onCell("120px"),
      render: (text) => <span title={text}>{text}</span>,
    },
    {
      title: "Contract Start",
      dataIndex: ["contractInfo", "startDate"],
      key: "contractStartDate",
      render: (date: string) => date ? new Date(date).toLocaleDateString() : "-",
    },
    {
      title: "Contract End",
      dataIndex: ["contractInfo", "endDate"],
      key: "contractEndDate",
      render: (date: string) => date ? new Date(date).toLocaleDateString() : "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <span>{status}</span>,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      align: "center",
      width: 150,
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
          <Button
            type="link"
            onClick={() => {
              setSelectedQuote(record);
              setReinitiateDrawerOpen(true);
            }}
          >
            Renew Agreement
          </Button>
        </div>
      ),
    },
  ], []);
  const handleTableChange = (paginationConfig: TablePaginationConfig) => {
    setPagination({
      current: paginationConfig.current ?? 1,
      pageSize: paginationConfig.pageSize ?? 10,
    });
  };

  return (
    <div ref={setRef}>
      <BssCollapse title="Agreements" defaultExpanded>
        {agreements.length > 0 ? (
          <Table
            columns={columns}
            dataSource={agreements}
            rowKey="id"
            loading={loading}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: totalCount,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} items`,
            }}
            onChange={handleTableChange}
          />
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Agreements Found" />
        )}
      </BssCollapse>

      {selectedQuote && (
        <ReinitiateAgreementDrawer
          visible={reinitiateDrawerOpen}
          onClose={() => {
            setSelectedQuote(null);
            setReinitiateDrawerOpen(false);
          }}
          quote={selectedQuote}
          onSuccess={() => fetchAgreements(accountId, pagination.current, pagination.pageSize)}
        />
      )}
    </div>
  );
};

export default AgreementsSection;