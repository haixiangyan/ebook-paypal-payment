import {FC} from "react";
import {
  PayPalButtons,
  PayPalHostedField,
  PayPalHostedFieldsProvider,
  PayPalScriptProvider
} from "@paypal/react-paypal-js";
import SubmitPayment from "../PayButton";
import styles from './style.module.scss';
import {axiosInstance} from "../../App";
import {PayPalButtonsComponentOptions} from "@paypal/paypal-js/types/components/buttons";
import {CloseOutlined} from "@ant-design/icons";

interface Props {
  clientToken: string;
  clientId: string;
  onCancel: () => void;
}

const downloadFile = (url: string) => {
  const link = document.createElement("a");
  link.setAttribute('download', '');
  link.href = url;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

const Payment: FC<Props> = (props) => {
  const { clientToken, clientId, onCancel } = props;

  const createOrder = async (): Promise<string> => {
    const response = await axiosInstance.post('/api/orders')
    return response.data.id;
  }

  const onApprove = async (orderId: string) => {
    // 成功确认订单
    const { data: { orderData, url } } = await axiosInstance.post(`/api/orders/${orderId}/capture`);
    console.log("Capture result", orderData);

    // 打印交易
    const transaction = orderData.purchase_units[0].payments.captures[0];
    console.log(`Transaction ${transaction.status}: ${transaction.id}`);

    downloadFile(url);

    alert(url ? '支付成功，开始下载' : '支付失败，请重试');
  }

  const onError: PayPalButtonsComponentOptions['onError'] = (error) => {
    console.log('onError', error);
    alert(error.message);
  }

  return (
    <div className={styles.payment}>
      <div className={styles.header}>
        <span>购买小书</span>

        <CloseOutlined className={styles.icon} onClick={onCancel} />
      </div>

      <PayPalScriptProvider
        options={{
          components: 'hosted-fields,buttons',
          "client-id": clientId,
          "data-client-token": clientToken,
        }}
      >
        <PayPalHostedFieldsProvider createOrder={() => createOrder()}>
          <PayPalHostedField
            id="card-number"
            className={styles.input}
            hostedFieldType="number"
            options={{ selector: "#card-number", placeholder: 'Card Number' }}
          />
          <PayPalHostedField
            id="cvv"
            className={styles.input}
            hostedFieldType="cvv"
            options={{ selector: "#cvv", placeholder: 'CVV' }}
          />
          <PayPalHostedField
            id="expiration-date"
            className={styles.input}
            hostedFieldType="expirationDate"
            options={{
              selector: "#expiration-date",
              placeholder: "MM/YY",
            }}
          />

          <SubmitPayment onApprove={onApprove} />

          <PayPalButtons
            className={styles.buttons}
            style={{
              color: 'blue',
              layout: "vertical",
              label: 'paypal',
            }}
            createOrder={() => createOrder()}
            onApprove={(data) => onApprove(data.orderID)}
            onError={onError}
            disabled={false}
          />
        </PayPalHostedFieldsProvider>
      </PayPalScriptProvider>
    </div>
  )
}

export default Payment;
