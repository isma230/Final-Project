import { Helmet } from 'react-helmet-async';

import { EditUserView } from '../sections/user/view';

// ----------------------------------------------------------------------

export default function EditUserPage() {
  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>

      <EditUserView />
    </>
  );
}
