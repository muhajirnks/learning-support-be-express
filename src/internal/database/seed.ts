import { config } from "dotenv";
config();

import { connectDB } from "@/internal/config/database";
import User from "@/internal/models/user";
import Category from "@/internal/models/category";
import Course from "../models/course";
import Lesson from "../models/lesson";

const seed = async () => {
   try {
      await connectDB();

      console.log("Connected to database for seeding...");

      // Clear existing data
      await User.deleteMany({});
      await Category.deleteMany({});
      await Course.deleteMany({});
      console.log("Cleared existing data.");

      // Seed Users
      const users = await User.create([
         {
            name: "Admin User",
            email: "admin@example.com",
            password: "password123",
            role: "admin",
         },
         {
            name: "User One",
            email: "user1@example.com",
            password: "password123",
            role: "user",
         },
      ]);
      console.log(`Seeded ${users.length} users.`);

      // Seed categories
      const categories = await Category.create([
         { name: "Programming", description: "Courses about programming languages and development" },
         { name: "Data Science", description: "Courses about data analysis and machine learning" },
         { name: "Web Development", description: "Courses about web development technologies" },
         { name: "Mobile Development", description: "Courses about mobile app development" },
      ]);
      console.log(`Seeded ${categories.length} categories.`);

      // Seed courses
      const courses = await Course.create([
         {
            title: "Fullstack Web Development with React",
            description: "Kursus komprehensif ini dirancang untuk membawa Anda dari pemula hingga menjadi pengembang web profesional. Anda akan mempelajari fundamental React, manajemen state yang kompleks, integrasi API modern, hingga strategi deployment yang efisien di lingkungan produksi.",
            instructor: "John Doe",
            price: 500000,
            category: categories[2]._id,
            thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            goals: [
               "Menguasai konsep fundamental React seperti hooks dan virtual DOM",
               "Mampu membangun aplikasi web yang responsif dan interaktif",
               "Memahami integrasi backend API dengan frontend secara efisien",
               "Menerapkan best practices dalam penulisan kode React yang clean"
            ]
         },
         {
            title: "Node.js Backend Masterclass",
            description: "Pelajari cara membangun backend yang scalable dan robust menggunakan Node.js dan Express. Fokus pada arsitektur microservices, keamanan API, optimasi database, dan pembuatan sistem autentikasi yang aman untuk aplikasi skala besar.",
            instructor: "Jane Smith",
            price: 750000,
            category: categories[2]._id,
            thumbnailUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            goals: [
               "Membangun RESTful API yang aman dan scalable",
               "Memahami manajemen database dengan MongoDB dan Mongoose",
               "Implementasi JWT untuk sistem autentikasi dan otorisasi",
               "Optimasi performa aplikasi backend Node.js"
            ]
         },
         {
            title: "Data Science & Machine Learning with Python",
            description: "Jelajahi dunia data with Python. Kursus ini mencakup analisis data eksploratif, visualisasi data yang mendalam, hingga implementasi algoritma machine learning yang canggih untuk memecahkan masalah bisnis di dunia nyata.",
            instructor: "Bob Wilson",
            price: 1000000,
            category: categories[1]._id,
            thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bbbda536339a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            goals: [
               "Mampu melakukan manipulasi data menggunakan Pandas dan Numpy",
               "Membuat visualisasi data yang informatif dengan Matplotlib",
               "Membangun dan melatih model prediksi Machine Learning",
               "Memahami dasar-dasar statistik untuk analisis data"
            ]
         },
         {
            title: "Mastering TypeScript for Enterprise",
            description: "Bawa skill JavaScript Anda ke level berikutnya dengan TypeScript. Pelajari advanced types, generics, decorators, dan bagaimana membangun aplikasi enterprise yang type-safe dan mudah di-maintain dalam jangka panjang.",
            instructor: "Sarah Jenkins",
            price: 450000,
            category: categories[0]._id,
            thumbnailUrl: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            goals: [
               "Memahami sistem tipe TypeScript secara mendalam",
               "Implementasi generics untuk kode yang reusable",
               "Migrasi proyek JavaScript ke TypeScript dengan aman",
               "Menerapkan design patterns menggunakan TypeScript"
            ]
         },
         {
            title: "Mobile App Development with Flutter",
            description: "Bangun aplikasi mobile native untuk iOS dan Android hanya dengan satu codebase menggunakan Flutter. Pelajari widget UI, state management (Provider/Bloc), integrasi API, dan perilisan aplikasi ke Play Store dan App Store.",
            instructor: "David Chen",
            price: 850000,
            category: categories[3]._id,
            thumbnailUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            goals: [
               "Membangun UI aplikasi mobile yang indah dan responsif",
               "Memahami bahasa pemrograman Dart untuk Flutter",
               "Implementasi state management untuk aplikasi skala menengah",
               "Integrasi fitur native seperti kamera dan GPS"
            ]
         },
         {
            title: "Advanced CSS & Sass Masterclass",
            description: "Kuasai seni desain web dengan CSS modern dan Sass. Pelajari Grid, Flexbox, animasi kompleks, arsitektur CSS yang scalable (BEM), hingga teknik responsif tingkat lanjut yang membuat website Anda terlihat memukau di semua perangkat.",
            instructor: "Emma Watson",
            price: 300000,
            category: categories[2]._id,
            thumbnailUrl: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            goals: [
               "Memahami CSS Grid dan Flexbox untuk layout kompleks",
               "Optimasi workflow styling menggunakan Sass/SCSS",
               "Membangun sistem desain web yang konsisten",
               "Membuat animasi web yang halus dan performant"
            ]
         },
         {
            title: "Cyber Security Fundamentals",
            description: "Lindungi aplikasi Anda dari serangan cyber. Pelajari dasar-dasar keamanan web, ethical hacking, enkripsi data, dan bagaimana mencegah celah keamanan umum seperti SQL Injection dan XSS di aplikasi modern.",
            instructor: "Kevin Mitnick",
            price: 900000,
            category: categories[0]._id,
            thumbnailUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=250",
            goals: [
               "Memahami dasar-dasar keamanan jaringan dan web",
               "Identifikasi celah keamanan pada aplikasi web",
               "Implementasi protokol keamanan yang standar",
               "Membangun mindset keamanan dalam development"
            ]
         },
         {
            title: "Python for Automation & Scripting",
            description: "Otomatisasi tugas-tugas membosankan Anda dengan Python. Pelajari cara melakukan web scraping, manipulasi file otomatis, integrasi API pihak ketiga, dan pembuatan bot sederhana untuk meningkatkan produktivitas harian Anda.",
            instructor: "Al Sweigart",
            price: 350000,
            category: categories[1]._id,
            thumbnailUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=250",
            goals: [
               "Menulis script Python untuk otomasi tugas rutin",
               "Melakukan web scraping dengan BeautifulSoup",
               "Manipulasi data Excel dan PDF secara otomatis",
               "Integrasi script dengan API eksternal"
            ]
         },
         {
            title: "React Native: Building Cross-Platform Apps",
            description: "Gunakan pengetahuan React Anda untuk membangun aplikasi mobile native. Pelajari komponen native, navigasi, integrasi state management, dan bagaimana mengoptimalkan performa aplikasi mobile di platform Android dan iOS.",
            instructor: "Jordan Walke",
            price: 650000,
            category: categories[3]._id,
            thumbnailUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=250",
            goals: [
               "Membangun aplikasi mobile dengan React Native",
               "Implementasi navigasi antar layar yang smooth",
               "Akses fitur perangkat keras melalui modul native",
               "Debugging dan testing aplikasi mobile"
            ]
         },
         {
            title: "Machine Learning Engineering in Production",
            description: "Bawa model ML Anda dari notebook ke produksi. Pelajari MLOps, model deployment, monitoring performa model secara real-time, dan bagaimana mengelola siklus hidup machine learning dalam skala industri yang besar.",
            instructor: "Andrew Ng",
            price: 1500000,
            category: categories[1]._id,
            thumbnailUrl: "https://images.unsplash.com/photo-1527474305487-b87b222841cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=250",
            goals: [
               "Implementasi pipeline MLOps yang end-to-end",
               "Deploy model ML sebagai layanan web API",
               "Monitoring drift data dan penurunan performa model",
               "Skalabilitas infrastruktur untuk beban kerja ML"
            ]
         },
         {
            title: "Go Programming (Golang) for High Performance",
            description: "Pelajari bahasa pemrograman Go yang dikenal dengan performa tingginya. Fokus pada concurrency dengan goroutines, manajemen memori yang efisien, dan bagaimana membangun backend system yang sangat cepat untuk menangani jutaan request.",
            instructor: "Rob Pike",
            price: 700000,
            category: categories[0]._id,
            thumbnailUrl: "https://images.unsplash.com/photo-1550439062-609e1531270e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=250",
            goals: [
               "Memahami fundamental bahasa pemrograman Go",
               "Implementasi concurrency menggunakan goroutines dan channels",
               "Membangun mikroservis yang performant dengan Go",
               "Manajemen package dan testing di ekosistem Go"
            ]
         },
      ]);
      console.log(`Seeded ${courses.length} courses.`);

      // Seed lessons
      const lessons = await Lesson.create([
         {
            course: courses[0]._id,
            title: "What is React?",
            content: "React is a JavaScript library for building user interfaces...",
            order: 1,
         },
         {
            course: courses[0]._id,
            title: "JSX and Rendering",
            content: "JSX is a syntax extension for JavaScript...",
            order: 2,
         },
         {
            course: courses[0]._id,
            title: "Components and Props",
            content: "Components are the building blocks of React...",
            order: 3,
         },
      ]);
      console.log(`Seeded ${lessons.length} lessons.`);

      console.log("Seeding completed successfully!");
      process.exit(0);
   } catch (error) {
      console.error("Error during seeding:", error);
      process.exit(1);
   }
};

seed();
