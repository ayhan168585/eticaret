import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal, resource, signal, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Blank from 'apps/admin/src/components/blank';
import { FlexiToastService } from 'flexi-toast';
import { NgxMaskDirective } from 'ngx-mask';
import { lastValueFrom } from 'rxjs';
import { initialProduct, ProductModel } from '../products';

@Component({
  imports: [Blank,FormsModule,NgxMaskDirective],
  templateUrl: './create.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ProductCreate {

  readonly result=resource({
    params:()=>this.id(),
    loader:async ()=>{
      var res=await lastValueFrom(this.#http.get<ProductModel>(`http://localhost:3000/products/${this.id()}`))
      return res
    }

  })

  readonly data=linkedSignal(()=>this.result.value() ?? initialProduct)
  readonly btnName=computed(()=>this.id() ? "Güncelle" : "Kaydet")
  readonly cardTitle=computed(()=>this.id() ? "Ürün Güncelle" : "Ürün Ekle")
  readonly id=signal<string | undefined>(undefined)
  readonly #http=inject(HttpClient)
  readonly #router=inject(Router)
  readonly #toast=inject(FlexiToastService)
  readonly #activate=inject(ActivatedRoute)
  //readonly #location=inject(Location)

  constructor(){
    this.#activate.params.subscribe(res=>{
      if(res["id"]){

        this.id.set(res["id"])
        console.log(res["id"])
      }
    })
  }
save(form:NgForm){
if(!form.valid) return

if(!this.id()){

  this.#http.post("http://localhost:3000/products",this.data()).subscribe()
  this.#router.navigateByUrl("/products")
  //this.#location.back() //gelmeden önceki sayfaya döner
  this.#toast.showToast("Ürün Ekleme","Ürün Eklendi","success")
}else{
  this.#http.put(`http://localhost:3000/products/${this.id()}`,this.data()).subscribe()
  this.#router.navigateByUrl("/products")
  //this.#location.back() //gelmeden önceki sayfaya döner
  this.#toast.showToast("Ürün Güncelleme","Ürün Güncellendi","info")
}

}


}
