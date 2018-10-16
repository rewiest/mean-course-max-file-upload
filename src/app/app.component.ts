import { Component } from '@angular/core';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  selectedFile: File = null;
  selectedFilename = null;

  constructor(private http: HttpClient) {}

  onFileSelected(event) {
    console.log(event);
    this.selectedFile = <File>event.target.files[0];
    this.selectedFilename = this.selectedFile.name;
  }

  onUpload() {
    const form = new FormData;
    form.append('image', this.selectedFile, this.selectedFile.name);
    this.http.post('http://localhost:3000/api/fileupload', form, {
      reportProgress: true,
      observe: 'events'
    })
    .subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        console.log('Upload Progress: ' + Math.round(event.loaded / event.total * 100) + '%');
      } else if (event.type === HttpEventType.Response) {
        console.log(event);
        console.log(event.body);
      }
    });
  }
}
