const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.sendOrderStatusNotification = functions.firestore
    .document("users/{userId}/orders/{orderId}")
    .onUpdate((change, context) => {
        const newValue = change.after.data();
        const previousValue = change.before.data();

        if (newValue.status !== previousValue.status) {
            const userId = context.params.userId;
            const orderId = context.params.orderId;

            const payload = {
                notification: {
                    title: "Status Pesanan Anda Diperbarui",
                    body: `Pesanan #${orderId} kini memiliki status: ${newValue.status}`,
                    clickAction: "FLUTTER_NOTIFICATION_CLICK",
                },
            };

            return admin.firestore().collection("users").doc(userId).get()
                .then(userDoc => {
                    const fcmToken = userDoc.data().fcmToken; // Pastikan fcmToken disimpan saat login
                    if (fcmToken) {
                        return admin.messaging().sendToDevice(fcmToken, payload);
                    } else {
                        console.error("FCM Token tidak tersedia untuk user:", userId);
                        return null;
                    }
                });
        }

        return null;
    });
