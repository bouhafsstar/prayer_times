
const admin = require('firebase-admin');
const fs = require('fs');

// قراءة رقم النسخة الحالي من version.json المرفوع
const versionData = JSON.parse(fs.readFileSync('version.json', 'utf8'));
const version = versionData.version;

// تهيئة Firebase Admin من الـ Secret
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const message = {
  topic: 'db_updates',
  android: {
    priority: 'high', // ⚡ أولوية عالية = تصل حتى في Doze Mode بأسرع وقت ممكن
  },
  data: {
    type: 'db_update',
    version: String(version),
    timestamp: String(Date.now()),
  },
  // لا نضع "notification" block، لأننا نريد رسالة بيانات صامتة
  // تُعالَج مباشرة بدون إشعار مرئي للمستخدم على شاشة التلفاز
};

admin.messaging().send(message)
  .then((response) => {
    console.log('✅ تم إرسال إشعار التحديث بنجاح:', response);
    console.log(`📦 الإصدار المُرسَل: ${version}`);
  })
  .catch((error) => {
    console.error('❌ فشل إرسال الإشعار:', error);
    process.exit(1);
  });
