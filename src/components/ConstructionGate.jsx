import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ConstructionGateContext = createContext();

export const useConstructionGate = () => useContext(ConstructionGateContext);

export const ConstructionGateProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [pendingPath, setPendingPath] = useState(null);

    const requestConstructionAccess = useCallback((path) => {
        setPendingPath(path);
        setIsOpen(true);
    }, []);

    const close = useCallback(() => {
        setIsOpen(false);
        setPendingPath(null);
    }, []);

    return (
        <ConstructionGateContext.Provider value={{ requestConstructionAccess, close, isOpen, pendingPath }}>
            {children}
            <ConstructionModal />
        </ConstructionGateContext.Provider>
    );
};

const ConstructionModal = () => {
    const { isOpen, close } = useConstructionGate();
    const [name, setName] = useState('');
    const [company, setCompany] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, sending, success, error
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setName('');
            setCompany('');
            setEmail('');
            setStatus('idle');
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    useEffect(() => {
        if (status === 'success') {
            const timer = setTimeout(() => {
                close();
            }, 2500); // Wait longer so they can read the sent message
            return () => clearTimeout(timer);
        }
    }, [status, close]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!name || !email) {
             setStatus('error');
             setTimeout(() => setStatus('idle'), 2000);
             return;
        }

        setStatus('sending');
        
        // Mock network delay
        setTimeout(() => {
            setStatus('success');
            console.log(`WAITLIST MOCK SENT to Developer: Name: ${name}, Company: ${company}, Email: ${email}`);
        }, 1200);
    };

    const handleBackdropClick = (e) => {
        if (status !== 'success' && status !== 'sending' && e.target === e.currentTarget) close();
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
                        pointerEvents: (status === 'success' || status === 'sending') ? 'none' : 'auto',
                    }}
                >
                    <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.85, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        style={{
                            width: '100%', maxWidth: 450,
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

                        {/* Clock icon */}
                        <motion.div
                            animate={status === 'success' ? { scale: [1, 1.15, 1], y: [0, -5, 0] } : status === 'error' ? { x: [0, -8, 8, -6, 6, 0] } : {}}
                            transition={status === 'success' ? { duration: 0.4, ease: "easeOut" } : { duration: 0.4 }}
                            style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}
                        >
                            <svg width="48" height="48" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'all 0.4s ease' }}>
                                <circle cx="12" cy="12" r="10" fill={status === 'success' ? '#22c55e' : '#CE4D35'} stroke="none" />
                                <polyline points="12 6 12 12 15.5 15.5" stroke="white" strokeWidth="2.5" fill="none" />
                            </svg>
                        </motion.div>

                        {/* Title */}
                        <h3 style={{
                            fontFamily: "'Outfit', sans-serif",
                            fontSize: 22, fontWeight: 700,
                            color: '#1a2b3c', marginBottom: 8,
                            letterSpacing: '-0.01em',
                        }}>
                            {status === 'success' ? 'You\'re on the list!' : 'Currently rendering...'}
                        </h3>
                        <p style={{
                            fontSize: 14, color: '#888',
                            marginBottom: 24, lineHeight: 1.5,
                        }}>
                            {status === 'success' 
                                ? 'I\'ll send you an automated alert as soon as this case study is fully published.'
                                : 'This page is under construction. Drop your email below and I\'ll prioritize it and notify you when it\'s finished.'}
                        </p>

                        {/* Form */}
                        <AnimatePresence>
                            {status !== 'success' && (
                                <motion.form 
                                    initial={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    style={{ overflow: 'hidden' }}
                                    onSubmit={handleSubmit}
                                >
                                    <div style={{ display: 'flex', gap: '12px', marginBottom: 12 }}>
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={name}
                                            onChange={e => { setName(e.target.value); if(status === 'error') setStatus('idle'); }}
                                            placeholder="Name"
                                            style={{
                                                width: '50%', padding: '14px 18px',
                                                fontSize: 16, fontFamily: "'Outfit', sans-serif",
                                                border: `2px solid ${status === 'error' && !name ? '#ef4444' : '#e5e7eb'}`,
                                                borderRadius: 12, outline: 'none',
                                                transition: 'border-color 0.2s, box-shadow 0.2s',
                                                boxSizing: 'border-box',
                                                backgroundColor: '#fafafa',
                                            }}
                                            onFocus={e => {
                                                if (status !== 'error') e.target.style.borderColor = '#1a2b3c';
                                                e.target.style.boxShadow = '0 0 0 3px rgba(26,43,60,0.1)';
                                            }}
                                            onBlur={e => {
                                                if (status !== 'error') e.target.style.borderColor = '#e5e7eb';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                        />
                                        <input
                                            type="text"
                                            value={company}
                                            onChange={e => { setCompany(e.target.value); if(status === 'error') setStatus('idle'); }}
                                            placeholder="Company"
                                            style={{
                                                width: '50%', padding: '14px 18px',
                                                fontSize: 16, fontFamily: "'Outfit', sans-serif",
                                                border: '2px solid #e5e7eb',
                                                borderRadius: 12, outline: 'none',
                                                transition: 'border-color 0.2s, box-shadow 0.2s',
                                                boxSizing: 'border-box',
                                                backgroundColor: '#fafafa',
                                            }}
                                            onFocus={e => {
                                                e.target.style.borderColor = '#1a2b3c';
                                                e.target.style.boxShadow = '0 0 0 3px rgba(26,43,60,0.1)';
                                            }}
                                            onBlur={e => {
                                                e.target.style.borderColor = '#e5e7eb';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                        />
                                    </div>
                                    <div style={{ position: 'relative', marginBottom: 16 }}>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={e => { setEmail(e.target.value); if(status === 'error') setStatus('idle'); }}
                                            placeholder="Email address"
                                            style={{
                                                width: '100%', padding: '14px 18px',
                                                fontSize: 16, fontFamily: "'Outfit', sans-serif",
                                                border: `2px solid ${status === 'error' && !email ? '#ef4444' : '#e5e7eb'}`,
                                                borderRadius: 12, outline: 'none',
                                                transition: 'border-color 0.2s, box-shadow 0.2s',
                                                boxSizing: 'border-box',
                                                backgroundColor: '#fafafa',
                                            }}
                                            onFocus={e => {
                                                if (status !== 'error') e.target.style.borderColor = '#1a2b3c';
                                                e.target.style.boxShadow = '0 0 0 3px rgba(26,43,60,0.1)';
                                            }}
                                            onBlur={e => {
                                                if (status !== 'error') e.target.style.borderColor = '#e5e7eb';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                        />
                                    </div>
                                    <AnimatePresence>
                                        {status === 'error' && (
                                            <motion.p
                                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                                animate={{ opacity: 1, height: 'auto', marginTop: -8 }}
                                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                                style={{ color: '#ef4444', fontSize: 13, textAlign: 'left', marginBottom: 16, marginLeft: 4 }}
                                            >
                                                Please fill out your name and email.
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                    <button
                                        type="submit"
                                        disabled={status === 'sending'}
                                        style={{
                                            width: '100%', padding: '16px',
                                            backgroundColor: '#1a2b3c', color: 'white',
                                            border: 'none', borderRadius: 12,
                                            fontSize: 16, fontWeight: 600,
                                            fontFamily: "'Outfit', sans-serif",
                                            cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                                            transition: 'background 0.2s, transform 0.1s',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            opacity: status === 'sending' ? 0.7 : 1
                                        }}
                                        onMouseEnter={e => { if (status !== 'sending') e.currentTarget.style.backgroundColor = '#0f1923'; }}
                                        onMouseLeave={e => { if (status !== 'sending') e.currentTarget.style.backgroundColor = '#1a2b3c'; }}
                                        onMouseDown={e => { if (status !== 'sending') e.currentTarget.style.transform = 'scale(0.98)'; }}
                                        onMouseUp={e => { if (status !== 'sending') e.currentTarget.style.transform = 'scale(1)'; }}
                                    >
                                        {status === 'sending' ? (
                                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ display: 'inline-block', width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }} />
                                        ) : (
                                            'Notify Me'
                                        )}
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
