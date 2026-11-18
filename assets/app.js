/**
 * SloRačun Pro — Glavna aplikacija (100% Client-Side, Slovenščina sl-SI)
 * Generator računov/predračunov z UPN/SEPA QR + Kalkulator Normiranec s.p. 2026 + SI12 Mod-11
 */
(function () {
  const CFG = window.SLORACUN_CONFIG || {
    price_eur: 3.90,
    stripe_payment_link: '',
    affiliates: []
  };

  // Ping local dashboard tracker silently when running locally
  function trackEvent(eventType, meta) {
    try {
      if (location.hostname === 'localhost' || location.hostname === '127.0.0.1' || localStorage.getItem('ep_dev_ping')) {
        fetch('http://localhost:3335/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event: eventType, page: location.pathname, meta: meta || {} }),
          keepalive: true
        }).catch(() => {});
      }
    } catch (_) {}
  }

  // Check Stripe redirect unlock (?pro=unlocked)
  const params = new URLSearchParams(window.location.search);
  if (params.get('pro') === 'unlocked') {
    localStorage.setItem('sloracun_pro_active', 'true');
    trackEvent('pro_purchase_unlocked', { amount_eur: CFG.price_eur || 3.90 });
  }

  function isProUnlocked() {
    return localStorage.getItem('sloracun_pro_active') === 'true';
  }

  // Format Euro in Slovenian locale (1.234,56 €)
  function fmtEur(num) {
    const n = Number(num) || 0;
    return n.toLocaleString('sl-SI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
  }

  // Genuine Slovenian ZBS Mod-11 check digit calculation for SI12 reference
  function calcSI12Reference(rawDigits) {
    const clean = String(rawDigits || '').replace(/\D/g, '').slice(0, 12);
    if (!clean) return 'SI12 20260018';
    let weight = 2;
    let sum = 0;
    for (let i = clean.length - 1; i >= 0; i--) {
      sum += parseInt(clean[i], 10) * weight;
      weight++;
    }
    const rem = sum % 11;
    let check = 11 - rem;
    if (check === 10 || check === 11) check = 0;
    return `SI12 ${clean}${check}`;
  }

  // Exact 2026 Slovenian Normirani s.p. Tax & Contributions Engine
  function calculateNormiranec2026(annualRevenue, statusType) {
    const rev = Math.max(0, Number(annualRevenue) || 0);
    let monthlyContrib = 651.04;
    let normExpenses = 0;
    let maxCapWarning = '';

    if (statusType === 'polni_y1') monthlyContrib = 465.80; // -50% PIZ v 1. letu
    else if (statusType === 'polni_y2') monthlyContrib = 539.90; // -30% PIZ v 2. letu
    else if (statusType === 'popoldanski') monthlyContrib = 113.01; // Pavšalni prispevki april 2026

    if (statusType === 'popoldanski') {
      // Popoldanski normirani s.p. 2026 (meja 50.000 €)
      const b1 = Math.min(rev, 12500);
      const b2 = Math.max(0, Math.min(rev - 12500, 17500)); // 12.5k..30k
      normExpenses = b1 * 0.80 + b2 * 0.40;
      if (rev > 50000) {
        maxCapWarning = 'Pozor: Prihodki presegajo mejo 50.000 € za popoldanski normirani s.p. v letu 2026!';
      }
    } else {
      // Polni normirani s.p. 2026 (80% normirani odhodki do 60.000 €, zgornji prag 120.000 €)
      normExpenses = Math.min(rev, 60000) * 0.80;
      if (rev > 120000) {
        maxCapWarning = 'Pozor: Prihodki presegajo zgornji prag 120.000 € za ohranitev statusa normiranca!';
      }
    }

    const taxBase = Math.max(0, rev - normExpenses);
    // 20% do davčne osnove 72.000 €, 35% nad 72.000 €
    const base20 = Math.min(taxBase, 72000);
    const base35 = Math.max(0, taxBase - 72000);
    const annualTax = base20 * 0.20 + base35 * 0.35;
    const annualContrib = monthlyContrib * 12;
    const totalBurden = annualTax + annualContrib;
    const annualNet = rev - totalBurden;
    const effectiveRate = rev > 0 ? (totalBurden / rev) * 100 : 0;

    return {
      annualRevenue: rev,
      normExpenses,
      taxBase,
      annualTax,
      monthlyContrib,
      annualContrib,
      totalBurden,
      annualNet,
      monthlyNet: annualNet / 12,
      effectiveRate,
      maxCapWarning
    };
  }

  // Initialize DOM when ready
  document.addEventListener('DOMContentLoaded', () => {
    trackEvent('visit');

    const preset = window.PAGE_PRESET || {};

    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab');
        tabBtns.forEach((b) => b.classList.toggle('active', b === btn));
        tabPanels.forEach((p) => p.classList.toggle('active', p.id === 'panel-' + target));
        trackEvent('tool_click', { tab: target });
      });
    });

    if (preset.defaultTab) {
      const tBtn = document.querySelector(`.tab-btn[data-tab="${preset.defaultTab}"]`);
      if (tBtn) tBtn.click();
    }

    // Pro UI refresh
    const proTopBtn = document.getElementById('proTopBtn');
    const watermarkEl = document.getElementById('invWatermark');
    const proLogoWrap = document.getElementById('proLogoWrap');
    const proBilingualWrap = document.getElementById('proBilingualWrap');

    function refreshProState() {
      const unlocked = isProUnlocked();
      if (proTopBtn) {
        proTopBtn.textContent = unlocked ? '✓ SloRačun PRO Aktiven (0 €)' : 'PRO Paket brez vodnega žiga (3,90 € → 0 €)';
        proTopBtn.classList.toggle('unlocked', unlocked);
      }
      if (watermarkEl) watermarkEl.style.display = unlocked ? 'none' : 'block';
      if (proLogoWrap) proLogoWrap.style.display = unlocked ? 'flex' : 'none';
      if (proBilingualWrap) proBilingualWrap.style.display = unlocked ? 'flex' : 'none';
    }
    refreshProState();

    // Invoice State & Line Items
    const itemsContainer = document.getElementById('itemsContainer');
    if (itemsContainer) {
      let lineItems = preset.items || [
        { desc: preset.defaultService || 'Svetovanje in razvoj programskih rešitev', qty: 1, unit: 'storitev', price: preset.defaultAmount || 1250.00, vat: preset.defaultVat !== undefined ? preset.defaultVat : 0 }
      ];

      const today = new Date();
      const due = new Date(today.getTime() + 14 * 86400000);
      const isoDate = (d) => d.toISOString().slice(0, 10);
      const slDate = (str) => {
        if (!str) return '';
        const [y, m, d] = str.split('-');
        return `${d}. ${m}. ${y}`;
      };

      const dateIssueEl = document.getElementById('invDateIssue');
      const dateServiceEl = document.getElementById('invDateService');
      const dateDueEl = document.getElementById('invDateDue');
      if (dateIssueEl && !dateIssueEl.value) dateIssueEl.value = isoDate(today);
      if (dateServiceEl && !dateServiceEl.value) dateServiceEl.value = isoDate(today);
      if (dateDueEl && !dateDueEl.value) dateDueEl.value = isoDate(due);

      let logoDataUrl = localStorage.getItem('sloracun_logo') || '';
      const logoInput = document.getElementById('invLogoInput');
      if (logoInput) {
        logoInput.addEventListener('change', (e) => {
          const f = e.target.files && e.target.files[0];
          if (!f) return;
          const reader = new FileReader();
          reader.onload = () => {
            logoDataUrl = reader.result;
            localStorage.setItem('sloracun_logo', logoDataUrl);
            renderInvoice();
          };
          reader.readAsDataURL(f);
        });
      }

      // Restore saved issuer details for 10-second UX
      const savedIssuer = JSON.parse(localStorage.getItem('sloracun_issuer') || '{}');
      ['issuerName', 'issuerAddr', 'issuerTax', 'issuerIban', 'issuerCity'].forEach((id) => {
        const el = document.getElementById(id);
        if (el && savedIssuer[id]) el.value = savedIssuer[id];
      });

      function renderItemInputs() {
        itemsContainer.innerHTML = '';
        lineItems.forEach((it, idx) => {
          const row = document.createElement('div');
          row.className = 'item-row';
          row.innerHTML = `
            <input type="text" value="${it.desc.replace(/"/g, '&quot;')}" placeholder="Opis storitve ali blaga" data-idx="${idx}" data-field="desc">
            <input type="number" step="0.5" min="0.1" value="${it.qty}" title="Količina" data-idx="${idx}" data-field="qty">
            <select data-idx="${idx}" data-field="unit">
              ${['storitev', 'ura', 'kos', 'mesec', 'projekt', 'dan'].map((u) => `<option value="${u}" ${it.unit === u ? 'selected' : ''}>${u}</option>`).join('')}
            </select>
            <input type="number" step="0.01" min="0" value="${it.price}" placeholder="Cena €" data-idx="${idx}" data-field="price">
            <select data-idx="${idx}" data-field="vat">
              <option value="0" ${Number(it.vat) === 0 ? 'selected' : ''}>0% DDV</option>
              <option value="22" ${Number(it.vat) === 22 ? 'selected' : ''}>22% DDV</option>
              <option value="9.5" ${Number(it.vat) === 9.5 ? 'selected' : ''}>9,5% DDV</option>
              <option value="5" ${Number(it.vat) === 5 ? 'selected' : ''}>5% DDV</option>
            </select>
            <button type="button" class="btn-remove" data-remove="${idx}" title="Odstrani postavko">×</button>
          `;
          itemsContainer.appendChild(row);
        });

        itemsContainer.querySelectorAll('input, select').forEach((inp) => {
          inp.addEventListener('input', (e) => {
            const idx = Number(e.target.getAttribute('data-idx'));
            const f = e.target.getAttribute('data-field');
            lineItems[idx][f] = (f === 'qty' || f === 'price' || f === 'vat') ? parseFloat(e.target.value || 0) : e.target.value;
            renderInvoice();
          });
        });

        itemsContainer.querySelectorAll('[data-remove]').forEach((btn) => {
          btn.addEventListener('click', () => {
            if (lineItems.length > 1) {
              lineItems.splice(Number(btn.getAttribute('data-remove')), 1);
              renderItemInputs();
              renderInvoice();
            }
          });
        });
      }

      const addItemBtn = document.getElementById('addItemBtn');
      if (addItemBtn) {
        addItemBtn.addEventListener('click', () => {
          const taxMode = document.getElementById('invTaxMode')?.value || 'norm_no_vat';
          lineItems.push({ desc: 'Dodatna storitev', qty: 1, unit: 'ura', price: 65, vat: taxMode === 'vat_payer' ? 22 : 0 });
          renderItemInputs();
          renderInvoice();
          trackEvent('tool_click', { action: 'add_line_item' });
        });
      }

      function renderInvoice() {
        const docType = document.getElementById('invDocType')?.value || 'RACUN';
        const invNum = document.getElementById('invNumber')?.value || '2026-001';
        const issuerName = document.getElementById('issuerName')?.value || 'Janez Novak s.p.';
        const issuerAddr = document.getElementById('issuerAddr')?.value || 'Slovenska cesta 12, 1000 Ljubljana';
        const issuerTax = document.getElementById('issuerTax')?.value || '12345678';
        const issuerIban = (document.getElementById('issuerIban')?.value || 'SI56 0201 0001 2345 678').trim();
        const issuerCity = document.getElementById('issuerCity')?.value || 'Ljubljana';

        localStorage.setItem('sloracun_issuer', JSON.stringify({ issuerName, issuerAddr, issuerTax, issuerIban, issuerCity }));

        const clientName = document.getElementById('clientName')?.value || 'Podjetje d.o.o.';
        const clientAddr = document.getElementById('clientAddr')?.value || 'Dunajska cesta 50, 1000 Ljubljana';
        const clientTax = document.getElementById('clientTax')?.value || 'SI87654321';
        const taxMode = document.getElementById('invTaxMode')?.value || 'norm_no_vat';
        const bilingual = isProUnlocked() && document.getElementById('invBilingual')?.checked;

        const refDigits = invNum.replace(/\D/g, '') || '2026001';
        const si12 = calcSI12Reference(refDigits);
        const refInput = document.getElementById('invReference');
        if (refInput && !refInput.dataset.manual) refInput.value = si12;
        const finalRef = refInput ? refInput.value : si12;

        const titles = {
          RACUN: bilingual ? 'RAČUN / INVOICE št.' : 'RAČUN št.',
          PREDRACUN: bilingual ? 'PREDRAČUN / PROFORMA št.' : 'PREDRAČUN št.',
          PONUDBA: bilingual ? 'PONUDBA / QUOTE št.' : 'PONUDBA št.'
        };
        document.getElementById('pvDocTitle').textContent = `${titles[docType]} ${invNum}`;

        const logoBox = document.getElementById('pvLogoBox');
        if (logoBox) {
          logoBox.innerHTML = (isProUnlocked() && logoDataUrl)
            ? `<img src="${logoDataUrl}" alt="Logotip" style="max-height:48px;max-width:150px;object-fit:contain;">`
            : '';
        }

        document.getElementById('pvIssuer').innerHTML = `
          <strong>${issuerName}</strong><br>
          ${issuerAddr}<br>
          ${taxMode === 'vat_payer' ? 'ID za DDV: SI' + issuerTax.replace(/^SI/i, '') : 'Davčna št.: ' + issuerTax}<br>
          TRR (IBAN): <strong>${issuerIban}</strong>
        `;
        document.getElementById('pvClient').innerHTML = `
          <strong>${clientName}</strong><br>
          ${clientAddr}<br>
          ${clientTax ? 'Davčna / ID za DDV: ' + clientTax : ''}
        `;

        document.getElementById('pvMetaPlace').textContent = `${issuerCity}, ${slDate(dateIssueEl?.value)}`;
        document.getElementById('pvMetaService').textContent = slDate(dateServiceEl?.value);
        document.getElementById('pvMetaDue').textContent = slDate(dateDueEl?.value);
        document.getElementById('pvMetaRef').textContent = finalRef;

        let netSum = 0;
        let vatSum = 0;
        const tbody = document.getElementById('pvItemsBody');
        tbody.innerHTML = '';

        lineItems.forEach((it, i) => {
          const lineNet = (Number(it.qty) || 0) * (Number(it.price) || 0);
          const effectiveVat = taxMode === 'vat_payer' ? (Number(it.vat) || 0) : 0;
          const lineVat = lineNet * (effectiveVat / 100);
          netSum += lineNet;
          vatSum += lineVat;

          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${i + 1}. ${it.desc || '-'}</td>
            <td class="num">${it.qty} ${it.unit}</td>
            <td class="num">${fmtEur(it.price)}</td>
            <td class="num">${effectiveVat.toString().replace('.', ',')}%</td>
            <td class="num"><strong>${fmtEur(lineNet + lineVat)}</strong></td>
          `;
          tbody.appendChild(tr);
        });

        const grandTotal = netSum + vatSum;
        document.getElementById('pvNetTotal').textContent = fmtEur(netSum);
        document.getElementById('pvVatTotal').textContent = fmtEur(vatSum);
        document.getElementById('pvGrandTotal').textContent = fmtEur(grandTotal);

        // Pocket Net estimator (4% effective income tax on normiranec up to 60k)
        const pocketNetEl = document.getElementById('pocketNetValue');
        if (pocketNetEl) {
          pocketNetEl.textContent = fmtEur(netSum * 0.96);
        }

        // Legal FURS ZDDV-1 clause
        const clauseEl = document.getElementById('pvLegalClause');
        if (taxMode === 'norm_no_vat') {
          clauseEl.textContent = bilingual
            ? 'DDV ni obračunan na podlagi 1. odstavka 94. člena Zakona o davku na dodano vrednost (ZDDV-1) — mali davčni zavezanec. / VAT is not charged under Article 94(1) of the Slovenian VAT Act (small business exemption). Plačilo na TRR ne zahteva davčnega potrjevanja (FURS).'
            : 'DDV ni obračunan na podlagi 1. odstavka 94. člena Zakona o davku na dodano vrednost (ZDDV-1) — nisem zavezanec za DDV. Plačilo z nakazilom na TRR preko UPN naloga ne zapade obveznemu davčnemu potrjevanju računov.';
        } else if (taxMode === 'eu_reverse') {
          clauseEl.textContent = 'Obrnjena davčna obveznost — DDV ni obračunan po 1. odstavku 25. člena ZDDV-1 (Reverse charge — VAT exempt under Article 44 and 196 of EU VAT Directive 2006/112/EC).';
        } else {
          clauseEl.textContent = 'DDV je obračunan v skladu z veljavnim Zakonom o davku na dodano vrednost (ZDDV-1). Prosimo, pri plačilu navedite točen sklic ' + finalRef + '.';
        }

        // Build EPC SEPA QR / UPN QR Payload (scannable by NLB Klik, OTP/NKBM, Revolut, N26, Intesa)
        const cleanIban = issuerIban.replace(/\s+/g, '');
        const epcPayload = [
          'BCD',
          '002',
          '1',
          'SCT',
          '',
          issuerName.slice(0, 70),
          cleanIban,
          'EUR' + grandTotal.toFixed(2),
          'GDSV',
          finalRef.replace(/\s+/g, ''),
          `Placilo ${docType.toLowerCase()}a ${invNum}`
        ].join('\n');

        const qrContainer = document.getElementById('pvQrBox');
        if (qrContainer && window.SloQR) {
          qrContainer.innerHTML = window.SloQR.renderQRToSVG(epcPayload, 104);
        }
        document.getElementById('pvQrMetaIban').textContent = issuerIban;
        document.getElementById('pvQrMetaRef').textContent = finalRef;
        document.getElementById('pvQrMetaAmt').textContent = fmtEur(grandTotal);
      }

      document.querySelectorAll('#panel-invoice input, #panel-invoice select').forEach((el) => {
        el.addEventListener('input', renderInvoice);
        el.addEventListener('change', renderInvoice);
      });

      renderItemInputs();
      renderInvoice();
    }

    // Free Print vs Pro Modal Handlers
    const freePrintBtn = document.getElementById('freePrintBtn');
    if (freePrintBtn) {
      freePrintBtn.addEventListener('click', () => {
        trackEvent('tool_click', { action: 'free_pdf_print' });
        // Automatically ensure watermark is hidden
        if (watermarkEl) watermarkEl.style.display = 'none';
        window.print();
      });
    }

    const proModal = document.getElementById('proModal');
    const openProModal = () => {
      if (isProUnlocked()) {
        trackEvent('tool_click', { action: 'pro_pdf_print' });
        if (watermarkEl) watermarkEl.style.display = 'none';
        window.print();
        return;
      }
      trackEvent('tool_click', { action: 'open_pro_paywall_modal' });
      if (proModal) proModal.classList.add('open');
    };

    document.querySelectorAll('.js-open-pro').forEach((b) => b.addEventListener('click', openProModal));
    const closeProBtn = document.getElementById('closeProModal');
    if (closeProBtn) closeProBtn.addEventListener('click', () => proModal.classList.remove('open'));

    // Promo 100% Free Unlock Button (Perceived value 3,90 € -> 0,00 €)
    const promoUnlockBtn = document.getElementById('promoUnlockBtn');
    if (promoUnlockBtn) {
      promoUnlockBtn.addEventListener('click', () => {
        localStorage.setItem('sloracun_pro_active', 'true');
        trackEvent('pro_promo_unlocked_free', { saved_eur: CFG.price_eur || 3.90 });
        refreshProState();
        renderInvoice();
        const notice = document.getElementById('promoSuccessNotice');
        if (notice) notice.style.display = 'block';
        setTimeout(() => {
          if (proModal) proModal.classList.remove('open');
          window.print();
        }, 500);
      });
    }

    const stripePayBtn = document.getElementById('stripeCheckoutBtn');
    if (stripePayBtn) {
      stripePayBtn.addEventListener('click', () => {
        trackEvent('tool_click', { action: 'click_stripe_checkout_eur' });
        if (CFG.stripe_payment_link && CFG.stripe_payment_link.startsWith('http')) {
          window.open(CFG.stripe_payment_link, '_blank', 'noopener');
        } else {
          // If no active Stripe link yet, automatically unlock for free!
          localStorage.setItem('sloracun_pro_active', 'true');
          refreshProState();
          renderInvoice();
          if (proModal) proModal.classList.remove('open');
          window.print();
        }
      });
    }

    // License code manual activation inside modal
    const activateCodeBtn = document.getElementById('activateLicenseBtn');
    if (activateCodeBtn) {
      activateCodeBtn.addEventListener('click', () => {
        const val = (document.getElementById('licenseInput')?.value || '').trim().toUpperCase();
        if (val === 'SLOPRO2026' || val.startsWith('CS_LIVE_') || val.startsWith('PI_')) {
          localStorage.setItem('sloracun_pro_active', 'true');
          refreshProState();
          proModal.classList.remove('open');
          window.print();
        } else {
          alert('Neveljavna aktivacijska koda. Po plačilu s kartico se PRO paket odklene samodejno.');
        }
      });
    }

    // Tab 2: Normiranec s.p. 2026 Calculator
    const revInput = document.getElementById('calcAnnualRev');
    const revSlider = document.getElementById('calcRevSlider');
    const statusSel = document.getElementById('calcSpStatus');

    if (revInput && statusSel) {
      if (preset.defaultAnnualRev) {
        revInput.value = preset.defaultAnnualRev;
        if (revSlider) revSlider.value = preset.defaultAnnualRev;
      }
      if (preset.defaultSpStatus) statusSel.value = preset.defaultSpStatus;

      function updateCalcUI() {
        const rev = parseFloat(revInput.value || 0);
        const st = statusSel.value;
        const r = calculateNormiranec2026(rev, st);
        const rPolni = calculateNormiranec2026(rev, 'polni');
        const rPop = calculateNormiranec2026(rev, 'popoldanski');

        document.getElementById('resMonthlyNet').textContent = fmtEur(r.monthlyNet);
        document.getElementById('resAnnualNet').textContent = fmtEur(r.annualNet);
        document.getElementById('resAnnualTax').textContent = fmtEur(r.annualTax);
        document.getElementById('resAnnualContrib').textContent = fmtEur(r.annualContrib);
        document.getElementById('resEffRate').textContent = r.effectiveRate.toFixed(1).replace('.', ',') + ' %';
        document.getElementById('resNormExp').textContent = fmtEur(r.normExpenses);
        document.getElementById('resTaxBase').textContent = fmtEur(r.taxBase);
        document.getElementById('resMonthlyContrib').textContent = fmtEur(r.monthlyContrib);

        const warnEl = document.getElementById('resCapWarning');
        if (warnEl) {
          warnEl.textContent = r.maxCapWarning;
          warnEl.style.display = r.maxCapWarning ? 'block' : 'none';
        }

        // Side-by-side comparison table
        const cmpPolniNet = document.getElementById('cmpPolniNet');
        const cmpPopNet = document.getElementById('cmpPopNet');
        if (cmpPolniNet) cmpPolniNet.textContent = fmtEur(rPolni.annualNet);
        if (cmpPopNet) cmpPopNet.textContent = fmtEur(rPop.annualNet);
      }

      revInput.addEventListener('input', () => {
        if (revSlider) revSlider.value = revInput.value;
        updateCalcUI();
      });
      if (revSlider) {
        revSlider.addEventListener('input', () => {
          revInput.value = revSlider.value;
          updateCalcUI();
        });
      }
      statusSel.addEventListener('change', () => {
        trackEvent('tool_click', { action: 'change_sp_status', status: statusSel.value });
        updateCalcUI();
      });
      updateCalcUI();

      const jumpToInvBtn = document.getElementById('jumpToInvoiceBtn');
      if (jumpToInvBtn) {
        jumpToInvBtn.addEventListener('click', () => {
          document.querySelector('.tab-btn[data-tab="invoice"]')?.click();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }
    }

    // Tab 3: DDV & SI12 Quick Utilities
    const ddvAmt = document.getElementById('utilDdvAmount');
    const ddvRate = document.getElementById('utilDdvRate');
    const ddvDir = document.getElementById('utilDdvDir');
    if (ddvAmt) {
      const updateDdvUtil = () => {
        const val = parseFloat(ddvAmt.value || 0);
        const rate = parseFloat(ddvRate.value || 22) / 100;
        let net = val, vat = val * rate, gross = val + vat;
        if (ddvDir.value === 'from_gross') {
          gross = val;
          net = gross / (1 + rate);
          vat = gross - net;
        }
        document.getElementById('utilResNet').textContent = fmtEur(net);
        document.getElementById('utilResVat').textContent = fmtEur(vat);
        document.getElementById('utilResGross').textContent = fmtEur(gross);
      };
      [ddvAmt, ddvRate, ddvDir].forEach((el) => el.addEventListener('input', updateDdvUtil));
      updateDdvUtil();
    }

    const si12Raw = document.getElementById('utilSi12Raw');
    if (si12Raw) {
      const updateSi12 = () => {
        document.getElementById('utilSi12Result').textContent = calcSI12Reference(si12Raw.value);
      };
      si12Raw.addEventListener('input', updateSi12);
      updateSi12();
    }

    // Track B2B affiliate clicks
    document.querySelectorAll('[data-affiliate]').forEach((link) => {
      link.addEventListener('click', () => {
        trackEvent('affiliate_click', { partner: link.getAttribute('data-affiliate') });
      });
    });
  });
})();
