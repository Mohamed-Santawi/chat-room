const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets from the current directory (disabling default index.html to let portal.html route load on root)
app.use(express.static(path.join(__dirname), { index: false }));

// Clean URL Routing for the 12 Premium Modules
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'portal.html'));
});

app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/rooms', (req, res) => {
    res.sendFile(path.join(__dirname, 'الغرف HD.html'));
});

app.get('/live', (req, res) => {
    res.sendFile(path.join(__dirname, 'بث مباشر.html'));
});

app.get('/alerts', (req, res) => {
    res.sendFile(path.join(__dirname, 'تنبيه2.html'));
});

app.get('/notifications', (req, res) => {
    res.sendFile(path.join(__dirname, 'تنبيهات.html'));
});

app.get('/wall', (req, res) => {
    res.sendFile(path.join(__dirname, 'جدار الرائع.html'));
});

app.get('/private', (req, res) => {
    res.sendFile(path.join(__dirname, 'خاص جديد.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'لوحة م جداديا.html'));
});

app.get('/gifts', (req, res) => {
    res.sendFile(path.join(__dirname, 'مبمررمnoname(42).html'));
});

app.get('/online', (req, res) => {
    res.sendFile(path.join(__dirname, 'متواجدين HD.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'محدث ملف.html'));
});

app.get('/stream', (req, res) => {
    res.sendFile(path.join(__dirname, 'noname(43).html'));
});

// Fallback Route for Single Page Application or custom 404
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'portal.html'));
});

// Start Server
const DEFAULT_PORT = process.env.PORT || 3000;

function startServer(port) {
    const server = app.listen(port, () => {
        console.log('\n==================================================');
        console.log(`🚀 Chat-Room Suite Server is now running!`);
        console.log(`   Local URL:   http://localhost:${port}`);
        console.log(`   Network URL: http://0.0.0.0:${port}`);
        console.log('==================================================\n');
        console.log('Active clean routes:');
        console.log(`👉 Hub Portal:     http://localhost:${port}/`);
        console.log(`👉 Chat Room:     http://localhost:${port}/chat`);
        console.log(`👉 Rooms:         http://localhost:${port}/rooms`);
        console.log(`👉 Live Broad:    http://localhost:${port}/live`);
        console.log(`👉 Live Stream:   http://localhost:${port}/stream`);
        console.log(`👉 Admin Panel:   http://localhost:${port}/admin`);
        console.log(`👉 Online Users:  http://localhost:${port}/online`);
        console.log(`👉 Profile:       http://localhost:${port}/profile`);
        console.log(`👉 Private Chat:  http://localhost:${port}/private`);
        console.log(`👉 Gift Box:      http://localhost:${port}/gifts`);
        console.log(`👉 Alerts/Wall:   http://localhost:${port}/alerts | /wall | /notifications`);
        console.log('--------------------------------------------------\n');
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`⚠️ Port ${port} is in use. Trying port ${port + 1}...`);
            startServer(port + 1);
        } else {
            console.error('❌ Server startup error:', err);
        }
    });
}

startServer(DEFAULT_PORT);
