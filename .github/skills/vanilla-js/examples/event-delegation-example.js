export default function decorate(block) {
  block.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-action="toggle-item"]');
    if (!trigger || !block.contains(trigger)) return;

    const targetId = trigger.getAttribute('data-target-id');
    const target = block.querySelector(`#${targetId}`);
    if (!target) return;

    const isOpen = trigger.getAttribute('aria-expanded') === 'true';
    trigger.setAttribute('aria-expanded', String(!isOpen));
    target.hidden = isOpen;
  });
}
