/**
 * RailTrack Enterprise - Asset Integrity & Track Defect Monitoring Portal
 * Professional Engineering Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. Data Store: Track Defects & Engineering Asset Directory
  // =========================================================================

  let activeFilter = 'all';
  let activeDefectId = null;
  let map = null;
  let markersMap = {};
  let routeLinesMap = [];

  const trackDefects = [
    {
      id: 'SEG-NR-142',
      title: 'Transverse Rail Fracture & Gap Separation',
      priority: 'P1 - EMERGENCY',
      priorityClass: 'p1',
      corridor: 'Northern Mainline (Track 2 Up)',
      chainage: 'KM 142+500 (MP 88.5)',
      station: 'Central Junction (3.2 km West)',
      lat: 28.6250,
      lng: 77.2150,
      detector: 'Ultrasonic Inspection Car UT-02',
      confidence: 98.6,
      timestamp: '2026-08-20 03:30:12 UTC',
      railSpec: 'UIC 60 / 60E1 (Head Hardened)',
      sensorReading: '78.5 dB Anomaly / 38.5°C',
      imageUrl: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=80',
      annotationBox: { x: 120, y: 110, w: 220, h: 120, label: 'RAIL FRACTURE [GAP: 8.4mm]' },
      protocol: 'Immediate track blockage active. Temporary Speed Restriction TSR 0 km/h applied.',
      dispatched: false
    },
    {
      id: 'SEG-EC-204',
      title: 'Thermal Track Buckling & Lateral Displacement',
      priority: 'P1 - EMERGENCY',
      priorityClass: 'p1',
      corridor: 'Eastern Freight Corridor (Track 1)',
      chainage: 'KM 204+800 (MP 127.2)',
      station: 'East Freight Depot (5.8 km East)',
      lat: 28.5820,
      lng: 77.2680,
      detector: 'Laser Track Geometry Scanner (TGM-04)',
      confidence: 96.2,
      timestamp: '2026-08-20 02:15:40 UTC',
      railSpec: '60 kg/m Continuous Welded Rail (CWR)',
      sensorReading: 'Lateral Shift: 42mm / Temp: 44.2°C',
      imageUrl: 'https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?auto=format&fit=crop&w=1200&q=80',
      annotationBox: { x: 200, y: 130, w: 260, h: 110, label: 'TRACK BUCKLING [SHIFT: 42mm]' },
      protocol: 'Emergency speed restriction (TSR 10 km/h). De-stressing maintenance team requested.',
      dispatched: false
    },
    {
      id: 'SEG-MC-056',
      title: 'Insulated Rail Joint Gap & Fishplate Wear',
      priority: 'P2 - WARNING',
      priorityClass: 'p2',
      corridor: 'Metro Central Corridor (Track A)',
      chainage: 'KM 56+300 (MP 35.0)',
      station: 'Metropolitan Terminal (1.1 km North)',
      lat: 28.6500,
      lng: 77.1800,
      detector: 'Acoustic Sensor Node S-88',
      confidence: 91.4,
      timestamp: '2026-08-20 01:45:00 UTC',
      railSpec: '54E1 Standard Profile',
      sensorReading: 'Joint Opening: 18mm / Bolt Torque Low',
      imageUrl: 'https://images.unsplash.com/photo-1515165562839-978bbcf1b267?auto=format&fit=crop&w=1200&q=80',
      annotationBox: { x: 180, y: 140, w: 180, h: 90, label: 'IRJ GAP WEAR [18mm]' },
      protocol: 'Schedule routine maintenance within 12 hours. Fastener retightening required.',
      dispatched: false
    },
    {
      id: 'SEG-NR-118',
      title: 'Rail Top Micro-Fissure & Rolling Contact Fatigue',
      priority: 'P2 - WARNING',
      priorityClass: 'p2',
      corridor: 'Northern Mainline (Track 1 Down)',
      chainage: 'KM 118+200 (MP 73.4)',
      station: 'North River Junction (4.0 km South)',
      lat: 28.6750,
      lng: 77.2400,
      detector: 'Visual Optical Vehicle VIU-01',
      confidence: 87.5,
      timestamp: '2026-08-20 00:20:18 UTC',
      railSpec: 'UIC 60 Standard',
      sensorReading: 'Head Check Depth: 1.8mm',
      imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&w=1200&q=80',
      annotationBox: { x: 140, y: 120, w: 200, h: 100, label: 'SURFACE HEAD CHECK [1.8mm]' },
      protocol: 'Include in upcoming rail grinding campaign. Monitor on next inspection run.',
      dispatched: false
    },
    {
      id: 'SEG-WB-012',
      title: 'Continuous Welded Rail Line (Healthy)',
      priority: 'CLEAR TRACK',
      priorityClass: 'clear',
      corridor: 'Western Bypass Line',
      chainage: 'KM 12+000 (MP 7.5)',
      station: 'West End Freight Yard (0.5 km West)',
      lat: 28.5500,
      lng: 77.1500,
      detector: 'Track Geometry Vehicle UT-02',
      confidence: 99.8,
      timestamp: '2026-08-20 03:40:00 UTC',
      railSpec: '60E1 Premium Hardened',
      sensorReading: 'Vibration 0.12g (Nominal)',
      imageUrl: 'https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?auto=format&fit=crop&w=1200&q=80',
      annotationBox: { x: 100, y: 100, w: 300, h: 150, label: 'NOMINAL TRACK [PASSED]' },
      protocol: 'Track geometry fully compliant with Class 1 speed standards (160 km/h).',
      dispatched: false
    }
  ];

  const railwayCorridors = [
    {
      name: 'Northern Mainline',
      color: '#ef4444',
      points: [
        [28.5500, 77.1500],
        [28.6139, 77.2090],
        [28.6250, 77.2150], // SEG-NR-142
        [28.6750, 77.2400], // SEG-NR-118
        [28.7200, 77.2800]
      ]
    },
    {
      name: 'Eastern Freight Corridor',
      color: '#f59e0b',
      points: [
        [28.5200, 77.2000],
        [28.5820, 77.2680], // SEG-EC-204
        [28.6300, 77.3200],
        [28.6800, 77.3800]
      ]
    },
    {
      name: 'Metro Central Loop',
      color: '#10b981',
      points: [
        [28.6000, 77.1600],
        [28.6500, 77.1800], // SEG-MC-056
        [28.6600, 77.2200],
        [28.6139, 77.2090]
      ]
    }
  ];

  // DOM Elements
  const metricP1El = document.getElementById('metric-p1-count');
  const metricP2El = document.getElementById('metric-p2-count');
  const metricHealthEl = document.getElementById('metric-health');
  
  const defectListContainer = document.getElementById('defect-list-container');
  const defectSearchInput = document.getElementById('defect-search');
  const filterPills = document.querySelectorAll('.pill');

  const btnSimulate = document.getElementById('btn-simulate-event');
  const btnReset = document.getElementById('btn-reset-data');
  const btnMapFocusP1 = document.getElementById('btn-map-focus-p1');

  // Drawer Elements
  const drawer = document.getElementById('inspection-drawer');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const drawerPriorityPill = document.getElementById('drawer-priority-pill');
  const drawerSegmentId = document.getElementById('drawer-segment-id');
  const drawerTimestamp = document.getElementById('drawer-timestamp');
  const drawerDefectName = document.getElementById('drawer-defect-name');
  const drawerChainage = document.getElementById('drawer-chainage');
  const drawerCoords = document.getElementById('drawer-coords');
  const drawerRailSpec = document.getElementById('drawer-rail-spec');
  const drawerCorridor = document.getElementById('drawer-corridor');
  const drawerDetector = document.getElementById('drawer-detector');
  const drawerSensorReading = document.getElementById('drawer-sensor-reading');
  const drawerProtocol = document.getElementById('drawer-protocol');
  const protocolBox = document.getElementById('protocol-box');
  
  const defectImgElement = document.getElementById('defect-img-element');
  const svgBox = document.getElementById('svg-box');
  const svgLabelBg = document.getElementById('svg-label-bg');
  const svgLabelText = document.getElementById('svg-label-text');
  const annotationSvg = document.getElementById('annotation-svg');
  const chkToggleAnnotations = document.getElementById('chk-toggle-annotations');

  const btnDispatchWorkOrder = document.getElementById('btn-dispatch-work-order');
  const btnExportPdf = document.getElementById('btn-export-pdf');
  const dispatchConfirmBanner = document.getElementById('dispatch-confirm-banner');

  const toastBanner = document.getElementById('toast-banner');
  const toastTitle = document.getElementById('toast-title');
  const toastDesc = document.getElementById('toast-desc');
  const toastActionBtn = document.getElementById('toast-action-btn');

  // =========================================================================
  // 2. Leaflet GIS Map Initialization
  // =========================================================================

  function initMap() {
    map = L.map('gis-map', {
      center: [28.6200, 77.2200],
      zoom: 12,
      zoomControl: true
    });

    // Dark Map Tile Layer (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors, &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    // Draw Railway Polylines
    railwayCorridors.forEach(route => {
      const line = L.polyline(route.points, {
        color: route.color,
        weight: 3,
        opacity: 0.85
      }).addTo(map);

      line.bindTooltip(`Corridor: ${route.name}`, { sticky: true });
      routeLinesMap.push(line);
    });

    renderMapMarkers();
  }

  function getMarkerIcon(priorityClass) {
    let color = '#ef4444';
    if (priorityClass === 'p2') color = '#f59e0b';
    if (priorityClass === 'clear') color = '#10b981';

    return L.divIcon({
      className: 'gis-marker-pin',
      html: `
        <div style="
          width: 16px;
          height: 16px;
          background-color: ${color};
          border: 2px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0,0,0,0.5);
        "></div>
      `,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });
  }

  function renderMapMarkers() {
    Object.values(markersMap).forEach(m => map.removeLayer(m));
    markersMap = {};

    trackDefects.forEach(defect => {
      const marker = L.marker([defect.lat, defect.lng], {
        icon: getMarkerIcon(defect.priorityClass)
      }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: Inter, sans-serif; padding: 2px; color: #1e293b;">
          <div style="font-size: 10px; font-weight: 700; color: ${defect.priorityClass === 'p1' ? '#dc2626' : '#d97706'}; font-family: monospace;">
            ${defect.priority}
          </div>
          <div style="font-size: 12px; font-weight: 600; margin: 2px 0;">${defect.title}</div>
          <div style="font-size: 11px; color: #64748b;">${defect.id} | ${defect.chainage}</div>
          <button onclick="window.selectDefectFromMap('${defect.id}')" style="margin-top: 6px; background: #2563eb; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; cursor: pointer; width: 100%;">
            View Inspection Drawer
          </button>
        </div>
      `);

      marker.on('click', () => {
        openInspectionDrawer(defect.id);
      });

      markersMap[defect.id] = marker;
    });
  }

  window.selectDefectFromMap = (id) => {
    openInspectionDrawer(id);
  };

  // =========================================================================
  // 3. UI State & Drawer Logic
  // =========================================================================

  function updateMetrics() {
    const p1Count = trackDefects.filter(d => d.priorityClass === 'p1').length;
    const p2Count = trackDefects.filter(d => d.priorityClass === 'p2').length;
    
    metricP1El.textContent = p1Count;
    metricP2El.textContent = p2Count;

    const health = Math.max(70, Math.round(100 - (p1Count * 12 + p2Count * 4)));
    metricHealthEl.textContent = `${health}%`;
  }

  function renderDefectList() {
    defectListContainer.innerHTML = '';
    const search = defectSearchInput.value.toLowerCase().trim();

    const filtered = trackDefects.filter(defect => {
      const matchPill = activeFilter === 'all' || defect.priorityClass === activeFilter;
      const matchSearch = defect.title.toLowerCase().includes(search) ||
                          defect.id.toLowerCase().includes(search) ||
                          defect.chainage.toLowerCase().includes(search) ||
                          defect.corridor.toLowerCase().includes(search);
      return matchPill && matchSearch;
    });

    if (filtered.length === 0) {
      defectListContainer.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); padding: 1.5rem 0; font-size: 0.78rem;">
          No track defects matching query.
        </div>
      `;
      return;
    }

    filtered.forEach(defect => {
      const card = document.createElement('div');
      card.className = `defect-card ${activeDefectId === defect.id ? 'active' : ''}`;
      
      card.innerHTML = `
        <div class="card-top">
          <span class="status-pill ${defect.priorityClass}">${defect.priority}</span>
          <span class="card-seg-id">${defect.id}</span>
        </div>
        <div class="card-title">${defect.title}</div>
        <div class="card-location">📍 ${defect.chainage} &bull; ${defect.corridor}</div>
      `;

      card.addEventListener('click', () => {
        openInspectionDrawer(defect.id, true);
      });

      defectListContainer.appendChild(card);
    });
  }

  function openInspectionDrawer(id, panMap = false) {
    activeDefectId = id;
    renderDefectList();

    const defect = trackDefects.find(d => d.id === id);
    if (!defect) return;

    // Update Drawer Fields
    drawerSegmentId.textContent = `Segment #${defect.id}`;
    drawerPriorityPill.className = `status-pill ${defect.priorityClass}`;
    drawerPriorityPill.textContent = defect.priority;

    drawerTimestamp.textContent = defect.timestamp;
    drawerDefectName.textContent = defect.title;
    drawerChainage.textContent = defect.chainage;
    drawerCoords.textContent = `${defect.lat.toFixed(4)}° N, ${defect.lng.toFixed(4)}° E`;
    drawerRailSpec.textContent = defect.railSpec;
    drawerCorridor.textContent = defect.corridor;
    drawerDetector.textContent = defect.detector;
    drawerSensorReading.textContent = defect.sensorReading;
    drawerProtocol.textContent = defect.protocol;

    // Load High-Res Photo
    defectImgElement.src = defect.imageUrl;

    // Set Annotation SVG Box
    if (defect.annotationBox) {
      svgBox.setAttribute('x', defect.annotationBox.x);
      svgBox.setAttribute('y', defect.annotationBox.y);
      svgBox.setAttribute('width', defect.annotationBox.w);
      svgBox.setAttribute('height', defect.annotationBox.h);

      svgLabelBg.setAttribute('x', defect.annotationBox.x);
      svgLabelBg.setAttribute('y', defect.annotationBox.y - 20);
      svgLabelBg.setAttribute('width', defect.annotationBox.w);

      svgLabelText.setAttribute('x', defect.annotationBox.x + 8);
      svgLabelText.setAttribute('y', defect.annotationBox.y - 6);
      svgLabelText.textContent = defect.annotationBox.label;
    }

    if (defect.dispatched) {
      dispatchConfirmBanner.classList.remove('hidden');
    } else {
      dispatchConfirmBanner.classList.add('hidden');
    }

    // Pan Map
    if (panMap && map && markersMap[id]) {
      map.flyTo([defect.lat, defect.lng], 14, { duration: 0.8 });
      markersMap[id].openPopup();
    }

    // Slide open drawer
    drawer.classList.remove('hidden');
  }

  // =========================================================================
  // 4. Telemetry Anomaly Simulation
  // =========================================================================

  function simulateTelemetryAnomaly() {
    const newId = `SEG-NR-${Math.floor(200 + Math.random() * 700)}`;
    const randomLat = 28.6000 + (Math.random() * 0.07);
    const randomLng = 77.2000 + (Math.random() * 0.07);
    const kmVal = (Math.random() * 250).toFixed(1);

    const newDefect = {
      id: newId,
      title: 'Transverse Rail Structural Crack & Separation',
      priority: 'P1 - EMERGENCY',
      priorityClass: 'p1',
      corridor: 'Northern Mainline (Track 2 Up)',
      chainage: `KM ${kmVal}+400 (MP ${Math.round(kmVal * 0.62)})`,
      station: 'Central Rail Hub (2.4 km East)',
      lat: randomLat,
      lng: randomLng,
      detector: 'Ultrasonic Car UT-02 (Telemetry Feed)',
      confidence: 99.1,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      railSpec: 'UIC 60 / Head Hardened',
      sensorReading: 'Acoustic Emission Peak: 82 dB',
      imageUrl: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=80',
      annotationBox: { x: 140, y: 120, w: 200, h: 100, label: 'CRITICAL FRACTURE [99.1%]' },
      protocol: 'Immediate emergency track closure initiated. Speed restriction 0 km/h.',
      dispatched: false
    };

    trackDefects.unshift(newDefect);
    renderMapMarkers();
    updateMetrics();
    renderDefectList();

    // Show Toast
    toastTitle.textContent = `New P1 Anomaly Detected (${newId})`;
    toastDesc.textContent = `${newDefect.chainage} • ${newDefect.corridor}`;
    toastBanner.classList.remove('hidden');

    toastActionBtn.onclick = () => {
      toastBanner.classList.add('hidden');
      openInspectionDrawer(newId, true);
    };

    // Auto open drawer
    openInspectionDrawer(newId, true);
  }

  // =========================================================================
  // 5. Event Listeners
  // =========================================================================

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeFilter = pill.dataset.filter;
      renderDefectList();
    });
  });

  defectSearchInput.addEventListener('input', () => {
    renderDefectList();
  });

  btnSimulate.addEventListener('click', simulateTelemetryAnomaly);

  btnReset.addEventListener('click', () => {
    location.reload();
  });

  btnMapFocusP1.addEventListener('click', () => {
    const p1 = trackDefects.find(d => d.priorityClass === 'p1');
    if (p1 && map) {
      map.flyTo([p1.lat, p1.lng], 13);
    }
  });

  drawerCloseBtn.addEventListener('click', () => {
    drawer.classList.add('hidden');
  });

  chkToggleAnnotations.addEventListener('change', (e) => {
    annotationSvg.style.display = e.target.checked ? 'block' : 'none';
  });

  btnDispatchWorkOrder.addEventListener('click', () => {
    const current = trackDefects.find(d => d.id === activeDefectId);
    if (current) {
      current.dispatched = true;
      dispatchConfirmBanner.classList.remove('hidden');
      renderDefectList();
    }
  });

  btnExportPdf.addEventListener('click', () => {
    const current = trackDefects.find(d => d.id === activeDefectId);
    if (!current) return;

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(current, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `RailTrack_Asset_Incident_${current.id}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  });

  // Start Application
  initMap();
  updateMetrics();
  renderDefectList();
});
