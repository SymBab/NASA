'use strict';
const THEME={
 dust:{icon:'wind',color:'#c9c0b2',name:'ฝุ่น'},patch:{icon:'alert',color:'#ff9f6b',name:'จุดอ่อน'}
};
const SW_PANEL='<svg viewBox="0 0 60 36" width="56" height="34" aria-hidden="true"><polygon points="6,28 54,28 48,6 12,6" fill="#2c4a8a" stroke="#9fb4e8" stroke-width="2"/><line x1="30" y1="6" x2="30" y2="28" stroke="#9fb4e8"/><line x1="9" y1="17" x2="51" y2="17" stroke="#9fb4e8"/></svg>',SW_DISH='<svg viewBox="0 0 60 36" width="56" height="34" aria-hidden="true"><path d="M8 8a26 22 0 0 0 44 0z" fill="#bfc6dc"/><line x1="30" y1="22" x2="30" y2="32" stroke="#bfc6dc" stroke-width="3"/><circle cx="30" cy="6" r="3" fill="#ff6b6b"/></svg>';
const LEAVES=()=>{const L=[];for(let i=0;i<4;i++)L.push({ic:'leaf',col:'#d7d9e8',m:'• •',good:true,al:'ใบที่มีราขาว'});for(let i=0;i<4;i++)L.push({ic:'leaf',col:'#7bd88f',good:false,al:'ใบปกติ'});return L;};
const SAMPLES=()=>{const L=[];for(let i=0;i<4;i++)L.push({ic:'gem',col:'#a8d98a',m:'◍ ◍',good:true,al:'ตัวอย่างที่มีเชื้อ'});for(let i=0;i<4;i++)L.push({ic:'gem',col:'#b7bccf',good:false,al:'ตัวอย่างสะอาด'});return L;};
const ROCKS=()=>{const L=[];for(let i=0;i<3;i++)L.push({ic:'gem',col:'#d8a8ff',m:'✦',good:true,al:'หินน่าสนใจ'});for(let i=0;i<5;i++)L.push({ic:'gem',col:'#8e93a8',good:false,al:'หินธรรมดา'});return L;};
const SYSTEMS=()=>[
 {t:'ไฟประดับห้อง',ic:'bolt',good:true},{t:'เครื่องเล่นเพลง',ic:'bolt',good:true},{t:'เครื่องทำน้ำอุ่น',ic:'bolt',good:true},{t:'ห้องเก็บของ',ic:'box',good:true},
 {t:'ระบบช่วยชีวิต',ic:'heart',good:false},{t:'เครื่องกรองอากาศ',ic:'wind',good:false},{t:'วิทยุสื่อสาร',ic:'signal',good:false},{t:'ปั๊มน้ำห้องปลูก',ic:'drop',good:false}];
