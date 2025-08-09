import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Certificates } from '../../../shared/model/certificate/certificates.model';
import Swal from 'sweetalert2';
import { CertificatesService } from '../../../shared/service/certificate/certificates.service';

@Component({
  selector: 'app-certificates',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.css']
})
export class CertificatesComponent implements OnInit {

  certificatesName: string = '';
  description: string = '';
  certificateLink: string = '';
  selectedFile: File | null = null;
  isUploading: boolean = false;

  // 🔹 Ye wala tum pooch rahe ho
  certificatesList: Certificates[] = [];

  constructor(private certificatesService: CertificatesService) {}

  ngOnInit() {
    this.certificatesService.getAllCertificates().subscribe(data => {
      this.certificatesList = data;
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.selectedFile = file ? file : null;
  }

  uploadCertificate() {
    if (!this.certificatesName || !this.description || !this.certificateLink || !this.selectedFile) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please fill in all details before uploading.',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    this.isUploading = true;

    this.certificatesService.uploadImageToCloudinary(this.selectedFile).subscribe({
      next: (response: any) => {
        const imageURL = response.secure_url;

        const certificateData: Certificates = {
          certificatesName: this.certificatesName,
          description: this.description,
          certificateLink: this.certificateLink,
          imageURL: imageURL,
          createdAt: new Date()
        };

        this.certificatesService.saveCertificateData(certificateData).then(() => {
          this.certificatesName = '';
          this.description = '';
          this.certificateLink = '';
          this.selectedFile = null;
          this.isUploading = false;

          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Certificate uploaded successfully!',
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
