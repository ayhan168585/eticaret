import { httpResource } from '@angular/common/http';
import { AfterViewInit, ChangeDetectionStrategy, Component, computed, inject, ViewEncapsulation } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CategoryModel } from '@shared/models/category.model'
import { Common } from '../../services/common';

@Component({
  imports: [RouterLink, RouterOutlet],
  templateUrl: './layouts.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Layouts implements AfterViewInit {
  ngAfterViewInit(): void {
    this.#common.getBasketCount()
  }
  readonly result=httpResource<CategoryModel[]>(()=>"api/categories")
  readonly data=computed(()=>this.result.value()?? [])
  readonly #router=inject(Router)

  readonly user=computed(()=>this.#common.user())
  readonly #common=inject(Common)
  readonly basketCount=computed(()=>this.#common.basketCount())

  logout(){
    localStorage.clear()
    this.#common.user.set(undefined)
    this.#common.basketCount.set(0)
    this.#router.navigateByUrl("/auth/login")

  }

}