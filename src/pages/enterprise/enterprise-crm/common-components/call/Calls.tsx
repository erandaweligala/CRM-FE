import {EnterpriseCrmComponent} from "../../../../../constants/EnterpriseCrmComponent.const.ts";
import {FC, useEffect, useState} from "react";
import {Button, Drawer, Empty, Table} from "antd";
import BssCollapse from "../../../../../components/BSS_Collapse/BSS_Collapse.tsx";
import {BSS_SquareButton as BssSquareButton} from "bss-component-library";
import CallCreate from "./components/call-create-&-edit/CallCreate&Edit.tsx";
import SingleCallView from "./components/call-view/SingleCallView.tsx";
import DigitalBssConfirmModal from "../../../../../components/DigitalBssConfirmModal/index.ts";
import {CallModel} from "./model/CallModel.ts";
import {CallTableQueryModel} from "./model/CallTableQueryModels.ts";
import {deleteCallList, getCallList} from "./services/call.services.ts";
import {ColumnsType, TablePaginationConfig} from "antd/es/table";
import {onCell} from "../../../../../helpers/table-on-cell-values.ts";

interface CallsProps {
    operation: "VIEW" | "EDIT";
    entityId: string;
    component: EnterpriseCrmComponent;
    setRef: (el: HTMLDivElement | null) => void;
}

