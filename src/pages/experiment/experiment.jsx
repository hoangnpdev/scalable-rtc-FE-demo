import './experiment.css'
import {useRef, useEffect, useState} from "react";
import {Client} from '@stomp/stompjs'

function Experiment() {
    const [msg, setMsg] = useState("");
    let stompRef = useRef(null);
    useEffect(() => {
        stompRef.current = new Client({
            brokerURL: 'ws://localhost:8080/web-socket',
            onConnect: () => {
                stompRef.current.subscribe('/topic/echo', message => {
                    window.alert(message.body)
                });
            },
        });
        stompRef.current.activate();
    }, [])

    const send = () => {
        console.log(msg)
        stompRef.current.publish({destination: "/topic/echo", body: msg})
    }

    return (
        <>
            <input type={'text'} value={msg} onChange={(e) => setMsg(e.target.value)}/>
            <button onClick={send}>Send</button>
        </>
    )
}

export default Experiment;