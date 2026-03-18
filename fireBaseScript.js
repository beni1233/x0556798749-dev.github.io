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

// מאזין לשינויי מצב המשתמש
onAuthStateChanged(auth, (user) => {
    const userLogo = document.getElementById('userLogo');
    const authBtn = document.getElementById('authBtn');

    if (user) {
        // משתמש מחובר
        if (user.photoURL) {
            userLogo.innerHTML = `<img src="${user.photoURL}" style="width:100%; height:100%; border-radius:14px; object-fit:cover;">`;
        } else {
            userLogo.innerText = user.displayName ? user.displayName.charAt(0) : "U";
        }

        authBtn.innerText = "התנתק";
        authBtn.onclick = window.logout;
        console.log("User logged in:", user.displayName);
    } else {
        // משתמש לא מחובר
        userLogo.innerHTML = "?"; // ברירת מחדל
        authBtn.innerText = "התחבר עם Google";
        authBtn.onclick = window.loginWithGoogle;
        console.log("User logged out");
    }
});