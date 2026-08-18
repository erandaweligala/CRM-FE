import {FC, useEffect, useState} from "react"
import PageNoData from "../../components/page-no-data/PageNoData";
import {Button, Drawer, Table} from "antd";
import {RoleTableModel} from "./models/RoleTableModel";
import {RoleTableQueryModel} from "./models/RoleTableQueryModel";
import {getPermissionsMetaData, getRolesData} from "./services/Role.services";
import {TablePaginationConfig} from "antd/lib/table/interface";
import {ColumnsType} from "antd/es/table";
import {PermissionsMetaDataModel} from "./models/Permissions.meta-date.model";
import ViewRoles from "./components/view-role/ViewRoles";
import EditRoles from "./components/edit-role/EditRoles";
import CreateRole from "./components/create-role/CreateRole";
import ActionPermission from "../../components/access-control/action-permission/ActionPermission";
import ACTION_PERMISSION from "../../constants/action-permission";
import { BSS_Breadcrumb as BssBreadcrumb, BSS_SearchPanel as BssSearchPanel, BSS_SquareButton as BssSquareButton, InputType } from "bss-component-library";

const SearchPanelInputs: InputType[] = [
   {
      type: "INPUT",
      valueName: "roleName",
      label: "Role Name",
      required: false,
      mainInput: true,
      placeholder: "Role Name"
   }
]


