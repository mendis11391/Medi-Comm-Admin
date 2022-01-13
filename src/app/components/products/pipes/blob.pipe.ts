import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

export interface specValues {
  spec_id?: number,
  spec_value?: string,
  status?: boolean
}

@Pipe({
  name: 'BlobImage',
  pure: true
})
export class BlobPipe implements PipeTransform {

    finalImage:any;
    constructor(private sanitizer: DomSanitizer) { }

    
  transform(value: any, args?: any): any {
    // if (!value) {
    //   return value;
    // }
    return this.blobImage(value);
  }


  blobImage(blob:any){
    var binary = '';
    var bytes = new Uint8Array( blob );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    let imageBlob = window.btoa(binary)
    // let objectURL = 'data:image/jpeg;base64,' + imageBlob;  
    let objectURL = 'data:image/jpeg;base64,' + blob;    
    // console.log(objectURL);   
    this.finalImage = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    // console.log(this.finalImage);
    return this.finalImage;
  }
}
