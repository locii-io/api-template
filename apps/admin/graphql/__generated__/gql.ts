/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel-plugin for production.
 */
const documents = {
    "\nquery Courses {\n    courses {\n        id\n        name\n        points\n    }\n}": types.CoursesDocument,
    "\nmutation CreateCourse($userId: Int!, $name: String!, $points: Int!) {\n    createCourse(userId: $userId, name: $name, points: $points) {\n        id\n        name\n        points\n    }\n}\n": types.CreateCourseDocument,
    "query CourseById($courseByIdId: Int!) {\n    courseById(id: $courseByIdId) {\n      id\n      name\n      points\n    }\n}": types.CourseByIdDocument,
    "mutation UpdateCourse($updateCourseId: Int!, $name: String, $points: Int) {\n    updateCourse(id: $updateCourseId, name: $name, points: $points) {\n      id\n      name\n      points\n    }\n}": types.UpdateCourseDocument,
    "mutation DeleteCourse($deleteCourseId: Int!) {\n    deleteCourse(id: $deleteCourseId) {\n      id\n    }\n}": types.DeleteCourseDocument,
    "\n  query Users {\n    users {\n      id\n      name\n      email\n      isActive\n    }\n  }\n": types.UsersDocument,
    "\n  query GetUserByID($userById: Int!) {\n    userById(id: $userById) {\n      email\n      id\n      isActive\n      name\n    }\n  }\n": types.GetUserByIdDocument,
    "\nmutation CreateUser($name: String!, $email: String!, $password: String!) {\n  createUser(name: $name, email: $email, password: $password) {\n    id\n    name\n    email\n    isActive\n  }\n}": types.CreateUserDocument,
    "mutation UpdateUser($updateUserId: Int!, $name: String, $email: String, $isActive: Boolean) {\n  updateUser(id: $updateUserId, name: $name, email: $email, isActive: $isActive) {\n    id\n    name\n    email\n    isActive\n  }\n}": types.UpdateUserDocument,
    "mutation Mutation($deleteUserId: Int!) {\n  deleteUser(id: $deleteUserId) {\n    id\n  }\n}": types.MutationDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery Courses {\n    courses {\n        id\n        name\n        points\n    }\n}"): (typeof documents)["\nquery Courses {\n    courses {\n        id\n        name\n        points\n    }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation CreateCourse($userId: Int!, $name: String!, $points: Int!) {\n    createCourse(userId: $userId, name: $name, points: $points) {\n        id\n        name\n        points\n    }\n}\n"): (typeof documents)["\nmutation CreateCourse($userId: Int!, $name: String!, $points: Int!) {\n    createCourse(userId: $userId, name: $name, points: $points) {\n        id\n        name\n        points\n    }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query CourseById($courseByIdId: Int!) {\n    courseById(id: $courseByIdId) {\n      id\n      name\n      points\n    }\n}"): (typeof documents)["query CourseById($courseByIdId: Int!) {\n    courseById(id: $courseByIdId) {\n      id\n      name\n      points\n    }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation UpdateCourse($updateCourseId: Int!, $name: String, $points: Int) {\n    updateCourse(id: $updateCourseId, name: $name, points: $points) {\n      id\n      name\n      points\n    }\n}"): (typeof documents)["mutation UpdateCourse($updateCourseId: Int!, $name: String, $points: Int) {\n    updateCourse(id: $updateCourseId, name: $name, points: $points) {\n      id\n      name\n      points\n    }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation DeleteCourse($deleteCourseId: Int!) {\n    deleteCourse(id: $deleteCourseId) {\n      id\n    }\n}"): (typeof documents)["mutation DeleteCourse($deleteCourseId: Int!) {\n    deleteCourse(id: $deleteCourseId) {\n      id\n    }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Users {\n    users {\n      id\n      name\n      email\n      isActive\n    }\n  }\n"): (typeof documents)["\n  query Users {\n    users {\n      id\n      name\n      email\n      isActive\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetUserByID($userById: Int!) {\n    userById(id: $userById) {\n      email\n      id\n      isActive\n      name\n    }\n  }\n"): (typeof documents)["\n  query GetUserByID($userById: Int!) {\n    userById(id: $userById) {\n      email\n      id\n      isActive\n      name\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation CreateUser($name: String!, $email: String!, $password: String!) {\n  createUser(name: $name, email: $email, password: $password) {\n    id\n    name\n    email\n    isActive\n  }\n}"): (typeof documents)["\nmutation CreateUser($name: String!, $email: String!, $password: String!) {\n  createUser(name: $name, email: $email, password: $password) {\n    id\n    name\n    email\n    isActive\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation UpdateUser($updateUserId: Int!, $name: String, $email: String, $isActive: Boolean) {\n  updateUser(id: $updateUserId, name: $name, email: $email, isActive: $isActive) {\n    id\n    name\n    email\n    isActive\n  }\n}"): (typeof documents)["mutation UpdateUser($updateUserId: Int!, $name: String, $email: String, $isActive: Boolean) {\n  updateUser(id: $updateUserId, name: $name, email: $email, isActive: $isActive) {\n    id\n    name\n    email\n    isActive\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation Mutation($deleteUserId: Int!) {\n  deleteUser(id: $deleteUserId) {\n    id\n  }\n}"): (typeof documents)["mutation Mutation($deleteUserId: Int!) {\n  deleteUser(id: $deleteUserId) {\n    id\n  }\n}"];

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
**/
export function gql(source: string): unknown;

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;