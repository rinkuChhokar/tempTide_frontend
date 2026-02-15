import React from 'react'

const ContactUs = () => {
    return (
        <div className="min-h-screen gradient-mesh relative overflow-hidden py-16 px-4">
            {/* Animated Background Orbs */}
            <div className="absolute top-32 right-10 w-80 h-80 bg-secondary-400/20 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-32 left-10 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-16 animate-fade-in-up">
                    <h1 className="text-5xl font-heading font-bold mb-4">
                        <span className="text-gradient">
                            Get In Touch
                        </span>
                    </h1>
                    <p className="text-xl text-slate-700 max-w-2xl mx-auto font-medium">
                        Have questions or feedback? We'd love to hear from you.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-start animate-scale-in" style={{ animationDelay: '0.2s' }}>
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="glass-card rounded-3xl p-8 hover:shadow-glow-md transition-all duration-500">
                            <h2 className="text-2xl font-heading font-bold text-slate-800 mb-6">Contact Information</h2>

                            <div className="space-y-6">
                                {/* Email */}
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-800">Email</h3>
                                        <a href="mailto:info@temptide.com" className="text-primary-600 hover:text-primary-700 transition-colors">
                                            info@temptide.com
                                        </a>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-800">Location</h3>
                                        <p className="text-slate-600">Worldwide</p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="mt-8 pt-8 border-t border-slate-200">
                                <h3 className="font-semibold text-slate-800 mb-4">Follow Us</h3>
                                <div className="flex space-x-4">
                                    <a href="#" className="w-10 h-10 rounded-full bg-slate-100 hover:bg-gradient-to-r hover:from-primary-500 hover:to-secondary-500 flex items-center justify-center transition-all duration-300 group">
                                        <svg className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                        </svg>
                                    </a>
                                    <a href="#" className="w-10 h-10 rounded-full bg-slate-100 hover:bg-gradient-to-r hover:from-primary-500 hover:to-secondary-500 flex items-center justify-center transition-all duration-300 group">
                                        <svg className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                        </svg>
                                    </a>
                                    <a href="#" className="w-10 h-10 rounded-full bg-slate-100 hover:bg-gradient-to-r hover:from-primary-500 hover:to-secondary-500 flex items-center justify-center transition-all duration-300 group">
                                        <svg className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="glass-card rounded-3xl p-8 hover:shadow-glow-md transition-all duration-500">
                        <h2 className="text-2xl font-heading font-bold text-slate-800 mb-6">Send us a Message</h2>
                        <form className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                                <input
                                    type="text"
                                    placeholder="Your name"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                                <input
                                    type="text"
                                    placeholder="How can we help?"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                                <textarea
                                    rows="5"
                                    placeholder="Your message..."
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-semibold rounded-lg shadow-glow-sm hover:shadow-glow-md transition-all duration-300 relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100"></div>
                                <span className="relative z-10">Send Message</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContactUs