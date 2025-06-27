import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal, resource, signal, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Blank from 'apps/admin/src/components/blank';
import { FlexiToastService } from 'flexi-toast';
import { lastValueFrom } from 'rxjs';
import { CategoryModel, InitialCategory } from '../categories';

@Component({
  imports: [Blank,FormsModule],
  templateUrl: './create.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class CreateCategory {

   readonly result=resource({
    params:()=>this.id(),
    loader:async ()=>{
      var res=await lastValueFrom(this.#http.get<CategoryModel>(`http://localhost:3000/categories/${this.id()}`))
      return res
    }

  })

  readonly data=linkedSignal(()=>this.result.value() ?? InitialCategory)
  readonly id=signal<string | undefined>(undefined)
  readonly #http=inject(HttpClient)
  readonly #router=inject(Router)
  readonly #toast=inject(FlexiToastService)
  readonly #activate=inject(ActivatedRoute)
  readonly cardTitle=computed(()=>this.id() ? 'Kategori Güncelle' : 'Kategori Ekle' )
  readonly btnName=computed(()=>this.id() ? 'Güncelle' : 'Kaydet')

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

  this.#http.post("http://localhost:3000/categories",this.data()).subscribe()
  
  this.#router.navigateByUrl("/categories")
  //this.#location.back() //gelmeden önceki sayfaya döner
  this.#toast.showToast("Kategori Ekleme","Kategori Eklendi","success")
}else{
  this.#http.put(`http://localhost:3000/categories/${this.id()}`,this.data()).subscribe()
  this.#router.navigateByUrl("/categories")
  //this.#location.back() //gelmeden önceki sayfaya döner
  this.#toast.showToast("Kategori Güncelleme","Kategori Güncellendi","info")
}

}

}
