import { Helmet } from 'react-helmet-async';

import { CustomerView } from '../sections/customer/view'; 

// ----------------------------------------------------------------------

export default function CustomerPage() {
  return (
    <>
      <Helmet>
        <title> Customer | Minimal UI </title>
      </Helmet>

      <CustomerView />
    </>
  );
}
