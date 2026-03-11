import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";
const dataBase = getFirestore(app);

const firebaseConfig = {
    apiKey: "AIzaSyDQKHEeqaVGHNrB9jGMnTrZtQJSZ6WcF4I",
    authDomain: "donor-project-df881.firebaseapp.com",
    projectId: "donor-project-df881",
    storageBucket: "donor-project-df881.firebasestorage.app",
    messagingSenderId: "23728982855",
    appId: "1:23728982855:web:da05d491bc729e14aa5a62",
    measurementId: "G-6JPN9HL31W"
};

window.saveData = async function (dataObject, Collection, DocumentData) {
    try {
        await setDoc(doc(dataBase, Collection, DocumentData), dataObject);
        console.log("הנתונים נשמרו בהצלחה!");
    } catch (e) {
        console.error("שגיאה בשמירה: ", e);
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
