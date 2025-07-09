import { HttpClient, httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserModel } from '@shared/models/user.model';
import { Common } from 'apps/ui/src/services/common';
import { FlexiToastService } from 'flexi-toast';

@Component({
  imports: [RouterLink,FormsModule],
  templateUrl: './login.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Login {

  constructor(){
    
  }

  readonly #http=inject(HttpClient)
  readonly #toast=inject(FlexiToastService)
  readonly #router=inject(Router)
  readonly #common=inject(Common)
  

  signIn(form:NgForm){
    if(!form.valid) return
      this.#http.get<UserModel[]>(`api/users?userName=${form.value['userName']}&password=${form.value['password']} `).subscribe((res)=>{
        if(res.length==0){
          this.#toast.showToast("Giriş Başarısız","Kullanıcı bulunamadı","error")
          this.#router.navigateByUrl("/auth/login")

        }else{
          const user=res[0]
          localStorage.setItem("response",JSON.stringify(user))
          this.#common.user.set(user)  
          this.#common.getBasketCount()       
          this.#toast.showToast("Giriş Başarılı","Başarılı şekilde giriş yaptınız","success")
          this.#router.navigateByUrl("/")
         
        }
      })
  }

}
