import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { startOfWeek, endOfWeek, format } from 'date-fns';

export interface Booking {
  id?: string;
  userId: string;
  serviceId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `${environment.apiUrl}/bookings`;

  constructor(private http: HttpClient) { }

  createBooking(booking: Omit<Booking, 'id' | 'createdAt'>): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, booking);
  }

  getUserBookings(userId: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/user/${userId}`);
  }

  getDayBookings(date: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/day/${date}`);
  }

  getAvailableSlots(date: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/available/${date}`);
  }

  cancelBooking(bookingId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${bookingId}`);
  }

  updateBooking(booking: Booking): Observable<Booking> {
    return this.http.put<Booking>(`${this.apiUrl}/${booking.id}`, booking);
  }

  getBookingsByDateRange(userId: string, startDate: string, endDate: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/history/${userId}`, {
      params: { startDate, endDate }
    });
  }

  getWeekBookings(userId: string, date: Date): Observable<Booking[]> {
    const start = format(startOfWeek(date), 'yyyy-MM-dd');
    const end = format(endOfWeek(date), 'yyyy-MM-dd');
    
    return this.http.get<Booking[]>(`${this.apiUrl}/week/${userId}`, {
      params: { startDate: start, endDate: end }
    });
  }
} 