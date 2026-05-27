import * as React from 'react'

interface OrderConfirmationEmailProps {
  orderNumber: string
  customerName: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  subtotal: number
  tax: number
  total: number
}

export const OrderConfirmationEmail: React.FC<OrderConfirmationEmailProps> = ({
  orderNumber,
  customerName,
  items,
  subtotal,
  tax,
  total,
}) => (
  <html>
    {/* eslint-disable-next-line @next/next/no-head-element */}
    <head>
      <style>{`
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #f97316 0%, #dc2626 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #f9fafb;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .order-number {
          background: #fff;
          padding: 15px;
          border-left: 4px solid #f97316;
          margin: 20px 0;
          font-weight: bold;
        }
        .items-table {
          width: 100%;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          margin: 20px 0;
        }
        .items-table th {
          background: #f3f4f6;
          padding: 12px;
          text-align: left;
          font-weight: 600;
        }
        .items-table td {
          padding: 12px;
          border-bottom: 1px solid #e5e7eb;
        }
        .total-row {
          background: #fff;
          padding: 15px;
          margin: 10px 0;
          display: flex;
          justify-content: space-between;
          border-radius: 5px;
        }
        .total-row.grand {
          background: #f97316;
          color: white;
          font-weight: bold;
          font-size: 18px;
        }
        .pickup-info {
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #10b981;
        }
        .footer {
          text-align: center;
          color: #6b7280;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
        }
        .button {
          display: inline-block;
          background: #f97316;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 6px;
          margin: 20px 0;
          font-weight: 600;
        }
      `}</style>
    </head>
    <body>
      <div className="header">
        <h1>🍔 ByteBurger</h1>
        <p>Order Confirmation</p>
      </div>
      
      <div className="content">
        <p>Hi {customerName},</p>
        <p>Thank you for your order! We&apos;ve received it and our team is getting started.</p>
        
        <div className="order-number">
          Order Number: <span style={{color: '#f97316'}}>{orderNumber}</span>
        </div>

        <h3>Your Order:</h3>
        <table className="items-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="total-row">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="total-row">
          <span>Tax:</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="total-row grand">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <div className="pickup-info">
          <h3 style={{marginTop: 0}}>📍 Pickup Location:</h3>
          <p style={{margin: '5px 0'}}><strong>ByteBurger Restaurant</strong></p>
          <p style={{margin: '5px 0'}}>123 Tech Street</p>
          <p style={{margin: '5px 0'}}>San Francisco, CA 94102</p>
          <p style={{marginTop: 15, color: '#059669'}}>
            ✓ We&apos;ll send you an update when your order is ready for pickup!
          </p>
        </div>

        <div className="footer">
          <p>Questions? Contact us at support@byteburger.com</p>
          <p style={{fontSize: '12px', color: '#9ca3af'}}>
            © 2026 ByteBurger. All rights reserved.
          </p>
        </div>
      </div>
    </body>
  </html>
)

interface StatusUpdateEmailProps {
  orderNumber: string
  customerName: string
  status: string
  statusMessage: string
}

export const StatusUpdateEmail: React.FC<StatusUpdateEmailProps> = ({
  orderNumber,
  customerName,
  status,
  statusMessage,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing': return '#3b82f6'
      case 'completed': return '#10b981'
      case 'delivered': return '#059669'
      default: return '#f97316'
    }
  }

  return (
    <html>
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <style>{`
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #f97316 0%, #dc2626 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: #f9fafb;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .status-badge {
            display: inline-block;
            padding: 10px 20px;
            border-radius: 20px;
            color: white;
            font-weight: bold;
            margin: 20px 0;
          }
          .pickup-reminder {
            background: #fef3c7;
            border: 2px solid #fbbf24;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            color: #6b7280;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
          }
        `}</style>
      </head>
      <body>
        <div className="header">
          <h1>🍔 ByteBurger</h1>
          <p>Order Status Update</p>
        </div>
        
        <div className="content">
          <p>Hi {customerName},</p>
          <p>{statusMessage}</p>
          
          <div style={{textAlign: 'center'}}>
            <div className="status-badge" style={{background: getStatusColor(status)}}>
              {status.toUpperCase()}
            </div>
            <p style={{fontSize: '14px', color: '#6b7280'}}>Order #{orderNumber}</p>
          </div>

          {status === 'completed' && (
            <div className="pickup-reminder">
              <h3 style={{marginTop: 0, color: '#92400e'}}>🎉 Your order is ready!</h3>
              <p style={{margin: '10px 0', color: '#78350f'}}>
                Please come pick up your order at:
              </p>
              <p style={{margin: '5px 0', fontWeight: 'bold', color: '#78350f'}}>
                ByteBurger Restaurant<br />
                123 Tech Street<br />
                San Francisco, CA 94102
              </p>
            </div>
          )}

          <div className="footer">
            <p>Questions? Contact us at support@byteburger.com</p>
            <p style={{fontSize: '12px', color: '#9ca3af'}}>
              © 2026 ByteBurger. All rights reserved.
            </p>
          </div>
        </div>
      </body>
    </html>
  )
}
