
let userID = 1;

let csvLines = [];
let csvHeaders = [];

function donorsToJSON(donors) {
    return JSON.stringify(donors, null, 2);
}
function getDonorsObject() {
    return { userID: donors };
}

function exportToJSON(donors) {
    
    const jsonData = donorsToJSON(donors);

    // יצירת Blob והורדה (בדומה ל-CSV)
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "crm_data_backup.json");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function loadFromJSON(jsonString) {
    try {
        const importedData = JSON.parse(jsonString);

        // בדיקה בסיסית שהנתונים הם אכן מערך
        if (Array.isArray(importedData)) {
            contacts = importedData; // עדכון המערך הגלובלי
            donors = importedData;
            renderTable();           // ריענון הטבלה במסך
            if (typeof updateCharts === 'function') updateCharts(); // ריענון גרפים אם קיימים
            alert("הנתונים נטענו בהצלחה!");
        }
    } catch (e) {
        console.error("שגיאה בטעינת הנתונים:", e);
        alert("קובץ לא תקין.");
    }
}

function openJSONFilePicker() {
    // יצירת אלמנט קלט של קובץ באופן דינמי
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json, application/json'; // הגבלה לבחירת קובצי JSON בלבד

    // האזנה לאירוע בחירת הקובץ
    fileInput.addEventListener('change', function (event) {
        const file = event.target.files[0];

        // אם המשתמש סגר את החלון בלי לבחור קובץ
        if (!file) {
            return;
        }

        // יצירת קורא קבצים
        const reader = new FileReader();

        // מה קורה כשהקריאה מסתיימת בהצלחה
        reader.onload = function (e) {
            const jsonString = e.target.result;
            // קריאה לפונקציה שלך עם המחרוזת שנקראה מהקובץ
            loadFromJSON(jsonString);
        };

        // מה קורה במקרה של שגיאה בקריאת הקובץ (למשל קובץ פגום)
        reader.onerror = function () {
            console.error("שגיאה בקריאת הקובץ");
            alert("אירעה שגיאה בקריאת הקובץ מהמחשב.");
        };

        // התחלת קריאת הקובץ כטקסט
        reader.readAsText(file);
    });

    // פתיחת חלון בחירת הקבצים
    fileInput.click();
}

function getCellValue(sheet, row, col) {
    const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
    const cell = sheet[cellAddress];
    return cell ? cell.v : null;
}
function readSpecificCellFromUser() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx, .xls, .csv';

    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = function (event) {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            // 1. מקבלים את הגיליון הראשון
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            // 2. עכשיו ניגשים לתא (0,0) - שזה תא A1
            const value = getCellValue(sheet, 1, 0);

            alert(value);
            return value;
        };

        reader.readAsArrayBuffer(file);
    };
    input.click();
}

let currentFileData = []; // שומר את כל שורות הקובץ שנטען
let currentHeaders = [];  // שומר את כותרות הקובץ

// רשימת שדות היעד באובייקט Donor
const targetFields = [
    { key: 'first', label: 'שם פרטי' },
    { key: 'last', label: 'שם משפחה' },
    { key: 'phone', label: 'טלפון' },
    { key: 'email', label: 'אימייל' },
    { key: 'amount', label: 'סכום תרומה' },
    { key: 'category', label: 'קטגוריה' },
    { key: 'address', label: 'כתובת' },
    { key: 'notes', label: 'הערות' }
];

// פונקציה לפתיחת הקובץ והצגת המודאל
function openImportPicker() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx, .xls, .csv';

    input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

            // המרה ל-JSON (מערך של אובייקטים/מערכים)
            const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

            if (jsonData.length > 0) {
                currentHeaders = jsonData[0]; // שורה ראשונה היא הכותרות
                currentFileData = jsonData.slice(1); // שאר הנתונים
                showMappingInterface();
            }
        };
        reader.readAsArrayBuffer(file);
    };
    input.click();
}

function showMappingInterface() {
    const body = document.getElementById('mapping-body');
    body.innerHTML = '';

    targetFields.forEach(field => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${field.label}</strong></td>
            <td>
                <select class="form-select mapping-select" data-target="${field.key}">
                    <option value="">-- בחר עמודה --</option>
                    ${currentHeaders.map((h, index) => `<option value="${index}">${h}</option>`).join('')}
                </select>
            </td>
        `;
        body.appendChild(row);
    });

    document.getElementById('mapping-modal').classList.add('open');
}

function processImport() {
    const mapping = {};
    document.querySelectorAll('.mapping-select').forEach(select => {
        if (select.value !== "") {
            mapping[select.getAttribute('data-target')] = parseInt(select.value);
        }
    });

    const importedDonors = currentFileData.map((row, index) => {
        const amountValue = row[mapping['amount']] || 0;

        // יצירת אובייקט Donor לפי המבנה הנדרש
        return {
            id: Date.now() + index, // מזהה ייחודי זמני
            first: row[mapping['first']] || "",
            last: row[mapping['last']] || "",
            phone: row[mapping['phone']] || "",
            email: row[mapping['email']] || "",
            amount: Number(amountValue),
            category: row[mapping['category']] || "כללי",
            address: row[mapping['address']] || "",
            files: [],
            notes: row[mapping['notes']] || "",
            status: "פעיל",
            donations: [
                {
                    date: new Date().toLocaleDateString('he-IL'),
                    amount: Number(amountValue),
                    method: "יבוא",
                    status: "הושלם"
                }
            ],
            history: [
                {
                    time: new Date().toLocaleString('he-IL'),
                    text: "ייבוא ראשוני מקובץ",
                    meta: "System"
                }
            ]
        };
    });

    // עדכון המערך הגלובלי (בהתבסס על המשתנה donors הקיים בקוד שלך)
    if (confirm(`האם לייבא ${importedDonors.length} תורמים חדשים?`)) {
        donors = [...donors, ...importedDonors];
        renderTable();
        closeMappingModal();
        alert("היבוא הושלם בהצלחה!");
    }
}

function closeMappingModal() {
    document.getElementById('mapping-modal').classList.remove('open');
}
async function userSave() {
    const dataToSave = getDonorsObject();
    await window.saveData(dataToSave, "testFiles", "test");
}

async function userLoad() {
    try {
        // קריאה לפונקציית ה-window של פיירבייס
        const result = await window.loadData("testFiles", "test");

        if (result && result.userID) {
            // עדכון המשתנה הגלובלי (השתמשנו ב-userID כי כך זה נשמר ב-getDonorsObject)
            donors = result.userID;

            // עדכון התצוגה
            renderTable();
            if (typeof updateCharts === 'function') updateCharts();
            if (typeof renderRecent === 'function') renderRecent();

            alert("הנתונים נטענו בהצלחה מהענן!");
        } else {
            alert("לא נמצאו נתונים לטעינה.");
        }
    } catch (e) {
        alert("שגיאה בתהליך הטעינה:", e);
    }
}