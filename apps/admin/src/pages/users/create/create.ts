import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal, resource, signal, ViewEncapsulation } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { UserModel,InitialUser } from '@shared/models/user.model';
import { HttpClient } from '@angular/common/http';
import Blank from 'apps/admin/src/components/blank';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FlexiToastService } from 'flexi-toast';
import Breadcrumb, { BreadcrumbModel } from '../../layouts/breadcrumb';

@Component({
  imports: [Blank,FormsModule],
  templateUrl: './create.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class CreateUser {

 readonly result=resource({
    params:()=>this.id(),
    loader:async ()=>{
      var res=await lastValueFrom(this.#http.get<UserModel>(`api/users/${this.id()}`))
              this.breadcrumbs.update(prev=>[...prev, {title:res.fullName,icon:'edit',url:`/users/edit/${this.id}`}])

      return res
    }

  })

  readonly data=linkedSignal(()=>this.result.value() ?? {...InitialUser})
  readonly #http=inject(HttpClient)
  readonly #router=inject(Router)
  readonly #toast=inject(FlexiToastService)
  readonly loading=computed(()=>this.result.isLoading())
   readonly id=signal<string | undefined>(undefined)
    readonly #activate=inject(ActivatedRoute)
   readonly cardTitle=computed(()=>this.id() ? 'Kullanıcı Güncelle' : 'Kullanıcı Ekle')
   readonly btnName=computed(()=>this.id() ? 'Güncelle' : 'Kaydet')
   readonly breadcrumbs=signal<BreadcrumbModel[]>([
    {title:'Kullanıcılar',icon:'group',url:'/users'},
   
   ])
constructor(){
    this.#activate.params.subscribe(res=>{
      if(res["id"]){

        this.id.set(res["id"])
      }else
      {
        this.breadcrumbs.update(prev=>[...prev, {title:'Ekle',icon:'add',url:'/users/create'}])
      }
    })
  }
   save(form:NgForm){
if(!form.valid) return
this.data.update((prev)=>({...prev,fullName:`${prev.firstName} ${prev.lastName}`}))
if(!this.id()){

  this.#http.post(`api/users`,this.data()).subscribe()
  
  this.#router.navigateByUrl("/users")
  //this.#location.back() //gelmeden önceki sayfaya döner
  this.#toast.showToast("Kullanıcı Ekleme","Kullanıcı Eklendi","success")
  
}else{
  this.#http.put(`api/users/${this.id()}`,this.data()).subscribe()
  this.#router.navigateByUrl("/users")
  //this.#location.back() //gelmeden önceki sayfaya döner
  this.#toast.showToast("Kullanıcı Güncelleme","Kullanıcı Güncellendi","info")
}

}
}
