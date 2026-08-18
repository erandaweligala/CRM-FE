import {FC, useEffect, useState} from "react";
import BssCollapse from "../../../../../components/BSS_Collapse/BSS_Collapse.tsx";
import {Button, Drawer, Empty, Form, Input, Table} from "antd";
import {BSS_SquareButton as BssSquareButton} from "bss-component-library";
import {FormInputErrorMessages} from "../../../../../constants/form-input-error-messages.ts";
import TextArea from "antd/es/input/TextArea";
import SingleNoteView from "./components/NoteView.tsx";
import DigitalBssConfirmModal from "../../../../../components/DigitalBssConfirmModal/index.ts";
import {ColumnsType} from "antd/es/table";
import NotesListResponseBodyModel from "./models/NotesListResponseBody.model.ts";
import {onCell} from "../../../../../helpers/table-on-cell-values.ts";
import CreateNoteRequestBodyModel from "./models/CreateNoteRequestBody.model.ts";
import {createNote, deleteNote, getNotesList, updateNote} from "./services/notes.service.ts";
import {RootState, useAppSelector} from "../../../../../store/main-store.ts";
import {EnterpriseCrmComponent} from "../../../../../constants/EnterpriseCrmComponent.const.ts";

interface NotesProps {
    operation: "VIEW" | "EDIT";
    entityId: string;
    component: EnterpriseCrmComponent;
    setRef: (el: HTMLDivElement | null) => void;
}

