import {z} from "zod";

// internal use
const streetNameRegex = /\d\s\w/g;
const phoneCountryCode = /^(\d{1,2}-)*\d{1,3}$/g;
const moduleCode = /\d{3}\w{3}/g;

export type ServiceCardData = {
  service_name : string,
  image_url: string,
  href : string
};

// University Information
export const registrationDates = z.object({
    newStudentRegistrationDeadline : z.date(),
    returningStudentRegistrationDeadline : z.date(),
    moduleRegistrationDeadlines : z.array(z.union([
        z.object({
            semester : z.number().int().min(1).max(2),
            date : z.date()
        }),
        z.object({
            term : z.number().int().min(1).max(4),
            date : z.date()
        })
    ]))
})
export type RegistrationDates = z.infer<typeof registrationDates>;

// Test Date
export const testDate = z.object({
    name : z.string(),
    date : z.date(),
});
// Modules
export const universityModule = z.object({
    id : z.string().uuid().optional(),
    name : z.string(),
    code : z.string().refine((code) => moduleCode.test(code)),
    credits : z.number().int(),
    department : z.string(),
    description : z.string(),
    semester : z.number().int().min(1).max(2),
    term : z.number().int().min(1).max(4).optional(),
    testDates : z.array(testDate),
    cost : z.number(),
    prerequisites : z.array(z.array(z.string().uuid())),
    discontinued : z.boolean().optional()
});

export type UniversityModule = z.infer<typeof universityModule>;

export const userRegisteredModule = z.object({
    moduleId : z.string().uuid(),
    module : universityModule.optional(),
    registrationDate : z.date(),
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
    id : z.string().uuid().optional(),
    name : z.string(),
    code : z.string(),
    department : z.string(),
    duration : z.number().int(),
    description : z.string(),
    coreModules : z.array(z.string().uuid()),
    electiveModules : z.array(z.string().uuid()),
    minCreditsPerSemester : z.number().int(),
    minCredits : z.number().int(),
    discontinued : z.boolean().optional()
});

export type UniversityDegree = z.infer<typeof universityDegree>;

export const userRegisteredDegree = z.object({
    id : z.string().uuid().optional(),
    degreeId : z.string().uuid(),
    degree : universityDegree.optional(),
    userId : z.string().uuid(),
    enrollmentDate : z.date(),
    expectedGraduationDate : z.string(),
    status : z.union([z.literal("active"), z.literal("completed"), z.literal("failed")]),
    enrolledModules : z.array(userRegisteredModule),
    completedCredits : z.number().int()
});

export type UserRegisteredDegree = z.infer<typeof userRegisteredDegree>;

// Meta Data
export const personalInformation = z.object({
    name: z.string(),
    age: z.number().max(130).min(16),
    gender: z.union([z.literal("male"), z.literal("female"), z.string({
        invalid_type_error: "Gender must be characters"
    })]),
    dateOfBirth: z.date(),
    address: z.object({
        street : z.string().refine((streetname) => streetNameRegex.test(streetname)),
        appartmentNumber: z.string().optional(),
        city : z.string(),
        country : z.string(),
        province : z.string(),
    }),
    emailAddress: z.string().email(),
    phoneNumber: z.object({
        code: z.string().refine((code) => phoneCountryCode.test(code)),
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
    enrolledDegrees : z.number().int(),
    completedDegrees : z.number().int(),
    completedCredits : z.number().int()
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