function extractAccordionItemsFromBlock(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  return rows.map((row) => {
    const cells = [...row.children];
    return {
      title: cells[0]?.textContent?.trim() || '',
      body: cells[1]?.innerHTML || '',
    };
  });
}

function renderAccordionHTML(items) {
  return items
    .map(
      (item, index) => `
        <section class="accordion__item">
          <button class="accordion__trigger" type="button" aria-expanded="false" aria-controls="acc-panel-${index}">
            ${item.title}
          </button>
          <div id="acc-panel-${index}" class="accordion__panel" hidden>${item.body}</div>
        </section>
      `,
    )
    .join('');
}

function bindAccordionEventHandlers(block) {
  block.addEventListener('click', (event) => {
    const trigger = event.target.closest('.accordion__trigger');
    if (!trigger) return;

    const expanded = trigger.getAttribute('aria-expanded') === 'true';
    const panel = block.querySelector(`#${trigger.getAttribute('aria-controls')}`);
    trigger.setAttribute('aria-expanded', String(!expanded));
    panel.hidden = expanded;
  });
}
