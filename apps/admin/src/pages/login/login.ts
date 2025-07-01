import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserModel } from '@shared/models/user.model';
import { FlexiToastService } from 'flexi-toast';

@Component({
  imports: [FormsModule],
  templateUrl: './login.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Login {
  readonly #http=inject(HttpClient)
  readonly #router=inject(Router)
  readonly #toast=inject(FlexiToastService)

  signIn(form:NgForm){
    if(!form.valid) return
    const endpoint=`api/users?userName=${form.value["userName"]}&&password=${form.value["password"]}`
    this.#http.get<UserModel[]>(endpoint).subscribe(res=>{
      if(res.length==0){
        this.#toast.showToast("Hata","Giriş Bilgileriniz hatalı","error")
      }
      else if(!res[0].isAdmin){
 this.#toast.showToast("Hata","Admin paneline giriş yetkiniz yok","error")
      }
      else{
        
        localStorage.setItem("response",JSON.stringify(res[0]))
        this.#router.navigateByUrl("/")
      }
    })
  }

}
