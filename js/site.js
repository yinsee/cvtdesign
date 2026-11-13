/* CampervanTours static site runtime: tiny DCLogic shim on top of Alpine.js */
window.DC = {};
class DCLogic {
  constructor(props) { this.props = props || {}; this.state = {}; }
  setState(patch) {
    const prev = Object.assign({}, this.state);
    const next = typeof patch === 'function' ? patch(this.state, this.props) : patch;
    this.state = Object.assign({}, this.state, next);
    if (this.__refresh) this.__refresh();
    queueMicrotask(() => { if (this.componentDidUpdate) this.componentDidUpdate(this.props, prev); });
  }
  forceUpdate() { if (this.__refresh) this.__refresh(); }
}
window.dc = function (name, props) {
  const inst = new DC[name](props || {});
  return {
    tick: 0,
    get V() { this.tick; return inst.renderVals(); },
    init() { const self = this; inst.__refresh = () => { self.tick++; }; if (inst.componentDidMount) inst.componentDidMount(); },
    destroy() { if (inst.componentWillUnmount) inst.componentWillUnmount(); }
  };
};
DC["Main"] = (function () {

class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.state = { playing: true };
    this.videos = [];
  }
  renderVals() {
    const setup = (el) => {
      if (!el) return;
      el.muted = true; el.loop = true; el.playsInline = true;
      if (!this.videos.includes(el)) this.videos.push(el);
      if (this.state.playing) { const p = el.play(); if (p && p.catch) p.catch(() => {}); }
    };
    const featured = [
      { name: 'VW T5 Spacious', tag: 'Pop-top · 4 berth', spec: 'Automatic · Double bed · Kitchen', img: 'assets/v-t5-spacious.jpg', alt: 'Grey VW T5 campervan with pop-top raised at sunset' },
      { name: 'Toleno R', tag: 'Two double beds', spec: 'Manual · Bathroom · Dining', img: 'assets/v-toleno.jpg', alt: 'White Toleno R campervan on a woodland road' },
      { name: 'VW Crafter LWB', tag: 'Room for four', spec: 'Automatic · Bathroom · Kitchen', img: 'assets/v-crafter-auto.jpg', alt: 'White VW Crafter campervan above a beach' },
      { name: 'MAN TGE MWB', tag: 'Extra-wide bed', spec: 'Automatic · Bathroom · 2 berth', img: 'assets/v-man-mwb.jpg', alt: 'Grey MAN TGE campervan parked in farmland' }
    ];
    const routes = [
      { name: 'North Coast 500', region: 'Scotland', line: 'Mountain roads and wild coastline', img: 'assets/nc500.jpg', alt: 'Kylesku Bridge over a Highland loch' },
      { name: 'Snowdonia & Castles', region: 'Wales', line: 'Mountains, waterfalls, great castles', img: 'assets/wales.jpg', alt: 'Caernarfon Castle lit at sunset' },
      { name: 'York & the Moors', region: 'Yorkshire', line: 'Abbeys, moorland and coast', img: 'assets/whitby.jpg', alt: 'Whitby Abbey ruins under a blue sky' },
      { name: 'Cornwall', region: 'South West', line: 'Fishing villages and rocky coves', img: 'assets/cornwall.jpg', alt: 'Red hot pokers above a Cornish cove' },
      { name: 'Causeway Coast', region: 'Northern Ireland', line: 'Natural wonders and castles', img: 'assets/causeway.jpg', alt: 'Basalt columns of the Giant’s Causeway' },
      { name: 'Edinburgh & Loch Ness', region: 'Scotland', line: 'Castles, lochs and Highlands', img: 'assets/edinburgh.jpg', alt: 'Edinburgh skyline from Calton Hill' }
    ];
    return {
      heroRef: setup,
      insideRef: setup,
      playing: this.state.playing,
      paused: !this.state.playing,
      videoLabel: this.state.playing ? 'Pause background film' : 'Play background film',
      toggleVideo: () => {
        const next = !this.state.playing;
        this.videos.forEach((v) => { try { next ? v.play() : v.pause(); } catch (e) {} });
        this.setState({ playing: next });
      },
      featured,
      routes
    };
  }
}

return Component;
})();

DC["Campervans"] = (function () {

class Component extends DCLogic {
  constructor(props) { super(props); this.state = { filter: 'all' }; }
  renderVals() {
    const VANS = [
      { name: 'MAN TGE LWB Luxury', berth: 2, gear: 'Automatic', bathroom: true, roof: 'Fixed roof', badge: 'Luxury', features: 'North–south double bed, kitchen and bathroom.', img: 'assets/v-man-lwb-auto.jpg', alt: 'Grey MAN TGE campervan in front of snowy mountains' },
      { name: 'MAN TGE LWB Luxury', berth: 2, gear: 'Manual', bathroom: true, roof: 'Fixed roof', badge: 'Luxury', features: 'Extra-plush double bed, bathroom, kitchen and generous living space.', img: 'assets/v-man-lwb-manual.jpg', alt: 'Grey MAN TGE campervan parked by trees' },
      { name: 'MAN TGE MWB', berth: 2, gear: 'Automatic', bathroom: true, roof: 'Fixed roof', badge: 'Premium', features: 'Extra-wide bed, bathroom and kitchen. Easier to park.', img: 'assets/v-man-mwb.jpg', alt: 'Grey MAN TGE campervan in farmland' },
      { name: 'VW Crafter LWB', berth: 4, gear: 'Automatic', bathroom: true, roof: 'Fixed roof', badge: 'Premium', features: 'Two beds, bathroom, kitchen and dining area.', img: 'assets/v-crafter-auto.jpg', alt: 'White VW Crafter campervan above a beach' },
      { name: 'VW Crafter LWB', berth: 4, gear: 'Manual', bathroom: true, roof: 'Fixed roof', badge: '', features: 'Bathroom, kitchen, dining area and TV. Room to spread out.', img: 'assets/v-crafter-manual.jpg', alt: 'Silver VW Crafter campervan among olive trees' },
      { name: 'Toleno R', berth: 4, gear: 'Manual', bathroom: true, roof: 'Fixed roof', badge: 'Premium', features: 'Two double beds, bathroom, kitchen, dining area and TV.', img: 'assets/v-toleno.jpg', alt: 'White Toleno R campervan on a woodland road' },
      { name: 'VW T5 Spacious', berth: 4, gear: 'Automatic', bathroom: false, roof: 'Pop-top', badge: '', features: 'Pop-top roof, double bed, kitchen and microwave.', img: 'assets/v-t5-spacious.jpg', alt: 'Grey VW T5 campervan with pop-top raised' },
      { name: 'VW T5 Wide Bed', berth: 4, gear: 'Automatic', bathroom: false, roof: 'Pop-top', badge: '', features: 'Pop-top roof, side kitchen and a wide double bed.', img: 'assets/v-t5-widebed.jpg', alt: 'Silver VW T5 campervan with pop-top on a country lane' },
      { name: 'VW T5 Compact', berth: 4, gear: 'Automatic', bathroom: false, roof: 'Pop-top', badge: '', features: 'Pop-top, side kitchen and double bed. Nimble on country lanes.', img: 'assets/v-t5-compact.jpg', alt: 'White VW T5 campervan on a clifftop campsite' }
    ].map((v) => ({ ...v, premium: !!v.badge, gearShort: v.gear === 'Automatic' ? 'Auto' : 'Manual', bathShort: v.bathroom ? 'Yes' : 'No' }));
    const FILTERS = [
      { id: 'all', label: 'All campervans', test: () => true },
      { id: 'two', label: '2 berth', test: (v) => v.berth === 2 },
      { id: 'four', label: '4 berth', test: (v) => v.berth === 4 },
      { id: 'auto', label: 'Automatic', test: (v) => v.gear === 'Automatic' },
      { id: 'bath', label: 'With bathroom', test: (v) => v.bathroom }
    ];
    const on = 'min-h-[52px] shrink-0 rounded-full border-2 border-plum bg-plum px-6 text-[17px] font-bold text-white';
    const off = 'min-h-[52px] shrink-0 rounded-full border-2 border-plum/20 bg-white px-6 text-[17px] font-bold text-plum hover:border-plum';
    const active = FILTERS.find((f) => f.id === this.state.filter) || FILTERS[0];
    const vans = VANS.filter(active.test);
    return {
      filters: FILTERS.map((f) => ({ label: f.label, pressed: f.id === active.id ? 'true' : 'false', cls: f.id === active.id ? on : off, pick: () => this.setState({ filter: f.id }) })),
      vans,
      all: VANS,
      count: vans.length,
      total: VANS.length
    };
  }
}

return Component;
})();

DC["Van"] = (function () {

class Component extends DCLogic {
  constructor(props) { super(props); this.state = { i: 0, playing: true }; this.video = null; }
  renderVals() {
    const PHOTOS = [
      { src: 'assets/v-man-lwb-auto.jpg', alt: 'MAN TGE campervan in front of snowy mountains' },
      { src: 'assets/man-cab-golden.jpg', alt: 'Cab and front seats at golden hour' },
      { src: 'assets/man-interior.jpg', alt: 'Bed and kitchen inside the campervan' },
      { src: 'assets/man-cab.jpg', alt: 'Dashboard, steering wheel and navigation screen' },
      { src: 'assets/man-rear.jpg', alt: 'Rear view of the campervan on a country lane' }
    ];
    const on = 'h-20 w-28 shrink-0 overflow-hidden rounded-xl ring-4 ring-brand sm:h-24 sm:w-36';
    const off = 'h-20 w-28 shrink-0 overflow-hidden rounded-xl opacity-80 ring-1 ring-plum/10 hover:opacity-100 sm:h-24 sm:w-36';
    const i = this.state.i;
    return {
      photo: PHOTOS[i],
      photoIndex: i + 1,
      photoCount: PHOTOS.length,
      thumbs: PHOTOS.map((p, k) => ({ src: p.src, label: 'Show photo ' + (k + 1) + ': ' + p.alt, pressed: k === i ? 'true' : 'false', cls: k === i ? on : off, pick: () => this.setState({ i: k }) })),
      videoRef: (el) => { if (!el) return; this.video = el; el.muted = true; el.loop = true; el.playsInline = true; if (this.state.playing) { const p = el.play(); if (p && p.catch) p.catch(() => {}); } },
      videoLabel: this.state.playing ? 'Pause film' : 'Play film',
      videoText: this.state.playing ? 'Pause' : 'Play',
      toggleVideo: () => { const next = !this.state.playing; try { next ? this.video.play() : this.video.pause(); } catch (e) {} this.setState({ playing: next }); }
    };
  }
}

return Component;
})();

