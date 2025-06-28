import { ChangeDetectionStrategy, Component, computed, inject, ViewEncapsulation } from '@angular/core';
import Blank from '../../components/blank';
import { HttpClient, httpResource } from '@angular/common/http';
import { FlexiGridModule } from 'flexi-grid';
import { RouterLink } from '@angular/router';
import { FlexiToastService } from 'flexi-toast';

export interface UserModel{
  id?:string
  firstName:string
  lastName:string
  fullName:string
  userName:string
  email:string
  password:string
  isAdmin:boolean
}

export const InitialUser:UserModel={
  firstName:"",
  lastName:"",
 fullName:"",
  userName:"",
  email:"",
  password:"",
  isAdmin:false
}

@Component({
  imports: [Blank,FlexiGridModule,RouterLink],
  templateUrl: './users.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Users {

  readonly result=httpResource<UserModel[]>(()=>"api/users")
  readonly data=computed(()=>this.result.value() ?? [])
  readonly loading=computed(()=>this.result.isLoading())
  readonly #toast=inject(FlexiToastService)
  readonly #http=inject(HttpClient)
  delete(id:string){
this.#toast.showSwal("Kullanıcı Silme","Kullanıcıyı silmek istiyormusun","Evet",()=>{
this.#http.delete(`api/users/${id}`).subscribe(()=>{
  this.#toast.showToast("Kullanıcı Silme","Kullanıcı silindi","info")
  this.result.reload()
})
},"Vazgeç")
  }
}
