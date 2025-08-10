import { Injectable, inject, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { Firestore, collection, CollectionReference, DocumentData, collectionData, query, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Feedback } from '../../model/feedback/feedback.model';
import { addDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private feedbackCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore, private environmentInjector: EnvironmentInjector) {
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

  return runInInjectionContext(this.environmentInjector, () => {
    return collectionData(feedbackQuery, { idField: 'id' }) as Observable<Feedback[]>;
  });
}
}
