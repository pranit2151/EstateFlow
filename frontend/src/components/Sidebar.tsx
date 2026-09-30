'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '' },
    { href: '/leads', label: 'Leads', icon: '' },
    { href: '/leads/new', label: 'Add Lead', icon: '' },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>EF</span>
        <h1>EstateFlow</h1>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
          >
            <span className={styles.icon}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className={styles.userSection}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>{user?.name?.charAt(0) || 'U'}</div>
          <div>
            <p className={styles.userName}>{user?.name}</p>
            <p className={styles.userEmail}>{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </aside>
  );
}
