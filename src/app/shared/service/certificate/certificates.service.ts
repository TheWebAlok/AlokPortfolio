import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { Certificates } from '../../model/certificate/certificates.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CertificatesService {
  private cloudName = "druradiv9";
  private uploadPreset = "maaCompturePress";
  private uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

  constructor(private firestore: Firestore, private http: HttpClient) {}

  // ✅ Cloudinary me image upload
  uploadImageToCloudinary(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    return this.http.post<any>(this.uploadUrl, formData);
  }

  // ✅ Firestore me certificate save
  saveCertificateData(data: Certificates) {
    const certificateRef = collection(this.firestore, 'certificates');
    return addDoc(certificateRef, data);
  }

  // ✅ Firestore se saare certificates fetch
  getAllCertificates(): Observable<any[]> {
    const certificateRef = collection(this.firestore, 'certificates');
    return collectionData(certificateRef, { idField: 'id' });
  }
}
