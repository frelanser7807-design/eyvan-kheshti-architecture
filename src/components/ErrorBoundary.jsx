import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error('World Arch Journal interface error', error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main className="ek-recovery" role="alert">
        <span>WAJ</span>
        <h1>WORLD ARCH JOURNAL</h1>
        <p>The studio experience needs to be reloaded.</p>
        <button type="button" onClick={() => window.location.reload()}>Reload experience</button>
      </main>
    );
  }
}
