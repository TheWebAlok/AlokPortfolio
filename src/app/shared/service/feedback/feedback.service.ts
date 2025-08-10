import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  CollectionReference,
  DocumentData,
  query,
  orderBy
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Feedback } from '../../model/feedback/feedback.model';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private feedbackCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.feedbackCollection = collection(this.firestore, 'workshopFeedback');
  }

  submitFeedback(data: Feedback) {
    return addDoc(this.feedbackCollection, {
      ...data,
      createdAt: new Date()
    });
  }

  getAllFeedbacks(): Observable<Feedback[]> {
    const feedbackQuery = query(
      this.feedbackCollection,
      orderBy('createdAt', 'desc')
    );

    return collectionData(feedbackQuery, {
      idField: 'id'
    }) as Observable<Feedback[]>;
  }
}
