import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import './Main.css';
import api from '../services/api';
import logo from '../assets/logo.svg';
import like from '../assets/like.svg';
import dislike from '../assets/dislike.svg';

export default function Main({ match }) {
    const [users, setUsers] = useState([]);
    // Every time the useEffect dependencies (inputs) are updated, run the function.
    useEffect(() => {
        // Same notation as define the function and call it on the next line.
        (async function loadUsers() {
            const response = await api.get('/developers', {
                headers: {
                    authorization: match.params.id,
                }
            });
            setUsers(response.data);
        })();
    }, [match.params.id]);

    async function handleLike(id) {
        await api.post(`/developers/${id}/like`, null, {
            headers: {
                authorization: match.params.id,
            }
        });
        setUsers(users.filter(user => user._id !== id));
    }

    async function handleDislike(id) {
        await api.post(`/developers/${id}/dislike`, null, {
            headers: {
                authorization: match.params.id,
            }
        });
        setUsers(users.filter(user => user._id !== id));
    }

    return (
        <div className="main-container">
            <Link to="/">
                <img src={logo} alt="Tindev"/>
            </Link>
            { users.length > 0 ? (
                <ul>
                    {users.map(user => (
                        <li key={user._id}>
                            <img src={user.avatar} alt={user.name} />
                            <footer>
                                <strong>{user.name}</strong>
                                <p>{user.bio}</p>
                            </footer>
                            <div className="buttons">
                                <button type="button" onClick={() => handleDislike(user._id)}>
                                    <img src={dislike} alt="Dislike"/>
                                </button>
                                <button type="button" onClick={() => handleLike(user._id)}>
                                    <img src={like} alt="Like"/>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="empty">Sem mais usuários</div>
            )}
        </div>
    );
}