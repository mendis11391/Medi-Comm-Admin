import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { digitalListDB } from 'src/app/shared/tables/digital-list';
import { BehaviorSubject, Observable, of, Subscriber} from 'rxjs';
import { Product } from '../../../../shared/tables/product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-digital-list',
  templateUrl: './digital-list.component.html',
  styleUrls: ['./digital-list.component.scss']
})
export class DigitalListComponent implements OnInit {
  public products_list;

  constructor(private list:ProductService, private router:Router) {
  }

  public settings = {
    actions: {
      columnTitle: 'Actions',
      position: 'right'
    },
    edit: {
      confirmSave: true,
    },
    delete: {
      confirmDelete: false,
    },
    columns: {
      prod_id: {
        title: 'prod_id',
      },
      title: {
        title: 'Product Title',
      },
      brand: {
        title: 'Brand',
      },
      status: {
        title: 'Status',
      },
      // Actions: //or something
      // {
      //   title:'Actions',
      //   type:'html',
      //   valuePrepareFunction:(cell,row)=>{
      //     return `<a  "href="digital/digital-edit-product/${row.prod_id}"><i class="fa fa-pencil"></i></a>`;
      //   },
      //   filter:false       
      // }      
    },
  };

  ngOnInit() { 
    this.loadProducts();
  }

  loadProducts() {
    this.list.getProducts().subscribe(res => {
      this.products_list = res;
    }, error => {
      console.log("test" + error);
      if (error.status === 401) {
        this.router.navigate(['/auth/login']);
      }
    });
  }


  onEdit(id) {
    this.router.navigate(['digital/digital-edit-product/'+id]);
  }

  onDelete(id) {
    this.list.deleteProduct(id)
      .subscribe(res => {
        this.loadProducts();
        }, (err) => {
          console.log(err);
        }
      );
  }

  

}
