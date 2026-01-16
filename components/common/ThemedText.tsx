import { Text, TextProps } from 'react-native';

export function ThemedText({ className, style, ...otherProps }: TextProps) {
    return <Text className={`text-text font-sans ${className}`} style={style} {...otherProps} />;
}
