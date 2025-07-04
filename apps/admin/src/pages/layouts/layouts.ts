import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  linkedSignal,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import Breadcrumb from './breadcrumb';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterModule,
} from '@angular/router';
import { navigations } from '../../navigation';
import { NavPipe } from '../../pipes/nav-pipe';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Common } from '../../services/common';

@Component({
  imports: [
    Breadcrumb,
    RouterLink,
    RouterLinkActive,
    NavPipe,
    FormsModule,
    DatePipe,
    RouterModule,
  ],
  templateUrl: './layouts.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Layouts {
  readonly search = signal<string>('');
  readonly time = signal<Date | string>('');
  readonly navigations = computed(() => navigations);
  readonly #router = inject(Router);
  readonly #common = inject(Common);
  readonly user = linkedSignal(() => this.#common.user()!);

  constructor() {
    setInterval(() => {
      this.time.set(new Date());
    }, 1000);
  }
  logout() {
    localStorage.clear();
    this.#common.user.set(undefined);
    this.#router.navigateByUrl('/login');
  }
}
