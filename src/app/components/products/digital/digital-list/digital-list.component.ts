import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { digitalListDB } from 'src/app/shared/tables/digital-list';
import { BehaviorSubject, Observable, of, Subscriber} from 'rxjs';
import { Product } from '../../../../shared/tables/product';
import { ProductService } from '../../services/product.service';
import { ExcelService } from 'src/app/components/sales/services/excel.service';
import { Role } from 'src/app/components/auth/user';

@Component({
  selector: 'app-digital-list',
  templateUrl: './digital-list.component.html',
  styleUrls: ['./digital-list.component.scss']
})
export class DigitalListComponent implements OnInit {
  public productsList;
  public filteredProducts=[];
  Role = Role;

  constructor(private excelService:ExcelService,private list:ProductService, private router:Router) {
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
      prod_name: {
        title: 'prod_name',
      },
      brand_name: {
        title: 'brand_name',
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
      this.productsList = res;
      this.filteredProducts=this.productsList;
    }, error => {
      if (error.status === 401) {
        this.router.navigate(['/auth/login']);
      } else if(error.status === 403) {
        alert('session expired');
      }
    });
  }


  onEdit(id) {
    this.router.navigate(['products/digital/digital-edit-product/'+id]);
  }

  onDelete(id) {
    this.list.deleteProduct(id)
      .subscribe(res => {
        this.loadProducts();
        }, (err) => {
          if (err.status === 401) {
            this.router.navigate(['/auth/login']);
          }
        }
      );
  }

  filterproducts(e){
    if(e=='All products'){
      this.filteredProducts=this.productsList;
    } else if(e=='Laptops'){
      this.filteredProducts=this.productsList.filter(item => item.cat_name=='Laptops');
    } else if(e=='Desktops'){
      this.filteredProducts=this.productsList.filter(item => item.cat_name=='Desktops');
    } else if(e=='Camera'){
      this.filteredProducts=this.productsList.filter(item => item.cat_name=='Camera');
    }
  }

  exportAsXLSX():void {
    this.excelService.exportAsExcelFile(this.filteredProducts, 'Products');
  }

}
