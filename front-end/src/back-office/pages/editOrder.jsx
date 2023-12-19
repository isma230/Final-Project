import { Helmet } from 'react-helmet-async';

import { EditOrderView } from '../sections/order/view'; 

// ----------------------------------------------------------------------

export default function EditOrderPage() {
  return (
    <>
      <Helmet>
        <title> Categorie | Minimal UI </title>
      </Helmet>

      <EditOrderView />
    </>
  );
}
