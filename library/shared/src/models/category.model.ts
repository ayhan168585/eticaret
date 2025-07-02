export interface CategoryModel {
  id?:string
  name: string;
  url:string
}

export const InitialCategory: CategoryModel = {
  name:"",
  url:""
}