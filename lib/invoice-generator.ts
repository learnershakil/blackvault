import { formatPrice } from "@/lib/utils";
import { formatOrderDate } from "@/lib/order-utils";

interface Address {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string | null;
}

interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
}

interface InvoiceData {
  invoiceNumber: string;
  orderNumber: string;
  date: string;
  dueDate: string;
  customerName: string;
  customerEmail: string;
  billingAddress: Address;
  shippingAddress: Address;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentId?: string;
}

/**
 * Generate HTML content for an invoice
 */
export function generateInvoiceHtml(data: InvoiceData): string {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const itemsHtml = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e5e5;">${
          item.name
        }</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; text-align: center;">${
          item.quantity
        }</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; text-align: right;">${formatCurrency(
          item.price
        )}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; text-align: right;">${formatCurrency(
          item.price * item.quantity
        )}</td>
      </tr>
    `
    )
    .join("");

  const formatAddress = (address: Address) => {
    return `
      ${address.firstName} ${address.lastName}<br />
      ${address.address1}<br />
      ${address.address2 ? address.address2 + "<br />" : ""}
      ${address.city}, ${address.state} ${address.postalCode}<br />
      ${address.country}
      ${address.phone ? "<br />Phone: " + address.phone : ""}
    `;
  };

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Invoice ${data.invoiceNumber}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .invoice-box {
            max-width: 800px;
            margin: auto;
            padding: 30px;
            border: 1px solid #eee;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
          }
          .invoice-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #e5e5e5;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #181D31;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          table th {
            padding: 12px;
            background: #f8f9fa;
            text-align: left;
            font-weight: bold;
          }
          .address-container {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
          }
          .address {
            width: 45%;
          }
          .totals {
            margin-top: 20px;
            text-align: right;
          }
          .totals table {
            width: 300px;
            margin-left: auto;
          }
          .payment-info {
            margin-top: 30px;
            border-top: 1px solid #e5e5e5;
            padding-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="invoice-box">
          <div class="invoice-header">
            <div>
              <div class="logo">BlackVault Audio</div>
              <div>Premium Audio Equipment</div>
            </div>
            <div>
              <h1>INVOICE</h1>
              <div>Invoice #: ${data.invoiceNumber}</div>
              <div>Date: ${formatDate(data.date)}</div>
              <div>Order #: ${data.orderNumber}</div>
            </div>
          </div>
          
          <div class="address-container">
            <div class="address">
              <h3>Bill To:</h3>
              <div>${formatAddress(data.billingAddress)}</div>
              <div>Email: ${data.customerEmail}</div>
            </div>
            <div class="address">
              <h3>Ship To:</h3>
              <div>${formatAddress(data.shippingAddress)}</div>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <div class="totals">
            <table>
              <tr>
                <td>Subtotal:</td>
                <td>${formatCurrency(data.subtotal)}</td>
              </tr>
              <tr>
                <td>Tax:</td>
                <td>${formatCurrency(data.tax)}</td>
              </tr>
              <tr>
                <td>Shipping:</td>
                <td>${formatCurrency(data.shipping)}</td>
              </tr>
              ${
                data.discount > 0
                  ? `<tr>
                    <td>Discount:</td>
                    <td>-${formatCurrency(data.discount)}</td>
                  </tr>`
                  : ""
              }
              <tr style="font-weight: bold;">
                <td>Total:</td>
                <td>${formatCurrency(data.total)}</td>
              </tr>
            </table>
          </div>
          
          <div class="payment-info">
            <h3>Payment Information</h3>
            <div>Payment Method: ${data.paymentMethod}</div>
            ${data.paymentId ? `<div>Payment ID: ${data.paymentId}</div>` : ""}
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Generate PDF content for an invoice
 * Note: In a real application, you'd use a library like puppeteer or PDFKit
 */
export async function generateInvoicePdf(data: InvoiceData): Promise<Buffer> {
  // In a real application, this would convert the HTML to a PDF
  // For now, we'll mock it with a simulated PDF (HTML with Content-Type application/pdf)

  // This would actually use a PDF generation library
  const html = generateInvoiceHtml(data);

  // For now, we're just returning the HTML as a buffer
  // In a real app, you'd convert this to PDF
  return Buffer.from(html);
}
