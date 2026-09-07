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
    console.error('Eyvan Kheshti interface error', error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main className="ek-recovery" role="alert">
        <span>EK</span>
        <h1>EYVAN KHESHTI</h1>
        <p>The studio experience needs to be reloaded.</p>
        <button type="button" onClick={() => window.location.reload()}>Reload experience</button>
      </main>
    );
  }
}
