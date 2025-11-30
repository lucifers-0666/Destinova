/**
 * Boarding Pass Service
 * Generates PDF boarding passes with QR codes
 */

import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { IBooking } from '../models/Booking.js';
import { IFlight } from '../models/Flight.js';

// Extended interfaces for populated data
interface IPopulatedBooking extends Omit<IBooking, 'flight' | 'outboundFlight'> {
  flight?: IFlight;
  outboundFlight?: IFlight;
}

interface IBoardingPassData {
  booking: IPopulatedBooking;
  passengerIndex: number;
  gate?: string;
  terminal?: string;
  boardingTime?: Date;
  seatNumber?: string;
}

/**
 * Generate QR code as data URL
 */
async function generateQRCode(data: string): Promise<string> {
  try {
    return await QRCode.toDataURL(data, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      width: 150,
      margin: 1
    });
  } catch (error) {
    console.error('QR Code generation failed:', error);
    return '';
  }
}

/**
 * Format date for boarding pass
 */
function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Format time for boarding pass
 */
function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

/**
 * Generate boarding pass PDF
 */
export async function generateBoardingPassPDF(data: IBoardingPassData): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    try {
      const { booking, passengerIndex, gate, terminal, boardingTime, seatNumber } = data;
      const passenger = booking.passengers?.[passengerIndex];
      const flight = booking.flight || booking.outboundFlight;
      
      if (!passenger || !flight) {
        throw new Error('Missing passenger or flight information');
      }
      
      // Create PDF document (boarding pass size)
      const doc = new PDFDocument({
        size: [612, 250], // Custom size for boarding pass
        margin: 20
      });
      
      const chunks: Buffer[] = [];
      
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
      
      // Generate QR code with booking info
      const qrData = JSON.stringify({
        ref: booking.bookingReference,
        pnr: booking.pnr,
        passenger: `${passenger.firstName} ${passenger.lastName}`,
        flight: flight.flightNumber,
        seat: seatNumber || 'TBA'
      });
      
      const qrCodeDataUrl = await generateQRCode(qrData);
      
      // Colors
      const primaryColor = '#667eea';
      const darkColor = '#1a1a2e';
      const grayColor = '#666666';
      
      // Header with airline branding
      doc.rect(0, 0, 612, 60)
        .fill(primaryColor);
      
      doc.fillColor('#ffffff')
        .fontSize(24)
        .font('Helvetica-Bold')
        .text('DESTINOVA', 20, 20);
      
      doc.fontSize(10)
        .font('Helvetica')
        .text('BOARDING PASS', 20, 42);
      
      // Flight number on right
      doc.fontSize(16)
        .font('Helvetica-Bold')
        .text(flight.flightNumber || 'N/A', 500, 22, { align: 'right' });
      
      doc.fontSize(10)
        .font('Helvetica')
        .text((flight.airline as any)?.name || 'Airline', 440, 42, { align: 'right' });
      
      // Main content area
      const contentY = 75;
      
      // Passenger name
      doc.fillColor(darkColor)
        .fontSize(9)
        .font('Helvetica')
        .text('PASSENGER NAME', 20, contentY);
      
      doc.fontSize(14)
        .font('Helvetica-Bold')
        .text(`${passenger.title?.toUpperCase() || 'MR'} ${passenger.firstName?.toUpperCase()} ${passenger.lastName?.toUpperCase()}`, 20, contentY + 12);
      
      // Route section
      const routeY = contentY + 45;
      
      // From
      doc.fillColor(grayColor)
        .fontSize(9)
        .font('Helvetica')
        .text('FROM', 20, routeY);
      
      doc.fillColor(darkColor)
        .fontSize(20)
        .font('Helvetica-Bold')
        .text((flight.origin as any)?.airportCode || 'DEL', 20, routeY + 12);
      
      doc.fillColor(grayColor)
        .fontSize(8)
        .font('Helvetica')
        .text((flight.origin as any)?.city || 'New Delhi', 20, routeY + 35);
      
      // Arrow
      doc.fillColor(primaryColor)
        .fontSize(20)
        .text('→', 90, routeY + 12);
      
      // To
      doc.fillColor(grayColor)
        .fontSize(9)
        .font('Helvetica')
        .text('TO', 120, routeY);
      
      doc.fillColor(darkColor)
        .fontSize(20)
        .font('Helvetica-Bold')
        .text((flight.destination as any)?.airportCode || 'BOM', 120, routeY + 12);
      
      doc.fillColor(grayColor)
        .fontSize(8)
        .font('Helvetica')
        .text((flight.destination as any)?.city || 'Mumbai', 120, routeY + 35);
      
      // Date and Time
      const dateY = routeY;
      
      doc.fillColor(grayColor)
        .fontSize(9)
        .font('Helvetica')
        .text('DATE', 200, dateY);
      
      doc.fillColor(darkColor)
        .fontSize(11)
        .font('Helvetica-Bold')
        .text(formatDate(flight.departureTime || booking.travelDate), 200, dateY + 12);
      
      doc.fillColor(grayColor)
        .fontSize(9)
        .font('Helvetica')
        .text('DEPARTURE', 200, dateY + 35);
      
      doc.fillColor(darkColor)
        .fontSize(14)
        .font('Helvetica-Bold')
        .text(formatTime(flight.departureTime || new Date()), 200, dateY + 47);
      
      // Gate, Terminal, Boarding
      const infoY = routeY;
      const infoX = 320;
      
      // Terminal
      doc.fillColor(grayColor)
        .fontSize(9)
        .font('Helvetica')
        .text('TERMINAL', infoX, infoY);
      
      doc.fillColor(darkColor)
        .fontSize(14)
        .font('Helvetica-Bold')
        .text(terminal || 'T3', infoX, infoY + 12);
      
      // Gate
      doc.fillColor(grayColor)
        .fontSize(9)
        .font('Helvetica')
        .text('GATE', infoX + 60, infoY);
      
      doc.fillColor(darkColor)
        .fontSize(14)
        .font('Helvetica-Bold')
        .text(gate || 'A12', infoX + 60, infoY + 12);
      
      // Boarding Time
      doc.fillColor(grayColor)
        .fontSize(9)
        .font('Helvetica')
        .text('BOARDING', infoX, infoY + 35);
      
      const boardingTimeStr = boardingTime 
        ? formatTime(boardingTime)
        : formatTime(new Date((flight.departureTime || new Date()).getTime() - 45 * 60000));
      
      doc.fillColor(darkColor)
        .fontSize(14)
        .font('Helvetica-Bold')
        .text(boardingTimeStr, infoX, infoY + 47);
      
      // Seat
      doc.fillColor(grayColor)
        .fontSize(9)
        .font('Helvetica')
        .text('SEAT', infoX + 60, infoY + 35);
      
      doc.fillColor(primaryColor)
        .fontSize(18)
        .font('Helvetica-Bold')
        .text(seatNumber || 'TBA', infoX + 60, infoY + 45);
      
      // Class
      doc.fillColor(grayColor)
        .fontSize(9)
        .font('Helvetica')
        .text('CLASS', infoX + 120, infoY + 35);
      
      doc.fillColor(darkColor)
        .fontSize(11)
        .font('Helvetica-Bold')
        .text('ECONOMY', infoX + 120, infoY + 47);
      
      // QR Code section (right side)
      if (qrCodeDataUrl) {
        const qrBuffer = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64');
        doc.image(qrBuffer, 480, 70, { width: 110, height: 110 });
      }
      
      // Booking reference under QR
      doc.fillColor(grayColor)
        .fontSize(8)
        .font('Helvetica')
        .text('BOOKING REF', 495, 185);
      
      doc.fillColor(darkColor)
        .fontSize(10)
        .font('Helvetica-Bold')
        .text(booking.bookingReference || booking.pnr || 'N/A', 495, 197);
      
      // Footer
      doc.fillColor(grayColor)
        .fontSize(7)
        .font('Helvetica')
        .text('Please arrive at the gate at least 30 minutes before departure. This boarding pass is valid only with a valid photo ID.', 20, 220, { width: 400 });
      
      // Dashed separator line
      doc.dash(5, { space: 3 })
        .strokeColor('#cccccc')
        .moveTo(440, 70)
        .lineTo(440, 230)
        .stroke();
      
      // Finalize
      doc.end();
      
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Generate boarding pass HTML (for email/web view)
 */
export function generateBoardingPassHTML(data: IBoardingPassData): string {
  const { booking, passengerIndex, gate, terminal, boardingTime, seatNumber } = data;
  const passenger = booking.passengers?.[passengerIndex];
  const flight = booking.flight || booking.outboundFlight;
  
  if (!passenger || !flight) {
    return '<p>Error: Missing boarding pass data</p>';
  }
  
  const departureTime = flight.departureTime || booking.travelDate;
  const boardingTimeStr = boardingTime 
    ? formatTime(boardingTime)
    : formatTime(new Date(new Date(departureTime).getTime() - 45 * 60000));
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .boarding-pass { font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 20px auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; display: flex; justify-content: space-between; align-items: center; }
        .header h1 { font-size: 1.5rem; }
        .header .flight-num { font-size: 1.2rem; font-weight: bold; }
        .content { padding: 20px; background: #fff; }
        .passenger-name { font-size: 1.2rem; font-weight: bold; color: #1a1a2e; margin-bottom: 20px; }
        .route { display: flex; align-items: center; gap: 20px; margin-bottom: 20px; }
        .airport { text-align: center; }
        .airport-code { font-size: 2rem; font-weight: bold; color: #1a1a2e; }
        .city { font-size: 0.8rem; color: #666; }
        .arrow { font-size: 1.5rem; color: #667eea; }
        .details { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; padding: 20px; background: #f8f9fa; border-radius: 8px; }
        .detail-item label { font-size: 0.7rem; color: #666; text-transform: uppercase; display: block; margin-bottom: 4px; }
        .detail-item span { font-size: 1rem; font-weight: 600; color: #1a1a2e; }
        .seat-highlight { font-size: 1.5rem !important; color: #667eea !important; }
        .qr-section { text-align: center; padding: 20px; border-top: 2px dashed #e0e0e0; margin-top: 20px; }
        .booking-ref { font-size: 0.9rem; color: #666; margin-top: 10px; }
        .booking-ref strong { color: #1a1a2e; }
        .footer { font-size: 0.7rem; color: #999; padding: 15px 20px; background: #f8f9fa; text-align: center; }
      </style>
    </head>
    <body>
      <div class="boarding-pass">
        <div class="header">
          <div>
            <h1>DESTINOVA</h1>
            <span>Boarding Pass</span>
          </div>
          <div>
            <div class="flight-num">${flight.flightNumber || 'N/A'}</div>
            <span>${(flight.airline as any)?.name || 'Airline'}</span>
          </div>
        </div>
        
        <div class="content">
          <div class="passenger-name">${passenger.title?.toUpperCase() || 'MR'} ${passenger.firstName?.toUpperCase()} ${passenger.lastName?.toUpperCase()}</div>
          
          <div class="route">
            <div class="airport">
              <div class="airport-code">${(flight.origin as any)?.airportCode || 'DEL'}</div>
              <div class="city">${(flight.origin as any)?.city || 'New Delhi'}</div>
            </div>
            <div class="arrow">✈</div>
            <div class="airport">
              <div class="airport-code">${(flight.destination as any)?.airportCode || 'BOM'}</div>
              <div class="city">${(flight.destination as any)?.city || 'Mumbai'}</div>
            </div>
          </div>
          
          <div class="details">
            <div class="detail-item">
              <label>Date</label>
              <span>${formatDate(departureTime)}</span>
            </div>
            <div class="detail-item">
              <label>Departure</label>
              <span>${formatTime(departureTime)}</span>
            </div>
            <div class="detail-item">
              <label>Terminal</label>
              <span>${terminal || 'T3'}</span>
            </div>
            <div class="detail-item">
              <label>Gate</label>
              <span>${gate || 'TBA'}</span>
            </div>
            <div class="detail-item">
              <label>Boarding</label>
              <span>${boardingTimeStr}</span>
            </div>
            <div class="detail-item">
              <label>Seat</label>
              <span class="seat-highlight">${seatNumber || 'TBA'}</span>
            </div>
            <div class="detail-item">
              <label>Class</label>
              <span>Economy</span>
            </div>
            <div class="detail-item">
              <label>Sequence</label>
              <span>${passengerIndex + 1}</span>
            </div>
          </div>
          
          <div class="qr-section">
            <div class="booking-ref">Booking Reference: <strong>${booking.bookingReference || booking.pnr}</strong></div>
          </div>
        </div>
        
        <div class="footer">
          Please arrive at the gate at least 30 minutes before departure. This boarding pass is valid only with a valid photo ID.
        </div>
      </div>
    </body>
    </html>
  `;
}

export default {
  generateBoardingPassPDF,
  generateBoardingPassHTML
};
