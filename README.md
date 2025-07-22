# 📝 Leave Management App

The **Leave Management App** is a web-based application that allows employees to apply for leaves and managers to review, approve, or reject those requests. The system includes dashboards for both employees and managers, live status tracking, and leave balance summaries.

---

## 🚀 Features

- 🧑‍💼 **Employee Dashboard:**
  - Submit leave requests
  - View application status
  - Track leave balance

- 👨‍💼 **Manager Dashboard:**
  - View all employee leave requests
  - Approve or reject applications
  - Monitor overall leave trends

- 📊 Visual charts (bar and pie) for quick insights
- 🔐 Authentication system
- ⚙️ Role-based access control

---

## 🛠️ Technologies Used

| Frontend           | Backend               | Database |
|--------------------|-----------------------|----------|
| React.js (CRA)     | Django REST Framework | MySQL    |
| Tailwind CSS       | Python                |          |
| Axios              | JWT Authentication    |          |

---

## 📥 Installation Guide

Follow the steps below to set up the application on your local machine.

### 1️⃣ Download the Project

- Open the GitHub repository: [https://github.com/abigailcruz-dev/leave-management-app](https://github.com/abigailcruz-dev/leave-management-app)
- Click on **Code > Download ZIP**
- Extract the ZIP file and place the folder anywhere (preferably under your user directory like `C:\Users\admin`)

---

## 🗄️ 2️⃣ Database Setup (MySQL via XAMPP)

> ⚠️ *You must have XAMPP installed. Start both Apache and MySQL.*

1. Open **XAMPP Control Panel** and click **Start** for **Apache** and **MySQL**.
2. Open **phpMyAdmin** (click “Admin” next to MySQL).
3. Create a new database named:

```
leave_management
```

4. Import the database:
   - You should have received the `leave-management.sql` file via email/Google Drive.
   - Go to the newly created database > Click **Import** tab > Choose the `.sql` file > Click **Go**.

---

## ⚙️ 3️⃣ Backend Setup (Django)

1. Open a terminal in the project root directory.
2. Navigate to the backend folder:

```bash
cd backend
```

3. Create a virtual environment (if not yet created):

```bash
python -m venv env
```

4. Activate the virtual environment:

```bash
env\Scripts\activate   # Windows
```

5. Install the Python dependencies:

```bash
pip install -r requirements.txt
```

6. Configure your MySQL database connection in `leave_app/settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'leave_management',
        'USER': 'your_mysql_user',
        'PASSWORD': 'your_mysql_password',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

7. Run the development server:

```bash
python manage.py runserver
```

> Django will now run on: [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

## 🖥️ 4️⃣ Frontend Setup (React.js)

1. Open a new terminal window or split terminal in VS Code.
2. Navigate to the frontend folder:

```bash
cd frontend
```

3. Install frontend dependencies:

```bash
npm install
```

4. Run both backend and frontend concurrently:

```bash
npm run dev
```

> The frontend should now run on: [http://localhost:3000](http://localhost:3000)

---

## ✅ You’re Done!

You now have the full Leave Management App running locally with:

- Backend at: [http://127.0.0.1:8000](http://127.0.0.1:8000)
- Frontend at: [http://localhost:3000](http://localhost:3000)

---

## 🔑 Sample User Accounts

Use the following demo accounts to explore the app:

### 👤 Employee Account
- **Username:** `employee`
- **Password:** `employee123`

### 👨‍💼 Manager Account
- **Username:** `abithedev`
- **Password:** `12341234`

---

## ➕ Creating New Users

Once logged in as a **manager**, you can:

- Add new **employees** or **managers** directly from the **Manager Dashboard**.

However:

> ⚠️ If you add a new **manager**, they will be treated as a normal user until you update their permissions in the Django Admin Panel:
>
> [http://127.0.0.1:8000/admin](http://127.0.0.1:8000/admin)
>
> Go to **Users**, click on the newly added manager, and check the following:
> - ✅ `is_staff`
> - ✅ `is_superuser` *(optional if you want full admin access)*
> - ✅ Add to group `manager` 

This ensures the new manager can access manager-only features correctly.

---

## 🧑‍🔧 Admin Access

You may create a Django superuser to access the admin panel:

```bash
python manage.py createsuperuser
```

Login here: [http://127.0.0.1:8000/admin](http://127.0.0.1:8000/admin)

---

## 📌 Notes

- Make sure your MySQL service is always running when you use the app.

---

## 📧 Support

For help, contact: **cruzabicanedo@gmail.com**
