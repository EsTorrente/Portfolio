import { Component } from 'react';
// Error boundary: if something inside crashes, show `fallback` (or nothing) instead of React unmounting the WHOLE app (that was the blank brown screen).
export default class Guard extends Component {
  state = { err: null };
  static getDerivedStateFromError(err) { return { err }; }
  componentDidCatch(err) { console.error('[Guard]', err); this.props.onError?.(err); }
  render() { return this.state.err ? (this.props.fallback ?? null) : this.props.children; }
}
