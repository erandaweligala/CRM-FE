import { Col, Form, Row, Select } from "antd";
import { FC } from "react";
import { ComponentModel, MenuToComponentModel } from "../../../roles/models/MenuToComponent.model";
const {Option} = Select;



interface SecondarySearchPanelProps {
    menuToComponentList: MenuToComponentModel[];
    componentDropdownList: ComponentModel[];
    handleMenuChange: (menuId: string) => void;
  }

const SecondarySearchPanel : FC<SecondarySearchPanelProps> = ({
    menuToComponentList,
    handleMenuChange,
    componentDropdownList,
  }) => {

    return (
        <>
        <Row gutter={[8, 8]}>
          <Col span={6}>
            <Form.Item className="mr-3" name="menuId" label="Menu" >
              <Select 
                className="w-100"
                placeholder="Menu"
                onChange={handleMenuChange}
              >
                {menuToComponentList && 
                    menuToComponentList.length > 0 &&
                    menuToComponentList.map(
                        (item: MenuToComponentModel) => (
                          <Option value={item.menuId} key={item.menuId}>{item.menuName}</Option>
                        )
                      )
                }
              </Select>
            </Form.Item>
          </Col>
  
          <Col span={6}>
          <Form.Item className="mr-3" name="componentId" label="Component">
              <Select
                className="w-100"
                placeholder="Component"
                disabled={
                  componentDropdownList && componentDropdownList.length > 0
                    ? false
                    : true
                }
              >
                {componentDropdownList &&
                  componentDropdownList.length > 0 &&
                  componentDropdownList.map((item: ComponentModel) => (
                    <Option value={item.componentId} key={item.componentId}>
                      {item.componentName}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
  
        </Row>          
       
      </>
    );
}
export default SecondarySearchPanel;