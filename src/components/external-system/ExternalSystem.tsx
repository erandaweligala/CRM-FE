import {FC, useEffect, useState} from "react";

import "./ExternalSystem.scss";
import { BSS_Breadcrumb } from "bss-component-library";
interface ExternalSystemProps {
   componentName: string;
   displayName: string;
}

// Define a state type for holding the dynamically loaded component
type DynamicComponentType = React.ComponentType<any> | null;

const ExternalSystem: FC<ExternalSystemProps> = ({componentName, displayName}) => {

   const [DynamicComponents, setDynamicComponents] = useState<DynamicComponentType[]>();

   useEffect(() => {
      const loading = async () => {
         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
         // @ts-expect-error
         const LazyModule = await import('remoteApp/components');
         const LazyComponents = LazyModule.default;
         const tempDynamicComponent: DynamicComponentType[] = [];
         tempDynamicComponent.push(LazyComponents[componentName]);
         setDynamicComponents(tempDynamicComponent);
      }
      loading();
   }, [componentName]);


   return (
      <div className="external-system">
         <BSS_Breadcrumb>
            <BSS_Breadcrumb.Section>CRM</BSS_Breadcrumb.Section>
            <BSS_Breadcrumb.Section>Extension</BSS_Breadcrumb.Section>
            <BSS_Breadcrumb.Section>{displayName}</BSS_Breadcrumb.Section>
         </BSS_Breadcrumb>

         <div className="container">
            {
               DynamicComponents &&
               DynamicComponents.length > 0 &&
               DynamicComponents.map((Component) => {
                  if(Component === null) {
                     return null;
                  }
                  return (
                     <Component key={componentName}/>
                  )
               })
            }
         </div>

      </div>
   )

}

export default ExternalSystem;