import { Helmet } from 'react-helmet-async';

import { EditCategorieView } from '../sections/category/view'; 

// ----------------------------------------------------------------------

export default function EditCategoryPage() {
  return (
    <>
      <Helmet>
        <title> Categorie | Minimal UI </title>
      </Helmet>

      <EditCategorieView />
    </>
  );
}