const Calls: FC<CallsProps> = ({
                                         operation,
                                         component,
                                         entityId,
                                         setRef
                                     }) => {

    const [isCreateCallDrawerOpen, setIsCreateCallDrawerOpen] = useState<boolean>(false);

    const [itemToDelete, setItemToDelete] = useState<CallModel | null>(null);
    const [callData, setcallData] = useState<{
        totalRecord: number;
        currentPage: number;
        limit: number;
        callList: CallModel[] | null;
    }>({
        totalRecord: 0,
        currentPage: 1,
        limit: 10,
        callList: null,
    });


    const [drawerData, setDrawerData] = useState<{
        isDrawerOpen: boolean;
        operation: "NEW" | "VIEW" | "EDIT" | null;
        data: CallModel | null;
    }>({
        isDrawerOpen: false,
        operation: null,
        data: null,
    });


    useEffect(() => {
        getcallDetails(0, callData.currentPage, callData.limit);
    }, []);


    useEffect(() => {
        if (isCreateCallDrawerOpen) {
            setDrawerData({
                isDrawerOpen: true,
                operation: "NEW",
                data: null,
            });
        }
    }, [isCreateCallDrawerOpen])


    const getcallDetails = async (
        offset?: number,
        currentPage?: number,
        limit?: number
    ) => {
        const queryParams: CallTableQueryModel = {
            referenceId: entityId,
            limit: limit!,
            offset: offset!,
        };


        const [callDataResponse, pageDetails] = await getCallList(queryParams, component);

        setcallData({
            currentPage: currentPage!,
            limit: limit!,
            totalRecord: parseInt(pageDetails.totalRecords),
            callList: callDataResponse,
        });

    };

    const tableChangeHandler = async (pagination: TablePaginationConfig) => {
        const offset = callData.limit === pagination.pageSize ? (pagination.current ?? 1) * pagination.pageSize - pagination.pageSize : 0;
        const limit = pagination.pageSize;
        const currentPage = callData.limit === pagination.pageSize ? pagination.current! : 1;
        await getcallDetails(offset, currentPage, limit);
    };

    const closeDrawer = () => {
        setDrawerData({
            isDrawerOpen: false,
            operation: null,
            data: null,
        });

        setIsCreateCallDrawerOpen(false);

        getcallDetails(callData.currentPage - 1, callData.currentPage, callData.limit);
    };


    const handleViewcall = (record: CallModel) => {
        setDrawerData({
            isDrawerOpen: true,
            operation: "VIEW",
            data: record,
        });
    };


    const columns: ColumnsType<CallModel> = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            onCell: () => onCell("10px"),
            render: (text: string) => <span title={text}>{text}</span>,
        },
        {
            title: "Call Type",
            dataIndex: "callType",
            onCell: () => onCell("50px"),
            render: (text: string) => <span title={text}>{text}</span>,
        },
        {
            title: "Call Medium",
            dataIndex: "callMedium",
            onCell: () => onCell("50px"),
            render: (text: string) => <span title={text}>{text}</span>,
        },
        {
            title: "Status",
            dataIndex: "status",
            onCell: () => onCell("50px"),
            render: (text: string) => <span title={text}>{text}</span>,
        },
        {
            title: "Start Date Time",
            dataIndex: "startDateTime",
            onCell: () => onCell("50px"),
            render: (text: string) => <span title={text}>{text}</span>,
        },
        {
            title: "Purpose",
            dataIndex: "purpose",
            onCell: () => onCell("100px"),
            render: (text: string) => <span title={text}>{text}</span>,
        },
        {
            title: "Actions",
            dataIndex: "actions",
            key: "action",
            align: "center" as const,
            width: 90,
            render: (_, record: CallModel) => (
                <div style={{display: 'flex', justifyContent: 'space-between', gap: '5px'}}>
                    <BssSquareButton
                        onClick={() => handleViewcall(record)}
                        type="VIEW"
                    />

                    {
                        operation === "EDIT" && (
                            <>
                                <BssSquareButton
                                    onClick={() => handleEdit(record)}
                                    type="EDIT"
                                />

                                <BssSquareButton
                                    onClick={() => {
                                        handleDelete(record);
                                    }}
                                    type="DELETE"
                                />
                            </>
                        )
                    }
                </div>
            ),
        },
    ];


    const handleEdit = (e: CallModel) => {
        setDrawerData({
            isDrawerOpen: true,
            operation: "EDIT",
            data: e,
        });
    };


    const handleDelete = (item: CallModel) => {
        setItemToDelete(item);
    };

    const handleConfirmDelete = async () => {
        if (itemToDelete) {
            try {
                const response = await deleteCallList(itemToDelete.id!, component);
                if (response) {
                    await getcallDetails(0, callData.currentPage, callData.limit);
                }
            } catch (error) {
                console.error("Error deleting item:", error);
            }
            setItemToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setItemToDelete(null);
    };

    return (
        <div ref={(reference) => setRef(reference)}>
            <BssCollapse
                title="Calls"
                defaultExpanded
                extra={
                    operation === "EDIT" && (
                        <Button
                            type="primary"

                            htmlType="submit"
                            size="small"
                            onClick={() => setIsCreateCallDrawerOpen(true)}
                        >
                            Create Call
                        </Button>
                    )
                }
            >
                <>
                    {callData.callList && callData.callList.length > 0 ? (
                            <div className="collapsed-content">
                                <Table
                                    columns={columns}
                                    dataSource={callData.callList}
                                    rowKey="id"
                                    onChange={tableChangeHandler}
                                    pagination={{
                                        total: callData.totalRecord,
                                        current: callData.currentPage,
                                        pageSize: callData.limit,
                                        pageSizeOptions: [10, 25, 50],
                                        showSizeChanger: true,
                                    }}
                                />
                            </div>
                    ) : (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "200px",
                            }}
                        >
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
                        </div>
                    )}
                </>
            </BssCollapse>

            <Drawer
                className="bss-ui-drawer"
                width={600}
                title={
                    <span className="font-2xl-semi-bold">
            {drawerData.operation === "NEW" && "Create Call"}
                        {drawerData.operation === "VIEW" && "View Call"}
                        {drawerData.operation === "EDIT" && "Update Call"}
          </span>
                }
                open={drawerData.operation === "NEW" || drawerData.operation === "VIEW" || drawerData.operation === "EDIT"}
                onClose={closeDrawer}
                destroyOnClose={true}
                closeIcon={
                    <BssSquareButton type="CLOSE" className="close-icon"/>
                }
            >

                <>
                    {drawerData.operation === "NEW" && (
                        <CallCreate
                            onClose={closeDrawer}
                            entityId={entityId}
                            component={component}
                            operation="NEW"
                        />
                    )}

                    {drawerData.operation === "VIEW" && drawerData.data && (
                        <SingleCallView
                            clickedItem={drawerData.data}
                        />
                    )
                    }

                    {drawerData.operation === "EDIT" && drawerData.data && (
                        <CallCreate
                            onClose={closeDrawer}
                            component={component}
                            entityId={entityId}
                            operation="EDIT"
                            editData={drawerData.data}
                        />
                    )}

                </>
            </Drawer>

            <DigitalBssConfirmModal
                title="Confirm Delete"
                isOpen={!!itemToDelete}
                onOk={handleConfirmDelete}
                onCancel={handleCancelDelete}
                btnDanger
            >
                Are you sure you want to delete this call?
            </DigitalBssConfirmModal>

        </div>
    )

}

export default Calls;