const Notes: FC<NotesProps> = ({
                                         operation,
                                         component,
                                         entityId,
                                         setRef
                                     }) => {

    const [isAddNoteDrawerOpen, setIsAddNoteDrawerOpen] = useState<boolean>(false);

    const [createEditForm] = Form.useForm();

    const [itemToDelete, setItemToDelete] = useState<NotesListResponseBodyModel>();
    const [notesList, setNotesList] = useState<NotesListResponseBodyModel[]>([]);
    const user = useAppSelector((state: RootState) => state.auth.decodedToken?.sub) ?? "Unknown User";


    const [drawerData, setDrawerData] = useState<{
        isDrawerOpen: boolean;
        operation: "NEW" | "EDIT" | "VIEW" | "NON";
        data: NotesListResponseBodyModel | null;
    }>({
        isDrawerOpen: false,
        operation: "NON",
        data: null,
    });
    const [newRows, setNewRows] = useState(10);

    useEffect(() => {
        loadNoteList();
    }, []);

    useEffect(() => {
        if (isAddNoteDrawerOpen) {
            setDrawerData({
                isDrawerOpen: true,
                operation: "NEW",
                data: null,
            });
        }
    }, [isAddNoteDrawerOpen]);

    const loadNoteList = async () => {

        const apiResponse = await getNotesList(entityId, component);

        setNotesList(apiResponse);

    };

    const closeDrawer = async (shouldReload: boolean) => {

        createEditForm.resetFields();

        setDrawerData({
            isDrawerOpen: false,
            operation: "NON",
            data: null,
        });

        setIsAddNoteDrawerOpen(false);

        if (shouldReload) {
            loadNoteList();
        }

    };

    const handleDeleteNote = (item: NotesListResponseBodyModel) => {
        setItemToDelete(item);
    };

    const handleConfirmDelete = async () => {
        if (itemToDelete) {
            try {
                await deleteNote(itemToDelete.id, component);
                loadNoteList();
            } catch (error) {
                console.error("Error deleting item:", error);
            }
            setItemToDelete(undefined);
        }
    };

    const handleViewCall = (record: NotesListResponseBodyModel) => {
        setDrawerData({
            isDrawerOpen: true,
            operation: "VIEW",
            data: record,
        });
    };

    const tableColumns: ColumnsType<NotesListResponseBodyModel> = [
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
            onCell: () => onCell("100px"),
            render: (text: string) => <span title={text}>{text}</span>,
        },
        {
            title: "Note",
            dataIndex: "note",
            onCell: () => onCell("100px"),
            render: (text: string) => <span title={text}>{text}</span>,
        },
        {
            title: "Created By",
            dataIndex: "createdBy",
            onCell: () => onCell("50px"),
            render: (text: string) => <span title={text}>{text}</span>,
        },
        {
            title: "Created Date & Time",
            dataIndex: "createdDateTime",
            onCell: () => onCell("50px"),
            render: (text: string) => <span title={text}>{text}</span>,
        },
        {
            title: "Actions",
            dataIndex: "actions",
            key: "action",
            align: "center" as const,
            width: 90,
            render: (_, record: NotesListResponseBodyModel) => (
                <div style={{display: 'flex', justifyContent: 'space-between', gap: '5px'}}>

                    <BssSquareButton
                        onClick={() => handleViewCall(record)}
                        type="VIEW"
                    />

                    {
                        operation === "EDIT" && (
                            <>
                                <BssSquareButton
                                    onClick={async () => {
                                        createEditForm.setFieldsValue({
                                            title: record.title,
                                            note: record.note
                                        })
                                        setDrawerData({
                                            isDrawerOpen: true,
                                            operation: "EDIT",
                                            data: record
                                        })
                                    }}
                                    type="EDIT"
                                />

                                <BssSquareButton
                                    onClick={() => {
                                        handleDeleteNote(record);
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

    const submitNoteForm = async () => {

        const requestBody: CreateNoteRequestBodyModel = {
            referenceId: entityId,
            title: createEditForm.getFieldValue("title"),
            note: createEditForm.getFieldValue("note"),
            createdBy: user,
        }

        if (drawerData.operation === "NEW") {
            await createNote(requestBody, component);
            closeDrawer(true);
        } else if (drawerData.operation === "EDIT") {
            if (drawerData.data) {
                await updateNote(drawerData.data.id, requestBody, component);
                closeDrawer(true);
            } else {
                console.error("No data found for editing note.");
            }        
        }

    }

    return (
        <div ref={(reference) => setRef(reference)}>
            <BssCollapse
                title="Notes"
                defaultExpanded
                extra={
                    operation === "EDIT" && (
                        <Button
                            type="primary"

                            htmlType="submit"
                            size="small"
                            onClick={() => setIsAddNoteDrawerOpen(true)}
                        >
                            Add Note
                        </Button>
                    )
                }
            >
                <>
                    {
                        notesList && notesList.length > 0 ? (
                            
                                <div className="collapsed-content">
                                    <Table
                                        columns={tableColumns}
                                        dataSource={notesList}
                                        rowKey="id"
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
                width={drawerData.operation === "VIEW" ? 830 : 600}
                title={
                    <span className="font-2xl-semi-bold">
                        {drawerData.operation === "NEW" && "Add Note"}
                        {drawerData.operation === "EDIT" && "Update Note"}
                        {drawerData.operation === "VIEW" && "View Note"}
                    </span>
                }
                open={drawerData.isDrawerOpen}
                onClose={() => closeDrawer(false)}
                closeIcon={
                    <BssSquareButton type="CLOSE" className="close-icon"/>
                }
                destroyOnClose={true}
                maskClosable={false}
            >
                {["EDIT", "NEW"].includes(drawerData.operation) && (
                    <Form
                        form={createEditForm}
                        layout="vertical"
                        className="mt-3"
                        onFinish={submitNoteForm}
                    >

                        <Form.Item
                            label="Title"
                            name="title"
                            rules={[{required: true, message: FormInputErrorMessages.REQUIRED}]}
                        >
                            <Input placeholder="Enter Title" showCount maxLength={50}/>
                        </Form.Item>

                        <Form.Item
                            label="Note"
                            name="note"
                            rules={[{required: true, message: FormInputErrorMessages.REQUIRED}]}
                        >
                            <TextArea
                                showCount
                                maxLength={1000}
                                rows={newRows}
                                placeholder="Enter Note"
                                onChange={(e) => {
                                    const wordCount = e.target.value.split(/\s+/).filter(word => word).length;
                                    const newRows = Math.min(Math.max(Math.ceil(wordCount / 10), 5), 20);
                                    createEditForm.setFieldsValue({note: e.target.value});
                                    setNewRows(newRows);
                                }}
                            />
                        </Form.Item>

                    </Form>
                )}

                <div className="bss-ui-drawer-footer text-align-right">
                    {["EDIT", "NEW"].includes(drawerData.operation) && (
                        <Button
                            type="primary"
                            onClick={createEditForm.submit}
                            className="primary-btn ml-2"
                        >
                            {drawerData.operation === "NEW" && "Add Note"}
                            {drawerData.operation === "EDIT" && "Update Note"}
                        </Button>
                    )}
                </div>

                {drawerData.operation === "VIEW" && drawerData.data && (
                    <SingleNoteView
                        clickedItem={drawerData.data}
                    />
                )
                }

            </Drawer>

            <DigitalBssConfirmModal
                title="Confirm Delete"
                isOpen={!!itemToDelete}
                onOk={handleConfirmDelete}
                onCancel={() => setItemToDelete(undefined)}
                btnDanger
            >
                Are you sure you want to delete this Note?
            </DigitalBssConfirmModal>

        </div>
    )
}

export default Notes;