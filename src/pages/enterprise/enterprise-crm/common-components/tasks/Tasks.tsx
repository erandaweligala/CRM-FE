import {EnterpriseCrmComponent} from "../../../../../constants/EnterpriseCrmComponent.const.ts";
import {FC, useEffect, useState} from "react";
import {Button, Drawer, Empty, Table} from "antd";
import BssCollapse from "../../../../../components/BSS_Collapse/BSS_Collapse.tsx";
import {BSS_SquareButton as BssSquareButton} from "bss-component-library";
import SingleTaskView from "./components/task-view/SingleTaskView.tsx";
import DigitalBssConfirmModal from "../../../../../components/DigitalBssConfirmModal/index.ts";
import {TaskModel} from "./models/TaskModel.ts";
import {TaskTableQueryModel} from "./models/TaskTableQueryModel.ts";
import {deleteTask, getTaskList} from "./services/task.services.ts";
import {ColumnsType, TablePaginationConfig} from "antd/es/table";
import {onCell} from "../../../../../helpers/table-on-cell-values.ts";
import { EnterpriseCrmOperationsType } from "../../../../../model/EnterpriseCrmOperations.type.ts";
import TaskForm from "./components/task-form/TaskForm.tsx";

interface TasksProps {
    operation: EnterpriseCrmOperationsType;
    entityId: string;
    component: EnterpriseCrmComponent;
    setRef: (el: HTMLDivElement | null) => void;
}

