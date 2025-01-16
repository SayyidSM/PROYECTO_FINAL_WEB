
import Alumnos from "./src/pages/AppAlumnos";
import Carreras from "./src/pages/AppCarreras";

const routes = [
  {
    path: '/',
    component: (
      <>
         <Alumnos />
    </>
    ),
  },
  {
    path: '/Carreras',
    component: (
      <>
         <Carreras />
    </>
    ),
  }
];


export default routes;
