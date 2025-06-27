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
  readonly result = httpResource<CategoryModel[]>(() => 'http://localhost:3000/categories');
  readonly data = computed(() => this.result.value() ?? []);
  readonly loading = computed(() => this.result.isLoading());
  readonly #http = inject(HttpClient);
  readonly #toast=inject(FlexiToastService)

   delete(id:string){
    console.log(id)
  this.#toast.showSwal("Kategori Silme","Kategoriyi silmek istiyormu sunuz?","Evet",()=>{
    this.#http.delete(`http://localhost:3000/categories/${id}`).subscribe(res=>{
      this.#toast.showToast("Kategori Silme","Kategori silindi","error")
        this.result.reload()
    })
  
  },"Vazgeç")
}
}
