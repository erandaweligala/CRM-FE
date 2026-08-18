import {FC, useEffect, useState} from "react";
import ActionPermission from "../../components/access-control/action-permission/ActionPermission";
import ACTION_PERMISSION from "../../constants/action-permission";

import "./Extension.scss";
import {createNewCrmExtension, getMicroFrontendComponentList} from "../../services/micro-frontend.service";
import MicrofrontentComponentListModel from "../../model/MicrofrontentComponentList.model";
import {ColumnsType} from "antd/es/table";
import {Button, Drawer, Form, Input, Table} from "antd";
import {FormInputErrorMessages} from "../../constants/form-input-error-messages";
import { BSS_Breadcrumb, BSS_SquareButton } from "bss-component-library";


const Extension: FC = () => {

   const [form] = Form.useForm();

   const [allExtensions, setAllExtensions] = useState<MicrofrontentComponentListModel[]>();

   const [drawerData, setDrawerData] = useState<{
      isModelOpen: boolean;
      operation: "VIEW" | "EDIT" | "NEW" | null;
   }>({
      isModelOpen: false,
      operation: null,
   })

   useEffect(() => {
      loadAllExtensions();
   }, []);


   const columns: ColumnsType<MicrofrontentComponentListModel> = [
      {
         title: "ID",
         dataIndex: "id",
         key: "id",
      },
      {
         title: "Display Name",
         dataIndex: "displayName",
         key: "displayName",
      },
      {
         title: "Component Name",
         dataIndex: "componentName",
         key: "componentName",
      }
   ];


   const loadAllExtensions = async () => {
      const mfList = await getMicroFrontendComponentList();
      setAllExtensions(mfList);
   }


   const onCloseCreateExtensionDrawer = () => {
      setDrawerData({
         isModelOpen: false,
         operation: null
      });
   }


   const createNewExtension = () => {
      setDrawerData({
         isModelOpen: true,
         operation: "NEW"
      });
   }


   const onFormSubmit = async (values: any) => {
      await createNewCrmExtension(values.componentName, values.displayName);
      await loadAllExtensions();
      onCloseCreateExtensionDrawer();
   }


   return (
      <div className="extension">
         <BSS_Breadcrumb>
            <BSS_Breadcrumb.Section>CRM</BSS_Breadcrumb.Section>
            <BSS_Breadcrumb.Section>System</BSS_Breadcrumb.Section>
            <BSS_Breadcrumb.Section>Extension</BSS_Breadcrumb.Section>
            <BSS_Breadcrumb.RightContent>
               <ActionPermission action={ACTION_PERMISSION.DISPLAY_CREATE_ROLE}>
                  <BSS_SquareButton onClick={() => createNewExtension()} type="ADD_NEW"/>
               </ActionPermission>
            </BSS_Breadcrumb.RightContent>
         </BSS_Breadcrumb>

         <div className="mt-4 container">
            <Table
               columns={columns}
               dataSource={allExtensions}
               rowKey="id"
            />
         </div>

         <Drawer
            title="Create New Extension"
            closeIcon={    
               <BSS_SquareButton type="CLOSE" className="close-icon"/>
            }
            placement="right"
            onClose={onCloseCreateExtensionDrawer}
            open={drawerData.isModelOpen}
            width={600}
            className="bss-ui-drawer"
         >

            <Form
               form={form}
               layout="vertical"
               onFinish={onFormSubmit}
               className="mt-4"
            >

               <Form.Item
                  name="displayName"
                  label="Display Name"
                  rules={[
                     {required: true, message: FormInputErrorMessages.REQUIRED},
                  ]}
               >
                  <Input/>
               </Form.Item>

               <Form.Item
                  name="componentName"
                  label="Component Name"
                  rules={[
                     {required: true, message: FormInputErrorMessages.REQUIRED},
                  ]}
               >
                  <Input/>
               </Form.Item>

               <div className="bss-ui-drawer-footer text-align-right">
                  <Button type="primary" htmlType="submit">
                     Create New Extension
                  </Button>
               </div>

            </Form>

         </Drawer>

      </div>
   )

}

export default Extension;