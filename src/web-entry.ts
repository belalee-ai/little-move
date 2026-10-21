// Only the website sets this base. Studio and video renders keep Remotion's own base.
window.remotion_staticBase = import.meta.env.BASE_URL.replace(/\/$/, '');
void import('./gallery');
