import { Select, Button, Tag, Row, Col, Empty } from "antd";
import { useState, useMemo } from "react";
import { DropDownEmailResponseModel } from "../../../models/dropDownData.model";

const { Option } = Select;

interface EmailRecipientSelectorProps {
  onChange: (values: string[]) => void;
  options: DropDownEmailResponseModel[];
  value?: string[];
  mode?: "single" | "multiple";
}

const EmailRecipientSelector: React.FC<EmailRecipientSelectorProps> = ({
  onChange,
  options,
  value = [],
  mode = "single",
}) => {
  const [category, setCategory] = useState<"Users" | "Contact">("Users");
  const [selected, setSelected] = useState<string>();
  
  const filteredOptions = useMemo(() => {
    const type = category === "Users" ? "USER" : "CONTACT";
    return options.filter(opt => opt.recipientType === type);
  }, [category, options]);

  const getLabel = (email: string) => {
    console.log("getLabel called with email:", email);
    const entry = options.find(opt => opt.email === email);
    return entry ? `${entry.name} (${entry.email})` : email;
  };

  const handleAdd = () => {
    if (selected && !value.includes(selected)) {
      onChange([...value, selected]);
      setSelected(undefined);
    }
  };

  const handleRemove = (val: string) => {
    onChange(value.filter(item => item !== val));
  };

  const handleMultiSelectChange = (values: string[]) => {
    onChange(values);
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <Row gutter={8} align="middle" style={{ marginBottom: 16 }}>
        <Col style={{ minWidth: 120 }}>
          <Select
            value={category}
            onChange={val => setCategory(val)}
            style={{ width: "100%" }}
          >
            <Option value="Users">Users</Option>
            <Option value="Contact">Contact</Option>
          </Select>
        </Col>

        <Col flex="1">
          {mode === "multiple" ? (
            <Select
              mode="multiple"
              value={value}
              onChange={handleMultiSelectChange}
              placeholder="Select Recipients"
              style={{ width: "100%", minWidth: 280 }}
              filterOption={(input, option) =>
                typeof option?.children === "string" && (option.children as string).toLowerCase().includes(input.toLowerCase())
              }
            >
              {filteredOptions.map(item => (
                <Option key={item.email} value={item.email}>
                  {item.name} ({item.email})
                </Option>
              ))}
            </Select>
          ) : (
            <Select
              showSearch
              allowClear
              value={selected}
              placeholder="Select Sender"
              style={{ width: "100%", minWidth: 280 }}
              onChange={val => setSelected(val)}
              filterOption={(input, option) =>
                typeof option?.children === "string" && (option.children as string).toLowerCase().includes(input.toLowerCase())
              }
            >
              {filteredOptions.map(item => (
                <Option key={item.email} value={item.email}>
                  {item.name} ({item.email})
                </Option>
              ))}
            </Select>
          )}
        </Col>

        {mode === "single" && (
          <Col style={{ minWidth: 80 }}>
            <Button type="default" onClick={handleAdd} block disabled={!selected}>
              Add
            </Button>
          </Col>
        )}
      </Row>

      {mode === "single" && value.length > 0 ? (
        <div>
          {value.map(email => (
            <Tag
              key={email}
              closable
              onClose={() => handleRemove(email)}
              style={{ marginBottom: 8 }}
            >
              {getLabel(email)}
            </Tag>
          ))}
        </div>
      ) : null}

      {mode === "single" && value.length === 0 && (
        <Empty
          imageStyle={{ height: 60 }}
          description="No Senders Selected. Need Minimum One Sender"
        />
      )}
    </div>
  );
};

export default EmailRecipientSelector;