DC["Routes"] = (function () {

class Component extends DCLogic {
  constructor(props) { super(props); this.state = { region: 'all' }; }
  renderVals() {
    const ROUTES = [
      { name: 'North Coast 500 & Orkney', r: 'scotland', region: 'Scotland', line: 'Mountain roads, dramatic coast, ocean views.', img: 'assets/nc500.jpg', alt: 'Kylesku Bridge over a Highland loch' },
      { name: 'Hebridean Island Hopping', r: 'scotland', region: 'Scotland', line: 'Wild islands, history and whisky.', img: 'assets/hebrides.jpg', alt: 'Hebridean beach with dune grass' },
      { name: 'Edinburgh, Loch Ness & the Highlands', r: 'scotland', region: 'Scotland', line: 'Lochs, castles and waterfalls.', img: 'assets/edinburgh.jpg', alt: 'Edinburgh at sunrise' },
      { name: 'North Wales, Snowdonia, Castles & Coast', r: 'wales', region: 'Wales', line: 'Mountains, waterfalls and great castles.', img: 'assets/wales.jpg', alt: 'Caernarfon Castle lit at dusk' },
      { name: 'The Lake District Meres & Mountains', r: 'england', region: 'England', line: 'Lakes, hidden valleys, stone villages.', img: 'assets/lakes.jpg', alt: 'Windermere jetty at sunset' },
      { name: 'York & the North York Moors', r: 'england', region: 'England', line: 'Moorland, abbeys and coastline.', img: 'assets/whitby.jpg', alt: 'Whitby Abbey' },
      { name: 'The Cotswolds Villages & Gardens', r: 'england', region: 'England', line: 'Honey-stone villages and gardens.', img: 'assets/cotswolds.jpg', alt: 'Cotswold cottages by a stream' },
      { name: 'Cornwall', r: 'england', region: 'England', line: 'Fishing villages and rocky coves.', img: 'assets/cornwall.jpg', alt: 'Flowers above a Cornish cove' },
      { name: 'Dorset & the Jurassic Coast', r: 'england', region: 'England', line: 'Prehistoric sites and coastal walks.', img: 'assets/durdle.jpg', alt: 'Durdle Door' },
      { name: 'Northern Ireland: Coast & Castles', r: 'ireland', region: 'Northern Ireland', line: 'Natural wonders and emerald hills.', img: 'assets/causeway.jpg', alt: 'Giant’s Causeway' },
      { name: 'Belgium: Medieval Towns & the Great War', r: 'europe', region: 'Europe', line: 'Canals, battlefields, Belgian beer.', img: 'assets/bruges.jpg', alt: 'Bruges market square at dusk' }
    ];
    const MORE = [
      ['The Road to the Isles', 'Scotland'], ["Scotland's West Coast", 'Scotland'], ['Scottish Borders', 'Scotland'],
      ['Pembrokeshire Coast & Gower', 'Wales'], ['Bristol, Cardiff & South East Wales', 'Wales'], ['The Yorkshire Dales', 'England'],
      ['Peak District: The White Peak', 'England'], ['Peak District: The Dark Peak', 'England'], ['Ancient Wessex: Stones & Bones', 'England'],
      ['Bath & the Mendips', 'England'], ['New Forest & the Isle of Wight', 'England'], ['Devon', 'England'],
      ['Kent, the Garden of England', 'England'], ['Downton Abbey locations', 'England'], ['Bridgerton locations', 'England'],
      ['Cambridgeshire & Norfolk', 'England'], ['Norfolk Broads & Suffolk', 'England'], ['Oxford & the Cotswolds', 'England'],
      ['The Heart of England', 'England']
    ].map(([name, region]) => ({ name, region }));
    const FILTERS = [['all', 'All'], ['scotland', 'Scotland'], ['england', 'England'], ['wales', 'Wales'], ['ireland', 'Northern Ireland'], ['europe', 'Europe']];
    const on = 'min-h-[52px] shrink-0 rounded-full border-2 border-plum bg-plum px-6 text-[17px] font-bold text-white';
    const off = 'min-h-[52px] shrink-0 rounded-full border-2 border-plum/20 bg-white px-6 text-[17px] font-bold text-plum hover:border-plum';
    const reg = this.state.region;
    return {
      filters: FILTERS.map(([id, label]) => ({ label, pressed: id === reg ? 'true' : 'false', cls: id === reg ? on : off, pick: () => this.setState({ region: id }) })),
      routes: ROUTES.filter((x) => reg === 'all' || x.r === reg),
      more: MORE
    };
  }
}

return Component;
})();

DC["Europe"] = (function () {

class Component extends DCLogic {
  renderVals() { return {}; }
}

return Component;
})();

DC["Overseas"] = (function () {

class Component extends DCLogic {
  constructor(props) { super(props); this.state = { origin: 'au', faq: 0 }; }
  renderVals() {
    const O = {
      au: { label: 'Australia', kicker: 'Flying in from Australia', title: 'Good news: you already drive on the left.', img: 'assets/nc500.jpg', points: [
        'Australian licences held for 2+ years are accepted.',
        'Land at Heathrow or Stansted; on 30+ day hires we collect you free.',
        'Bedding and towels for two, and your luggage stored while you tour.',
        'Our June–August summer has long, light evenings.' ] },
      nz: { label: 'New Zealand', kicker: 'Flying in from New Zealand', title: 'Same side of the road. Longer summer evenings.', img: 'assets/lakes.jpg', points: [
        'New Zealand licences held for 2+ years are accepted.',
        'Free transfer from Heathrow or Stansted on hires of 30 days or more.',
        'Bedding and towels for two, and safe storage for your suitcases.',
        'Free self-drive routes, plus personal campsite advice.' ] },
      eu: { label: 'Europe', kicker: 'Coming from Europe', title: 'New to driving on the left? Choose an automatic.', img: 'assets/cotswolds.jpg', points: [
        'EU licences held for 2+ years are accepted.',
        'Plenty of automatic vans to choose from.',
        'Fly into Stansted or Heathrow; Cambridge is a short transfer away.',
        'Tour Britain, then cross back to the Continent in the same van.' ] },
      uk: { label: 'Already in the UK', kicker: 'Starting from home', title: 'Collect in Cambridge from 10am.', img: 'assets/wales.jpg', points: [
        'Our depot is open Monday to Saturday (closed Sundays).',
        'A £200 deposit holds your dates.',
        'Insurance for two drivers is included as standard.',
        'Ask for one of our free self-drive routes.' ] }
    };
    const order = ['au', 'nz', 'eu', 'uk'];
    const on = 'min-h-[60px] rounded-2xl border-2 border-plum bg-plum px-4 text-left text-[18px] font-bold text-white';
    const off = 'min-h-[60px] rounded-2xl border-2 border-plum/15 bg-white px-4 text-left text-[18px] font-bold text-plum hover:border-plum';
    const FAQ = [
      ['Can I drive on my Australian or New Zealand licence?', 'Yes. Licences from Australia, New Zealand, the UK, the EU, the USA and Canada are accepted if you have held them for at least two years.'],
      ['Is there an upper age limit?', 'Drivers aged 23 to 79 are welcome. If you have any driving convictions, we refer them to our insurers for approval.'],
      ['Which airports do you collect from?', 'On hires of 30 days or more, transfers from Heathrow and Stansted to our Cambridge depot are free. Other airports and cruise ports are possible for a supplement.'],
      ['What happens to my suitcases?', 'We store your luggage at the depot while you travel, as part of the Overseas Visitors Package.'],
      ['What if travel rules change and I can’t come?', 'If government travel rules prevent you from travelling, you can change or cancel your booking free of charge.']
    ];
    return {
      origins: order.map((k) => ({ label: O[k].label, pressed: this.state.origin === k ? 'true' : 'false', cls: this.state.origin === k ? on : off, pick: () => this.setState({ origin: k }) })),
      origin: O[this.state.origin],
      faqs: FAQ.map(([q, a], i) => ({ q, a, open: this.state.faq === i, expanded: this.state.faq === i ? 'true' : 'false', sign: this.state.faq === i ? '−' : '+', toggle: () => this.setState({ faq: this.state.faq === i ? -1 : i }) }))
    };
  }
}

return Component;
})();

DC["Prices"] = (function () {

class Component extends DCLogic {
  renderVals() { return { groups: ['A', 'B', 'C', 'D', 'E', 'F'] }; }
}

return Component;
})();

DC["Contact"] = (function () {

class Component extends DCLogic {
  renderVals() { return {}; }
}

return Component;
})();

DC["Header"] = (function () {

class Component extends DCLogic {
  constructor(props) { super(props); this.state = { open: false }; }
  renderVals() {
    const active = this.props.active ?? 'home';
    const items = [
      ['vans', 'Campervans', 'campervans.html'],
      ['routes', 'Routes', 'routes.html'],
      ['europe', 'Into Europe', 'europe.html'],
      ['overseas', 'Flying in', 'overseas-visitors.html'],
      ['prices', 'Prices', 'prices.html'],
      ['contact', 'Contact', 'contact.html']
    ];
    const on = 'inline-flex min-h-[48px] items-center rounded-full bg-plum-light px-4 text-[17px] font-bold text-plum';
    const off = 'inline-flex min-h-[48px] items-center rounded-full px-4 text-[17px] font-bold text-ink hover:bg-plum-tint hover:text-plum';
    const links = items.map(([id, label, href]) => ({ label, href, current: id === active ? 'page' : 'false', cls: id === active ? on : off }));
    return {
      links,
      open: this.state.open,
      closed: !this.state.open,
      expanded: this.state.open ? 'true' : 'false',
      toggle: () => this.setState({ open: !this.state.open })
    };
  }
}

return Component;
})();

DC["Footer"] = (function () {

class Component extends DCLogic {
  renderVals() { return {}; }
}

return Component;
})();

