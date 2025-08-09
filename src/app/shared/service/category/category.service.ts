import { Injectable } from '@angular/core';
import { Firestore, collection, CollectionReference, DocumentData, collectionData } from '@angular/fire/firestore';
import { addDoc } from 'firebase/firestore';
import { Category } from '../../model/category/category.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private dbPath = '/categories';
  private categoryRef: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.categoryRef = collection(this.firestore, this.dbPath);
  }

  addCategory(categoryObj: Category) {
    return addDoc(this.categoryRef, { ...categoryObj });
  }

  getAllCategories(): Observable<Category[]> {
    const categoryCollection = collection(this.firestore, 'categories');
    return collectionData(categoryCollection, { idField: 'id' }) as Observable<Category[]>;
  }
}
