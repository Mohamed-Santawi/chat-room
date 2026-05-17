# 🚀 دليل تشغيل وتثبيت حزمة الدردشة الاحترافية الفاخرة على خادمك
# Chat-Room Suite Server Deployment & Running Guide

هذا المستند يوفر شرحاً مفصلاً باللغتين **العربية** و**الإنجليزية** لتشغيل وإعداد خادم الويب وحزمة قوالب الدردشة الفاخرة المدمجة (12 واجهة تفاعلية كاملة) على أي خادم (Server) أو خادم افتراضي خاص (VPS) أو جهازك المحلي.

---

## 🇸🇦 القسم العربي: دليل التشغيل والتثبيت

تم تحويل مشروع قوالب الدردشة الاستاتيكية بنجاح إلى مشروع خادم كامل مبني على **Node.js** و **Express.js** مع توفير بوابة تشغيل مركزية فاخرة (`portal.html`) تمكنك من تشغيل وفحص الـ 12 قالباً بسهولة فائقة وبمسارات نظيفة (Clean URLs).

### 📋 محتويات الحزمة الجديدة
1. **`server.js`**: خادم الويب المكتوب بلغة JavaScript وبيئة Node.js لتخديم الملفات والمنافذ وتوجيه الطلبات.
2. **`package.json`**: ملف التكوين والتبعيات اللازمة لتشغيل المشروع.
3. **`portal.html`**: بوابة تحكم وإطلاق مركزية ذات تصميم فاخر واحترافي تدعم الفلترة والبحث اللحظي.
4. **`README.md`**: هذا الدليل الشامل للتثبيت والتشغيل.

---

