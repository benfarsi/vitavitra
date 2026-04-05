# Vita Vitra — React Native App

## Stack
- Expo + Expo Router (file-based navigation)
- Supabase (auth, database)
- Stripe (payments)
- TypeScript

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Supabase
- Create a new project at supabase.com
- Go to SQL Editor and run `supabase_schema.sql`
- Copy your project URL and anon key

### 3. Environment
```bash
cp .env.example .env
# Fill in your Supabase URL and anon key
```

### 4. Run
```bash
npx expo start
```
Scan QR with Expo Go app on your phone.

## Project Structure
```
app/
  _layout.tsx          # Root layout + auth provider
  index.tsx            # Redirect logic
  onboarding.tsx       # Welcome screen
  quote.tsx            # Free quote request
  auth/
    login.tsx
    signup.tsx
  tabs/
    _layout.tsx        # Tab bar
    home.tsx           # Home feed
    services.tsx       # All services
    bookings.tsx       # User bookings
    profile.tsx        # Profile + settings
  booking/
    [serviceId].tsx    # Booking flow

constants/
  theme.ts             # Colors, spacing, fonts
  services.ts          # Service data

lib/
  supabase.ts          # Supabase client + db helpers
  auth.tsx             # Auth context
```

## Supabase Tables
- `profiles` — user info (name, phone, address)
- `bookings` — service bookings with status
- `quotes` — free quote requests (no auth required)

## TODO
- [ ] Stripe payment integration on booking confirm
- [ ] Push notifications for booking status updates
- [ ] Admin dashboard (separate web app)
- [ ] Stripe webhook for payment confirmation
