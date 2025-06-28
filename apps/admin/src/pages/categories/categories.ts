import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { FlexiGridModule } from 'flexi-grid';
import Blank from '../../components/blank';
import { HttpClient, httpResource } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { FlexiToastService } from 'flexi-toast';

export interface CategoryModel {
  id?:string
  name: string;
}

export const InitialCategory: CategoryModel = {
  name:"",
};
@Component({
  imports: [FlexiGridModule, Blank,RouterLink],
  templateUrl: './categories.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Categories {
  readonly result = httpResource<CategoryModel[]>(() => `api/categories`);
  readonly data = computed(() => this.result.value() ?? []);
  readonly loading = computed(() => this.result.isLoading());
  readonly #http = inject(HttpClient);
  readonly #toast=inject(FlexiToastService)

   delete(id:string){
    console.log(id)
  this.#toast.showSwal("Kategori Silme","Kategoriyi silmek istiyormu sunuz?","Evet",()=>{
    this.#http.delete(`api/categories/${id}`).subscribe(res=>{
      this.#toast.showToast("Kategori Silme","Kategori silindi","error")
        this.result.reload()
    })
  
  },"Vazgeç")
}
}
