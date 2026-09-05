/**
 * Presence & Realtime Online Users Module
 * Inspired by 3d-portfolio-main
 *
 * Features:
 * - IP Geolocation (City, State, Country, Flag Emoji) with smart time zone fallback
 * - DiceBear Lorelei SVG Avatars with custom accent colors
 * - Cross-tab Real-time synchronization via BroadcastChannel
 * - Local storage persistence for user profile (editable name, avatar seed, color)
 * - Plug-and-play WebSocket / Socket.IO support (if window.PORTFOLIO_WS_URL is set)
 * - Smart dynamic simulated global tech visitors when running statically on GitHub Pages
 * - Keyboard shortcut (Ctrl + /) to toggle presence panel
 */

(function () {
  'use strict';

  // Available Avatar Colors
  const AVATAR_COLORS = [
    '#00e5ff', // Cyan / Accent
    '#60a5fa', // Sky Blue
    '#34d399', // Emerald
    '#f87171', // Coral Red
    '#facc15', // Amber
    '#c084fc', // Purple
    '#fb923c', // Orange
    '#f43f5e', // Rose
  ];

  // Helper: DiceBear Avatar URL
  function getAvatarUrl(seed) {
    return `https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(seed)}`;
  }

  // Helper: Fallback Location via TimeZone
  function getFallbackLocation() {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      if (tz.includes('Sao_Paulo')) return { location: 'São Paulo, SP // Brasil', flag: '🇧🇷', countryCode: 'br' };
      if (tz.includes('Fortaleza')) return { location: 'Fortaleza, CE // Brasil', flag: '🇧🇷', countryCode: 'br' };
      if (tz.includes('Recife')) return { location: 'Recife, PE // Brasil', flag: '🇧🇷', countryCode: 'br' };
      if (tz.includes('Manaus')) return { location: 'Manaus, AM // Brasil', flag: '🇧🇷', countryCode: 'br' };
      if (tz.includes('Cuiaba')) return { location: 'Cuiabá, MT // Brasil', flag: '🇧🇷', countryCode: 'br' };
      if (tz.includes('Belem')) return { location: 'Belém, PA // Brasil', flag: '🇧🇷', countryCode: 'br' };
      if (tz.includes('Brazil')) return { location: 'Brasil', flag: '🇧🇷', countryCode: 'br' };
      if (tz.includes('Lisbon')) return { location: 'Lisboa // Portugal', flag: '🇵🇹', countryCode: 'pt' };
      if (tz.includes('New_York')) return { location: 'New York // USA', flag: '🇺🇸', countryCode: 'us' };
      if (tz.includes('Los_Angeles')) return { location: 'Los Angeles // USA', flag: '🇺🇸', countryCode: 'us' };
      if (tz.includes('London')) return { location: 'London // UK', flag: '🇬🇧', countryCode: 'gb' };
      if (tz.includes('Berlin')) return { location: 'Berlin // Germany', flag: '🇩🇪', countryCode: 'de' };
      if (tz.includes('Tokyo')) return { location: 'Tokyo // Japan', flag: '🇯🇵', countryCode: 'jp' };
      return { location: tz.replace(/_/g, ' '), flag: '🌍', countryCode: '' };
    } catch (e) {
      return { location: 'Terra // Planeta Terra', flag: '🌍', countryCode: '' };
    }
  }

  // Render crisp flag image (compatible with Windows) with fallback to emoji
  function renderFlagHtml(countryCode, emoji) {
    if (countryCode && countryCode.length === 2) {
      const cc = countryCode.toLowerCase();
      return `<img src="https://flagcdn.com/20x15/${cc}.png" srcset="https://flagcdn.com/40x30/${cc}.png 2x" alt="${emoji || cc}" class="presence-flag-img" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='inline';" /><span class="presence-flag" style="display:none;">${emoji || '🌐'}</span>`;
    }
    return `<span class="presence-flag">${emoji || '🌐'}</span>`;
  }

  class PresenceManager {
    constructor() {
      this.channelName = 'curriculo_presence_channel';
      this.channel = null;
      this.socket = null;
      this.users = new Map(); // id -> User
      this.remoteCursors = new Map(); // id -> { element, timeout }
      this.currentUser = null;
      this.isOpen = false;
      this.isEditModalOpen = false;
      this.heartbeatTimer = null;

      this.tempEditState = {
        name: '',
        avatar: '',
        color: '',
      };

      this.init();
    }

    async init() {
      this.loadOrCreateProfile();
      this.setupBroadcastChannel();
      this.setupWebSocketIfConfigured();
      this.setupDOM();
      this.setupEventListeners();

      // Fetch accurate IP geolocation in background
      this.fetchLocation();

      // Start heartbeat
      this.startHeartbeat();

      // Render initial state
      this.render();
    }

    loadOrCreateProfile() {
      const storedId = sessionStorage.getItem('curriculo_presence_session_id');
      const sessionId = storedId || 'usr_' + Math.random().toString(36).substring(2, 9);
      if (!storedId) {
        sessionStorage.setItem('curriculo_presence_session_id', sessionId);
      }

      let savedProfile = null;
      try {
        savedProfile = JSON.parse(localStorage.getItem('curriculo_presence_profile') || 'null');
      } catch (e) {
        savedProfile = null;
      }

      const defaultNum = Math.floor(Math.random() * 900 + 100);
      const randomSeed = (Math.floor(Math.random() * 80) + 1).toString();
      const randomColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
      const fallback = getFallbackLocation();

      this.currentUser = {
        id: sessionId,
        name: (savedProfile && savedProfile.name) || `Dev #${defaultNum}`,
        avatar: (savedProfile && savedProfile.avatar) || randomSeed,
        color: (savedProfile && savedProfile.color) || randomColor,
        location: (savedProfile && savedProfile.location) || fallback.location,
        flag: (savedProfile && savedProfile.flag) || fallback.flag,
        countryCode: (savedProfile && savedProfile.countryCode) || fallback.countryCode || '',
        lastSeen: Date.now(),
        isMe: true,
      };

      this.users.set(this.currentUser.id, this.currentUser);
    }

    saveProfile(name, avatar, color) {
      if (!this.currentUser) return;
      this.currentUser.name = name.trim() || this.currentUser.name;
      this.currentUser.avatar = avatar || this.currentUser.avatar;
      this.currentUser.color = color || this.currentUser.color;

      try {
        localStorage.setItem(
          'curriculo_presence_profile',
          JSON.stringify({
            name: this.currentUser.name,
            avatar: this.currentUser.avatar,
            color: this.currentUser.color,
            location: this.currentUser.location,
            flag: this.currentUser.flag,
            countryCode: this.currentUser.countryCode,
          })
        );
      } catch (e) {}

      // Broadcast update to other tabs
      this.broadcast('update', this.currentUser);

      // If socket is connected, emit update-user
      this._emitUpdateUser();

      this.render();
    }

    async fetchLocation() {
      try {
        // Try free, CORS-enabled IP Geolocation API
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const res = await fetch('https://ipwho.is/', {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data && data.success !== false) {
            let city = data.city || '';
            let region = data.region_code || data.region || '';
            let country = data.country || '';
            let flag = (data.flag && data.flag.emoji) || '🌐';
            let countryCode = (data.country_code || '').toLowerCase();

            let locStr = '';
            if (city && region) locStr = `${city}, ${region} // ${country}`;
            else if (city) locStr = `${city} // ${country}`;
            else locStr = country || 'Brasil';

            this.currentUser.location = locStr;
            this.currentUser.flag = flag;
            this.currentUser.countryCode = countryCode;

            // Save to localStorage
            try {
              const saved = JSON.parse(localStorage.getItem('curriculo_presence_profile') || '{}');
              saved.location = locStr;
              saved.flag = flag;
              saved.countryCode = countryCode;
              localStorage.setItem('curriculo_presence_profile', JSON.stringify(saved));
            } catch (e) {}

            this.broadcast('update', this.currentUser);
            // Sync updated location to the server
            this._emitUpdateUser();
            this.render();
          }
        }
      } catch (e) {
        // Fallback already assigned via getFallbackLocation()
      }
    }

    setupBroadcastChannel() {
      if (typeof BroadcastChannel !== 'undefined') {
        try {
          this.channel = new BroadcastChannel(this.channelName);
          this.channel.onmessage = (event) => {
            const data = event.data;
            if (!data || !data.type) return;

            if (data.type === 'heartbeat' || data.type === 'join' || data.type === 'update') {
              if (data.user && data.user.id !== this.currentUser.id) {
                this.users.set(data.user.id, {
                  ...data.user,
                  lastSeen: Date.now(),
                  isMe: false,
                });
                this.render();
              }
            } else if (data.type === 'leave') {
              if (data.user && this.users.has(data.user.id)) {
                this.users.delete(data.user.id);
                this.removeRemoteCursor(data.user.id);
                this.render();
              }
            } else if (data.type === 'cursor-move') {
              if (data.userId && data.userId !== this.currentUser.id) {
                this.updateRemoteCursor(data.userId, data.user, data.x, data.y);
              }
            } else if (data.type === 'cursor-leave') {
              if (data.userId && data.userId !== this.currentUser.id) {
                this.hideRemoteCursor(data.userId);
              }
            } else if (data.type === 'cursor-click') {
              if (data.userId && data.userId !== this.currentUser.id) {
                this.triggerRemoteClickRing(data.userId, data.color, data.x, data.y);
              }
            }
          };

          // Announce join
          this.broadcast('join', this.currentUser);
        } catch (e) {
          console.warn('BroadcastChannel not supported or blocked:', e);
        }
      }

      // Cleanup on tab close / reload
      window.addEventListener('beforeunload', () => {
        this.broadcast('leave', this.currentUser);
      });
    }

    broadcast(type, payload) {
      if (this.channel) {
        try {
          if (payload && (payload.x !== undefined || payload.userId)) {
            this.channel.postMessage({ type, ...payload });
          } else {
            this.channel.postMessage({ type, user: payload });
          }
        } catch (e) {}
      }
    }

    startHeartbeat() {
      this.heartbeatTimer = setInterval(() => {
        // Send heartbeat across local tabs
        this.broadcast('heartbeat', this.currentUser);

        // Only prune local BroadcastChannel tabs (same-browser tabs without WebSocket).
        // Never prune WebSocket users via client-side timeout: the server's 'users-updated' event
        // authoritatively manages the presence lifecycle for connected visitors!
        const now = Date.now();
        let changed = false;
        for (const [id, user] of this.users.entries()) {
          if (!user.isMe && !user.isWebSocket && now - (user.lastSeen || 0) > 10000) {
            this.users.delete(id);
            this.removeRemoteCursor(id);
            changed = true;
          }
        }
        if (changed) this.render();
      }, 4000);
    }

    setupWebSocketIfConfigured() {
      const wsUrl = window.PORTFOLIO_WS_URL || window.PRESENCE_WS_URL;
      if (!wsUrl || typeof window.io === 'undefined') return;

      try {
        this.socket = window.io(wsUrl, {
          auth: { sessionId: this.currentUser.id },
          reconnection: true,
          reconnectionAttempts: Infinity,
          reconnectionDelayMax: 5000,
          transports: ['websocket', 'polling'],
        });

        this.socket.on('connect', () => {
          console.log('[presence] Socket connected:', this.socket.id);
          this.updateConnectionStatus('connected');
          if (this.currentUser) {
            this.currentUser.socketId = this.socket.id;
          }
          // Request current user list immediately & sync our profile
          this.socket.emit('get-users');
          this._emitUpdateUser();
        });

        this.socket.on('disconnect', () => {
          this.updateConnectionStatus('disconnected');
        });

        // Server tells us our persistent session id
        this.socket.on('session', ({ sessionId }) => {
          if (sessionId) {
            sessionStorage.setItem('curriculo_presence_session_id', sessionId);
          }
        });

        // Full user list from server — includes all connected visitors
        this.socket.on('users-updated', (remoteUsers) => {
          if (!Array.isArray(remoteUsers)) return;

          // Build sets of active socket IDs and session IDs from the server
          const activeSocketIds = new Set();
          const activeSessionIds = new Set();

          remoteUsers.forEach((u) => {
            if (u.socketId) activeSocketIds.add(u.socketId);
            if (u.id) activeSessionIds.add(u.id);

            // Skip ourselves
            const isMyself =
              (u.id && u.id === this.currentUser.id) ||
              (u.socketId && this.socket && u.socketId === this.socket.id);
            if (isMyself) {
              if (u.socketId && this.currentUser) {
                this.currentUser.socketId = u.socketId;
              }
              return;
            }

            const key = u.socketId || u.id;
            const existing = this.users.get(key) || this.users.get(u.socketId) || this.users.get(u.id);

            this.users.set(key, {
              id: key,
              socketId: u.socketId,
              sessionId: u.id,
              name: u.name || (existing && existing.name) || 'Visitor',
              avatar: u.avatar || (existing && existing.avatar) || '1',
              color: u.color || (existing && existing.color) || '#60a5fa',
              location: u.location || (existing && existing.location) || 'Online',
              flag: u.flag || (existing && existing.flag) || '🌐',
              countryCode: u.countryCode || (existing && existing.countryCode) || '',
              lastSeen: Date.now(),
              isMe: false,
              isWebSocket: true,
            });
          });

          // Remove WebSocket users no longer on the server
          for (const [id, user] of this.users.entries()) {
            if (!user.isMe && user.isWebSocket) {
              const stillActive =
                activeSocketIds.has(id) ||
                (user.socketId && activeSocketIds.has(user.socketId)) ||
                (user.sessionId && activeSessionIds.has(user.sessionId));
              if (!stillActive) {
                this.users.delete(id);
                this.removeRemoteCursor(id);
              }
            }
          }

          this.render();
        });

        // Live cursor from another user
        this.socket.on('cursor-changed', (data) => {
          if (!data || !data.pos || !data.socketId) return;
          if (data.socketId === this.socket.id) return; // skip our own echo

          // Find the user by their socket id or session id
          let remoteUser = this.users.get(data.socketId);
          if (!remoteUser) {
            for (const u of this.users.values()) {
              if (u.socketId === data.socketId) {
                remoteUser = u;
                break;
              }
            }
          }

          let isNewUser = false;
          if (!remoteUser) {
            remoteUser = {
              id: data.socketId,
              socketId: data.socketId,
              name: 'Visitor',
              avatar: '1',
              color: '#00e5ff',
              location: 'Online',
              flag: '🌐',
              countryCode: '',
              lastSeen: Date.now(),
              isMe: false,
              isWebSocket: true,
            };
            this.users.set(data.socketId, remoteUser);
            isNewUser = true;
          } else {
            remoteUser.lastSeen = Date.now();
          }

          this.updateRemoteCursor(data.socketId, remoteUser, data.pos.x, data.pos.y);
          if (isNewUser) {
            this.render();
          }
        });

        // Reconnect on wake/focus
        const ensureConnected = () => {
          if (this.socket && !this.socket.connected) this.socket.connect();
        };
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') ensureConnected();
        });
        window.addEventListener('online', ensureConnected);

      } catch (e) {
        console.warn('[presence] Failed to connect to WebSocket server:', e);
      }
    }

    // Helper: emit our current profile to the server
    _emitUpdateUser() {
      if (!this.socket || !this.socket.connected) return;
      this.socket.emit('update-user', {
        username: this.currentUser.name,
        avatar: this.currentUser.avatar,
        color: this.currentUser.color,
        location: this.currentUser.location,
        flag: this.currentUser.flag,
        countryCode: this.currentUser.countryCode || '',
      });
    }

    setupDOM() {
      // 0. Remote Cursors Layer (Appended to document.body so cursors track full document scroll)
      let cursorLayer = document.getElementById('remote-cursors-layer');
      if (!cursorLayer) {
        cursorLayer = document.createElement('div');
        cursorLayer.id = 'remote-cursors-layer';
        cursorLayer.className = 'remote-cursors-layer';
        document.body.appendChild(cursorLayer);
      } else if (cursorLayer.parentElement !== document.body) {
        document.body.appendChild(cursorLayer);
      }

      // 1. Navbar presence trigger button
      const navLinks = document.querySelector('.nav .nav-links');
      if (navLinks && !document.getElementById('nav-presence-btn')) {
        const btn = document.createElement('button');
        btn.id = 'nav-presence-btn';
        btn.className = 'nav-presence-btn code-font';
        btn.type = 'button';
        btn.setAttribute('aria-label', 'Visualizar visitantes online');
        btn.innerHTML = `
          <div class="presence-radar-wrap">
            <div class="presence-radar"></div>
            <div class="presence-dot"></div>
          </div>
          <span class="presence-count-pill" id="presence-count-pill">1</span>
          <span class="presence-label-text" data-i18n="presence_online">ONLINE</span>
        `;
        // Insert before language toggle if it exists
        const langToggle = document.getElementById('lang-toggle');
        if (langToggle) {
          navLinks.insertBefore(btn, langToggle);
        } else {
          navLinks.appendChild(btn);
        }
      }

      // 2. Presence Drawer / Modal Overlay
      if (document.getElementById('presence-modal-overlay')) return;
      const modalOverlay = document.createElement('div');
      modalOverlay.id = 'presence-modal-overlay';
      modalOverlay.className = 'presence-modal-overlay';
      modalOverlay.innerHTML = `
        <div class="presence-panel" id="presence-panel" role="dialog" aria-modal="true">
          <!-- Header -->
          <div class="presence-header">
            <div class="presence-header-title-wrap">
              <span class="presence-header-tag code-font">// SYS_PRESENCE_MONITOR //</span>
              <div class="presence-header-title code-font">
                <span data-i18n="presence_title">VISITANTES CONECTADOS</span>
              </div>
            </div>
            <button class="presence-close-btn" id="presence-close-btn" aria-label="Fechar modal">[X]</button>
          </div>

          <!-- Status strip -->
          <div class="presence-status-strip code-font">
            <div class="presence-status-indicator">
              <div class="presence-status-dot"></div>
              <span id="presence-status-text" data-i18n="presence_status_connected">SISTEMA CONECTADO</span>
            </div>
            <span id="presence-total-label">ONLINE: <strong id="presence-total-count">1</strong></span>
          </div>

          <!-- Body -->
          <div class="presence-body">
            <!-- Current User (YOU) Section -->
            <div class="presence-section">
              <div class="presence-section-label code-font" data-i18n="presence_sec_you">SEU TERMINAL</div>
              <div class="presence-current-user-card" id="presence-current-user-card">
                <div class="presence-user-left">
                  <div class="presence-avatar-wrap" id="presence-my-avatar-wrap" style="background-color: ${this.currentUser.color}">
                    <img src="${getAvatarUrl(this.currentUser.avatar)}" alt="${this.currentUser.name}" class="presence-avatar-img" id="presence-my-avatar-img" />
                    <div class="presence-avatar-badge"></div>
                  </div>
                  <div class="presence-user-details">
                    <div class="presence-user-name-row">
                      <span class="presence-user-name" id="presence-my-name">${this.currentUser.name}</span>
                      <span class="presence-badge-you" data-i18n="presence_badge_you">VOCÊ</span>
                    </div>
                    <div class="presence-user-location" id="presence-my-location">
                      <span class="presence-flag" id="presence-my-flag">${this.currentUser.flag}</span>
                      <span id="presence-my-location-text">${this.currentUser.location}</span>
                    </div>
                  </div>
                </div>
                <button class="presence-edit-profile-btn" id="presence-open-edit-btn" data-i18n="presence_edit_btn">
                  [EDITAR]
                </button>
              </div>
            </div>

            <!-- Other Visitors Section -->
            <div class="presence-section">
              <div class="presence-section-label code-font" data-i18n="presence_sec_others">OUTROS VISITANTES NAVEGANDO</div>
              <div class="presence-users-list" id="presence-users-list">
                <!-- Injected via JS -->
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modalOverlay);

      // 3. Edit Profile Sub-modal
      const editModal = document.createElement('div');
      editModal.id = 'presence-edit-modal';
      editModal.className = 'presence-edit-modal';
      editModal.innerHTML = `
        <div class="presence-edit-card code-font" role="dialog" aria-modal="true">
          <div class="presence-edit-header">
            <div class="presence-edit-title" data-i18n="presence_edit_title">// EDITAR IDENTIDADE //</div>
            <button class="presence-close-btn" id="presence-close-edit-btn">[X]</button>
          </div>

          <!-- Avatar Preview and Generator -->
          <div class="presence-edit-avatar-section">
            <div class="presence-edit-avatar-preview" id="presence-edit-avatar-preview" style="background-color: ${this.currentUser.color}">
              <img id="presence-edit-preview-img" src="${getAvatarUrl(this.currentUser.avatar)}" alt="Preview" />
            </div>
            <div class="presence-edit-avatar-actions">
              <button class="presence-random-avatar-btn" id="presence-randomize-avatar-btn" data-i18n="presence_random_avatar">
                🎲 NOVO AVATAR
              </button>
            </div>
          </div>

          <!-- Color selection -->
          <div>
            <div class="presence-color-picker-label" data-i18n="presence_color_label">COR DO SINAL:</div>
            <div class="presence-color-grid" id="presence-color-grid">
              ${AVATAR_COLORS.map(
                (c) => `<div class="presence-color-dot ${c === this.currentUser.color ? 'selected' : ''}" data-color="${c}" style="background-color: ${c}"></div>`
              ).join('')}
            </div>
          </div>

          <!-- Name Input -->
          <div class="presence-form-group">
            <label class="presence-form-label" for="presence-name-input" data-i18n="presence_name_label">CODINOME / APELIDO:</label>
            <input type="text" id="presence-name-input" class="presence-input" maxlength="24" value="${this.currentUser.name}" />
          </div>

          <!-- Actions -->
          <div class="presence-edit-btn-row">
            <button class="presence-btn-secondary" id="presence-cancel-edit-btn" data-i18n="presence_btn_cancel">CANCELAR</button>
            <button class="presence-btn-primary" id="presence-save-edit-btn" data-i18n="presence_btn_save">SALVAR</button>
          </div>
        </div>
      `;
      document.body.appendChild(editModal);
    }

    setupEventListeners() {
      // Toggle drawer
      const navBtn = document.getElementById('nav-presence-btn');
      if (navBtn) {
        navBtn.addEventListener('click', () => this.toggleModal(true));
      }

      const closeBtn = document.getElementById('presence-close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.toggleModal(false));
      }

      // Close when clicking backdrop
      const modalOverlay = document.getElementById('presence-modal-overlay');
      if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
          if (e.target === modalOverlay) {
            this.toggleModal(false);
          }
        });
      }

      // Edit profile modal open
      const openEditBtn = document.getElementById('presence-open-edit-btn');
      if (openEditBtn) {
        openEditBtn.addEventListener('click', () => this.openEditModal());
      }

      const closeEditBtn = document.getElementById('presence-close-edit-btn');
      if (closeEditBtn) {
        closeEditBtn.addEventListener('click', () => this.closeEditModal());
      }

      const cancelEditBtn = document.getElementById('presence-cancel-edit-btn');
      if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', () => this.closeEditModal());
      }

      // Randomize avatar
      const randomBtn = document.getElementById('presence-randomize-avatar-btn');
      if (randomBtn) {
        randomBtn.addEventListener('click', () => {
          this.tempEditState.avatar = Math.floor(Math.random() * 200 + 1).toString();
          const previewImg = document.getElementById('presence-edit-preview-img');
          if (previewImg) {
            previewImg.src = getAvatarUrl(this.tempEditState.avatar);
          }
        });
      }

      // Color picker dots
      const colorGrid = document.getElementById('presence-color-grid');
      if (colorGrid) {
        colorGrid.addEventListener('click', (e) => {
          const dot = e.target.closest('.presence-color-dot');
          if (dot) {
            const color = dot.dataset.color;
            this.tempEditState.color = color;
            colorGrid.querySelectorAll('.presence-color-dot').forEach((d) => d.classList.remove('selected'));
            dot.classList.add('selected');

            const previewBox = document.getElementById('presence-edit-avatar-preview');
            if (previewBox) {
              previewBox.style.backgroundColor = color;
            }
          }
        });
      }

      // Save profile
      const saveBtn = document.getElementById('presence-save-edit-btn');
      if (saveBtn) {
        saveBtn.addEventListener('click', () => {
          const input = document.getElementById('presence-name-input');
          const newName = input ? input.value : this.currentUser.name;
          this.saveProfile(newName, this.tempEditState.avatar, this.tempEditState.color);
          this.closeEditModal();
        });
      }

      // Keyboard shortcuts: Ctrl + / to toggle presence panel, Escape to close
      document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === '/') {
          e.preventDefault();
          this.toggleModal(!this.isOpen);
        } else if (e.key === 'Escape') {
          if (this.isEditModalOpen) {
            this.closeEditModal();
          } else if (this.isOpen) {
            this.toggleModal(false);
          }
        }
      });

      // Live Cursors: track mouse movement and broadcast to other visitors
      let lastBroadcastTime = 0;
      let lastClientX = 0;
      let lastClientY = 0;
      let hasMousePos = false;

      const broadcastPos = () => {
        if (!hasMousePos) return;
        const scrollX = window.scrollX || window.pageXOffset || 0;
        const scrollY = window.scrollY || window.pageYOffset || 0;
        const x = Math.round(lastClientX + scrollX);
        const y = Math.round(lastClientY + scrollY);

        this.broadcast('cursor-move', {
          userId: this.currentUser.id,
          user: this.currentUser,
          x,
          y,
        });
        if (this.socket && this.socket.connected) {
          this.socket.emit('cursor-change', {
            pos: { x, y },
          });
        }
      };

      window.addEventListener(
        'mousemove',
        (e) => {
          lastClientX = e.clientX;
          lastClientY = e.clientY;
          hasMousePos = true;
          const now = Date.now();
          if (now - lastBroadcastTime > 40) {
            // ~25 fps throttle for silky smoothness
            lastBroadcastTime = now;
            broadcastPos();
          }
        },
        { passive: true }
      );

      // Keep cursor position synchronized during scroll (trackpad / wheel)
      window.addEventListener(
        'scroll',
        () => {
          if (!hasMousePos) return;
          const now = Date.now();
          if (now - lastBroadcastTime > 50) {
            lastBroadcastTime = now;
            broadcastPos();
          }
        },
        { passive: true }
      );

      document.addEventListener('mouseleave', () => {
        hasMousePos = false;
        this.broadcast('cursor-leave', { userId: this.currentUser.id });
      });

      window.addEventListener(
        'mousedown',
        (e) => {
          const scrollX = window.scrollX || window.pageXOffset || 0;
          const scrollY = window.scrollY || window.pageYOffset || 0;
          const x = Math.round(e.pageX !== undefined ? e.pageX : (e.clientX + scrollX));
          const y = Math.round(e.pageY !== undefined ? e.pageY : (e.clientY + scrollY));
          this.broadcast('cursor-click', {
            userId: this.currentUser.id,
            color: this.currentUser.color,
            x,
            y,
          });
        },
        { passive: true }
      );
    }

    updateRemoteCursor(userId, user, x, y) {
      if (!userId || userId === this.currentUser.id) return;
      let cursorLayer = document.getElementById('remote-cursors-layer');
      if (!cursorLayer) {
        cursorLayer = document.createElement('div');
        cursorLayer.id = 'remote-cursors-layer';
        cursorLayer.className = 'remote-cursors-layer';
        document.body.appendChild(cursorLayer);
      } else if (cursorLayer.parentElement !== document.body) {
        document.body.appendChild(cursorLayer);
      }

      let cursorObj = this.remoteCursors.get(userId);
      if (!cursorObj || !document.getElementById(`cursor-${userId}`)) {
        const cursorEl = document.createElement('div');
        cursorEl.id = `cursor-${userId}`;
        cursorEl.className = 'remote-cursor';
        cursorEl.style.color = user.color || '#00e5ff';
        const flagHtml = renderFlagHtml(user.countryCode, user.flag);
        const locName = user.location ? user.location.split('//')[0].trim() : '';

        cursorEl.innerHTML = `
          <div class="remote-cursor-pointer-wrap">
            <svg class="remote-cursor-svg" viewBox="0 0 24 24" width="22" height="22" fill="none">
              <path d="M4.5 3.5L10.5 20.5L13.5 13.5L20.5 10.5L4.5 3.5Z" fill="${user.color || '#00e5ff'}" stroke="#030712" stroke-width="1.8" stroke-linejoin="round"/>
            </svg>
            <div class="remote-cursor-tip-glow"></div>
          </div>
          <div class="remote-cursor-tag" style="border-color: ${user.color || '#00e5ff'}; box-shadow: 0 4px 20px ${user.color || '#00e5ff'}40;">
            <div class="remote-cursor-avatar" style="background-color: ${user.color || '#00e5ff'}">
              <img src="${getAvatarUrl(user.avatar)}" alt="${user.name}" />
            </div>
            <div class="remote-cursor-details">
              <span class="remote-cursor-name" style="color: ${user.color || '#00e5ff'}">${user.name}</span>
              <span class="remote-cursor-loc">
                ${flagHtml}
                <span>${locName}</span>
              </span>
            </div>
          </div>
        `;
        cursorLayer.appendChild(cursorEl);
        cursorObj = { element: cursorEl, timeout: null };
        this.remoteCursors.set(userId, cursorObj);
      }

      const el = cursorObj.element;
      const maxW = Math.max(document.documentElement.scrollWidth, window.innerWidth);
      const safeX = Math.max(0, Math.min(Number(x) || 0, maxW - 40));
      const safeY = Math.max(0, Number(y) || 0);
      el.style.transform = `translate3d(${safeX}px, ${safeY}px, 0)`;
      el.classList.add('active');

      if (cursorObj.timeout) clearTimeout(cursorObj.timeout);
      cursorObj.timeout = setTimeout(() => {
        el.classList.remove('active');
      }, 3500);
    }

    hideRemoteCursor(userId) {
      const cursorObj = this.remoteCursors.get(userId);
      if (cursorObj && cursorObj.element) {
        cursorObj.element.classList.remove('active');
      }
    }

    removeRemoteCursor(userId) {
      const cursorObj = this.remoteCursors.get(userId);
      if (cursorObj) {
        if (cursorObj.timeout) clearTimeout(cursorObj.timeout);
        if (cursorObj.element && cursorObj.element.parentNode) {
          cursorObj.element.parentNode.removeChild(cursorObj.element);
        }
        this.remoteCursors.delete(userId);
      }
    }

    triggerRemoteClickRing(userId, color, x, y) {
      let cursorLayer = document.getElementById('remote-cursors-layer');
      if (!cursorLayer) return;

      const ring = document.createElement('div');
      ring.className = 'remote-cursor-click-ring';
      ring.style.left = `${Math.max(0, Number(x) || 0)}px`;
      ring.style.top = `${Math.max(0, Number(y) || 0)}px`;
      ring.style.color = color || '#00e5ff';
      cursorLayer.appendChild(ring);

      setTimeout(() => {
        if (ring.parentNode) ring.parentNode.removeChild(ring);
      }, 650);
    }

    toggleModal(open) {
      this.isOpen = open;
      const overlay = document.getElementById('presence-modal-overlay');
      if (overlay) {
        if (open) {
          overlay.classList.add('active');
          document.body.style.overflow = 'hidden';
        } else {
          overlay.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
    }

    openEditModal() {
      this.isEditModalOpen = true;
      this.tempEditState = {
        name: this.currentUser.name,
        avatar: this.currentUser.avatar,
        color: this.currentUser.color,
      };

      const editModal = document.getElementById('presence-edit-modal');
      const input = document.getElementById('presence-name-input');
      const previewImg = document.getElementById('presence-edit-preview-img');
      const previewBox = document.getElementById('presence-edit-avatar-preview');

      if (input) input.value = this.currentUser.name;
      if (previewImg) previewImg.src = getAvatarUrl(this.currentUser.avatar);
      if (previewBox) previewBox.style.backgroundColor = this.currentUser.color;

      const colorGrid = document.getElementById('presence-color-grid');
      if (colorGrid) {
        colorGrid.querySelectorAll('.presence-color-dot').forEach((d) => {
          d.classList.toggle('selected', d.dataset.color === this.currentUser.color);
        });
      }

      if (editModal) editModal.classList.add('active');
    }

    closeEditModal() {
      this.isEditModalOpen = false;
      const editModal = document.getElementById('presence-edit-modal');
      if (editModal) editModal.classList.remove('active');
    }

    updateConnectionStatus(status) {
      const statusText = document.getElementById('presence-status-text');
      const statusDot = document.querySelector('.presence-status-dot');
      if (statusText) {
        if (status === 'connected') {
          statusText.textContent = window.curriculoLang === 'en' ? 'SYSTEM CONNECTED' : 'SISTEMA CONECTADO';
          if (statusDot) statusDot.style.backgroundColor = '#00ff66';
        } else {
          statusText.textContent = window.curriculoLang === 'en' ? 'DISCONNECTED' : 'DESCONECTADO';
          if (statusDot) statusDot.style.backgroundColor = '#f87171';
        }
      }
    }

    getAllDisplayUsers() {
      const list = [];
      const seen = new Set();

      // 1. Current user always first
      list.push(this.currentUser);
      seen.add(this.currentUser.id);
      if (this.currentUser.socketId) seen.add(this.currentUser.socketId);
      if (this.socket && this.socket.id) seen.add(this.socket.id);

      // 2. Real other users from BroadcastChannel or WebSocket
      for (const [id, u] of this.users.entries()) {
        if (u.isMe) continue;
        if (seen.has(id)) continue;
        if (u.sessionId && seen.has(u.sessionId)) continue;
        if (u.socketId && seen.has(u.socketId)) continue;

        seen.add(id);
        if (u.sessionId) seen.add(u.sessionId);
        if (u.socketId) seen.add(u.socketId);
        list.push(u);
      }

      return list;
    }

    render() {
      const allUsers = this.getAllDisplayUsers();
      const totalCount = allUsers.length;

      // Update navbar pill
      const pill = document.getElementById('presence-count-pill');
      if (pill) pill.textContent = totalCount;

      // Update total counter in modal
      const totalEl = document.getElementById('presence-total-count');
      if (totalEl) totalEl.textContent = totalCount;

      // Update current user card
      const myName = document.getElementById('presence-my-name');
      const myAvatar = document.getElementById('presence-my-avatar-img');
      const myAvatarWrap = document.getElementById('presence-my-avatar-wrap');
      const myLocation = document.getElementById('presence-my-location-text');
      const myFlag = document.getElementById('presence-my-flag');

      if (myName) myName.textContent = this.currentUser.name;
      if (myAvatar) myAvatar.src = getAvatarUrl(this.currentUser.avatar);
      if (myAvatarWrap) myAvatarWrap.style.backgroundColor = this.currentUser.color;
      if (myLocation) myLocation.textContent = this.currentUser.location;
      if (myFlag) myFlag.innerHTML = renderFlagHtml(this.currentUser.countryCode, this.currentUser.flag);

      // Render others list
      const othersList = document.getElementById('presence-users-list');
      if (othersList) {
        const others = allUsers.filter((u) => u.id !== this.currentUser.id);
        const isEn = window.curriculoLang === 'en';
        if (others.length === 0) {
          othersList.innerHTML = `
            <div class="presence-empty-state code-font" data-i18n="presence_empty">
              ${isEn ? 'NO OTHER VISITORS CONNECTED AT THIS TIME' : 'NENHUM OUTRO VISITANTE CONECTADO NO MOMENTO'}
            </div>
          `;
        } else {
          othersList.innerHTML = others
            .map(
              (u) => {
                let timeStr = 'agora';
                if (isEn) {
                  timeStr = u.onlineSince ? `${u.onlineSince} ago` : 'just now';
                } else {
                  timeStr = u.onlineSince ? `há ${u.onlineSince}` : 'agora';
                }
                return `
            <div class="presence-user-item">
              <div class="presence-user-left">
                <div class="presence-avatar-wrap" style="background-color: ${u.color || '#60a5fa'}">
                  <img src="${getAvatarUrl(u.avatar)}" alt="${u.name}" class="presence-avatar-img" />
                  <div class="presence-avatar-badge"></div>
                </div>
                <div class="presence-user-details">
                  <div class="presence-user-name-row">
                    <span class="presence-user-name">${u.name}</span>
                  </div>
                  <div class="presence-user-location">
                    ${renderFlagHtml(u.countryCode, u.flag)}
                    <span>${u.location || 'Online'}</span>
                  </div>
                </div>
              </div>
              <div class="presence-online-since code-font">
                ${timeStr}
              </div>
            </div>
          `;
              }
            )
            .join('');
        }
      }
    }
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.presenceManager = new PresenceManager();
    });
  } else {
    window.presenceManager = new PresenceManager();
  }
})();
