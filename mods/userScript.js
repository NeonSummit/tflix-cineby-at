import 'whatwg-fetch';
import './spatial-navigation-polyfill.js';
import './ui.js';
import './contentDetector.js';
import { initializePerformanceOptimizations } from './performance.js';

if (typeof NodeList !== 'undefined' && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}

if (typeof HTMLCollection !== 'undefined' && !HTMLCollection.prototype.forEach) {
  HTMLCollection.prototype.forEach = Array.prototype.forEach;
}

// Initialize performance optimizations early
initializePerformanceOptimizations();
