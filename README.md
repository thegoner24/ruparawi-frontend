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
  |-- components/       # Reusable UI components (Navbar, Footer, etc)
  |-- context/          # Auth context
  |-- controllers/      # Logic for cart, auth, etc
  |-- login/            # Login page
  |-- register/         # Registration page
  |-- shop/             # Shop and product-related pages
  |-- globals.css       # Global styles (Tailwind)
  |-- layout.tsx        # Root layout (Navbar, Footer)
  |-- page.tsx          # Landing page
```

## ✨ Core Features
- Modern, responsive landing page inspired by PayPal
- Animated About page with mission, values, and team
- User authentication (register, login, logout)
- Product browsing & shopping cart
- Profile and account management
- Clean, accessible UI with smooth animations

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
