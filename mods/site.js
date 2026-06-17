export const CINEBY_ORIGIN = 'https://www.cineby.at';

export function isCinebyHost(hostname) {
  var host = (hostname || window.location.hostname || '').toLowerCase();
  return host === 'cineby.gd' ||
    host === 'www.cineby.gd' ||
    host === 'cineby.at' ||
    host === 'www.cineby.at';
}

export function isCinebyPage() {
  return isCinebyHost(window.location.hostname);
}

export function isCinebyWatchPage() {
  var path = window.location.pathname || '';
  return path.indexOf('/movie') === 0 ||
    path.indexOf('/tv') === 0 ||
    path.indexOf('/watch') === 0;
}

export function cinebySearchUrl() {
  return CINEBY_ORIGIN + '/search';
}

export function toArray(value) {
  return Array.prototype.slice.call(value || []);
}

