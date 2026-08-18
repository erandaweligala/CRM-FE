import { FC, useEffect, useState, useCallback } from "react";
import { Button, Drawer, Empty, Radio, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import {
   createProductDetails,
   deleteProductDetails,
   getProductDetailsList,
   searchProductDetails,
} from "./services/productDetails.service";
import ProductDetailsView from "./components/ProductDetailsView";
import showNotification from "../../../../../../services/notification.service";
import { useAppSelector, RootState } from "../../../../../../store/main-store";
import DigitalBssConfirmModal from "../../../../../../components/DigitalBssConfirmModal";
import { BSS_SearchPanel as BssSearchPanel, BSS_SquareButton as BssSquareButton, InputType } from "bss-component-library";
import BssCollapse from "../../../../../../components/BSS_Collapse/BSS_Collapse";
import { onCell } from "../../../../../../helpers/table-on-cell-values";
import ProductDetailsListResponseBodyModel, {
   ProductResponseBodyModel,
   ProductResponseSearchBody,
} from "./models/ProductDetailsListResponseBody.model";
import { AddProductRequestBodyModel, ProductQueryModel } from "./models/AddProductRequestBody.model";

interface ProductDetailsProps {
   entityId: string;
   parentOperation?: "EDIT" | "VIEW";
   setRef: (el: HTMLDivElement | null) => void;
}

const ProductDetails: FC<ProductDetailsProps> = ({ entityId, parentOperation = "EDIT",setRef}) => {
   const [productDetailsList, setProductDetailsList] = useState<ProductDetailsListResponseBodyModel[]>([]);
   const [searchProductDetailsList, setSearchProductDetailsList] = useState<ProductResponseSearchBody[]>([]);
   const [opportunityProductDetailsList, setOpportunityProductDetailsList] = useState<ProductResponseSearchBody[]>([]);
   const [itemToDelete, setItemToDelete] = useState<ProductResponseSearchBody | null>(null);
   const [selectedProduct, setSelectedProduct] = useState<ProductResponseSearchBody | null>(null);
   const [isAddProductDrawerOpen, setIsAddProductDrawerOpen] = useState(false);
   const [drawerData, setDrawerData] = useState({
      isDrawerOpen: false,
      operation: "NON" as "NEW" | "EDIT" | "VIEW" | "NON",
      data: null as ProductResponseSearchBody | null,
   });

   const loggedInUserName = useAppSelector((state: RootState) => state.auth.decodedToken?.sub);

   const loadProductDetailsList = useCallback(async () => {
      const apiResponse = await searchProductDetails({
         productName: "",
         productCategory: "",
         productID: "",
         referenceId: entityId,
      });
      setOpportunityProductDetailsList(apiResponse);
   }, [entityId]);

   const loadProductDetailsDrawerList = useCallback(async () => {
      const apiResponse: ProductResponseBodyModel = await getProductDetailsList(entityId);
      setProductDetailsList(apiResponse.productOfferings);
   }, [entityId]);

   useEffect(() => {
      loadProductDetailsList();
   }, [loadProductDetailsList]);

   useEffect(() => {
      if (isAddProductDrawerOpen) {
         setDrawerData({ isDrawerOpen: true, operation: "NEW", data: null });
         loadProductDetailsDrawerList();
      }
   }, [isAddProductDrawerOpen, loadProductDetailsDrawerList]);

   const handleSearch = (searchValues?: ProductQueryModel) => {
      const filteredList = productDetailsList
         .map(product => ({
            ...product,
            productId: product.id,
            category: product.categoryName,
         }))
         .filter(product => {
            const matchesName = searchValues?.productName
               ? product.name.toLowerCase().includes(searchValues.productName.toLowerCase())
               : true;
            const matchesID = searchValues?.productID
               ? product.id.toLowerCase().includes(searchValues.productID.toLowerCase())
               : true;
            return matchesName && matchesID;
         });
      setSearchProductDetailsList(filteredList);
   };

   const closeDrawer = (shouldReload: boolean) => {
      setDrawerData({ isDrawerOpen: false, operation: "NON", data: null });
      setSelectedProduct(null);
      setIsAddProductDrawerOpen(false);
      if (shouldReload) loadProductDetailsList();
   };

   const handleDeleteProduct = async () => {
      if (itemToDelete) {
         try {
            await deleteProductDetails(entityId, itemToDelete.id);
            loadProductDetailsList();
            setItemToDelete(null);
         } catch (error) {
            console.error("Error deleting item:", error);
         }
      }
   };

   const submitProductForm = async () => {
      if (!selectedProduct) {
         showNotification("WARNING", "Please select a product to add");
         return;
      }
      if (opportunityProductDetailsList.some(product => product.productId === selectedProduct.productId)) {
         showNotification("WARNING", "Product already exists in the opportunity");
         return;
      }
      const requestBody: AddProductRequestBodyModel = {
         referenceId: entityId,
         name: selectedProduct.name || "",
         id: selectedProduct.id || "",
         category: selectedProduct.category || "",
         createBy: loggedInUserName ?? "",
      };
      if (drawerData.operation === "NEW") {
         await createProductDetails(requestBody);
         closeDrawer(true);
         setSearchProductDetailsList([]);
      }
   };

   const tableColumns: ColumnsType<ProductResponseSearchBody> = [
      {
         title: "Product ID",
         dataIndex: "productId",
         key: "productId",
         onCell: () => onCell("50px"),
         render: text => <span title={text}>{text}</span>,
      },
      {
         title: "Product Name",
         dataIndex: "name",
         onCell: () => onCell("50px"),
         render: text => <span title={text}>{text}</span>,
      },
      {
         title: "Product Category",
         dataIndex: "category",
         onCell: () => onCell("50px"),
         render: text => <span title={text}>{text}</span>,
      },
      {
         title: "Actions",
         dataIndex: "actions",
         key: "action",
         align: "center",
         width: 50,
         render: (_, record) => (
            <div style={{ display: "flex", justifyContent: "space-between", gap: "5px" }}>
               <BssSquareButton onClick={() => setDrawerData({ isDrawerOpen: true, operation: "VIEW", data: record })} type="VIEW" />
               {parentOperation === "EDIT" && (
                  <BssSquareButton onClick={() => setItemToDelete(record)} type="DELETE" />
               )}
            </div>
         ),
      },
   ];

   const tableDrawerColumns: ColumnsType<ProductResponseSearchBody> = [
      {
         title: "Product ID",
         dataIndex: "id",
         ellipsis: true,
         render: (text, record) => (
            <Radio checked={selectedProduct?.id === record.id} onClick={() => setSelectedProduct(record)}>
               {text}
            </Radio>
         ),
      },
      { title: "Product Name", dataIndex: "name", ellipsis: true },
      { title: "Product Category", dataIndex: "categoryName", ellipsis: true },
   ];

   const searchPanelInputs: InputType[] = [
      { valueName: "productName", label: "Product Name", placeholder: "Enter Product Name", type: "INPUT",required: false,mainInput: true },
      { valueName: "productID", label: "Product ID", placeholder: "Enter Product ID", type: "INPUT", required: false, mainInput: true },
   ];

   return (
      <div ref={(reference) => setRef(reference)}>
         <BssCollapse
            title="Product Details"
            defaultExpanded
            extra={
               <Button type="primary" size="small" onClick={() => setIsAddProductDrawerOpen(true)}>
                  Add Product
               </Button>
            }
         >
            {opportunityProductDetailsList.length > 0 ? (
               <Table
                  columns={tableColumns}
                  dataSource={opportunityProductDetailsList}
                  rowKey="productID"
               />
            ) : (
               <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
               </div>
            )}
         </BssCollapse>

         <Drawer
            className="bss-ui-drawer"
            width={950}
            title={
               <div className="drawer-header">
                  <span className="drawer-title font-2xl-semi-bold">
                     {drawerData.operation === "NEW" ? "Add Product" : "View Product Details"}
                  </span>
               </div>
            }
            open={drawerData.isDrawerOpen}
            onClose={() => closeDrawer(false)}
            destroyOnClose
            maskClosable={false}
            closeIcon={<BssSquareButton type="CLOSE" className="close-icon" />}
         >
            {drawerData.operation === "NEW" && (
               <>
                  <BssSearchPanel
                     inputs={searchPanelInputs}
                     title="Search Product"
                     isExpandBtnVisible={false}
                     onSubmit={handleSearch}
                     onClear={() => handleSearch()}
                  />
                  <Table
                     dataSource={searchProductDetailsList}
                     columns={tableDrawerColumns}
                     pagination={{ pageSize: 10 }}
                     rowKey="productID"
                  />
                  <div className="bss-ui-drawer-footer text-align-right">
                     <Button onClick={() => closeDrawer(false)}>Cancel</Button>
                     <Button type="primary" onClick={submitProductForm}>
                        Save
                     </Button>
                  </div>
               </>
            )}
            {drawerData.operation === "VIEW" && drawerData.data && <ProductDetailsView clickedItem={drawerData.data} />}
         </Drawer>

         <DigitalBssConfirmModal
            title="Confirm Delete"
            isOpen={!!itemToDelete}
            onOk={handleDeleteProduct}
            onCancel={() => setItemToDelete(null)}
            btnDanger
         >
            Are you sure you want to remove this product?
         </DigitalBssConfirmModal>
      </div>
   );
};

export default ProductDetails;
