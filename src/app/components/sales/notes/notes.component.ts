import { Component, OnInit } from '@angular/core';
import { ExcelService } from '../services/excel.service';
import { HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {

  notes:any;
  datasource:any[];
  loading: boolean;
  totalRecords: number;
  selectedOrders:any[];
  cols: any[];
  exportColumns: any[];

  constructor(private excelService:ExcelService,private http: HttpClient) { }

  ngOnInit(): void {
    this.getAllNotes();
  }

  exportAsXLSX():void {
    this.excelService.exportAsExcelFile(this.notes, 'Notes');
  }

  getAllNotes(){
    this.http.get(`http://localhost:3000/admin/getAllNotes`).subscribe((notes)=>{
      this.notes = notes;
      this.notes.forEach(
        item => (item.created_at = new Date(item.created_at))
      );
    })
  }

}
