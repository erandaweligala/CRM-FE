import { Drawer, Form, Input, DatePicker, InputNumber, Button, Select, Descriptions } from "antd";
import { FC } from "react";
import { reinitiateQuote } from "../../service/Agreements.service";
import { BSS_SquareButton as BssSquareButton } from "bss-component-library";
import dayjs from "dayjs";
import { Quote, ReinitiateQuotePayload } from "../../model/agreement-quote-body-model";
import currency from "../../../../../../../../constants/currency-units";

const { RangePicker } = DatePicker;

interface ReinitiateAgreementDrawerProps {
    visible: boolean;
    onClose: () => void;
    quote: Quote;
    onSuccess: () => void;
}

const ReinitiateAgreementDrawer: FC<ReinitiateAgreementDrawerProps> = ({ visible, onClose, quote, onSuccess }) => {
    const [form] = Form.useForm();

   const handleSubmit = async () => {
    const values = await form.validateFields();

    const payload: ReinitiateQuotePayload = {
        parentId: quote.id,
        quotationName: values.name,
        expirationDate: dayjs(values.expireOn).startOf("day").add(1, "second").format("YYYY-MM-DDTHH:mm:ss"),
        startDate: dayjs(values.validFor?.[0]).startOf("day").format("YYYY-MM-DDTHH:mm:ss"),
        endDate: dayjs(values.validFor?.[1]).startOf("day").format("YYYY-MM-DDTHH:mm:ss"),
        amount: values.amount,
    };

    await reinitiateQuote(payload);
    onSuccess();
    onClose();
};

    return (
        <Drawer
            title="Renew Agreement"
            open={visible}
            onClose={onClose}
            width={600}
            footer={
                <div style={{ textAlign: "right" }}>
                    <Button onClick={onClose} style={{ marginRight: 8 }}>Cancel</Button>
                    <Button type="primary" onClick={handleSubmit}>Submit</Button>
                </div>
            }
            closeIcon={
                <BssSquareButton type="CLOSE" className="close-icon" />
            }
             
        >
            <Descriptions title="Parent Agreement Information" size="small" column={1} bordered>
                <Descriptions.Item label="Agreement ID">{quote.id}</Descriptions.Item>
                <Descriptions.Item label="Agreement Name">{quote.name}</Descriptions.Item>
                <Descriptions.Item label="Status">{quote.status}</Descriptions.Item>
                <Descriptions.Item label="Expire On">
                    {quote.validFor?.endDateTime ? new Date(quote.validFor.endDateTime).toLocaleDateString() : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Currency">{quote.currency}</Descriptions.Item>
                <Descriptions.Item label="Contract Start">
                    {quote.contractInfo.startDate ? new Date(quote.contractInfo.startDate).toLocaleDateString() : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Contract End">
                    {quote.contractInfo.endDate ? new Date(quote.contractInfo.endDate).toLocaleDateString() : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Opportunity">{quote.name ?? "-"}</Descriptions.Item>
                <Descriptions.Item label="Organization">{quote.organization?.name ?? "-"}</Descriptions.Item>
                <Descriptions.Item label="Contact">{quote.primaryContact?.name ?? "-"}</Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 24 }}>
                <Form layout="vertical" form={form}>
                    <Form.Item name="name" label="Agreement Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="expireOn" label="Expire On" rules={[{ required: true }]}>
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="currency" label="Currency" rules={[{ required: true }]}>
                        <Select>
                          {currency?.map((currencyUnit) => (
                            <Select.Option value={currencyUnit.value}
                                key={currencyUnit.label}>
                                {currencyUnit.label}
                            </Select.Option>
                        ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="amount" label="Amount" rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} min={0} />
                    </Form.Item>
                    <Form.Item name="validFor" label="Contract Period" rules={[{ required: true }]}>
                        <RangePicker style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </div>
        </Drawer>
    );
};

export default ReinitiateAgreementDrawer;