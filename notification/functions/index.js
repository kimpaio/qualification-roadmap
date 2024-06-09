// Firebase Cloud Functions でプッシュ通知を送信するサンプル
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendPushNotification = functions.firestore
  .document('reminders/{reminderId}')
  .onCreate((snapshot, context) => {
    const reminderData = snapshot.data();

    const payload = {
      notification: {
        title: 'Study Reminder',
        body: `Don't forget to study for your exam! Topic: ${reminderData.topic}`,
        icon: 'default',
        click_action: `FLUTTER_NOTIFICATION_CLICK`
      }
    };

    // デバイストークンはクライアントアプリケーションから取得します。通常はFirestoreのユーザープロファイルに保存されています。
    const deviceToken = reminderData.deviceToken;

    // 提供されたトークンに対応するデバイスにメッセージを送信します。
    admin.messaging().sendToDevice(deviceToken, payload)
      .then(response => {
        // レスポンスはメッセージIDの文字列です。
        console.log('メッセージを正常に送信しました：', response);
        return null; // Firebaseの関数で作業する場合、関数が完了したことを示すためにレスポンスまたはnullを返す必要があります。
      })
      .catch(error => {
        console.log('メッセージの送信に失敗しました：', error);
      });
});
