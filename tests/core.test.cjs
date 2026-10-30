const test=require('node:test');
const assert=require('node:assert/strict');
const core=require('../electron/focuscat-core.cjs');

test('formats timer',()=>{assert.equal(core.formatTime(1500),'25:00');assert.equal(core.formatTime(61),'01:01')});
test('weighted reward can hit SSR',()=>{assert.equal(core.weightedReward(()=>0.9999).rarity,'ssr')});
test('completed session updates stats and inventory',()=>{const next=core.applyCompletedSession({},25,{id:'paper_ball'},'2026-10-30');assert.equal(next.sessions,1);assert.equal(next.totalMinutes,25);assert.equal(next.inventory.paper_ball,1);assert.equal(next.streak,1)});
test('streak continues only next day',()=>{const s={streak:3,lastDate:'2026-10-29'};assert.equal(core.applyCompletedSession(s,25,null,'2026-10-30').streak,4);assert.equal(core.applyCompletedSession({...s,lastDate:'2026-10-20'},25,null,'2026-10-30').streak,1)});
