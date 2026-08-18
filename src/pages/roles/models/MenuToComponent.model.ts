export interface ComponentModel {
  componentId: string;
  componentName: string;
  description: string;
}

export interface MenuToComponentModel {
    menuId:string;
    menuName: string;
    components: ComponentModel[];
  }