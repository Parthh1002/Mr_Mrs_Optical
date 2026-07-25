<div align="center">

# 🕶️ MR. & MRS. OPTICAL
### Premium Luxury Eyewear & Optical Care Platform

[![Next.js 16](https://img.shields.io/badge/Next.js-16.2.10-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-ORM_5-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![GSAP 3](https://img.shields.io/badge/GSAP-3.15.0-88CE02?style=for-the-badge&logo=greensock&logoColor=black)](https://greensock.com/gsap/)
[![Vercel Deployed](https://img.shields.io/badge/Vercel-Production_Live-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

<p align="center">
  <b>A Next-Generation, Ultra-Luxury Optical E-Commerce & Appointment Platform</b><br />
  Built with dynamic 3D HTML5 Canvas rendering, cinematic GSAP shutter transitions, real-time Supabase database integration, and a powerful Admin CMS dashboard.
</p>

---

</div>

## 🌟 Executive Summary

**Mr. & Mrs. Optical** is an elite, high-end web application crafted specifically for modern optical luxury stores. Designed with high-performance animations, fluid smooth scrolling, dynamic catalog management, interactive face-shape and lens selection tools, and an integrated online appointment booking engine for eye checks.

Engineered with **Next.js 16 (Turbopack)** and **React 19**, it delivers sub-second page loads, effortless responsiveness across mobile & desktop screens, and a robust admin workflow for managing products, banners, discounts, bookings, and site content in real time.

---

## 🔥 Cutting-Edge Technology Stack

The project utilizes industry-leading, high-performance web technologies:

| Domain | Technology / Library | Description & Role |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16.2 (Turbopack)** | App Router architecture, Server Actions, Dynamic SSR & Static Site Generation |
| **UI Library** | **React 19.2** | Concurrent Rendering, Server Components, and optimized state hooks |
| **Language** | **TypeScript 5** | Strict type safety, interface enforcement, and bug prevention |
| **Styling** | **Tailwind CSS v4** | Modern utility-first styling engine with customized HSL luxury color tokens |
| **3D Engine** | **HTML5 Canvas 2D/3D** | Custom 3D wireframe matrix projection renderer for luxury 3D eyeglasses |
| **Animations** | **GSAP 3.15 + Framer Motion 12** | Cinematic shutter doors reveal, timeline sequencing, and sleek micro-interactions |
| **Smooth Scroll** | **Lenis React** | Inertia-based momentum smooth scrolling engine |
| **Database** | **Supabase PostgreSQL** | Cloud-native relational database with dual connection pooling (Transaction & Direct) |
| **Database ORM** | **Prisma ORM 5** | Type-safe database queries, schema migrations, and real-time generation |
| **State Engine** | **Zustand 5** | Lightweight, persistent client-side state for Cart, Wishlist, and Filters |
| **UI Components** | **Radix UI & Base UI** | Accessible, unstyled UI primitives (Dialogs, Select, Forms) |
| **Forms & Validation** | **React Hook Form + Zod** | High-performance form handling with schema-level validation |
| **PDF Generation** | **PDF-Lib** | Server/Client side generation of invoices, receipts & optical prescription PDFs |
| **Drag & Drop** | **@hello-pangea/dnd** | Interactive drag-and-drop banner & category reordering in Admin CMS |
| **Notifications** | **Sonner** | Modern, customizable toast notifications |

---

## ✨ Key Features & User Experience

### 1. 🎬 Cinematic 3D Intro Experience
- **Interactive 3D Eyeglasses Projection**: Real-time canvas projection of rotating 3D frames with dynamic light shimmers and gold glows.
- **GSAP Shutter Doors**: Ultra-smooth mechanical door reveal on initial site visit.
- **Session Intelligence**: Smart `sessionStorage` tracking prevents repetitive intros while maintaining zero landing page flash on load.

### 2. 👓 Interactive Optical Stylist Tools
- **Face Shape Guide**: Interactive guide for finding ideal frame shapes based on facial structure (Round, Oval, Square, Heart, Diamond).
- **Lens Selection Guide**: Interactive guide breaking down optical lens technology (Single Vision, Progressive, Bifocal, Blue Light Cut, Anti-Reflective, Transitions).

### 3. 🛍️ E-Commerce & Product Catalog
- **Multi-Param Filtering**: Search & filter by Categories, Brands, Frame Shapes, Frame Materials, Gender, and Price Ranges.
- **Dynamic Wishlist & Cart**: Persistent Zustand-powered shopping cart & wishlist with dynamic price computation and discount application.

### 4. 📅 Online Eye Check & Appointment Scheduler
- **Time-Slot Booking**: Seamless online booking system for in-store eye examinations and consultation slots.
- **Automated Customer Alerts**: Integrated booking status workflow (Pending, Confirmed, Completed, Cancelled).

### 5. 🛠️ Comprehensive Admin CMS Dashboard (`/admin`)
- **Live Website Content Editor**: Visual editor for home, about, and contact page text & banners without touching code.
- **Product Management**: Full CRUD operations for adding/editing frames, updating stock levels, uploading multi-angle images, and toggling active status.
- **Brand & Category Manager**: Drag-and-drop sorting and icon updates for optical brands and frame categories.
- **Discounts & Coupons**: Create campaign discounts, percentage/flat offer coupons, and minimum cart value rules.
- **Bookings Management**: View, filter, and update customer appointment schedules in real-time.

---

## 🗄️ Database Architecture (Supabase PostgreSQL + Prisma)

The database consists of 8 core schema models tailored for scalable retail operations:

```mermaid
erDiagram
    Category ||--o{ Product : contains
    Brand ||--o{ Product : manufactures
    
    Category {
        string id PK
        string name
        string slug
        int sortOrder
        string iconImage
    }
    
    Brand {
        string id PK
        string name
        string logoImage
    }
    
    Product {
        string id PK
        string name
        float price
        float mrp
        int stockQty
        string frameShape
        string frameMaterial
        string gender
        string images
        boolean isActive
    }
    
    Banner {
        string id PK
        string title
        string image
        int sortOrder
        boolean isActive
    }
    
    Booking {
        string id PK
        string name
        string phone
        string bookingDate
        string timeSlot
        string status
    }
    
    Discount {
        string id PK
        string type
        string title
        string couponCode
        float percentOff
        boolean isActive
    }
```

---

## 📁 Repository Structure

```
Mr_Mrs_Optical/
├── prisma/
│   └── schema.prisma         # PostgreSQL schema definition & models
├── src/
│   ├── app/                  # Next.js 16 App Router Pages & API Endpoints
│   │   ├── (client routes)   # /about, /catalog, /collection, /contact, /gallery, /book
│   │   ├── admin/            # Admin CMS Dashboard pages (/products, /bookings, /banners, etc.)
│   │   └── api/              # Server API handlers (upload, confirm-booking, notify-admin)
│   ├── components/           # Core React Components
│   │   ├── admin/            # CMS Dashboard UI components
│   │   ├── home/             # Hero, 3D Intro, Face Shape Guide, Lens Guide, Brands Marquee
│   │   ├── layout/           # Navbar, Footer, SmoothScroll (Lenis), IntroAnimation
│   │   └── ui/               # Reusable UI primitives (Buttons, Cards, Dialogs, Inputs)
│   ├── frontend/             # Additional Client Utilities & Component Views
│   ├── hooks/                # Custom React Hooks
│   ├── lib/                  # Database clients (Prisma, Supabase) & Helpers
│   └── store/                # Zustand State Stores (Cart, Wishlist, Filter state)
├── public/                   # Static assets, logos, and high-res imagery
├── .env                      # Environment Variables configuration
├── package.json              # Project dependencies & build scripts
└── next.config.ts            # Next.js configuration
```

---

## 🚀 Local Development & Quick Start

### 1. Prerequisites
- Node.js `v18.x` or `v20.x` higher installed
- PostgreSQL Database or Supabase Project instance

### 2. Installation
Clone the repository and install the dependencies:
```bash
git clone https://github.com/Parthh1002/Mr_Mrs_Optical.git
cd Mr_Mrs_Optical
npm install --legacy-peer-deps
```

### 3. Environment Setup
Create a `.env` file in the root directory with the following variables:
```env
# Database Connections (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-ID]:[YOUR-PASSWORD]@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[YOUR-PROJECT-ID]:[YOUR-PASSWORD]@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres"

# Next Auth / JWT Secret
JWT_SECRET="your-ultra-secure-jwt-secret"
```

### 4. Database Sync & Prisma Client Generation
```bash
# Generate Prisma Client types
npx prisma generate

# Sync Database Schema with Supabase
npx prisma db push
```

### 5. Running Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📦 Production Build & Deployment

To generate an optimized production bundle:
```bash
npm run build
```

### Deploying on Vercel
1. Push code to your GitHub repository.
2. Import project into Vercel Dashboard.
3. Configure Environment Variables (`DATABASE_URL`, `DIRECT_URL`).
4. Set Build Command override to: `prisma generate && next build`
5. Set Install Command override to: `npm install --legacy-peer-deps`
6. Click **Deploy**.

---

## 🛡️ Client & Admin Handoff Guide

- **Admin Access**: Navigate to `https://your-domain.com/admin` to access the CMS Dashboard.
- **Updating Homepage Banners**: Go to `Admin -> Banners` to add, reorder, or update hero banner slides.
- **Adding Products**: Go to `Admin -> Products` to add new frame collections with pricing, stock quantities, and materials.
- **Handling Eye Check Bookings**: Go to `Admin -> Bookings` to manage customer appointments and mark statuses as confirmed or completed.

---

<div align="center">

  Crafted with ❤️ for **Mr. & Mrs. Optical**<br />
  *Delivering Luxury Vision & Unmatched Digital Elegance.*

</div>
