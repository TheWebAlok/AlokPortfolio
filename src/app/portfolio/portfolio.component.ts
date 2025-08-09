import { Component, AfterViewInit, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Feedback } from '../shared/model/feedback/feedback.model';
import { FeedbackService } from '../shared/service/feedback/feedback.service';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '../shared/service/category/category.service';
import { Category } from '../shared/model/category/category.model';
import { DashboardService } from '../shared/service/dashboard/dashboard.service';
import { Dashboard } from '../shared/model/dashboard/dashboard.model';
import { Certificates } from '../shared/model/certificate/certificates.model';
import { CertificatesService } from '../shared/service/certificate/certificates.service';

declare var $: any;

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements AfterViewInit, OnInit {
  
  formData: Feedback = {
    fullName: '',
    email: '',
    feedback: '',
    rating: 0,
    createdAt: new Date()
  };

  feedbacks: Feedback[] = [];
  categories: Category[] = [];
  projects: Dashboard[] = [];
  certificatesList: Certificates[] = []; 

  contactName = '';
  contactEmail = '';
  contactMessage = '';
  submitting = false;
  submitResult = '';

  constructor(
    private feedbackService: FeedbackService,
    private toastr: ToastrService,
    private categoryService: CategoryService,
    private dashboardService: DashboardService,
    private certificatesService: CertificatesService
  ) {}

  ngOnInit(): void {
    this.feedbackService.getAllFeedbacks().subscribe(data => {
      this.feedbacks = data;
    });

    this.categoryService.getAllCategories().subscribe((data: Category[]) => {
      this.categories = data;
    });

    this.dashboardService.getAllProjects().subscribe((data: Dashboard[]) => {
      this.projects = data;
    });
    this.certificatesService.getAllCertificates().subscribe(data => {
      this.certificatesList = data;
    });
  }

  setRating(value: number) {
    this.formData.rating = value;
  }

  submitFeedback() {
    this.formData.createdAt = new Date();
    this.feedbackService.submitFeedback(this.formData)
      .then(() => {
        this.toastr.success('Thank you for your feedback!');
        this.formData = {
          fullName: '',
          email: '',
          feedback: '',
          rating: 0,
          createdAt: new Date()
        };
      })
      .catch(() => {
        this.toastr.error('Something went wrong. Try again!');
      });
  }

  formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date.seconds * 1000);
    return d.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  }

  ngAfterViewInit(): void {
    this.handleScroll();
    this.initOwlCarousel();
    this.initStarRating();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.handleScroll();
  }

  handleScroll(): void {
    const section = document.querySelector('#skill');
    if (!section) return;

    const sectionTop = section.getBoundingClientRect().top;
    const screenHeight = window.innerHeight;

    if (sectionTop < screenHeight - 100) {
      this.animateProgressBars();
    }
  }

  animateProgressBars(): void {
    const progressBars = document.querySelectorAll<HTMLElement>('.progress-animate');

    progressBars.forEach(bar => {
      const value = bar.getAttribute('data-value');
      if (value) {
        bar.style.transition = 'none';
        bar.style.width = '0%';
        void bar.offsetWidth;
        bar.style.transition = 'width 1s ease-in-out';
        bar.style.width = value + '%';
        bar.innerText = value + '%';
      }
    });
  }

  initOwlCarousel(): void {
    if ($('.owl-carousel').length) {
      $('.owl-carousel').owlCarousel({
        loop: true,
        margin: 10,
        nav: false,
        dots: true,
        autoplay: true,
        autoplayTimeout: 5000,
        responsive: {
          0: { items: 1 },
          576: { items: 2 },
          768: { items: 3 },
          992: { items: 4 }
        }
      });
    }
  }

  initStarRating(): void {
    const ratingGroups = document.querySelectorAll('#starRating, #starRatingBottom');
    ratingGroups.forEach(group => {
      const stars = group.querySelectorAll('i');
      stars.forEach((star, index) => {
        star.addEventListener('click', () => {
          stars.forEach((s, i) => {
            s.classList.remove('bi-star-fill');
            s.classList.add('bi-star');
            if (i <= index) s.classList.replace('bi-star', 'bi-star-fill');
          });
          this.setRating(index + 1);
        });
      });
    });
  }

  getColor(index: number): string {
    const colors = [
      '#6f42c1',
      '#0d6efd',
      '#198754',
      '#fd7e14',
      '#dc3545',
      '#20c997',
      '#6610f2',
      '#ffc107',
      '#6c757d',
    ];
    return colors[index % colors.length];
  }

botCheck = false;
accessKey = '6bf81fcb-a6f8-4434-8bdf-b8dc45080e44';

submitContactForm() {
  if (this.botCheck) return;

  this.submitting = true;
  this.submitResult = 'Please wait...';

  const payload = {
    access_key: this.accessKey,
    name: this.contactName,
    email: this.contactEmail,
    message: this.contactMessage
  };

  fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(async (response) => {
      let json = await response.json();
      if (response.status === 200) {
        this.submitResult = 'Form submitted successfully';
      } else {
        this.submitResult = json.message;
      }
    })
    .catch(() => {
      this.submitResult = 'Something went wrong!';
    })
    .finally(() => {
      this.submitting = false;
      this.contactName = '';
      this.contactEmail = '';
      this.contactMessage = '';
      setTimeout(() => {
        this.submitResult = '';
      }, 3000);
    });
}

// subscribe--------------

}
