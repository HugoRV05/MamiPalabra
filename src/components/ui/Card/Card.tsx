import { HTMLAttributes, ReactNode } from 'react';
import styles from './Card.module.css';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  elevated?: boolean;
  interactive?: boolean;
  glass?: boolean;
  glowing?: boolean;
}

export function Card({
  children,
  elevated = false,
  interactive = false,
  glass = false,
  glowing = false,
  className,
  ...props
}: CardProps) {
  const classNames = [
    styles.card,
    elevated && styles.elevated,
    interactive && styles.interactive,
    glass && styles.glass,
    glowing && styles.glowing,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames} {...props}>
      {children}
    </div>
  );
}
