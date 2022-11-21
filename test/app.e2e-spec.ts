import { Express } from 'express-serve-static-core';
import createServer from '../server/server';
import gql from 'graphql-tag';
import supertest from 'supertest';
import request from 'supertest-graphql';
import db from '../server/models';

let app: Express;
let userToken = null;

describe('AppController (e2e)', () => {
  let thisDb: any = db;

  beforeAll(async () => {
    app = await createServer();
    await thisDb.sequelize.sync({ force: true })
  });

  // // Test: REST API, Create User
  test("REST Create User", async () => {
    const user = {
      name: "James Bond",
      email: "james.bond@domain.com",
      password: "James123"
    };
    await supertest(app)
      .post(`/api/user`)
      .send(user)
      .expect(200)
      .then((response) => {
        // Check the response data			
        expect(response.body.name).toBe(user.name);
        expect(response.body.email).toBe(user.email);
      });
  });

  // // Test: REST API, Create User
  test("Login to User", async () => {
    const user = {
      email: "james.bond@domain.com",
      password: "James123"
    };
    await supertest(app)
      .post(`/api/login`)
      .send(user)
      .expect(200)
      .then((response) => {
        // Check the response data			
        console.log(response);
        expect(response.body.email).toBe(user.email);
      });
  });

  /*
    // Test: REST API, Update User
    test("REST Update User", async () => {
      const user = {
        id: 1,
        name: "Mariah Carey",
        email: "mariah.carey@gmail.com"
      };
      await supertest(app)
        .put(`/api/user/${user.id}`)
        .send(user)
        .expect(200)
        .then((response) => {
          // Check the response data			
          expect(response.body.name).toBe(user.name);
          expect(response.body.email).toBe(user.email);
        });
    });
  
    // Test: REST API, Get All Users
    test("REST Get All Users", async () => {
      await supertest(app)
        .get("/api/users")
        .expect(200)
        .then((response) => {
          // Check the response type and length
          expect(Array.isArray(response.body)).toBeTruthy();
          expect(response.body.length).toBe(1);
        });
    });
  
    // // Test: REST API, Get User by ID
    test("REST Get User by ID", async () => {
      const user = {
        id: 1,
        name: "Mariah Carey",
        email: "mariah.carey@gmail.com"
      };
      await supertest(app)
        .get(`/api/user/${user.id}`)
        .expect(200)
        .then((response) => {
          // Check the response data			
          expect(response.body.name).toBe(user.name);
          expect(response.body.email).toBe(user.email);
        });
    });
  
    // // Test: REST API, Delete User
    test("REST Delete User", async () => {
      const user = {
        id: 1
      };
      await supertest(app)
        .delete(`/api/user/${user.id}`)
        .expect(200)
        .then((response) => {
          // Check the response data
          expect(response.body).toBe("1");
        });
    });
  
    // Test: GraphQL, Create User
    test("GraphQL Create User", async () => {
      const user = {
        name: "Ariana Grande",
        email: "ariana.grande@gmail.com",
        password: "Ariana123"
      };
  
      const { data } = await request(app)
        .mutate(gql`
                  mutation CreateUser($name: String!, $email: String!, $password: String!) {
                      createUser(name: $name, email: $email, password: $password) {
                          name
                          email										
                      }
                  }
              `)
        .variables({
          name: user.name,
          email: user.email,
          password: user.password
        })
        .expectNoErrors();
  
      expect(data["createUser"].name).toBe(user.name);
      expect(data["createUser"].email).toBe(user.email);
    });
  
    // Test: GraphQL, Update User
    test("GraphQL Update User", async () => {
      const user = {
        id: 2,
        name: "Taylor Swift",
        email: "taylor.swift@gmail.com"
      };
  
      const { data } = await request(app)
        .mutate(gql`
                  mutation UpdateUser($updateUserId: Int!, $name: String, $email: String) {
                      updateUser(id: $updateUserId, name: $name, email: $email) {
                          name
                          email
                      }
                  }
              `)
        .variables({
          updateUserId: user.id,
          name: user.name,
          email: user.email
        })
        .expectNoErrors();
  
      expect(data["updateUser"].name).toBe(user.name);
      expect(data["updateUser"].email).toBe(user.email);
    });
  
    // Test: GraphQL, Get All Users
    test("GraphQL Get All Users", async () => {
      const { data } = await request(app)
        .query(gql`
                  query Users {
                      users {
                          name
                          email
                      }
                  }
              `)
        .expectNoErrors();
  
      expect(Array.isArray(data["users"])).toBeTruthy();
      expect(data["users"].length).toBe(1);
    });
  
    // Test: GraphQL, Get User by ID
    test("GraphQL Get User by ID", async () => {
      const user = {
        id: 2,
        name: "Taylor Swift",
        email: "taylor.swift@gmail.com"
      };
      const { data } = await request(app)
        .query(gql`
                  query UserById($userByIdId: Int!) {
                      userById(id: $userByIdId) {
                          name
                          email
                      }
                  }`
        )
        .variables({
          userByIdId: user.id
        })
        .expectNoErrors();
  
      expect(data["userById"].name).toBe(user.name);
      expect(data["userById"].email).toBe(user.email);
    });
  
    // Test: GraphQL, Delete User
    test("GraphQL Delete User", async () => {
      const user = {
        id: 2
      };
  
      const { data } = await request(app)
        .mutate(gql`
                  mutation DeleteUser($deleteUserId: Int!) {
                      deleteUser(id: $deleteUserId)
                  }
              `)
        .variables({
          deleteUserId: user.id
        })
        .expectNoErrors();
  
      expect(data["deleteUser"]).toBe("1");
    });*/
});
