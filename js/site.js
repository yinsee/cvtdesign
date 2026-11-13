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
      { href: 'van-t5-spacious.html', name: 'VW T5 Spacious', tag: 'Pop-top · 4 berth', spec: 'Automatic · Double bed · Kitchen', img: 'assets/v-t5-spacious.jpg', alt: 'Grey VW T5 campervan with pop-top raised at sunset' },
      { href: 'van-toleno.html', name: 'Toleno R', tag: 'Two double beds', spec: 'Manual · Bathroom · Dining', img: 'assets/v-toleno.jpg', alt: 'White Toleno R campervan on a woodland road' },
      { href: 'van-crafter-auto.html', name: 'VW Crafter LWB', tag: 'Room for four', spec: 'Automatic · Bathroom · Kitchen', img: 'assets/v-crafter-auto.jpg', alt: 'White VW Crafter campervan above a beach' },
      { href: 'van-man-mwb.html', name: 'MAN TGE MWB', tag: 'Extra-wide bed', spec: 'Automatic · Bathroom · 2 berth', img: 'assets/v-man-mwb.jpg', alt: 'Grey MAN TGE campervan parked in farmland' }
    ];
    const routes = [
      { href: 'route-nc500.html', name: 'North Coast 500', region: 'Scotland', line: 'Mountain roads and wild coastline', img: 'assets/nc500.jpg', alt: 'Kylesku Bridge over a Highland loch' },
      { href: 'route-wales.html', name: 'Snowdonia & Castles', region: 'Wales', line: 'Mountains, waterfalls, great castles', img: 'assets/wales.jpg', alt: 'Caernarfon Castle lit at sunset' },
      { href: 'route-york.html', name: 'York & the Moors', region: 'Yorkshire', line: 'Abbeys, moorland and coast', img: 'assets/whitby.jpg', alt: 'Whitby Abbey ruins under a blue sky' },
      { href: 'route-cornwall.html', name: 'Cornwall', region: 'South West', line: 'Fishing villages and rocky coves', img: 'assets/cornwall.jpg', alt: 'Red hot pokers above a Cornish cove' },
      { href: 'route-causeway.html', name: 'Causeway Coast', region: 'Northern Ireland', line: 'Natural wonders and castles', img: 'assets/causeway.jpg', alt: 'Basalt columns of the Giant’s Causeway' },
      { href: 'route-edinburgh.html', name: 'Edinburgh & Loch Ness', region: 'Scotland', line: 'Castles, lochs and Highlands', img: 'assets/edinburgh.jpg', alt: 'Edinburgh skyline from Calton Hill' }
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
      { name: 'MAN TGE LWB Luxury', berth: 2, gear: 'Automatic', bathroom: true, roof: 'Fixed roof', badge: 'Luxury', features: 'North–south double bed, kitchen and bathroom.', href: 'van-man-lwb-auto.html', img: 'assets/v-man-lwb-auto.jpg', alt: 'Grey MAN TGE campervan in front of snowy mountains' },
      { name: 'MAN TGE LWB Luxury', berth: 2, gear: 'Manual', bathroom: true, roof: 'Fixed roof', badge: 'Luxury', features: 'Extra-plush double bed, bathroom, kitchen and generous living space.', href: 'van-man-lwb-manual.html', img: 'assets/v-man-lwb-manual.jpg', alt: 'Grey MAN TGE campervan parked by trees' },
      { name: 'MAN TGE MWB', berth: 2, gear: 'Automatic', bathroom: true, roof: 'Fixed roof', badge: 'Premium', features: 'Extra-wide bed, bathroom and kitchen. Easier to park.', href: 'van-man-mwb.html', img: 'assets/v-man-mwb.jpg', alt: 'Grey MAN TGE campervan in farmland' },
      { name: 'VW Crafter LWB', berth: 4, gear: 'Automatic', bathroom: true, roof: 'Fixed roof', badge: 'Premium', features: 'Two beds, bathroom, kitchen and dining area.', href: 'van-crafter-auto.html', img: 'assets/v-crafter-auto.jpg', alt: 'White VW Crafter campervan above a beach' },
      { name: 'VW Crafter LWB', berth: 4, gear: 'Manual', bathroom: true, roof: 'Fixed roof', badge: '', features: 'Bathroom, kitchen, dining area and TV. Room to spread out.', href: 'van-crafter-manual.html', img: 'assets/v-crafter-manual.jpg', alt: 'Silver VW Crafter campervan among olive trees' },
      { name: 'Toleno R', berth: 4, gear: 'Manual', bathroom: true, roof: 'Fixed roof', badge: 'Premium', features: 'Two double beds, bathroom, kitchen, dining area and TV.', href: 'van-toleno.html', img: 'assets/v-toleno.jpg', alt: 'White Toleno R campervan on a woodland road' },
      { name: 'VW T5 Spacious', berth: 4, gear: 'Automatic', bathroom: false, roof: 'Pop-top', badge: '', features: 'Pop-top roof, double bed, kitchen and microwave.', href: 'van-t5-spacious.html', img: 'assets/v-t5-spacious.jpg', alt: 'Grey VW T5 campervan with pop-top raised' },
      { name: 'VW T5 Wide Bed', berth: 4, gear: 'Automatic', bathroom: false, roof: 'Pop-top', badge: '', features: 'Pop-top roof, side kitchen and a wide double bed.', href: 'van-t5-widebed.html', img: 'assets/v-t5-widebed.jpg', alt: 'Silver VW T5 campervan with pop-top on a country lane' },
      { name: 'VW T5 Compact', berth: 4, gear: 'Automatic', bathroom: false, roof: 'Pop-top', badge: '', features: 'Pop-top, side kitchen and double bed. Nimble on country lanes.', href: 'van-t5-compact.html', img: 'assets/v-t5-compact.jpg', alt: 'White VW T5 campervan on a clifftop campsite' }
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

DC["Routes"] = (function () {

class Component extends DCLogic {
  constructor(props) { super(props); this.state = { region: 'all' }; }
  renderVals() {
    const ROUTES = [
      { href: 'route-nc500.html', name: 'North Coast 500 & Orkney', r: 'scotland', region: 'Scotland', line: 'Mountain roads, dramatic coast, ocean views.', img: 'assets/nc500.jpg', alt: 'Kylesku Bridge over a Highland loch' },
      { href: 'route-hebrides.html', name: 'Hebridean Island Hopping', r: 'scotland', region: 'Scotland', line: 'Wild islands, history and whisky.', img: 'assets/hebrides.jpg', alt: 'Hebridean beach with dune grass' },
      { href: 'route-edinburgh.html', name: 'Edinburgh, Loch Ness & the Highlands', r: 'scotland', region: 'Scotland', line: 'Lochs, castles and waterfalls.', img: 'assets/edinburgh.jpg', alt: 'Edinburgh at sunrise' },
      { href: 'route-wales.html', name: 'North Wales, Snowdonia, Castles & Coast', r: 'wales', region: 'Wales', line: 'Mountains, waterfalls and great castles.', img: 'assets/wales.jpg', alt: 'Caernarfon Castle lit at dusk' },
      { href: 'route-lakes.html', name: 'The Lake District Meres & Mountains', r: 'england', region: 'England', line: 'Lakes, hidden valleys, stone villages.', img: 'assets/lakes.jpg', alt: 'Windermere jetty at sunset' },
      { href: 'route-york.html', name: 'York & the North York Moors', r: 'england', region: 'England', line: 'Moorland, abbeys and coastline.', img: 'assets/whitby.jpg', alt: 'Whitby Abbey' },
      { href: 'route-cotswolds.html', name: 'The Cotswolds Villages & Gardens', r: 'england', region: 'England', line: 'Honey-stone villages and gardens.', img: 'assets/cotswolds.jpg', alt: 'Cotswold cottages by a stream' },
      { href: 'route-cornwall.html', name: 'Cornwall', r: 'england', region: 'England', line: 'Fishing villages and rocky coves.', img: 'assets/cornwall.jpg', alt: 'Flowers above a Cornish cove' },
      { href: 'route-dorset.html', name: 'Dorset & the Jurassic Coast', r: 'england', region: 'England', line: 'Prehistoric sites and coastal walks.', img: 'assets/durdle.jpg', alt: 'Durdle Door' },
      { href: 'route-causeway.html', name: 'Northern Ireland: Coast & Castles', r: 'ireland', region: 'Northern Ireland', line: 'Natural wonders and emerald hills.', img: 'assets/causeway.jpg', alt: 'Giant’s Causeway' },
      { href: 'route-belgium.html', name: 'Belgium: Medieval Towns & the Great War', r: 'europe', region: 'Europe', line: 'Canals, battlefields, Belgian beer.', img: 'assets/bruges.jpg', alt: 'Bruges market square at dusk' }
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

DC["Van"] = (function () {

class Component extends DCLogic {
  constructor(props) { super(props); this.state = { i: 0, playing: true }; this.video = null; }
  renderVals() {
    const PHOTOS = [
      { src: 'assets/v-man-lwb-auto.jpg', alt: "MAN TGE campervan in front of snowy mountains" },
      { src: 'assets/man-cab-golden.jpg', alt: "Cab and front seats at golden hour" },
      { src: 'assets/man-interior.jpg', alt: "Bed and kitchen inside the campervan" },
      { src: 'assets/man-cab.jpg', alt: "Dashboard, steering wheel and navigation screen" },
      { src: 'assets/man-rear.jpg', alt: "Rear view of the campervan on a country lane" }
    ];
    const on = 'aspect-[4/3] w-full overflow-hidden rounded-xl ring-4 ring-brand';
    const off = 'aspect-[4/3] w-full overflow-hidden rounded-xl opacity-80 ring-1 ring-plum/10 hover:opacity-100';
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

DC["Van-man-lwb-manual"] = (function () {

class Component extends DCLogic {
  constructor(props) { super(props); this.state = { i: 0, playing: true }; this.video = null; }
  renderVals() {
    const PHOTOS = [
      { src: 'assets/v-man-lwb-manual.jpg', alt: "Grey MAN TGE campervan parked by trees" },
      { src: 'assets/man-cab-golden.jpg', alt: "Cab and front seats at golden hour" },
      { src: 'assets/man-cab.jpg', alt: "Dashboard and steering wheel" }
    ];
    const on = 'aspect-[4/3] w-full overflow-hidden rounded-xl ring-4 ring-brand';
    const off = 'aspect-[4/3] w-full overflow-hidden rounded-xl opacity-80 ring-1 ring-plum/10 hover:opacity-100';
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

DC["Van-man-mwb"] = (function () {

class Component extends DCLogic {
  constructor(props) { super(props); this.state = { i: 0, playing: true }; this.video = null; }
  renderVals() {
    const PHOTOS = [
      { src: 'assets/v-man-mwb.jpg', alt: "Grey MAN TGE campervan in farmland" },
      { src: 'assets/man-cab.jpg', alt: "Dashboard and steering wheel" }
    ];
    const on = 'aspect-[4/3] w-full overflow-hidden rounded-xl ring-4 ring-brand';
    const off = 'aspect-[4/3] w-full overflow-hidden rounded-xl opacity-80 ring-1 ring-plum/10 hover:opacity-100';
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

DC["Van-crafter-auto"] = (function () {

class Component extends DCLogic {
  constructor(props) { super(props); this.state = { i: 0, playing: true }; this.video = null; }
  renderVals() {
    const PHOTOS = [
      { src: 'assets/v-crafter-auto.jpg', alt: "White VW Crafter campervan above a beach" }
    ];
    const on = 'aspect-[4/3] w-full overflow-hidden rounded-xl ring-4 ring-brand';
    const off = 'aspect-[4/3] w-full overflow-hidden rounded-xl opacity-80 ring-1 ring-plum/10 hover:opacity-100';
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

DC["Van-crafter-manual"] = (function () {

class Component extends DCLogic {
  constructor(props) { super(props); this.state = { i: 0, playing: true }; this.video = null; }
  renderVals() {
    const PHOTOS = [
      { src: 'assets/v-crafter-manual.jpg', alt: "Silver VW Crafter campervan among olive trees" }
    ];
    const on = 'aspect-[4/3] w-full overflow-hidden rounded-xl ring-4 ring-brand';
    const off = 'aspect-[4/3] w-full overflow-hidden rounded-xl opacity-80 ring-1 ring-plum/10 hover:opacity-100';
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

DC["Van-toleno"] = (function () {

class Component extends DCLogic {
  constructor(props) { super(props); this.state = { i: 0, playing: true }; this.video = null; }
  renderVals() {
    const PHOTOS = [
      { src: 'assets/v-toleno.jpg', alt: "White Toleno R campervan on a woodland road" },
      { src: 'assets/toleno-door.jpg', alt: "Open side door showing the kitchen and dining area" },
      { src: 'assets/toleno-bed.jpg', alt: "Bed looking out through open rear doors" }
    ];
    const on = 'aspect-[4/3] w-full overflow-hidden rounded-xl ring-4 ring-brand';
    const off = 'aspect-[4/3] w-full overflow-hidden rounded-xl opacity-80 ring-1 ring-plum/10 hover:opacity-100';
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

DC["Van-t5-spacious"] = (function () {

class Component extends DCLogic {
  constructor(props) { super(props); this.state = { i: 0, playing: true }; this.video = null; }
  renderVals() {
    const PHOTOS = [
      { src: 'assets/v-t5-spacious.jpg', alt: "Grey VW T5 campervan with pop-top raised" }
    ];
    const on = 'aspect-[4/3] w-full overflow-hidden rounded-xl ring-4 ring-brand';
    const off = 'aspect-[4/3] w-full overflow-hidden rounded-xl opacity-80 ring-1 ring-plum/10 hover:opacity-100';
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

DC["Van-t5-widebed"] = (function () {

class Component extends DCLogic {
  constructor(props) { super(props); this.state = { i: 0, playing: true }; this.video = null; }
  renderVals() {
    const PHOTOS = [
      { src: 'assets/v-t5-widebed.jpg', alt: "Silver VW T5 campervan with pop-top on a country lane" }
    ];
    const on = 'aspect-[4/3] w-full overflow-hidden rounded-xl ring-4 ring-brand';
    const off = 'aspect-[4/3] w-full overflow-hidden rounded-xl opacity-80 ring-1 ring-plum/10 hover:opacity-100';
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

DC["Van-t5-compact"] = (function () {

class Component extends DCLogic {
  constructor(props) { super(props); this.state = { i: 0, playing: true }; this.video = null; }
  renderVals() {
    const PHOTOS = [
      { src: 'assets/v-t5-compact.jpg', alt: "White VW T5 campervan on a clifftop campsite" }
    ];
    const on = 'aspect-[4/3] w-full overflow-hidden rounded-xl ring-4 ring-brand';
    const off = 'aspect-[4/3] w-full overflow-hidden rounded-xl opacity-80 ring-1 ring-plum/10 hover:opacity-100';
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

DC["Route-nc500"] = (function () {

class Component extends DCLogic {
  renderVals() { return {}; }
}

return Component;
})();

DC["Route-hebrides"] = (function () {

class Component extends DCLogic {
  renderVals() { return {}; }
}

return Component;
})();

DC["Route-edinburgh"] = (function () {

class Component extends DCLogic {
  renderVals() { return {}; }
}

return Component;
})();

DC["Route-wales"] = (function () {

class Component extends DCLogic {
  renderVals() { return {}; }
}

return Component;
})();

DC["Route-lakes"] = (function () {

class Component extends DCLogic {
  renderVals() { return {}; }
}

return Component;
})();

DC["Route-york"] = (function () {

class Component extends DCLogic {
  renderVals() { return {}; }
}

return Component;
})();

DC["Route-cotswolds"] = (function () {

class Component extends DCLogic {
  renderVals() { return {}; }
}

return Component;
})();

DC["Route-cornwall"] = (function () {

class Component extends DCLogic {
  renderVals() { return {}; }
}

return Component;
})();

DC["Route-dorset"] = (function () {

class Component extends DCLogic {
  renderVals() { return {}; }
}

return Component;
})();

DC["Route-causeway"] = (function () {

class Component extends DCLogic {
  renderVals() { return {}; }
}

return Component;
})();

DC["Route-belgium"] = (function () {

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
  // paint, trim, wheels, glazing and setting follow each van's own cover photo
  'man-lwb-auto': { env: 'alps', name: 'MAN TGE LWB Luxury · Automatic', L: 6.84, W: 2.04, H: 2.6, kind: 'high', paint: '#38393d', layout: 'northsouth', bath: true, rearAxle: 1.75, doors: 'barn', wheels: 'alloy' },
  'man-lwb-manual': { env: 'dales', name: 'MAN TGE LWB Luxury · Manual', L: 6.84, W: 2.04, H: 2.6, kind: 'high', paint: '#36383c', layout: 'transverse', bedDepth: 1.5, bath: true, rearAxle: 1.75, doors: 'barn', wheels: 'alloy', pod: true },
  'man-mwb': { env: 'farmland', name: 'MAN TGE MWB · 2 berth', L: 5.99, W: 2.04, H: 2.6, kind: 'high', paint: '#3d3f43', layout: 'transverse', bedDepth: 1.6, bath: true, rearAxle: 1.15, doors: 'barn', wheels: 'alloy' },
  'crafter-auto': { env: 'coast', name: 'VW Crafter LWB · Automatic', L: 6.84, W: 2.04, H: 2.6, kind: 'high', paint: '#efefed', metal: 0.25, layout: 'transverse', bedDepth: 1.4, bath: true, dinette: true, rearAxle: 1.75, doors: 'barn', wheels: 'steel', band: '#6f7378' },
  'crafter-manual': { env: 'grove', name: 'VW Crafter LWB · Manual', L: 6.84, W: 2.04, H: 2.6, kind: 'high', paint: '#b7babe', metal: 0.85, layout: 'transverse', bedDepth: 1.4, bath: true, dinette: true, rearAxle: 1.75, doors: 'barn', wheels: 'steel', fullGlass: true, strip: '#1c1d20' },
  'toleno': { env: 'forest', name: 'Toleno R · 4 berth', L: 6.36, W: 2.05, H: 2.62, kind: 'high', paint: '#f4f4f2', metal: 0.2, stripes: true, layout: 'transverse', bedDepth: 1.45, bath: true, dinette: true, rearAxle: 1.5, doors: 'barn', wheels: 'dark', band: '#1d1e21', bonnet: 0.68 },
  't5-spacious': { env: 'dales', name: 'VW T5 Spacious · Pop-top', L: 4.9, W: 1.9, H: 1.97, kind: 'pop', paint: '#4b4e53', layout: 'rockroll', bath: false, rearAxle: 1.0, doors: 'tailgate', wheels: 'alloy', bumpers: 'body', canvas: '#3c3d40' },
  't5-widebed': { env: 'farmland', name: 'VW T5 Wide Bed · Pop-top', L: 4.9, W: 1.9, H: 1.97, kind: 'pop', paint: '#b5b9be', metal: 0.85, layout: 'rockroll', wideBed: true, bath: false, rearAxle: 1.0, doors: 'tailgate', wheels: 'alloy', bumpers: 'body', canvas: '#2a2a2c' },
  't5-compact': { env: 'coast', name: 'VW T5 Compact · Pop-top', L: 4.9, W: 1.9, H: 1.97, kind: 'pop', paint: '#f2f2f0', metal: 0.2, layout: 'rockroll', bath: false, rearAxle: 1.0, doors: 'tailgate', wheels: 'cover', bumpers: 'body', canvas: '#a9abad', lid: '#e4e4e0' }
};
const VAN_ORDER = ['man-lwb-auto', 'man-lwb-manual', 'man-mwb', 'crafter-auto', 'crafter-manual', 'toleno', 't5-spacious', 't5-widebed', 't5-compact'];
const VIEWS = [
  ['outside', 'Walk around'],
  ['drive', 'On the road'],
  ['driver', "Driver's seat"],
  ['passenger', 'Passenger seat'],
  ['living', 'Living area'],
  ['bed', 'Lying in bed'],
  ['camp', 'Camping']
];
const SKY = { top: '#4f79ad', horizon: '#f0d7b8', bottom: '#b9ad97', sun: [0.62, 0.32, -0.25] };
const DUSK = { top: '#262a58', horizon: '#ff9560', bottom: '#3d2f33', fog: '#a8655a', sun: [-0.74, 0.07, -0.56], sunColor: '#ff8a4a', sunI: 1.5, hemiI: 0.26, exposure: 1.0 };
const DAY = { fog: '#f0d7b8', sunColor: '#ffe2bf', sunI: 3.2, hemiI: 0.6, exposure: 1.12 };
const NIGHT = { top: '#060a1a', horizon: '#1b2342', bottom: '#0a0b12', fog: '#121829', moon: [0.25, 0.85, 0.3], moonColor: '#9fb6ff', moonI: 0.45, hemiI: 0.07, exposure: 1.15 };
const TIMES = [['morning', 'Morning', 8], ['midday', 'Midday', 13], ['sunset', 'Sunset', 19.3], ['night', 'Night', 22.5]];
const periodOf = (t) => (t >= 5 && t < 11 ? 'morning' : t >= 11 && t < 17 ? 'midday' : t >= 17 && t < 20.8 ? 'sunset' : 'night');

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
    return [Math.min(255, 212 * k), Math.min(255, 182 * k), Math.min(255, 142 * k)];
  }, 1, 1); texs.push(woodTex);
  const floorTex = dataTex(T, 256, (u, v) => {
    const plank = Math.floor(u * 4), seam = (u * 4 - plank) < 0.02 ? 0.6 : 1;
    const n = fbm(u * 6 + plank * 3.1, v * 30, 3), k = (0.78 + 0.2 * n) * seam * (0.92 + 0.08 * hash2(plank, 2));
    return [150 * k, 122 * k, 96 * k];
  }, 1, 3); texs.push(floorTex);

  const paint = P({ color: c.paint, metalness: c.metal === undefined ? 0.45 : c.metal, roughness: 0.36, clearcoat: 0.6, clearcoatRoughness: 0.08, envMapIntensity: 0.55 });
  const plastic = S({ color: '#1b1c1f', roughness: 0.78 });
  const satin = S({ color: '#2b2c30', roughness: 0.5, metalness: 0.15 });
  const chrome = S({ color: '#dfe3e8', roughness: 0.15, metalness: 1 });
  const tyreM = S({ color: '#141416', roughness: 0.92 });
  const rimM = S({ color: '#c5c9cf', roughness: 0.25, metalness: 0.95 });
  const darkRim = S({ color: '#1c1d20', roughness: 0.3, metalness: 0.6 }), steelRim = S({ color: '#2b2d31', roughness: 0.5, metalness: 0.5 }), coverM = S({ color: '#bfc3c8', roughness: 0.35, metalness: 0.7 });
  const glassSide = P({ color: '#0b0f14', metalness: 0.15, roughness: 0.03, transparent: true, opacity: 0.74, side: T.DoubleSide, depthWrite: false, envMapIntensity: 2.0 });
  const tint = (side, out) => P(out
    ? { color: '#07090c', metalness: 0.2, roughness: 0.04, transparent: true, opacity: 0.93, side, depthWrite: false, envMapIntensity: 2.2, emissive: '#ffc985', emissiveIntensity: 0 }
    : { color: '#10161c', metalness: 0.05, roughness: 0.03, transparent: true, opacity: 0.28, side, depthWrite: false, envMapIntensity: 1.2 });
  const tintOutF = tint(T.FrontSide, true), tintOutB = tint(T.BackSide, true), tintInF = tint(T.FrontSide, false), tintInB = tint(T.BackSide, false);
  const bodyLow = c.bumpers === 'body';
  const glassFront = P({ color: '#30404c', metalness: 0.05, roughness: 0.03, transparent: true, opacity: 0.22, side: T.DoubleSide, depthWrite: false, envMapIntensity: 1.4 });
  const headM = P({ color: '#e8eef4', roughness: 0.05, metalness: 0.2, clearcoat: 1, emissive: '#d8e8ff', emissiveIntensity: 0.55 });
  const drlM = S({ color: '#ffffff', emissive: '#ffffff', emissiveIntensity: 2.5 });
  const tailM = P({ color: '#9c1022', roughness: 0.1, clearcoat: 1, emissive: '#6a0a16', emissiveIntensity: 0.9 });
  const plateM = S({ color: '#f2f2ee', roughness: 0.5 });
  const lining = P({ color: '#8f8b85', roughness: 1, sheen: 0.5, sheenColor: '#b9b4ab' });
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
  const rr = pop ? 0.12 : 0.25;
  const sillY = 0.34, floorY = 0.56, wheelR = pop ? 0.34 : 0.37;
  const bonnetLen = c.bonnet || (pop ? 0.66 : 0.86), bonnetH = pop ? 1.04 : 1.12;
  const wsBaseZ = half - bonnetLen;
  const wsTopY = pop ? H - 0.1 : 2.08;
  const wsRun = pop ? 0.72 : 0.94;
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
    s.lineTo(half - 0.3, archY);
    s.lineTo(half - 0.3, bonnetH - 0.07);
    s.lineTo(wsBaseZ, bonnetH - 0.07);
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
    if (c.stripes) {
      if (side > 0) w.push(rect(cabDoorRear - 1.05, cabDoorRear - 0.2, winY0, winY1));
      w.push(rect(rearZ + 0.35, rearZ + 1.15, winY0 + 0.05, winY1));
      if (side < 0) w.push(rect(mid - 0.35, mid + 0.35, winY0, winY1));
      return w;
    }
    const gy0 = bonnetH + 0.16, gy1 = topY - 0.2;
    if (c.fullGlass) { const z0 = rearZ + 0.32, z1 = cabDoorRear - 0.1, n = 4, pw = (z1 - z0 - 0.09 * (n - 1)) / n; for (let k = 0; k < n; k++) w.push(rect(z0 + k * (pw + 0.09), z0 + k * (pw + 0.09) + pw, gy0, gy1)); return w; }
    w.push(rect(cabDoorRear - 1.22, cabDoorRear - 0.1, gy0, gy1));
    w.push(rect(rearZ + 0.42, cabDoorRear - 1.36, gy0, gy1));
    return w;
  };
  const toPath = (pts, Ctor) => { const p = new Ctor(); p.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) p.lineTo(pts[i][0], pts[i][1]); p.closePath(); return p; };
  const sideMesh = (shape, depth, mat, x, bevel) => {
    const geo = new T.ExtrudeGeometry(shape, bevel
      ? { depth, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.014, bevelSegments: 3, curveSegments: 40 }
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
    holes.forEach((h, i) => {
      const sg = new T.ShapeGeometry(toPath(h, T.Shape)); sg.rotateY(-Math.PI / 2); const gx = side > 0 ? W / 2 - 0.022 : -W / 2 + 0.022;
      if (i === 0) { noShadow(add(sg, glassFront, gx, 0, 0)); return; }
      // the pane faces -x: seen from outside on the +x side it is the back face
      noShadow(add(sg, side > 0 ? tintOutB : tintOutF, gx, 0, 0)); noShadow(add(sg, side > 0 ? tintInF : tintInB, gx, 0, 0));
    });
    // arch flares
    [fAx, rAx].forEach((z) => { const f = add(new T.TorusGeometry(archR + 0.012, 0.04, 14, 48, Math.PI), bodyLow ? paint : plastic, side * (W / 2 + 0.004), archY, z); f.rotation.y = Math.PI / 2; });
    // sill + rubbing strip
    rbox(0.05, 0.1, (fAx - archR) - (rAx + archR) - 0.04, 0.02, bodyLow ? paint : plastic, side * (W / 2 + 0.01), sillY + 0.07, (fAx + rAx) / 2);
    // lower body band (grey on the Crafter Auto, black on the Toleno), kept clear of the wheel arches
    if (c.band) { const bandM = S({ color: c.band, roughness: 0.55, metalness: 0.2 }), bt = 0.3, segs = [[rearZ + 0.04, rAx - archR - 0.03], [rAx + archR + 0.03, fAx - archR - 0.03], [fAx + archR + 0.03, half - 0.34]];
      segs.forEach(([z0, z1]) => { if (z1 - z0 > 0.05) noShadow(box(0.012, bt, z1 - z0, bandM, side * (W / 2 + 0.006), archY + bt / 2, (z0 + z1) / 2)); }); }
    // black rubbing strip along the side (Crafter Manual)
    if (c.strip) { const stM = S({ color: c.strip, roughness: 0.6 }); [[rAx + archR + 0.03, fAx - archR - 0.03], [rearZ + 0.04, rAx - archR - 0.03]].forEach(([z0, z1]) => noShadow(rbox(0.035, 0.12, z1 - z0, 0.02, stM, side * (W / 2 + 0.012), archY + 0.24, (z0 + z1) / 2))); }
    // rear side pod (MAN Manual): a glazed extension at the back of the living area
    if (c.pod) { const podM = P({ color: '#1d1e22', metalness: 0.3, roughness: 0.25, clearcoat: 1 }), pz = rearZ + 0.72, py = winY0 + 0.22;
      rbox(0.2, 0.62, 1.12, 0.07, podM, side * (W / 2 + 0.07), py, pz);
      noShadow(rbox(0.012, 0.36, 0.86, 0.02, side > 0 ? tintOutB : tintOutF, side * (W / 2 + 0.172), py + 0.04, pz)); }
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
      const slant = (z0, y0, len, hgt, lean, m) => { const sh = new T.Shape(); sh.moveTo(z0, y0); sh.lineTo(z0 + len, y0); sh.lineTo(z0 + len + lean, y0 + hgt); sh.lineTo(z0 + lean, y0 + hgt); sh.closePath(); const sg = new T.ShapeGeometry(sh); sg.rotateY(-Math.PI / 2); noShadow(add(sg, m, side * (W / 2 + 0.008), 0, 0)).material.side = T.DoubleSide; };
      const grey = S({ color: '#8f949a', roughness: 0.4 }), dark = S({ color: '#3a3d43', roughness: 0.4 });
      [[0, dark], [1, stripeA], [2, grey], [3, dark]].forEach(([k, m]) => slant(rearZ + 0.08, 1.02 + k * 0.1, 1.25 - k * 0.12, 0.055, 0.2, m));
      [[0, dark], [1, stripeA], [2, grey]].forEach(([k, m]) => slant(cabDoorRear - 0.95 + k * 0.05, 0.86 + k * 0.08, 0.7 - k * 0.1, 0.045, 0.16, m));
    }
  });

  // --- rounded roof
  const roofGeo = (len) => {
    const th = 0.045, s = new T.Shape(), w = W / 2;
    s.moveTo(-w, -rr); s.quadraticCurveTo(-w, 0, -w + rr, 0); s.lineTo(w - rr, 0); s.quadraticCurveTo(w, 0, w, -rr);
    s.lineTo(w - th, -rr); s.quadraticCurveTo(w - th, -th, w - rr, -th); s.lineTo(-w + rr, -th); s.quadraticCurveTo(-w + th, -th, -w + th, -rr); s.closePath();
    return new T.ExtrudeGeometry(s, { depth: len, bevelEnabled: false, curveSegments: 24 });
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
    const popRear = rearZ + 0.4, popFront = roofFrontZ + 0.1, rise = 0.92, len = popFront - popRear;
    if (c.canvas) canvasM.color.set(c.canvas);
    const lidM = c.lid ? P({ color: c.lid, roughness: 0.35, clearcoat: 0.6 }) : paint;
    const lid = rbox(W - 0.02, 0.08, Math.hypot(len, rise) + 0.1, 0.035, lidM, 0, H + rise / 2 + 0.03, (popRear + popFront) / 2);
    lid.rotation.x = -Math.atan2(rise, len);
    [-1, 1].forEach((side) => {
      const tri = new T.BufferGeometry(), x = side * (W / 2 - 0.08);
      tri.setAttribute('position', new T.Float32BufferAttribute([x, H, popRear, x, H, popFront, x, H + rise, popFront], 3));
      tri.computeVertexNormals(); add(tri, canvasM, 0, 0, 0);
      noShadow(rbox(0.01, 0.3, 0.55, 0.01, S({ color: '#24272c', roughness: 0.8 }), x + side * 0.006, H + 0.36, popFront - 0.5));
    });
    box(W - 0.16, rise, 0.01, canvasM, 0, H + rise / 2, popFront);
    noShadow(rbox(0.7, 0.42, 0.012, 0.02, S({ color: '#2a2d32', roughness: 0.85 }), 0, H + rise * 0.55, popFront + 0.008));
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
    s.moveTo(wsBaseZ, bonnetH - 0.17); s.lineTo(half - 0.4, bonnetH - 0.17); s.lineTo(half - 0.4, sillY + 0.14);
    s.lineTo(half - 0.12, sillY + 0.14); s.quadraticCurveTo(half - 0.04, sillY + 0.14, half - 0.04, sillY + 0.32);
    s.lineTo(half - 0.045, bonnetH - 0.28); s.quadraticCurveTo(half - 0.03, bonnetH - 0.14, half - 0.36, bonnetH - 0.09);
    s.lineTo(wsBaseZ, bonnetH + 0.005); s.closePath();
    const bev = 0.1, depth = W - 0.012 - 2 * bev;
    const geo = new T.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelThickness: bev, bevelSize: 0.035, bevelSegments: 8, curveSegments: 32 });
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
  rbox(W + 0.06, 0.24, 0.3, 0.08, bodyLow ? paint : plastic, 0, sillY + 0.1, half - 0.1);
  rbox(W + 0.04, 0.22, 0.22, 0.06, bodyLow ? paint : plastic, 0, sillY + 0.09, rearZ + 0.06);
  noShadow(rbox(0.52, 0.11, 0.02, 0.012, plateM, 0, sillY + 0.15, half + 0.055));
  noShadow(rbox(0.52, 0.11, 0.02, 0.012, plateM, 0, sillY + 0.55, rearZ - 0.03));
  box(W - 0.08, 0.04, L - bonnetLen - 0.06, floorM, 0, floorY - 0.02, rearZ + (L - bonnetLen) / 2);
  box(W - 0.6, 0.3, L - 0.6, plastic, 0, sillY - 0.02, 0);

  // --- wheels: tyre (lathe), alloy rim, spokes
  const wheels = [];
  const tyreGeo = (() => {
    const pts = [], r0 = wheelR * 0.68, wdt = 0.125;
    for (let i = 0; i <= 16; i++) { const a = -Math.PI / 2 + (i / 16) * Math.PI, rx = wheelR - 0.045 + Math.cos(a) * 0.045, y = Math.sin(a) * wdt; pts.push(new T.Vector2(i === 0 || i === 16 ? r0 : Math.max(r0, rx), y)); }
    return new T.LatheGeometry(pts, 72);
  })();
  [fAx, rAx].forEach((z) => [-1, 1].forEach((side) => {
    const wg = new T.Group(); wg.position.set(side * (W / 2 - 0.14), wheelR, z); g.add(wg); wheels.push(wg);
    const t = add(tyreGeo, tyreM, 0, 0, 0, wg); t.rotation.z = Math.PI / 2;
    const rim = add(new T.CylinderGeometry(wheelR * 0.68, wheelR * 0.68, 0.2, 64), satin, 0, 0, 0, wg); rim.rotation.z = Math.PI / 2;
    const lip = add(new T.TorusGeometry(wheelR * 0.66, 0.014, 10, 72), c.wheels === 'dark' ? darkRim : c.wheels === 'steel' ? steelRim : rimM, side * 0.1, 0, 0, wg); lip.rotation.y = Math.PI / 2;
    const ws = c.wheels || 'alloy', spokeM = ws === 'dark' ? darkRim : rimM;
    if (ws === 'steel' || ws === 'cover') {
      const face = add(new T.CylinderGeometry(wheelR * 0.62, wheelR * 0.62, 0.02, 48), ws === 'cover' ? coverM : steelRim, side * 0.1, 0, 0, wg); face.rotation.z = Math.PI / 2;
      const cap = add(new T.CylinderGeometry(wheelR * 0.17, wheelR * 0.2, 0.04, 24), ws === 'cover' ? rimM : satin, side * 0.115, 0, 0, wg); cap.rotation.z = Math.PI / 2;
      for (let k = 0; k < (ws === 'cover' ? 12 : 8); k++) { const a = (k / (ws === 'cover' ? 12 : 8)) * Math.PI * 2, r0 = wheelR * 0.42; const hole = add(new T.BoxGeometry(0.012, ws === 'cover' ? 0.11 : 0.05, ws === 'cover' ? 0.02 : 0.05), satin, side * 0.111, Math.cos(a) * r0, Math.sin(a) * r0, wg); hole.rotation.x = -a; }
    } else for (let k = 0; k < 10; k++) {
      const sg = rboxGeo(T, 0.025, wheelR * 0.56, 0.035, 0.008); sg.translate(0, wheelR * 0.32, 0);
      const sp = add(sg, spokeM, side * 0.095, 0, 0, wg); sp.rotation.x = (k / 10) * Math.PI * 2;
    }
    const hub = add(new T.CylinderGeometry(0.07, 0.07, 0.04, 24), rimM, side * 0.1, 0, 0, wg); hub.rotation.z = Math.PI / 2;
  }));

  [-1, 1].forEach((side) => rbox(0.11, topY - sillY - 0.06, 0.11, 0.05, paint, side * (W / 2 - 0.05), (topY + sillY) / 2 - 0.01, rearZ + 0.05));

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
  res.glow = [tintOutF, tintOutB];
  res.group = g; res.doors = doors; res.mats = mats; res.texs = texs; res.wheels = wheels; res.topY = topY; res.cabDoorRear = cabDoorRear; res.awningY = pop ? H - 0.04 : topY - 0.02;
  return res;
}

// ---------- environments: each van page gets its own setting
const PARK_X = 5.0;
// performance tier: phones and low-power machines get lighter scenery, smaller shadows and resolution
const PERF = { low: false };
const yieldTask = () => new Promise((r) => setTimeout(r, 0)); // where the van pulls in, off the road on the camp side
const ENVS = {
  loch:   { label: 'Highland loch', sky: ['#1a5fc6', '#86bdf0', '#b9ad97'], fog: [120, 900], grass: ['#4c6634', '#6f7a3c'], accent: '#6f5446', water: { x0: 12, x1: 142, y: -0.22, color: '#1d3a4b' }, shore: true, trees: 'pine', ridges: [['#2f3b2e', '#4a5446', 0], ['#4b5468', '#6c7488', 1], ['#7d86a0', '#a3aac0', 1]] },
  lakes:  { label: 'Lake District', sky: ['#1d63c8', '#8dc1ef', '#b8b09a'], fog: [100, 800], grass: ['#4f6e36', '#7a8547'], accent: '#7a6a50', water: { x0: 12, x1: 72, y: -0.22, color: '#20404f' }, shore: true, trees: 'mixed', ridges: [['#3a4a34', '#56664a', 0], ['#5a6474', '#7a8496', 0], ['#8a93a8', '#aab1c4', 1]] },
  coast:  { label: 'Clifftop & sea', mirror: true, sky: ['#1464d2', '#8cc4f2', '#cfc6b0'], fog: [160, 1400], grass: ['#5d7a3a', '#8a8a4a'], accent: '#b8a874', sea: true, trees: 'tufts', ridges: [['#4e5c45', '#6b7656', 0], ['#7d8a8f', '#9aa5ab', 0]], westOnly: true },
  dales:  { label: 'Rolling countryside', sky: ['#1a66d2', '#95c8f3', '#c2b48e'], fog: [140, 1000], grass: ['#5f8a3a', '#9aa04a'], accent: '#c8b25a', fields: true, trees: 'oak', ridges: [['#56704a', '#6f8a5a', 0], ['#7f93a0', '#9eb0bb', 0]] },
  forest: { label: 'Pine forest', sky: ['#2265bd', '#98c3e9', '#8f9a84'], fog: [45, 420], grass: ['#3e5a2e', '#56693a'], accent: '#5a4a36', trees: 'dense', ridges: [['#2d3a2c', '#3c4a38', 0], ['#4a5662', '#606c78', 0]] },
  farmland: { label: 'Open farmland', sky: ['#1b64cc', '#9ccaf3', '#c2b48e'], fog: [170, 1400], grass: ['#5f8a3a', '#8fa04a'], accent: '#b9a85a', fields: true, flatFields: true, trees: 'oak', treeN: 0.35, ridges: [['#6f8a5a', '#86a06c', 0]] },
  grove:  { label: 'Olive groves', sky: ['#1f68c8', '#a9d0f0', '#c9b48a'], fog: [150, 1250], grass: ['#8a8a4a', '#b3a35e'], accent: '#b08a52', trees: 'olive', ridges: [['#7c7a55', '#958f68', 0], ['#8a96a0', '#a7b1b8', 0]] },
  alps:   { label: 'Alpine pass', sky: ['#0f56cc', '#94c7f5', '#c9d2d6'], fog: [160, 1300], grass: ['#5c8a3a', '#86a04e'], accent: '#9aa07a', alpine: true, trees: 'larch', ridges: [['#56606e', '#e9edf2', 2], ['#6a7486', '#f2f5f8', 2], ['#8e98ad', '#f7f9fb', 2]] }
};

function mergeGeos(T, list) {
  let n = 0; list.forEach((g) => { n += (g.index ? g.index.count : g.attributes.position.count); });
  const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3); let o = 0;
  list.forEach((g0) => { const g = g0.index ? g0.toNonIndexed() : g0; const p = g.attributes.position.array, q = g.attributes.normal.array; pos.set(p, o); nor.set(q, o); o += p.length; if (g !== g0) g.dispose(); });
  const out = new T.BufferGeometry(); out.setAttribute('position', new T.BufferAttribute(pos, 3)); out.setAttribute('normal', new T.BufferAttribute(nor, 3)); return out;
}

// soft, edge-less light: brightness falls off towards the silhouette, so no polygon edges show
function softMat(T, color, along) {
  return new T.ShaderMaterial({
    transparent: true, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide,
    uniforms: { uOp: { value: 1 }, uCol: { value: new T.Color(color) } },
    vertexShader: 'varying vec3 vN; varying vec3 vV; varying float vY; void main(){ vY = uv.y; vec4 mv = modelViewMatrix * vec4(position, 1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }',
    fragmentShader: 'uniform float uOp; uniform vec3 uCol; varying vec3 vN; varying vec3 vV; varying float vY; void main(){ float f = pow(abs(dot(normalize(vN), normalize(vV))), 2.2); float a = clamp(f * (' + along + ') * uOp, 0.0, 1.0); gl_FragColor = vec4(uCol * a, a);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}'
  });
}
function glowTex(T) { const t = dataTex(T, 64, (u, v) => { const dx = u - 0.5, dy = v - 0.5, r = Math.min(1, Math.sqrt(dx * dx + dy * dy) * 2), a = Math.pow(1 - r, 2.4); return [255, 255, 255, Math.round(a * 255)]; }, 1, 1); t.colorSpace = T.NoColorSpace; return t; }

// merge every static mesh under root that shares a material into one mesh: far fewer draw calls
function mergeStatic(T, root, disp) {
  root.updateMatrixWorld(true);
  const inv = new T.Matrix4().copy(root.matrixWorld).invert(), buckets = new Map(), kill = [], m4 = new T.Matrix4();
  root.traverse((o) => {
    if (!o.isMesh || o.isSprite || !o.material || o.material.isShaderMaterial || o.material.transparent) return;
    for (let q = o.parent; q && q !== root; q = q.parent) if (q.userData.keep) return;
    const g0 = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone();
    g0.applyMatrix4(m4.multiplyMatrices(inv, o.matrixWorld));
    if (!buckets.has(o.material.uuid)) buckets.set(o.material.uuid, { m: o.material, list: [] });
    buckets.get(o.material.uuid).list.push(g0); kill.push(o);
  });
  kill.forEach((o) => o.parent.remove(o));
  buckets.forEach(({ m, list }) => { const geo = mergeGeos(T, list); list.forEach((x) => x.dispose()); const mesh = new T.Mesh(geo, m); mesh.receiveShadow = true; root.add(mesh); disp.push(geo); });
}

// ---------- architecture: a few buildings that belong to each setting (glowing windows after dark)
function buildArch(T, key, heightAt, MS) {
  const g = new T.Group(), disp = [], sites = [];
  const mat = (o) => { const m = new T.MeshStandardMaterial(Object.assign({ roughness: 0.95 }, o)); disp.push(m); return m; };
  const winM = mat({ color: '#2b2f36', emissive: '#ffc977', emissiveIntensity: 0.05, roughness: 0.3 });
  const lampM = mat({ color: '#fff6d8', emissive: '#ffe4a0', emissiveIntensity: 0.4, roughness: 0.2 });
  const C = {
    white: mat({ color: '#ebe6dc' }), harl: mat({ color: '#d9d3c6' }), stone: mat({ color: '#8d877c' }), dark: mat({ color: '#6c665d' }),
    slate: mat({ color: '#3b4048', roughness: 0.8 }), sand: mat({ color: '#b9a682' }), grit: mat({ color: '#9b8f78' }),
    wood: mat({ color: '#6b4a2e' }), wood2: mat({ color: '#7d5130' }), red: mat({ color: '#a8262f' }), roofR: mat({ color: '#5a3a2c', roughness: 0.85 }),
    green: mat({ color: '#3f4a35' }), black: mat({ color: '#25262a' })
  };
  const box = (w, h, d, m, x, y, z, parent, ry) => { const geo = new T.BoxGeometry(w, h, d); disp.push(geo); const o = new T.Mesh(geo, m); o.position.set(x, y + h / 2, z); if (ry) o.rotation.y = ry; o.receiveShadow = true; (parent || g).add(o); return o; };
  const cyl = (rt, rb, h, m, x, y, z, parent, seg) => { const geo = new T.CylinderGeometry(rt, rb, h, seg || 20); disp.push(geo); const o = new T.Mesh(geo, m); o.position.set(x, y + h / 2, z); o.receiveShadow = true; (parent || g).add(o); return o; };
  const cone = (r, h, m, x, y, z, parent, seg, rot) => { const geo = new T.ConeGeometry(r, h, seg || 16); disp.push(geo); const o = new T.Mesh(geo, m); o.position.set(x, y + h / 2, z); if (rot) o.rotation.y = rot; (parent || g).add(o); return o; };
  const roof = (w, h, d, m, x, y, z, parent) => { // gable roof along z
    const s = new T.Shape(); s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(0, h); s.lineTo(-w / 2, 0);
    const geo = new T.ExtrudeGeometry(s, { depth: d, bevelEnabled: false }); geo.translate(0, 0, -d / 2); disp.push(geo);
    const o = new T.Mesh(geo, m); o.position.set(x, y, z); o.receiveShadow = true; (parent || g).add(o); return o;
  };
  const windows = (w, d, rows, y0, parent, every) => { // windows on both long faces (±x) and gable ends
    const n = Math.max(1, Math.floor(d / (every || 2.6)));
    for (let r = 0; r < rows; r++) for (let i = 0; i < n; i++) { const z = -d / 2 + (i + 0.5) * d / n; [-1, 1].forEach((s) => box(0.08, 0.9, 0.7, winM, s * (w / 2 + 0.02), y0 + r * 2.6, z, parent)); }
    [-1, 1].forEach((s) => box(0.7, 0.9, 0.08, winM, 0, y0, s * (d / 2 + 0.02), parent));
  };
  // set a building on the slope: floor at the uphill level, a stone plinth down to the lowest corner
  const site = (x, z, w, d, rot, plinthM) => {
    const grp = new T.Group(), c = Math.cos(rot), s = Math.sin(rot); let lo = Infinity, hi = -Infinity;
    [[-1, -1], [1, -1], [-1, 1], [1, 1], [0, 0]].forEach(([a, b]) => { const px = x + (a * w / 2) * c + (b * d / 2) * s, pz = z - (a * w / 2) * s + (b * d / 2) * c, h = heightAt(px, pz); lo = Math.min(lo, h); hi = Math.max(hi, h); });
    hi = Math.max(hi, 0.4);
    grp.position.set(x, hi, z); grp.rotation.y = rot; g.add(grp);
    if (hi - lo > 0.05) box(w + 0.4, hi - lo + 0.6, d + 0.4, plinthM || C.stone, 0, -(hi - lo) - 0.6, 0, grp);
    sites.push([x, z, Math.max(w, d) * 0.9 + 3]);
    return grp;
  };
  // hero and camp views look from the +x/+z side towards -x/-z: place things by distance and angle from that line of sight
  const base = Math.atan2(-0.62, -0.78);
  const at = (dist, deg) => { dist *= 1.6; deg *= 1.15; return [Math.cos(base + deg * Math.PI / 180) * dist, Math.sin(base + deg * Math.PI / 180) * dist]; };
  const cottage = (x, z, rot, wallM, roofM, w, d, storeys, plinth) => {
    w = w || 5.5; d = d || 9; storeys = storeys || 1; const h = 2.6 * storeys + 0.4, p = site(x, z, w, d, rot, plinth);
    box(w, h, d, wallM, 0, 0, 0, p); roof(w + 0.5, w * 0.55, d + 0.5, roofM, 0, h, 0, p);
    [-1, 1].forEach((s) => box(0.7, w * 0.55 + 1.2, 0.7, wallM, 0, h - 0.4, s * (d / 2 - 0.2), p));
    windows(w, d, storeys, 0.9, p); box(0.08, 1.9, 0.9, C.black, w / 2 + 0.03, 0, 0, p);
    return p;
  };
  const church = (x, z, rot, wallM, roofM, spire) => {
    const p = site(x, z, 7, 18, rot, C.stone);
    box(7, 6, 14, wallM, 0, 0, 2, p); roof(7.6, 4.2, 14.4, roofM, 0, 6, 2, p);
    for (let i = 0; i < 4; i++) [-1, 1].forEach((s) => box(0.08, 2.2, 0.9, winM, s * 3.52, 1.8, -3 + i * 3, p));
    box(5, 13, 5, wallM, 0, 0, -6.5, p);
    for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2; box(0.9, 1.4, 0.08, winM, Math.sin(a) * 2.52, 9.5, -6.5 + Math.cos(a) * 2.52, p, a); }
    if (spire) cone(3.4, 11, roofM, 0, 13, -6.5, p, 4, Math.PI / 4);
    else [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => box(0.7, 1.4, 0.7, wallM, a * 2.15, 13, -6.5 + b * 2.15, p));
    return p;
  };
  const walls = (pts, m) => { // dry-stone walls following the ground
    for (let i = 0; i < pts.length - 1; i++) { const [x0, z0] = pts[i], [x1, z1] = pts[i + 1], L = Math.hypot(x1 - x0, z1 - z0), n = Math.ceil(L / 3);
      for (let k = 0; k < n; k++) { const t = (k + 0.5) / n, x = x0 + (x1 - x0) * t, z = z0 + (z1 - z0) * t; box(L / n + 0.05, 1.1, 0.6, m, x, heightAt(x, z) - 0.15, z, g, -Math.atan2(z1 - z0, x1 - x0)); } }
  };
  let beam = null, glow = null;

  if (key === 'loch') {
    // a Highland tower house on a knoll, and a whitewashed croft
    const [cx, cz] = at(105, -9), p = site(cx, cz, 12, 12, 0.5, C.dark);
    box(9, 15, 8, C.harl, 0, 0, 0, p); roof(9.6, 4.5, 8.6, C.slate, 0, 15, 0, p);
    [[-1, -1], [1, 1]].forEach(([a, b]) => { cyl(1.1, 1.1, 3.4, C.harl, a * 4.6, 12, b * 4.1, p); cone(1.35, 3, C.slate, a * 4.6, 15.4, b * 4.1, p); });
    for (let r = 0; r < 4; r++) for (let i = 0; i < 3; i++) [-1, 1].forEach((s) => box(0.08, 1.0, 0.6, winM, s * 4.52, 2 + r * 3.2, -2.5 + i * 2.5, p));
    box(5, 6, 6, C.dark, -6.5, 0, 1, p); box(14, 3.2, 0.9, C.dark, -2, 0, 6.5, p);
    const [hx, hz] = at(42, 13); cottage(hx, hz, 0.3, C.white, C.slate, 5, 10);
    const [bx, bz] = at(52, 19); cottage(bx, bz, 0.35, C.stone, C.roofR, 4, 6);
  } else if (key === 'lakes') {
    // a Lakeland farmstead in grey stone with dry-stone walls, and a chapel below the fells
    const [fx, fz] = at(46, 11); cottage(fx, fz, 0.2, C.dark, C.slate, 6, 12, 2, C.dark);
    const [bx, bz] = at(54, 20); cottage(bx, bz, 0.9, C.stone, C.slate, 6, 14, 1, C.dark);
    walls([at(30, 2), at(40, 4), at(75, 3), at(95, 8)], C.dark); walls([at(34, 26), at(48, 4)], C.dark); walls([at(62, 30), at(78, 12)], C.dark);
    const [kx, kz] = at(118, -10); church(kx, kz, 0.6, C.stone, C.slate, false);
  } else if (key === 'coast') {
    // a lighthouse on a rock out at sea, coastguard cottages on the cliff behind
    const [lx, lz] = at(78, -12);
    const rk = new T.Mesh(new T.DodecahedronGeometry(1, 1), C.dark); disp.push(rk.geometry); rk.scale.set(11, 3.2, 9); rk.position.set(lx, -0.6, lz); g.add(rk);
    const p = new T.Group(); p.position.set(lx, 1.6, lz); g.add(p);
    cyl(1.5, 2.3, 17, C.white, 0, 0, 0, p, 28); cyl(1.56, 1.6, 2, C.red, 0, 11, 0, p, 28);
    cyl(2.3, 2.3, 0.35, C.black, 0, 17, 0, p, 28); cyl(1.25, 1.25, 1.8, lampM, 0, 17.35, 0, p, 20);
    const dome = new T.Mesh(new T.SphereGeometry(1.4, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), C.red); disp.push(dome.geometry); dome.position.set(0, 19.15, 0); p.add(dome);
    for (let i = 0; i < 3; i++) box(0.5, 0.8, 0.08, winM, 0, 4 + i * 4, 2.0 - i * 0.12, p);
    box(4, 3, 6, C.white, 4.5, -0.6, 1.5, p); roof(4.4, 1.6, 6.4, C.slate, 4.5, 2.4, 1.5, p);
    const bm = softMat(T, '#fff1c2', 'pow(vY, 2.2)'); bm.uniforms.uOp.value = 0; disp.push(bm);
    const gt = glowTex(T); disp.push(gt); const gm = new T.SpriteMaterial({ map: gt, color: '#ffe9b0', transparent: true, depthWrite: false, blending: T.AdditiveBlending, opacity: 0.3 }); disp.push(gm);
    glow = new T.Sprite(gm); glow.scale.set(9, 9, 1); glow.position.set(0, 18.2, 0); p.add(glow);
    const bg = new T.ConeGeometry(5, 80, 64, 1, true); bg.translate(0, -40, 0); bg.rotateZ(Math.PI / 2); disp.push(bg);
    beam = new T.Group(); beam.userData.keep = true; beam.position.set(0, 18.2, 0); p.add(beam); [0, Math.PI].forEach((a) => { const b = new T.Mesh(bg, bm); b.rotation.y = a; beam.add(b); }); beam.userData.m = bm;
    for (let i = 0; i < 4; i++) { const [cx, cz] = at(52 + i * 7, 168 - i * 3); cottage(cx, cz, 0.3, C.white, C.slate, 5, 7); }
  } else if (key === 'dales') {
    // a village church with a spire across the fields, a stone barn and a farmhouse
    const [kx, kz] = at(150, -6); church(kx, kz, 0.4, C.sand, C.slate, true);
    const [bx, bz] = at(52, 15); { const p = site(bx, bz, 8, 16, 0.25, C.grit); box(8, 5, 16, C.grit, 0, 0, 0, p); roof(8.6, 3.6, 16.6, C.slate, 0, 5, 0, p); box(0.08, 3.2, 3.4, C.wood, 4.03, 0, 0, p); }
    const [fx, fz] = at(78, -17); cottage(fx, fz, 0.5, C.sand, C.slate, 6, 11, 2, C.grit);
    for (let i = 0; i < 4; i++) { const [vx, vz] = at(160 + (i % 2) * 14, -14 + i * 4); cottage(vx, vz, 0.4 + i * 0.3, i % 2 ? C.sand : C.white, i % 2 ? C.roofR : C.slate, 5, 8); }
  } else if (key === 'farmland') {
    // a farmstead out on the flat: barn, farmhouse and a grain silo
    const [bx, bz] = at(58, 12); { const p = site(bx, bz, 9, 18, 0.2, C.grit); box(9, 5.5, 18, C.red, 0, 0, 0, p); roof(9.6, 3.8, 18.6, C.slate, 0, 5.5, 0, p); box(0.08, 3.4, 4, C.wood, 4.53, 0, 0, p); }
    const [fx, fz] = at(70, 3); cottage(fx, fz, 0.35, C.white, C.slate, 6, 11, 2, C.stone);
    const [sx, sz] = at(64, 20); { const p = site(sx, sz, 4, 4, 0, C.stone); cyl(1.8, 1.8, 9, C.harl, 0, 0, 0, p, 28); cone(2.0, 1.6, C.slate, 0, 9, 0, p, 28); }
    const [vx, vz] = at(170, -10); church(vx, vz, 0.3, C.sand, C.slate, true);
  } else if (key === 'grove') {
    // a Mediterranean farmhouse in warm stucco with a terracotta roof, and a hill chapel with a bell tower
    const ochre = mat({ color: '#d8b27a' }), terra = mat({ color: '#b2552f', roughness: 0.8 }), pale = mat({ color: '#e9dcc3' });
    const [fx, fz] = at(58, 12); cottage(fx, fz, 0.3, ochre, terra, 7, 12, 2, C.sand);
    const [gx, gz] = at(66, 21); cottage(gx, gz, 0.9, pale, terra, 5, 7, 1, C.sand);
    const [kx, kz] = at(120, -9); { const p = church(kx, kz, 0.5, pale, terra, false); }
    for (let i = 0; i < 3; i++) { const [vx, vz] = at(150 + i * 10, -18 + i * 5); cottage(vx, vz, 0.2 + i * 0.4, i % 2 ? ochre : pale, terra, 5, 8, 2, C.sand); }
  } else if (key === 'forest') {
    // a log cabin in a clearing, with a lit porch
    const [cx, cz] = at(30, 15), p = site(cx, cz, 7, 9, 0.4, C.stone);
    box(6.4, 3.2, 8, C.wood, 0, 0, 0, p); for (let i = 0; i < 6; i++) [-1, 1].forEach((s) => cyl(0.18, 0.18, 8.2, C.wood2, s * 3.25, 0.25 + i * 0.5, 0, p, 8).rotation.set(Math.PI / 2, 0, 0));
    roof(7.8, 2.8, 9.4, C.green, 0, 3.2, 0, p); box(0.9, 5.2, 0.9, C.stone, -1.6, 0, -3.6, p);
    windows(6.4, 8, 1, 1.0, p, 3.4); box(0.08, 2.0, 1.0, C.black, 3.23, 0, 1.6, p);
    box(1.6, 0.25, 4, C.wood2, 4, 0, 1.6, p); const pl = cyl(0.12, 0.12, 0.25, lampM, 3.6, 2.3, 1.6, p, 10); pl.userData.lamp = true;
  } else if (key === 'alps') {
    // chalets with deep eaves on stone bases, and a white chapel with a slender spire
    [[48, 12, 0.3, 1], [66, 24, 0.9, 0], [120, -4, 0.5, 1]].forEach(([d0, a0, r, big]) => {
      const [x, z] = at(d0, a0), w = big ? 8 : 6.5, dd = big ? 10 : 8, p = site(x, z, w, dd, r, C.stone);
      box(w, 2.8, dd, C.white, 0, 0, 0, p); box(w, 2.8, dd, C.wood2, 0, 2.8, 0, p);
      roof(w + 2.4, 2.4, dd + 2.4, C.slate, 0, 5.6, 0, p); box(w + 1.2, 0.18, 1.4, C.wood, 0, 3.0, dd / 2 + 0.7, p);
      windows(w, dd, 2, 1.0, p, 2.4);
    });
    const [kx, kz] = at(92, -12), p = site(kx, kz, 6, 12, 0.7, C.stone);
    box(5.5, 5, 10, C.white, 0, 0, 1.5, p); roof(6, 3, 10.4, C.slate, 0, 5, 1.5, p); box(3.4, 10, 3.4, C.white, 0, 0, -4.5, p); cone(2.2, 8, C.slate, 0, 10, -4.5, p, 8);
    [-1, 1].forEach((s) => box(0.08, 1.8, 0.8, winM, s * 2.77, 1.6, 2, p));
  }
  return { group: g, disp, sites, winM, lampM, beam, glow };
}

// ---------- the world: sky, terrain, water, trees, road
async function buildWorld(T, renderer, E) {
  const world = new T.Group(), disposables = [];
  const sunDir = new T.Vector3(SKY.sun[0], SKY.sun[1], SKY.sun[2]).normalize();
  const skyMat = new T.ShaderMaterial({
    side: T.BackSide, depthWrite: false, fog: false,
    uniforms: { top: { value: new T.Color(E.sky[0]) }, horizon: { value: new T.Color(E.sky[1]) }, bottom: { value: new T.Color(E.sky[2]) }, sunDir: { value: sunDir }, time: { value: 0 } },
    vertexShader: 'varying vec3 vDir; void main(){ vDir = normalize(position); vec4 p = modelViewMatrix * vec4(position,1.0); gl_Position = projectionMatrix * p; }',
    fragmentShader: [
      'uniform vec3 top; uniform vec3 horizon; uniform vec3 bottom; uniform vec3 sunDir; uniform float time; varying vec3 vDir;',
      'float hsh(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }',
      'float vn(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f); return mix(mix(hsh(i), hsh(i + vec2(1.0, 0.0)), u.x), mix(hsh(i + vec2(0.0, 1.0)), hsh(i + vec2(1.0, 1.0)), u.x), u.y); }',
      'float fb(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { s += a * vn(p); p *= 2.03; a *= 0.5; } return s; }',
      'void main(){',
      '  vec3 d = normalize(vDir); float h = d.y; float sl = length(sunDir); vec3 sd = sunDir / max(sl, 0.001);',
      '  vec3 c = h > 0.0 ? mix(horizon, top, pow(clamp(h, 0.0, 1.0), 0.5)) : mix(horizon, bottom, pow(clamp(-h, 0.0, 1.0), 0.4));',
      '  float s = max(dot(d, sd), 0.0);',
      '  c += vec3(1.0, 0.88, 0.66) * (pow(s, 900.0) * 6.0 + pow(s, 24.0) * 0.3 + pow(s, 4.0) * 0.06) * sl;',
      '  if (h > 0.0) {',
      '    vec2 uv = d.xz / (h + 0.12) * 1.15 + vec2(time * 0.012, time * 0.004);',
      '    float n = fb(uv * 1.3) * 0.75 + fb(uv * 4.1 + 7.0) * 0.25;',
      '    float cov = smoothstep(0.5, 0.78, n) * smoothstep(0.0, 0.16, h);',
      '    float shade = smoothstep(0.5, 0.95, fb(uv * 1.3 + vec2(0.04, 0.06)));',
      '    vec3 lit = mix(vec3(1.0), horizon * 1.15 + vec3(0.12, 0.06, 0.04), clamp(1.0 - sd.y * 3.0, 0.0, 1.0) * 0.75);',
      '    vec3 cc = mix(lit, lit * vec3(0.78, 0.8, 0.86), shade * 0.6) * (0.2 + 0.8 * sl);',
      '    c = mix(c, cc, cov * 0.92);',
      '  }',
      '  gl_FragColor = vec4(c, 1.0);',
      '#include <tonemapping_fragment>',
      '#include <colorspace_fragment>',
      '}'
    ].join('\n')
  });
  skyMat.toneMapped = false;
  const cubeRT = new T.WebGLCubeRenderTarget(PERF.low ? 256 : 512, { type: T.HalfFloatType, generateMipmaps: false });
  const cubeCam = new T.CubeCamera(1, 1000, cubeRT);
  const skyView = new T.ShaderMaterial({
    side: T.BackSide, depthWrite: false, fog: false, toneMapped: false, uniforms: { tSky: { value: cubeRT.texture } },
    vertexShader: 'varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: 'uniform samplerCube tSky; varying vec3 vDir; void main(){ gl_FragColor = vec4(textureCube(tSky, normalize(vDir)).rgb, 1.0);\n#include <colorspace_fragment>\n}'
  });
  const sky = new T.Mesh(new T.SphereGeometry(900, 48, 24), skyView); world.add(sky); disposables.push(sky.geometry, skyMat, skyView, cubeRT);
  const pm = new T.PMREMGenerator(renderer);
  const envScene = new T.Scene(); const envSky = new T.Mesh(new T.SphereGeometry(100, 32, 16), skyMat); envScene.add(envSky);
  const env = pm.fromScene(envScene, 0.035).texture;
  const bakeView = () => cubeCam.update(renderer, envScene);
  bakeView();
  await yieldTask();
  const bakeSky = (pal) => {
    const u = skyMat.uniforms, keep = [u.top.value.clone(), u.horizon.value.clone(), u.bottom.value.clone(), u.sunDir.value.clone()];
    u.top.value.set(pal.top); u.horizon.value.set(pal.horizon); u.bottom.value.set(pal.bottom); u.sunDir.value.set(pal.sun[0], pal.sun[1], pal.sun[2]).normalize();
    const t = pm.fromScene(envScene, 0.035).texture;
    u.top.value.copy(keep[0]); u.horizon.value.copy(keep[1]); u.bottom.value.copy(keep[2]); u.sunDir.value.copy(keep[3]);
    return t;
  };
  const sN = 1600, sp = new Float32Array(sN * 3);
  for (let i = 0; i < sN; i++) { const th = hash2(i, 11) * Math.PI * 2, y = 0.08 + hash2(i, 12) * 0.92, r = Math.sqrt(1 - y * y); sp[i * 3] = Math.cos(th) * r * 850; sp[i * 3 + 1] = y * 850; sp[i * 3 + 2] = Math.sin(th) * r * 850; }
  const sGeo = new T.BufferGeometry(); sGeo.setAttribute('position', new T.BufferAttribute(sp, 3));
  const sMat = new T.PointsMaterial({ color: '#ffffff', size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0, depthWrite: false, fog: false });
  const stars = new T.Points(sGeo, sMat); stars.visible = false; world.add(stars); disposables.push(sGeo, sMat);

  const cl01 = (v) => Math.min(1, Math.max(0, v));
  const W0 = E.water, MS = E.mirror ? -1 : 1;
  const shoreOff = (z) => { const o = (fbm(z * 0.022 + 3.1, 1.7, 4) - 0.5) * 22 + Math.sin(z * 0.083 + 1.2) * 2.6 + Math.sin(z * 0.21) * 0.9; const keep = cl01((Math.abs(z) - 7) / 18); return Math.max(-1.2, o * keep + (1 - keep) * Math.max(o, 0.6)); };
  const heightAt = (xw, z) => { const x = xw * MS;
    const ax = Math.abs(x); let h = 0;
    if (ax < 8) return 0;
    if (E.sea) {
      if (x < 0) h = cl01((ax - 10) / 20) * (1.5 + 4 * fbm(x * 0.03, z * 0.03, 3));
      else { const xs = x - shoreOff(z); h = -1.4 * cl01((xs - 9) / 14) - Math.max(0, xs - 23) * 0.06; }
    } else if (E.fields) {
      h = cl01((ax - 10) / 35) * (2 + 10 * fbm(x * 0.006 + 2, z * 0.006, 3)) * (E.flatFields ? 0.18 : 1);
    } else if (E.trees === 'olive') {
      h = cl01((ax - 10) / 26) * (1.5 + 24 * fbm(x * 0.008 + 5, z * 0.008, 4));
    } else if (E.trees === 'dense') {
      h = cl01((ax - 10) / 40) * (1.5 + 6 * fbm(x * 0.01, z * 0.01, 3));
    } else if (E.alpine) {
      if (x < 0) h = cl01((ax - 22) / 40) * 3 * fbm(x * 0.02, z * 0.02, 2) + cl01((ax - 120) / 60) * (8 + 110 * fbm(x * 0.006, z * 0.006 + 3, 4));
      else h = cl01((x - 18) / 40) * 3 * fbm(x * 0.02, z * 0.02, 2) + cl01((x - 70) / 40) * (6 + 90 * fbm(x * 0.006 + 9, z * 0.006, 4));
    } else if (W0) {
      const fellsL = E.trees === 'mixed';
      if (x < 0) h = fellsL ? cl01((ax - 16) / 25) * (4 + 28 * fbm(x * 0.008, z * 0.008, 4)) : Math.max(0, (ax - 28) / 60) * 7 * fbm(x * 0.012 + 3, z * 0.012, 4) * cl01((ax - 28) / 40);
      else { const edge = cl01((x - shoreOff(z) - 9) / 7), far = W0.x1 - 30; h = -0.9 * edge + cl01((x - far) / 30) * (1.2 + (fellsL ? 44 : 34) * fbm(x * 0.011, z * 0.011 + 7, 4) * Math.min(1, (x - far) / 90 + 0.25)); }
    }
    if (xw > 0) h *= cl01((xw - 13) / 7);
    return h;
  };
  const SEG = PERF.low ? 110 : 150;
  const gGeo = new T.PlaneGeometry(1000, 1000, SEG, SEG); gGeo.rotateX(-Math.PI / 2);
  const pos = gGeo.attributes.position, cols = [], col = new T.Color();
  const gA = new T.Color(E.grass[0]), gB = new T.Color(E.grass[1]), acc = new T.Color(E.accent), verge = new T.Color('#7e7a5e'), rock = new T.Color('#7b7a74'), beach = new T.Color(E.sea ? '#d9c9a0' : '#8f8878'), snow = new T.Color('#f3f5f8');
  const fieldPal = ['#6d9a3e', '#86a548', '#a9a957', '#c8b25a', '#5f8a3a', '#7c9440'].map((h) => new T.Color(h));
  for (let i = 0; i < pos.count; i++) {
    if (i % 6000 === 5999) await yieldTask();
    const xw = pos.getX(i), z = pos.getZ(i), h = heightAt(xw, z), x = xw * MS; pos.setY(i, h);
    const n = fbm(x * 0.05, z * 0.05, 3), m = fbm(x * 0.008 + 11, z * 0.008, 3);
    col.copy(gA).lerp(gB, n).lerp(acc, Math.max(0, m - 0.45) * 1.6);
    if (E.fields && Math.abs(x) > 9) { const cx = Math.floor(x / 45), cz = Math.floor(z / 35); col.copy(fieldPal[Math.floor(hash2(cx, cz) * fieldPal.length)]).lerp(gA, n * 0.25); }
    if (h > 9) col.lerp(rock, cl01((h - 9) / 10));
    if (E.alpine && h > 28) col.lerp(snow, cl01((h - 28) / 12));
    if (Math.abs(x) < 6.5) col.lerp(verge, 0.55);
    { const xs = x - shoreOff(z); if ((W0 || E.sea) && xs > 8.5 && xs < (E.sea ? 40 : 17)) col.lerp(beach, cl01((xs - 8.5) / 2) * 0.85); }
    if (W0 && x > W0.x1 - 30 && x < W0.x1 - 22) col.lerp(beach, 0.7 * (1 - Math.abs(x - (W0.x1 - 26)) / 4));
    cols.push(col.r, col.g, col.b);
  }
  gGeo.setAttribute('color', new T.Float32BufferAttribute(cols, 3)); gGeo.computeVertexNormals();
  const groundMat = new T.MeshStandardMaterial({ vertexColors: true, roughness: 1 });
  const ground = new T.Mesh(gGeo, groundMat); ground.receiveShadow = true; world.add(ground); disposables.push(gGeo, groundMat);

  // water with procedural ripples (lake or open sea)
  const waveTex = await (async () => {
    const N = 256, d = new Uint8Array(N * N * 4), TAU = Math.PI * 2 / N, Hf = new Float32Array(N * N);
    const hgt = (x, y) => Math.sin((x * 3 + y * 1) * TAU * 2) * 0.55 + Math.sin((x * -2 + y * 3) * TAU * 2) * 0.4 + Math.sin((x * 1 - y * 4) * TAU * 3) * 0.22 + Math.sin((x * 5 + y * 2) * TAU * 2) * 0.12 + (fbm(x / N * 6, y / N * 6, 2) - 0.5) * 0.35;
    for (let y = 0; y < N; y++) { for (let x = 0; x < N; x++) Hf[y * N + x] = hgt(x, y); if (y % 64 === 63) await yieldTask(); }
    const at = (x, y) => Hf[((y + N) % N) * N + ((x + N) % N)];
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const dx = at(x + 1, y) - at(x - 1, y), dy = at(x, y + 1) - at(x, y - 1), nz = 1 / Math.sqrt(dx * dx + dy * dy + 1), i = (y * N + x) * 4;
      d[i] = (-dx * nz * 0.5 + 0.5) * 255; d[i + 1] = (-dy * nz * 0.5 + 0.5) * 255; d[i + 2] = (nz * 0.5 + 0.5) * 255; d[i + 3] = 255;
    }
    const t = new T.DataTexture(d, N, N); t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(26, 64);
    t.magFilter = T.LinearFilter; t.minFilter = T.LinearMipmapLinearFilter; t.generateMipmaps = true; t.needsUpdate = true; return t;
  })();
  disposables.push(waveTex);
  if (W0 || E.sea) {
    const wm = new T.MeshStandardMaterial({ color: E.sea ? '#22597a' : W0.color, roughness: E.sea ? 0.18 : 0.14, metalness: 0, envMapIntensity: E.sea ? 0.9 : 0.75, normalMap: waveTex, normalScale: new T.Vector2(E.sea ? 0.45 : 0.22, E.sea ? 0.45 : 0.22) });
    const wx0 = 8.5, wx1 = E.sea ? 1400 : W0.x1;
    const water = new T.Mesh(new T.PlaneGeometry(wx1 - wx0, E.sea ? 2400 : 1000), wm); water.rotation.x = -Math.PI / 2; water.position.set(MS * (wx0 + wx1) / 2, E.sea ? -0.75 : W0.y, 0); water.receiveShadow = true; world.add(water); disposables.push(water.geometry, wm);
  }
  if (E.shore || E.sea) {
    const pebG = new T.DodecahedronGeometry(E.sea ? 0.35 : 0.12, 0), pebM = new T.MeshStandardMaterial({ color: E.sea ? '#77726a' : '#8a8478', roughness: 1, flatShading: true });
    const pebN = E.sea ? 60 : 260, peb = new T.InstancedMesh(pebG, pebM, pebN), pm4 = new T.Matrix4(), pq = new T.Quaternion(), ps = new T.Vector3(), pv = new T.Vector3();
    for (let i = 0; i < pebN; i++) { const z = (hash2(i, 22) - 0.5) * (E.sea ? 200 : 120), x = (E.sea ? 14 : 10.2) + shoreOff(z) + hash2(i, 21) * (E.sea ? 10 : 3.5), sc0 = 0.5 + hash2(i, 23) * 1.4; pv.set(x * MS, heightAt(x * MS, z) + 0.03, z); pq.setFromEuler(new T.Euler(hash2(i, 24) * 3, hash2(i, 25) * 3, 0)); ps.set(sc0, sc0 * 0.6, sc0); pm4.compose(pv, pq, ps); peb.setMatrixAt(i, pm4); }
    peb.receiveShadow = true; peb.castShadow = true; world.add(peb); disposables.push(pebG, pebM);
  }

  await yieldTask();
  // mountain ridges
  E.ridges.forEach((rg, k) => {
    const radius = [330, 460, 600][k], base = [30, 50, 70][k] * (E.alpine ? 1.5 : 1), amp = [70, 110, 150][k] * (E.alpine ? 1.7 : E.fields ? 0.5 : 1), seed = [1.3, 4.1, 7.7][k];
    const segs = 360, p = [], cl = [], idx = [], ca = new T.Color(rg[0]), cb = new T.Color(rg[1]), sn = new T.Color('#eef0f3'), tmp = new T.Color();
    for (let i = 0; i <= segs; i++) {
      const a = (i / segs) * Math.PI * 2;
      let n = 0; [2, 3, 5, 7, 11, 17, 29].forEach((f, j) => { n += Math.sin(a * f + seed * (j + 1)) / (j * 0.9 + 1); });
      let hgt = base + amp * (0.5 + 0.35 * n) * (0.75 + 0.25 * Math.sin(a + seed));
      if (E.westOnly) hgt *= cl01((-MS * Math.cos(a) + 0.15) / 0.5);
      const x = Math.cos(a) * radius, z = Math.sin(a) * radius;
      p.push(x, -10, z, x, Math.max(E.westOnly ? -12 : base * 0.4, hgt), z);
      cl.push(ca.r, ca.g, ca.b);
      tmp.copy(cb); if (rg[2] === 1 && hgt > base + amp * 0.85) tmp.lerp(sn, 0.7); cl.push(tmp.r, tmp.g, tmp.b);
      if (i < segs) { const j = i * 2; idx.push(j, j + 1, j + 2, j + 1, j + 3, j + 2); }
    }
    const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.Float32BufferAttribute(p, 3)); geo.setAttribute('color', new T.Float32BufferAttribute(cl, 3)); geo.setIndex(idx); geo.computeVertexNormals();
    const mat = new T.MeshStandardMaterial({ vertexColors: true, roughness: 1, side: T.DoubleSide, flatShading: true });
    world.add(new T.Mesh(geo, mat)); disposables.push(geo, mat);
  });

  // buildings for this setting
  const envKey = Object.keys(ENVS).find((k) => ENVS[k] === E) || 'loch';
  const arch = buildArch(T, envKey, heightAt, MS); world.add(arch.group); mergeStatic(T, arch.group, arch.disp); arch.disp.forEach((d) => disposables.push(d));
  const blocked = (x, z) => arch.sites.some(([sx, sz, r]) => (x - sx) * (x - sx) + (z - sz) * (z - sz) < r * r);

  // vegetation
  const mtx = new T.Matrix4(), q = new T.Quaternion(), sc = new T.Vector3(), pp = new T.Vector3(), up = new T.Vector3(0, 1, 0);
  const scatter = (geoTop, geoTrunk, cTop, cTrunk, N, place, flat) => {
    N = Math.round(N * (PERF.low ? 0.6 : 1));
    const mt = new T.MeshStandardMaterial({ color: cTop, roughness: 1, flatShading: flat !== false }), mk = new T.MeshStandardMaterial({ color: cTrunk, roughness: 1 });
    const A = new T.InstancedMesh(geoTop, mt, N), B = geoTrunk ? new T.InstancedMesh(geoTrunk, mk, N) : null;
    for (let i = 0; i < N; i++) { const r = place(i); r[0] *= MS; if ((r[0] - 17) * (r[0] - 17) + (r[1] - 12) * (r[1] - 12) < 160 || (r[0] > 7 && r[0] < 30 && r[1] > -2 && r[1] < 26)) r[0] += r[0] > 0 ? 30 : -30; if (r[0] > -6 && r[0] < 17) r[0] = r[0] > 4 ? r[0] + 13 : r[0] - 10; pp.set(r[0], heightAt(r[0], r[1]), r[1]); const s = blocked(r[0], r[1]) ? 0.0001 : r[2]; sc.set(s, s * (0.9 + hash2(i, 4) * 0.4), s); q.setFromAxisAngle(up, hash2(i, 5) * 6.28); mtx.compose(pp, q, sc); A.setMatrixAt(i, mtx); if (B) B.setMatrixAt(i, mtx); }
    world.add(A); if (B) world.add(B); disposables.push(geoTop, mt, mk); if (geoTrunk) disposables.push(geoTrunk);
  };
  const pineG = () => { const g = new T.ConeGeometry(1.4, 5.5, 7); g.translate(0, 4, 0); return g; };
  const trunkG = () => { const g = new T.CylinderGeometry(0.18, 0.22, 1.4, 6); g.translate(0, 0.7, 0); return g; };
  const roundG = () => { const g = new T.IcosahedronGeometry(2.4, 1); g.translate(0, 3.6, 0); g.scale(1, 0.85, 1); return g; };
  const trunkTall = () => { const g = new T.CylinderGeometry(0.22, 0.3, 2.4, 6); g.translate(0, 1.2, 0); return g; };
  const sideX = (i, near, span, farSide) => (farSide ? 1 : -1) * (near + Math.pow(hash2(i, 1), 1.3) * span);
  if (E.trees === 'pine' || E.trees === 'mixed') {
    scatter(pineG(), trunkG(), '#2b3d2a', '#4a3a2c', 420, (i) => { const far = i % 3 === 0 && W0; return [far ? W0.x1 - 20 + Math.pow(hash2(i, 1), 1.2) * 150 : sideX(i, E.trees === 'mixed' ? 30 : 60, 240), (hash2(i, 2) - 0.5) * 700, 0.55 + hash2(i, 3) * 0.7]; });
    if (E.trees === 'mixed') scatter(roundG(), trunkTall(), '#4f6b33', '#4a3a2c', 160, (i) => [sideX(i, 14, 120), (hash2(i, 6) - 0.5) * 500, 0.5 + hash2(i, 7) * 0.6]);
  } else if (E.trees === 'dense') {
    scatter(pineG(), trunkG(), '#263a26', '#4a3a2c', 1300, (i) => [sideX(i, 11, 230, i % 2 === 0), (hash2(i, 2) - 0.5) * 700, 0.75 + hash2(i, 3) * 0.9]);
  } else if (E.trees === 'oak') {
    scatter(roundG(), trunkTall(), '#46682e', '#4a3a2c', Math.round(260 * (E.treeN || 1)), (i) => { const cx = Math.floor(hash2(i, 8) * 8) - 4, side = cx >= 0 ? 1 : -1; return [side * 12 + cx * 45 + (hash2(i, 9) - 0.5) * 6, Math.floor((hash2(i, 10) - 0.5) * 20) * 35 + hash2(i, 11) * 35, 0.6 + hash2(i, 3) * 0.6]; });
    // hedgerows along the field edges
    const hedgeG = new T.BoxGeometry(1.1, 1.1, 1); const hedgeM = new T.MeshStandardMaterial({ color: '#3d5a2a', roughness: 1 });
    const segs = []; for (let k = -4; k <= 4; k++) { const x = k * 45; if (Math.abs(x) < 12) continue; for (let zz = -350; zz < 350; zz += 6) segs.push([x, zz, 0]); }
    for (let m = -10; m <= 10; m++) { const z = m * 35; for (let xx = -180; xx < 180; xx += 6) { if (Math.abs(xx) < 12) continue; segs.push([xx, z, 1]); } }
    const hedges = new T.InstancedMesh(hedgeG, hedgeM, segs.length);
    segs.forEach((sgm, i) => { pp.set(sgm[0], heightAt(sgm[0], sgm[1]) + 0.5, sgm[1]); q.setFromAxisAngle(up, sgm[2] ? Math.PI / 2 : 0); sc.set(blocked(sgm[0], sgm[1]) ? 0.0001 : 1, 0.8 + hash2(i, 3) * 0.5, 6.2); mtx.compose(pp, q, sc); hedges.setMatrixAt(i, mtx); });
    hedges.receiveShadow = true; world.add(hedges); disposables.push(hedgeG, hedgeM);
  } else if (E.trees === 'olive') {
    // olive groves planted in rows on the slopes, dark cypresses standing among them
    const oliveG = () => { const g0 = new T.IcosahedronGeometry(1.6, 1); const ps = g0.attributes.position; for (let i = 0; i < ps.count; i++) { const k = 0.8 + fbm(ps.getX(i) * 2 + 3, ps.getY(i) * 2 + ps.getZ(i) * 2, 2) * 0.45; ps.setXYZ(i, ps.getX(i) * k, ps.getY(i) * k * 0.72, ps.getZ(i) * k); } g0.translate(0, 2.1, 0); g0.computeVertexNormals(); return g0; };
    const oliveTrunk = () => { const g0 = new T.CylinderGeometry(0.16, 0.26, 1.5, 6); g0.translate(0, 0.75, 0); return g0; };
    scatter(oliveG(), oliveTrunk(), '#7d8c5e', '#5b4a3a', 520, (i) => { const col = i % 26, row = Math.floor(i / 26) - 10, far = i % 5 === 0; return [far ? 24 + col * 7 + hash2(i, 9) * 1.5 : -(14 + col * 7 + hash2(i, 9) * 1.5), row * 8 + (col % 2) * 4 + hash2(i, 8) * 1.2, 0.75 + hash2(i, 3) * 0.45]; });
    const cypG = () => { const g0 = new T.ConeGeometry(0.75, 8.5, 8); g0.translate(0, 4.6, 0); return g0; };
    scatter(cypG(), trunkG(), '#2d3d27', '#4a3a2c', 90, (i) => [sideX(i, 18, 170, i % 6 === 0), (hash2(i, 2) - 0.5) * 520, 0.7 + hash2(i, 3) * 0.7]);
  } else if (E.trees === 'larch') {
    scatter(pineG(), trunkG(), '#45633a', '#4a3a2c', 520, (i) => [sideX(i, 26, 200, i % 4 === 0), (hash2(i, 2) - 0.5) * 700, 0.6 + hash2(i, 3) * 0.8]);
  } else if (E.trees === 'tufts') {
    const tg = new T.ConeGeometry(0.16, 0.55, 5); tg.translate(0, 0.27, 0);
    scatter(tg, null, '#b3ad66', '#000', 1400, (i) => [i % 4 === 0 ? 9.5 + hash2(i, 1) * 4 : -10 - Math.pow(hash2(i, 1), 1.4) * 70, (hash2(i, 2) - 0.5) * 300, 0.5 + hash2(i, 3) * 0.7], true);
    const gorse = new T.IcosahedronGeometry(0.7, 1); gorse.translate(0, 0.45, 0);
    scatter(gorse, null, '#56662a', '#000', 70, (i) => [-16 - hash2(i, 1) * 90, (hash2(i, 2) - 0.5) * 300, 0.6 + hash2(i, 3) * 0.7]);
  }


  await yieldTask();
  // foliage. The scenery's own scatter is fixed and never moves. The campsite brings its own patch of grass and flowers,
  // which glides in with the pitch as the van pulls up (the van is the thing that moves; the patch is placed relative to it).
  const patch = new T.Group(); patch.visible = false; world.add(patch);
  {
    const dry = E.alpine ? '#7a9a4a' : E.sea ? '#a7a35e' : E.trees === 'olive' ? '#a19a58' : E.fields ? '#7c9a44' : '#5f7a3a';
    const gCols = ['#ffffff', '#e8eccd', '#d2d9b0', '#f1e6c2'];
    const fCols = E.alpine ? ['#f4f1ff', '#8f7ad8', '#f2d24a', '#e05a7a'] : E.trees === 'olive' ? ['#9a86d6', '#b49ae0', '#f2d24a', '#f6f3ea'] : E.sea ? ['#f2d24a', '#f6f3ea', '#e6a3c4'] : ['#f2d24a', '#f6f3ea', '#b48fd6', '#e05a7a', '#f2a03c'];
    const bCols = E.sea ? ['#5b6b2c', '#6a7a30', '#4e5d2a'] : E.alpine ? ['#4e6a34', '#5d7a3c', '#6b6a3a'] : ['#3f5a2c', '#4c6a32', '#6b6a34', '#7a6232'];
    const sightline = (x, z) => { const d = Math.hypot(x, z), along = (x * 0.78 + z * 0.62); return along > 0 && d < 40 && Math.abs(x * 0.62 - z * 0.78) < along * 0.5 + 3; };
    const wet = (x, z) => heightAt(x, z) < (W0 ? W0.y + 0.12 : E.sea ? -0.55 : -9);
    const freeStatic = (x, z, tall) => !(x > -4.6 && x < PARK_X + 11) && !(tall && sightline(x, z)) && !blocked(x, z) && !wet(x, z);
    // grass clumps: a few crossed blades
    const blade = new T.ConeGeometry(0.05, 0.5, 3); blade.translate(0, 0.25, 0);
    const parts = []; for (let k = 0; k < 5; k++) { const b = blade.clone(); b.rotateZ((hash2(k, 1) - 0.5) * 0.7); b.rotateY(k * 1.3); b.translate((hash2(k, 2) - 0.5) * 0.18, 0, (hash2(k, 3) - 0.5) * 0.18); parts.push(b); }
    const clump = mergeGeos(T, parts); blade.dispose(); parts.forEach((b) => b.dispose());
    const fl = new T.IcosahedronGeometry(0.06, 0); fl.translate(0, 0.32, 0);
    const bush = new T.IcosahedronGeometry(0.55, 1); { const ps = bush.attributes.position; for (let i = 0; i < ps.count; i++) { const k = 0.82 + fbm(ps.getX(i) * 3 + 2, ps.getZ(i) * 3 + ps.getY(i) * 2, 2) * 0.5; ps.setXYZ(i, ps.getX(i) * k, ps.getY(i) * k * 0.8, ps.getZ(i) * k); } bush.translate(0, 0.35, 0); bush.computeVertexNormals(); }
    disposables.push(clump, fl, bush);
    const mats = {};
    const matFor = (key, o) => { if (!mats[key]) { mats[key] = new T.MeshStandardMaterial(Object.assign({ roughness: 1 }, o)); disposables.push(mats[key]); } return mats[key]; };
    // N instances placed by place(i) -> [x, z] or null; ground height follows the terrain when onTerrain is set
    const scatterInst = (parent, geo, mat, N, place, scl, colors, onTerrain, seed) => {
      N = Math.round(N * (PERF.low ? 0.5 : 1));
      const im = new T.InstancedMesh(geo, mat, N), c = new T.Color(); let k = 0;
      for (let i = 0; i < N * 6 && k < N; i++) {
        const r = place(i); if (!r) continue;
        const s0 = scl[0] + hash2(i, seed + 2) * scl[1];
        pp.set(r[0], onTerrain ? heightAt(r[0], r[1]) - 0.02 : -0.02, r[1]); sc.set(s0, s0 * (0.8 + hash2(i, seed + 3) * 0.5), s0); q.setFromAxisAngle(up, hash2(i, seed + 4) * 6.28);
        mtx.compose(pp, q, sc); im.setMatrixAt(k, mtx); if (colors) im.setColorAt(k, c.set(colors[Math.floor(hash2(i, seed + 5) * colors.length)])); k++;
      }
      im.count = k; im.receiveShadow = true; parent.add(im); return im;
    };
    const ring = (near, far, tall, seed) => (i) => { const a = hash2(i, seed) * Math.PI * 2, r = near + Math.pow(hash2(i, seed + 1), 1.5) * far, x = Math.cos(a) * r, z = Math.sin(a) * r; return freeStatic(x, z, tall) ? [x, z] : null; };
    // the scenery: moderate and fixed
    scatterInst(world, clump, matFor('g', { color: dry, flatShading: true }), E.trees === 'dense' ? 1000 : 1500, ring(5, 75, false, 201), [0.7, 0.9], gCols, true, 211);
    scatterInst(world, fl, matFor('f', { roughness: 0.7 }), E.alpine ? 500 : 380, ring(5, 50, false, 221), [0.8, 0.8], fCols, true, 231);
    scatterInst(world, bush, matFor('b', { flatShading: true }), E.trees === 'dense' ? 220 : 170, ring(8, 80, true, 241), [0.7, 1.1], bCols, true, 251);
    // the camp's own patch, in van-relative coordinates, round the pitch but not on it, and not right in front of the camp camera
    const onPitch = (x, z) => x > 0.4 && x < 8.0 && z > -7.4 && z < 7.4;
    const pRect = (x0, x1, z0, z1, avoidCam, seed) => (i) => { const x = x0 + hash2(i, seed) * (x1 - x0), z = z0 + hash2(i, seed + 1) * (z1 - z0); if (onPitch(x, z)) return null; if (avoidCam && Math.hypot(x - 8.9, z - 9) < 3.8) return null; return [x, z]; };
    scatterInst(patch, clump, matFor('g', { color: dry, flatShading: true }), 170, pRect(1.2, 10, -14, 14, true, 301), [0.6, 0.7], gCols, false, 311);
    scatterInst(patch, fl, matFor('f', { roughness: 0.7 }), 60, pRect(1.4, 10, -13, 13, true, 321), [0.8, 0.7], fCols, false, 331);
    scatterInst(patch, bush, matFor('b', { flatShading: true }), 9, (i) => { const r = pRect(8.2, 10.5, -14, 14, true, 341)(i); return r && (r[0] > 8.1 || Math.abs(r[1]) > 9) && !(Math.hypot(r[0] - 8.9, r[1] - 9) < 5) ? r : null; }, [0.7, 0.8], bCols, false, 351);
    // reeds and boulders along the true waterline
    if (W0) {
      const shoreX = (z) => { for (let x = 9; x < 40; x += 0.4) if (heightAt(x * MS, z) < W0.y + 0.02) return x; return 40; };
      const reed = new T.ConeGeometry(0.025, 1.3, 3); reed.translate(0, 0.65, 0); const rp = []; for (let k = 0; k < 7; k++) { const b = reed.clone(); b.rotateZ((hash2(k, 5) - 0.5) * 0.35); b.translate((hash2(k, 6) - 0.5) * 0.35, 0, (hash2(k, 7) - 0.5) * 0.35); rp.push(b); }
      const reeds = mergeGeos(T, rp); reed.dispose(); rp.forEach((b) => b.dispose()); disposables.push(reeds);
      scatterInst(world, reeds, matFor('r', { color: '#7b7a45', flatShading: true }), 300, (i) => { const z = (hash2(i, 71) - 0.5) * 220, x = (shoreX(z) + (hash2(i, 72) - 0.45) * 1.4) * MS; if (Math.abs(z) < 16 && hash2(i, 74) < 0.65) return null; return [x, z]; }, [0.7, 0.7], null, true, 371);
      const bg = new T.DodecahedronGeometry(1, 1), bm = new T.MeshStandardMaterial({ color: '#77736b', roughness: 0.95, flatShading: true }), BN = 22, bi = new T.InstancedMesh(bg, bm, BN);
      for (let i = 0; i < BN; i++) { const z = (hash2(i, 81) - 0.5) * 160, xs = shoreX(z) + 0.5 + hash2(i, 82) * 6, x = xs * MS, s0 = 0.4 + hash2(i, 83) * 1.1; pp.set(x, Math.min(heightAt(x, z), W0.y) - s0 * 0.35, z); sc.set(s0 * 1.3, s0 * 0.7, s0); q.setFromEuler(new T.Euler(hash2(i, 84), hash2(i, 85) * 6, 0)); mtx.compose(pp, q, sc); bi.setMatrixAt(i, mtx); }
      bi.receiveShadow = true; world.add(bi); disposables.push(bg, bm);
    }
  }

  // road
  await yieldTask();
  const asphalt = dataTex(T, 128, (u, v) => { const n = fbm(u * 40, v * 40, 3), spk = hash2(Math.floor(u * 128), Math.floor(v * 128)) > 0.93 ? 18 : 0; const k = 58 + n * 22 + spk; return [k, k, k + 3]; }, 3, 140);
  const roadMat = new T.MeshStandardMaterial({ color: '#ffffff', map: asphalt, roughness: 0.9 });
  const roadGroup = new T.Group(); world.add(roadGroup);
  const road = new T.Mesh(new T.PlaneGeometry(6.6, 1000), roadMat); road.rotation.x = -Math.PI / 2; road.position.y = 0.012; road.receiveShadow = true; roadGroup.add(road);
  const lineMat = new T.MeshStandardMaterial({ color: '#efece2', roughness: 0.6 });
  [-1, 1].forEach((s) => { const l = new T.Mesh(new T.PlaneGeometry(0.12, 1000), lineMat); l.rotation.x = -Math.PI / 2; l.position.set(s * 3.05, 0.016, 0); l.receiveShadow = true; roadGroup.add(l); });
  const dashes = new T.Group(); roadGroup.add(dashes);
  const dashG = new T.PlaneGeometry(0.12, 3);
  for (let z = -300; z <= 300; z += 9) { const d = new T.Mesh(dashG, lineMat); d.rotation.x = -Math.PI / 2; d.position.set(0, 0.017, z); d.receiveShadow = true; dashes.add(d); }
  const posts = new T.Group(); roadGroup.add(posts);
  const postG = new T.BoxGeometry(0.1, 1.0, 0.1), postM = new T.MeshStandardMaterial({ color: '#f1efe8', roughness: 0.6 }), refG = new T.BoxGeometry(0.105, 0.12, 0.105), refM = new T.MeshStandardMaterial({ color: '#c41e30', emissive: '#5a0010', emissiveIntensity: 0.6 });
  for (let z = -300; z <= 300; z += 24) [-1].forEach((s) => { const pz = z + (s > 0 ? 12 : 0); const p = new T.Mesh(postG, postM); p.position.set(s * 4.4, 0.5, pz); p.castShadow = true; p.userData = { right: s > 0, y: 0.5 }; posts.add(p); const r = new T.Mesh(refG, refM); r.position.set(s * 4.4, 0.85, pz); r.userData = { right: s > 0, y: 0.85 }; posts.add(r); });
  mergeStatic(T, dashes, disposables); mergeStatic(T, posts, disposables);
  disposables.push(asphalt, roadMat, road.geometry, lineMat, dashG, postG, postM, refG, refM, envSky.geometry, { dispose: () => pm.dispose() });

  return { world, arch, patch, env, bakeSky, bakeView, stars, skyMat, roadGroup, waveTex, dashes, posts, sunDir, disposables, fogColor: E.sky[1], E };
}

// ---------- evening camp beside the van: awning, string lights, chairs, rug, campfire
function buildCamp(T, van) {
  const g = new T.Group(), disp = [];
  const M = (o, std) => { const m = std ? new T.MeshStandardMaterial(o) : new T.MeshPhysicalMaterial(o); disp.push(m); return m; };
  const add = (geo, mat, x, y, z, parent) => { const m = new T.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; (parent || g).add(m); disp.push(geo); return m; };
  const W = van.W, ax = W / 2 + 0.07, ay = van.awningY, z0 = van.rearZ + 0.6, z1 = van.cabDoorRear - 0.35, reach = 2.3, drop = 0.38;
  // awning
  const awn = M({ color: '#ddd5c6', roughness: 0.9, sheen: 0.5, sheenColor: '#fff3e0', side: T.DoubleSide });
  const ag = new T.PlaneGeometry(reach, z1 - z0); ag.rotateX(-Math.PI / 2);
  const a = add(ag, awn, ax + reach / 2, ay - drop / 2, (z0 + z1) / 2); a.rotation.z = -Math.atan2(drop, reach);
  const poleM = M({ color: '#9aa1a8', metalness: 0.8, roughness: 0.3 }, true);
  [z0 + 0.05, z1 - 0.05].forEach((z) => add(new T.CylinderGeometry(0.018, 0.018, ay - drop, 8), poleM, ax + reach - 0.03, (ay - drop) / 2, z));
  // string lights hanging under the awning edge
  const bulbM = M({ color: '#fff1c9', emissive: '#ffcc73', emissiveIntensity: 3 }, true), lanternM = M({ color: '#ffe0a0', emissive: '#ffb347', emissiveIntensity: 2.5 }, true), wireM = M({ color: '#222', roughness: 0.8 }, true);
  const bulbs = 16, pts = [];
  for (let i = 0; i <= bulbs; i++) { const t = i / bulbs, z = z0 + (z1 - z0) * t, y = ay - drop - 0.05 - Math.sin(t * Math.PI) * 0.22; pts.push(new T.Vector3(ax + reach - 0.05, y, z)); add(new T.SphereGeometry(0.035, 10, 8), bulbM, ax + reach - 0.05, y - 0.04, z).castShadow = false; }
  add(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 64, 0.004, 4), wireM, 0, 0, 0);
  const nAwn = g.children.length;
  // rug
  const rugTex = dataTex(T, 128, (u, v) => { const b = Math.floor(u * 9) % 3; const c = b === 0 ? [176, 64, 74] : b === 1 ? [236, 222, 196] : [52, 70, 112]; const n = 0.9 + 0.1 * hash2(Math.floor(u * 128), Math.floor(v * 128)); return [c[0] * n, c[1] * n, c[2] * n]; }, 1, 1); disp.push(rugTex);
  const rg = new T.PlaneGeometry(1.7, 2.4); rg.rotateX(-Math.PI / 2);
  add(rg, M({ map: rugTex, roughness: 1 }, true), ax + 1.2, 0.02, (z0 + z1) / 2).castShadow = false;
  // campfire
  const fx = ax + 3.4, fz = (z0 + z1) / 2 - 0.2;
  const stoneM = M({ color: '#6f6b66', roughness: 1, flatShading: true }, true);
  for (let i = 0; i < 11; i++) { const an = (i / 11) * Math.PI * 2; const st = add(new T.DodecahedronGeometry(0.11 + hash2(i, 9) * 0.05, 0), stoneM, fx + Math.cos(an) * 0.48, 0.07, fz + Math.sin(an) * 0.48); st.rotation.set(hash2(i, 1) * 3, hash2(i, 2) * 3, 0); }
  const logM = M({ color: '#5a3d28', roughness: 1 }, true), charM = M({ color: '#1e1612', roughness: 1, emissive: '#ff4a10', emissiveIntensity: 0.35 }, true);
  for (let i = 0; i < 4; i++) { const l = add(new T.CylinderGeometry(0.055, 0.065, 0.7, 10), i % 2 ? logM : charM, fx, 0.12, fz); l.rotation.set(Math.PI / 2 - 0.35, (i / 4) * Math.PI, 0); }
  const flames = [], fl = [['#ff5a14', 0.26, 0.72, 0.7], ['#ff8c1a', 0.19, 0.6, 0.8], ['#ffd25a', 0.11, 0.42, 0.9]];
  fl.forEach((f, i) => { const m = softMat(T, f[0], '(1.0 - vY) * smoothstep(0.0, 0.18, vY) * 2.4'); m.uniforms.uOp.value = f[3]; disp.push(m); const c = add(new T.ConeGeometry(f[1], f[2], 40, 1, true), m, fx, 0.16 + f[2] / 2, fz); c.castShadow = false; c.receiveShadow = false; flames.push(c); });
  const fireLight = new T.PointLight(0xff8a3c, 0, 9, 2); fireLight.position.set(fx, 0.7, fz); g.add(fireLight);
  const eN = 46, eGeo = new T.BufferGeometry(), ePos = new Float32Array(eN * 3), eSeed = [];
  for (let i = 0; i < eN; i++) { eSeed.push(Math.random()); ePos[i * 3] = fx; ePos[i * 3 + 1] = Math.random() * 2; ePos[i * 3 + 2] = fz; }
  eGeo.setAttribute('position', new T.BufferAttribute(ePos, 3));
  const gTex = glowTex(T); disp.push(gTex);
  const eMat = new T.PointsMaterial({ map: gTex, color: '#ffb35c', size: 0.11, transparent: true, opacity: 0.9, blending: T.AdditiveBlending, depthWrite: false });
  const embers = new T.Points(eGeo, eMat); g.add(embers); disp.push(eGeo, eMat);
  const smokeTex = dataTex(T, 64, (uu, vv) => { const dx = uu - 0.5, dy = vv - 0.5, r = Math.sqrt(dx * dx + dy * dy) * 2, a = Math.max(0, 1 - r); return [255, 255, 255, Math.round(a * a * 255)]; }, 1, 1); smokeTex.colorSpace = T.NoColorSpace; disp.push(smokeTex);
  const sN = 28, sGeo = new T.BufferGeometry(), sPos = new Float32Array(sN * 3), sSeed = [];
  for (let i = 0; i < sN; i++) { sSeed.push(Math.random()); sPos[i * 3] = fx; sPos[i * 3 + 1] = 0.2 + Math.random() * 2.6; sPos[i * 3 + 2] = fz; }
  sGeo.setAttribute('position', new T.BufferAttribute(sPos, 3));
  const sMat = new T.PointsMaterial({ color: '#c9c6c0', size: 0.9, map: smokeTex, transparent: true, opacity: 0, depthWrite: false, sizeAttenuation: true });
  const smoke = new T.Points(sGeo, sMat); g.add(smoke); disp.push(sGeo, sMat);
  // chairs facing the fire
  const chairM = M({ color: '#2f4a3a', roughness: 1, sheen: 0.4, sheenColor: '#6f9a80' }), legM = M({ color: '#2a2a2a', metalness: 0.6, roughness: 0.4 }, true);
  [[-2.4, 1.25], [-0.9, 1.3]].forEach(([an, r]) => {
    const ch = new T.Group(); ch.position.set(fx + Math.cos(an) * r, 0, fz + Math.sin(an) * r); ch.lookAt(fx, 0, fz); g.add(ch);
    add(rboxGeo(T, 0.55, 0.06, 0.5, 0.025), chairM, 0, 0.42, 0, ch);
    const back = add(rboxGeo(T, 0.55, 0.55, 0.05, 0.02), chairM, 0, 0.72, -0.24, ch); back.rotation.x = -0.25;
    [[-0.25, -0.22], [0.25, -0.22], [-0.25, 0.22], [0.25, 0.22]].forEach(([lx, lz]) => { const lg = add(new T.CylinderGeometry(0.012, 0.012, 0.44, 6), legM, lx, 0.21, lz, ch); lg.rotation.x = lz > 0 ? 0.15 : -0.15; });
  });
  // little table and lantern
  const woodM = M({ color: '#a8835c', roughness: 0.7 }, true);
  const tx = fx + Math.cos(-1.65) * 1.5, tz = fz + Math.sin(-1.65) * 1.5;
  add(rboxGeo(T, 0.5, 0.04, 0.4, 0.015), woodM, tx, 0.48, tz);
  [[-0.2, -0.15], [0.2, -0.15], [-0.2, 0.15], [0.2, 0.15]].forEach(([lx, lz]) => add(new T.CylinderGeometry(0.012, 0.012, 0.46, 6), legM, tx + lx, 0.23, tz + lz));
  add(new T.CylinderGeometry(0.06, 0.07, 0.16, 12), lanternM, tx, 0.58, tz).castShadow = false;
  add(new T.CylinderGeometry(0.03, 0.06, 0.05, 12), legM, tx, 0.685, tz);
  // two enamel mugs on the table
  [[-0.12, 0.05], [0.12, -0.06]].forEach(([mx, mz]) => add(new T.CylinderGeometry(0.04, 0.04, 0.09, 14), M({ color: '#f2f2ef', roughness: 0.35 }, true), tx + mx + 0.0, 0.545, tz + mz));
  g.visible = false;
  // soft halos round the string-light bulbs and the lantern
  const hp = []; pts.forEach((pt) => hp.push(pt.x, pt.y - 0.04, pt.z)); hp.push(tx, 0.62, tz);
  const hGeo = new T.BufferGeometry(); hGeo.setAttribute('position', new T.Float32BufferAttribute(hp, 3));
  const hMat = new T.PointsMaterial({ map: gTex, color: '#ffcf86', size: 0.42, transparent: true, opacity: 0, depthWrite: false, blending: T.AdditiveBlending });
  const halos = new T.Points(hGeo, hMat); g.add(halos); disp.push(hGeo, hMat);
  // everything is set out one piece at a time, in the order it was built: awning, lights, rug, fire, chairs, table
  const awnSet = new Set(g.children.slice(0, nAwn));
  const items = g.children.filter((o) => !o.isPoints && !o.isLight).map((o, i) => ({ o, p: o.position.clone(), s: o.scale.clone(), kind: i === 0 ? 'awn' : awnSet.has(o) ? 'edge' : flames.includes(o) ? 'flame' : 'ground', pole: awnSet.has(o) && o.geometry && o.geometry.type === 'CylinderGeometry', h: o.geometry && o.geometry.parameters ? o.geometry.parameters.height || 0 : 0 }));
  return { group: g, items, ax, reach, halos, bulbM, lanternM, flames, fireLight, embers, smoke, sPos, sSeed, ePos, eSeed, fx, fz, center: new T.Vector3(ax + 1.6, 0.9, fz), disp };
}

class Component extends DCLogic {
  constructor(props) {
    super(props);
    const hero = props.hero === 'true' || props.hero === true;
    this.hero = hero;
    this.state = { van: props.van || 'man-lwb-auto', view: hero ? 'drive' : 'camp', time: 'sunset', noGL: false };
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

  async mount(el) {
    if (!el || this.mountEl === el) return;
    this.mountEl = el;
    try { PERF.low = (window.matchMedia && window.matchMedia('(max-width: 820px)').matches) || (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4; } catch (e) {}
    const T = window.THREE;
    if (!T) { this.setState({ noGL: true }); return; }
    let renderer;
    try { renderer = new T.WebGLRenderer({ canvas: el, antialias: !PERF.low, powerPreference: 'high-performance' }); } catch (e) { this.setState({ noGL: true }); return; }
    const prMax = Math.min(window.devicePixelRatio || 1, PERF.low ? 1 : 1.5);
    renderer.setPixelRatio(prMax);
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.VSMShadowMap; // low-res map, blurred: soft, natural shadows
    renderer.shadowMap.autoUpdate = false; // redrawn only when something casting a shadow moves

    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(45, 16 / 9, 0.03, 2000);
    const spec0 = VAN_SPECS[this.state.van] || VAN_SPECS['man-lwb-auto'];
    const E = ENVS[this.props.env] || ENVS[spec0.env] || ENVS.loch;
    const W = await buildWorld(T, renderer, E);
    if (this.dead || this.mountEl !== el) { W.disposables.forEach((d) => d.dispose && d.dispose()); renderer.dispose(); return; }
    scene.add(W.world);
    scene.environment = W.env;
    scene.fog = new T.Fog(W.fogColor, E.fog[0], E.fog[1]);
    scene.background = new T.Color(W.fogColor);
    const hemi = new T.HemisphereLight(0xdfe8ff, 0x5d5638, 0.6); scene.add(hemi);
    const sun = new T.DirectionalLight(0xffe2bf, 3.2);
    sun.position.copy(W.sunDir).multiplyScalar(30); sun.castShadow = true;
    sun.shadow.mapSize.set(PERF.low ? 256 : 512, PERF.low ? 256 : 512);
    Object.assign(sun.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8, near: 5, far: 70 });
    sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.02; sun.shadow.radius = PERF.low ? 10 : 18; sun.shadow.blurSamples = PERF.low ? 12 : 25;
    scene.add(sun);
    const inner = [new T.PointLight(0xffd9a8, 2.2, 5, 2), new T.PointLight(0xffd9a8, 2.2, 5, 2)];
    inner.forEach((l) => scene.add(l));
    // soft contact shadow under the van
    const csTex = dataTex(T, 128, (u, v) => { const dx = (u - 0.5) * 2, dy = (v - 0.5) * 2, r = Math.sqrt(dx * dx * 0.9 + dy * dy * 0.9); const a = Math.pow(Math.max(0, 1 - r), 1.6) * 0.75; return [0, 0, 0, Math.round(a * 255)]; }, 1, 1);
    csTex.colorSpace = T.NoColorSpace;
    const cs = new T.Mesh(new T.PlaneGeometry(1, 1), new T.MeshBasicMaterial({ map: csTex, transparent: true, depthWrite: false }));
    cs.rotation.x = -Math.PI / 2; cs.position.y = 0.02; cs.renderOrder = 1; scene.add(cs);

    this.v = {
      T, canvas: el, renderer, scene, camera, sun, hemi, inner, worldParts: W, contact: cs, van: null, offX: 0, offY: 0, camp: null, campT: 0, envDusk: null,
      cDayTop: new T.Color(E.sky[0]), cDayHor: new T.Color(E.sky[1]), cDayBot: new T.Color(E.sky[2]), cDuskTop: new T.Color(DUSK.top), cDuskHor: new T.Color(DUSK.horizon), cDuskBot: new T.Color(DUSK.bottom),
      cDayFog: new T.Color(E.sky[1]), cDuskFog: new T.Color(DUSK.fog), cDaySun: new T.Color(DAY.sunColor), cDuskSun: new T.Color(DUSK.sunColor),
      dDay: new T.Vector3(SKY.sun[0], SKY.sun[1], SKY.sun[2]).normalize(), dDusk: new T.Vector3(DUSK.sun[0], DUSK.sun[1], DUSK.sun[2]).normalize(), tmpV: new T.Vector3(),
      cNightTop: new T.Color(NIGHT.top), cNightHor: new T.Color(NIGHT.horizon), cNightBot: new T.Color(NIGHT.bottom), cNightFog: new T.Color(NIGHT.fog), cMoon: new T.Color(NIGHT.moonColor),
      dMoon: new T.Vector3(NIGHT.moon[0], NIGHT.moon[1], NIGHT.moon[2]).normalize(), envs: {}, tod: 19.6, todTarget: 19.6,
      pTop: new T.Color(), pHor: new T.Color(), pBot: new T.Color(), pFog: new T.Color(), pSun: new T.Color(), pDir: new T.Vector3(), tmpC: new T.Color(),
      mode: 'outside', theta: 0.85, phi: 1.22, radius: 11, yaw: 0, pitch: 0, fov: 45,
      pr: prMax, prMax, ftA: 0, ftN: 0, frame: 0, skyAcc: 99, shadowDirty: true, lastSun: new T.Vector3(), camSettled: false,
      look: new T.Vector3(0, 1.2, 0), lastInteract: 0, doorT: 0, running: true, raf: 0, last: performance.now(), pointers: new Map()
    };
    this.bindInput(el);
    this.loadVan(this.state.van);
    this.setView(this.state.view, true);
    this.resize();
    this.ro = new ResizeObserver(() => { if (this.v) { this.v.pr = this.v.prMax; this.v.renderer.setPixelRatio(this.v.pr); } this.resize(); }); this.ro.observe(el);
    this.io = new IntersectionObserver((es) => { const vis = es.some((e) => e.isIntersecting); if (this.v) { this.v.running = vis; if (vis) this.tick(); } });
    this.io.observe(el);
    this.tick();
  }

  destroy() {
    this.dead = true;
    const v = this.v; if (!v) return;
    cancelAnimationFrame(v.raf); v.running = false;
    if (this.ro) this.ro.disconnect(); if (this.io) this.io.disconnect();
    this.disposeVan();
    v.worldParts.disposables.forEach((d) => d.dispose && d.dispose());
    if (v.worldParts.env) v.worldParts.env.dispose();
    Object.values(v.envs).forEach((e) => e.dispose());
    v.renderer.dispose();
    this.v = null;
  }

  disposeCamp() {
    const v = this.v; if (!v || !v.camp) return;
    v.scene.remove(v.camp.group); v.camp.disp.forEach((d) => d.dispose && d.dispose()); v.camp = null;
  }

  disposeVan() {
    const v = this.v; if (!v || !v.van) return;
    this.disposeCamp();
    v.scene.remove(v.van.group);
    v.van.group.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
    v.van.mats.forEach((m) => m.dispose());
    v.van.texs.forEach((t) => t.dispose());
    v.van = null;
  }

  loadVan(id) {
    const v = this.v; if (!v) return;
    this.disposeVan();
    v.van = buildVan(v.T, VAN_SPECS[id] || VAN_SPECS['man-lwb-auto']); v.shadowDirty = true;
    v.scene.add(v.van.group);
    v.camp = buildCamp(v.T, v.van); v.scene.add(v.camp.group);
    v.van.lights.forEach((p, i) => v.inner[i].position.set(p[0], p[1], p[2]));
    v.contact.scale.set(v.van.W + 1.1, v.van.L + 1.6, 1);
    v.doorT = 0;
    this.setView(this.state.view, true);
  }

  setView(mode, snap) {
    const v = this.v; if (!v || !v.van) return;
    v.mode = mode;
    if (mode === 'outside') { v.radius = v.van.L * 1.25 + 3; v.phi = 1.3; v.fov = 40; }
    else if (mode === 'camp') { v.radius = v.van.L * 1.2 + 4.5; v.phi = 1.33; v.theta = 0.62; v.fov = 40; if (v.campT < 0.05) { v.tod = 18.6; v.jumpTo = null; } }
    else if (mode === 'drive') { v.fov = 26; }
    else { const p = v.van[mode]; if (!p) return; v.yaw = p.yaw || 0; v.pitch = p.pitch || 0; v.fov = 72; }
    if (snap) { const t = this.target(); v.camera.position.copy(t.pos); v.look.copy(t.look); v.camera.fov = v.fov; const o = this.offsetTarget(); v.offX = o[0]; v.offY = o[1]; v.camera.updateProjectionMatrix(); }
  }

  target() {
    const v = this.v, T = v.T;
    if (v.mode === 'outside' || v.mode === 'camp') {
      const c = v.mode === 'camp' && v.camp ? v.camp.center.clone().add(new T.Vector3(PARK_X, 0, 0)) : new T.Vector3(v.vx || 0, v.van.H * 0.45, 0);
      const pos = new T.Vector3(c.x + v.radius * Math.sin(v.phi) * Math.sin(v.theta), c.y + v.radius * Math.cos(v.phi), c.z + v.radius * Math.sin(v.phi) * Math.cos(v.theta));
      if (pos.y < 0.5) pos.y = 0.5;
      return { pos, look: c };
    }
    if (v.mode === 'drive') {
      const c = new T.Vector3(v.vx || 0, v.van.H * 0.42, 0.15), th = 0.9, el = 0.05, d = v.van.L * 1.9 + 6;
      return { pos: new T.Vector3(c.x + d * Math.sin(th) * Math.cos(el), c.y + d * Math.sin(el), c.z + d * Math.cos(th) * Math.cos(el)), look: c };
    }
    const p = v.van[v.mode].pos;
    const pos = new T.Vector3(p[0] + (v.vx || 0), p[1], p[2]);
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
        if (v.mode === 'outside' || v.mode === 'camp') v.radius = Math.min(v.van.L * 3, Math.max(v.van.L * 0.85, v.radius * (before / Math.max(after, 1))));
        else v.fov = Math.min(85, Math.max(35, v.fov * (before / Math.max(after, 1))));
        return;
      }
      p.x = e.clientX; p.y = e.clientY;
      if (v.mode === 'outside' || v.mode === 'camp') { v.theta -= dx * 0.006; v.phi = Math.min(1.48, Math.max(0.35, v.phi - dy * 0.005)); }
      else { v.yaw += dx * 0.005; v.pitch = Math.min(1.1, Math.max(-1.1, v.pitch + dy * 0.004)); }
      v.lastInteract = performance.now();
    };
    const up = (e) => { v.pointers.delete(e.pointerId); };
    const wheel = (e) => {
      if (v.mode === 'drive') return;
      e.preventDefault(); v.lastInteract = performance.now();
      if (v.mode === 'outside' || v.mode === 'camp') v.radius = Math.min(v.van.L * 3, Math.max(v.van.L * 0.85, v.radius * (1 + Math.sign(e.deltaY) * 0.08)));
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
    const now = performance.now();
    if (!v.van) return;
    // parked, set up, nobody touching it: 30 frames a second is plenty for firelight and drifting clouds
    const idle = v.mode !== 'drive' && v.park >= 1 && !(v.speed > 0) && v.setupT >= 1 && v.jumpTo == null && now - v.lastInteract > 2500 && v.camSettled;
    if (idle && now - v.last < 31) return;
    const rawDt = (now - v.last) / 1000, dt = Math.min(0.05, rawDt); v.last = now; v.frame++;
    const t0 = now / 1000, driving = v.mode === 'drive', ease = 1 - Math.exp(-dt * 4), g = v.van.group;
    // every look-inside view is parked up at camp: only the hero's driving shot is on the road
    const atCamp = v.mode !== 'drive' && v.mode !== 'outside';
    if (v.park === undefined) v.park = atCamp ? 1 : 0;
    const PARK = PARK_X, VMAX = 9, ACC = 3.4, BR = 4.6, KP = 3.4, smp = (p) => p * p * (3 - 2 * p);
    // the van brakes, steers onto the verge and stops in about two seconds; on the way out it packs up first, then pulls away
    if (v.speed === undefined) v.speed = driving ? 1 : 0;
    if (v.setupT === undefined) v.setupT = atCamp && v.park >= 1 ? 1 : 0;
    if (v.pOff === undefined) v.pOff = atCamp ? 0 : -999;
    let vel = v.speed * VMAX;
    const dist0 = v.dist || 0, lat0 = PARK * smp(v.park);
    if (atCamp) {
      if (v.stopAt == null) { v.p0 = v.park; v.pR0 = Math.max((1 - v.park) * 11, vel * vel / (2 * BR)); v.stopAt = dist0 + v.pR0; }
      const Rm = Math.max(0, v.stopAt - dist0);
      vel = Math.min(vel + ACC * dt, Math.sqrt(2 * BR * Rm), VMAX);
      const step = Math.min(Rm, vel * dt), Rn = Rm - step; v.dist = dist0 + step;
      // the campsite starts out of sight behind the camera and closes in as the van slows, arriving exactly as it stops
      v.pOff = Rn * KP;
      v.park = v.pR0 > 1e-4 ? v.p0 + (1 - v.p0) * (1 - Rn / v.pR0) : 1;
      if (Rn < 1e-3) { vel = 0; v.park = 1; v.pOff = 0; }
    } else {
      v.stopAt = null;
      const go = driving && v.setupT < 0.02;
      vel = go ? Math.min(VMAX, vel + ACC * 0.75 * dt) : Math.max(0, vel - BR * dt);
      v.dist = dist0 + vel * dt;
      if (v.pOff > -999) v.pOff -= vel * dt * KP; if (v.pOff < -90) v.pOff = -999;
      v.park = Math.max(0, v.park - (v.dist - dist0) / 13);
    }
    v.speed = vel / VMAX;
    const sp = v.speed, dd = v.dist - dist0, lat = PARK * smp(v.park);
    const yawT = dd > 1e-5 ? Math.atan2(lat - lat0, dd) : 0;
    v.yawV = (v.yawV || 0) + (yawT - (v.yawV || 0)) * (1 - Math.exp(-dt * 7));
    g.rotation.y = v.yawV; g.position.x = lat; v.vx = lat;
    v.contact.position.x = lat;
    v.van.lights.forEach((p, i) => v.inner[i].position.set(p[0] + lat, p[1], p[2]));
    // the camp is set out once the van has stopped, and packed away before it leaves
    const setWant = atCamp && v.park >= 1 && vel < 0.05;
    v.setupT = setWant ? Math.min(1, v.setupT + dt * 0.42) : Math.max(0, v.setupT - dt * 1.3);
    const pv = v.pOff > -999;
    v.worldParts.patch.visible = pv; v.worldParts.patch.position.set(PARK, 0, pv ? v.pOff : 0);
    if (v.camp) { v.camp.group.position.set(PARK, 0, pv ? v.pOff : 0); v.camp.group.visible = pv; }
    g.position.y = sp * (0.012 * Math.sin(t0 * 8.3) + 0.006 * Math.sin(t0 * 13.7 + 1.3));
    g.rotation.x = sp * 0.004 * Math.sin(t0 * 6.1) + (driving ? 0 : 0.006 * (sp * (1 - sp)) * 4);
    g.rotation.z = sp * 0.0028 * Math.sin(t0 * 4.7 + 0.5);
    v.van.wheels.forEach((w) => { w.rotation.x += dt * 24 * sp; });
    v.worldParts.dashes.position.z = -(v.dist % 9);
    v.worldParts.posts.position.z = -(v.dist % 24);
    const tg = this.target(), k = 1 - Math.exp(-dt * 4.5);
    v.camera.position.lerp(tg.pos, k);
    v.look.lerp(tg.look, k);
    v.camera.lookAt(v.look);
    if (Math.abs(v.camera.fov - v.fov) > 0.05) { v.camera.fov += (v.fov - v.camera.fov) * k; v.camera.updateProjectionMatrix(); }
    const ot = this.offsetTarget();
    v.offX += (ot[0] - v.offX) * ease; v.offY += (ot[1] - v.offY) * ease;
    const cw = v.canvas.clientWidth || 800, chh = v.canvas.clientHeight || 450;
    if (Math.abs(v.offX) > 0.001 || Math.abs(v.offY) > 0.001) v.camera.setViewOffset(cw, chh, v.offX * cw, v.offY * chh, cw, chh); else v.camera.clearViewOffset();
    // camp lighting follows the chosen time of day; the road keeps its own daylight
    const campWant = atCamp && v.park >= 1 && v.speed < 0.01 ? 1 : 0;
    v.campT += (campWant - v.campT) * (1 - Math.exp(-dt * 1.4));
    // the clock runs by itself at camp (a full day in about 90 seconds); tapping the button fast-forwards to the next part of the day
    if (atCamp && v.campT > 0.5) {
      if (v.jumpTo != null) { const d = (v.jumpTo - v.tod + 24) % 24, step = Math.min(d, dt * 6); v.tod = (v.tod + step) % 24; if (d - step < 0.02) v.jumpTo = null; }
      else v.tod = (v.tod + dt * 0.26) % 24;
      const per = periodOf(v.tod); if (per !== this.state.time) this.setState({ time: per });
    }
    const ck = v.campT, WP = v.worldParts, u = WP.skyMat.uniforms, sst = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
    const f = (v.tod - 6) / 14.5, elev = f >= 0 && f <= 1 ? 0.95 * Math.sin(Math.PI * f) : -0.3;
    const az = Math.atan2(DUSK.sun[2], DUSK.sun[0]) + (1 - Math.min(1, Math.max(0, f))) * 2.6;
    const wd = sst(0.1, 0.5, elev), wn = sst(0.02, -0.12, elev) * (v.tod > 20 || v.tod < 6 ? 1 : 0), dark = 1 - sst(0.02, 0.32, elev);
    // palette at this time of day: dusk -> day by sun height, then -> night
    v.pTop.copy(v.cDuskTop).lerp(v.cDayTop, wd).lerp(v.cNightTop, wn);
    v.pHor.copy(v.cDuskHor).lerp(v.cDayHor, wd).lerp(v.cNightHor, wn);
    v.pBot.copy(v.cDuskBot).lerp(v.cDayBot, wd).lerp(v.cNightBot, wn);
    v.pFog.copy(v.cDuskFog).lerp(v.cDayFog, wd).lerp(v.cNightFog, wn);
    v.pSun.copy(v.cDuskSun).lerp(v.cDaySun, wd).lerp(v.cMoon, wn);
    const ce = Math.cos(Math.max(elev, 0.03));
    v.pDir.set(Math.cos(az) * ce, Math.sin(Math.max(elev, 0.03)), Math.sin(az) * ce).normalize().lerp(v.dMoon, wn).normalize();
    const pSunI = (DUSK.sunI + (DAY.sunI - DUSK.sunI) * wd) * (1 - wn) + NIGHT.moonI * wn;
    const pHemi = (DUSK.hemiI + (DAY.hemiI - DUSK.hemiI) * wd) * (1 - wn) + NIGHT.hemiI * wn;
    const pExp = (DUSK.exposure + (DAY.exposure - DUSK.exposure) * wd) * (1 - wn) + NIGHT.exposure * wn;
    // blend from the road's daylight into the camp palette
    u.top.value.copy(v.cDayTop).lerp(v.pTop, ck); u.horizon.value.copy(v.cDayHor).lerp(v.pHor, ck); u.bottom.value.copy(v.cDayBot).lerp(v.pBot, ck);
    v.tmpV.copy(v.dDay).lerp(v.pDir, ck).normalize(); u.sunDir.value.copy(v.tmpV).multiplyScalar(1 - 0.9 * wn * ck); v.sun.position.copy(v.tmpV).multiplyScalar(30);
    v.sun.color.copy(v.cDaySun).lerp(v.pSun, ck); v.sun.intensity = DAY.sunI + (pSunI - DAY.sunI) * ck;
    v.hemi.intensity = DAY.hemiI + (pHemi - DAY.hemiI) * ck;
    v.renderer.toneMappingExposure = DAY.exposure + (pExp - DAY.exposure) * ck;
    v.scene.fog.color.copy(v.cDayFog).lerp(v.pFog, ck); v.scene.background.copy(v.scene.fog.color);
    WP.stars.visible = ck * wn > 0.01; WP.stars.material.opacity = ck * wn;
    if (ck > 0.5) {
      const key = wn > 0.5 ? 'night' : (wd > 0.5 ? 'day' : 'dusk');
      if (key === 'day') v.scene.environment = WP.env;
      else { if (!v.envs[key]) v.envs[key] = WP.bakeSky(key === 'night' ? Object.assign({}, NIGHT, { sun: NIGHT.moon }) : DUSK); v.scene.environment = v.envs[key]; }
    } else v.scene.environment = WP.env;
    WP.roadGroup.visible = true;
    v.inner.forEach((l) => { l.intensity = 2.2 + 3 * dark * ck; });
    if (v.van.glow) v.van.glow.forEach((m) => { m.emissiveIntensity = 0.55 * dark * ck; });
    const A = WP.arch; A.winM.emissiveIntensity = 0.05 + 2.4 * dark * ck; A.lampM.emissiveIntensity = 0.4 + 4 * dark * ck;
    if (A.beam) { A.beam.rotation.y = t0 * 0.9; A.beam.userData.m.uniforms.uOp.value = 0.55 * dark * ck; A.beam.visible = dark * ck > 0.05; A.glow.material.opacity = 0.25 + 0.75 * dark * ck; }
    if (v.camp) {
      const c = v.camp;
      if (c.group.visible) {
        // 1) the pitch has glided in with the stop; 2) the awning rolls out and its legs drop; 3) the fire is lit; 4) the lights come on
        const S = v.setupT, ax0 = c.ax, ph = (x, a0, a1) => { const t = Math.min(1, Math.max(0, (x - a0) / (a1 - a0))); return t * t * (3 - 2 * t); };
        const gk = 1, awnK = ph(S, 0.0, 0.4), legK = ph(S, 0.3, 0.48), fireK = ph(S, 0.5, 0.75), lightK = ph(S, 0.78, 0.95);
        c.items.forEach((it) => {
          const o = it.o;
          if (it.kind === 'awn') { o.visible = awnK > 0.002; o.scale.set(it.s.x * Math.max(awnK, 0.001), it.s.y, it.s.z); o.position.set(ax0 + (it.p.x - ax0) * awnK, it.p.y, it.p.z); }
          else if (it.kind === 'edge') {
            o.visible = awnK > 0.02; o.position.x = it.p.x + (awnK - 1) * c.reach;
            if (it.pole) { const top = it.p.y + it.h / 2, k = Math.max(legK, 0.001); o.scale.y = it.s.y * k; o.position.y = top - (top - it.p.y) * k; o.visible = legK > 0.002; }
          } else if (it.kind === 'flame') { o.userData.k = fireK * gk; }
          else { o.visible = true; }
        });
        c.fireK = fireK; c.lightK = lightK;
        c.halos.material.opacity = 0.9 * dark * lightK;
        c.bulbM.emissiveIntensity = (0.15 + 3.2 * dark) * c.lightK; c.lanternM.emissiveIntensity = (0.3 + 2.6 * dark) * c.lightK;
        // the fire burns from late afternoon through the night; by morning it is out and only smoking
        const tt = v.tod, lit = tt >= 17 ? Math.min(1, (tt - 17) / 0.8) : tt < 6.2 ? 1 : tt < 7.2 ? 1 - (tt - 6.2) : 0;
        c.flames.forEach((fm) => { fm.visible = lit > 0.02; });
        c.flames.forEach((fm, i) => { fm.scale.set(1 + 0.08 * Math.sin(t0 * 17 + i), 0.85 + 0.25 * Math.sin(t0 * (11 + i * 3)) + 0.1 * Math.sin(t0 * 29 + i), 1 + 0.08 * Math.cos(t0 * 15 + i)); fm.rotation.y = t0 * (0.8 + i * 0.4); fm.material.uniforms.uOp.value = (0.65 + 0.12 * i) * Math.min(1, ck * 1.5) * (0.45 + 0.55 * dark) * lit; fm.scale.multiplyScalar((0.35 + 0.65 * lit) * (fm.userData.k === undefined ? 1 : Math.max(0.001, fm.userData.k))); });
        c.fireLight.intensity = c.fireK * ck * lit * (0.6 + 3 * dark) * (1 + 0.22 * Math.sin(t0 * 13) + 0.12 * Math.sin(t0 * 31));
        const ep = c.ePos;
        for (let i = 0; i < c.eSeed.length; i++) {
          const s0 = c.eSeed[i]; ep[i * 3 + 1] += dt * (0.5 + s0 * 0.7);
          ep[i * 3] = c.fx + Math.sin(t0 * (1 + s0) + i) * 0.12 * (ep[i * 3 + 1]); ep[i * 3 + 2] = c.fz + Math.cos(t0 * (1.3 + s0) + i) * 0.12 * (ep[i * 3 + 1]);
          if (ep[i * 3 + 1] > 1.6 + s0 * 1.4) ep[i * 3 + 1] = 0.25;
        }
        c.embers.geometry.attributes.position.needsUpdate = true;
        c.embers.material.opacity = (0.3 + 0.6 * dark) * lit * c.fireK; c.embers.visible = lit > 0.02;
        const smokeAmt = c.fireK * ck * (1 - lit) * (tt >= 6 && tt < 12 ? 1 : 0.45);
        c.smoke.visible = smokeAmt > 0.01; c.smoke.material.opacity = 0.42 * smokeAmt;
        if (c.smoke.visible) {
          const sp2 = c.sPos;
          for (let i = 0; i < c.sSeed.length; i++) {
            const s0 = c.sSeed[i]; sp2[i * 3 + 1] += dt * (0.22 + s0 * 0.18);
            const hgt = sp2[i * 3 + 1];
            sp2[i * 3] = c.fx + Math.sin(t0 * 0.6 + i) * 0.08 * hgt + hgt * 0.18; sp2[i * 3 + 2] = c.fz + Math.cos(t0 * 0.5 + i * 1.7) * 0.08 * hgt;
            if (hgt > 2.6 + s0 * 1.2) sp2[i * 3 + 1] = 0.2;
          }
          c.smoke.geometry.attributes.position.needsUpdate = true;
        }
      }
    }
    v.worldParts.waveTex.offset.set((t0 * 0.004) % 1, (t0 * 0.0025) % 1);
    v.worldParts.skyMat.uniforms.time.value = t0;
    // the sky is rendered into a cube map now and then (faster while the clock is jumping), not every frame
    v.skyAcc += dt;
    if (v.skyAcc > (v.jumpTo != null ? 0.08 : atCamp ? 0.3 : 1.0)) { v.worldParts.bakeView(); v.skyAcc = 0; }
    const want = (v.mode === 'bed' || v.mode === 'camp') && v.setupT > 0.04 ? 1 : 0;
    v.doorT += (want - v.doorT) * (1 - Math.exp(-dt * 3));
    v.van.doors.forEach((d) => { d.pivot.rotation[d.axis] = d.open * v.doorT; });
    // shadows are redrawn only when something that casts one has moved, or the sun has
    const sunMoved = v.sun.position.distanceToSquared(v.lastSun) > 0.0004;
    const moving = sp > 0.001 || Math.abs(v.yawV || 0) > 1e-4 || (v.setupT > 0 && v.setupT < 1) || (v.pOff > -999 && v.pOff !== 0) || Math.abs(v.doorT - want) > 0.002;
    if (v.shadowDirty || sunMoved || (moving && (sp < 0.001 || v.frame % 2 === 0))) { v.renderer.shadowMap.needsUpdate = true; v.lastSun.copy(v.sun.position); v.shadowDirty = false; }
    v.camSettled = v.camera.position.distanceToSquared(tg.pos) < 1e-4;
    v.renderer.render(v.scene, v.camera);
    // adaptive resolution: if frames are slow, render fewer pixels (resets on resize)
    if (!idle && rawDt < 0.1) { v.ftA += rawDt; v.ftN++; }
    if (v.ftN >= 90) { const avg = v.ftA / v.ftN; v.ftA = 0; v.ftN = 0; if (avg > 0.024 && v.pr > 0.75) { v.pr = Math.max(0.75, v.pr - 0.25); v.renderer.setPixelRatio(v.pr); this.resize(); } }
  }

  renderVals() {
    const s = this.state;
    const on = 'min-h-[52px] shrink-0 rounded-full border-2 border-plum bg-plum px-5 text-[16px] font-bold text-white';
    const off = 'min-h-[52px] shrink-0 rounded-full border-2 border-plum/20 bg-white px-5 text-[16px] font-bold text-plum hover:border-plum';
    const viewLabel = (VIEWS.find((x) => x[0] === s.view) || VIEWS[0])[1];
    const spec = VAN_SPECS[s.van] || VAN_SPECS['man-lwb-auto'];
    const hero = this.hero, inside = hero && s.view !== 'drive';
    const viewIds = hero ? ['camp', 'driver', 'passenger', 'living', 'bed'] : ['camp', 'outside', 'driver', 'passenger', 'living', 'bed'];
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
        : 'pointer-events-none mx-auto flex min-h-[620px] max-w-[1400px] flex-col justify-start px-5 pb-10 pt-8 md:px-10 lg:min-h-[760px] lg:pb-16 lg:pt-12',
      enterInside: () => {
        this.setState({ view: 'camp' });
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
      hint: s.view === 'outside' || s.view === 'camp' ? 'Drag to rotate · scroll or pinch to zoom' : 'Drag to look around · scroll or pinch to zoom',
      ariaLabel: '3D model of the ' + spec.name + ', ' + viewLabel.toLowerCase() + ' view, ' + (s.view !== 'drive' && s.view !== 'outside' ? 'parked up for the night with a campfire, chairs and string lights' : 'on the road') + ', setting: ' + ((ENVS[this.props.env] || ENVS[spec.env] || ENVS.loch).label),
      vanOptions: VAN_ORDER.map((id) => ({ id, name: VAN_SPECS[id].name })),
      pickVan: (e) => this.setState({ van: e.target.value }),
      isCamp: s.view !== 'drive' && s.view !== 'outside',
      timeLabel: (TIMES.find((x) => x[0] === s.time) || TIMES[2])[1],
      isNight: s.time === 'night',
      isDay: s.time !== 'night',
      advanceTime: () => {
        const v = this.v; if (!v) return;
        const i = TIMES.findIndex((x) => x[0] === periodOf(v.tod)), next = TIMES[(i + 1) % TIMES.length];
        v.jumpTo = next[2];
      },
      views: viewIds.map((id) => VIEWS.find((x) => x[0] === id)).map(([id, label]) => ({ label, pressed: s.view === id ? 'true' : 'false', cls: s.view === id ? (hero ? hOn : on) : (hero ? hOff : off), pick: () => this.setState({ view: id }) }))
    };
  }
}

return Component;
})();

DC["RouteStory"] = (function () {

const ROUTES = {
  nc500: {
    title: 'The North Coast 500 & Orkney', region: 'Scotland', img: 'assets/nc500.jpg', alt: 'Kylesku Bridge across a Highland loch', seed: 1.3, loop: true, env: 'highland',
    tagline: 'A tale of single-track roads, white beaches and the edge of the map.',
    prologue: 'Some journeys begin with a plan. This one begins with a kettle on a gas ring in Inverness, a paper map spread across the table, and the slow realisation that the road ahead goes all the way to the top of Britain and back.',
    chapters: [
      { place: 'Inverness', day: 'Day 1', title: 'Where the road begins', story: 'The Highland capital sends you off gently: a walk along the River Ness, fish and chips on a bench, a last supermarket shop. By evening the city lights are behind you and the hills have started to close in.', tip: 'Fill the water tank and the fridge here. Shops grow scarce further north.' },
      { place: 'Applecross', day: 'Day 2', title: 'Over the pass of the cattle', story: 'The road climbs in tight hairpins over Bealach na Bà, one of the steepest in Britain, then tips you down to a scatter of white cottages facing Skye. Take it slowly; the view from the top deserves a pause.', tip: 'In bad weather, take the longer coast road round instead of the pass.' },
      { place: 'Ullapool', day: 'Day 3', title: 'A harbour at the end of the day', story: 'Fishing boats, a ferry horn, and streets that smell of salt. Ullapool is the last proper town for a while, and a fine place to sit outside with something warm while the light goes golden over Loch Broom.', tip: 'A good stop to empty and refill, and to book the Orkney ferry if you have not already.' },
      { place: 'Kylesku', day: 'Day 4', title: 'The bridge in the photograph', story: 'The road curves round and suddenly there it is: the elegant Kylesku Bridge, leaping across the water between two lochs. Seals sometimes haul out on the rocks below. Most people stop, and nobody regrets it.', tip: 'Park in the lay-by at the north end for the classic view.' },
      { place: 'Durness', day: 'Day 5', title: 'Sand the colour of pearls', story: 'On the very top edge of Scotland, Durness has beaches that look borrowed from somewhere warmer, and a sea cave, Smoo Cave, with a waterfall roaring inside it. The wind is fresh, the light endless in summer.', tip: 'Walk down to Smoo Cave at low tide; the steps are steep but short.' },
      { place: 'Orkney', day: 'Days 6–8', title: 'The islands of standing stones', story: 'A short ferry hop and you are among some of the oldest places in Europe: the stone village of Skara Brae, the great circle of Brodgar, quiet harbours in Stromness. Time slows to the pace of the tide.', tip: 'Book the ferry with the van in advance in summer. [Confirm crossing details]' },
      { place: 'Back to Inverness', day: 'Days 9–10', title: 'The long road home', story: 'Down the east coast now, past fairy-tale Dunrobin Castle and fields of grazing sheep, the land softening mile by mile. By the time Inverness reappears, you will have a camera full of light and a few stories of your own.', tip: 'Leave a spare day; the north coast has a way of making people linger.' }
    ],
    vans: ['man-lwb-auto', 't5-compact']
  },
  hebrides: {
    title: 'Hebridean Island Hopping', region: 'Scotland', img: 'assets/hebrides.jpg', alt: 'White sand and dune grass on a Hebridean beach', seed: 2.1, loop: false, env: 'island',
    tagline: 'Ferries, machair and beaches you will not believe are in Britain.',
    prologue: 'The Outer Hebrides sit out in the Atlantic like a string of beads. Getting there takes a ferry and a little patience. What you find is space: long sand, wide skies and an old, gentle way of life.',
    chapters: [
      { place: 'Uig, Skye', day: 'Day 1', title: 'Waiting for the boat', story: 'The ferry terminal at Uig is small, the hills behind it steep and green. You queue in the van with a flask of tea, watching the boat slide into the bay. The adventure begins with a horn.', tip: 'Arrive early for your sailing; vans are loaded in order.' },
      { place: 'Tarbert, Harris', day: 'Day 2', title: 'Tweed and tide', story: 'Harris greets you with rock and heather, then softens into the weaving town of Tarbert, where cloth has been made by hand for generations. The road south feels like the edge of the world.', tip: 'Single-track roads: use the passing places, and wave.' },
      { place: 'Luskentyre', day: 'Day 3', title: 'The beach of turquoise water', story: 'Luskentyre is the beach people show you on their phones and you assume has been filtered. It has not. The sand is white, the water impossibly blue, and on a still day the only sound is the sea.', tip: 'Park considerately; the road to the beach is narrow.' },
      { place: 'Callanish, Lewis', day: 'Day 4', title: 'Stones older than the pyramids', story: 'On a low ridge on Lewis, a cross of tall stones stands against the sky, raised thousands of years ago for reasons nobody fully knows. Visit at dusk and you may have them to yourself.', tip: 'The visitor centre has a café and good parking.' },
      { place: 'Stornoway', day: 'Day 5', title: 'Back across the Minch', story: 'Stornoway is the islands’ harbour town, busy with boats and gulls. From here the ferry carries you back to Ullapool, the islands shrinking behind you while you plan when to return.', tip: '[Confirm the return crossing and timings]' }
    ],
    vans: ['t5-compact', 'man-mwb']
  },
  edinburgh: {
    title: 'Edinburgh, Loch Ness & the Highlands', region: 'Scotland', img: 'assets/edinburgh.jpg', alt: 'Edinburgh skyline from Calton Hill at sunrise', seed: 3.7, loop: true, env: 'highland',
    tagline: 'Castles, lochs and a monster story or two.',
    prologue: 'This is Scotland in one long, generous loop: a capital of spires and closes, a glen of legends, and a loch so deep and dark that people have been telling stories about it for centuries.',
    chapters: [
      { place: 'Edinburgh', day: 'Day 1', title: 'A city on a volcano', story: 'The castle sits on an old volcanic rock above the Royal Mile. Climb Calton Hill at sunrise and the whole city glows below you, the sea glinting beyond.', tip: 'Stay at a site on the edge of the city and take the bus in.' },
      { place: 'Stirling', day: 'Day 2', title: 'The gateway to the Highlands', story: 'Stirling Castle watches over the plain where great battles were fought. Beyond it the land lifts, and you can feel the Highlands beginning.', tip: 'The castle car park fills early in summer.' },
      { place: 'Glencoe', day: 'Day 3', title: 'The glen of weeping', story: 'Glencoe is grand and a little sad, its mountains rising sheer from the valley floor. Pull in, switch off the engine and simply look.', tip: 'Several lay-bys give big views without a long walk.' },
      { place: 'Loch Ness', day: 'Day 4', title: 'Watching the water', story: 'The ruins of Urquhart Castle stand on a point above the loch. Nessie rarely shows up, but the water is long and dark and strangely compelling.', tip: 'Arrive early or late to avoid the coach crowds.' },
      { place: 'Pitlochry', day: 'Day 5', title: 'Salmon and slow roads home', story: 'A Victorian town of tearooms and a dam where salmon leap up a fish ladder. From here the road runs gently south towards Edinburgh.', tip: 'A gentle last night before the return to the city.' }
    ],
    vans: ['man-lwb-auto', 'crafter-auto']
  },
  wales: {
    title: 'North Wales, Snowdonia, Castles & Coast', region: 'Wales', img: 'assets/wales.jpg', alt: 'Caernarfon Castle lit up at sunset', seed: 4.4, loop: true, env: 'hills',
    tagline: 'A story told in stone towers and mountain waterfalls.',
    prologue: 'North Wales packs mountains, sea and some of the finest castles in Europe into a small, easy loop. Every few miles there is another reason to stop.',
    chapters: [
      { place: 'Conwy', day: 'Day 1', title: 'Walls you can walk on', story: 'Conwy is still wrapped in its medieval town walls. Walk the walls at golden hour, then wander down to the quay and the smallest house in Britain.', tip: 'Park outside the walls; the town streets are narrow.' },
      { place: 'Betws-y-Coed', day: 'Day 2', title: 'Into the green valleys', story: 'A village of stone bridges and tumbling rivers on the edge of Snowdonia. A short walk takes you to Swallow Falls, loud with water after rain.', tip: 'A good base for gentle forest walks.' },
      { place: 'Llanberis', day: 'Day 3', title: 'Under the mountain', story: 'At the foot of Yr Wyddfa (Snowdon), you can ride the little mountain railway towards the summit or watch the clouds pour over the ridge from the lake shore.', tip: 'Book the mountain railway ahead in summer.' },
      { place: 'Caernarfon', day: 'Day 4', title: 'A castle like a crown', story: 'Caernarfon Castle rises from the water’s edge, its many-sided towers glowing when lit at dusk. It is the kind of place that makes history feel close.', tip: 'Stay for the evening light on the Menai Strait.' },
      { place: 'Anglesey', day: 'Day 5', title: 'Island lanes and lighthouses', story: 'Cross the bridge to Anglesey for quiet lanes, sandy coves and the lighthouse at South Stack, perched above seabird cliffs.', tip: 'Bring binoculars for the seabirds at South Stack.' }
    ],
    vans: ['toleno', 'crafter-manual']
  },
  lakes: {
    title: 'The Lake District Meres & Mountains', region: 'England', img: 'assets/lakes.jpg', alt: 'A wooden jetty on Windermere at sunset', seed: 5.2, loop: true, env: 'hills',
    tagline: 'Poets’ cottages, steamers and still water at dawn.',
    prologue: 'The Lake District is a place that inspired poets and painters, and it still has that effect. The trick is to slow down: one lake, one walk, one long lunch at a time.',
    chapters: [
      { place: 'Windermere', day: 'Day 1', title: 'The steamer at Bowness', story: 'Begin on the water. A lake cruise from Bowness carries you between wooded islands while the fells rise all around.', tip: 'Sites around Windermere book up early in summer.' },
      { place: 'Grasmere', day: 'Day 2', title: 'Where Wordsworth wrote', story: 'Dove Cottage, the poet’s home, sits on the edge of a village famous for its gingerbread. The walk round the lake is short and lovely.', tip: 'Buy the gingerbread. Everybody does.' },
      { place: 'Keswick', day: 'Day 3', title: 'Derwentwater and the stone circle', story: 'A busy market town on Derwentwater, with Castlerigg Stone Circle on the hill above it, ringed by mountains on every side.', tip: 'Visit Castlerigg at sunset for the best light.' },
      { place: 'Buttermere', day: 'Day 4', title: 'The quiet lake', story: 'Over the Honister Pass to Buttermere, small and perfect, with a level path all the way round. Many visitors say it is their favourite.', tip: 'The pass is steep; take it slowly in the van.' },
      { place: 'Ullswater', day: 'Day 5', title: 'Daffodils and a long goodbye', story: 'Ullswater curls between the fells, with the waterfall at Aira Force tucked in the woods above it. A good place to end, looking back over still water.', tip: 'Ullswater’s lake steamers make a gentle last outing.' }
    ],
    vans: ['man-mwb', 't5-widebed']
  },
  york: {
    title: 'York & the North York Moors', region: 'England', img: 'assets/whitby.jpg', alt: 'Whitby Abbey ruins under a blue sky', seed: 6.6, loop: false, env: 'hills',
    tagline: 'A medieval city, purple moors and a ruined abbey by the sea.',
    prologue: 'From the crooked lanes of York to the clifftop ruins at Whitby, this is a short route full of stories, old and newer.',
    chapters: [
      { place: 'York', day: 'Day 1', title: 'Inside the city walls', story: 'York Minster soars above the rooftops, and the Shambles leans in so close you could almost shake hands across the street.', tip: 'Use the park-and-ride; the centre is best on foot.' },
      { place: 'Helmsley', day: 'Day 2', title: 'Market town and castle', story: 'A handsome market square, a ruined castle and the start of the moors. Picnic supplies are easy to find here.', tip: 'Good bakeries for the road ahead.' },
      { place: 'Hutton-le-Hole', day: 'Day 3', title: 'Sheep on the green', story: 'A village where sheep wander across the green and a little stream runs beside the road. In late summer the moors all around turn purple with heather.', tip: 'Go slowly: the sheep have right of way.' },
      { place: 'Whitby', day: 'Day 4', title: 'The abbey on the cliff', story: 'Climb the 199 steps to the abbey ruins above the harbour, where the story of Dracula was partly inspired. Fish and chips taste better here, everyone agrees.', tip: 'Park above the town and walk down.' },
      { place: 'Robin Hood’s Bay', day: 'Day 5', title: 'A smugglers’ village', story: 'Cottages tumble down to the sea in a tangle of steps and alleys once used by smugglers. At low tide, rock pools stretch out across the bay.', tip: 'Leave the van at the top car park; the lane down is very steep.' }
    ],
    vans: ['crafter-auto', 't5-spacious']
  },
  cotswolds: {
    title: 'The Cotswolds Villages & Gardens', region: 'England', img: 'assets/cotswolds.jpg', alt: 'Honey-stone cottages beside a stream in the Cotswolds', seed: 7.9, loop: true, env: 'downs',
    tagline: 'Honey-stone villages, gardens and a little Shakespeare.',
    prologue: 'In the Cotswolds the stone glows gold in the evening and every village seems to have a stream, a tea room and a church older than most countries.',
    chapters: [
      { place: 'Bourton-on-the-Water', day: 'Day 1', title: 'The little Venice', story: 'Low stone bridges cross a shallow river running right through the village. Paddle, people-watch, and eat an ice cream on the green.', tip: 'Arrive early before the coaches.' },
      { place: 'The Slaughters', day: 'Day 2', title: 'Two villages, one footpath', story: 'Upper and Lower Slaughter are joined by a gentle riverside path past a working water mill. It is hard to find anywhere more peaceful.', tip: 'Walk between them; parking is very limited.' },
      { place: 'Chipping Campden', day: 'Day 3', title: 'The finest high street', story: 'A curved high street of honey-coloured houses and an old market hall, at the start of the long-distance Cotswold Way.', tip: 'A good place for lunch and an evening stroll.' },
      { place: 'Stratford-upon-Avon', day: 'Day 4', title: 'Where Shakespeare was born', story: 'Visit the house where Shakespeare was born, then watch the swans and the boats along the river before an evening at the theatre.', tip: 'Book theatre tickets ahead.' },
      { place: 'Bibury', day: 'Day 5', title: 'The postcard row', story: 'Arlington Row, a line of weavers’ cottages beside a meadow, is one of the most photographed scenes in England, and it is easy to see why.', tip: 'Early morning is quietest for photographs.' }
    ],
    vans: ['t5-spacious', 'crafter-manual']
  },
  cornwall: {
    title: 'Cornwall', region: 'South West', img: 'assets/cornwall.jpg', alt: 'Flowers above a Cornish cove', seed: 8.3, loop: false, env: 'coastal',
    tagline: 'Fishing villages, wild headlands and a theatre carved into a cliff.',
    prologue: 'Cornwall is a long arm of land reaching into the Atlantic, with a different sea on each side. Every cove has a story, and most have a café.',
    chapters: [
      { place: 'St Ives', day: 'Day 1', title: 'Light that drew the painters', story: 'Artists came for the clear light and stayed for the harbour. Wander the galleries, then sit on the sand at Porthmeor as the surfers come in.', tip: 'Use the park-and-ride train into town.' },
      { place: 'Land’s End', day: 'Day 2', title: 'The far end of England', story: 'Cliffs drop into churning sea at England’s western tip, with the Longships lighthouse out among the waves.', tip: 'The coast path either side is quieter than the visitor centre.' },
      { place: 'The Minack Theatre', day: 'Day 3', title: 'A stage above the sea', story: 'An open-air theatre carved into the cliffs, its stage hanging over a turquoise bay. Even without a show, the view is a performance.', tip: 'Check performance dates and bring a cushion.' },
      { place: 'St Michael’s Mount', day: 'Day 4', title: 'The island castle', story: 'At low tide a cobbled causeway rises from the sea and you can walk out to the castle on its island; at high tide, a little boat carries you across.', tip: 'Check the tide times before you go.' },
      { place: 'Padstow', day: 'Day 5', title: 'Harbour suppers', story: 'A lively fishing harbour on the north coast, known for its seafood. End the trip with supper on the quay as the boats come in.', tip: 'Book ahead for the popular restaurants.' }
    ],
    vans: ['t5-compact', 'crafter-auto']
  },
  dorset: {
    title: 'Dorset & the Jurassic Coast', region: 'South West', img: 'assets/durdle.jpg', alt: 'Durdle Door rock arch on the Jurassic Coast', seed: 9.1, loop: false, env: 'coastal',
    tagline: 'A coastline that tells 185 million years of history.',
    prologue: 'The Jurassic Coast is a cliff-lined time machine. Its rocks hold the story of ancient seas and deserts, and its beaches still give up fossils after every storm.',
    chapters: [
      { place: 'Lulworth & Durdle Door', day: 'Day 1', title: 'The arch in the sea', story: 'A great limestone arch stands in clear water below the cliffs, a short, steep walk from the perfect round bay of Lulworth Cove.', tip: 'Wear proper shoes for the steep path down.' },
      { place: 'Corfe Castle', day: 'Day 2', title: 'A ruin on a hill', story: 'The jagged ruins of Corfe Castle crown a hill above a village of stone cottages, with a steam railway puffing through below.', tip: 'Catch the steam train to Swanage for a day off driving.' },
      { place: 'Abbotsbury', day: 'Day 3', title: 'Swans and a long pebble beach', story: 'A thatched village with a swannery, where hundreds of swans nest beside the lagoon behind Chesil Beach.', tip: 'Visit the swannery in late spring for the cygnets.' },
      { place: 'Lyme Regis', day: 'Day 4', title: 'Hunting for fossils', story: 'Walk the beaches beneath the cliffs and look down: ammonites and other fossils turn up among the pebbles, just as they did for the famous fossil hunter Mary Anning.', tip: 'Search on a falling tide and keep away from the cliff base.' }
    ],
    vans: ['man-lwb-manual', 't5-widebed']
  },
  causeway: {
    title: 'Northern Ireland: Coast, Castles & Emerald Green', region: 'Northern Ireland', img: 'assets/causeway.jpg', alt: 'Basalt columns of the Giant’s Causeway', seed: 10.4, loop: false, env: 'coastal',
    tagline: 'Giants’ stepping stones, a rope bridge and castles on the cliffs.',
    prologue: 'The Causeway Coast is short in miles and long on wonder: a road that hugs green cliffs above a wild sea, with a legend round every bend.',
    chapters: [
      { place: 'Belfast', day: 'Day 1', title: 'The city that built a ship', story: 'Belfast’s Titanic Quarter tells the story of the shipyard that built the famous liner. Then it is north along the coast road.', tip: 'Check ferry options for bringing the van across. [Confirm]' },
      { place: 'Carrick-a-Rede', day: 'Day 2', title: 'A bridge over the waves', story: 'A rope bridge sways between the mainland and a tiny island, high above the sea. Brave the crossing or simply enjoy the view.', tip: 'Book bridge tickets online in advance.' },
      { place: 'Giant’s Causeway', day: 'Day 3', title: 'The giant’s stepping stones', story: 'Some forty thousand stone columns step down into the sea. Science says lava; local legend says a giant called Finn McCool. Either way, it is astonishing.', tip: 'Go early in the morning for fewer people.' },
      { place: 'Dunluce Castle', day: 'Day 4', title: 'A castle on the edge', story: 'The ruins of Dunluce cling to a cliff top so close to the edge that, legend has it, part of the kitchen once fell into the sea.', tip: 'Sunset is the best time for photographs.' }
    ],
    vans: ['crafter-auto', 'man-lwb-auto']
  },
  belgium: {
    title: 'Belgium: Medieval Towns & the Great War', region: 'Europe', img: 'assets/bruges.jpg', alt: 'Bruges market square lit at dusk', seed: 11.7, loop: false, env: 'flat',
    tagline: 'Canals, chocolate and the quiet places of remembrance.',
    prologue: 'A short crossing and the van rolls onto the flat green fields of Flanders. This chapter of the trip is about beauty and memory: medieval towns of spires and canals, and the battlefields of the First World War.',
    chapters: [
      { place: 'Across the Channel', day: 'Day 1', title: 'Over the water', story: 'Watch the white cliffs fade from the ferry deck, then drive on to the Continent. In under two hours you are among canals and church towers.', tip: '[Confirm crossing, cover and documents for Europe]' },
      { place: 'Bruges', day: 'Day 2', title: 'A city of canals', story: 'Bruges is a fairy tale of canals, cobbles and stepped gables. Take a boat trip, climb the belfry, and choose your chocolates slowly.', tip: 'Stay outside the centre and cycle in.' },
      { place: 'Ghent', day: 'Day 3', title: 'Towers and quaysides', story: 'Livelier than Bruges, Ghent has a castle in the middle of town and quays lined with grand old guild houses.', tip: 'The evening lights along the Graslei are beautiful.' },
      { place: 'Ypres', day: 'Day 4', title: 'The Last Post', story: 'Every evening at the Menin Gate, buglers play the Last Post for the soldiers of the Great War. It is a simple, moving ceremony.', tip: 'Arrive a little before 8pm to find a place.' },
      { place: 'Tyne Cot', day: 'Day 5', title: 'A field of remembrance', story: 'The largest Commonwealth war cemetery in the world lies peacefully among farmland. Many visitors leave a quiet note or a poppy.', tip: 'Allow time; the visitor centre tells the soldiers’ stories.' }
    ],
    vans: ['man-lwb-manual', 'crafter-auto']
  }
};
const ROUTE_ORDER = ['nc500', 'hebrides', 'edinburgh', 'wales', 'lakes', 'york', 'cotswolds', 'cornwall', 'dorset', 'causeway', 'belgium'];

const ROUTE_HREF = {nc500:'route-nc500.html',hebrides:'route-hebrides.html',edinburgh:'route-edinburgh.html',wales:'route-wales.html',lakes:'route-lakes.html',york:'route-york.html',cotswolds:'route-cotswolds.html',cornwall:'route-cornwall.html',dorset:'route-dorset.html',causeway:'route-causeway.html',belgium:'route-belgium.html'};
const VAN_PAGES = {"man-lwb-auto": {"href": "van-man-lwb-auto.html", "label": "MAN TGE LWB Luxury", "img": "assets/v-man-lwb-auto.jpg"}, "man-lwb-manual": {"href": "van-man-lwb-manual.html", "label": "MAN TGE LWB Luxury · Manual", "img": "assets/v-man-lwb-manual.jpg"}, "man-mwb": {"href": "van-man-mwb.html", "label": "MAN TGE MWB", "img": "assets/v-man-mwb.jpg"}, "crafter-auto": {"href": "van-crafter-auto.html", "label": "VW Crafter LWB · Automatic", "img": "assets/v-crafter-auto.jpg"}, "crafter-manual": {"href": "van-crafter-manual.html", "label": "VW Crafter LWB · Manual", "img": "assets/v-crafter-manual.jpg"}, "toleno": {"href": "van-toleno.html", "label": "Toleno R", "img": "assets/v-toleno.jpg"}, "t5-spacious": {"href": "van-t5-spacious.html", "label": "VW T5 Spacious", "img": "assets/v-t5-spacious.jpg"}, "t5-widebed": {"href": "van-t5-widebed.html", "label": "VW T5 Wide Bed", "img": "assets/v-t5-widebed.jpg"}, "t5-compact": {"href": "van-t5-compact.html", "label": "VW T5 Compact", "img": "assets/v-t5-compact.jpg"}};
// ROUTES data is inserted above this line by the build
const R_ENV = {
  highland: { amp: 15, grass: ['#4c6634', '#6f7a3c'], snow: true, sky: '#bcd4ea', sea: '#2a5872' },
  island:   { amp: 7, grass: ['#5d7a3a', '#8a8a4a'], islands: true, sky: '#c4dcef', sea: '#23708f' },
  hills:    { amp: 11, grass: ['#4f6e36', '#7a8547'], sky: '#c2d8ec', sea: '#2a5872' },
  downs:    { amp: 5, grass: ['#6d9a3e', '#a9a957'], fields: true, sky: '#cbe0f3', sea: '#2d6382' },
  coastal:  { amp: 8, grass: ['#5d7a3a', '#8a8a4a'], sky: '#c6def2', sea: '#22658a' },
  flat:     { amp: 2.2, grass: ['#6d9a3e', '#8fae4c'], fields: true, sky: '#cfe0ef', sea: '#3a6b86' }
};
function rh(x, y) { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); }
function rn(x, y) { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf); const a = rh(xi, yi), b = rh(xi + 1, yi), c = rh(xi, yi + 1), d = rh(xi + 1, yi + 1); return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v; }
function rf(x, y, o) { let s = 0, a = 0.5, f = 1; for (let i = 0; i < (o || 4); i++) { s += a * rn(x * f, y * f); f *= 2; a *= 0.5; } return s; }

function buildRouteMap(T, R) {
  const E = R_ENV[R.env] || R_ENV.hills, group = new T.Group(), disp = [], seed = R.seed;
  const land = (x, z) => {
    const d = Math.sqrt(x * x + z * z) / 95, n = rf(x * 0.025 + seed, z * 0.025 - seed, 5);
    let m = 1 - d * 1.15 + (n - 0.5) * 0.9;
    if (E.islands) m = Math.max(m - 0.15, (rf(x * 0.04 + 5, z * 0.04, 3) - 0.48) * 1.2) * (1 - d * 0.35);
    return m;
  };
  const height = (x, z) => { const m = land(x, z); if (m <= 0) return m * 6; return m * E.amp * (0.55 + rf(x * 0.05 - seed, z * 0.05, 4)) + 0.3; };
  const geo = new T.PlaneGeometry(240, 240, 200, 200); geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position, cols = [], c = new T.Color(), gA = new T.Color(E.grass[0]), gB = new T.Color(E.grass[1]), sand = new T.Color('#d8c9a0'), rock = new T.Color('#8a857c'), snow = new T.Color('#f4f6f8');
  const fieldPal = ['#6d9a3e', '#86a548', '#a9a957', '#c8b25a', '#5f8a3a'].map((x) => new T.Color(x));
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i), h = height(x, z); pos.setY(i, h);
    c.copy(gA).lerp(gB, rf(x * 0.08, z * 0.08, 2));
    if (E.fields) c.copy(fieldPal[Math.floor(rh(Math.floor(x / 9), Math.floor(z / 7)) * fieldPal.length)]);
    if (h < 0.9) c.lerp(sand, Math.min(1, (0.9 - h) / 0.6));
    if (h > E.amp * 0.65) c.lerp(rock, Math.min(1, (h - E.amp * 0.65) / (E.amp * 0.3)));
    if (E.snow && h > E.amp * 0.95) c.lerp(snow, Math.min(1, (h - E.amp * 0.95) / (E.amp * 0.2)));
    cols.push(c.r, c.g, c.b);
  }
  geo.setAttribute('color', new T.Float32BufferAttribute(cols, 3)); geo.computeVertexNormals();
  const lm = new T.MeshStandardMaterial({ vertexColors: true, roughness: 1, flatShading: false });
  const terrain = new T.Mesh(geo, lm); terrain.receiveShadow = true; terrain.castShadow = true; group.add(terrain); disp.push(geo, lm);
  const wm = new T.MeshStandardMaterial({ color: E.sea, roughness: 0.22, metalness: 0.05, transparent: true, opacity: 0.94 });
  const water = new T.Mesh(new T.CircleGeometry(400, 64), wm); water.rotation.x = -Math.PI / 2; water.position.y = 0.05; group.add(water); disp.push(water.geometry, wm);
  // trees
  const tg = new T.ConeGeometry(0.9, 2.6, 6); tg.translate(0, 1.3, 0); const tm = new T.MeshStandardMaterial({ color: '#2f4a2e', roughness: 1, flatShading: true });
  const N = 900, trees = new T.InstancedMesh(tg, tm, N), mx = new T.Matrix4(), q = new T.Quaternion(), s3 = new T.Vector3(), p3 = new T.Vector3(); let k = 0;
  for (let i = 0; i < N * 3 && k < N; i++) { const x = (rh(i, 1) - 0.5) * 220, z = (rh(i, 2) - 0.5) * 220, h = height(x, z); if (h < 1.2 || h > E.amp * 0.7 || rf(x * 0.04 + 9, z * 0.04, 2) < 0.5) continue; const sc = 0.6 + rh(i, 3) * 0.8; p3.set(x, h - 0.1, z); s3.set(sc, sc, sc); mx.compose(p3, q, s3); trees.setMatrixAt(k++, mx); }
  trees.count = k; trees.castShadow = true; group.add(trees); disp.push(tg, tm);
  // stops placed on land, then the road between them
  const n = R.chapters.length, stops = [];
  for (let i = 0; i < n; i++) {
    let x, z;
    if (R.loop) { const a = seed + (i / n) * Math.PI * 2; const r = 46 + 14 * Math.sin(i * 1.7 + seed); x = Math.cos(a) * r; z = Math.sin(a) * r; }
    else { const t = n === 1 ? 0.5 : i / (n - 1); x = -68 + 136 * t; z = -34 + 68 * t + Math.sin(t * Math.PI * 2 + seed) * 22; }
    for (let g = 0; g < 30 && height(x, z) < 1.4; g++) { x *= 0.9; z *= 0.9; }
    stops.push(new T.Vector3(x, Math.max(height(x, z), 0.6), z));
  }
  // a little village at every stop: whitewashed or stone houses with dark roofs, and a church tower
  { const wallG = new T.BoxGeometry(1.5, 1.2, 2.2); wallG.translate(0, 0.6, 0);
    const rs = new T.Shape(); rs.moveTo(-0.9, 0); rs.lineTo(0.9, 0); rs.lineTo(0, 0.9); rs.lineTo(-0.9, 0);
    const roofG = new T.ExtrudeGeometry(rs, { depth: 2.5, bevelEnabled: false }); roofG.translate(0, 1.2, -1.25);
    const towerG = new T.BoxGeometry(1.2, 3.6, 1.2); towerG.translate(0, 1.8, 0); const spireG = new T.ConeGeometry(0.95, 2.2, 4); spireG.rotateY(Math.PI / 4); spireG.translate(0, 4.7, 0);
    const wallM = new T.MeshStandardMaterial({ color: '#ffffff', roughness: 0.9 }), roofM = new T.MeshStandardMaterial({ color: '#3d434b', roughness: 0.85 });
    const per = 7, n = stops.length * per, walls = new T.InstancedMesh(wallG, wallM, n), roofs = new T.InstancedMesh(roofG, roofM, n);
    const towers = new T.InstancedMesh(towerG, wallM, stops.length), spires = new T.InstancedMesh(spireG, roofM, stops.length);
    const mx = new T.Matrix4(), q = new T.Quaternion(), sc = new T.Vector3(1, 1, 1), pv = new T.Vector3(), up = new T.Vector3(0, 1, 0), tint = new T.Color();
    const tints = ['#ece7dc', '#e2dccf', '#b9ab90', '#a59a86', '#f2efe8'];
    stops.forEach((st, si) => {
      for (let k = 0; k < per; k++) {
        const a = rh(si, k) * Math.PI * 2, r = 3.2 + rh(k, si + 7) * 4.5, x = st.x + Math.cos(a) * r, z = st.z + Math.sin(a) * r;
        pv.set(x, Math.max(height(x, z), 0.5) - 0.1, z); q.setFromAxisAngle(up, a + (rh(si + 3, k) > 0.5 ? Math.PI / 2 : 0)); const s0 = 0.8 + rh(k + 9, si) * 0.5; sc.set(s0, s0, s0);
        mx.compose(pv, q, sc); walls.setMatrixAt(si * per + k, mx); roofs.setMatrixAt(si * per + k, mx);
        walls.setColorAt(si * per + k, tint.set(tints[Math.floor(rh(si + 5, k + 2) * tints.length)]));
      }
      const a = rh(si, 99) * Math.PI * 2, x = st.x + Math.cos(a) * 5.5, z = st.z + Math.sin(a) * 5.5;
      pv.set(x, Math.max(height(x, z), 0.5) - 0.1, z); q.identity(); sc.set(1, 1, 1); mx.compose(pv, q, sc); towers.setMatrixAt(si, mx); spires.setMatrixAt(si, mx);
      towers.setColorAt(si, tint.set('#cfc4ad'));
    });
    [walls, roofs, towers, spires].forEach((m) => { m.castShadow = true; m.receiveShadow = true; group.add(m); });
    disp.push(wallG, roofG, towerG, spireG, wallM, roofM);
  }
  const base = new T.CatmullRomCurve3(stops, R.loop, 'centripetal');
  const samples = base.getSpacedPoints(600).map((p) => new T.Vector3(p.x, Math.max(height(p.x, p.z), 0.4) + 0.45, p.z));
  const path = new T.CatmullRomCurve3(samples, R.loop);
  const roadM = new T.MeshStandardMaterial({ color: '#D62842', emissive: '#7a0f1f', emissiveIntensity: 0.5, roughness: 0.4 });
  const tube = new T.Mesh(new T.TubeGeometry(path, 900, 0.42, 8, R.loop), roadM); tube.castShadow = true; group.add(tube); disp.push(tube.geometry, roadM);
  // pins with numbers
  const pins = stops.map((p, i) => {
    const pg = new T.Group(); pg.position.copy(p); group.add(pg);
    const poleM = new T.MeshStandardMaterial({ color: '#341C5A', roughness: 0.4 }); const headM = new T.MeshStandardMaterial({ color: '#341C5A', roughness: 0.35, emissive: '#170B2B', emissiveIntensity: 0.4 });
    const pole = new T.Mesh(new T.CylinderGeometry(0.12, 0.12, 4.2, 8), poleM); pole.position.y = 2.1; pg.add(pole);
    const head = new T.Mesh(new T.SphereGeometry(1.25, 20, 14), headM); head.position.y = 4.8; head.castShadow = true; pg.add(head);
    const cv = document.createElement('canvas'); cv.width = cv.height = 128; const cx = cv.getContext('2d');
    cx.fillStyle = '#ffffff'; cx.beginPath(); cx.arc(64, 64, 58, 0, Math.PI * 2); cx.fill(); cx.fillStyle = '#341C5A'; cx.font = 'bold 70px Lato, Arial, sans-serif'; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText(String(i + 1), 64, 68);
    const tex = new T.CanvasTexture(cv); tex.colorSpace = T.SRGBColorSpace;
    const sm = new T.SpriteMaterial({ map: tex, depthTest: false }); const sp = new T.Sprite(sm); sp.scale.set(2.4, 2.4, 1); sp.position.y = 7.4; sp.renderOrder = 5; pg.add(sp);
    disp.push(pole.geometry, head.geometry, poleM, headM, tex, sm);
    return { group: pg, headM, poleM };
  });
  // a little van driving the route
  const van = new T.Group(); group.add(van);
  const body = new T.Mesh(new T.BoxGeometry(1.5, 1.5, 3.2), new T.MeshStandardMaterial({ color: '#f4f4f2', roughness: 0.35, metalness: 0.2 })); body.position.y = 1.05; body.castShadow = true; van.add(body);
  const glass = new T.Mesh(new T.BoxGeometry(1.52, 0.5, 2.6), new T.MeshStandardMaterial({ color: '#1a2230', roughness: 0.1 })); glass.position.set(0, 1.35, -0.1); van.add(glass);
  const nose = new T.Mesh(new T.BoxGeometry(1.45, 0.75, 0.6), body.material); nose.position.set(0, 0.62, 1.85); van.add(nose);
  const stripe = new T.Mesh(new T.BoxGeometry(1.53, 0.12, 3.0), new T.MeshStandardMaterial({ color: '#D62842' })); stripe.position.y = 0.75; van.add(stripe);
  disp.push(body.geometry, body.material, glass.geometry, glass.material, nose.geometry, stripe.geometry, stripe.material);
  return { group, disp, stops, path, pins, van, height, sky: E.sky };
}

class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.state = { chapter: -1 };
    this.canvasRef = (el) => this.mount(el);
    this.chapterEls = [];
    this.v = null;
  }
  componentWillUnmount() { const v = this.v; if (this.io) this.io.disconnect(); if (!v) return; cancelAnimationFrame(v.raf); v.running = false; if (v.ro) v.ro.disconnect(); if (v.io) v.io.disconnect(); v.map.disp.forEach((d) => d.dispose && d.dispose()); v.renderer.dispose(); this.v = null; }
  route() { return ROUTES[this.props.route] || ROUTES.nc500; }
  watch(el, i) {
    if (!el || this.chapterEls[i] === el) return;
    this.chapterEls[i] = el;
    if (!this.io) this.io = new IntersectionObserver((es) => { es.forEach((e) => { if (e.isIntersecting) { const k = Number(e.target.getAttribute('data-ch')); if (k !== this.state.chapter) this.setState({ chapter: k }); } }); }, { rootMargin: '-45% 0px -45% 0px' });
    this.io.observe(el);
  }
  mount(el) {
    if (!el || (this.v && this.v.canvas === el)) return;
    const T = window.THREE; if (!T) return;
    let renderer; try { renderer = new T.WebGLRenderer({ canvas: el, antialias: true }); } catch (e) { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); renderer.outputColorSpace = T.SRGBColorSpace; renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap;
    const scene = new T.Scene(), camera = new T.PerspectiveCamera(38, 1, 0.5, 1500);
    const map = buildRouteMap(T, this.route());
    scene.add(map.group); scene.background = new T.Color(map.sky); scene.fog = new T.Fog(map.sky, 220, 620);
    scene.add(new T.HemisphereLight(0xe6f0ff, 0x6a6448, 1.1));
    const sun = new T.DirectionalLight(0xfff1dc, 2.4); sun.position.set(80, 120, 60); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -130, right: 130, top: 130, bottom: -130, near: 10, far: 400 }); sun.shadow.bias = -0.0005; scene.add(sun);
    const io = new IntersectionObserver((es) => { if (this.v) this.v.vis = es[0].isIntersecting; }); io.observe(el);
    this.v = { io, vis: true, T, canvas: el, renderer, scene, camera, map, look: new T.Vector3(), camPos: new T.Vector3(0, 170, 170), az: 0, drag: null, u: 0, last: performance.now(), raf: 0, running: true };
    const v = this.v;
    el.addEventListener('pointerdown', (e) => { v.drag = e.clientX; try { el.setPointerCapture(e.pointerId); } catch (x) {} });
    el.addEventListener('pointermove', (e) => { if (v.drag == null) return; v.az -= (e.clientX - v.drag) * 0.005; v.drag = e.clientX; });
    const end = () => { v.drag = null; }; el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
    v.ro = new ResizeObserver(() => this.resize()); v.ro.observe(el); this.resize();
    camera.position.copy(v.camPos); camera.lookAt(0, 0, 0);
    this.tick();
  }
  resize() { const v = this.v; if (!v) return; const w = v.canvas.clientWidth || 600, h = v.canvas.clientHeight || 600; v.renderer.setSize(w, h, false); v.camera.aspect = w / h; v.camera.updateProjectionMatrix(); }
  tick() {
    const v = this.v; if (!v || !v.running) return;
    v.raf = requestAnimationFrame(() => this.tick());
    const now = performance.now(), dt = Math.min(0.05, (now - v.last) / 1000); v.last = now;
    const T = v.T, ch = this.state.chapter, m = v.map, k = 1 - Math.exp(-dt * 2.2);
    let tgt, cp;
    if (ch < 0 || ch >= m.stops.length) { tgt = new T.Vector3(0, 0, 0); const a = 0.6 + v.az; cp = new T.Vector3(Math.sin(a) * 150, 150, Math.cos(a) * 150); }
    else { tgt = m.stops[ch].clone(); const a = 0.7 + ch * 0.55 + v.az; cp = tgt.clone().add(new T.Vector3(Math.sin(a) * 72, 54, Math.cos(a) * 72)); }
    v.camPos.lerp(cp, k); v.look.lerp(tgt, k); v.camera.position.copy(v.camPos); v.camera.lookAt(v.look);
    m.pins.forEach((p, i) => { const on = i === ch; const s = on ? 1.35 + 0.08 * Math.sin(now / 250) : 1; p.group.scale.setScalar(p.group.scale.x + (s - p.group.scale.x) * k); p.headM.color.set(on ? '#D62842' : '#341C5A'); });
    v.u = (v.u + dt * 0.018) % 1;
    const P = m.path.getPointAt(v.u), Q = m.path.getPointAt((v.u + 0.002) % 1);
    m.van.position.copy(P); m.van.lookAt(Q.x, P.y, Q.z);
    if (v.vis) v.renderer.render(v.scene, v.camera);
  }
  renderVals() {
    const R = this.route(), ch = this.state.chapter;
    const vans = R.vans.map((id) => ({ href: VAN_PAGES[id].href, name: VAN_PAGES[id].label, img: VAN_PAGES[id].img }));
    const others = ROUTE_ORDER.filter((id) => id !== (this.props.route || 'nc500')).slice(0, 4).map((id) => ({ href: ROUTE_HREF[id], name: ROUTES[id].title, region: ROUTES[id].region, img: ROUTES[id].img }));
    return {
      canvasRef: this.canvasRef,
      title: R.title, region: R.region, tagline: R.tagline, prologue: R.prologue, img: R.img, alt: R.alt,
      chapterCount: R.chapters.length,
      mapLabel: ch >= 0 && ch < R.chapters.length ? 'Chapter ' + (ch + 1) + ' · ' + R.chapters[ch].place : 'The whole journey',
      chapters: R.chapters.map((c, i) => ({ ...c, n: i + 1, anchor: 'ch-' + (i + 1), hash: '#ch-' + (i + 1), hid: 'ch-h-' + (i + 1), num: 'Chapter ' + ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'][i], ref: (el) => this.watch(el, i), dataCh: String(i), cls: 'mt-10 border-l-4 pl-5 transition-colors duration-500 lg:pl-8 ' + (i === ch ? 'border-brand' : 'border-plum/15') })),
      prologueRef: (el) => this.watch(el, -1),
      vans, others
    };
  }
}

return Component;
})();
