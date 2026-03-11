
function addRow() {
    const table = document.getElementById("data-table").getElementsByTagName('tbody')[0];

    // 1. מציאת השורה האחרונה הקיימת
    const lastRow = table.rows[table.rows.length - 1];

    // 2. שיכפול השורה (true אומר לשכפל גם את כל מה שבתוכה)
    const newRow = lastRow.cloneNode(true);

    // 3. ניקוי הערכים בשורה החדשה כדי שלא תהיה כפילות של מידע
    const inputs = newRow.querySelectorAll('input');
    inputs.forEach(input => {
        if (input.type === 'checkbox') {
            input.checked = false; // איפוס תיבת סימון
        } else {
            input.value = ""; // איפוס תאריך או טקסט
        }
    });

    const cells = newRow.querySelectorAll('td[contenteditable="true"]');
    cells.forEach(cell => {
        cell.innerText = "-"; // איפוס תאי טקסט עריצים
    });

    // 4. הוספת השורה המשוכפלת לסוף הטבלה
    table.appendChild(newRow);

    // 5. אם יש לך פונקציית שמירה, נקרא לה כאן
    if (typeof saveTable === "function") {
        saveTable();
    }
}

function getTableDataAsJSON() {
    const table = document.getElementById("data-table").getElementsByTagName('tbody')[0];
    const rows = Array.from(table.rows);

    const data = rows.map(row => {
        return {
            firstName: row.cells[0].innerText,
            lastName: row.cells[1].innerText,
            address: row.cells[2].innerText,
            phone: row.cells[3].innerText,
            email: row.cells[4].innerText,
            connection: row.cells[5].innerText,
            isBuger: row.cells[6].querySelector('input').checked,
            graduationDate: row.cells[7].querySelector('input').value
        };
    });

    return data;
}

function loadTableData(dataArray) {
    const tableBody = document.getElementById("data-table").getElementsByTagName('tbody')[0];

    // 1. ניקוי הטבלה הקיימת לפני הטעינה
    tableBody.innerHTML = "";

    // 2. מעבר על כל אובייקט במערך ויצירת שורה
    dataArray.forEach(item => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td contenteditable="true">${item.firstName || ""}</td>
            <td contenteditable="true">${item.lastName || ""}</td>
            <td contenteditable="true">${item.address || ""}</td>
            <td contenteditable="true">${item.phone || ""}</td>
            <td contenteditable="true">${item.email || ""}</td>
            <td contenteditable="true">${item.connection || ""}</td>
            <td><input type="checkbox" ${item.isAlumni ? "checked" : ""}></td>
            <td><input type="date" value="${item.graduationDate || ""}"></td>
        `;

        tableBody.appendChild(row);
    });
}

function userSave() {
    const myTableData = { info: "some data from table" };

    window.saveData(getTableDataAsJSON(), "testFiles", "test");
}