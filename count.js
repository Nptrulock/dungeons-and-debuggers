const fs=require('fs'),vm=require('vm');const ctx={};ctx.globalThis=ctx;vm.createContext(ctx);
const files=['core.js',...fs.readdirSync('data').filter(f=>f!=='core.js'&&f!=='glossary.js').sort(),'glossary.js'].filter(f=>fs.existsSync('data/'+f));
for(const f of files) vm.runInContext(fs.readFileSync('data/'+f,'utf8'),ctx,{filename:f});
const DD=ctx.DD;const by={};DD.units.forEach(u=>{by[u.track]=(by[u.track]||0)+u.qs.length});
console.log(by,'total',DD.units.reduce((a,u)=>a+u.qs.length,0),'units',DD.units.length);
module.exports=DD;
