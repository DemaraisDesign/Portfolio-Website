import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// --- Context ---
const PasswordGateContext = createContext();

export const usePasswordGate = () => useContext(PasswordGateContext);

const CORRECT_PASSWORD = 'design';
// Keep STORAGE_KEY definition just in case, but unused hereafter.
const STORAGE_KEY = 'portfolio_unlocked';

// Extract project ID from any path format: "/work/morgan-stanley" → "morgan-stanley"
const extractProjectId = (path) => {
    if (!path) return null;
    const match = path.match(/\/work\/([^/]+)/);
    return match ? match[1] : path;
};

export const PasswordGateProvider = ({ children }) => {
    const [unlockedIds, setUnlockedIds] = useState(() => new Set());
    const [isOpen, setIsOpen] = useState(false);
    const [pendingPath, setPendingPath] = useState(null);

    const isProjectUnlocked = useCallback((pathOrId) => {
        const id = extractProjectId(pathOrId);
        return id ? unlockedIds.has(id) : false;
    }, [unlockedIds]);

    const requestAccess = useCallback((path) => {
        const id = extractProjectId(path);
        if (id && unlockedIds.has(id)) return true;
        setPendingPath(path);
        setIsOpen(true);
        return false;
    }, [unlockedIds]);

    const unlock = useCallback(() => {
        if (pendingPath) {
            const id = extractProjectId(pendingPath);
            if (id) {
                setUnlockedIds(prev => {
                    const next = new Set([...prev, id]);
                    return next;
                });
            }
        }
        setIsOpen(false);
        setPendingPath(null); // CRITICAL: Clear pending path so it doesn't get re-fired
    }, [pendingPath]);

    const close = useCallback(() => {
        setIsOpen(false);
        setPendingPath(null);
    }, []);

    return (
        <PasswordGateContext.Provider value={{ isProjectUnlocked, requestAccess, unlock, close, isOpen, pendingPath }}>
            {children}
            <PasswordModal />
        </PasswordGateContext.Provider>
    );
};

