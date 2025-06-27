import React, { useState, useEffect } from 'react'
import io from 'socket.io-client';
import { Calendar as BigCalendar, Views, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import socket from '../../Socket';
// always the connection should be at the top level because otherwise the socket would re connect everytime a reconnection happens
// react top level means static components

const allViews = Object.keys(Views).map(k => Views[k]);
const localizer = momentLocalizer(moment);

const event = ({ event }) => {
    return (
        <div>
            {event.venuename} <br /> <p>to meet with {event.guest}</p>{" "}
        </div>
    );
};



export default function Calendar() {

    const myId = useSelector((state) => state?.auth?.user?._id);
    const [lobbies, setLobbies] = useState();
    const [error, setError] = useState(null);
    const [events, setEvents] = useState();
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState("");
    const navigate = useNavigate()
    const BackendBaseUrl = "https://ye-dashians-backend.onrender.com"
    useEffect(() => {
        if (Array.isArray(lobbies)) {
            const mappedEvents = lobbies.map(lobby => {
                // Find guest: user1 or user2 whose _id !== myId
                let guestName = "";
                if (lobby.user1 && lobby.user1._id !== myId) {
                    guestName = lobby.user1.fullname;
                } else if (lobby.user2 && lobby.user2._id !== myId) {
                    guestName = lobby.user2.fullname;
                }

                const eventTime = lobby.time ? new Date(lobby.time) : new Date();
                return {
                    id: lobby._id,
                    venuename: lobby.venue || "Lobby Event",
                    guest: guestName,
                    allDay: false,
                    start: eventTime,
                    end: new Date(eventTime.getTime() + 60 * 60 * 1000), // 1 hour duration
                };
            });
            setEvents(mappedEvents);
        } else {
            setEvents([]);
        }
    }, [lobbies, myId]);

    //fetch lobbies function
    async function fetchLobbies() {
        try {

            let res = await fetch(`${BackendBaseUrl}/api/v1/user/myLobbies`, {

                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {

                throw new Error('Network response was not ok');

            }

            const resData = await res.json();

            if (resData.success) {
                setError(null);
                const userlobbies = resData.data;
                setLobbies(userlobbies);
            }
        } catch (error) {

            setError(error.message);
            console.error('Error fetching lobbies:', error.message);
        }
    }

    useEffect(() => {
        fetchLobbies();
    }, [])

    // listening to socket for any real time updates 
    useEffect(() => {
        socket.on('lobby_updated', async () => {
            await fetchLobbies();
        });
    }, []);


    function CustomDateHeader({ label, date }) {
        const [hovered, setHovered] = useState(false);

        return (
            <div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{ minHeight: 28, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
                {hovered ? (
                    <button
                        style={{
                            width: "100%",
                            background: "rgba(126,34,206,0.18)",
                            color: "#7e22ce",
                            border: "none",
                            cursor: "pointer",
                            fontSize: 12,
                            padding: "2px 0",
                            transition: "background 0.2s",
                        }}
                        onClick={() => {
                            setSelectedDate(date);
                            setShowModal(true);
                        }}
                    >
                        Add Event
                    </button>
                ) : (
                    <span style={{ color: "#a0a0a0", fontWeight: 600, fontSize: 16 }}>{label}</span>
                )}
            </div>
        );
    }

    // Popup/modal for time selection
    function TimePickerModal() {
        if (!showModal) return null;

        // Default to selected date at 12:00 if not set
        const defaultDate = selectedDate
            ? new Date(selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000))
            : new Date();
        const defaultTime = selectedTime ||
            `${String(defaultDate.getHours()).padStart(2, '0')}:${String(defaultDate.getMinutes()).padStart(2, '0')}`;

        return (
            <div style={{
                position: "fixed",
                top: 0, left: 0, right: 0, bottom: 0,
                background: "rgba(0,0,0,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000
            }}>
                <div style={{
                    background: "#fff",
                    borderRadius: 8,
                    padding: 24,
                    minWidth: 300,
                    boxShadow: "0 2px 16px rgba(0,0,0,0.15)"
                }}>
                    <h3>Select Event Time</h3>
                    <input
                        type="time"
                        value={defaultTime}
                        onChange={e => setSelectedTime(e.target.value)}
                        style={{ width: "100%", margin: "12px 0" }}
                    />
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                        <button onClick={() => setShowModal(false)}>Cancel</button>
                        <button
                            style={{ background: "#7e22ce", color: "#fff", border: "none", borderRadius: 4, padding: "6px 16px", cursor: "pointer" }}
                            onClick={() => {
                                setShowModal(false);
                                // Combine selectedDate and selectedTime into a full ISO string
                                let eventTime = "";
                                if (selectedDate && (selectedTime || defaultTime)) {
                                    const [hours, minutes] = (selectedTime || defaultTime).split(":");
                                    const dateWithTime = new Date(selectedDate);
                                    dateWithTime.setHours(Number(hours), Number(minutes), 0, 0);
                                    eventTime = dateWithTime.toISOString();
                                }
                                navigate("/createlobby", {
                                    state: {
                                        eventDetails: { time: eventTime }
                                    }
                                });
                                setSelectedTime("");
                            }}
                            disabled={!selectedTime && !defaultTime}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <TimePickerModal />
            <div
                style={{
                    minHeight: 580,
                    width: '100%',
                    background: '#fff',
                    boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
                    padding: 24,
                }}
            >
                <BigCalendar
                    localizer={localizer}
                    events={events}
                    views={allViews}
                    step={60}
                    showMultiDayTimes
                    defaultDate={new Date()}
                    style={{ minHeight: 580 }}
                    components={{
                        event: event,
                        month: { dateHeader: CustomDateHeader }
                    }}
                    onSelectEvent={event => {
                        navigate("/showlobbies" , {
                            state : { highlightLobbyId : event.id}
                        });
                    }}

                />
            </div>
        </div>
    )
}
