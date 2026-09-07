/* ============================================================
   MERIDIAN AI HOSPITAL — COMPLETE JAVASCRIPT
============================================================ */

/* ============================================================
   GLOBAL STATE
============================================================ */

const scenes = [
    'exterior',
    'reception',
    'dashboard',
    'heart',
    'brain',
    'diabetes',
    'liver',
    'kidney',
    'blood',
    'predicting',
    'report'
];

let current = 'exterior';

window.patientName = '';
window.patientAge = null;
window.patientGender = '';
window.patientId = '';
window._activeDept = null;


/* ============================================================
   SCENE MANAGEMENT
============================================================ */

function goToScene(name) {

    const from = document.getElementById('scene-' + current);
    const to = document.getElementById('scene-' + name);

    if (!to) {
        console.warn('Scene not found:', name);
        return;
    }

    if (from && from !== to) {
        from.classList.add('leaving');
        from.classList.remove('active');

        setTimeout(() => {
            from.classList.remove('leaving');
        }, 1200);
    }

    to.classList.add('active');

    current = name;

    /* ---------- HUD ---------- */

    const hud = document.getElementById('vitals-hud');

    if (hud) {
        if (name !== 'exterior' && name !== 'reception') {
            hud.classList.add('show');
        } else {
            hud.classList.remove('show');
        }
    }

    const label = document.getElementById('hud-scene');

    const names = {
        dashboard: 'Command Center',
        heart: 'Cardiology',
        brain: 'Neurology',
        diabetes: 'Diabetes Care',
        liver: 'Hepatology',
        kidney: 'Nephrology',
        blood: 'Hematology',
        predicting: 'Diagnosing…',
        report: 'Clinical Report'
    };

    if (label) {
        label.textContent = names[name] || name;
    }

    /* ---------- Scene-specific actions ---------- */

    if (name === 'dashboard') {
        animateCounters();
    }

    if (name === 'heart') {
        startECG();
    }

    if (name === 'diabetes') {
        startGlucose();
    }

    if (name === 'liver') {
        startLiverScan();
    }

    if (name === 'kidney') {
        startKidney();
    }

    if (name === 'blood') {
        startBloodCells();
    }

}

window.goToScene = goToScene;


/* ============================================================
   EXTERIOR → RECEPTION
============================================================ */

function enterHospital() {

    const photoBg = document.querySelector(
        '#scene-exterior .scene-photo-bg'
    );

    if (photoBg) {
        photoBg.style.transform = 'scale(1.18)';
    }

    setTimeout(() => {
        goToScene('reception');
    }, 850);
}

window.enterHospital = enterHospital;


/* ============================================================
   PATIENT LOGIN
============================================================ */

function login() {

    const nameEl = document.getElementById('login-name');
    const ageEl = document.getElementById('login-age');
    const genderEl = document.getElementById('login-gender');
    const idEl = document.getElementById('login-id');

    const name = nameEl ? nameEl.value.trim() : '';
    const age = ageEl ? ageEl.value.trim() : '';
    const gender = genderEl ? genderEl.value : '';
    const pid = idEl ? idEl.value.trim() : '';

    window.patientName = name || 'Patient';
    window.patientAge = age ? parseFloat(age) : null;
    window.patientGender = gender || 'Not specified';
    window.patientId = pid || 'Not provided';

    applyPatientDefaults();

    const hudPatient = document.getElementById('hud-patient');

    if (hudPatient) {
        hudPatient.textContent = '👤 ' + window.patientName;
        hudPatient.style.display = 'flex';
    }

    goToScene('dashboard');
}

window.login = login;


/* ============================================================
   APPLY PATIENT DETAILS
============================================================ */

function applyPatientDefaults() {

    if (!window.patientAge) return;

    Object.keys(FIELD_DEFS).forEach(dept => {

        const ageField = document.getElementById(
            dept + '-age'
        );

        if (ageField) {
            ageField.value = window.patientAge;
        }

    });

}


/* ============================================================
   DECORATIVE BUILDING WINDOWS
============================================================ */

function buildWindows(id, count, litChance) {

    const el = document.getElementById(id);

    if (!el) return;

    let html = '';

    for (let i = 0; i < count; i++) {

        const lit = Math.random() < litChance;

        html += `
            <div class="${lit ? 'lit' : ''}"></div>
        `;

    }

    el.innerHTML = html;
}

buildWindows('wg-a', 24, 0.18);
buildWindows('wg-b', 36, 0.22);
buildWindows('wg-c', 24, 0.16);


/* ============================================================
   TREELINE
============================================================ */

const treeline = document.getElementById('treeline');

if (treeline) {

    for (let i = 0; i < 18; i++) {

        treeline.insertAdjacentHTML(
            'beforeend',
            '<span></span>'
        );

    }

}


/* ============================================================
   DASHBOARD COUNTERS
============================================================ */

