// Global state: The currently selected Solar Date
let currentSolarDate = new Date();

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Check if library is loaded
    if (typeof Solar === 'undefined' || typeof Lunar === 'undefined') {
        alert('Lunar library not loaded. Please check internet connection.');
        return;
    }
    
    setInputsToDate(currentSolarDate);
    updateCalendars();
});

function goToday() {
    currentSolarDate = new Date();
    setInputsToDate(currentSolarDate);
    updateCalendars();
}

function searchDate() {
    const y = parseInt(document.getElementById('yearInput').value);
    const m = parseInt(document.getElementById('monthInput').value);
    const d = parseInt(document.getElementById('dayInput').value);

    if (isNaN(y) || isNaN(m) || isNaN(d)) {
        alert('올바른 날짜를 입력해주세요.');
        return;
    }

    // Validate date
    const testDate = new Date(y, m - 1, d);
    if (testDate.getFullYear() !== y || testDate.getMonth() + 1 !== m || testDate.getDate() !== d) {
        alert('유효하지 않은 날짜입니다.');
        return;
    }

    currentSolarDate = testDate;
    updateCalendars();
}

function setInputsToDate(date) {
    document.getElementById('yearInput').value = date.getFullYear();
    document.getElementById('monthInput').value = date.getMonth() + 1;
    document.getElementById('dayInput').value = date.getDate();
}

function updateCalendars() {
    const y = currentSolarDate.getFullYear();
    const m = currentSolarDate.getMonth() + 1;
    const d = currentSolarDate.getDate();

    // 1. Create Solar Object from Library
    const solar = Solar.fromYmd(y, m, d);
    
    // 2. Create Lunar Object
    const lunar = Lunar.fromSolar(solar);

    // --- Render Left (Solar) ---
    renderSolarCalendar(solar);

    // --- Render Right (Lunar) ---
    renderLunarCalendar(lunar);
}

function renderSolarCalendar(solarObj) {
    const display = document.getElementById('solarDateDisplay');
    display.textContent = `${solarObj.getYear()}년 ${solarObj.getMonth()}월 ${solarObj.getDay()}일`;

    const grid = document.getElementById('solarGrid');
    grid.innerHTML = '';

    // Logic to find start of month and total days
    // Construct the 1st day of this solar month
    const firstDaySolar = Solar.fromYmd(solarObj.getYear(), solarObj.getMonth(), 1);
    const startDayOfWeek = firstDaySolar.getWeek(); // 0 (Sun) to 6 (Sat)
    
    // Days in month
    // Easy way: go to next month 1st day and subtract 1 day? 
    // Or use JS Date: new Date(y, m, 0).getDate()
    const daysInMonth = new Date(solarObj.getYear(), solarObj.getMonth(), 0).getDate();

    // Fill empty slots
    for (let i = 0; i < startDayOfWeek; i++) {
        const div = document.createElement('div');
        div.className = 'day empty';
        grid.appendChild(div);
    }

    // Fill days
    for (let i = 1; i <= daysInMonth; i++) {
        const div = document.createElement('div');
        div.className = 'day';
        div.textContent = i;
        
        // Check if this is the selected day
        if (i === solarObj.getDay()) {
            div.classList.add('today');
        }

        // Click event
        div.onclick = () => {
            currentSolarDate = new Date(solarObj.getYear(), solarObj.getMonth() - 1, i);
            setInputsToDate(currentSolarDate);
            updateCalendars();
        };

        grid.appendChild(div);
    }
}

function renderLunarCalendar(lunarObj) {
    const display = document.getElementById('lunarDateDisplay');
    // Display textual representation
    // lunarObj.getMonth() returns numeric month
    // lunarObj.getDay() returns numeric day
    const leapStr = lunarObj.getMonth() < 0 ? "윤" : ""; 
    // Library might handle leap months differently. 
    // Usually getMonth() is positive. getYear() might be different.
    // Let's check documentation via assumption:
    // .toString() gives full string. We want structured.
    
    // Let's trust standard accessors first.
    // Note: getMonth() might return negative if leap? Or there is isLeap().
    // Let's print string for debug if needed, but here we format manually.
    const lYear = lunarObj.getYear();
    const lMonth = lunarObj.getMonth(); 
    const lDay = lunarObj.getDay();
    const isLeap = lunarObj.isLeap ? lunarObj.isLeap() : false;
    
    display.textContent = `${lYear}년 ${Math.abs(lMonth)}월 ${lDay}일 ${isLeap ? '(윤달)' : ''}`;

    const grid = document.getElementById('lunarGrid');
    grid.innerHTML = '';

    let firstLunarDay;
    try {
        // Try creating the 1st day, passing leap flag if supported
        firstLunarDay = Lunar.fromYmd(lYear, lMonth, 1, isLeap);
    } catch (e) {
        console.error("Error creating first lunar day", e);
        return;
    }

    // Solar equivalent of Lunar 1st
    const startSolar = firstLunarDay.getSolar();
    const startDayOfWeek = startSolar.getWeek(); // 0-6

    for (let i = 0; i < startDayOfWeek; i++) {
        const div = document.createElement('div');
        div.className = 'day empty';
        grid.appendChild(div);
    }

    // Max 30 days in lunar
    for (let i = 1; i <= 30; i++) {
        let dLunar;
        try {
             // Pass leap flag here too
             dLunar = Lunar.fromYmd(lYear, lMonth, i, isLeap);
        } catch(e) {
             continue;
        }
        
        // Check if we rolled over to next month (or invalid day handled by library returning next month)
        if (dLunar.getMonth() !== lMonth) {
            break; 
        }

        const div = document.createElement('div');
        div.className = 'day';
        div.textContent = i;
        
        // Highlight selected
        if (i === lDay) {
            div.classList.add('today');
        }

        // Interaction: Click Lunar Day -> Go to that Solar Date
        div.onclick = () => {
            const targetSolar = dLunar.getSolar();
            // Convert to JS Date
            currentSolarDate = new Date(targetSolar.getYear(), targetSolar.getMonth() - 1, targetSolar.getDay());
            setInputsToDate(currentSolarDate);
            updateCalendars();
        };

        grid.appendChild(div);
    }
}
