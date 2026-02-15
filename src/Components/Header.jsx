import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
    const { pathname } = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/team', label: 'Team' },
        { path: '/contact-us', label: 'Contact' }
    ];

    return (
        <header className='fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/70 border-b border-white/20 shadow-lg shadow-slate-200/50'>
            <nav className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex items-center justify-between h-16'>
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg blur-lg opacity-30 group-hover:opacity-60 transition-all duration-300 animate-glow"></div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 140 88" fill="none" className="relative">
                                <path d="M55 55.8583L95.5 15.3583C99.1 11.7583 104.1 9.55835 109.6 9.55835C120.6 9.55835 129.6 18.4583 129.6 29.5583C129.6 40.5583 120.7 49.5583 109.6 49.5583M83 7.95835C72 7.95835 63 16.8583 63 27.9583V27.5583C63 38.5583 71.9 47.8583 83 47.8583H83.6C89.1 47.8583 93.5 45.6583 97.1 41.9583L137.6 1.55835" stroke="url(#gradient)" strokeWidth="4" strokeMiterlimit="10" />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#14b8a6" />
                                        <stop offset="100%" stopColor="#3b82f6" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <span className="text-xl font-heading font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                            TempTide
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className='hidden md:flex items-center space-x-1'>
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${pathname === link.path
                                    ? 'text-primary-600'
                                    : 'text-slate-600 hover:text-primary-600'
                                    }`}
                            >
                                {link.label}
                                {pathname === link.path && (
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"></span>
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMobileMenu}
                        className='md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors'
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <svg className="w-6 h-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className='md:hidden py-4 space-y-2 animate-fade-in-up'>
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block px-4 py-2 rounded-lg font-medium transition-all ${pathname === link.path
                                    ? 'bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-600'
                                    : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;