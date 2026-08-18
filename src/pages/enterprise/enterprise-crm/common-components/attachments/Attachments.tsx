import { EnterpriseCrmComponent } from "../../../../../constants/EnterpriseCrmComponent.const.ts";
import { FC, useEffect, useState } from "react";
import {
  Button,
  Drawer,
  Empty,
  Form,
  message,
  Select,
  Table,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import BssCollapse from "../../../../../components/BSS_Collapse/BSS_Collapse.tsx";
import { BSS_SquareButton as BssSquareButton } from "bss-component-library";
import { FormInputErrorMessages } from "../../../../../constants/form-input-error-messages.ts";
import TextArea from "antd/es/input/TextArea";
import DigitalBssText from "../../../../../components/DigitalBssText/DigitalBssText.tsx";
import DigitalBssConfirmModal from "../../../../../components/DigitalBssConfirmModal/index.ts";
import AttachmentsListResponseBodyModel from "./models/AttachmentsListResponseBody.model.ts";
import { RootState, useAppSelector } from "../../../../../store/main-store.ts";
import AttachmentsListRequestBodyModel from "./models/AttachmentsListRequestBody.model.ts";
import {
  createAttachment,
  deleteAttachment,
  downloadAttachment,
  getAttachmentList,
  BRCopyUpload
} from "./services/attachments.service.ts";
import { ColumnsType, TablePaginationConfig } from "antd/es/table";
import convertBase64ToFile from "../../../../../helpers/convertBase64ToFile.ts";
import notificationService from "../../../../../services/notification.service.tsx";
import CreateAttachmentRequestBody from "./models/CreateAttachmentRequestBody.ts";
import UploadArrow from "../../../../../assets/images/arrow.svg?react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { saveAs } from "file-saver";
import { Popover, Input, Typography } from 'antd';
import BRCopyUploadRequestBody from "./models/BRCopyUploadRequestBody.ts";
import ActionPermission from "../../../../../components/access-control/action-permission/ActionPermission";
import ACTION_PERMISSION from "../../../../../constants/action-permission.ts";
import { updateAccount } from "../../accounts-page/services/Account.services.ts"
import showNotification from "../../../../../services/notification.service.tsx";
import AccessTokenModel from "../../../../../model/AccessToken.Model.ts";
import jwt_decode from "jwt-decode";

interface CustomFileContent {
  name: string;
  content: string;
  lastModified: number;
  size: number;
  type: string;
  arrayBuffer: () => Promise<ArrayBuffer>;
  slice: () => Blob;
  stream: () => ReadableStream<Uint8Array>;
  text: () => Promise<string>;
  bytes?: () => Promise<Uint8Array>;
}

interface AttachmentsProps {
  operation: "VIEW" | "EDIT";
  entityId: string;
  component: EnterpriseCrmComponent;
  setRef: (el: HTMLDivElement | null) => void;
  onSubmitSuccess?: () => void;
}

const { Dragger } = Upload;

const Attachments: FC<AttachmentsProps> = ({
  entityId,
  component,
  operation,
  setRef,
  onSubmitSuccess,
}) => {
  const [isCreateAttachmentDrawerOpen, setIsCreateAttachmentDrawerOpen] = useState<boolean>(false);
  const [uploadAttachmentForm] = Form.useForm();
  const [filesContent, setFilesContent] = useState<CustomFileContent[]>([]);
  const [itemToDelete, setItemToDelete] = useState<AttachmentsListResponseBodyModel>();
  const [attachmentList, setAttachmentList] = useState<{
    totalRecord: number;
    currentPage: number;
    limit: number;
    attachmentList: AttachmentsListResponseBodyModel[] | null;
  }>({
    totalRecord: 0,
    currentPage: 1,
    limit: 10,
    attachmentList: null,
  });
  const user = useAppSelector((state: RootState) => state.auth.decodedToken?.sub);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [drawerData, setDrawerData] = useState<{
    isDrawerOpen: boolean;
    operation: "NEW" | "NON";
    data: AttachmentsListResponseBodyModel | null;
  }>({
    isDrawerOpen: false,
    operation: "NON",
    data: null,
  });
  const [newRows, setNewRows] = useState(10);

  const raw = localStorage.getItem("user-data") ?? "";
  let userId: string ;

  try {
    const decoded = jwt_decode<AccessTokenModel>(raw);
    userId = decoded.userId;      
  } catch {
    console.warn("No valid token found");
  }

  useEffect(() => {
    if (isCreateAttachmentDrawerOpen) {
      setDrawerData({ isDrawerOpen: true, operation: "NEW", data: null });
    }
  }, [isCreateAttachmentDrawerOpen]);
    //RELATED TO EDIT ATTACHMENT
    const [inputValue, setInputValue] = useState('');
    const [visiblePopovers, setVisiblePopovers] = useState<Record<string, boolean>>({});

    const handleVisibleChange = (rowId: string, newVisible: boolean) => {
        setVisiblePopovers((prev) => ({
            ...prev,
            [rowId]: newVisible,
        }));
    };

    const handleRejectButtonClick = async (rowId: string) => {
        try {

            const requestBody = [
                { inputId: "54", value: "brcRejected" },
            ];

            // Call the updateAccount API
            const response = await updateAccount(entityId, requestBody);

            if (response === "SUCCESS") {
                onSubmitSuccess?.();
                showNotification("SUCCESS", "Attachment Rejected Successfully")
            }
        } catch (error) {
            console.error("Error rejecting account:", error);
            showNotification("ERROR", "Failed to Reject the Attachment")
        } finally {
            setVisiblePopovers((prev) => ({ ...prev, [rowId]: false }));
        }
    };

    const handleApproveButtonClick = async (
        rowId: string
    ) => {
        try {
            const selectedAttachment = attachmentList.attachmentList?.find(
              (attachment) => attachment.id === rowId
            );

            if (!selectedAttachment) {
                console.error("Attachment not found for the given rowId:", rowId);
            return;
            }

            const getDownloadResponse = await downloadAttachment(rowId, component);

            // request body
            const requestBody: BRCopyUploadRequestBody = {
                referenceId: entityId,
                description: selectedAttachment.description,
                fileName: selectedAttachment.fileName,
                createdBy: selectedAttachment.createdBy,
                content: getDownloadResponse.content.split(',').pop() ?? "",
                documentType: selectedAttachment.documentType,
                type: selectedAttachment.fileName.split('.').pop() ?? "",

            };

            // Call BR Copy upload API
            const response = await BRCopyUpload(requestBody, component);
            if (response === "SUCCESS") {
                await deleteAttachment(selectedAttachment.id, component);
                loadAttachmentList(0, 1, attachmentList.limit);
            }

            // Close the popover
            setVisiblePopovers((prev) => ({ ...prev, [rowId]: false }));

            console.log("Attachment Approved Successfully");
        } catch (error) {
            console.error("Error Approving Attachment:", error);
        }
    };

    const popoverContent = (rowId: string) => (
        <div style={{ maxWidth: 300 }}>
            <Typography.Title level={5}>
                Reason <Typography.Text type="danger">*</Typography.Text>
            </Typography.Title>
            <Form>
                <Form.Item
                    name="reason"
                    rules={[
                        {
                            required: true,
                            message: "Reason is required"
                        }
                    ]}
                >
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        style={{
                            width: "152px",
                            height: "62px",
                            background: "#FFFFFF",
                            border: "1px solid #00000026",
                            borderRadius: "4px",
                            opacity: 1,
                        }}
                    />
                </Form.Item>
            </Form>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                    onClick={() => handleRejectButtonClick(rowId)}
                    style={{
                        width: "72px",
                        height: "24px",
                        background: "#1457940D",
                        border: "1px solid #14579480",
                        opacity: 1,
                    }}
                >
                    Reject
                </Button>
                <Button
                    onClick={() => handleApproveButtonClick(rowId)}
                    style={{
                        width: "72px",
                        height: "24px",
                        background: "#005999",
                        borderRadius: "4px",
                        opacity: 1,
                        color: "#FFFFFF",
                        border: "none",
                    }}
                >
                    Approve
                </Button>
            </div>
        </div>
    );

    const ComponentActionMapping = {
        [EnterpriseCrmComponent.ACCOUNTS]: ACTION_PERMISSION.DISPLAY_EDIT_ATTACHMENT_ACCOUNT,
        [EnterpriseCrmComponent.CONTACTS]: ACTION_PERMISSION.DISPLAY_EDIT_ATTACHMENT_CONTACT,
        [EnterpriseCrmComponent.LEADS]: ACTION_PERMISSION.DISPLAY_EDIT_ATTACHMENT_LEAD,
        [EnterpriseCrmComponent.DEALS]: ACTION_PERMISSION.DISPLAY_EDIT_ATTACHMENT_OPPORTUNITY,
    };

    const action = ComponentActionMapping[component];
    // console.log("component",component);
    // console.log("action",action);


  useEffect(() => {
    loadAttachmentList(0, attachmentList.currentPage, attachmentList.limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAttachmentList = async (offset = 0, currentPage = 1, limit = 10) => {
    const queryParams: AttachmentsListRequestBodyModel = {
      referenceId: entityId,
      limit,
      offset,
    };

    const [attachmentListFromBackend, pageDetails] = await getAttachmentList(queryParams, component);

    setAttachmentList({
      currentPage,
      limit,
      totalRecord: parseInt(pageDetails.totalRecords),
      attachmentList: attachmentListFromBackend,
    });
  };

  const tableChangeHandler = async (pagination: TablePaginationConfig) => {
    const offset =
      attachmentList.limit === pagination.pageSize
        ? (pagination.current ?? 1) * pagination.pageSize - pagination.pageSize
        : 0;
    const limit = pagination.pageSize ?? 10;
    const currentPage = attachmentList.limit === pagination.pageSize ? pagination.current! : 1;
    await loadAttachmentList(offset, currentPage, limit);
  };

  const closeDrawer = async (shouldReload: boolean) => {
    setDrawerData({ isDrawerOpen: false, operation: "NON", data: null });
    setIsCreateAttachmentDrawerOpen(false);

    if (shouldReload) {
      loadAttachmentList(0, attachmentList.currentPage, attachmentList.limit);
    }
  };

  const handleDeleteAttachment = (item: AttachmentsListResponseBodyModel) => {
    setItemToDelete(item);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      try {
        await deleteAttachment(itemToDelete.id, component);
        loadAttachmentList(0, 1, attachmentList.limit);
      } catch (error) {
        console.error("Error deleting item:", error);
      }
      setItemToDelete(undefined);
    }
  };

  // Set to true if want to show edit attachment action
  const shouldRenderEditAttachment = false;

  const tableColumns: ColumnsType<AttachmentsListResponseBodyModel> = [
    { title: "ID", dataIndex: "id", key: "id", ellipsis: true },
    { title: "File Name", dataIndex: "fileName", ellipsis: true },
    { title: "Description", dataIndex: "description", ellipsis: true },
    { title: "Uploaded Date", dataIndex: "createdDate", ellipsis: true },
    { title: "Uploaded By", dataIndex: "createdBy", ellipsis: true },
    { title: "Attachment Type", dataIndex: "documentType", ellipsis: true },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "action",
      align: "center" as const,
      width: 70, //100 IF EDIT ATTACHMENT IS THERE
      render: (_, record: AttachmentsListResponseBodyModel) => (
          <div style={{display: 'flex', justifyContent: 'space-between', gap: '5px'}}>
              {/*ADDED shouldRenderEditAttachment CONDITION AS THIS FLOW IS DONE BY BACKEND*/}
              {shouldRenderEditAttachment && ( record.documentType === "BR copy" && (
                  action ? (
                      <ActionPermission action={action}>
                          <Popover
                              content={popoverContent(record.id)}
                              trigger="click"
                              visible={!!visiblePopovers[record.id]}
                              onVisibleChange={(newVisible) => handleVisibleChange(record.id, newVisible)}
                              placement="bottom"
                          >
                              <BssSquareButton type="EDIT" />
                          </Popover>
                      </ActionPermission>
                  ) : (
                      <Popover
                          content={popoverContent(record.id)}
                          trigger="click"
                          visible={!!visiblePopovers[record.id]}
                          onVisibleChange={(newVisible) => handleVisibleChange(record.id, newVisible)}
                          placement="bottom"
                      >
                          <BssSquareButton type="EDIT" />
                      </Popover>
                  )
              ))}

              <BssSquareButton
                  onClick={async () => {
                      const getAttachmentResponse = await downloadAttachment(record.id, component);
                      const file = convertBase64ToFile(getAttachmentResponse.content, getAttachmentResponse.fileName);
                      saveAs(file);
                  }}
                  type="DOWNLOAD"
              />

              {
                  operation === "EDIT" &&
                  <BssSquareButton
                      onClick={() => {
                          handleDeleteAttachment(record);
                      }}
                      type="DELETE"
                  />
              }

          </div>
      ),
    },
  ];

  const submitUploadAttachmentForm = async () => {
    if (filesContent.length === 0) {
      notificationService("ERROR", "Please select an attachment");
      return;
    }

    // const requestBody: CreateAttachmentRequestBody = {
    //   referenceId: entityId,
    //   description: uploadAttachmentForm.getFieldValue("description"),
    //   fileName: filesContent[0].name,
    //   content: filesContent[0].content,
    //   createdBy: user ?? "",
    //   documentType: uploadAttachmentForm.getFieldValue("documentType"),
    // };

    const documentType = uploadAttachmentForm.getFieldValue("documentType");
    const description  = uploadAttachmentForm.getFieldValue("description");

    const payload: Partial<CreateAttachmentRequestBody> = {
    referenceId: entityId,
    description,
    fileName: filesContent[0].name,
    content: filesContent[0].content,
    createdBy: user ?? "",
    documentType,
  };
     if (documentType === "BR copy") {
    payload.requester = userId;
  }

    //await createAttachment(requestBody, component);
    await createAttachment(payload as CreateAttachmentRequestBody, component);
    uploadAttachmentForm.resetFields();
    setFilesContent([]);
    setDrawerData({ isDrawerOpen: false, operation: "NON", data: null });
    setIsCreateAttachmentDrawerOpen(false);
    setFileUploaded(false);
    await loadAttachmentList(0, 1, attachmentList.limit);

    onSubmitSuccess?.();
  };

  const props: UploadProps = {
    name: "file",
    multiple: false,
    beforeUpload: () => {
      if (fileUploaded) {
        message.warning("Only one file can be uploaded at a time.");
        return Upload.LIST_IGNORE;
      }
      return true;
    },
    customRequest: ({ file, onSuccess, onError }) => {
      try {
        const blobFile = file as Blob;
        const reader = new FileReader();

        reader.readAsDataURL(blobFile);

        reader.onload = async () => {
          try {
            const arrayBuffer = await blobFile.arrayBuffer();
            const newFileContent: CustomFileContent = {
              name: (file as UploadFile).name,
              content: reader.result as string,
              lastModified: (file as UploadFile).lastModified ?? 0,
              size: (file as UploadFile).size ?? 0,
              type: (file as UploadFile).type ?? "",
              arrayBuffer: () => Promise.resolve(arrayBuffer),
              slice: () => new Blob([file]),
              stream: () => new ReadableStream(),
              text: () => Promise.resolve(""),
            };
            if ("bytes" in newFileContent) newFileContent.bytes = async () => new Uint8Array(arrayBuffer);

            setFilesContent([newFileContent]);
            setFileUploaded(true);
            onSuccess && onSuccess("File uploaded successfully");
            message.success(`${(file as UploadFile).name} file uploaded successfully.`);
          } catch (err) {
            message.error("An error occurred while reading the file.");
            onError && onError(err as Error);
          }
        };

        reader.onerror = () => {
          onError && onError(new Error("File upload failed"));
          message.error(`${(file as UploadFile).name} file upload failed.`);
        };
      } catch (error) {
        message.error("An error occurred while uploading");
        onError && onError(error as Error);
      }
    },
    onRemove: () => {
      setFileUploaded(false);
      setFilesContent([]);
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },

  };

  return (
    <div ref={(reference) => setRef(reference)}>

      <BssCollapse
        title="Attachments"
        defaultExpanded
        extra={
          operation === "EDIT" && (
            <Button type="primary" size="small" onClick={() => setIsCreateAttachmentDrawerOpen(true)}>
              Add An Attachment
            </Button>
          )
        }
      >
        {attachmentList.attachmentList && attachmentList.attachmentList.length > 0 ? (
          <div className="collapsed-content">
            <Table
              columns={tableColumns}
              dataSource={attachmentList.attachmentList}
              rowKey="id"
              onChange={tableChangeHandler}
              pagination={{
                total: attachmentList.totalRecord,
                current: attachmentList.currentPage,
                pageSize: attachmentList.limit,
                pageSizeOptions: [10, 25, 50],
                showSizeChanger: true,
              }}
            />
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>
        )}
      </BssCollapse>


      <Drawer
        className="bss-ui-drawer"
        width={600}
        title={<span className="font-2xl-semi-bold">{drawerData.operation === "NEW" && "Upload New Attachment"}</span>}
        open={drawerData.operation === "NEW"}
        onClose={() => {
          closeDrawer(false);
          setFilesContent([]);
          setFileUploaded(false);
          uploadAttachmentForm.resetFields();
        }}
        destroyOnClose
        maskClosable={false}
        closeIcon={<BssSquareButton type="CLOSE" className="close-icon" />}
      >

        <Form form={uploadAttachmentForm} layout="vertical" className="mt-3" onFinish={submitUploadAttachmentForm}>
          <Form.Item
            label="Document Type"
            name="documentType"
            rules={[{ required: true, message: FormInputErrorMessages.REQUIRED }]}
          >
            <Select
              placeholder="Select attachment type"
              options={[
                { value: "BR copy", label: "BR copy" },
                { value: "NIC", label: "NIC" }
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: FormInputErrorMessages.REQUIRED }]}
          >
            <TextArea
              showCount
              maxLength={1000}
              rows={newRows}
              placeholder="Attachment Description"
              onChange={(e) => {
                const wordCount = e.target.value.split(/\s+/).filter(Boolean).length;
                const newRowsCalc = Math.min(Math.max(Math.ceil(wordCount / 10), 5), 20);
                uploadAttachmentForm.setFieldsValue({ description: e.target.value });
                setNewRows(newRowsCalc);
              }}
            />
          </Form.Item>
        </Form>


        <p className="font-md-medium">Select an Attachment</p>
        <Dragger {...props} multiple={false}>
          <UploadArrow style={{ width: 64, height: 64 }} />
          <div style={{ fontSize: "11px" }}>Click or drag file to this area to upload</div>
        </Dragger>
        <DigitalBssText
          size="sm"
          style="regular"
          color="primary"
          customStyles={{ color: "#707070", marginTop: "10px" }}
        >
          Max allowed file size is 2MB. Supported file types: any (PDF, images, documents, spreadsheets, etc.)
        </DigitalBssText>


        <div className="bss-ui-drawer-footer text-align-right">
          <Button type="primary" onClick={uploadAttachmentForm.submit} className="primary-btn ml-2">
            Submit
          </Button>
        </div>
      </Drawer>

      
      <DigitalBssConfirmModal
        title="Confirm Delete"
        isOpen={!!itemToDelete}
        onOk={handleConfirmDelete}
        onCancel={() => setItemToDelete(undefined)}
        btnDanger
      >
        Are you sure you want to delete this attachment?
      </DigitalBssConfirmModal>
    </div>
  );
};

export default Attachments;
