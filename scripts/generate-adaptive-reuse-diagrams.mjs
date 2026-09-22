import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve('public/assets/articles/adaptive-reuse-architecture');
fs.mkdirSync(outDir, { recursive: true });

const frame = (eyebrow, title, body, footer) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900">
  <defs><style>.t{font:700 30px Arial;fill:#f2ede4;letter-spacing:1.7px}.s{font:400 20px Arial;fill:#b9b4aa}.n{font:700 18px Arial;fill:#d6b57f;letter-spacing:1.5px}.box{fill:#1d2926;stroke:#62716a;stroke-width:2}.line{stroke:#d6b57f;stroke-width:4;fill:none}.ghost{fill:#15201e;stroke:#394743;stroke-width:2}</style><pattern id="g" width="44" height="44" patternUnits="userSpaceOnUse"><path d="M44 0H0V44" fill="none" stroke="#27312f" stroke-width="1"/></pattern></defs>
  <rect width="1600" height="900" fill="#101615"/><rect width="1600" height="900" fill="url(#g)" opacity=".65"/>
  <text x="90" y="92" class="n">${eyebrow}</text><text x="90" y="145" class="t">${title}</text>
  ${body}
  <text x="90" y="830" class="s">${footer}</text>
</svg>`;

const diagrams = {
  'diagram-01-reuse-sequence.svg': frame('ADAPTIVE-REUSE DECISION', 'READ BEFORE YOU REDESIGN', `
    <g transform="translate(88 235)">
      ${['SURVEY','VALUE','CAPACITY','FIT','INTERVENE'].map((label,i)=>`<rect class="box" x="${i*286}" width="238" height="420" rx="8"/><text x="${34+i*286}" y="62" class="n">0${i+1}</text><text x="${34+i*286}" y="124" class="t">${label}</text>`).join('')}
      <g class="s"><text x="34" y="215">fabric</text><text x="34" y="252">defects</text><text x="34" y="289">dimensions</text><text x="320" y="215">heritage</text><text x="320" y="252">social use</text><text x="320" y="289">carbon</text><text x="606" y="215">structure</text><text x="606" y="252">fire</text><text x="606" y="289">services</text><text x="892" y="215">programme</text><text x="892" y="252">light</text><text x="892" y="289">access</text><text x="1178" y="215">repair</text><text x="1178" y="252">insert</text><text x="1178" y="289">adapt</text></g>
      <path class="line" d="M238 365h48m238 0h48m238 0h48m238 0h48"/><path fill="#d6b57f" d="M280 355l18 10-18 10m286-20 18 10-18 10m286-20 18 10-18 10m286-20 18 10-18 10"/>
    </g>`, 'THE EXISTING BUILDING IS EVIDENCE · DO NOT ERASE IT BEFORE IT IS UNDERSTOOD'),

  'diagram-02-condition-map.svg': frame('BUILDING DIAGNOSIS', 'MAP CONDITIONS, NOT IMPRESSIONS', `
    <g transform="translate(120 220)"><path class="ghost" d="M80 410V110h420v300M80 230h420M270 110v300"/>
      <path d="M80 410h420" stroke="#f2ede4" stroke-width="10"/><path d="M270 110v300" stroke="#6f837a" stroke-width="14"/><circle cx="175" cy="172" r="35" fill="#d6b57f"/><circle cx="395" cy="318" r="35" fill="#9a6558"/><path d="M80 230h420" stroke="#8aa89a" stroke-width="8"/>
      <text x="610" y="120" class="n">FABRIC LAYERS</text><text x="610" y="175" class="t">WHAT EXISTS?</text><g class="s"><text x="610" y="245">structure + foundations</text><text x="610" y="292">weathering + moisture</text><text x="610" y="339">hazardous materials</text><text x="610" y="386">character-defining spaces</text><text x="610" y="433">later changes worth retaining</text><text x="610" y="480">services + access constraints</text></g>
      <rect x="1040" y="112" width="240" height="330" class="box" rx="8"/><text x="1080" y="170" class="n">OUTPUT</text><text x="1080" y="230" class="t">KEEP</text><text x="1080" y="280" class="t">REPAIR</text><text x="1080" y="330" class="t">ALTER</text><text x="1080" y="380" class="t">REMOVE</text>
    </g>`, 'PHOTOGRAPH · MEASURE · TEST · DATE · DRAW · RECORD UNCERTAINTY'),

  'diagram-03-structure-insertion.svg': frame('OLD + NEW STRUCTURE', 'LET THE INSERTION DECLARE ITS LOAD PATH', `
    <g transform="translate(120 225)">
      <path d="M40 500V95h430v405M40 240h430M255 95v405" stroke="#6f837a" stroke-width="18" fill="none"/><text x="45" y="555" class="s">EXISTING FRAME</text>
      <path d="M590 500V190h420v310M590 335h420" stroke="#d6b57f" stroke-width="12" fill="none"/><path d="M590 190l210-105 210 105" class="line"/><text x="590" y="555" class="s">NEW LIGHTWEIGHT INSERTION</text>
      <path d="M1100 495h250M1225 120v375" stroke="#f2ede4" stroke-width="8"/><path d="M1185 160h80l-40-70z" fill="#d6b57f"/><text x="1095" y="555" class="s">INDEPENDENT LOAD PATH</text>
      <g class="n"><text x="50" y="70">01 RETAIN</text><text x="590" y="70">02 INSERT</text><text x="1100" y="70">03 VERIFY</text></g>
    </g>`, 'SURVEY CAPACITY · LIMIT NEW DEAD LOAD · DETAIL TOLERANCES · MONITOR MOVEMENT'),

  'diagram-04-services-life-safety.svg': frame('INTEGRATED UPGRADE', 'MAKE NEW SYSTEMS LEGIBLE AND SERVICEABLE', `
    <g transform="translate(100 225)">
      <rect x="20" y="40" width="940" height="470" class="ghost"/><path d="M20 400h940M240 40v470M520 40v470M790 40v470" stroke="#62716a" stroke-width="4"/>
      <path d="M80 440V120h100V440" stroke="#d6b57f" stroke-width="14" fill="none"/><text x="58" y="80" class="n">SERVICE SPINE</text>
      <path d="M300 440V160h150V440" stroke="#8aa89a" stroke-width="12" fill="none"/><text x="285" y="120" class="n">STAIR + LIFT</text>
      <path d="M580 90h150v350H580" stroke="#9a6558" stroke-width="12" fill="none"/><text x="566" y="55" class="n">FIRE ZONE</text>
      <path d="M830 105v335" stroke="#f2ede4" stroke-width="10" stroke-dasharray="18 16"/><text x="800" y="70" class="n">DAYLIGHT</text>
      <g transform="translate(1040 40)"><rect width="370" height="470" class="box" rx="8"/><text x="42" y="70" class="t">COORDINATE</text><g class="s"><text x="42" y="145">escape + compartmentation</text><text x="42" y="195">step-free access</text><text x="42" y="245">fresh air + thermal comfort</text><text x="42" y="295">routes for MEP replacement</text><text x="42" y="345">acoustic separation</text><text x="42" y="395">maintenance clearances</text></g></g>
    </g>`, 'CODE COMPLIANCE IS LOCAL · RETROFIT SOLUTIONS REQUIRE QUALIFIED REVIEW'),

  'diagram-05-whole-life-carbon.svg': frame('WHOLE-LIFE COMPARISON', 'COUNT THE CARBON ALREADY STANDING', `
    <g transform="translate(140 240)">
      <text x="0" y="70" class="n">REUSE + UPGRADE</text><rect x="0" y="105" width="270" height="110" fill="#6f837a"/><rect x="270" y="105" width="160" height="110" fill="#d6b57f"/><rect x="430" y="105" width="320" height="110" fill="#394743"/><text x="20" y="172" class="s">retained carbon</text><text x="285" y="172" class="s">new work</text><text x="500" y="172" class="s">operation</text>
      <text x="0" y="340" class="n">DEMOLISH + REBUILD</text><rect x="0" y="375" width="170" height="110" fill="#9a6558"/><rect x="170" y="375" width="660" height="110" fill="#d6b57f"/><rect x="830" y="375" width="320" height="110" fill="#394743"/><text x="20" y="442" class="s">demolition</text><text x="350" y="442" class="s">new materials + construction</text><text x="900" y="442" class="s">operation</text>
      <path d="M0 555h1230" stroke="#62716a" stroke-width="3"/><g class="s"><text x="0" y="600">CONCEPT</text><text x="360" y="600">CONSTRUCTION</text><text x="900" y="600">USE + REPLACEMENT</text></g>
    </g>`, 'COMPARE THE SAME PROGRAMME · TIMEFRAME · GRID · PERFORMANCE · SITE CONDITIONS'),
};

for (const [name, svg] of Object.entries(diagrams)) {
  fs.writeFileSync(path.join(outDir, name), svg);
}

console.log(`Generated ${Object.keys(diagrams).length} adaptive-reuse diagrams.`);
