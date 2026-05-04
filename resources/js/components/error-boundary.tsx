import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
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
                <div className="bg-background flex min-h-screen flex-col items-center justify-center p-6 text-center">
                    <div className="bg-destructive/10 border-destructive/20 mb-6 flex h-20 w-20 items-center justify-center rounded-full border">
                        <AlertTriangle className="text-destructive h-10 w-10" />
                    </div>
                    <h1 className="text-foreground text-2xl font-bold">Something went wrong</h1>
                    <p className="text-muted-foreground mt-2 max-w-md">
                        An unexpected error occurred. We've been notified and are working to fix it.
                    </p>
                    <div className="mt-8 flex gap-4">
                        <Button onClick={() => window.location.reload()} variant="outline" className="gap-2">
                            <RefreshCcw className="h-4 w-4" />
                            Reload Page
                        </Button>
                        <Button onClick={() => (window.location.href = '/')} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            Back to Home
                        </Button>
                    </div>
                    {import.meta.env.DEV && (
                        <div className="bg-muted text-muted-foreground border-border mt-8 max-w-2xl overflow-auto rounded-lg border p-4 text-left font-mono text-xs">
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
