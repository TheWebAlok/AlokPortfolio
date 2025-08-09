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
  private feedbackCollection!: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.feedbackCollection = collection(this.firestore, 'workshopFeedback');
  }

  // 🔸 Add feedback with timestamp
  submitFeedback(data: Feedback) {
    return addDoc(this.feedbackCollection, {
      ...data,
      createdAt: new Date()  // or use serverTimestamp() if preferred
    });
  }

  // 🔸 Get all feedbacks, latest first
  getAllFeedbacks(): Observable<Feedback[]> {
    const feedbackQuery = query(
      this.feedbackCollection,
      orderBy('createdAt', 'desc') // latest first
    );

    return collectionData(feedbackQuery, {
      idField: 'id'
    }) as Observable<Feedback[]>;
  }
}
