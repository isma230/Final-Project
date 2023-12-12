import { Helmet } from 'react-helmet-async';

import { EditSubCategoryView } from '../sections/subcategory/view';

// ----------------------------------------------------------------------

export default function EditSubCategoryPage() {
  return (
    <>
      <Helmet>
        <title> SubCategory | Minimal UI </title>
      </Helmet>

      <EditSubCategoryView />
    </>
  );
}
