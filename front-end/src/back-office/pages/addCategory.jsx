import { Helmet } from 'react-helmet-async';

import { AddCategorieView } from '../sections/category/view'; 

// ----------------------------------------------------------------------

export default function AddCategoryPage() {
  return (
    <>
      <Helmet>
        <title> Categorie | Minimal UI </title>
      </Helmet>

      <AddCategorieView />
    </>
  );
}
