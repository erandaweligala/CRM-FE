import React, { useEffect, useState } from "react";
import { Button, Drawer, Input, Space, Table} from "antd";
import type { ColumnsType } from "antd/es/table";
import { BSS_SquareButton } from "bss-component-library";

import { ServiceType } from "./model/types";
import {
  getAllServiceTypes,
  createServiceType,
  updateServiceType,
  deleteServiceType,
} from "./serviceTypeActions";
import showNotification from "../../services/notification.service";

const initialFormState: Omit<ServiceType, "id"> = {
  serviceType: "",
  licensing: "",
  allowNegativeGp: "",
  approvalGpLevel: "",
  updateBillDetail: "",
  dealRegistrationRequired: "",
};

const ServiceTypes: React.FC = () => {
  const [data, setData] = useState<ServiceType[]>([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [form, setForm] = useState(initialFormState);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchServiceTypes();
  }, []);

  const fetchServiceTypes = async () => {
    try {
      const types = await getAllServiceTypes();
      setData(Array.isArray(types) ? [...types] : []);
    } catch (error) {
      console.error("Failed to fetch service types", error);
      setData([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const ynFields = [
      "licensing",
      "allowNegativeGp",
      "updateBillDetail",
      "dealRegistrationRequired",
    ];

    let updatedValue = value;
    if (ynFields.includes(name)) {
      updatedValue = value.toUpperCase().replace(/[^YN]/g, "");
    }
     if (name === "approvalGpLevel") {
      updatedValue = updatedValue.replace(/\D/g, '');
    }

   setForm((prev) => ({
    ...prev,
    [name]: updatedValue,
  }));
};
  const handleSave = async () => {
    if (!form.serviceType) {
      showNotification("ERROR","Service Type name is required");
      return; 
    }if (!form.licensing) {
      showNotification("ERROR","Licensing is required");
      return;
    } if (!form.allowNegativeGp) {
      showNotification("ERROR","Negative GP is required");
      return;
    }
      if (!form.approvalGpLevel) {
      showNotification("ERROR", "Approval GP Level is required");
      return;
    }if (!form.updateBillDetail) {
      showNotification("ERROR","Update Bill Detail is required");
      return;
    }
    if (!form.dealRegistrationRequired) {
      showNotification("ERROR","Deal Registration is required");
      return;
    }

    try {
      if (editingId) {
        await updateServiceType(editingId, form);
        showNotification("SUCCESS", "Service Type Successfully Updated!");
      } else {
        await createServiceType(form);
        showNotification("SUCCESS", "Service Type Successfully Created!");
      }

      
      setForm(initialFormState);
      setEditingId(null);
      setDrawerVisible(false);
      fetchServiceTypes();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (record: ServiceType) => {
    try {
    setForm({ ...record });
    setEditingId(record.id);
    setDrawerVisible(true);
  } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteServiceType(id);
      showNotification("SUCCESS", "Service Type Successfully Deleted!");
      fetchServiceTypes();
    } catch (error) {
      console.error(error);
    }
  };

  const columns: ColumnsType<ServiceType> = [
    { title: "Service Type", dataIndex: "serviceType", key: "serviceType" },
    { title: "Licensing", dataIndex: "licensing", key: "licensing" },
    { title: "Allow Negative GP", dataIndex: "allowNegativeGp", key: "allowNegativeGp" },
    { title: "Approval GP Level (%)", dataIndex: "approvalGpLevel", key: "approvalGpLevel" },
    { title: "Update Bill Detail", dataIndex: "updateBillDetail", key: "updateBillDetail" },
    { title: "Deal Registration Required", dataIndex: "dealRegistrationRequired", key: "dealRegistrationRequired" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <BSS_SquareButton
            type="EDIT"
            onClick={() => handleEdit(record)}
            isButtonInsideTable
          />
          <BSS_SquareButton
            type="DELETE"
            onClick={() => handleDelete(record.id)}
            isButtonInsideTable
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="terms-container" style={{ padding: "5px" }}>
      <div className="terms-card">
        <div className="terms-header" style={{ display: "flex", justifyContent: "space-between" }}>
          <p className="title">Service Type</p>
          <Button
            type="primary"
            onClick={() => {
              setForm(initialFormState);
              setEditingId(null);
              setDrawerVisible(true);
            }}
          >
            Add New Service Type
          </Button>
        </div>

        <p className="description">
          Add or update service types with settings like licensing, approval levels, and billing options to control how quotes are handled.
        </p>

        <Table
          dataSource={data}
          columns={columns}
          rowKey={(record) => record.id}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20", "50", "100"],
          }}
        />
      </div>

      <Drawer
        title={editingId ? "Edit Service Type" : "Add New Service Type"}
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width="33vw"
        height="100vh"
      >
        <label>Service Type Name</label>
       <Input
          name="serviceType"
          value={form.serviceType}
          onChange={handleInputChange}
          style={{ marginBottom: 16 }}
        />

        <label>Licensing (Y/N)</label>
        <Input
          name="licensing"
          value={form.licensing}
          onChange={handleInputChange}
          maxLength={1}
          style={{ marginBottom: 16 }}
        />
        <label>Allow Negative GP (Y/N)</label>
        <Input
          name="allowNegativeGp"
          value={form.allowNegativeGp}
          onChange={handleInputChange}
          maxLength={1}
          style={{ marginBottom: 16 }}
        />
        <label>Approval GP Level (%)</label>
        <Input
          name="approvalGpLevel"
          type="number"
          value={form.approvalGpLevel}
          onChange={handleInputChange}
          style={{ marginBottom: 16 }}
        />
        <label>Update Bill Detail (Y/N)</label>
        <Input
          name="updateBillDetail"
          value={form.updateBillDetail}
          onChange={handleInputChange}
          maxLength={1}
          style={{ marginBottom: 16 }}
        />
        <label>Deal Registration Required (Y/N)</label>
        <Input
          name="dealRegistrationRequired"
          value={form.dealRegistrationRequired}
          onChange={handleInputChange}
          maxLength={1}
          style={{ marginBottom: 16 }}
        />

        <Button
          type="primary"
          onClick={handleSave}
          style={{ marginTop: "0px" }}
        >
          {editingId ? "Update" : "Create"}
        </Button>
      </Drawer>
    </div>
  );
};

export default ServiceTypes;
