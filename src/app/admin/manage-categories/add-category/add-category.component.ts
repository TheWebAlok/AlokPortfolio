import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { Category } from '../../../shared/model/category/category.model';
import { CategoryService } from '../../../shared/service/category/category.service';
import { CloudinaryService } from '../../../shared/service/cloudinary/cloudinary.service';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css'
})
export class AddCategoryComponent {

  categoryObj: Category = {
    categoryName: '',
    description: '',
    videoURL: '',
    status: true,
    createdAt: new Date()
  };

  selectedFile: File | null = null;

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private cloudinaryService: CloudinaryService
  ) {}

  uploadFile(event: any) {
    this.selectedFile = event.target.files[0];
  }

  submit() {
    if (!this.selectedFile) {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Please select a video file.'
      });
      return;
    }

    Swal.fire({
      title: 'Uploading...',
      text: 'Please wait while the video is uploading.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.cloudinaryService.uploadVideo(this.selectedFile).subscribe(
      (res: any) => {
        this.categoryObj.videoURL = res.secure_url;

        this.categoryService.addCategory(this.categoryObj)
          .then(() => {
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Category added successfully.',
              confirmButtonText: 'OK'
            }).then(() => {
              this.router.navigateByUrl("/admin/category/manage");
            });
          })
          .catch((err: any) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error saving category.'
            });
            console.error(err);
          });
      },
      (err: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Upload Failed',
          text: 'Video upload failed. Please try again.'
        });
        console.error(err);
      }
    );
  }
}