function animateCounters() {

    document
        .querySelectorAll('.stat-card .num')
        .forEach(el => {

            const target = parseInt(
                el.dataset.count || '0',
                10
            );

            let currentValue = 0;

            const step = Math.max(
                1,
                Math.round(target / 40)
            );

            clearInterval(el._timer);

            el._timer = setInterval(() => {

                currentValue += step;

                if (currentValue >= target) {

                    currentValue = target;

                    clearInterval(el._timer);
                }

                el.textContent =
                    currentValue.toLocaleString();

            }, 25);

        });


    const greeting =
        document.getElementById('dash-greeting');

    if (greeting) {

        const hour = new Date().getHours();

        let message;

        if (hour < 12) {
            message = 'Good morning.';
        } else if (hour < 18) {
            message = 'Good afternoon.';
        } else {
            message = 'Good evening.';
        }

        greeting.textContent =
            window.patientName
                ? `${window.patientName}, welcome. ${message}`
                : message;
    }

}


/* ============================================================
   CLOCK
============================================================ */

function tickClock() {

    const clock =
        document.getElementById('clock');

    if (!clock) return;

    clock.textContent =
        new Date().toLocaleString(
            'en-US',
            {
                weekday: 'short',
                hour: '2-digit',
                minute: '2-digit'
            }
        );
}

setInterval(tickClock, 1000);

tickClock();


/* ============================================================
   DEPARTMENT FORM DEFINITIONS
============================================================ */

const FIELD_DEFS = {

    heart: [

        {
            id: 'age',
            label: 'Age',
            unit: 'yrs',
            def: 52,
            min: 1,
            max: 120,
            normal: [0, 60]
        },

        {
            id: 'bp',
            label: 'Resting BP',
            unit: 'mmHg',
            def: 128,
            min: 60,
            max: 220,
            normal: [90, 130]
        },

        {
            id: 'chol',
            label: 'Cholesterol',
            unit: 'mg/dL',
            def: 210,
            min: 100,
            max: 400,
            normal: [125, 200]
        },

        {
            id: 'hr',
            label: 'Max Heart Rate',
            unit: 'bpm',
            def: 150,
            min: 60,
            max: 210,
            normal: [100, 190]
        },

        {
            id: 'bmi',
            label: 'BMI',
            unit: '',
            def: 26,
            min: 12,
            max: 50,
            normal: [18.5, 25]
        },

        {
            id: 'glucose',
            label: 'Fasting Glucose',
            unit: 'mg/dL',
            def: 98,
            min: 50,
            max: 300,
            normal: [70, 100]
        }

    ],


    brain: [

        {
            id: 'age',
            label: 'Age',
            unit: 'yrs',
            def: 44,
            min: 1,
            max: 100,
            normal: [0, 65]
        },

        {
            id: 'headache',
            label: 'Headache Frequency',
            unit: '/week',
            def: 2,
            min: 0,
            max: 14,
            normal: [0, 3]
        },

        {
            id: 'vision',
            label: 'Vision Disturbance',
            unit: '0-10',
            def: 2,
            min: 0,
            max: 10,
            normal: [0, 3]
        },

        {
            id: 'tumorsize',
            label: 'Lesion Size (MRI)',
            unit: 'mm',
            def: 8,
            min: 0,
            max: 80,
            normal: [0, 10]
        },

        {
            id: 'motor',
            label: 'Motor Impairment',
            unit: '0-10',
            def: 1,
            min: 0,
            max: 10,
            normal: [0, 2]
        },

        {
            id: 'seizure',
            label: 'Seizure Episodes',
            unit: '/month',
            def: 0,
            min: 0,
            max: 20,
            normal: [0, 1]
        }

    ],


    diabetes: [

        {
            id: 'age',
            label: 'Age',
            unit: 'yrs',
            def: 41,
            min: 1,
            max: 110,
            normal: [0, 60]
        },

        {
            id: 'glucose',
            label: 'Fasting Glucose',
            unit: 'mg/dL',
            def: 112,
            min: 50,
            max: 300,
            normal: [70, 100]
        },

        {
            id: 'hba1c',
            label: 'HbA1c',
            unit: '%',
            def: 5.9,
            min: 3,
            max: 14,
            normal: [4, 5.6]
        },

        {
            id: 'bmi',
            label: 'BMI',
            unit: '',
            def: 27,
            min: 12,
            max: 55,
            normal: [18.5, 25]
        },

        {
            id: 'insulin',
            label: 'Insulin',
            unit: 'µU/mL',
            def: 80,
            min: 0,
            max: 400,
            normal: [16, 166]
        },

        {
            id: 'bp',
            label: 'Blood Pressure',
            unit: 'mmHg',
            def: 124,
            min: 60,
            max: 220,
            normal: [90, 120]
        }

    ],


    liver: [

        {
            id: 'age',
            label: 'Age',
            unit: 'yrs',
            def: 48,
            min: 1,
            max: 110,
            normal: [0, 60]
        },

        {
            id: 'alt',
            label: 'ALT (SGPT)',
            unit: 'U/L',
            def: 42,
            min: 5,
            max: 300,
            normal: [7, 56]
        },

        {
            id: 'ast',
            label: 'AST (SGOT)',
            unit: 'U/L',
            def: 38,
            min: 5,
            max: 300,
            normal: [8, 48]
        },

        {
            id: 'bilirubin',
            label: 'Total Bilirubin',
            unit: 'mg/dL',
            def: 1.1,
            min: 0.1,
            max: 12,
            normal: [0.1, 1.2]
        },

        {
            id: 'albumin',
            label: 'Albumin',
            unit: 'g/dL',
            def: 4.0,
            min: 1.5,
            max: 6,
            normal: [3.4, 5.4]
        },

        {
            id: 'alkphos',
            label: 'Alk. Phosphatase',
            unit: 'U/L',
            def: 96,
            min: 20,
            max: 400,
            normal: [44, 147]
        }

    ],


    kidney: [

        {
            id: 'age',
            label: 'Age',
            unit: 'yrs',
            def: 50,
            min: 1,
            max: 110,
            normal: [0, 60]
        },

        {
            id: 'creatinine',
            label: 'Serum Creatinine',
            unit: 'mg/dL',
            def: 1.1,
            min: 0.2,
            max: 12,
            normal: [0.6, 1.3]
        },

        {
            id: 'urea',
            label: 'Blood Urea',
            unit: 'mg/dL',
            def: 32,
            min: 5,
            max: 200,
            normal: [7, 20]
        },

        {
            id: 'gfr',
            label: 'eGFR',
            unit: 'mL/min',
            def: 85,
            min: 5,
            max: 150,
            normal: [90, 150]
        },

        {
            id: 'sodium',
            label: 'Sodium',
            unit: 'mEq/L',
            def: 139,
            min: 110,
            max: 170,
            normal: [135, 145]
        },

        {
            id: 'bp',
            label: 'Blood Pressure',
            unit: 'mmHg',
            def: 130,
            min: 60,
            max: 220,
            normal: [90, 120]
        }

    ],


    blood: [

        {
            id: 'age',
            label: 'Age',
            unit: 'yrs',
            def: 45,
            min: 1,
            max: 110,
            normal: [0, 60]
        },

        {
            id: 'wbc',
            label: 'WBC Count',
            unit: 'x10³/µL',
            def: 9.6,
            min: 0.5,
            max: 100,
            normal: [4, 11]
        },

        {
            id: 'rbc',
            label: 'RBC Count',
            unit: 'x10⁶/µL',
            def: 4.6,
            min: 1,
            max: 8,
            normal: [4.2, 5.9]
        },

        {
            id: 'hemoglobin',
            label: 'Hemoglobin',
            unit: 'g/dL',
            def: 12.6,
            min: 3,
            max: 20,
            normal: [13, 17]
        },

        {
            id: 'platelets',
            label: 'Platelet Count',
            unit: 'x10³/µL',
            def: 210,
            min: 5,
            max: 900,
            normal: [150, 450]
        },

        {
            id: 'blasts',
            label: 'Blast Cells',
            unit: '%',
            def: 2,
            min: 0,
            max: 100,
            normal: [0, 2]
        }

    ]

};


