
/* Ayikho A/B App v2
   - Simple mode uses rewritten ESL content (no auto-shortening)
   - Detail mode uses expanded explanations
   - Video vs No-video is controlled by AB assignment
   - All modules are unlocked
*/
(function(){
  const AB_KEY = 'ayikho_ab_v2';

  function getAB(){
    try { return JSON.parse(localStorage.getItem(AB_KEY)||'{}'); } catch(e){ return {}; }
  }

  function setActiveNav(id){
  document.querySelectorAll('.tab').forEach(el=>el.classList.remove('active'));
  const el = document.querySelector(`[data-nav="${id}"]`);
  if (el) el.classList.add('active');
}

  function el(html){
    const d = document.createElement('div');
    d.innerHTML = html.trim();
    return d.firstChild;
  }

  const state = {
    profile: JSON.parse(localStorage.getItem('ayikho_profile_v2') || '{}'),
  };

  function saveProfile(){
    localStorage.setItem('ayikho_profile_v2', JSON.stringify(state.profile||{}));
  }

  function renderTopbar(){
    const ab = getAB();
    const name = (state.profile && state.profile.name) ? state.profile.name : "Mntase";
    /* topbar removed in v3 */
  }

  function route(){
    const hash = location.hash || '#/home';
    const [_, first, second] = hash.split('/');
    if (first === 'start') return renderStart();
    if (first === 'home') return renderHome();
    if (first === 'module') return renderModule(second);
    if (first === 'progress') return renderProgress();
    if (first === 'badges') return renderBadges();
    if (first === 'profile') return renderProfile();
    return renderHome();
  }

  function renderStart(){
    setActiveNav('start');
    const ab = getAB();
    const app = document.getElementById('app');
    app.innerHTML = '';
    app.appendChild(el(`
      <div class="container">
        <h1>Ayikho (A/B Test)</h1>
        <section class="card">
          <h2>Welcome</h2>
          <p class="muted">You are in a test version. We are comparing:</p>
          <ul>
            <li><strong>Simple vs Detail</strong></li>
            <li><strong>Video vs No video</strong></li>
          </ul>
          <p class="tip"><strong>WhatsApp reminders are coming soon.</strong></p>
        </section>

        <section class="card">
          <h2>Your name</h2>
          <p class="muted">This helps us personalise the experience.</p>
          <input id="nameInput" class="input" placeholder="e.g., Zandile" />
          <div class="row" style="margin-top:12px">
            <button class="btn" id="startBtn">Start learning</button>
            <button class="btn secondary" id="resetABBtn" title="For testing only">Reset A/B (device)</button>
          </div>
          <p class="small muted" style="margin-top:10px">Assigned group: <strong>${ab.group || '?'}</strong></p>
        </section>
      </div>
    `));

    // styles for input
    if (!document.getElementById('inputStyle')){
      const s = document.createElement('style');
      s.id = 'inputStyle';
      s.textContent = `.input{width:100%;padding:12px 12px;border-radius:12px;border:1px solid rgba(255,255,255,.14);background:#0a0e13;color:var(--text);outline:none}`;
      document.head.appendChild(s);
    }

    document.getElementById('startBtn').onclick = () => {
      const name = document.getElementById('nameInput').value.trim();
      if (name) {
        state.profile = { ...state.profile, name };
        saveProfile();
      }
      
      window.ayikhoTrack && window.ayikhoTrack('onboardingComplete', { nameProvided: !!name });
      location.hash = '#/home';
    };

    document.getElementById('resetABBtn').onclick = () => {
      localStorage.removeItem('ayikho_ab_v2');
      // re-run assignment by reloading ab.js
      location.reload();
    };

    
    window.ayikhoTrack && window.ayikhoTrack('appOpen', { screen: 'start' });
  }

  function renderHome(){
    setActiveNav('home');
    const ab = getAB();
    const name = (state.profile && state.profile.name) ? state.profile.name : "Mntase";

    const app = document.getElementById('app');
    app.innerHTML = '';

    const modules = [
      {id:1, title:'Accounting Concepts & Principles', mins:7},
      {id:2, title:'Double Entry & Accounting Equation', mins:8},
      {id:3, title:'Journals & Ledgers', mins:9},
      {id:4, title:'Trial Balance', mins:8},
      {id:5, title:'Cash Receipts & Payments Journals', mins:10},
      {id:6, title:'Debtors & Creditors Journals', mins:10},
      {id:7, title:'Value Added Tax (VAT)', mins:8},
      {id:8, title:'Year-End Adjustments', mins:11},
      {id:9, title:'Financial Statements', mins:12},
      {id:10, title:'Bank Reconciliation', mins:9},
    ];

    const cards = modules.map(m => `
      <div class="cardA moduleCardA" onclick="location.hash='#/module/${m.id}'">
        <div class="modNum">${m.id}</div>
        <div style="flex:1">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:10px">
            <div>
              <div style="font-family:JetBrains Mono,monospace;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--dim)">Module ${m.id}</div>
              <h2 style="margin-top:6px">${m.title}</h2>
            </div>
            <div class="chip">Open →</div>
          </div>
          <div class="modMeta">
            <span>⏱ ${m.mins} min</span>
            <span>•</span>
            <span>${ab.noVid ? 'No video' : 'Video'}</span>
            <span>•</span>
            <span>${ab.simple ? 'Simple' : 'Detail'}</span>
          </div>
        </div>
      </div>
    `).join('');

    app.appendChild(el(`
      <div class="page">
        <div class="hdrRow">
          <div>
            <div class="kicker" style="font-family:JetBrains Mono,monospace;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--dim)">Sawubona</div>
            <div style="font-size:26px;font-weight:900;color:var(--ink);margin-top:6px">${name}</div>
            <div class="small" style="margin-top:8px">All modules are unlocked in this A/B test build.</div>
          </div>
          <div class="badges">
            <span class="badgeMini">${ab.simple ? 'Simple' : 'Detail'}</span>
            <span class="badgeMini">${ab.noVid ? 'No‑video' : 'Video'}</span>
          </div>
        </div>

        <div style="height:14px"></div>

        <div class="cardA">
          <h2>Financial Accounting N4 · 10 Modules</h2>
          <p>Plain English. South African examples. Short quizzes.</p>
          <div style="height:10px"></div>
          <div class="chip">WhatsApp reminders: coming soon</div>
        </div>

        <div style="height:14px"></div>

        <div class="list" style="gap:12px">
          ${cards}
        </div>
      </div>
    `));

    window.ayikhoTrack && window.ayikhoTrack('screen', { screen: 'home' });
  }

  function getContentForModule(mid){
    const ab = getAB();
    const id = String(mid);
    const simple = window.AYIKHO_SIMPLE_CONTENT && window.AYIKHO_SIMPLE_CONTENT[id];
    const detail = window.AYIKHO_DETAIL_CONTENT && window.AYIKHO_DETAIL_CONTENT[id];
    return ab.simple ? simple : detail;
  }

  function renderModule(midRaw){
    setActiveNav('home');
    const mid = parseInt(midRaw || '1', 10);
    const ab = getAB();
    const app = document.getElementById('app');
    app.innerHTML = '';

    const content = getContentForModule(mid) || '<div class="container"><p>Missing content.</p></div>';

    const videoHtml = ab.noVid ? '' : `
      <section class="card">
        <h2>Video</h2>
        <div class="videoBox">
          <p><strong>Video is enabled for this user.</strong></p>
          <p class="muted">Drop your MP4 in <code>/videos/</code> and set the URL in <code>js/video-map.js</code>.</p>
          <div class="row" style="margin-top:10px">
            <button class="btn secondary" onclick="window.open('scripts/M${String(mid).padStart(2,'0')}.md','_blank')">Open script</button>
          </div>
        </div>
      </section>
    `;

    app.appendChild(el(`
      <div class="container">
        <div class="row" style="justify-content:space-between;align-items:center">
          <button class="btn secondary" onclick="location.hash='#/home'">← Modules</button>
          <div class="row">
            <span class="badge">${ab.simple ? 'Simple' : 'Detail'}</span>
            <span class="badge">${ab.noVid ? 'No video' : 'Video'}</span>
          </div>
        </div>

        ${videoHtml}

        <div id="moduleContent">${content}</div>

        <section class="card">
          <h2>Next</h2>
          <div class="row">
            <button class="btn" onclick="location.hash='#/module/${Math.min(10, mid+1)}'">Next module →</button>
            <button class="btn secondary" onclick="location.hash='#/home'">Back to modules</button>
          </div>
          <p class="small muted" style="margin-top:10px">A/B group is fixed per device for clean testing.</p>
        </section>
      </div>
    `));

    
    window.ayikhoTrack && window.ayikhoTrack('moduleOpen', { moduleId: mid });
  }


  function renderProgress(){
    setActiveNav('progress');
    const app = document.getElementById('app');
    const events = JSON.parse(localStorage.getItem('ayikho_events_v2') || '[]');
    const ab = getAB();
    // basic module opens count
    const opens = {};
    events.filter(e=>e.type==='moduleOpen').forEach(e=>{
      const k = String(e.moduleId||'');
      if (!k) return;
      opens[k] = (opens[k]||0)+1;
    });

    app.innerHTML = '';
    app.appendChild(el(`
      <div class="page">
        <div class="hdrRow">
          <div>
            <div class="kicker" style="font-family:JetBrains Mono,monospace;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--dim)">Your Progress</div>
            <div style="font-size:22px;font-weight:900;color:var(--ink);margin-top:6px">Study summary</div>
            <div class="small" style="margin-top:8px">A/B group is stored per device for clean testing.</div>
          </div>
          <div class="badges">
            <span class="badgeMini">AB: ${ab.group || '?'}</span>
            <span class="badgeMini">${ab.simple ? 'Simple' : 'Detail'}</span>
            <span class="badgeMini">${ab.noVid ? 'No‑video' : 'Video'}</span>
          </div>
        </div>

        <div style="height:14px"></div>

        <div class="cardA">
          <h2>Events on this device</h2>
          <p>${events.length} total events stored locally (prototype mode).</p>
          <div style="height:12px"></div>
          <div class="chip">Tip: use Firebase later for real analytics</div>
        </div>

        <div style="height:14px"></div>

        <div class="cardA">
          <h2>Module opens</h2>
          <p class="small">How often each module was opened on this device.</p>
          <div style="height:12px"></div>
          <div class="list">
            ${[1,2,3,4,5,6,7,8,9,10].map(i=>`<div class="chip">Module ${i}: <strong>${opens[String(i)]||0}</strong></div>`).join('')}
          </div>
          <div style="height:14px"></div>
          <button class="btnDanger" onclick="localStorage.removeItem('ayikho_events_v2');location.reload()">Clear device events</button>
        </div>
      </div>
    `));
  }

  function renderBadges(){
    setActiveNav('badges');
    const app = document.getElementById('app');
    app.innerHTML = '';
    app.appendChild(el(`
      <div class="page">
        <div class="cardA">
          <h2>Badges (coming soon)</h2>
          <p>Next step: award badges for streaks, quiz scores, and completing past papers.</p>
        </div>
      </div>
    `));
  }

  function renderProfile(){
    setActiveNav('profile');
    const app = document.getElementById('app');
    const ab = getAB();
    const name = (state.profile && state.profile.name) ? state.profile.name : '';
    app.innerHTML = '';
    app.appendChild(el(`
      <div class="page">
        <div class="cardA">
          <h2>Your profile</h2>
          <p class="small">This is stored on this device (prototype mode).</p>
          <div style="height:12px"></div>
          <label class="small">First name</label>
          <div style="height:6px"></div>
          <input id="nameInput" class="input" value="${name}" placeholder="e.g., Zandile" />
          <div style="height:12px"></div>
          <button class="btnPrimary" id="saveProfileBtn">Save</button>
        </div>

        <div style="height:14px"></div>

        <div class="cardA">
          <h2>A/B test (debug)</h2>
          <p class="small">Group is fixed per device unless you reset.</p>
          <div style="height:10px"></div>
          <div class="list">
            <div class="chip">Group: <strong>${ab.group || '?'}</strong></div>
            <div class="chip">Mode: <strong>${ab.simple ? 'Simple' : 'Detail'}</strong></div>
            <div class="chip">Video: <strong>${ab.noVid ? 'No‑video' : 'Video'}</strong></div>
          </div>
          <div style="height:12px"></div>
          <button class="btnDanger" id="resetABBtn">Reset A/B assignment</button>
        </div>

        <div style="height:14px"></div>

        <div class="cardA">
          <h2>WhatsApp reminders</h2>
          <p><strong>Coming soon.</strong> For now, use phone alarms for your study time.</p>
        </div>
      </div>
    `));

    document.getElementById('saveProfileBtn').onclick = () => {
      const n = document.getElementById('nameInput').value.trim();
      state.profile = { ...state.profile, name: n };
      saveProfile();
      window.ayikhoTrack && window.ayikhoTrack('profileSave', { nameProvided: !!n });
      location.hash = '#/home';
    };

    document.getElementById('resetABBtn').onclick = () => {
      localStorage.removeItem('ayikho_ab_v2');
      location.reload();
    };
  }
  function renderData(){
    setActiveNav('data');
    const app = document.getElementById('app');
    const events = JSON.parse(localStorage.getItem('ayikho_events_v2') || '[]');
    const ab = getAB();
    app.innerHTML = '';
    app.appendChild(el(`
      <div class="container">
        <h1>Device data (debug)</h1>
        <section class="card">
          <h2>A/B assignment</h2>
          <pre class="code">${JSON.stringify(ab, null, 2)}</pre>
        </section>
        <section class="card">
          <h2>Events (${events.length})</h2>
          <p class="muted">Stored locally in this prototype build.</p>
          <pre class="code" style="max-height:340px">${JSON.stringify(events.slice(-50), null, 2)}</pre>
          <div class="row" style="margin-top:12px">
            <button class="btn danger" onclick="localStorage.removeItem('ayikho_events_v2');location.reload()">Clear events</button>
          </div>
        </section>
      </div>
    `));
    
  }

  // bootstrap
  window.addEventListener('hashchange', route);
  document.addEventListener('DOMContentLoaded', () => {
    // load profile
    try { state.profile = JSON.parse(localStorage.getItem('ayikho_profile_v2')||'{}'); } catch(e){}
    
    route();
  });
})();
