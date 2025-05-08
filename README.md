# Rupa Rawi Frontend

Rupa Rawi is a sustainable community market platform that empowers local artists to reach more buyers and share the stories behind their creations. This is the frontend web application, built with modern technologies for a seamless and engaging user experience.

## 🌱 Project Overview
- **Mission:** Connect local artists with a wider audience and highlight the unique stories behind every product.
- **Platform:** Community marketplace for sustainable, ethical, and creative products.

## 🚀 Tech Stack
- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** TypeScript, React 19
- **Styling:** Tailwind CSS, custom fonts (Inter, Cormorant Garamond, League Script)
- **Animation:** Framer Motion
- **State/Context:** React Context API (for auth)

## 📁 Folder Structure
```
/src/app
  |-- about/            # About page (mission, values, team)
  |-- api/              # API route handlers and backend integration
  |-- articles/         # Articles/blog section and article detail pages
  |-- cart/             # Shopping cart page and logic
  |-- checkout/         # Checkout flow and payment
  |-- components/       # Reusable UI components (Navbar, Footer, Product, etc)
  |-- context/          # React context (auth, etc)
  |-- controllers/      # Business logic (cart, auth, etc)
  |-- dashboard/
      |-- admin/        # Admin dashboard pages and features
      |-- buyer/        # Buyer dashboard and features
      |-- vendor/       # Vendor dashboard (products, profile, orders, stats)
  |-- hooks/            # Custom React hooks
  |-- login/            # Login page
  |-- register/         # Registration page
  |-- services/         # Service layer for API requests
  |-- shop/             # Shop, product detail, and product browsing
  |-- utils/            # Utility functions
  |-- vendor-apply/     # Vendor application flow
  |-- vendor-products/  # Public vendor product browsing
  |-- globals.css       # Global styles (Tailwind)
  |-- layout.tsx        # Root layout (Navbar, Footer)
  |-- page.tsx          # Landing page
```

## ✨ Core Features
- Modern, responsive landing page
- Animated About page with mission, values, and team
- User authentication (register, login, logout)
- Product browsing & shopping cart (shows real product images in cart, robust fallback logic)
- Profile and account management
- Clean, accessible UI with smooth animations
- Sustainability attributes, stock quantity, and minimum order quantity are always displayed if present

## 👩‍💼 Admin Features
- Vendor dashboard with product management (add, edit, delete, activate/deactivate)
- Product table with improved readability (image column and placeholders removed for a cleaner look)
- Vendor management (approve, reject, suspend vendors)
- Vendor status system: **Active** (green), **Pending** (yellow), **Rejected** (red)
- Dashboard overview with vendor list preview
- Admin articles section (publish, edit, manage articles)
- Success/error notifications for admin actions
- Vendor Management section with tabbed interface:
  - **Active Vendors:** List, view, suspend, or delete approved vendors
  - **Vendor Requests:** Review, approve, or reject pending vendor applications (bulk actions supported)
- Three-status system for vendors: **Active** (green), **Pending** (yellow), **Rejected** (red)
- Vendor List Preview in dashboard overview for quick access
- Articles section for admins to publish articles (title, content, image upload, rich text editing planned)
- Success/error notifications for admin actions

## 🛠️ Getting Started
1. **Install dependencies:**
   ```bash
   npm install
   # or
yarn install
   ```
2. **Start the development server:**
   ```bash
   npm run dev
   # or
yarn dev
   ```
3. Visit [http://localhost:3000](http://localhost:3000)

## 🖼️ Customization
- Place your logo at `/public/RupaRawi.png` for branding.
- Update About page visuals in `/public/about-artist.svg`, `/public/about-market.svg`, etc.

## 🤝 Contributing
1. Fork this repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## 📄 License
This project is open-source and available under the MIT License.

---

For questions or feedback, please contact the Rupa Rawi team.
