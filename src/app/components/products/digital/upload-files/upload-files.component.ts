import { Component, OnInit, ElementRef, Input, Directive  } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, FormArray, Validators } from  '@angular/forms';
import { HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

const URL = `${environment.apiUrl}/products/upload/`;

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.scss']
})
export class UploadFilesComponent implements OnInit {
  categories;

  constructor(private router: Router,
    private http: HttpClient,
    private el: ElementRef,
    private formBuilder: UntypedFormBuilder,
    private category:ProductService) { }

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories() {
    this.category.getAllCategories().subscribe(res => {
      this.categories=res;
    });
  }

  upload() {
    //locate the file element meant for the file upload.
        let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#product_image');
    //get the total amount of files attached to the file input.
        let fileCount: number = inputEl.files.length;
    //create a new fromdata instance
        let formData = new FormData();
    //check if the filecount is greater than zero, to be sure a file was selected.
        if (fileCount > 0) { // a file was selected
            //append the key name 'photo' with the first file in the element
            formData.append('product_image', inputEl.files.item(0));
            //call the angular http method
            this.http.post(URL, formData).subscribe(
                 (success) => {
                         alert(JSON.stringify(success));
                });
        }
  }

}
