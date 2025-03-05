/*
 * This file contains type definitions for entities returned by our API.
 */

/**
 * A human that decided to sign-up with us so they can play racket sports
 * and keep track of their personal progress in the sport!
 */
export interface User {
  /**
   * [Unique identifier](https://en.wikipedia.org/wiki/Universally_unique_identifier) for the user.
   */
  userId: string

  /**
   * Visible name for the user; usually chosen by the user itself.
   */
  displayName: string

  /**
   * Email of the user. It might be null if the user decided not to share it.
   */
  email: string | null

  /**
   * Full URL for the display picture of the user.
   */
  pictureURL: string | null
}

/**
 * A set of users playing at a specific place and time.
 */
export interface Match {
  /**
   * [Unique identifier](https://en.wikipedia.org/wiki/Universally_unique_identifier) for the match.
   */
  matchId: string

  /**
   * [Unique identifier](https://en.wikipedia.org/wiki/Universally_unique_identifier) of the club where the match is being played.
   */
  venueId: string

  /**
   * [Unique identifier](https://en.wikipedia.org/wiki/Universally_unique_identifier) of the court where the match is being played.
   */
  courtId: string

  /**
   * The sport the users will play. Usually directly relates to the court; but two different sports might be played in the same
   * court!
   */
  sport: 'PADEL' | 'TENNIS'

  /**
   * [ISO DateTime](https://en.wikipedia.org/wiki/ISO_8601) string of the instant the match begins.
   */
  startDate: string

  /**
   * [ISO DateTime](https://en.wikipedia.org/wiki/ISO_8601) string of the instant the match finishes.
   */
  endDate: string
  
  /**
   * Teams playing the match. You can usually expect it to be 2 entries.
   */
  teams: {
    /**
     * Simple id for the team in this particular match.
     */
    id: string

    /**
     * Members of this team.
     */
    players: User[]
  }[]
}
