<div align="center">

<br/>

# 🌍 SafariHub

### Trust-first · Halal-friendly · Lebanon & Turkey Travel Marketplace

*Connecting travelers with verified local guides for authentic, secure experiences.*

<br/>

[![Java 17](https://img.shields.io/badge/Java-17-ED8B00?style=flat&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot 3](https://img.shields.io/badge/Spring%20Boot-3.x-6DB33F?style=flat&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-000000?style=flat&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Flyway](https://img.shields.io/badge/Flyway-66-CC0200?style=flat&logo=flyway&logoColor=white)](https://flywaydb.org/)
[![Stripe](https://img.shields.io/badge/Stripe-Connect-635BFF?style=flat&logo=stripe&logoColor=white)](https://stripe.com/)
[![Tailwind v4](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat)](LICENSE)

<br/>

[**Features**](#-features) · [**Architecture**](#-architecture) · [**API Reference**](#-api-reference) · [**Getting Started**](#-getting-started) · [**Docs**](#-technical-documentation)

</div>

---

## 📖 Overview

SafariHub is a production-grade, full-stack travel marketplace. Travelers browse and book authentic local tours; verified guides manage their portfolio, schedule, and earnings; administrators oversee the entire ecosystem with a powerful back-office.

The platform is built with enterprise-level technical depth:
- **Pessimistic DB locking** (`SELECT … FOR UPDATE`) prevents double-booking under concurrent load
- **Stripe Connect escrow** holds funds for 48h after tour completion before releasing to guides
- **5 scheduled background jobs** handle payment expiry, payout release, suspension cleanup, booking status sync, and review reminders
- **WebSocket-driven real-time** chat and notifications via STOMP over SockJS
- **66 Flyway migrations** — full, versioned, auditable schema history
- **Loyalty program** with BRONZE → SILVER → GOLD tiers driving real booking discounts
- **Dynamic pricing** with weekend/holiday multipliers and group discounts computed in `PricingService`

---

## ✨ Features

### For Guests (No Login Required)
- Browse all published tours with rich filters (country, city, category, Halal, Instant Book, price range, duration, capacity, rating, premium, family-friendly, group discount, language)
- Full tour detail: photo/video gallery, interactive Leaflet map with itinerary trail, inclusions/exclusions, what to bring, requirements
- Guide public profile with portfolio, languages, expertise, trust seals
- Guest price preview: real-time breakdown of subtotal → weekend/holiday surcharge → group discount → loyalty discount
- Nearby tours search (radius in km with distance display)
- Bounding box geo-search for map pan/zoom discovery
- How It Works, Terms, Privacy, Contact/Support pages

### For Travelers
**Dashboard:**
- Personalized greeting with completed trips count, base location, loyalty tier, progress to next tier
- Upcoming bookings feed and recent activity log

**Booking:**
- Book tours (Instant Book or Request to Book)
- Waiver agreement at booking time
- 15-minute payment countdown banner with urgency levels (normal → warning → critical → expired)
- Waitlist join/leave when tour is full (FIFO automatic promotion)
- Edit booking: change people count or date; transitions to waitlist if new slot is full
- Cancel booking: 100% refund >48h, 50% refund 24-48h, no refund <24h
- View booking ticket with QR code (opens 1h before tour)

**My Bookings:**
- Filter by: all / upcoming / completed / cancelled / waitlist
- Booking details: reference ID (SH-XXXX format), status, date, meeting point, ticket QR
- Download receipt, call guide, chat from booking page
- Write review (post-completion), open dispute (within 7 days)

**Payments & Cards:**
- Save multiple Stripe cards (Visa, etc.)
- Set default card, delete with automatic default promotion
- Full payment history with booking reference, status, booking mode indicator

**Wishlist:** Save tours for later; accessible from tour detail and dashboard

**Messages:** Initiate chats with any guide from their profile; continue from booking page; read receipts (sent/delivered indicator)

**Disputes:** Open dispute within 7 days of tour completion; view status; admin review

**Profile:**
- Cover photo and avatar upload
- Bio, travel interests, loyalty progress visualization
- Trust badges (email verified, phone verified, 2FA status)
- Impact score

**Settings:**
- Change password (with current password OR via 6-digit email code, 15min expiry)
- Email & push notification preferences
- Delete account (permanent data purge)

**Onboarding:**
- Step-by-step profile completion (full name, phone, country, city, nationality, DOB, headline, bio, travel preferences)
- Email verification (6-digit code, 30min expiry)
- Onboarding banner with uncompleted steps

### For Guides
**Dashboard:**
- Stats: total tour inventory, published count, pending count, active trips
- Tour template distribution chart (Published / Review / Drafts)
- Upcoming confirmed/pending feed

**Tour Management:**
- Create tour templates: title, description, category, tags, country/city picker, meeting point with map pin, itinerary route builder (click-to-add stops on Leaflet map with per-stop durations), photo/video gallery (first = cover, up to 100MB/file), capacity (min/max), Instant Book toggle, schedule (one-time or recurring), duration, base price, currency
- Recurring schedules: weekly patterns (select days), date range, auto-generate occurrences
- Dynamic pricing: weekend multiplier, holiday multiplier (Lebanese public holidays built-in)
- Group discount: threshold people count + discount percentage
- Halal certification flag + sub-options (prayer space, halal food, gender-sensitive guides)
- Family friendly, premium, inclusions/exclusions, requirements, what to bring
- Available languages with proficiency levels
- Live preview pane during creation
- Submit → admin review → publish flow
- Pause, resume, withdraw from review, archive

**Occurrence Management:**
- View upcoming and history occurrences
- Update date/time, capacity per occurrence
- Bulk schedule: select day pattern + date range → preview calendar → commit
- Time Sync: globally shift all future occurrence start times (preserves existing bookings)

**Bookings:**
- Full booking list with traveler info, PAX count, status, revenue
- Accept/reject Request-to-Book bookings
- Waitlist management: see queue, approve promotions

**On-Tour Toolkit:**
- QR scanner (`html5-qrcode`) to scan traveler QR codes for check-in
- Mark individual travelers: Checked In / No-Show (irreversible)
- View all travelers with contact details, check-in times

**Messages:** Chat with booked travelers; initiate from traveler public profile

**Wallet:**
- Available balance, pending (escrow), lifetime earnings
- Connected Stripe payout method
- Earnings history table (booking ID, gross amount, platform fee, net, status)
- Payout auto-released 48h after tour completion

**Wishlist (Inspiration List):** Save tours for market research

**Profile (Guide):**
- Cover photo, avatar, bio, expertise tags, languages with proficiency
- Portfolio management: choose which tours appear publicly (default: all published or previously published)
- Social links (TikTok, etc.)
- Digital security section: KYC status, email verified, 2FA status

**Verification:**
- Upload National ID (front + back) or Passport (1 image) + Selfie
- Admin reviews and approves/rejects with reason
- Required to publish tours; gate shown with "3 steps left" checklist

**Onboarding gate:** Before any tour can be published, must complete: email verify + profile + ID approval

**Settings:** Same as traveler: password, notifications, delete account

**Impact score, promos, reports pages** (available in navigation)

### For Admins
**Dashboard:** Live stats (total users, pending verifications, tour approvals), real-time system audit trail

**Users:**
- Full user list: role, status, email, profile completion, join date
- Per-user actions: Send Email, Suspend (with reason + optional expiry date), Permanent Ban (with reason), Deactivate (soft delete), Reactivate
- Broadcast Email to all active users (HTML email body supported)

**Guide Verifications:**
- Queue of pending KYC submissions (document type, submitted date)
- Review submitted images (ID front/back/selfie or passport + selfie)
- Approve or Reject (with rejection reason text — sent to guide via notification)

**Tour Approvals:**
- Review pending tour templates: title, description, price, duration, capacity, category, map, media, itinerary, inclusions/requirements
- Approve → publishes tour immediately
- Reject → send reason to guide via notification

**Disputes Court:**
- All disputes with type, status, priority, deadline
- Admin resolution interface

**Support Tickets:**
- All contact form submissions, priority, status (Open / In Progress / Resolved / Closed)
- Reply via email directly from admin panel
- Add internal resolution notes
- Change ticket status

**Payouts:**
- Registry of all guide payouts: gross amount, platform fee, net earnings, Stripe method, status (pending/transferred/failed/cancelled)
- Transaction receipt per payout
- Platform fee telemetry: total volume, total fees

**Audit Trail:**
- Immutable log of every admin action: timestamp, authority, protocol, action type, before/after values, target entity ID
- Actions tracked: guide verify approve/reject, tour approve/reject, user activate/deactivate/ban/suspend, broadcast email, payout actions, and more

**Settings:**
- Account security (password change)
- Notification preferences
- Platform settings: name, support email, maintenance mode, email templates (welcome, booking confirmation, payout)
- Fee structure: platform fee % per loyalty tier (Bronze 15%, Silver 12%, Gold 10%, Platinum 8%), payout freeze hours (default 48h), cart lock duration (default 15min)
- Region config: Lebanon (LBP exchange rate) and Turkey (TRY exchange rate)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  FRONTEND  Next.js 16 (App Router) · React 19 · TypeScript      │
│  Tailwind v4 · Framer Motion · Leaflet · STOMP/SockJS           │
│                                                                  │
│  src/lib/api/          ← 17 typed Axios API modules             │
│  src/lib/hooks/        ← useChatSocket, useNotificationSocket,  │
│                           usePushNotifications, usePaymentCountdown│
│  src/lib/contexts/     ← AuthContext, FilterContext,            │
│                           SignupContext, WishlistContext         │
│  src/components/       ← 70+ reusable components                │
│  app/ (App Router)     ← 70+ Next.js pages                      │
└──────────────────┬──────────────────────────────────────────────┘
                   │  HTTP (Next.js rewrites /api → :8081)
                   │  WebSocket (/ws-chat STOMP over SockJS)
┌──────────────────▼──────────────────────────────────────────────┐
│  BACKEND  Spring Boot 3 · Java 17                                │
│                                                                  │
│  Security:  JWT (15min) + HttpOnly refresh cookie (7/30d)       │
│             Google OAuth2 · BCrypt · RateLimiterService          │
│                                                                  │
│  Controllers (REST):                                             │
│    AuthController          BookingController                     │
│    GuideTourController     PublicTourController                  │
│    AdminUserController     AdminGuideVerificationController      │
│    AdminTourController     AdminPayoutController                 │
│    AdminAuditController    AdminSupportController                │
│    AdminGuideFeeController NotificationController                │
│    ReviewController        ChatController                        │
│    GuideProfileController  GuideVerificationController           │
│    GuideEarningsController TravelerPaymentController             │
│    StripePaymentController MockPaymentController                 │
│    WishlistController      TourMediaController                   │
│    PublicDiscoveryController                                     │
│                                                                  │
│  Services:                                                       │
│    BookingService (pessimistic lock)  PricingService             │
│    TourTemplateService                TourOccurrenceService      │
│    StripePaymentService               AdminPayoutService         │
│    NotificationService (WS + Email)   ReviewService              │
│    ReviewReminderService              ChatService                │
│    AdminAuditService                  TimeService (UTC clock)    │
│    EmailService (Brevo SMTP)          GuideEarningsService       │
│    WishlistService                    TourMediaService           │
│    PublicTourService                  CustomUserDetailsService   │
│                                                                  │
│  Scheduled Jobs (5):                                             │
│    PaymentTimeoutJob   (every 60s)  — expire PendingPayment      │
│    ReviewReminderJob   (every 1h)   — 24h post-tour email        │
│    BookingStatusCleanupJob (every 1h) — auto-complete stale      │
│    SuspensionCleanupJob (every 60s) — lift expired suspensions   │
│    PayoutReleaseJob    (every 1h)   — release 48h escrow         │
│                                                                  │
│  WebSocket:  Spring STOMP Broker                                 │
│    /topic/chat/{conversationId}      — chat messages             │
│    /topic/notifications/{userId}     — personal notifications    │
│    READ_RECEIPT support in chat      — delivered/seen            │
└──────────────────┬──────────────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────────────┐
│  DATABASE  PostgreSQL 15+ · Flyway V1–V66                        │
│  Pessimistic locking · Optimistic locking (@Version)            │
│  Partial indexes · TIMESTAMPTZ everywhere · Soft deletes         │
└──────────────────────────────────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────────────┐
│  EXTERNAL SERVICES                                               │
│  Stripe Connect  — checkout sessions, webhooks, transfers        │
│  Brevo SMTP      — all transactional emails                      │
│  Google OAuth2   — social login                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Backend
| | Technology | Details |
|---|---|---|
| Language | Java 17 | |
| Framework | Spring Boot 3.x | Maven |
| Security | Spring Security 6 | JWT + HttpOnly cookies + OAuth2 |
| ORM | Hibernate/JPA | Pessimistic + Optimistic locking |
| Database | PostgreSQL 15+ | `TIMESTAMPTZ` everywhere |
| Migrations | Flyway | V1–V66, `validate` mode |
| Real-Time | Spring WebSocket STOMP | SockJS transport |
| Payments | Stripe SDK | Checkout + Webhooks + Connect Transfers |
| Email | Brevo SMTP | Spring Mail (`spring.mail.*`) |
| Rate Limiting | In-memory fixed-window | `RateLimiterService` |
| Scheduling | Spring `@Scheduled` | 5 background jobs |
| Config | `LoyaltyProperties` | All thresholds externalized |

### Frontend
| | Technology | Details |
|---|---|---|
| Framework | Next.js 16 (App Router) | `reactCompiler: true` |
| UI | React 19 | |
| Language | TypeScript 5 | Strict typing |
| Styling | Tailwind CSS v4 | Custom design system (electric blue + orange) |
| Animation | Framer Motion 12 | |
| Maps | Leaflet + react-leaflet 5 | Interactive tour maps + route builder |
| WebSocket | @stomp/stompjs + sockjs-client | Chat + Notifications |
| HTTP | Axios | 17 typed API modules, interceptors, auto-refresh |
| QR | qrcode.react + html5-qrcode | Generate + scan QR codes |
| Notifications | sonner + react-hot-toast | |
| UI Primitives | @headlessui/react + @radix-ui | |
| Phone Input | react-phone-number-input | |
| Globe | cobe | Landing page 3D globe |
| Theme | next-themes | Dark/light with custom CSS variables |

---

## 🚀 Getting Started

### Prerequisites
- **Java 17+** (OpenJDK)
- **Node.js 18+**
- **PostgreSQL 15+**
- **Stripe account** — [dashboard.stripe.com](https://dashboard.stripe.com) (free test keys)
- **Brevo account** — [brevo.com](https://brevo.com) (free SMTP)
- **Google Cloud** — OAuth2 credentials

### 1. Clone
```bash
git clone https://github.com/mo-maarouf/Graduation-Project.git
cd Graduation-Project
```

### 2. Create the Database
```bash
psql -U postgres -c "CREATE DATABASE travel_db;"
```

### 3. Backend Configuration

The backend runs on **port 8081** (not 8080).

Create `backend/src/main/resources/application.properties` — see [`ENV_REFERENCE.md`](ENV_REFERENCE.md) for all variables. Minimum required:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/travel_db
spring.datasource.username=postgres
spring.datasource.password=YOUR_DB_PASSWORD

jwt.secret=YOUR_256_BIT_SECRET_KEY_MIN_32_CHARS
jwt.expiration=900000

spring.security.oauth2.client.registration.google.client-id=YOUR_GOOGLE_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_GOOGLE_CLIENT_SECRET
app.oauth2.frontend-redirect=http://localhost:3000/auth/oauth-callback

spring.mail.host=smtp-relay.brevo.com
spring.mail.port=587
spring.mail.username=YOUR_BREVO_LOGIN
spring.mail.password=YOUR_BREVO_SMTP_KEY
app.mail.from=noreply@safarihub.com
app.frontend.base-url=http://localhost:3000

stripe.secret-key=sk_test_YOUR_KEY
stripe.webhook-secret=whsec_YOUR_SECRET
stripe.mock-mode=true   # Set false for real Stripe

app.payout.freeze-hours=0    # 0 = instant for demos; 48 for production
app.loyalty.silver-min-trips=5
app.loyalty.gold-min-trips=10
app.loyalty.bronze-discount-pct=0
app.loyalty.silver-discount-pct=5
app.loyalty.gold-discount-pct=10
app.loyalty.platform-fee-rate=10
```

Start:
```bash
cd backend
./mvnw spring-boot:run
```
> Flyway applies all 66 migrations automatically on first startup.

### 4. Frontend Configuration

```bash
cd frontend
npm install
```

The frontend proxies `/api/*` → `http://localhost:8081/api/*` via Next.js rewrites — **no `NEXT_PUBLIC_API_BASE_URL` needed for local dev**.

```bash
npm run dev          # Standard dev server
npm run dev:mobile   # Prints QR code for same-WiFi mobile testing
```

App available at **http://localhost:3000**.

### 5. Test the Full Flow

1. Register as **Traveler** → verify email (check console for dev code)
2. Register as **Guide** → verify email → complete profile → submit ID verification
3. Login as **Admin** (`admin@test.com` or create manually in DB) → approve guide KYC
4. Guide creates a Tour → submits for review → admin approves → tour published
5. Traveler browses tours → books → pays (mock mode: `/checkout/mock`) → booking confirmed
6. Guide checks in traveler via QR scan → marks complete → payout enters escrow
7. 24h later, traveler receives review reminder email

---

## 📚 API Reference

Import `TravelMarket_Chat_Tests.postman_collection.json` from the repo root into [Postman](https://postman.com).

### Auth — `/api/auth`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | Public | Register traveler or guide |
| POST | `/login` | Public | Login with email + password |
| POST | `/refresh` | Cookie | Rotate access + refresh tokens |
| POST | `/logout` | JWT | Revoke current refresh token |
| POST | `/logout-all` | JWT | Revoke all sessions |
| GET | `/me` | JWT | Get current user info |
| POST | `/email/verify/request` | Public | Send 6-digit email verification code |
| POST | `/email/verify/confirm-code` | Public | Confirm email with code |
| POST | `/email/verify/confirm-token` | Public | Confirm email with link token |
| POST | `/password/forgot` | Public | Request password reset (6-digit code, 15min) |
| POST | `/password/reset` | Public | Reset password with token |
| POST | `/password/change` | JWT | Change password with current password |
| POST | `/password/setup/request` | JWT | Request code to add password (OAuth users) |
| POST | `/password/setup/confirm` | JWT | Set password with emailed code |
| GET | `/oauth2/google` | Public | Initiate Google OAuth2 flow |

### Public Tours — `/api/public`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tours` | List/search tours (15+ filter params) |
| GET | `/tours?minLat=&maxLat=&minLng=&maxLng=` | Bounding box geo-search |
| GET | `/tours/nearby?lat=&lng=&radiusKm=` | Radius search with distance |
| GET | `/tours/{id}` | Full tour detail |
| GET | `/tours/{id}/occurrences` | Future occurrences for a tour |
| GET | `/tours/{tourId}/occurrences/{occurrenceId}/price-preview?peopleCount=` | Price breakdown |
| GET | `/tours/{id}/route` | Trail waypoints (Leaflet polyline) |
| GET | `/guides/{guideId}` | Public guide profile |
| GET | `/guides/{guideId}/tours` | Guide portfolio |
| GET | `/guides/{guideId}/tours/{tourId}` | Portfolio tour detail |
| GET | `/guides/search?q=` | Search guides by name |

### Traveler — `/api/traveler` (TRAVELER role)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/bookings` | Create booking (Instant or Request) |
| GET | `/bookings` | List all my bookings |
| GET | `/bookings/{id}` | Booking detail + QR code |
| PATCH | `/bookings/{id}` | Update booking (people count or date) |
| DELETE | `/bookings/{id}` | Cancel booking |
| POST | `/waitlist` | Join waitlist for full occurrence |
| GET | `/waitlist` | My waitlist entries |
| DELETE | `/waitlist/{id}` | Leave waitlist |

### Guide — `/api/guide` (GUIDE role)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/tours` | Create tour template |
| GET | `/tours` | List my tours |
| GET | `/tours/{id}` | Get one tour |
| PUT | `/tours/{id}` | Update tour |
| DELETE | `/tours/{id}` | Soft-delete tour |
| POST | `/tours/{id}/submit` | Submit for admin review |
| POST | `/tours/{id}/withdraw` | Withdraw from review |
| POST | `/tours/{id}/pause` | Pause tour |
| POST | `/tours/{id}/resume` | Resume tour |
| POST | `/tours/{id}/archive` | Archive tour |
| POST | `/tours/{id}/occurrences` | Create occurrence |
| GET | `/tours/{id}/occurrences` | List occurrences |
| PUT | `/occurrences/{id}` | Update occurrence |
| DELETE | `/occurrences/{id}` | Delete occurrence |
| PUT | `/occurrences/{id}/route` | Set trail waypoints |
| GET | `/bookings` | All bookings on my tours |
| GET | `/bookings/{id}` | Booking detail |
| PUT | `/bookings/{id}/confirm` | Accept request booking |
| PUT | `/bookings/{id}/reject` | Reject request booking |
| POST | `/bookings/checkin-by-qr/{qrToken}` | QR check-in scanner |
| POST | `/bookings/{id}/complete` | Mark tour complete |
| POST | `/bookings/{id}/no-show` | Mark traveler no-show |
| GET | `/waitlist` | Waitlist across all my tours |

### Payments — `/api/payments`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/create-session` | TRAVELER | Create Stripe Checkout Session |
| POST | `/webhook` | Stripe sig | Handle Stripe events |
| POST | `/mock/confirm/{sessionId}` | JWT | Simulate payment success (mock mode) |

### Reviews — `/api/reviews` (partial public)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | TRAVELER | Submit review for completed booking |
| GET | `/tour/{tourId}` | Public | Tour reviews |
| GET | `/guide/{guideId}` | Public | Guide reviews |
| GET | `/guide/{guideId}/summary` | Public | Rating summary |
| PUT | `/{id}` | TRAVELER | Update own review |
| POST | `/{id}/helpful` | JWT | Toggle helpful vote |
| DELETE | `/{id}` | JWT | Delete review (or admin) |

### Notifications — `/api/notifications` (JWT)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Paginated notification list |
| GET | `/unread-count` | Unread badge count |
| PUT | `/{id}/read` | Mark one as read |
| PUT | `/read-all` | Mark all as read |

### Chat — `/api/chat` (JWT)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/initiate` | Start or find conversation |
| GET | `/conversations` | My conversation list |
| GET | `/conversations/{id}/messages` | Message history |
| POST | `/conversations/{id}/messages` | Send message |
| PUT | `/conversations/{id}/read` | Mark messages read |

### Admin — `/api/admin` (ADMIN role)
| Domain | Key Endpoints |
|--------|---------------|
| Users | `GET /users`, `PATCH /users/{id}/suspend`, `PATCH /users/{id}/ban`, `PATCH /users/{id}/deactivate`, `POST /users/broadcast-email` |
| Verifications | `GET /guide-verifications`, `POST /guide-verifications/{id}/approve`, `POST /guide-verifications/{id}/reject` |
| Tours | `GET /tours/pending`, `POST /tours/{id}/approve`, `POST /tours/{id}/reject` |
| Payouts | `GET /payouts`, `POST /payouts/{id}/approve` |
| Disputes | `GET /disputes`, `PUT /disputes/{id}/resolve` |
| Support | `GET /support/tickets`, `PATCH /support/tickets/{id}/status`, `POST /support/tickets/{id}/messages` |
| Audit | `GET /audit-events` |
| Fees | `GET/PUT /fees` |
| Settings | `GET/PUT /platform-settings` |

### WebSocket — `ws://localhost:8081/ws-chat`
```
CONNECT headers: { Authorization: "Bearer <token>" }

SUBSCRIBE /topic/chat/{conversationId}     → MessageResponse | READ_RECEIPT
SUBSCRIBE /topic/notifications/{userId}   → NotificationResponse

SEND /app/chat.send   → { conversationId, content }
```

---

## 📁 Project Structure

```
Graduation-Project/
├── backend/
│   └── src/main/
│       ├── java/com/travelmarket/backend/
│       │   ├── BackendApplication.java
│       │   ├── booking/
│       │   │   ├── controller/BookingController.java      ← ALL booking + waitlist endpoints
│       │   │   ├── dto/request/  (5 DTOs)
│       │   │   ├── dto/response/ (4 DTOs)
│       │   │   ├── entity/       Booking.java, WaitlistEntry.java
│       │   │   ├── enums/        BookingStatus, BookingMode, LoyaltyTier
│       │   │   ├── repository/   BookingRepository, WaitlistRepository
│       │   │   └── service/      BookingService, PricingService, ReviewReminderService
│       │   ├── chat/             ChatController, ChatService, Conversation, Message
│       │   ├── config/           SecurityConfig, WebSocketConfig, LoyaltyProperties, JacksonConfig
│       │   ├── controller/       Admin* controllers, AuthController, GuideProfileController...
│       │   ├── entity/           User, UserIdentity, TravelerProfile, GuideProfile...
│       │   ├── exception/        GlobalExceptionHandler
│       │   ├── jobs/             PaymentTimeoutJob, ReviewReminderJob,
│       │   │                     BookingStatusCleanupJob, SuspensionCleanupJob
│       │   ├── notification/     NotificationController, NotificationService,
│       │   │                     NotificationType (30+ types)
│       │   ├── payment/
│       │   │   ├── controller/   PaymentController, TravelerPaymentController,
│       │   │   │                 GuideEarningsController, MockPaymentController
│       │   │   ├── jobs/         PayoutReleaseJob
│       │   │   └── service/      StripePaymentService, AdminPayoutService, GuideEarningsService
│       │   ├── review/           ReviewController, ReviewService, Review, ReviewHelpfulVote
│       │   ├── security/         JwtAuthFilter, JwtUtil, OAuth2 handlers, RateLimiterService
│       │   ├── service/          AdminAuditService, EmailService, TimeService,
│       │   │                     CustomUserDetailsService
│       │   └── tour/
│       │       ├── controller/   GuideTourController, PublicTourController,
│       │       │                 AdminTourController, TourMediaController,
│       │       │                 WishlistController, PublicDiscoveryController
│       │       ├── entity/       TourTemplate, TourOccurrence, TourMedia,
│       │       │                 TourMapPoint, PricingRule, WishlistItem
│       │       ├── enums/        TourTemplateStatus, TourOccurrenceStatus,
│       │       │                 TourMediaType, RecurrencePattern, PricingRuleType
│       │       └── service/      TourTemplateService, TourOccurrenceService,
│       │                         PublicTourService, TourMediaService, WishlistService
│       └── resources/
│           ├── application.properties   ← all config via env vars
│           └── db/migration/            ← V1 through V66 SQL files
│
└── frontend/
    ├── next.config.ts                   ← rewrites /api → :8081
    ├── tailwind.config.ts               ← electric blue + orange design system
    └── src/
        ├── app/                         ← 70+ Next.js App Router pages
        │   ├── (auth pages)             login, signup, verify, reset-password, oauth-callback
        │   ├── (public pages)           /, /tours, /tours/[id], /guides/[id], /how-it-works...
        │   ├── dashboard/
        │   │   ├── traveler/            bookings, payments, wishlist, disputes, messages,
        │   │   │                        profile, settings, complete-profile
        │   │   ├── guide/               tours, bookings, on-tour/[id], wallet, wallet/payouts,
        │   │   │                        messages, disputes, profile, verification, settings,
        │   │   │                        wishlist, impact, promos, reports, complete-profile
        │   │   └── admin/               users, verifications, tours, payouts, disputes,
        │   │                            support, audit, blacklist, settings
        │   └── (utility)                bookings/[id]/ticket, /[id]/review, checkout/mock
        ├── components/                  ← 70+ reusable components
        │   ├── auth/                    LoginForm, SignupPathSelector, TravelerProfileForm,
        │   │                            GuideProfileForm, GuideVerificationForm, TermsAgreement...
        │   ├── booking/                 PaymentCountdownBanner
        │   ├── chat/                    NewChatModal
        │   ├── landing/                 HeroSection, ImpactMap (Cobe globe), CategoryTiles,
        │   │                            LandingV3, SafetyPillarBar
        │   ├── layout/                  Navigation, Footer, MobileBottomNav, ThemeToggle
        │   ├── search/                  PowerSearch, SearchFilters, TourSearch, PriceSlider,
        │   │                            FilterSection, MobileFilterDrawer
        │   ├── tour-detail/             BookingCard, TourHero, TourMap, TourInfo, ReviewList,
        │   │                            TourGuide, SimilarTours
        │   └── ui/                      MapPicker, RouteBuilderMap, CalendarPicker,
        │                                OtpInput, VideoPlayer, Skeleton, Portal...
        └── lib/
            ├── api/                     ← 17 typed API modules
            │   admin.ts, auth.ts, chat.ts, discovery.ts, disputes.ts, guides.ts,
            │   notifications.ts, payment.ts, support.ts, tours.ts, traveler.ts,
            │   traveler-payments.ts, guide-payouts.ts, wishlist.ts, blacklist.ts,
            │   travelers.ts, websocket-url.ts
            ├── contexts/                AuthContext, FilterContext, SignupContext, WishlistContext
            ├── hooks/                   useChatSocket, useNotificationSocket,
            │                            usePushNotifications, usePaymentCountdown, useBadgeReset
            └── types/                   auth.types, tour.types, guide.types, tour-detail.types
```

---

## 🔑 Pricing Engine

All pricing logic lives in `PricingService.java`. No numbers are hardcoded — all come from `LoyaltyProperties` bound from `application.properties`.

**Calculation order** (each step modifies the result of the previous):
1. **Subtotal** = `basePrice × peopleCount`
2. **Group discount** — if template has `hasGroupDiscount=true` and `peopleCount >= groupDiscountThreshold`
3. **Loyalty tier discount** — BRONZE: 0%, SILVER: 5%, GOLD: 10% (configurable)
4. **Dynamic pricing multiplier** — weekend or Lebanese public holiday (whichever is active; holiday takes priority)
5. **Platform fee** = `finalPrice × (platformFeeRate × guide.currentFeeMultiplier)` — stays in platform account

**Price preview** (`/api/public/.../price-preview`) excludes platform fee (traveler-facing) and works for unauthenticated guests.

**Loyalty tiers** auto-upgrade on completed trips: BRONZE (0 trips) → SILVER (5 trips, configurable) → GOLD (10 trips, configurable).

---

## 🗄️ Database — Flyway Migrations

66 versioned migrations, all using `TIMESTAMPTZ`. Key milestones:

| Version | What changed |
|---------|-------------|
| V1 | Initial schema: users, traveler_profiles, guide_profiles, tour_templates, tour_occurrences |
| V2 | User identities (OAuth provider tracking) |
| V3 | Terms agreements, profile completion flags |
| V4 | User account status (active, suspended, banned) |
| V12 | Refresh token table |
| V16 | Admin audit events table |
| V17 | Tour media, map points, pricing rules, tour expansion |
| V28 | Recurring tour schedule fields |
| V37 | Dynamic pricing JSON + halal details |
| V38 | Booking lifecycle: QR code, waiver, cart expiry, pricing snapshots |
| V39 | Waitlist enhancements + booking snapshots |
| V42 | Reviews table |
| V43 | Review helpfulness voting |
| V44 | Geo index on map points |
| V45 | Stripe payment fields + payout fields |
| V47 | Traveler saved payment methods |
| V49–V52 | Conversations, messages, message read status |
| V51 | Notifications table |
| V53 | Partial index: `PendingPayment` bookings by `cart_expires_at_utc` |
| V54 | Partial index: tour occurrences for pessimistic lock |
| V58 | `review_reminder_sent_at` + partial index |
| V59 | Loyalty tier enum update (GOLD added) |
| V60 | Per-user notification preferences |
| V61–V62 | Disputes table + against-user response field |
| V63–V64 | Support tickets + support messages tables |
| V65 | `has_password` flag (OAuth users without passwords) |
| V66 | Nullable audit target ID |

---

## 📄 Technical Documentation

| Document | Contents |
|----------|----------|
| [`docs/CONCURRENCY.md`](docs/CONCURRENCY.md) | Pessimistic lock (`SELECT … FOR UPDATE`), TOCTOU race condition, 2000ms timeout, deadlock prevention via ascending ID order |
| [`docs/BOOKING_TIMEOUT.md`](docs/BOOKING_TIMEOUT.md) | 15-minute payment window, `PaymentTimeoutJob`, frontend countdown urgency levels, race condition handling |
| [`docs/NOTIFICATIONS.md`](docs/NOTIFICATIONS.md) | Event-driven pipeline, WebSocket delivery, browser push, 30+ notification types |
| [`docs/TIME_MANAGEMENT.md`](docs/TIME_MANAGEMENT.md) | UTC-everywhere strategy, `TimeService`, DST handling, Lebanese timezone, `TIMESTAMPTZ` |
| [`docs/Review-Reminder-Service.md`](docs/Review-Reminder-Service.md) | 24h post-tour reminder, 4-layer anti-duplication, opt-out, idempotency |
| [`docs/Soft-Delete.md`](docs/Soft-Delete.md) | Soft delete pattern, explicit JPQL filters, partial indexes, intentional hard deletes |
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | Deep dive: all layers, concurrency, escrow model, Stripe flow, scheduling |
| [`ENV_REFERENCE.md`](ENV_REFERENCE.md) | Every environment variable, production checklist |

---

## 🤝 Contributing

Please read [`CONTRIBUTING.md`](CONTRIBUTING.md) for branch naming, commit convention, backend rules (TimeService, soft delete, concurrency), migration checklist, and PR process.

---

## 📄 License

MIT — see [LICENSE](LICENSE)

---

<div align="center">Built in 🇱🇧 Lebanon</div>