DC["Van3D"] = (function () {

const VAN_SPECS = {
  'man-lwb-auto':   { name: 'MAN TGE LWB Luxury · Automatic', L: 6.84, W: 2.04, H: 2.6, kind: 'high', paint: '#3d4046', layout: 'northsouth', bath: true, rearAxle: 1.75, doors: 'barn' },
  'man-lwb-manual': { name: 'MAN TGE LWB Luxury · Manual', L: 6.84, W: 2.04, H: 2.6, kind: 'high', paint: '#34373c', layout: 'transverse', bedDepth: 1.5, bath: true, rearAxle: 1.75, doors: 'barn' },
  'man-mwb':        { name: 'MAN TGE MWB · 2 berth', L: 5.99, W: 2.04, H: 2.6, kind: 'high', paint: '#4a4d53', layout: 'transverse', bedDepth: 1.6, bath: true, rearAxle: 1.15, doors: 'barn' },
  'crafter-auto':   { name: 'VW Crafter LWB · Automatic', L: 6.84, W: 2.04, H: 2.6, kind: 'high', paint: '#eeeeec', layout: 'transverse', bedDepth: 1.4, bath: true, dinette: true, rearAxle: 1.75, doors: 'barn' },
  'crafter-manual': { name: 'VW Crafter LWB · Manual', L: 6.84, W: 2.04, H: 2.6, kind: 'high', paint: '#bfc2c6', layout: 'transverse', bedDepth: 1.4, bath: true, dinette: true, rearAxle: 1.75, doors: 'barn' },
  'toleno':         { name: 'Toleno R · 4 berth', L: 6.36, W: 2.05, H: 2.62, kind: 'high', paint: '#f4f4f2', stripes: true, layout: 'transverse', bedDepth: 1.45, bath: true, dinette: true, rearAxle: 1.5, doors: 'barn' },
  't5-spacious':    { name: 'VW T5 Spacious · Pop-top', L: 4.9, W: 1.9, H: 1.97, kind: 'pop', paint: '#4f545b', layout: 'rockroll', bath: false, rearAxle: 1.0, doors: 'tailgate' },
  't5-widebed':     { name: 'VW T5 Wide Bed · Pop-top', L: 4.9, W: 1.9, H: 1.97, kind: 'pop', paint: '#b3b7bd', layout: 'rockroll', wideBed: true, bath: false, rearAxle: 1.0, doors: 'tailgate' },
  't5-compact':     { name: 'VW T5 Compact · Pop-top', L: 4.9, W: 1.9, H: 1.97, kind: 'pop', paint: '#efefed', layout: 'rockroll', bath: false, rearAxle: 1.0, doors: 'tailgate' }
};
const VAN_ORDER = ['man-lwb-auto', 'man-lwb-manual', 'man-mwb', 'crafter-auto', 'crafter-manual', 'toleno', 't5-spacious', 't5-widebed', 't5-compact'];
const VIEWS = [
  ['outside', 'Walk around'],
  ['drive', 'On the road'],
  ['driver', "Driver's seat"],
  ['passenger', 'Passenger seat'],
  ['living', 'Living area'],
  ['bed', 'Lying in bed']
];
const SKY = { top: '#4f79ad', horizon: '#f0d7b8', bottom: '#b9ad97', sun: [0.62, 0.32, -0.25] };

// ---------- small procedural helpers (no images needed)
function hash2(x, y) { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); }
function vnoise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash2(xi, yi), b = hash2(xi + 1, yi), c = hash2(xi, yi + 1), d = hash2(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function fbm(x, y, o) { let s = 0, a = 0.5, f = 1; for (let i = 0; i < (o || 4); i++) { s += a * vnoise(x * f, y * f); f *= 2; a *= 0.5; } return s; }
function dataTex(T, size, fn, rx, ry) {
  const d = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const c = fn(x / size, y / size), i = (y * size + x) * 4;
    d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2]; d[i + 3] = c.length > 3 ? c[3] : 255;
  }
  const t = new T.DataTexture(d, size, size);
  t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(rx || 1, ry || 1);
  t.magFilter = T.LinearFilter; t.minFilter = T.LinearMipmapLinearFilter; t.generateMipmaps = true;
  t.colorSpace = T.SRGBColorSpace; t.anisotropy = 8; t.needsUpdate = true;
  return t;
}
function rboxGeo(T, w, h, d, r) {
  r = Math.max(0.002, Math.min(r, w / 2 - 0.002, h / 2 - 0.002, d / 2 - 0.002));
  const iw = w - 2 * r, ih = h - 2 * r, c = Math.min(iw, ih) * 0.25;
  const s = new T.Shape(), x = -iw / 2, y = -ih / 2;
  s.moveTo(x + c, y); s.lineTo(x + iw - c, y); s.quadraticCurveTo(x + iw, y, x + iw, y + c); s.lineTo(x + iw, y + ih - c);
  s.quadraticCurveTo(x + iw, y + ih, x + iw - c, y + ih); s.lineTo(x + c, y + ih); s.quadraticCurveTo(x, y + ih, x, y + ih - c); s.lineTo(x, y + c); s.quadraticCurveTo(x, y, x + c, y);
  const g = new T.ExtrudeGeometry(s, { depth: Math.max(0.001, d - 2 * r), bevelEnabled: true, bevelThickness: r, bevelSize: r, bevelSegments: 3, curveSegments: 4 });
  g.translate(0, 0, -(d - 2 * r) / 2);
  return g;
}

