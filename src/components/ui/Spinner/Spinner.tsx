import styles from './Spinner.module.css';

type SpinnerSize = 'sm' | 'md' | 'lg';

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <div
      className={`${styles.spinner} ${styles[size]} ${className || ''}`}
      role="status"
      aria-label="Cargando"
    >
      <span className="visually-hidden">Cargando...</span>
    </div>
  );
}