/* ============================================================
   DEPARTMENT META
============================================================ */

const DEPT_META = {

    heart: {
        name: 'Coronary Heart Disease',
        dept: 'Cardiology'
    },

    brain: {
        name: 'Brain Tumor',
        dept: 'Neurology'
    },

    diabetes: {
        name: 'Type 2 Diabetes',
        dept: 'Diabetes Care Center'
    },

    liver: {
        name: 'Hepatic Dysfunction',
        dept: 'Hepatology'
    },

    kidney: {
        name: 'Chronic Kidney Disease',
        dept: 'Nephrology'
    },

    blood: {
        name: 'Blood Cancer (Leukemia)',
        dept: 'Hematology & Oncology'
    }

};


/* ============================================================
   BUILD DEPARTMENT FORMS
============================================================ */

function buildForm(dept) {

    const wrap =
        document.getElementById(dept + '-fields');

    if (!wrap) return;

    if (wrap.dataset.built === '1') return;

    const fields = FIELD_DEFS[dept];

    if (!fields) return;

    let html = '';

    fields.forEach(field => {

        html += `
            <div class="field">

                <label>
                    ${field.label}
                    ${field.unit ? ` (${field.unit})` : ''}
                </label>

                <input
                    type="number"
                    step="any"
                    id="${dept}-${field.id}"
                    value="${field.def}"
                    min="${field.min}"
                    max="${field.max}"
                />

            </div>
        `;

    });

    wrap.innerHTML = html;

    wrap.dataset.built = '1';
}


Object.keys(FIELD_DEFS).forEach(buildForm);


/* ============================================================
   ENTER DEPARTMENT
============================================================ */

function enterDept(dept) {

    if (!FIELD_DEFS[dept]) {
        console.warn('Invalid department:', dept);
        return;
    }

    goToScene(dept);
}

window.enterDept = enterDept;


/* ============================================================
   PREDICTION STEPS
============================================================ */

const STEPS = [

    'Collecting patient information…',

    'Scanning blood pressure…',

    'Analyzing lab markers…',

    'Cross-referencing case history…',

    'Running AI diagnosis model…',

    'Generating clinical report…'

];


