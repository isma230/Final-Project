import SvgColor from '../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'user',
    path: '/user',
    icon: icon('ic_user'),
    subitems: [
      { title: 'Add New User', path: '/user/adduser' },
      { title: 'Edit User', path: '/user/edituser' },
    ],
  },
  {
    title: 'product',
    path: '/products',
    icon: icon('ic_product'),
    subitems: [
      { title: 'Add New Product', path: '/products/addproduct' },
      { title: 'Edit Product', path: '/products/editproduct' },
    ],
  },
  {
    title: 'Customer',
    path: '/customer',
    icon: icon('ic_user'),
    subitems: [
      { title: 'Edit Customer', path: '/customer/editcustomer' },
    ],
  },
  {
    title: 'order',
    path: '/orders', 
    icon: icon('ic_cart'),
  },
  {
    title: 'login',
    path: '/login',
    icon: icon('ic_lock'),
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic_disabled'),
  },
];

export default navConfig;
