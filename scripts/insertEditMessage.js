const fs=require('fs');
const path='d:/Project/vscode-git-graph/tests/config.test.ts';
let lines=fs.readFileSync(path,'utf8').split('\n');
let out=[];
let inCommit=false;
let added=false;
for(let line of lines){
    if(line.includes('commit: {')){inCommit=true; added=false;}
    if(inCommit && line.includes('copySubject: true')){
        out.push(line);
        if(!added){
            let ind=line.match(/^\s*/)[0];
            out.push(ind+'editMessage: true,');
            added=true;
        }
        continue;
    }
    if(inCommit && line.trim()==='},'){
        inCommit=false;
    }
    out.push(line);
}
fs.writeFileSync(path,out.join('\n'),'utf8');