function runPrediction(dept) {

    if (!FIELD_DEFS[dept]) {
        console.warn('Invalid department:', dept);
        return;
    }

    window._activeDept = dept;

    goToScene('predicting');

    const list =
        document.getElementById('checklist');

    const fill =
        document.getElementById('predict-bar-fill');

    if (!list || !fill) return;

    list.innerHTML = STEPS.map((step, index) => {

        return `
            <div
                class="check-item"
                id="chk-${index}"
            >

                <div class="check-mark"></div>

                <span class="label">
                    ${step}
                </span>

            </div>
        `;

    }).join('');

    fill.style.width = '0%';

    let index = 0;

    function nextStep() {

        if (index > 0) {

            const previous =
                document.getElementById(
                    'chk-' + (index - 1)
                );

            if (previous) {
                previous.classList.remove('active');
                previous.classList.add('done');
            }

        }

        if (index < STEPS.length) {

            const currentStep =
                document.getElementById(
                    'chk-' + index
                );

            if (currentStep) {
                currentStep.classList.add('active');
            }

            fill.style.width =
                Math.round(
                    ((index + 1) / STEPS.length) * 100
                ) + '%';

            index++;

            setTimeout(nextStep, 620);

        } else {

            setTimeout(() => {

                buildReport(dept);

                goToScene('report');

            }, 500);

        }

    }

    nextStep();
}

window.runPrediction = runPrediction;


/* ============================================================
   READ FORM VALUE
============================================================ */

function readValue(dept, id) {

    const el =
        document.getElementById(
            dept + '-' + id
        );

    if (!el) return 0;

    const value = parseFloat(el.value);

    return Number.isFinite(value) ? value : 0;
}


/* ============================================================
   BUILD REPORT
============================================================ */

