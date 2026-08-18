import { FC, useEffect, useState } from "react";
import { Button, Collapse, Drawer, Empty, message, Radio, Table, Upload, UploadFile, UploadProps } from "antd";
import { collapseCommonProps } from "../../../../../../configs/common-props/common-props";
import { convertToSalesOrder, getQuoteListByParentQuoteId,createSimpleWorkOrder } from "../../services/Deals.services";
import { ColumnsType } from "antd/es/table";
import { onCell } from "../../../../../../helpers/table-on-cell-values";
import QuoteOptionViewDrawer from "./components/QuoteOptionViewDrawer";
import Dragger from "antd/es/upload/Dragger";
import UploadArrow from "../../../../../../assets/images/arrow.svg?react";
import showNotification from "../../../../../../services/notification.service";
import { RootState, useAppSelector } from "../../../../../../store/main-store";
import DigitalBssText from "../../../../../../components/DigitalBssText/DigitalBssText";
import { BSS_SquareButton as BssSquareButton } from "bss-component-library";
import { ConvertToSaleRequestModel, ParentQuoteResponseBody, Quote, QuoteInfoTmf } from "../../../single-opportunity-page/components/quotation-drawer/models/quotes-response-body-model";
import { changeQuoteStatus, updateQuote } from "../../../single-opportunity-page/components/quotation-drawer/services/QuotationDetails.service";
import axiosInstance from "../../../../../../services/axios.service";
import { Modal, DatePicker } from "antd";
interface ConvertToSaleDrawerProps {
    isConvertToSaleDrawerOpen: boolean;
    closeConvertToSaleDrawer: () => void;
    quoteList: Quote[];
    opportunityId: string;
}

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