const Roles: FC = () => {

   const [roleData, setRoleData] = useState<{
      totalRecord: number;
      currentPage: number;
      limit: number;
      roleList: RoleTableModel[] | null
   }>({
      currentPage: 1,
      limit: 10,
      totalRecord: 0,
      roleList: null
   })
   const [drawerData, setDrawerData] = useState<{
      isModelOpen: boolean;
      operation: "VIEW" | "EDIT" | "NEW" | null;
      roleId: string | null;
   }>({
      isModelOpen: false,
      operation: null,
      roleId: null
   })

   const [permissionsList, setPermissionsList] = useState<PermissionsMetaDataModel[]>();
   const [formValues, setFormValues] = useState<RoleTableQueryModel>();


   useEffect(() => {

      getPermissionsList();
      getRolesDetails(formValues, 0, roleData.currentPage, roleData.limit);

   }, [])


   const basicSubmitSummarySearchForm = async (formValues: any) => {
      setFormValues(formValues);
      await getRolesDetails(formValues, 0, roleData.currentPage, roleData.limit);
   }


   const getRolesDetails = async (formValues?: RoleTableQueryModel, offset?: number, currentPage?: number, limit?: number) => {

      const queryParams: RoleTableQueryModel = {
         sortOrder: "ASC",
         limit: limit!,
         offset: offset!,
         roleName: formValues?.roleName?.length! > 0 ? formValues?.roleName : undefined
      }

      const [rolesDataR, pageDetails] = await getRolesData(queryParams);

      setRoleData({
         currentPage: currentPage!,
         limit: limit!,
         totalRecord: parseInt(pageDetails.totalRecords),
         roleList: rolesDataR
      })
   }

   const tableChangeHandler = async (pagination: TablePaginationConfig) => {
      const offset = roleData.limit === pagination.pageSize ? (pagination.current ?? 1) * pagination.pageSize - pagination.pageSize : 0;
      const limit = pagination.pageSize;
      const currentPage = roleData.limit === pagination.pageSize ? pagination.current! : 1;
      await getRolesDetails(formValues,offset, currentPage, limit);
  };

   const onCloseDrawer = () => {

      setDrawerData({
         isModelOpen: false,
         operation: null,
         roleId: null
      })


      getRolesDetails(formValues, ((roleData.currentPage - 1) * roleData.limit), roleData.currentPage, roleData.limit);
   };


   const onClear = async () => {

      const initialValues: RoleTableQueryModel = {
         roleId: undefined,
         roleName: undefined,
         searchBy: undefined,
         offset: 0,
         sortOrder: "ASC",
         limit: roleData.limit
      }

      setFormValues(initialValues);

      await getRolesDetails(initialValues, 0, 1, roleData.limit);

   }


   const handelView = (roleId: string) => {
      setDrawerData({
         isModelOpen: true,
         operation: "VIEW",
         roleId: roleId
      })
   }


   const handelEdit = (roleId: string) => {
      setDrawerData({
         isModelOpen: true,
         operation: "EDIT",
         roleId: roleId
      })
   }


   const handelNew = () => {
      setDrawerData({
         isModelOpen: true,
         operation: "NEW",
         roleId: null
      })
   }


   const columns: ColumnsType<RoleTableModel> = [
      {
         title: "Role Id",
         dataIndex: "roleId",
         key: "roleId",
         align: 'center',
         render: (item) => {
            return (
               <span style={{display: 'flex', justifyContent: 'center'}}>{item}</span>
            )
         }
      },
      {
         title: "Role Name",
         dataIndex: "name",
         key: "name",
      },
      {
         title: "Description",
         dataIndex: "description",
         key: "description",
      },
      {
         title: "Action",
         key: "action",
         align: 'center',
         render: (item: RoleTableModel) => {
            return (
               <div style={{display: 'flex', justifyContent: 'center'}}>

                  <ActionPermission action={ACTION_PERMISSION.DISPLAY_FULL_ROLE_DETAILS}>

                     <BssSquareButton onClick={() => handelView(item.roleId)} type="VIEW" className="mr-1"/>

                  </ActionPermission>

                  <ActionPermission action={ACTION_PERMISSION.DISPLAY_EDIT_ROLE}>

                     <BssSquareButton onClick={() => handelEdit(item.roleId)} type="EDIT"/>

                  </ActionPermission>


               </div>
            )
         }
      }
   ];


   const getPermissionsList = async () => {

      const response = await getPermissionsMetaData();

      setPermissionsList(response);

   }


   return (
      <div className="page">

         <BssBreadcrumb>
            <BssBreadcrumb.Section>CRM</BssBreadcrumb.Section>
            <BssBreadcrumb.Section>System</BssBreadcrumb.Section>
            <BssBreadcrumb.Section>Roles</BssBreadcrumb.Section>

            <BssBreadcrumb.RightContent>
               <ActionPermission action={ACTION_PERMISSION.DISPLAY_CREATE_ROLE}>
                  <Button
                            type="primary"
                            onClick={() => handelNew()}
                            size="small"
                            htmlType="submit"
                        >
                            Add New
                        </Button>
               </ActionPermission>
            </BssBreadcrumb.RightContent>
         </BssBreadcrumb>

         <ActionPermission action={ACTION_PERMISSION.DISPLAY_ROLE_LIST}>
            <div className="page-container">

               <BssSearchPanel
                  inputs={SearchPanelInputs}
                  title="Search Roles"
                  isExpandBtnVisible={false}
                  onSubmit={basicSubmitSummarySearchForm}
                  onClear={onClear}
               />

               {
                  roleData.roleList &&
                  roleData.roleList.length > 0 ? (
                        <div className="mt-4">
                           <Table
                              columns={columns}
                              dataSource={roleData.roleList}
                              rowKey="roleId"
                              onChange={tableChangeHandler}
                              pagination={{
                                 total: (roleData.totalRecord),
                                 current: (roleData.currentPage),
                                 pageSize: (roleData.limit),
                                 pageSizeOptions: [10, 25, 50],
                                 showSizeChanger: true
                              }}
                           />
                        </div>
                  ) : (
                     <PageNoData description="No Data Found"/>
                  )}

            </div>
         </ActionPermission>

         <Drawer
            title={
               <span className="font-2xl-semi-bold">
                            {drawerData.operation === "VIEW" && "View Role"}
                  {drawerData.operation === "EDIT" && "Edit Role"}
                  {drawerData.operation === "NEW" && "Create New Role"}
                        </span>
            }
            placement="right"
            onClose={onCloseDrawer}
            open={drawerData.isModelOpen}
            width={800}
            className="bss-ui-drawer"
            closeIcon={
               <BssSquareButton type="CLOSE" className="close-icon"/>
            }
         >
            <>
               {
                  drawerData.operation === "VIEW" &&
                  <ViewRoles
                     roleId={drawerData.roleId!}
                     onClose={onCloseDrawer}
                  />
               }
               {
                  drawerData.operation === "EDIT" &&
                  <EditRoles
                     roleId={drawerData.roleId!}
                     onClose={onCloseDrawer}
                     permissionsList={permissionsList ?? []}
                  />
               }
               {
                  drawerData.operation === "NEW" &&
                  <CreateRole
                     onClose={onCloseDrawer}
                     permissionsDropdownList={permissionsList ?? []}
                  />
               }
            </>
         </Drawer>


      </div>
   )
}
export default Roles;