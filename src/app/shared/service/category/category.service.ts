import { Injectable } from '@angular/core';
import { Firestore, collection, CollectionReference, DocumentData, collectionData, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Category } from '../../model/category/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly collectionPath = 'categories';
  private categoryRef: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    // Firestore collection reference create करें DI से inject किए firestore से
    this.categoryRef = collection(this.firestore, this.collectionPath);
  }

  addCategory(category: Category): Promise<any> {
    // addDoc AngularFire firestore instance के साथ सही काम करता है
    return addDoc(this.categoryRef, { ...category });
  }

  getAllCategories(): Observable<Category[]> {
    // यहाँ categoryRef इस्तेमाल करें, ताकि collectionData DI context में रहे
    return collectionData(this.categoryRef, { idField: 'id' }) as Observable<Category[]>;
  }
}
