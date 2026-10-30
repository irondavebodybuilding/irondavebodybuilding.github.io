'use strict';
function calculate(mass,volume,value,mode,capacity){
 if (![mass,volume,value,capacity].every(Number.isFinite)||mass<=0||volume<=0||value<=0||![30,50,100].includes(capacity)) throw Error('Bitte alle Felder mit positiven Zahlen ausfüllen und eine Spritzengröße auswählen.');
 const concentration=mass/volume;
 let ml;
 if(mode==='units') ml=value/100;
 else if(mode==='ml') ml=value;
 else if(mode==='mg') ml=value/concentration;
 else if(mode==='mcg') ml=value/1000/concentration;
 else throw Error('Bitte eine gültige Umrechnung wählen.');
 const units=ml*100,mg=ml*concentration,mcg=mg*1000;
 if(![concentration,ml,units,mg,mcg].every(x=>Number.isFinite(x)&&x>0)) throw Error('Die Eingaben liegen außerhalb des berechenbaren Bereichs.');
 if(ml>volume+1e-12) throw Error('Das berechnete Teilvolumen überschreitet das gesamte Lösungsvolumen. Bitte Eingaben prüfen.');
 if(units>capacity+1e-10) throw Error('Das berechnete Volumen überschreitet das gewählte Spritzenfassungsvermögen. Bitte Eingaben und Größe prüfen.');
 return {concentration,ml,units,mg,mcg};
}
if(typeof module!=='undefined') module.exports={calculate};
if(typeof document!=='undefined'){
 const form=document.getElementById('calc'),result=document.getElementById('result'),mode=document.getElementById('mode');
 const labels={units:'Skaleneinheiten (U-100)',ml:'Volumen (ml)',mg:'Stoffmenge (mg)',mcg:'Stoffmenge (µg)'};
 const parse=id=>{const s=document.getElementById(id).value.trim();return /^(?:\d+(?:[.,]\d*)?|[.,]\d+)$/.test(s)?Number(s.replace(',','.')):NaN;};
 const format=n=>n!==0&&(Math.abs(n)<0.000001||Math.abs(n)>=1e9)?n.toExponential(5):new Intl.NumberFormat('de-DE',{maximumSignificantDigits:7}).format(n);
 const clear=()=>{result.innerHTML='<h2>Dein Ergebnis</h2><p>Fülle die Felder aus und wähle „Berechnen“.</p>';};
 form.addEventListener('input',clear);
 mode.addEventListener('change',()=>{document.getElementById('value-label').textContent=labels[mode.value];document.getElementById('value').value='';clear();});
 form.addEventListener('reset',()=>{document.getElementById('value-label').textContent=labels.units;clear();});
 form.addEventListener('submit',event=>{event.preventDefault();try{
 const r=calculate(parse('mass'),parse('volume'),parse('value'),mode.value,parse('capacity'));
 result.innerHTML='<h2>Dein Ergebnis</h2><p>Konzentration: <strong>'+format(r.concentration)+' mg/ml</strong></p><p>Volumen: <strong>'+format(r.ml)+' ml</strong></p><p>U-100-Skala: <strong>'+format(r.units)+' Skaleneinheiten</strong></p><p>Enthaltene Stoffmenge: <strong>'+format(r.mg)+' mg · '+format(r.mcg)+' µg</strong></p><p class="note">Mathematisches Ergebnis, auf bis zu 7 signifikante Stellen gerundet. Keine Dosierungsempfehlung. Dezimale Skalenwerte sind nicht automatisch auf der Spritze ablesbar; keine Rundung auf Teilstriche.</p>';
 }catch(e){result.innerHTML='<h2>Eingaben prüfen</h2>';const message=document.createElement('p');message.className='error';message.textContent=e.message;result.appendChild(message);}});
}
