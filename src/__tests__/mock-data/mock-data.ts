import { faker } from "@faker-js/faker";
import { FixtureEnum } from "../../fixtures/enum/fixtures-enum";


const  createMockFixture = {
    date: faker.date.past().toISOString().slice(0, 10),
    time: faker.date.past().toISOString().slice(11, 19),
    homeScore: faker.number.int(),
    awayScore: faker.number.int(),
    status: FixtureEnum.COMPLETED,
}


const createMockTeam = {
    name: faker.company.name(),
    logo: faker.image.url(),
    country:faker.location.country(),
    city: faker.location.city(),
    stadium:faker.company.name() + ' Stadium',
    founded: faker.date.past(),
    numberOfTitles: faker.number.int(),
}

const createMockUser = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: "password",
}

export { createMockFixture, createMockTeam, createMockUser }