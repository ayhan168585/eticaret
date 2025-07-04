import { ChangeDetectionStrategy, Component, ViewEncapsulation,inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {FormsModule, NgForm} from '@angular/forms'
import { HttpClient } from '@angular/common/http';
import {InitialUser, UserModel} from '@shared/models/user.model'
import { FlexiToastService } from 'flexi-toast';

@Component({
  imports: [RouterLink,FormsModule],
  templateUrl: './register.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Register {
  readonly #http=inject(HttpClient)
  readonly data=signal<UserModel>(InitialUser)
  readonly #toast=inject(FlexiToastService)
  readonly #router=inject(Router)

  signUp(form:NgForm){
    if(!form.valid) return

    this.data.update(prev=>({
      ...prev,
      fullName:`${prev.firstName} ${prev.lastName} `,
    }))
    this.#http.post("api/users",this.data()).subscribe((res)=>{
      this.#toast.showToast("Kayıt Başarılı","Başarılı bir şekilde kayıt oldunuz.Giriş yapabilirsiniz","success")
      this.#router.navigateByUrl("/auth/login")
    })

  }

}
