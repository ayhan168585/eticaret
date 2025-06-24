import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import Blank from "../../components/blank";
import { FlexiGridModule } from 'flexi-grid';

export interface ProductModel{
  id?:string
  name:string
  imageUrl:string
  price:number
  stock:number
}

@Component({
  imports: [Blank,FlexiGridModule],
  templateUrl: './products.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Products {
  readonly data=signal<ProductModel[]>([
    {
      
      imageUrl:'https://m.media-amazon.com/images/I/81-hBEU+ZdL._AC_SX679_.jpg',
      name:'IPhone 15 Pro',
      price:75000,
      stock:50
    }
  ])
}
