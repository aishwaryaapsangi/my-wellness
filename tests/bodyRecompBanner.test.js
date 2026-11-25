import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {join} from 'node:path';

const artNames=['woman','clouds','drinks','gear','nyc-window'];
test('fitness hero has five independent transparent SVG art assets',()=>{
 for(const name of artNames){
  const path=join('public','art','body-recomp-'+name+'.svg');
  assert.equal(existsSync(path),true,path+' is present');
  const svg=readFileSync(path,'utf8');
  assert.match(svg,/^<svg[\s>]/);
  assert.match(svg,/<\/svg>\s*$/);
  assert.match(svg,/viewBox=/);
 }
});
test('body recomp banner uses dedicated art, not a coding scene',()=>{
 const banner=readFileSync(join('src','BodyRecompBanner.jsx'),'utf8');
 const page=readFileSync(join('src','BodyRecomp.jsx'),'utf8');
 assert.match(page,/<BodyRecompBanner\/>/);
 for(const name of artNames)assert.ok(banner.includes('name="'+name+'"'),'missing '+name);
 assert.doesNotMatch(banner,/laptop|coding|code editor|SWE\b/i);
});
