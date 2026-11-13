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
  'man-lwb-auto':   { name: 'MAN TGE LWB Luxury · Automatic', L: 6.84, W: 2.04, H: 2.6, kind: 'high', paint: '#4a4c51', layout: 'northsouth', bath: true, rearAxle: 1.75, doors: 'barn' },
  'man-lwb-manual': { name: 'MAN TGE LWB Luxury · Manual', L: 6.84, W: 2.04, H: 2.6, kind: 'high', paint: '#3e4044', layout: 'transverse', bedDepth: 1.5, bath: true, rearAxle: 1.75, doors: 'barn' },
  'man-mwb':        { name: 'MAN TGE MWB · 2 berth', L: 5.99, W: 2.04, H: 2.6, kind: 'high', paint: '#55575c', layout: 'transverse', bedDepth: 1.6, bath: true, rearAxle: 1.15, doors: 'barn' },
  'crafter-auto':   { name: 'VW Crafter LWB · Automatic', L: 6.84, W: 2.04, H: 2.6, kind: 'high', paint: '#f2f2f0', layout: 'transverse', bedDepth: 1.4, bath: true, dinette: true, rearAxle: 1.75, doors: 'barn' },
  'crafter-manual': { name: 'VW Crafter LWB · Manual', L: 6.84, W: 2.04, H: 2.6, kind: 'high', paint: '#c9cbce', layout: 'transverse', bedDepth: 1.4, bath: true, dinette: true, rearAxle: 1.75, doors: 'barn' },
  'toleno':         { name: 'Toleno R · 4 berth', L: 6.36, W: 2.05, H: 2.62, kind: 'high', paint: '#f7f7f5', stripes: true, layout: 'transverse', bedDepth: 1.45, bath: true, dinette: true, rearAxle: 1.5, doors: 'barn' },
  't5-spacious':    { name: 'VW T5 Spacious · Pop-top', L: 4.9, W: 1.9, H: 1.97, kind: 'pop', paint: '#5b6067', layout: 'rockroll', bath: false, rearAxle: 1.0, doors: 'tailgate' },
  't5-widebed':     { name: 'VW T5 Wide Bed · Pop-top', L: 4.9, W: 1.9, H: 1.97, kind: 'pop', paint: '#b9bcc1', layout: 'rockroll', wideBed: true, bath: false, rearAxle: 1.0, doors: 'tailgate' },
  't5-compact':     { name: 'VW T5 Compact · Pop-top', L: 4.9, W: 1.9, H: 1.97, kind: 'pop', paint: '#f1f1ef', layout: 'rockroll', bath: false, rearAxle: 1.0, doors: 'tailgate' }
};
const VAN_ORDER = ['man-lwb-auto', 'man-lwb-manual', 'man-mwb', 'crafter-auto', 'crafter-manual', 'toleno', 't5-spacious', 't5-widebed', 't5-compact'];
const SCENERY = {
  highlands: { label: 'Highlands', img: 'assets/nc500.jpg', ground: '#55603f', sky: '#8f9aa6', road: true },
  lakes:     { label: 'Lake District', img: 'assets/lakes.jpg', ground: '#4f5a3a', sky: '#d79a6a', road: true },
  beach:     { label: 'Hebridean beach', img: 'assets/hebrides.jpg', ground: '#d9cba6', sky: '#aab6c2', road: false },
  cotswolds: { label: 'Cotswolds', img: 'assets/cotswolds.jpg', ground: '#6a7040', sky: '#c9c4b4', road: true },
  bruges:    { label: 'Bruges', img: 'assets/bruges.jpg', ground: '#5e5a56', sky: '#24324f', road: true }
};
const VIEWS = [
  ['outside', 'Walk around'],
  ['drive', 'On the road'],
  ['driver', "Driver's seat"],
  ['passenger', 'Passenger seat'],
  ['living', 'Living area'],
  ['bed', 'Lying in bed']
];

