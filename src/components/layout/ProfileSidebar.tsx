'use client';

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Link from 'next/link';
import styles from '../ProfileSidebar.module.css';
import { useVerificationSummary } from '@/client/hooks/useVerification';

interface ProfileSidebarProps {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
  user: {
    id: string;
    email: string;
    role: string;
    photo?: string;
  } | null;
}

export default function ProfileSidebar({ open, onClose, onLogout, user }: ProfileSidebarProps) {
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const { summary } = useVerificationSummary();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch user profile image if user exists
  useEffect(() => {
    if (user && user.id) {
      fetch(`/api/profile-image?id=${user.id}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.url) setProfileImg(data.url);
          else setProfileImg(null);
        })
        .catch(() => setProfileImg(null));
    } else {
      setProfileImg(null);
    }
  }, [user]);
  // lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  if (!mounted) return null;

  return ReactDOM.createPortal(
    <div className={`${styles.root} ${open ? styles.open : ''}`} aria-hidden={!open}>
      {/* Overlay */}
      <div className={styles.overlay} onClick={onClose} />

      {/* Sidebar */}
      <aside
        role="dialog"
        aria-modal="true"
        className={`${styles.sidebar} ${styles.roundedSidebar}`}
      >
        <header className={styles.header} style={{ borderBottom: '1px solid #e5e7eb' }}>
          <span className={styles.title}>Profile</span>
          <button className={styles.close} aria-label="Close sidebar" onClick={onClose}>
            ×
          </button>
        </header>

        <div className={styles.profileMain}>
          {profileImg ? (
            <img src={profileImg} alt="Profile" className={styles.profileImg} />
          ) : (
            <div className={styles.profileImgPlaceholder} />
          )}
          <div className={styles.profileNavWrap}>
            <nav className={styles.nav}>
              <Link href="/dashboard" className={styles.link} onClick={onClose}>
                <span className={styles.bullet} /> Dashboard
              </Link>
              <Link href="/profile" className={styles.link} onClick={onClose}>
                <span className={styles.bullet} /> Profile
              </Link>
              <Link href="/verification" className={styles.link} onClick={onClose}>
                <span className={styles.bullet} /> Verification
                {summary?.isFullyVerified ? (
                  <span className={styles.verifiedBadge}>✓</span>
                ) : (
                  <span className={styles.badge}>
                    {Math.round((summary?.activityScore ?? 0) + (summary?.trustScore ?? 0)) / 2}%
                  </span>
                )}
              </Link>
              <Link href="/wallet" className={styles.link} onClick={onClose}>
                <span className={styles.bullet} /> Wallet
              </Link>
              <Link href="/settings" className={styles.link} onClick={onClose}>
                <span className={styles.bullet} /> Settings
              </Link>
              <Link href="/messages" className={styles.link} onClick={onClose}>
                <span className={styles.bullet} /> Inbox
                <span className={styles.badge}>14</span>
              </Link>
              <button
                className={`${styles.link} ${styles.logout}`}
                onClick={() => {
                  onLogout();
                  onClose();
                }}
              >
                <span className={styles.bullet} /> Log out
              </button>
            </nav>
          </div>
        </div>

        <footer className={styles.footer}>
          {user ? (
            <div className={styles.userCard}>
              <div className={styles.email}>{user.email}</div>
              <div>Role: {user.role}</div>
              <div className={styles.muted}>ID: {user.id}</div>
            </div>
          ) : (
            <div className={styles.error}>No user data</div>
          )}
        </footer>
      </aside>
    </div>,
    document.body,
  );
}
