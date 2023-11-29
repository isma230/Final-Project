import { Helmet } from 'react-helmet-async';

import { AddProductView } from '../sections/products/view';

// ----------------------------------------------------------------------

export default function AddProductPage() {
  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>

      <AddProductView />
    </>
  );
}
