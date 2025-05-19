import { formatPrice } from "@/lib/utils";
import { formatOrderDate } from "@/lib/order-utils";

interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
}

interface InvoiceAddress {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface InvoiceData {
  invoiceNumber: string;
  orderNumber: string;
  date: string; // ISO date string
  dueDate: string; // ISO date string
  customerName: string;
  customerEmail: string;
  billingAddress: InvoiceAddress;
  shippingAddress: InvoiceAddress;
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
 * Generate HTML for an invoice
 */
export function generateInvoiceHtml(data: InvoiceData): string {
  const formattedDate = formatOrderDate(data.date);
  const formattedDueDate = formatOrderDate(data.dueDate);

  // Format address
  const formatAddress = (address: InvoiceAddress) => {
    return `
      ${address.firstName} ${address.lastName}<br>
      ${address.address1}<br>
      ${address.address2 ? address.address2 + "<br>" : ""}
      ${address.city}, ${address.state} ${address.postalCode}<br>
      ${address.country}
    `;
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice #${data.invoiceNumber}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          color: #333;
        }
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 30px;
          border: 1px solid #eee;
        }
        .invoice-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
        }
        .invoice-title {
          font-size: 28px;
          font-weight: bold;
          color: #181D31;
        }
        .company-details {
          text-align: right;
        }
        .invoice-details {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
        }
        .invoice-details-col {
          flex: 1;
        }
        .invoice-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 30px;
          margin-bottom: 30px;
        }
        .invoice-table th {
          background-color: #f5f5f5;
          text-align: left;
          padding: 10px;
          border-bottom: 1px solid #ddd;
        }
        .invoice-table td {
          padding: 10px;
          border-bottom: 1px solid #ddd;
        }
        .invoice-total {
          text-align: right;
        }
        .invoice-total table {
          width: 300px;
          margin-left: auto;
        }
        .invoice-total td {
          padding: 5px;
        }
        .invoice-total .total {
          font-size: 18px;
          font-weight: bold;
          border-top: 2px solid #333;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          color: #777;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="invoice-header">
          <div>
            <div class="invoice-title">INVOICE</div>
            <div>#${data.invoiceNumber}</div>
          </div>
          <div class="company-details">
            <div style="font-weight: bold; font-size: 18px;">BlackVault Audio</div>
            <div>123 Tech Street</div>
            <div>San Francisco, CA 94107</div>
            <div>United States</div>
            <div>support@blackvault.com</div>
          </div>
        </div>
        
        <div class="invoice-details">
          <div class="invoice-details-col">
            <div style="font-weight: bold; margin-bottom: 5px;">Bill To:</div>
            <div>${formatAddress(data.billingAddress)}</div>
            <div style="margin-top: 15px;">${data.customerEmail}</div>
          </div>
          <div class="invoice-details-col">
            <div style="font-weight: bold; margin-bottom: 5px;">Ship To:</div>
            <div>${formatAddress(data.shippingAddress)}</div>
          </div>
          <div class="invoice-details-col" style="text-align: right;">
            <div><strong>Invoice Date:</strong> ${formattedDate}</div>
            <div><strong>Due Date:</strong> ${formattedDueDate}</div>
            <div><strong>Order #:</strong> ${data.orderNumber}</div>
            <div><strong>Payment Method:</strong> ${data.paymentMethod}</div>
            ${
              data.paymentId
                ? `<div><strong>Payment ID:</strong> ${data.paymentId}</div>`
                : ""
            }
          </div>
        </div>
        
        <table class="invoice-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${data.items
              .map(
                (item) => `
              <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${formatPrice(item.price)}</td>
                <td>${formatPrice(item.price * item.quantity)}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
        
        <div class="invoice-total">
          <table>
            <tr>
              <td>Subtotal:</td>
              <td>${formatPrice(data.subtotal)}</td>
            </tr>
            <tr>
              <td>Tax (10%):</td>
              <td>${formatPrice(data.tax)}</td>
            </tr>
            <tr>
              <td>Shipping:</td>
              <td>${
                data.shipping === 0 ? "Free" : formatPrice(data.shipping)
              }</td>
            </tr>
            ${
              data.discount > 0
                ? `
            <tr>
              <td>Discount:</td>
              <td>-${formatPrice(data.discount)}</td>
            </tr>
            `
                : ""
            }
            <tr class="total">
              <td>Total:</td>
              <td>${formatPrice(data.total)}</td>
            </tr>
          </table>
        </div>
        
        <div class="footer">
          Thank you for your business! If you have any questions, please contact support@blackvault.com
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate a PDF invoice from the order data
 * This is a placeholder that returns HTML - in a real app you would convert to PDF
 */
export async function generateInvoicePdf(data: InvoiceData): Promise<string> {
  // In a real app, you would use a library like 'html-pdf' or 'puppeteer' to convert HTML to PDF
  // For simplicity, we'll just return the HTML
  return generateInvoiceHtml(data);
}
