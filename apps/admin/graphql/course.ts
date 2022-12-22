import { gql } from './__generated__';

export const GET_ALL_COURSES = gql(`
query Courses {
    courses {
        id
        name
        points
    }
}`);

export const CREATE_COURSE = gql(`
mutation CreateCourse($userId: Int!, $name: String!, $points: Int!) {
    createCourse(userId: $userId, name: $name, points: $points) {
        id
        name
        points
    }
}
`);

export const GET_COURSE_BY_ID = gql(`query CourseById($courseByIdId: Int!) {
    courseById(id: $courseByIdId) {
      id
      name
      points
    }
}`);

export const UPDATE_COURSE =
  gql(`mutation UpdateCourse($updateCourseId: Int!, $name: String, $points: Int) {
    updateCourse(id: $updateCourseId, name: $name, points: $points) {
      id
      name
      points
    }
}`);

export const DELETE_COURSE = gql(`mutation DeleteCourse($deleteCourseId: Int!) {
    deleteCourse(id: $deleteCourseId) {
      id
    }
}`);
