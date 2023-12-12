import { Helmet } from 'react-helmet-async';

import { SubCategoryView } from '../sections/subcategory/view'; 

// ----------------------------------------------------------------------

export default function SubCategoryPage() {
  return (
    <>
      <Helmet>
        <title> SubCategory | Minimal UI </title>
      </Helmet>

      <SubCategoryView />
    </>
  );
}
