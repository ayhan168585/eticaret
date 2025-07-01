import { ChangeDetectionStrategy, Component, computed, inject, ViewEncapsulation } from '@angular/core';
import Blank from '../../components/blank';
import { HttpClient, httpResource } from '@angular/common/http';
import { FlexiGridModule } from 'flexi-grid';
import { RouterLink } from '@angular/router';
import { FlexiToastService } from 'flexi-toast';
import { FormsModule } from '@angular/forms';
import { UserModel } from '@shared/models/user.model'



@Component({
  imports: [Blank,FlexiGridModule,RouterLink,FormsModule],
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

  changeIsAdmin(data:UserModel){
    const yetki=computed(()=>data.isAdmin==true ? 'Admin' : 'Normal Kullanıcı')
      this.#toast.showSwal("Yetki Değişikliği",`${data.fullName}'in yetkisini değiştirmek istiyormusunuz`,"Değiştir",()=>{
         this.#http.put(`api/users/${data.id}`,data).subscribe(()=>{
      
           this.#toast.showToast("Yetki Değişikliği",`${data.fullName} ${yetki()} yetkisine değiştirildi.`,"info")
            this.result.reload()
               })
    
     
    },"Vazgeç")
     this.result.reload()
   
  }
}
