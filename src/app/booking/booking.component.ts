import { Component, OnInit, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { BookingService, Booking } from '../services/booking.service';
import { AuthService } from '../services/auth.service';
import { format } from 'date-fns';
import { 
  trigger, 
  transition, 
  style, 
  animate, 
  state, 
  query, 
  stagger, 
  animateChild, 
  group 
} from '@angular/animations';

interface TimeSlot {
  hour: string;
  available: boolean;
  isBooked?: boolean;
}

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
}

interface HistoryFilter {
  startDate: string;
  endDate: string;
}

interface SuggestionInfo {
  hasBooking: boolean;
  date: string;
  services: string[];
}

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
  animations: [
    trigger('modalContainer', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('modalContent', [
      transition(':enter', [
        style({ 
          opacity: 0,
          transform: 'scale(0.95) translateY(10px)'
        }),
        animate('300ms ease-out', style({ 
          opacity: 1,
          transform: 'scale(1) translateY(0)'
        }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ 
          opacity: 0,
          transform: 'scale(0.95) translateY(10px)'
        }))
      ])
    ]),
    trigger('modalBackdrop', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class BookingComponent implements OnInit {
  bookingForm: FormGroup;
  selectedDate: Date = new Date();
  minDate: string;
  maxDate: string;
  availableTimeSlots: TimeSlot[] = [];
  userBookings: Booking[] = [];
  loading = false;
  errorMessage = '';
  showCancelModal = false;
  showChangeServiceModal = false;
  showPhoneContactModal = false;
  selectedBookingId: string | null = null;
  selectedBookingForChange: Booking | null = null;
  isSunday = false;
  
  services: Service[] = [
    {
      id: 'corte',
      name: 'Cortes',
      description: 'Cortes modernos e personalizados para todos os tipos de cabelo',
      duration: 60,
      price: 80
    },
    {
      id: 'coloracao',
      name: 'Coloração',
      description: 'As últimas tendências em cores e técnicas de mechas',
      duration: 120,
      price: 150
    },
    {
      id: 'tratamentos',
      name: 'Tratamentos',
      description: 'Hidratação, reconstrução e tratamentos capilares especializados',
      duration: 90,
      price: 120
    },
    {
      id: 'penteados',
      name: 'Penteados',
      description: 'Penteados para festas, casamentos e ocasiões especiais',
      duration: 90,
      price: 100
    }
  ];

  showHistoryModal = false;
  historyFilter: HistoryFilter = {
    startDate: '',
    endDate: ''
  };
  historyBookings: Booking[] = [];
  selectedHistoryBooking: Booking | null = null;
  showHistoryDetailModal = false;

  suggestionInfo: SuggestionInfo | null = null;
  showSuggestionModal = false;

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private authService: AuthService
  ) {
    const today = new Date();
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(today.getMonth() + 1);
    
    this.minDate = today.toISOString().split('T')[0];
    this.maxDate = oneMonthFromNow.toISOString().split('T')[0];

    this.bookingForm = this.fb.group({
      service: ['', Validators.required],
      date: ['', Validators.required],
      time: [{ value: '', disabled: true }, Validators.required]
    });

    this.generateTimeSlots();

    this.bookingForm.get('date')?.valueChanges.subscribe(date => {
      const timeControl = this.bookingForm.get('time');
      if (date) {
        timeControl?.enable();
      } else {
        timeControl?.disable();
      }
    });
  }

  ngOnInit(): void {
    this.loadUserBookings();
    this.loadExistingBookings();
    
    const dateInput = document.querySelector('input[type="date"]');
    if (dateInput) {
      dateInput.addEventListener('change', (e: Event) => {
        const target = e.target as HTMLInputElement;
        const [year, month, day] = target.value.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        const formattedDate = date.toLocaleDateString('pt-BR');
        target.setAttribute('data-date', formattedDate);
      });
    }
  }

  generateTimeSlots(): void {
    const slots: TimeSlot[] = [];
    const startHour = 9;
    const endHour = this.isWeekend(this.selectedDate) ? 18 : 20;

    for (let hour = startHour; hour < endHour; hour++) {
      slots.push({ 
        hour: `${hour}:00`, 
        available: true,
        isBooked: false
      });
      slots.push({ 
        hour: `${hour}:30`, 
        available: true,
        isBooked: false
      });
    }

    this.availableTimeSlots = slots;
  }

  isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 5;
  }

  isSundayClosed(date: Date): boolean {
    const day = date.getDay();
    return day === 6;
  }

  loadExistingBookings(): void {
    const formattedDate = format(this.selectedDate, 'yyyy-MM-dd');
    
    this.bookingService.getDayBookings(formattedDate).subscribe({
      next: (dayBookings) => {
        const bookedTimes = new Set(dayBookings.map(booking => booking.time));
        
        this.availableTimeSlots = this.availableTimeSlots.map(slot => ({
          ...slot,
          isBooked: bookedTimes.has(slot.hour),
          available: !bookedTimes.has(slot.hour)
        }));

        const timeControl = this.bookingForm.get('time');
        const currentTime = timeControl?.value;
        
        if (currentTime && !this.availableTimeSlots.find(slot => slot.hour === currentTime)?.available) {
          timeControl?.setValue('');
        }
      },
      error: (error) => {
        console.error('Erro ao carregar horários disponíveis:', error);
        this.errorMessage = 'Erro ao carregar horários disponíveis. Tente novamente.';
      }
    });
  }

  loadUserBookings(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user?.id) {
        this.bookingService.getUserBookings(user.id).subscribe({
          next: (bookings) => {
            this.userBookings = bookings;
          },
          error: (error) => {
            console.error('Erro ao carregar agendamentos:', error);
            this.errorMessage = 'Erro ao carregar seus agendamentos. Tente novamente.';
          }
        });
      }
    });
  }

  onDateSelect(date: Date): void {
    if (!date) {
      this.bookingForm.get('time')?.disable();
      return;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const oneMonthLater = new Date(today);
    oneMonthLater.setMonth(today.getMonth() + 1);
    
    const selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (selectedDate < today || selectedDate > oneMonthLater) {
      this.errorMessage = 'Por favor, selecione uma data entre hoje e um mês à frente.';
      this.bookingForm.get('date')?.setValue('');
      this.bookingForm.get('time')?.disable();
      return;
    }
    
    this.selectedDate = selectedDate;
    this.isSunday = this.isSundayClosed(selectedDate);
    
    if (this.isSunday) {
      this.bookingForm.get('time')?.disable();
      this.availableTimeSlots = [];
    } else {
      this.generateTimeSlots();
      this.loadExistingBookings();
      this.bookingForm.get('time')?.enable();
      
      this.checkWeekBookings(selectedDate);
    }
  }

  onSubmit(): void {
    if (this.bookingForm.valid) {
      this.loading = true;
      
      this.authService.currentUser$.subscribe(user => {
        if (!user?.id) {
          this.errorMessage = 'Usuário não autenticado';
          this.loading = false;
          return;
        }

        const [year, month, day] = this.bookingForm.value.date.split('-').map(Number);
        const selectedDate = new Date(year, month - 1, day);

        const booking = {
          userId: user.id,
          serviceId: this.bookingForm.value.service,
          date: format(selectedDate, 'yyyy-MM-dd'),
          time: this.bookingForm.value.time,
          status: 'pending' as const
        };

        this.bookingService.createBooking(booking).subscribe({
          next: () => {
            this.loading = false;
            this.loadUserBookings();
            this.loadExistingBookings();
            this.bookingForm.reset();
            window.location.reload();
          },
          error: (error) => {
            this.loading = false;
            console.error('Erro ao criar agendamento:', error);
            this.errorMessage = 'Erro ao criar agendamento. Tente novamente.';
          }
        });
      });
    }
  }

  cancelBooking(bookingId: string): void {
    this.selectedBookingId = bookingId;
    this.showCancelModal = true;
  }

  confirmCancelBooking(): void {
    if (!this.selectedBookingId) return;

    this.bookingService.cancelBooking(this.selectedBookingId).subscribe({
      next: () => {
        this.loadUserBookings();
        this.loadExistingBookings();
        this.closeCancelModal();
        window.location.reload();
      },
      error: (error) => {
        console.error('Erro ao cancelar agendamento:', error);
        this.errorMessage = 'Erro ao cancelar agendamento. Tente novamente.';
        this.closeCancelModal();
      }
    });
  }

  closeCancelModal(): void {
    this.showCancelModal = false;
    this.selectedBookingId = null;
  }

  getServiceName(serviceId: string): string {
    return this.services.find(s => s.id === serviceId)?.name || 'Serviço não encontrado';
  }

  canChangeServiceOnline(bookingDate: string): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const appointmentDate = new Date(bookingDate);
    appointmentDate.setHours(0, 0, 0, 0);
    
    const diffTime = appointmentDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays >= 2;
  }

  initiateServiceChange(booking: Booking): void {
    this.selectedBookingForChange = booking;
    
    if (this.canChangeServiceOnline(booking.date)) {
      this.showChangeServiceModal = true;
    } else {
      this.showPhoneContactModal = true;
    }
  }

  confirmServiceChange(newServiceId: string): void {
    if (!this.selectedBookingForChange) return;

    this.loading = true;
    const updatedBooking = {
      ...this.selectedBookingForChange,
      serviceId: newServiceId
    };

    this.bookingService.updateBooking(updatedBooking).subscribe({
      next: () => {
        this.loading = false;
        this.loadUserBookings();
        this.closeChangeServiceModal();
        window.location.reload();
      },
      error: (error: unknown) => {
        this.loading = false;
        console.error('Erro ao alterar serviço:', error);
        this.errorMessage = 'Erro ao alterar serviço. Tente novamente.';
        this.closeChangeServiceModal();
      }
    });
  }

  closeChangeServiceModal(): void {
    this.showChangeServiceModal = false;
    this.selectedBookingForChange = null;
  }

  closePhoneContactModal(): void {
    this.showPhoneContactModal = false;
    this.selectedBookingForChange = null;
  }

  openHistoryModal(): void {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    this.historyFilter = {
      startDate: lastMonth.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0]
    };
    
    this.showHistoryModal = true;
    this.loadHistoryBookings();
  }

  loadHistoryBookings(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user?.id) {
        this.bookingService.getBookingsByDateRange(
          user.id,
          this.historyFilter.startDate,
          this.historyFilter.endDate
        ).subscribe({
          next: (bookings) => {
            this.historyBookings = bookings.sort((a, b) => 
              new Date(b.date).getTime() - new Date(a.date).getTime()
            );
          },
          error: (error) => {
            console.error('Erro ao carregar histórico:', error);
            this.errorMessage = 'Erro ao carregar histórico de agendamentos.';
          }
        });
      }
    });
  }

  onHistoryFilterChange(): void {
    this.loadHistoryBookings();
  }

  openHistoryDetail(booking: Booking): void {
    this.selectedHistoryBooking = booking;
    this.showHistoryDetailModal = true;
  }

  closeHistoryModal(): void {
    this.showHistoryModal = false;
    this.historyBookings = [];
  }

  closeHistoryDetailModal(): void {
    this.showHistoryDetailModal = false;
    this.selectedHistoryBooking = null;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('pt-BR');
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'Pendente',
      'confirmed': 'Confirmado',
      'cancelled': 'Cancelado'
    };
    return statusMap[status] || status;
  }

  getStatusClass(status: string): string {
    const statusClassMap: { [key: string]: string } = {
      'pending': 'text-yellow-600 bg-yellow-100',
      'confirmed': 'text-green-600 bg-green-100',
      'cancelled': 'text-red-600 bg-red-100'
    };
    return statusClassMap[status] || '';
  }

  checkWeekBookings(selectedDate: Date): void {
    this.authService.currentUser$.subscribe(user => {
      if (user?.id) {
        this.bookingService.getWeekBookings(user.id, selectedDate).subscribe({
          next: (bookings) => {
            const activeBookings = bookings.filter(b => b.status !== 'cancelled');
            
            if (activeBookings.length > 0) {
              const bookingsByDate = activeBookings.reduce((acc, booking) => {
                if (!acc[booking.date]) {
                  acc[booking.date] = [];
                }
                acc[booking.date].push(booking);
                return acc;
              }, {} as { [key: string]: Booking[] });

              let maxDate = '';
              let maxCount = 0;
              
              for (const [date, dateBookings] of Object.entries(bookingsByDate)) {
                if (dateBookings.length >= maxCount) {
                  maxCount = dateBookings.length;
                  maxDate = date;
                }
              }

              if (maxDate && maxDate !== format(selectedDate, 'yyyy-MM-dd')) {
                const services = bookingsByDate[maxDate].map(b => this.getServiceName(b.serviceId));
                
                this.suggestionInfo = {
                  hasBooking: true,
                  date: maxDate,
                  services: services
                };
                
                this.showSuggestionModal = true;
              }
            }
          },
          error: (error) => {
            console.error('Erro ao verificar agendamentos da semana:', error);
          }
        });
      }
    });
  }

  acceptSuggestion(): void {
    if (this.suggestionInfo) {
      this.bookingForm.patchValue({
        date: this.suggestionInfo.date
      });
      
      const [year, month, day] = this.suggestionInfo.date.split('-').map(Number);
      const selectedDate = new Date(year, month - 1, day);
      this.onDateSelect(selectedDate);
    }
    this.closeSuggestionModal();
  }

  closeSuggestionModal(): void {
    this.showSuggestionModal = false;
    this.suggestionInfo = null;
  }
}
