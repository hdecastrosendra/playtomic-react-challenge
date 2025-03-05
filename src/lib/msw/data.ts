/**
 * Collection of mock-data for tests and development environments.
 */
import type { Match, User } from '@/lib/api-types'

type MockData =
  | { type: 'auth'; data: { email: string; password: string } }
  | { type: 'user'; data: User }
  | { type: 'match'; data: Match }

export const data: MockData[] = [
  { type: 'auth', data: { email: 'alice@playtomic.io', password: 'MySuperSecurePassword' } },
  {
    type: 'user',
    data: {
      userId: 'c0ed36c0-6c59-48d4-a168-b6076cec52a0',
      displayName: 'Alice',
      email: 'alice@playtomic.io',
      pictureURL: 'https://i.pravatar.cc/150?img=c0ed36c0-6c59-48d4-a168-b6076cec52a0',
    },
  },
  {
    type: 'user',
    data: {
      userId: '237443be-0b18-446a-9cbd-691627b84ef0',
      displayName: 'Bob',
      email: 'bob@playtomic.io',
      pictureURL: null,
    },
  },
  {
    type: 'user',
    data: {
      userId: 'df1d0005-ec56-4292-b223-2713e84c9325',
      displayName: 'Charlie',
      email: 'alice@playtomic.io',
      pictureURL: 'https://i.pravatar.cc/150?img=df1d0005-ec56-4292-b223-2713e84c9325',
    },
  },
  {
    type: 'user',
    data: {
      userId: '98134a8b-32b7-4e89-89a3-57d3b2d8e1e7',
      displayName: 'David',
      email: 'david@playtomic.io',
      pictureURL: null,
    },
  },
  {
    type: 'user',
    data: {
      userId: '6f39d7d8-1a7c-4ed7-bf9d-82b0ed2d35c4',
      displayName: 'Eva',
      email: 'eva@playtomic.io',
      pictureURL: 'https://i.pravatar.cc/150?img=6f39d7d8-1a7c-4ed7-bf9d-82b0ed2d35c4',
    },
  },
  {
    type: 'user',
    data: {
      userId: '7b15e727-7c11-40e8-9c77-8a3f10d058c2',
      displayName: 'Frank',
      email: 'frank@playtomic.io',
      pictureURL: 'https://i.pravatar.cc/150?img=7b15e727-7c11-40e8-9c77-8a3f10d058c2',
    },
  },
  {
    type: 'match',
    data: {
      matchId: '002',
      courtId: '7a7ff0e4-076f-405b-b1f7-8d41a9b3f6a0',
      venueId: '85b1d53d-1d8b-47c8-b2cd-06a32c6cf905',
      sport: 'TENNIS',
      startDate: '2024-01-04T09:00Z',
      endDate: '2024-01-04T11:00Z',
      teams: [
        {
          id: '1',
          players: [
            {
              userId: 'c0ed36c0-6c59-48d4-a168-b6076cec52a0',
              displayName: 'Alice',
              email: 'alice@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=c0ed36c0-6c59-48d4-a168-b6076cec52a0',
            },
            {
              userId: '237443be-0b18-446a-9cbd-691627b84ef0',
              displayName: 'Bob',
              email: 'bob@playtomic.io',
              pictureURL: null,
            },
          ],
        },
        {
          id: '2',
          players: [
            {
              userId: 'df1d0005-ec56-4292-b223-2713e84c9325',
              displayName: 'Charlie',
              email: 'alice@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=df1d0005-ec56-4292-b223-2713e84c9325',
            },
            {
              userId: '98134a8b-32b7-4e89-89a3-57d3b2d8e1e7',
              displayName: 'David',
              email: 'david@playtomic.io',
              pictureURL: null,
            },
          ],
        },
      ],
    },
  },
  {
    type: 'match',
    data: {
      matchId: '003',
      courtId: 'b1164649-2437-439d-a761-3b24c34c2b2d',
      venueId: 'f79ae5d5-420f-49f0-bcd6-2406f0a2f5d4',
      sport: 'PADEL',
      startDate: '2024-01-05T14:00Z',
      endDate: '2024-01-05T16:00Z',
      teams: [
        {
          id: '1',
          players: [
            {
              userId: '6f39d7d8-1a7c-4ed7-bf9d-82b0ed2d35c4',
              displayName: 'Eva',
              email: 'eva@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=6f39d7d8-1a7c-4ed7-bf9d-82b0ed2d35c4',
            },
            {
              userId: '7b15e727-7c11-40e8-9c77-8a3f10d058c2',
              displayName: 'Frank',
              email: 'frank@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=7b15e727-7c11-40e8-9c77-8a3f10d058c2',
            },
          ],
        },
        {
          id: '2',
          players: [
            {
              userId: '98134a8b-32b7-4e89-89a3-57d3b2d8e1e7',
              displayName: 'David',
              email: 'david@playtomic.io',
              pictureURL: null,
            },
            {
              userId: 'df1d0005-ec56-4292-b223-2713e84c9325',
              displayName: 'Charlie',
              email: 'alice@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=df1d0005-ec56-4292-b223-2713e84c9325',
            },
          ],
        },
      ],
    },
  },
  {
    type: 'match',
    data: {
      matchId: '004',
      courtId: '29b78f8e-cd8e-4c3b-98c0-5fd35000f512',
      venueId: '1f7f0362-9279-4982-8a7b-fa1b97a96f99',
      sport: 'TENNIS',
      startDate: '2024-01-06T19:00Z',
      endDate: '2024-01-06T21:00Z',
      teams: [
        {
          id: '1',
          players: [
            {
              userId: '7b15e727-7c11-40e8-9c77-8a3f10d058c2',
              displayName: 'Frank',
              email: 'frank@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=7b15e727-7c11-40e8-9c77-8a3f10d058c2',
            },
            {
              userId: '6f39d7d8-1a7c-4ed7-bf9d-82b0ed2d35c4',
              displayName: 'Eva',
              email: 'eva@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=6f39d7d8-1a7c-4ed7-bf9d-82b0ed2d35c4',
            },
          ],
        },
        {
          id: '2',
          players: [
            {
              userId: 'df1d0005-ec56-4292-b223-2713e84c9325',
              displayName: 'Charlie',
              email: 'alice@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=df1d0005-ec56-4292-b223-2713e84c9325',
            },
            {
              userId: '98134a8b-32b7-4e89-89a3-57d3b2d8e1e7',
              displayName: 'David',
              email: 'david@playtomic.io',
              pictureURL: null,
            },
          ],
        },
      ],
    },
  },
  {
    type: 'match',
    data: {
      matchId: '005',
      courtId: '83d36c46-4c6c-472b-857b-b57a81d58b86',
      venueId: '3958d8db-4e3e-430c-ba6e-1320bc8728c5',
      sport: 'PADEL',
      startDate: '2024-01-07T17:00Z',
      endDate: '2024-01-07T18:30Z',
      teams: [
        {
          id: '1',
          players: [
            {
              userId: 'c0ed36c0-6c59-48d4-a168-b6076cec52a0',
              displayName: 'Alice',
              email: 'alice@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=c0ed36c0-6c59-48d4-a168-b6076cec52a0',
            },
            {
              userId: '237443be-0b18-446a-9cbd-691627b84ef0',
              displayName: 'Bob',
              email: 'bob@playtomic.io',
              pictureURL: null,
            },
          ],
        },
        {
          id: '2',
          players: [
            {
              userId: 'df1d0005-ec56-4292-b223-2713e84c9325',
              displayName: 'Charlie',
              email: 'alice@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=df1d0005-ec56-4292-b223-2713e84c9325',
            },
            {
              userId: '98134a8b-32b7-4e89-89a3-57d3b2d8e1e7',
              displayName: 'David',
              email: 'david@playtomic.io',
              pictureURL: null,
            },
          ],
        },
      ],
    },
  },
  {
    type: 'match',
    data: {
      matchId: '006',
      courtId: '7a7ff0e4-076f-405b-b1f7-8d41a9b3f6a0',
      venueId: '85b1d53d-1d8b-47c8-b2cd-06a32c6cf905',
      sport: 'TENNIS',
      startDate: '2024-01-08T09:00Z',
      endDate: '2024-01-08T11:00Z',
      teams: [
        {
          id: '1',
          players: [
            {
              userId: 'c0ed36c0-6c59-48d4-a168-b6076cec52a0',
              displayName: 'Alice',
              email: 'alice@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=c0ed36c0-6c59-48d4-a168-b6076cec52a0',
            },
            {
              userId: '237443be-0b18-446a-9cbd-691627b84ef0',
              displayName: 'Bob',
              email: 'bob@playtomic.io',
              pictureURL: null,
            },
          ],
        },
        {
          id: '2',
          players: [
            {
              userId: 'df1d0005-ec56-4292-b223-2713e84c9325',
              displayName: 'Charlie',
              email: 'alice@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=df1d0005-ec56-4292-b223-2713e84c9325',
            },
            {
              userId: '98134a8b-32b7-4e89-89a3-57d3b2d8e1e7',
              displayName: 'David',
              email: 'david@playtomic.io',
              pictureURL: null,
            },
          ],
        },
      ],
    },
  },
  {
    type: 'match',
    data: {
      matchId: '007',
      courtId: 'b1164649-2437-439d-a761-3b24c34c2b2d',
      venueId: 'f79ae5d5-420f-49f0-bcd6-2406f0a2f5d4',
      sport: 'PADEL',
      startDate: '2024-01-09T14:00Z',
      endDate: '2024-01-09T16:00Z',
      teams: [
        {
          id: '1',
          players: [
            {
              userId: '6f39d7d8-1a7c-4ed7-bf9d-82b0ed2d35c4',
              displayName: 'Eva',
              email: 'eva@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=6f39d7d8-1a7c-4ed7-bf9d-82b0ed2d35c4',
            },
            {
              userId: '7b15e727-7c11-40e8-9c77-8a3f10d058c2',
              displayName: 'Frank',
              email: 'frank@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=7b15e727-7c11-40e8-9c77-8a3f10d058c2',
            },
          ],
        },
        {
          id: '2',
          players: [
            {
              userId: '98134a8b-32b7-4e89-89a3-57d3b2d8e1e7',
              displayName: 'David',
              email: 'david@playtomic.io',
              pictureURL: null,
            },
            {
              userId: 'df1d0005-ec56-4292-b223-2713e84c9325',
              displayName: 'Charlie',
              email: 'alice@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=df1d0005-ec56-4292-b223-2713e84c9325',
            },
          ],
        },
      ],
    },
  },
  {
    type: 'match',
    data: {
      matchId: '008',
      courtId: '29b78f8e-cd8e-4c3b-98c0-5fd35000f512',
      venueId: '1f7f0362-9279-4982-8a7b-fa1b97a96f99',
      sport: 'TENNIS',
      startDate: '2024-01-10T19:00Z',
      endDate: '2024-01-10T21:00Z',
      teams: [
        {
          id: '1',
          players: [
            {
              userId: '7b15e727-7c11-40e8-9c77-8a3f10d058c2',
              displayName: 'Frank',
              email: 'frank@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=7b15e727-7c11-40e8-9c77-8a3f10d058c2',
            },
            {
              userId: '6f39d7d8-1a7c-4ed7-bf9d-82b0ed2d35c4',
              displayName: 'Eva',
              email: 'eva@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=6f39d7d8-1a7c-4ed7-bf9d-82b0ed2d35c4',
            },
          ],
        },
        {
          id: '2',
          players: [
            {
              userId: 'df1d0005-ec56-4292-b223-2713e84c9325',
              displayName: 'Charlie',
              email: 'alice@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=df1d0005-ec56-4292-b223-2713e84c9325',
            },
            {
              userId: '98134a8b-32b7-4e89-89a3-57d3b2d8e1e7',
              displayName: 'David',
              email: 'david@playtomic.io',
              pictureURL: null,
            },
          ],
        },
      ],
    },
  },
  {
    type: 'match',
    data: {
      matchId: '009',
      courtId: '83d36c46-4c6c-472b-857b-b57a81d58b86',
      venueId: '3958d8db-4e3e-430c-ba6e-1320bc8728c5',
      sport: 'PADEL',
      startDate: '2024-01-11T17:00Z',
      endDate: '2024-01-11T18:30Z',
      teams: [
        {
          id: '1',
          players: [
            {
              userId: 'c0ed36c0-6c59-48d4-a168-b6076cec52a0',
              displayName: 'Alice',
              email: 'alice@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=c0ed36c0-6c59-48d4-a168-b6076cec52a0',
            },
            {
              userId: '237443be-0b18-446a-9cbd-691627b84ef0',
              displayName: 'Bob',
              email: 'bob@playtomic.io',
              pictureURL: null,
            },
          ],
        },
        {
          id: '2',
          players: [
            {
              userId: 'df1d0005-ec56-4292-b223-2713e84c9325',
              displayName: 'Charlie',
              email: 'alice@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=df1d0005-ec56-4292-b223-2713e84c9325',
            },
            {
              userId: '98134a8b-32b7-4e89-89a3-57d3b2d8e1e7',
              displayName: 'David',
              email: 'david@playtomic.io',
              pictureURL: null,
            },
          ],
        },
      ],
    },
  },
  {
    type: 'match',
    data: {
      matchId: '010',
      courtId: '7a7ff0e4-076f-405b-b1f7-8d41a9b3f6a0',
      venueId: '85b1d53d-1d8b-47c8-b2cd-06a32c6cf905',
      sport: 'TENNIS',
      startDate: '2024-01-12T09:00Z',
      endDate: '2024-01-12T11:00Z',
      teams: [
        {
          id: '1',
          players: [
            {
              userId: 'c0ed36c0-6c59-48d4-a168-b6076cec52a0',
              displayName: 'Alice',
              email: 'alice@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=c0ed36c0-6c59-48d4-a168-b6076cec52a0',
            },
            {
              userId: '237443be-0b18-446a-9cbd-691627b84ef0',
              displayName: 'Bob',
              email: 'bob@playtomic.io',
              pictureURL: null,
            },
          ],
        },
        {
          id: '2',
          players: [
            {
              userId: 'df1d0005-ec56-4292-b223-2713e84c9325',
              displayName: 'Charlie',
              email: 'alice@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=df1d0005-ec56-4292-b223-2713e84c9325',
            },
            {
              userId: '98134a8b-32b7-4e89-89a3-57d3b2d8e1e7',
              displayName: 'David',
              email: 'david@playtomic.io',
              pictureURL: null,
            },
          ],
        },
      ],
    },
  },
  {
    type: 'match',
    data: {
      matchId: '011',
      courtId: 'b1164649-2437-439d-a761-3b24c34c2b2d',
      venueId: 'f79ae5d5-420f-49f0-bcd6-2406f0a2f5d4',
      sport: 'PADEL',
      startDate: '2024-01-13T14:00Z',
      endDate: '2024-01-13T16:00Z',
      teams: [
        {
          id: '1',
          players: [
            {
              userId: '6f39d7d8-1a7c-4ed7-bf9d-82b0ed2d35c4',
              displayName: 'Eva',
              email: 'eva@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=6f39d7d8-1a7c-4ed7-bf9d-82b0ed2d35c4',
            },
            {
              userId: '7b15e727-7c11-40e8-9c77-8a3f10d058c2',
              displayName: 'Frank',
              email: 'frank@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=7b15e727-7c11-40e8-9c77-8a3f10d058c2',
            },
          ],
        },
        {
          id: '2',
          players: [
            {
              userId: '98134a8b-32b7-4e89-89a3-57d3b2d8e1e7',
              displayName: 'David',
              email: 'david@playtomic.io',
              pictureURL: null,
            },
            {
              userId: 'df1d0005-ec56-4292-b223-2713e84c9325',
              displayName: 'Charlie',
              email: 'alice@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=df1d0005-ec56-4292-b223-2713e84c9325',
            },
          ],
        },
      ],
    },
  },
  {
    type: 'match',
    data: {
      matchId: '012',
      courtId: '29b78f8e-cd8e-4c3b-98c0-5fd35000f512',
      venueId: '1f7f0362-9279-4982-8a7b-fa1b97a96f99',
      sport: 'TENNIS',
      startDate: '2024-01-14T19:00Z',
      endDate: '2024-01-14T21:00Z',
      teams: [
        {
          id: '1',
          players: [
            {
              userId: '7b15e727-7c11-40e8-9c77-8a3f10d058c2',
              displayName: 'Frank',
              email: 'frank@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=7b15e727-7c11-40e8-9c77-8a3f10d058c2',
            },
            {
              userId: '6f39d7d8-1a7c-4ed7-bf9d-82b0ed2d35c4',
              displayName: 'Eva',
              email: 'eva@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=6f39d7d8-1a7c-4ed7-bf9d-82b0ed2d35c4',
            },
          ],
        },
        {
          id: '2',
          players: [
            {
              userId: 'df1d0005-ec56-4292-b223-2713e84c9325',
              displayName: 'Charlie',
              email: 'alice@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=df1d0005-ec56-4292-b223-2713e84c9325',
            },
            {
              userId: '98134a8b-32b7-4e89-89a3-57d3b2d8e1e7',
              displayName: 'David',
              email: 'david@playtomic.io',
              pictureURL: null,
            },
          ],
        },
      ],
    },
  },
  {
    type: 'match',
    data: {
      matchId: '013',
      courtId: '83d36c46-4c6c-472b-857b-b57a81d58b86',
      venueId: '3958d8db-4e3e-430c-ba6e-1320bc8728c5',
      sport: 'PADEL',
      startDate: '2024-01-15T17:00Z',
      endDate: '2024-01-15T18:30Z',
      teams: [
        {
          id: '1',
          players: [
            {
              userId: 'c0ed36c0-6c59-48d4-a168-b6076cec52a0',
              displayName: 'Alice',
              email: 'alice@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=c0ed36c0-6c59-48d4-a168-b6076cec52a0',
            },
            {
              userId: '237443be-0b18-446a-9cbd-691627b84ef0',
              displayName: 'Bob',
              email: 'bob@playtomic.io',
              pictureURL: null,
            },
          ],
        },
        {
          id: '2',
          players: [
            {
              userId: 'df1d0005-ec56-4292-b223-2713e84c9325',
              displayName: 'Charlie',
              email: 'alice@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=df1d0005-ec56-4292-b223-2713e84c9325',
            },
            {
              userId: '98134a8b-32b7-4e89-89a3-57d3b2d8e1e7',
              displayName: 'David',
              email: 'david@playtomic.io',
              pictureURL: null,
            },
          ],
        },
      ],
    },
  },
  {
    type: 'match',
    data: {
      matchId: '014',
      courtId: '7a7ff0e4-076f-405b-b1f7-8d41a9b3f6a0',
      venueId: '85b1d53d-1d8b-47c8-b2cd-06a32c6cf905',
      sport: 'TENNIS',
      startDate: '2024-01-16T09:00Z',
      endDate: '2024-01-16T11:00Z',
      teams: [
        {
          id: '1',
          players: [
            {
              userId: 'c0ed36c0-6c59-48d4-a168-b6076cec52a0',
              displayName: 'Alice',
              email: 'alice@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=c0ed36c0-6c59-48d4-a168-b6076cec52a0',
            },
            {
              userId: '237443be-0b18-446a-9cbd-691627b84ef0',
              displayName: 'Bob',
              email: 'bob@playtomic.io',
              pictureURL: null,
            },
          ],
        },
        {
          id: '2',
          players: [
            {
              userId: 'df1d0005-ec56-4292-b223-2713e84c9325',
              displayName: 'Charlie',
              email: 'alice@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=df1d0005-ec56-4292-b223-2713e84c9325',
            },
            {
              userId: '98134a8b-32b7-4e89-89a3-57d3b2d8e1e7',
              displayName: 'David',
              email: 'david@playtomic.io',
              pictureURL: null,
            },
          ],
        },
      ],
    },
  },
  {
    type: 'match',
    data: {
      matchId: '015',
      courtId: 'b1164649-2437-439d-a761-3b24c34c2b2d',
      venueId: 'f79ae5d5-420f-49f0-bcd6-2406f0a2f5d4',
      sport: 'PADEL',
      startDate: '2024-01-17T14:00Z',
      endDate: '2024-01-17T16:00Z',
      teams: [
        {
          id: '1',
          players: [
            {
              userId: '6f39d7d8-1a7c-4ed7-bf9d-82b0ed2d35c4',
              displayName: 'Eva',
              email: 'eva@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=6f39d7d8-1a7c-4ed7-bf9d-82b0ed2d35c4',
            },
            {
              userId: '7b15e727-7c11-40e8-9c77-8a3f10d058c2',
              displayName: 'Frank',
              email: 'frank@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=7b15e727-7c11-40e8-9c77-8a3f10d058c2',
            },
          ],
        },
        {
          id: '2',
          players: [
            {
              userId: '98134a8b-32b7-4e89-89a3-57d3b2d8e1e7',
              displayName: 'David',
              email: 'david@playtomic.io',
              pictureURL: null,
            },
            {
              userId: 'df1d0005-ec56-4292-b223-2713e84c9325',
              displayName: 'Charlie',
              email: 'alice@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=df1d0005-ec56-4292-b223-2713e84c9325',
            },
          ],
        },
      ],
    },
  },
  {
    type: 'match',
    data: {
      matchId: '016',
      courtId: '29b78f8e-cd8e-4c3b-98c0-5fd35000f512',
      venueId: '1f7f0362-9279-4982-8a7b-fa1b97a96f99',
      sport: 'PADEL',
      startDate: '2024-01-18T19:00Z',
      endDate: '2024-01-18T21:00Z',
      teams: [
        {
          id: '1',
          players: [
            {
              userId: '7b15e727-7c11-40e8-9c77-8a3f10d058c2',
              displayName: 'Frank',
              email: 'frank@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=7b15e727-7c11-40e8-9c77-8a3f10d058c2',
            },
            {
              userId: '6f39d7d8-1a7c-4ed7-bf9d-82b0ed2d35c4',
              displayName: 'Eva',
              email: 'eva@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=6f39d7d8-1a7c-4ed7-bf9d-82b0ed2d35c4',
            },
          ],
        },
        {
          id: '2',
          players: [
            {
              userId: 'df1d0005-ec56-4292-b223-2713e84c9325',
              displayName: 'Charlie',
              email: 'alice@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=df1d0005-ec56-4292-b223-2713e84c9325',
            },
            {
              userId: '98134a8b-32b7-4e89-89a3-57d3b2d8e1e7',
              displayName: 'David',
              email: 'david@playtomic.io',
              pictureURL: null,
            },
          ],
        },
      ],
    },
  },
  {
    type: 'match',
    data: {
      matchId: '017',
      courtId: '83d36c46-4c6c-472b-857b-b57a81d58b86',
      venueId: '3958d8db-4e3e-430c-ba6e-1320bc8728c5',
      sport: 'PADEL',
      startDate: '2024-01-19T17:00Z',
      endDate: '2024-01-19T18:30Z',
      teams: [
        {
          id: '1',
          players: [
            {
              userId: 'c0ed36c0-6c59-48d4-a168-b6076cec52a0',
              displayName: 'Alice',
              email: 'alice@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=c0ed36c0-6c59-48d4-a168-b6076cec52a0',
            },
            {
              userId: '237443be-0b18-446a-9cbd-691627b84ef0',
              displayName: 'Bob',
              email: 'bob@playtomic.io',
              pictureURL: null,
            },
          ],
        },
        {
          id: '2',
          players: [
            {
              userId: 'df1d0005-ec56-4292-b223-2713e84c9325',
              displayName: 'Charlie',
              email: 'alice@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=df1d0005-ec56-4292-b223-2713e84c9325',
            },
            {
              userId: '98134a8b-32b7-4e89-89a3-57d3b2d8e1e7',
              displayName: 'David',
              email: 'david@playtomic.io',
              pictureURL: null,
            },
          ],
        },
      ],
    },
  },
  {
    type: 'match',
    data: {
      matchId: '018',
      courtId: '7a7ff0e4-076f-405b-b1f7-8d41a9b3f6a0',
      venueId: '85b1d53d-1d8b-47c8-b2cd-06a32c6cf905',
      sport: 'TENNIS',
      startDate: '2024-01-20T09:00Z',
      endDate: '2024-01-20T11:00Z',
      teams: [
        {
          id: '1',
          players: [
            {
              userId: 'c0ed36c0-6c59-48d4-a168-b6076cec52a0',
              displayName: 'Alice',
              email: 'alice@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=c0ed36c0-6c59-48d4-a168-b6076cec52a0',
            },
            {
              userId: '237443be-0b18-446a-9cbd-691627b84ef0',
              displayName: 'Bob',
              email: 'bob@playtomic.io',
              pictureURL: null,
            },
          ],
        },
        {
          id: '2',
          players: [
            {
              userId: 'df1d0005-ec56-4292-b223-2713e84c9325',
              displayName: 'Charlie',
              email: 'alice@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=df1d0005-ec56-4292-b223-2713e84c9325',
            },
            {
              userId: '98134a8b-32b7-4e89-89a3-57d3b2d8e1e7',
              displayName: 'David',
              email: 'david@playtomic.io',
              pictureURL: null,
            },
          ],
        },
      ],
    },
  },
  {
    type: 'match',
    data: {
      matchId: '019',
      courtId: 'b1164649-2437-439d-a761-3b24c34c2b2d',
      venueId: 'f79ae5d5-420f-49f0-bcd6-2406f0a2f5d4',
      sport: 'PADEL',
      startDate: '2024-01-21T14:00Z',
      endDate: '2024-01-21T16:00Z',
      teams: [
        {
          id: '1',
          players: [
            {
              userId: '6f39d7d8-1a7c-4ed7-bf9d-82b0ed2d35c4',
              displayName: 'Eva',
              email: 'eva@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=6f39d7d8-1a7c-4ed7-bf9d-82b0ed2d35c4',
            },
            {
              userId: '7b15e727-7c11-40e8-9c77-8a3f10d058c2',
              displayName: 'Frank',
              email: 'frank@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=7b15e727-7c11-40e8-9c77-8a3f10d058c2',
            },
          ],
        },
        {
          id: '2',
          players: [
            {
              userId: '98134a8b-32b7-4e89-89a3-57d3b2d8e1e7',
              displayName: 'David',
              email: 'david@playtomic.io',
              pictureURL: null,
            },
            {
              userId: 'df1d0005-ec56-4292-b223-2713e84c9325',
              displayName: 'Charlie',
              email: 'alice@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=df1d0005-ec56-4292-b223-2713e84c9325',
            },
          ],
        },
      ],
    },
  },
  {
    type: 'match',
    data: {
      matchId: '020',
      courtId: '29b78f8e-cd8e-4c3b-98c0-5fd35000f512',
      venueId: '1f7f0362-9279-4982-8a7b-fa1b97a96f99',
      sport: 'PADEL',
      startDate: '2024-01-22T19:00Z',
      endDate: '2024-01-22T21:00Z',
      teams: [
        {
          id: '1',
          players: [
            {
              userId: '7b15e727-7c11-40e8-9c77-8a3f10d058c2',
              displayName: 'Frank',
              email: 'frank@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=7b15e727-7c11-40e8-9c77-8a3f10d058c2',
            },
            {
              userId: '6f39d7d8-1a7c-4ed7-bf9d-82b0ed2d35c4',
              displayName: 'Eva',
              email: 'eva@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=6f39d7d8-1a7c-4ed7-bf9d-82b0ed2d35c4',
            },
          ],
        },
        {
          id: '2',
          players: [
            {
              userId: 'df1d0005-ec56-4292-b223-2713e84c9325',
              displayName: 'Charlie',
              email: 'alice@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=df1d0005-ec56-4292-b223-2713e84c9325',
            },
            {
              userId: '98134a8b-32b7-4e89-89a3-57d3b2d8e1e7',
              displayName: 'David',
              email: 'david@playtomic.io',
              pictureURL: null,
            },
          ],
        },
      ],
    },
  },
  {
    type: 'match',
    data: {
      matchId: '021',
      courtId: '83d36c46-4c6c-472b-857b-b57a81d58b86',
      venueId: '3958d8db-4e3e-430c-ba6e-1320bc8728c5',
      sport: 'PADEL',
      startDate: '2024-01-23T17:00Z',
      endDate: '2024-01-23T18:30Z',
      teams: [
        {
          id: '1',
          players: [
            {
              userId: 'c0ed36c0-6c59-48d4-a168-b6076cec52a0',
              displayName: 'Alice',
              email: 'alice@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=c0ed36c0-6c59-48d4-a168-b6076cec52a0',
            },
            {
              userId: '237443be-0b18-446a-9cbd-691627b84ef0',
              displayName: 'Bob',
              email: 'bob@playtomic.io',
              pictureURL: null,
            },
          ],
        },
        {
          id: '2',
          players: [
            {
              userId: 'df1d0005-ec56-4292-b223-2713e84c9325',
              displayName: 'Charlie',
              email: 'alice@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=df1d0005-ec56-4292-b223-2713e84c9325',
            },
            {
              userId: '98134a8b-32b7-4e89-89a3-57d3b2d8e1e7',
              displayName: 'David',
              email: 'david@playtomic.io',
              pictureURL: null,
            },
          ],
        },
      ],
    },
  },
  {
    type: 'match',
    data: {
      matchId: '022',
      courtId: '7a7ff0e4-076f-405b-b1f7-8d41a9b3f6a0',
      venueId: '85b1d53d-1d8b-47c8-b2cd-06a32c6cf905',
      sport: 'TENNIS',
      startDate: '2024-01-24T09:00Z',
      endDate: '2024-01-24T11:00Z',
      teams: [
        {
          id: '1',
          players: [
            {
              userId: 'c0ed36c0-6c59-48d4-a168-b6076cec52a0',
              displayName: 'Alice',
              email: 'alice@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=c0ed36c0-6c59-48d4-a168-b6076cec52a0',
            },
            {
              userId: '237443be-0b18-446a-9cbd-691627b84ef0',
              displayName: 'Bob',
              email: 'bob@playtomic.io',
              pictureURL: null,
            },
          ],
        },
        {
          id: '2',
          players: [
            {
              userId: 'df1d0005-ec56-4292-b223-2713e84c9325',
              displayName: 'Charlie',
              email: 'alice@playtomic.io',
              pictureURL: 'https://i.pravatar.cc/150?img=df1d0005-ec56-4292-b223-2713e84c9325',
            },
            {
              userId: '98134a8b-32b7-4e89-89a3-57d3b2d8e1e7',
              displayName: 'David',
              email: 'david@playtomic.io',
              pictureURL: null,
            },
          ],
        },
      ],
    },
  },
]

/**
 * Finds a single mock data with the specified `type` that meets the provided filter function
 */
export function findOne<T extends MockData['type']>(
  type: T,
  filterFunction: (entry: Extract<MockData, { type: T }>['data']) => boolean,
): Extract<MockData, { type: T }>['data'] | null
export function findOne(
  type: string,
  filterFunction: (entry: MockData['data']) => boolean,
): MockData['data'] | null {
  const mock = data.find(mock => mock.type === type && filterFunction(mock.data))

  return mock?.data ?? null
}

/**
 * Finds a all the mock data with the specified `type` that meets the provided filter function
 */
export function findMany<T extends MockData['type']>(
  type: T,
  filterFunction: (entry: Extract<MockData, { type: T }>['data']) => boolean,
): Extract<MockData, { type: T }>['data'][]
export function findMany(
  type: string,
  filterFunction: (entry: MockData['data']) => boolean,
): MockData['data'][] {
  const mocks = data.filter(mock => mock.type === type && filterFunction(mock.data))

  return mocks.map(mock => mock.data)
}