// ---------- the van
function buildVan(T, c) {
  const g = new T.Group();
  const mats = [], texs = [];
  const P = (o) => { const m = new T.MeshPhysicalMaterial(o); mats.push(m); return m; };
  const S = (o) => { const m = new T.MeshStandardMaterial(o); mats.push(m); return m; };
  const woodTex = dataTex(T, 256, (u, v) => {
    const n = fbm(u * 4, v * 40, 3), grain = 0.5 + 0.5 * Math.sin((v * 90 + n * 9));
    const k = 0.84 + 0.12 * grain + 0.06 * (n - 0.5);
    return [Math.min(255, 214 * k), Math.min(255, 178 * k), Math.min(255, 136 * k)];
  }, 1, 1); texs.push(woodTex);
  const floorTex = dataTex(T, 256, (u, v) => {
    const plank = Math.floor(u * 4), seam = (u * 4 - plank) < 0.02 ? 0.6 : 1;
    const n = fbm(u * 6 + plank * 3.1, v * 30, 3), k = (0.78 + 0.2 * n) * seam * (0.92 + 0.08 * hash2(plank, 2));
    return [150 * k, 122 * k, 96 * k];
  }, 1, 3); texs.push(floorTex);

  const paint = P({ color: c.paint, metalness: 0.45, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.05 });
  const plastic = S({ color: '#1b1c1f', roughness: 0.78 });
  const satin = S({ color: '#2a2c30', roughness: 0.45, metalness: 0.2 });
  const chrome = S({ color: '#dfe3e8', roughness: 0.15, metalness: 1 });
  const tyreM = S({ color: '#141416', roughness: 0.92 });
  const rimM = S({ color: '#c5c9cf', roughness: 0.25, metalness: 0.95 });
  const glassSide = P({ color: '#0f151b', metalness: 0.1, roughness: 0.04, transparent: true, opacity: 0.6, side: T.DoubleSide, depthWrite: false, envMapIntensity: 1.6 });
  const glassFront = P({ color: '#30404c', metalness: 0.05, roughness: 0.03, transparent: true, opacity: 0.22, side: T.DoubleSide, depthWrite: false, envMapIntensity: 1.4 });
  const headM = P({ color: '#e8eef4', roughness: 0.05, metalness: 0.2, clearcoat: 1, emissive: '#d8e8ff', emissiveIntensity: 0.55 });
  const drlM = S({ color: '#ffffff', emissive: '#ffffff', emissiveIntensity: 2.5 });
  const tailM = P({ color: '#9c1022', roughness: 0.1, clearcoat: 1, emissive: '#6a0a16', emissiveIntensity: 0.9 });
  const plateM = S({ color: '#f2f2ee', roughness: 0.5 });
  const lining = S({ color: '#d9d4ca', roughness: 0.95 });
  const ceiling = S({ color: '#efebe4', roughness: 0.9 });
  const wood = S({ color: '#ffffff', map: woodTex, roughness: 0.55 });
  const floorM = S({ color: '#ffffff', map: floorTex, roughness: 0.65 });
  const worktop = S({ color: '#26272b', roughness: 0.22, metalness: 0.15 });
  const fabric = P({ color: '#3a3f49', roughness: 1, sheen: 0.6, sheenColor: '#8c94a3', sheenRoughness: 0.8 });
  const sheet = P({ color: '#f2efe9', roughness: 1, sheen: 0.4, sheenColor: '#ffffff' });
  const duvet = P({ color: '#2d4b84', roughness: 1, sheen: 0.7, sheenColor: '#7f9bd0' });
  const throwM = P({ color: '#b02e46', roughness: 1, sheen: 0.6, sheenColor: '#e07a8c' });
  const white = S({ color: '#f5f5f3', roughness: 0.4 });
  const steel = S({ color: '#cfd3d8', roughness: 0.22, metalness: 0.9 });
  const canvasM = P({ color: '#5f5a54', roughness: 1, sheen: 0.4, sheenColor: '#9a948c', side: T.DoubleSide });
  const lampM = S({ color: '#fff4dd', emissive: '#ffe9c4', emissiveIntensity: 3 });
  const ledM = S({ color: '#ffe2b0', emissive: '#ffcf8a', emissiveIntensity: 2.2 });
  const screenM = S({ color: '#0b1220', emissive: '#1d3d66', emissiveIntensity: 0.9, roughness: 0.2 });
  const solarM = P({ color: '#15213b', metalness: 0.4, roughness: 0.15, clearcoat: 1 });
  const awningM = S({ color: '#a7acb2', roughness: 0.35, metalness: 0.6 });
  const stripeA = P({ color: '#b5233a', roughness: 0.3, clearcoat: 1 });
  const stripeB = P({ color: '#2b2d33', roughness: 0.3, clearcoat: 1 });

  const add = (geo, mat, x, y, z, parent) => { const m = new T.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; (parent || g).add(m); return m; };
  const box = (w, h, d, mat, x, y, z, parent) => add(new T.BoxGeometry(w, h, d), mat, x, y, z, parent);
  const rbox = (w, h, d, r, mat, x, y, z, parent) => add(rboxGeo(T, w, h, d, r), mat, x, y, z, parent);
  const noShadow = (m) => { m.castShadow = false; return m; };

  const L = c.L, W = c.W, H = c.H, half = L / 2, rearZ = -half;
  const pop = c.kind === 'pop';
  const rr = pop ? 0.1 : 0.17;
  const sillY = 0.34, floorY = 0.56, wheelR = pop ? 0.34 : 0.37;
  const bonnetLen = pop ? 0.66 : 0.82, bonnetH = pop ? 1.04 : 1.12;
  const wsBaseZ = half - bonnetLen;
  const wsTopY = pop ? H - 0.1 : 2.04;
  const wsRun = pop ? 0.66 : 0.8;
  const wsTopZ = wsBaseZ - wsRun;
  const capRun = pop ? 0.04 : 0.46;
  const roofFrontZ = wsTopZ - capRun;
  const fAx = half - (pop ? 0.82 : 0.92);
  const rAx = rearZ + c.rearAxle;
  const archR = wheelR + 0.07, archY = sillY + 0.02;
  const cabDoorRear = wsBaseZ - (pop ? 0.95 : 1.02);
  const topY = H - rr;
  const lerp2 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

  // --- side profile with wheel arches
  const outline = () => {
    const s = new T.Shape();
    s.moveTo(rearZ, archY);
    s.lineTo(rAx - archR, archY);
    s.absarc(rAx, archY, archR, Math.PI, 0, true);
    s.lineTo(fAx - archR, archY);
    s.absarc(fAx, archY, archR, Math.PI, 0, true);
    s.lineTo(half - 0.05, archY);
    s.lineTo(half, bonnetH - 0.2);
    s.quadraticCurveTo(half, bonnetH - 0.02, half - 0.24, bonnetH);
    s.lineTo(wsBaseZ, bonnetH);
    s.lineTo(wsTopZ, Math.min(wsTopY, topY));
    if (!pop) s.quadraticCurveTo(wsTopZ - 0.08, topY, roofFrontZ, topY); else s.lineTo(roofFrontZ, topY);
    s.lineTo(rearZ + 0.06, topY);
    s.quadraticCurveTo(rearZ, topY, rearZ, topY - 0.06);
    s.lineTo(rearZ, archY);
    return s;
  };
  const rect = (z0, z1, y0, y1) => [[z0, y0], [z1, y0], [z1, y1], [z0, y1]];
  const cabWin = () => {
    const a = [wsBaseZ, bonnetH], b = [wsTopZ, Math.min(wsTopY, topY)];
    const p1 = lerp2(a, b, 0.16), p2 = lerp2(a, b, 0.84);
    const top = Math.min(p2[1], topY - 0.1);
    return [[cabDoorRear + 0.08, bonnetH + 0.15], [p1[0] - 0.11, bonnetH + 0.15], [p2[0] - 0.11, top], [cabDoorRear + 0.08, top]];
  };
  const winY0 = pop ? 1.12 : 1.3, winY1 = pop ? 1.6 : 1.84;
  const livingWins = (side) => {
    const w = [];
    if (pop) { w.push(rect(rearZ + 0.45, cabDoorRear - 0.12, winY0, winY1)); return w; }
    const mid = (rearZ + cabDoorRear) / 2;
    if (side > 0) w.push(rect(cabDoorRear - 1.05, cabDoorRear - 0.2, winY0, winY1));
    w.push(rect(rearZ + 0.35, rearZ + 1.15, winY0 + 0.05, winY1));
    if (c.stripes && side < 0) w.push(rect(mid - 0.35, mid + 0.35, winY0, winY1));
    return w;
  };
  const toPath = (pts, Ctor) => { const p = new Ctor(); p.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) p.lineTo(pts[i][0], pts[i][1]); p.closePath(); return p; };
  const sideMesh = (shape, depth, mat, x, bevel) => {
    const geo = new T.ExtrudeGeometry(shape, bevel
      ? { depth, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.012, bevelSegments: 2, curveSegments: 24 }
      : { depth, bevelEnabled: false, curveSegments: 24 });
    geo.rotateY(-Math.PI / 2);
    return add(geo, mat, x, 0, 0);
  };
  [-1, 1].forEach((side) => {
    const holes = [cabWin()].concat(livingWins(side));
    const s = outline();
    holes.forEach((h) => s.holes.push(toPath(h, T.Path)));
    sideMesh(s, 0.025, paint, side > 0 ? W / 2 - 0.012 : -W / 2 + 0.037, true);
    const lin = toPath(rect(rearZ + 0.04, cabDoorRear, floorY, topY - 0.02), T.Shape);
    livingWins(side).forEach((h) => lin.holes.push(toPath(h, T.Path)));
    sideMesh(lin, 0.015, lining, side > 0 ? W / 2 - 0.05 : -W / 2 + 0.065, false);
    holes.forEach((h, i) => { const sg = new T.ShapeGeometry(toPath(h, T.Shape)); sg.rotateY(-Math.PI / 2); noShadow(add(sg, i === 0 ? glassFront : glassSide, side > 0 ? W / 2 - 0.022 : -W / 2 + 0.022, 0, 0)); });
    // arch flares
    [fAx, rAx].forEach((z) => { const f = add(new T.TorusGeometry(archR + 0.012, 0.035, 10, 32, Math.PI), plastic, side * (W / 2 + 0.004), archY, z); f.rotation.y = Math.PI / 2; });
    // sill + rubbing strip
    rbox(0.05, 0.1, (fAx - archR) - (rAx + archR) - 0.04, 0.02, plastic, side * (W / 2 + 0.01), sillY + 0.07, (fAx + rAx) / 2);
    // mirror
    rbox(0.09, 0.26, 0.18, 0.03, plastic, side * (W / 2 + 0.17), bonnetH + 0.36, wsBaseZ - 0.14);
    noShadow(rbox(0.012, 0.2, 0.14, 0.004, glassSide, side * (W / 2 + 0.17) + 0.0, bonnetH + 0.36, wsBaseZ - 0.235));
    rbox(0.2, 0.04, 0.06, 0.015, plastic, side * (W / 2 + 0.08), bonnetH + 0.27, wsBaseZ - 0.14);
    // door seams and handles
    const seam = (z, y0, y1) => box(0.006, y1 - y0, 0.006, plastic, side * (W / 2 + 0.006), (y0 + y1) / 2, z);
    seam(cabDoorRear, sillY + 0.12, Math.min(wsTopY, topY) - 0.12);
    rbox(0.03, 0.035, 0.16, 0.012, satin, side * (W / 2 + 0.012), bonnetH + 0.02, cabDoorRear + 0.18);
    if (!pop && side > 0) { seam(cabDoorRear - 1.25, sillY + 0.12, topY - 0.15); rbox(0.03, 0.035, 0.18, 0.012, satin, W / 2 + 0.012, bonnetH + 0.02, cabDoorRear - 1.12); box(0.01, 0.025, cabDoorRear - 1.25 - rearZ - 0.2, plastic, W / 2 + 0.008, winY1 + 0.08, (rearZ + 0.2 + cabDoorRear - 1.25) / 2); }
    if (c.stripes) {
      noShadow(box(0.008, 0.09, L - bonnetLen - 0.6, stripeA, side * (W / 2 + 0.003), 1.02, -bonnetLen / 2 + 0.05));
      noShadow(box(0.008, 0.035, L - bonnetLen - 0.9, stripeB, side * (W / 2 + 0.003), 1.12, -bonnetLen / 2 - 0.1));
    }
  });

  // --- rounded roof
  const roofGeo = (len) => {
    const th = 0.045, s = new T.Shape(), w = W / 2;
    s.moveTo(-w, -rr); s.quadraticCurveTo(-w, 0, -w + rr, 0); s.lineTo(w - rr, 0); s.quadraticCurveTo(w, 0, w, -rr);
    s.lineTo(w - th, -rr); s.quadraticCurveTo(w - th, -th, w - rr, -th); s.lineTo(-w + rr, -th); s.quadraticCurveTo(-w + th, -th, -w + th, -rr); s.closePath();
    return new T.ExtrudeGeometry(s, { depth: len, bevelEnabled: false, curveSegments: 10 });
  };
  add(roofGeo(roofFrontZ - rearZ), paint, 0, H, rearZ);
  if (!pop) {
    const dy = H - wsTopY, ln = Math.hypot(dy, capRun);
    const cap = add(roofGeo(ln + 0.02), paint, 0, H, roofFrontZ - 0.01); cap.rotation.x = Math.atan2(dy, capRun);
    rbox(0.95, 0.035, 1.55, 0.02, solarM, 0, H + 0.03, rearZ + 1.35);
    rbox(0.5, 0.09, 0.5, 0.04, white, 0, H + 0.04, cabDoorRear - 1.6);
    rbox(0.13, 0.12, L - bonnetLen - 1.4, 0.04, awningM, W / 2 + 0.07, topY - 0.02, (rearZ + 0.25 + cabDoorRear - 0.3) / 2 - 0.1);
  }
  box(W - 0.12, 0.02, roofFrontZ - rearZ - 0.06, ceiling, 0, topY - 0.03, (rearZ + roofFrontZ) / 2);
  if (pop) {
    const popRear = rearZ + 0.4, popFront = roofFrontZ - 0.08, rise = 0.6, len = popFront - popRear;
    const lid = rbox(W - 0.04, 0.07, Math.hypot(len, rise) + 0.04, 0.03, paint, 0, H + rise / 2 + 0.03, (popRear + popFront) / 2);
    lid.rotation.x = -Math.atan2(rise, len);
    [-1, 1].forEach((side) => {
      const tri = new T.BufferGeometry(), x = side * (W / 2 - 0.08);
      tri.setAttribute('position', new T.Float32BufferAttribute([x, H, popRear, x, H, popFront, x, H + rise, popFront], 3));
      tri.computeVertexNormals(); add(tri, canvasM, 0, 0, 0);
      noShadow(rbox(0.01, 0.22, 0.62, 0.004, glassSide, x + side * 0.004, H + 0.26, popFront - 0.46));
    });
    box(W - 0.16, rise, 0.01, canvasM, 0, H + rise / 2, popFront);
  }

  // --- windscreen, A-pillars
  {
    const top = Math.min(wsTopY, topY), dy = top - bonnetH, len = Math.hypot(dy, wsRun);
    const ws = noShadow(add(new T.PlaneGeometry(W - 0.16, len), glassFront, 0, (bonnetH + top) / 2, (wsBaseZ + wsTopZ) / 2));
    ws.rotation.x = -Math.atan2(wsRun, dy);
    [-1, 1].forEach((side) => { const p = rbox(0.08, len, 0.07, 0.025, paint, side * (W / 2 - 0.04), (bonnetH + top) / 2, (wsBaseZ + wsTopZ) / 2); p.rotation.x = -Math.atan2(wsRun, dy); });
    rbox(W - 0.04, 0.07, 0.08, 0.025, paint, 0, top, wsTopZ);
    noShadow(box(W - 0.3, 0.06, 0.02, plastic, 0, bonnetH + 0.02, wsBaseZ - 0.02));
  }
  // --- rounded nose (bonnet + front)
  {
    const s = new T.Shape();
    s.moveTo(wsBaseZ, sillY + 0.1); s.lineTo(half - 0.08, sillY + 0.1); s.lineTo(half - 0.02, sillY + 0.3);
    s.lineTo(half - 0.01, bonnetH - 0.22); s.quadraticCurveTo(half, bonnetH - 0.03, half - 0.26, bonnetH - 0.005); s.lineTo(wsBaseZ, bonnetH + 0.005); s.closePath();
    const bev = 0.045, depth = W - 0.06 - 2 * bev;
    const geo = new T.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelThickness: bev, bevelSize: 0.02, bevelSegments: 4, curveSegments: 20 });
    geo.rotateY(-Math.PI / 2);
    add(geo, paint, depth / 2, 0, 0);
  }
  // grille, lights, bumpers, plate (generic design)
  rbox(W * 0.6, 0.3, 0.06, 0.04, plastic, 0, bonnetH - 0.33, half - 0.005);
  [0, 1, 2].forEach((i) => noShadow(rbox(W * 0.55, 0.022, 0.03, 0.008, i === 0 ? chrome : satin, 0, bonnetH - 0.24 - i * 0.075, half + 0.025)));
  [-1, 1].forEach((side) => {
    const sh = new T.Shape();
    sh.moveTo(0, 0); sh.lineTo(0.4, 0.035); sh.quadraticCurveTo(0.44, 0.08, 0.42, 0.16); sh.lineTo(0.05, 0.13); sh.quadraticCurveTo(0, 0.08, 0, 0);
    const hg = new T.ExtrudeGeometry(sh, { depth: 0.035, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01, bevelSegments: 2 });
    const hl = add(hg, headM, side * (W * 0.3 + 0.02), bonnetH - 0.4, half - 0.035);
    if (side < 0) hl.scale.x = -1;
    noShadow(box(0.34, 0.012, 0.012, drlM, side * (W * 0.3 + 0.21), bonnetH - 0.385, half + 0.012));
    rbox(0.09, 0.5, 0.06, 0.025, tailM, side * (W / 2 - 0.06), sillY + 0.75, rearZ - 0.005);
    rbox(0.12, 0.2, 0.05, 0.02, plastic, side * (W / 2 - 0.12), sillY - 0.02, fAx - archR - 0.06);
  });
  rbox(W * 0.48, 0.12, 0.05, 0.03, plastic, 0, sillY + 0.3, half - 0.04);
  rbox(W + 0.06, 0.24, 0.3, 0.08, plastic, 0, sillY + 0.1, half - 0.1);
  rbox(W + 0.04, 0.22, 0.22, 0.06, plastic, 0, sillY + 0.09, rearZ + 0.06);
  noShadow(rbox(0.52, 0.11, 0.02, 0.012, plateM, 0, sillY + 0.15, half + 0.055));
  noShadow(rbox(0.52, 0.11, 0.02, 0.012, plateM, 0, sillY + 0.55, rearZ - 0.03));
  box(W - 0.08, 0.04, L - bonnetLen - 0.06, floorM, 0, floorY - 0.02, rearZ + (L - bonnetLen) / 2);
  box(W - 0.6, 0.3, L - 0.6, plastic, 0, sillY - 0.02, 0);

  // --- wheels: tyre (lathe), alloy rim, spokes
  const wheels = [];
  const tyreGeo = (() => {
    const pts = [], r0 = wheelR * 0.68, wdt = 0.125;
    pts.push(new T.Vector2(r0, -wdt)); pts.push(new T.Vector2(wheelR - 0.04, -wdt)); pts.push(new T.Vector2(wheelR - 0.005, -wdt + 0.03));
    pts.push(new T.Vector2(wheelR, 0)); pts.push(new T.Vector2(wheelR - 0.005, wdt - 0.03)); pts.push(new T.Vector2(wheelR - 0.04, wdt)); pts.push(new T.Vector2(r0, wdt));
    return new T.LatheGeometry(pts, 48);
  })();
  [fAx, rAx].forEach((z) => [-1, 1].forEach((side) => {
    const wg = new T.Group(); wg.position.set(side * (W / 2 - 0.14), wheelR, z); g.add(wg); wheels.push(wg);
    const t = add(tyreGeo, tyreM, 0, 0, 0, wg); t.rotation.z = Math.PI / 2;
    const rim = add(new T.CylinderGeometry(wheelR * 0.68, wheelR * 0.68, 0.2, 40), satin, 0, 0, 0, wg); rim.rotation.z = Math.PI / 2;
    const lip = add(new T.TorusGeometry(wheelR * 0.66, 0.012, 8, 40), rimM, side * 0.1, 0, 0, wg); lip.rotation.y = Math.PI / 2;
    for (let k = 0; k < 5; k++) {
      const sg = new T.BoxGeometry(0.03, wheelR * 0.6, 0.06); sg.translate(0, wheelR * 0.3, 0);
      const sp = add(sg, rimM, side * 0.095, 0, 0, wg); sp.rotation.x = (k / 5) * Math.PI * 2;
    }
    const hub = add(new T.CylinderGeometry(0.07, 0.07, 0.04, 24), rimM, side * 0.1, 0, 0, wg); hub.rotation.z = Math.PI / 2;
  }));

  // --- rear doors / tailgate
  const doors = [];
  const doorY0 = sillY + 0.2, doorY1 = topY - 0.02;
  if (c.doors === 'barn') {
    [-1, 1].forEach((side) => {
      const pivot = new T.Group(); pivot.position.set(side * W / 2, 0, rearZ); g.add(pivot);
      const dw = W / 2 - 0.012, dir = -side, wy0 = doorY1 - 0.85, wy1 = doorY1 - 0.18;
      rbox(dw, wy0 - doorY0, 0.045, 0.012, paint, dir * dw / 2, (doorY0 + wy0) / 2, 0, pivot);
      rbox(dw, doorY1 - wy1, 0.045, 0.012, paint, dir * dw / 2, (wy1 + doorY1) / 2, 0, pivot);
      rbox(0.12, wy1 - wy0, 0.045, 0.012, paint, dir * 0.06, (wy0 + wy1) / 2, 0, pivot);
      rbox(0.12, wy1 - wy0, 0.045, 0.012, paint, dir * (dw - 0.06), (wy0 + wy1) / 2, 0, pivot);
      noShadow(box(dw - 0.22, wy1 - wy0, 0.01, glassSide, dir * dw / 2, (wy0 + wy1) / 2, 0, pivot));
      rbox(0.035, 0.18, 0.04, 0.012, satin, dir * (dw - 0.1), 1.2, -0.04, pivot);
      doors.push({ pivot, axis: 'y', open: side < 0 ? 1.75 : -1.75 });
    });
  } else {
    const pivot = new T.Group(); pivot.position.set(0, topY, rearZ); g.add(pivot);
    const dh = topY - doorY0, wy0 = -0.6 * dh, wy1 = -0.1;
    rbox(W - 0.02, 0.4 * dh, 0.05, 0.015, paint, 0, -0.8 * dh, 0, pivot);
    rbox(W - 0.02, 0.1, 0.05, 0.015, paint, 0, -0.05, 0, pivot);
    noShadow(box(W - 0.3, wy1 - wy0, 0.01, glassSide, 0, (wy0 + wy1) / 2, 0, pivot));
    rbox(0.13, wy1 - wy0, 0.05, 0.015, paint, W / 2 - 0.075, (wy0 + wy1) / 2, 0, pivot);
    rbox(0.13, wy1 - wy0, 0.05, 0.015, paint, -W / 2 + 0.075, (wy0 + wy1) / 2, 0, pivot);
    doors.push({ pivot, axis: 'x', open: 1.35 });
  }

  // --- cab interior
  const Wi = W - 0.16;
  const seatZ = wsBaseZ - (pop ? 0.82 : 0.95);
  rbox(Wi, 0.3, 0.6, 0.08, satin, 0, bonnetH + 0.04, wsBaseZ - 0.24);
  const scr = rbox(0.36, 0.22, 0.03, 0.015, screenM, 0.12, bonnetH + 0.27, wsBaseZ - 0.5); scr.rotation.x = -0.35;
  const wheel = add(new T.TorusGeometry(0.19, 0.022, 14, 48), plastic, -0.45, bonnetH + 0.1, wsBaseZ - 0.62); wheel.rotation.x = -0.45;
  rbox(0.12, 0.1, 0.05, 0.03, satin, -0.45, bonnetH + 0.1, wsBaseZ - 0.61).rotation.x = -0.45;
  const col = box(0.06, 0.06, 0.35, plastic, -0.45, bonnetH + 0.02, wsBaseZ - 0.44); col.rotation.x = 0.45;
  const seat = (x, z) => {
    const s = new T.Group(); s.position.set(x, 0, z); g.add(s);
    box(0.36, 0.34, 0.36, plastic, 0, floorY + 0.17, 0, s);
    rbox(0.54, 0.15, 0.54, 0.06, fabric, 0, floorY + 0.42, 0.02, s);
    const back = rbox(0.54, 0.74, 0.14, 0.06, fabric, 0, floorY + 0.86, -0.24, s); back.rotation.x = -0.14;
    rbox(0.3, 0.2, 0.12, 0.05, fabric, 0, floorY + 1.32, -0.3, s);
  };
  seat(-0.45, seatZ); seat(0.45, seatZ);

  // --- living area
  const livingFront = seatZ - 0.42;
  const res = { floorY, H, W, L, seatZ, rearZ, livingFront, pop };
  const lockers = (z0, z1, side) => {
    rbox(0.36, 0.38, z1 - z0, 0.02, wood, side * (Wi / 2 - 0.18), topY - 0.24, (z0 + z1) / 2);
    noShadow(box(0.02, 0.012, z1 - z0 - 0.1, ledM, side * (Wi / 2 - 0.37), topY - 0.43, (z0 + z1) / 2));
  };
  const lamp = (x, z) => noShadow(add(new T.CylinderGeometry(0.06, 0.06, 0.012, 20), lampM, x, topY - 0.045, z));
  const pillows = (list) => list.forEach((p) => rbox(p[3] || 0.55, 0.13, p[4] || 0.38, 0.06, sheet, p[0], p[1], p[2]));

  if (c.layout === 'rockroll') {
    const bedW = c.wideBed ? 1.45 : 1.22, bedTop = floorY + 0.46;
    const z0 = rearZ + 0.12, z1 = rearZ + 1.95, bx = -Wi / 2 + bedW / 2;
    rbox(bedW, bedTop - floorY - 0.14, z1 - z0, 0.03, fabric, bx, floorY + (bedTop - floorY - 0.14) / 2, (z0 + z1) / 2);
    rbox(bedW, 0.15, z1 - z0, 0.06, sheet, bx, bedTop - 0.075, (z0 + z1) / 2);
    rbox(bedW - 0.04, 0.08, (z1 - z0) * 0.62, 0.04, duvet, bx, bedTop + 0.02, z0 + (z1 - z0) * 0.31);
    rbox(bedW - 0.08, 0.05, 0.32, 0.025, throwM, bx, bedTop + 0.075, z0 + 0.3);
    pillows([[bx - bedW / 4, bedTop + 0.06, z1 - 0.28, 0.5, 0.34], [bx + bedW / 4, bedTop + 0.06, z1 - 0.28, 0.5, 0.34]]);
    const kx = Wi / 2 - 0.22, kz0 = Math.max(livingFront - 1.35, z1 + 0.02), kz1 = livingFront;
    rbox(0.44, 0.84, kz1 - kz0, 0.015, wood, kx, floorY + 0.42, (kz0 + kz1) / 2);
    rbox(0.46, 0.03, kz1 - kz0 + 0.02, 0.008, worktop, kx, floorY + 0.855, (kz0 + kz1) / 2);
    rbox(0.3, 0.02, 0.36, 0.008, steel, kx, floorY + 0.875, kz0 + 0.35);
    [0, 1].forEach((i) => add(new T.CylinderGeometry(0.08, 0.08, 0.012, 24), plastic, kx, floorY + 0.878, kz1 - 0.25 - i * 0.24));
    rbox(0.32, 0.3, kz1 - kz0, 0.02, wood, Wi / 2 - 0.16, topY - 0.22, (kz0 + kz1) / 2);
    Object.assign(res, {
      bed: { pos: [bx, bedTop + 0.38, z1 - 0.35], yaw: Math.PI, pitch: -0.1 },
      living: { pos: [-0.2, floorY + 1.22, livingFront - 0.2], yaw: Math.PI * 0.82, pitch: -0.2 }
    });
  } else {
    const garage = c.layout === 'northsouth' ? 0.72 : 0.92;
    const bedTop = floorY + garage + 0.18;
    let bedFront, bedPos;
    if (c.layout === 'northsouth') {
      const bw = 1.38, bl = 1.95, bx = Wi / 2 - bw / 2, z0 = rearZ + 0.08, z1 = z0 + bl;
      rbox(bw, garage, bl, 0.015, wood, bx, floorY + garage / 2, (z0 + z1) / 2);
      rbox(bw, 0.19, bl, 0.07, sheet, bx, bedTop - 0.09, (z0 + z1) / 2);
      rbox(bw - 0.04, 0.09, bl * 0.66, 0.045, duvet, bx, bedTop + 0.03, z0 + bl * 0.33);
      rbox(bw - 0.08, 0.05, 0.34, 0.025, throwM, bx, bedTop + 0.085, z0 + 0.35);
      pillows([[bx - 0.32, bedTop + 0.06, z1 - 0.25], [bx + 0.32, bedTop + 0.06, z1 - 0.25]]);
      rbox(0.45, 0.72, 0.55, 0.015, wood, -Wi / 2 + 0.23, floorY + 0.36, z0 + 0.3);
      bedFront = z1; bedPos = { pos: [bx, bedTop + 0.42, z1 - 0.3], yaw: Math.PI, pitch: -0.12 };
    } else {
      const d = c.bedDepth || 1.4, z0 = rearZ + 0.08, z1 = z0 + d;
      rbox(Wi, garage, d, 0.015, wood, 0, floorY + garage / 2, (z0 + z1) / 2);
      rbox(Wi, 0.19, d, 0.07, sheet, 0, bedTop - 0.09, (z0 + z1) / 2);
      rbox(Wi - 0.6, 0.09, d - 0.06, 0.045, duvet, 0.27, bedTop + 0.03, (z0 + z1) / 2);
      rbox(0.32, 0.05, d - 0.1, 0.025, throwM, Wi / 2 - 0.25, bedTop + 0.085, (z0 + z1) / 2);
      const px = -Wi / 2 + 0.3;
      pillows([[px, bedTop + 0.06, z0 + d * 0.28, 0.38, 0.55], [px, bedTop + 0.06, z0 + d * 0.72, 0.38, 0.55]]);
      bedFront = z1; bedPos = { pos: [-0.35, bedTop + 0.4, z1 - 0.1], yaw: Math.PI * 0.94, pitch: -0.14 };
    }
    const kSide = c.layout === 'northsouth' ? -1 : 1;
    const kz0 = bedFront + 0.04, kz1 = Math.min(kz0 + 1.25, livingFront - (c.dinette ? 1.25 : 0.1));
    const kx = kSide * (Wi / 2 - 0.28);
    rbox(0.56, 0.9, kz1 - kz0, 0.015, wood, kx, floorY + 0.45, (kz0 + kz1) / 2);
    rbox(0.58, 0.035, kz1 - kz0 + 0.02, 0.01, worktop, kx, floorY + 0.915, (kz0 + kz1) / 2);
    rbox(0.34, 0.02, 0.4, 0.008, steel, kx, floorY + 0.94, kz0 + 0.3);
    const tap = add(new T.TorusGeometry(0.1, 0.012, 8, 24, Math.PI), steel, kx + kSide * 0.18, floorY + 0.94, kz0 + 0.3); tap.rotation.y = Math.PI / 2;
    [0, 1].forEach((i) => add(new T.CylinderGeometry(0.085, 0.085, 0.012, 24), plastic, kx, floorY + 0.94, kz1 - 0.24 - i * 0.26));
    rbox(0.02, 0.5, 0.48, 0.008, steel, kx - kSide * 0.29, floorY + 0.3, (kz0 + kz1) / 2);
    if (c.bath) {
      const bs = -kSide, bz0 = kz0, bz1 = kz0 + 0.9, bh = topY - floorY - 0.06, bx = bs * (Wi / 2 - 0.42);
      rbox(0.84, bh, bz1 - bz0, 0.02, white, bx, floorY + bh / 2, (bz0 + bz1) / 2);
      noShadow(rbox(0.012, bh - 0.25, 0.62, 0.006, S({ color: '#e7e3dc', roughness: 0.5 }), bx - bs * 0.425, floorY + (bh - 0.25) / 2 + 0.08, (bz0 + bz1) / 2));
      rbox(0.03, 0.14, 0.03, 0.01, steel, bx - bs * 0.44, floorY + 1.0, bz0 + 0.18);
    }
    if (c.dinette) {
      const tz = livingFront - 0.5;
      rbox(0.62, 0.035, 0.75, 0.012, wood, 0.42, floorY + 0.72, tz);
      add(new T.CylinderGeometry(0.03, 0.03, 0.7, 12), steel, 0.42, floorY + 0.36, tz);
      rbox(0.9, 0.42, 0.45, 0.05, fabric, 0.45, floorY + 0.21, tz - 0.62);
      const bb = rbox(0.9, 0.55, 0.12, 0.05, fabric, 0.45, floorY + 0.68, tz - 0.8); bb.rotation.x = 0.1;
    }
    lockers(rearZ + 0.1, kz1, 1); lockers(rearZ + 0.1, kz1, -1);
    lamp(0, rearZ + 0.9); lamp(0, (kz0 + kz1) / 2); lamp(0, livingFront - 0.4);
    Object.assign(res, { bed: bedPos, living: { pos: [-0.05, floorY + 1.6, livingFront - 0.15], yaw: Math.PI, pitch: -0.2 } });
  }
  res.driver = { pos: [-0.45, floorY + 1.16, seatZ - 0.24], yaw: 0, pitch: -0.06 };
  res.passenger = { pos: [0.45, floorY + 1.16, seatZ - 0.24], yaw: 0.35, pitch: -0.06 };
  res.lights = [[0, topY - 0.25, rearZ + 1.0], [0, topY - 0.25, livingFront - 0.6]];
  res.group = g; res.doors = doors; res.mats = mats; res.texs = texs; res.wheels = wheels;
  return res;
}

