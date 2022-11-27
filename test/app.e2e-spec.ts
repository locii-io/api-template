import { Express } from 'express-serve-static-core';
import createServer from '../server/server';
import gql from 'graphql-tag';
import supertest from 'supertest';
import db from '../server/models';
import Analytics from 'analytics-node';
import AppAnalytics from '../server/services/analytics';
import NewRelicHelper from '../server/services/newrelic';

let app: Express;
let userToken = null;
let invalidUserToken = '12345-67890';

// Mocking: Segment
jest.mock('analytics-node');
const mockSegment = Analytics as jest.MockedClass<typeof Analytics>;

// Mocking: New Relic
jest.mock('../server/services/newrelic');
const mockNewRelic = NewRelicHelper as jest.MockedClass<typeof NewRelicHelper>;

describe('AppController (e2e)', () => {
  const thisDb: any = db;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(async () => {
    app = await createServer();
    await thisDb.sequelize.sync({ force: true });
  });

  afterAll(async () => {
    //jest.resetAllMocks();
  });

  test('(+) Analytics Identify', () => {
    const userId = 1;
    const traits = {
      name: 'James Bond',
    };

    process.env.SEGMENT_API_KEY = 'TEST';
    process.env.NEW_RELIC_LICENSE_KEY = 'TEST';

    const appAnalytics = new AppAnalytics();
    const result = appAnalytics.identify(userId, traits);

    // Segment
    expect(mockSegment).toBeCalledWith(process.env.SEGMENT_API_KEY);
    expect(mockSegment.mock.instances[0].identify).toHaveBeenCalledWith({
      userId: userId,
      traits: traits,
    });

    expect(result).toBe('OK');

    process.env.SEGMENT_API_KEY = '';
    process.env.NEW_RELIC_LICENSE_KEY = '';
  });

  test('(+) Analytics Track', () => {
    const userId = 1;
    const event = 'User Deleted';
    const properties = {
      userId: 1,
    };

    process.env.SEGMENT_API_KEY = 'TEST';
    process.env.NEW_RELIC_LICENSE_KEY = 'TEST';

    const appAnalytics = new AppAnalytics();
    const result = appAnalytics.track(userId, event, properties);

    // Segment
    expect(mockSegment).toBeCalledWith(process.env.SEGMENT_API_KEY);
    expect(mockSegment.mock.instances[0].track).toHaveBeenCalledWith({
      userId: userId,
      event: event,
      properties: properties,
    });

    // New Relic
    expect(mockNewRelic).toBeCalledWith(process.env.NEW_RELIC_LICENSE_KEY);
    expect(mockNewRelic.mock.instances[0].track).toHaveBeenCalledWith({
      userId: userId,
      event: event,
      properties: properties,
    });

    expect(result).toBe('OK');

    process.env.SEGMENT_API_KEY = '';
    process.env.NEW_RELIC_LICENSE_KEY = '';
  });

  // Test: REST API, Create User
  test('(-) REST Create User: Missing Name', async () => {
    const user = {
      email: 'james.bond@domain.com',
      password: 'James123',
    };
    await supertest(app)
      .post(`/api/create-user?email=${user.email}&password=${user.password}`)
      .expect(500);
  });

  // Test: REST API, Create User
  test('(-) REST Create User: Missing Email', async () => {
    const user = {
      name: 'James Bond',
      password: 'James123',
    };
    await supertest(app)
      .post(`/api/create-user?name=${user.name}&password=${user.password}`)
      .expect(500);
  });

  // Test: REST API, Create User
  test('(-) REST Create User: Missing Password', async () => {
    const user = {
      name: 'James Bond',
      email: 'james.bond@domain.com',
    };
    await supertest(app)
      .post(`/api/create-user?name=${user.name}&email=${user.email}`)
      .expect(500);
  });

  // Test: REST API, Create User
  test('(+) REST Create User: Successful', async () => {
    const user = {
      name: 'James Bond',
      email: 'james.bond@domain.com',
      password: 'James123',
    };
    await supertest(app)
      .post(
        `/api/create-user?name=${user.name}&email=${user.email}&password=${user.password}`,
      )
      .expect(200)
      .then((response) => {
        // Check the response data
        expect(response.body.name).toBe(user.name);
        expect(response.body.email).toBe(user.email);
      });
  });

  // Test: REST API, Login
  test('(-) REST Login: Missing Email', async () => {
    const loginData = {
      password: 'James123',
    };
    await supertest(app)
      .post(`/login`)
      .send(loginData)
      .expect(400)
      .then((response) => {
        // Check the response data
        expect(response.body).toHaveProperty('message');
        expect(response.body['message']).toBe('Missing email');
      });
  });

  // Test: REST API, Login
  test('(-) REST Login: Missing Password', async () => {
    const loginData = {
      email: 'james.bond@domain.com',
    };
    await supertest(app)
      .post(`/login`)
      .send(loginData)
      .expect(400)
      .then((response) => {
        // Check the response data
        expect(response.body).toHaveProperty('message');
        expect(response.body['message']).toBe('Missing password');
      });
  });

  // Test: REST API, Login
  test('(-) REST Login: User Not Found', async () => {
    const loginData = {
      email: 'anita.bond@domain.com',
      password: 'Anita123',
    };
    await supertest(app)
      .post(`/login`)
      .send(loginData)
      .expect(404)
      .then((response) => {
        // Check the response data
        expect(response.body).toHaveProperty('message');
        expect(response.body['message']).toBe('User not found');
      });
  });

  // Test: REST API, Login
  test('(-) REST Login: Invalid Password', async () => {
    const loginData = {
      email: 'james.bond@domain.com',
      password: 'James123456',
    };
    await supertest(app)
      .post(`/login`)
      .send(loginData)
      .expect(401)
      .then((response) => {
        // Check the response data
        expect(response.body).toHaveProperty('message');
        expect(response.body['message']).toBe('Invalid password');
      });
  });

  // Test: REST API, Login
  test('(+) REST Login: Successful', async () => {
    const loginData = {
      email: 'james.bond@domain.com',
      password: 'James123',
    };
    await supertest(app)
      .post(`/login`)
      .send(loginData)
      .expect(200)
      .then((response) => {
        // Check the response data
        expect(response.body).toHaveProperty('token');

        // Save user token for the rest of the testing
        userToken = response.body['token'];
      });
  });

  // Test: REST API, Update User
  test('(-) REST Update User: Missing Auth Header', async () => {
    const user = {
      id: 1,
      name: 'Mariah Carey',
      email: 'mariah.carey@gmail.com',
    };
    await supertest(app)
      .post(
        `/api/update-user?name=${user.name}&email=${user.email}&id=${user.id}`,
      )
      .expect(401);
  });

  // Test: REST API, Update User
  test('(-) REST Update User: Invalid Auth Header', async () => {
    const user = {
      id: 1,
      name: 'Mariah Carey',
      email: 'mariah.carey@gmail.com',
    };
    await supertest(app)
      .post(
        `/api/update-user?name=${user.name}&email=${user.email}&id=${user.id}`,
      )
      .set('Authorization', 'Bearer ' + invalidUserToken)
      .expect(403);
  });

  // Test: REST API, Update User
  test('(-) REST Update User: User Not Found', async () => {
    const user = {
      id: 99,
      name: 'Anita Smith',
      email: 'anita.smith@gmail.com',
    };
    await supertest(app)
      .post(
        `/api/update-user?name=${user.name}&email=${user.email}&id=${user.id}`,
      )
      .set('Authorization', 'Bearer ' + userToken)
      .expect(500)
      .then((response) => {
        // Check the response data
        expect(response.body['message']).toBe(
          'Cannot return null for non-nullable field User.id.',
        );
      });
  });

  // Test: REST API, Update User
  test('(+) REST Update User: Successful', async () => {
    const user = {
      id: 1,
      name: 'Mariah Carey',
      email: 'mariah.carey@gmail.com',
    };
    await supertest(app)
      .post(
        `/api/update-user?name=${user.name}&email=${user.email}&id=${user.id}`,
      )
      .set('Authorization', 'Bearer ' + userToken)
      .expect(200)
      .then((response) => {
        // Check the response data
        expect(response.body.name).toBe(user.name);
        expect(response.body.email).toBe(user.email);
      });
  });

  // Test: REST API, Get All Users
  test('(-) REST Get All Users: Missing Auth Header', async () => {
    await supertest(app).get('/api/users').expect(401);
  });

  // Test: REST API, Get All Users
  test('(-) REST Get All Users: Invalid Auth Header', async () => {
    await supertest(app)
      .get('/api/users')
      .set('Authorization', 'Bearer ' + invalidUserToken)
      .expect(403);
  });

  // Test: REST API, Get All Users
  test('(+) REST Get All Users: Successful', async () => {
    await supertest(app)
      .get('/api/users')
      .set('Authorization', 'Bearer ' + userToken)
      .expect(200)
      .then((response) => {
        // Check the response type and length
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toBe(1);
      });
  });

  // Test: REST API, Get User by ID
  test('(-) REST Get User by ID: Missing Auth Header', async () => {
    const user = {
      id: 1,
      name: 'Mariah Carey',
      email: 'mariah.carey@gmail.com',
    };
    await supertest(app).get(`/api/user-by-id/${user.id}`).expect(401);
  });

  // Test: REST API, Get User by ID
  test('(-) REST Get User by ID: Invalid Auth Header', async () => {
    const user = {
      id: 1,
      name: 'Mariah Carey',
      email: 'mariah.carey@gmail.com',
    };
    await supertest(app)
      .get(`/api/user-by-id/${user.id}`)
      .set('Authorization', 'Bearer ' + invalidUserToken)
      .expect(403);
  });

  // Test: REST API, Get User by ID
  test('(-) REST Get User by ID: User Not Found', async () => {
    const user = {
      id: 9,
    };
    await supertest(app)
      .get(`/api/user-by-id/${user.id}`)
      .set('Authorization', 'Bearer ' + userToken)
      .expect(200)
      .then((response) => {
        // Check the response data
        expect(response.body).toBe(null);
      });
  });

  // Test: REST API, Get User by ID
  test('(+) REST Get User by ID: Successful', async () => {
    const user = {
      id: 1,
      name: 'Mariah Carey',
      email: 'mariah.carey@gmail.com',
    };
    await supertest(app)
      .get(`/api/user-by-id/${user.id}`)
      .set('Authorization', 'Bearer ' + userToken)
      .expect(200)
      .then((response) => {
        // Check the response data
        expect(response.body.name).toBe(user.name);
        expect(response.body.email).toBe(user.email);
      });
  });

  // Test: REST API, Delete User
  test('(-) REST Delete User: Missing Auth Header', async () => {
    const user = {
      id: 1,
    };
    await supertest(app).post(`/api/delete-user?id=${user.id}`).expect(401);
  });

  // Test: REST API, Delete User
  test('(-) REST Delete User: Invalid Auth Header', async () => {
    const user = {
      id: 1,
    };
    await supertest(app)
      .post(`/api/delete-user?id=${user.id}`)
      .set('Authorization', 'Bearer ' + invalidUserToken)
      .expect(403);
  });

  // Test: REST API, Delete User
  test('(-) REST Delete User: User Not Found', async () => {
    const user = {
      id: 100,
    };
    await supertest(app)
      .post(`/api/delete-user?id=${user.id}`)
      .set('Authorization', 'Bearer ' + userToken)
      .expect(200)
      .then((response) => {
        // Check the response data
        expect(response.body).toBe('User not found');
      });
  });

  // Test: REST API, Delete User
  test('(+) REST Delete User: Successful', async () => {
    const user = {
      id: 1,
    };
    await supertest(app)
      .post(`/api/delete-user?id=${user.id}`)
      .set('Authorization', 'Bearer ' + userToken)
      .expect(200)
      .then((response) => {
        // Check the response data
        expect(response.body).toBe('User deleted successfully');
      });
  });

  // Test: GraphQL, Create User
  test('(-) GraphQL Create User: Missing Auth Header', async () => {
    const user = {
      name: 'Ariana Grande',
      email: 'ariana.grande@gmail.com',
      password: 'Ariana123',
    };

    const query = `
      mutation CreateUser(
        $name: String!
        $email: String!
        $password: String!
      ) {
        createUser(name: $name, email: $email, password: $password) {
          name
          email
        }
      }
    `;
    const variables = {
      name: user.name,
      email: user.email,
      password: user.password,
    };
    const payload = {
      query: query,
      variables: variables,
    };
    await supertest(app).post(`/graphql`).send(payload).expect(401);
  });

  // Test: GraphQL, Create User
  test('(-) GraphQL Create User: Invalid Auth Header', async () => {
    const user = {
      name: 'Ariana Grande',
      email: 'ariana.grande@gmail.com',
      password: 'Ariana123',
    };

    const query = `
      mutation CreateUser(
        $name: String!
        $email: String!
        $password: String!
      ) {
        createUser(name: $name, email: $email, password: $password) {
          name
          email
        }
      }
    `;
    const variables = {
      name: user.name,
      email: user.email,
      password: user.password,
    };
    const payload = {
      query: query,
      variables: variables,
    };
    await supertest(app)
      .post(`/graphql`)
      .set('Authorization', 'Bearer ' + invalidUserToken)
      .send(payload)
      .expect(403);
  });

  // Test: GraphQL, Create User
  test('(+) GraphQL Create User: Successful', async () => {
    const user = {
      name: 'Ariana Grande',
      email: 'ariana.grande@gmail.com',
      password: 'Ariana123',
    };

    const query = `
      mutation CreateUser(
        $name: String!
        $email: String!
        $password: String!
      ) {
        createUser(name: $name, email: $email, password: $password) {
          name
          email
        }
      }
    `;
    const variables = {
      name: user.name,
      email: user.email,
      password: user.password,
    };
    const payload = {
      query: query,
      variables: variables,
    };
    await supertest(app)
      .post(`/graphql`)
      .set('Authorization', 'Bearer ' + userToken)
      .send(payload)
      .expect(200)
      .then((response) => {
        // Check the response data
        expect(response.body['data']['createUser'].name).toBe(user.name);
        expect(response.body['data']['createUser'].email).toBe(user.email);
      });
  });

  // Test: GraphQL, Update User
  test('(-) GraphQL Update User: Missing Auth Header', async () => {
    const user = {
      id: 2,
      name: 'Taylor Swift',
      email: 'taylor.swift@gmail.com',
    };

    const query = `
      mutation UpdateUser(
        $updateUserId: Int!
        $name: String
        $email: String
      ) {
        updateUser(id: $updateUserId, name: $name, email: $email) {
          name
          email
        }
      }
    `;
    const variables = {
      updateUserId: user.id,
      name: user.name,
      email: user.email,
    };
    const payload = {
      query: query,
      variables: variables,
    };
    await supertest(app).post(`/graphql`).send(payload).expect(401);
  });

  // Test: GraphQL, Update User
  test('(-) GraphQL Update User: Invalid Auth Header', async () => {
    const user = {
      id: 2,
      name: 'Taylor Swift',
      email: 'taylor.swift@gmail.com',
    };

    const query = `
      mutation UpdateUser(
        $updateUserId: Int!
        $name: String
        $email: String
      ) {
        updateUser(id: $updateUserId, name: $name, email: $email) {
          name
          email
        }
      }
    `;
    const variables = {
      updateUserId: user.id,
      name: user.name,
      email: user.email,
    };
    const payload = {
      query: query,
      variables: variables,
    };
    await supertest(app)
      .post(`/graphql`)
      .set('Authorization', 'Bearer ' + invalidUserToken)
      .send(payload)
      .expect(403);
  });

  // Test: GraphQL, Update User
  test('(-) GraphQL Update User: User Not Found', async () => {
    const user = {
      id: 99,
      name: 'Taylor Swift',
      email: 'taylor.swift@gmail.com',
    };

    const query = `
      mutation UpdateUser(
        $updateUserId: Int!
        $name: String
        $email: String
      ) {
        updateUser(id: $updateUserId, name: $name, email: $email) {
          name
          email
        }
      }
    `;
    const variables = {
      updateUserId: user.id,
      name: user.name,
      email: user.email,
    };
    const payload = {
      query: query,
      variables: variables,
    };
    await supertest(app)
      .post(`/graphql`)
      .set('Authorization', 'Bearer ' + userToken)
      .send(payload)
      .expect(200)
      .then((response) => {
        // Check the response data
        expect(response.body['data']).toBe(null);
      });
  });

  // Test: GraphQL, Update User
  test('(+) GraphQL Update User: Successful', async () => {
    const user = {
      id: 2,
      name: 'Taylor Swift',
      email: 'taylor.swift@gmail.com',
    };

    const query = `
      mutation UpdateUser(
        $updateUserId: Int!
        $name: String
        $email: String
      ) {
        updateUser(id: $updateUserId, name: $name, email: $email) {
          name
          email
        }
      }
    `;
    const variables = {
      updateUserId: user.id,
      name: user.name,
      email: user.email,
    };
    const payload = {
      query: query,
      variables: variables,
    };
    await supertest(app)
      .post(`/graphql`)
      .set('Authorization', 'Bearer ' + userToken)
      .send(payload)
      .expect(200)
      .then((response) => {
        // Check the response data
        expect(response.body['data']['updateUser'].name).toBe(user.name);
        expect(response.body['data']['updateUser'].email).toBe(user.email);
      });
  });

  // Test: GraphQL, Get All Users
  test('(-) GraphQL Get All Users: Missing Auth Header', async () => {
    const query = gql`
      query Users {
        users {
          name
          email
        }
      }
    `;
    await supertest(app).post(`/graphql`).send(query).expect(401);
  });

  // Test: GraphQL, Get All Users
  test('(-) GraphQL Get All Users: Invalid Auth Header', async () => {
    const query = gql`
      query Users {
        users {
          name
          email
        }
      }
    `;
    await supertest(app)
      .post(`/graphql`)
      .set('Authorization', 'Bearer ' + invalidUserToken)
      .send(query)
      .expect(403);
  });

  // Test: GraphQL, Get All Users
  test('(+) GraphQL Get All Users: Successful', async () => {
    const query = `
      query Users {
        users {
          name
          email
        }
      }
    `;
    const payload = {
      query: query,
    };
    await supertest(app)
      .post(`/graphql`)
      .set('Authorization', 'Bearer ' + userToken)
      .send(payload)
      .expect(200)
      .then((response) => {
        // Check the response data
        expect(Array.isArray(response.body['data']['users'])).toBeTruthy();
        expect(response.body['data']['users'].length).toBe(1);
      });
  });

  // Test: GraphQL, Get User by ID
  test('(-) GraphQL Get User by ID: Missing Auth Header', async () => {
    const user = {
      id: 2,
      name: 'Taylor Swift',
      email: 'taylor.swift@gmail.com',
    };

    const query = `
      query UserById($userByIdId: Int!) {
        userById(id: $userByIdId) {
          name
          email
        }
      }
    `;
    const variables = {
      userByIdId: user.id,
    };
    const payload = {
      query: query,
      variables: variables,
    };
    await supertest(app).post(`/graphql`).send(payload).expect(401);
  });

  // Test: GraphQL, Get User by ID
  test('(-) GraphQL Get User by ID: Invalid Auth Header', async () => {
    const user = {
      id: 2,
      name: 'Taylor Swift',
      email: 'taylor.swift@gmail.com',
    };

    const query = `
      query UserById($userByIdId: Int!) {
        userById(id: $userByIdId) {
          name
          email
        }
      }
    `;
    const variables = {
      userByIdId: user.id,
    };
    const payload = {
      query: query,
      variables: variables,
    };
    await supertest(app)
      .post(`/graphql`)
      .set('Authorization', 'Bearer ' + invalidUserToken)
      .send(payload)
      .expect(403);
  });

  // Test: GraphQL, Get User by ID
  test('(-) GraphQL Get User by ID: User Not Found', async () => {
    const user = {
      id: 99,
      name: 'Taylor Swift',
      email: 'taylor.swift@gmail.com',
    };

    const query = `
      query UserById($userByIdId: Int!) {
        userById(id: $userByIdId) {
          name
          email
        }
      }
    `;
    const variables = {
      userByIdId: user.id,
    };
    const payload = {
      query: query,
      variables: variables,
    };
    await supertest(app)
      .post(`/graphql`)
      .set('Authorization', 'Bearer ' + userToken)
      .send(payload)
      .expect(200)
      .then((response) => {
        // Check the response data
        expect(response.body['data']['userById']).toBe(null);
      });
  });

  // Test: GraphQL, Get User by ID
  test('(+) GraphQL Get User by ID: Successful', async () => {
    const user = {
      id: 2,
      name: 'Taylor Swift',
      email: 'taylor.swift@gmail.com',
    };

    const query = `
      query UserById($userByIdId: Int!) {
        userById(id: $userByIdId) {
          name
          email
        }
      }
    `;
    const variables = {
      userByIdId: user.id,
    };
    const payload = {
      query: query,
      variables: variables,
    };
    await supertest(app)
      .post(`/graphql`)
      .set('Authorization', 'Bearer ' + userToken)
      .send(payload)
      .expect(200)
      .then((response) => {
        // Check the response data
        expect(response.body['data']['userById'].name).toBe(user.name);
        expect(response.body['data']['userById'].email).toBe(user.email);
      });
  });

  // Test: GraphQL, Delete User
  test('(-) GraphQL Delete User: Missing Auth Header', async () => {
    const user = {
      id: 2,
    };

    const query = `
      mutation DeleteUser($deleteUserId: Int!) {
        deleteUser(id: $deleteUserId)
      }
    `;
    const variables = {
      deleteUserId: user.id,
    };
    const payload = {
      query: query,
      variables: variables,
    };
    await supertest(app).post(`/graphql`).send(payload).expect(401);
  });

  // Test: GraphQL, Delete User
  test('(-) GraphQL Delete User: Invalid Auth Header', async () => {
    const user = {
      id: 2,
    };

    const query = `
      mutation DeleteUser($deleteUserId: Int!) {
        deleteUser(id: $deleteUserId)
      }
    `;
    const variables = {
      deleteUserId: user.id,
    };
    const payload = {
      query: query,
      variables: variables,
    };
    await supertest(app)
      .post(`/graphql`)
      .set('Authorization', 'Bearer ' + invalidUserToken)
      .send(payload)
      .expect(403);
  });

  // Test: GraphQL, Delete User
  test('(-) GraphQL Delete User: User Not Found', async () => {
    const user = {
      id: 99,
    };

    const query = `
      mutation DeleteUser($deleteUserId: Int!) {
        deleteUser(id: $deleteUserId)
      }
    `;
    const variables = {
      deleteUserId: user.id,
    };
    const payload = {
      query: query,
      variables: variables,
    };
    await supertest(app)
      .post(`/graphql`)
      .set('Authorization', 'Bearer ' + userToken)
      .send(payload)
      .expect(200)
      .then((response) => {
        // Check the response data
        expect(response.body['data']['deleteUser']).toBe('User not found');
      });
  });

  // Test: GraphQL, Delete User
  test('(+) GraphQL Delete User: Successful', async () => {
    const user = {
      id: 2,
    };

    const query = `
      mutation DeleteUser($deleteUserId: Int!) {
        deleteUser(id: $deleteUserId)
      }
    `;
    const variables = {
      deleteUserId: user.id,
    };
    const payload = {
      query: query,
      variables: variables,
    };
    await supertest(app)
      .post(`/graphql`)
      .set('Authorization', 'Bearer ' + userToken)
      .send(payload)
      .expect(200)
      .then((response) => {
        // Check the response data
        console.log(response.body['data']);
        expect(response.body['data']['deleteUser']).toBe(
          'User deleted successfully',
        );
      });
  });
});
