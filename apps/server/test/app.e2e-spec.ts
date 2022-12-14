import { Express } from 'express-serve-static-core';
import createServer from '../src/server';
import supertest from 'supertest';
import Analytics from 'analytics-node';
import AppAnalytics from '../src/services/analytics';

let app: Express;
let userToken = null;
let invalidUserToken = '12345-67890';

// Mocking: Segment
jest.mock('analytics-node');
const mockSegment = Analytics as jest.MockedClass<typeof Analytics>;

jest.setTimeout(100000);
const unique = Date.now();

describe('AppController (e2e)', () => {
  let token = '';
  let userId = -1;
  let userIdGQL = -1;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(async () => {
    app = await createServer();
  });

  afterAll(async () => {
    jest.resetAllMocks();
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
    await supertest(app).post(`/api/user`).send(user).expect(500);
  });

  // Test: REST API, Create User
  test('(-) REST Create User: Missing Email', async () => {
    const user = {
      name: 'James Bond',
      password: 'James123',
    };
    await supertest(app).post(`/api/user`).send(user).expect(500);
  });

  // Test: REST API, Create User
  test('(-) REST Create User: Missing Password', async () => {
    const user = {
      name: 'James Bond',
      email: 'james.bond@domain.com',
    };
    await supertest(app).post(`/api/user`).send(user).expect(500);
  });

  // Test: REST API, Create User
  test('(+) REST Create User: Successful', async () => {
    const user = {
      name: 'James Bond',
      email: `james.bond.${unique}@domain.com`,
      password: 'James123',
    };
    await supertest(app)
      .post(`/api/user`)
      .send(user)
      .expect(200)
      .then((response) => {
        // Check the response data
        expect(response.body.name).toBe(user.name);
        expect(response.body.email).toBe(user.email);
        expect(response.body.password).toBe(null);
        userId = response.body.id;
      });
  });

  // Test: REST API, Login
  test('(-) REST Login: Missing Email', async () => {
    const loginData = {
      password: 'James123',
    };
    await supertest(app)
      .post(`/api/login`)
      .send(loginData)
      .expect(500)
      .then((response) => {
        // Check the response data
        expect(response.error).toHaveProperty('text');
        expect(response.error['text']).toContain(
          'Variable \\"$email\\" of required type \\"String!\\" was not provided.'
        );
      });
  });

  // Test: REST API, Login
  test('(-) REST Login: Missing Password', async () => {
    const loginData = {
      email: `james.bond.${unique}@domain.com`,
    };
    await supertest(app)
      .post(`/api/login`)
      .send(loginData)
      .expect(500)
      .then((response) => {
        // Check the response data
        expect(response.error).toHaveProperty('text');
        expect(response.error['text']).toContain(
          'Variable \\"$password\\" of required type \\"String!\\" was not provided.'
        );
      });
  });

  // Test: REST API, Login
  test('(-) REST Login: User Not Found', async () => {
    const loginData = {
      email: `anita.bond${unique}@gmail.com`,
      password: 'Anita123',
    };
    await supertest(app)
      .post(`/api/login`)
      .send(loginData)
      .expect(401)
      .then((response) => {
        // Check the response data
        expect(response.error).toHaveProperty('text');
        expect(response.error['text']).toContain('User not found');
      });
  });

  // Test: REST API, Login
  test('(-) REST Login: Invalid Password', async () => {
    const loginData = {
      email: `james.bond.${unique}@domain.com`,
      password: 'James123456',
    };
    await supertest(app)
      .post(`/api/login`)
      .send(loginData)
      .expect(401)
      .then((response) => {
        // Check the response data
        expect(response.error).toHaveProperty('text');
        expect(response.error['text']).toContain('Invalid password');
      });
  });

  // Test: REST API, Login
  test('(+) REST Login: Successful', async () => {
    const user = {
      email: `james.bond.${unique}@domain.com`,
      password: 'James123',
    };
    await supertest(app)
      .post(`/api/login`)
      .send(user)
      .expect(200)
      .then((response) => {
        expect(response.body.token != null).toBe(true);
        expect(response.body.userId).toBe(userId);
        expect(response.body.password).toBe(undefined);
        token = response.body.token;
      });
  });

  // Test: REST API, Update User
  test('(-) REST Update User: Missing Auth Header', async () => {
    const user = {
      id: 1,
      name: 'Mariah Carey',
      email: `mariah.carey${unique}@gmail.com`,
    };
    await supertest(app)
      .put(`/api/user/${user.id}`)
      .auth(invalidUserToken, { type: 'bearer' })
      .expect(403);
  });

  // Test: REST API, Update User
  test('(-) REST Update User: Invalid Auth Header', async () => {
    const user = {
      id: 1,
      name: 'Mariah Carey',
      email: `mariah.carey${unique}@gmail.com`,
    };
    await supertest(app)
      .put(`/api/user/${user.id}`)
      .auth(invalidUserToken, { type: 'bearer' })
      .expect(403);
  });

  // Test: REST API, Update User
  test('(-) REST Update User: User Not Found', async () => {
    const user = {
      id: 999999,
      name: 'Anita Smith',
      email: 'anita.smith@gmail.com',
    };
    await supertest(app)
      .put(`/api/user/${user.id}`)
      .auth(token, { type: 'bearer' })
      .expect(500)
      .then((response) => {
        // Check the response data
        expect(response.error['text']).toContain('not found');
      });
  });

  // Test: REST API, Update User
  test('(+) REST Update User: Successful', async () => {
    const user = {
      id: userId,
      name: 'Mariah Carey',
      email: `mariah.carey${unique}@gmail.com`,
    };
    await supertest(app)
      .put(`/api/user/${user.id}`)
      .auth(token, { type: 'bearer' })
      .send(user)
      //.expect(200)
      .then((response) => {
        // Check the response data
        expect(response.body.name).toBe(user.name);
        expect(response.body.email).toBe(user.email);
        expect(response.body.password).toBe(null);
      });
  });

  // Test: REST API, Get All Users
  test('(-) REST Get All Users: Missing Auth Header', async () => {
    await supertest(app).get('/api/users').expect(401);
  });

  // Test: REST API, Get All Users
  test('(-) REST Get All Users: Invalid Auth Header', async () => {
    await supertest(app).get('/api/users').auth(invalidUserToken, { type: 'bearer' }).expect(403);
  });

  // Test: REST API, Get All Users
  test('(+) REST Get All Users: Successful', async () => {
    await supertest(app)
      .get('/api/users')
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then((response) => {
        // Check the response type and length
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).not.toBe(0);
      });
  });

  // Test: REST API, Get User by ID
  test('(-) REST Get User by ID: Missing Auth Header', async () => {
    const user = {
      id: userId,
      name: 'Mariah Carey',
      email: `mariah.carey${unique}@gmail.com`,
    };
    await supertest(app).get(`/api/user/${user.id}`).expect(401);
  });

  // Test: REST API, Get User by ID
  test('(-) REST Get User by ID: Invalid Auth Header', async () => {
    const user = {
      id: userId,
      name: 'Mariah Carey',
      email: `mariah.carey${unique}@gmail.com`,
    };
    await supertest(app)
      .get(`/api/user/${user.id}`)
      .auth(invalidUserToken, { type: 'bearer' })
      .expect(403);
  });

  // Test: REST API, Get User by ID
  test('(-) REST Get User by ID: User Not Found', async () => {
    const user = {
      id: 999999,
    };
    await supertest(app).get(`/api/user/${user.id}`).auth(token, { type: 'bearer' }).expect(500);
  });

  // Test: REST API, Get User by ID
  test('(+) REST Get User by ID: Successful', async () => {
    const user = {
      id: userId,
      name: 'Mariah Carey',
      email: `mariah.carey${unique}@gmail.com`,
    };
    await supertest(app)
      .get(`/api/user/${user.id}`)
      .auth(token, { type: 'bearer' })
      //.expect(200)
      .then((response) => {
        // Check the response data
        expect(response.body.name).toBe(user.name);
        expect(response.body.email).toBe(user.email);
        expect(response.body.password).toBe(null);
      });
  });

  // Test: REST API, Delete User
  test('(-) REST Delete User: Missing Auth Header', async () => {
    const user = {
      id: userId,
    };
    await supertest(app).delete(`/api/user/${user.id}`).expect(401);
  });

  // Test: REST API, Delete User
  test('(-) REST Delete User: Invalid Auth Header', async () => {
    const user = {
      id: userId,
    };
    await supertest(app)
      .delete(`/api/user/${user.id}`)
      .auth(invalidUserToken, { type: 'bearer' })
      .expect(403);
  });

  // Test: REST API, Delete User
  test('(-) REST Delete User: User Not Found', async () => {
    const user = {
      id: -1,
    };
    await supertest(app)
      .delete(`/api/user/${user.id}`)
      .auth(token, { type: 'bearer' })
      .expect(500)
      .then((response) => {
        // Check the response data
        expect(response.error['text']).toContain('not exist');
      });
  });

  // Test: REST API, Delete User
  test('(+) REST Delete User: Successful', async () => {
    const user = {
      id: userId,
    };
    await supertest(app)
      .delete(`/api/user/${user.id}`)
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then((response) => {
        // Check the response data
        expect(response.body.id).toBe(user.id);
        expect(response.body.password).toBe(null);
      });
  });

  // Test: GraphQL, Create User
  test('(+) GraphQL Create User: Successful', async () => {
    const user = {
      name: 'Anita Bond',
      email: `anita.bond${unique}@gmail.com`,
      password: 'Anita123',
    };

    const query = `
            mutation CreateUser(
              $name: String!
              $email: String!
              $password: String!
            ) {
              createUser(name: $name, email: $email, password: $password) {
                id
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
      .auth(token, { type: 'bearer' })
      .send(payload)
      .expect(200)
      .then((response) => {
        // Check the response data
        expect(response.body['data']['createUser'].name).toBe(user.name);
        expect(response.body['data']['createUser'].email).toBe(user.email);
        userIdGQL = response.body['data']['createUser'].id;
      });
  });

  // Test: GraphQL, Update User
  test('(-) GraphQL Update User: Missing Auth Header', async () => {
    const user = {
      id: userIdGQL,
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
      .send(payload)
      .expect(401)
      .then((response) => {
        // Check the response data
        expect(response.body['errors'][0].message).toBe('User is not authenticated');
      });
  });

  // Test: GraphQL, Update User
  test('(-) GraphQL Update User: Invalid Auth Header', async () => {
    const user = {
      id: userIdGQL,
      name: 'Taylor Swift',
      email: `taylor.swift${unique}@gmail.com`,
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
      .auth(invalidUserToken, { type: 'bearer' })
      .send(payload)
      .expect(403)
      .then((response) => {
        // Check the response data
        expect(response.body['errors'][0].message).toBe('Authentication Token Invalid');
      });
  });

  // Test: GraphQL, Update User
  test('(-) GraphQL Update User: User Not Found', async () => {
    const user = {
      id: 999999,
      name: 'Taylor Swift',
      email: `taylor.swift${unique}@gmail.com`,
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
      .auth(token, { type: 'bearer' })
      .send(payload)
      .expect(500)
      .then((response) => {
        // Check the response data
        expect(response.body['data']).toBe(null);
      });
  });

  // Test: GraphQL, Update User
  test('(-) GraphQL Update User: Send id null', async () => {
    const user = {
      id: null,
      name: 'Taylor Swift',
      email: `taylor.swift${unique}@gmail.com`,
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
      .auth(token, { type: 'bearer' })
      .send(payload)
      .expect(500)
      .then((response) => {
        // Check the response data
        expect(response.body['data']).toBeUndefined();
      });
  });

  // Test: GraphQL, Update User
  test('(+) GraphQL Update User: Successful', async () => {
    const user = {
      id: userIdGQL,
      name: 'Taylor Swift',
      email: `taylor.swift${unique}@gmail.com`,
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
      .send(payload)
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then((response) => {
        // Check the response data
        expect(response.body['data']['updateUser'].name).toBe(user.name);
        expect(response.body['data']['updateUser'].email).toBe(user.email);
      });
  });

  // Test: GraphQL, Get All Users
  test('(-) GraphQL Get All Users: Missing Auth Header', async () => {
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
      .send(payload)
      .expect(401)
      .then((response) => {
        // Check the response data
        expect(response.body['errors'][0].message).toBe('User is not authenticated');
      });
  });

  // Test: GraphQL, Get All Users
  test('(-) GraphQL Get All Users: Invalid Auth Header', async () => {
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
      .send(payload)
      .auth(invalidUserToken, { type: 'bearer' })
      .expect(403)
      .then((response) => {
        // Check the response data
        expect(response.body['errors'][0].message).toBe('Authentication Token Invalid');
      });
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
      .auth(token, { type: 'bearer' })
      .send(payload)
      .expect(200)
      .then((response) => {
        // Check the response data
        expect(Array.isArray(response.body['data']['users'])).toBeTruthy();
        expect(response.body['data']['users'].length).not.toBe(0);
      });
  });

  // Test: GraphQL, Get User by ID
  test('(-) GraphQL Get User by ID: Missing Auth Header', async () => {
    const user = {
      id: userIdGQL,
      name: 'Taylor Swift',
      email: `taylor.swift${unique}@gmail.com`,
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
      .send(payload)
      .expect(401)
      .then((response) => {
        // Check the response data
        expect(response.body['errors'][0].message).toBe('User is not authenticated');
      });
  });

  // Test: GraphQL, Get User by ID
  test('(-) GraphQL Get User by ID: Invalid Auth Header', async () => {
    const user = {
      id: userIdGQL,
      name: 'Taylor Swift',
      email: `taylor.swift${unique}@gmail.com`,
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
      .auth(invalidUserToken, { type: 'bearer' })
      .send(payload)
      .expect(403)
      .then((response) => {
        // Check the response data
        expect(response.body['errors'][0].message).toBe('Authentication Token Invalid');
      });
  });

  // Test: GraphQL, Get User by ID
  test('(-) GraphQL Get User by ID: User Not Found', async () => {
    const user = {
      id: 999999,
      name: 'Taylor Swift',
      email: `taylor.swift${unique}@gmail.com`,
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
      .auth(token, { type: 'bearer' })
      .send(payload)
      .expect(500)
      .then((response) => {
        // Check the response data
        expect(response.body['data']['userById']).toBe(null);
      });
  });

  // Test: GraphQL, Get User by ID
  test('(+) GraphQL Get User by ID: Successful', async () => {
    const user = {
      id: userIdGQL,
      name: 'Taylor Swift',
      email: `taylor.swift${unique}@gmail.com`,
    };

    const query = `
          query UserById($userByIdId: Int!) {
            userById(id: $userByIdId) {
              name
              email
              password
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
      .auth(token, { type: 'bearer' })
      .send(payload)
      .expect(200)
      .then((response) => {
        // Check the response data
        expect(response.body['data']['userById'].name).toBe(user.name);
        expect(response.body['data']['userById'].email).toBe(user.email);
        expect(response.body['data']['userById'].password).toBe(null);
      });
  });

  // Test: GraphQL, Delete User
  test('(-) GraphQL Delete User: Missing Auth Header', async () => {
    const user = {
      id: userIdGQL,
    };

    const query = `
          mutation DeleteUser($deleteUserId: Int!) {
            deleteUser(id: $deleteUserId) {
              id
            }
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
      .send(payload)
      .expect(401)
      .then((response) => {
        // Check the response data
        expect(response.body['errors'][0].message).toBe('User is not authenticated');
      });
  });

  // Test: GraphQL, Delete User
  test('(-) GraphQL Delete User: Invalid Auth Header', async () => {
    const user = {
      id: userIdGQL,
    };

    const query = `
          mutation DeleteUser($deleteUserId: Int!) {
            deleteUser(id: $deleteUserId) {
              id
            }
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
      .auth(invalidUserToken, { type: 'bearer' })
      .send(payload)
      .expect(403)
      .then((response) => {
        // Check the response data
        expect(response.body['errors'][0].message).toBe('Authentication Token Invalid');
      });
  });

  // Test: GraphQL, Delete User
  test('(-) GraphQL Delete User: User Not Found', async () => {
    const user = {
      id: 999999,
    };

    const query = `
          mutation DeleteUser($deleteUserId: Int!) {
            deleteUser(id: $deleteUserId) {
              id
            }
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
      .auth(token, { type: 'bearer' })
      .send(payload)
      .expect(500)
      .then((response) => {
        // Check the response data
        expect(response.body['errors'][0].message).toContain('not exist');
      });
  });

  // Test: GraphQL, Delete User
  test('(+) GraphQL Delete User: Successful', async () => {
    const user = {
      id: userIdGQL,
    };

    const query = `
          mutation DeleteUser($deleteUserId: Int!) {
            deleteUser(id: $deleteUserId) {
              id
            }
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
      .auth(token, { type: 'bearer' })
      .send(payload)
      .expect(200)
      .then((response) => {
        // Check the response data
        expect(response.body['data']['deleteUser'].id).toBe(user.id);
      });
  });
});
