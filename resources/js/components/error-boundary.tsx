import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 border border-destructive/20">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
          <p className="mt-2 max-w-md text-muted-foreground">
            An unexpected error occurred. We've been notified and are working to fix it.
          </p>
          <div className="mt-8 flex gap-4">
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              className="gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              Reload Page
            </Button>
            <Button 
                onClick={() => window.location.href = '/'}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Back to Home
            </Button>
          </div>
          {import.meta.env.DEV && (
            <div className="mt-8 overflow-auto rounded-lg bg-muted p-4 text-left font-mono text-xs text-muted-foreground max-w-2xl border border-border">
                {this.state.error?.toString()}
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
