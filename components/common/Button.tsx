import { TouchableOpacity, TouchableOpacityProps, Text } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'outline';
}

export function Button({ title, variant = 'primary', className, ...props }: ButtonProps) {
    let bgClass = 'bg-primary';
    let textClass = 'text-background';

    if (variant === 'secondary') {
        bgClass = 'bg-surface';
        textClass = 'text-text';
    } else if (variant === 'outline') {
        bgClass = 'bg-transparent border border-primary';
        textClass = 'text-primary';
    }

    return (
        <TouchableOpacity
            className={`p-4 rounded-lg items-center active:opacity-80 ${bgClass} ${className}`}
            {...props}
        >
            <Text className={`font-bold uppercase tracking-wider ${textClass}`}>
                {title}
            </Text>
        </TouchableOpacity>
    );
}
