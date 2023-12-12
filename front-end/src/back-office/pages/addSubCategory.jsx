import { Helmet } from 'react-helmet-async';

import { AddSubCategoryView } from '../sections/subcategory/view'; 

// ----------------------------------------------------------------------

export default function AddSubCategoryPage() {
  return (
    <>
      <Helmet>
        <title> SubCategory | Minimal UI </title>
      </Helmet>

      <AddSubCategoryView />
    </>
  );
}
