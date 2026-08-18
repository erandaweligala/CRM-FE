import { FC, useEffect, useState } from "react"
import PageNoData from "../../components/page-no-data/PageNoData";
import { Button, Drawer,Table } from "antd";
import {TablePaginationConfig} from "antd/lib/table/interface";
import { ColumnsType } from "antd/es/table";
import { PermissionsTableModel } from "./models/PermissionsTableModel";
import { PermissionsQueryModel } from "./models/PermissionsQueryModel";
import { getPermissionsData } from "./services/Permissions.services";
import EditPermissions from "./components/edit-permissions/EditPermissions";
import { getMenuToComponentData } from "../roles/services/Role.services";
import { ComponentModel, MenuToComponentModel } from "../roles/models/MenuToComponent.model";
import CreatePermissions from "./components/create-permissions/CreatePermission";
import SecondarySearchPanel from "./components/secondary-search-panel/SecondarySearchPanel";
import ActionPermission from "../../components/access-control/action-permission/ActionPermission";
import ACTION_PERMISSION from "../../constants/action-permission";
import ViewPermissions from "./components/view-permissions/ViewPermissions";
import { BSS_Breadcrumb as BssBreadcrumb, BSS_SearchPanel as BssSearchPanel, BSS_SquareButton as BssSquareButton, InputType } from "bss-component-library";

interface PermissionProps {
}

const SearchPanelInputs: InputType[] = [
    {
        type: "INPUT",
        valueName: "permissionName",
        label: "Permission Name",
        required: false,
        mainInput: true,
        placeholder: "Permission Name"
    }
]

