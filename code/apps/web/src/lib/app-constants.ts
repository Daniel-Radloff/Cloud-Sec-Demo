import type { ServiceCardData } from "@cos720project/shared";
import ManageModulesIcon from "$lib/assets/bank-svgrepo-com.svg";
//import ViewTimetableIcon from "$lib/assets/calendar-svgrepo-com.svg";
import RegisterDegree from "$lib/assets/certificate-svgrepo-com.svg";
import AddModule from "$lib/assets/module-svgrepo-com.svg";
export const paths = {
  user_home: {
    name: /^\/home$/g,
    nav_services : ["/module-manager", "/apply-for-degree"]
  },
  admin_home: {
    name: /^\/home\/admin$/g,
    nav_services : ["/add-degree", "/add-module", "/modify-degree"]
  },
  admin_add_degree : {
    name: /^\/home\/admin\/add-degree$/g,
    nav_services : []
  },
  admin_modify_degree : {
    name: /\/home\/admin\/modify-degree/g,
    nav_services : []
  },
  admin_add_module : {
    name: /^\/home\/admin\/add-module$/g,
    nav_services : []
  },
  admin_modify_module : {
    name: /\/home\/admin\/modify-module/g,
    nav_services : []
  },
  module_manager : {
    name: /^\/home\/module-manager$/g,
    nav_services : []
  },
  student_timetable : {
    name: /^\/home\/student-timetable$/g,
    nav_services : []
  },
  apply_for_degree : {
    name : /^\/home\/apply-for-degree$/g,
    nav_services : []
  }
}
export const UserServices:ServiceCardData[] = [
  {
    service_name : "Manage Modules",
    image_url : ManageModulesIcon,
    href : "/home/module-manager"
  },
  // {
  //   service_name : "View Timetable",
  //   image_url : ViewTimetableIcon,
  //   href : "/home/student-timetable"
  // },
  {
    service_name : "Apply For Degree",
    image_url : RegisterDegree,
    href : "/home/apply-for-degree"
  }
];

export const AdminServices:ServiceCardData[] = [
  {
    service_name : "Add Degree",
    image_url : RegisterDegree,
    href : "/home/admin/add-degree"
  },
  {
    service_name : "Modify Degree",
    image_url : RegisterDegree,
    href : "/home/admin/modify-degree"
  },
  {
    service_name : "Add Module",
    image_url : AddModule,
    href : "/home/admin/add-module"
  }
  // {
  //   service_name : "Modify Module",
  //   image_url : AddModule,
  //   href : "/home/admin/modify-module"
  // }
];

export const functionNames = {
  moduleFunctions : {
    addModule : "moduleFunctions-addModule",
    updatePrerequisites : "moduleFunctions-updateModulePrerequisites",
    updateModulePresentationTime : "moduleFunctions-updateModulePresentationTime",
  },
  universityDegreeFunctions : {
    addDegree : "universityDegreeFunctions-addNewDegree",
    modifyDegree : "universityDegreeFunctions-modifyDegree"
  },
  userDegreeFunctions : {
    registerDegree : "userDegreeFunctions-createDegreeRegistration",
    registerModule : "userDegreeFunctions-registerModule",
    deregisterModule : "userDegreeFunctions-deregisterModule"
  }
}
