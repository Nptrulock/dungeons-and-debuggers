const DD=require('./count.js'),vm=require('vm'),cp=require('child_process'),util=require('util');
DD.units.forEach(u=>u.qs.forEach((q,i)=>{ if(q[0]!=='out')return; const code=q[4]; if(!code)return;
 const py=/print\(|def |^\w+ = |range\(/m.test(code)&&!/console\.log|let |const /.test(code);
 let out;
 if(py){ try{out=cp.execFileSync('python3',['-c',code],{encoding:'utf8'}).trim().replace(/\n/g,' | ')}catch(e){out='PYERR '+(e.stderr||'').split('\n').filter(Boolean).pop()} }
 else { const lines=[];const ctx={console:{log:(...a)=>lines.push(a.map(x=>typeof x==='string'?x:util.inspect(x)).join(' '))},setTimeout:(f)=>setImmediate(()=>{f();}),JSON};
  try{vm.runInNewContext(code,ctx)}catch(e){lines.push('THROW '+e.constructor.name+': '+e.message)} out=lines.join(' | '); }
 console.log((py?'PY ':'JS ')+u.id+'#'+i+'\n   expect: '+q[2][0]+'\n   got:    '+out);
}));
