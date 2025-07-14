# 🛒 Product Management System

A full-stack web application for managing products, built with **Angular**, **ASP.NET Core**, and **SQL Server**.  
Includes **JWT Authentication**, **Role-Based Access Control**, **Image Upload**, **Toast Notifications**, and more!

---

## 🌐 Technologies Used

| Frontend | Backend | Auth & Security | Dev Tools |
|----------|---------|------------------|-----------|
| Angular 17 | ASP.NET Core 8 | JWT, BCrypt | Visual Studio 2022 |
| Bootstrap 5 | Entity Framework Core | Role-based access | SQL Server |
| ngx-toastr | ASP.NET Identity | AuthGuard, Interceptor | Postman, Swagger |

---

## ⚙️ Features

- 🔐 **User & Admin Roles** with JWT token-based login
- 🛠️ Full **CRUD operations** for products
- 🖼️ Upload & display product **images**
- 📦 Search & filter products
- 🚨 **Toast alerts** for feedback
- 🔒 Protected routes with **AuthGuard**
- 🎭 Dynamic UI access based on **user roles**
- 🧪 Swagger-enabled API testing

---

## 📸 Screenshots

| 🔐 Login Page | 🛒 Product List | ➕ Add Product |
|---------------|----------------|----------------|
| ![Login](screenshots/login.png) | ![List](screenshots/products.png) | ![Modal](screenshots/add-product.png) |

---

## 📁 Project Structure

ProductManagementSystem/
│
├── ClientApp/ (Angular)
│ ├── components/
│ ├── services/
│ ├── guards/
│ └── auth/
│
├── Server/ (ASP.NET Core)
│ ├── Controllers/
│ ├── Data/
│ ├── Models/
│ └── wwwroot/images/

yaml
Copy
Edit

---

## 🛠️ Setup Instructions

### 🧩 Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/)
- [Node.js & npm](https://nodejs.org/)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/)
- Angular CLI: `npm install -g @angular/cli`

---

### 🔧 Backend Setup (ASP.NET Core)

```bash
cd Server/
dotnet restore
dotnet ef database update    # Apply DB migrations
dotnet run
🌐 Frontend Setup (Angular)
bash
Copy
Edit
cd ClientApp/
npm install
ng serve
Frontend: http://localhost:4200
Backend API: https://localhost:7003

👤 Default Roles
You can choose "Admin" or "User" during registration.

👑 Admin: Full access (Add, Edit, Delete)

🙍 User: View-only permissions (customize via guards)

🧪 API Documentation
Visit:
📄 https://localhost:7003/swagger
Test login, registration, and product routes.

🔒 Security Highlights
JWT Bearer tokens with custom claims (role)

Passwords hashed with BCrypt

AuthGuard & Interceptor in Angular

Admin-only access to sensitive routes

📦 Future Improvements
✅ Refresh Token Support

🗂️ Product Category Filtering

🌙 Dark Mode + Responsive UI

📊 Dashboard with charts (ng2-charts)

🧾 PDF Invoice or CSV Export

🤝 Contributing
Pull requests welcome!
Clone the repo, create a branch, and submit your PR.

bash
Copy
Edit
git clone https://github.com/your-username/product-management-system.git
cd product-management-system
