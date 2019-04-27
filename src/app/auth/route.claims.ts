export default {
  Routes: [
    {
      routeUrl: '/',
      signInRequired: 'false',
      claims: []
    },
    {
      routeUrl: '/profile',
      signInRequired: 'true',
      claims: []
    },
    {
      routeUrl: '/queue',
      signInRequired: 'true',
      claims: ['5bead8c06767e5d3be07631c']
    },
    {
      routeUrl: '/requests',
      signInRequired: 'true',
      claims: ['5bead8c06767e5d3be07631c']
    },
    {
      routeUrl: '/trades',
      signInRequired: 'true',
      claims: ['5bead8c16767e5d3be07631d']
    },
    {
      routeUrl: '/portfo',
      signInRequired: 'true',
      claims: ['5bead8c06767e5d3be07631c']
    },
    {
      routeUrl: '/useradmin',
      signInRequired: 'true',
      claims: ['5bead8c26767e5d3be07631f']
    },
    {
      routeUrl: '/settings',
      signInRequired: 'true',
      claims: ['5cb836bcf57aa4ae4539b6fe']
    }
  ]
};
