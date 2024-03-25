"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockUser = exports.createMockTeam = exports.createMockFixture = void 0;
const faker_1 = require("@faker-js/faker");
const fixtures_enum_1 = require("../../fixtures/enum/fixtures-enum");
const createMockFixture = {
    date: faker_1.faker.date.past().toISOString().slice(0, 10),
    time: faker_1.faker.date.past().toISOString().slice(11, 19),
    homeScore: faker_1.faker.number.int(),
    awayScore: faker_1.faker.number.int(),
    status: fixtures_enum_1.FixtureEnum.COMPLETED,
};
exports.createMockFixture = createMockFixture;
const createMockTeam = {
    name: faker_1.faker.company.name(),
    logo: faker_1.faker.image.url(),
    country: faker_1.faker.location.country(),
    city: faker_1.faker.location.city(),
    stadium: faker_1.faker.company.name() + ' Stadium',
    founded: faker_1.faker.date.past(),
    numberOfTitles: faker_1.faker.number.int(),
};
exports.createMockTeam = createMockTeam;
const createMockUser = {
    name: faker_1.faker.person.fullName(),
    email: faker_1.faker.internet.email(),
    password: "password",
};
exports.createMockUser = createMockUser;
