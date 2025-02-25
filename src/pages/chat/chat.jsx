import styles from './chat.module.css';
import {useState} from "react";

function Chat() {
    const [activeChannel, setActiveChannel] = useState('#global');
    const [channelList, setChannelList] = useState(['#global', '#vn', '#asia'])
    const [msgList, setMsgList] = useState(['abc', 'def', 'xyz']);
    return (
        <>

            <div className={styles.container}>
                <div className={styles['channel-list']}>
                    <ul className={'list-group'}>
                        {channelList.map(
                            (channel) => (<li className={`list-group-item mx-2 ${channel === activeChannel? 'active' : ''}`}>{channel}</li>)
                        )}
                    </ul>
                </div>
                <div className={styles['channel-name']}>
                    {
                        msgList.map(msg => <div className={'mx-2 my-2 '}><span className={'px-2 bg-info'}>{msg}</span></div>)
                    }
                </div>
            </div>
        </>
    )
}

export default Chat;