import { View, ViewProps } from 'react-native';

export function ThemedView({ className, style, ...otherProps }: ViewProps) {
    return <View className={`bg-background ${className}`} style={style} {...otherProps} />;
}
