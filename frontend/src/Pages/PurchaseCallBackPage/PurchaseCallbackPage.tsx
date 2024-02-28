import { useState } from 'react';
import { PurchaseFeedbackForm } from '~/Components/PurchaseFeedbackForm';

export function PurchaseCallbackPage() {
  const [alternatives, setAlternatives] = useState([]);
  return <PurchaseFeedbackForm alternatives={alternatives}></PurchaseFeedbackForm>;
}