function buildVan(T, c) {
  const g = new T.Group();
  const mats = [];
  const M = (color, o) => { const m = new T.MeshStandardMaterial(Object.assign({ color, roughness: 0.6, metalness: 0 }, o || {})); mats.push(m); return m; };
  const paint = M(c.paint, { roughness: 0.32, metalness: 0.35 });
  const lining = M('#dcd8d0', { roughness: 0.95 });
  const ceiling = M('#eeebe5', { roughness: 0.95 });
  const trim = M('#1d1d21', { roughness: 0.55 });
  const tyre = M('#151517', { roughness: 0.9 });
  const hubM = M('#b9bcc2', { roughness: 0.3, metalness: 0.8 });
  const vinyl = M('#4a4541', { roughness: 0.85 });
  const wood = M('#cba983', { roughness: 0.7 });
  const worktop = M('#2c2c30', { roughness: 0.35 });
  const fabric = M('#3a3e47', { roughness: 0.95 });
  const sheet = M('#f4f2ed', { roughness: 1 });
  const duvet = M('#2f4f8f', { roughness: 1 });
  const throwM = M('#b8324a', { roughness: 1 });
  const white = M('#f6f6f4', { roughness: 0.45 });
  const steel = M('#c8ccd2', { roughness: 0.25, metalness: 0.85 });
  const canvasM = M('#6d6963', { roughness: 1, side: T.DoubleSide });
  const lampM = M('#fff6e0', { emissive: '#fff1cf', emissiveIntensity: 1.4 });
  const headM = M('#ffffff', { emissive: '#e8f1ff', emissiveIntensity: 1.2 });
  const tailM = M('#c0182f', { emissive: '#7a0a18', emissiveIntensity: 0.8 });
  const stripeA = M('#b5233a', { roughness: 0.4 });
  const stripeB = M('#2b2d33', { roughness: 0.4 });
  const glass = new T.MeshPhysicalMaterial({ color: '#9fb6c6', transparent: true, opacity: 0.18, roughness: 0.05, metalness: 0, side: T.DoubleSide, depthWrite: false });
  mats.push(glass);

  const add = (geo, mat, x, y, z, parent) => { const m = new T.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; (parent || g).add(m); return m; };
  const box = (w, h, d, mat, x, y, z, parent) => add(new T.BoxGeometry(w, h, d), mat, x, y, z, parent);

  const L = c.L, W = c.W, H = c.H, half = L / 2, rearZ = -half;
  const pop = c.kind === 'pop';
  const sillY = 0.34, floorY = 0.56, wheelR = pop ? 0.33 : 0.36;
  const bonnetLen = pop ? 0.62 : 0.78, bonnetH = pop ? 1.05 : 1.12;
  const wsBaseZ = half - bonnetLen;
  const wsTopY = pop ? H - 0.1 : 2.02;
  const wsRun = pop ? 0.62 : 0.78;
  const wsTopZ = wsBaseZ - wsRun;
  const capRun = H - wsTopY > 0.2 ? 0.42 : 0.04;
  const roofFrontZ = wsTopZ - capRun;
  const fAx = half - (pop ? 0.8 : 0.9);
  const rAx = rearZ + c.rearAxle;
  const archR = wheelR + 0.08;
  const archY = sillY + 0.02;
  const cabDoorRear = wsBaseZ - (pop ? 0.95 : 1.0);
  const lerp2 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

  // ---- side profile with wheel arches
  const outline = () => {
    const s = new T.Shape();
    s.moveTo(rearZ, archY);
    s.lineTo(rAx - archR, archY);
    s.absarc(rAx, archY, archR, Math.PI, 0, true);
    s.lineTo(fAx - archR, archY);
    s.absarc(fAx, archY, archR, Math.PI, 0, true);
    s.lineTo(half, archY);
    s.lineTo(half, bonnetH - 0.16);
    s.quadraticCurveTo(half, bonnetH, half - 0.18, bonnetH);
    s.lineTo(wsBaseZ, bonnetH);
    s.lineTo(wsTopZ, wsTopY);
    if (capRun > 0.1) s.quadraticCurveTo(wsTopZ - 0.06, H, roofFrontZ, H); else s.lineTo(roofFrontZ, H);
    s.lineTo(rearZ + 0.08, H);
    s.quadraticCurveTo(rearZ, H, rearZ, H - 0.08);
    s.lineTo(rearZ, archY);
    return s;
  };
  const rect = (z0, z1, y0, y1) => [[z0, y0], [z1, y0], [z1, y1], [z0, y1]];
  const cabWin = () => {
    const a = [wsBaseZ, bonnetH], b = [wsTopZ, wsTopY];
    const p1 = lerp2(a, b, 0.14), p2 = lerp2(a, b, 0.86);
    return [[cabDoorRear + 0.08, bonnetH + 0.14], [p1[0] - 0.1, bonnetH + 0.14], [p2[0] - 0.1, Math.min(p2[1], wsTopY - 0.12)], [cabDoorRear + 0.08, Math.min(p2[1], wsTopY - 0.12)]];
  };
  const winY0 = pop ? 1.12 : 1.3, winY1 = pop ? 1.62 : 1.82;
  const livingWins = (side) => {
    const w = [];
    if (pop) { w.push(rect(rearZ + 0.45, cabDoorRear - 0.12, winY0, winY1)); return w; }
    const mid = (rearZ + cabDoorRear) / 2;
    if (side > 0) w.push(rect(cabDoorRear - 1.05, cabDoorRear - 0.2, winY0, winY1));
    w.push(rect(rearZ + 0.35, rearZ + 1.15, winY0 + 0.05, winY1));
    if (c.stripes && side < 0) w.push(rect(mid - 0.35, mid + 0.35, winY0, winY1));
    return w;
  };
  const toPath = (pts, Ctor) => { const p = new Ctor(); p.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) p.lineTo(pts[i][0], pts[i][1]); p.closePath ? p.closePath() : null; return p; };

  const sideMesh = (shape, depth, mat, x) => {
    const geo = new T.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 18 });
    geo.rotateY(-Math.PI / 2);
    return add(geo, mat, x, 0, 0);
  };
  [-1, 1].forEach((side) => {
    const holes = [cabWin()].concat(livingWins(side));
    const s = outline();
    holes.forEach((h) => s.holes.push(toPath(h, T.Path)));
    sideMesh(s, 0.035, paint, side > 0 ? W / 2 : -W / 2 + 0.035);
    // interior lining behind the cab
    const lin = toPath(rect(rearZ + 0.03, cabDoorRear, floorY, H - 0.05), T.Shape);
    livingWins(side).forEach((h) => lin.holes.push(toPath(h, T.Path)));
    sideMesh(lin, 0.015, lining, side > 0 ? W / 2 - 0.04 : -W / 2 + 0.055);
    // glass
    holes.forEach((h) => { const sg = new T.ShapeGeometry(toPath(h, T.Shape)); sg.rotateY(-Math.PI / 2); const m = add(sg, glass, side > 0 ? W / 2 - 0.017 : -W / 2 + 0.017, 0, 0); m.castShadow = false; });
    // mirror
    box(0.07, 0.24, 0.16, trim, side * (W / 2 + 0.13), bonnetH + 0.33, wsBaseZ - 0.12);
    box(0.16, 0.04, 0.05, trim, side * (W / 2 + 0.06), bonnetH + 0.25, wsBaseZ - 0.12);
    // side rubbing strip
    box(0.02, 0.07, L - 1.4, trim, side * (W / 2 + 0.005), sillY + 0.16, -0.25);
    if (c.stripes) {
      box(0.012, 0.09, L - bonnetLen - 0.6, stripeA, side * (W / 2 + 0.006), 1.02, -bonnetLen / 2 + 0.05);
      box(0.012, 0.04, L - bonnetLen - 0.9, stripeB, side * (W / 2 + 0.006), 1.12, -bonnetLen / 2 - 0.1);
    }
  });

  // ---- roof, bonnet, nose, floor, bumpers, lights
  const popRear = rearZ + 0.38, popFront = roofFrontZ - 0.06;
  if (pop) {
    box(W, 0.05, popRear - rearZ, paint, 0, H - 0.025, (rearZ + popRear) / 2);
    box(W, 0.05, roofFrontZ - popFront + 0.02, paint, 0, H - 0.025, (popFront + roofFrontZ) / 2);
    box(0.08, 0.05, popFront - popRear, paint, W / 2 - 0.04, H - 0.025, (popRear + popFront) / 2);
    box(0.08, 0.05, popFront - popRear, paint, -W / 2 + 0.04, H - 0.025, (popRear + popFront) / 2);
    // raised wedge
    const rise = 0.62, len = popFront - popRear;
    const lid = box(W - 0.06, 0.05, Math.hypot(len, rise), paint, 0, H + rise / 2 + 0.02, (popRear + popFront) / 2);
    lid.rotation.x = -Math.atan2(rise, len);
    [-1, 1].forEach((side) => {
      const tri = new T.BufferGeometry();
      const x = side * (W / 2 - 0.06);
      tri.setAttribute('position', new T.Float32BufferAttribute([x, H, popRear, x, H, popFront, x, H + rise, popFront], 3));
      tri.computeVertexNormals();
      add(tri, canvasM, 0, 0, 0);
      const win = box(0.01, 0.22, 0.6, glass, x + side * 0.003, H + 0.25, popFront - 0.45); win.castShadow = false;
    });
    box(W - 0.12, rise, 0.01, canvasM, 0, H + rise / 2, popFront);
    box(W - 0.1, 0.02, popFront - popRear - 0.1, ceiling, 0, H + rise * 0.5, (popRear + popFront) / 2 + 0.05).rotation.x = -Math.atan2(rise, len);
  } else {
    box(W, 0.05, roofFrontZ - rearZ, paint, 0, H - 0.025, (rearZ + roofFrontZ) / 2);
    if (capRun > 0.1) {
      const dy = H - wsTopY, dz = -capRun, ln = Math.hypot(dy, dz);
      const cap = box(W, 0.05, ln, paint, 0, (H + wsTopY) / 2, (wsTopZ + roofFrontZ) / 2);
      cap.rotation.x = Math.atan2(dy, capRun);
    }
    box(W - 0.1, 0.02, roofFrontZ - rearZ - 0.06, ceiling, 0, H - 0.07, (rearZ + roofFrontZ) / 2);
    // roof light
    box(0.5, 0.06, 0.5, trim, 0, H + 0.02, rearZ + 1.3);
  }
  // windscreen
  {
    const dy = wsTopY - bonnetH, len = Math.hypot(dy, wsRun);
    const ws = add(new T.PlaneGeometry(W - 0.14, len), glass, 0, (bonnetH + wsTopY) / 2, (wsBaseZ + wsTopZ) / 2);
    ws.rotation.x = -Math.atan2(wsRun, dy);
    ws.castShadow = false;
    [-1, 1].forEach((side) => { const p = box(0.07, len, 0.07, paint, side * (W / 2 - 0.035), (bonnetH + wsTopY) / 2, (wsBaseZ + wsTopZ) / 2); p.rotation.x = -Math.atan2(wsRun, dy); });
    box(W, 0.07, 0.07, paint, 0, wsTopY, wsTopZ);
  }
  box(W, 0.05, bonnetLen - 0.16, paint, 0, bonnetH - 0.02, wsBaseZ + (bonnetLen - 0.16) / 2);
  box(W, 0.05, 0.24, paint, 0, bonnetH - 0.08, half - 0.08).rotation.x = Math.PI / 4;
  box(W, bonnetH - sillY - 0.15, 0.06, paint, 0, (bonnetH + sillY) / 2 - 0.08, half - 0.03);
  box(W - 0.5, 0.2, 0.03, trim, 0, bonnetH - 0.33, half + 0.005);
  [-1, 1].forEach((side) => { box(0.3, 0.11, 0.03, headM, side * (W / 2 - 0.24), bonnetH - 0.26, half + 0.008); box(0.07, 0.42, 0.04, tailM, side * (W / 2 - 0.05), sillY + 0.62, rearZ - 0.01); });
  box(W + 0.03, 0.24, 0.16, trim, 0, sillY + 0.08, half - 0.02);
  box(W + 0.03, 0.22, 0.16, trim, 0, sillY + 0.08, rearZ + 0.04);
  box(0.52, 0.11, 0.02, white, 0, sillY + 0.1, half + 0.065);
  box(W - 0.06, 0.04, L - bonnetLen - 0.04, vinyl, 0, floorY - 0.02, rearZ + (L - bonnetLen) / 2);
  box(W - 0.6, floorY - sillY + 0.1, L - 0.4, trim, 0, (floorY + sillY) / 2 - 0.05, 0);
  // wheels
  const wheels = [];
  [fAx, rAx].forEach((z) => [-1, 1].forEach((side) => {
    const wg = new T.Group(); wg.position.set(side * (W / 2 - 0.15), wheelR, z); g.add(wg); wheels.push(wg);
    const t = add(new T.CylinderGeometry(wheelR, wheelR, 0.25, 32), tyre, 0, 0, 0, wg); t.rotation.z = Math.PI / 2;
    const h = add(new T.CylinderGeometry(wheelR * 0.58, wheelR * 0.58, 0.27, 24), hubM, 0, 0, 0, wg); h.rotation.z = Math.PI / 2;
    for (let k = 0; k < 5; k++) { const sp = box(0.03, wheelR * 1.0, 0.07, trim, side * 0.14, 0, 0, wg); sp.rotation.x = (k / 5) * Math.PI * 2; sp.geometry.translate(0, wheelR * 0.25, 0); }
    add(new T.CylinderGeometry(0.06, 0.06, 0.29, 12), trim, 0, 0, 0, wg).rotation.z = Math.PI / 2;
  }));

  // ---- rear doors
  const doors = [];
  const doorY0 = sillY + 0.2, doorY1 = H - 0.05;
  if (c.doors === 'barn') {
    [-1, 1].forEach((side) => {
      const pivot = new T.Group(); pivot.position.set(side * W / 2, 0, rearZ); g.add(pivot);
      const dw = W / 2 - 0.01, dir = -side;
      const wy0 = H - 0.95, wy1 = H - 0.35;
      box(dw, wy0 - doorY0, 0.04, paint, dir * dw / 2, (doorY0 + wy0) / 2, 0, pivot);
      box(dw, doorY1 - wy1, 0.04, paint, dir * dw / 2, (wy1 + doorY1) / 2, 0, pivot);
      box(0.12, wy1 - wy0, 0.04, paint, dir * 0.06, (wy0 + wy1) / 2, 0, pivot);
      box(0.12, wy1 - wy0, 0.04, paint, dir * (dw - 0.06), (wy0 + wy1) / 2, 0, pivot);
      const gl = box(dw - 0.24, wy1 - wy0, 0.01, glass, dir * dw / 2, (wy0 + wy1) / 2, 0, pivot); gl.castShadow = false;
      box(0.03, 0.18, 0.04, trim, dir * (dw - 0.1), 1.2, -0.04, pivot);
      doors.push({ pivot, axis: 'y', open: side < 0 ? 1.75 : -1.75 });
    });
  } else {
    const pivot = new T.Group(); pivot.position.set(0, H - 0.02, rearZ); g.add(pivot);
    const dh = H - 0.02 - doorY0, wy0 = -0.6 * dh, wy1 = -0.12;
    box(W - 0.02, 0.4 * dh, 0.05, paint, 0, -0.8 * dh, 0, pivot);
    box(W - 0.02, 0.12, 0.05, paint, 0, -0.06, 0, pivot);
    const gl = box(W - 0.3, wy1 - wy0, 0.01, glass, 0, (wy0 + wy1) / 2, 0, pivot); gl.castShadow = false;
    box(0.13, wy1 - wy0, 0.05, paint, W / 2 - 0.08, (wy0 + wy1) / 2, 0, pivot);
    box(0.13, wy1 - wy0, 0.05, paint, -W / 2 + 0.08, (wy0 + wy1) / 2, 0, pivot);
    doors.push({ pivot, axis: 'x', open: 1.35 });
  }

  // ---- cab interior
  const Wi = W - 0.14;
  const seatZ = wsBaseZ - (pop ? 0.82 : 0.95);
  box(Wi, 0.28, 0.55, trim, 0, bonnetH + 0.06, wsBaseZ - 0.22);
  box(0.42, 0.02, 0.2, M('#0e1626', { emissive: '#22406a', emissiveIntensity: 0.6 }), 0.15, bonnetH + 0.22, wsBaseZ - 0.42).rotation.x = -0.9;
  const wheel = add(new T.TorusGeometry(0.19, 0.025, 12, 40), trim, -0.45, bonnetH + 0.1, wsBaseZ - 0.6);
  wheel.rotation.x = -0.45;
  const col = box(0.06, 0.06, 0.35, trim, -0.45, bonnetH + 0.02, wsBaseZ - 0.44); col.rotation.x = 0.45;
  const seat = (x, z, rot) => {
    const s = new T.Group(); s.position.set(x, 0, z); s.rotation.y = rot; g.add(s);
    box(0.36, 0.34, 0.36, trim, 0, floorY + 0.17, 0, s);
    box(0.52, 0.14, 0.52, fabric, 0, floorY + 0.42, 0.02, s);
    const back = box(0.52, 0.72, 0.12, fabric, 0, floorY + 0.85, -0.24, s); back.rotation.x = -0.14;
    box(0.3, 0.2, 0.1, fabric, 0, floorY + 1.3, -0.3, s);
  };
  const swivel = false;
  seat(-0.45, seatZ, swivel ? Math.PI : 0);
  seat(0.45, seatZ, swivel ? Math.PI : 0);

  // ---- living area
  const livingFront = seatZ - 0.42;
  const res = { floorY, H, W, L, seatZ, rearZ, livingFront, pop };
  const lockers = (z0, z1, side) => box(0.36, 0.38, z1 - z0, wood, side * (Wi / 2 - 0.18), H - 0.3, (z0 + z1) / 2);
  const lamp = (x, z) => { const m = add(new T.CylinderGeometry(0.06, 0.06, 0.015, 16), lampM, x, (pop ? H : H) - 0.085, z); m.castShadow = false; };
  const pillows = (positions) => positions.forEach((p) => { const m = box(p[3] || 0.55, 0.12, p[4] || 0.38, sheet, p[0], p[1], p[2]); m.rotation.z = 0.02; });

  if (c.layout === 'rockroll') {
    const bedW = c.wideBed ? 1.45 : 1.22, bedTop = floorY + 0.46;
    const z0 = rearZ + 0.12, z1 = rearZ + 1.95;
    const bx = -Wi / 2 + bedW / 2;
    box(bedW, bedTop - floorY - 0.14, z1 - z0, fabric, bx, floorY + (bedTop - floorY - 0.14) / 2, (z0 + z1) / 2);
    box(bedW, 0.14, z1 - z0, sheet, bx, bedTop - 0.07, (z0 + z1) / 2);
    box(bedW - 0.06, 0.07, (z1 - z0) * 0.62, duvet, bx, bedTop + 0.02, z0 + (z1 - z0) * 0.31);
    box(bedW - 0.1, 0.04, 0.3, throwM, bx, bedTop + 0.07, z0 + 0.3);
    pillows([[bx - bedW / 4, bedTop + 0.05, z1 - 0.28, 0.5, 0.34], [bx + bedW / 4, bedTop + 0.05, z1 - 0.28, 0.5, 0.34]]);
    // side kitchen on the kerb (left, +x)
    const kx = Wi / 2 - 0.22, kz0 = Math.max(livingFront - 1.35, z1 + 0.02), kz1 = livingFront;
    box(0.44, 0.84, kz1 - kz0, wood, kx, floorY + 0.42, (kz0 + kz1) / 2);
    box(0.46, 0.03, kz1 - kz0 + 0.02, worktop, kx, floorY + 0.855, (kz0 + kz1) / 2);
    box(0.3, 0.02, 0.36, steel, kx, floorY + 0.875, kz0 + 0.35);
    [0, 1].forEach((i) => add(new T.CylinderGeometry(0.08, 0.08, 0.015, 20), trim, kx, floorY + 0.88, kz1 - 0.25 - i * 0.24));
    box(0.32, 0.3, kz1 - kz0, wood, Wi / 2 - 0.16, H - 0.25, (kz0 + kz1) / 2);
    Object.assign(res, {
      bed: { pos: [bx, bedTop + 0.38, z1 - 0.35], yaw: Math.PI },
      living: { pos: [-0.25, floorY + 1.45, livingFront - 0.25], yaw: Math.PI * 0.82, pitch: -0.22 }
    });
  } else {
    const garage = c.layout === 'northsouth' ? 0.72 : 0.92;
    const bedTop = floorY + garage + 0.18;
    let bedFront, bedPos;
    if (c.layout === 'northsouth') {
      const bw = 1.38, bl = 1.95, bx = Wi / 2 - bw / 2, z0 = rearZ + 0.08, z1 = z0 + bl;
      box(bw, garage, bl, wood, bx, floorY + garage / 2, (z0 + z1) / 2);
      box(bw, 0.18, bl, sheet, bx, bedTop - 0.09, (z0 + z1) / 2);
      box(bw - 0.06, 0.08, bl * 0.66, duvet, bx, bedTop + 0.03, z0 + bl * 0.33);
      box(bw - 0.1, 0.04, 0.32, throwM, bx, bedTop + 0.08, z0 + 0.35);
      pillows([[bx - 0.32, bedTop + 0.05, z1 - 0.25], [bx + 0.32, bedTop + 0.05, z1 - 0.25]]);
      box(0.45, 0.72, 0.55, wood, -Wi / 2 + 0.23, floorY + 0.36, z0 + 0.3);
      bedFront = z1; bedPos = { pos: [bx, bedTop + 0.42, z1 - 0.3], yaw: Math.PI, pitch: -0.12 };
    } else {
      const d = c.bedDepth || 1.4, z0 = rearZ + 0.08, z1 = z0 + d;
      box(Wi, garage, d, wood, 0, floorY + garage / 2, (z0 + z1) / 2);
      box(Wi, 0.18, d, sheet, 0, bedTop - 0.09, (z0 + z1) / 2);
      box(Wi - 0.6, 0.08, d - 0.08, duvet, 0.27, bedTop + 0.03, (z0 + z1) / 2);
      box(0.3, 0.04, d - 0.1, throwM, Wi / 2 - 0.25, bedTop + 0.08, (z0 + z1) / 2);
      const px = -Wi / 2 + 0.3;
      pillows([[px, bedTop + 0.05, z0 + d * 0.28, 0.38, 0.55], [px, bedTop + 0.05, z0 + d * 0.72, 0.38, 0.55]]);
      bedFront = z1; bedPos = { pos: [-0.35, bedTop + 0.4, z1 - 0.1], yaw: Math.PI * 0.94, pitch: -0.14 };
    }
    // kitchen and bathroom just ahead of the bed
    const kSide = c.layout === 'northsouth' ? -1 : 1;
    const kz0 = bedFront + 0.04, kz1 = Math.min(kz0 + 1.25, livingFront - (c.dinette ? 0.9 : 0.1));
    const kx = kSide * (Wi / 2 - 0.28);
    box(0.56, 0.9, kz1 - kz0, wood, kx, floorY + 0.45, (kz0 + kz1) / 2);
    box(0.58, 0.035, kz1 - kz0 + 0.02, worktop, kx, floorY + 0.915, (kz0 + kz1) / 2);
    box(0.34, 0.02, 0.4, steel, kx, floorY + 0.94, kz0 + 0.3);
    add(new T.CylinderGeometry(0.015, 0.015, 0.28, 8), steel, kx + kSide * 0.18, floorY + 1.06, kz0 + 0.3);
    [0, 1].forEach((i) => add(new T.CylinderGeometry(0.085, 0.085, 0.015, 20), trim, kx, floorY + 0.94, kz1 - 0.24 - i * 0.26));
    box(0.02, 0.5, 0.48, M('#9aa0a8', { roughness: 0.3, metalness: 0.5 }), kx - kSide * 0.29, floorY + 0.3, (kz0 + kz1) / 2);
    if (c.bath) {
      const bs = -kSide, bz0 = kz0, bz1 = kz0 + 0.9, bh = H - floorY - 0.1, bx = bs * (Wi / 2 - 0.42);
      box(0.84, bh, bz1 - bz0, white, bx, floorY + bh / 2, (bz0 + bz1) / 2);
      box(0.012, bh - 0.25, 0.62, M('#e7e5e0', { roughness: 0.6 }), bx - bs * 0.425, floorY + (bh - 0.25) / 2 + 0.08, (bz0 + bz1) / 2);
      box(0.03, 0.14, 0.03, steel, bx - bs * 0.44, floorY + 1.0, bz0 + 0.18);
    }
    if (c.dinette) {
      const tz = livingFront - 0.5;
      box(0.62, 0.035, 0.75, wood, 0.42, floorY + 0.72, tz);
      box(0.06, 0.7, 0.06, steel, 0.42, floorY + 0.36, tz);
      box(0.9, 0.42, 0.45, fabric, 0.45, floorY + 0.21, tz - 0.62);
      const bb = box(0.9, 0.55, 0.12, fabric, 0.45, floorY + 0.68, tz - 0.8); bb.rotation.x = 0.1;
    }
    lockers(rearZ + 0.1, kz1, 1); lockers(rearZ + 0.1, kz1, -1);
    lamp(0, rearZ + 0.9); lamp(0, (kz0 + kz1) / 2); lamp(0, livingFront - 0.4);
    Object.assign(res, {
      bed: bedPos,
      living: { pos: [-0.05, floorY + 1.6, livingFront - 0.15], yaw: Math.PI, pitch: -0.2 }
    });
  }
  res.driver = { pos: [-0.45, floorY + 1.16, seatZ - 0.24], yaw: 0, pitch: -0.06 };
  res.passenger = { pos: [0.45, floorY + 1.16, seatZ - 0.24], yaw: 0.35, pitch: -0.06 };
  res.lights = [[0, H - 0.25, rearZ + 1.0], [0, H - 0.25, livingFront - 0.6]];
  res.group = g; res.doors = doors; res.mats = mats; res.wheels = wheels;
  return res;
}

