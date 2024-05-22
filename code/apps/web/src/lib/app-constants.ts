import type { ServiceCardData } from "@cos720project/shared";
import ManageModulesIcon from "$lib/assets/bank-svgrepo-com.svg";
import ViewTimetableIcon from "$lib/assets/calendar-svgrepo-com.svg";
import RegisterDegree from "$lib/assets/certificate-svgrepo-com.svg";
import AddModule from "$lib/assets/module-svgrepo-com.svg";
export const paths = {
  user_home: {
    name: "/home",
    nav_services : ["/module-manager", "/support", "/student-timetable"]
  },
  admin_home: {
    name: "/home/admin",
    nav_services : ["/add-degree", "/add-module", "/modify-degree"]
  },
  admin_add_degree : {
    name: "/home/admin/add-degree",
    nav_services : ["/support"]
  },
  admin_modify_degree : {
    name: "/home/admin/modify-degree",
    nav_services : ["/support"]
  },
  admin_add_module : {
    name: "/home/admin/add-module",
    nav_services : ["/support"]
  },
  admin_modify_module : {
    name: "/home/admin/modify-module",
    nav_services : ["/support"]
  },
  module_manager : {
    name: "/home/module-manager",
    nav_services : ["/change-modules","/support"]
  },
  student_timetable : {
    name: "/home/student-timetable",
    nav_services : ["/support"]
  }
}
export const UserServices:ServiceCardData[] = [
  {
    service_name : "Manage Modules",
    image_url : ManageModulesIcon,
    href : paths.module_manager.name
  },
  {
    service_name : "View Timetable",
    image_url : ViewTimetableIcon,
    href : paths.student_timetable.name
  }
];

export const AdminServices:ServiceCardData[] = [
  {
    service_name : "Add Degree",
    image_url : RegisterDegree,
    href : paths.admin_add_degree.name
  },
  {
    service_name : "Modify Degree",
    image_url : RegisterDegree,
    href : paths.admin_modify_degree.name
  },
  {
    service_name : "Add Module",
    image_url : AddModule,
    href : paths.admin_add_module.name
  },
  {
    service_name : "Modify Module",
    image_url : AddModule,
    href : paths.admin_modify_module.name
  }
];