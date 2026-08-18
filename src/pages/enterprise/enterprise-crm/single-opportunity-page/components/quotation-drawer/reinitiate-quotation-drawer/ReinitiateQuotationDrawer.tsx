import { FC, useEffect, useState } from "react";
import { Button, Drawer, Select, Form } from "antd";
import {
    Quote,
    QuotesResponseBodyModel,
} from "../models/quotes-response-body-model.ts";
import { createReinitiateQuotation, getQuotationDetailsList } from "../services/QuotationDetails.service.ts";
import TextArea from "antd/es/input/TextArea";
import { BSS_SquareButton as BssSquareButton} from "bss-component-library";
const { Option } = Select;

interface ReinitiateQuotationDrawerProps {
    openCreateReinitiateQuotationDrawerDrawer: boolean;
    closeCreateReinitiateQuotationDrawerDrawer: () => void;
    reloadQuotations: () => void;
    entityId: string;
}

const ReinitiateQuotationDrawer: FC<ReinitiateQuotationDrawerProps> = ({
    openCreateReinitiateQuotationDrawerDrawer,
    closeCreateReinitiateQuotationDrawerDrawer,
    reloadQuotations,
    entityId,
}) => {
    const [quotationDetailsList, setQuotationDetailsList] = useState<Quote[]>([]);
    const [form] = Form.useForm();

    useEffect(() => {
        if (openCreateReinitiateQuotationDrawerDrawer) {
            loadQuoteList();
        }
    }, [openCreateReinitiateQuotationDrawerDrawer]);

    const loadQuoteList = async () => {
        const apiResponse: QuotesResponseBodyModel = await getQuotationDetailsList(
            entityId
        );
        setQuotationDetailsList(apiResponse.quoteList);
    };

    const closeDrawer = () => {
        form.resetFields();
        reloadQuotations();
        closeCreateReinitiateQuotationDrawerDrawer();
    };

    const submitReinitiateQuotation = async(values: any) => {
        const response = await createReinitiateQuotation(values.quote, values.reinitiateQuotationName);
        if(response==="SUCCESS"){
            closeDrawer();
        }
        
    };

    return (
        <Drawer
            title="Reinitiate Agreement"
            placement="right"
            width={600}
            onClose={closeDrawer}
            open={openCreateReinitiateQuotationDrawerDrawer}
            closeIcon={
                <BssSquareButton type="CLOSE" className="close-icon"/>
             }
            destroyOnClose={true}
        >
            <Form form={form} layout="vertical" onFinish={submitReinitiateQuotation}>
                <Form.Item name="quote" label="Select Existing Agreement" rules={[{ required: true }]}> 
                    <Select showSearch placeholder="Search and select a agreement">
                        {quotationDetailsList.map((quote) => (
                            <Option key={quote.id} value={quote.id}>{quote.name}</Option>
                        ))}
                    </Select>
                </Form.Item>
                
                <Form.Item name="reinitiateQuotationName" label="Reinitiate Agreement Name" rules={[{ required: true }]}>   
                    <TextArea 
                        showCount 
                        placeholder="Enter new agreement name"
                        maxLength={50} 
                        rows={1}
                      />
                </Form.Item>

                <div className="bss-ui-drawer-footer text-align-right">
                    <Button htmlType="submit" type="primary">
                        Submit
                    </Button>
                </div>
            </Form>
        </Drawer>
    );
};

export default ReinitiateQuotationDrawer;