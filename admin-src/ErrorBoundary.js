import { Component } from '@wordpress/element';
import { Button } from './ui';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      const t = this.props.t || ((key) => key);
      return (
        <div className="nk-banner-bar" role="alert">
          <div>
            <strong>{t('shell.errorTitle')}</strong>
            <div>{this.state.error.message || t('common.error')}</div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              this.setState({ error: null });
              window.location.reload();
            }}
          >
            {t('common.retry')}
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
