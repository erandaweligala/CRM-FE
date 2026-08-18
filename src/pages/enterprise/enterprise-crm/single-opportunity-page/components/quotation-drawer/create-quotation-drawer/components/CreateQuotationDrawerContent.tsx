import React, { useEffect, useState } from "react";
import {Form, Input, Select, Collapse, DatePicker, FormInstance, Row, Col} from "antd";
import {FormInputErrorMessages} from "../../../../../../../../constants/form-input-error-messages";
import dayjs from "dayjs";
import {
    contractMethodOptions,
    GenerateContractedPriceOptions} from "../models/request/create-quotation-select-options";
import {RuleObject} from "rc-field-form/lib/interface";
import {viewPriceBookList} from "../../services/price_book_view_service";
import {ViewPricebookListRequestModel} from "../../models/request/view_pricebook_list_request_model";
import {SinglePriceBook} from "../../models/response/view_price_book_list_response_model";
import { BSS_SquareButton as BssSquareButton } from "bss-component-library";
import {getServiceTypesInfo} from "../../services/quotation-create.service.ts";

const {Option} = Select;
interface CreateQuotationDrawerContentProps {
    quoteInfoForm: FormInstance;
    contractInfoForm: FormInstance;
    billingInfoForm: FormInstance;
    pricingDefaultsForm: FormInstance;
    primaryContact: string | undefined;
    owner: string | undefined;
    opportunity: string | undefined;
    amount: string | undefined;
    setSelectedPriceBook: (val: {
        label: string,
        value: string,
    } | undefined) => void;
    searchPriceBookList: SinglePriceBook[];
    setSearchPriceBookList: React.Dispatch<React.SetStateAction<SinglePriceBook[]>>;
}
const disablePastDates = (current: any) => {
    return current?.isBefore(dayjs().startOf('day'));
}
const ExpandIcon = () => <BssSquareButton type="DOWN_ARROW" />;

