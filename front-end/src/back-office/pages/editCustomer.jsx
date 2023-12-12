import { Helmet } from 'react-helmet-async';

import { EditCustomerView } from '../sections/customer/view'; 

// ----------------------------------------------------------------------

export default function EditCustomerPage() {
  return (
    <>
      <Helmet>
        <title> Customer | Minimal UI </title>
      </Helmet>

      <EditCustomerView />
    </>
  );
}