const Tasks: FC<TasksProps> = ({
                                         operation,
                                         component,
                                         entityId,
                                         setRef
                                     }) => {

    const [isCreateTaskDrawerOpen, setIsCreateTaskDrawerOpen] = useState<boolean>(false);

    const [itemToDelete, setItemToDelete] = useState<TaskModel | null>(null);

    const [taskData, setTaskData] = useState<{
        totalRecord: number;
        currentPage: number;
        limit: number;
        taskList: TaskModel[] | null;
    }>({
        totalRecord: 0,
        currentPage: 1,
        limit: 10,
        taskList: null,
    });

    const [drawerData, setDrawerData] = useState<{
        isDrawerOpen: boolean;
        operation: "NEW" | "VIEW" | "EDIT" | null;
        data: TaskModel | null;
    }>({
        isDrawerOpen: false,
        operation: null,
        data: null,
    });

    useEffect(() => {
        getTaskDetails(0, taskData.currentPage, taskData.limit);
    }, []);

    useEffect(() => {
        if (isCreateTaskDrawerOpen) {
            setDrawerData({
                isDrawerOpen: true,
                operation: "NEW",
                data: null,
            });
        }
    }, [isCreateTaskDrawerOpen]);


    const getTaskDetails = async (
        offset?: number,
        currentPage?: number,
        limit?: number
    ) => {

        const queryParams: TaskTableQueryModel = {
            referenceId: entityId,
            limit: limit!,
            offset: offset!,
        };

        const [taskDataR, pageDetails] = await getTaskList(queryParams, component);

        setTaskData({
            currentPage: currentPage!,
            limit: limit!,
            totalRecord: parseInt(pageDetails.totalRecords),
            taskList: taskDataR,
        });

    };

    const tableChangeHandler = async (pagination: TablePaginationConfig) => {
        const offset = taskData.limit === pagination.pageSize ? (pagination.current ?? 1) * pagination.pageSize - pagination.pageSize : 0;
        const limit = pagination.pageSize;
        const currentPage = taskData.limit === pagination.pageSize ? pagination.current! : 1;
        await getTaskDetails(offset, currentPage, limit);
    };

    const closeDrawer = async () => {

        setDrawerData({
            isDrawerOpen: false,
            operation: null,
            data: null,
        });

        setIsCreateTaskDrawerOpen(false);

        getTaskDetails(0, taskData.currentPage, taskData.limit);

    };


    const handleViewTask = (record: TaskModel) => {
        setDrawerData({
            isDrawerOpen: true,
            operation: "VIEW",
            data: record,
        });
    };


    const columns: ColumnsType<TaskModel> = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            onCell: () => onCell("30px"),
            render: (text: string) => <span title={text}>{text}</span>,
        },
        {
            title: "Date Assigned",
            dataIndex: "createdDateTime",
            onCell: () => onCell("30px"),
            render: (text: string) => <span title={text}>{text}</span>,
        },
        {
            title: "Subject",
            dataIndex: "subject",
            onCell: () => onCell("50px"),
            render: (text: string) => <span title={text}>{text}</span>,
        },
        {
            title: "Due Date",
            dataIndex: "dueDateTime",
            onCell: () => onCell("30px"),
            render: (text: string) => <span title={text}>{text}</span>,
        },
        {
            title: "Task Description",
            dataIndex: "description",
            onCell: () => onCell("100px"),
            render: (text: string) => <span title={text}>{text}</span>,
        },
        {
            title: "Actions",
            dataIndex: "actions",
            key: "action",
            align: "center" as const,
            width: 90,
            render: (_, record: TaskModel) => (
                <div style={{display: 'flex', justifyContent: 'space-between', gap: '5px'}}>
                    <BssSquareButton
                        onClick={() => handleViewTask(record)}
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


    const handleEdit = (e: TaskModel) => {
        setDrawerData({
            isDrawerOpen: true,
            operation: "EDIT",
            data: e,
        });
    };


    const handleDelete = (item: TaskModel) => {
        setItemToDelete(item);
    };


    const handleConfirmDelete = async () => {
        if (itemToDelete) {
            try {
                await deleteTask(itemToDelete.id!, component);
                getTaskDetails(0, 1, taskData.limit);
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
                title="Tasks"
                defaultExpanded
                extra={
                    operation === "EDIT" && (
                        <Button
                            type="primary"

                            htmlType="submit"
                            size="small"
                            onClick={() => setIsCreateTaskDrawerOpen(true)}
                        >
                            Create A Task
                        </Button>
                    )
                }
            >
                <>
                    {
                        taskData.taskList && taskData.taskList.length > 0 ? (
                        
                                <div className="collapsed-content">
                                    <Table
                                        columns={columns}
                                        dataSource={taskData.taskList}
                                        rowKey="id"
                                        onChange={tableChangeHandler}
                                        pagination={{
                                            total: taskData.totalRecord,
                                            current: taskData.currentPage,
                                            pageSize: taskData.limit,
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
                        )
                    }
                </>
            </BssCollapse>

            <Drawer
                className="bss-ui-drawer"
                width={600}
                title={
                    <span className="font-2xl-semi-bold">
                        {drawerData.operation === "NEW" && "Create a New Task"}
                        {drawerData.operation === "VIEW" && "View Task"}
                        {drawerData.operation === "EDIT" && "Edit Task"}
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
                    {
                        drawerData.operation === "NEW" && (
                            <TaskForm
                                operationType="NEW"
                                onClose={closeDrawer}
                                entityId={entityId}
                                component={component}
                            />
                        )
                    }

                    {
                        drawerData.operation === "VIEW" && drawerData.data && (
                            <SingleTaskView
                                clickedItem={drawerData.data}
                            />
                        )
                    }

                    {
                        drawerData.operation === "EDIT" && drawerData.data && (
                            <TaskForm
                                operationType="EDIT"
                                editTask={drawerData.data}
                                onClose={closeDrawer}
                                component={component}
                            />
                        )
                    }
                </>

            </Drawer>

            <DigitalBssConfirmModal
                title="Confirm Delete"
                isOpen={!!itemToDelete}
                onOk={handleConfirmDelete}
                onCancel={handleCancelDelete}
                btnDanger
            >
                Are you sure you want to delete this task?
            </DigitalBssConfirmModal>


        </div>
    )

}

export default Tasks;