interface UserCustomPropertyModel {
   propertyId: string;
   propertyName: string;
   values: {
      valueId: string;
      valueName: string;
   }[]
}

export default UserCustomPropertyModel;