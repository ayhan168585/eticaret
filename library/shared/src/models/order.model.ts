import { BasketModel } from "./basket.model"

export interface OrderModel{
    id?:string
    orderNumber:string
    date:Date
    userId:string
    fullName:string
    phoneNumber:string
    city:string
    district:string
    fullAdress:string
    cartNumber:string
    cartOwnerName:string
    expiresDate:string
    cvv:number
    installmentOptions:string
    status:string
    baskets:BasketModel[]
}

export const initialOrder:OrderModel={
    orderNumber:"",
    date:new Date(),
    fullName:"",
    userId:"",
    phoneNumber:"",
    city:"",
    district:"",
    fullAdress:"",
    cartNumber:"",
    cartOwnerName:"",
    expiresDate:"",
    cvv:0,
    installmentOptions:"",
    status:"Hazırlanıyor",
    baskets:[]

}