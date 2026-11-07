'use strict';
/* ---------- ค่าของเกม (สมมติ ไม่ใช่ข้อมูล NASA) ---------- */
const RES=['power','food','health','research'];
const RL={power:'ไฟ',food:'อาหาร',health:'สุขภาพ',research:'วิจัย'};
const RI={power:'bolt',food:'leaf',health:'heart',research:'flask'};
const MODES={4:{light:2,night:2},7:{light:4,night:3},14:{light:7,night:7}};
const TARGETS={4:82,7:112,14:140};
const POP_MIN=4,POP_MAX=5,EV_MIN=2,EV_MAX=3,BEAT_STEP=30; /* ช่วงทำกิจกรรม 4-5 ครั้ง/วัน, ปัญหา 2-3 ครั้ง/วัน, เรื่องเล่าทุก 30 นาที */
const PLANS={
  plant:{name:'เน้นวิจัยพืช',mP:1.4,mR:0.7,pro:'วิจัยพืชได้แต้มมากกว่า (×1.4)',con:'วิจัยรังสีได้แต้มน้อยลง (×0.7)'},
  rad:{name:'เน้นวิจัยรังสี',mP:0.7,mR:1.4,pro:'วิจัยรังสีได้แต้มมากกว่า (×1.4)',con:'วิจัยพืชได้แต้มน้อยลง (×0.7)'},
  mixed:{name:'ผสม',mP:1.25,mR:1.25,pro:'ได้แต้มดีทั้งสองด้าน (×1.25) ยืดหยุ่นตามเหตุการณ์',con:'ไม่เร็วเท่าด้านที่เลือกเน้น (×1.4)'}
};
let rnd=Math.random;
const DAY_START=360,DAY_END=1320; /* 06:00 - 22:00 */
/* TICK_MS=100 → normal 0.8 นาทีเกม/tick = 8 นาทีเกมต่อวินาที → 1 วัน (960 นาทีเกม) ≈ 2 นาทีจริง */
const SPEEDS={slow:{n:'ช้า',m:0.5},normal:{n:'ปกติ',m:0.8},fast:{n:'เร็ว',m:1.6}};
let TICK_MS=100;
