import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal, resource, signal, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Blank from 'apps/admin/src/components/blank';
import { FlexiToastService } from 'flexi-toast';
import { lastValueFrom } from 'rxjs';
import { CategoryModel, InitialCategory } from '@shared/models/category.model';
import { api } from 'apps/admin/src/constants';
import { BreadcrumbModel } from '../../layouts/breadcrumb';

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
      var res=await lastValueFrom(this.#http.get<CategoryModel>(`api/categories/${this.id()}`))
       this.breadcrumbs.update(prev=>[...prev, {title:res.name,icon:'edit',url:`/categories/edit/${this.id}`}])
      return res
    }

  })

  readonly data=computed(()=>this.result.value() ?? {...InitialCategory})
  readonly id=signal<string | undefined>(undefined)
  readonly #http=inject(HttpClient)
  readonly #router=inject(Router)
  readonly #toast=inject(FlexiToastService)
  readonly #activate=inject(ActivatedRoute)
  readonly cardTitle=computed(()=>this.id() ? 'Kategori Güncelle' : 'Kategori Ekle' )
  readonly btnName=computed(()=>this.id() ? 'Güncelle' : 'Kaydet')
   readonly breadcrumbs=signal<BreadcrumbModel[]>([
      {title:'Kategoriler',icon:'category',url:'/categories'},
     
     ])

  constructor(){
    this.#activate.params.subscribe(res=>{
      if(res["id"]){

        this.id.set(res["id"])
        console.log(res["id"])
      }else{
         this.breadcrumbs.update(prev=>[...prev, {title:'Ekle',icon:'add',url:'/categories/create'}])
      }
    })
  }
  save(form:NgForm){
if(!form.valid) return

if(!this.id()){

  this.#http.post(`api/categories`,this.data()).subscribe()
  
  this.#router.navigateByUrl("/categories")
  //this.#location.back() //gelmeden önceki sayfaya döner
  this.#toast.showToast("Kategori Ekleme","Kategori Eklendi","success")
  
}else{
  this.#http.put(`api/categories/${this.id()}`,this.data()).subscribe()
  this.#router.navigateByUrl("/categories")
  //this.#location.back() //gelmeden önceki sayfaya döner
  this.#toast.showToast("Kategori Güncelleme","Kategori Güncellendi","info")
}

}

}
