import axios from "axios";
import {useEffect, useMemo, useState} from "react";
import Payment from "./components/Payment";
import styles from './styles.module.scss';
import bookImage from './assets/book.jpg';
import {LeftOutlined, LoadingOutlined} from "@ant-design/icons";

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001',
})

function App() {
  const [paying, setPaying] = useState<boolean>(false);
  const [clientToken, setClientToken] = useState<string>('');
  const [clientId, setClientId] = useState<string>('');

  useEffect(() => {
    fetchClientToken().then();
  }, []);

  const fetchClientToken = async () => {
    const { data } = await axiosInstance.get('/api/client_token');

    setClientId(data.clientId);
    setClientToken(data.clientToken);
  }

  const isReady = useMemo(() => clientId && clientToken, [clientId, clientToken]);

  return (
    <div className={styles.app}>
      <div className={styles.wrapper}>
        {/*头部*/}
        <div className={styles.book}>
          <header className={styles.header}>
            <LeftOutlined />
          </header>

          <img className={styles.bookImage} src={bookImage} alt="Book"/>

          <p className={styles.bookTitle}>JavaScript 高级程序设计</p>

          <p className={styles.author}>作者 - [美] 马特·弗里斯比</p>
        </div>

        {/*描述*/}
        <div className={styles.desc}>
          <div className={styles.descHeader}>
            <span className={styles.descTitle}>小书简介</span>
            <span className={styles.price}>$1.00</span>
          </div>

          <p className={styles.descText}>
            书是JavaScript经典图书的新版。第4版全面、深入地介绍了JavaScript开发者必须掌握的前端开发技术，涉及JavaScript的基础特性和高级特性。书中详尽讨论了JavaScript的各个方面，从JavaScript的起源开始，逐步讲解到新出现的技术，其中重点介绍ECMAScript和DOM标准。
          </p>
        </div>

        {/* Tag */}
        <div className={styles.tagList}>
          <span className={styles.yellow}>JavaScript</span>
          <span className={styles.red}>前端开发</span>
          <span className={styles.blue}>入门进阶</span>
        </div>

        {/*购买按钮*/}
        <button className={styles.purchaseButton} onClick={() => setPaying(true)}>
          {clientToken ? '购买小书' :  <LoadingOutlined />}
        </button>
      </div>

      {isReady && paying && <div className={styles.mask} onClick={() => setPaying(false)}></div>}

      {isReady && paying && <Payment clientToken={clientToken} clientId={clientId} onCancel={() => setPaying(false)} />}
    </div>
  )
}

export default App
