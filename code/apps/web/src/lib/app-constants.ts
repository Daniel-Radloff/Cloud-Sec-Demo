import type { ServiceCardData } from "../../../../shared/src/types";
import ManageModulesIcon from "$lib/assets/bank-svgrepo-com.svg";
import ViewTimetableIcon from "$lib/assets/calendar-svgrepo-com.svg";
export const paths = {
  user_home: {
    name: "/home",
    nav_services : ["/module-manager", "/support", "/student-timetable"]
  },
  admin_home: {
    name: "/home",
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
    service_name : "Manage Modules",
    image_url : ManageModulesIcon,
    href : paths.module_manager.name
  },
  {
    service_name : "Manage Modules",
    image_url : ManageModulesIcon,
    href : paths.module_manager.name
  },
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