// ---------- the world: sky, mountains, loch, hills, road
function buildWorld(T, renderer) {
  const world = new T.Group(), disposables = [];
  const sunDir = new T.Vector3(SKY.sun[0], SKY.sun[1], SKY.sun[2]).normalize();
  const skyMat = new T.ShaderMaterial({
    side: T.BackSide, depthWrite: false, fog: false,
    uniforms: { top: { value: new T.Color(SKY.top) }, horizon: { value: new T.Color(SKY.horizon) }, bottom: { value: new T.Color(SKY.bottom) }, sunDir: { value: sunDir } },
    vertexShader: 'varying vec3 vDir; void main(){ vDir = normalize(position); vec4 p = modelViewMatrix * vec4(position,1.0); gl_Position = projectionMatrix * p; }',
    fragmentShader: 'uniform vec3 top; uniform vec3 horizon; uniform vec3 bottom; uniform vec3 sunDir; varying vec3 vDir;' +
      'void main(){ float h = vDir.y; vec3 c = h > 0.0 ? mix(horizon, top, pow(clamp(h,0.0,1.0), 0.55)) : mix(horizon, bottom, pow(clamp(-h,0.0,1.0), 0.4));' +
      'float s = max(dot(normalize(vDir), sunDir), 0.0); c += vec3(1.0,0.86,0.62) * (pow(s, 900.0) * 6.0 + pow(s, 24.0) * 0.35 + pow(s, 4.0) * 0.08);' +
      'float cl = 0.0; vec2 q = vDir.xz / max(h, 0.06) * 0.6; cl = smoothstep(0.55, 0.85, 0.5 + 0.5 * sin(q.x * 2.1 + sin(q.y * 1.3)) * sin(q.y * 1.7 + sin(q.x * 0.9)));' +
      'c = mix(c, vec3(1.0,0.97,0.93), cl * 0.35 * smoothstep(0.02, 0.25, h));' +
      'gl_FragColor = vec4(c, 1.0);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}'
  });
  const sky = new T.Mesh(new T.SphereGeometry(900, 48, 24), skyMat); world.add(sky); disposables.push(sky.geometry, skyMat);

  // environment lighting from the sky
  const pm = new T.PMREMGenerator(renderer);
  const envScene = new T.Scene(); const envSky = new T.Mesh(new T.SphereGeometry(100, 32, 16), skyMat); envScene.add(envSky);
  const env = pm.fromScene(envScene, 0.035).texture; pm.dispose(); envSky.geometry.dispose();

  // terrain height
  const heightAt = (x, z) => {
    const ax = Math.abs(x);
    let h = 0;
    if (x < 0) h = Math.max(0, (ax - 28) / 60) * 7 * fbm(x * 0.012 + 3, z * 0.012, 4) * Math.min(1, Math.max(0, (ax - 28) / 40));
    else { const lochEdge = Math.min(1, Math.max(0, (x - 9) / 6)); h = -0.9 * lochEdge + Math.max(0, (x - 190) / 60) * 26 * fbm(x * 0.01, z * 0.01 + 7, 4); }
    if (ax < 8) h *= 0; return h;
  };
  const gGeo = new T.PlaneGeometry(1000, 1000, 200, 200); gGeo.rotateX(-Math.PI / 2);
  const pos = gGeo.attributes.position, cols = [], col = new T.Color();
  const grassA = new T.Color('#4c6634'), grassB = new T.Color('#6f7a3c'), heather = new T.Color('#6f5446'), verge = new T.Color('#7e7a5e'), rock = new T.Color('#7b7a74');
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i), h = heightAt(x, z); pos.setY(i, h);
    const n = fbm(x * 0.05, z * 0.05, 3), m = fbm(x * 0.008 + 11, z * 0.008, 3);
    col.copy(grassA).lerp(grassB, n).lerp(heather, Math.max(0, m - 0.45) * 1.6);
    if (h > 9) col.lerp(rock, Math.min(1, (h - 9) / 10));
    if (Math.abs(x) < 6.5) col.lerp(verge, 0.55);
    cols.push(col.r, col.g, col.b);
  }
  gGeo.setAttribute('color', new T.Float32BufferAttribute(cols, 3)); gGeo.computeVertexNormals();
  const groundMat = new T.MeshStandardMaterial({ vertexColors: true, roughness: 1 });
  const ground = new T.Mesh(gGeo, groundMat); ground.receiveShadow = true; world.add(ground); disposables.push(gGeo, groundMat);

  // loch
  const waterMat = new T.MeshPhysicalMaterial({ color: '#27455a', roughness: 0.06, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.1, envMapIntensity: 1.3 });
  const water = new T.Mesh(new T.PlaneGeometry(400, 1000), waterMat); water.rotation.x = -Math.PI / 2; water.position.set(14 + 200, -0.25, 0); world.add(water); disposables.push(water.geometry, waterMat);

  // mountain ridges
  const ridge = (radius, base, amp, seed, cA, cB, snow) => {
    const segs = 360, p = [], cl = [], idx = [], ca = new T.Color(cA), cb = new T.Color(cB), sn = new T.Color('#eef0f3'), tmp = new T.Color();
    for (let i = 0; i <= segs; i++) {
      const a = (i / segs) * Math.PI * 2;
      let n = 0; [2, 3, 5, 7, 11, 17, 29].forEach((f, k) => { n += Math.sin(a * f + seed * (k + 1)) / (k * 0.9 + 1); });
      const hgt = base + amp * (0.5 + 0.35 * n) * (0.75 + 0.25 * Math.sin(a * 1 + seed));
      const x = Math.cos(a) * radius, z = Math.sin(a) * radius;
      p.push(x, -10, z, x, Math.max(base * 0.4, hgt), z);
      cl.push(ca.r, ca.g, ca.b);
      tmp.copy(cb); if (snow && hgt > base + amp * 0.85) tmp.lerp(sn, 0.7); cl.push(tmp.r, tmp.g, tmp.b);
      if (i < segs) { const j = i * 2; idx.push(j, j + 1, j + 2, j + 1, j + 3, j + 2); }
    }
    const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.Float32BufferAttribute(p, 3)); geo.setAttribute('color', new T.Float32BufferAttribute(cl, 3)); geo.setIndex(idx); geo.computeVertexNormals();
    const mat = new T.MeshStandardMaterial({ vertexColors: true, roughness: 1, side: T.DoubleSide, flatShading: true });
    const m = new T.Mesh(geo, mat); world.add(m); disposables.push(geo, mat);
  };
  ridge(330, 30, 70, 1.3, '#2f3b2e', '#4a5446', false);
  ridge(460, 50, 110, 4.1, '#4b5468', '#6c7488', true);
  ridge(600, 70, 150, 7.7, '#7d86a0', '#a3aac0', true);

  // pines
  const coneG = new T.ConeGeometry(1.4, 5.5, 7), trunkG = new T.CylinderGeometry(0.18, 0.22, 1.4, 6);
  coneG.translate(0, 4, 0); trunkG.translate(0, 0.7, 0);
  const pineM = new T.MeshStandardMaterial({ color: '#2b3d2a', roughness: 1, flatShading: true }), trunkM = new T.MeshStandardMaterial({ color: '#4a3a2c', roughness: 1 });
  const N = 420, cones = new T.InstancedMesh(coneG, pineM, N), trunks = new T.InstancedMesh(trunkG, trunkM, N), mtx = new T.Matrix4(), q = new T.Quaternion(), sc = new T.Vector3(), pp = new T.Vector3();
  for (let i = 0; i < N; i++) {
    let x, z, tries = 0;
    do { x = -60 - Math.pow(hash2(i, 1), 1.3) * 240; z = (hash2(i, 2) - 0.5) * 700; tries++; } while (fbm(x * 0.02, z * 0.02, 2) < 0.42 && tries < 6);
    const s = 0.55 + hash2(i, 3) * 0.7; sc.set(s, s * (0.9 + hash2(i, 4) * 0.4), s); pp.set(x, heightAt(x, z), z);
    q.setFromAxisAngle(new T.Vector3(0, 1, 0), hash2(i, 5) * 6.28); mtx.compose(pp, q, sc); cones.setMatrixAt(i, mtx); trunks.setMatrixAt(i, mtx);
  }
  cones.castShadow = false; world.add(cones, trunks); disposables.push(coneG, trunkG, pineM, trunkM);

  // road
  const asphalt = dataTex(T, 256, (u, v) => { const n = fbm(u * 40, v * 40, 3), sp = hash2(Math.floor(u * 256), Math.floor(v * 256)) > 0.93 ? 18 : 0; const k = 58 + n * 22 + sp; return [k, k, k + 3]; }, 3, 140);
  const roadMat = new T.MeshStandardMaterial({ color: '#ffffff', map: asphalt, roughness: 0.9 });
  const road = new T.Mesh(new T.PlaneGeometry(6.6, 1000), roadMat); road.rotation.x = -Math.PI / 2; road.position.y = 0.012; road.receiveShadow = true; world.add(road);
  const lineMat = new T.MeshStandardMaterial({ color: '#efece2', roughness: 0.6 });
  [-1, 1].forEach((s) => { const l = new T.Mesh(new T.PlaneGeometry(0.12, 1000), lineMat); l.rotation.x = -Math.PI / 2; l.position.set(s * 3.05, 0.016, 0); l.receiveShadow = true; world.add(l); });
  const dashes = new T.Group(); world.add(dashes);
  const dashG = new T.PlaneGeometry(0.12, 3);
  for (let z = -300; z <= 300; z += 9) { const d = new T.Mesh(dashG, lineMat); d.rotation.x = -Math.PI / 2; d.position.set(0, 0.017, z); d.receiveShadow = true; dashes.add(d); }
  const posts = new T.Group(); world.add(posts);
  const postG = new T.BoxGeometry(0.1, 1.0, 0.1), postM = new T.MeshStandardMaterial({ color: '#f1efe8', roughness: 0.6 }), refG = new T.BoxGeometry(0.105, 0.12, 0.105), refM = new T.MeshStandardMaterial({ color: '#c41e30', emissive: '#5a0010', emissiveIntensity: 0.6 });
  for (let z = -300; z <= 300; z += 24) [-1, 1].forEach((s) => { const pz = z + (s > 0 ? 12 : 0); const p = new T.Mesh(postG, postM); p.position.set(s * 4.4, 0.5, pz); p.castShadow = true; posts.add(p); const r = new T.Mesh(refG, refM); r.position.set(s * 4.4, 0.85, pz); posts.add(r); });
  disposables.push(asphalt, roadMat, road.geometry, lineMat, dashG, postG, postM, refG, refM);

  return { world, env, dashes, posts, sunDir, disposables, fogColor: SKY.horizon };
}

