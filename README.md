# ZenBoard - Collaborative Kanban Board

A professional Kanban board application built with Laravel + React.

## Live URLs
- Frontend: https://nmg-three.vercel.app
- Backend API: https://nmg.onrender.com

## Tech Stack
- Frontend: React + Vite + Tailwind CSS
- Backend: Laravel PHP + SQLite
- Deployment: Vercel (frontend) + Render Docker (backend)

## Features
- Create and manage Boards, Lists, Cards
- Drag and drop cards between lists
- Add Tags, Due Dates, Assign Members
- Team management page
- Projects roadmap page
- Analytics dashboard
- Professional SaaS UI

## Setup Instructions
### Backend
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve

### Frontend
cd frontend
npm install
npm run dev

## GitHub
https://github.com/shivanshi-chaurasia/NMG