const CreateQuotationDrawerContent = ({
                                          quoteInfoForm,
                                          contractInfoForm,
                                          billingInfoForm,
                                          pricingDefaultsForm,
                                          primaryContact,
                                          opportunity,
                                          owner,
                                          amount,
                                          setSelectedPriceBook,
                                          searchPriceBookList,
                                          setSearchPriceBookList,

                                      }: CreateQuotationDrawerContentProps) => {


        const validateRequiredField = async (_: RuleObject, value: any): Promise<void> => {
            if (!value) {
                throw new Error(FormInputErrorMessages.REQUIRED);
            }
        };
    const [maxYears, setMaxYears] = useState(0);
    const [maxMonths, setMaxMonths] = useState(0);
    const [maxDays, setMaxDays] = useState(0);
    const [isYearsDisabled, setIsYearsDisabled] = useState(true);
    const [isMonthsDisabled, setIsMonthsDisabled] = useState(true);
    const [isDaysDisabled, setIsDaysDisabled] = useState(true);
    const [serviceTypeOptions, setServiceTypeOptions] = useState<{ id: string; name: string }[]>([]);

   const fetchServiceTypes = async () => {
   try {
    const { serviceTypes } = await getServiceTypesInfo();   

    const mappedServiceTypes = serviceTypes.map((item) => ({
      id: item.serviceSpecification.id,
      name: item.name,
    }));

    setServiceTypeOptions(mappedServiceTypes);
  } catch (error) {
    console.error("Error fetching service types:", error);
  }
};

    useEffect(() => {
        fetchServiceTypes();
    }, []);

        
        useEffect(() => {
            contractInfoForm.setFieldsValue({
                subscriptionTermYears: undefined,
                subscriptionTermMonths: undefined,
                subscriptionTermDays: undefined,
            });
        }, []);
    
        const handleDateChange = () => {
            const { startDate, endDate } = contractInfoForm.getFieldsValue(["startDate", "endDate"]);
            
            if (startDate && endDate) {
                const totalMonths = dayjs(endDate).diff(dayjs(startDate), 'month');
                const totalYears = dayjs(endDate).diff(dayjs(startDate), 'year');
                const totalDays = dayjs(endDate).diff(dayjs(startDate), 'day');
                const years = Math.floor(totalMonths / 12);
                const months = totalMonths % 12;
                const days = dayjs(endDate).diff(dayjs(startDate).add(years, 'year').add(months, 'month'), 'day');
                setMaxYears(totalYears);
                setMaxMonths(totalMonths);
                setMaxDays(totalDays);
                setIsYearsDisabled(years===0);
                setIsMonthsDisabled(years === 0 && months === 0);
                setIsDaysDisabled(years === 0 && months === 0 && days === 0);
            }
        };
    return (
            <>
                <div className="mt-3">
                    <Collapse
                        defaultActiveKey={['1']}
                        expandIcon={ExpandIcon}
                        className="innerDrawerCollapse"
                        items={[{
                            key: '1', label:
                                <span className="font-2xl-semi-bold"><b>Agreement Information</b></span>, children: <Form
                                form={quoteInfoForm}
                                layout="vertical"
                            initialValues={{ currency: "USD" }}>
                                <Form.Item
                                    name="quoteName"
                                    label="Agreement Name"
                                    required={true}
                                    rules={[
                                        {
                                            validator: validateRequiredField,
                                        },
                                    ]}
                                >
                                    <Input showCount maxLength={50} placeholder={"Agreement Name"}/>
                                </Form.Item>
                                <Form.Item
                                    name="ExpiresOn"
                                    label="Expires On"
                                    required={true}
                                    valuePropName="value"
                                    rules={[
                                        {
                                            validator: validateRequiredField,
                                        },
                                    ]}
                                >
                                    <DatePicker 
                                        name="expiresOn" 
                                        disabledDate={disablePastDates} 
                                        className="w-100"
                                        onChange={(date) => {
                                            quoteInfoForm.setFieldsValue({ expiresOn: date ? date.format('YYYY-MM-DDTHH:mm:ssZ[Z]') : '' });
                                        }}
                                    />
                                </Form.Item>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item
                                            name="opportunity"
                                            label="Opportunity"
                                        >
                                            <Input maxLength={100} disabled={true}
                                                   placeholder={opportunity} value={opportunity}/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item
                                            name="currency"
                                            label="Currency"
                                            required={true}
                                            rules={[
                                                {
                                                    validator: validateRequiredField,
                                                },
                                            ]}
                                        >
                                            <Select
                                                allowClear
                                                style={{width: '100%'}}
                                            >
                                                <Option value="LKR">LKR</Option>
                                                <Option value="USD">USD</Option>

                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item
                                            name="amount"
                                            label="Amount"
                                            required={true}
                                            initialValue={amount}
                                            rules={[
                                                {
                                                    validator: validateRequiredField,
                                                },
                                            ]}
                                        >
                                            <Input maxLength={100} placeholder={"Amount"}/>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item
                                            name="primaryContact"
                                            label="Primary Contact"
                                        >
                                            <Input maxLength={100} disabled={true} placeholder={primaryContact}
                                                   value={primaryContact}/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="owner"
                                            label="Owner"
                                            required={true}
                                        >
                                            <Input 
                                                maxLength={100} 
                                                disabled={true} 
                                                placeholder={owner ?? "Owner not available"} 
                                                value={owner ?? "Owner not available"} 
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Form.Item
                                    name="serviceType"
                                    label="Service Type"
                                    required={true}
                                >
                                    <Select
                                        placeholder="Select a service type"
                                        style={{ width: "100%" }}
                                        allowClear
                                        showSearch
                                        labelInValue
                                        filterOption={(input, option) =>
                                            typeof option?.label === "string" &&
                                            option.label.toLowerCase().includes(input.toLowerCase())
                                        }
                                        options={serviceTypeOptions.map((type) => ({
                                            label: type.name,
                                            value: type.id,
                                        }))}
                                        onChange={(option) => {
                                            quoteInfoForm.setFieldsValue({
                                                serviceType: {
                                                    id: option.value,
                                                    name: option.label,
                                                },
                                            });
                                        }}
                                    />
                                </Form.Item>
                            </Form>
                        }]}/>

                </div>
            <div className="mt-3">
                <Collapse
                    defaultActiveKey={['1']}
                    className="innerDrawerCollapse"
                    expandIcon={ExpandIcon}
                    items={[{
                        key: '1', label:
                            <span className="font-2xl-semi-bold"><b>Contract Information</b></span>, children: <Form
                                form={contractInfoForm}
                                layout="vertical"
                            >
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item
                                            name="startDate"
                                            label="Start Date"
                                            valuePropName="value"
                                            required={true}
                                            rules={[
                                                {
                                                    validator: validateRequiredField,
                                                },
                                            ]}
                                        >
                                            <DatePicker name="startDate" disabledDate={disablePastDates} onChange={handleDateChange} className="w-100" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="endDate"
                                            label="End Date"
                                            valuePropName="value"
                                            required={true}
                                            rules={[
                                                {
                                                    validator: validateRequiredField,
                                                },
                                            ]}
                                        >
                                            <DatePicker name="endDate" disabledDate={disablePastDates} onChange={handleDateChange} className="w-100" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Form.Item
                                    name="subscriptionTerm" label="Subscription term" required={true} style={{ marginBottom: '-30px' }}></Form.Item>
                                <Row gutter={16}>
                                    <Col span={8}>
                                        <Form.Item
                                            name="subscriptionTermYears"
                                            label="Years"
                                            required={false}
                                        >
                                            <Select disabled={isYearsDisabled} id="subscriptionTermYears">
                                                {Array.from({ length: maxYears }, (_, i) => i + 1).map((num) => (
                                                    <Option key={num} value={num}>{num}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item name="subscriptionTermMonths" label="Months">
                                            <Select disabled={isMonthsDisabled}>
                                                {Array.from({ length: maxMonths }, (_, i) => i + 1).map((num) => (
                                                    <Option key={num} value={num}>{num}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item name="subscriptionTermDays" label="Days">
                                            <Select disabled={isDaysDisabled}>
                                                {Array.from({ length: maxDays }, (_, i) => i + 1).map((num) => (
                                                    <Option key={num} value={num}>{num}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={16}>

                                    <Col span={12}>
                                        <Form.Item
                                            name="contractMethod"
                                            label="Contract Method"
                                            required={true}
                                            rules={[
                                                {
                                                    validator: validateRequiredField,
                                                },
                                            ]}
                                        >
                                            <Select allowClear showSearch
                                                options={contractMethodOptions} />
                                        </Form.Item>
                                    </Col>

                                    <Col span={12}>
                                        <Form.Item
                                            name="generateContractPrice"
                                            label="Generate Contract Price"
                                            required={true}
                                            rules={[
                                                {
                                                    validator: validateRequiredField,
                                                },
                                            ]}
                                        >
                                            <Select allowClear showSearch options={
                                                GenerateContractedPriceOptions
                                            } />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                 <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item
                                            name="terminationDate"
                                            label="Contract Termination Date"
                                            valuePropName="value"
                                            required={true}
                                            rules={[
                                                {
                                                    validator: validateRequiredField,
                                                },
                                            ]}
                                        >
                                            <DatePicker name="terminationDate" disabledDate={disablePastDates} onChange={handleDateChange} className="w-100" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        }]}/>
                </div>
                <div className="mt-3">
                    <Collapse
                        defaultActiveKey={['1']}
                        className="innerDrawerCollapse"
                        expandIcon={ExpandIcon}
                        items={[{
                            key: '1', label:
                                <span className="font-2xl-semi-bold"><b>Billing Information</b></span>, children: <Form
                                form={billingInfoForm}
                                layout="vertical"
                            >
                                <Form.Item
                                    name="billingFrequency"
                                    label="Billing Frequency"
                                    required={true}
                                    rules={[
                                        {
                                            validator: validateRequiredField,
                                        },
                                    ]}
                                >
                                    <Select 
                                        allowClear 
                                        showSearch 
                                        options={[
                                            { label: "Monthly", value: "Monthly", disabled: maxMonths === 0 },
                                            { label: "Quarterly", value: "Quarterly", disabled: maxMonths < 3 },
                                            { label: "Annually", value: "Annually", disabled: maxYears === 0 }
                                        ]}
                                    />
                                </Form.Item>

                                 <Row gutter={16}>
                                    
                                    <Col span={12}>
                                        <Form.Item
                                            name="billStartDate"
                                            label="Bill Start Date"
                                            valuePropName="value"
                                            required={true}
                                            rules={[
                                                {
                                                    validator: validateRequiredField,
                                                },
                                            ]}
                                        >
                                            <DatePicker name="billStartDate" disabledDate={disablePastDates} onChange={handleDateChange} className="w-100" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        }]}/>
                </div>
                <div className="mt-3">
                    <Collapse
                        defaultActiveKey={['1']}
                        className="innerDrawerCollapse"
                        expandIcon={ExpandIcon}
                        items={[{
                            key: '1', label:
                                <span className="font-2xl-semi-bold"><b>Pricing Defaults</b></span>, children: <Form
                                form={pricingDefaultsForm}
                                layout="vertical"
                            >
                                <Form.Item
                                    name="priceBook"
                                    label="Price Book"
                                >
                                    <Select
                                        showSearch
                                        allowClear={true}
                                        style={{width: '100%'}}
                                        filterOption={false}
                                        onClear={
                                            () => {
                                                setSearchPriceBookList([])
                                                setSelectedPriceBook(undefined)
                                            }
                                        }
                                        placeholder="Select Price Book"
                                        onSearch={(value) => {
                                            if (value) {
                                                const queryParams: ViewPricebookListRequestModel = {
                                                    bookName: value,
                                                    id: "",
                                                    offset: 0,
                                                    limit: 100,
                                                };
                                                viewPriceBookList(queryParams, () => {
                                                })
                                                    .then((data) => {
                                                        setSearchPriceBookList(data.priceBookLists);
                                                    })
                                                    .catch((error) => {
                                                        console.log(error);
                                                    });
                                            }
                                        }}
                                        onFocus={() => {
                                            const queryParams: ViewPricebookListRequestModel = {
                                                bookName: "",
                                                id: "",
                                                offset: 0,
                                                limit: 5,
                                            };
                                            viewPriceBookList(queryParams, () => {
                                            })
                                                .then((data) => {
                                                    setSearchPriceBookList(data.priceBookLists);
                                                })
                                                .catch((error) => {
                                                    console.log(error);
                                                });
                                        }
                                        }
                                        options={searchPriceBookList?.map((priceBook) => (
                                            {
                                                label: priceBook.bookName,
                                                value: priceBook.id,
                                            }))}
                                        onSelect={(_value, option) => {
                                            console.log(option);
                                            setSelectedPriceBook(option);
                                        }}
                                    />
                                </Form.Item>
                            </Form>
                        }]}/>
                </div>
            </>
        );
    }
;

export default CreateQuotationDrawerContent;