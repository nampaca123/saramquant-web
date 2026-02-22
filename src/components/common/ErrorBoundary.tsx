'use client';

import { Component, type ReactNode } from 'react';
import { Button } from '@/components/ui/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <p className="text-sm text-zinc-500">Something went wrong</p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => this.setState({ hasError: false })}
            >
              Retry
            </Button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
