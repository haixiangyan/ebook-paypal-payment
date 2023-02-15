import {FC, useState} from "react";
import {usePayPalHostedFields} from "@paypal/react-paypal-js";

import styles from './styles.module.scss';

interface Props {
  onApprove: (orderId: string) => Promise<void>;
}

const PayButton: FC<Props> = (props) => {
  const { onApprove } = props;

  const [paying, setPaying] = useState<boolean>(false);

  // Here declare the variable containing the hostedField instance
  const hostedFields = usePayPalHostedFields();

  const submitHandler = async () => {
    if (typeof hostedFields.cardFields?.submit !== "function") return; // validate that `submit()` exists before using it

    setPaying(true);

    // The full name as shown in the card and billing address
    const order = await hostedFields.cardFields?.submit({ cardholderName: "John Wick" })

    // 成功确认订单
    await onApprove(order.orderId);

    setPaying(false);
  };

  return (
    <button className={styles.button} onClick={submitHandler}>
      {paying ? 'Paying...' : 'Pay'}
    </button>
  );
};

export default PayButton;