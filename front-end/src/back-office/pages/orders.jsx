import { Helmet } from 'react-helmet-async';

import { OrderView } from '../sections/order/view';

// ----------------------------------------------------------------------

export default function OrderPage() {
  return (
    <>
      <Helmet>
        <title> Products | Minimal UI </title>
      </Helmet>

      <OrderView />
    </>
  );
}
