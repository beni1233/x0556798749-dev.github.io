const firebaseConfig = {
    apiKey: "AIzaSyDQKHEeqaVGHNrB9jGMnTrZtQJSZ6WcF4I",
    authDomain: "donor-project-df881.firebaseapp.com",
    projectId: "donor-project-df881",
    storageBucket: "donor-project-df881.firebasestorage.app",
    messagingSenderId: "23728982855",
    appId: "1:23728982855:web:da05d491bc729e14aa5a62",
    measurementId: "G-6JPN9HL31W"
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";
import { initializeFirestore, getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const dataBase = getFirestore(app);

//const dataBase = initializeFirestore(app, {
//    experimentalForceLongPolling: true,
//});

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

window.saveData = async function (dataObject, Collection, DocumentData) {
    try {
        await setDoc(doc(dataBase, Collection, DocumentData), dataObject);
        alert("הנתונים נשמרו בהצלחה!");
    } catch (e) {
        console.error("שגיאה בשמירה: ", e);
        alert("שגיאה בשמירה, בדוק את הקונסול.");
    }
}

window.loadData = async function (Collection, DocumentData) {
    try {
        // יצירת כתובת למסמך הספציפי
        const docRef = doc(dataBase, Collection, DocumentData);

        // שליפת המסמך מהשרת
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            // אם המסמך קיים, מחזירים את המידע שבו
            console.log("הנתונים נשלפו בהצלחה:", docSnap.data());
            return docSnap.data();
        } else {
            // אם המסמך לא קיים (למשל פעם ראשונה שהמשתמש נכנס)
            console.log("לא נמצאו נתונים שמורים.");
            return null;
        }
    } catch (e) {
        console.error("שגיאה בטעינת הנתונים: ", e);
        return null;
    }
}


// פונקציית התחברות
window.loginWithGoogle = async function () {
    try {
        const result = await signInWithPopup(auth, provider);
        console.log("מחובר בהצלחה:", result.user);
    } catch (error) {
        console.error("שגיאה בהתחברות:", error);
        alert("נכשל בהתחברות");
    }
}

// פונקציית התנתקות
window.logout = function () {
    auth.signOut();
}

// האזנה לשינויים במצב המשתמש (מחובר/מנותק)
auth.onAuthStateChanged((user) => {
    const loginBtn = document.getElementById('login-btn');
    const userInfo = document.getElementById('user-info');
    const userPhoto = document.getElementById('user-photo');
    const userName = document.getElementById('user-name');

    if (user) {
        // המשתמש מחובר
        loginBtn.style.display = 'none';
        userInfo.style.display = 'flex';
        userPhoto.src = user.photoURL;
        userName.innerText = user.displayName;

        // כאן ניתן גם לעדכן את ה-userID הגלובלי אם תרצה
        if (typeof userID !== 'undefined') userID = user.uid;
    } else {
        // המשתמש מנותק
        loginBtn.style.display = 'block';
        userInfo.style.display = 'none';
    }
});