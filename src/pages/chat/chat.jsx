import styles from './chat.module.css';
import {useEffect, useReducer, useRef, useState} from "react";
import {Client} from "@stomp/stompjs";


const initChatBox = {
    activeChannel: '',
    msgList: [],
    channelList: []
}

const chatReducer = (state, action) => {
    switch (action.type) {
        case "SWITCH_CHANNEL":
            return {...state, activeChannel: action.activeChannel, msgList: [...action.msgList]};
        case "UPDATE_NEW_MESSAGE":
            return {...state, msgList: [...state.msgList, action.newMsg]}
        case "LOAD_CHANNELS":
            return {...state, channelList: action.channelList};
        default:
            return state;
    }
}

function Chat() {

    /**
     * @type {RefObject<Client>}
     */
    let wsRef = useRef(null);
    /**
     * @type {RefObject<import('@stomp/stompjs').StompSubscription>}
     */
    let stompSubscriptionRef = useRef(null);

    const [postingMsg, setPostingMsg] = useState("");
    const [chatBox, dispatch] = useReducer(chatReducer, initChatBox);

    useEffect(() => {
        console.log(`component effect`)
        initWebsocket();
        return closeWebsocket;
    }, []);

    const initWebsocket = () => {
        wsRef.current = new Client({
            brokerURL: 'ws://localhost:8080/web-socket',
            connectHeaders: {
                'Authorization': `${localStorage.getItem('session')}`,
            },
            onConnect: () => {
                console.log("ws connected");
                loadChannelList()
            },
        });
        wsRef.current.activate();
    }

    const closeWebsocket = () => {
        wsRef.current.deactivate().then(() => {
            console.log('ws disconnected');
        })
    }

    const loadChannelList = () => {
        fetch('http://localhost:8080/rtc/global-channel',
            {
                method: 'GET',
                headers: {
                    'Authorization': `${localStorage.getItem('session')}`
                }
            }).then(res => res.json())
            .then(channels => {
                dispatch({
                    type: "LOAD_CHANNELS", channelList: channels
                });
            })
    }

    const switchChannel = (channel) => {
        if (stompSubscriptionRef.current !== null) {
            stompSubscriptionRef.current.unsubscribe();
            console.log(`unsubscribe channel ${chatBox.activeChannel}`)
        }
        console.log(`http://localhost:8080/rtc/global-message/${channel}`);
        fetch(`http://localhost:8080/rtc/global-message/${channel}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `${localStorage.getItem('session')}`
                }
            }).then(res => res.json())
            .then(msgs => {
                dispatch({
                    type: "SWITCH_CHANNEL",
                    activeChannel: channel,
                    msgList: msgs
                });
                stompSubscriptionRef.current = wsRef.current.subscribe(`/topic/global-channel/${channel}`, message => {
                    dispatch({
                        type: "UPDATE_NEW_MESSAGE",
                        newMsg: JSON.parse(message.body),
                    })
                })

            });
    }

    const postMessage = (event) => {
        if (event.key === 'Enter' && postingMsg !== "") {
            console.log("sending message...")
            wsRef.current.publish({
                destination: `/app/global-channel/${chatBox.activeChannel}`,
                body: postingMsg
            });
            setPostingMsg("");

        }
    }

    return (
        <>

            <div className={styles.container}>
                <div className={styles['channel-list']}>
                    <ul className={'list-group'}>
                        {chatBox.channelList.map(
                            (channel) =>
                                (<li
                                    key={channel.channelId}
                                    onClick={() => switchChannel(channel.channelName)}
                                    className={`list-group-item mx-2 ${channel.channelName === chatBox.activeChannel ? 'active' : ''}`}>
                                    {channel.channelName}
                                </li>)
                        )}
                    </ul>
                </div>
                <div className={styles['channel-name']}>
                    {
                        chatBox.msgList.map(msg => <div key={Math.random()} className={'mx-2 my-2 '}><span
                            className={'px-2 bg-info'}>{msg.message}</span>
                        </div>)
                    }
                    <input value={postingMsg}
                           onChange={(e) => setPostingMsg(e.target.value)}
                           onKeyUp={(event) => postMessage(event)}
                    />
                </div>
            </div>
        </>
    )
}

export default Chat;