function buildReport(dept) {

    const defs = FIELD_DEFS[dept];
    const meta = DEPT_META[dept];

    if (!defs || !meta) return;

    let abnormalCount = 0;

    const rows = defs.map(field => {

        const value =
            readValue(dept, field.id);

        const isNormal =
            value >= field.normal[0] &&
            value <= field.normal[1];

        if (!isNormal) {
            abnormalCount++;
        }

        return {
            label: field.label,
            val: value,
            unit: field.unit,
            isNormal: isNormal
        };

    });


    /* ---------- Risk ---------- */

    const ratio =
        abnormalCount / defs.length;

    let risk = 'low';
    let confidence = 0;

    if (ratio >= 0.5) {

        risk = 'high';
        confidence =
            88 + Math.round(Math.random() * 9);

    } else if (ratio >= 0.25) {

        risk = 'moderate';
        confidence =
            78 + Math.round(Math.random() * 10);

    } else {

        risk = 'low';
        confidence =
            90 + Math.round(Math.random() * 8);

    }


    /* ---------- Patient ---------- */

    const now = new Date();

    const patient =
        window.patientName || 'Unnamed Patient';

    const patientId =
        window.patientId || 'Not provided';

    const patientAge =
        window.patientAge ||
        readValue(dept, 'age') ||
        '—';

    const patientGender =
        window.patientGender ||
        'Not specified';


    /* ---------- Report ID ---------- */

    const reportId =
        'MRD-' +
        now.getFullYear() +
        '-' +
        Math.floor(
            1000 + Math.random() * 9000
        );


    /* ---------- Doctors ---------- */

    const DOCTORS = [

        'Dr. A. Ramanathan, MD',

        'Dr. S. Krishnan, MD',

        'Dr. P. Iyer, MD',

        'Dr. N. Fernandes, MD',

        'Dr. R. Bhat, MD'

    ];

    const doctor =
        DOCTORS[
            Math.floor(
                Math.random() * DOCTORS.length
            )
            ];


    /* ---------- Recommendations ---------- */

    const RECS = {

        low: [

            'Continue current lifestyle and diet.',

            'Schedule a routine follow-up in 12 months.',

            'Maintain regular physical activity.'

        ],

        moderate: [

            'Schedule a follow-up consultation within 4–6 weeks.',

            'Begin monitoring the flagged markers regularly.',

            'Consider dietary and activity adjustments.'

        ],

        high: [

            'Refer to a specialist for further evaluation.',

            'Begin close monitoring of flagged markers.',

            'Discuss treatment options with the attending physician.'

        ]

    };


    /* ---------- Tests ---------- */

    const TESTS = {

        heart: [
            '12-lead ECG',
            'Lipid panel',
            'Stress test'
        ],

        brain: [
            'Contrast MRI',
            'Neurological exam',
            'EEG'
        ],

        diabetes: [
            'Oral glucose tolerance test',
            'HbA1c recheck',
            'Kidney function panel'
        ],

        liver: [
            'Liver ultrasound',
            'Hepatitis panel',
            'Coagulation profile'
        ],

        kidney: [
            'Renal ultrasound',
            '24-hour urine test',
            'Electrolyte panel'
        ],

        blood: [
            'Bone marrow biopsy',
            'Peripheral blood smear',
            'Flow cytometry'
        ]

    };


    /* ---------- Report HTML ---------- */

    const sheet =
        document.getElementById('report-sheet');

    if (!sheet) return;


    sheet.innerHTML = `

        <div class="report-top">

            <div class="logo-mark">

                <svg
                    class="logo-icon"
                    viewBox="0 0 40 40"
                    xmlns="http://www.w3.org/2000/svg"
                >

                    <path
                        d="M16 4h8v12h12v8H24v12h-8V24H4v-8h12V4z"
                        fill="var(--gold)"
                    />

                    <path
                        d="M2 20h9l3-9 4 18 3-9h17"
                        fill="none"
                        stroke="var(--navy)"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />

                </svg>

                <span class="serif">
                    MERIDIAN
                </span>

            </div>


            <div class="meta">

                Report ID: ${reportId}<br/>

                Date: ${now.toLocaleDateString()}<br/>

                Time: ${now.toLocaleTimeString()}

            </div>

        </div>


        <div class="report-grid">

            <div class="report-block">
                <h5>Patient</h5>
                <div class="val serif">
                    ${patient}
                </div>
            </div>


            <div class="report-block">
                <h5>Patient ID</h5>
                <div class="val serif">
                    ${patientId}
                </div>
            </div>


            <div class="report-block">
                <h5>Age</h5>
                <div class="val serif">
                    ${patientAge}
                    ${typeof patientAge === 'number' ? ' yrs' : ''}
                </div>
            </div>


            <div class="report-block">
                <h5>Gender</h5>
                <div class="val serif">
                    ${patientGender}
                </div>
            </div>


            <div class="report-block">
                <h5>Department</h5>
                <div class="val serif">
                    ${meta.dept}
                </div>
            </div>


            <div class="report-block">
                <h5>Screened Condition</h5>
                <div class="val serif">
                    ${meta.name}
                </div>
            </div>


            <div class="report-block">
                <h5>Risk Level</h5>

                <span class="risk-badge ${risk}">
                    ${risk}
                </span>

            </div>


            <div class="report-block">
                <h5>AI Confidence</h5>

                <div class="val serif">
                    ${confidence}%
                </div>

            </div>

        </div>


        <h5 class="report-section-title">
            Clinical Findings
        </h5>


        <table class="param-table">

            <thead>

                <tr>
                    <th>Parameter</th>
                    <th>Value</th>
                    <th>Status</th>
                </tr>

            </thead>


            <tbody>

                ${rows.map(row => `

                    <tr>

                        <td>
                            ${row.label}
                        </td>

                        <td class="mono">
                            ${row.val}
                            ${row.unit ? ' ' + row.unit : ''}
                        </td>

                        <td>

                            <span
                                class="tag ${
        row.isNormal
            ? 'normal'
            : 'abnormal'
    }"
                            >

                                ${
        row.isNormal
            ? 'Normal'
            : 'Abnormal'
    }

                            </span>

                        </td>

                    </tr>

                `).join('')}

            </tbody>

        </table>


        <h5 class="report-section-title">
            Parameter Breakdown
        </h5>


        <div class="chart-row">

            <canvas
                id="report-pie"
                width="140"
                height="140"
            ></canvas>


            <div class="chart-legend">

                <div class="leg-item">

                    <span
                        class="leg-swatch"
                        style="background:var(--gold);"
                    ></span>

                    Normal range

                    <b>
                        ${rows.length - abnormalCount}/${rows.length}
                    </b>

                </div>


                <div class="leg-item">

                    <span
                        class="leg-swatch"
                        style="background:var(--navy-soft);"
                    ></span>

                    Outside range

                    <b>
                        ${abnormalCount}/${rows.length}
                    </b>

                </div>


                <div class="leg-item">

                    <span
                        class="leg-swatch"
                        style="background:var(--coral);"
                    ></span>

                    AI Confidence

                    <b>
                        ${confidence}%
                    </b>

                </div>

            </div>

        </div>


        <h5 class="report-section-title">
            Recommendations
        </h5>


        <ul class="reco-list">

            ${RECS[risk]
        .map(item => `<li>${item}</li>`)
        .join('')}

        </ul>


        <h5 class="report-section-title">
            Suggested Follow-up Tests
        </h5>


        <ul class="reco-list">

            ${TESTS[dept]
        .map(item => `<li>${item}</li>`)
        .join('')}

        </ul>


        <div class="doctor-note">

            "${riskNote(risk, meta.name)}"

            — AI Clinical Assistant,
            cross-checked by ${doctor}.

        </div>


        <div class="report-actions">

            <button
                class="btn"
                onclick="window.print()"
            >
                Print Report
            </button>


            <button
                class="btn ghost"
                onclick="window.print()"
            >
                Download as PDF
            </button>


            <button
                class="btn gold"
                onclick="goToScene('dashboard')"
            >
                New Screening
            </button>

        </div>

    `;


    drawReportPie(
        rows.length - abnormalCount,
        abnormalCount
    );

}


/* ============================================================
   REPORT PIE CHART
============================================================ */