const MINI_ACT={
 solar:{kind:'track',title:'หันแผงโซลาร์ให้ตรงดวงอาทิตย์',how:'ดวงอาทิตย์เคลื่อนที่ไปเรื่อย ๆ เลื่อนแถบให้แผงอยู่ใต้ดวงอาทิตย์ให้นานที่สุด',hint:'ลากแถบเลื่อนตามดวงอาทิตย์',tg:'sun',dv:'panel'},
 plant:{kind:'fill',title:'รดน้ำให้พอดี',how:'กดปุ่มค้างเพื่อเติมน้ำ ปล่อยเมื่อระดับน้ำอยู่ในแถบสีเขียว ทั้งหมด 2 ถัง น้ำล้นไม่ได้',verb:'รดน้ำ',col:'#62c8ff',hint:'กดค้าง แล้วปล่อยให้พอดี'},
 rplant:{kind:'order',title:'วัดการเติบโตของต้นกล้า',how:'แตะต้นกล้าเรียงจากต้นเตี้ยที่สุดไปสูงที่สุด',hint:'เรียงจากเตี้ยไปสูง'},
 rrad:{kind:'hunt',title:'ค้นหาแหล่งรังสีด้วยเครื่องวัด',how:'แตะช่องเพื่อตรวจ ยิ่งร้อนยิ่งใกล้แหล่งรังสี หาให้เจอภายใน 6 ครั้ง',hint:'ใช้จำนวนครั้งให้น้อยที่สุด'},
 shield:{kind:'tap',theme:'patch',title:'ปิดช่องโหว่ของเกราะ',how:'แตะจุดอ่อนให้ครบก่อนที่มันจะหายไป',hint:'แตะให้ทัน'}
};
const MINI_EV={
 leak:{kind:'tap',theme:'patch',title:'อุดรอยรั่ว',how:'แตะจุดรั่วให้ครบก่อนอากาศหมด',hint:'แตะให้ทัน'},
 solardust:{kind:'wipe',bg:'#1d3768',title:'ปัดฝุ่นออกจากแผงโซลาร์',how:'ลากนิ้วหรือเมาส์ถูผ่านฝุ่นให้สะอาดก่อนหมดเวลา',hint:'ลากถูให้ทั่ว'},
 powerdrop:{kind:'triage',cols:2,items:SYSTEMS,title:'ตัดไฟระบบที่ไม่จำเป็น',how:'แตะเฉพาะระบบที่ตัดไฟได้ อย่าตัดระบบช่วยชีวิต',hint:'ระบบช่วยชีวิตต้องมาก่อนเสมอ'},
 storm:{kind:'catch',title:'กางเกราะรับอนุภาครังสี',how:'ลากนิ้วหรือเมาส์ (หรือกดลูกศร ซ้าย/ขวา) เลื่อนเกราะไปรับอนุภาคที่ตกลงมา',hint:'เลื่อนเกราะให้ทัน'},
 dustin:{kind:'wipe',bg:'#3a4056',title:'ปัดฝุ่นจันทร์ออกจากชุดอวกาศ',how:'ลากนิ้วหรือเมาส์ถูผ่านฝุ่นให้สะอาดก่อนหมดเวลา',hint:'ลากถูให้ทั่ว'},
 filter:{kind:'tap',theme:'dust',title:'เก็บฝุ่นที่อุดไส้กรอง',how:'แตะฝุ่นให้ครบก่อนที่มันจะหายไป',hint:'แตะให้ทัน'},
 water:{kind:'fill',title:'ปรับน้ำให้พอดี',how:'กดปุ่มค้างเพื่อเติมน้ำ ปล่อยเมื่อระดับน้ำอยู่ในแถบสีเขียว ทั้งหมด 2 ถัง น้ำล้นไม่ได้',verb:'เติมน้ำ',col:'#62c8ff',hint:'กดค้าง แล้วปล่อยให้พอดี'},
 mold:{kind:'triage',cols:4,items:LEAVES,title:'ตัดใบที่มีเชื้อรา',how:'แตะเฉพาะใบที่มีจุดขาว อย่าตัดใบปกติ',hint:'ใบมีรามีจุด • •'},
 contam:{kind:'triage',cols:4,items:SAMPLES,title:'คัดแยกตัวอย่างที่ปนเปื้อน',how:'แตะเฉพาะตัวอย่างที่มีจุดเชื้อสีเขียว ◍ ◍',hint:'อย่าทิ้งตัวอย่างที่สะอาด'},
 radmeter:{kind:'memory',title:'ป้อนรหัสสอบเทียบเครื่องวัด',how:'ดูลำดับไฟที่กะพริบ แล้วกดตามลำดับเดิม ทั้งหมด 4 ตัว',hint:'จำลำดับแล้วกดตาม'},
 comms:{kind:'track',title:'จูนสัญญาณให้ตรงกับโลก',how:'สัญญาณจากโลกเคลื่อนที่ไปเรื่อย ๆ เลื่อนแถบให้จานรับสัญญาณตรงกับสัญญาณให้นานที่สุด',hint:'ลากแถบเลื่อนตามสัญญาณ',tg:'signal',dv:'dish'},
 rock:{kind:'triage',cols:4,items:ROCKS,title:'เลือกเก็บหินที่น่าสนใจ',how:'แตะเฉพาะหินสีม่วงวาว ✦ ที่ควรเก็บ อย่าเสียเวลากับหินธรรมดา',hint:'มีเวลาจำกัด'},
 heater:{kind:'fill',title:'ปรับอุณหภูมิเครื่องทำความร้อน',how:'กดปุ่มค้างเพื่อเพิ่มความร้อน ปล่อยเมื่ออุณหภูมิอยู่ในแถบสีเขียว ทั้งหมด 2 รอบ ร้อนเกินไม่ได้',verb:'เพิ่มความร้อน',col:'#ff9f6b',hint:'กดค้าง แล้วปล่อยให้พอดี'}
};
const SCORE_TXT=['พลาด','พอใช้','ยอดเยี่ยม'];
const ACT_POS=[0.7,1,1.25],ACT_NEG=[1.2,1,1],EV_NEG=[1.3,1,0.7];
