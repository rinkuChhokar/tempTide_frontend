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

    useEffect(() => {
        if (Cookies.get(emailTokenKey)) {
            dispatch(setIsEmailTokenPresent(true));
            dispatch(setAllMessagesRecordOfCurrentEmail(null));
            setInterval(() => {
                socket.emit("fetchMessages", Cookies.get(emailTokenKey))
            }, 3000);
        } else {
            dispatch(setAllMessagesRecordOfCurrentEmail(null));
            fetch(`${BACKEND_URL}/api/v1/fetch-new-email-id`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                }
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.status === "success") {
                        dispatch(setCurrentEmail(data.data.mailbox));
                        Cookies.set(emailTokenKey, data.data.token);
                        dispatch(setIsEmailTokenPresent(true));
                        setInterval(() => {
                            socket.emit("fetchMessages", Cookies.get(emailTokenKey))
                        }, 3000);
                    } else {
                        toast.error(data.message);
                    }
                })
                .catch((error) => {
                    toast.error(error);
                    console.error(error);
                });
        }
    }, []);


    const handleGenerateNewEmail = () => {
        dispatch(setIsEmailTokenPresent(false));
        dispatch(setAllMessagesRecordOfCurrentEmail(null));
        dispatch(setCurrentEmail(null));
        Cookies.remove(emailTokenKey);

        fetch(`${BACKEND_URL}/api/v1/fetch-new-email-id`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "success") {
                    dispatch(setCurrentEmail(data.data.mailbox));
                    Cookies.set(emailTokenKey, data.data.token);
                    dispatch(setIsEmailTokenPresent(true));
                    fetchMessagesListing();
                } else {
                    toast.error(data.message);
                }
            })
            .catch((error) => {
                toast.error(error);
                console.error(error);
            });


    }

    const copyEmail = () => {
        navigator.clipboard.writeText(currentEmail);
        copyBtnRef.current.textContent = "Copied!";
        setTimeout(() => copyBtnRef.current.textContent = "Copy", 2000);
    }


    const refreshEmail = () => {
        dispatch(setCurrentEmail(null));
        dispatch(setAllMessagesRecordOfCurrentEmail(null));
        fetch(`${BACKEND_URL}/api/v1/refresh-email-id`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token: Cookies.get(emailTokenKey)
            })
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "success") {
                    dispatch(setCurrentEmail(data.data.mailbox));
                    fetchMessagesListing();
                } else {
                    toast.error(data.message);
                }
            })
            .catch((error) => {
                toast.error(error);
                console.error(error);
            });
    }


    const fetchMessagesListing = () => {
        if (Cookies.get(emailTokenKey)) {
            fetch(`${BACKEND_URL}/api/v1/fetch-messages`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: Cookies.get(emailTokenKey)
                })
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.status === "success") {
                        dispatch(setAllMessagesRecordOfCurrentEmail(data.data));
                        dispatch(setCurrentEmail(data.data.mailbox));
                    } else {
                        toast.error(data.message);
                    }
                })
                .catch((error) => {
                    toast.error(error);
                    console.error(error);
                });
        }
    }


    useEffect(() => {
        if (id !== null || id !== undefined) {
            dispatch(setSingleMessageDetail(null));
            fetch(`${BACKEND_URL}/api/v1/fetch-message-detail`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: Cookies.get(emailTokenKey),
                    messageId: id
                })
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.status === "success") {
                        dispatch(setSingleMessageDetail(data.data));
                    } else {
                        toast.error(data.message);
                    }
                })
                .catch((error) => {
                    toast.error(error);
                    console.error(error);
                });
        }
    }, [id])


    socket.on("responseOfFetchMessage", (data) => {
        if (data.status === "success") {
            dispatch(setAllMessagesRecordOfCurrentEmail(data.data));
            dispatch(setCurrentEmail(data.data.mailbox));
        } else {
            toast.error(data.message);
        }
    })

    return (
        <div className="bg-[var(--background)] text-[var(--text-color)] font-sans">
            <div className="flex flex-col items-center justify-center min-h-screen px-6 py-10">
                {/* <!-- Hero Section --> */}
                <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-[var(--primary)] text-center">TempTide</h1>
                <p className="text-lg mb-6 text-gray-600 text-center">Get a temporary email instantly!</p>

                {/* <!-- Email Display --> */}
                <div className="flex flex-col sm:flex-row items-center bg-[var(--card-bg)] rounded-lg p-4 mb-4 w-full max-w-lg shadow-lg border border-gray-300">
                    <input type="text" id="tempEmail" className="bg-transparent text-gray-800 w-full outline-none text-lg font-medium text-center sm:text-left" value={currentEmail == null ? `loading...` : currentEmail} readOnly />
                    <button ref={copyBtnRef} onClick={copyEmail} id="copyBtn" className="mt-2 sm:mt-0 sm:ml-3 bg-[var(--secondary)] hover:bg-teal-500 px-4 py-2 rounded text-sm font-semibold text-white transition-all">Copy</button>
                </div>

                {/* <!-- Buttons --> */}
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full max-w-lg">
                    <button onClick={refreshEmail} id="refreshBtn" className="bg-[var(--primary)] hover:bg-indigo-600 px-5 py-3 rounded-lg font-semibold text-white shadow-md w-full sm:w-auto transition-all">Refresh</button>
                    <button onClick={handleGenerateNewEmail} id="generateBtn" className="bg-[var(--secondary)] hover:bg-teal-500 px-5 py-3 rounded-lg font-semibold text-white shadow-md w-full sm:w-auto transition-all">Generate New</button>
                </div>

                {/* <!-- Messages Section --> */}
                {id == null || id == undefined ? (
                    <div className="mt-6 w-full max-w-lg">
                        <h2 className="text-2xl font-semibold text-[var(--primary)] mb-3 text-center sm:text-left">Inbox</h2>
                        <div id="emailList" className="bg-[var(--card-bg)] p-4 rounded-lg min-h-[200px] flex items-center justify-center shadow-md border border-gray-300 transition-all">
                            {allMessagesRecordOfCurrentEmail !== null && allMessagesRecordOfCurrentEmail.messages.length > 0 ? (
                                <table className="w-full table-auto">
                                    <thead>
                                        <tr className="bg-gray-200">
                                            <th className="p-2 text-left">From</th>
                                            <th className="p-2 text-left">Received</th>
                                            <th className="p-2 text-left">Subject</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allMessagesRecordOfCurrentEmail.messages.map((message) => {
                                            // Convert timestamp from seconds to milliseconds
                                            const receivedDate = new Date(message.receivedAt * 1000);

                                            return (
                                                <tr key={message._id} className="border-b border-gray-300 cursor-pointer" onClick={() => { navigate(`/view/${message._id}`) }}>
                                                    <td className="p-2">{message.from}</td>
                                                    <td className="p-2">{receivedDate.toLocaleString()}</td>
                                                    <td className="p-2">{message.subject}</td>
                                                </tr>

                                            );
                                        })}
                                    </tbody>
                                </table>
                            ) : allMessagesRecordOfCurrentEmail == null ? (
                                <p className="text-gray-600">Fetching messages...</p>
                            ) : <></>}

                            {allMessagesRecordOfCurrentEmail !== null && allMessagesRecordOfCurrentEmail.messages.length === 0 ? (
                                <p className="text-gray-600">No emails received yet.</p>
                            ) : null}
                        </div>
                    </div>
                ) : (
                    <>
                        {singleMessageDetail !== null ? (
                            <div className="mt-10 max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
                                {/* <!-- Back Button Section --> */}
                                <div className="flex items-center mb-6">
                                    <button onClick={() => { navigate("/") }} className="flex items-center text-gray-600 hover:text-gray-800">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M19 12H5"></path>
                                            <path d="M12 19l-7-7 7-7"></path>
                                        </svg>
                                        <span className="text-sm">Back</span>
                                    </button>
                                </div>
                                {/* <!-- Header Section --> */}
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h2 className="text-2xl font-semibold text-gray-800">Message Detail</h2>
                                        <p className="text-sm text-gray-500">Mailbox: <span className="font-medium text-gray-700">{singleMessageDetail !== null ? singleMessageDetail.mailbox : ""}</span></p>
                                    </div>
                                    <span className="text-sm text-gray-400">Received on: <span className="font-medium text-gray-700">{moment.unix(singleMessageDetail.receivedAt).format('MMM D, YYYY, h:mm A')}</span></span>
                                </div>

                                {/* <!-- Sender & Subject Section --> */}
                                <div className="mb-6">
                                    <div className="text-xl font-semibold text-gray-800 mb-2">
                                        From: <span className="font-medium text-gray-600">{singleMessageDetail.from}</span>
                                    </div>
                                    <div className="text-lg font-semibold text-gray-800 mb-2">
                                        Subject: <span className="font-medium text-gray-700">{singleMessageDetail.subject}</span>
                                    </div>
                                </div>


                                {/* <!-- Full Email Body --> */}
                                <div className="mb-6">
                                    <div className="text-md text-gray-800 font-medium mb-2">Body:</div>
                                    <div className="prose prose-sm text-gray-600">
                                        {/* <!-- Render bodyHtml dynamically if you want --> */}
                                        <div
                                            className="email-body"
                                            dangerouslySetInnerHTML={{ __html: singleMessageDetail.bodyHtml }}
                                        />
                                    </div>
                                </div>

                                {/* <!-- Attachments Section --> */}
                                <div className="mb-6">
                                    <div className="text-md text-gray-800 font-medium mb-2">Attachments:</div>
                                    <p className="text-sm text-gray-600">
                                        No attachments available.
                                    </p>
                                </div>

                                {/* <!-- Footer Section --> */}
                                <div className="flex justify-between items-center">
                                    <div className="text-sm text-gray-500">
                                        Email ID: <span className="font-medium text-gray-700">{singleMessageDetail._id}</span>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Created At: <span className="font-medium text-gray-700">{moment(singleMessageDetail.createdAt).format('MMM D, YYYY, h:mm A')}</span>
                                    </div>
                                </div>
                            </div>
                        ) : <><div className="mt-10 loader"></div>
                        </>}
                    </>

                )}






            </div>
        </div>
    )
}

export default Homepage