import {EnterpriseCrmComponent} from "../../../../../constants/EnterpriseCrmComponent.const.ts";
import {FC, useEffect, useState} from "react";
import {Button, Drawer, Empty, Table} from "antd";
import BssCollapse from "../../../../../components/BSS_Collapse/BSS_Collapse.tsx";
import MeetingListModel from "./models/MeetingList.model.ts";
import MeetingListQueryModel from "./models/MeetingListQuery.model.ts";
import {deleteMeeting, getMeetingList} from "./services/meeting.services.ts";
import {ColumnsType, TablePaginationConfig} from "antd/es/table";
import {onCell} from "../../../../../helpers/table-on-cell-values.ts";
import {BSS_SquareButton as BssSquareButton} from "bss-component-library";
import CreateEditViewMeeting from "./components/create-edit-view-meeting/CreateEditViewMeeting.tsx";
import DigitalBssConfirmModal from "../../../../../components/DigitalBssConfirmModal/index.ts";

interface MeetingProps {
    operation: "VIEW" | "EDIT";
    entityId: string;
    component: EnterpriseCrmComponent;
    setRef: (el: HTMLDivElement | null) => void;
}

const Meeting: FC<MeetingProps> = ({
                                             entityId,
                                             operation,
                                             component,
                                             setRef
                                         }) => {

    const [isCreateMeetingDrawerOpen, setIsCreateMeetingDrawerOpen] = useState<boolean>(false);

    const [itemToDelete, setItemToDelete] = useState<MeetingListModel>();

    const [meetingList, setMeetingList] = useState<{
        totalRecord: number;
        currentPage: number;
        limit: number;
        meetingList: MeetingListModel[] | null;
    }>({
        totalRecord: 0,
        currentPage: 1,
        limit: 10,
        meetingList: null,
    });


    const [drawerData, setDrawerData] = useState<{
        isDrawerOpen: boolean;
        operation: "NEW" | "VIEW" | "EDIT" | "NON";
        data: MeetingListModel | null;
    }>({
        isDrawerOpen: false,
        operation: "NON",
        data: null,
    });

    useEffect(() => {
        loadMeetingList(0, meetingList.currentPage, meetingList.limit);
    }, []);

    useEffect(() => {
        if (isCreateMeetingDrawerOpen) {
            setDrawerData({
                isDrawerOpen: true,
                operation: "NEW",
                data: null,
            });
        }
    }, [isCreateMeetingDrawerOpen]);

    const loadMeetingList = async (
        offset?: number,
        currentPage?: number,
        limit?: number
    ) => {

        const queryParams: MeetingListQueryModel = {
            referenceId: entityId,
            limit: limit!,
            offset: offset!,
        };

        const [meetingListFromBackend, pageDetails] = await getMeetingList(queryParams, component);

        setMeetingList({
            currentPage: currentPage!,
            limit: limit!,
            totalRecord: parseInt(pageDetails.totalRecords),
            meetingList: meetingListFromBackend,
        });

    };
    
    const tableChangeHandler = async (pagination: TablePaginationConfig) => {
        const offset = meetingList.limit === pagination.pageSize ? (pagination.current ?? 1) * pagination.pageSize - pagination.pageSize : 0;
        const limit = pagination.pageSize;
        const currentPage = meetingList.limit === pagination.pageSize ? pagination.current! : 1;
        await loadMeetingList(offset, currentPage, limit);
    };

    const closeDrawer = async (shouldReload: boolean) => {

        setDrawerData({
            isDrawerOpen: false,
            operation: "NON",
            data: null,
        });

        setIsCreateMeetingDrawerOpen(false);

        if (shouldReload) {
            loadMeetingList(0, meetingList.currentPage, meetingList.limit);
        }
    };

    const handleViewMeeting = (record: MeetingListModel) => {
        setDrawerData({
            isDrawerOpen: true,
            operation: "VIEW",
            data: record,
        });
    };

    const handleEditMeeting = (meeting: MeetingListModel) => {
        setDrawerData({
            isDrawerOpen: true,
            operation: "EDIT",
            data: meeting,
        });
    };

    const handleDeleteMeeting = (item: MeetingListModel) => {
        setItemToDelete(item);
    };


    const handleConfirmDelete = async () => {
        if (itemToDelete) {
            try {
                await deleteMeeting(itemToDelete.id, component);
                loadMeetingList(0, 1, meetingList.limit);
            } catch (error) {
                console.error("Error deleting item:", error);
            }
            setItemToDelete(undefined);
        }
    };

    const tableColumns: ColumnsType<MeetingListModel> = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            onCell: () => onCell("50px"),
            render: (text: string) => <span title={text}>{text}</span>,
        },
        {
            title: "Title",
            dataIndex: "title",
            onCell: () => onCell("50px"),
            render: (text: string) => <span title={text}>{text}</span>,
        },
        {
            title: "Location",
            dataIndex: "location",
            onCell: () => onCell("100px"),
            render: (text: string) => <span title={text}>{text}</span>,
        },
        {
            title: "Start Date & Time",
            dataIndex: "fromDateTime",
            onCell: () => onCell("50px"),
            render: (text: string) => <span title={text}>{text}</span>,
        },
        {
            title: "End Date & Time",
            dataIndex: "toDateTime",
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
            title: "Actions",
            dataIndex: "actions",
            key: "action",
            align: "center" as const,
            width: 50,
            render: (_, record: MeetingListModel) => (
                <div style={{display: 'flex', justifyContent: 'space-between', gap: '5px'}}>

                    <BssSquareButton
                        onClick={() => handleViewMeeting(record)}
                        type="VIEW"
                    />

                    {
                        operation === "EDIT" && (
                            <>
                                <BssSquareButton
                                    onClick={() => handleEditMeeting(record)}
                                    type="EDIT"
                                />

                                <BssSquareButton
                                    onClick={() => {
                                        handleDeleteMeeting(record);
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

    return (
        <div ref={(reference) => setRef(reference)}>
            <BssCollapse
                title="Meetings"
                defaultExpanded
                extra={
                    operation === "EDIT" && (
                        <Button
                            type="primary"

                            htmlType="submit"
                            size="small"
                            onClick={() => setIsCreateMeetingDrawerOpen(true)}
                        >
                            Create A Meeting
                        </Button>
                    )
                }
            >
                <>
                    {
                        meetingList.meetingList && meetingList.meetingList.length > 0 ? (
                            
                                <div className="collapsed-content">
                                    <Table
                                        columns={tableColumns}
                                        dataSource={meetingList.meetingList}
                                        rowKey="id"
                                        onChange={tableChangeHandler}
                                        pagination={{
                                            total: meetingList.totalRecord,
                                            current: meetingList.currentPage,
                                            pageSize: meetingList.limit,
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
                        {drawerData.operation === "NEW" && "Create New Meeting"}
                        {drawerData.operation === "VIEW" && "View Meeting"}
                        {drawerData.operation === "EDIT" && "Update Meeting"}
                    </span>
                }
                open={drawerData.operation === "NEW" || drawerData.operation === "VIEW" || drawerData.operation === "EDIT"}
                onClose={() => closeDrawer(false)}
                closeIcon={
                    <BssSquareButton type="CLOSE" className="close-icon"/>
                }
                destroyOnClose={true}
                maskClosable={false}
            >
                <>
                    {
                        drawerData.operation !== "NON" && (
                            <CreateEditViewMeeting
                                operation={drawerData.operation}
                                onClose={closeDrawer}
                                entityId={entityId}
                                component={component}
                                selectedMeeting={drawerData.data ?? undefined}
                            />
                        )
                    }
                </>

            </Drawer>

            <DigitalBssConfirmModal
                title="Confirm Delete"
                isOpen={!!itemToDelete}
                onOk={handleConfirmDelete}
                onCancel={() => setItemToDelete(undefined)}
                btnDanger
            >
                Are you sure you want to delete this Meeting?
            </DigitalBssConfirmModal>

        </div>
    )

}

export default Meeting;