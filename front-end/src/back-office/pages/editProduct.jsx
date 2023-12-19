import { Helmet } from 'react-helmet-async';

import { EditProductView } from '../sections/products/view';

// ----------------------------------------------------------------------

export default function EditProductPage() {
  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>

      <EditProductView />
    </>
  );
}