class Component extends DCLogic {
  constructor(props) {
    super(props);
    const hero = props.hero === 'true' || props.hero === true;
    this.hero = hero;
    this.state = { van: props.van || 'man-lwb-auto', view: hero ? 'drive' : 'outside', noGL: false };
    this.canvasRef = (el) => this.mount(el);
    this.sectionRef = (el) => { if (el) this.sectionEl = el; };
    this.v = null;
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.van && this.props.van !== prevProps.van && this.props.van !== this.state.van) this.setState({ van: this.props.van });
    if (!this.v) return;
    if (prevState.van !== this.state.van) this.loadVan(this.state.van);
    if (prevState.view !== this.state.view) this.setView(this.state.view);
  }
  componentWillUnmount() { this.destroy(); }

  mount(el) {
    if (!el || (this.v && this.v.canvas === el)) return;
    const T = window.THREE;
    if (!T) { this.setState({ noGL: true }); return; }
    let renderer;
    try { renderer = new T.WebGLRenderer({ canvas: el, antialias: true, powerPreference: 'high-performance' }); } catch (e) { this.setState({ noGL: true }); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFSoftShadowMap;

    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(45, 16 / 9, 0.03, 2000);
    const W = buildWorld(T, renderer);
    scene.add(W.world);
    scene.environment = W.env;
    scene.fog = new T.Fog(W.fogColor, 120, 900);
    scene.background = new T.Color(W.fogColor);
    scene.add(new T.HemisphereLight(0xdfe8ff, 0x5d5638, 0.6));
    const sun = new T.DirectionalLight(0xffe2bf, 3.2);
    sun.position.copy(W.sunDir).multiplyScalar(30); sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8, near: 5, far: 70 });
    sun.shadow.bias = -0.0003; sun.shadow.normalBias = 0.02; sun.shadow.radius = 4;
    scene.add(sun);
    const inner = [new T.PointLight(0xffd9a8, 2.2, 5, 2), new T.PointLight(0xffd9a8, 2.2, 5, 2)];
    inner.forEach((l) => scene.add(l));
    // soft contact shadow under the van
    const csTex = dataTex(T, 128, (u, v) => { const dx = (u - 0.5) * 2, dy = (v - 0.5) * 2, r = Math.sqrt(dx * dx * 0.9 + dy * dy * 0.9); const a = Math.pow(Math.max(0, 1 - r), 1.6) * 0.75; return [0, 0, 0, Math.round(a * 255)]; }, 1, 1);
    csTex.colorSpace = T.NoColorSpace;
    const cs = new T.Mesh(new T.PlaneGeometry(1, 1), new T.MeshBasicMaterial({ map: csTex, transparent: true, depthWrite: false }));
    cs.rotation.x = -Math.PI / 2; cs.position.y = 0.02; cs.renderOrder = 1; scene.add(cs);

    this.v = {
      T, canvas: el, renderer, scene, camera, sun, inner, worldParts: W, contact: cs, van: null, offX: 0, offY: 0,
      mode: 'outside', theta: 0.85, phi: 1.22, radius: 11, yaw: 0, pitch: 0, fov: 45,
      look: new T.Vector3(0, 1.2, 0), lastInteract: 0, doorT: 0, running: true, raf: 0, last: performance.now(), pointers: new Map()
    };
    this.bindInput(el);
    this.loadVan(this.state.van);
    this.setView(this.state.view, true);
    this.resize();
    this.ro = new ResizeObserver(() => this.resize()); this.ro.observe(el);
    this.io = new IntersectionObserver((es) => { const vis = es.some((e) => e.isIntersecting); if (this.v) { this.v.running = vis; if (vis) this.tick(); } });
    this.io.observe(el);
    this.tick();
  }

  destroy() {
    const v = this.v; if (!v) return;
    cancelAnimationFrame(v.raf); v.running = false;
    if (this.ro) this.ro.disconnect(); if (this.io) this.io.disconnect();
    this.disposeVan();
    v.worldParts.disposables.forEach((d) => d.dispose && d.dispose());
    if (v.worldParts.env) v.worldParts.env.dispose();
    v.renderer.dispose();
    this.v = null;
  }

  disposeVan() {
    const v = this.v; if (!v || !v.van) return;
    v.scene.remove(v.van.group);
    v.van.group.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
    v.van.mats.forEach((m) => m.dispose());
    v.van.texs.forEach((t) => t.dispose());
    v.van = null;
  }

  loadVan(id) {
    const v = this.v; if (!v) return;
    this.disposeVan();
    v.van = buildVan(v.T, VAN_SPECS[id] || VAN_SPECS['man-lwb-auto']);
    v.scene.add(v.van.group);
    v.van.lights.forEach((p, i) => v.inner[i].position.set(p[0], p[1], p[2]));
    v.contact.scale.set(v.van.W + 1.1, v.van.L + 1.6, 1);
    v.doorT = 0;
    this.setView(this.state.view, true);
  }

  setView(mode, snap) {
    const v = this.v; if (!v || !v.van) return;
    v.mode = mode;
    if (mode === 'outside') { v.radius = v.van.L * 1.25 + 3; v.phi = 1.3; v.fov = 40; }
    else if (mode === 'drive') { v.fov = 26; }
    else { const p = v.van[mode]; if (!p) return; v.yaw = p.yaw || 0; v.pitch = p.pitch || 0; v.fov = 72; }
    if (snap) { const t = this.target(); v.camera.position.copy(t.pos); v.look.copy(t.look); v.camera.fov = v.fov; const o = this.offsetTarget(); v.offX = o[0]; v.offY = o[1]; v.camera.updateProjectionMatrix(); }
  }

  target() {
    const v = this.v, T = v.T;
    if (v.mode === 'outside') {
      const c = new T.Vector3(0, v.van.H * 0.45, 0);
      const pos = new T.Vector3(c.x + v.radius * Math.sin(v.phi) * Math.sin(v.theta), c.y + v.radius * Math.cos(v.phi), c.z + v.radius * Math.sin(v.phi) * Math.cos(v.theta));
      if (pos.y < 0.5) pos.y = 0.5;
      return { pos, look: c };
    }
    if (v.mode === 'drive') {
      const c = new T.Vector3(0, v.van.H * 0.42, 0.15), th = 0.9, el = 0.05, d = v.van.L * 1.9 + 6;
      return { pos: new T.Vector3(c.x + d * Math.sin(th) * Math.cos(el), c.y + d * Math.sin(el), c.z + d * Math.cos(th) * Math.cos(el)), look: c };
    }
    const p = v.van[v.mode].pos;
    const pos = new T.Vector3(p[0], p[1], p[2]);
    const dir = new T.Vector3(Math.sin(v.yaw) * Math.cos(v.pitch), Math.sin(v.pitch), Math.cos(v.yaw) * Math.cos(v.pitch));
    return { pos, look: pos.clone().add(dir) };
  }

  offsetTarget() {
    const v = this.v;
    if (!v || v.mode !== 'drive' || !this.hero) return [0, 0];
    const w = v.canvas.clientWidth || 800, h = v.canvas.clientHeight || 450;
    return w / h > 1.15 ? [-0.2, 0.05] : [0, 0.2];
  }

  bindInput(el) {
    const v = this.v;
    const down = (e) => { if (v.mode === 'drive') return; v.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY }); v.lastInteract = performance.now(); try { el.setPointerCapture(e.pointerId); } catch (x) {} };
    const move = (e) => {
      if (!v.pointers.has(e.pointerId)) return;
      const p = v.pointers.get(e.pointerId), dx = e.clientX - p.x, dy = e.clientY - p.y;
      if (v.pointers.size === 2) {
        const pts = [...v.pointers.values()];
        const before = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        p.x = e.clientX; p.y = e.clientY;
        const after = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        if (v.mode === 'outside') v.radius = Math.min(v.van.L * 3, Math.max(v.van.L * 0.85, v.radius * (before / Math.max(after, 1))));
        else v.fov = Math.min(85, Math.max(35, v.fov * (before / Math.max(after, 1))));
        return;
      }
      p.x = e.clientX; p.y = e.clientY;
      if (v.mode === 'outside') { v.theta -= dx * 0.006; v.phi = Math.min(1.5, Math.max(0.35, v.phi - dy * 0.005)); }
      else { v.yaw += dx * 0.005; v.pitch = Math.min(1.1, Math.max(-1.1, v.pitch + dy * 0.004)); }
      v.lastInteract = performance.now();
    };
    const up = (e) => { v.pointers.delete(e.pointerId); };
    const wheel = (e) => {
      if (v.mode === 'drive') return;
      e.preventDefault(); v.lastInteract = performance.now();
      if (v.mode === 'outside') v.radius = Math.min(v.van.L * 3, Math.max(v.van.L * 0.85, v.radius * (1 + Math.sign(e.deltaY) * 0.08)));
      else v.fov = Math.min(85, Math.max(35, v.fov + Math.sign(e.deltaY) * 3));
    };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('wheel', wheel, { passive: false });
  }

  resize() {
    const v = this.v; if (!v) return;
    const w = v.canvas.clientWidth || 800, h = v.canvas.clientHeight || 450;
    v.renderer.setSize(w, h, false);
    v.camera.aspect = w / h; v.camera.updateProjectionMatrix();
  }

  tick() {
    const v = this.v; if (!v || !v.running) return;
    cancelAnimationFrame(v.raf);
    v.raf = requestAnimationFrame(() => this.tick());
    const now = performance.now(), dt = Math.min(0.05, (now - v.last) / 1000); v.last = now;
    if (!v.van) return;
    const t0 = now / 1000, driving = v.mode === 'drive', ease = 1 - Math.exp(-dt * 4), g = v.van.group;
    if (driving) {
      g.position.y = 0.012 * Math.sin(t0 * 8.3) + 0.006 * Math.sin(t0 * 13.7 + 1.3);
      g.rotation.x = 0.004 * Math.sin(t0 * 6.1);
      g.rotation.z = 0.0028 * Math.sin(t0 * 4.7 + 0.5);
      v.van.wheels.forEach((w) => { w.rotation.x += dt * 24; });
      v.worldParts.dashes.position.z = -((t0 * 9) % 9);
      v.worldParts.posts.position.z = -((t0 * 9) % 24);
    } else {
      g.position.y += (0 - g.position.y) * ease; g.rotation.x += (0 - g.rotation.x) * ease; g.rotation.z += (0 - g.rotation.z) * ease;
    }
    const tg = this.target(), k = 1 - Math.exp(-dt * 4.5);
    v.camera.position.lerp(tg.pos, k);
    v.look.lerp(tg.look, k);
    v.camera.lookAt(v.look);
    if (Math.abs(v.camera.fov - v.fov) > 0.05) { v.camera.fov += (v.fov - v.camera.fov) * k; v.camera.updateProjectionMatrix(); }
    const ot = this.offsetTarget();
    v.offX += (ot[0] - v.offX) * ease; v.offY += (ot[1] - v.offY) * ease;
    const cw = v.canvas.clientWidth || 800, chh = v.canvas.clientHeight || 450;
    if (Math.abs(v.offX) > 0.001 || Math.abs(v.offY) > 0.001) v.camera.setViewOffset(cw, chh, v.offX * cw, v.offY * chh, cw, chh); else v.camera.clearViewOffset();
    const want = v.mode === 'bed' ? 1 : 0;
    v.doorT += (want - v.doorT) * (1 - Math.exp(-dt * 3));
    v.van.doors.forEach((d) => { d.pivot.rotation[d.axis] = d.open * v.doorT; });
    v.renderer.render(v.scene, v.camera);
  }

  renderVals() {
    const s = this.state;
    const on = 'min-h-[52px] shrink-0 rounded-full border-2 border-plum bg-plum px-5 text-[16px] font-bold text-white';
    const off = 'min-h-[52px] shrink-0 rounded-full border-2 border-plum/20 bg-white px-5 text-[16px] font-bold text-plum hover:border-plum';
    const viewLabel = (VIEWS.find((x) => x[0] === s.view) || VIEWS[0])[1];
    const spec = VAN_SPECS[s.van] || VAN_SPECS['man-lwb-auto'];
    const hero = this.hero, inside = hero && s.view !== 'drive';
    const viewIds = hero ? ['driver', 'passenger', 'living', 'bed'] : ['outside', 'driver', 'passenger', 'living', 'bed'];
    const hOn = 'min-h-[52px] shrink-0 rounded-full bg-brand px-5 text-[16px] font-bold text-white';
    const hOff = 'min-h-[52px] shrink-0 rounded-full bg-white/90 px-5 text-[16px] font-bold text-plum hover:bg-white';
    return {
      isHero: hero,
      isTour: !hero,
      outsideMode: hero && !inside,
      insideMode: inside,
      canvasCls: 'absolute inset-0 -z-20 h-full w-full select-none touch-pan-y ' + (inside ? 'cursor-grab active:cursor-grabbing' : ''),
      title: this.props.title || spec.name,
      eyebrow: this.props.eyebrow || '',
      intro: this.props.intro || '',
      sectionRef: this.sectionRef,
      heroCls: inside ? 'fixed inset-0 z-[100] isolate overflow-hidden bg-plum-deep' : 'relative isolate overflow-hidden bg-plum-deep',
      innerCls: inside
        ? 'pointer-events-none mx-auto flex h-full max-w-[1400px] flex-col justify-end px-5 pb-6 pt-24 md:px-10 md:pb-10'
        : 'pointer-events-none mx-auto flex min-h-[580px] max-w-[1400px] flex-col justify-end px-5 pb-12 pt-32 md:px-10 lg:min-h-[720px] lg:pb-20',
      enterInside: () => {
        this.setState({ view: 'driver' });
        const el = this.sectionEl;
        try { if (el && el.requestFullscreen && !document.fullscreenElement) { const p = el.requestFullscreen(); if (p && p.catch) p.catch(() => {}); } } catch (e) {}
      },
      exitInside: () => {
        try { if (document.fullscreenElement && document.exitFullscreen) { const p = document.exitFullscreen(); if (p && p.catch) p.catch(() => {}); } } catch (e) {}
        this.setState({ view: 'drive' });
      },
      canvasRef: this.canvasRef,
      noGL: s.noGL,
      showPicker: this.props.picker !== 'false',
      van: s.van,
      vanName: spec.name,
      viewLabel,
      hint: s.view === 'outside' ? 'Drag to walk around · scroll or pinch to zoom' : 'Drag to look around · scroll or pinch to zoom',
      ariaLabel: '3D model of the ' + spec.name + ', ' + viewLabel.toLowerCase() + ' view, on a Highland road beside a loch',
      vanOptions: VAN_ORDER.map((id) => ({ id, name: VAN_SPECS[id].name })),
      pickVan: (e) => this.setState({ van: e.target.value }),
      views: VIEWS.filter((x) => viewIds.includes(x[0])).map(([id, label]) => ({ label, pressed: s.view === id ? 'true' : 'false', cls: s.view === id ? (hero ? hOn : on) : (hero ? hOff : off), pick: () => this.setState({ view: id }) }))
    };
  }
}


return Component;
})();
