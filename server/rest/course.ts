export const routes = {
  'Query.courses': {
    method: 'GET',
    path: '/courses',
    responseStatus: 200,
    tags: ['Course'],
    description: 'Get all courses.',
  },
  'Query.courseById': {
    method: 'GET',
    path: '/course/:id',
    responseStatus: 200,
    tags: ['Course'],
    description: 'Get a course by the course id.',
  },
  'Mutation.createCourse': {
    method: 'POST',
    path: '/course',
    responseStatus: 200,
    tags: ['Course'],
    description: 'Get a course by the course id.',
  },
  'Mutation.updateCourse': {
    method: 'PUT',
    path: '/course/:id',
    responseStatus: 200,
    tags: ['Course'],
    description: 'Get a course by the course id.',
  },
  'Mutation.deleteCourse': {
    method: 'DELETE',
    path: '/course/:id',
    responseStatus: 200,
    tags: ['Course'],
    description: 'Get a course by the course id.',
  },
};
