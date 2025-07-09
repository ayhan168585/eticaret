import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  linkedSignal,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { Common } from '../../services/common';
import { HttpClient, httpResource } from '@angular/common/http';
import { BasketModel } from '@shared/models/basket.model';
import { TrCurrencyPipe } from 'tr-currency';
import { FlexiToastService } from 'flexi-toast';
import { RouterLink } from '@angular/router';

@Component({
  imports: [TrCurrencyPipe,RouterLink],
  templateUrl: './baskets.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Baskets {
  readonly #common = inject(Common);
  readonly result = httpResource<BasketModel[]>(() => {
    const endpoint = `api/baskets?userId=${this.#common.user()?.id}`;
    return endpoint;
  });
  readonly data = computed(() => this.result.value() ?? []);
  readonly kdv = computed(() => (this.total() * 18) / 100);
  readonly kargom = signal<number>(40);
  readonly kargo = linkedSignal(() => this.kargom());
  readonly #http = inject(HttpClient);
  readonly #toast = inject(FlexiToastService);

  readonly total = computed(() => {
    let val = 0;

    this.data().forEach((res) => {
      val += res.productPrice * res.quantity;
    });
    return val;
  });

  increment(val: BasketModel) {
    val.quantity++;
    this.#http.put(`api/baskets/${val.id}`, val).subscribe(() => {
      this.result.reload();
      this.#common.getBasketCount();
    });
  }

  decrement(val: BasketModel) {
    const count = val.quantity - 1;

    if (count <= 0) {
      this.#toast.showSwal(
        'Sepetten Silme',
        'Ürünü sepetten kaldırmak istediğine eminmisin',
        'Evet',
        () => {
          this.#toast.showToast(
            'Sepetten ürün silme',
            'Ürün sepetten kaldırıldı',
            'info'
          );
          this.#http.delete(`api/baskets/${val.id}`).subscribe(() => {
            this.result.reload();
            this.#common.getBasketCount();
          });
        },
        'Vazgeç'
      );
    } else {
      val.quantity--;
      this.#http.put(`api/baskets/${val.id}`, val).subscribe(() => {
        this.result.reload();
        this.#common.getBasketCount();
      });
    }
  }
}