const ConvertToSaleDrawer: FC<ConvertToSaleDrawerProps> = ({
    isConvertToSaleDrawerOpen,
    closeConvertToSaleDrawer,
    quoteList,
    opportunityId,
}) => {
    const [selectedParentQuote, setSelectedParentQuote] = useState<Quote[]>([]);
    const [selectedQuote, setSelectedQuote] = useState<ParentQuoteResponseBody>();
    const [quoteId, setQuoteId] = useState<string>('');
    const [quoteOptionViewDrawerOpen, setQuoteOptionViewDrawerOpen] = useState<boolean>(false);
    const [selectedQuoteOptionToView, setSelectedQuoteOptionToView] = useState<QuoteInfoTmf | null>(null);
    const [selectedOption, setSelectedOption] = useState<QuoteInfoTmf | null>(null);
    const [filesContent, setFilesContent] = useState<CustomFileContent[]>([]);
    const [fileUploaded, setFileUploaded] = useState<boolean>(false);
    const user = useAppSelector((state: RootState) => state.auth.decodedToken?.sub);
    const [isWorkOrderModalVisible, setIsWorkOrderModalVisible] = useState(false);
    const [workOrderStartDate, setWorkOrderStartDate] = useState<string | null>(null);
    

    useEffect(() => {
        if (isConvertToSaleDrawerOpen) {
            const approvedQuotes = quoteList.filter((singleQuote) => singleQuote.status === "Approved");

            if (approvedQuotes.length === 0) {
                closeConvertToSaleDrawer();
                return;
            }

            setSelectedParentQuote(approvedQuotes);
        }
    }, [isConvertToSaleDrawerOpen, quoteList, closeConvertToSaleDrawer]);

    const getSelectedQuoteFullDetails = async (parentQuoteId: string): Promise<void> => {
        setSelectedQuote(undefined);
        try {
            const apiResponse = await getQuoteListByParentQuoteId(parentQuoteId);
            setQuoteId(parentQuoteId);
            setSelectedQuote(apiResponse);
        } catch (error) {
            showNotification("ERROR", `Failed to fetch quote details: ${error}`);
        }
    };

    const handleSelectOption = (record: QuoteInfoTmf) => {
        setSelectedOption(record);

    if (selectedQuote?.quoteInfo.serviceType?.name === "BusinessBroadbandServiceType") {
    setIsWorkOrderModalVisible(true);
    } else {
    setIsWorkOrderModalVisible(false);
    }
        };

  const handleCreateWorkOrder = async () => {
  if (!workOrderStartDate || !selectedOption) return;

  const quote = quoteList.find((q) => q.id === quoteId);
  const customerName = quote?.primaryContact?.name ?? "Unknown Customer";
  const customerEmail = quote?.primaryContact?.href ?? "unknown@example.com";

  try {
    await createSimpleWorkOrder({
      date: workOrderStartDate,
      quoteId: quoteId,                              
      customerName,
      customerEmail,
    });

    showNotification("SUCCESS", "Work Order created successfully!");
    setIsWorkOrderModalVisible(false);
    setWorkOrderStartDate(null);
  } catch (error) {
    console.error("Work Order creation failed:", error); 
    showNotification("ERROR", "Failed to create Work Order.");
  }
};

    const handleViewCall = (record: QuoteInfoTmf) => {
        setQuoteOptionViewDrawerOpen(true);
        setSelectedQuoteOptionToView(record);
    };

    const resetAndCloseDrawer = () => {
        setSelectedParentQuote([]);
        setSelectedQuote(undefined);
        setSelectedOption(null);
        setFilesContent([]);
        setFileUploaded(false);
        setQuoteId('');
        closeConvertToSaleDrawer();
    };

 const updateQuoteRequest = async (
  quoteId: string,                                   
  partyAccountId: string
) => {
  const payload: ConvertToSaleRequestModel = {
    quoteInfo: { partyAccountId },
  };

  try {
    await updateQuote(quoteId, payload);
    
  } catch (error) {
    console.error("Convert-to-sale failed:", error);
    showNotification("ERROR", "Unable to convert please try again");
  }
};

    // const convertToSale = async () => {
    //     if (!selectedOption) {
    //         showNotification("INFO", "Please select an option to convert to sale order.");
    //         return;
    //     }

    //     if (!quoteId) {
    //         showNotification("ERROR", "Quote ID is missing.");
    //         return;
    //     }
    //     // if (selectedOption.serviceType?.name=== "Fixed Services" && !workOrderStartDate) {
    //     //             showNotification("INFO", "Please create a work order before converting to sale order.");
    //     //             return;
    //     //         }

    //     const file = filesContent[0];
    //     const payload = {
    //         referenceId: opportunityId,
    //         description: `Sales Agreement for Quote ID: ${quoteId}, Option ID: ${selectedOption?.id}, Option Name: ${selectedOption?.name}`,
    //         fileName: file?.name || '',
    //         content: file?.content || '',
    //         createdBy: user,
    //     };

    //     try {
    //         const response = await convertToSalesOrder(opportunityId, quoteId, selectedOption.id, payload);
    //         if (response === "SUCCESSFUL") {
    //             showNotification("SUCCESS", "Converted to sale order successfully.");
    //             resetAndCloseDrawer();
    //         }
    //     } catch (error) {
    //         showNotification("ERROR", `Failed to convert to sale order: ${error}`);
    //     }
    // };


    const convertToSale = async () => {
  
  if (!selectedOption) {
    showNotification("INFO", "Please select an option to convert to sale order.");
    return;
  }
  if (!quoteId) {
    showNotification("ERROR", "Quote ID is missing.");
    return;
  }

  const partyAccountId = "11111";       
  try {
    await updateQuoteRequest(quoteId, partyAccountId);
  } catch {
    
    return;
  }
  const newStatus     = "ACTIVE";
  const currentStatus = selectedOption?.status ?? "APPROVED";
  const statusReason  = "Converted to Sale Order";

  try {
    await changeQuoteStatus(
      quoteId,
      {
        newStatus,
        oldStatus: currentStatus,
        statusReason,
        userName: "admin",                    
      },
      axiosInstance
    );
  } catch (err) {
    showNotification("ERROR", "Failed to change quote status.");
    return;
  }

  const file = filesContent[0] ?? null;
  const attachmentPayload = {
    referenceId: opportunityId,
    description: `Sales Agreement for Quote ID: ${quoteId}, Option ID: ${selectedOption.id}, Option Name: ${selectedOption.name}`,
    fileName: file?.name ?? "",
    content: file?.content ?? "",
    createdBy: user,
  };

  try {
    const res = await convertToSalesOrder(
      opportunityId,
      quoteId,
      selectedOption.id,
      attachmentPayload
    );

    if (res === "SUCCESSFUL") {
      showNotification("SUCCESS", "Converted to sale order successfully.");
      resetAndCloseDrawer();             
    }
  } catch (error) {
    showNotification("ERROR", `Failed to convert to sale order: ${error}`);
  }
};

    const tableDrawerColumns: ColumnsType<QuoteInfoTmf> = [
        {
            title: 'Option ID',
            dataIndex: 'id',
            onCell: () => onCell("50px"),
            ellipsis: true,
            render: (text, record) => (
                <Radio
                    checked={selectedOption?.id === record.id}
                    onClick={() => handleSelectOption(record)}
                >
                    {text}
                </Radio>
            ),
        },
        {
            title: 'Option Name',
            dataIndex: 'name',
            onCell: () => onCell("50px"),
            render: (text: string) => <span title={text}>{text}</span>,
        },
        {
            title: "Actions",
            dataIndex: "actions",
            key: "action",
            align: "center",
            width: 70,
            render: (_, record: QuoteInfoTmf) => (
                <BssSquareButton
                    onClick={() => handleViewCall(record)}
                    type="VIEW"
                />
            ),
        },
    ];
  const uploadProps: UploadProps = {
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
        
                        if ("bytes" in newFileContent) {
                            newFileContent.bytes = async () => new Uint8Array(arrayBuffer);
                        }
        
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
         <>
        <Drawer
            className="bss-ui-drawer"
            width={1200}
            title={
                <div className="drawer-header">
                    <span className="drawer-title font-2xl-semi-bold">
                        Convert To Sale Order
                    </span>
                </div>
            }
            open={isConvertToSaleDrawerOpen}
            onClose={resetAndCloseDrawer}
            closeIcon={<BssSquareButton type="CLOSE" className="close-icon"/>}
            destroyOnClose
            maskClosable={false}
        >
            {selectedParentQuote.length > 0 && (
                <div>
                    <Collapse
                        {...collapseCommonProps}
                        className="digital-bss-basic-collapse"
                        defaultActiveKey={['approvedQuotations']}
                    >
                        <Collapse.Panel header="Approved Quotations" key="approvedQuotations">
                            <Collapse
                                {...collapseCommonProps}
                                className="digital-bss-basic-collapse"
                                defaultActiveKey={[]}
                                accordion
                                onChange={(key) => {
                                    if (key.length > 0) {
                                        getSelectedQuoteFullDetails(key[0]);
                                    }
                                }}
                            >
                                {selectedParentQuote.map((singleQuote) => (
                                    <Collapse.Panel
                                        header={singleQuote.name}
                                        key={singleQuote.id}
                                    >
                                        {Array.isArray(selectedQuote?.quoteInfoTMFList) && selectedQuote.quoteInfoTMFList.length > 0 ? (
                                            <Table
                                                dataSource={selectedQuote.quoteInfoTMFList}
                                                columns={tableDrawerColumns}
                                                pagination={{ pageSize: 10 }}
                                                rowKey="id"
                                            />
                                        ) : (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    height: "100px",
                                                }}
                                            >
                                                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                            </div>
                                        )}
                                    </Collapse.Panel>
                                ))}
                            </Collapse>
                        </Collapse.Panel>
                    </Collapse>
                    <Collapse
                        {...collapseCommonProps}
                        className="digital-bss-basic-collapse"
                        defaultActiveKey={['salesOrderDocuments']}
                    >
                        <Collapse.Panel header="Sales Order Supporting Document" key="salesOrderDocuments">
                            <>
                                <p className="font-md-medium">Select an Attachment</p>
                                <div>
                                    <Dragger {...uploadProps} accept=".csv,.xlsx,.pdf" multiple={false}>
                                        <UploadArrow style={{ width: 64, height: 64 }} />
                                        <div style={{ fontSize: "11px", textAlign: "center" }}>
                                            Click or drag file to this area to upload
                                        </div>
                                    </Dragger>
                                </div>
                                <DigitalBssText
                                    size="sm"
                                    style="regular"
                                    color="primary"
                                    customStyles={{ color: '#707070', marginTop: '10px' }}
                                >
                                    Max Allowed file size is 2MB. Supported File Types: .pdf, .csv, .xlsx
                                </DigitalBssText>
                            </>
                        </Collapse.Panel>
                    </Collapse>
                </div>
            )}
            <div className="bss-ui-drawer-footer text-align-right">
                <Button
                    type="primary"
                    onClick={convertToSale}
                    className="primary-btn ml-2"
                >
                    Convert To Sale Order
                </Button>
            </div>
            <QuoteOptionViewDrawer
                quoteInfo={selectedQuoteOptionToView}
                isOpen={quoteOptionViewDrawerOpen}
                onClose={() => setQuoteOptionViewDrawerOpen(false)}
            />
        </Drawer>

        <Modal
          title="Create Work Order"
          visible={isWorkOrderModalVisible}
          onCancel={() => setIsWorkOrderModalVisible(false)}
          footer={
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '2px' }}>
              <Button key="skip" type="default" onClick={() => {
      setIsWorkOrderModalVisible(false);
      //convertToSale(); 
    }}>
      Skip
    </Button>,
              <Button
                type="primary"
                onClick={handleCreateWorkOrder}
                //disabled={!workOrderStartDate}
              >
                Create New
              </Button>
            </div>
          }
        >
          <p>Please select a start date for the Work Order:</p>
          <DatePicker
            onChange={(_date, dateString) => {
              if (typeof dateString === "string") {
                setWorkOrderStartDate(dateString);
              } else {
                setWorkOrderStartDate(null);
              }
            }}
            style={{ width: "100%" }}
          />
        </Modal>
        </>
    );
};

export default ConvertToSaleDrawer;
