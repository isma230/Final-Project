import { Helmet } from 'react-helmet-async';

import { CategorieView } from '../sections/category/view'; 

// ----------------------------------------------------------------------

export default function CategoryPage() {
  return (
    <>
      <Helmet>
        <title> Categorie | Minimal UI </title>
      </Helmet>

      <CategorieView />
    </>
  );
}
