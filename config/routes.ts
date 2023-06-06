// /bsin-ui-digital-assets-management
const routes = [

  {
    path: '/',
    component: '@/layouts/index',
    routes: [
      { path: '', component: '@/pages/AgiuiFlow' },
      { path: '/about', component: '@/pages/About' },
    ],
  }, 
];
export default routes;
