import {EnterpriseCrmComponent} from "../../../../../constants/EnterpriseCrmComponent.const.ts";
import {FC, useEffect, useState} from "react";
import {Button, Drawer, Empty, TablePaginationConfig} from "antd";
import BssCollapse from "../../../../../components/BSS_Collapse/BSS_Collapse.tsx";
import Table, {ColumnsType} from "antd/es/table";
import {BSS_SquareButton as BssSquareButton} from "bss-component-library";
import EmailCreateEdit from "./componentts/email-create-&-view/EmailCreate&Edit.tsx";
import SingleEmailView from "./componentts/email-view/SingleEmailView.tsx";
import {EmailModel} from "./models/EmailModel.ts";
import {EmailTableQueryModel} from "./models/EmailTableQueryModel.ts";
import {getEmailList, getSingleEmail} from "./service/Emails.services.ts";
import {onCell} from "../../../../../helpers/table-on-cell-values.ts";

interface EmailsProps {
    operation: "VIEW" | "EDIT";
    entityId: string;
    component: EnterpriseCrmComponent;
    setRef: (el: HTMLDivElement | null) => void;
}

const Emails: FC<EmailsProps> = ({
                                           component,
                                           operation,
                                           entityId,
                                           setRef
                                       }) => {

    const [isAddEmailDrawerOpen, setIsAddEmailDrawerOpen] = useState<boolean>(false);

    const [emailData, setEmailData] = useState<{
        totalRecord: number;
        currentPage: number;
        limit: number;
        emailList: EmailModel[] | null;
    }>({
        totalRecord: 0,
        currentPage: 1,
        limit: 10,
        emailList: null,
    });


    const [drawerData, setDrawerData] = useState<{
        isDrawerOpen: boolean;
        operation: "NEW" | "VIEW" | "EDIT" | null;
        data: EmailModel | null;
    }>({
        isDrawerOpen: false,
        operation: null,
        data: null,
    });


    useEffect(() => {
        getEmailDetails(0, emailData.currentPage, emailData.limit);
    }, []);


    useEffect(() => {
        if (isAddEmailDrawerOpen) {
            setDrawerData({
                isDrawerOpen: true,
                operation: "NEW",
                data: null,
            });
        }
    }, [isAddEmailDrawerOpen]);

    const getEmailDetails = async (
        offset?: number,
        currentPage?: number,
        limit?: number
    ) => {


        const queryParams: EmailTableQueryModel = {
            referenceId: entityId,
            limit: limit!,
            offset: offset!,
        };


        const [taskDataR, pageDetails] = await getEmailList(queryParams, component);

        setEmailData({
            currentPage: currentPage!,
            limit: limit!,
            totalRecord: parseInt(pageDetails.totalRecords),
            emailList: taskDataR,
        });

    };
    const tableChangeHandler = async (pagination: TablePaginationConfig) => {
        const offset = emailData.limit === pagination.pageSize ? (pagination.current ?? 1) * pagination.pageSize - pagination.pageSize : 0;
        const limit = pagination.pageSize;
        const currentPage = emailData.limit === pagination.pageSize ? pagination.current! : 1;
        await getEmailDetails(offset, currentPage, limit);
    };

    const closeDrawer = async () => {

        setDrawerData({
            isDrawerOpen: false,
            operation: null,
            data: null,
        });

        setIsAddEmailDrawerOpen(false);

        getEmailDetails(0, emailData.currentPage, emailData.limit);

    };


    const handleEmail = async (record: EmailModel, type: "VIEW" | "EDIT") => {
        if (record.id && entityId) {
            const queryParams: EmailTableQueryModel = {
                referenceId: entityId ?? null,
                offset: 0,
                limit: 10,
            };

            const responce = await getSingleEmail(record.id, queryParams, component)

            if (type === "VIEW") {
                setDrawerData({
                    isDrawerOpen: true,
                    operation: "VIEW",
                    data: responce,
                });
            }
            if (type === "EDIT") {
                setDrawerData({
                    isDrawerOpen: true,
                    operation: "EDIT",
                    data: responce,
                });
            }
        }

    };


    const columns: ColumnsType<EmailModel> = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            onCell: () =>onCell("50px"),
            render: (text: string) => <span title={text}>{text}</span>,
        },
        {
            title: "Subject",
            dataIndex: "subject",
            onCell: () =>onCell("100px"),
            render: (text: string) => <span title={text}>{text}</span>,
        },
        {
            title: "Send To",
            dataIndex: "sendTo",
            onCell: () =>onCell("100px"),
            render: (text: string) => <span title={text}>{text}</span>,
        },
        {
            title: "Send Date",
            dataIndex: "sendDate",
            onCell: () =>onCell("50px"),
            render: (text: string) => <span title={text}>{text}</span>,
        },
        {
            title: "Status",
            dataIndex: "status",
            onCell: () =>onCell("50px"),
            render: (text: string) => <span title={text}>{text}</span>,
        },
        {
            title: "Created By",
            dataIndex: "createdBy",
            onCell: () =>onCell("50px"),
            render: (text: string) => <span title={text}>{text}</span>,
        },
        {
            title: "Actions",
            dataIndex: "actions",
            key: "action",
            align: "center" as const,
            width: 70,
            render: (_, record: EmailModel) => (
                <div style={{display: 'flex', justifyContent: 'space-between', gap: '5px'}}>
                    <BssSquareButton
                        onClick={() => handleEmail(record, "VIEW")}
                        type="VIEW"
                    />

                    {
                        operation === "EDIT" && (

                            <BssSquareButton
                                onClick={() => handleEmail(record, "EDIT")}
                                type="EDIT"
                            />

                        )
                    }

                </div>
            ),
        },
    ];

    return (
        <div ref={(reference) => setRef(reference)}>
            <BssCollapse
                title="Email"
                defaultExpanded
                extra={
                    operation === "EDIT" && (
                        <Button
                            type="primary"

                            htmlType="submit"
                            size="small"
                            onClick={() => setIsAddEmailDrawerOpen(true)}
                        >
                            Send Email
                        </Button>
                    )
                }
            >

                <>
                    {
                        emailData.emailList && emailData.emailList.length > 0 ? (
                                    <Table
                                        columns={columns}
                                        dataSource={emailData.emailList}
                                        rowKey="id"
                                        onChange={tableChangeHandler}
                                        pagination={{
                                            total: emailData.totalRecord,
                                            current: emailData.currentPage,
                                            pageSize: emailData.limit,
                                            pageSizeOptions: [10, 25, 50],
                                            showSizeChanger: true,
                                        }}
                                    />
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
                width={900}
                title={
                    <span className="font-2xl-semi-bold">
                    {drawerData.operation === "NEW" && "Create a New Email"}
                        {drawerData.operation === "VIEW" && "View Email"}
                        {drawerData.operation === "EDIT" && "Edit Email"}
                </span>
                }
                open={drawerData.operation === "NEW" || drawerData.operation === "VIEW" || drawerData.operation === "EDIT"}
                onClose={closeDrawer}
                closeIcon={
                    <BssSquareButton type="CLOSE" className="close-icon"/>
                }
                destroyOnClose={true}
            >
                <>
                    {drawerData.operation === "NEW" && (
                        <EmailCreateEdit
                            onClose={closeDrawer}
                            entityId={entityId}
                            component={component}
                            operation="NEW"
                        />
                    )}

                    {
                        drawerData.operation === "VIEW" && drawerData.data && (
                            <SingleEmailView
                                clickedItem={drawerData.data}
                            />
                        )
                    }

                    {drawerData.operation === "EDIT" && drawerData.data && (
                        <EmailCreateEdit
                            onClose={closeDrawer}
                            component={component}
                            entityId={entityId}
                            operation="EDIT"
                            editData={drawerData.data}
                        />
                    )}
                </>

            </Drawer>
        </div>
    )

}

export default Emails;