import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import MicrofrontentComponentListModel from "../model/MicrofrontentComponentList.model";
import UserCustomPropertyModel from "../pages/users-management/models/UserCustomProperty.model";

interface MetaDataState {
   microFrontendComponentList: MicrofrontentComponentListModel[];
   userCustomPropertyList: UserCustomPropertyModel[];
   metaData: {metaDataId: string, data: any}[];
}

const initialState: MetaDataState = {
   microFrontendComponentList: [],
   userCustomPropertyList: [],
   metaData: [],
}

const metaDataSlice = createSlice({
   name: "metaData",
   initialState: initialState,
   reducers: {
      setMicroFrontComponentList(state, action: PayloadAction<MicrofrontentComponentListModel[]>) {
         state.microFrontendComponentList = action.payload;
      },
      setUserCustomPropertyList(state, action: PayloadAction<UserCustomPropertyModel[]>) {
         state.userCustomPropertyList = action.payload;
      },
      setMetaData(state, action: PayloadAction<{metaDataId: string, data: any}>) {
         state.metaData.push(action.payload);
      }
   }
});

export const metaDataAction = metaDataSlice.actions;

export default metaDataSlice;