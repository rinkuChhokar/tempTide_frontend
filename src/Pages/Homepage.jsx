import React, { useEffect, useRef } from 'react'
import Cookies from "js-cookie";
import { useDispatch, useSelector } from 'react-redux';
import { setIsEmailTokenPresent } from '../../features/homepage/isEmailTokenPresentSlice';
import { BACKEND_URL } from '../api';
import { toast } from 'react-toastify';
import { setAllMessagesRecordOfCurrentEmail } from '../../features/homepage/allMessagesRecordOfCurrentEmailSlice';
import { setCurrentEmail } from '../../features/homepage/currentEmailSlice';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { setSingleMessageDetail } from '../../features/homepage/singleMessageDetailSlice';
import moment from "moment";
import { io } from 'socket.io-client';
import { safeApiCall, handleApiError, showErrorToast } from '../utils/errorHandler';

const SOCKET_URL = BACKEND_URL;
const socket = io(SOCKET_URL);

const emailTokenKey = "U2FsdGVkX1+J3BjRr/COErryFT0dXhtVURZKlXXcKuw=";

const Homepage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const currentEmail = useSelector((store) => store.currentEmail.value);
    const copyBtnRef = useRef(null);
    const allMessagesRecordOfCurrentEmail = useSelector((store) => store.allMessagesRecordOfCurrentEmail.value);
    const isEmailTokenPresent = useSelector((store) => store.isEmailTokenPresent.value);
    const singleMessageDetail = useSelector((store) => store.singleMessageDetail.value);

    // Store interval ID to prevent multiple intervals
    const socketIntervalRef = useRef(null);
    const socketListenerRef = useRef(false);

    // Setup socket interval with proper cleanup
    const setupSocketInterval = () => {
        // Clear any existing interval
        if (socketIntervalRef.current) {
            clearInterval(socketIntervalRef.current);
        }

        // Create new interval
        socketIntervalRef.current = setInterval(() => {
            const token = Cookies.get(emailTokenKey);
            if (token) {
                socket.emit("fetchMessages", token);
            }
        }, 3000);
    };

    useEffect(() => {
        const initializeEmail = async () => {
            if (Cookies.get(emailTokenKey)) {
                dispatch(setIsEmailTokenPresent(true));
                dispatch(setAllMessagesRecordOfCurrentEmail(null));
                setupSocketInterval();
            } else {
                dispatch(setAllMessagesRecordOfCurrentEmail(null));

                const result = await safeApiCall(
                    `${BACKEND_URL}/api/v1/fetch-new-email-id`,
                    {
                        method: 'GET',
                        headers: { "Content-Type": "application/json" }
                    },
                    'Fetch New Email'
                );

                if (result.success) {
                    dispatch(setCurrentEmail(result.data.mailbox));
                    Cookies.set(emailTokenKey, result.data.token);
                    dispatch(setIsEmailTokenPresent(true));
                    setupSocketInterval();
                }
            }
        };

        initializeEmail();

        // Cleanup interval on unmount
        return () => {
            if (socketIntervalRef.current) {
                clearInterval(socketIntervalRef.current);
                socketIntervalRef.current = null;
            }
        };
    }, []);


    const handleGenerateNewEmail = async () => {
        dispatch(setIsEmailTokenPresent(false));
        dispatch(setAllMessagesRecordOfCurrentEmail(null));
        dispatch(setCurrentEmail(null));
        Cookies.remove(emailTokenKey);

        // Clear existing interval
        if (socketIntervalRef.current) {
            clearInterval(socketIntervalRef.current);
        }

        const result = await safeApiCall(
            `${BACKEND_URL}/api/v1/fetch-new-email-id`,
            {
                method: 'GET',
                headers: { "Content-Type": "application/json" }
            },
            'Generate New Email'
        );

        if (result.success) {
            dispatch(setCurrentEmail(result.data.mailbox));
            Cookies.set(emailTokenKey, result.data.token);
            dispatch(setIsEmailTokenPresent(true));
            setupSocketInterval();
            fetchMessagesListing();
        }
    }

    const copyEmail = () => {
        navigator.clipboard.writeText(currentEmail);
        copyBtnRef.current.textContent = "Copied!";
        setTimeout(() => copyBtnRef.current.textContent = "Copy", 2000);
    }


    const refreshEmail = async () => {
        dispatch(setCurrentEmail(null));
        dispatch(setAllMessagesRecordOfCurrentEmail(null));

        const result = await safeApiCall(
            `${BACKEND_URL}/api/v1/refresh-email-id`,
            {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: Cookies.get(emailTokenKey) })
            },
            'Refresh Email'
        );

        if (result.success) {
            dispatch(setCurrentEmail(result.data.mailbox));
            fetchMessagesListing();
        }
    }


    const fetchMessagesListing = async () => {
        if (Cookies.get(emailTokenKey)) {
            const result = await safeApiCall(
                `${BACKEND_URL}/api/v1/fetch-messages`,
                {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token: Cookies.get(emailTokenKey) })
                },
                'Fetch Messages',
                1 // Only 1 retry for message fetching
            );

            if (result.success) {
                dispatch(setAllMessagesRecordOfCurrentEmail(result.data));
                dispatch(setCurrentEmail(result.data.mailbox));
            }
        }
    }


    useEffect(() => {
        const fetchMessageDetail = async () => {
            if (id !== null && id !== undefined) {
                dispatch(setSingleMessageDetail(null));

                const result = await safeApiCall(
                    `${BACKEND_URL}/api/v1/fetch-message-detail`,
                    {
                        method: 'POST',
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            token: Cookies.get(emailTokenKey),
                            messageId: id
                        })
                    },
                    'Fetch Message Detail'
                );

                if (result.success) {
                    dispatch(setSingleMessageDetail(result.data));
                }
            }
        };

        fetchMessageDetail();
    }, [id])


    // Setup socket listener only once
    useEffect(() => {
        if (!socketListenerRef.current) {
            socket.on("responseOfFetchMessage", (data) => {
                if (data.status === "success") {
                    dispatch(setAllMessagesRecordOfCurrentEmail(data.data));
                    dispatch(setCurrentEmail(data.data.mailbox));
                } else {
                    showErrorToast(data.message, 'Socket Message');
                }
            });
            socketListenerRef.current = true;
        }

        // Cleanup socket listener on unmount
        return () => {
            socket.off("responseOfFetchMessage");
            socketListenerRef.current = false;
        };
    }, []);

    return (
        <div className="min-h-screen gradient-mesh relative overflow-hidden">
            {/* Animated Background Orbs */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary-300/10 rounded-full blur-3xl animate-pulse-slow"></div>
            {id == null || id == undefined ? (
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                    {/* Hero Section */}
                    <div className="text-center mb-12 animate-fade-in-up">
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold mb-6">
                            <span className="text-gradient">
                                Temporary Email
                            </span>
                        </h1>
                        <p className="text-xl text-slate-700 max-w-2xl mx-auto leading-relaxed font-medium">
                            Get a disposable email address instantly. Protect your privacy and avoid spam with our secure temporary inbox.
                        </p>
                        <div className="flex items-center justify-center gap-2 mt-4">
                            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                            <p className="text-sm text-slate-500">Secure • Private • Instant</p>
                            <div className="w-2 h-2 bg-secondary-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                        </div>
                    </div>

                    {/* Email Display Card */}
                    <div className="max-w-3xl mx-auto mb-12 animate-scale-in">
                        <div className="glass-card rounded-3xl p-8 hover:shadow-glow-md transition-all duration-500 relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10">
                                <label className="block text-sm font-medium text-slate-600 mb-3">Your Temporary Email</label>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <input
                                        type="text"
                                        value={currentEmail == null ? `Generating...` : currentEmail}
                                        readOnly
                                        className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                    <button
                                        ref={copyBtnRef}
                                        onClick={copyEmail}
                                        className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-semibold rounded-lg shadow-glow-sm hover:shadow-glow-md transition-all duration-300 flex items-center justify-center space-x-2 relative overflow-hidden group/btn"
                                    >
                                        <div className="absolute inset-0 shimmer opacity-0 group-hover/btn:opacity-100"></div>
                                        <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        <span className="relative z-10">Copy</span>
                                    </button>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                                    <button
                                        onClick={refreshEmail}
                                        className="flex-1 px-6 py-3 bg-white/50 backdrop-blur-sm border-2 border-primary-500 text-primary-600 font-semibold rounded-lg hover:bg-primary-50 hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 group/refresh"
                                    >
                                        <svg className="w-5 h-5 group-hover/refresh:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        <span>Refresh</span>
                                    </button>
                                    <button
                                        onClick={handleGenerateNewEmail}
                                        className="flex-1 px-6 py-3 bg-white/50 backdrop-blur-sm border-2 border-secondary-500 text-secondary-600 font-semibold rounded-lg hover:bg-secondary-50 hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        <span>Generate New</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Inbox Section */}
                    <div className="max-w-5xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-3xl font-heading font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Inbox</h2>
                            <span className="px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full text-sm font-semibold shadow-glow-sm">
                                {allMessagesRecordOfCurrentEmail?.messages?.length || 0} messages
                            </span>
                        </div>

                        <div className="glass-card rounded-2xl overflow-hidden hover:shadow-glow-md transition-all duration-500">
                            {allMessagesRecordOfCurrentEmail !== null && allMessagesRecordOfCurrentEmail.messages.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">From</th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Subject</th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Received</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {allMessagesRecordOfCurrentEmail.messages.map((message) => {
                                                const receivedDate = new Date(message.receivedAt * 1000);
                                                return (
                                                    <tr
                                                        key={message._id}
                                                        onClick={() => { navigate(`/view/${message._id}`) }}
                                                        className="hover:bg-primary-50/50 cursor-pointer transition-colors duration-200 group"
                                                    >
                                                        <td className="px-6 py-4 text-sm text-slate-700 font-medium group-hover:text-primary-600">{message.from}</td>
                                                        <td className="px-6 py-4 text-sm text-slate-600">{message.subject}</td>
                                                        <td className="px-6 py-4 text-sm text-slate-500">{receivedDate.toLocaleString()}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : allMessagesRecordOfCurrentEmail == null ? (
                                <div className="flex flex-col items-center justify-center py-16">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
                                    <p className="text-slate-600">Fetching messages...</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <svg className="w-16 h-16 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-slate-600 text-lg">No emails received yet</p>
                                    <p className="text-slate-400 text-sm mt-2">Your messages will appear here automatically</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {singleMessageDetail !== null ? (
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                                {/* Header */}
                                <div className="bg-gradient-to-r from-primary-500 to-secondary-500 px-8 py-6">
                                    <button
                                        onClick={() => { navigate("/") }}
                                        className="flex items-center text-white/90 hover:text-white mb-4 transition-colors"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        <span className="text-sm font-medium">Back to Inbox</span>
                                    </button>
                                    <h2 className="text-2xl font-heading font-bold text-white">Message Details</h2>
                                </div>

                                {/* Content */}
                                <div className="p-8 space-y-6">
                                    {/* Meta Info */}
                                    <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
                                        <div>
                                            <p className="text-sm text-slate-500">Mailbox</p>
                                            <p className="font-mono text-sm text-slate-700">{singleMessageDetail.mailbox}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-slate-500">Received</p>
                                            <p className="text-sm text-slate-700">{moment.unix(singleMessageDetail.receivedAt).format('MMM D, YYYY, h:mm A')}</p>
                                        </div>
                                    </div>

                                    {/* From & Subject */}
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-500 mb-1">From</p>
                                            <p className="text-lg text-slate-800">{singleMessageDetail.from}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-500 mb-1">Subject</p>
                                            <p className="text-lg font-semibold text-slate-800">{singleMessageDetail.subject}</p>
                                        </div>
                                    </div>

                                    {/* Body */}
                                    <div>
                                        <p className="text-sm font-semibold text-slate-500 mb-3">Message</p>
                                        <div
                                            className="prose prose-slate max-w-none bg-slate-50 rounded-lg p-6 border border-slate-200"
                                            dangerouslySetInnerHTML={{ __html: singleMessageDetail.bodyHtml }}
                                        />
                                    </div>

                                    {/* Footer */}
                                    <div className="pt-6 border-t border-slate-200 flex flex-wrap justify-between gap-4 text-xs text-slate-500">
                                        <div>
                                            <span className="font-medium">Email ID:</span> {singleMessageDetail._id}
                                        </div>
                                        <div>
                                            <span className="font-medium">Created:</span> {moment(singleMessageDetail.createdAt).format('MMM D, YYYY, h:mm A')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center min-h-screen">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500"></div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default Homepage