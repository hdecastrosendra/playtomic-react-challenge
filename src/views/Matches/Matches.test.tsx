import { render, screen, within } from '@testing-library/react'
import { server } from '@/lib/msw/node'
import { Matches } from './Matches'
import { ReactNode } from 'react'
import { ApiConfigProvider } from '@/lib/api'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

beforeAll(() => {
  server.listen()
})
afterEach(() => {
  server.resetHandlers()
})
afterAll(() => {
  server.close()
})

const Wrapper = (props: { children: ReactNode }) => (
  <ApiConfigProvider
    baseURL="/api"
    defaultHeaders={
      new Headers({
        authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDkyOTA0NzIsImV4cCI6NDg2Mjg5MDQ3MiwianRpIjoiYzFjMGVjNTMtMzc1Ny00Y2FjLTk5YTMtZjk3NDAwMTA5ZTFkIiwic3ViIjoiYzBlZDM2YzAtNmM1OS00OGQ0LWExNjgtYjYwNzZjZWM1MmEwIiwidHlwZSI6ImFjY2VzcyJ9.InRoaXMtaXMtbm90LWEtcmVhbC1zaWduYXR1cmUi',
      })
    }
  >
    {props.children}
  </ApiConfigProvider>
)

test('renders a table with some known values', async () => {
  render(<Matches />, { wrapper: Wrapper })

  const table = await screen.findByRole('table', { name: 'Matches' })
  const rows = within(table).getAllByRole('row')

  expect(rows).toHaveLength(1 + 10) // header + 10 rows

  const headerRow = rows[0]
  const headers = within(headerRow).getAllByRole('columnheader')

  expect(headers).toHaveLength(5)
  expect(headers.map(header => header.innerHTML)).toEqual([
    'Sport',
    'Date',
    'Start',
    'End',
    'Players',
  ])
})

test('renders a logout button and propagates its click via props', async () => {
  const onLogoutRequest = vi.fn()
  render(<Matches onLogoutRequest={onLogoutRequest} />, { wrapper: Wrapper })

  const logoutButton = screen.getByRole('button', { name: 'Logout' })
  await userEvent.click(logoutButton)

  expect(onLogoutRequest).toHaveBeenCalledOnce()
})

test('renders a download button', async () => {
  render(<Matches />, { wrapper: Wrapper })

  const downloadButton = await screen.findByRole('button', {
    name: 'Download All Matches',
  })
  expect(downloadButton).toBeInTheDocument()
})

test('convertMatchesToCSV formats matches correctly', () => {
  interface Player {
    userId: string
    displayName: string
    email: string | null
    pictureURL: string | null
  }

  interface Team {
    id: string
    players: Player[]
  }

  interface Match {
    matchId: string
    venueId: string
    courtId: string
    sport: string
    startDate: string
    endDate: string
    teams: Team[]
  }

  const convertMatchesToCSV = (matches: Match[]): string => {
    const headers = [
      'Match ID',
      'Venue ID',
      'Court ID',
      'Sport',
      'Start Date',
      'End Date',
      'Team 1 Players',
      'Team 2 Players',
    ].join(',')

    const rows = matches.map(match => {
      const team1Players = match.teams[0]?.players.map(p => p.displayName).join('; ') || ''
      const team2Players = match.teams[1]?.players.map(p => p.displayName).join('; ') || ''

      return [
        match.matchId,
        match.venueId,
        match.courtId,
        match.sport,
        match.startDate,
        match.endDate,
        `"${team1Players}"`,
        `"${team2Players}"`,
      ].join(',')
    })

    return [headers, ...rows].join('\n')
  }

  const mockMatch: Match = {
    matchId: 'match-1',
    venueId: 'venue-1',
    courtId: 'court-1',
    sport: 'PADEL',
    startDate: '2023-01-01T10:00Z',
    endDate: '2023-01-01T11:00Z',
    teams: [
      {
        id: 'team-1',
        players: [
          {
            userId: 'user-1',
            displayName: 'Player 1',
            email: null,
            pictureURL: null,
          },
        ],
      },
      {
        id: 'team-2',
        players: [
          {
            userId: 'user-2',
            displayName: 'Player 2',
            email: null,
            pictureURL: null,
          },
        ],
      },
    ],
  }

  const csvResult = convertMatchesToCSV([mockMatch])

  expect(csvResult).toContain(
    'Match ID,Venue ID,Court ID,Sport,Start Date,End Date,Team 1 Players,Team 2 Players'
  )
  expect(csvResult).toContain(
    'match-1,venue-1,court-1,PADEL,2023-01-01T10:00Z,2023-01-01T11:00Z,"Player 1","Player 2"'
  )
})
