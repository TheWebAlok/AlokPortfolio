import { Component } from '@angular/core';
import { DashboardService } from '../../../shared/service/dashboard/dashboard.service';
import { Dashboard } from '../../../shared/model/dashboard/dashboard.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  projectName: string = '';
  description: string = '';
  projectLink: string = '';
  selectedFile: File | null = null;
  isUploading: boolean = false;

  constructor(private dashboardService: DashboardService) {}

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.selectedFile = file ? file : null;
  }

 uploadProject() {
  if (!this.projectName || !this.description || !this.projectLink || !this.selectedFile) {
    Swal.fire({
      icon: 'warning',
      title: 'Missing Fields',
      text: 'Please fill in all details before uploading.',
      confirmButtonColor: '#3085d6'
    });
    return;
  }

  this.isUploading = true;

  this.dashboardService.uploadImageToCloudinary(this.selectedFile).subscribe({
    next: (response: any) => {
      const imageURL = response.secure_url;

      const projectData: Dashboard = {
        projectName: this.projectName,
        description: this.description,
        projectLink: this.projectLink,
        imageURL: imageURL,
        createdAt: new Date()
      };

      this.dashboardService.saveProjectData(projectData).then(() => {
        this.projectName = '';
        this.description = '';
        this.projectLink = '';
        this.selectedFile = null;
        this.isUploading = false;

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Project uploaded successfully!',
          confirmButtonColor: '#28a745',
          timer: 2000,
          showConfirmButton: false
        });
      });
    },
    error: (error) => {
      this.isUploading = false;
      console.error('Upload failed:', error);

      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: 'Something went wrong. Please try again.',
        confirmButtonColor: '#d33'
      });
    }
  });
}

}