### 1. المتطلبات الأساسية
قبل البدء، يجب التأكد من تثبيت بيئة **Node.js** على الخادم الخاص بك:
* لتحميل وتثبيت Node.js (يتضمن مدير الحزم `npm`): [اضغط هنا للتحميل](https://nodejs.org/)

---

### 2. التشغيل والتثبيت المحلي (التثبيت السريع)
لتشغيل المشروع وفحصه على جهازك المحلي، اتبع الخطوات التالية:

1. افتح مبدل الأوامر (Terminal / PowerShell / CMD) في مجلد المشروع.
2. قم بتثبيت الحزم المطلوبة عبر كتابة الأمر التالي:
   ```bash
   npm install
   ```
3. ابدأ تشغيل الخادم عبر كتابة الأمر:
   ```bash
   npm start
   ```
4. افتح المتصفح وتوجه إلى الرابط التالي لتصفح بوابة الإطلاق الرائعة:
   * **http://localhost:3000**

---

### 3. التشغيل في الخلفية على الخادم (Production VPS) باستخدام PM2
عند رفع المشروع على خادم حقيقي (VPS مثل DigitalOcean, AWS, Hetzner, Linux VPS)، لا تريد أن يتوقف خادم الدردشة عند إغلاق الـ Terminal. لذلك نستخدم مدير العمليات **PM2** لإبقاء المشروع يعمل للأبد في الخلفية.

1. قم بتثبيت **PM2** عالمياً على الخادم:
   ```bash
   npm install -g pm2
   ```
2. قم بتشغيل الخادم الخاص بنا وإعطائه اسماً مميزاً:
   ```bash
   pm2 start server.js --name "chat-suite"
   ```
3. لحفظ الحالة ليعود للعمل تلقائياً حتى لو أعدت تشغيل السيرفر بأكمله:
   ```bash
   pm2 save
   pm2 startup
   ```
4. أوامر مفيدة لمراقبة حالة السيرفر:
   * لمشاهدة سجل التحركات والطلبات (Logs): `pm2 logs chat-suite`
   * لمعرفة حالة الخادم: `pm2 status`
   * لإيقاف السيرفر: `pm2 stop chat-suite`
   * لإعادة تشغيل السيرفر: `pm2 restart chat-suite`

---

### 4. ربط السيرفر بنطاق خاص (Domain) عبر Nginx كخادم وكيل عكسي
لربط مشروعك بنطاق خاص مثل `chat.yourdomain.com` بدلاً من الدخول عبر المنفذ `:3000`، نستخدم **Nginx** كـ Reverse Proxy.

1. قم بتثبيت Nginx على خادم Linux الخاص بك:
   ```bash
   sudo apt update
   sudo apt install nginx -y
   ```
2. افتح ملف تكوين جديد لـ Nginx خاص بموقعك:
   ```bash
   sudo nano /etc/nginx/sites-available/chat-room
   ```
3. الصق التكوين التالي (مع تغيير `chat.yourdomain.com` بنطاقك الفعلي):
   ```nginx
   server {
       listen 80;
       server_name chat.yourdomain.com;

       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           
           # زيادة حدود الرفع والمهلة الزمنية
           client_max_body_size 50M;
           proxy_read_timeout 90;
       }
   }
   ```
4. قم بتنشيط التكوين واختبار خلوه من الأخطاء:
   ```bash
   sudo ln -s /etc/nginx/sites-available/chat-room /etc/nginx/sites-enabled/
   sudo nginx -t
   ```
5. قم بإعادة تحميل خادم Nginx لتطبيق التغييرات:
   ```bash
   sudo systemctl restart nginx
   ```

---

### 5. إضافة شهادة أمان مجانية SSL (HTTPS) لضمان حماية الصوت والميكروفونات
تتطلب ميزات الميكروفونات والصوت (مثل تكامل Jitsi Meet المدمج بالدردشة) اتصالاً آمناً **HTTPS** لكي يسمح المتصفح باستخدام الصوت والميكروفون.

استخدم أداة **Certbot** لتثبيت شهادة أمان SSL مجانية من **Let's Encrypt**:
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d chat.yourdomain.com
```
* اتبع التوجيهات الظاهرة واختر خيار إعادة توجيه حركة المرور تلقائياً إلى HTTPS (Redirect). ستقوم الأداة بتحديث ملف Nginx وتأمين موقعك تلقائياً للأبد!

---

### 🔗 قائمة بالمسارات النظيفة (Clean Route URLs)
بعد تشغيل السيرفر، يمكنك الوصول المباشر للوحات التفاعلية بالروابط النظيفة التالية:
* **بوابة التحكم الرئيسية**: `http://your-ip-or-domain/`
* **غرفة الدردشة الكبرى**: `http://your-ip-or-domain/chat`
* **قائمة الغرف المنزلقة**: `http://your-ip-or-domain/rooms`
* **بث المايكات والضيوف**: `http://your-ip-or-domain/live`
* **بث التيك توك الاجتماعي**: `http://your-ip-or-domain/stream`
* **لوحة الإدارة والتحكم**: `http://your-ip-or-domain/admin`
* **الأعضاء المتواجدون الآن**: `http://your-ip-or-domain/online`
* **تعديل الملف الشخصي**: `http://your-ip-or-domain/profile`
* **صندوق الهدايا والتحديات**: `http://your-ip-or-domain/gifts`
* **المحادثة الخاصة المصغرة**: `http://your-ip-or-domain/private`
* **لوحة التنبيهات**: `http://your-ip-or-domain/notifications`
* **تنبيهات الطوارئ**: `http://your-ip-or-domain/alerts`
* **جدار التميز والتعليقات**: `http://your-ip-or-domain/wall`

---

## 🇬🇧 English Section: Running & Deployment Guide

This project has been transformed from static HTML files into a dynamic, production-ready server powered by **Node.js** & **Express.js**, complete with an ultra-premium dashboard suite launcher (`portal.html`).

### 1. Prerequisites
Ensure you have **Node.js** and **npm** installed on your hosting server:
* Download and install: [Node.js Official Website](https://nodejs.org/)

### 2. Local Installation & Startup
1. Open your terminal/PowerShell inside the project directory.
2. Install all required production dependencies:
   ```bash
   npm install
   ```
3. Run the development web server:
   ```bash
   npm start
   ```
4. Access the gorgeous premium suite control panel in your browser at:
   * **http://localhost:3000**

### 3. Background Execution on a Production VPS using PM2
To keep the server running 24/7 in the background of your VPS even after disconnecting:

1. Install the process manager globally:
   ```bash
   npm install -g pm2
   ```
2. Start the Express server as a PM2 process:
   ```bash
   pm2 start server.js --name "chat-suite"
   ```
3. Ensure it starts automatically on system reboot:
   ```bash
   pm2 save
   pm2 startup
   ```

### 4. Custom Domain Setup with Nginx (Reverse Proxy)
To map your domain (e.g., `chat.yourdomain.com`) to port `3000`:

1. Install Nginx:
   ```bash
   sudo apt update && sudo apt install nginx -y
   ```
2. Open a site configuration block:
   ```bash
   sudo nano /etc/nginx/sites-available/chat-room
   ```
3. Paste the following configuration:
   ```nginx
   server {
       listen 80;
       server_name chat.yourdomain.com;

       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
4. Enable the configuration and restart Nginx:
   ```bash
   sudo ln -s /etc/nginx/sites-available/chat-room /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### 5. Secure with Let's Encrypt SSL (HTTPS)
*Browsers require an HTTPS connection for microphones and audio broadcasting to work.* Install a free SSL certificate:
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d chat.yourdomain.com
```
Follow the interactive prompts and choose redirection to HTTPS to fully secure your chat-room suite!
