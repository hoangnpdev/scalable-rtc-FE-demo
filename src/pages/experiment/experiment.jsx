import './experiment.css'
import {useRef, useEffect, useState} from "react";
import {Client} from '@stomp/stompjs'

function Experiment() {
    const [msg, setMsg] = useState("");
    let stompRef = useRef(null);
    useEffect(() => {
        console.log(localStorage.getItem('session'));
        stompRef.current = new Client({
            brokerURL: 'ws://localhost:8080/web-socket',
            connectHeaders: {
                'Authorization': `${localStorage.getItem('session')}`,
            },
            onConnect: () => {
                stompRef.current.subscribe('/topic/global-channel/echo', message => {
                    window.alert(JSON.stringify(message.body));
                });
            },
        });
        stompRef.current.activate();
        return () => {
            stompRef.current.deactivate().then( () => {
                console.log('ws disconnected')
            });
        }
    }, [])

    const send = () => {
        console.log(msg)
        stompRef.current.publish({destination: "/app/global-channel/echo", body: msg})
    }

    return (
        <>
            <input type={'text'} value={msg} onChange={(e) => setMsg(e.target.value)}/>
            <button onClick={send}>Send</button>
        </>
    )
}

export default Experiment;