// --- Modal ---
const PasswordModal = () => {
    const { isOpen, close, unlock, pendingPath } = usePasswordGate();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [hasFailed, setHasFailed] = useState(false);
    const [success, setSuccess] = useState(false);
    const inputRef = useRef(null);

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen) {
            setPassword('');
            setError(false);
            setSuccess(false);
            setHasFailed(false);
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    // Handle the success redirect smoothly and reliably
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                // Must capture path before unlock clears it
                const targetPath = pendingPath; 
                unlock();
                setSuccess(false); // CRITICAL: prevent this effect from re-running on route change
                if (targetPath) navigate(targetPath);
            }, 1200);
            return () => clearTimeout(timer);
        }
    }, [success, pendingPath, navigate, unlock]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password.toLowerCase().trim() === CORRECT_PASSWORD) {
            setSuccess(true);
            setError(false);
            setHasFailed(false);
        } else {
            setError(true);
            setHasFailed(true);
            setPassword('');
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };

    const handleBackdropClick = (e) => {
        if (!success && e.target === e.currentTarget) close();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    onClick={handleBackdropClick}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 9999,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        pointerEvents: success ? 'none' : 'auto', // Prevent interaction during redirect
                    }}
                >
                    <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.85, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        style={{
                            width: '100%', maxWidth: 400,
                            margin: '0 24px',
                            backgroundColor: '#ffffff',
                            borderRadius: 20,
                            padding: '40px 32px 36px',
                            boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
                            textAlign: 'center',
                            position: 'relative',
                        }}
                    >
                        {/* Close button */}
                        <button
                            onClick={close}
                            style={{
                                position: 'absolute', top: 14, right: 14,
                                width: 32, height: 32, borderRadius: '50%',
                                border: 'none', background: '#f0f0f0',
                                cursor: 'pointer', display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                fontSize: 16, color: '#999',
                                transition: 'background 0.2s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#e0e0e0'}
                            onMouseLeave={e => e.currentTarget.style.background = '#f0f0f0'}
                            aria-label="Close"
                        >
                            ✕
                        </button>

                        {/* Lock icon / GIF */}
                        <motion.div
                            animate={success ? { scale: [1, 1.15, 1], y: [0, -5, 0] } : error ? { x: [0, -8, 8, -6, 6, 0] } : {}}
                            transition={success ? { duration: 0.4, ease: "easeOut" } : { duration: 0.4 }}
                            style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}
                        >
                            {hasFailed ? (
                                <img 
                                    src="https://res.cloudinary.com/dqabyzuzf/image/upload/v1775231156/vaad8ujchxu3sugjrwjn.gif" 
                                    alt="Ah ah ah!" 
                                    style={{ width: '100%', maxWidth: 180, height: 'auto', borderRadius: 12, objectFit: 'contain' }} 
                                />
                            ) : (
                                <svg width="48" height="48" viewBox="0 0 24 24" fill={success ? '#22c55e' : '#1a2b3c'} stroke={success ? '#22c55e' : '#1a2b3c'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M7 10V7a5 5 0 0 1 10 0v3" fill="none" />
                                    <rect x="3" y="10" width="18" height="12" rx="2" fill={success ? '#22c55e' : '#1a2b3c'} stroke="none" />
                                    <circle cx="12" cy="16" r="1.5" fill="white" stroke="white" strokeWidth="3" />
                                </svg>
                            )}
                        </motion.div>

                        {/* Title */}
                        <h3 style={{
                            fontFamily: "'Outfit', sans-serif",
                            fontSize: 22, fontWeight: 700,
                            color: '#1a2b3c', marginBottom: 8,
                            letterSpacing: '-0.01em',
                        }}>
                            {success 
                                ? 'Welcome In' 
                                : hasFailed 
                                    ? "Ah Ah Ah! You didn't say the magic word." 
                                    : "What's the magic word?"}
                        </h3>
                        <p style={{
                            fontSize: 14, color: '#888',
                            marginBottom: 24, lineHeight: 1.5,
                        }}>
                            {success ? 'Redirecting you now...' : 'Enter the password to view this case study.'}
                        </p>

                        {/* Form */}
                        <AnimatePresence>
                            {!success && (
                                <motion.form 
                                    initial={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    style={{ overflow: 'hidden' }}
                                    onSubmit={handleSubmit}
                                >
                                    <div style={{ position: 'relative', marginBottom: 16 }}>
                                        <input
                                            ref={inputRef}
                                            type="password"
                                            value={password}
                                            onChange={e => { setPassword(e.target.value); setError(false); }}
                                            placeholder="Password"
                                            style={{
                                                width: '100%', padding: hasFailed ? '14px 44px 14px 18px' : '14px 18px',
                                                fontSize: 16, fontFamily: "'Outfit', sans-serif",
                                                border: `2px solid ${error ? '#ef4444' : '#e5e7eb'}`,
                                                borderRadius: 12, outline: 'none',
                                                transition: 'border-color 0.2s, box-shadow 0.2s',
                                                boxSizing: 'border-box',
                                                backgroundColor: '#fafafa',
                                            }}
                                            onFocus={e => {
                                                if (!error) e.target.style.borderColor = '#1a2b3c';
                                                e.target.style.boxShadow = '0 0 0 3px rgba(26,43,60,0.1)';
                                            }}
                                            onBlur={e => {
                                                if (!error) e.target.style.borderColor = '#e5e7eb';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                        />
                                        {hasFailed && (
                                            <div style={{
                                                position: 'absolute',
                                                right: 18,
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                display: 'flex',
                                                pointerEvents: 'none'
                                            }}>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill={success ? '#22c55e' : '#ef4444'} stroke={success ? '#22c55e' : '#ef4444'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M7 10V7a5 5 0 0 1 10 0v3" fill="none" />
                                                    <rect x="3" y="10" width="18" height="12" rx="2" fill={success ? '#22c55e' : '#ef4444'} stroke="none" />
                                                    <circle cx="12" cy="16" r="1.5" fill="white" stroke="white" strokeWidth="3" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <AnimatePresence>
                                        {error && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                style={{ color: '#ef4444', fontSize: 13, marginBottom: 12, fontWeight: 600 }}
                                            >
                                                Incorrect password. Try again.
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                    <button
                                        type="submit"
                                        style={{
                                            width: '100%', padding: '14px',
                                            fontSize: 14, fontWeight: 700,
                                            fontFamily: "'Outfit', sans-serif",
                                            textTransform: 'uppercase', letterSpacing: '0.08em',
                                            color: '#ffffff', backgroundColor: '#1a2b3c',
                                            border: 'none', borderRadius: 12,
                                            cursor: 'pointer',
                                            transition: 'background 0.2s, transform 0.15s',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2d4a63'}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1a2b3c'}
                                        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
                                        onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        Unlock
                                    </button>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PasswordGateProvider;
