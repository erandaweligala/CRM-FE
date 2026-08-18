import {FC, useEffect, useState} from "react";
import {
   Table,
   Drawer,
   Button
} from "antd";
import {ColumnsType} from "antd/es/table";
import {UserTableModel, UsersQueryModel} from "./models/UsersTable.model";
import {getAllUsersData, getRolesData, getStatusData} from "./services/Users.services";
import PageNoData from "../../components/page-no-data/PageNoData";
import UserDetailsView from "./components/user-details-view/UserDetailsView";
import {TablePaginationConfig} from "antd/lib/table/interface";
import {MetaDataModel} from "./models/MetaData.model";
import ActionPermission from "../../components/access-control/action-permission/ActionPermission";
import ACTION_PERMISSION from "../../constants/action-permission";
import { BSS_Breadcrumb as BssBreadcrumb, BSS_SearchPanel as BssSearchPanel , BSS_SquareButton as BssSquareButton, BSS_StatusTag as BssStatusTag, InputType } from "bss-component-library";
import UserDetailsForm from "./components/user-details-form/UserDetailsForm";
const Users: FC = () => {

   const [userListData, setUserListData] = useState<{
      totalRecord: number;
      currentPage: number;
      limit: number;
      usersList: UserTableModel[] | null
   }>({
      currentPage: 1,
      limit: 10,
      totalRecord: 0,
      usersList: null
   })

   const [drawerData, setDrawerData] = useState<{
      isModelOpen: boolean;
      operation: "VIEW" | "EDIT" | "NEW" | null;
      userId: string | null;
   }>({
      isModelOpen: false,
      operation: null,
      userId: null
   })

   const [roleList, setRoleList] = useState<MetaDataModel[]>()
   const [statusList, setStatusList] = useState<MetaDataModel[]>()
   const [formValues, setFormValues] = useState<UsersQueryModel>();

   useEffect(() => {

      getRolesList();
      getStatusList();

      getUserListDetails(formValues, 0, userListData.currentPage, userListData.limit);

   }, [])

   const onCloseDrawer = async () => {

      setDrawerData({
         isModelOpen: false,
         operation: null,
         userId: null
      })
      await getUserListDetails(formValues, ((userListData.currentPage - 1) * userListData.limit), userListData.currentPage, userListData.limit);
   };

   const handelEdit = (userId: string) => {
      setDrawerData({
         isModelOpen: true,
         operation: "EDIT",
         userId: userId
      })
   }


   const onClear = async () => {
      setDrawerData({
         isModelOpen: false,
         operation: null,
         userId: null
      })

      const initialValues: UsersQueryModel = {
         userName: undefined,
         statusId: undefined,
         roleId: undefined,
         sortOrder: "ASC",
         offset: 0,
         limit: userListData.limit
      }

      setFormValues(initialValues);

      await getUserListDetails(initialValues, 0, 1, userListData.limit);
   }

   const handelView = (userId: string) => {
      setDrawerData({
         isModelOpen: true,
         operation: "VIEW",
         userId: userId
      })
   }

   const handelNew = () => {
      setDrawerData({
         isModelOpen: true,
         operation: "NEW",
         userId: null
      })
   }

   const basicSubmitSummarySearchForm = async (formValues: UsersQueryModel) => {

      setFormValues(formValues);
      await getUserListDetails(formValues, 0, userListData.currentPage, userListData.limit);

   };

   const getUserListDetails = async (formValues?: UsersQueryModel, offset?: number, currentPage?: number, limit?: number) => {
      const queryParams: UsersQueryModel = {
         userName: formValues?.userName,
         roleId: formValues?.roleId,
         statusId: formValues?.statusId,
         sortOrder: "ASC",
         offset: offset!,
         limit: limit!
      };

      const [response, pageDetails] = await getAllUsersData(queryParams);

      setUserListData({
         currentPage: currentPage!,
         limit: limit!,
         totalRecord: parseInt(pageDetails.totalRecords),
         usersList: response
      })
   }
    const tableChangeHandler = async (pagination: TablePaginationConfig) => {
           const offset = userListData.limit === pagination.pageSize ? (pagination.current ?? 1) * pagination.pageSize - pagination.pageSize : 0;
           const limit = pagination.pageSize;
           const currentPage = userListData.limit === pagination.pageSize ? pagination.current! : 1;
           await getUserListDetails(formValues, offset, currentPage, limit);
         };

   const columns: ColumnsType<UserTableModel> = [
      {
         title: "Name",
         dataIndex: "name",
         key: "name",
      },
      {
         title: "Email",
         dataIndex: "email",
         key: "email",
      },
      {
         title: "Role",
         dataIndex: "roleName",
         key: "roleName",
      },
      {
         title: "Status",
         dataIndex: "status",
         key: "status",
         align: 'center',
         render: (value) => {
            if (value === "Active") {

               return <div style={{display: 'flex', justifyContent: 'center'}}><BssStatusTag type="active"/></div>;

            } else if (value === "Inactive") {

               return <div style={{display: 'flex', justifyContent: 'center'}}><BssStatusTag type="inactive"/></div>;

            } else if (value === "Pending") {

               return <div style={{display: 'flex', justifyContent: 'center'}}><BssStatusTag type="pending"/></div>;

            } else if (value === "Blocked") {

               return <div style={{display: 'flex', justifyContent: 'center'}}><BssStatusTag type="blocked"/></div>;

            } else if (value === "Deleted") {

               return <div style={{display: 'flex', justifyContent: 'center'}}><BssStatusTag type="deleted"/></div>;

            } else return null

         },
      },
      {
         title: "Action",
         key: "action",
         render: (item: UserTableModel) => {
            return (
               <>
                  <ActionPermission action={ACTION_PERMISSION.DISPLAY_MORE_USER_DETAILS}>

                     <BssSquareButton onClick={() => handelView(item.userId)} type="VIEW" className="mr-1"/>

                  </ActionPermission>

                  <ActionPermission action={ACTION_PERMISSION.DISPLAY_EDIT_USER}>

                     <BssSquareButton onClick={() => handelEdit(item.userId)} type="EDIT"/>

                  </ActionPermission>
               </>
            )
         }
      }
   ];

   const getRolesList = async () => {

      const response = await getRolesData();

      setRoleList(response);

   }
   const getStatusList = async () => {

      const response = await getStatusData();

      setStatusList(response);

   }

   const SearchPanelInputs: InputType[] = [
      {
         type: "INPUT",
         valueName: "userName",
         label: "Name",
         required: false,
         mainInput: true,
         placeholder: "User Name"
      },
      {
         type: "DROPDOWN",
         valueName: "roleId",
         label: "Role",
         required: false,
         mainInput: true,
         placeholder: "Role",
         values: roleList ?? [],
      },
      {
         type: "DROPDOWN",
         valueName: "statusId",
         label: "Status",
         required: false,
         mainInput: true,
         placeholder: "Status",
         values: statusList ?? []
      }
   ]


   return (
      <div className="page">

         <BssBreadcrumb>
            <BssBreadcrumb.Section>CRM</BssBreadcrumb.Section>
            <BssBreadcrumb.Section>System</BssBreadcrumb.Section>
            <BssBreadcrumb.Section>User Management</BssBreadcrumb.Section>

            <BssBreadcrumb.RightContent>
               <ActionPermission action={ACTION_PERMISSION.DISPLAY_CREATE_USER}>
                  <Button
                     type="primary"
                     onClick={() => handelNew()}
                     htmlType="submit"
                     size="small"
                  >
                     Add New
                  </Button>
               </ActionPermission>
            </BssBreadcrumb.RightContent>
         </BssBreadcrumb>

         <ActionPermission action={ACTION_PERMISSION.DISPLAY_USERS_LIST}>
            <div className="page-container">

               <BssSearchPanel
                  inputs={SearchPanelInputs}
                  title="Search Users"
                  isExpandBtnVisible={false}
                  onSubmit={basicSubmitSummarySearchForm}
                  onClear={onClear}
               />

               {userListData.usersList && userListData.usersList.length > 0 ? (
                     <div className="mt-4">
                        <Table
                           columns={columns}
                           dataSource={userListData.usersList}
                           rowKey="userId"
                           onChange={tableChangeHandler}
                           pagination={{
                              total: (userListData.totalRecord),
                              current: (userListData.currentPage),
                              pageSize: (userListData.limit),
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
                            {drawerData.operation === "VIEW" && "View User"}
                  {drawerData.operation === "EDIT" && "Edit User"}
                  {drawerData.operation === "NEW" && "Create New User"}
                        </span>
            }
         
            placement="right"
            onClose={onCloseDrawer}
            open={drawerData.isModelOpen}
            width={600}
            className="bss-ui-drawer"
            closeIcon={
               <BssSquareButton type="CLOSE" className="close-icon"/>
            }
         >
            <>
               {
                  drawerData.operation === "VIEW" &&
                  <UserDetailsView
                     userId={drawerData.userId!}
                  />
               }
               {
                  drawerData.operation === "EDIT" &&
                  <UserDetailsForm
                     operationType="EDIT"
                     userID={drawerData.userId!}
                     onClose={onCloseDrawer}
                     rolesList={roleList ?? []}
                     statusList={statusList ?? []}
                  />
               }
               {
                  drawerData.operation === "NEW" &&
                  <UserDetailsForm
                     operationType="NEW"
                     onClose={onCloseDrawer}
                     rolesList={roleList ?? []}
                     statusList={statusList ?? []}
                  />
               }
            </>
         </Drawer>

      </div>
   );

};

export default Users;
