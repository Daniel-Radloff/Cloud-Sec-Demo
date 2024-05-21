import { describe, it, expect } from 'vitest';

import {faker } from '@faker-js/faker';
describe('sum test', () => {
	it('adds 1 + 2 to equal 3', () => {
		expect(1 + 2).toBe(3);
	});
});
describe ("Fake Data Validation", async () => {
  it("generates a lot of fake data and checks that it validates correctly", () => {
    const fakerInstance = faker;

    let userModules = [];
    for (let x = 0; x < 13; x++) {
      const testDate1 = {
	name: "Midterm Exam",
	date: faker.date.future()
      };

      const testDate2 = {
	name: "Final Exam",
	date: faker.date.future()
      };
      const universityModule1 = {
	name: fakerInstance.word.noun(),
	code: "COS132",
	credits: fakerInstance.datatype.number({ min: 3, max: 6 }),
	department: fakerInstance.company.buzzNoun(),
	description: fakerInstance.lorem.paragraph(),
	semester: fakerInstance.datatype.number({ min: 1, max: 2 }),
	term: fakerInstance.datatype.number({ min: 1, max: 4 }), // Optional, comment out if not needed
	testDates: [testDate1, testDate2],
	cost: fakerInstance.commerce.price(),
	prerequisites: [
	  [fakerInstance.datatype.uuid(), fakerInstance.datatype.uuid()], // Array of uuids
	],
      };
      const userRegisteredModule = {
	moduleId: fakerInstance.datatype.uuid(),
	module: universityModule1, // Reference the generated universityModule
	registrationDate: new Date("2024-05-10"), // Adjust date as needed
	status: "enrolled",
	deregisterable: fakerInstance.datatype.boolean(),
	grade: fakerInstance.datatype.number({ min: 50, max: 100 }), // Optional, comment out if not needed
	notes: fakerInstance.lorem.sentence(), // Optional, comment out if not needed
      };
      userModules.push(userRegisteredModule);
    }

    const universityDegree1 = {
      name: fakerInstance.color.human(),
      code: fakerInstance.random.alphaNumeric(6),
      department: fakerInstance.company.buzzAdjective(),
      duration: fakerInstance.datatype.number({ min: 3, max: 4 }), // Years
      description: fakerInstance.lorem.paragraph(),
      coreModules: [fakerInstance.datatype.uuid(), fakerInstance.datatype.uuid()], // Array of uuids
      electiveModules: [fakerInstance.datatype.uuid(), fakerInstance.datatype.uuid()], // Array of uuids
      minCreditsPerSemester: fakerInstance.datatype.number({ min: 12, max: 18 }),
      minCredits: fakerInstance.datatype.number({ min: 90, max: 120 }),
    };

    const userRegisteredDegree1 = {
      degreeId: fakerInstance.datatype.uuid(),
      degree: universityDegree1, // Reference the generated universityDegree
      userId: fakerInstance.datatype.uuid(),
      enrollmentDate: new Date("2023-09-01"), // Adjust date as needed
      expectedGraduationDate: new Date("2025-06-30").toISOString(), // Convert to ISO string
      status: "active",
      enrolledModules: userModules, // Reference generated modules
      completedCredits: fakerInstance.datatype.number({ min: 30, max: 60 }),
    };

    console.log(JSON.stringify(userRegisteredDegree1,null,2))
  })
});
