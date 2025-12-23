'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Icon, IconName } from '@/components/ui';
import styles from './BottomNav.module.css';

interface NavItem {
  href: string;
  label: string;
  icon: IconName;
}

const navItems: NavItem[] = [
  { href: '/play', label: 'Jugar', icon: 'play' },
  { href: '/', label: 'Inicio', icon: 'home' },
  { href: '/profile', label: 'Perfil', icon: 'user' },
];

export function BottomNav() {
  const pathname = usePathname();
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
  const [activeIndex, setActiveIndex] = useState(-1);
  const [prevIndex, setPrevIndex] = useState(-1);
  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // Find active index based on pathname
  useEffect(() => {
    const newIndex = navItems.findIndex(item => item.href === pathname);
    if (newIndex !== activeIndex) {
      setPrevIndex(activeIndex);
      setActiveIndex(newIndex);
    }
  }, [pathname, activeIndex]);

  // Update indicator position when active index changes
  useEffect(() => {
    if (activeIndex >= 0 && navRef.current && itemRefs.current[activeIndex]) {
      const navRect = navRef.current.getBoundingClientRect();
      const itemRect = itemRefs.current[activeIndex]!.getBoundingClientRect();
      
      setIndicatorStyle({
        width: itemRect.width,
        transform: `translateX(${itemRect.left - navRect.left}px)`,
      });
    }
  }, [activeIndex]);

  return (
    <nav className={styles.nav} ref={navRef}>
      {/* Animated sliding indicator */}
      <div 
        className={styles.indicator} 
        style={indicatorStyle}
      />
      
      {navItems.map((item, index) => {
        const isActive = pathname === item.href;
        const wasActive = prevIndex === index;
        
        return (
          <Link
            key={item.href}
            href={item.href}
            ref={el => { itemRefs.current[index] = el; }}
            className={`${styles.navItem} ${isActive ? styles.active : ''} ${wasActive && !isActive ? styles.leaving : ''}`}
          >
            <div className={styles.iconWrapper}>
              <Icon name={item.icon} size={24} />
              {isActive && <div className={styles.iconGlow} />}
            </div>
            <span className={styles.label}>{item.label}</span>
            
            {/* Ripple effect container */}
            <span className={styles.ripple} />
          </Link>
        );
      })}
    </nav>
  );
}
