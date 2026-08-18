import React from 'react';
import { Drawer, Card, Descriptions, Empty } from 'antd';
import { QuoteInfoTmf, QuoteItem } from '../../../../single-opportunity-page/components/quotation-drawer/models/quotes-response-body-model';
import './QuoteOptionViewDrawer.scss';
import { BSS_SquareButton, BSS_StatusTag } from 'bss-component-library';

type QuoteOptionViewDrawerProps = {
    quoteInfo: QuoteInfoTmf | null;
    isOpen: boolean;
    onClose: () => void;
};

const QuoteOptionViewDrawer: React.FC<QuoteOptionViewDrawerProps> = ({ quoteInfo, isOpen, onClose }) => {
    const renderPriceAlterations = (priceAlterations: any[]) => {
        return priceAlterations?.map((alternationItem: { name: any; priceType: any; price: { percentage: any; taxIncludedAmount: { unit: any; value: any; }; }; }, alternationIndex: { toString: () => string; }) => (
            <Card key={alternationIndex.toString() + "alternationItem"} className='card-content' bordered={false}>
                <div className="quote-description-container">
                    <Descriptions column={1} bordered items={[
                        { key: '1', label: 'Alteration', children: alternationItem?.name }
                    ]} style={{ width: "100%" }} />
                </div>
                <Descriptions column={1} bordered items={[
                    { key: '2', label: 'Alteration Type', children: alternationItem?.priceType },
                    { key: '3', label: 'Alteration Amount', children: alternationItem?.price?.percentage ? `${alternationItem.price.percentage} %` : `${alternationItem?.price?.taxIncludedAmount?.unit} ${alternationItem?.price?.taxIncludedAmount?.value}` }
                ]} style={{ width: "100%", marginTop: "10px" }} />
            </Card>
        ));
    };

    const renderPriceItems = (quoteItem: QuoteItem) => {
        return quoteItem?.quoteItemPrice?.sort((a: { priceType: string; }, b: { priceType: string; }) => {
            if (a.priceType === 'onetime' && b.priceType !== 'onetime') return -1;
            if (b.priceType === 'onetime' && a.priceType !== 'onetime') return 1;
            return 0;
        }).map((priceItem: { productOfferingPrice: { id: any; }; name: any; priceType: string | undefined; priceAlteration: any; }, priceIndex: number) => (
            <Card key={priceIndex.toString() + "quoteItemPrice"} className='card-item-wrapper' bordered={false}>
                <Card.Grid hoverable={false} className='card-item'>
                    <div className='quote-description-container'>
                        <h4 className='common-font'>Price Plan {priceIndex + 1}</h4>
                    </div>
                </Card.Grid>
                <Card.Grid hoverable={false} className='card-grid'>
                    <Descriptions column={1} bordered items={[
                        { key: '1', label: 'Price Plan ID', children: priceItem?.productOfferingPrice.id },
                        { key: '2', label: 'Price Plan Name', children: priceItem?.name },
                        { key: '3', label: 'Price Category', children: <BSS_StatusTag backgroundColor="#5FB900" type="custom" labelName={priceItem?.priceType} className="mr-4" /> }
                    ]} className='description-content' />
                    {renderPriceAlterations(priceItem?.priceAlteration)}
                </Card.Grid>
            </Card>
        ));
    };

    const renderQuoteItems = () => {
        return quoteInfo?.quoteItem?.map((quoteItem) => (
            <Card key={quoteItem?.id + "quoteItem"} className="card-content" bordered={false}>
                <Card.Grid hoverable={false} className='card-item-product'>
                    <div className='quote-description-container'>
                        <Descriptions bordered style={{ color: 'black' }} column={4} items={[
                            { key: '1', label: 'Product ID', children: quoteItem?.productOffering.id },
                            { key: '2', label: 'Product Name', children: quoteItem?.productOffering.name },
                            { key: '4', label: 'Quantity', children: quoteItem?.quantity < 10 ? `0${quoteItem?.quantity}` : quoteItem?.quantity }
                        ]} className='description-content common-font' />
                    </div>
                </Card.Grid>
                <Card.Grid hoverable={false} className='card-grid'>
                    {renderPriceItems(quoteItem)}
                </Card.Grid>
            </Card>
        ));
    };

    return (
        <Drawer
            placement="right"
            onClose={onClose}
            open={isOpen}
            className="bss-ui-drawer"
            width={1000}
            title={
                <div className="drawer-header">
                    <span className="drawer-title font-2xl-semi-bold">
                        {quoteInfo?.name || 'Agreement Option View'}
                    </span>
                </div>
            }
            closeIcon={<BSS_SquareButton type="CLOSE" className="close-icon"/>}
            destroyOnClose={true}
            maskClosable={false}
        >
            {quoteInfo && quoteInfo.quoteItem?.length > 0 ? renderQuoteItems() : (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                </div>
            )}
        </Drawer>
    );
};

export default QuoteOptionViewDrawer;
