# ByteBurger User Features

## User Account Page (`/account`)

### Overview
A comprehensive account dashboard where users can view their order history, track orders, and manage their profile.

### Features

#### 1. **Order History Tab**
- **View All Orders**: See all past and current orders with status
- **Order Details**: 
  - Order number
  - Date and time
  - Status (Pending, Preparing, Completed, Cancelled)
  - Total amount
  - Customer information
  - Order notes
- **Track Order**: Click to view real-time order tracking
- **Empty State**: Friendly message with link to browse menu when no orders

#### 2. **Profile Tab**
- Email address display
- Quick link to Rewards Program
- Account information

### Status Indicators
- 🟡 **Pending** - Order received, awaiting kitchen
- 🔵 **Preparing** - Kitchen is cooking your food
- 🟢 **Completed** - Ready for pickup!
- 🔴 **Cancelled** - Order was cancelled

### How to Access
1. **Logged-in users**: Click your name in the navbar
2. **Direct URL**: Navigate to `/account`
3. **Redirects to login** if not authenticated

---

## Email Notification System

### Order Confirmation Email
**Sent**: Immediately after order placement

**Contains**:
- Order number and confirmation
- Itemized order details with quantities and prices
- Subtotal, tax, and total breakdown
- Pickup location and address
- Estimated time (15-20 minutes)
- Promise of status update when ready

**Template**: `OrderConfirmationEmail`

### Order Ready Email
**Sent**: When kitchen marks order as "Completed"

**Contains**:
- Order status update notification
- Order number
- Customer name
- Status message: "Your order is ready for pickup! Come get it while it's hot!"
- Branded ByteBurger styling

**Template**: `StatusUpdateEmail`

### Email Flow

```
1. Customer places order
   ↓
2. Order Confirmation Email sent ✉️
   ↓
3. Kitchen receives order
   ↓
4. Kitchen marks as "Preparing"
   ↓
5. Kitchen marks as "Completed"
   ↓
6. Order Ready Email sent ✉️
   ↓
7. Customer picks up order
```

### Technical Implementation

#### API Endpoints

**`POST /api/send-status-email`**
```typescript
{
  orderNumber: string
  customerName: string
  customerEmail: string
  status: 'preparing' | 'completed' | 'delivered' | 'cancelled'
}
```

**`GET /api/orders/user/[userId]`**
```typescript
// Returns array of user's orders
Order[]
```

#### Kitchen Integration
- Email automatically sent when order status changes to "completed"
- Fire-and-forget pattern (non-blocking)
- Error logging if email fails
- Console confirmation when email sent successfully

### Email Service
- **Provider**: Resend
- **From**: `ByteBurger <orders@byteburger.com>`
- **Template Engine**: React components converted to HTML
- **Styling**: Inline CSS for email client compatibility

---

## User Flow Examples

### New User Journey
1. Browse menu without account
2. Add items to cart
3. Go to checkout
4. Create account or continue as guest
5. Complete order
6. Receive confirmation email
7. Click account link in navbar (if logged in)
8. View order in history
9. Receive ready email when order complete
10. Pick up order

### Returning User Journey
1. Log in
2. Click name in navbar → Account page
3. View past orders
4. Check rewards points
5. Place new order
6. Track in real-time

---

## Features Benefits

### For Customers
✅ **Transparency**: See all order history in one place  
✅ **Convenience**: Track orders without calling  
✅ **Notifications**: Email updates for order status  
✅ **History**: Reference past orders for reordering  
✅ **Rewards**: Easy access to points and rewards

### For Restaurant
✅ **Communication**: Automated customer updates  
✅ **Efficiency**: Reduced phone calls asking "is my order ready?"  
✅ **Branding**: Professional email communications  
✅ **Data**: Track customer order patterns  
✅ **Retention**: User accounts encourage repeat business

---

## File Structure

```
app/
├── account/
│   └── page.tsx                    # User account dashboard
├── api/
│   ├── orders/
│   │   └── user/[userId]/
│   │       └── route.ts           # Fetch user orders
│   └── send-status-email/
│       └── route.ts               # Send status update emails

lib/
└── email/
    └── templates.tsx              # Email React components

components/
└── layout/
    └── navbar.tsx                 # Updated with account link
```

---

## Testing Checklist

### Account Page
- [ ] Redirects to login when not authenticated
- [ ] Displays user email in navbar
- [ ] Clicking email navigates to account page
- [ ] Shows "No orders" message for new users
- [ ] Displays orders in reverse chronological order
- [ ] Shows correct status colors and icons
- [ ] "Track Order" button works
- [ ] "View My Rewards" button navigates correctly
- [ ] Tabs switch properly (Orders / Profile)

### Email Notifications
- [ ] Confirmation email sent on order creation
- [ ] Confirmation email has correct order details
- [ ] Ready email sent when kitchen marks "Completed"
- [ ] Ready email has correct messaging
- [ ] Emails don't block order processing
- [ ] Email failures are logged but don't break app
- [ ] Email styling renders correctly in Gmail, Outlook, etc.

### Kitchen Integration
- [ ] Status update triggers email
- [ ] Only "completed" status sends ready email
- [ ] Multiple status updates don't send duplicate emails
- [ ] Console logs confirm email sent
- [ ] Kitchen display continues working if email fails

---

## Future Enhancements

### Account Page
- [ ] Edit profile information
- [ ] Saved addresses for faster checkout
- [ ] Favorite items / quick reorder
- [ ] Order filtering and search
- [ ] Download order receipts

### Email System
- [ ] SMS notifications option
- [ ] Push notifications (PWA)
- [ ] Email preferences/opt-out
- [ ] Order delay notifications
- [ ] Promotional emails
- [ ] Birthday rewards emails

### Tracking
- [ ] Real-time order status updates
- [ ] Estimated pickup time countdown
- [ ] Order progress bar
- [ ] Kitchen webcam feed (optional)

---

## Configuration

### Environment Variables Required
```env
RESEND_API_KEY=your_resend_api_key
```

### Email Templates
All templates in `lib/email/templates.tsx`:
- `OrderConfirmationEmail`
- `StatusUpdateEmail`

### Customization Points
- Email "from" address (currently: `orders@byteburger.com`)
- Pickup location address
- Status messages
- Email styling/branding
- Estimated time (currently: 15-20 minutes)

---

**Documentation last updated**: May 26, 2026
