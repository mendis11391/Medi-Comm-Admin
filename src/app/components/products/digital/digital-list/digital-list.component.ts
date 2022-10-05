import { Component, OnInit, Directive  } from '@angular/core';
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
  categories:any;
  public temp = [];

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
    this.getAllCategories();
  }

  loadProducts() {
    this.list.getAllProductsLite().subscribe(res => {
      this.productsList = res;
      this.filteredProducts=this.productsList;
      console.log(this.filteredProducts)
    }, error => {
      if (error.status === 401) {
        this.router.navigate(['/auth/login']);
      } else if(error.status === 403) {
        alert('session expired');
      }
    });
  }

  getAllCategories(){
    this.list.getAllCategories().subscribe((res)=>{
      this.categories = res[0];
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
    if(e=='All'){
      this.filteredProducts=this.productsList;
    } else{
      this.filteredProducts=this.productsList.filter(item => item.cat_id==e);
    }
  }

  exportAsXLSX():void {
    this.excelService.exportAsExcelFile(this.filteredProducts, 'Products');
  }

  updateFilter(event) {
    this.temp=this.productsList;
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.prod_id.toLowerCase().indexOf(val) !== -1 || d.prod_name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.filteredProducts = temp;
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }

}
