import { Helmet } from 'react-helmet-async';

import { AddUserView } from '../sections/user/view';

// ----------------------------------------------------------------------

export default function AddUserPage() {
  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>

      <AddUserView />
    </>
  );
}
