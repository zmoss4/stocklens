import React, { Component } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@blinkdotnew/ui';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class SectionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Card className="border-red-500/10 bg-red-500/5 backdrop-blur-md">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <CardTitle className="text-lg text-red-400">
                {this.props.fallbackTitle || 'Section Unavailable'}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-400 mb-4">
              This section encountered an error while rendering. Other sections are unaffected.
            </p>
            <Button variant="outline" size="sm" onClick={this.handleRetry} className="gap-2">
              <RefreshCw className="w-3 h-3" /> Retry
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}
