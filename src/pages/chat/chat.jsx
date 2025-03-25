import styles from './chat.module.css';
import {useEffect, useReducer, useRef, useState} from "react";
import {Client} from "@stomp/stompjs";


const initChatBox = {
    activeChannel: '',
    msgList: [],
    channelList: [],
    searchResultList: [],
    postingMsg: '',
    searchQuery: ''
}

const chatReducer = (state, action) => {
    switch (action.type) {
        case "SWITCH_CHANNEL":
            return {...state, activeChannel: action.activeChannel, msgList: [...action.msgList], searchResultList: []};
        case "UPDATE_NEW_MESSAGE":
            return {...state, msgList: [...state.msgList, action.newMsg]}
        case "LOAD_CHANNELS":
            return {...state, channelList: action.channelList};
        case "UPDATE_SEARCH_RESULT":
            return {...state, searchResultList: action.searchResultList,};
        case 'POST_NEW_MESSAGE':
            return {...state, postingMsg: ''};
        case 'UPDATE_POSTING_MESSAGE':
            return {...state, postingMsg: action.postingMsg};
        case 'UPDATE_SEARCH_QUERY':
            return {...state, searchQuery: action.searchQuery};

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
        if (event.key === 'Enter' && chatBox.postingMsg !== "") {
            console.log("sending message...")
            wsRef.current.publish({
                destination: `/app/global-channel/${chatBox.activeChannel}`,
                body: chatBox.postingMsg
            });
            dispatch({type: 'POST_NEW_MESSAGE'})
        }
    }

    const search = (event) => {
        if (event.key === 'Enter' && chatBox.searchQuery !== "") {
            fetch(`http://localhost:8080/rtc/global-message/${chatBox.activeChannel}/search`, {
                method: 'POST',
                headers: {
                    'Authorization': `${localStorage.getItem('session')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: chatBox.searchQuery
                }),
            }).then(res => res.json())
                .then(result => {
                    dispatch({
                        type: "UPDATE_SEARCH_RESULT",
                        searchResultList: result
                    })

                })
        }
    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles['channel-box']}>
                    <div className={'menu'}>
                        <ul className={'menu-list'}>
                            {chatBox.channelList.map(
                                (channel) =>
                                    (<li
                                        key={channel.channelId}
                                        onClick={() => switchChannel(channel.channelName)}>
                                        <a className={`${channel.channelName === chatBox.activeChannel ? 'is-active' : ''}`}>
                                            {channel.channelName}
                                        </a>
                                    </li>)
                            )}
                        </ul>
                    </div>
                </div>
                <div className={styles['message-box']}>

                    <div className={styles['message-content']}>
                        {
                            chatBox.msgList.map(msg => <div className={'block'} key={Math.random()}><span
                                className={'px-2 bg-info'}><strong>{msg.accountName}:</strong> {msg.message}</span>
                            </div>)
                        }
                    </div>
                    <div className={styles['typing-box']}>
                        <input className={'input'}
                               value={chatBox.postingMsg}
                               onChange={(e) => dispatch({type: 'UPDATE_POSTING_MESSAGE', postingMsg: e.target.value})}
                               onKeyUp={(event) => postMessage(event)}
                        />
                    </div>
                </div>
                <div className={styles['search-box']}>
                    <input className={'input'} placeholder={'search...'}
                           value={chatBox.searchQuery}
                           onChange={(e) => dispatch({type: 'UPDATE_SEARCH_QUERY', searchQuery: e.target.value})}
                           onKeyUp={(event) => search(event)}
                    />
                    <div className={'menu'}>
                        <ul className={'menu-list'}>
                            {chatBox.searchResultList.map(e => (
                                <li><a>{e.message}</a></li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Chat;