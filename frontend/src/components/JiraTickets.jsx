import { useState } from "react";
import axios from "axios";

export default function JiraTickets({ bugs, appId }) {

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    const handleCreate = async () => {

        try {

            setLoading(true);

            const res = await axios.post(
                "https://featurepulse-cls3.onrender.com/create-jira",
                {
                    bugs,
                    appId
                }
            );

            setTickets(res.data.tickets || []);
            setDone(true);

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="jira-section">

            <h3>JIRA Integration</h3>

            <p className="jira-desc">
                Auto-create engineering tickets from detected bugs
            </p>

            {!done && (
                <button
                    className="jira-btn"
                    onClick={handleCreate}
                    disabled={loading}
                >
                    {loading
                        ? "Creating Tickets..."
                        : "Create JIRA Tickets"}
                </button>
            )}

            {tickets.length > 0 && (

                <div className="tickets-list">

                    {tickets.map((ticket, index) => (

                        <div
                            key={index}
                            className="ticket-card"
                        >

                            <span className="ticket-key">
                                {ticket.key}
                            </span>

                            <h4>
                                {ticket.summary}
                            </h4>

                            <p>
                                Status: Open
                            </p>

                            <a
                                href={ticket.url}
                                target="_blank"
                                rel="noreferrer"
                            >
                                View in JIRA →
                            </a>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}