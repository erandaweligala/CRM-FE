import {FC, useState} from "react";
import {Button, Collapse, Drawer, Form, Modal, Select, Skeleton, Table} from 'antd';
import {ColumnsType} from "antd/es/table";
import {ProductsModel} from "../../models/SalesAndServicesModel";
import {useAppDispatch, useAppSelector} from "../../../../store/main-store";
import {collapseCommonProps} from "../../../../configs/common-props/common-props";
import {FormInputErrorMessages} from "../../../../constants/form-input-error-messages";
import {
    addProduct,
    getConnectionProductData,
    productResume,
    productSuspend
} from "../../services/customer-profile.service";
import {customerProfileAction} from "../../../../store/customer-profile.slice";
import {ExclamationCircleFilled} from "@ant-design/icons";
import SalesAndServicesTabExpandedCollapse from "./components/SalesAndServicesTabExpandedCollapse/SalesAndServicesTabExpandedCollapse";

const {Panel} = Collapse;


const PRODUCTS = [
    {id: "PO1000107", name: 'AXIS Hourly Unlimited Facebook Quota 4 hours '},
    {id: "PO1000106", name: 'AXIS Hourly Unlimited Main Quota 8 hours'},
    {id: "PO1000105", name: 'AXIS Hourly Unlimited Main Quota 4 hours'},
]

interface SalesAndServicesProps {
}

const SalesAndServicesTab: FC<SalesAndServicesProps> = () => {

    const dispatch = useAppDispatch();

    const productsFromStore = useAppSelector(state => state.customerProfile.products);
    const selectedNumber = useAppSelector(state => state.customerProfile.selectedMsisdn);

    const [addProductDrawerDetails, setAddProductDrawerDetails] = useState<
        {
            open: boolean;
            productId: string | null;
            productName: string | null;
        }
    >(
        {
            open: false,
            productId: null,
            productName: null,
        }
    );

    const columns: ColumnsType<ProductsModel> = [
        {
            title: 'Subscription Id',
            dataIndex: 'productId',
            key: 'productId',
        },
        {
            title: 'Subscription Name',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: 'Bundle Subscription',
            dataIndex: 'bundleProduct',
            key: 'bundleProduct',
            render: (_, record) => (
                <span>{record.bundleProduct ? 'YES' : 'NO'}</span>
            ),
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
        },
        {
            title: 'Terminate Date',
            dataIndex: 'terminateDate',
            key: 'terminateDate',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Actions',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <>
                    {
                        record.status === "active" &&
                        <Button
                            size="small"
                            onClick={() => {
                                Modal.confirm({
                                    title: 'Do you Want to suspend this subscription?',
                                    icon: <ExclamationCircleFilled/>,
                                    content: record.productId + " - " + record.productName,
                                    onOk: async () => {
                                        try {
                                            await productSuspend(selectedNumber, record.productId, record.productName);
                                            const productsData = await getConnectionProductData(selectedNumber);
                                            dispatch(customerProfileAction.setProducts(productsData));
                                        } catch (error) {
                                            console.error('Error suspending subscription:', error);
                                        }
                                    },
                                    onCancel() {
                                        console.log('Cancel');
                                    },
                                });
                            }}
                        >
                            Suspend
                        </Button>
                    }
                    {
                        record.status === "pause" &&
                        <Button
                            size="small"
                            onClick={() => {
                                Modal.confirm({
                                    title: 'Do you Want to resume this subscription?',
                                    icon: <ExclamationCircleFilled/>,
                                    content: record.productId + " - " + record.productName,
                                    onOk: async () => {
                                        try {
                                            await productResume(selectedNumber, record.productId, record.productName);
                                            const productsData = await getConnectionProductData(selectedNumber);
                                            dispatch(customerProfileAction.setProducts(productsData));
                                        } catch (error) {
                                            console.error('Error resuming subscription:', error);
                                        }
                                    },
                                    onCancel() {
                                        console.log('Cancel');
                                    },
                                });
                            }}
                        >
                            Resume
                        </Button>
                    }
                </>
            ),
        },
    ];
    const renderExpandedRow = (record: ProductsModel) => {
        return <SalesAndServicesTabExpandedCollapse data={record} />;
    };
    return (
        <>
            <div className="text-align-right">
                <Button
                    type="primary"
                    size="small"
                    className="mb-2"
                    onClick={() => {
                        setAddProductDrawerDetails({
                            open: true,
                            productId: null,
                            productName: null,
                        })
                    }}
                >
                    Add Subscription
                </Button>
            </div>
            {
                !productsFromStore &&
                <Skeleton active={true} paragraph={{rows: 10}}/>
            }
            {
                productsFromStore &&
                <Collapse
                    {...collapseCommonProps}
                    defaultActiveKey={['1']}
                    className="digital-bss-basic-collapse"
                >
                    {
                        productsFromStore.map((singleProductOrService) => {
                            return (
                                <Panel
                                    header={singleProductOrService.categoryName}
                                    key={singleProductOrService.categoryName}
                                >
                                    <Table
                                        columns={columns}
                                        dataSource={singleProductOrService.products}
                                        expandable={{
                                            expandedRowRender:renderExpandedRow,
                                            rowExpandable: () => true,
                                        }}
                                        pagination={false}
                                        rowKey={(record) => record.productId}
                                    />
                                </Panel>
                            )
                        })
                    }
                </Collapse>
            }
            <Drawer
                title="Add Subscription"
                placement="right"
                onClose={() => {
                    setAddProductDrawerDetails({
                        open: false,
                        productId: null,
                        productName: null,
                    })
                }}
                open={addProductDrawerDetails.open}
                width={500}
                className="bss-ui-drawer"
                destroyOnClose={true}
            >
                <Form.Item
                    label="Subscription"
                    name="status"
                    rules={[{required: true, message: FormInputErrorMessages.REQUIRED}]}
                    className="mt-4"
                >
                    <Select
                        placeholder="Select Subscription"
                        showSearch
                        onChange={(value) => {
                            const [productId, productName] = value.split("|");
                            setAddProductDrawerDetails({
                                ...addProductDrawerDetails,
                                productId,
                                productName,
                            })
                        }}
                    >
                        {
                            PRODUCTS.map((singleProduct) => (
                                <Select.Option
                                    value={singleProduct.id + "|" + singleProduct.name}
                                    key={singleProduct.id}
                                >
                                    {singleProduct.name}
                                </Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item>

                <div className="bss-ui-drawer-footer text-align-right">
                    <Button
                        type="primary"
                        htmlType="button"
                        className="primary-btn ml-2"
                        disabled={!addProductDrawerDetails.productId}
                        onClick={async () => {
                            await addProduct(selectedNumber, addProductDrawerDetails.productId!, addProductDrawerDetails.productName!);
                            const productsData = await getConnectionProductData(selectedNumber);
                            dispatch(customerProfileAction.setProducts(productsData));
                            setAddProductDrawerDetails({
                                open: false,
                                productId: null,
                                productName: null,
                            });
                        }}
                    >
                        Add Subscription
                    </Button>
                </div>

            </Drawer>
        </>
    )
}

export default SalesAndServicesTab;