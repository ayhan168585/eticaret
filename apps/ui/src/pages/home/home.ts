import { HttpClient, httpResource } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  Signal,
  signal,
  untracked,
  ViewEncapsulation,
} from '@angular/core';
import { ProductModel } from '@shared/models/product.model';
import { TrCurrencyPipe } from 'tr-currency';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Common } from '../../services/common';
import {BasketModel} from '@shared/models/basket.model'
import { FlexiToastService } from 'flexi-toast';

@Component({
  selector: 'app-home',
  imports: [TrCurrencyPipe, InfiniteScrollDirective,RouterLink],
  templateUrl: './home.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Home {
  readonly user=computed(()=>this.#common.user())
  readonly #common=inject(Common)
  readonly limit = signal<number>(6);
  readonly start = signal<number>(0);
  readonly result = httpResource<ProductModel[]>(() => {
    let endpoint = 'api/products?'
    if (this.categoryUrl()) {
      endpoint += `categoryUrl=${this.categoryUrl()}&`;
    }
    endpoint += `_limit=${this.limit()}&_start=${this.start()}`;

    return endpoint;
  });
 
  readonly placeHolderCount=signal<number[]>([1,2,3])
  readonly categoryUrl = signal<string | undefined>(undefined);
  readonly categoryUrlPrev = this.computedPrevious(this.categoryUrl);
  readonly data = computed(() => this.result.value() ?? []);
  readonly loading=computed(()=>this.result.isLoading())
  readonly dataSignal = signal<ProductModel[]>([]);
  readonly #activated = inject(ActivatedRoute);
  readonly #http=inject(HttpClient)
  readonly #toast=inject(FlexiToastService)

  constructor() {
   this.#activated.params.subscribe(res => {
      if (res['categoryUrl']) {
        this.categoryUrl.set(res['categoryUrl']);
      }
    });

    effect(() => {
      this.dataSignal.update(prev => [...prev, ...this.data()]);
      if (this.categoryUrlPrev() !== this.categoryUrl()) {
        this.dataSignal.set([...this.data()]);
        this.limit.set(6);
        this.start.set(0);
      } else {
        this.dataSignal.update(prev => [...prev, ...this.data()]);
      }
    })
  }

  onScroll() {
    if(this.start()>=0) return //Gelen ürün sayısının alınıp burada verilmesi gerekiyor ama json-server da böyle bir özellik olmadığından titremeyi engellemek için scrrool özelliğini kapatan 0 değerini veriyoruz.
    this.limit.update((prev) => prev + 6);
    this.start.update((prev) => prev + 6);
  }
   computedPrevious<T>(s: Signal<T>): Signal<T> {
    let current = null as T;
    let previous = untracked(() => s());

    return computed(() => {
      current = s();
      const result = previous;
      previous = current;
      return result;
    });
  }

  addBasket(data:ProductModel){
    const basket:BasketModel={
      userId:this.#common.user()!.id!,
      productId:data.id!,
      productName:data.name,
      productPrice:data.price,
      productImageUrl:data.imageUrl,
      quantity:1
    }
    this.#http.post("api/baskets",basket).subscribe((res)=>{
      this.#toast.showToast("Sepete Ekleme","Ürün sepete eklendi","success")
      this.#common.basketCount.update(prev=>prev+1)
    })
  }
}

