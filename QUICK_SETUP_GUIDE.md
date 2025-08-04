# 🚀 **CODEKLAY QUICK SETUP GUIDE**
## **Google Cloud PostgreSQL - 30-45 Minutes to Launch**

---

## ⏱️ **TIMELINE OVERVIEW**

| **Step** | **Time** | **Status** |
|----------|----------|------------|
| 1. Create Cloud SQL Instance | 10-15 min | ⏳ |
| 2. Get Connection String | 5 min | ⏳ |
| 3. Test Connection | 10-15 min | ⏳ |
| 4. Run Migrations | 5-10 min | ⏳ |
| **TOTAL** | **30-45 min** | **🎯** |

---

## 🎯 **STEP 1: CREATE CLOUD SQL INSTANCE (10-15 minutes)**

### **✅ 1.1 Go to Google Cloud Console**
- Visit: [console.cloud.google.com](https://console.cloud.google.com)
- Sign in with your Google account
- Select your project

### **✅ 1.2 Navigate to SQL**
- Click **"SQL"** in the left menu
- Click **"Create Instance"**

### **✅ 1.3 Choose Configuration**
```
Database Engine: PostgreSQL
Version: PostgreSQL 15
Instance ID: codeklay-prod-db
Password: [Create strong password - save this!]
```

### **✅ 1.4 Configure Instance Settings**
```
Machine Type: db-f1-micro (Free tier)
Storage: 10 GB (SSD)
Backup: Enabled
Maintenance Window: Choose convenient time
```

### **✅ 1.5 Network Settings**
```
Public IP: Enabled
Authorized Networks: Add your IP address
SSL: Required
```

### **✅ 1.6 Create Instance**
- Click **"Create Instance"**
- Wait 5-10 minutes for creation

---

## 🔗 **STEP 2: GET CONNECTION STRING (5 minutes)**

### **✅ 2.1 Go to Instance Details**
- Click on your instance name: `codeklay-prod-db`
- Go to **"Connections"** tab

### **✅ 2.2 Copy Connection String**
```
Format: postgresql://username:password@ip:5432/database
Example: postgresql://postgres:mypassword@34.123.45.67:5432/codeklay_prod
```

### **✅ 2.3 Note Important Details**
- **IP Address**: `34.123.45.67` (your actual IP)
- **Username**: `postgres`
- **Password**: `[your password]`
- **Database**: `codeklay_prod`

---

## 🧪 **STEP 3: TEST CONNECTION (10-15 minutes)**

### **✅ 3.1 Create Production Environment File**
<｜tool▁calls▁begin｜><｜tool▁call▁begin｜>
run_terminal_cmd