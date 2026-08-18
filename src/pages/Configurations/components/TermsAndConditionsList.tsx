import React, { useEffect, useState } from "react";
import { Drawer, Input, Button, Space, Switch } from "antd";
import "./TermsAndConditionsList.scss";
import { BSS_SquareButton } from "bss-component-library";
import { Pagination } from "antd";


import {
  getAllTerms,
  getTermById,
  createTerm,
  updateTerm,
  deleteTerm,
} from "../services/TermsAndConditionsService";
import { TermsAndConditionsModel } from "../models/TermsAndConditionsModel";
import showNotification from "../../../services/notification.service";

const TermsAndConditionsPage: React.FC = () => {
  const [terms, setTerms] = useState<TermsAndConditionsModel[]>([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [newTerms, setNewTerms] = useState<string[]>([""]);
  const [editingTermId, setEditingTermId] = useState<string | null>(null);
  const [enabledToggleLoading, setEnabledToggleLoading] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; 


  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    try {
      const data = await getAllTerms();
      setTerms(Array.isArray(data) ? [...data] : []);
    } catch (err) {
      console.error(err);
      setTerms([]);
    }
  };
  const handleToggleEnabled = async (term: TermsAndConditionsModel, enabled: boolean) => {
    setEnabledToggleLoading(term.id);
    try {
      await updateTerm(term.id, {
        termsAndCondition: term.termsAndCondition,
        enabled,
      });
      console.log("Toggle Success");
      setTerms((prev) =>
        prev.map((t) => (t.id === term.id ? { ...t, enabled } : t))
      );
    } catch (err) {
      console.error(err);
      console.log("Toggle Failed");
    } finally {
      setEnabledToggleLoading(null);
    }
  };


  // 
  const handleDrawerSubmit = async () => {
  const MIN_LENGTH = 10;
  const MAX_LENGTH = 1000;
  const specialCharRegex = /^[a-zA-Z0-9 .,;:()\-?!:"';\n]+$/;

  const trimmedTerms = newTerms.map(term => term.trim()).filter(term => term);

  // Field-level validations
  for (let i = 0; i < trimmedTerms.length; i++) {
    const term = trimmedTerms[i];
    if (!term) {
      showNotification("ERROR", `Term ${i + 1} cannot be empty.`);
      return;
    }
     if (term.length < MIN_LENGTH || term.length > MAX_LENGTH) {
    showNotification("ERROR", `Term ${i + 1} must be between ${MIN_LENGTH} and ${MAX_LENGTH} characters.`);
    return;
  }
    
    if (!specialCharRegex.test(term)) {
      showNotification("ERROR", `Term ${i + 1} contains invalid characters. Only letters, numbers, spaces, and basic punctuation (. , ; : ( ) - ? ! : " ') are allowed.`);
      return;
    }
  }


    try {
      if (editingTermId) {
        await updateTerm(editingTermId, { termsAndCondition: trimmedTerms[0],
          enabled: terms.find(t => t.id === editingTermId)?.enabled ?? true,
        });
        showNotification("SUCCESS", "Terms and Conditions Successfully Updated!");
      } else {
        for (const term of trimmedTerms) {
          await createTerm({ termsAndCondition: term, enabled: true });
        }
        showNotification("SUCCESS", "Terms and Conditions Successfully Created!");
      }

      setNewTerms([""]);
      setEditingTermId(null);
      setDrawerVisible(false);
      fetchTerms();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async (termId: string) => {
    try {
      const term = await getTermById(termId);
      setEditingTermId(term.id);
      setNewTerms([term.termsAndCondition]);
      setDrawerVisible(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTerm(id);
      showNotification("SUCCESS", "Terms and conditions successfully deleted.");
      fetchTerms();
    } catch (err) {
      console.error(err);
    }
  };
const startIndex = (currentPage - 1) * pageSize;
const endIndex = startIndex + pageSize;
const visibleTerms = terms.slice(startIndex, endIndex);

  return (
    <div className="terms-container">
      <div className="terms-card">
        <div className="terms-header">
          <p className="title">Terms & Conditions</p>
          <Button type="primary" onClick={() => setDrawerVisible(true)}>
            Add new Terms
          </Button>
        </div>

        <p className="description">
          Manage the terms and conditions shown on customer quotes. You can add,
          edit, or remove conditions based on different scenarios.
        </p>

        <div className="terms-list">
          {visibleTerms.map((term) => (
            <div className="term-card" key={term.id}>
              <div className="toggle-wrapper">
                <Switch
        checked={!!term.enabled} 
        loading={enabledToggleLoading === term.id} 
        onChange={(checked) => handleToggleEnabled(term, checked)}
      />
              </div>
              <div className="term-text">{term.termsAndCondition}</div>
              <div className="term-actions">
                <BSS_SquareButton
                  type="EDIT"
                  onClick={() => handleEdit(term.id)}
                  className="edit-icon"
                />
                <BSS_SquareButton
                  type="DELETE"
                  onClick={() => handleDelete(term.id)}
                  className="delete-icon"
                />
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" , width: "100%"}}>
  <Pagination
    current={currentPage}
    pageSize={pageSize}
    total={terms.length}
    onChange={(page) => setCurrentPage(page)}
    showSizeChanger={false}
  />
</div>
        <Drawer
          title={editingTermId ? "Edit Term" : "Add New Terms"}
          placement="right"
          width="33%"
          open={drawerVisible}
          onClose={() => {
            setDrawerVisible(false);
            setNewTerms([""]);
            setEditingTermId(null);
          }}
          className="terms-drawer"
          footer={
            <div style={{ textAlign: "right" }}>
              <Space>
                <Button
                  onClick={() => {
                    setDrawerVisible(false);
                    setNewTerms([""]);
                    setEditingTermId(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="primary" onClick={handleDrawerSubmit}>
                  {editingTermId ? "Update" : "Add"}
                </Button>
              </Space>
            </div>
          }
        >
          {newTerms.map((term, index) => (
            <div key={index} style={{ marginBottom: 16 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 4,
                }}
              >
                <div className="term-label">Term {index + 1}</div>
                {newTerms.length > 1 && (
                  <BSS_SquareButton
                    type="DELETE"
                    onClick={() => {
                      const updated = [...newTerms];
                      updated.splice(index, 1);
                      setNewTerms(updated);
                    }}
                    className="delete-icon"
                  />
                )}
              </div>
              <Input.TextArea
                rows={3}
                value={term}
                onChange={(e) => {
                  const updated = [...newTerms];
                  updated[index] = e.target.value;
                  setNewTerms(updated);
                }}
                placeholder={`Enter Term ${index + 1}`}
              />
            </div>
          ))}
          {!editingTermId && (
            <Button
              type="text"
              className="drawer-add-btn"
              onClick={() => setNewTerms([...newTerms, ""])}
            >
              + Add Another Term
            </Button>
          )}
        </Drawer>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;
