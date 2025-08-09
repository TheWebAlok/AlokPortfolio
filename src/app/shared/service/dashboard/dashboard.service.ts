import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { Dashboard } from '../../model/dashboard/dashboard.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private cloudName = "druradiv9";
  private uploadPreset = "maaCompturePress";
  private uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

  constructor(private firestore: Firestore, private http: HttpClient) {}

  uploadImageToCloudinary(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    return this.http.post<any>(this.uploadUrl, formData);
  }

  saveProjectData(data: Dashboard) {
    const projectRef = collection(this.firestore, 'projects');
    return addDoc(projectRef, data);
  }

    // ✅ Fetch all uploaded projects
  getAllProjects(): Observable<any[]> {
    const projectRef = collection(this.firestore, 'projects');
    return collectionData(projectRef, { idField: 'id' });
  }
}
