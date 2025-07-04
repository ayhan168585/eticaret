import { Injectable, signal } from '@angular/core';
import { BreadcrumbModel } from '../pages/layouts/breadcrumb';
import { UserModel } from '@shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class Common {
  readonly data= signal<BreadcrumbModel[]>([])
  readonly user=signal<UserModel | undefined>(undefined)

  constructor(){
     const response:string | null=localStorage.getItem("response")
    if(response){
      this.user.set(JSON.parse(response))
    }
  }
 

  set(data: BreadcrumbModel[]) {
   const val: BreadcrumbModel = {
      title: "Ana Sayfa",
      icon: "home",
      url: "/"
    }
    this.data.set([val,...data])

  }
}
