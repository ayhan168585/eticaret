import { ChangeDetectionStrategy, Component, computed, inject, signal, ViewEncapsulation } from '@angular/core';
import Blank from "../../components/blank";
import { FlexiGridFilterDataModel, FlexiGridModule } from 'flexi-grid';
import { HttpClient, httpResource } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { FlexiToastService } from 'flexi-toast';

export interface ProductModel{
  name:string
  imageUrl:string
  price:number
  stock:number
  categoryId:string
  categoryName:string
}

export const initialProduct:ProductModel={
name:"",
imageUrl:"",
price:0,
stock:0,
categoryId:"123",
categoryName:"Telefon"
}


@Component({
  imports: [Blank,FlexiGridModule,RouterLink],
  templateUrl: './products.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Products {
  readonly result=httpResource<ProductModel[]>(()=>"http://localhost:3000/products")
  readonly data=computed(()=>this.result.value()??[])
  readonly loading=computed(()=>this.result.isLoading())
  readonly #http=inject(HttpClient)
  readonly categoryFilter=signal<FlexiGridFilterDataModel[]>([
    {
      name:'Telefon',
      value:'Telefon'
    }
  ])
readonly #toast=inject(FlexiToastService)
  delete(id:string){
  this.#toast.showSwal("Ürün Silme","Ürünü silmek istiyormu sunuz?","Evet",()=>{
    this.#http.delete(`http://localhost:3000/products/${id}`).subscribe(res=>{
      this.#toast.showToast("Ürün Silme","Ürün silindi","error")
        this.result.reload()
    })
  
  },"Vazgeç")
}
}