function drawReportPie(
    normalCount,
    abnormalCount
) {

    const canvas =
        document.getElementById('report-pie');

    if (!canvas) return;

    const ctx =
        canvas.getContext('2d');

    const total =
        normalCount +
        abnormalCount ||
        1;

    const cx =
        canvas.width / 2;

    const cy =
        canvas.height / 2;

    const radius = 60;
    const inner = 36;

    const segments = [

        {
            value: normalCount,
            color: '#F2A6C4'
        },

        {
            value: abnormalCount,
            color: '#8A6E78'
        }

    ];

    let start =
        -Math.PI / 2;

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    segments.forEach(segment => {

        const angle =
            (segment.value / total) *
            Math.PI *
            2;

        if (segment.value > 0) {

            ctx.beginPath();

            ctx.moveTo(cx, cy);

            ctx.arc(
                cx,
                cy,
                radius,
                start,
                start + angle
            );

            ctx.closePath();

            ctx.fillStyle =
                segment.color;

            ctx.fill();

        }

        start += angle;

    });


    /* ---------- Donut hole ---------- */

    ctx.globalCompositeOperation =
        'destination-out';

    ctx.beginPath();

    ctx.arc(
        cx,
        cy,
        inner,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.globalCompositeOperation =
        'source-over';


    /* ---------- Percentage ---------- */

    ctx.fillStyle = '#3B2A33';

    ctx.font =
        '600 20px Fraunces, serif';

    ctx.textAlign = 'center';

    ctx.textBaseline = 'middle';

    ctx.fillText(
        Math.round(
            (normalCount / total) * 100
        ) + '%',
        cx,
        cy - 6
    );


    ctx.font =
        '400 9px Inter, sans-serif';

    ctx.fillStyle = '#8A6E78';

    ctx.fillText(
        'NORMAL',
        cx,
        cy + 13
    );

}


/* ============================================================
   RISK NOTE
============================================================ */

function riskNote(risk, name) {

    if (risk === 'high') {

        return `The AI model flags an elevated pattern associated with ${name.toLowerCase()} risk factors. Specialist review is recommended.`;

    }

    if (risk === 'moderate') {

        return `Some markers are outside the configured reference range for ${name.toLowerCase()}. Monitoring and follow-up are recommended.`;

    }

    return `Current entered markers are within the configured reference ranges for ${name.toLowerCase()}.`;

}


/* ============================================================
   CANVAS UTILITY
============================================================ */

function fitCanvas(canvas) {

    if (!canvas || !canvas.parentElement) return;

    const parent =
        canvas.parentElement;

    const ratio =
        window.devicePixelRatio || 1;

    const width =
        parent.clientWidth;

    const height =
        parent.clientHeight;

    if (!width || !height) return;

    canvas.width =
        width * ratio;

    canvas.height =
        height * ratio;

    canvas.style.width =
        width + 'px';

    canvas.style.height =
        height + 'px';

}


/* ============================================================
   ECG — CARDIOLOGY
============================================================ */

let ecgRAF = null;

function startECG() {

    const canvas =
        document.getElementById('ecg-canvas');

    if (!canvas) return;

    fitCanvas(canvas);

    const ctx =
        canvas.getContext('2d');

    const width =
        canvas.width;

    const height =
        canvas.height;

    const ratio =
        window.devicePixelRatio || 1;

    const mid =
        height / 2;

    let x = 0;

    cancelAnimationFrame(ecgRAF);


    function pulseAt(px) {

        const cycle =
            220 * ratio;

        const t =
            px % cycle;

        if (
            t > 30 * ratio &&
            t < 40 * ratio
        ) {
            return -18 * ratio;
        }

        if (
            t > 40 * ratio &&
            t < 48 * ratio
        ) {
            return 70 * ratio;
        }

        if (
            t > 48 * ratio &&
            t < 56 * ratio
        ) {
            return -50 * ratio;
        }

        if (
            t > 60 * ratio &&
            t < 80 * ratio
        ) {
            return 14 * ratio;
        }

        return 0;
    }


    function frame() {

        ctx.clearRect(
            0,
            0,
            width,
            height
        );

        ctx.strokeStyle =
            'rgba(226,137,124,0.9)';

        ctx.lineWidth =
            2 * ratio;

        ctx.beginPath();


        for (let i = 0; i < width; i++) {

            const y =
                mid +
                pulseAt(i + x) +
                Math.sin(
                    (i + x) * 0.02
                ) * 2;


            if (i === 0) {

                ctx.moveTo(i, y);

            } else {

                ctx.lineTo(i, y);

            }

        }

        ctx.stroke();

        x += 3 * ratio;

        ecgRAF =
            requestAnimationFrame(frame);

    }

    frame();

}


/* ============================================================
   GLUCOSE — DIABETES
============================================================ */

let glucoseRAF = null;

function startGlucose() {

    const canvas =
        document.getElementById(
            'glucose-canvas'
        );

    if (!canvas) return;

    fitCanvas(canvas);

    const ctx =
        canvas.getContext('2d');

    const width =
        canvas.width;

    const height =
        canvas.height;

    const ratio =
        window.devicePixelRatio || 1;

    const mid =
        height / 2;

    let t = 0;

    cancelAnimationFrame(glucoseRAF);


    function frame() {

        ctx.clearRect(
            0,
            0,
            width,
            height
        );

        ctx.strokeStyle =
            'rgba(143,214,201,0.85)';

        ctx.lineWidth =
            2 * ratio;

        ctx.beginPath();


        for (let i = 0; i < width; i++) {

            const y =
                mid +
                Math.sin(
                    (i * 0.01) + t
                ) *
                40 *
                ratio +

                Math.sin(
                    (i * 0.03) + t * 1.4
                ) *
                14 *
                ratio;


            if (i === 0) {

                ctx.moveTo(i, y);

            } else {

                ctx.lineTo(i, y);

            }

        }

        ctx.stroke();

        t += 0.02;

        glucoseRAF =
            requestAnimationFrame(frame);

    }

    frame();

}


/* ============================================================
   LIVER — ULTRASOUND SCAN
============================================================ */

let liverRAF = null;

function startLiverScan() {

    const canvas =
        document.getElementById(
            'liver-canvas'
        );

    if (!canvas) return;

    fitCanvas(canvas);

    const ctx =
        canvas.getContext('2d');

    const width =
        canvas.width;

    const height =
        canvas.height;

    const ratio =
        window.devicePixelRatio || 1;

    let sweep = 0;

    cancelAnimationFrame(liverRAF);


    function frame() {

        ctx.clearRect(
            0,
            0,
            width,
            height
        );


        /* ---------- Grid ---------- */

        ctx.strokeStyle =
            'rgba(198,161,91,0.08)';


        for (
            let gx = 0;
            gx < width;
            gx += 30 * ratio
        ) {

            ctx.beginPath();

            ctx.moveTo(gx, 0);

            ctx.lineTo(gx, height);

            ctx.stroke();

        }


        for (
            let gy = 0;
            gy < height;
            gy += 30 * ratio
        ) {

            ctx.beginPath();

            ctx.moveTo(0, gy);

            ctx.lineTo(width, gy);

            ctx.stroke();

        }


        /* ---------- Scan sweep ---------- */

        const gradient =
            ctx.createLinearGradient(
                sweep - 60 * ratio,
                0,
                sweep + 60 * ratio,
                0
            );

        gradient.addColorStop(
            0,
            'rgba(198,161,91,0)'
        );

        gradient.addColorStop(
            0.5,
            'rgba(198,161,91,0.28)'
        );

        gradient.addColorStop(
            1,
            'rgba(198,161,91,0)'
        );

        ctx.fillStyle = gradient;

        ctx.fillRect(
            sweep - 60 * ratio,
            0,
            120 * ratio,
            height
        );


        sweep += 3 * ratio;

        if (
            sweep >
            width + 60 * ratio
        ) {

            sweep =
                -60 * ratio;

        }

        liverRAF =
            requestAnimationFrame(frame);

    }

    frame();

}


/* ============================================================
   KIDNEY — FLOW ANIMATION
============================================================ */

let kidneyRAF = null;

function startKidney() {

    const canvas =
        document.getElementById(
            'kidney-canvas'
        );

    if (!canvas) return;

    fitCanvas(canvas);

    const ctx =
        canvas.getContext('2d');

    const width =
        canvas.width;

    const height =
        canvas.height;

    const ratio =
        window.devicePixelRatio || 1;


    const dots =
        Array.from(
            { length: 26 },
            (_, index) => ({

                x:
                    (index / 26) *
                    width,

                speed:
                    1.5 +
                    Math.random()

            })
        );


    cancelAnimationFrame(kidneyRAF);


    const tubeY =
        height * 0.72;


    function frame() {

        ctx.clearRect(
            0,
            0,
            width,
            height
        );


        /* ---------- Tube ---------- */

        ctx.strokeStyle =
            'rgba(143,176,216,0.35)';

        ctx.lineWidth =
            10 * ratio;

        ctx.beginPath();

        ctx.moveTo(
            0,
            tubeY
        );

        ctx.lineTo(
            width,
            tubeY
        );

        ctx.stroke();


        /* ---------- Flow particles ---------- */

        ctx.fillStyle =
            'rgba(143,176,216,0.9)';


        dots.forEach(dot => {

            dot.x +=
                dot.speed * ratio;

            if (dot.x > width) {
                dot.x = 0;
            }


            ctx.beginPath();

            ctx.arc(
                dot.x,
                tubeY,
                3 * ratio,
                0,
                Math.PI * 2
            );

            ctx.fill();

        });


        kidneyRAF =
            requestAnimationFrame(frame);

    }

    frame();

}


/* ============================================================
   BLOOD CELLS — HEMATOLOGY
============================================================ */

let bloodRAF = null;

function startBloodCells() {

    const canvas =
        document.getElementById(
            'blood-canvas'
        );

    if (!canvas) return;

    fitCanvas(canvas);

    const ctx =
        canvas.getContext('2d');

    const width =
        canvas.width;

    const height =
        canvas.height;

    const ratio =
        window.devicePixelRatio || 1;


    const cells =
        Array.from(
            { length: 46 },
            () => ({

                x:
                    Math.random() *
                    width,

                y:
                    Math.random() *
                    height,

                r:
                    (
                        Math.random() * 7 +
                        4
                    ) * ratio,

                vx:
                    (
                        Math.random() -
                        0.5
                    ) *
                    0.35 *
                    ratio,

                vy:
                    (
                        Math.random() -
                        0.5
                    ) *
                    0.35 *
                    ratio,

                kind:
                    Math.random() < 0.85
                        ? 'rbc'
                        : (
                            Math.random() < 0.7
                                ? 'wbc'
                                : 'plt'
                        )

            })
        );


    cancelAnimationFrame(bloodRAF);


    function frame() {

        ctx.clearRect(
            0,
            0,
            width,
            height
        );


        cells.forEach(cell => {

            cell.x += cell.vx;
            cell.y += cell.vy;


            if (cell.x < -20) {
                cell.x = width + 20;
            }

            if (cell.x > width + 20) {
                cell.x = -20;
            }

            if (cell.y < -20) {
                cell.y = height + 20;
            }

            if (cell.y > height + 20) {
                cell.y = -20;
            }


            /* ---------- RBC ---------- */

            if (cell.kind === 'rbc') {

                ctx.beginPath();

                ctx.fillStyle =
                    'rgba(200,42,58,0.55)';

                ctx.arc(
                    cell.x,
                    cell.y,
                    cell.r,
                    0,
                    Math.PI * 2
                );

                ctx.fill();


                ctx.beginPath();

                ctx.fillStyle =
                    'rgba(74,18,31,0.5)';

                ctx.arc(
                    cell.x,
                    cell.y,
                    cell.r * 0.38,
                    0,
                    Math.PI * 2
                );

                ctx.fill();

            }


            /* ---------- WBC ---------- */

            else if (cell.kind === 'wbc') {

                ctx.beginPath();

                ctx.fillStyle =
                    'rgba(247,238,232,0.85)';

                ctx.arc(
                    cell.x,
                    cell.y,
                    cell.r * 1.25,
                    0,
                    Math.PI * 2
                );

                ctx.fill();


                ctx.strokeStyle =
                    'rgba(200,42,58,0.4)';

                ctx.lineWidth =
                    1 * ratio;

                ctx.stroke();

            }


            /* ---------- Platelet ---------- */

            else {

                ctx.beginPath();

                ctx.fillStyle =
                    'rgba(230,180,150,0.7)';

                ctx.arc(
                    cell.x,
                    cell.y,
                    cell.r * 0.45,
                    0,
                    Math.PI * 2
                );

                ctx.fill();

            }

        });


        bloodRAF =
            requestAnimationFrame(frame);

    }

    frame();

}


/* ============================================================
   HUD MINI ECG
============================================================ */

(function hudLoop() {

    const canvas =
        document.getElementById(
            'hud-canvas'
        );

    if (!canvas) return;

    const ctx =
        canvas.getContext('2d');

    let x = 0;


    function pulseAt(px) {

        const cycle = 70;

        const t =
            px % cycle;


        if (
            t > 10 &&
            t < 13
        ) {
            return -6;
        }


        if (
            t > 13 &&
            t < 16
        ) {
            return 12;
        }


        if (
            t > 16 &&
            t < 19
        ) {
            return -9;
        }


        return 0;

    }


    function frame() {

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        ctx.strokeStyle =
            '#2F7D7D';

        ctx.lineWidth = 1.5;

        ctx.beginPath();


        for (
            let i = 0;
            i < canvas.width;
            i++
        ) {

            const y =
                canvas.height / 2 +
                pulseAt(i + x);


            if (i === 0) {

                ctx.moveTo(i, y);

            } else {

                ctx.lineTo(i, y);

            }

        }

        ctx.stroke();

        x += 1.4;

        requestAnimationFrame(frame);

    }


    frame();


    setInterval(() => {

        const hr =
            document.getElementById(
                'hud-hr'
            );

        if (hr) {

            hr.textContent =
                68 +
                Math.round(
                    Math.random() * 10
                );

        }

    }, 2400);

})();


/* ============================================================
   WINDOW RESIZE
============================================================ */

window.addEventListener(
    'resize',
    () => {

        [
            'ecg-canvas',
            'glucose-canvas',
            'liver-canvas',
            'kidney-canvas',
            'blood-canvas'
        ].forEach(id => {

            const canvas =
                document.getElementById(id);

            if (canvas) {
                fitCanvas(canvas);
            }

        });

    }
);


/* ============================================================
   INITIALIZE
============================================================ */

document.addEventListener(
    'DOMContentLoaded',
    () => {

        /* Make sure exterior is visible initially */

        const initial =
            document.getElementById(
                'scene-exterior'
            );

        if (
            initial &&
            !document.querySelector(
                '.scene.active'
            )
        ) {
            initial.classList.add('active');
        }

        tickClock();


    }
);