import { Location } from '@angular/common';
import { HttpClient, httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject,  linkedSignal,  resource, signal, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Blank from 'apps/admin/src/components/blank';
import { FlexiToastService } from 'flexi-toast';
import { NgxMaskDirective } from 'ngx-mask';
import { lastValueFrom } from 'rxjs';
import { initialProduct, ProductModel } from '@shared/models/product.model';
import { api } from 'apps/admin/src/constants';
import { CategoryModel } from '@shared/models/category.model';
import { FlexiSelectModule } from 'flexi-select';
import { BreadcrumbModel } from '../../layouts/breadcrumb';

@Component({
  imports: [Blank,FormsModule,NgxMaskDirective,FlexiSelectModule],
  templateUrl: './create.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ProductCreate {

  readonly result=resource({
    params:()=>this.id(),
    loader:async ()=>{
      var res=await lastValueFrom(this.#http.get<ProductModel>(`api/products/${this.id()}`))
      this.breadcrumbs.update(prev=>[...prev, {title:res.name,icon:'edit',url:`/products/edit/${this.id}`}])
      return res
    }

  })

  readonly data=linkedSignal(()=>this.result.value() ?? {...initialProduct})
  readonly categoryResult=httpResource<CategoryModel[]>(()=>"api/categories")
  readonly categories=computed(()=>this.categoryResult.value() ?? [])
  readonly categoryLoading=computed(()=>this.categoryResult.isLoading())
  readonly btnName=computed(()=>this.id() ? "Güncelle" : "Kaydet")
  readonly cardTitle=computed(()=>this.id() ? "Ürün Güncelle" : "Ürün Ekle")
  readonly id=signal<string | undefined>(undefined)
  readonly #http=inject(HttpClient)
  readonly #router=inject(Router)
  readonly #toast=inject(FlexiToastService)
  readonly #activate=inject(ActivatedRoute)
   readonly breadcrumbs=signal<BreadcrumbModel[]>([
      {title:'Ürünler',icon:'deployed_code',url:'/products'},
     
     ])
  //readonly #location=inject(Location)

  constructor(){
    this.#activate.params.subscribe(res=>{
      if(res["id"]){

        this.id.set(res["id"])
        console.log(res["id"])
      }else{
        this.breadcrumbs.update(prev=>[...prev, {title:'Ekle',icon:'add',url:'/products/create'}])

      }
    })
  }
save(form:NgForm){
if(!form.valid) return

if(!this.id()){

  this.#http.post(`api/products`,this.data()).subscribe()
  
  this.#router.navigateByUrl("/products")
  //this.#location.back() //gelmeden önceki sayfaya döner
  this.#toast.showToast("Ürün Ekleme","Ürün Eklendi","success")
  
}else{
  this.#http.put(`api/products/${this.id()}`,this.data()).subscribe()
  this.#router.navigateByUrl("/products")
  //this.#location.back() //gelmeden önceki sayfaya döner
  this.#toast.showToast("Ürün Güncelleme","Ürün Güncellendi","info")
}

}

setCategoryName(){
  const id=this.data().categoryId
  const category=this.categories().find(p=>p.id==id)
  this.data.update((prev)=>({...prev,categoryName:category?.name ?? ""}))
}


}
