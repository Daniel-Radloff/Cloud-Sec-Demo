import {z} from "zod";

// internal use
const streetNameRegex = /\d\s\w/g;
const phoneCountryCode = /^(\d{1,2}-)*\d{1,3}$/g;
export const moduleCode = /\w{3}\d{3}/g;

export type ServiceCardData = {
  service_name : string,
  image_url: string,
  href : string
};

const firebaseDate = z.union([
  z.coerce.date(),
  z.object({
    seconds : z.number(),
    nanoseconds : z.number()
  }).transform((arg=> new Date(arg.seconds)))
]);

// University Information
export const registrationDates = z.object({
    newStudentRegistrationDeadline : firebaseDate,
    returningStudentRegistrationDeadline : firebaseDate,
    moduleRegistrationDeadlines : z.array(z.union([
        z.object({
            semester : z.number().int().min(1).max(2),
            date : firebaseDate
        }),
        z.object({
            term : z.number().int().min(1).max(4),
            date : firebaseDate
        })
    ]))
})
export type RegistrationDates = z.infer<typeof registrationDates>;

// Test Date
export const testDate = z.object({
    name : z.string(),
    date : firebaseDate,
});
export const deregisterUserModuleFunctionDatatype = z.object({
  userDegreeId : z.string(),
  moduleId : z.string()
});
// Modules
const universityModulePre = z.object({
    id : z.string().optional(),
    name : z.string().min(8),
    code : z.coerce.string().regex(moduleCode, "Code is invalid"),
    credits : z.coerce.number().int().nonnegative(),
    department : z.string().min(3),
    description : z.string().min(18),
    semester : z.number().int().min(1).max(2),
    term : z.number().int().min(1).max(4).optional(),
    testDates : z.array(testDate),
    cost : z.coerce.number().nonnegative(),
    prerequisites : z.array(z.array(z.string())),
    discontinued : z.boolean().optional()
});
export const universityModule = universityModulePre.extend({
  prerequisiteObjects : z.array(z.array(universityModulePre)).optional(),
})

export type UniversityModule = z.infer<typeof universityModule>;

export const userRegisteredModule = z.object({
    moduleId : z.string(),
    module : universityModule.optional(),
    registrationDate : z.union([
      firebaseDate,
      z.object({
	seconds : z.number(),
	nanoseconds : z.number()
      }).transform((arg=> new Date(arg.seconds)))
    ]),
    status : z.union([
        z.literal("enrolled"),
        z.literal("completed"),
        z.literal("failed"),
        z.literal("current"),
        z.literal("discontinued"),
        z.literal("prerequisites not satisfied")
    ]),
    deregisterable : z.boolean(),
    grade : z.number().optional(),
    notes : z.string().optional(),
});

export type UserRegisteredModule = z.infer<typeof userRegisteredModule>;

// Degree Information
export const universityDegree = z.object({
    id : z.string().optional(),
    name : z.string().min(8),
    code : z.string().min(2),
    department : z.string().min(3),
    duration : z.number().int().max(7).min(1),
    description : z.string().min(10),
    coreModules : z.array(z.string()),
    coreModuleObjects : z.array(universityModule).optional(),
    electiveModules : z.array(z.string()),
    electiveModuleObjects : z.array(universityModule).optional(),
    minCreditsPerSemester : z.coerce.number().int().nonnegative().min(64),
    minCredits : z.coerce.number().int().nonnegative().min(384),
    discontinued : z.boolean().optional()
});

export type UniversityDegree = z.infer<typeof universityDegree>;

export const userRegisteredDegree = z.object({
    id : z.string().optional(),
    degreeId : z.string(),
    degree : universityDegree.optional(),
    userId : z.string(),
    enrollmentDate : firebaseDate,
    expectedGraduationDate : firebaseDate,
    status : z.union([z.literal("active"), z.literal("completed"), z.literal("failed")]),
    enrolledModules : z.array(userRegisteredModule),
    completedCredits : z.number().int().nonnegative()
});

export type UserRegisteredDegree = z.infer<typeof userRegisteredDegree>;

// Meta Data
export const personalInformation = z.object({
    name: z.string(),
    age: z.number().max(130).min(16),
    gender: z.union([z.literal("male"), z.literal("female"), z.string({
        invalid_type_error: "Gender must be characters"
    })]),
    dateOfBirth: firebaseDate,
    address: z.object({
        street : z.string().regex(streetNameRegex, "Invalid Street name format"),
        appartmentNumber: z.string().optional(),
        city : z.string(),
        country : z.string(),
        province : z.string(),
    }),
    emailAddress: z.string().email(),
    phoneNumber: z.object({
        code: z.string().regex(phoneCountryCode, "cellphone country code invalid"),
        number: z.string().max(10).min(9),
    })
});
export type PersonalInformation = z.infer<typeof personalInformation>;

export const demographicInformation = z.object({
    ethnicity : z.union([z.literal("black"), z.literal("white"), z.literal("indian"), z.literal("asian"), z.literal("mixed")]).optional(),
    language : z.string().optional(),
    educationLevel : z.union([
        z.literal("high school"),
        z.literal("diploma"),
        z.literal("certification"),
        z.literal("bachelors"),
        z.literal("honors"),
        z.literal("masters"),
        z.literal("doctorate")
    ]).optional(),
    occupation : z.string().optional(),
    incomeLevel : z.string().optional(),
});
export type DemographicInformation  = z.infer<typeof demographicInformation>;

export const geolocationData = z.object({
    ipAddress: z.string().ip(),
    gpsCoordinates: z.object({
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
    }),
    country: z.string(),
    city: z.string(),
    region: z.string(),
});
export type GeolocationData = z.infer<typeof geolocationData>;

export const deviceInformation = z.object({
    deviceType: z.string(),
    operatingSystem: z.string(),
    browserType: z.string(),
    deviceId: z.string().optional(),
});
export type DeviceInformation = z.infer<typeof deviceInformation>;

// Validate stuff here
export const preferences = z.object({
    contentPreferences: z.array(z.string()).optional(),
    communicationPreferences: z.array(z.string()).optional(),
});
export type Preferences = z.infer<typeof preferences>;

export const securityInformation = z.object({
    username: z.string(),
    accountEmail: z.string().email(),
    securityQuestions: z.array(z.object({
        question: z.string(),
        answer: z.string(),
    })).optional(),
})
export type SecurityInformation = z.infer<typeof securityInformation>;


// TODO redefine payment info
export const transactionalData = z.object({
    paymentInformation: z.string(),
    paymentHistory: z.array(z.string()),
});
export type  TransactionalData = z.infer<typeof transactionalData>;

export const academicInformationMetaData = z.object({
    enrolledDegrees : z.number().int().nonnegative(),
    completedDegrees : z.number().int().nonnegative(),
    completedCredits : z.number().int().nonnegative()
});

export type AcademicInformationMetaData = z.infer<typeof academicInformationMetaData>;

export const notificationData = z.object({
    type : z.string(),
    message : z.string()
});

export type NotificationData = z.infer<typeof notificationData>;

export const userMetadata = z.object({
    personalInformation: personalInformation.optional(),
    demographicInformation: demographicInformation.optional(),
    geolocationData: geolocationData.optional(),
    deviceInformation: deviceInformation.optional(),
    preferences: preferences.optional(),
    securityInformation: securityInformation,
    transactionalData: transactionalData.optional(),
    academicInformationMetaData : academicInformationMetaData,
    notificationData : z.array(notificationData)
})
export type UserMetadata = z.infer<typeof userMetadata>;