class Component extends DCLogic {
  constructor(props) {
    super(props);
    const hero = props.hero === 'true' || props.hero === true;
    this.hero = hero;
    this.state = { van: props.van || 'man-lwb-auto', view: hero ? 'drive' : 'outside', scenery: 'highlands', noGL: false };
    this.canvasRef = (el) => this.mount(el);
    this.v = null;
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.van && this.props.van !== prevProps.van && this.props.van !== this.state.van) this.setState({ van: this.props.van });
    if (!this.v) return;
    if (prevState.van !== this.state.van) this.loadVan(this.state.van);
    if (prevState.scenery !== this.state.scenery) this.loadScenery(this.state.scenery);
    if (prevState.view !== this.state.view) this.setView(this.state.view);
  }
  componentWillUnmount() { this.destroy(); }

  mount(el) {
    if (!el || (this.v && this.v.canvas === el)) return;
    const T = window.THREE;
    if (!T) { this.setState({ noGL: true }); return; }
    let renderer;
    try { renderer = new T.WebGLRenderer({ canvas: el, antialias: true }); } catch (e) { this.setState({ noGL: true }); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.useLegacyLights = true;
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFSoftShadowMap;

    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(45, 16 / 9, 0.03, 400);
    scene.add(new T.HemisphereLight(0xffffff, 0x5a5440, 0.95));
    scene.add(new T.AmbientLight(0xffffff, 0.12));
    const sun = new T.DirectionalLight(0xfff0dc, 1.25);
    sun.position.set(7, 12, 9); sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -7, right: 7, top: 7, bottom: -7, near: 1, far: 40 });
    sun.shadow.bias = -0.0004;
    scene.add(sun);
    const inner = [new T.PointLight(0xffe6c4, 0.75, 4.5, 1), new T.PointLight(0xffe6c4, 0.75, 4.5, 1)];
    inner.forEach((l) => scene.add(l));

    const R = 58, PH = 44;
    const panoMat = new T.MeshBasicMaterial({ side: T.BackSide, color: 0xffffff });
    const pano = new T.Mesh(new T.CylinderGeometry(R, R, PH, 96, 1, true), panoMat);
    pano.position.y = PH / 2 - 3.5; scene.add(pano);
    const groundMat = new T.MeshStandardMaterial({ color: '#55603f', roughness: 1 });
    const ground = new T.Mesh(new T.CircleGeometry(R + 1, 64), groundMat);
    ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
    const road = new T.Group();
    const roadMat = new T.MeshStandardMaterial({ color: '#3a3b3f', roughness: 0.95 });
    const r = new T.Mesh(new T.PlaneGeometry(4.2, 2 * R), roadMat); r.rotation.x = -Math.PI / 2; r.position.y = 0.004; r.receiveShadow = true; road.add(r);
    const dashMat = new T.MeshStandardMaterial({ color: '#e9e6dc', roughness: 0.8 });
    const dashes = new T.Group(); road.add(dashes);
    for (let z = -R + 2; z < R; z += 5) { const d = new T.Mesh(new T.PlaneGeometry(0.12, 2), dashMat); d.rotation.x = -Math.PI / 2; d.position.set(0, 0.006, z); dashes.add(d); }
    scene.add(road);

    this.v = {
      T, canvas: el, renderer, scene, camera, sun, inner, panoMat, groundMat, road, dashes, van: null, textures: {}, offX: 0, offY: 0,
      mode: 'outside', theta: 0.85, phi: 1.22, radius: 11, yaw: 0, pitch: 0, fov: 45,
      look: new T.Vector3(0, 1.2, 0), lastInteract: 0, doorT: 0, running: true, raf: 0, last: performance.now(), pointers: new Map()
    };
    this.bindInput(el);
    this.loadScenery(this.state.scenery);
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
    Object.values(v.textures).forEach((t) => t.dispose());
    v.renderer.dispose();
    this.v = null;
  }

  disposeVan() {
    const v = this.v; if (!v || !v.van) return;
    v.scene.remove(v.van.group);
    v.van.group.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
    v.van.mats.forEach((m) => m.dispose());
    v.van = null;
  }

  loadVan(id) {
    const v = this.v; if (!v) return;
    this.disposeVan();
    v.van = buildVan(v.T, VAN_SPECS[id] || VAN_SPECS['man-lwb-auto']);
    v.scene.add(v.van.group);
    v.van.lights.forEach((p, i) => v.inner[i].position.set(p[0], p[1], p[2]));
    v.doorT = 0;
    this.setView(this.state.view, true);
  }

  loadScenery(key) {
    const v = this.v; if (!v) return;
    const s = SCENERY[key] || SCENERY.highlands, T = v.T;
    v.groundMat.color.set(s.ground);
    v.scene.background = new T.Color(s.sky);
    v.road.visible = !!s.road;
    const apply = (tex) => { v.panoMat.map = tex; v.panoMat.needsUpdate = true; };
    if (v.textures[key]) { apply(v.textures[key]); return; }
    new T.TextureLoader().load(s.img, (tex) => {
      tex.colorSpace = T.SRGBColorSpace; tex.wrapS = T.MirroredRepeatWrapping; tex.repeat.set(4, 1);
      tex.anisotropy = Math.min(8, v.renderer.capabilities.getMaxAnisotropy());
      if (!this.v) { tex.dispose(); return; }
      v.textures[key] = tex;
      if (this.state.scenery === key) apply(tex);
    });
  }

  setView(mode, snap) {
    const v = this.v; if (!v || !v.van) return;
    v.mode = mode;
    if (mode === 'outside') {
      v.radius = v.van.L * 1.25 + 3; v.phi = 1.25; v.fov = 42;
    } else if (mode === 'drive') {
      v.fov = 30;
    } else {
      const p = v.van[mode]; if (!p) return;
      v.yaw = p.yaw || 0; v.pitch = p.pitch || 0; v.fov = 72;
    }
    if (snap) { const t = this.target(); v.camera.position.copy(t.pos); v.look.copy(t.look); v.camera.fov = v.fov; const o = this.offsetTarget(); v.offX = o[0]; v.offY = o[1]; v.camera.updateProjectionMatrix(); }
  }

  target() {
    const v = this.v, T = v.T;
    if (v.mode === 'outside') {
      const c = new T.Vector3(0, v.van.H * 0.45, 0);
      const pos = new T.Vector3(c.x + v.radius * Math.sin(v.phi) * Math.sin(v.theta), c.y + v.radius * Math.cos(v.phi), c.z + v.radius * Math.sin(v.phi) * Math.cos(v.theta));
      if (pos.y < 0.4) pos.y = 0.4;
      return { pos, look: c };
    }
    if (v.mode === 'drive') {
      const c = new T.Vector3(0, v.van.H * 0.42, 0.2), th = 0.92, el = 0.1, d = v.van.L * 1.55 + 4.5;
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
    return w / h > 1.15 ? [-0.2, 0.04] : [0, 0.2];
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
    const t0 = now / 1000, driving = v.mode === 'drive';
    const ease = 1 - Math.exp(-dt * 4);
    const g = v.van.group;
    if (driving) {
      g.position.y = 0.014 * Math.sin(t0 * 8.3) + 0.007 * Math.sin(t0 * 13.7 + 1.3);
      g.rotation.x = 0.0045 * Math.sin(t0 * 6.1);
      g.rotation.z = 0.003 * Math.sin(t0 * 4.7 + 0.5);
      v.van.wheels.forEach((w) => { w.rotation.x += dt * 9; });
      v.dashes.position.z = -((t0 * 8) % 5);
    } else {
      g.position.y += (0 - g.position.y) * ease; g.rotation.x += (0 - g.rotation.x) * ease; g.rotation.z += (0 - g.rotation.z) * ease;
    }
    const ot = this.offsetTarget();
    v.offX += (ot[0] - v.offX) * ease; v.offY += (ot[1] - v.offY) * ease;
    const cw = v.canvas.clientWidth || 800, chh = v.canvas.clientHeight || 450;
    if (Math.abs(v.offX) > 0.001 || Math.abs(v.offY) > 0.001) v.camera.setViewOffset(cw, chh, v.offX * cw, v.offY * chh, cw, chh); else v.camera.clearViewOffset();
    const t = this.target(), k = 1 - Math.exp(-dt * 5);
    v.camera.position.lerp(t.pos, k);
    v.look.lerp(t.look, k);
    v.camera.lookAt(v.look);
    if (Math.abs(v.camera.fov - v.fov) > 0.05) { v.camera.fov += (v.fov - v.camera.fov) * k; v.camera.updateProjectionMatrix(); }
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
      enterInside: () => this.setState({ view: 'driver' }),
      exitInside: () => this.setState({ view: 'drive' }),
      canvasRef: this.canvasRef,
      noGL: s.noGL,
      showPicker: this.props.picker !== 'false',
      van: s.van,
      vanName: spec.name,
      viewLabel,
      hint: s.view === 'outside' ? 'Drag to walk around · scroll or pinch to zoom' : 'Drag to look around · scroll or pinch to zoom',
      ariaLabel: '3D model of the ' + spec.name + ', ' + viewLabel.toLowerCase() + ' view, in the Scottish Highlands',
      vanOptions: VAN_ORDER.map((id) => ({ id, name: VAN_SPECS[id].name })),
      pickVan: (e) => this.setState({ van: e.target.value }),
      views: VIEWS.filter((x) => viewIds.includes(x[0])).map(([id, label]) => ({ label, pressed: s.view === id ? 'true' : 'false', cls: s.view === id ? (hero ? hOn : on) : (hero ? hOff : off), pick: () => this.setState({ view: id }) }))
    };
  }
}

return Component;
})();
