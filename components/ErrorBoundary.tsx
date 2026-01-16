import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the app.
 * 
 * This prevents the dreaded "white screen of death" by showing users a helpful
 * error message and giving developers the stack trace they need to debug.
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        // Update state so the next render will show the fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // Log the error to console for debugging
        console.error('ErrorBoundary caught an error:', error);
        console.error('Component stack:', errorInfo.componentStack);

        this.setState({ errorInfo });

        // You could also log to an error reporting service here
        // e.g., Sentry.captureException(error);
    }

    handleRetry = (): void => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            // Custom fallback UI if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default error UI
            return (
                <View style={styles.container}>
                    <View style={styles.content}>
                        <Text style={styles.emoji}>😵</Text>
                        <Text style={styles.title}>Something went wrong</Text>
                        <Text style={styles.subtitle}>
                            The app encountered an unexpected error. This has been logged for debugging.
                        </Text>

                        <TouchableOpacity style={styles.retryButton} onPress={this.handleRetry}>
                            <Text style={styles.retryButtonText}>Try Again</Text>
                        </TouchableOpacity>

                        {__DEV__ && this.state.error && (
                            <ScrollView style={styles.errorDetails}>
                                <Text style={styles.errorTitle}>Error Details (Dev Only):</Text>
                                <Text style={styles.errorMessage}>{this.state.error.toString()}</Text>
                                {this.state.errorInfo && (
                                    <Text style={styles.stackTrace}>
                                        {this.state.errorInfo.componentStack}
                                    </Text>
                                )}
                            </ScrollView>
                        )}
                    </View>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0A0F',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    content: {
        alignItems: 'center',
        maxWidth: 400,
    },
    emoji: {
        fontSize: 64,
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: 'white',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#888888',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    retryButton: {
        backgroundColor: '#FF4500',
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 24,
        marginBottom: 24,
    },
    retryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
    errorDetails: {
        maxHeight: 200,
        width: '100%',
        backgroundColor: '#1A1A23',
        borderRadius: 12,
        padding: 16,
    },
    errorTitle: {
        color: '#FF4500',
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 8,
    },
    errorMessage: {
        color: '#FF6B6B',
        fontSize: 13,
        fontFamily: 'monospace',
        marginBottom: 12,
    },
    stackTrace: {
        color: '#888888',
        fontSize: 11,
        fontFamily: 'monospace',
    },
});

export default ErrorBoundary;
