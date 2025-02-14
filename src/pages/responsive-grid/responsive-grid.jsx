import styles from './responsive-grid.module.css'

function ResponsiveGrid() {
    return (
        <>
            <div className={styles.container}>
                <div className={styles.header}>This is header</div>
                <div className={styles['nav-bar']}>
                    <div className={styles['nav-item']}></div>
                    <div className={styles['nav-item']}></div>
                    <div className={styles['nav-item']}></div>
                </div>
                <div className={styles['main-panel']}><h1>This is main content</h1></div>
                <div className={styles['side-panel']}>
                    <div className={styles['side-item']}></div>
                    <div className={styles['side-item']}></div>
                    <div className={styles['side-item']}></div>
                </div>
                <div className={styles.footer}>footer</div>
            </div>
        </>
    )
}

export default ResponsiveGrid;