const Permissions:FC<PermissionProps>  = () => {

    const [permissionsData,setPermissionsData] =  useState<{
        totalRecord: number;
        currentPage: number;
        limit: number;
        permissionsList: PermissionsTableModel[] | null
    }>({
        currentPage: 1,
        limit: 10,
        totalRecord: 0,
        permissionsList: null
    })
    const [drawerData, setDrawerData] = useState<{
        isModelOpen: boolean;
        operation: "VIEW" | "EDIT" | "NEW" | null;
        permissionId: string | null;
    }>({
        isModelOpen: false,
        operation: null,
        permissionId: null
    })

    const [formValues,setFormValues] = useState<PermissionsQueryModel>();

    const [menuToComponentList,setMenuToComponentList]= useState<MenuToComponentModel[]>();
    const [isEditable,setIsEditable] = useState<boolean>(false);
    const [componentDropdownList,setComponentDropdownList] = useState<ComponentModel[]>()


    useEffect(()=>{
        getMenuToComponentList();
        getPermissionsDetails(formValues, 0, permissionsData.currentPage, permissionsData.limit);
    },[])


    const basicSubmitSummarySearchForm = async (formValues: any) => { 
        setFormValues(formValues);
        await getPermissionsDetails(formValues,0,permissionsData.currentPage,permissionsData.limit);
     }


    const getPermissionsDetails = async (formValues?: PermissionsQueryModel,offset?:number,currentPage?:number,limit?:number) => {

        const queryParams : PermissionsQueryModel ={
            limit: limit!,
            offset: offset!, 
            permissionName: formValues?.permissionName?.length! > 0 ? formValues?.permissionName : undefined ,
            menuId: formValues?.menuId,
            componentId: formValues?.componentId,
            sortOrder: "ASC"
        }

        const [PermissionsDataR, pageDetails] = await getPermissionsData(queryParams);
      
        setPermissionsData({
            currentPage: currentPage!,
            limit: limit!,
            totalRecord: parseInt(pageDetails.totalRecords),
            permissionsList: PermissionsDataR
        })
    }

    const tableChangeHandler = async (pagination: TablePaginationConfig) => {
      const offset = permissionsData.limit === pagination.pageSize ? (pagination.current ?? 1) * pagination.pageSize - pagination.pageSize : 0;
      const limit = pagination.pageSize;
      const currentPage = permissionsData.limit === pagination.pageSize ? pagination.current! : 1;
      await getPermissionsDetails(formValues,offset, currentPage, limit);
  };

    const onCloseDrawer = async () => {
        setIsEditable(false);

        setDrawerData({
            isModelOpen: false,
            operation: null,
            permissionId: null
        })

       await getPermissionsDetails(formValues,((permissionsData.currentPage-1)*permissionsData.limit),permissionsData.currentPage,permissionsData.limit);
    };


    const onClear=async ()=>{
        setIsEditable(false);

        setDrawerData({
            isModelOpen: false,
            operation: null,
            permissionId: null
        })

        const initialValues:PermissionsQueryModel={
            permissionName: undefined,
            menuId: undefined,
            componentId:  undefined,
            sortOrder: "ASC",
            offset:0,
            limit:permissionsData.limit
        }

        setFormValues(initialValues);

        await getPermissionsDetails(initialValues,0,1,permissionsData.limit);
    }


    const handelEdit = (permissionId: string) => {
        setIsEditable(true);

        setDrawerData({
            isModelOpen: true,
            operation: "EDIT",
            permissionId: permissionId
        })
    }


    const handelView = (permissionId: string) => {
        setDrawerData({
            isModelOpen: true,
            operation: "VIEW",
            permissionId: permissionId
        })
    }


    const handelNew = () => {
        setDrawerData({
            isModelOpen: true,
            operation: "NEW",
            permissionId: null
        })
    }


    const columns: ColumnsType<PermissionsTableModel> = [
      {
        title: "Permission ID",
        dataIndex: "permissionId",
        key: "permissionId",
        align: "center",
        render: (item) => {
          return (
            <span style={{ display: "flex", justifyContent: "center" }}>
              {item}
            </span>
          );
        },
      },
      {
        title: "Permission Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
      },
      {
        title: "Menu Name",
        dataIndex: "menuName",
        key: "menuName",
      },
      {
        title: "Component Name",
        dataIndex: "componentName",
        key: "componentName",
      },
      {
        title: "Action",
        key: "action",
        render: (item: PermissionsTableModel) => {
          return (
            <div className={"content-center-vertical"}>
              <ActionPermission
                action={ACTION_PERMISSION.DISPLAY_FULL_PERMISSION_DETAILS}
              >
                <BssSquareButton
                  onClick={() => handelView(item.permissionId)}
                  type="VIEW"
                  className="mr-1"
                />
              </ActionPermission>

              <ActionPermission
                action={ACTION_PERMISSION.DISPLAY_EDIT_PERMISSION}
              >
                <BssSquareButton
                  onClick={() => handelEdit(item.permissionId)}
                  type="EDIT"
                  className="mr-1"
                />
              </ActionPermission>
            </div>
          );
        },
      },
    ];


      const getMenuToComponentList = async () =>{

        const response =await getMenuToComponentData();

        setMenuToComponentList(response)

    }

 
    const handleMenuChange = (menuId: string) => {

        if (menuId && menuToComponentList) {

            const menus= menuToComponentList.filter(item => item.menuId === menuId);

            if (menus.length > 0) {
                setComponentDropdownList(menus[0].components)
            }

        }
    };


    return (
      <div className="page">
        <BssBreadcrumb>
          <BssBreadcrumb.Section>CRM</BssBreadcrumb.Section>
          <BssBreadcrumb.Section>System</BssBreadcrumb.Section>
          <BssBreadcrumb.Section>
            Permissions
          </BssBreadcrumb.Section>

          <BssBreadcrumb.RightContent>
            <ActionPermission
              action={ACTION_PERMISSION.DISPLAY_CREATE_PERMISSION}
            >
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

        <ActionPermission action={ACTION_PERMISSION.DISPLAY_PERMISSION_LIST}>
          <div className="page-container">
            <BssSearchPanel
              inputs={SearchPanelInputs}
              title="Search Permissions"
              isExpandBtnVisible={true}
              onSubmit={basicSubmitSummarySearchForm}
              onClear={onClear}
            >
              <SecondarySearchPanel
                componentDropdownList={componentDropdownList ?? []}
                handleMenuChange={handleMenuChange}
                menuToComponentList={menuToComponentList ?? []}
              />
            </BssSearchPanel>

            {permissionsData.permissionsList &&
            permissionsData.permissionsList.length > 0 ? (
                <div className="mt-4">
                  <Table
                    columns={columns}
                    dataSource={permissionsData.permissionsList}
                    rowKey="permissionId"
                    onChange={tableChangeHandler}
                    pagination={{
                      total: permissionsData.totalRecord,
                      current: permissionsData.currentPage,
                      pageSize: permissionsData.limit,
                      pageSizeOptions: [10, 25, 50],
                      showSizeChanger: true,
                    }}
                  />
                </div>
            ) : (
              <PageNoData description="No Data Found" />
            )}
          </div>
        </ActionPermission>

        <Drawer
          title={
            <span className="font-2xl-semi-bold">
              {drawerData.operation === "NEW" && "Create New Permission"}
              {drawerData.operation === "VIEW" && "View Permission"}
              {drawerData.operation === "EDIT" && "Edit Permission"}
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
            {drawerData.operation === "EDIT" && (
              <EditPermissions
                permissionsId={drawerData.permissionId!}
                onClose={onCloseDrawer}
                menuToComponentList={menuToComponentList ?? []}
                isEditable={isEditable}
              />
            )}
            {drawerData.operation === "VIEW" && (
              <ViewPermissions
                permissionsId={drawerData.permissionId!}
                onClose={onCloseDrawer}
                isEditable={isEditable}
              />
            )}

            {drawerData.operation === "NEW" && (
              <CreatePermissions
                onClose={onCloseDrawer}
                menuToComponentList={menuToComponentList ?? []}
              />
            )}
          </>
        </Drawer>
      </div>
    );
}
export default Permissions;